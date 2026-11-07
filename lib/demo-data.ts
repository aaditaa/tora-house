/**
 * Every word of content in the demo lives here and nowhere else, so it can be
 * edited without opening a component.
 *
 * ALL OF IT IS INVENTED. The member, the guide, the clinician, every reading and
 * every reference band. The clinical lead replaces the panel, the bands and the
 * guide's paragraph before a member sees this — and before an investor does, since
 * a clinician in the room will read the numbers as readings.
 *
 * The app never generates a marker, a band, a prevalence figure, a status word or
 * an interpretive sentence of its own. If it is not in this file, it is not shown.
 */

export const DISCLAIMER =
  "Tora House is not a medical service. Nothing here treats, cures, diagnoses or prevents any condition, and nothing here replaces medical or mental-health care. Your readings are read with you, never used to tell you what is wrong with you.";

export const SAMPLE_DATA_LABEL = "Sample data";

// ─── Who ─────────────────────────────────────────────────────────────────────

export const member = {
  firstName: "Meera",
  name: "Meera Rao",
  age: 48,
  area: "Indiranagar, Bengaluru",
  inHerWords:
    "I'm tired by 4pm and I've started avoiding the stairs. I don't want to feel like this at 55.",
  wants: ["sleep", "energy", "joint comfort"],
} as const;

export const guide = {
  name: "Ananya Iyer",
  role: "Her guide",
  initials: "AI",
  credentials: [
    "Movement and yoga therapy, 11 years",
    "Trained in Ayurvedic daily rhythm (dinacharya)",
    "Works with women 40–60 only",
  ],
  placeholder: true,
} as const;

export const clinician = {
  name: "Dr. Shalini Menon",
  role: "Clinical practitioner",
  initials: "SM",
  note: "Reads every panel and signs every report. Sets the bands this app reads against.",
  placeholder: true,
} as const;

// ─── The month ───────────────────────────────────────────────────────────────

export const DEMO_MONTH = {
  year: 2026,
  month: 12,
  label: "December 2026",
  days: 30,
  /** 1 Dec 2026 is a Tuesday. Monday-first grid, so the month starts in column 2. */
  firstColumn: 2,
} as const;

// ─── Appendix A — the survey ─────────────────────────────────────────────────

export type SurveyType =
  | "text"
  | "number"
  | "longText"
  | "multi"
  | "single"
  | "scale"
  | "timePair"
  | "count";

export type SurveyQuestion = {
  id: string;
  section: string;
  core: boolean;
  prompt: string;
  type: SurveyType;
  options?: readonly string[];
  /** For scales: the two ends, left to right. */
  scaleLabels?: readonly [string, string];
  scaleMax?: number;
  note?: string;
  optional?: boolean;
  prefill: unknown;
};

export const surveyQuestions: readonly SurveyQuestion[] = [
  {
    id: "name",
    section: "About you",
    core: true,
    prompt: "What should we call you?",
    type: "text",
    prefill: "Meera",
  },
  {
    id: "age",
    section: "About you",
    core: true,
    prompt: "How old are you?",
    type: "number",
    prefill: 48,
  },
  {
    id: "area",
    section: "About you",
    core: false,
    prompt: "Where in the city are you based?",
    type: "text",
    prefill: "Indiranagar, Bengaluru",
  },

  {
    id: "why",
    section: "What you want",
    core: true,
    prompt: "What made you join Tora House?",
    type: "longText",
    prefill:
      "I'm tired by 4pm and I've started avoiding the stairs. I don't want to feel like this at 55.",
  },
  {
    id: "oneThing",
    section: "What you want",
    core: true,
    prompt: "If one thing were different in six months, what would it be?",
    type: "longText",
    prefill: "Sleeping through the night.",
  },
  {
    id: "priorities",
    section: "What you want",
    core: false,
    prompt: "Pick up to three that matter most right now.",
    type: "multi",
    options: [
      "sleep",
      "energy",
      "joint comfort",
      "strength",
      "stress",
      "weight",
      "focus",
      "mood",
      "digestion",
    ],
    prefill: ["sleep", "energy", "joint comfort"],
  },

  {
    id: "bedWake",
    section: "Sleep",
    core: true,
    prompt: "What time do you usually go to bed, and what time do you wake?",
    type: "timePair",
    prefill: { bed: "23:40", wake: "06:20" },
  },
  {
    id: "sleepQuality",
    section: "Sleep",
    core: true,
    prompt: "How would you describe your sleep in the last month?",
    type: "scale",
    scaleMax: 5,
    scaleLabels: ["broken", "solid"],
    prefill: 2,
  },
  {
    id: "sleepBlockers",
    section: "Sleep",
    core: false,
    prompt: "What usually gets in the way of sleeping well?",
    type: "multi",
    options: [
      "falling asleep",
      "waking in the night",
      "heat or sweating",
      "phone",
      "worry",
      "noise",
      "pain",
      "nothing",
    ],
    prefill: ["waking in the night", "phone"],
  },

  {
    id: "energy",
    section: "Energy and mood",
    core: true,
    prompt: "Where does your energy sit through the day?",
    type: "scale",
    scaleMax: 5,
    scaleLabels: ["flat", "steady"],
    prefill: 2,
  },
  {
    id: "flattest",
    section: "Energy and mood",
    core: false,
    prompt: "When in the day do you feel most flat?",
    type: "single",
    options: ["morning", "midday", "afternoon", "evening", "it varies"],
    prefill: "afternoon",
  },
  {
    id: "mood",
    section: "Energy and mood",
    core: false,
    prompt: "How often have you felt low or on edge in the past two weeks?",
    type: "single",
    options: ["not at all", "some days", "most days"],
    prefill: "some days",
  },

  {
    id: "discomfort",
    section: "Comfort",
    core: true,
    prompt: "Is anything uncomfortable or painful at the moment?",
    type: "multi",
    options: [
      "neck",
      "shoulders",
      "upper back",
      "lower back",
      "hips",
      "knees",
      "ankles",
      "wrists",
      "none",
    ],
    prefill: ["knees", "lower back"],
  },
  {
    id: "whenWorst",
    section: "Comfort",
    core: true,
    prompt: "When does it bother you most?",
    type: "longText",
    prefill: "Stairs, and standing up after I've been sitting a while.",
  },
  {
    id: "howMuch",
    section: "Comfort",
    core: false,
    prompt: "How much does it change what you do in a week?",
    type: "scale",
    scaleMax: 5,
    scaleLabels: ["not at all", "a great deal"],
    prefill: 3,
  },

  {
    id: "movementNow",
    section: "Movement",
    core: true,
    prompt: "What movement are you doing now, in a usual week?",
    type: "longText",
    prefill: "A walk most evenings. I did Pilates for a few months last year.",
  },
  {
    id: "daysMoving",
    section: "Movement",
    core: false,
    prompt: "How many days a week do you move deliberately?",
    type: "count",
    prefill: 3,
  },
  {
    id: "whatDidntLast",
    section: "Movement",
    core: false,
    prompt: "What have you tried before that didn't last, and why?",
    type: "longText",
    prefill:
      "Gym membership. I went for six weeks, then a work trip, then never again.",
  },

  {
    id: "weekday",
    section: "Your day",
    core: true,
    prompt: "Walk us through an ordinary weekday.",
    type: "longText",
    prefill:
      "Up at 6:20, out of the house by 8, back around 7. Dinner late, usually 9:30.",
  },
  {
    id: "largestMeal",
    section: "Your day",
    core: false,
    prompt: "When is your largest meal?",
    type: "single",
    options: ["morning", "midday", "evening", "it varies"],
    prefill: "evening",
  },
  {
    id: "demandingWeek",
    section: "Your day",
    core: false,
    prompt:
      "What does a demanding week look like for you — travel, caring, deadlines?",
    type: "longText",
    prefill: "Two travel weeks a month, and my mother lives with us.",
  },

  {
    id: "history",
    section: "History",
    core: true,
    prompt:
      "Is there anything about your health we should know before we plan anything?",
    type: "longText",
    note: "This goes to your guide and the clinical practitioner, and to nobody else.",
    prefill: "Nothing diagnosed. My mother has arthritis.",
  },
  {
    id: "taking",
    section: "History",
    core: false,
    optional: true,
    prompt: "Are you taking anything regularly — prescribed or otherwise?",
    type: "longText",
    prefill: "A multivitamin.",
  },
  {
    id: "toldNotTo",
    section: "History",
    core: false,
    optional: true,
    prompt: "Is there anything you've been told not to do?",
    type: "longText",
    prefill: "",
  },

  {
    id: "timePerDay",
    section: "Practicalities",
    core: true,
    prompt: "How much time can you honestly give this on an ordinary day?",
    type: "single",
    options: ["10 minutes", "20 minutes", "30 minutes", "an hour"],
    prefill: "20 minutes",
  },
  {
    id: "timeOfDay",
    section: "Practicalities",
    core: false,
    prompt: "What time of day would you rather do it?",
    type: "single",
    options: [
      "early morning",
      "mid-morning",
      "lunchtime",
      "evening",
      "late evening",
    ],
    prefill: "early morning",
  },
] as const;

