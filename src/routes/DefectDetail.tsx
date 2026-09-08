/**
 * One defect, opened from the worklist. Brief section 10.9.
 *
 * Closure needs both a photograph and a signature, because the whole point of
 * the loop is that the obligation was met by a named party with proof, not
 * ticked off. The reminder history is computed on the way in and rendered
 * inline: there is no outbox screen, because a screen full of invented emails
 * invites scrutiny of the emails.
 */

import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { PhotoCapture } from '../components/PhotoCapture'
import { SignaturePad } from '../components/SignaturePad'
import { StatusPill } from '../components/StatusPill'
import { StopUseNotice } from '../components/StopUseNotice'
import { formItems } from '../data/form-passenger-a'
import { personaById } from '../data/personas'
import { countdownLabel } from '../lib/compliance'
import { RESPONSIBILITY_LABEL, SEVERITY_LABEL, SEVERITY_MEANING } from '../lib/defects'
import { demoTimestamp, formatDay } from '../lib/dates'
import { reminderRecipients, remindersFor } from '../lib/reminders'
import {
  buildingFor,
  canClose,
  stopUseDefects,
  isOverdue,
  liftById,
  responsiblePartyName,
  serviceCompanyFor,
} from '../state/selectors'
import { useStore } from '../state/useStore'
import { ANCHOR, tourAnchor } from '../tour/anchors'

