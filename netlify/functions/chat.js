const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event, context) => {
  const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!API_KEY) {
    console.error('CRITICAL: API Key is missing');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SERVER_CONFIG_ERROR: API Key is missing' })
    };
  }
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);
    
    // Initialize Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const modelName = "gemini-2.5-flash-lite";

    // 프롬프트 구성 (메시지 배열을 하나의 문자열로 합침)
    const prompt = messages.map(msg => {
      const role = msg.role === 'system' ? 'Instruction' : (msg.role === 'assistant' ? 'AI' : 'User');
      return `${role}: ${msg.content}`;
    }).join('\n') + '\nAI: ';

    console.log(`Sending content to @google/genai SDK (${modelName})...`);
    
    const result = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    // 응답 텍스트 추출
    const text = result.text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        choices: [
          {
            message: {
              content: text
            }
          }
        ]
      })
    };

  } catch (error) {
    console.error('@google/genai SDK Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'INTERNAL_SERVER_ERROR', 
        message: error.message 
      })
    };
  }
};