export const surveyClosing =
  "That's everything. Ananya will read this before your call.";

/**
 * The same 26 questions, grouped the way a guide works through them on the call.
 * The member does not fill a form: Ananya asks these, writes the answers down,
 * and the app shows what kind of ground the conversation covers.
 *
 * `examples` is read from the questions above rather than restated, so there is
 * still one place a question is written.
 */
export type GuideTopic = {
  id: string;
  section: string;
  covers: string;
  examples: readonly string[];
};

const topicCovers: { id: string; section: string; covers: string }[] = [
  {
    id: "about-you",
    section: "About you",
    covers: "Your name, your age, and where in the city you are.",
  },
  {
    id: "what-you-want",
    section: "What you want",
    covers: "Why you came, and what you would want different in six months.",
  },
  {
    id: "sleep",
    section: "Sleep",
    covers: "When you sleep, how it has been, and what gets in the way.",
  },
  {
    id: "energy-mood",
    section: "Energy and mood",
    covers:
      "Where your energy sits across a day, and how you have been feeling.",
  },
  {
    id: "comfort",
    section: "Comfort",
    covers:
      "Anything that hurts, when it bothers you, and what it stops you doing.",
  },
  {
    id: "movement",
    section: "Movement",
    covers: "What you do now, how often, and what has not lasted before.",
  },
  {
    id: "your-day",
    section: "Your day",
    covers: "An ordinary weekday, your meals, and what a hard week looks like.",
  },
  {
    id: "history",
    section: "History",
    covers: "Anything we should know before planning, and anything you take.",
  },
  {
    id: "practicalities",
    section: "Practicalities",
    covers:
      "How much time you can honestly give, and when you would rather do it.",
  },
];

export const guideTopics: readonly GuideTopic[] = topicCovers.map((t) => ({
  ...t,
  examples: surveyQuestions
    .filter((q) => q.section === t.section)
    .map((q) => q.prompt),
}));

export const guideCall = {
  length: "About 45 minutes",
  where: "On a call, or at the house if you would rather",
  who: "Your guide asks. You do not fill anything in.",
  after:
    "She writes it up, and you see it before your baseline panel is booked.",
  questionCount: surveyQuestions.length,
} as const;

// ─── Appendix B — the pillars ────────────────────────────────────────────────

export type Pillar = {
  id: string;
  name: string;
  holds: string;
  /**
   * 1–5. Not a ranking the app worked out: she and her guide set this order on
   * the call. It says where the effort goes first, not what matters most —
   * everything here is in her plan either way.
   */
  preference: number;
  /** Why the two of them put it there. */
  chosenBecause: string;
  /** What this pillar is for, in one measurable line. Null when there isn't one. */
  goal: string | null;
};

export const pillarPreferenceNote =
  "Meera and Ananya set this order together on the call. It is where the effort goes first, not a league table — the whole plan runs from day one.";

export const pillars: readonly Pillar[] = [
  {
    id: "strength",
    name: "Strength and mobility",
    holds: "Load, range and balance.",
    preference: 1,
    chosenBecause:
      "She has started avoiding the stairs. This is the one she asked to lead with.",
    goal: "Sit-to-stand of 16 by June, from 11 at baseline.",
  },
  {
    id: "recovery",
    name: "Pain management and recovery",
    holds: "Knees and lower back, alongside sleep and rest.",
    preference: 2,
    chosenBecause:
      "Knees and lower back were the two she named, and they are what stops her doing things.",
    goal: "Stairs without thinking about them first.",
  },
  {
    id: "breathmed",
    name: "Breathwork and meditation",
    holds: "Attention trained, not emptied. Breathing gentle, never forced.",
    preference: 3,
    chosenBecause:
      "Her one thing is sleeping through the night, and this is the part of it she can do at ten in the evening.",
    goal: "Her own sleep rating at 4 of 5 by June, from 2.",
  },
  {
    id: "yoga",
    name: "Yoga",
    holds: "Slow, propped, within comfortable range.",
    preference: 4,
    chosenBecause:
      "She did Pilates for a few months last year and liked it. This is the nearest thing that survives a travel week.",
    goal: "Twice a week, held through a month with two trips in it.",
  },
  {
    id: "rhythm",
    name: "Ayurvedic daily rhythm",
    holds:
      "Dinacharya and ritucharya — meal timing, light, the order of a day.",
    preference: 5,
    chosenBecause:
      "Lowest effort of the five and it moves the most markers, but it is last because it changes the household's evening, not only hers.",
    goal: "Largest meal at midday, five days in seven.",
  },
] as const;

