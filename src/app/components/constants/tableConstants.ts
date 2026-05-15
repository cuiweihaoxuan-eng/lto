/**
 * 表格固定列宽度常量
 * 用于统一管理表格列宽，避免 Magic Numbers
 */

export const TABLE_COL_WIDTHS = {
  // 基础列宽
  CHECKBOX: 50,
  INDEX: 70,
  QUANTITY: 70,
  ACTION: 100,
  STATUS: 80,
  PHONE: 120,
  PURPOSE: 130,

  // 中等列宽
  CODE: 150,
  DATE: 150,
  MANAGER: 140,
  AMOUNT: 140,
  CLAIMANT: 100,
  COST_ELEMENT_CODE: 130,

  // 较大列宽
  NAME: 200,
  CUSTOMER: 160,
  SUMMARY: 150,
  DESCRIPTION: 150,
  PROJECT_CODE: 150,
  BACK_CONTRACT_CODE: 150,
  REIMBURSEMENT_NO: 170,
  MATERIAL_DESC: 220,
  CLAIMANT_ORG: 250,

  // 大列宽
  PROJECT_NAME: 280,
  BACK_CONTRACT_NAME: 200,
  COST_ELEMENT_NAME: 160,
  PURCHASE_VOUCHER_NO: 170,
} as const;

/**
 * 固定列位置配置
 * 用于 sticky left 定位
 */
export const STICKY_COL_LEFT = {
  CHECKBOX: 50,
  INDEX: 40,
  RADIO: 40,
  EXPAND: 50,
  ACTIONS: 60,
} as const;

/**
 * 表格默认最小宽度
 */
export const TABLE_MIN_WIDTH = 2800;