export default function DefectDetail() {
  const { defectId } = useParams()
  const navigate = useNavigate()
  const { state, saveDefect, saveLift } = useStore()
  const [evidence, setEvidence] = useState<string | undefined>(undefined)
  const [signature, setSignature] = useState<string | null>(null)

  const defect = state.defects.find((d) => d.id === defectId)
  const lift = defect ? liftById(state, defect.liftId) : undefined
  const persona = personaById.get(state.persona)!

  if (!defect || !lift) {
    return (
      <div className="min-h-dvh bg-paper">
        <AppHeader />
        <main className="mx-auto max-w-[560px] px-4 pt-6">
          <h1 className="text-25 font-semibold">Defect not found</h1>
          <p className="mt-2 text-17">
            That defect is not on record.{' '}
            <Link to="/worklist" className="text-signal underline">
              Open the worklist
            </Link>
            .
          </p>
        </main>
      </div>
    )
  }

  const building = buildingFor(lift)
  const company = serviceCompanyFor(lift)
  const item = formItems.get(defect.itemId)
  const overdue = isOverdue(defect, state.demoDate)
  const reminders = remindersFor(
    defect,
    state.demoDate,
    reminderRecipients(defect, building, company),
  )
  const mine = canClose(defect, persona)
  const ready = Boolean(evidence && signature)

  function close() {
    if (!evidence || !signature) return
    saveDefect({
      ...defect!,
      status: 'closed',
      evidencePhoto: evidence,
      closureSignature: signature,
      closedBy: `${persona.name}, ${persona.organisation}`,
      closedAt: demoTimestamp(state.demoDate),
    })

    /**
     * Closing the last open immediate defect lifts the stop-use order. Nothing
     * moves until it's closed, and once it is closed the lift is released.
     */
    if (defect!.severity === 'immediate') {
      const othersOutstanding = state.defects.some(
        (other) =>
          other.id !== defect!.id &&
          other.liftId === lift!.id &&
          other.status === 'open' &&
          other.severity === 'immediate',
      )
      if (!othersOutstanding && lift!.stopUseInForce) {
        saveLift({ ...lift!, stopUseInForce: false })
      }
    }

    navigate('/worklist')
  }

  return (
    <div className="min-h-dvh bg-paper pb-28">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pt-5">
        <Link to="/worklist" className="inline-flex items-center gap-1 text-15 text-signal">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Worklist
        </Link>

        <h1 className="mt-2 text-25 font-semibold">{defect.description}</h1>
        <p className="mt-1 text-17">
          {lift.label}, {building.name}
        </p>
        <p className="font-mono text-15">{lift.officialNumber}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusPill tone={defect.severity === 'immediate' ? 'stop' : 'open'}>
            {SEVERITY_LABEL[defect.severity]}
          </StatusPill>
          {defect.status === 'closed' ? (
            <StatusPill tone="verified">Closed</StatusPill>
          ) : overdue ? (
            <StatusPill tone="stop">{countdownLabel(state.demoDate, defect.dueDate)}</StatusPill>
          ) : (
            <StatusPill tone="open">{countdownLabel(state.demoDate, defect.dueDate)}</StatusPill>
          )}
        </div>

        {lift.stopUseInForce && (
          <div className="mt-4">
            <StopUseNotice defects={stopUseDefects(state, lift.id)} />
          </div>
        )}

        <dl
          {...tourAnchor(ANCHOR.defectIdentity)}
          className="mt-4 divide-y divide-rail rounded-card border border-rail bg-white px-4"
        >
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Checklist item</dt>
            <dd className="text-right text-17">
              {defect.itemId} &middot; {item?.clauseRef}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Requirement</dt>
            <dd className="text-right text-17">{item?.text}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Raised</dt>
            <dd className="text-right text-17">{formatDay(defect.raisedDate)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Due</dt>
            <dd className="text-right text-17">{formatDay(defect.dueDate)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Responsibility</dt>
            <dd className="text-right text-17">
              {RESPONSIBILITY_LABEL[defect.responsibility]}
              <span className="block text-15">
                {responsiblePartyName(state, defect)}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Obligation</dt>
            <dd className="text-right text-17">{SEVERITY_MEANING[defect.severity]}</dd>
          </div>
        </dl>

        {defect.raisedPhoto && (
          <section className="mt-6" {...tourAnchor(ANCHOR.defectRaisedPhoto)}>
            <h2 className="text-20 font-medium">Photograph at inspection</h2>
            <img
              src={defect.raisedPhoto}
              alt={`Photograph of ${defect.description.toLowerCase()} at inspection`}
              className="mt-2 w-full rounded-card border border-rail"
            />
          </section>
        )}

        {/* Brief 7.2: computed on the way in, rendered inline, never stored. */}
        <section className="mt-6" {...tourAnchor(ANCHOR.defectReminders)}>
          <h2 className="text-20 font-medium">Reminder history</h2>
          {reminders.length === 0 ? (
            <p className="mt-1 text-17">
              {defect.severity === 'immediate'
                ? 'Notified once, when the stop-use order was raised. Immediate defects are not chased on a schedule.'
                : defect.severity === 'nextInspection'
                  ? 'Recorded against the next inspection. Not chased.'
                  : 'The first reminder goes out 7 days before the due date.'}
            </p>
          ) : (
            <>
              <p className="mt-1 text-15 text-slate">
                {reminders.length} {reminders.length === 1 ? 'reminder' : 'reminders'}, most
                recent first
              </p>
              <ul className="mt-2 divide-y divide-rail border-y border-rail">
                {reminders.map((reminder) => (
                  <li key={reminder.date} className="py-2">
                    <p className="text-17">
                      {formatDay(reminder.date)}
                      <span className="text-15"> &middot; {reminder.reason}</span>
                    </p>
                    <p className="text-15">{reminder.recipients.join(', ')}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-15 text-slate">
                Recorded in this app only. Nothing is sent.
              </p>
            </>
          )}
        </section>

        {defect.status === 'closed' ? (
          <section className="mt-6">
            <h2 className="text-20 font-medium">Closure</h2>
            <div className="mt-2 rounded-card border border-verified bg-verified-tint p-3">
              <p className="text-17 text-verified">Defect closed</p>
              <p className="text-15">{defect.closedBy}</p>
              <p className="text-15">
                {defect.closedAt ? formatDay(defect.closedAt.slice(0, 10)) : ''}
                {defect.closedAt ? ` at ${defect.closedAt.slice(11, 16)}` : ''}
              </p>
            </div>
            {defect.evidencePhoto && (
              <img
                src={defect.evidencePhoto}
                alt="Evidence of rectification"
                className="mt-3 w-full rounded-card border border-rail"
              />
            )}
            {defect.closureSignature && (
              <div className="mt-3">
                <p className="text-13 font-medium text-slate">Signed</p>
                <img
                  src={defect.closureSignature}
                  alt="Closure signature"
                  className="mt-1 h-20 rounded-card border border-rail bg-white p-2"
                />
              </div>
            )}
          </section>
        ) : mine ? (
          <section className="mt-6" {...tourAnchor(ANCHOR.defectClosure)}>
            <h2 className="text-20 font-medium">Close this defect</h2>
            <p className="mt-1 text-17">
              Attach a photograph of the rectified condition and sign.
            </p>
            <PhotoCapture
              label="the rectified condition"
              required
              value={evidence}
              onChange={setEvidence}
            />
            <div className="mt-4">
              <SignaturePad
                label={`Signature, ${persona.name}`}
                value={signature}
                onChange={setSignature}
              />
            </div>
          </section>
        ) : (
          <section className="mt-6">
            <h2 className="text-20 font-medium">Closure</h2>
            <p className="mt-1 text-17">
              This defect is assigned to {responsiblePartyName(state, defect)} and is theirs to
              close. It is on your list because you carry the machine.
            </p>
          </section>
        )}
      </main>

      {defect.status === 'open' && mine && (
        <div
          {...tourAnchor(ANCHOR.defectAction)}
          className="fixed inset-x-0 bottom-0 border-t border-rail bg-white"
        >
          <div className="mx-auto max-w-[560px] px-4 py-3">
            {!ready && (
              <p className="mb-2 text-15 text-slate">
                {evidence ? 'Sign above to close.' : 'A photograph and a signature are needed.'}
              </p>
            )}
            <button
              type="button"
              onClick={close}
              disabled={!ready}
              className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white disabled:bg-rail disabled:text-slate"
            >
              Close defect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
