import { useState, useRef, useEffect } from "react";
import { T, GlobalStyles, BrandMark } from "./theme";

// ─── DIAGNOSIS LIBRARY ───────────────────────────────────────────────────────
const DEFAULT_DIAGNOSES = [
  {
    id: "chf",
    name: "CHF Exacerbation",
    color: "#3B82F6",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "BMP/CMP — renal function, electrolytes",
          "BNP or NT-proBNP",
          "CBC with differential",
          "Troponin — rule out ACS as precipitant",
          "TSH — rule out thyroid dysfunction as precipitant",
          "LFTs — evaluate for congestive hepatopathy",
          "UA — rule out infection as precipitant",
          "12-lead EKG",
          "Chest X-ray (PA/lateral if ambulatory)",
          "Echocardiogram — if no recent study or new presentation",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "IV diuresis — furosemide 1–2.5x home oral dose IV",
          "Strict I&Os with daily weights",
          "Fluid restriction 1.5–2L/day (HFrEF)",
          "Continue/optimize GDMT — ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i",
          "Supplemental O2 — target SpO2 ≥94%",
          "Low-sodium diet <2g/day",
          "DVT prophylaxis",
          "Telemetry monitoring",
          "Cardiology consult — new diagnosis, refractory HF, or EF <25%",
          "Dietitian consult — sodium/fluid restriction education",
          "Daily BMP — monitor K+ and creatinine with diuresis",
          "Daily weight — target net fluid loss 0.5–1 kg/day",
        ],
      },
    ],
    evidence: "Per AHA/ACC 2022 Heart Failure Guidelines (Heidenreich et al., JACC 2022)",
  },
  {
    id: "copd",
    name: "COPD Exacerbation",
    color: "#F59E0B",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "ABG — if severe, AMS, or O2 not improving",
          "CBC — evaluate for leukocytosis, polycythemia",
          "BMP — electrolytes, theophylline level if applicable",
          "Sputum culture — if purulent",
          "Blood cultures — if febrile",
          "Procalcitonin — guide antibiotic decision",
          "Chest X-ray — rule out pneumonia, pneumothorax",
          "12-lead EKG — rule out cor pulmonale, arrhythmia",
          "BNP — if CHF overlap suspected",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "SABA + SAMA — albuterol + ipratropium nebs q4–6h",
          "Systemic corticosteroids — prednisone 40mg PO x5 days",
          "Antibiotics if purulent sputum/infection — azithromycin, doxycycline, or levofloxacin",
          "Controlled O2 — target SpO2 88–92% (avoid over-oxygenation)",
          "BiPAP — if pH <7.35 and hypercapnia",
          "DVT prophylaxis",
          "Smoking cessation counseling and resources",
          "Pulmonology consult — severe exacerbation or ventilator requirement",
          "Respiratory therapy — bronchodilator management, pulmonary rehab referral",
          "Serial ABGs if on BiPAP or pH initially low",
          "Continuous SpO2 monitoring — maintain 88–92%",
          "Blood glucose monitoring — steroids",
        ],
      },
    ],
    evidence: "Per GOLD 2024 COPD Guidelines",
  },
  {
    id: "cap",
    name: "CAP / Pneumonia",
    color: "#10B981",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "CBC with differential",
          "BMP",
          "Blood cultures x2 — before antibiotics if possible",
          "Sputum gram stain and culture — if productive cough",
          "Legionella urinary antigen",
          "Streptococcal urinary antigen",
          "Procalcitonin — baseline, guide de-escalation",
          "Chest X-ray PA/lateral",
          "CT chest — if CXR inconclusive or atypical presentation",
          "PSI/PORT or CURB-65 score — document",
          "Respiratory viral panel — influenza, RSV, COVID-19",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "Antibiotics within 4 hours of admission — per IDSA/ATS guidelines",
          "Non-ICU: beta-lactam + macrolide OR respiratory fluoroquinolone monotherapy",
          "ICU/severe: beta-lactam + azithromycin OR beta-lactam + respiratory FQ",
          "Supplemental O2 — target SpO2 ≥94%",
          "IV fluids — if dehydrated or sepsis criteria met",
          "DVT prophylaxis",
          "Antipyretics PRN",
          "Assess pneumococcal and influenza vaccination status at discharge",
          "ID or Pulmonology consult — ICU-level, immunocompromised, or failing therapy",
          "Temperature and WBC trend",
          "Procalcitonin at 48–72h — guide de-escalation",
          "Repeat CXR if not improving at 48–72h",
        ],
      },
    ],
    evidence: "Per IDSA/ATS 2019 CAP Guidelines",
  },
  {
    id: "aki",
    name: "AKI",
    color: "#8B5CF6",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "BMP/CMP — creatinine, BUN, electrolytes, bicarbonate",
          "CBC",
          "UA with microscopy — casts, proteinuria, hematuria",
          "Urine electrolytes, urine creatinine, urine osmolality",
          "FENa (if not on diuretics) or FEUrea (if on diuretics)",
          "Renal ultrasound — rule out obstruction",
          "Urine protein:creatinine ratio — if proteinuria",
          "SPEP, UPEP, free light chains — if myeloma suspected",
          "ANA, ANCA, complement, anti-GBM — if GN suspected",
          "Medication review — identify and remove nephrotoxins",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "IV fluid resuscitation if pre-renal — isotonic crystalloid",
          "Discontinue nephrotoxic agents",
          "Renally dose all medications",
          "Treat hyperkalemia if K+ ≥5.5 or EKG changes",
          "Treat metabolic acidosis if bicarb <15 or pH <7.2",
          "Strict I&Os — foley catheter if oliguria",
          "Avoid iodinated contrast — use alternative or pre-hydrate if unavoidable",
          "Renal diet — low K+, low phosphate, low sodium",
          "Nephrology consult — Cr >3, dialysis indication, unclear etiology, or suspected GN",
          "BMP every 6–12h — creatinine, K+, bicarb trend",
          "Daily weight and volume status assessment",
        ],
      },
    ],
    evidence: "Per KDIGO 2012 AKI Guidelines",
  },
  {
    id: "sepsis",
    name: "Sepsis",
    color: "#EF4444",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "Blood cultures x2 — STAT before antibiotics",
          "CBC with differential",
          "BMP/CMP",
          "Lactic acid — STAT, goal <2 mmol/L",
          "LFTs",
          "Coagulation studies — PT, aPTT, fibrinogen (DIC screen)",
          "Procalcitonin",
          "UA with culture",
          "Chest X-ray — source identification",
          "Source-directed cultures — sputum, wound, drain fluid",
          "CT imaging per suspected source",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "Broad-spectrum antibiotics within 1 hour of recognition",
          "IV crystalloid 30 mL/kg bolus if hypoperfusion — reassess after each bolus",
          "Vasopressors (norepinephrine first-line) if MAP <65 despite fluids",
          "Foley catheter — strict hourly I&Os",
          "Repeat lactic acid at 2h — target ≥10% clearance",
          "Source control — drain abscess, remove infected device",
          "Glucose monitoring — target 140–180 mg/dL",
          "Stress ulcer prophylaxis",
          "DVT prophylaxis when hemostasis assured",
          "Hydrocortisone 200mg/day if refractory septic shock",
          "ID consult — complex source, unusual organism, immunocompromised",
          "ICU consult — septic shock, organ failure, ventilator need",
          "Hourly urine output — goal >0.5 mL/kg/hr",
          "Serial lactic acid until normalized",
          "Narrow antibiotics ASAP per culture data — antimicrobial stewardship",
        ],
      },
    ],
    evidence: "Per Surviving Sepsis Campaign 2021 Guidelines",
  },
  {
    id: "dka",
    name: "DKA",
    color: "#F97316",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "BMP/CMP — glucose, K+, Na+, bicarbonate, anion gap q2–4h initially",
          "Venous blood gas — pH, bicarbonate",
          "Beta-hydroxybutyrate or serum ketones",
          "CBC with differential",
          "UA with ketones",
          "HbA1c — if not recent",
          "Blood cultures if febrile or infectious precipitant suspected",
          "CXR if pulmonary infection suspected",
          "12-lead EKG — evaluate for hyperkalemia changes",
          "Lipase — if abdominal pain, rule out pancreatitis",
          "Identify precipitant — infection, new DM diagnosis, non-adherence, MI",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "IV fluids — 1L NS bolus then 250–500 mL/hr x1–2h",
          "Regular insulin infusion 0.1 units/kg/hr — only after K+ ≥3.5",
          "Potassium replacement — goal K+ 3.5–5.0 mEq/L before and during insulin",
          "Switch to D5 0.45% NS when glucose <200 — keep insulin drip running",
          "Bicarbonate only if pH <6.9",
          "Phosphate replacement if <1.0 mg/dL",
          "NPO until AMS clears, then advance diet",
          "Transition to subcutaneous insulin — overlap drip by 2h before stopping",
          "Treat underlying precipitant",
          "Endocrinology consult — new T1DM, refractory DKA, insulin pump",
          "Diabetes education at discharge",
          "Social work — insulin access, affordability, adherence barriers",
          "Glucose every 1h on insulin drip",
          "BMP every 2–4h — K+, anion gap, bicarbonate",
          "Resolution criteria: glucose <200, bicarb ≥15, pH >7.3, anion gap closed",
        ],
      },
    ],
    evidence: "Per ADA 2024 Standards of Care in Diabetes",
  },
  {
    id: "stroke",
    name: "Stroke",
    color: "#EC4899",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "Non-contrast CT head — STAT to rule out hemorrhage",
          "CT angiography head and neck — evaluate for LVO and dissection",
          "MRI brain with DWI — gold standard for ischemic stroke",
          "CBC, BMP, coagulation studies, glucose — STAT",
          "12-lead EKG — evaluate for afib as cardioembolic source",
          "Troponin",
          "Lipid panel, HbA1c",
          "Continuous telemetry x72h — detect paroxysmal afib",
          "Echocardiogram — cardioembolic workup TTE vs TEE",
          "Hypercoagulable workup — if young or cryptogenic stroke",
          "Calculate and document NIHSS on admission",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "IV alteplase (tPA) — if ischemic, within 4.5h, no contraindications — Neurology STAT",
          "Mechanical thrombectomy — if LVO within window, Neuro IR/stroke alert",
          "Aspirin 325mg — after hemorrhage excluded; delay 24h if tPA given",
          "Permissive hypertension — hold antihypertensives unless SBP >220/120 (ischemic)",
          "Dysphagia screen before any oral intake or medications",
          "High-intensity statin therapy",
          "Anticoagulation if cardioembolic/afib — timing per Neurology",
          "DVT prophylaxis — timing per Neurology based on stroke type",
          "Strict glucose control — target 140–180 mg/dL",
          "Neurology/Stroke team — STAT consult",
          "Speech therapy — dysphagia evaluation",
          "Physical therapy and occupational therapy",
          "Case management — rehab placement, home services",
          "Neuro checks every 1–2h — NIHSS, mental status, focal deficits",
          "Treat fever aggressively — worsens neurological outcomes",
        ],
      },
    ],
    evidence: "Per AHA/ASA 2019 Acute Ischemic Stroke Guidelines",
  },
  {
    id: "syncope",
    name: "Dizziness / Syncope",
    color: "#6366F1",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "12-lead EKG — arrhythmia, QTc prolongation, heart block, WPW",
          "CBC, BMP, glucose",
          "Troponin — rule out myocardial etiology",
          "Orthostatic vital signs x3 positions",
          "Non-contrast CT head — if focal neuro findings or trauma",
          "MRI brain/posterior fossa — if central cause suspected or HINTS positive",
          "HINTS exam — Head Impulse, Nystagmus, Test of Skew",
          "Dix-Hallpike maneuver — if BPPV suspected",
          "Echocardiogram — if structural heart disease suspected",
          "Continuous telemetry monitoring",
          "Medication review — antihypertensives, diuretics, QT-prolonging agents",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "IV access and continuous monitoring",
          "IV fluids — if dehydration or orthostatic etiology",
          "Epley maneuver — if BPPV confirmed on Dix-Hallpike",
          "Meclizine or promethazine — symptomatic vertigo relief",
          "Fall precautions and bed alarm",
          "Offending medication adjustment or discontinuation",
          "Treat underlying arrhythmia per Cardiology",
          "Cardiology consult — cardiac syncope, arrhythmia, structural disease",
          "Neurology consult — central vertigo, posterior circulation stroke, seizure",
          "Physical therapy — vestibular rehabilitation",
          "Continuous telemetry — document arrhythmias",
          "Orthostatic vitals daily",
          "Neurological exam each shift",
        ],
      },
    ],
    evidence: "Per ACC/AHA 2017 Syncope Guidelines; AAN Vertigo Guidelines",
  },
  {
    id: "cellulitis",
    name: "Cellulitis",
    color: "#14B8A6",
    sections: [
      {
        title: "Diagnostic Evaluation",
        items: [
          "CBC with differential",
          "BMP — renal function for antibiotic dosing",
          "Blood cultures — if febrile, immunocompromised, or systemic toxicity",
          "Wound culture — only if open wound, abscess, or purulent drainage",
          "Mark leading edge of erythema with skin marker and timestamp",
          "Ultrasound of affected area — rule out abscess or necrotizing fasciitis",
          "CRP / ESR — track inflammatory response",
          "Lower extremity duplex — if leg involved, rule out DVT",
          "Evaluate for portal of entry — tinea pedis, wound, insect bite",
        ],
      },
      {
        title: "Treatment Plan",
        items: [
          "IV antibiotics non-purulent: cefazolin or nafcillin (MSSA coverage)",
          "MRSA coverage if risk factors: vancomycin, linezolid, or daptomycin",
          "Elevate affected extremity",
          "Mark and reassess erythema borders every 8–12h",
          "Incision and drainage if abscess identified",
          "Wound care as clinically indicated",
          "Treat tinea pedis — topical antifungal",
          "DVT prophylaxis",
          "Step down to oral antibiotics when clinically improving",
          "Surgery consult — URGENT if necrotizing fasciitis suspected (crepitus, skin discoloration, pain out of proportion)",
          "ID consult — refractory, recurrent, or atypical organism",
          "Podiatry — diabetic foot or lower extremity involvement",
          "Erythema border reassessment every 8–12h — progression vs. regression",
          "Temperature curve and WBC trend",
          "Vancomycin AUC/trough monitoring if on vancomycin",
        ],
      },
    ],
    evidence: "Per IDSA 2014 Skin and Soft Tissue Infection Guidelines",
  },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function buildEMRText(dx, criteria) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const lines = [];
  lines.push(`DIAGNOSIS: ${dx.name.toUpperCase()}`);
  lines.push(`Date: ${date}`);
  lines.push(`Evidence Base: ${dx.evidence}`);
  if (criteria && criteria.trim()) {
    lines.push(``);
    lines.push(`CLINICAL CRITERIA / SUPPORTING DATA:`);
    criteria.trim().split("\n").forEach(l => l.trim() && lines.push(`  ${l.trim()}`));
  }
  dx.sections.forEach(sec => {
    lines.push(``);
    lines.push(`${sec.title.toUpperCase()}:`);
    sec.items.forEach(item => lines.push(`  - ${item}`));
  });
  return lines.join("\n");
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function AutoTextarea({ value, onChange, placeholder, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) { ref.current.style.height = "auto"; ref.current.style.height = ref.current.scrollHeight + "px"; }
  }, [value]);
  return (
    <textarea ref={ref} value={value} onChange={onChange} placeholder={placeholder}
      style={{ resize: "none", overflow: "hidden", ...style }} />
  );
}

