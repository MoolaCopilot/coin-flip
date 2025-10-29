import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We don't need auth sessions for this game
  },
});

export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          sms_opt_in: boolean;
          created_at: string;
          total_games: number;
          best_score: number;
          average_score: number;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          sms_opt_in?: boolean;
          created_at?: string;
          total_games?: number;
          best_score?: number;
          average_score?: number;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          sms_opt_in?: boolean;
          created_at?: string;
          total_games?: number;
          best_score?: number;
          average_score?: number;
        };
      };
      games: {
        Row: {
          id: string;
          player_id: string;
          balance: number;
          initial_balance: number;
          target_balance: number;
          time_remaining: number;
          game_started_at: string;
          game_ended_at: string | null;
          is_active: boolean;
          is_completed: boolean;
          total_flips: number;
          win_count: number;
          loss_count: number;
          largest_bet: number;
          final_result: 'won' | 'lost' | 'timeout' | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          balance?: number;
          initial_balance?: number;
          target_balance?: number;
          time_remaining?: number;
          game_started_at?: string;
          game_ended_at?: string | null;
          is_active?: boolean;
          is_completed?: boolean;
          total_flips?: number;
          win_count?: number;
          loss_count?: number;
          largest_bet?: number;
          final_result?: 'won' | 'lost' | 'timeout' | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          balance?: number;
          initial_balance?: number;
          target_balance?: number;
          time_remaining?: number;
          game_started_at?: string;
          game_ended_at?: string | null;
          is_active?: boolean;
          is_completed?: boolean;
          total_flips?: number;
          win_count?: number;
          loss_count?: number;
          largest_bet?: number;
          final_result?: 'won' | 'lost' | 'timeout' | null;
          created_at?: string;
        };
      };
      game_flips: {
        Row: {
          id: string;
          game_id: string;
          flip_number: number;
          bet_amount: number;
          bet_side: 'heads' | 'tails';
          result: 'heads' | 'tails';
          won: boolean;
          balance_before: number;
          balance_after: number;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          flip_number: number;
          bet_amount: number;
          bet_side: 'heads' | 'tails';
          result: 'heads' | 'tails';
          won: boolean;
          balance_before: number;
          balance_after: number;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          flip_number?: number;
          bet_amount?: number;
          bet_side?: 'heads' | 'tails';
          result?: 'heads' | 'tails';
          won?: boolean;
          balance_before?: number;
          balance_after?: number;
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
};
