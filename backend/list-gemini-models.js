// Listar modelos disponibles de Gemini
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const models = await genAI.listModels();
        console.log('\n📋 Modelos disponibles:\n');
        for (const model of models) {
            console.log(`✅ ${model.name}`);
            console.log(`   Display: ${model.displayName}`);
            console.log(`   Soporta generateContent: ${model.supportedGenerationMethods.includes('generateContent')}`);
            console.log('');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

listModels();