function CopyBtn({ text, small }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  return (
    <button onClick={copy} style={{
      padding: small ? "6px 12px" : "10px 16px",
      background: copied ? T.accent : "transparent",
      color: copied ? "#04070d" : T.accent,
      border: `1px solid ${T.accent}`, cursor: "pointer",
      fontSize: small ? 10 : 11, fontFamily: T.mono, fontWeight: 500,
      letterSpacing: ".14em", textTransform: "uppercase",
      display: "flex", alignItems: "center", gap: 6,
      transition: "all 0.2s", whiteSpace: "nowrap",
    }}>
      {copied ? "✓ COPIED" : "COPY TO EMR"}
    </button>
  );
}

function EditableItem({ value, onChange, onDelete }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
      <span style={{ color: T.accent, marginTop: 11, flexShrink: 0,
                     width: 4, height: 4, background: T.accent, display: "inline-block" }} />
      <AutoTextarea value={value} onChange={e => onChange(e.target.value)}
        style={{
          flex: 1, padding: "6px 10px",
          border: "1px solid transparent", fontSize: 13.5,
          fontFamily: "inherit", color: T.text, background: "rgba(0,0,0,0.2)",
          lineHeight: 1.55, outline: "none",
        }}
      />
      <button onClick={onDelete} style={{
        marginTop: 6, flexShrink: 0, background: "none", border: "none",
        cursor: "pointer", color: T.textFaint, fontSize: 15, lineHeight: 1, padding: 2,
      }} title="Remove">×</button>
    </div>
  );
}

