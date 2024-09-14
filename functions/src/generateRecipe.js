const { onCall } = require("firebase-functions/v2/https");
const { OpenAI } = require('openai');

console.log('Environment variables:', process.env);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateRecipe = onCall(async (request) => {
  try {
    console.log('Generating recipe: Starting');
    const prompt = `Generate a recipe with the following details:
    - Title
    - Ingredients (with quantities and units)
    - Instructions (step by step)
    - Servings
    - Preparation time
    - Cooking time

    Please format the response as a JSON object.`;
    
    console.log('Calling OpenAI API');
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates recipes." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log('OpenAI API response received:', response);
    const generatedRecipe = JSON.parse(response.choices[0].message.content.trim());
    console.log('Generated recipe:', generatedRecipe);
    return generatedRecipe;
  } catch (error) {
    console.error('OpenAI API error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to generate recipe: ${error.message}`);
  }
});

exports.testOpenAI = onCall(async (request) => {
  try {
    console.log('Testing OpenAI API');
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, World!" }
      ],
      max_tokens: 50
    });
    
    console.log('OpenAI API test response:', response);
    return { success: true, message: "OpenAI API test successful", response: response.choices[0].message.content };
  } catch (error) {
    console.error('OpenAI API test error:', error);
    throw new Error(`OpenAI API test failed: ${error.message}`);
  }
});