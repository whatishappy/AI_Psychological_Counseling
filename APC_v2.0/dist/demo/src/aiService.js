"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIModelType = void 0;
exports.callAIModel = callAIModel;
const axios_1 = __importDefault(require("axios"));
/**
 * AI模型调用服务
 * 提供统一接口调用各种AI大模型
 */
// AI模型类型枚举
var AIModelType;
(function (AIModelType) {
    AIModelType["QWEN"] = "qwen";
    AIModelType["GLM"] = "glm";
    AIModelType["GLM_4V"] = "glm-4v";
    AIModelType["MOCK"] = "mock";
})(AIModelType || (exports.AIModelType = AIModelType = {}));
/**
 * 调用AI模型API的函数
 * @param prompt 用户输入的提示
 * @param modelType 模型类型
 * @returns Promise<AIResponse> AI模型的响应
 */
async function callAIModel(prompt, modelType = AIModelType.MOCK) {
    try {
        switch (modelType) {
            case AIModelType.QWEN:
                return await callQwenModel(prompt);
            case AIModelType.GLM:
                return await callGLMModel(prompt);
            case AIModelType.GLM_4V:
                return await callGLM4VModel(prompt);
            case AIModelType.MOCK:
            default:
                return callMockModel(prompt);
        }
    }
    catch (error) {
        console.error('AI模型调用错误:', error);
        // 出错时返回默认回复
        return {
            response: '抱歉，我现在无法很好地处理你的问题。请稍后再试，或者联系人工心理咨询服务。',
            model: 'error'
        };
    }
}
/**
 * 调用通义千问模型
 * @param prompt 用户输入的提示
 * @returns Promise<AIResponse> AI模型的响应
 */
async function callQwenModel(prompt) {
    let apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
        // 检查是否有备用环境变量
        apiKey = process.env.QWEN_API_KEY;
        if (!apiKey) {
            throw new Error('未配置DASHSCOPE_API_KEY或QWEN_API_KEY环境变量');
        }
    }
    const response = await axios_1.default.post('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        model: 'qwen-plus',
        input: {
            prompt: `你是一个专业的心理医生，正在为用户提供心理咨询服务。请针对以下问题给出专业且人性化的回复：${prompt}`
        },
        parameters: {
            max_tokens: 1500,
            temperature: 0.8,
            top_p: 0.8
        }
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
    return {
        response: response.data.output.text,
        model: 'qwen'
    };
}
/**
 * 调用GLM模型（GLM-4）
 * @param prompt 用户输入的提示
 * @returns Promise<AIResponse> AI模型的响应
 */
async function callGLMModel(prompt) {
    // 这里应该替换成实际的GLM模型API调用
    // 示例使用Zhipu AI的API（需要配置API Key）
    let apiKey = process.env.ZHIPUAI_API_KEY;
    if (!apiKey) {
        // 检查是否有备用环境变量
        apiKey = process.env.GLM_API_KEY;
        if (!apiKey) {
            throw new Error('未配置ZHIPUAI_API_KEY或GLM_API_KEY环境变量');
        }
    }
    // 注意：以下代码需要根据实际的GLM API文档进行调整
    const response = await axios_1.default.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        model: 'glm-4', // 使用的GLM模型版本
        messages: [
            {
                role: 'system',
                content: '你是一个专业的心理医生，正在为用户提供心理咨询服务。请给出专业且人性化的回复。'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 1500,
        temperature: 0.8,
        top_p: 0.8
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
    return {
        response: response.data.choices[0].message.content,
        model: 'glm'
    };
}
/**
 * 调用GLM-4.5V模型（视觉语言模型）
 * @param prompt 用户输入的提示
 * @returns Promise<AIResponse> AI模型的响应
 */
async function callGLM4VModel(prompt) {
    let apiKey = process.env.ZHIPUAI_API_KEY;
    if (!apiKey) {
        // 检查是否有备用环境变量
        apiKey = process.env.GLM_API_KEY;
        if (!apiKey) {
            throw new Error('未配置ZHIPUAI_API_KEY或GLM_API_KEY环境变量');
        }
    }
    // GLM-4.5V 模型API调用
    const response = await axios_1.default.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        model: 'glm-4.5-vision', // 使用GLM-4.5V模型
        messages: [
            {
                role: 'system',
                content: '你是一个专业的心理医生，正在为用户提供心理咨询服务。请给出专业且人性化的回复。'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 1500,
        temperature: 0.8,
        top_p: 0.8
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
    return {
        response: response.data.choices[0].message.content,
        model: 'glm-4.5-vision'
    };
}
/**
 * 模拟AI模型回复（用于开发和测试）
 * @param prompt 用户输入的提示
 * @returns AIResponse 模拟的AI模型响应
 */
function callMockModel(prompt) {
    // 模拟延迟
    // await new Promise(resolve => setTimeout(resolve, 1000));
    const mockResponses = [
        `我理解你关于"${prompt}"的想法。作为你的AI心理咨询师，我想进一步了解你的感受。你能告诉我更多相关的细节吗？`,
        `感谢你分享关于"${prompt}"的情况。这个问题确实值得关注，让我们一起探讨一下可能的解决方法。`,
        `关于"${prompt}"，我听到你内心的困扰。可以和我详细说说具体发生了什么吗？`,
        `你提到"${prompt}"，这是一个很重要的问题。在进一步讨论之前，我想了解这对你造成了怎样的影响？`
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    return {
        response: randomResponse,
        model: 'mock'
    };
}