function DiagnosisCard({ dx, onUpdate, onDelete, autoExpand }) {
  const [expanded, setExpanded] = useState(!!autoExpand);
  const [editingName, setEditingName] = useState(!!autoExpand);
  const [showEMR, setShowEMR] = useState(false);
  const emrText = buildEMRText(dx, dx.criteria || "");

  const updateCriteria = val => onUpdate({ ...dx, criteria: val });
  const updateEvidence = val => onUpdate({ ...dx, evidence: val });
  const updateSectionTitle = (si, val) => {
    const s = dx.sections.map((sec, i) => i === si ? { ...sec, title: val } : sec);
    onUpdate({ ...dx, sections: s });
  };
  const updateItem = (si, ii, val) => {
    const s = dx.sections.map((sec, i) => i === si ? { ...sec, items: sec.items.map((it, j) => j === ii ? val : it) } : sec);
    onUpdate({ ...dx, sections: s });
  };
  const deleteItem = (si, ii) => {
    const s = dx.sections.map((sec, i) => i === si ? { ...sec, items: sec.items.filter((_, j) => j !== ii) } : sec);
    onUpdate({ ...dx, sections: s });
  };
  const addItem = si => {
    const s = dx.sections.map((sec, i) => i === si ? { ...sec, items: [...sec.items, ""] } : sec);
    onUpdate({ ...dx, sections: s });
  };
  const addSection = () => {
    onUpdate({ ...dx, sections: [...dx.sections, { title: "New Section", items: [""] }] });
  };
  const deleteSection = si => {
    onUpdate({ ...dx, sections: dx.sections.filter((_, i) => i !== si) });
  };

  return (
    <div style={{
      position: "relative", background: T.surface,
      border: `1px solid ${expanded ? T.accent : T.border}`,
      marginBottom: 14, transition: "border-color 0.2s",
      boxShadow: expanded ? `0 0 30px ${T.accent}22` : "none",
    }}>
      <div className="ap-corner" style={{ borderColor: expanded ? T.accent : T.border }}/>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px 20px", cursor: "pointer",
        borderBottom: expanded ? `1px dashed ${T.border}` : "none",
      }}>
        <div onClick={() => setExpanded(!expanded)}
          style={{ width: 8, height: 8, background: T.accent, flexShrink: 0,
                   boxShadow: `0 0 8px ${T.accent}` }} />
        {editingName ? (
          <input autoFocus value={dx.name}
            onChange={e => onUpdate({ ...dx, name: e.target.value })}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => e.key === "Enter" && setEditingName(false)}
            style={{
              flex: 1, fontSize: 16, fontWeight: 500, color: T.text,
              border: "none", borderBottom: `1px solid ${T.accent}`,
              background: "transparent", outline: "none", fontFamily: "inherit", padding: "1px 0",
            }}
          />
        ) : (
          <span onClick={() => setExpanded(!expanded)}
            style={{ flex: 1, fontSize: 16, fontWeight: 500, color: T.text,
                     userSelect: "none", display: "flex", alignItems: "center", gap: 10,
                     letterSpacing: "-0.01em" }}>
            {dx.name}
            {dx.id.startsWith("custom-") && (
              <span style={{ fontSize: 9, fontFamily: T.mono, padding: "2px 7px",
                             background: `${T.accent}18`, color: T.accent,
                             border: `1px solid ${T.accent}44`,
                             letterSpacing: ".14em", textTransform: "uppercase" }}>CUSTOM</span>
            )}
          </span>
        )}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button onClick={() => setEditingName(!editingName)} title="Rename"
            style={{ background: "none", border: "none", cursor: "pointer",
                     color: T.textFaint, fontSize: 11, fontFamily: T.mono,
                     padding: "4px 8px", letterSpacing: ".1em", textTransform: "uppercase" }}>RENAME</button>
          <button onClick={() => setShowEMR(!showEMR)} title="Preview EMR text"
            style={{ background: "none", border: "none", cursor: "pointer",
                     color: T.textFaint, fontSize: 11, fontFamily: T.mono,
                     padding: "4px 8px", letterSpacing: ".1em", textTransform: "uppercase" }}>EMR</button>
          <button onClick={onDelete} title="Remove diagnosis"
            style={{ background: "none", border: "none", cursor: "pointer",
                     color: T.alert, fontSize: 16, padding: "2px 8px" }}>×</button>
          <div onClick={() => setExpanded(!expanded)}
            style={{ color: T.textFaint, fontSize: 11, cursor: "pointer",
                     userSelect: "none", marginLeft: 4 }}>
            {expanded ? "▲" : "▼"}
          </div>
        </div>
      </div>

      {showEMR && (
        <div style={{ padding: "16px 20px", borderBottom: `1px dashed ${T.border}`,
                      background: "rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontFamily: T.mono, fontWeight: 500, color: T.accent,
                           textTransform: "uppercase", letterSpacing: ".18em" }}>▾ EMR PREVIEW</span>
            <div style={{ display: "flex", gap: 6 }}>
              <CopyBtn text={emrText} small />
              <button onClick={() => setShowEMR(false)}
                style={{ background: "none", border: "none", cursor: "pointer",
                         color: T.textFaint, fontSize: 16 }}>×</button>
            </div>
          </div>
          <pre style={{
            margin: 0, padding: "12px 14px",
            background: T.bg, border: `1px solid ${T.border}`,
            fontSize: 11.5, lineHeight: 1.7, fontFamily: T.mono,
            color: T.textDim, whiteSpace: "pre-wrap", wordBreak: "break-word",
            maxHeight: 320, overflowY: "auto",
          }}>{emrText}</pre>
        </div>
      )}

      {expanded && (
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontFamily: T.mono, color: T.accent,
                          textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 8 }}>
              EVIDENCE BASE
            </div>
            <input value={dx.evidence} onChange={e => updateEvidence(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.2)",
                border: `1px solid ${T.border}`, fontSize: 13, fontFamily: "inherit",
                color: T.textDim, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 22, padding: "14px 16px",
                        background: `${T.accent}08`, border: `1px solid ${T.accent}33` }}>
            <div style={{ fontSize: 10, fontFamily: T.mono, color: T.accent,
                          textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 10 }}>
              CLINICAL CRITERIA / SUPPORTING DATA
            </div>
            <AutoTextarea
              value={dx.criteria || ""}
              onChange={e => updateCriteria(e.target.value)}
              placeholder={`Describe why this patient meets criteria for ${dx.name}.\n\nExamples:\n- BNP 1,240 pg/mL (markedly elevated)\n- CXR shows bilateral pulmonary edema and cardiomegaly\n- 3+ pitting edema bilateral lower extremities\n- Weight gain of 8 lbs over 5 days`}
              style={{
                width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.3)",
                border: `1px solid ${T.border}`, fontSize: 13,
                fontFamily: "inherit", color: T.text,
                lineHeight: 1.6, outline: "none", boxSizing: "border-box", minHeight: 90,
              }}
            />
          </div>
          {dx.sections.map((sec, si) => (
            <div key={si} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
                            paddingBottom: 10, borderBottom: `1px dashed ${T.border}` }}>
                <input value={sec.title} onChange={e => updateSectionTitle(si, e.target.value)}
                  style={{
                    flex: 1, fontSize: 11, fontWeight: 500, color: T.accent, fontFamily: T.mono,
                    textTransform: "uppercase", letterSpacing: ".18em",
                    border: "none", background: "transparent", outline: "none", padding: "2px 0",
                  }}
                />
                <button onClick={() => deleteSection(si)} title="Remove section"
                  style={{ background: "none", border: "none", cursor: "pointer",
                           color: T.textFaint, fontSize: 14 }}>×</button>
              </div>
              {sec.items.map((item, ii) => (
                <EditableItem key={ii} value={item}
                  onChange={val => updateItem(si, ii, val)}
                  onDelete={() => deleteItem(si, ii)}
                />
              ))}
              <button onClick={() => addItem(si)} style={{
                marginTop: 6, marginLeft: 18, background: "none", border: "none",
                cursor: "pointer", color: T.accent, fontSize: 11,
                fontFamily: T.mono, padding: "2px 0", letterSpacing: ".1em", textTransform: "uppercase",
              }}>+ ADD ITEM</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 14,
                        borderTop: `1px dashed ${T.border}` }}>
            <button onClick={addSection} style={{
              padding: "8px 14px", background: "transparent",
              border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 11,
              fontFamily: T.mono, color: T.textDim, letterSpacing: ".14em", textTransform: "uppercase",
            }}>+ ADD SECTION</button>
            <CopyBtn text={emrText} small />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ANTIBIOTIC TOOL ─────────────────────────────────────────────────────────
