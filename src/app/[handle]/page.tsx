'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Type definitions for API response
type AutismScore = {
  totalScore: number;
  categories: {
    terminalTism: number;
    snowflakeMode: number;
    social404: number;
    meltdownFreq: number;
    stimLevel: number;
    executiveFunction: number;
    maskingGame: number;
    autismRadar: number;
  };
  roast: string;
  archetype: string;
  shareMessage: string;
  profileData?: {
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
  };
};

const categories = [
  {
    key: 'terminalTism' as keyof AutismScore['categories'],
    name: "'Tism Level: Terminal",
    emoji: '🎯',
    description: 'Weaponized Autism Achievement',
  },
  {
    key: 'snowflakeMode' as keyof AutismScore['categories'],
    name: 'Sensory Overload: Snowflake Mode',
    emoji: '🔊',
    description: 'Princess and the Pea Syndrome',
  },
  {
    key: 'social404' as keyof AutismScore['categories'],
    name: 'Social Skills: 404 Error',
    emoji: '💬',
    description: 'Walking Cringe Compilation',
  },
  {
    key: 'meltdownFreq' as keyof AutismScore['categories'],
    name: 'Meltdown Frequency: Toddler Mode',
    emoji: '📅',
    description: 'Change = Nuclear Meltdown',
  },
  {
    key: 'stimLevel' as keyof AutismScore['categories'],
    name: "Stim Level: Can't Sit Still Disorder",
    emoji: '✨',
    description: 'Human Fidget Spinner',
  },
  {
    key: 'executiveFunction' as keyof AutismScore['categories'],
    name: 'Executive Function: Broken Brain Mode',
    emoji: '🧠',
    description: '47 Browser Tabs Open Permanently',
  },
  {
    key: 'maskingGame' as keyof AutismScore['categories'],
    name: 'Masking Game: Faker Level',
    emoji: '🎭',
    description: 'Professional People Pleaser',
  },
  {
    key: 'autismRadar' as keyof AutismScore['categories'],
    name: 'Autism Radar: Rain Man Vibes',
    emoji: '🔍',
    description: 'Counting Toothpicks Savant',
  },
];

