(function () {
  var CORE = ["My sexual urges have interfered with my relationships.","My sexual thoughts or behaviors have caused problems in my life.","My sexual desires have disrupted my daily functioning (work, school, routine).","I sometimes fail to meet responsibilities because of sexual behaviors.","I sometimes feel I might lose control over my sexual urges.","I find myself thinking about sex when I need to focus on other things.","My sexual thoughts feel stronger than my ability to control them.","I struggle to control my sexual thoughts or behaviors.","I think about sex more than I would like to.","My level of sexual desire feels higher than what my partners or situation allow."];
  var PORN = ["I use pornography more often than I intend to.","I have tried to cut down on pornography use but could not.","I use pornography to cope with stress, anxiety, or negative mood.","My pornography use has caused problems (relationships, work, time, mood).","I feel restless, irritable, or uncomfortable when trying to reduce pornography use."];
  var O = ["Not at all like me","Slightly like me","Mainly like me","Very much like me"].map(function (l, i) { return { v: i + 1, l: l }; });
  function it(t, i) { var k = i + 1; return { id: "q" + k, num: (k < 10 ? "0" : "") + k, text: t, opts: O }; }
  function coreBand(t) { return t <= 15 ? "Normal (10-15): non-pathologic libido variation" : t <= 24 ? "Mild elevation (16-24): assess context (stress, partner mismatch, environment)" : t <= 32 ? "Moderate concern (25-32): emerging loss of control" : "High concern (33-40): compulsive pattern with impairment"; }
  function pornBand(t) { return t <= 8 ? "Normal (5-8): no intervention indicated" : t <= 11 ? "Mild (9-11): problematic use" : t <= 16 ? "Moderate concern (12-16): escalating or preoccupied use" : "High concern (17-20): likely compulsive use"; }
  function totBand(t) { return t <= 23 ? "Normal (15-23)" : t <= 37 ? "Mild elevation (24-37)" : t <= 49 ? "Moderate concern (38-49)" : "High concern (50-60)"; }
  window.CFG = {
    slug: "csb", short: "CSB", sub: "Sexual Behavior and Pornography Use Screener",
    custom: "Custom screener, not a validated instrument. Not an official or validated evidence-based screening instrument. For clinical discussion only. (C) Yuriy Bortnik.",
    intro: "Below are statements about sexual thoughts and behaviors over the past three to six months. Select the answer that best describes you.<br>1 Not at all like me, 2 Slightly like me, 3 Mainly like me, 4 Very much like me.",
    sections: [
      { id: "core", title: "CORE QUESTIONS", items: CORE.map(it) },
      { id: "porn", title: "PORNOGRAPHY-SPECIFIC ADD-ON", items: PORN.map(function (t, i) { return it(t, i + 10); }) },
      { id: "fin", title: "FINAL QUESTION", items: [{ id: "final", num: "", text: "Have you tried to cut down your sexual behaviors and been unable to?", opts: [{ v: 1, l: "Yes", show: false }, { v: 0, l: "No", show: false }] }] }
    ],
    scoreRed: "Score: clinician use. Bands below are from the clinician scoring sheet, rescaled to the 1 to 4 answer scale.",
    scoringHint: '<p class="hint">One scale throughout: 1 to 4 (Not at all like me to Very much like me). Core (1-10): 10-40. Pornography add-on (11-15): 5-20. Total (1-15): 15-60. Core bands (from source): 10-15 Normal, 16-24 Mild elevation, 25-32 Moderate concern, 33-40 High concern. Add-on bands (source was 5-25 on a 1-5 scale, rescaled proportionally to 5-20): 5-8 Normal, 9-11 Mild, 12-16 Moderate concern, 17-20 High concern. Total bands (derived proportionally from the core bands): 15-23 Normal, 24-37 Mild elevation, 38-49 Moderate concern, 50-60 High concern. Weight the highest-yield items over the total score: items 1-4 (functional impairment), 7 and 8 (loss of control), 12 (failed attempts to cut down), 14 (real-world consequences).</p><p class="hint">This screener supports clinical conversation and is not a diagnostic instrument. Elevated scores warrant a fuller assessment.</p>',
    footer: "CSB · Custom screener, not a validated instrument · (C) Yuriy Bortnik",
    score: function (A, H) {
      var c = H.sum(A, H.ids("q", 1, 10)), p = H.sum(A, H.ids("q", 11, 15)), t = (c === null || p === null) ? null : c + p;
      var flags = [];
      var hy = [["Items 1-4 (functional impairment)", [1, 2, 3, 4]], ["Items 7-8 (loss of control)", [7, 8]], ["Item 12 (failed attempts to cut down)", [12]], ["Item 14 (real-world consequences)", [14]]];
      hy.forEach(function (h) { var hit = h[1].filter(function (k) { return A["q" + k] !== null && A["q" + k] >= 3; }); if (hit.length) flags.push("High-yield: " + h[0] + " rated 3 or 4 on item(s) " + hit.join(", ")); });
      if (A.final === 1) flags.push("Final question Yes: tried to cut down sexual behaviors and been unable to.");
      var imp = H.sum(A, [ "q1", "q2", "q3", "q4" ]);
      if (c !== null && c >= 25 && imp !== null && imp <= 8) flags.push("High core score with low impairment (items 1-4 at 8 or less): suggests high libido or a situational driver rather than pathology.");
      if (c !== null && p !== null && (p - 5) / 15 >= 0.5 && (c - 10) / 30 < 0.2) flags.push("Elevation concentrated in items 11-15: suggests a reinforcement-driven use pattern.");
      return { incomplete: t === null, flags: flags, rows: [
        ["Core (1-10), 10-40", c === null ? "Incomplete, not scored" : c + " / 40, " + coreBand(c)],
        ["Pornography add-on (11-15), 5-20", p === null ? "Incomplete, not scored" : p + " / 20, " + pornBand(p)],
        ["Total (1-15), 15-60", t === null ? "Incomplete, not scored" : t + " / 60, " + totBand(t)],
        ["Final question", A.final === null ? "blank" : (A.final ? "Yes" : "No")]
      ] };
    }
  };
})();
