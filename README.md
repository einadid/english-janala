# English জানালা · English Janala 2.0

> An **adaptive, offline-first English learning studio** for people who think in Bangla.
> Spaced repetition, CEFR placement, six skill labs, an offline tutor — written in **strict TypeScript** with **zero runtime dependencies**.

```
npm install
npm run dev      # http://localhost:5173
npm test         # 95 tests (engines + a real DOM smoke test)
npm run build    # typecheck + production bundle (~205 kB JS, no framework)
```

---

## What makes this different from Duolingo / BBC / British Council / English Janala v1

| | Most English sites | English Janala 2.0 |
|---|---|---|
| Progress model | Fixed lesson order | **FSRS-style spaced repetition** — a card returns exactly when your memory is about to drop below 90% |
| Starting point | "Beginner" | **12-question CEFR placement test** → A1…C2 profile |
| Skills | Vocabulary only | **Six labs**: vocabulary, reading, listening/dictation, speaking (speech recognition scored), grammar, writing (live readability analytics) |
| Language | English only | **Bilingual shell** — every label flips Bangla ⇄ English instantly |
| Errors | Generic hints | **16 transfer-error patterns** Bangla speakers actually make (`I am agree`, `since three years`, `informations`, `good in English`…) with the rule explained in Bangla |
| Backend | Required | **None.** Everything runs in the browser; progress exports/imports as JSON |
| Dependencies | React, Redux, UI kit, icon CDN | **Zero runtime dependencies.** Hand-rolled router, store, event bus, SVG charts, icon set |
| Network | Required | **Offline-first** (PWA manifest + service worker); the curriculum is bundled |

## The six labs

1. **Learn** (`#/learn`) — 10 CEFR levels × 12 words, each with IPA, part of speech, Bangla meaning, example, synonyms. Search across headword, Bangla meaning, synonyms and tags. One tap adds a word to the review deck.
2. **Review** (`#/review`) — four card modes (EN→BN recall, BN→EN production, listen & type, pick the meaning). You rate recall; the scheduler recomputes stability, difficulty and the next interval.
3. **Reading** (`#/reading`) — five graded passages. Every word that exists in the bank is clickable → look-up card. Comprehension check explains *why* an answer is right.
4. **Listening** (`#/listening`) — dictation. Browser voice reads at your chosen speed; your typing is scored with a word-level LCS diff (match / near-miss / missing / extra).
5. **Speaking** (`#/speaking`) — say the sentence, `SpeechRecognition` transcribes it, the diff engine scores your pronunciation.
6. **Writing** (`#/writing`) — prompts with live metrics: word count, sentence rhythm, type-token ratio, Flesch reading ease, connectives used, over-repeated words, plus a 6-point checklist. Drafts are saved.

Plus **Tutor** (`#/tutor`), **Insights** (`#/insights`) and **Settings** (`#/settings`).

## Tutor commands

The tutor is a rule-based engine over a curated knowledge base — no API key, no network.

```
explain present perfect      → article + wrong/right pair
correct: I am agree with you → 1 issue found + the rule in Bangla
quiz prepositions            → instant MCQ from the drill bank
meaning resilience           → word card with audio + synonyms
phrasebook interview         → 5 lines with Bangla translation
idiom                        → random idiom of the day
plan                         → today's plan built from your real queue and streak
```

## Keyboard

`Ctrl/⌘ + K` command palette (levels, words, pages) · `G` then `D/L/R/T/I/S/W` to jump · `Esc` closes overlays · `1–4` rate a card.

## Architecture

```
src/
  core/        # no DOM: srs.ts, scoring.ts, gamification.ts, analytics.ts, tutor.ts, i18n.ts,
               # store.ts, router.ts, events.ts, progress.ts, audio.ts, dom.ts, format.ts
  data/        # bundled curriculum: vocabulary, passages, dictation, grammar, prompts, tutor KB
  ui/          # components.ts (SVG ring/radar/line chart), icons.ts, modal.ts, toast.ts, wordCard.ts
  features/    # one module per view; each returns HTML + registers data-act handlers
  app.ts       # shell: topbar, nav, footer, event delegation, command palette, shortcuts
  state.ts     # the single store instance (localStorage-backed)
tests/         # 95 tests: engines, curriculum integrity, i18n coverage, DOM smoke test
legacy/        # the original v1 demo, kept for reference
```

Design rules that keep it small and fast:

- **Views return HTML strings**; every interpolation goes through `esc()`. No innerHTML from user data without escaping.
- **No inline handlers.** Views emit `data-act="name"` + JSON `data-args`; one document-level listener routes them to the registry in `core/events.ts`.
- **State mutations happen only in `core/progress.ts`**, so XP, streaks, cards and badges can never drift apart.
- **Pure logic lives in `core/`** and never touches `window`, which is why it is unit-testable in Node.

## What is verified

```
npm run typecheck   # tsc --noEmit (strict, noUncheckedIndexedAccess) for src + vite.config.ts
npm test            # 95 tests / 8 files
npm run build       # vite build → dist/
```

The smoke test (`tests/app.smoke.test.ts`) boots the real `app.ts` inside jsdom and drives it: it finishes the placement test, adds a level to the deck, opens a word dialog, runs a review round and checks that the card was rescheduled, answers a passage, scores a writing draft, talks to the tutor, renders the insights charts, toggles the theme, seeds sample progress, and uses the command palette.

**Not verified here:** `SpeechSynthesis`, `SpeechRecognition` and the microphone need a real browser — the sandbox has no audio device and no access to public CDNs. The Google Fonts link in `index.html` is fetched by *your* browser, not by this sandbox; the app falls back to the system font stack if it is blocked.

## What is next

See **[docs/ROADMAP.md](docs/ROADMAP.md)** for the full "এরপর কী কী লাগবে" list — backend and sync, a real LLM tutor, phoneme-level pronunciation scoring, a 2 000-word corpus with native audio, design assets, CI/CD, privacy policy and more, each with a reason and a rough effort estimate.

---

*Built for learners who think in Bangla and dream in English.*
