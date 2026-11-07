import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  DISCLAIMER,
  actions,
  calendar,
  clinician,
  fixedDaily,
  guide,
  guideParagraph,
  indianReferenceNote,
  markerGroups,
  member,
  pillars,
  retestList,
  selfReported,
  selfReportedMeasures,
  surveyQuestions,
  weeks,
} from "@/lib/demo-data";

// Served from /public so the PDF renders in the real brand type rather than a
// substitute. Same two files the OG image uses.
Font.register({ family: "Bodoni", src: "/fonts/BodoniModa-Regular.ttf" });
Font.register({ family: "Jost", src: "/fonts/Jost-Regular.ttf" });

const BONE = "#F3EEE4";
const INK = "#17211C";
const BRASS = "#A98448";
const BRASS_DEEP = "#7A5F2E";
const MUTED = "#4F564E";
const SAND = "#D9CDB4";

const s = StyleSheet.create({
  page: {
    backgroundColor: BONE,
    color: INK,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontFamily: "Jost",
    fontSize: 9.5,
    lineHeight: 1.6,
  },
  stamp: {
    position: "absolute",
    bottom: 24,
    left: 48,
    fontFamily: "Jost",
    fontSize: 6.5,
    letterSpacing: 1.6,
    color: MUTED,
    textTransform: "uppercase",
  },
  folio: {
    position: "absolute",
    bottom: 24,
    right: 48,
    fontFamily: "Jost",
    fontSize: 6.5,
    letterSpacing: 1.6,
    color: MUTED,
  },
  rule: { height: 0.75, backgroundColor: BRASS, width: 44, marginBottom: 10 },
  hair: { height: 0.5, backgroundColor: SAND, marginVertical: 8 },
  eyebrow: {
    fontFamily: "Jost",
    fontSize: 7,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: 8,
  },
  h1: { fontFamily: "Bodoni", fontSize: 30, lineHeight: 1.1, marginBottom: 10 },
  h2: { fontFamily: "Bodoni", fontSize: 17, marginBottom: 8 },
  h3: { fontFamily: "Bodoni", fontSize: 12, marginBottom: 4 },
  body: { marginBottom: 8 },
  muted: { color: MUTED },
  section: { marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3.5,
    borderBottomWidth: 0.5,
    borderBottomColor: SAND,
  },
  cellName: { width: "40%" },
  cellRead: { width: "20%", textAlign: "right" },
  cellBand: { width: "24%", textAlign: "right", color: MUTED },
  cellStat: {
    width: "16%",
    textAlign: "right",
    color: BRASS_DEEP,
    fontSize: 8,
  },
  note: {
    borderLeftWidth: 1,
    borderLeftColor: BRASS,
    paddingLeft: 10,
    marginTop: 6,
  },
  panel: { backgroundColor: SAND, padding: 14, marginBottom: 14 },
  sign: { flexDirection: "row", gap: 36, marginTop: 20 },
  signName: {
    fontFamily: "Bodoni",
    fontSize: 13,
    marginTop: 18,
    borderTopWidth: 0.5,
    borderTopColor: INK,
    paddingTop: 5,
  },
});

function Chrome({ page }: { page: string }) {
  return (
    <>
      <Text style={s.stamp} fixed>
        Sample data · illustrative only · not medical advice
      </Text>
      <Text style={s.folio} fixed>
        {page}
      </Text>
    </>
  );
}

function answer(id: string): string {
  const q = surveyQuestions.find((x) => x.id === id);
  const v = q?.prefill;
  if (Array.isArray(v)) return v.join(", ");
  if (v && typeof v === "object") {
    const p = v as { bed?: string; wake?: string };
    return p.bed ? `${p.bed} to ${p.wake}` : "—";
  }
  return String(v ?? "—");
}

