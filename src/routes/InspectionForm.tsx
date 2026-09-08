/**
 * Inspection form. Brief sections 9 and 10.3.
 *
 * The body reads as a document, not a feed of cards: hairline rules, one column,
 * statutory paper heritage. Navigation between sections is free and the progress
 * strip reports completion rather than gating it.
 *
 * The one hard gate is photo-required-on-fail: a failed item that needs a photo
 * holds section navigation until one is attached.
 *
 * Committing a failure on an `immediate` item puts the lift out of use and
 * raises the interstitial, once per failure. The order is in force from the
 * moment of the failure, not from the moment it is acknowledged.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ClauseSheet } from '../components/ClauseSheet'
import { StopUseInterstitial } from '../components/StopUseInterstitial'
import { PhotoCapture } from '../components/PhotoCapture'
import { PlaceholderBanner } from '../components/PlaceholderBanner'
import { SignaturePad } from '../components/SignaturePad'
import { formPassengerA } from '../data/form-passenger-a'
import { notificationRecipients, reconcileDefects } from '../lib/defects'
import { formItems } from '../data/form-passenger-a'
import {
  commitDateCheck,
  commitMeasurement,
  sectionProgress,
  totalAnswered,
  totalItems,
  type Committed,
} from '../lib/inspection'
import { buildingFor, liftById, serviceCompanyFor } from '../state/selectors'
import { useStore } from '../state/useStore'
import type { FormItem, Inspection, ResponseEntry, ResponseResult } from '../types'

const RESULT_LABEL: Record<ResponseResult, string> = {
  pass: 'Pass',
  fail: 'Fail',
  na: 'N/A',
}

/** Solid fills, because a selected state has to be unmistakable in bad light. */
const RESULT_SELECTED: Record<ResponseResult, string> = {
  pass: 'bg-verified text-white border-verified',
  fail: 'bg-stop text-white border-stop',
  na: 'bg-slate text-white border-slate',
}

