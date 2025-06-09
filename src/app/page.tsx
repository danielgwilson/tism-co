"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutismAwarenessBanner } from "@/components/ui/autism-awareness-banner";

export default function Home() {
  const [handle, setHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsLoading(true);
    
    // Clean the handle (remove @ if present)
    const cleanHandle = handle.replace('@', '').trim();
    
    // Navigate to results page
    router.push(`/${cleanHandle}`);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Autism Awareness Section */}
        <AutismAwarenessBanner className="mb-8" />
        
        {/* Main App Interface */}
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tight">
            🧠 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">TISM.CO</span>
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            Score my &apos;TISM
          </p>
          <p className="text-sm text-gray-400">
            Get your autism energy rated across 8 savage categories
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your X handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full h-14 px-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!handle.trim() || isLoading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              "🔥 SCORE MY 'TISM"
            )}
          </Button>
        </form>

            {/* Footer */}
            <div className="text-xs text-gray-500 space-y-3">
              <div className="p-3 bg-white/5 rounded-lg border border-blue-400/30">
                <p className="text-blue-300 font-medium mb-1">🧠 From Memes to Meaning</p>
                <p className="text-gray-400 text-xs">While we joke about autism traits, real support matters. 1 in 31 children has autism - let&apos;s turn viral engagement into genuine understanding.</p>
              </div>
              <div className="space-y-1">
                <p>Built for AWS MCP Agents Hackathon</p>
                <p>Uses public X profiles only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
