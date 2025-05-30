import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// CRITICAL: ONLY USING VERCEL AI SDK AS REQUIRED
// Schema for structured autism score generation
const AutismScoreSchema = z.object({
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

// REAL Twitter scraping using Browserbase API
interface TwitterProfile {
  handle: string;
  bio: string;
  displayName: string;
  stats: {
    tweets: string;
    following: string;
    followers: string;
  };
  tweets: string[];
  profileFound: boolean;
  isVerifiedRealData: boolean;
}

async function scrapeTwitterProfile(handle: string): Promise<TwitterProfile> {
  const BROWSERBASE_API_KEY = 'bb_live_SqRL9y81J0I9x4RXSRFiazq5K18';
  const BROWSERBASE_PROJECT_ID = 'c99e8e20-f366-4df4-b1f9-2727ce56d1c5';
  
  try {
    console.log(`[REAL SCRAPING] Starting scrape for @${handle}`);
    
    // Create browser session
    const sessionResponse = await axios.post(
      'https://www.browserbase.com/v1/sessions',
      {
        projectId: BROWSERBASE_PROJECT_ID,
        browserSettings: { viewport: { width: 1280, height: 720 } }
      },
      {
        headers: {
          'X-BB-API-Key': BROWSERBASE_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );
    
    const session = sessionResponse.data;
    console.log(`[REAL SCRAPING] Created session: ${session.id}`);
    
    // Navigate and extract data with retries
    const actionsResponse = await axios.post(
      `https://www.browserbase.com/v1/sessions/${session.id}/actions`,
      {
        actions: [
          { type: 'goto', url: `https://x.com/${handle}` },
          { type: 'wait', timeout: 8000 }, // Wait longer for Twitter to load
          {
            type: 'evaluate',
            expression: `
              // Enhanced Twitter scraping with multiple selectors
              const result = {
                bio: '',
                displayName: '',
                tweets: [],
                stats: { tweets: '0', following: '0', followers: '0' }
              };
              
              // Get display name
              const nameSelectors = [
                '[data-testid="UserName"] span',
                'h2[role="heading"] span',
                '[data-testid="UserScreenName"] + div span'
              ];
              
              for (const selector of nameSelectors) {
                const nameEl = document.querySelector(selector);
                if (nameEl && nameEl.textContent && !nameEl.textContent.includes('@')) {
                  result.displayName = nameEl.textContent.trim();
                  break;
                }
              }
              
              // Get bio with fallbacks
              const bioSelectors = [
                '[data-testid="UserDescription"]',
                '[data-testid="UserBio"]',
                '[role="tabpanel"] div[dir="auto"]'
              ];
              
              for (const selector of bioSelectors) {
                const bioEl = document.querySelector(selector);
                if (bioEl && bioEl.textContent && bioEl.textContent.length > 10) {
                  result.bio = bioEl.textContent.trim();
                  break;
                }
              }
              
              // Get stats with multiple attempts
              const followingSelectors = [
                'a[href*="/following"] span[class*="css"]',
                'a[href*="/following"] span',
                'text[data-testid="following"]'
              ];
              
              const followersSelectors = [
                'a[href*="/followers"] span[class*="css"]',
                'a[href*="/verified_followers"] span[class*="css"]',
                'a[href*="/followers"] span',
                'text[data-testid="followers"]'
              ];
              
              for (const selector of followingSelectors) {
                const el = document.querySelector(selector);
                if (el && el.textContent) {
                  result.stats.following = el.textContent.trim();
                  break;
                }
              }
              
              for (const selector of followersSelectors) {
                const el = document.querySelector(selector);
                if (el && el.textContent) {
                  result.stats.followers = el.textContent.trim();
                  break;
                }
              }
              
              // Get tweets with enhanced selectors
              const tweetSelectors = [
                '[data-testid="tweetText"]',
                '[data-testid="tweet"] div[dir="auto"]',
                'article div[lang]'
              ];
              
              const tweets = new Set(); // Use Set to avoid duplicates
              
              for (const selector of tweetSelectors) {
                const elements = document.querySelectorAll(selector);
                for (let i = 0; i < Math.min(15, elements.length); i++) {
                  const tweetText = elements[i].textContent?.trim();
                  if (tweetText && 
                      tweetText.length > 20 && 
                      tweetText.length < 300 &&
                      !tweetText.includes('Show this thread') &&
                      !tweetText.includes('Translate') &&
                      !tweetText.includes('Following') &&
                      !tweetText.includes('Followers')) {
                    tweets.add(tweetText);
                  }
                }
                if (tweets.size >= 5) break; // Stop when we have enough
              }
              
              result.tweets = Array.from(tweets).slice(0, 10);
              result.stats.tweets = result.tweets.length.toString();
              
              console.log('Extracted data:', result);
              return result;
            `
          }
        ]
      },
      {
        headers: {
          'X-BB-API-Key': BROWSERBASE_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 90000 // Longer timeout for Twitter
      }
    );
    
    const extractedData = actionsResponse.data.results?.[2];
    console.log(`[REAL SCRAPING] Extracted data:`, extractedData);
    
    // Cleanup session
    await axios.delete(`https://www.browserbase.com/v1/sessions/${session.id}`, {
      headers: { 'X-BB-API-Key': BROWSERBASE_API_KEY }
    }).catch(() => {});
    
    // Validate we got real data
    const hasValidData = extractedData && (
      extractedData.tweets?.length > 0 || 
      extractedData.bio?.length > 10 ||
      extractedData.displayName?.length > 0
    );
    
    if (!hasValidData) {
      throw new Error('No valid data extracted from Twitter');
    }
    
    return {
      handle,
      bio: extractedData.bio || `${extractedData.displayName || handle} - Twitter user`,
      displayName: extractedData.displayName || handle,
      stats: {
        tweets: extractedData.stats?.tweets || '0',
        following: extractedData.stats?.following || '0',
        followers: extractedData.stats?.followers || '0'
      },
      tweets: extractedData.tweets || [],
      profileFound: true,
      isVerifiedRealData: true
    };
    
  } catch (error) {
    console.error(`[REAL SCRAPING] Failed for @${handle}:`, error);
    throw new Error(`Failed to scrape real Twitter data for @${handle}: ${error}`);
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

    // REAL SCRAPING ONLY - No more fake data!
    console.log(`[API] Starting real scraping for @${sanitizedHandle}`);
    const profileData = await scrapeTwitterProfile(sanitizedHandle);
    
    // Generate personalized savage scores using ONLY Vercel AI SDK
    const { object } = await generateObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: AutismScoreSchema,
      prompt: `You are an unhinged AI that scores autism traits with brutal accuracy and savage humor using REAL profile data.

Twitter Profile Analysis for @${handle}:
Bio: "${profileData.bio}"
Stats: ${profileData.stats.tweets} tweets, ${profileData.stats.followers} followers, ${profileData.stats.following} following

Recent Tweets:
${profileData.tweets.slice(0, 5).map((tweet: string, i: number) => `${i+1}. "${tweet}"`).join('\n')}

Generate a 'TISM score that references their ACTUAL content:

1. 'Tism Level: Terminal (0-100) - Analyze their obsessive posting patterns
2. Sensory Overload: Snowflake Mode (0-100) - Look for overstimulation complaints
3. Social Skills: 404 Error (0-100) - Analyze their communication style
4. Meltdown Frequency: Toddler Mode (0-100) - Look for change resistance
5. Stim Level: Can't Sit Still Disorder (0-100) - Posting frequency patterns
6. Executive Function: Broken Brain Mode (0-100) - Scattered topics/unfinished thoughts
7. Masking Game: Faker Level (0-100) - Professional vs personal voice differences
8. Autism Radar: Rain Man Vibes (0-100) - Pattern recognition in their tweets

Rules:
- Reference their ACTUAL tweets and bio content specifically
- Use their real posting patterns and interests
- Be savage but use their own content against them
- Make it personal and accurate to THEIR profile
- Include specific examples from their tweets
- Use viral internet language: "terminal 'tism", "snowflake mode", etc.

Generate a roast that could ONLY apply to this specific person based on their actual content.`,
      temperature: 0.8,
    });

    return NextResponse.json({
      success: true,
      handle,
      profileData,
      ...object
    });

  } catch (error) {
    console.error('Score generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate score' },
      { status: 500 }
    );
  }
}