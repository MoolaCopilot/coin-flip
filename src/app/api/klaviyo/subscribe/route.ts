import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

interface SubscribeRequest {
  email: string;
  firstName: string;
  phone?: string;
  smsOptIn?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
      return NextResponse.json(
        { error: 'Klaviyo configuration missing' },
        { status: 500 }
      );
    }

    const body: SubscribeRequest = await request.json();
    const { email, firstName, phone, smsOptIn } = body;

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and firstName are required' },
        { status: 400 }
      );
    }

    // Create or update profile in Klaviyo
    const profileData = {
      data: {
        type: 'profile',
        attributes: {
          email: email,
          first_name: firstName,
          ...(phone && { phone_number: phone }),
          properties: {
            source: 'coin_flip_challenge',
            signup_date: new Date().toISOString(),
            sms_opt_in: smsOptIn || false,
          }
        }
      }
    };

    // Create/update profile
    const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15'
      },
      body: JSON.stringify(profileData)
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Klaviyo profile creation failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }

    const profile = await profileResponse.json();
    const profileId = profile.data.id;

    // Add profile to list
    const listSubscriptionData = {
      data: [
        {
          type: 'profile',
          id: profileId
        }
      ]
    };

    const subscriptionResponse = await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15'
      },
      body: JSON.stringify(listSubscriptionData)
    });

    if (!subscriptionResponse.ok) {
      const errorText = await subscriptionResponse.text();
      console.error('Klaviyo subscription failed:', errorText);
      // Don't fail here - profile was created successfully
    }

    // Track signup event
    const eventData = {
      data: {
        type: 'event',
        attributes: {
          properties: {
            source: 'coin_flip_challenge',
            signup_method: 'web_form',
            sms_opt_in: smsOptIn || false,
          },
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: 'CoinFlip Started'
              }
            }
          },
          profile: {
            data: {
              type: 'profile',
              id: profileId
            }
          }
        }
      }
    };

    await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15'
      },
      body: JSON.stringify(eventData)
    });

    return NextResponse.json({ 
      success: true, 
      profileId: profileId,
      message: 'Successfully subscribed to Klaviyo' 
    });

  } catch (error) {
    console.error('Klaviyo subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to email list' },
      { status: 500 }
    );
  }
}