const ABX_DATA = [
  {
    category: "Pneumonia (CAP)",
    color: "#10B981",
    regimens: [
      {
        name: "Non-severe, no MRSA/Pseudomonas risk",
        firstLine: "Amoxicillin-clavulanate 875/125mg PO q8h + Azithromycin 500mg PO daily",
        alt: "Levofloxacin 750mg PO/IV daily (penicillin allergy)",
        duration: "5 days",
        renalDosing: [
          { gfr: "≥30", dose: "Standard dose" },
          { gfr: "10–29", dose: "Amox-clav: 500/125mg q12h; Levofloxacin: 750mg load then 500mg q24h" },
          { gfr: "<10 / HD", dose: "Levofloxacin 500mg q48h; avoid amox-clav — use alternative" },
        ],
        allergyNote: "Penicillin allergy: Levofloxacin 750mg daily OR Doxycycline 100mg PO q12h + Azithromycin",
        notes: "Per IDSA/ATS 2019. Use CURB-65 to determine inpatient vs outpatient.",
      },
      {
        name: "Severe CAP / ICU",
        firstLine: "Ceftriaxone 1g IV q24h + Azithromycin 500mg IV/PO daily",
        alt: "Beta-lactam + Levofloxacin 750mg IV daily (macrolide intolerance)",
        duration: "5–7 days",
        renalDosing: [
          { gfr: "≥30", dose: "Standard dose" },
          { gfr: "<30", dose: "Ceftriaxone unchanged; adjust azithromycin with caution" },
          { gfr: "HD", dose: "Ceftriaxone 1g q24h; Levofloxacin 500mg q48h if substituted" },
        ],
        allergyNote: "Penicillin allergy (severe): Aztreonam 2g IV q8h + Levofloxacin 750mg IV daily",
        notes: "Add Vancomycin or Linezolid if MRSA risk (prior MRSA, cavitary lesion, post-influenza).",
      },
    ],
  },
  {
    category: "Sepsis / Bacteremia (Unknown Source)",
    color: "#EF4444",
    regimens: [
      {
        name: "Empiric broad-spectrum (no MRSA risk)",
        firstLine: "Piperacillin-tazobactam 3.375g IV q6h (extended infusion 4h preferred)",
        alt: "Cefepime 2g IV q8h (pip-tazo shortage or allergy)",
        duration: "Until source identified, then narrow per cultures",
        renalDosing: [
          { gfr: "≥40", dose: "Standard: pip-tazo 3.375g q6h" },
          { gfr: "20–40", dose: "Pip-tazo 2.25g q6h; Cefepime 2g q12h" },
          { gfr: "<20 / HD", dose: "Pip-tazo 2.25g q8h; Cefepime 1g q24h" },
        ],
        allergyNote: "PCN allergy (mild): Cefepime 2g q8h. Severe PCN allergy: Meropenem 1g IV q8h or Aztreonam + Metronidazole",
        notes: "Draw blood cultures x2 before antibiotics. Target <1 hour from sepsis recognition.",
      },
      {
        name: "Empiric with MRSA coverage",
        firstLine: "Vancomycin (AUC-guided dosing) + Piperacillin-tazobactam 3.375g IV q6h",
        alt: "Vancomycin + Cefepime 2g IV q8h",
        duration: "Narrow within 48–72h per culture data",
        renalDosing: [
          { gfr: "≥50", dose: "Vancomycin: 25–30 mg/kg/day divided q8–12h; target AUC 400–600" },
          { gfr: "20–49", dose: "Vancomycin: 15–20 mg/kg q12–24h; monitor AUC closely" },
          { gfr: "<20 / HD", dose: "Vancomycin: dose per pharmacy AUC monitoring; redose after HD" },
        ],
        allergyNote: "Vancomycin allergy: Daptomycin 6–8 mg/kg IV q24h (not for pneumonia). Linezolid 600mg IV/PO q12h alternative.",
        notes: "MRSA risk: prior MRSA, IVDU, healthcare exposure, skin/soft tissue source.",
      },
    ],
  },
  {
    category: "UTI / Pyelonephritis",
    color: "#6366F1",
    regimens: [
      {
        name: "Uncomplicated pyelonephritis",
        firstLine: "Ceftriaxone 1g IV q24h (transition to PO when improving)",
        alt: "Ciprofloxacin 400mg IV q12h → 500mg PO q12h",
        duration: "7 days (fluoroquinolone) or 14 days (beta-lactam)",
        renalDosing: [
          { gfr: "≥30", dose: "Standard dose" },
          { gfr: "10–29", dose: "Ciprofloxacin 200mg IV q12h; Ceftriaxone unchanged" },
          { gfr: "<10 / HD", dose: "Ciprofloxacin 200mg IV q18–24h; Ceftriaxone 1g q24h" },
        ],
        allergyNote: "PCN/Cephalosporin allergy: Aztreonam 1g IV q8h OR Ciprofloxacin 400mg IV q12h",
        notes: "Obtain urine culture before antibiotics. Fluoroquinolone resistance >20% locally — check antibiogram.",
      },
      {
        name: "Complicated UTI / Healthcare-associated",
        firstLine: "Piperacillin-tazobactam 3.375g IV q6h",
        alt: "Meropenem 500mg IV q6h (ESBL suspected)",
        duration: "10–14 days",
        renalDosing: [
          { gfr: "≥40", dose: "Standard pip-tazo 3.375g q6h" },
          { gfr: "20–40", dose: "Pip-tazo 2.25g q6h; Meropenem 500mg q8h" },
          { gfr: "<20 / HD", dose: "Pip-tazo 2.25g q8h; Meropenem 500mg q12h" },
        ],
        allergyNote: "PCN allergy: Aztreonam 1g IV q8h + Metronidazole 500mg q8h. Or Ciprofloxacin if susceptible.",
        notes: "Consider ESBL if prior UTI, prior antibiotics, travel, or healthcare exposure. Urology consult if structural abnormality.",
      },
    ],
  },
  {
    category: "Skin & Soft Tissue (Cellulitis / SSTI)",
    color: "#14B8A6",
    regimens: [
      {
        name: "Non-purulent cellulitis (MSSA coverage)",
        firstLine: "Cefazolin 2g IV q8h",
        alt: "Nafcillin 1–2g IV q4h OR Oxacillin 2g IV q4h",
        duration: "5 days (reassess — extend if not improving)",
        renalDosing: [
          { gfr: "≥30", dose: "Cefazolin 2g q8h standard" },
          { gfr: "10–30", dose: "Cefazolin 1g q12h" },
          { gfr: "<10 / HD", dose: "Cefazolin 0.5g q12–24h; give post-HD on dialysis days" },
        ],
        allergyNote: "PCN allergy (mild/moderate): Cefazolin still preferred (low cross-reactivity). Severe: Clindamycin 600mg IV q8h OR Vancomycin",
        notes: "Mark erythema borders serially. Step down to Cephalexin 500mg PO q6h when improving.",
      },
      {
        name: "Purulent cellulitis / abscess / MRSA risk",
        firstLine: "Vancomycin IV (AUC-guided) — see dosing note",
        alt: "Daptomycin 4–6 mg/kg IV q24h OR Linezolid 600mg IV/PO q12h",
        duration: "5–7 days after source control",
        renalDosing: [
          { gfr: "≥50", dose: "Vancomycin: 25–30 mg/kg/day; target AUC/MIC 400–600" },
          { gfr: "20–49", dose: "Vancomycin: 15–20 mg/kg q12–24h; pharmacy AUC monitoring" },
          { gfr: "<20 / HD", dose: "Vancomycin: post-HD redosing per levels. Daptomycin: 4 mg/kg q48h" },
        ],
        allergyNote: "Vancomycin allergy: Daptomycin 4–6 mg/kg q24h (adjust for renal). Linezolid 600mg PO/IV q12h (watch drug interactions).",
        notes: "I&D if abscess — culture the wound. MRSA risk: prior MRSA, failure of beta-lactam, IVDU, nasal carriage.",
      },
    ],
  },
  {
    category: "COPD Exacerbation",
    color: "#F59E0B",
    regimens: [
      {
        name: "Mild–Moderate (outpatient-type pathogens)",
        firstLine: "Azithromycin 500mg PO/IV daily",
        alt: "Doxycycline 100mg PO q12h OR Amoxicillin-clavulanate 875/125mg PO q8h",
        duration: "5 days",
        renalDosing: [
          { gfr: "≥30", dose: "Standard dose" },
          { gfr: "<30", dose: "Azithromycin unchanged. Amox-clav: 500/125mg q12h" },
          { gfr: "HD", dose: "Azithromycin preferred; avoid amox-clav" },
        ],
        allergyNote: "Macrolide allergy: Doxycycline 100mg PO q12h. QTc prolongation risk: use doxycycline over azithromycin.",
        notes: "Antibiotics only if ≥2 of: increased dyspnea, sputum volume, or sputum purulence (Anthonisen criteria). Per GOLD 2024.",
      },
    ],
  },
  {
    category: "Intra-abdominal Infection",
    color: "#F97316",
    regimens: [
      {
        name: "Community-acquired, mild–moderate",
        firstLine: "Ceftriaxone 1g IV q24h + Metronidazole 500mg IV/PO q8h",
        alt: "Ertapenem 1g IV q24h (ESBL risk) OR Moxifloxacin 400mg IV/PO q24h",
        duration: "4–7 days after source control",
        renalDosing: [
          { gfr: "≥30", dose: "Standard" },
          { gfr: "10–29", dose: "Ceftriaxone unchanged; Metronidazole unchanged" },
          { gfr: "<10", dose: "Ceftriaxone 1g q24h; Metronidazole 500mg q12h" },
        ],
        allergyNote: "PCN/cephalosporin allergy: Ciprofloxacin 400mg IV q12h + Metronidazole 500mg q8h. Severe: Aztreonam + Metronidazole.",
        notes: "Source control is essential — ID surgery/IR for drainage. Per IDSA 2010 IAI Guidelines.",
      },
      {
        name: "Healthcare-associated / high severity",
        firstLine: "Piperacillin-tazobactam 3.375g IV q6h (extended infusion)",
        alt: "Meropenem 1g IV q8h (septic shock, ESBL risk, or pip-tazo failure)",
        duration: "4–7 days after adequate source control",
        renalDosing: [
          { gfr: "≥40", dose: "Pip-tazo 3.375g q6h; Meropenem 1g q8h" },
          { gfr: "20–40", dose: "Pip-tazo 2.25g q6h; Meropenem 500mg q8h" },
          { gfr: "<20 / HD", dose: "Pip-tazo 2.25g q8h; Meropenem 500mg q12h" },
        ],
        allergyNote: "Severe PCN allergy: Aztreonam 2g IV q8h + Metronidazole + Vancomycin (if MRSA risk).",
        notes: "Add antifungal (Fluconazole) if recurrent GI perforation or immunocompromised.",
      },
    ],
  },
];

