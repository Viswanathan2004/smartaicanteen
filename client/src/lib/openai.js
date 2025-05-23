export async function sendChatbotMessage(message) {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  }
  
  export async function processVoiceOrder(voiceText) {
    try {
      const response = await fetch('/api/voice-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voiceText }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error processing voice order:', error);
      throw error;
    }
  }
  
  export async function getDietRecommendation() {
    try {
      const response = await fetch('/api/diet-analysis/latest', {
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Extract suggested items from recommendation if available
      let suggestedItems = [];
      if (data.aiRecommendation) {
        // Very simple extraction, in reality this would be more sophisticated
        const matches = data.aiRecommendation.match(/\b(Garden Fresh Salad|Protein Quinoa Bowl|Grilled Chicken|Vegetable Soup|Whole Grain Bread)\b/g);
        if (matches) {
          suggestedItems = matches;
        }
      }
      
      return {
        recommendation: data.aiRecommendation || 'No recommendation available yet.',
        suggestedItems: suggestedItems.length > 0 ? suggestedItems : ['Protein Quinoa Bowl', 'Garden Fresh Salad']
      };
    } catch (error) {
      console.error('Error getting diet recommendation:', error);
      throw error;
    }
  }
  
  export async function getMenuRecommendations(preferences = [], dietaryRequirements = [], mealType = 'any') {
    try {
      const response = await fetch('/api/menu-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences,
          dietaryRequirements,
          mealType
        }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error getting AI menu recommendations:', error);
      throw error;
    }
  }