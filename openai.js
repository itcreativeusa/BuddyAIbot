class OpenAIAPI {
  static async generateResponse(userMessage, conversationHistory = []) {
    const apiKey = process.env.OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: conversationHistory.concat([
            { role: "user", content: userMessage },
          ]),
          max_tokens: 150,
        }),
      });

      const responseData = await response.json();

      // Log full response first
      console.log("Full OpenAI response:", JSON.stringify(responseData, null, 2));

      // Check HTTP error first
      if (!response.ok) {
        console.error("OpenAI API error:", response.status, responseData);
        return "Sorry, there was an API error.";
      }

      // Check response shape safely
      if (
        responseData.choices &&
        responseData.choices.length > 0 &&
        responseData.choices[0].message &&
        responseData.choices[0].message.content
      ) {
        return responseData.choices[0].message.content;
      } else {
        console.error("Error: No valid response from OpenAI API", responseData);
        return "Sorry, I couldn't understand that.";
      }
    } catch (error) {
      console.error("Request failed:", error);
      return "Sorry, something went wrong.";
    }
  }
}

module.exports = { OpenAIAPI };