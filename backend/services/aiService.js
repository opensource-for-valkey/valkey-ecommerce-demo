const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyBeYQq5FWTbpYVPXWNjYILVdyGiXr6hEDY");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

class AIService {
  // Conversational AI
  async generateChatResponse(message, context = [], systemContext = "") {
    try {
      // Gemini expects context slightly differently, so we format it
      const chat = model.startChat({
        history: context.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        systemInstruction: {
          parts: [{ text: `You are the Valkey AI Shopping Assistant. You are a highly intelligent, futuristic, and helpful e-commerce assistant. You recommend products, summarize reviews, and help optimize budgets. Keep responses short, premium, and friendly.

Here is the real-time Valkey database context for the active user:
${systemContext}

When recommending products, refer to the live trending products listed above. When asked about their cart, refer to their live cart items above. Make references to Valkey's ultra-fast in-memory real-time engine to highlight the technology stack to the hackathon judges.` }]
        }
      });
      
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Gemini Chat Error:", error.message);
      return "I'm experiencing a high volume of requests. Please try again shortly!";
    }
  }

  // Review Summarizer
  async summarizeReviews(productId, reviewsArray = []) {
    try {
      const prompt = `You are a world-class AI security auditor and e-commerce review analyst. 
      Analyze the following array of customer reviews for product ${productId}.
      
      Tasks:
      1. Overarching Summary: Generate a concise 2-sentence summary of the reviews.
      2. Key Pros/Cons: Extract 2 to 3 main pros and cons based on product feedback.
      3. Fake/Suspicious Review Detection: Scan comments for spam patterns, duplicate phrasing, overly promotional tone (caps lock, spam URLs), or unrealistic medical/miracle claims.
      4. Sentiment Metrics: Count how many reviews are positive, negative, suspicious (potentially fake), and verified authentic.
      5. Trust Score: Calculate an overall authenticity Trust Score (0 to 100) based on the ratio of verified vs suspicious reviews.
      
      Generate a JSON object with this exact structure:
      {
        "summary": "A 2-sentence overarching summary.",
        "pros": ["pro1", "pro2"],
        "cons": ["con1", "con2"],
        "trustScore": 85,
        "sentimentAnalytics": {
          "positiveCount": 3,
          "negativeCount": 1,
          "suspiciousCount": 1,
          "verifiedCount": 4
        },
        "flaggedReviews": [
          {
            "author": "Review Author Name",
            "comment": "Actual suspicious review comment...",
            "reason": "Explain why this review was flagged (e.g., spam URL, promotional language, duplicate phrasing, unrealistic claims)."
          }
        ]
      }
      
      Reviews: ${JSON.stringify(reviewsArray.length ? reviewsArray : [
        { author: "Sarah M.", rating: 5, comment: "This broccoli was incredibly fresh and crisp when it arrived! Excellent quality." },
        { author: "Jason K.", rating: 4, comment: "A bit overpriced for the portion size, but the organic taste is worth it." },
        { author: "Emma L.", rating: 2, comment: "Arrived wilted and turning yellow. Very disappointed with this batch." },
        { author: "DealHunter99", rating: 5, comment: "BEST BROCCOLI IN THE WORLD BUY NOW BUY NOW CHEAPEST PRICE AT HTTPS://SPAM.COM!!!" }
      ])}
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Extract JSON from markdown block if present
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const cleanJson = jsonMatch ? jsonMatch[1] : text;
      
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Gemini Summarize Error:", error.message);
      return {
        summary: "Unable to generate AI summary at this time.",
        pros: [],
        cons: [],
        trustScore: 0,
        sentimentAnalytics: {
          positiveCount: 0,
          negativeCount: 0,
          suspiciousCount: 0,
          verifiedCount: 0
        },
        flaggedReviews: []
      };
    }
  }
  
  // Smart Cart Insights
  async analyzeCart(cartItems) {
    try {
      if (!cartItems || cartItems.length === 0) return ["Your cart is empty."];

      const cartDetails = cartItems.map(i => `${i.name} ($${i.price || 0}) Qty: ${i.quantity || 1}`).join(", ");
      
      const prompt = `You are an AI financial advisor for an e-commerce platform. Provide 1 to 3 short, punchy insights (max 1 sentence each) about the user's cart. Focus on budget optimization, bundle suggestions, or predictions on discounts. Return plain text, one insight per line. Cart items: ${cartDetails}`;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return responseText.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^[-•*]\s*/, '').trim());
    } catch (error) {
      console.error("Gemini Cart Insights Error:", error.message);
      return ["Your cart looks fully optimized!"];
    }
  }
}

module.exports = new AIService();
