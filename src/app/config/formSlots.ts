/**
 * 表单槽位集中声明
 *
 * 每条记录描述一个"AI 助手能识别的填写目标"。
 * 表单打开时通过 useFormSlots 自动从该文件取对应的元数据，
 * 实际 setter/getter 由 useFormSlots 在表单组件里挂载。
 *
 * 命名规范：
 *   key 格式: "{ComponentName}/{action}"，例如 "AIAssistantConfig/new"
 *   slotKey  在同一表单内唯一，AI 通过这个 key 匹配
 */

export type SlotType = 'string' | 'number' | 'enum' | 'phone' | 'date' | 'boolean';

export interface FormSlot {
  /** 唯一 key，AI 通过这个 key 匹配 */
  slotKey: string;
  /** 中文标签，AI 用来理解字段含义 */
  label: string;
  /** 字段类型，用于校验和提示 */
  type: SlotType;
  /** 是否必填，AI 用来识别"必须问用户拿" */
  required?: boolean;
  /** 枚举型字段的选项 */
  options?: string[];
  /** 字段描述，给 AI 看的更多上下文 */
  description?: string;
  /** 同名字段在不同分组里有不同语义时用 group 区分 */
  group?: string;
}

/**
 * 集中声明所有可被 AI 填写的表单槽位
 */
export const FORM_SLOTS: Record<string, FormSlot[]> = {
  // ============== AI 助手配置 ==============
  'AIAssistantConfig/new': [
    {
      slotKey: 'name',
      label: '名称',
      type: 'string',
      required: true,
      description: 'AI 助手的展示名称，例如"本体查询助手"',
    },
    {
      slotKey: 'platform',
      label: '平台',
      type: 'enum',
      required: true,
      options: ['Dify', '星辰平台', '星智平台'],
    },
    {
      slotKey: 'url',
      label: 'API 地址',
      type: 'string',
      required: true,
      description: '完整的 API 基础地址，以 /v1 结尾',
    },
    {
      slotKey: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      description: '形如 app-xxx 的密钥',
    },
  ],
  // 编辑模式：必填项放宽（编辑时 url/apiKey 可保持原值）
  'AIAssistantConfig/edit': [
    { slotKey: 'name', label: '名称', type: 'string', required: true },
    {
      slotKey: 'platform',
      label: '平台',
      type: 'enum',
      options: ['Dify', '星辰平台', '星智平台'],
    },
  ],
};

/**
 * 列出所有已注册的 formId，供 Dify 智能体 prompt 注入用
 */
export function listAllFormIds(): string[] {
  return Object.keys(FORM_SLOTS);
}

/**
 * 根据 formId 查表，未注册时返回空数组（避免上层判空）
 */
export function getFormSlots(formId: string): FormSlot[] {
  return FORM_SLOTS[formId] || [];
}
