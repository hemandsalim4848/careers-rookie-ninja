import { sanitizeText } from '@/lib/sanitize'
import type { IQuestion, IQuestionOption } from '@/models/Job'
import type { IQuestionnaireAnswer } from '@/models/Application'

export type QuestionType = 'single' | 'multiple' | 'text'

export interface QuestionInput {
  id?: string
  text?: string
  type?: string
  required?: boolean
  options?: Array<{ id?: string; text?: string; points?: number | string }>
}

export interface AnswerInput {
  questionId?: string
  selectedOptionIds?: string[]
  textAnswer?: string
}

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/** Sanitize questionnaire payload from HR job create/update. */
export function sanitizeQuestionnaire(raw: unknown): IQuestion[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((q: QuestionInput): IQuestion | null => {
      const text = sanitizeText(q?.text ?? '')
      if (!text) return null

      const type: QuestionType =
        q?.type === 'multiple' || q?.type === 'text' || q?.type === 'single'
          ? q.type
          : 'single'

      const options: IQuestionOption[] =
        type === 'text'
          ? []
          : (Array.isArray(q?.options) ? q.options : [])
              .map((o): IQuestionOption | null => {
                const optText = sanitizeText(o?.text ?? '')
                if (!optText) return null
                const points = Number(o?.points)
                return {
                  id: sanitizeText(o?.id ?? '') || newId(),
                  text: optText,
                  points: Number.isFinite(points) ? Math.max(0, points) : 0,
                }
              })
              .filter((o): o is IQuestionOption => o !== null)

      // Choice questions need at least one option
      if (type !== 'text' && options.length === 0) return null

      return {
        id: sanitizeText(q?.id ?? '') || newId(),
        text,
        type,
        required: q?.required !== false,
        options,
      }
    })
    .filter((q): q is IQuestion => q !== null)
}

export function sanitizeMinimumScore(raw: unknown): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
}

/**
 * Validate seeker answers against job questionnaire and compute total score.
 * Returns error message string on failure, or { answers, totalScore } on success.
 */
export function processQuestionnaireAnswers(
  questionnaire: IQuestion[],
  rawAnswers: unknown
): { answers: IQuestionnaireAnswer[]; totalScore: number } | { error: string } {
  const answersIn: AnswerInput[] = Array.isArray(rawAnswers) ? rawAnswers : []
  const byQuestion = new Map(
    answersIn
      .filter((a) => a?.questionId)
      .map((a) => [a.questionId as string, a])
  )

  const answers: IQuestionnaireAnswer[] = []
  let totalScore = 0

  for (const question of questionnaire) {
    const answer = byQuestion.get(question.id)
    const selectedOptionIds = Array.isArray(answer?.selectedOptionIds)
      ? answer!.selectedOptionIds.map((id) => String(id))
      : []
    const textAnswer = sanitizeText(answer?.textAnswer ?? '')

    if (question.type === 'text') {
      if (question.required && !textAnswer) {
        return { error: `Please answer: ${question.text}` }
      }
      answers.push({
        questionId: question.id,
        selectedOptionIds: [],
        textAnswer,
      })
      continue
    }

    // Validate option IDs belong to this question
    const validIds = new Set(question.options.map((o) => o.id))
    for (const oid of selectedOptionIds) {
      if (!validIds.has(oid)) {
        return { error: 'Invalid answer submitted for a questionnaire question.' }
      }
    }

    if (question.type === 'single' && selectedOptionIds.length > 1) {
      return { error: 'Only one option allowed for a single-choice question.' }
    }

    if (question.required && selectedOptionIds.length === 0) {
      return { error: `Please answer: ${question.text}` }
    }

    const optionPoints = question.options
      .filter((o) => selectedOptionIds.includes(o.id))
      .reduce((sum, o) => sum + (o.points || 0), 0)

    totalScore += optionPoints

    answers.push({
      questionId: question.id,
      selectedOptionIds,
      textAnswer: '',
    })
  }

  return { answers, totalScore }
}

/** Max possible score for a questionnaire (best option per single; sum of all for multiple). */
export function maxPossibleScore(questionnaire: IQuestion[]): number {
  return questionnaire.reduce((sum, q) => {
    if (q.type === 'text' || !q.options.length) return sum
    if (q.type === 'single') {
      return sum + Math.max(0, ...q.options.map((o) => o.points || 0))
    }
    // multiple: sum of all positive options
    return sum + q.options.reduce((s, o) => s + Math.max(0, o.points || 0), 0)
  }, 0)
}