function AntibioticTool() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [showRenal, setShowRenal] = useState({});
  const [allergyFilter, setAllergyFilter] = useState("");
  const [copiedIdx, setCopiedIdx] = useState(null);

  const toggleRenal = key => setShowRenal(prev => ({ ...prev, [key]: !prev[key] }));

  const copyRegimen = (cat, reg, idx) => {
    const lines = [
      `ANTIBIOTIC REGIMEN: ${cat}`,
      `Indication: ${reg.name}`,
      ``,
      `First-line: ${reg.firstLine}`,
      `Alternative: ${reg.alt}`,
      `Duration: ${reg.duration}`,
      ``,
      `Renal Dosing:`,
      ...reg.renalDosing.map(r => `  GFR ${r.gfr}: ${r.dose}`),
      ``,
      `Allergy considerations: ${reg.allergyNote}`,
      `Notes: ${reg.notes}`,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const filteredData = allergyFilter.trim()
    ? ABX_DATA.map(cat => ({
        ...cat,
        regimens: cat.regimens.filter(r =>
          r.allergyNote.toLowerCase().includes(allergyFilter.toLowerCase()) ||
          r.firstLine.toLowerCase().includes(allergyFilter.toLowerCase()) ||
          r.alt.toLowerCase().includes(allergyFilter.toLowerCase())
        ),
      })).filter(cat => cat.regimens.length > 0)
    : ABX_DATA;

  const displayData = activeCategory
    ? filteredData.filter(c => c.category === activeCategory)
    : filteredData;

  return (
    <div>
      <div className="ap-crumb"><span>REFERENCE</span><span>/</span><b>ANTIBIOTIC PROTOCOLS</b></div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.accent,
                      letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>
          EMPIRIC THERAPY · STEWARDSHIP · DOSING
        </div>
        <h2 style={{ fontSize: 42, fontWeight: 500, letterSpacing: "-0.03em",
                     lineHeight: 1, margin: "0 0 12px", color: T.text }}>
          Antibiotic reference.
        </h2>
        <div style={{ fontSize: 13, color: T.textDim, maxWidth: 600 }}>
          Evidence-based regimens with renal dosing and allergy alternatives.
          All regimens include step-down and duration guidance.
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={allergyFilter} onChange={e => setAllergyFilter(e.target.value)}
          placeholder="Filter by allergy or drug (e.g. penicillin, vancomycin)…"
          className="ap-input" style={{ flex: 1, minWidth: 240 }}
        />
        {allergyFilter && (
          <button className="ap-ghost" onClick={() => setAllergyFilter("")}>✕ CLEAR</button>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        <button className={"ap-chip" + (!activeCategory ? " active" : "")}
          onClick={() => setActiveCategory(null)}>ALL</button>
        {ABX_DATA.map(cat => (
          <button key={cat.category}
            className={"ap-chip" + (activeCategory === cat.category ? " active" : "")}
            onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}>
            {cat.category}
          </button>
        ))}
      </div>
      {displayData.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: T.textFaint, fontFamily: T.mono,
                      fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" }}>
          NO REGIMENS MATCH YOUR FILTER.
        </div>
      )}
      {displayData.map(cat => (
        <div key={cat.category} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
                        paddingBottom: 10, borderBottom: `1px dashed ${T.border}` }}>
            <div style={{ width: 6, height: 6, background: T.accent, boxShadow: `0 0 8px ${T.accent}` }} />
            <span style={{ fontSize: 11, fontFamily: T.mono, color: T.accent,
                           letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 500 }}>
              {cat.category}
            </span>
          </div>
          {cat.regimens.map((reg, ri) => {
            const key = `${cat.category}-${ri}`;
            const copyIdx = `${cat.category}-${ri}`;
            const isFirst = ri === 0;
            return (
              <div key={ri} style={{
                position: "relative", background: T.surface,
                border: `1px solid ${isFirst ? T.accent : T.border}`,
                marginBottom: 14,
                boxShadow: isFirst ? `0 0 30px ${T.accent}22` : "none",
              }}>
                <div className="ap-corner" style={{ borderColor: isFirst ? T.accent : T.border }} />
                {isFirst && (
                  <div style={{ position: "absolute", top: 12, right: 12, fontFamily: T.mono,
                                fontSize: 9, color: "#04070d", background: T.accent,
                                padding: "3px 8px", letterSpacing: ".16em" }}>1ST LINE</div>
                )}
                <div style={{ padding: "16px 20px", borderBottom: `1px dashed ${T.border}`,
                              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: T.text,
                                 letterSpacing: "-0.005em" }}>{reg.name}</span>
                  <button onClick={() => copyRegimen(cat.category, reg, copyIdx)} style={{
                    padding: "5px 12px",
                    background: copiedIdx === copyIdx ? T.accent : "transparent",
                    color: copiedIdx === copyIdx ? "#04070d" : T.accent,
                    border: `1px solid ${T.accent}`, cursor: "pointer",
                    fontSize: 10, fontFamily: T.mono, fontWeight: 500,
                    letterSpacing: ".14em", textTransform: "uppercase",
                  }}>{copiedIdx === copyIdx ? "✓ COPIED" : "COPY"}</button>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ marginBottom: 14, padding: "10px 14px",
                                background: `${T.accent}11`, borderLeft: `2px solid ${T.accent}` }}>
                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.accent,
                                  textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 4 }}>FIRST-LINE</div>
                    <div style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{reg.firstLine}</div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.warn,
                                  textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 4 }}>ALTERNATIVE</div>
                    <div style={{ fontSize: 13, color: T.textDim }}>{reg.alt}</div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.textFaint,
                                  textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 4 }}>DURATION</div>
                    <div style={{ fontSize: 13, color: T.textDim, fontFamily: T.mono }}>{reg.duration}</div>
                  </div>
                  <div style={{ marginBottom: 12, padding: "10px 14px",
                                background: `${T.warn}10`, border: `1px solid ${T.warn}40` }}>
                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.warn,
                                  textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 4 }}>⚠ ALLERGY ALTERNATIVES</div>
                    <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.55 }}>{reg.allergyNote}</div>
                  </div>
                  <button onClick={() => toggleRenal(key)} style={{
                    padding: "6px 12px", background: showRenal[key] ? `${T.accent}15` : "transparent",
                    border: `1px solid ${showRenal[key] ? T.accent : T.border}`,
                    cursor: "pointer", fontSize: 10, fontFamily: T.mono,
                    color: showRenal[key] ? T.accent : T.textDim,
                    letterSpacing: ".14em", textTransform: "uppercase",
                    marginBottom: showRenal[key] ? 10 : 0,
                  }}>
                    {showRenal[key] ? "▾ HIDE" : "▸ SHOW"} RENAL DOSING
                  </button>
                  {showRenal[key] && (
                    <div style={{ border: `1px solid ${T.accent}40`, background: "rgba(0,0,0,0.3)" }}>
                      <div style={{ background: `${T.accent}15`, padding: "8px 14px", fontSize: 10,
                                    fontFamily: T.mono, color: T.accent,
                                    textTransform: "uppercase", letterSpacing: ".18em" }}>
                        RENAL DOSING BY GFR (mL/min)
                      </div>
                      {reg.renalDosing.map((r, k) => (
                        <div key={k} style={{ display: "flex", gap: 14, padding: "10px 14px",
                                             borderTop: k > 0 ? `1px dashed ${T.border}` : "none" }}>
                          <span style={{ fontSize: 11, fontFamily: T.mono, color: T.accent,
                                         minWidth: 80, flexShrink: 0,
                                         letterSpacing: ".08em", textTransform: "uppercase" }}>GFR {r.gfr}</span>
                          <span style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.5 }}>{r.dose}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {reg.notes && (
                    <div style={{ marginTop: 12, fontSize: 11.5, color: T.textFaint,
                                  fontFamily: T.mono, lineHeight: 1.6,
                                  paddingTop: 10, borderTop: `1px dashed ${T.border}` }}>
                      ◇ {reg.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const PALETTE = [
  "#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6",
  "#F97316","#EC4899","#14B8A6","#6366F1","#84CC16","#06B6D4","#A855F7"
];

const STORAGE_KEY = "hospitalist-dx-library-v1";

function loadLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const savedMap = Object.fromEntries(saved.map(d => [d.id, d]));
      const merged = DEFAULT_DIAGNOSES.map(d => savedMap[d.id] ? { ...d, ...savedMap[d.id] } : d);
      const defaultIds = new Set(DEFAULT_DIAGNOSES.map(d => d.id));
      const customs = saved.filter(d => !defaultIds.has(d.id));
      return [...merged, ...customs];
    }
  } catch (e) {}
  return DEFAULT_DIAGNOSES;
}

function saveLibrary(lib) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lib)); } catch (e) {}
}