/**
 * Pain management and recovery, opened up. The first list is what the pillar
 * holds for someone with her two complaints; the second is the part of it that
 * has become a daily habit and is ticked off on Today.
 */
export const recoveryDetail = {
  forHer: [
    {
      what: "Sit-to-stand, ten slow reps",
      why: "Knees, after any long sit or a flight",
    },
    {
      what: "Calf raises, two sets",
      why: "Knees — the load the stairs ask for",
    },
    {
      what: "Hip hinge against a wall",
      why: "Lower back, before anything heavier",
    },
    {
      what: "Supported hamstring lengthening",
      why: "Lower back, in comfortable range only",
    },
    {
      what: "Glute bridge, slow",
      why: "Lower back and pelvic floor together",
    },
    { what: "Thoracic opening over a rolled towel", why: "Desk days" },
  ],
  inHerDay: [
    "Knee-loading sequence after long sitting — daily, and after any flight",
    "Lower-back release — on desk days",
    "Bedtime 10:30, screens down at 10:00 — every day",
    "Evening journal: mood, sleep, energy — every day",
  ],
  weDo: [
    "Comfortable range only. The end of a range is not the target.",
    "Load a joint rather than rest it, unless it is actually flared.",
    "Move before and after a long sit, and on both sides of a flight.",
    "Say it the same day if something is worse, not at the next check-in.",
  ],
  weDoNot: [
    "No stretching into pain. Discomfort is a stop, not a goal.",
    "No breath retention in any of it.",
    "Nothing new in the two days before an immersion.",
    "No diagnosing, ever. A change goes to the clinical practitioner, not to us.",
  ],
} as const;

export const baselineIsNotAPillar =
  "Baseline markers are not a sixth pillar. They are the floor the five stand on: one reading of her own baseline, read against Indian reference points, with every action written from it and measured back against it.";

// ─── Appendix C — the actions ────────────────────────────────────────────────

export type ResourceType = "Video" | "Audio" | "One-page guide" | "Short note";

export type Action = {
  id: string;
  pillarId: string;
  label: string;
  frequency: string;
  resource: ResourceType;
  note: string;
};

export const actions: readonly Action[] = [
  {
    id: "strength-session",
    pillarId: "strength",
    label: "Short strength session, 25 minutes",
    frequency: "3× a week, Mon/Wed/Fri",
    resource: "Video",
    note: "Sit-to-stand, a supported hinge, a carry, and step-ups at a height that feels easy. Stop two repetitions before you'd want to.",
  },
  {
    id: "joint-movements",
    pillarId: "strength",
    label: "Gentle joint movements on waking",
    frequency: "Daily",
    resource: "Video",
    note: "Ankles, knees, hips, shoulders, neck — small circles, no stretching into anything sharp. Three minutes.",
  },
  {
    id: "step-ups",
    pillarId: "strength",
    label: "Step-ups on the stairs at home",
    frequency: "2× a week",
    resource: "Short note",
    note: "One flight, slowly, holding the rail. Not for fitness — for the knees to relearn the movement they've been avoiding.",
  },

  {
    id: "knee-sequence",
    pillarId: "recovery",
    label: "Knee-loading sequence after long sitting",
    frequency: "Daily, and after any flight",
    resource: "Video",
    note: "Ten slow sit-to-stands and a calf raise set, done the moment you get up from a long sit. Comfortable range only.",
  },
  {
    id: "back-release",
    pillarId: "recovery",
    label: "Lower-back release, 8 minutes",
    frequency: "4× a week",
    resource: "Video",
    note: "Supported positions on the floor, breath-led. Nothing that pulls.",
  },
  {
    id: "bedtime",
    pillarId: "recovery",
    label: "Fixed bedtime, screens down 30 minutes before",
    frequency: "Daily",
    resource: "One-page guide",
    note: "The time matters more than the length. Pick 10:30pm and hold it on weekends too.",
  },
  {
    id: "yoga-nidra",
    pillarId: "yoga",
    label: "Yoga Nidra before sleep",
    frequency: "3× a week",
    resource: "Audio",
    note: "Twenty minutes, lying down. Falling asleep during it is fine.",
  },
  {
    id: "yoga-standing",
    pillarId: "yoga",
    label: "Standing sequence, chair within reach",
    frequency: "2\u00d7 a week",
    resource: "Video",
    note: "Twenty minutes. The chair is for balance, not for failure. Nothing held longer than five breaths.",
  },
  {
    id: "yoga-restorative",
    pillarId: "yoga",
    label: "Restorative poses, propped",
    frequency: "Sunday",
    resource: "Video",
    note: "Three poses over a bolster and two blocks. The propping is the practice; nothing is stretched into.",
  },

  {
    id: "guided-sit",
    pillarId: "breathmed",
    label: "Guided sit, 10 minutes",
    frequency: "5× a week",
    resource: "Audio",
    note: "Seated, back supported. Attention on one thing, returned to it each time it wanders. That returning is the practice.",
  },
  {
    id: "body-scan",
    pillarId: "breathmed",
    label: "Body scan",
    frequency: "2× a week",
    resource: "Audio",
    note: "Lying down, moving attention slowly from feet to head. Useful on the days the sit feels impossible.",
  },
  {
    id: "journal",
    pillarId: "breathmed",
    label: "Evening journal — mood, sleep, energy",
    frequency: "Daily",
    resource: "Short note",
    note: "Three lines. Not a diary — a record your guide reads with you.",
  },

  {
    id: "diaphragmatic",
    pillarId: "breathmed",
    label: "Diaphragmatic breathing, 5 minutes",
    frequency: "Every morning",
    resource: "Video",
    note: "Hand on the belly, breathing low and slow. Gentle and comfortable. No forced deep breaths, no holding the breath.",
  },
  {
    id: "breath-observation",
    pillarId: "breathmed",
    label: "Breath observation before the strength session",
    frequency: "On session days",
    resource: "Short note",
    note: "Two minutes of watching the breath before you move. It changes how the session feels.",
  },
  {
    id: "breath-stretch",
    pillarId: "breathmed",
    label: "Breath-coordinated stretching",
    frequency: "3× a week",
    resource: "Video",
    note: "The movement follows the breath, not the other way round.",
  },

  {
    id: "midday-meal",
    pillarId: "rhythm",
    label: "Largest meal at midday",
    frequency: "Daily",
    resource: "One-page guide",
    note: "Your current pattern is a 9:30pm dinner. Moving the weight of the day's food earlier is the single change most likely to show up in your sleep.",
  },
  {
    id: "wake-time",
    pillarId: "rhythm",
    label: "Same wake time, including weekends",
    frequency: "Daily",
    resource: "Short note",
    note: "6:20am is already your weekday time. Holding it on Saturday is the hard part and the useful part.",
  },
  {
    id: "light-air",
    pillarId: "rhythm",
    label: "Light and air in the first hour",
    frequency: "Daily",
    resource: "Short note",
    note: "Ten minutes outside before 8am. Balcony counts.",
  },
] as const;

