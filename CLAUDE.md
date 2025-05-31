# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for the AWS MCP Agents Hackathon (May 30, 2025). The project is built for developing AI agent systems using the Model Context Protocol (MCP) with integration requirements for multiple sponsor tools including Auth0, Temporal, DuploCloud, Operant AI, and Inngest.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

## Technology Stack

- **Framework**: Next.js 15.3.3 with App Router
- **React**: Version 19.0.0
- **TypeScript**: ES2017 target with strict mode
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **UI Components**: Radix UI primitives with class-variance-authority
- **Icons**: Lucide React
- **Fonts**: Geist Sans and Geist Mono

## Architecture

### File Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/ui/` - shadcn/ui component library
- `src/lib/` - Utility functions and shared logic
- Path aliases configured with `@/*` pointing to `src/*`

### Component System
- Uses shadcn/ui "new-york" style with slate base color
- CSS variables enabled for theming
- Components built with Radix UI primitives
- Consistent styling through class-variance-authority

### TypeScript Configuration
- Strict mode enabled with ES2017 target
- Module resolution set to "bundler" for Next.js compatibility
- Incremental compilation enabled for faster builds

## Deployment

### Vercel Setup
- **Production URL**: https://aws-mcp-hack-1gbjgg6nx-danielgwilson.vercel.app
- **Custom Domain**: tism.co (DNS propagation pending)
- **Deploy Command**: `vercel --prod --yes`
- **Project Name**: danielgwilson/aws-mcp-hack

### DNS Configuration
- Domain: tism.co
- A Record: 76.76.21.21
- Verification: Complete (waiting for global DNS propagation)

## Hackathon Context

### Competition Requirements
- **Demo Length**: 3-minute presentations
- **Integration Requirement**: Minimum 3 sponsor tools
- **Focus Areas**: Tool chaining via MCP, agent orchestration
- **Judging Criteria**: Innovation, technical implementation, tool integration, presentation

### Key Sponsor APIs to Integrate
- **Auth0**: Identity/authentication for AI agents
- **Temporal**: Workflow orchestration for agent reliability
- **DuploCloud**: Cloud automation for secure deployments
- **Operant AI**: AI monitoring/ops tooling
- **Inngest**: Event-driven workflow platform

### Technical Goals
- Implement MCP (Model Context Protocol) for agent communication
- Build tool chaining and workflow automation
- Focus on enterprise-ready agent solutions
- Demonstrate clear business value proposition

## AI/LLM Integration Policy

### CRITICAL RULE: VERCEL AI SDK ONLY
- **MANDATORY**: All LLM calls MUST use Vercel AI SDK (https://ai-sdk.dev/)
- **FORBIDDEN**: Direct API calls, other SDKs, custom implementations
- **API Provider**: Anthropic Claude via Vercel AI SDK
- **Environment**: ANTHROPIC_API_KEY in .env.local
- **Documentation**: https://ai-sdk.dev/providers/anthropic

## Data Integrity Policy

### CRITICAL RULE: NO FAKE DATA IN PRODUCTION FEATURES
- **FORBIDDEN**: Sneakily reverting to fake/mock data when implementing real features
- **ACCEPTABLE**: Mock data for testing purposes (clearly labeled as such)
- **REQUIRED**: Complete transparency about data sources and implementation status
- **VIOLATION**: Adding fake data as fallback without explicit user permission is a fundamental breach of trust
- **PROTOCOL**: If real data implementation fails, must honestly report the issue and ask for direction
- **CONSEQUENCE**: User will be livid if fake data is added without permission

### Vercel AI SDK Implementation
```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, generateObject } from 'ai';

// Text generation
const { text } = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: 'Your prompt here'
});

// Structured generation
const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-20250514'),
  schema: yourZodSchema,
  prompt: 'Your prompt here'
});
```

## MCP Integration Patterns

### Core Concepts
- **Model Context Protocol**: Standardizing AI application context sharing
- **Tool Chaining**: Sequential integration of multiple APIs/services
- **Agent Orchestration**: Coordinating multiple AI agents for complex workflows
- **Enterprise Readiness**: Security, monitoring, and scalability considerations

### Implementation Strategy
- Start with 3 sponsor tools to meet minimum requirements
- Build modular architecture for easy tool addition/removal
- Implement proper error handling and fallback mechanisms
- Focus on clear demonstration of business value