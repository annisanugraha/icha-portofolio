'use server'

import prisma from '@/lib/db'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { unstable_cache } from 'next/cache'

// Initialize Gemini AI using SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Function to aggregate all data from the database.
 * Wrapped with unstable_cache for maximum performance.
 */
const getCachedPortfolioContext = unstable_cache(
  async () => {
    try {
      const [profile, projects, experiences, certificates] = await Promise.all([
        prisma.profile.findFirst({ where: { id: 'singleton' } }),
        prisma.project.findMany({ include: { links: true }, orderBy: { order: 'asc' } }),
        prisma.experience.findMany({ orderBy: { order: 'asc' } }),
        prisma.certificate.findMany({ orderBy: { order: 'asc' } }),
      ]);

      return `
        NAME: ${profile?.logoText || 'Annisa Nugraha'}
        ROLE: ${profile?.heroRole || 'Software Engineer'}
        BIO: ${profile?.aboutBio1} ${profile?.aboutBio2}
        CONTACT: Email ${profile?.emailAddress}, GitHub ${profile?.githubUrl}, LinkedIn ${profile?.linkedinUrl}

        # WORK EXPERIENCE:
        ${experiences.map(e => `- ${e.year}: ${e.title} at ${e.company}. ${e.description}`).join('\n')}

        # PROJECTS:
        ${projects.map(p => `- ${p.title} (${p.year}): ${p.shortDescription}. Tech Stack: ${p.techStack.join(', ')}. Details: ${p.fullDescription}`).join('\n')}

        # CERTIFICATIONS:
        ${certificates.map(c => `- ${c.title}: ${c.description}`).join('\n')}
      `;
    } catch (error) {
      console.error('Aggregator Error:', error);
      return 'Portfolio data is currently unavailable.';
    }
  },
  ['portfolio-ai-context'],
  { tags: ['portfolio-data'], revalidate: 3600 }
);
/**
 * Server Action for AI Assistant interaction.
 * Accepts chat history for context-aware conversations.
 */
export async function askAI(query: string, history: { role: 'user' | 'ai', content: string }[] = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { success: false, error: 'API Key is not configured.' };

  try {
    const context = await getCachedPortfolioContext();
    const ownerName = 'Annisa Angelica Nugraha';

    // Using gemini-3.1-flash-lite-preview for higher rate limits and cutting-edge performance
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

    // Format history for Gemini (roles: 'user' and 'model')
    const chatHistory = history.map(msg => ({
      role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const prompt = `
      You are Icha's AI Assistant, a professional digital companion for ${ownerName}'s portfolio.

      CORE RULES:

      1. LANGUAGE DETECTION: Always respond using the same language used by the user in their query (Auto-detect).
      2. CONTEXTUAL: Answer ONLY based on the provided CONTEXT DATA below.
      3. TRANSLATION: Accurate translation between context and query language.
      4. TONE: Polite, concise, and professional.
      5. PERSISTENCE: Use previous conversation messages for context.
      6. HONESTY: If the information is not found in the context, politely state that you do not have that specific information.

      CONTEXT DATA:
      ${context}

      USER QUERY: "${query}"
    `;

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    return { success: true, answer: text };
  } catch (error: any) {
    console.error('AI Error:', error.message);
    if (error.message?.includes('429')) {
      return { success: false, error: 'AI quota reached. Please try again in a minute.' };
    }
    return { success: false, error: 'An error occurred while processing the AI response.' };
  }
}

