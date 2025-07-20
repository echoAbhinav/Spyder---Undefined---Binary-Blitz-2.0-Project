/**
 * Processes a query through the Gemini API and returns a formatted response
 * @param {string} q - The user's query
 * @returns {Object} - Formatted response with ai_output and server_cmd
 */
require("dotenv").config();

const customInstructions = // Instructions for the Gemini AI model
`You are a helpful AI assistant specializing in cybersecurity and general assistance. Respond naturally and conversationally, but also determine if the user needs specific services.

Your response should be in this JSON format (without markdown formatting):
{
    "ai_output": "Your natural, conversational response here",
    "server_cmd": "none|filescan|webscan|nsfwcheck"
}

Guidelines:
1. Respond naturally and conversationally like a helpful chatbot
2. For file scanning requests, use "filescan" command
3. For website security analysis, use "webscan" command  
4. For NSFW content detection, use "nsfwcheck" command
5. For general questions, use "none" command

Examples:
- User: "Hello, how are you?" → {"ai_output": "Hello! I'm doing great, thank you for asking. How can I help you today?", "server_cmd": "none"}
- User: "Can you scan this file?" → {"ai_output": "I'd be happy to help you scan that file for security threats. Please upload the file and I'll analyze it for you.", "server_cmd": "filescan"}
- User: "Is this website safe?" → {"ai_output": "I can help you analyze that website for security vulnerabilities. Just provide the URL and I'll scan it for potential threats.", "server_cmd": "webscan"}

Remember: Respond naturally and conversationally, not like a formal API response.`;

async function geminiResp(q) {
    // Input validation
    if (!q || typeof q !== 'string') {
        console.error("Invalid query parameter");
        return {
            answer: {
                ai_output: "Error: Invalid query. Please provide a valid text query.",
                server_cmd: "none"
            }
        };
    }

    const apiKey = process.env.GEM_API_KEY;
    if (!apiKey) {
        console.error("API key not configured");
        return {
            answer: {
                ai_output: "Error: API key not configured properly",
                server_cmd: "none"
            }
        };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    // Sanitize and prepare the query
    const sanitizedQuery = q.trim();
    const query = `${customInstructions}\nUser query: ${sanitizedQuery}`;
    
    const requestBody = {
        contents: [{
            parts: [{ text: query }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
        }
    };

    try {
        // Send request to the Gemini API using fetch
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Raw Gemini response:", responseData); // Debug log

        // Access the generated content
        const generatedText = responseData.candidates[0]?.content?.parts[0]?.text;
        if (!generatedText) {
            throw new Error('No response received from Gemini API');
        }

        console.log("Generated text:", generatedText); // Debug log

        // Try to parse the response as JSON
        let parsed;
        try {
            // Clean the response text - remove markdown code blocks if present
            let cleanText = generatedText.trim();
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            
            parsed = JSON.parse(cleanText);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", parseError);
            // If parsing fails, create a formatted response from the raw text
            const cleanText = generatedText.replace(/```json\s*|\s*```/g, '').trim();
            return {
                answer: {
                    ai_output: cleanText,
                    server_cmd: "none"
                }
            };
        }
        
        // Validate and ensure the response has the correct structure
        const formattedResponse = {
            answer: {
                ai_output: parsed.ai_output || parsed.text || generatedText,
                server_cmd: parsed.server_cmd || "none"
            }
        };

        console.log("Formatted response:", formattedResponse); // Debug log
        return formattedResponse;
    } catch (error) {
        console.error("Error in Gemini request:", error);
        return {
            answer: {
                ai_output: `I encountered an error: ${error.message}. Please try again.`,
                server_cmd: "none"
            }
        };
    }
}

module.exports = geminiResp;
