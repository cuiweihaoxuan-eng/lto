/**
 * 表单槽位声明 Hook
 *
 * 用法（在表单组件内，当弹窗打开时调用）：
 *   useFormSlots({
 *     formId: 'AIAssistantConfig/new',
 *     formTitle: '新增AI助手配置',
 *     enabled: isModalOpen,        // 弹窗打开时才注册
 *     slots: [
 *       { slotKey: 'name', get: () => form.name, set: v => setForm({...form, name: v as string}) },
 *       ...
 *     ]
 *   });
 *
 * 设计要点：
 *   1. 用 ref 持有最新 getter/setter，避免闭包过期
 *   2. 静态元数据从 formSlots.ts 读，运行时数据（当前值）从 slots.get() 读
 *   3. 卸载时自动从 registry 注销
 */

import { useEffect, useRef } from 'react';
import { FORM_SLOTS } from '../config/formSlots';
import {
  formSlotRegistry,
  type ActiveForm,
  type FormSlotAction,
  type ApplyResult,
} from '../utils/formSlotRegistry';

interface UseFormSlotsOptions {
  /** 唯一 ID，格式 "ComponentName/action" */
  formId: string;
  /** 弹窗标题，给 AI 看 */
  formTitle: string;
  /** 是否启用（弹窗打开时启用，关闭时禁用，避免读到旧表单） */
  enabled: boolean;
  /** 实际 getter/setter */
  slots: Array<{
    slotKey: string;
    get: () => unknown;
    set: (value: unknown) => void;
  }>;
}

export function useFormSlots({ formId, formTitle, enabled, slots }: UseFormSlotsOptions) {
  // 用 ref 持有最新的 getter/setter，避免闭包过期
  const slotsRef = useRef(slots);
  slotsRef.current = slots;

  // 静态元数据从 formSlots.ts 取
  const slotMeta = FORM_SLOTS[formId] || [];

  useEffect(() => {
    if (!enabled) {
      // 弹窗关闭时清理
      formSlotRegistry.unregister(formId);
      formSlotRegistry.clearHandler(formId);
      return;
    }

    // 把 handler 注册到 registry，apply() 时由 registry 调它
    const handler = (actions: FormSlotAction[]): ApplyResult => {
      const success: FormSlotAction[] = [];
      const failed: Array<{ slotKey: string; reason: string }> = [];

      for (const action of actions) {
        const slot = slotsRef.current.find(s => s.slotKey === action.slotKey);
        if (!slot) {
          failed.push({ slotKey: action.slotKey, reason: '该表单没有此槽位' });
          continue;
        }
        try {
          slot.set(action.value);
          success.push(action);
        } catch (e) {
          const reason = e instanceof Error ? e.message : '写入失败';
          failed.push({ slotKey: action.slotKey, reason });
        }
      }
      return { success, failed };
    };
    formSlotRegistry.setHandler(formId, handler);

    // 注册当前激活表单
    const buildActiveForm = (): ActiveForm => ({
      formId,
      formTitle,
      slots: slotMeta.map(meta => ({
        ...meta,
        currentValue: slotsRef.current.find(s => s.slotKey === meta.slotKey)?.get(),
      })),
    });

    formSlotRegistry.register(buildActiveForm());

    // 检查 sessionStorage 是否有待应用的 actions（解决"一次性说打开+填值"场景）
    try {
      const pending = sessionStorage.getItem('__pendingFormActions');
      if (pending) {
        const parsed = JSON.parse(pending);
        // 5 分钟内的才应用，避免过期污染
        if (Date.now() - (parsed.timestamp || 0) < 5 * 60 * 1000) {
          console.log('[useFormSlots] 检测到待应用 actions，自动 apply:', parsed.actions);
          const result = handler(parsed.actions);
          console.log('[useFormSlots] 延迟 apply 结果:', result);
        }
        sessionStorage.removeItem('__pendingFormActions');
      }
    } catch (e) {
      console.warn('[useFormSlots] 检查 sessionStorage 失败:', e);
    }

    return () => {
      formSlotRegistry.unregister(formId);
      formSlotRegistry.clearHandler(formId);
    };
  }, [formId, formTitle, enabled]);
}
