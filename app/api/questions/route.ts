import { NextRequest, NextResponse } from 'next/server'
import { db, isDbAvailable } from '@/db'
import { caseQuestions } from '@/db/schema'
import { eq } from 'drizzle-orm'

const ALL_SEED_QUESTIONS = [
  // CASE 1
  { caseId: "01", puzzleKey: "a1_2", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a2_1", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a3_0", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a3_1", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a4_1", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a5_0", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a5_1", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a5_2", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a6_0", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a6_2", question: "What is the primary color of the sun?", answer: "yellow" },
  { caseId: "01", puzzleKey: "a7_2", question: "What is the primary color of the sun?", answer: "yellow" },

  // CASE 2
  { caseId: "02", puzzleKey: "cw_0", question: "Every empire loses to me, yet I never raise a sword.", answer: "TIME" },
  { caseId: "02", puzzleKey: "cw_1", question: "Kingdoms rise beside me, explorers cross me, and history is often shaped by me.", answer: "OCEAN" },
  { caseId: "02", puzzleKey: "cw_2", question: "Burn me, and memory survives only in mouths. Preserve me, and centuries may still speak.", answer: "RECORD" },
  { caseId: "02", puzzleKey: "cw_3", question: "I don't prove the truth. I merely leave it with nowhere to hide.", answer: "EVIDENCE" },
  { caseId: "02", puzzleKey: "cw_4", question: "Every answer is built upon me, though I am rarely the answer myself.", answer: "CLUE" },
  { caseId: "02", puzzleKey: "cw_5", question: "Before the truth is read, this is always the first thing done.", answer: "OPENED" },
  { caseId: "02", puzzleKey: "cw_6", question: "Two witnesses can possess completely different versions of me.", answer: "VIEW" },
  { caseId: "02", puzzleKey: "cw_7", question: "Time buries me. Museums rescue me.", answer: "EXHIBIT" },
  { caseId: "02", puzzleKey: "cw_8", question: "Remove one line from me, and tomorrow's historians inherit a different yesterday.", answer: "REGISTER" },
  { caseId: "02", puzzleKey: "cw_keyword", question: "Crossword Keyword", answer: "TORECOVER" },

  // CASE 3
  { caseId: "03", puzzleKey: "caesar_scroll", question: "What sustained their civilization?", answer: "FLAME" },
  { caseId: "03", puzzleKey: "chronicle_sort", question: "Uncover the chronicles directive", answer: "LIGHT LEADS ONLY THE WORTHY HOME" },

  // CASE 4
  { caseId: "04", puzzleKey: "audio_game", question: "Audio game decrypt input", answer: "CRIMSON" },
  { caseId: "04", puzzleKey: "fortune_teller", question: "Fortune teller answer", answer: "PARADOX" },
  { caseId: "04", puzzleKey: "mirror_script", question: "Mirror script code word", answer: "REVEAL" },
  { caseId: "04", puzzleKey: "shooting_range_logs", question: "Log packet intruder pattern", answer: "INTRUDER_17" },

  // CASE 5
  { caseId: "05", puzzleKey: "math_trick", question: "Convert hex 0x5f3759df to decimal and sum the digits", answer: "42" },
  { caseId: "05", puzzleKey: "wilhelm_scream", question: "Sound effect Private character name", answer: "PRIVATE WILHELM" },
  { caseId: "05", puzzleKey: "taured_passport", question: "Mystery passport country name", answer: "TAURED" },
  { caseId: "05", puzzleKey: "kryptos_cipher", question: "Second clue passage", answer: "BERLIN" },
  { caseId: "05", puzzleKey: "deep_blue", question: "IBM Deep Blue chess champion name", answer: "GARRY KASPAROV" },
  { caseId: "05", puzzleKey: "golden_record", question: "Ann Druyan voyager record husband name", answer: "CARL SAGAN" },
  { caseId: "05", puzzleKey: "demon_core", question: "Plutonium sphere nickname", answer: "DEMON CORE" },
  { caseId: "05", puzzleKey: "poe_cipher", question: "Poe Graham cipher solver name", answer: "GIL BROZA" }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('caseId')

  if (!caseId) {
    return NextResponse.json({ success: false, error: 'caseId parameter required' }, { status: 400 })
  }

  const defaultForCase = ALL_SEED_QUESTIONS.filter(q => q.caseId === caseId)

  if (!isDbAvailable) {
    return NextResponse.json({ success: true, questions: defaultForCase })
  }

  try {
    let rows = await db.select().from(caseQuestions).where(eq(caseQuestions.caseId, caseId))
    if (rows.length === 0) {
      // Seed table with default questions if empty for this caseId
      if (defaultForCase.length > 0) {
        await db.insert(caseQuestions).values(defaultForCase)
        rows = await db.select().from(caseQuestions).where(eq(caseQuestions.caseId, caseId))
      }
    }
    return NextResponse.json({ success: true, questions: rows })
  } catch (error) {
    console.error(`Failed to get Case ${caseId} questions:`, error)
    return NextResponse.json({ success: false, error: 'Database read error' }, { status: 500 })
  }
}
