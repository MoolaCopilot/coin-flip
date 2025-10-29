import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;

interface GameEventRequest {
  email: string;
  eventName: 'CoinFlip Finished' | 'CoinFlip CapReached' | 'CoinFlip Busted';
  properties: {
    final_balance: number;
    total_flips: number;
    win_rate: number;
    consistency_score: number;
    largest_bet: number;
    game_duration_seconds: number;
    final_result: 'won' | 'lost' | 'timeout';
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!KLAVIYO_API_KEY) {
      return NextResponse.json(
        { error: 'Klaviyo configuration missing' },
        { status: 500 }
      );
    }

    const body: GameEventRequest = await request.json();
    const { email, eventName, properties } = body;

    if (!email || !eventName || !properties) {
      return NextResponse.json(
        { error: 'Email, eventName, and properties are required' },
        { status: 400 }
      );
    }

    // Track game completion event
    const eventData = {
      data: {
        type: 'event',
        attributes: {
          properties: {
            ...properties,
            source: 'coin_flip_challenge',
          },
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: eventName
              }
            }
          },
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: email
              }
            }
          }
        }
      }
    };

    const response = await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15'
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Klaviyo event tracking failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Event ${eventName} tracked successfully` 
    });

  } catch (error) {
    console.error('Klaviyo event tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track game event' },
      { status: 500 }
    );
  }
}
