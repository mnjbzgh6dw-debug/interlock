/**
 * The certificate. Brief section 11: this industry's currency is the document
 * in the machine compartment, and if the output looks like a web page the room
 * quietly discounts everything else.
 */

import { ANCHOR } from '../anchors'
import { TOUR_INSPECTION_ID, issuedReport } from '../preconditions'
import type { TourStep } from '../types'

export function reportSteps(): TourStep[] {
  const base = { persona: 'inspector' as const, route: `/inspection/${TOUR_INSPECTION_ID}/report` }
  return [
    {
      ...base,
      precondition: issuedReport,
      id: 'report-letterhead',
      anchor: ANCHOR.reportLetterhead,
      dim: false,
      title: 'Day 0, 09:15 — the certificate',
      body: 'Not an app screen with a download button. The letterhead carries the inspection firm, its accreditation number and the verification code, because this is the document that sits in a steel cabinet for ten years.',
    },
    {
      ...base,
      precondition: issuedReport,
      id: 'report-items',
      anchor: ANCHOR.reportSection('A'),
      dim: false,
      title: 'Every item, every response, every reading',
      body: 'All thirty items print with their clause, what was measured and the result. An item nobody answered prints as not recorded rather than quietly passing, because a certificate that hides its gaps is worse than one that shows them.',
    },
    {
      ...base,
      precondition: issuedReport,
      id: 'report-defects',
      anchor: ANCHOR.reportDefects,
      dim: false,
      title: 'The defect schedule',
      body: 'Severity, the party who carries it and the date it falls due, plus the stop-use notice while an immediate defect stands. This is the page a building owner is actually sent.',
    },
    {
      ...base,
      precondition: issuedReport,
      id: 'report-certification',
      anchor: ANCHOR.reportCertification,
      dim: false,
      title: 'Signed by a named, registered person',
      body: 'Each section carries its own signature and the certification carries the final one, with the registration number and the date. On paper this is the part that means anything.',
    },
    {
      ...base,
      precondition: issuedReport,
      id: 'report-verification',
      anchor: ANCHOR.reportVerification,
      dim: false,
      title: 'A code and a QR anyone can check',
      body: 'Scanning it opens a minimal public record: the lift, the date, the inspector, and whether the lift may be used. It costs almost nothing and it is the difference between a printout and a certificate.',
    },
    {
      ...base,
      precondition: issuedReport,
      id: 'report-print',
      anchor: ANCHOR.reportPrint,
      dim: false,
      title: 'Four pages of A4',
      body: 'A print stylesheet, not a PDF library: hairline rules, no app chrome, and page breaks that never split an item. Print it and the app disappears entirely.',
      interactive: true,
    },
  ]
}
