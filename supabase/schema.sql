-- Supabase Database Schema for Moola Coin Flip Challenge
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  sms_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_games INTEGER DEFAULT 0,
  best_score DECIMAL DEFAULT 0,
  average_score DECIMAL DEFAULT 0
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  balance DECIMAL NOT NULL DEFAULT 25.00,
  initial_balance DECIMAL NOT NULL DEFAULT 25.00,
  target_balance DECIMAL NOT NULL DEFAULT 150.00,
  time_remaining INTEGER NOT NULL DEFAULT 300000, -- 5 minutes in milliseconds
  game_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  game_ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  total_flips INTEGER DEFAULT 0,
  win_count INTEGER DEFAULT 0,
  loss_count INTEGER DEFAULT 0,
  largest_bet DECIMAL DEFAULT 0,
  final_result TEXT CHECK (final_result IN ('won', 'lost', 'timeout')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game flips table
CREATE TABLE IF NOT EXISTS game_flips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  flip_number INTEGER NOT NULL,
  bet_amount DECIMAL NOT NULL,
  bet_side TEXT NOT NULL CHECK (bet_side IN ('heads', 'tails')),
  result TEXT NOT NULL CHECK (result IN ('heads', 'tails')),
  won BOOLEAN NOT NULL,
  balance_before DECIMAL NOT NULL,
  balance_after DECIMAL NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_games_player_id ON games(player_id);
CREATE INDEX IF NOT EXISTS idx_games_completed ON games(is_completed, final_result);
CREATE INDEX IF NOT EXISTS idx_games_leaderboard ON games(is_completed, balance DESC, total_flips ASC, game_ended_at ASC);
CREATE INDEX IF NOT EXISTS idx_game_flips_game_id ON game_flips(game_id);
CREATE INDEX IF NOT EXISTS idx_game_flips_timestamp ON game_flips(timestamp);

-- Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_flips ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all operations for now - can be tightened later)
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
CREATE POLICY "Allow all operations on game_flips" ON game_flips FOR ALL USING (true);

-- Function to update player stats after game completion
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update when game is completed
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    UPDATE players 
    SET 
      total_games = total_games + 1,
      best_score = GREATEST(best_score, NEW.balance),
      average_score = (
        SELECT AVG(balance) 
        FROM games 
        WHERE player_id = NEW.player_id AND is_completed = true
      )
    WHERE id = NEW.player_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update player stats
CREATE TRIGGER update_player_stats_trigger
  AFTER UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_player_stats();

-- View for leaderboard (weekly)
CREATE OR REPLACE VIEW weekly_leaderboard AS
SELECT 
  p.name,
  g.balance as final_balance,
  g.total_flips,
  g.game_ended_at,
  -- Calculate consistency score
  (100 - LEAST(100, COALESCE(
    (SELECT STDDEV((gf.bet_amount / gf.balance_before) * 100) * 4
     FROM game_flips gf 
     WHERE gf.game_id = g.id), 0))) as consistency_score
FROM games g
JOIN players p ON g.player_id = p.id
WHERE g.is_completed = true 
  AND g.game_ended_at >= NOW() - INTERVAL '7 days'
ORDER BY g.balance DESC, g.total_flips ASC, g.game_ended_at ASC
LIMIT 50;

-- View for all-time leaderboard
CREATE OR REPLACE VIEW all_time_leaderboard AS
SELECT 
  p.name,
  g.balance as final_balance,
  g.total_flips,
  g.game_ended_at,
  -- Calculate consistency score
  (100 - LEAST(100, COALESCE(
    (SELECT STDDEV((gf.bet_amount / gf.balance_before) * 100) * 4
     FROM game_flips gf 
     WHERE gf.game_id = g.id), 0))) as consistency_score
FROM games g
JOIN players p ON g.player_id = p.id
WHERE g.is_completed = true
ORDER BY g.balance DESC, g.total_flips ASC, g.game_ended_at ASC
LIMIT 100;
