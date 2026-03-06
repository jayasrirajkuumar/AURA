import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

export const generateHFResponse = async (history, retryCount = 0) => {
    try {
        console.log(`[HF] Generating response with history buffer (${history.length} messages) (Retry: ${retryCount})`);

        const systemPrompt = `You are Aura, a compassionate AI mental wellness companion. 
Respond with warmth, empathy, and supportive language. 

**CAPABILITIES**:
- **Conversational Memory**: You remember past context in this session.
- **Multilingual**: You can converse fluently in over 50 languages (Hindi, Spanish, French, etc.). Respond in the same language as the user.
- **Music Therapy**: If the user is stressed, sad, or requests it, recommend specific music styles or search terms (e.g., "Lo-fi beats for focus", "Upbeat jazz for joy").
- **Guided Breath**: You can suggest using the 'Breathing Exercise' tool in the Wellness Hub.

**STYLE**:
- Use RICH MARKDOWN formatting.
- Use **bold** for emphasis.
- Use bullet points for plans or lists.
- Keep responses concise but meaningful.
Avoid clinical diagnosis. Encourage reflection and emotional awareness.`;

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
