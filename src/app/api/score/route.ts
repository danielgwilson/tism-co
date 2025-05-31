import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { Browserbase } from '@browserbasehq/sdk';
import { chromium } from 'playwright-core';

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

// Simplified: Just get raw page content for AI to analyze
async function getTwitterPageContent(handle: string): Promise<string> {
  const BROWSERBASE_API_KEY = 'bb_live_SqRL9y81J0I9x4RXSRFiazq5K18';
  const BROWSERBASE_PROJECT_ID = 'c99e8e20-f366-4df4-b1f9-2727ce56d1c5';
  
  console.log(`[PAGE FETCH] Getting raw content for @${handle}`);
  
  const bb = new Browserbase({ apiKey: BROWSERBASE_API_KEY });
  
  try {
    // Create session
    const session = await bb.sessions.create({
      projectId: BROWSERBASE_PROJECT_ID,
      timeout: 300,
      browserSettings: {
        viewport: { width: 1280, height: 720 },
        blockAds: true,
        solveCaptchas: true
      }
    });
    
    console.log(`[PAGE FETCH] Created session: ${session.id}`);
    
    // Connect with Playwright
    const browser = await chromium.connectOverCDP(session.connectUrl);
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages()[0];
    
    // Navigate and wait for content
    await page.goto(`https://x.com/${handle}`, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait for page to load
    await page.waitForTimeout(8000);
    
    // Scroll to load more content
    console.log('[PAGE FETCH] Scrolling to load more content...');
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(2000);
    }
    
    // Get the full page content
    const pageContent = await page.evaluate(() => {
      // Get both the full text and relevant HTML structure
      return {
        text: document.body.innerText,
        title: document.title,
        url: window.location.href
      };
    });
    
    // Clean up
    try {
      await browser.close();
      console.log('[CLEANUP] Browser closed successfully');
    } catch (cleanupError) {
      console.warn('[CLEANUP] Browser cleanup failed (non-critical):', cleanupError);
    }
    
    console.log(`[PAGE FETCH] Retrieved ${pageContent.text.length} characters of content`);
    
    return pageContent.text;
    
  } catch (error) {
    console.error(`[PAGE FETCH] Failed for @${handle}:`, error);
    throw new Error(`Failed to fetch Twitter page for @${handle}: ${error}`);
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

    // Get raw page content with Browserbase
    console.log(`[API] Fetching page content for @${sanitizedHandle}`);
    
    let pageContent;
    try {
      pageContent = await getTwitterPageContent(sanitizedHandle);
    } catch (error) {
      console.error(`[API] Page fetch failed for @${sanitizedHandle}:`, error);
      return NextResponse.json(
        { 
          error: `Unable to fetch Twitter page for @${sanitizedHandle}. Browser automation may be temporarily unavailable.`,
          suggestion: 'Try again in a moment, or check that the Twitter handle exists and is public.'
        }, 
        { status: 503 }
      );
    }
    
    // Let Claude do ALL the extraction + scoring + roasting from raw content
    console.log(`[API] Sending ${pageContent.length} characters to Claude for full analysis`);
    
    const { object } = await generateObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: FullAnalysisSchema,
      prompt: `You are an expert at analyzing Twitter profiles and generating savage autism trait scores with brutal accuracy and dark humor.

TASK: Extract profile data from this raw Twitter page content, then generate a personalized 'TISM score.

RAW TWITTER PAGE CONTENT for @${sanitizedHandle}:
${pageContent}

STEP 1 - EXTRACT PROFILE DATA:
From the raw content above, extract:
- Bio/description 
- Display name
- Follower count, following count, tweet count
- Recent tweets (find 10-15 actual tweet texts)
- Set profileFound to true if this looks like a valid Twitter profile
- Set isVerifiedRealData to true (this is real scraped data)

STEP 2 - GENERATE 'TISM SCORE:
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