export function actionById(id: string): Action | undefined {
  return actions.find((a) => a.id === id);
}

// ─── Appendix D — the month ──────────────────────────────────────────────────

/** Present every single day of the month, before anything is layered on. */
export const fixedDaily: readonly { id: string; label: string }[] = [
  { id: "wake-time", label: "Wake 6:20" },
  { id: "diaphragmatic", label: "Diaphragmatic breathing, 5 minutes" },
  { id: "light-air", label: "Ten minutes of light and air before 8am" },
  { id: "journal", label: "Evening journal — mood, sleep, energy" },
  { id: "bedtime", label: "Bedtime 10:30, screens down at 10:00" },
] as const;

export type DayKind =
  "routine" | "rest" | "checkIn" | "assessment" | "immersion";

export type DayItem = { id: string; label: string; kind: DayKind };

export type CalendarDay = {
  day: number;
  weekday: string;
  week: 1 | 2 | 3 | 4;
  kinds: readonly DayKind[];
  added: readonly DayItem[];
};

export const weeks = [
  {
    week: 1,
    range: "Days 1–7",
    theme: "Breath awareness and mental well-being",
  },
  {
    week: 2,
    range: "Days 8–14",
    theme: "Pain management and the mind–body connection",
  },
  {
    week: 3,
    range: "Days 15–21",
    theme: "Emotional wellness, mindfulness and relaxation",
  },
  { week: 4, range: "Days 22–30", theme: "Positive lifestyle and self-care" },
] as const;

export const calendar: readonly CalendarDay[] = [
  {
    day: 1,
    weekday: "Tue",
    week: 1,
    kinds: ["assessment", "routine"],
    added: [
      { id: "assess-1", label: "Day 1 self-assessment", kind: "assessment" },
      {
        id: "joint-movements",
        label: "Gentle joint movements",
        kind: "routine",
      },
      { id: "body-scan", label: "Body scan, 10 min", kind: "routine" },
    ],
  },
  {
    day: 2,
    weekday: "Wed",
    week: 1,
    kinds: ["routine"],
    added: [
      { id: "joint-movements", label: "Joint movements", kind: "routine" },
      {
        id: "breath-observation",
        label: "Breath observation, 5 min",
        kind: "routine",
      },
    ],
  },
  {
    day: 3,
    weekday: "Thu",
    week: 1,
    kinds: ["routine"],
    added: [
      { id: "joint-movements", label: "Joint movements", kind: "routine" },
      { id: "guided-sit", label: "Guided sit, 10 min", kind: "routine" },
    ],
  },
  {
    day: 4,
    weekday: "Fri",
    week: 1,
    kinds: ["checkIn", "routine"],
    added: [
      {
        id: "checkin-1",
        label: "Weekly check-in with Ananya",
        kind: "checkIn",
      },
      { id: "yoga-nidra", label: "Yoga Nidra before sleep", kind: "routine" },
    ],
  },
  {
    day: 5,
    weekday: "Sat",
    week: 1,
    kinds: ["routine"],
    added: [
      { id: "joint-movements", label: "Joint movements", kind: "routine" },
      { id: "body-scan", label: "Body scan", kind: "routine" },
      { id: "walk-long", label: "Longer walk", kind: "routine" },
    ],
  },
  {
    day: 6,
    weekday: "Sun",
    week: 1,
    kinds: ["rest"],
    added: [
      {
        id: "rest-1",
        label: "Rest day — breathing and journal only",
        kind: "rest",
      },
    ],
  },
  {
    day: 7,
    weekday: "Mon",
    week: 1,
    kinds: ["routine"],
    added: [
      { id: "joint-movements", label: "Joint movements", kind: "routine" },
      { id: "guided-sit", label: "Guided sit", kind: "routine" },
      {
        id: "midday-meal",
        label: "Largest meal moved to midday from today",
        kind: "routine",
      },
    ],
  },

  {
    day: 8,
    weekday: "Tue",
    week: 2,
    kinds: ["routine"],
    added: [
      {
        id: "strength-session",
        label: "Strength session begins, 25 min",
        kind: "routine",
      },
      {
        id: "knee-sequence",
        label: "Knee-loading sequence after sitting",
        kind: "routine",
      },
    ],
  },
  {
    day: 9,
    weekday: "Wed",
    week: 2,
    kinds: ["routine"],
    added: [
      {
        id: "back-release",
        label: "Lower-back release, 8 min",
        kind: "routine",
      },
      {
        id: "breath-stretch",
        label: "Breath-coordinated stretching",
        kind: "routine",
      },
    ],
  },
  {
    day: 10,
    weekday: "Thu",
    week: 2,
    kinds: ["routine"],
    added: [
      { id: "strength-session", label: "Strength session", kind: "routine" },
      { id: "guided-sit", label: "Guided sit", kind: "routine" },
    ],
  },
  {
    day: 11,
    weekday: "Fri",
    week: 2,
    kinds: ["checkIn", "routine"],
    added: [
      { id: "checkin-2", label: "Weekly check-in", kind: "checkIn" },
      { id: "back-release", label: "Lower-back release", kind: "routine" },
      { id: "yoga-nidra", label: "Yoga Nidra", kind: "routine" },
    ],
  },
  {
    day: 12,
    weekday: "Sat",
    week: 2,
    kinds: ["routine"],
    added: [
      {
        id: "breath-stretch",
        label: "Breath-coordinated stretching",
        kind: "routine",
      },
      { id: "step-ups", label: "Step-ups on the stairs", kind: "routine" },
    ],
  },
  {
    day: 13,
    weekday: "Sun",
    week: 2,
    kinds: ["immersion"],
    added: [
      {
        id: "immersion-sound",
        label: "Immersion — sound meditation",
        kind: "immersion",
      },
      {
        id: "no-routine",
        label: "No routine today beyond breathing",
        kind: "rest",
      },
    ],
  },
  {
    day: 14,
    weekday: "Mon",
    week: 2,
    kinds: ["routine"],
    added: [
      { id: "strength-session", label: "Strength session", kind: "routine" },
      { id: "knee-sequence", label: "Knee sequence", kind: "routine" },
    ],
  },

  {
    day: 15,
    weekday: "Tue",
    week: 3,
    kinds: ["assessment", "routine"],
    added: [
      { id: "assess-15", label: "Day 15 self-assessment", kind: "assessment" },
      { id: "strength-session", label: "Strength session", kind: "routine" },
      { id: "guided-sit", label: "Guided sit, 10 min", kind: "routine" },
    ],
  },
  {
    day: 16,
    weekday: "Wed",
    week: 3,
    kinds: ["routine"],
    added: [
      { id: "back-release", label: "Lower-back release", kind: "routine" },
      { id: "guided-sit", label: "Mindfulness sit", kind: "routine" },
      {
        id: "gratitude",
        label: "Gratitude lines in the journal",
        kind: "routine",
      },
    ],
  },
  {
    day: 17,
    weekday: "Thu",
    week: 3,
    kinds: ["routine"],
    added: [
      { id: "strength-session", label: "Strength session", kind: "routine" },
      { id: "body-scan", label: "Body scan", kind: "routine" },
    ],
  },
  {
    day: 18,
    weekday: "Fri",
    week: 3,
    kinds: ["checkIn", "routine"],
    added: [
      { id: "checkin-3", label: "Weekly check-in", kind: "checkIn" },
      { id: "yoga-nidra", label: "Yoga Nidra", kind: "routine" },
      {
        id: "music-relax",
        label: "Music-led relaxation, 15 min",
        kind: "routine",
      },
    ],
  },
  {
    day: 19,
    weekday: "Sat",
    week: 3,
    kinds: ["routine"],
    added: [
      {
        id: "breath-stretch",
        label: "Breath-coordinated stretching",
        kind: "routine",
      },
      { id: "walk-outdoors", label: "Walk outdoors, 30 min", kind: "routine" },
    ],
  },
  {
    day: 20,
    weekday: "Sun",
    week: 3,
    kinds: ["rest"],
    added: [
      { id: "rest-20", label: "Rest day. Yoga Nidra only", kind: "rest" },
    ],
  },
  {
    day: 21,
    weekday: "Mon",
    week: 3,
    kinds: ["routine"],
    added: [
      { id: "strength-session", label: "Strength session", kind: "routine" },
      { id: "guided-sit", label: "Guided sit", kind: "routine" },
      { id: "knee-sequence", label: "Knee sequence", kind: "routine" },
    ],
  },

  {
    day: 22,
    weekday: "Tue",
    week: 4,
    kinds: ["routine"],
    added: [
      {
        id: "own-flow",
        label: "Her own yoga flow, 20 min — built with Ananya on the check-in",
        kind: "routine",
      },
    ],
  },
  {
    day: 23,
    weekday: "Wed",
    week: 4,
    kinds: ["routine"],
    added: [
      { id: "strength-session", label: "Strength session", kind: "routine" },
      { id: "back-release", label: "Lower-back release", kind: "routine" },
    ],
  },
  {
    day: 24,
    weekday: "Thu",
    week: 4,
    kinds: ["routine"],
    added: [
      { id: "guided-sit", label: "Guided sit", kind: "routine" },
      { id: "step-ups", label: "Step-ups", kind: "routine" },
      { id: "travel-light", label: "Light day — travel", kind: "routine" },
    ],
  },
  {
    day: 25,
    weekday: "Fri",
    week: 4,
    kinds: ["checkIn", "routine"],
    added: [
      { id: "checkin-4", label: "Weekly check-in", kind: "checkIn" },
      { id: "own-flow", label: "Yoga flow", kind: "routine" },
      { id: "yoga-nidra", label: "Yoga Nidra", kind: "routine" },
    ],
  },
  {
    day: 26,
    weekday: "Sat",
    week: 4,
    kinds: ["routine"],
    added: [
      { id: "strength-session", label: "Strength session", kind: "routine" },
      { id: "walk-outdoors", label: "Walk outdoors", kind: "routine" },
    ],
  },
  {
    day: 27,
    weekday: "Sun",
    week: 4,
    kinds: ["immersion"],
    added: [
      {
        id: "immersion-pickleball",
        label: "Immersion — pickleball meet",
        kind: "immersion",
      },
    ],
  },
  {
    day: 28,
    weekday: "Mon",
    week: 4,
    kinds: ["routine"],
    added: [
      { id: "own-flow", label: "Yoga flow", kind: "routine" },
      { id: "knee-sequence", label: "Knee sequence", kind: "routine" },
      { id: "guided-sit", label: "Guided sit", kind: "routine" },
    ],
  },
  {
    day: 29,
    weekday: "Tue",
    week: 4,
    kinds: ["routine"],
    added: [
      { id: "strength-session", label: "Strength session", kind: "routine" },
      { id: "back-release", label: "Lower-back release", kind: "routine" },
    ],
  },
  {
    day: 30,
    weekday: "Wed",
    week: 4,
    kinds: ["assessment", "checkIn"],
    added: [
      { id: "assess-30", label: "Day 30 self-assessment", kind: "assessment" },
      { id: "review-call", label: "Month review with Ananya", kind: "checkIn" },
      {
        id: "january",
        label: "Her own routine written for January",
        kind: "routine",
      },
    ],
  },
] as const;

