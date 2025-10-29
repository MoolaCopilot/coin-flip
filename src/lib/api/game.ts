import { supabase } from '@/lib/supabase/client';
import { GameState, GameFlip } from '@/types/game';

/**
 * Create a new game session
 */
export async function createGame(playerId: string): Promise<{ gameId: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('games')
      .insert({
        player_id: playerId,
        balance: 25.00,
        initial_balance: 25.00,
        target_balance: 150.00,
        time_remaining: 300000, // 5 minutes
        game_started_at: new Date().toISOString(),
        is_active: true,
        is_completed: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create game: ${error.message}`);
    }

    return { gameId: data.id };
  } catch (error) {
    console.error('Create game error:', error);
    return {
      gameId: '',
      error: error instanceof Error ? error.message : 'Failed to create game'
    };
  }
}

/**
 * Update game state
 */
export async function updateGame(gameId: string, updates: Partial<GameState>): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {};
    
    if (updates.balance !== undefined) updateData.balance = updates.balance;
    if (updates.timeRemaining !== undefined) updateData.time_remaining = updates.timeRemaining;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted;
    if (updates.totalFlips !== undefined) updateData.total_flips = updates.totalFlips;
    if (updates.winCount !== undefined) updateData.win_count = updates.winCount;
    if (updates.lossCount !== undefined) updateData.loss_count = updates.lossCount;
    if (updates.largestBet !== undefined) updateData.largest_bet = updates.largestBet;
    if (updates.finalResult !== undefined) updateData.final_result = updates.finalResult;
    if (updates.gameEndedAt !== undefined) updateData.game_ended_at = updates.gameEndedAt.toISOString();

    const { error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', gameId);

    if (error) {
      throw new Error(`Failed to update game: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Update game error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update game'
    };
  }
}

/**
 * Save a game flip
 */
export async function saveGameFlip(flip: GameFlip): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('game_flips')
      .insert({
        game_id: flip.gameId,
        flip_number: flip.flipNumber,
        bet_amount: flip.betAmount,
        bet_side: flip.betSide,
        result: flip.result,
        won: flip.won,
        balance_before: flip.balanceBefore,
        balance_after: flip.balanceAfter,
        timestamp: flip.timestamp.toISOString(),
      });

    if (error) {
      throw new Error(`Failed to save flip: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Save flip error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save flip'
    };
  }
}

/**
 * Get leaderboard data
 */
export async function getLeaderboard(type: 'weekly' | 'all_time' = 'weekly', limit: number = 10) {
  try {
    const viewName = type === 'weekly' ? 'weekly_leaderboard' : 'all_time_leaderboard';
    
    const { data, error } = await supabase
      .from(viewName)
      .select('*')
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Failed to get leaderboard'
    };
  }
}

/**
 * Get game history for a player
 */
export async function getPlayerGameHistory(playerId: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('player_id', playerId)
      .eq('is_completed', true)
      .order('game_ended_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get game history: ${error.message}`);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get game history error:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Failed to get game history'
    };
  }
}
