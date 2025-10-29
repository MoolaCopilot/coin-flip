import { supabase } from '@/lib/supabase/client';
import { Player } from '@/types/game';

export interface CreatePlayerData {
  name: string;
  email: string;
  phone?: string;
  smsOptIn: boolean;
}

/**
 * Create a new player and sync to Klaviyo
 */
export async function createPlayer(data: CreatePlayerData): Promise<{ player: Player; error?: string }> {
  try {
    // First, check if email already exists
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('email', data.email)
      .single();

    if (existingPlayer) {
      // Return existing player
      return {
        player: {
          id: existingPlayer.id,
          name: existingPlayer.name,
          email: existingPlayer.email,
          phone: existingPlayer.phone,
          smsOptIn: existingPlayer.sms_opt_in,
          createdAt: new Date(existingPlayer.created_at),
          totalGames: existingPlayer.total_games,
          bestScore: existingPlayer.best_score,
          averageScore: existingPlayer.average_score,
        }
      };
    }

    // Create new player in Supabase
    const { data: newPlayer, error: supabaseError } = await supabase
      .from('players')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        sms_opt_in: data.smsOptIn,
      })
      .select()
      .single();

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    // Sync to Klaviyo
    try {
      const response = await fetch('/api/klaviyo/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          firstName: data.name,
          phone: data.phone,
          smsOptIn: data.smsOptIn,
        }),
      });

      if (!response.ok) {
        console.error('Klaviyo sync failed:', await response.text());
        // Don't fail the whole process if Klaviyo fails
      }
    } catch (klaviyoError) {
      console.error('Klaviyo sync error:', klaviyoError);
      // Continue anyway - player is created in Supabase
    }

    return {
      player: {
        id: newPlayer.id,
        name: newPlayer.name,
        email: newPlayer.email,
        phone: newPlayer.phone,
        smsOptIn: newPlayer.sms_opt_in,
        createdAt: new Date(newPlayer.created_at),
        totalGames: newPlayer.total_games,
        bestScore: newPlayer.best_score,
        averageScore: newPlayer.average_score,
      }
    };

  } catch (error) {
    console.error('Create player error:', error);
    return {
      player: {} as Player,
      error: error instanceof Error ? error.message : 'Failed to create player'
    };
  }
}

/**
 * Get player by email
 */
export async function getPlayerByEmail(email: string): Promise<Player | null> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      smsOptIn: data.sms_opt_in,
      createdAt: new Date(data.created_at),
      totalGames: data.total_games,
      bestScore: data.best_score,
      averageScore: data.average_score,
    };
  } catch (error) {
    console.error('Get player error:', error);
    return null;
  }
}
