import axios from 'axios';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

// GLM API配置
const API_BASE = process.env.GLM_API_BASE || 'https://open.bigmodel.cn/api/paas/v4';
const API_KEY = process.env.GLM_API_KEY || '5176ce390ab84303aa7dae35d3be6f6a.JqWhdfhvZAhKIJCd'; // 默认使用您提供的API Key
const MODEL = process.env.GLM_MODEL || 'glm-4';
const USE_MOCK = process.env.USE_MOCK === 'true';

// 模拟AI响应函数
function mockAIResponse(messages: ChatMessage[]): string {
    const userMessage = messages.find(msg => msg.role === 'user');
    if (!userMessage) return '你好，我是心理健康顾问。请告诉我你的问题，我会尽力帮助你。';
    
    const content = userMessage.content.toLowerCase();
    if (content.includes('焦虑') || content.includes('紧张')) {
        return '我理解你感到焦虑。可以尝试深呼吸练习：慢慢吸气4秒，保持4秒，再慢慢呼气4秒。重复几次可以帮助缓解紧张情绪。同时建议你每天保持规律作息，适量运动。';
    } else if (content.includes('睡眠') || content.includes('失眠')) {
        return '关于睡眠问题，建议你每天固定时间上床和起床，避免睡前使用电子设备，可以尝试睡前冥想或听轻音乐。保持卧室安静、黑暗和凉爽也很重要。';
    } else {
        return '感谢你分享这些信息。作为心理健康顾问，我建议你每天记录情绪变化，进行适量运动，与信任的朋友或家人保持沟通。如果问题持续，请寻求专业心理咨询师的帮助。';
    }
}

export async function chatWithGLM(messages: ChatMessage[], options?: { temperature?: number; max_tokens?: number }) {
    // 如果启用了模拟模式，直接返回模拟响应
    if (USE_MOCK) {
        console.log('Using mock AI response in development mode');
        return mockAIResponse(messages);
    }

    if (!API_KEY) throw new Error('GLM_API_KEY missing');

    // GLM API 请求载荷格式
    const payload = {
        model: MODEL,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 512
    };

    try {
        const resp = await axios.post(`${API_BASE}/chat/completions`, payload, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 20000
        });

        const text = resp.data?.choices?.[0]?.message?.content ?? '';
        return text as string;
    } catch (error: any) {
        // 提供更详细的错误信息
        if (error.code === 'ENOTFOUND') {
            throw new Error(`无法连接到AI服务: DNS解析失败 (${API_BASE})。请检查网络连接和DNS设置。`);
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error(`无法连接到AI服务: 连接被拒绝 (${API_BASE})。请检查服务是否正常运行。`);
        } else if (error.response) {
            throw new Error(`AI服务返回错误: ${error.response.status} - ${error.response.statusText}`);
        } else {
            throw new Error(`连接AI服务时发生未知错误: ${error.message}`);
        }
    }
}