export const travelRule =
  "Travel weeks are handled by shortening, never skipping: breathing, journal and the knee sequence stay; the strength session becomes the stairs; the sit becomes five minutes instead of ten.";

export function dayFor(day: number): CalendarDay {
  return calendar.find((d) => d.day === day) ?? calendar[0]!;
}

// ─── Immersions ──────────────────────────────────────────────────────────────

export type Immersion = {
  id: string;
  title: string;
  detail: string;
  when: string;
  state: "attended" | "upcoming";
  day?: number;
  /** Generated, abstract and deliberately empty of people. See PLACEHOLDERS.md. */
  image: string;
  alt: string;
};

export const immersions: readonly Immersion[] = [
  {
    id: "high-tea",
    title: "International high tea tasting",
    detail:
      "With floor Pilates beforehand and a closed-group conversation after. The first one.",
    when: "Late November 2026",
    state: "attended",
    image: "/images/immersions/high-tea.jpg",
    alt: "A brass teapot and two porcelain cups on raw silk, steam catching the light.",
  },
  {
    id: "immersion-sound",
    title: "Sound meditation",
    detail: "An afternoon. No routine that day beyond breathing.",
    when: "Sunday 13 December",
    state: "upcoming",
    day: 13,
    image: "/images/immersions/sound.jpg",
    alt: "Concentric ripples across still water in a dark green stone basin, beside the rim of a brass bowl.",
  },
  {
    id: "immersion-pickleball",
    title: "Pickleball meet",
    detail: "Mixed levels. Nobody is keeping score.",
    when: "Sunday 27 December",
    state: "upcoming",
    day: 27,
    image: "/images/immersions/pickleball.jpg",
    alt: "Painted court lines crossing a sand-coloured surface, a paddle resting at the edge.",
  },
] as const;

// ─── Appendix F — the markers ────────────────────────────────────────────────

export type MarkerStatus = "In range" | "Worth watching" | "Low" | null;

