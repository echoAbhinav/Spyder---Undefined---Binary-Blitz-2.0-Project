require("dotenv").config();
async function geminiResp2(q) {
  const apiKey = process.env.GEM_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  //   const customInstructions = `Please provide output in **JSON format only**. Your response should follow this structure:

  // {
  //     "ai_output": string,  // Explanation or response message
  //     "server_cmd": string ["nsfwcheck", "filescan", "webscan", "none"]  // Command based on the context of the request
  // }

  // Your task is to respond to requests related to cyber security and website vulnerabilities. Follow these instructions:

  // 1. **For NSFW image requests**: If the user asks to analyze an image for NSFW content (e.g., explicit or inappropriate content), use the **"nsfwcheck"** server command.

  // 2. **For file scans**: If the user asks to scan a file for viruses, malware, or other threats, use the **"filescan"** server command.

  // 3. **For website scans**: If the user asks about scanning a website for vulnerabilities, security issues, or scanning URLs, use the **"webscan"** server command.

  // 4. **For unrelated requests**: If the request does not correspond to the actions above, set the **"server_cmd"** to **"none"**.

  // Additionally, if the user asks for something specific (such as vulnerability assessment of a website), clearly define that the web scan is a security analysis. If Gemini does not have the capability to perform these tasks, make sure to clearly communicate that limitation. In such cases, you can still return an appropriate response, but the server_cmd should be set to "none".

  // For example:
  // - User: "Can you check if this website is secure?"
  //   - Response:

  //     {
  //         "ai_output": "I can help you analyze website vulnerabilities. Let me scan the website.",
  //         "server_cmd": "webscan"
  //     }

  // - User: "Please analyze this image for NSFW content."
  //   - Response:

  //     {
  //         "ai_output": "I will scan the image for NSFW content.",
  //         "server_cmd": "nsfwcheck"
  //     }

  // - User: "Please scan this file for any viruses."
  //   - Response:

  //     {
  //         "ai_output": "I will scan the file for any security issues.",
  //         "server_cmd": "filescan"
  //     }

  // - User: "Tell me about cybersecurity."
  //   - Response:

  //     {
  //         "ai_output": "Cybersecurity involves protecting systems, networks, and data from cyber attacks.",
  //         "server_cmd": "none"
  //     }

  // Please ensure that the JSON response always matches this format and that the server command corresponds to the task at hand.
  // `;

  const customInstructions =
    "You are analyzing a file security report. Provide a natural, conversational analysis of the file's safety. Respond in this JSON format (without markdown): {\"ai_output\": \"Your analysis here\", \"server_cmd\": \"none\"}. Be helpful and explain the findings in simple terms.";
  const query = customInstructions + JSON.stringify(q);

  console.log(q);

  const requestBody = {
    contents: [
      {
        parts: [{ text: query }],
      },
    ],
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

    // Access the generated content
    const generatedText = responseData.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      console.log("Generated text not found in response.");
      return { ai_output: "Sorry, I couldn't analyze the file properly. Please try again.", server_cmd: "none" };
    }

    // Try to parse as JSON, fallback to raw text
    try {
      let cleanText = generatedText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsed = JSON.parse(cleanText);
      return {
        ai_output: parsed.ai_output || generatedText,
        server_cmd: parsed.server_cmd || "none"
      };
    } catch (parseError) {
      console.log("Failed to parse JSON, using raw text");
      return {
        ai_output: generatedText.replace(/```json\s*|\s*```/g, '').trim(),
        server_cmd: "none"
      };
    }
  } catch (error) {
    console.error("Error generating response:", error.message);
    return "Failed to generate response";
  }
}

module.exports = geminiResp2;