function ResultChoice({
  item,
  response,
  onSet,
}: {
  item: FormItem
  response: ResponseEntry | undefined
  onSet: (result: ResponseResult | null) => void
}) {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      {(['pass', 'fail', 'na'] as const).map((result) => {
        const selected = response?.result === result
        return (
          <button
            key={result}
            type="button"
            aria-pressed={selected}
            onClick={() => onSet(selected ? null : result)}
            className={`h-tap rounded-card border text-17 font-medium ${
              selected ? RESULT_SELECTED[result] : 'border-rail bg-white'
            }`}
          >
            {RESULT_LABEL[result]}
            <span className="sr-only"> for {item.text}</span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Measurements commit on blur or on the done key, never on change. The result is
 * computed from the range, so it is not the inspector's to override: retyping the
 * value is the only way to change it.
 */
function MeasurementField({
  item,
  response,
  onCommit,
}: {
  item: FormItem
  response: ResponseEntry | undefined
  onCommit: (committed: Committed) => void
}) {
  const [draft, setDraft] = useState(response?.value ?? '')
  const committed = response?.value ?? ''

  // Keep the field in step when state changes underneath it, e.g. a reset.
  useEffect(() => {
    setDraft(committed)
  }, [committed])

  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode={item.unit === 'count' ? 'numeric' : 'decimal'}
            enterKeyHint="done"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => onCommit(commitMeasurement(item, draft))}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            }}
            aria-label={`${item.text}, ${item.expectedLabel ?? ''}`}
            className="h-tap w-24 rounded-card border border-rail bg-white px-3 text-17 font-medium"
          />
          {item.unit && <span className="text-17">{item.unit}</span>}
        </div>
        {item.expectedLabel && (
          <p className="text-15">
            <span className="text-slate">Expected</span> {item.expectedLabel}
          </p>
        )}
      </div>
    </div>
  )
}

function DateCheckField({
  item,
  response,
  demoDate,
  onCommit,
}: {
  item: FormItem
  response: ResponseEntry | undefined
  demoDate: string
  onCommit: (committed: Committed) => void
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <input
        type="date"
        value={response?.value ?? ''}
        max={demoDate}
        onChange={(event) => onCommit(commitDateCheck(event.target.value, demoDate))}
        aria-label={`Date of last test for ${item.text}`}
        className="h-tap rounded-card border border-rail bg-white px-3 text-17 font-medium"
      />
      {item.expectedLabel && (
        <p className="text-15">
          <span className="text-slate">Expected</span> {item.expectedLabel}
        </p>
      )}
    </div>
  )
}

function ResultLine({ item, response }: { item: FormItem; response: ResponseEntry | undefined }) {
  if (!response) return null
  if (response.result === 'pass') {
    return <p className="mt-2 text-15 text-verified">Pass</p>
  }
  if (response.result === 'na') {
    return <p className="mt-2 text-15 text-slate">Not applicable</p>
  }
  return (
    <p className="mt-2 text-15 text-stop">
      Fail &middot; {item.failDescription}
    </p>
  )
}

function ItemRow({
  item,
  response,
  demoDate,
  onResponse,
  onOpenClause,
}: {
  item: FormItem
  response: ResponseEntry | undefined
  demoDate: string
  onResponse: (next: ResponseEntry | null) => void
  onOpenClause: () => void
}) {
  const failed = response?.result === 'fail'
  const photoOutstanding = failed && item.photoRequiredOnFail && !response?.photo

  return (
    <li className="py-3">
      <div className="flex items-start gap-2">
        <p className="flex-1 text-17">
          <span className="font-medium">{item.id}</span> {item.text}
        </p>
        {/* Shares the item's vertical space, so a 48px hit area costs no height. */}
        <button
          type="button"
          onClick={onOpenClause}
          className="-my-1 h-tap shrink-0 px-2 text-13 font-medium text-signal"
        >
          {item.clauseRef}
        </button>
      </div>

      {item.responseType === 'passFail' && (
        <ResultChoice
          item={item}
          response={response}
          onSet={(result) => onResponse(result ? { ...response, result } : null)}
        />
      )}

      {item.responseType === 'measurement' && (
        <MeasurementField
          item={item}
          response={response}
          onCommit={(committed) =>
            onResponse(committed ? { ...response, ...committed } : null)
          }
        />
      )}

      {item.responseType === 'dateCheck' && (
        <DateCheckField
          item={item}
          response={response}
          demoDate={demoDate}
          onCommit={(committed) =>
            onResponse(committed ? { ...response, ...committed } : null)
          }
        />
      )}

      <ResultLine item={item} response={response} />

      {failed && (
        <>
          {photoOutstanding && (
            <p className="mt-2 text-15 text-stop">
              A photograph is required before leaving this item.
            </p>
          )}
          <PhotoCapture
            label={item.text.toLowerCase()}
            required={item.photoRequiredOnFail}
            value={response?.photo}
            onChange={(photo) => onResponse({ ...response!, photo })}
          />
        </>
      )}
    </li>
  )
}

export default function InspectionForm() {
  const { liftId } = useParams()
  const navigate = useNavigate()
  const { state, saveInspection, saveLift, saveDefects } = useStore()
  const lift = liftId ? liftById(state, liftId) : undefined
  const inspection = useMemo(
    () => state.inspections.find((i) => i.liftId === liftId && i.completedAt === null),
    [state.inspections, liftId],
  )
  const [sectionId, setSectionId] = useState('A')
  const [clauseItem, setClauseItem] = useState<FormItem | null>(null)
  /** Item ids whose stop-use order has been raised but not yet acknowledged. */
  const [pendingStopUse, setPendingStopUse] = useState<string[]>([])
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const savedScroll = useRef(0)

  /**
   * Brief section 9: "Back to item" returns to the exact scroll position. The
   * body is pinned while the sheet is open, because iOS Safari will not hold a
   * scroll offset behind an overlay otherwise, and the offset is put back on
   * close. Both halves live in the same effect so they cannot drift apart.
   */
  useEffect(() => {
    if (!clauseItem) return
    const y = savedScroll.current
    const body = document.body
    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.left = '0'
    body.style.right = '0'
    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      window.scrollTo(0, y)
    }
  }, [clauseItem])

  // No in-progress inspection means this was reached directly. Send them back
  // to the lift rather than inventing a record from a URL.
  useEffect(() => {
    if (lift && !inspection) navigate(`/lift/${lift.id}`, { replace: true })
  }, [lift, inspection, navigate])

  if (!lift || !inspection) return null

  const form = formPassengerA
  const progress = sectionProgress(form, inspection)
  const section = form.sections.find((s) => s.id === sectionId) ?? form.sections[0]
  const answered = totalAnswered(form, inspection)
  const total = totalItems(form)
  const index = form.sections.findIndex((s) => s.id === section.id)
  const next = form.sections[index + 1]

  /**
   * The one hard gate, per brief section 9. A failed item that requires a
   * photograph holds section navigation until it has one. Everything else about
   * completion is reporting: unanswered items never block.
   */
  const stopUseItem = pendingStopUse[0] ? formItems.get(pendingStopUse[0]) : undefined
  const failureCount = Object.values(inspection.responses).filter((r) => r.result === 'fail').length

  const photoBlockers = section.items.filter(
    (item) =>
      item.photoRequiredOnFail &&
      inspection.responses[item.id]?.result === 'fail' &&
      !inspection.responses[item.id]?.photo,
  )
  const blocked = photoBlockers.length > 0

  function update(patch: Partial<Inspection>) {
    saveInspection({ ...inspection!, ...patch })
  }

  function setResponse(itemId: string, response: ResponseEntry | null) {
    const current = inspection!
    const responses = { ...current.responses }
    const wasFailing = responses[itemId]?.result === 'fail'
    if (response) {
      responses[itemId] = response
    } else {
      delete responses[itemId]
    }
    saveInspection({ ...current, responses })

    const item = formItems.get(itemId)
    if (!item || item.failSeverity !== 'immediate') return

    const isFailing = response?.result === 'fail'
    // Raise the order once, on the commit that creates the failure.
    if (isFailing && !wasFailing) {
      setPendingStopUse((queue) => (queue.includes(itemId) ? queue : [...queue, itemId]))
    }
    if (!isFailing) {
      setPendingStopUse((queue) => queue.filter((id) => id !== itemId))
    }

    /**
     * The flag is recomputed from the record rather than toggled, so clearing a
     * mis-tapped failure lifts the order and nothing is left stranded.
     */
    const stillOut =
      Object.entries(responses).some(
        ([id, entry]) =>
          entry.result === 'fail' && formItems.get(id)?.failSeverity === 'immediate',
      ) ||
      state.defects.some(
        (defect) =>
          defect.liftId === current.liftId &&
          defect.inspectionId !== current.id &&
          defect.status === 'open' &&
          defect.severity === 'immediate',
      )
    if (stillOut !== lift!.stopUseInForce) {
      saveLift({ ...lift!, stopUseInForce: stillOut })
    }
  }

  /** Explicit action, never a render: bring defects into line, then review. */
  function openDefectReview() {
    saveDefects(reconcileDefects(state.defects, inspection!, form, lift!, state.demoDate))
    navigate(`/lift/${lift!.id}/inspection/defects`)
  }

  function goToSection(id: string) {
    setSectionId(id)
    // A new section starts at its own top, which is what a paper form does.
    bodyRef.current?.scrollIntoView({ block: 'start' })
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-dvh bg-paper pb-24">
      <header className="bg-shaft text-white">
        <div className="mx-auto flex max-w-[560px] items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-17 font-medium">
              {lift.label}, {buildingFor(lift).name}
            </p>
            <p className="font-mono text-13">{lift.officialNumber}</p>
          </div>
          <Link to={`/lift/${lift.id}`} className="shrink-0 text-15 underline">
            Leave
          </Link>
        </div>
      </header>

      <PlaceholderBanner />

      {/* Progress strip. Reports completion, never gates it. */}
      <div className="sticky top-0 z-10 border-b border-rail bg-white">
        <div className="mx-auto max-w-[560px] px-4 py-2">
          <div className="flex items-baseline justify-between">
            <p className="text-13 font-medium text-slate">Progress</p>
            <p className="text-15">
              {answered} of {total} answered
            </p>
          </div>
          <div className="mt-1 flex gap-1.5">
            {progress.map((entry) => {
              const current = entry.id === section.id
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => goToSection(entry.id)}
                  disabled={blocked && !current}
                  aria-current={current ? 'true' : undefined}
                  className={`h-tap flex-1 rounded-card border text-13 font-medium ${
                    current ? 'border-signal bg-signal text-white' : 'border-rail bg-white'
                  } disabled:border-rail disabled:bg-paper disabled:text-slate`}
                >
                  <span className="block text-17">{entry.id}</span>
                  <span className={current ? 'text-white' : entry.complete ? 'text-verified' : ''}>
                    {entry.answered}/{entry.total}
                    {entry.signed ? ' ✓' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <main ref={bodyRef} className="mx-auto max-w-[560px] px-4 pt-4">
        <h1 className="text-25 font-semibold">
          {section.id}. {section.title}
        </h1>

        <ul className="mt-2 divide-y divide-rail border-y border-rail">
          {section.items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              response={inspection.responses[item.id]}
              demoDate={state.demoDate}
              onResponse={(response) => setResponse(item.id, response)}
              onOpenClause={() => {
                savedScroll.current = window.scrollY
                setClauseItem(item)
              }}
            />
          ))}
        </ul>

        <div className="mt-6">
          <SignaturePad
            label={`Inspector signature, section ${section.id}`}
            value={inspection.sectionSignatures[section.id] ?? null}
            onChange={(dataUrl) => {
              const signatures = { ...inspection.sectionSignatures }
              if (dataUrl) {
                signatures[section.id] = dataUrl
              } else {
                delete signatures[section.id]
              }
              update({ sectionSignatures: signatures })
            }}
          />
        </div>
      </main>

      {clauseItem && <ClauseSheet item={clauseItem} onClose={() => setClauseItem(null)} />}

      {stopUseItem && (
        <StopUseInterstitial
          item={stopUseItem}
          liftLabel={lift.label}
          buildingName={buildingFor(lift).name}
          officialNumber={lift.officialNumber}
          recipients={notificationRecipients(buildingFor(lift), serviceCompanyFor(lift), true)}
          onAcknowledge={() => setPendingStopUse((queue) => queue.slice(1))}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-rail bg-white">
        <div className="mx-auto max-w-[560px] px-4 py-3">
          {blocked && (
            <p className="mb-2 text-15 text-stop">
              {photoBlockers.map((item) => item.id).join(' and ')}{' '}
              {photoBlockers.length === 1 ? 'needs' : 'need'} a photograph before you leave this
              section.
            </p>
          )}
          {next ? (
            <>
              {/*
                * The demo script walks A, then D, then E, and never reaches F,
                * so grading has to be reachable from wherever the inspector is.
                */}
              {failureCount > 0 && (
                <button
                  type="button"
                  onClick={openDefectReview}
                  disabled={blocked}
                  className="mb-2 h-tap w-full rounded-card border border-signal text-17 font-medium text-signal disabled:border-rail disabled:text-slate"
                >
                  Review {failureCount} {failureCount === 1 ? 'defect' : 'defects'}
                </button>
              )}
              <button
                type="button"
                onClick={() => goToSection(next.id)}
                disabled={blocked}
                className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white disabled:bg-rail disabled:text-slate"
              >
                Next section: {next.id}. {next.title}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openDefectReview}
                disabled={blocked}
                className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white disabled:bg-rail disabled:text-slate"
              >
                Review defects
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