export type Marker = {
  id: string;
  name: string;
  plain: string;
  baseline: string;
  m3: string | null;
  m6: string | null;
  band: string;
  status: MarkerStatus;
  /** Shown without a chip, with a line instead. */
  unscoredNote?: string;
  measuredOnce?: boolean;
  guideNote: string;
};

export type MarkerGroup = {
  id: string;
  system: string;
  tells: string;
  movedBy: readonly string[];
  markers: readonly Marker[];
};

export const markerGroups: readonly MarkerGroup[] = [
  {
    id: "metabolic",
    system: "Metabolic",
    tells:
      "How her body is handling sugar, and the energy dips she described at 4pm.",
    movedBy: ["rhythm", "strength"],
    markers: [
      {
        id: "hba1c",
        name: "HbA1c",
        plain: "An average of your blood sugar over about three months.",
        baseline: "5.8 %",
        m3: "5.6 %",
        m6: "5.4 %",
        band: "under 5.7 %",
        status: "Worth watching",
        guideNote:
          "Moves with the midday meal more than with anything else we could do.",
      },
      {
        id: "fasting-glucose",
        name: "Fasting glucose",
        plain: "Your blood sugar first thing, before you have eaten.",
        baseline: "104 mg/dL",
        m3: "98 mg/dL",
        m6: "94 mg/dL",
        band: "70–99 mg/dL",
        status: "Worth watching",
        guideNote:
          "Tracks the dinner time. The 9:30pm habit is the thing to shift.",
      },
      {
        id: "fasting-insulin",
        name: "Fasting insulin",
        plain:
          "How hard your body is working to keep that sugar where it should be.",
        baseline: "14.2 µIU/mL",
        m3: "11.1 µIU/mL",
        m6: "9.3 µIU/mL",
        band: "2–12 µIU/mL",
        status: "Worth watching",
        guideNote:
          "Responds to the strength sessions once they are three a week.",
      },
      {
        id: "homa-ir",
        name: "HOMA-IR",
        plain: "The two readings above, combined into one number.",
        baseline: "3.6",
        m3: "2.7",
        m6: "2.2",
        band: "under 2.0",
        status: "Worth watching",
        guideNote:
          "Worth reading alongside the waist measurement rather than on its own.",
      },
    ],
  },
  {
    id: "cardiovascular",
    system: "Cardiovascular",
    tells: "The long game.",
    movedBy: ["rhythm", "strength", "recovery"],
    markers: [
      {
        id: "apob",
        name: "ApoB",
        plain: "A count of the particles that carry cholesterol around.",
        baseline: "112 mg/dL",
        m3: "104 mg/dL",
        m6: "96 mg/dL",
        band: "under 90 mg/dL",
        status: "Worth watching",
        guideNote: "The one Dr. Menon watches most closely in this group.",
      },
      {
        id: "ldl",
        name: "LDL cholesterol",
        plain: "The cholesterol carried out to the body.",
        baseline: "128 mg/dL",
        m3: "118 mg/dL",
        m6: "108 mg/dL",
        band: "under 100 mg/dL",
        status: "Worth watching",
        guideNote: "Moves slowly and together with ApoB.",
      },
      {
        id: "hdl",
        name: "HDL cholesterol",
        plain: "The cholesterol carried back to the liver.",
        baseline: "44 mg/dL",
        m3: "47 mg/dL",
        m6: "51 mg/dL",
        band: "above 50 mg/dL",
        status: "Worth watching",
        guideNote:
          "Rises with regular movement more than with anything on a plate.",
      },
      {
        id: "triglycerides",
        name: "Triglycerides",
        plain: "Fat circulating in the blood.",
        baseline: "168 mg/dL",
        m3: "142 mg/dL",
        m6: "118 mg/dL",
        band: "under 150 mg/dL",
        status: "Worth watching",
        guideNote:
          "The fastest mover here, and the one most tied to meal timing.",
      },
      {
        id: "lpa",
        name: "Lipoprotein(a)",
        plain:
          "Largely set by your genes, so it is read once rather than tracked.",
        baseline: "34 nmol/L",
        m3: null,
        m6: null,
        band: "under 75 nmol/L",
        status: "In range",
        measuredOnce: true,
        guideNote: "Measured once. Nothing in the plan is aimed at it.",
      },
    ],
  },
  {
    id: "inflammation",
    system: "Inflammation",
    tells:
      "Background irritation in the system — often the thing sitting underneath joint discomfort and poor sleep.",
    movedBy: ["recovery", "breathmed"],
    markers: [
      {
        id: "hscrp",
        name: "hs-CRP",
        plain: "A general measure of inflammation.",
        baseline: "3.1 mg/L",
        m3: "2.2 mg/L",
        m6: "1.6 mg/L",
        band: "under 1.0 mg/L",
        status: "Worth watching",
        guideNote: "Sleep shows up here before it shows up anywhere else.",
      },
      {
        id: "homocysteine",
        name: "Homocysteine",
        plain: "An amino acid that rises when certain B vitamins are short.",
        baseline: "13.2 µmol/L",
        m3: "10.8 µmol/L",
        m6: "9.4 µmol/L",
        band: "under 10 µmol/L",
        status: "Worth watching",
        guideNote: "Reads alongside your B12. They move together.",
      },
    ],
  },
  {
    id: "nutrients",
    system: "Nutrients",
    tells: "Whether the raw materials are there.",
    movedBy: ["rhythm"],
    markers: [
      {
        id: "vitamin-d",
        name: "Vitamin D, 25-OH",
        plain: "What your body has stored from sunlight and food.",
        baseline: "16 ng/mL",
        m3: "28 ng/mL",
        m6: "34 ng/mL",
        band: "30–60 ng/mL",
        status: "Low",
        guideNote:
          "The most straightforward thing on this page. Ten minutes of light before 8am is in your plan for this reason.",
      },
      {
        id: "b12",
        name: "Vitamin B12",
        plain: "Needed for nerves and for making blood.",
        baseline: "212 pg/mL",
        m3: "340 pg/mL",
        m6: "412 pg/mL",
        band: "200–900 pg/mL",
        status: "Worth watching",
        guideNote:
          "In the band, but low within it. Reads with your homocysteine.",
      },
      {
        id: "ferritin",
        name: "Ferritin",
        plain: "Your iron stores.",
        baseline: "28 ng/mL",
        m3: "36 ng/mL",
        m6: "44 ng/mL",
        band: "30–200 ng/mL",
        status: "Worth watching",
        guideNote: "Worth reading next to the 4pm dip you described.",
      },
      {
        id: "haemoglobin",
        name: "Haemoglobin",
        plain: "How well your blood carries oxygen.",
        baseline: "12.1 g/dL",
        m3: "12.6 g/dL",
        m6: "12.9 g/dL",
        band: "12–15 g/dL",
        status: "In range",
        guideNote: "Steady. Nothing to do here.",
      },
    ],
  },
  {
    id: "thyroid",
    system: "Thyroid and hormonal",
    tells:
      "How the thyroid is pacing things, and where she is in her own cycle.",
    movedBy: [],
    markers: [
      {
        id: "tsh",
        name: "TSH",
        plain: "The signal your brain sends the thyroid.",
        baseline: "3.4 µIU/mL",
        m3: "3.1 µIU/mL",
        m6: "2.8 µIU/mL",
        band: "0.4–4.0 µIU/mL",
        status: "In range",
        guideNote: "Steady through the band.",
      },
      {
        id: "free-t4",
        name: "Free T4",
        plain: "The thyroid hormone available for your body to use.",
        baseline: "1.1 ng/dL",
        m3: "1.1 ng/dL",
        m6: "1.2 ng/dL",
        band: "0.8–1.8 ng/dL",
        status: "In range",
        guideNote: "Unchanged, as expected.",
      },
      {
        id: "fsh",
        name: "FSH",
        plain: "A marker of where you are in the menopause transition.",
        baseline: "28 IU/L",
        m3: null,
        m6: "31 IU/L",
        band: "stage-dependent",
        status: null,
        unscoredNote: "A marker of where she is, not something to improve.",
        guideNote:
          "Shown because it explains some of what you are feeling. It is not a problem to be solved.",
      },
    ],
  },
  {
    id: "functional",
    system: "Functional measures",
    tells:
      "The part she can feel. These move first, and they are what keeps her going while the blood work catches up.",
    movedBy: ["strength", "recovery", "breathmed", "yoga", "rhythm"],
    markers: [
      {
        id: "waist",
        name: "Waist circumference",
        plain: "Measured at the navel, standing.",
        baseline: "88 cm",
        m3: "85 cm",
        m6: "82 cm",
        band: "under 80 cm",
        status: "Worth watching",
        guideNote:
          "Read against South Asian thresholds, which sit lower than the ones on most charts.",
      },
      {
        id: "resting-hr",
        name: "Resting heart rate",
        plain: "Your heart rate sitting quietly.",
        baseline: "76 bpm",
        m3: "71 bpm",
        m6: "67 bpm",
        band: "60–100 bpm",
        status: "In range",
        guideNote: "Already fine, and it will still come down.",
      },
      {
        id: "grip",
        name: "Grip strength",
        plain:
          "How hard you can squeeze — a good proxy for whole-body strength.",
        baseline: "21 kg",
        m3: "24 kg",
        m6: "26 kg",
        band: "above 25 kg",
        status: "Worth watching",
        guideNote:
          "Below what I would expect for you. The carries in your session are for this.",
      },
      {
        id: "sit-to-stand",
        name: "30-second sit-to-stand",
        plain: "How many times you can stand from a chair in thirty seconds.",
        baseline: "11 reps",
        m3: "14 reps",
        m6: "16 reps",
        band: "above 12 reps",
        status: "Worth watching",
        guideNote:
          "This is the stairs, measured. It is the number I expect to move first.",
      },
      {
        id: "sleep-self",
        name: "Sleep, self-reported",
        plain: "Your own answer, on the same scale each time.",
        baseline: "2 / 5",
        m3: "3 / 5",
        m6: "4 / 5",
        band: "4 or above",
        status: "Worth watching",
        guideNote: "The one you came here for.",
      },
      {
        id: "knee-self",
        name: "Knee comfort on stairs, self-reported",
        plain: "Your own answer, on the same scale each time.",
        baseline: "2 / 5",
        m3: "3 / 5",
        m6: "4 / 5",
        band: "4 or above",
        status: "Worth watching",
        guideNote: "Tracks the sit-to-stand almost exactly.",
      },
    ],
  },
] as const;