export function ReportDocument() {
  return (
    <Document
      title={`${member.name} — baseline report (sample data)`}
      author="Tora House"
    >
      {/* 1 — Cover */}
      <Page size="A4" style={s.page}>
        <Chrome page="Cover" />
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>Tora House · Baseline report</Text>
          <Text style={s.h1}>{member.name}</Text>
          <Text style={s.muted}>December 2026</Text>
          <Text style={{ marginTop: 18 }}>
            Read by {guide.name}, her guide.
          </Text>
          <Text style={s.muted}>
            Signed by {clinician.name}, clinical practitioner.
          </Text>
          <View style={s.note}>
            <Text style={s.muted}>{DISCLAIMER}</Text>
          </View>
        </View>
      </Page>

      {/* 2 — Her snapshot, 3 — What we measured */}
      <Page size="A4" style={s.page}>
        <Chrome page="Her snapshot" />
        <View style={s.section}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>Her snapshot</Text>
          <Text style={s.h2}>In her own words.</Text>
          <Text style={s.body}>“{answer("why")}”</Text>
          <Text style={s.body}>
            If one thing were different in six months: “{answer("oneThing")}”
          </Text>
          <View style={s.hair} />
          <Text style={s.body}>
            {member.age}, {member.area}. Sleep {answer("sleepQuality")} of 5,
            energy {answer("energy")} of 5. Uncomfortable:{" "}
            {answer("discomfort")}. Most of all {answer("priorities")}.
          </Text>
          <Text style={s.muted}>
            Bed {answer("bedWake")}. Largest meal: {answer("largestMeal")}. She
            can give {answer("timePerDay")} on an ordinary day,{" "}
            {answer("timeOfDay")}.
          </Text>
        </View>

        <View style={s.section}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>What we measured</Text>
          <Text style={s.h2}>Her baseline panel.</Text>
          <Text style={[s.muted, s.body]}>
            Every reading is shown next to the band it is read against, so
            nothing here can be mistaken for a verdict.
          </Text>
        </View>

        {markerGroups.map((g) => (
          <View key={g.id} style={s.section} wrap={false}>
            <Text style={s.h3}>{g.system}</Text>
            {g.markers.map((m) => (
              <View key={m.id} style={s.row}>
                <Text style={s.cellName}>{m.name}</Text>
                <Text style={s.cellRead}>{m.baseline}</Text>
                <Text style={s.cellBand}>{m.band}</Text>
                <Text style={s.cellStat}>{m.status ?? "Noted"}</Text>
              </View>
            ))}
            <Text style={[s.muted, { marginTop: 6 }]}>{g.tells}</Text>
          </View>
        ))}
      </Page>

      {/* 4 — How we read it, 5 — What this means */}
      <Page size="A4" style={s.page}>
        <Chrome page="How we read it" />
        <View style={s.section}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>How we read it</Text>
          <Text style={s.h2}>Why these bands.</Text>
          <Text style={s.body}>{indianReferenceNote}</Text>
        </View>

        <View style={s.section}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>What this means</Text>
          <Text style={s.h2}>From {guide.name}.</Text>
          <View style={s.panel}>
            <Text>{guideParagraph}</Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>Her plan</Text>
          <Text style={s.h2}>Five pillars.</Text>
          {pillars.map((p) => (
            <View key={p.id} style={{ marginBottom: 12 }} wrap={false}>
              <Text style={s.h3}>{p.name}</Text>
              <Text style={[s.muted, { marginBottom: 4 }]}>{p.holds}</Text>
              {actions
                .filter((a) => a.pillarId === p.id)
                .map((a) => (
                  <View key={a.id} style={s.row}>
                    <Text style={{ width: "54%" }}>{a.label}</Text>
                    <Text style={{ width: "28%", textAlign: "right" }}>
                      {a.frequency}
                    </Text>
                    <Text
                      style={{ width: "18%", textAlign: "right", color: MUTED }}
                    >
                      {a.resource}
                    </Text>
                  </View>
                ))}
            </View>
          ))}
        </View>
      </Page>

      {/* 6 — Her first month, 7 — A sample day */}
      <Page size="A4" style={s.page}>
        <Chrome page="Her first month" />
        <View style={s.section}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>Her first month</Text>
          <Text style={s.h2}>December 2026, week by week.</Text>
          {weeks.map((w) => (
            <View key={w.week} style={s.row}>
              <Text style={{ width: "22%" }}>Week {w.week}</Text>
              <Text style={{ width: "22%", color: MUTED }}>{w.range}</Text>
              <Text style={{ width: "56%", textAlign: "right" }}>
                {w.theme}
              </Text>
            </View>
          ))}
          <Text style={[s.muted, { marginTop: 8 }]}>
            Each week layers in. Nothing is taken away.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.h3}>Day by day</Text>
          {calendar.map((d) => (
            <View key={d.day} style={s.row} wrap={false}>
              <Text style={{ width: "18%" }}>
                {d.weekday} {d.day}
              </Text>
              <Text style={{ width: "82%" }}>
                {d.added.map((a) => a.label).join(" · ")}
              </Text>
            </View>
          ))}
        </View>

        <View style={s.section} wrap={false}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>A sample day</Text>
          <Text style={s.h2}>Thursday 10 December.</Text>
          {fixedDaily.map((f) => (
            <View key={f.id} style={s.row}>
              <Text>{f.label}</Text>
              <Text style={s.muted}>Every day</Text>
            </View>
          ))}
          {calendar
            .find((d) => d.day === 10)!
            .added.map((a) => (
              <View key={a.id} style={s.row}>
                <Text>{a.label}</Text>
                <Text style={s.muted}>Added today</Text>
              </View>
            ))}
        </View>
      </Page>

      {/* 8 — Retests, 9 — Signed by */}
      <Page size="A4" style={s.page}>
        <Chrome page="What we retest" />
        <View style={s.section}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>What we retest, and when</Text>
          <Text style={s.h2}>Measured back against her own baseline.</Text>
          <Text style={s.body}>{retestList}</Text>

          <Text style={[s.h3, { marginTop: 10 }]}>
            Repeated at month 3 and month 6
          </Text>
          {markerGroups.map((g) => (
            <View key={g.id} style={s.row}>
              <Text style={{ width: "34%" }}>{g.system}</Text>
              <Text style={{ width: "66%", textAlign: "right", color: MUTED }}>
                {g.markers
                  .filter((m) => !m.measuredOnce)
                  .map((m) => m.name)
                  .join(", ")}
              </Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.h3}>What she reports herself</Text>
          <Text style={[s.muted, { marginBottom: 6 }]}>
            On days 1, 15 and 30, out of five. Illustrative.
          </Text>
          {selfReportedMeasures.map((m, i) => (
            <View key={m} style={s.row}>
              <Text style={{ width: "58%" }}>{m}</Text>
              {selfReported.map((r) => (
                <Text key={r.day} style={{ width: "14%", textAlign: "right" }}>
                  {r.scores[i]}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={s.section} wrap={false}>
          <View style={s.rule} />
          <Text style={s.eyebrow}>Signed by</Text>
          <View style={s.sign}>
            <View style={{ width: "46%" }}>
              <Text style={s.signName}>{guide.name}</Text>
              <Text style={s.muted}>Her guide</Text>
            </View>
            <View style={{ width: "46%" }}>
              <Text style={s.signName}>{clinician.name}</Text>
              <Text style={s.muted}>Clinical practitioner</Text>
            </View>
          </View>
          <View style={s.note}>
            <Text style={s.muted}>{DISCLAIMER}</Text>
          </View>
          <Text style={[s.muted, { marginTop: 10, fontSize: 8 }]}>
            Names, readings and signatures on this document are invented for an
            illustrative demo. Nothing here describes a real person.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
