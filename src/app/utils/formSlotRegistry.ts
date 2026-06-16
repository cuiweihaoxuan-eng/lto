/**
 * 表单槽位注册中心 - 全局单例
 *
 * - 维护"当前激活表单 + 它的可填槽位"
 * - 提供 apply() 方法给 AISidebar 调用，把 AI 返回的值写回表单
 * - 通过 CustomEvent 与 AISidebar 通信，避免循环依赖
 *
 * 设计原则：
 *   1. 单例挂在 window.formSlotRegistry 方便调试（DevTools 可直接看）
 *   2. 实际的 set 逻辑由 useFormSlots 注入，避免本文件反向依赖 React
 *   3. 事件用 form-slot: 前缀，避免与其他业务事件冲突
 */

import type { FormSlot } from '../config/formSlots';

/** 当前激活表单的完整快照，给 AI 看的 */
export interface ActiveForm {
  formId: string;
  formTitle: string;
  /** 槽位列表 + 当前值，AI 用来生成 reply */
  slots: Array<FormSlot & { currentValue: unknown }>;
}

/** AI 返回的写入指令 */
export interface FormSlotAction {
  slotKey: string;
  value: unknown;
}

/** apply() 的返回结果 */
export interface ApplyResult {
  success: FormSlotAction[];
  failed: Array<{ slotKey: string; reason: string }>;
}

/** useFormSlots 注入的 setter 处理器 */
type ApplyHandler = (actions: FormSlotAction[]) => ApplyResult;

/** 事件名常量（导出方便订阅方使用） */
export const EVENT_FORM_CHANGED = 'form-slot:form-changed';
export const EVENT_FORM_ACTIONS = 'form-slot:apply-actions';
export const EVENT_OPEN_MODAL = 'open-modal';
/** 兼容 AIAssistantConfig 监听的事件名（保持原有风格） */
export const EVENT_OPEN_MODAL_LEGACY = 'open-modal';

class FormSlotRegistry {
  private current: ActiveForm | null = null;
  /** key = formId，value = 该表单注入的 set 处理器 */
  private handlers: Map<string, ApplyHandler> = new Map();

  /**
   * 表单挂载时调用（由 useFormSlots 内部调用）
   */
  register(form: ActiveForm) {
    this.current = form;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_FORM_CHANGED, { detail: form }));
    }
  }

  /**
   * 更新当前激活表单的槽位值（不改变 formId，只刷 currentValue）
   * 用于表单内 state 变化时通知订阅方
   */
  refreshCurrentValues() {
    if (!this.current) return;
    const handler = this.handlers.get(this.current.formId);
    if (!handler) return;
    // handler 是 useFormSlots 里的内部函数，可以补一个特殊调用让它重新注册
    // 这里简化处理：直接触发 form-changed 事件让订阅方重新 getActive()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_FORM_CHANGED, { detail: this.current }));
    }
  }

  /**
   * 表单卸载时调用（由 useFormSlots 内部 cleanup 调用）
   */
  unregister(formId: string) {
    if (this.current?.formId === formId) {
      this.current = null;
      this.handlers.delete(formId);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_FORM_CHANGED, { detail: null }));
      }
    }
  }

  /**
   * 由 useFormSlots 调用：注入实际 setter 处理器
   */
  setHandler(formId: string, handler: ApplyHandler) {
    this.handlers.set(formId, handler);
  }

  /**
   * 清除 handler（useFormSlots 卸载时）
   */
  clearHandler(formId: string) {
    this.handlers.delete(formId);
  }

  /**
   * 获取当前激活表单的快照（给 AISidebar / Dify 智能体看）
   */
  getActive(): ActiveForm | null {
    return this.current;
  }

  /**
   * AISidebar 调用：把 AI 返回的 actions 应用到当前表单
   * @returns 写入结果，告知调用方哪些成功 / 哪些失败
   */
  apply(actions: FormSlotAction[]): ApplyResult {
    if (!this.current) {
      return {
        success: [],
        failed: actions.map(a => ({ slotKey: a.slotKey, reason: '没有激活的表单' })),
      };
    }

    const handler = this.handlers.get(this.current.formId);
    if (!handler) {
      return {
        success: [],
        failed: actions.map(a => ({ slotKey: a.slotKey, reason: '当前表单未注册 apply handler' })),
      };
    }

    const result = handler(actions);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_FORM_ACTIONS, { detail: result }));
    }
    return result;
  }
}

export const formSlotRegistry = new FormSlotRegistry();

/** 调试用：暴露到 window，DevTools 里直接 window.formSlotRegistry.getActive() 看 */
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  (window as unknown as { formSlotRegistry: FormSlotRegistry }).formSlotRegistry = formSlotRegistry;
}