export default function App() {
  const [library, setLibrary] = useState(() => loadLibrary());
  const [selected, setSelected] = useState([]);
  const [view, setView] = useState("welcome");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDxName, setNewDxName] = useState("");
  const [newDxColor, setNewDxColor] = useState(PALETTE[0]);
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    saveLibrary(library);
    setSavedFlash(true);
    const t = setTimeout(() => setSavedFlash(false), 1800);
    return () => clearTimeout(t);
  }, [library]);

  const filteredLib = library.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const activeDiagnoses = library.filter(d => selected.includes(d.id));

  const toggleSelect = id => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const updateDx = updated => {
    setLibrary(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const deleteDx = id => {
    setLibrary(prev => prev.filter(d => d.id !== id));
    setSelected(prev => prev.filter(x => x !== id));
    if (newlyCreatedId === id) setNewlyCreatedId(null);
  };

  const createNewDx = () => {
    if (!newDxName.trim()) return;
    const id = `custom-${Date.now()}`;
    const dx = {
      id, name: newDxName.trim(), color: newDxColor, criteria: "",
      evidence: "Enter guideline / evidence source",
      sections: [
        { title: "Diagnostic Evaluation", items: [""] },
        { title: "Treatment Plan", items: [""] },
      ],
    };
    setLibrary(prev => [...prev, dx]);
    setSelected(prev => [...prev, id]);
    setNewlyCreatedId(id);
    setShowCreateModal(false);
    setNewDxName(""); setNewDxColor(PALETTE[0]);
    setView("plan");
  };

  const allEMR = activeDiagnoses.map(dx => buildEMRText(dx, dx.criteria || "")).join("\n\n" + "=".repeat(50) + "\n\n");

  return (
    <div style={{ minHeight: "100vh", color: T.text, fontFamily: T.font }}>
      <GlobalStyles />

      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(6,9,18,0.85)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <BrandMark />
          <span style={{ fontWeight: 600, fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase" }}>
            A&P / Generator
          </span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {[
            { id: "welcome", label: "Home" },
            { id: "select", label: "Diagnoses" },
            { id: "plan",   label: `Plan${selected.length > 0 ? ` · ${selected.length}` : ""}` },
            { id: "abx",    label: "Antibiotics" },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding: "7px 14px", border: `1px solid ${view === id ? T.accent : "transparent"}`,
              cursor: "pointer", fontSize: "11px", fontWeight: 500, fontFamily: T.mono,
              letterSpacing: ".14em", textTransform: "uppercase",
              background: view === id ? `${T.accent}15` : "transparent",
              color: view === id ? T.accent : T.textDim,
              transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "24px", fontFamily: T.mono, fontSize: "11px",
                      color: T.textFaint, textTransform: "uppercase", letterSpacing: ".12em",
                      alignItems: "center" }}>
          <span>UNIT · MICU-3</span>
          <span>USR · M.OKAFOR, MD</span>
          {savedFlash
            ? <span style={{ color: T.accent }}>✓ SAVED</span>
            : <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><span className="pulse-dot"/>SYNCED</span>}
        </div>
      </div>

      <div style={{ maxWidth: view === "welcome" ? "100%" : "1100px", margin: "0 auto", padding: view === "welcome" ? "0" : "40px 28px" }}>

        {showCreateModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
          }}>
            <div style={{
              position: "relative", background: T.surfaceSolid,
              border: `1px solid ${T.accent}55`, padding: 32, width: 460,
              boxShadow: `0 0 80px ${T.accent}33`,
            }}>
              <div className="ap-corner" style={{ width: 20, height: 20 }}/>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent,
                            letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 12 }}>
                NEW ENTRY
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: T.text,
                            letterSpacing: "-0.02em", marginBottom: 6 }}>
                Create new diagnosis
              </div>
              <div style={{ fontSize: 13, color: T.textDim, marginBottom: 22 }}>
                You can edit all details after creating.
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontFamily: T.mono, color: T.textFaint,
                              textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 8 }}>
                  DIAGNOSIS NAME *
                </div>
                <input autoFocus value={newDxName} onChange={e => setNewDxName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && createNewDx()}
                  placeholder="e.g. Hepatic Encephalopathy"
                  className="ap-input"
                />
              </div>
              <div style={{ marginBottom: 26 }}>
                <div style={{ fontSize: 10, fontFamily: T.mono, color: T.textFaint,
                              textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 10 }}>
                  ACCENT COLOR
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PALETTE.map(c => (
                    <div key={c} onClick={() => setNewDxColor(c)} style={{
                      width: 26, height: 26, background: c, cursor: "pointer",
                      border: newDxColor === c ? `2px solid ${T.text}` : "2px solid transparent",
                      boxSizing: "border-box", transition: "border 0.15s",
                      boxShadow: newDxColor === c ? `0 0 12px ${c}` : "none",
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={createNewDx} disabled={!newDxName.trim()}
                  className="ap-cta" style={{ flex: 1, justifyContent: "center", padding: "12px" }}>
                  CREATE &amp; EDIT
                </button>
                <button onClick={() => { setShowCreateModal(false); setNewDxName(""); }}
                  className="ap-ghost" style={{ padding: "12px 20px" }}>
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "welcome" && (
          <div style={{ position: "relative", padding: "56px 40px 0", minHeight: "calc(100vh - 73px)" }}>
            <div className="ap-crumb"><span>SESSION</span><span>/</span><b>NEW ENCOUNTER</b></div>
            <div style={{ maxWidth: 900 }}>
              <h1 style={{ fontSize: "72px", fontWeight: 500, lineHeight: ".96",
                           letterSpacing: "-0.04em", margin: "0 0 20px" }}>
                Clinical reasoning,<br/>
                <em style={{ fontStyle: "normal", color: T.accent,
                             textShadow: `0 0 40px ${T.accent}99` }}>
                  at the speed of rounds.
                </em>
              </h1>
              <p style={{ fontSize: "17px", maxWidth: 540, lineHeight: 1.55,
                          color: T.textDim, margin: "0 0 44px" }}>
                Generate evidence-aligned assessments and plans for any inpatient diagnosis.
                Antibiotic stewardship and dosing baked in.
              </p>
              <button className="ap-cta" onClick={() => setView("select")}>
                Begin encounter
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div style={{
              position: "absolute", right: 40, top: 120, width: 280, padding: 20,
              border: `1px solid ${T.border}`, background: T.surface, backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textFaint,
                            letterSpacing: ".2em", textTransform: "uppercase",
                            marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
                <span>SYSTEM</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                  <span className="pulse-dot"/>ONLINE
                </span>
              </div>
              {[
                ["Library", `${library.length} diagnoses`],
                ["Guidelines", "IDSA · SCCM · AHA"],
                ["Storage", "Local · auto-saved"],
                ["Build", "04.26.01 // STABLE"],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 0", borderTop: "1px dashed rgba(255,255,255,0.08)",
                  fontSize: "12px", fontFamily: T.mono,
                }}>
                  <span style={{ color: T.textFaint }}>{k}</span>
                  <span style={{ color: T.accent }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{
              position: "absolute", bottom: 32, left: 40, right: 40,
              display: "flex", justifyContent: "space-between",
              fontFamily: T.mono, fontSize: "11px", color: "rgba(231,238,247,0.35)",
              letterSpacing: ".1em", textTransform: "uppercase",
            }}>
              <span>BUILD 04.26.01 // STABLE</span>
              <span>HIPAA-COMPLIANT // PHI ENCRYPTED AT REST</span>
              <span>SHIFT M · 07:42</span>
            </div>
          </div>
        )}

        {view === "select" && (
          <>
            <div className="ap-crumb"><span>NEW ENCOUNTER</span><span>/</span><b>SELECT DIAGNOSIS</b></div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)",
                              width:18, height:18, color: T.accent }}>
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
                </svg>
                <input className="ap-input" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search diagnosis or syndrome…" style={{ paddingLeft: 50 }} />
              </div>
              <button onClick={() => setShowCreateModal(true)} style={{
                padding: "14px 18px", background: "transparent", color: T.accent,
                border: `1px solid ${T.accent}55`, cursor: "pointer",
                fontSize: "11px", fontWeight: 500, fontFamily: T.mono,
                letterSpacing: ".14em", textTransform: "uppercase", whiteSpace: "nowrap",
              }}>+ New Diagnosis</button>
            </div>
            <div style={{
              marginBottom: "20px", padding: "10px 14px",
              background: T.surface, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "11px", fontFamily: T.mono, color: T.textDim,
                             letterSpacing: ".1em", textTransform: "uppercase",
                             display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: T.accent }}>◆</span>
                ALL CHANGES AUTO-SAVED LOCALLY
              </span>
              <button onClick={() => { if (window.confirm("Reset all diagnoses to defaults? Custom diagnoses will be removed and edits will be lost.")) { setLibrary(DEFAULT_DIAGNOSES); setSelected([]); }}}
                style={{ fontSize: "10px", fontFamily: T.mono, color: T.textFaint,
                         background: "none", border: "none", cursor: "pointer",
                         letterSpacing: ".14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Reset to defaults
              </button>
            </div>
            {selected.length > 0 && (
              <div style={{ marginBottom: "20px", display: "flex", gap: "8px",
                            alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", fontFamily: T.mono, color: T.textFaint,
                               letterSpacing: ".14em", textTransform: "uppercase" }}>
                  {selected.length} SELECTED ·
                </span>
                {activeDiagnoses.map(d => (
                  <span key={d.id} style={{
                    fontSize: "11px", fontFamily: T.mono, padding: "4px 10px",
                    background: `${T.accent}12`, color: T.accent,
                    border: `1px solid ${T.accent}44`, letterSpacing: ".06em",
                  }}>{d.name}</span>
                ))}
                <button className="ap-cta" onClick={() => setView("plan")} style={{ padding: "8px 16px", fontSize: 12 }}>
                  View Plan
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {filteredLib.map(dx => {
                const isSel = selected.includes(dx.id);
                const itemCount = dx.sections.reduce((a, s) => a + s.items.length, 0);
                return (
                  <div key={dx.id} onClick={() => toggleSelect(dx.id)} style={{
                    position: "relative", padding: "20px", cursor: "pointer",
                    background: isSel ? `${T.accent}10` : T.surface,
                    border: `1px solid ${isSel ? T.accent : T.border}`,
                    transition: "all 0.2s",
                  }}>
                    <div className="ap-corner"/>
                    <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.accent,
                                  letterSpacing: ".14em", marginBottom: 10 }}>
                      {dx.id.startsWith("custom-") ? "CUSTOM" : "STANDARD"}
                      {isSel && <span style={{ marginLeft: 8, color: T.accent }}>● SELECTED</span>}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 500, lineHeight: 1.25,
                                  letterSpacing: "-0.01em", marginBottom: 10, color: T.text }}>
                      {dx.name}
                    </div>
                    <div style={{ display: "flex", gap: 14, fontFamily: T.mono, fontSize: 10,
                                  color: T.textFaint, letterSpacing: ".08em", textTransform: "uppercase" }}>
                      <span>{itemCount} ITEMS</span>
                      <span>{dx.sections.length} SECTIONS</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredLib.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px", color: T.textFaint, fontFamily: T.mono,
                            fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" }}>
                NO DIAGNOSES MATCH "{search}"
              </div>
            )}
          </>
        )}

        {view === "plan" && (
          <>
            <div className="ap-crumb"><span>ENCOUNTER</span><span>/</span><b>ACTIVE PLAN</b></div>
            {activeDiagnoses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: ".14em",
                              textTransform: "uppercase", color: T.textFaint, marginBottom: 16 }}>
                  NO DIAGNOSES SELECTED
                </div>
                <button className="ap-ghost" onClick={() => setView("select")}>← SELECT DIAGNOSES</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between",
                              alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.accent,
                                  letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>
                      A&P · {activeDiagnoses.length} DIAGNOSIS{activeDiagnoses.length > 1 ? "ES" : ""} · GENERATED
                    </div>
                    <h2 style={{ fontSize: 42, fontWeight: 500, letterSpacing: "-0.03em",
                                 lineHeight: 1, margin: "0 0 8px", color: T.text }}>
                      Active plan.
                    </h2>
                    <div style={{ fontSize: 13, color: T.textDim }}>
                      Fill in clinical criteria, edit any item, then copy to EMR.
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="ap-ghost" onClick={() => setView("select")}>← EDIT SELECTION</button>
                    {activeDiagnoses.length > 1 && <CopyBtn text={allEMR} />}
                  </div>
                </div>
                {activeDiagnoses.map(dx => (
                  <DiagnosisCard key={dx.id} dx={dx}
                    autoExpand={dx.id === newlyCreatedId}
                    onUpdate={updateDx}
                    onDelete={() => deleteDx(dx.id)}
                  />
                ))}
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button onClick={() => setShowCreateModal(true)} style={{
                    padding: "10px 16px", background: "transparent",
                    border: `1px dashed ${T.borderMid}`, cursor: "pointer",
                    fontSize: 11, fontFamily: T.mono, color: T.textDim,
                    letterSpacing: ".14em", textTransform: "uppercase",
                  }}>+ CREATE NEW DIAGNOSIS</button>
                </div>
              </>
            )}
          </>
        )}

        {view === "abx" && <AntibioticTool />}

      </div>
    </div>
  );
}
