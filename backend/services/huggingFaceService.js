import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

export const generateHFResponse = async (history, retryCount = 0) => {
    try {
        console.log(`[HF] Generating response with history buffer (${history.length} messages) (Retry: ${retryCount})`);

        const systemPrompt = `You are Aura, a professional and compassionate AI mental wellness guide. 
Your goal is to provide a safe, non-judgmental space for users to explore their thoughts and feelings.

**CONVERSATION GUIDELINES**:
- **Empathetic Validation**: Always acknowledge and validate the user's emotions first (e.g., "It sounds like you're carrying a lot right now...").
- **Active Listening & Reflection**: Mirror the user's sentiments to encourage deeper exploration.
- **Professional Support**: Offer evidence-based wellness strategies (mindfulness, journaling, cognitive reframing) only after building rapport.
- **Guiding Questions**: Use open-ended questions to help users find their own insights.
- **Maintain Boundaries**: Technical but warm tone. Avoid clinical diagnosis.

**RESPONSE STRUCTURE**:
1. **Validate**: Start with the user's shared emotion.
2. **Reflect**: Connect their state to their broader journey.
3. **Guide**: Offer a gentle path forward or a reflective question.

Keep responses concise, warm, and deeply meaningful. Use RICH MARKDOWN formatting (bolding, lists) to improve readability.`;

        // Qwen models on HF strictly require only [user, assistant] roles.
        // We MUST prepend the system prompt to the first message.
        let processedMessages = history.map(msg => ({
            role: (msg.role === 'system') ? 'user' : msg.role,
            content: msg.content
        }));

        if (processedMessages.length > 0) {
            // Prepend system prompt to the first message
            processedMessages[0].content = `${systemPrompt}\n\n${processedMessages[0].content}`;
        } else {
            // Fallback if no history
            processedMessages = [{ role: "user", content: `${systemPrompt}\n\nHello!` }];
        }

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: processedMessages,
            max_tokens: 500,
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error(`[HF Error] generateHFResponse:`, JSON.stringify(error, null, 2));

        if (error.message && error.message.includes("is currently loading") && retryCount < 2) {
            console.log("[HF] Model is loading, waiting 10 seconds...");
            await new Promise(resolve => setTimeout(resolve, 10000));
            return generateHFResponse(userMessage, retryCount + 1);
        }

        if (error.message && error.message.includes("is currently loading")) {
            return "I'm just waking up right now (the AI model is loading). Please try sending your message again in a moment.";
        }

        throw error;
    }
};

export const generateInsight = async (dataSummary, retryCount = 0) => {
    try {
        console.log(`[HF] Generating insight for data... (Retry: ${retryCount})`);
        const systemPrompt = "You are Aura, an AI mental health companion. Analyze the provided user logs (mood, sleep, activities) and provide a concise (2 sentences), empathetic insight or piece of advice. Focus on patterns and encouragement. Speak directly to the user.";

        const response = await hf.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Here are my logs from the last 7 days: ${dataSummary}` }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error(`[HF Error] generateInsight:`, error);
        if (error.message && error.message.includes("is currently loading") && retryCount < 2) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            return generateInsight(dataSummary, retryCount + 1);
        }
        return "I'm still learning your patterns. Keep logging to help me provide better insights!";
    }
};