export default function ResultsPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [scoreData, setScoreData] = useState<AutismScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(
    '🔍 Stalking your timeline...'
  );

  useEffect(() => {
    const generateScore = async () => {
      try {
        // Real loading progress tied to actual steps
        setLoadingStep("🕵️ Breaking into Twitter's vault...");
        setLoadingProgress(10);

        // Start the API call
        const response = await fetch('/api/score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ handle }),
        });

        setLoadingStep('🔬 Dissecting your digital soul...');
        setLoadingProgress(40);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate score');
        }

        setLoadingStep('🤖 Calculating your cringe levels...');
        setLoadingProgress(70);

        const data = await response.json();

        setLoadingStep('🔥 Preparing your emotional damage...');
        setLoadingProgress(90);

        // Small delay for final step
        await new Promise((resolve) => setTimeout(resolve, 500));

        setLoadingProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setScoreData(data);
      } catch (error) {
        console.error('Error generating score:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to generate score. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    generateScore();
  }, [handle]);

  const shareText = scoreData?.shareMessage || '';
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}`;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
        {/* Animated background elements - 2025 aesthetic */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Fixed progress bar at top - 2025 glassmorphism */}
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <div className="h-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              style={{ width: `${loadingProgress}%` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="text-center space-y-8 max-w-md mx-auto w-full">
            {/* Animated brain with modern glow */}
            <div className="relative">
              <div className="text-8xl animate-bounce filter drop-shadow-2xl">
                🧠
              </div>
              <div className="absolute inset-0 text-8xl animate-pulse opacity-40 blur-sm">
                🧠
              </div>
            </div>

            {/* Modern typography hierarchy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight break-words">
                  Analyzing
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent ml-2 break-all">
                    @{handle}
                  </span>
                </h1>
                <p className="text-lg text-gray-300 font-medium">
                  {loadingStep}
                </p>
              </div>

              {/* Progress indicator with percentage */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-purple-400 font-mono font-bold">
                    {loadingProgress}%
                  </span>
                </div>

                {/* Progress visualization */}
                <div className="w-full bg-gray-800/50 rounded-full h-2 backdrop-blur-sm border border-gray-700/50">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-lg shadow-purple-500/25"
                    style={{ width: `${loadingProgress}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scoreData) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-6">
          <div className="text-center space-y-8 max-w-md mx-auto">
            <div className="text-8xl animate-bounce">🚫</div>

            <div className="space-y-4">
              <h1 className="text-3xl font-black text-white tracking-tight">
                Can&apos;t Score This Profile
              </h1>

              <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {error?.includes('verified profiles')
                    ? `Sorry! Real Twitter data is currently only available for verified profiles. Try: @arthurmacwaters or @the_danny_g`
                    : error ||
                      'Something went wrong while analyzing this profile'}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  asChild
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold">
                  <Link href="/">🔄 Try Another Handle</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-10 text-purple-300 border-purple-500/30 hover:bg-purple-500/10 rounded-xl bg-white/5">
                  <Link href="/arthurmacwaters">
                    ✨ See Arthur&apos;s Score
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      {/* Background elements - 2025 aesthetic */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto p-4 space-y-8 w-full overflow-x-hidden">
        {/* Twitter Profile Header - Modern glassmorphism card */}
        {scoreData?.profileData && (
          <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              {/* Profile Picture - Dynamic gradient based on handle */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-purple-500/25">
                  {handle.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-white truncate">
                      {scoreData?.profileData?.displayName || handle}
                    </h2>
                    <p className="text-gray-400 text-sm truncate">@{handle}</p>
                  </div>

                  {/* Stats - Modern pill design */}
                  <div className="flex gap-2 text-xs">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                      <span className="text-gray-300">
                        {scoreData?.profileData?.stats?.followers || '0'}
                      </span>
                      <span className="text-gray-500 ml-1">followers</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                  {scoreData?.profileData?.bio || 'No bio available'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Score Header - Enhanced with micro-interactions */}
        <div className="text-center space-y-6 pt-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-white tracking-tight">
              🧠 &apos;TISM SCORE
            </h1>
            <div className="relative inline-block">
              <div
                className={cn(
                  'text-7xl font-black text-transparent bg-clip-text',
                  scoreData.totalScore > 800
                    ? 'bg-[linear-gradient(to_right,#f87171,#facc15,#4ade80,#60a5fa,#a855f7,#ec4899)] bg-[length:200%_100%] animate-[rainbow_2s_ease-in-out_infinite]'
                    : 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 animate-pulse'
                )}>
                {scoreData.totalScore}
              </div>
              <div className="text-3xl font-bold text-gray-500 absolute top-2 right-0 translate-x-full">
                /800
              </div>
              {/* Enhanced glow effect for off-the-charts scores */}
              <div
                className={`absolute inset-0 text-7xl font-black blur-lg ${
                  scoreData.totalScore > 800
                    ? 'text-rainbow animate-[rainbow_1.5s_ease-in-out_infinite] opacity-40'
                    : 'text-purple-400/20'
                }`}>
                {scoreData.totalScore}
              </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2">
              <span className="text-sm text-purple-300 font-medium">
                {scoreData.archetype}
              </span>
            </div>
          </div>
        </div>

        {/* Main Roast - Enhanced glassmorphism */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-8 shadow-2xl shadow-red-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">💀</div>
            <h2 className="text-2xl font-black text-red-400">THE ROAST</h2>
          </div>
          <div className="relative">
            <p className="text-white text-lg leading-relaxed font-medium">
              {scoreData.roast}
            </p>
            {/* Subtle glow behind text */}
            <div className="absolute inset-0 text-lg leading-relaxed text-red-400/10 blur-sm pointer-events-none">
              {scoreData.roast}
            </div>
          </div>
        </div>

        {/* Category Scores - Modern grid with animations */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">📊</div>
            <h2 className="text-2xl font-black text-purple-400">
              CATEGORY BREAKDOWN
            </h2>
          </div>
          <div className="grid gap-4">
            {categories.map((category, index) => (
              <div
                key={category.key}
                className="group relative overflow-hidden bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-2 border border-white/10">
                      {category.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-lg">
                        {category.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Score with progress bar */}
                  <div className="text-right space-y-2">
                    <div
                      className={cn(
                        'text-2xl font-black text-transparent bg-clip-text',
                        scoreData.categories[category.key] > 100
                          ? 'bg-[linear-gradient(to_right,#f87171,#facc15,#4ade80,#60a5fa,#a855f7,#ec4899)] bg-[length:200%_100%] animate-[rainbow_1.5s_ease-in-out_infinite]'
                          : 'from-purple-400 to-pink-400'
                      )}>
                      {scoreData.categories[category.key]}
                    </div>
                    <div className="w-16 bg-gray-700/50 rounded-full h-1">
                      <div
                        className={cn(
                          'h-1 rounded-full transition-all duration-1000 ease-out',
                          scoreData.categories[category.key] > 100
                            ? 'bg-[linear-gradient(to_right,#f87171,#facc15,#4ade80,#60a5fa,#a855f7,#ec4899)] bg-[length:200%_100%] animate-[rainbow_1s_ease-in-out_infinite]'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        )}
                        style={{
                          width: `${Math.min(
                            scoreData.categories[category.key],
                            100
                          )}%`,
                        }}></div>
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Section - Modern CTAs */}
        <div className="space-y-4">
          <Button
            asChild
            className="w-full h-16 text-lg font-black bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 rounded-2xl shadow-2xl shadow-purple-500/25 border border-purple-400/20 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3">
              <span className="text-2xl">🐦</span>
              <span>SHARE YOUR &apos;TISM SCORE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-14 text-purple-300 border-purple-500/30 hover:bg-purple-500/10 rounded-2xl backdrop-blur-sm bg-white/5 hover:border-purple-400/50 transform hover:scale-[1.01] transition-all duration-300">
            <Link href="/" className="flex items-center justify-center gap-2">
              <span className="text-xl">🔄</span>
              <span className="font-bold">SCORE SOMEONE ELSE</span>
            </Link>
          </Button>
        </div>

        {/* Footer - Minimalist design */}
        <div className="text-center space-y-3 pb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
            <span className="text-xs text-gray-400">
              Built for AWS MCP Agents Hackathon 2025
            </span>
          </div>
          <p className="text-xs text-gray-500">
            🚀 Viral autism awareness through savage humor
          </p>
        </div>
      </div>
    </div>
  );
}
