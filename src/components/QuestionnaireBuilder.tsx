'use client'

import styles from '@/app/dashboard/hr/jobs/new/jobform.module.css'

export type QuestionType = 'single' | 'multiple' | 'text'

export interface QuestionOptionForm {
  id: string
  text: string
  points: number
}

export interface QuestionForm {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options: QuestionOptionForm[]
}

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function createEmptyQuestion(): QuestionForm {
  return {
    id: newId(),
    text: '',
    type: 'single',
    required: true,
    options: [
      { id: newId(), text: '', points: 0 },
      { id: newId(), text: '', points: 0 },
    ],
  }
}

interface Props {
  questions: QuestionForm[]
  minimumScore: number
  onQuestionsChange: (questions: QuestionForm[]) => void
  onMinimumScoreChange: (score: number) => void
}

export default function QuestionnaireBuilder({
  questions,
  minimumScore,
  onQuestionsChange,
  onMinimumScoreChange,
}: Props) {
  function updateQuestion(index: number, patch: Partial<QuestionForm>) {
    const next = questions.map((q, i) => {
      if (i !== index) return q
      const updated = { ...q, ...patch }
      if (patch.type === 'text') {
        updated.options = []
      } else if (patch.type === 'single' || patch.type === 'multiple') {
        if (q.type === 'text' || updated.options.length === 0) {
          updated.options = [
            { id: newId(), text: '', points: 0 },
            { id: newId(), text: '', points: 0 },
          ]
        }
      }
      return updated
    })
    onQuestionsChange(next)
  }

  function removeQuestion(index: number) {
    onQuestionsChange(questions.filter((_, i) => i !== index))
  }

  function moveQuestion(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= questions.length) return
    const next = [...questions]
    ;[next[index], next[target]] = [next[target], next[index]]
    onQuestionsChange(next)
  }

  function addOption(qIndex: number) {
    const next = questions.map((q, i) =>
      i === qIndex
        ? { ...q, options: [...q.options, { id: newId(), text: '', points: 0 }] }
        : q
    )
    onQuestionsChange(next)
  }

  function updateOption(
    qIndex: number,
    oIndex: number,
    patch: Partial<QuestionOptionForm>
  ) {
    const next = questions.map((q, i) => {
      if (i !== qIndex) return q
      return {
        ...q,
        options: q.options.map((o, j) => (j === oIndex ? { ...o, ...patch } : o)),
      }
    })
    onQuestionsChange(next)
  }

  function removeOption(qIndex: number, oIndex: number) {
    const next = questions.map((q, i) => {
      if (i !== qIndex) return q
      if (q.options.length <= 1) return q
      return { ...q, options: q.options.filter((_, j) => j !== oIndex) }
    })
    onQuestionsChange(next)
  }

  return (
    <div className={styles.questionnaireSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Questionnaire</h2>
          <p className={styles.sectionHint}>
            Optional screening questions. Assign points to options; text answers score 0.
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => onQuestionsChange([...questions, createEmptyQuestion()])}
        >
          + Add question
        </button>
      </div>

      <div className={styles.field} style={{ maxWidth: 240 }}>
        <label className={styles.label}>Minimum score to qualify</label>
        <input
          type="number"
          min={0}
          step={1}
          value={minimumScore}
          onChange={(e) => onMinimumScoreChange(Math.max(0, Number(e.target.value) || 0))}
          placeholder="0"
        />
        <span className={styles.hint}>
          Candidates at or above this score are flagged in the applicants list.
        </span>
      </div>

      {questions.length === 0 && (
        <p className={styles.emptyQuestionnaire}>
          No questions yet. Add questions for applicants to answer when applying.
        </p>
      )}

      {questions.map((q, qi) => (
        <div key={q.id} className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <span className={styles.questionIndex}>Q{qi + 1}</span>
            <div className={styles.questionActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => moveQuestion(qi, -1)}
                disabled={qi === 0}
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => moveQuestion(qi, 1)}
                disabled={qi === questions.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className={styles.iconBtnDanger}
                onClick={() => removeQuestion(qi)}
                title="Remove question"
              >
                ×
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Question text *</label>
            <input
              required
              value={q.text}
              onChange={(e) => updateQuestion(qi, { text: e.target.value })}
              placeholder="e.g. How many years of sales experience do you have?"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Answer type</label>
              <select
                value={q.type}
                onChange={(e) =>
                  updateQuestion(qi, { type: e.target.value as QuestionType })
                }
              >
                <option value="single">Single select (one option)</option>
                <option value="multiple">Multiple select (checkboxes)</option>
                <option value="text">Text input</option>
              </select>
            </div>
            <label className={styles.checkRow} style={{ alignSelf: 'flex-end', paddingBottom: 10 }}>
              <input
                type="checkbox"
                checked={q.required}
                onChange={(e) => updateQuestion(qi, { required: e.target.checked })}
              />
              Required
            </label>
          </div>

          {q.type !== 'text' && (
            <div className={styles.optionsBlock}>
              <div className={styles.optionsHeader}>
                <span className={styles.label}>Options & points</span>
                <button type="button" className="btn-ghost" onClick={() => addOption(qi)}>
                  + Option
                </button>
              </div>
              {q.options.map((opt, oi) => (
                <div key={opt.id} className={styles.optionRow}>
                  <input
                    required
                    value={opt.text}
                    onChange={(e) => updateOption(qi, oi, { text: e.target.value })}
                    placeholder={`Option ${oi + 1}`}
                    className={styles.optionText}
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={opt.points}
                    onChange={(e) =>
                      updateOption(qi, oi, {
                        points: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    placeholder="Pts"
                    className={styles.optionPoints}
                    title="Points"
                  />
                  <button
                    type="button"
                    className={styles.iconBtnDanger}
                    onClick={() => removeOption(qi, oi)}
                    disabled={q.options.length <= 1}
                    title="Remove option"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {q.type === 'text' && (
            <p className={styles.hint}>Text answers are stored but do not add points.</p>
          )}
        </div>
      ))}
    </div>
  )
}
