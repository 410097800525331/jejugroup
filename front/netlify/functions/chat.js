const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event, context) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  
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
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Empty body' })
      };
    }
    const { messages } = JSON.parse(event.body);
    
    // AI SDK 초기화 및 프롬프트 생성
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = messages.map(msg => {
      const role = msg.role === 'system' ? 'Instruction' : (msg.role === 'assistant' ? 'AI' : 'User');
      return `${role}: ${msg.content}`;
    }).join('\n') + '\nAI: ';

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
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
    console.error('Gemini SDK Critical Error in Production:', error.message);
    console.error('Stack Trace:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'INTERNAL_SERVER_ERROR', 
        message: error.message,
        debug_info: 'Check Netlify function logs for full stack trace'
      })
    };
  }
};
