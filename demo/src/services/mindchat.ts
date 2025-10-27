import axios from 'axios';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const API_BASE = process.env.MINDCHAT_API_BASE || 'https://api.modelscope.cn/v1';
const API_KEY = process.env.MINDCHAT_API_KEY || '';
const MODEL = process.env.MINDCHAT_MODEL || 'mindchat';

export async function chatWithMindChat(messages: ChatMessage[], options?: { temperature?: number; max_tokens?: number }) {
    if (!API_KEY) throw new Error('MINDCHAT_API_KEY missing');

    // Generic OpenAI-compatible payload; adjust to vendor spec if needed
    const payload = {
        model: MODEL,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 512
    };

    const resp = await axios.post(`${API_BASE}/chat/completions`, payload, {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        timeout: 20000
    });

    const text = resp.data?.choices?.[0]?.message?.content ?? '';
    return text as string;
}


