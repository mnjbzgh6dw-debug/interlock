/** The public record behind the QR code. */

import { ANCHOR } from '../anchors'
import { TOUR_VERIFICATION_CODE, issuedReport } from '../preconditions'
import type { TourStep } from '../types'

export function verificationSteps(): TourStep[] {
  const base = {
    persona: 'inspector' as const,
    route: `/verify/${TOUR_VERIFICATION_CODE}`,
  }
  return [
    {
      ...base,
      precondition: issuedReport,
      id: 'verify-validity',
      anchor: ANCHOR.verifyValidity,
      title: 'What a scan tells you',
      body: 'This is what the QR on the certificate opens. The first line is the only one most people need: this lift is not for use, because a stop-use order is in force.',
    },
    {
      ...base,
      precondition: issuedReport,
      id: 'verify-record',
      anchor: ANCHOR.verifyRecord,
      title: 'Enough to trust it, and no more',
      body: 'The lift, its official number, the date, the inspector and their registration, and how many obligations are open. No navigation and no chrome: it is a record, not an app, and anyone with the code can check it.',
    },
  ]
}
