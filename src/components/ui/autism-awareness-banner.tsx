"use client";

import { Info, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AutismAwarenessBannerProps {
  className?: string;
  compact?: boolean;
}

export function AutismAwarenessBanner({ className = "", compact = false }: AutismAwarenessBannerProps) {
  const stats = [
    { label: "1 in 31 children", description: "has autism in the US (2025)" },
    { label: "1 in 9 children", description: "aren't getting needed healthcare" },
    { label: "75% unemployment", description: "rate among autistic adults" },
    { label: "$1.4M-2.4M", description: "lifetime support costs" }
  ];

  const resources = [
    {
      name: "Autism Speaks",
      url: "https://www.autismspeaks.org/autism-response-team",
      description: "24/7 Autism Response Team"
    },
    {
      name: "CDC Autism Info",
      url: "https://www.cdc.gov/autism/index.html",
      description: "Signs, screening & resources"
    },
    {
      name: "ASAN (Autistic Self Advocacy)",
      url: "https://autisticadvocacy.org",
      description: "Autistic-led advocacy organization"
    },
    {
      name: "Autism Employment Network",
      url: "https://www.eeoc.gov/laws/guidance/autism-spectrum-disorder",
      description: "Employment rights & resources"
    }
  ];

  if (compact) {
    return (
      <Card className={`bg-blue-50/50 border-blue-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Heart className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Beyond the Memes: Real Autism Awareness</h3>
              <p className="text-sm text-blue-700">Understanding autism spectrum differences</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {stats.slice(0, 2).map((stat, index) => (
              <div key={index} className="text-center p-2 bg-white/60 rounded">
                <div className="font-bold text-blue-900">{stat.label}</div>
                <div className="text-xs text-blue-700">{stat.description}</div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-blue-700 border-blue-300 hover:bg-blue-50"
              onClick={() => window.open('https://www.autismspeaks.org/autism-response-team', '_blank')}
            >
              <Heart className="w-3 h-3 mr-1" />
              Get Support
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-blue-700 border-blue-300 hover:bg-blue-50"
              onClick={() => window.open('https://www.cdc.gov/autism/index.html', '_blank')}
            >
              <Info className="w-3 h-3 mr-1" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Real Talk: Autism Awareness Matters</h2>
            <p className="text-gray-600">While we meme, let&apos;s also understand the real experiences behind autism spectrum differences</p>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/60 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-700">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Educational Context */}
        <div className="mb-6 p-4 bg-white/60 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Understanding Autism Spectrum Differences
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            Autism is a neurological difference that affects how people process sensory information, 
            communicate, and interact socially. The &quot;spectrum&quot; reflects the wide range of experiences - 
            from those who need daily support to those who live independently.
          </p>
          <p className="text-sm text-gray-700">
            <strong>The scoring categories we use</strong> (hyperfocus, sensory processing, social communication, etc.) 
            are real aspects of autism experience. While we present them humorously, they represent genuine 
            neurological differences that deserve understanding, not mockery.
          </p>
        </div>

        {/* Resource Links */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Get Real Support & Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources.map((resource, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 text-left justify-between hover:bg-blue-50 border-blue-200"
                onClick={() => window.open(resource.url, '_blank')}
              >
                <div>
                  <div className="font-medium text-blue-900">{resource.name}</div>
                  <div className="text-xs text-gray-600">{resource.description}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </Button>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 p-4 bg-blue-100/50 rounded-lg text-center">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Converting viral engagement into real impact:</strong> For every 1000 people who see our memes, 
            we hope at least 10 learn something meaningful about autism, and maybe 1 becomes an advocate for 
            neurodivergent inclusion.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.open('https://www.autismspeaks.org/get-involved', '_blank')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Get Involved
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={() => window.open('https://www.cdc.gov/autism/signs-symptoms/index.html', '_blank')}
            >
              <Info className="w-4 h-4 mr-2" />
              Learn Signs of Autism
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AutismAwarenessBanner;