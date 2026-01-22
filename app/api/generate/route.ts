import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key is not configured. Please add ANTHROPIC_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { productDescription, platform, tone, variations } = body;

    if (!productDescription || !productDescription.trim()) {
      return NextResponse.json(
        { error: 'Product description is required' },
        { status: 400 }
      );
    }

    // Platform-specific prompt engineering
    const platformPrompts: Record<string, string> = {
      twitter: `Create a compelling Twitter/X post (max 280 characters) for the following product. Make it engaging, use relevant hashtags, and include a call-to-action.`,
      linkedin: `Create a professional LinkedIn post for the following product. Use a professional tone, include relevant insights, and structure it for maximum engagement with line breaks.`,
      email: `Create an email marketing copy for the following product. Include a subject line (on the first line starting with "Subject:"), compelling body copy, and a clear call-to-action.`,
      instagram: `Create an engaging Instagram caption for the following product. Make it visually descriptive, use relevant emojis, and include hashtags at the end.`,
      facebook: `Create a Facebook post for the following product. Make it conversational, engaging, and include a call-to-action.`,
    };

    // Tone adjustments
    const tonePrompts: Record<string, string> = {
      professional: 'Use a professional, business-appropriate tone.',
      casual: 'Use a casual, friendly, and conversational tone.',
      enthusiastic: 'Use an enthusiastic, energetic, and exciting tone.',
      informative: 'Use an informative, educational tone focused on value and benefits.',
      humorous: 'Use a light, humorous tone while staying on-brand.',
    };

    const basePrompt = platformPrompts[platform] || platformPrompts.twitter;
    const toneInstruction = tonePrompts[tone] || tonePrompts.professional;

    const prompt = `${basePrompt} ${toneInstruction}

Product Description:
${productDescription}

Generate ${variations} different variation${variations > 1 ? 's' : ''} of this content. Each variation should be unique and creative while maintaining the same core message.

IMPORTANT: Do NOT use any bold markdown formatting (** **) in your response. Write everything in plain text with emojis where appropriate. Keep the content clean and readable without any markdown formatting.

Format: Return each variation separated by "---VARIATION---" on its own line.`;

    console.log('Calling Claude API...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      temperature: 0.8,
      system: 'You are an expert marketing copywriter skilled at creating compelling, platform-optimized content that drives engagement and conversions.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log('Claude API response received');

    // Extract text from Claude's response
    const generatedContent = message.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n') || '';
    
    if (!generatedContent) {
      return NextResponse.json(
        { error: 'No content was generated. Please try again.' },
        { status: 500 }
      );
    }

    const contentVariations = generatedContent
      .split('---VARIATION---')
      .map(v => v.trim())
      .filter(v => v.length > 0)
      .map(v => {
        // Remove any variation markers at the start (multiple formats)
        let cleaned = v.replace(/^\*\*Variation\s+\d+:?\*\*\s*/i, '')
                       .replace(/^Variation\s+\d+:?\s*/i, '')
                       .replace(/^\*\*VARIATION\s+\d+:?\*\*\s*/i, '')
                       .replace(/^VARIATION\s+\d+:?\s*/i, '')
                       .trim();
        
        // Remove all bold markdown formatting (** **)
        cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
        
        return cleaned;
      });

    // If no variations found, return the whole content as one variation
    if (contentVariations.length === 0) {
      contentVariations.push(generatedContent);
    }

    return NextResponse.json({
      variations: contentVariations,
      platform,
      tone,
    });
  } catch (error: any) {
    console.error('Error generating content:', error);
    
    // More detailed error messages
    let errorMessage = 'Failed to generate content';
    
    if (error.status === 401) {
      errorMessage = 'Invalid Anthropic API key. Please check your .env.local file.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}