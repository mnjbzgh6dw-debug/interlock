/**
 * Every `data-tour` value in one place.
 *
 * The app carried no `data-*` attributes and no content ids before this, so all
 * of these are new. The attribute goes on whatever element reads as the thing
 * being explained, which is usually a whole row or a whole card, except where a
 * step acts on the control, in which case it must be the real button or input.
 */

export const ANCHOR = {
  // Chrome
  header: 'header',
  demoPill: 'demo-pill',
  syncIndicator: 'sync-indicator',

  // Register
  registerSearch: 'register-search',
  registerRow: (liftId: string) => `register-row-${liftId}`,
  registerClock: (liftId: string) => `register-clock-${liftId}`,
  registerBuilding: (buildingId: string) => `register-building-${buildingId}`,

  // Lift detail
  liftClock: 'lift-clock',
  liftIdentity: 'lift-identity',
  liftStopUse: 'lift-stop-use',
  liftOpenDefects: 'lift-open-defects',
  liftHistory: 'lift-history',
  liftHistoryAll: 'lift-history-all',
  liftAction: 'lift-action',

  // Lift history
  historyList: 'history-list',
  historyRow: (inspectionId: string) => `history-row-${inspectionId}`,

  // Inspection form
  formBanner: 'form-banner',
  formProgress: 'form-progress',
  formSection: (sectionId: string) => `form-section-${sectionId}`,
  /**
   * Only the current section's items are in the DOM, so a step targeting an
   * item outside the open section must switch to it first, with a click act on
   * `formSection`. The audit catches this as a missing anchor.
   */
  formItem: (itemId: string) => `form-item-${itemId}`,
  formItemClause: (itemId: string) => `form-item-${itemId}-clause`,
  formItemInput: (itemId: string) => `form-item-${itemId}-input`,
  formItemResult: (itemId: string, result: 'pass' | 'fail' | 'na') =>
    `form-item-${itemId}-${result}`,
  formItemPhoto: (itemId: string) => `form-item-${itemId}-photo`,
  formSignature: 'form-signature',
  formAction: 'form-action',

  // Clause sheet
  clauseSheet: 'clause-sheet',
  clauseBack: 'clause-back',

  // Stop-use interstitial
  stopUseHeadline: 'stop-use-headline',
  stopUseRecipients: 'stop-use-recipients',
  stopUseAcknowledge: 'stop-use-acknowledge',

  // Defect review
  reviewCounts: 'review-counts',
  reviewDefect: (defectId: string) => `review-defect-${defectId}`,
  reviewResponsibility: (defectId: string) => `review-responsibility-${defectId}`,
  reviewAction: 'review-action',

  // Sign off
  signOffSummary: 'sign-off-summary',
  signOffInspector: 'sign-off-inspector',
  signOffSignature: 'sign-off-signature',
  signOffAction: 'sign-off-action',

  // Report and addendum
  reportLetterhead: 'report-letterhead',
  reportBanner: 'report-banner',
  reportVerification: 'report-verification',
  reportSection: (sectionId: string) => `report-section-${sectionId}`,
  reportDefects: 'report-defects',
  reportCertification: 'report-certification',
  reportPrint: 'report-print',
  reportAddendumLink: 'report-addendum-link',
  addendumClosed: 'addendum-closed',
  addendumOutstanding: 'addendum-outstanding',

  // Distribution and verification
  distributionList: 'distribution-list',
  distributionSimulated: 'distribution-simulated',
  verifyValidity: 'verify-validity',
  verifyRecord: 'verify-record',

  // Worklist and closure
  worklistSummary: 'worklist-summary',
  worklistRow: (defectId: string) => `worklist-row-${defectId}`,
  worklistPortfolioLink: 'worklist-portfolio-link',
  defectIdentity: 'defect-identity',
  defectRaisedPhoto: 'defect-raised-photo',
  defectReminders: 'defect-reminders',
  defectClosure: 'defect-closure',
  defectAction: 'defect-action',

  // Portfolio
  portfolioFigures: 'portfolio-figures',
  portfolioWhoCarries: 'portfolio-who-carries',
  portfolioLifts: 'portfolio-lifts',
  portfolioObligations: 'portfolio-obligations',
} as const

/** The attribute spread, so call sites read `{...tourAnchor(ANCHOR.x)}`. */
export function tourAnchor(value: string): { 'data-tour': string } {
  return { 'data-tour': value }
}

export function findAnchor(value: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-tour="${value}"]`)
}
