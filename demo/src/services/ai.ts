// Simple AI stub functions; replace with real LLM integration later
import { chatWithGLM } from './glm';

/**
 * 生成心理健康建议（已实现）
 */
export async function generatePsychologicalAdvice(userQuery: string) {
    try {
        // 修复判断逻辑，正确检查GLM_API_KEY环境变量
        const useLLM = !!process.env.GLM_API_KEY && process.env.GLM_API_KEY.trim() !== '';
        if (!useLLM) throw new Error('LLM not configured');
        const system = '你是一名青少年心理健康顾问，请给出温和、具体、可执行的建议，包含情绪调节、作息、社交支持与运动建议，避免医疗诊断。';
        const content = await chatWithGLM([
            { role: 'system', content: system },
            { role: 'user', content: userQuery }
        ]);
        if (content && content.trim().length > 0) return content;
        throw new Error('Empty LLM response');
    } catch (error: any) {
        console.error('AI service error:', error.message);
        // 在开发环境中，提供更明确的提示信息
        if (process.env.NODE_ENV !== 'production') {
            return `【开发模式】基于你的描述，我建议先进行情绪记录与睡眠规律调整。你的问题关键词：${userQuery.slice(0, 80)}... \n\n提示：如果希望连接真实AI服务，请确保：\n1. 网络连接正常\n2. GLM_API_KEY已在.env文件中正确配置\n3. 可以通过命令行访问open.bigmodel.cn`;
        }
        return `基于你的描述，我建议先进行情绪记录与睡眠规律调整。你的问题关键词：${userQuery.slice(0, 80)}...`;
    }
}

/**
 * 根据用户身体数据生成个性化锻炼计划（支持LLM增强）
 */
export async function generateExercisePlan(params: {
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    goals?: string[];
}): Promise<any> {
    try {
        const useLLM = !!process.env.GLM_API_KEY && process.env.GLM_API_KEY.trim() !== '';
        if (!useLLM) throw new Error('LLM not configured');

        const { age, gender, weight, height, goals = [] } = params;
        const system = `你是一名专业青少年体能教练，请根据用户信息制定为期4周的锻炼计划。要求：
- 输出必须是JSON格式，包含 summary, weeks, schedule[], caloriesTarget, pie[]
- schedule中每项包含 week, sessions[day,type,minutes,intensity]
- pie为各训练类型的占比图表数据 {label,value}[]
- 强度intensity取值：low/medium/high
- 目标类型参考：${goals.join(',')}`;

        const userContent = `请为一名${age}岁、${gender}、${weight}kg、${height}cm的青少年制定锻炼计划，主要目标是${goals.join('、')}。`;
        
        const content = await chatWithGLM([
            { role: 'system', content: system },
            { role: 'user', content: userContent }
        ]);

        if (!content?.trim()) throw new Error('Empty response');

        // 尝试解析JSON响应
        let plan = JSON.parse(content.trim());
        return {
            ...plan,
            // 确保关键字段存在
            summary: plan.summary || `面向${age || '未知'}岁的体能提升计划`,
            weeks: plan.weeks || 4,
            caloriesTarget: plan.caloriesTarget || 1500
        };

    } catch (error: any) {
        console.warn('Using fallback exercise plan:', error.message);
        // 降级使用本地stub逻辑
        const { age, weight } = params;
        const weeks = 4;
        return {
            summary: `面向${age || '未知'}岁、体重${weight || '未知'}kg 的基础体能提升计划`,
            weeks,
            schedule: Array.from({ length: weeks }).map((_, i) => ({
                week: i + 1,
                sessions: [
                    { day: 'Mon', type: 'cardio', minutes: 30, intensity: 'low' },
                    { day: 'Wed', type: 'strength', minutes: 40, intensity: 'medium' },
                    { day: 'Fri', type: 'mobility', minutes: 20, intensity: 'low' }
                ]
            })),
            caloriesTarget: 1500,
            pie: [
                { label: '有氧', value: 45 },
                { label: '力量', value: 35 },
                { label: '灵活性', value: 20 }
            ]
        };
    }
}

/**
 * 评估周度心理健康状况
 */
export function assessWeeklyPsych(data: { stress: number; anxiety: number; sleep: number; support: number }) {
    const overall = Math.round((data.sleep + (11 - data.stress) + (11 - data.anxiety) + data.support) / 4);
    return {
        overall,
        recommendations: overall < 6 ? '建议减少学业压力，尝试规律运动与正念练习。' : '保持良好习惯，继续记录情绪变化。'
    };
}

/**
 * 评估周度身体素质状况
 */
export function assessWeeklyPhysical(measures: { cardio: number; strength: number; flexibility: number; endurance: number }) {
    const overall = Math.round((measures.cardio + measures.strength + measures.flexibility + measures.endurance) / 4);
    return {
        overall,
        recommendations: overall < 6 ? '以低强度有氧和基础力量为主，逐步增加训练量。' : '逐步提高强度，并注意恢复与拉伸。'
    };
}