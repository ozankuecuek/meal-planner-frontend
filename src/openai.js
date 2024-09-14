const functions = require('firebase-functions');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: functions.config().openai.apikey,
});
const openai = new OpenAIApi(configuration);

exports.generateRecipe = functions.https.onCall(async (data, context) => {
  try {
    const prompt = `Generate a recipe for ${data.dish} with the following ingredients: ${data.ingredients.join(', ')}`;
    
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      recipe: response.data.choices[0].text.trim(),
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate recipe');
  }
});