export const allMarkers: readonly Marker[] = markerGroups.flatMap(
  (g) => g.markers,
);

export function markerById(
  id: string,
): { marker: Marker; group: MarkerGroup } | undefined {
  for (const group of markerGroups) {
    const marker = group.markers.find((m) => m.id === id);
    if (marker) return { marker, group };
  }
  return undefined;
}

export const indianReferenceNote =
  "The bands we read against are not the ones printed on most lab reports. South Asian bodies carry cardiometabolic risk at lower waist measurements and lower body weight than the thresholds most international guidance uses, and low vitamin D and low B12 are common enough here that treating them as unusual findings is unhelpful. Your clinical practitioner sets the bands we use, and they are on this screen next to every reading so you can see what we are comparing you to.";

export const guideParagraph =
  "Nothing here needs a doctor today, and I've said so to Dr. Menon as well. Three things are worth our attention: your vitamin D is low, your fasting numbers and your triglycerides sit a little above where we'd like them, and your grip and sit-to-stand are below what I'd expect for you. The first is straightforward. The second two are the same story — they move together, and they move with the midday meal and the strength sessions more than with anything else we could do. That's why your month starts with breathing and your dinner time rather than with exercise. We'll look at all of it again in March.";

/** Grouped for the booking screen — groups, never individual tests. */
export const panelGroups = markerGroups
  .filter((g) => g.id !== "functional")
  .map((g) => ({ id: g.id, system: g.system, count: g.markers.length }));

export const panelPrep =
  "Twelve hours fasting — water is fine, and so is your usual medication unless Dr. Menon has said otherwise. Book it for a morning. The functional measures are taken with Ananya in the room, not in the lab.";

// ─── Appendix E — follow-up ──────────────────────────────────────────────────

export const followUp = [
  {
    when: "Every Friday",
    what: "Weekly check-in, 15 minutes, in the thread or a call if she'd rather",
    who: "Ananya",
  },
  {
    when: "Day 1, 15 and 30",
    what: "Self-reported measures — stress and emotional well-being, sleep quality, energy, pain and physical comfort, breath awareness, confidence in daily activities, consistency of practice",
    who: "She answers, Ananya reads",
  },
  {
    when: "Day 30",
    what: "Month review call, 30 minutes — the plan is rewritten with her, not for her",
    who: "Ananya",
  },
  {
    when: "Month 3",
    what: "Retest — the survey again, plus the baseline panel repeated. Progress report written and clinically reviewed.",
    who: "Ananya writes, Dr. Menon reviews",
  },
  {
    when: "Month 6",
    what: "Second retest, a before-and-after she can show someone, and the renewal conversation",
    who: "Ananya",
  },
] as const;

export const missedRules = [
  {
    trigger: "Two days missed",
    what: "Nothing automated. It is noted on the team view.",
    who: "—",
  },
  {
    trigger: "Four days missed in a week",
    what: "Ananya messages — one line, no guilt, asking what got in the way.",
    who: "Guide",
  },
  {
    trigger: "A week missed",
    what: "A call, not a message. The plan is bent, not broken: the session is halved, the hardest action is dropped, one thing is kept.",
    who: "Guide",
  },
  {
    trigger: "Two weeks missed",
    what: "The plan is rebuilt from scratch on a 15-minute call. We assume the plan was wrong, not her.",
    who: "Guide",
  },
  {
    trigger: "A month missed",
    what: "A call from the house, and an invitation to the next immersion. She stays on the list either way.",
    who: "Founder or guide",
  },
] as const;

