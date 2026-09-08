/**
 * Inspection form. Brief sections 9 and 10.3.
 *
 * The body reads as a document, not a feed of cards: hairline rules, one column,
 * statutory paper heritage. Navigation between sections is free and the progress
 * strip reports completion rather than gating it.
 *
 * Item 6 stops short of three things that arrive next: the clause reference is
 * plain text until item 7 gives it a sheet, photo capture and its blocking rule
 * is item 8, and an immediate failure records itself without the stop-use
 * interstitial until item 9.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PlaceholderBanner } from '../components/PlaceholderBanner'
import { SignaturePad } from '../components/SignaturePad'
import { formPassengerA } from '../data/form-passenger-a'
import {
  commitDateCheck,
  commitMeasurement,
  sectionProgress,
  totalAnswered,
  totalItems,
  type Committed,
} from '../lib/inspection'
import { buildingFor, liftById } from '../state/selectors'
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
}: {
  item: FormItem
  response: ResponseEntry | undefined
  demoDate: string
  onResponse: (next: ResponseEntry | null) => void
}) {
  return (
    <li className="py-4">
      <p className="text-17">
        <span className="font-medium">{item.id}</span> {item.text}
      </p>
      {/* Item 7 turns this into the clause sheet. Plain text until it does. */}
      <p className="mt-0.5 text-13 font-medium">{item.clauseRef}</p>

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
    </li>
  )
}

export default function InspectionForm() {
  const { liftId } = useParams()
  const navigate = useNavigate()
  const { state, saveInspection } = useStore()
  const lift = liftId ? liftById(state, liftId) : undefined
  const inspection = useMemo(
    () => state.inspections.find((i) => i.liftId === liftId && i.completedAt === null),
    [state.inspections, liftId],
  )
  const [sectionId, setSectionId] = useState('A')
  const bodyRef = useRef<HTMLDivElement | null>(null)

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

  function update(patch: Partial<Inspection>) {
    saveInspection({ ...inspection!, ...patch })
  }

  function setResponse(itemId: string, response: ResponseEntry | null) {
    const responses = { ...inspection!.responses }
    if (response) {
      responses[itemId] = response
    } else {
      delete responses[itemId]
    }
    update({ responses })
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
                  aria-current={current ? 'true' : undefined}
                  className={`h-tap flex-1 rounded-card border text-13 font-medium ${
                    current ? 'border-signal bg-signal text-white' : 'border-rail bg-white'
                  }`}
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

      <div className="fixed inset-x-0 bottom-0 border-t border-rail bg-white">
        <div className="mx-auto max-w-[560px] px-4 py-3">
          {next ? (
            <button
              type="button"
              onClick={() => goToSection(next.id)}
              className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white"
            >
              Next section: {next.id}. {next.title}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white disabled:bg-rail disabled:text-slate"
              >
                Review defects
              </button>
              <p className="mt-1 text-13 text-slate">
                Scaffolding: defect review arrives at item 10.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
