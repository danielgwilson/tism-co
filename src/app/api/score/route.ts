import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// CRITICAL: ONLY USING VERCEL AI SDK AS REQUIRED
// Schema for AI to extract profile data AND generate scores
const FullAnalysisSchema = z.object({
  // Profile extraction
  profileData: z.object({
    handle: z.string(),
    bio: z.string(),
    displayName: z.string(),
    stats: z.object({
      tweets: z.string(),
      following: z.string(),
      followers: z.string()
    }),
    tweets: z.array(z.string()),
    profileFound: z.boolean(),
    isVerifiedRealData: z.boolean()
  }),
  // Score generation
  totalScore: z.number().min(0).max(800),
  categories: z.object({
    terminalTism: z.number().min(0).max(100),
    snowflakeMode: z.number().min(0).max(100),
    social404: z.number().min(0).max(100),
    meltdownFreq: z.number().min(0).max(100),
    stimLevel: z.number().min(0).max(100),
    executiveFunction: z.number().min(0).max(100),
    maskingGame: z.number().min(0).max(100),
    autismRadar: z.number().min(0).max(100)
  }),
  roast: z.string(),
  archetype: z.string()
});

// Apify Twitter scraper integration
async function getTwitterProfileData(handle: string) {
  const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
  
  if (!APIFY_API_TOKEN) {
    throw new Error('APIFY_API_TOKEN environment variable is required');
  }
  
  console.log(`[APIFY] Scraping Twitter data for @${handle}`);
  
  // Apify actor endpoint for synchronous execution with immediate results
  const apifyUrl = 'https://api.apify.com/v2/acts/kaitoeasyapi~twitter-x-data-tweet-scraper-pay-per-result-cheapest/run-sync-get-dataset-items';
  
  // Input configuration for the Twitter scraper
  const apifyInput = {
    from: handle,           // Target user handle
    maxItems: 30,          // Limit tweets (cost control: 30 tweets = ~$0.0075)
    lang: 'en',            // English tweets only
    includeUserInfo: true  // Include user profile data
  };
  
  try {
    console.log(`[APIFY] Making request to Apify with input:`, apifyInput);
    
    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${APIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apifyInput)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[APIFY] HTTP Error ${response.status}:`, errorText);
      throw new Error(`Apify API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`[APIFY] Successfully retrieved ${data.length} items from Apify`);
    
    if (!data || data.length === 0) {
      throw new Error(`No data returned for @${handle}. Profile may be private or non-existent.`);
    }
    
    // Extract profile data and tweets from Apify response
    const firstTweet = data[0];
    const author = firstTweet.author;
    
    const profileData = {
      handle: author.userName,
      displayName: author.name,
      bio: author.description || author.profile_bio?.description || '',
      stats: {
        followers: author.followers?.toString() || '0',
        following: author.following?.toString() || '0',
        tweets: author.statusesCount?.toString() || '0'
      },
      isVerified: author.isVerified || author.isBlueVerified || false,
      profilePicture: author.profilePicture || '',
      tweets: data.map((tweet: { text?: string }) => tweet.text).filter(Boolean)
    };
    
    console.log(`[APIFY] Extracted profile for @${profileData.handle} with ${profileData.tweets.length} tweets`);
    
    return profileData;
    
  } catch (error) {
    console.error(`[APIFY] Failed to scrape @${handle}:`, error);
    throw new Error(`Failed to fetch Twitter data for @${handle}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { handle } = await request.json();

    if (!handle) {
      return NextResponse.json({ error: 'Handle required' }, { status: 400 });
    }

    // Validate and sanitize the handle
    const sanitizedHandle = handle.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    if (!sanitizedHandle || sanitizedHandle.length < 1) {
      return NextResponse.json({ error: 'Invalid Twitter handle' }, { status: 400 });
    }

    // Get structured profile data from Apify
    console.log(`[API] Fetching Twitter data for @${sanitizedHandle} via Apify`);
    
    let profileData;
    try {
      profileData = await getTwitterProfileData(sanitizedHandle);
    } catch (error) {
      console.error(`[API] Apify scraping failed for @${sanitizedHandle}:`, error);
      return NextResponse.json(
        { 
          error: `Unable to fetch Twitter data for @${sanitizedHandle}. The profile may be private, suspended, or non-existent.`,
          suggestion: 'Please verify the handle exists and is public, then try again.'
        }, 
        { status: 503 }
      );
    }
    
    // Send structured data to Claude for scoring and roasting
    console.log(`[API] Sending structured profile data to Claude for analysis`);
    
    const { object } = await generateObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: FullAnalysisSchema,
      prompt: `You are an expert at analyzing Twitter profiles and generating savage autism trait scores with brutal accuracy and dark humor.

TASK: Analyze the provided Twitter profile data and generate a personalized 'TISM score with brutal roasting.

PROFILE DATA:
Handle: @${profileData.handle}
Name: ${profileData.displayName}
Bio: ${profileData.bio}
Followers: ${profileData.stats.followers}
Following: ${profileData.stats.following}
Total Tweets: ${profileData.stats.tweets}

RECENT TWEETS:
${profileData.tweets.slice(0, 15).map((tweet: string) => `"${tweet}"`).join('\n')}

REQUIREMENTS:
1. Fill profileData object with the exact data provided above
2. Set profileFound: true and isVerifiedRealData: true
3. Generate autism trait scores (0-100 each):
Based on the extracted profile data, generate autism trait scores:

1. 'Tism Level: Terminal (0-100) - Obsessive posting patterns, hyperfocus energy
2. Sensory Overload: Snowflake Mode (0-100) - Overstimulation complaints, sensitivity 
3. Social Skills: 404 Error (0-100) - Communication style, social awareness
4. Meltdown Frequency: Toddler Mode (0-100) - Change resistance, emotional regulation
5. Stim Level: Can't Sit Still Disorder (0-100) - Posting frequency, restless energy
6. Executive Function: Broken Brain Mode (0-100) - Scattered topics, organization
7. Masking Game: Faker Level (0-100) - Professional vs personal voice differences
8. Autism Radar: Rain Man Vibes (0-100) - Pattern recognition, analytical thinking

STEP 3 - GENERATE SAVAGE ROAST:
Write a brutal but funny roast that:
- References their ACTUAL tweets and bio content specifically
- Uses their real posting patterns and interests  
- Makes it personal and accurate to THEIR profile
- Uses viral internet language but AVOID overused phrases like "my brother in christ", "tell me you're X without telling me", "this you?"
- Create ORIGINAL insults based on their specific content
- Use creative metaphors related to their actual interests/topics
- Could ONLY apply to this specific person - make it impossible to copy-paste to someone else

Total score should be sum of all categories. Generate a creative archetype name that's unique to their personality (not generic like "The Overthinker").`,
      temperature: 0.8,
    });

    return NextResponse.json({
      success: true,
      handle: sanitizedHandle,
      profileData: object.profileData,
      totalScore: object.totalScore,
      categories: object.categories,
      roast: object.roast,
      archetype: object.archetype
    });

  } catch (error) {
    console.error('Score generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate score' },
      { status: 500 }
    );
  }
}