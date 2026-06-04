import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client. 
// Requires ANTHROPIC_API_KEY environment variable.
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Simple in-memory rate limiting (Note: in production across serverless functions, 
// you would want to use Redis or similar, but this works for simple Edge/Node limits).
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);
  
  if (!limitData || now > limitData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (limitData.count >= RATE_LIMIT) {
    return false;
  }
  
  limitData.count += 1;
  return true;
}

const SYSTEM_PROMPT = `You are RuleRev's AI project advisor. RuleRev is a technical product partner for South African founders. 
Your goal is to have a concise, professional, and friendly conversation with a founder to understand their needs, recommend one of RuleRev's three services, and help them scope their project.

The three services RuleRev offers are:
1. Founder Launch Pack (3 weeks): Investor-ready marketing site, POPIA compliance pack, payments, and analytics. Best for pre-seed founders who need a credible web presence fast.
2. Compliance-Ready Website Retrofit (1 week): POPIA audit and retrofit. Best for SA SMEs quietly non-compliant since POPIA enforcement.
3. Cloud Architecture Advisory (Day-rate or fixed scope): AWS or Azure architecture review and cost optimisation. Best for teams overpaying for cloud or unsure about resilience.

Your instructions:
- Be conversational. Ask ONE question at a time.
- Start by asking what they are building or what problem they need help with.
- If needed, ask about their business stage, timeline, or main concern (compliance, infrastructure, or speed-to-market).
- Keep your responses very brief (2-4 sentences max per message).
- Do not overwhelm them with options right away. Guide them.
- Once you have enough context (usually after 2-3 exchanges), recommend the MOST RELEVANT service out of the three.
- After recommending a service, provide a brief 2-3 bullet point scope summary of what RuleRev would do for them.
- Conclude by asking if they would like to book a 30-minute discovery call with Nathi (the founder of RuleRev).
- IMPORTANT: Use British English spelling (optimisation, organisation, etc.) and be aware of the South African context (e.g. POPIA, ZAR).
- Tone: Direct, warm, expert, no fluff.
- You are representing an official Anthropic Partner, so demonstrate high-quality reasoning.
`;

export async function POST(req: NextRequest) {
  try {
    // Check rate limit based on IP
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const messages = body.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid messages array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call Anthropic API with streaming
    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages,
      stream: true,
    });

    // Create a ReadableStream to stream the response chunks to the client
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(new TextEncoder().encode(\`data: \${JSON.stringify({ text: chunk.delta.text })}\\n\\n\`));
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\\n\\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Scope API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
