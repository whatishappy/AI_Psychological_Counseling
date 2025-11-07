import axios from 'axios';

/**
 * AI模型调用服务
 * 提供统一接口调用各种AI大模型
 */

// AI模型类型枚举
export enum AIModelType {
  QWEN = 'qwen',
  GLM = 'glm',
  GLM_4V = 'glm-4v',
  MOCK = 'mock'
}

// AI服务接口
export interface AIResponse {
  response: string;
  model: string;
}

// 消息类型接口
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{type: 'text' | 'image_url', text?: string, image_url?: {url: string}}>;
}

/**
 * 调用AI模型API的函数
 * @param prompt 用户输入的提示
 * @param modelType 模型类型
 * @returns Promise<AIResponse> AI模型的响应
 */
export async function callAIModel(prompt: string, modelType: AIModelType = AIModelType.MOCK): Promise<AIResponse> {
  try {
    console.log('调用AI模型:', { prompt, modelType });
    
    switch (modelType) {
      case AIModelType.QWEN:
        console.log('选择Qwen模型');
        return await callQwenModel(prompt);
      case AIModelType.GLM:
        console.log('选择GLM模型');
        return await callGLMModel(prompt);
      case AIModelType.GLM_4V:
        console.log('选择GLM-4V模型');
        return await callGLM4VModel(prompt);
      case AIModelType.MOCK:
      default:
        console.log('选择MOCK模型');
        return callMockModel(prompt);
    }
  } catch (error) {
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
async function callQwenModel(prompt: string): Promise<AIResponse> {
  let apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    // 检查是否有备用环境变量
    apiKey = process.env.QWEN_API_KEY;
    if (!apiKey) {
      throw new Error('未配置DASHSCOPE_API_KEY或QWEN_API_KEY环境变量');
    }
  }

  const response = await axios.post(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    {
      model: 'qwen-plus',
      input: {
        prompt: `你是一个专业的心理医生，正在为用户提供心理咨询服务。请针对以下问题给出专业且人性化的回复：${prompt}`
      },
      parameters: {
        max_tokens: 1500,
        temperature: 0.8,
        top_p: 0.8
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

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
async function callGLMModel(prompt: string): Promise<AIResponse> {
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

  console.log('使用API密钥调用GLM模型');

  // 注意：以下代码需要根据实际的GLM API文档进行调整
  const response = await axios.post(
    'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    {
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
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('GLM模型响应状态:', response.status);

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
async function callGLM4VModel(prompt: string): Promise<AIResponse> {
  let apiKey = process.env.ZHIPUAI_API_KEY;
  if (!apiKey) {
    // 检查是否有备用环境变量
    apiKey = process.env.GLM_API_KEY;
    if (!apiKey) {
      throw new Error('未配置ZHIPUAI_API_KEY或GLM_API_KEY环境变量');
    }
  }

  // GLM-4.5V 模型API调用
  const response = await axios.post(
    'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    {
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
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

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
function callMockModel(prompt: string): AIResponse {
  // 模拟延迟
  // await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 根据用户输入的关键词提供更相关的回复
  const lowerPrompt = prompt.toLowerCase();
  
  // 情绪相关关键词
  if (lowerPrompt.includes('焦虑') || lowerPrompt.includes('紧张') || lowerPrompt.includes('担心')) {
    const responses = [
      `我注意到你提到了"${prompt}"相关的感受。焦虑是很多人都会经历的情绪，你并不孤单。可以和我详细说说是什么让你感到焦虑吗？`,
      `关于"${prompt}"，我理解这种感受会让人不舒服。你愿意分享一下最近有什么特别的事情引发了这种感觉吗？`,
      `你提到"${prompt}"，这确实是一个值得关注的问题。让我们一起探索一些缓解焦虑的方法。你通常在什么情况下感到特别焦虑？`
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      model: 'mock-anxiety'
    };
  }
  
  // 压力相关关键词
  if (lowerPrompt.includes('压力') || lowerPrompt.includes('累') || lowerPrompt.includes('疲惫')) {
    const responses = [
      `听起来你正在经历"${prompt}"带来的困扰。现代生活节奏快，压力是普遍存在的。你愿意告诉我压力主要来自哪些方面吗？`,
      `关于"${prompt}"，我想了解它是如何影响你的日常生活和工作的。你有没有尝试过一些减压的方法？`,
      `你提到"${prompt}"，这确实需要认真对待。我们可以一起探讨一些有效的压力管理技巧。你目前最困扰你的是什么？`
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      model: 'mock-stress'
    };
  }
  
  // 睡眠相关关键词
  if (lowerPrompt.includes('失眠') || lowerPrompt.includes('睡不着') || lowerPrompt.includes('睡眠')) {
    const responses = [
      `睡眠问题"${prompt}"确实会影响生活质量。你通常在什么时间难以入睡？有没有特定的原因导致你睡不着？`,
      `关于"${prompt}"，我想了解你的睡眠模式。你平均每晚能睡几个小时？醒来后感觉如何？`,
      `你提到"${prompt}"，这是很多人都会遇到的问题。我们可以一起探讨一些改善睡眠质量的方法。你最近的作息规律吗？`
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      model: 'mock-sleep'
    };
  }
  
  // 人际关系相关关键词
  if (lowerPrompt.includes('朋友') || lowerPrompt.includes('家人') || lowerPrompt.includes('关系')) {
    const responses = [
      `人际关系"${prompt}"对我们的心理健康很重要。你能描述一下具体发生了什么吗？`,
      `关于"${prompt}"，我想了解你在这段关系中的感受。你觉得问题主要出在哪里？`,
      `你提到"${prompt}"，这确实需要耐心处理。你有没有尝试和对方沟通你的感受？`
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      model: 'mock-relationship'
    };
  }
  
  // 通用回复（更丰富多样）
  const mockResponses = [
    `我理解你关于"${prompt}"的想法。作为你的AI心理咨询师，我想进一步了解你的感受。你能告诉我更多相关的细节吗？`,
    `感谢你分享关于"${prompt}"的情况。这个问题确实值得关注，让我们一起探讨一下可能的解决方法。`,
    `关于"${prompt}"，我听到你内心的困扰。可以和我详细说说具体发生了什么吗？`,
    `你提到"${prompt}"，这是一个很重要的问题。在进一步讨论之前，我想了解这对你造成了怎样的影响？`,
    `谢谢你愿意谈论"${prompt}"。为了更好地帮助你，我想知道这种情况持续多长时间了？`,
    `"${prompt}"确实是值得深入探讨的话题。你觉得这个问题在你的生活中扮演了怎样的角色？`,
    `我注意到你对"${prompt}"有些困扰。你希望从这次咨询中得到什么样的帮助？`,
    `关于"${prompt}"，我想了解它对你的日常生活产生了哪些具体影响？`
  ];
  
  const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  return {
    response: randomResponse,
    model: 'mock'
  };
}
