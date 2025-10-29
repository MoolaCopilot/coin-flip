import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/api/game';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') as 'weekly' | 'all_time') || 'weekly';
    const limit = parseInt(searchParams.get('limit') || '10');

    const { data, error } = await getLeaderboard(type, limit);

    if (error) {
      return NextResponse.json(
        { error: error },
        { status: 500 }
      );
    }

    // Format data for display (hide last names)
    const formattedData = data.map((entry: any, index: number) => ({
      rank: index + 1,
      name: formatPlayerName(entry.name),
      finalBalance: entry.final_balance,
      totalFlips: entry.total_flips,
      consistencyScore: Math.round(entry.consistency_score),
      gameCompletedAt: entry.game_ended_at,
    }));

    return NextResponse.json({
      success: true,
      leaderboard: formattedData,
      type,
      count: formattedData.length,
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

/**
 * Format player name to "First Name + Initial"
 */
function formatPlayerName(fullName: string): string {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return parts[0];
  }
  
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  
  return `${firstName} ${lastInitial}.`;
}
