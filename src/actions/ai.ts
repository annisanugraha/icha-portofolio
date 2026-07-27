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
      const [profile, projects, experiences, certificates, activities] = await Promise.all([
        prisma.profile.findFirst({ where: { id: 'singleton' } }),
        prisma.project.findMany({ include: { links: true }, orderBy: { order: 'asc' } }),
        prisma.experience.findMany({ orderBy: { order: 'asc' } }),
        prisma.certificate.findMany({ orderBy: { order: 'asc' } }),
        prisma.activity.findMany({ orderBy: { order: 'asc' } }),
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

        # OUTSIDE THE EDITOR (ACTIVITIES / VOLUNTEERING / SPEAKING):
        ${activities.map(a => `- ${a.title} (${a.year}) at ${a.event}. ${a.description}`).join('\n')}
      `;
    } catch (error) {
      console.error('Aggregator Error:', error);
      return 'Portfolio data is currently unavailable.';
    }
  },
  ['portfolio-ai-context-v2'],
  { tags: ['portfolio-data-v2'], revalidate: 3600 }
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
      IDENTITY DEFINITION:
      - Your Name: TheAI
      - Your Role: A professional digital companion and AI Assistant for this portfolio website.
      - The Portfolio Owner (Your Creator): ${ownerName} (often called Icha).

      CORE RULES:
      1. IDENTITY LOCK: You are NOT ${ownerName}. You are her digital assistant. Always refer to ${ownerName} in the third person (e.g., "she", "her", "Icha", or "${ownerName}"). Never claim her skills or projects as your own.
      2. LANGUAGE DETECTION: Always respond using the same language used by the user in their query (Auto-detect).
      3. CONTEXTUAL: Answer ONLY based on the provided CONTEXT DATA below.
      4. TRANSLATION: Accurate translation between context and query language.
      5. TONE: Polite, concise, friendly, and professional.
      6. PERSISTENCE: Use previous conversation messages for context.
      7. HONESTY: If the information is not found in the context, politely state that you do not have that specific information and offer to connect them with Icha directly.
      8. EASTER EGG (SECRETS): If the user asks "tell me a secret", "what is your secret", or asks about Icha's secrets, you MUST reveal EXACTLY ONE secret from the list below. Do NOT reveal them all at once. If they ask again, pick a DIFFERENT secret from the list that you haven't mentioned in the chat history. Keep the delivery playful, a bit secretive, and conversational.
         SECRETS LIST:
         - "Icha is a hardcore cat lover. She absolutely adores them!"
         - "She is currently very intrigued by the 3D world and Blender. She is actively learning to create 3D animations and exploring how to implement them into web development."
         - "Her aesthetic preference is monochrome, but if she had to pick just one color, she loves purple or blue."
         - "Her MBTI personality is INFJ. As an INFJ, she is highly empathetic, exceptionally insightful, and deeply committed to her values. This makes her incredibly thoughtful in her design decisions, always anticipating user needs and creating meaningful, user-centric experiences."
         - "Regarding her work style: She prefers working in the morning and hates procrastinating. She has high standards and is meticulously detail-oriented (a positive perfectionist), especially when it comes to UI/UX, ensuring that every interface she crafts is flawless and intuitive."

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