export const redFlagRule =
  "If anything she reports — a symptom, a change, something in the panel — is outside what a guide should be handling, Ananya stops, says so plainly, and refers her to a doctor. Nothing in this programme treats, cures or diagnoses anything, and nothing replaces medical or mental-health care. Breathing practice stays gentle and comfortable throughout: no forced deep breaths, no breath retention.";

export const retestList =
  "The full panel is repeated at month 3 and month 6, except Lipoprotein(a), which is read once. The functional measures are retaken with Ananya at the same two points.";

// ─── The thread ──────────────────────────────────────────────────────────────

export type Message = { day: number; from: "guide" | "member"; text: string };

export const messages: readonly Message[] = [
  {
    day: 1,
    from: "guide",
    text: "Read everything you wrote. The 9:30 dinner is the first thing I want to look at — not the exercise. Speak Friday?",
  },
  {
    day: 4,
    from: "member",
    text: "Did three of the four mornings. Missed Thursday, travel.",
  },
  {
    day: 4,
    from: "guide",
    text: "Three is the month, not the week. Keep the breathing on travel days and let the rest go.",
  },
  { day: 11, from: "guide", text: "How did the stairs feel this week?" },
  {
    day: 11,
    from: "member",
    text: "Still not easy. But I didn't think about it on Tuesday, which is new.",
  },
  {
    day: 18,
    from: "guide",
    text: "That's the one worth noticing. Adding ten minutes of music-led relaxation on Fridays.",
  },
  {
    day: 25,
    from: "guide",
    text: "Let's build your January flow together on the 30th. Bring what you'd actually keep.",
  },
] as const;

// ─── Self-reported measures ──────────────────────────────────────────────────

export const selfReportedMeasures = [
  "Stress and emotional well-being",
  "Sleep quality",
  "Energy",
  "Pain and physical comfort",
  "Breath awareness",
  "Confidence in daily activities",
  "Consistency of practice",
] as const;

/** Out of 5. Illustrative — she reports these herself on Days 1, 15 and 30. */
export const selfReported: readonly {
  day: number;
  scores: readonly number[];
}[] = [
  { day: 1, scores: [2, 2, 2, 2, 1, 2, 1] },
  { day: 15, scores: [3, 3, 3, 3, 3, 3, 4] },
  { day: 30, scores: [4, 4, 4, 3, 4, 4, 4] },
] as const;

// ─── The journey ─────────────────────────────────────────────────────────────

export type JourneyStep = {
  id: string;
  label: string;
  href: string;
  state: "done" | "now" | "waiting";
  detail: string;
};

export const journeySteps: readonly JourneyStep[] = [
  {
    id: "survey",
    label: "Survey",
    href: "/demo/survey",
    state: "done",
    detail: "Twenty-six questions. Ananya has read it.",
  },
  {
    id: "call",
    label: "1:1 call",
    href: "/demo/book-call",
    state: "done",
    detail: "Thirty minutes with Ananya, before anything is planned.",
  },
  {
    id: "panel",
    label: "Baseline panel",
    href: "/demo/book-panel",
    state: "done",
    detail: "Home collection, fasting. Functional measures taken in the room.",
  },
  {
    id: "report",
    label: "Report",
    href: "/demo/report",
    state: "now",
    detail: "Read by Ananya, signed by Dr. Menon.",
  },
  {
    id: "plan",
    label: "Plan",
    href: "/demo/plan",
    state: "waiting",
    detail: "Written from the readings, across the five pillars.",
  },
] as const;

// ─── The walk-through ────────────────────────────────────────────────────────

export type DemoScreen = {
  href: string;
  label: string;
  /** Seconds auto-play dwells here. Totals a little under three minutes. */
  seconds: number;
};

/**
 * Journey order, which is also the order auto-play walks. The two screens that
 * carry the argument — the report and the markers — get the longest dwell,
 * because they are the ones a room actually reads.
 */
export const demoScreens: readonly DemoScreen[] = [
  { href: "/demo", label: "Welcome", seconds: 8 },
  { href: "/demo/consent", label: "Consent", seconds: 8 },
  { href: "/demo/survey", label: "What she is asked", seconds: 15 },
  { href: "/demo/journey", label: "Journey", seconds: 9 },
  { href: "/demo/book-call", label: "Book a call", seconds: 9 },
  { href: "/demo/book-panel", label: "Baseline panel", seconds: 9 },
  { href: "/demo/report", label: "Report", seconds: 17 },
  { href: "/demo/markers", label: "Markers", seconds: 21 },
  { href: "/demo/plan", label: "Plan", seconds: 13 },
  { href: "/demo/plan/strength-session", label: "An action", seconds: 9 },
  { href: "/demo/today", label: "Today", seconds: 14 },
  { href: "/demo/calendar", label: "Calendar", seconds: 11 },
  { href: "/demo/guide", label: "Guide", seconds: 10 },
  { href: "/demo/immersions", label: "Immersions", seconds: 8 },
  { href: "/demo/progress", label: "Progress", seconds: 10 },
  { href: "/demo/team", label: "Team view", seconds: 10 },
] as const;

export const tourSeconds = demoScreens.reduce((n, s) => n + s.seconds, 0);

// ─── Team view ───────────────────────────────────────────────────────────────

export type TeamMember = {
  id: string;
  name: string;
  age: number;
  stage: string;
  flag: string | null;
};

export const teamMembers: readonly TeamMember[] = [
  { id: "m1", name: "Meera Rao", age: 48, stage: "Month 1, Day 1", flag: null },
  {
    id: "m2",
    name: "Priya Venkatesh",
    age: 52,
    stage: "Report — needs signing",
    flag: "Waiting on Dr. Menon",
  },
  {
    id: "m3",
    name: "Lakshmi Nair",
    age: 45,
    stage: "Month 1, Day 19",
    flag: "Four days missed this week",
  },
  {
    id: "m4",
    name: "Farida Contractor",
    age: 57,
    stage: "Month 2, Day 12",
    flag: null,
  },
  {
    id: "m5",
    name: "Kavitha Reddy",
    age: 44,
    stage: "Month 1, Day 23",
    flag: "Quiet for eight days — call due",
  },
  {
    id: "m6",
    name: "Sunita Bhatia",
    age: 55,
    stage: "Awaiting baseline panel",
    flag: null,
  },
  {
    id: "m7",
    name: "Anjali Deshpande",
    age: 50,
    stage: "Month 3 retest booked",
    flag: null,
  },
] as const;
