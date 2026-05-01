import { useState, useRef, useEffect } from "react";

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
      padding: small ? "5px 12px" : "8px 18px",
      borderRadius: "7px",
      background: copied ? "#10B981" : "#1E293B",
      color: "white", border: "none", cursor: "pointer",
      fontSize: small ? "12px" : "13px",
      fontFamily: "inherit", fontWeight: 600,
      display: "flex", alignItems: "center", gap: "5px",
      transition: "background 0.2s", whiteSpace: "nowrap",
    }}>
      {copied ? "✓ Copied!" : "📋 Copy to EMR"}
    </button>
  );
}

function EditableItem({ value, onChange, onDelete }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "4px" }}>
      <span style={{ color: "#94A3B8", marginTop: "9px", flexShrink: 0, fontSize: "13px" }}>—</span>
      <AutoTextarea value={value} onChange={e => onChange(e.target.value)}
        style={{
          flex: 1, padding: "5px 8px", borderRadius: "6px",
          border: "1px solid #E2E8F0", fontSize: "13.5px",
          fontFamily: "inherit", color: "#1E293B", background: "white",
          lineHeight: "1.5", outline: "none",
        }}
      />
      <button onClick={onDelete} style={{
        marginTop: "6px", flexShrink: 0, background: "none", border: "none",
        cursor: "pointer", color: "#CBD5E1", fontSize: "15px", lineHeight: 1, padding: "2px",
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
      background: "white", borderRadius: "14px",
      border: `1.5px solid ${expanded ? dx.color : "#E2E8F0"}`,
      marginBottom: "10px", overflow: "hidden",
      boxShadow: expanded ? `0 4px 24px ${dx.color}18` : "0 1px 4px rgba(0,0,0,0.05)",
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}>
      {/* Card Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "13px 16px", cursor: "pointer",
        borderBottom: expanded ? "1px solid #F1F5F9" : "none",
        background: expanded ? "#FAFBFC" : "white",
      }}>
        <div onClick={() => setExpanded(!expanded)}
          style={{ width: "10px", height: "10px", borderRadius: "50%", background: dx.color, flexShrink: 0 }} />

        {editingName ? (
          <input autoFocus value={dx.name}
            onChange={e => onUpdate({ ...dx, name: e.target.value })}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => e.key === "Enter" && setEditingName(false)}
            style={{
              flex: 1, fontSize: "15px", fontWeight: 700, color: "#0F172A",
              border: "none", borderBottom: `2px solid ${dx.color}`,
              background: "transparent", outline: "none", fontFamily: "inherit", padding: "1px 0",
            }}
          />
        ) : (
          <span onClick={() => setExpanded(!expanded)}
            style={{ flex: 1, fontSize: "15px", fontWeight: 700, color: "#0F172A", userSelect: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            {dx.name}
            {dx.id.startsWith("custom-") && (
              <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "10px", background: dx.color + "20", color: dx.color, fontWeight: 700, letterSpacing: "0.05em" }}>CUSTOM</span>
            )}
          </span>
        )}

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button onClick={() => setEditingName(!editingName)}
            title="Rename" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "14px", padding: "2px 4px" }}>✏️</button>
          <button onClick={() => setShowEMR(!showEMR)}
            title="Preview EMR text" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "14px", padding: "2px 4px" }}>📄</button>
          <button onClick={onDelete}
            title="Remove diagnosis" style={{ background: "none", border: "none", cursor: "pointer", color: "#FCA5A5", fontSize: "16px", padding: "2px 4px" }}>×</button>
          <div onClick={() => setExpanded(!expanded)}
            style={{ color: "#94A3B8", fontSize: "13px", cursor: "pointer", userSelect: "none" }}>
            {expanded ? "▲" : "▼"}
          </div>
        </div>
      </div>

      {/* EMR Preview inline */}
      {showEMR && (
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>EMR Preview</span>
            <div style={{ display: "flex", gap: "6px" }}>
              <CopyBtn text={emrText} small />
              <button onClick={() => setShowEMR(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "16px" }}>×</button>
            </div>
          </div>
          <pre style={{
            margin: 0, padding: "10px 12px", borderRadius: "8px",
            background: "white", border: "1px solid #E2E8F0",
            fontSize: "11.5px", lineHeight: "1.7", fontFamily: "'Courier New', monospace",
            color: "#1E293B", whiteSpace: "pre-wrap", wordBreak: "break-word",
            maxHeight: "320px", overflowY: "auto",
          }}>{emrText}</pre>
        </div>
      )}

      {/* Expanded Body */}
      {expanded && (
        <div style={{ padding: "16px" }}>

          {/* Evidence base */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
              📚 Evidence Base
            </div>
            <input value={dx.evidence} onChange={e => updateEvidence(e.target.value)}
              style={{
                width: "100%", padding: "7px 10px", borderRadius: "7px",
                border: "1px solid #E2E8F0", fontSize: "13px", fontFamily: "inherit",
                color: "#475569", outline: "none", boxSizing: "border-box",
                background: "#FAFBFF",
              }}
            />
          </div>

          {/* Clinical criteria */}
          <div style={{ marginBottom: "18px", padding: "12px 14px", borderRadius: "10px", background: `${dx.color}08`, border: `1px solid ${dx.color}30` }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: dx.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
              🩺 Clinical Criteria / Supporting Data
            </div>
            <AutoTextarea
              value={dx.criteria || ""}
              onChange={e => updateCriteria(e.target.value)}
              placeholder={`Describe why this patient meets criteria for ${dx.name}.\n\nExamples:\n- BNP 1,240 pg/mL (markedly elevated)\n- CXR shows bilateral pulmonary edema and cardiomegaly\n- 3+ pitting edema bilateral lower extremities\n- Weight gain of 8 lbs over 5 days`}
              style={{
                width: "100%", padding: "8px 10px", borderRadius: "7px",
                border: `1px solid ${dx.color}40`, fontSize: "13px",
                fontFamily: "inherit", color: "#1E293B", background: "white",
                lineHeight: "1.6", outline: "none", boxSizing: "border-box",
                minHeight: "90px",
              }}
            />
          </div>

          {/* Sections */}
          {dx.sections.map((sec, si) => (
            <div key={si} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <input value={sec.title} onChange={e => updateSectionTitle(si, e.target.value)}
                  style={{
                    flex: 1, fontSize: "12px", fontWeight: 700, color: "#374151",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    border: "none", borderBottom: "1px dashed #E2E8F0",
                    background: "transparent", outline: "none", fontFamily: "inherit", padding: "2px 0",
                  }}
                />
                <button onClick={() => deleteSection(si)} title="Remove section"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: "14px" }}>×</button>
              </div>
              {sec.items.map((item, ii) => (
                <EditableItem key={ii} value={item}
                  onChange={val => updateItem(si, ii, val)}
                  onDelete={() => deleteItem(si, ii)}
                />
              ))}
              <button onClick={() => addItem(si)} style={{
                marginTop: "5px", marginLeft: "18px", background: "none", border: "none",
                cursor: "pointer", color: dx.color, fontSize: "12px",
                fontFamily: "inherit", padding: "2px 0", fontWeight: 600,
              }}>+ Add item</button>
            </div>
          ))}

          <div style={{ display: "flex", gap: "8px", marginTop: "8px", paddingTop: "12px", borderTop: "1px dashed #F1F5F9" }}>
            <button onClick={addSection} style={{
              padding: "6px 14px", borderRadius: "6px", background: "#F1F5F9",
              border: "none", cursor: "pointer", fontSize: "12px",
              fontFamily: "inherit", color: "#475569", fontWeight: 600,
            }}>+ Add Section</button>
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
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>💊 Antibiotic Reference</div>
        <div style={{ fontSize: "13px", color: "#64748B" }}>Evidence-based regimens with renal dosing and allergy alternatives. All regimens include step-down and duration guidance.</div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={allergyFilter}
          onChange={e => setAllergyFilter(e.target.value)}
          placeholder="🔍 Filter by allergy or drug (e.g. penicillin, vancomycin)..."
          style={{
            flex: 1, minWidth: "200px", padding: "8px 13px", borderRadius: "8px",
            border: "1px solid #E2E8F0", fontSize: "13px", fontFamily: "inherit",
            background: "white", outline: "none",
          }}
        />
        {allergyFilter && (
          <button onClick={() => setAllergyFilter("")} style={{
            padding: "8px 12px", borderRadius: "8px", background: "#FEF2F2",
            border: "1px solid #FECACA", color: "#DC2626", cursor: "pointer",
            fontSize: "12px", fontFamily: "inherit", fontWeight: 600,
          }}>✕ Clear</button>
        )}
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "18px", flexWrap: "wrap" }}>
        <button onClick={() => setActiveCategory(null)} style={{
          padding: "5px 12px", borderRadius: "20px", border: "none", cursor: "pointer",
          fontSize: "12px", fontWeight: 600, fontFamily: "inherit",
          background: !activeCategory ? "#0F172A" : "#F1F5F9",
          color: !activeCategory ? "white" : "#475569",
        }}>All</button>
        {ABX_DATA.map(cat => (
          <button key={cat.category} onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)} style={{
            padding: "5px 12px", borderRadius: "20px", border: "none", cursor: "pointer",
            fontSize: "12px", fontWeight: 600, fontFamily: "inherit",
            background: activeCategory === cat.category ? cat.color : "#F1F5F9",
            color: activeCategory === cat.category ? "white" : "#475569",
            transition: "all 0.15s",
          }}>{cat.category}</button>
        ))}
      </div>

      {displayData.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
          No regimens match your filter.
        </div>
      )}

      {displayData.map(cat => (
        <div key={cat.category} style={{ marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", paddingBottom: "8px", borderBottom: `2px solid ${cat.color}` }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: cat.color }} />
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>{cat.category}</span>
          </div>

          {cat.regimens.map((reg, ri) => {
            const key = `${cat.category}-${ri}`;
            const copyIdx = `${cat.category}-${ri}`;
            return (
              <div key={ri} style={{
                background: "white", borderRadius: "12px", border: "1px solid #E2E8F0",
                marginBottom: "12px", overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                {/* Regimen header */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", background: "#FAFBFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>{reg.name}</span>
                  <button onClick={() => copyRegimen(cat.category, reg, copyIdx)} style={{
                    padding: "4px 12px", borderRadius: "6px",
                    background: copiedIdx === copyIdx ? "#10B981" : "#0F172A",
                    color: "white", border: "none", cursor: "pointer",
                    fontSize: "11px", fontWeight: 700, fontFamily: "inherit",
                  }}>{copiedIdx === copyIdx ? "✓ Copied" : "📋 Copy"}</button>
                </div>

                <div style={{ padding: "14px 16px" }}>
                  {/* First line */}
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>First-Line</div>
                    <div style={{ fontSize: "13.5px", color: "#0F172A", fontWeight: 600 }}>{reg.firstLine}</div>
                  </div>

                  {/* Alternative */}
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>Alternative</div>
                    <div style={{ fontSize: "13px", color: "#374151" }}>{reg.alt}</div>
                  </div>

                  {/* Duration */}
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>Duration</div>
                    <div style={{ fontSize: "13px", color: "#374151" }}>{reg.duration}</div>
                  </div>

                  {/* Allergy note */}
                  <div style={{ marginBottom: "10px", padding: "8px 12px", borderRadius: "7px", background: "#FEF9EC", border: "1px solid #FDE68A" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>⚠ Allergy Alternatives</div>
                    <div style={{ fontSize: "12.5px", color: "#78350F" }}>{reg.allergyNote}</div>
                  </div>

                  {/* Renal dosing toggle */}
                  <button onClick={() => toggleRenal(key)} style={{
                    padding: "5px 12px", borderRadius: "6px",
                    background: showRenal[key] ? "#EFF6FF" : "#F8FAFC",
                    border: `1px solid ${showRenal[key] ? "#BFDBFE" : "#E2E8F0"}`,
                    cursor: "pointer", fontSize: "12px", fontWeight: 600,
                    fontFamily: "inherit", color: showRenal[key] ? "#1E40AF" : "#475569",
                    marginBottom: showRenal[key] ? "10px" : "0",
                  }}>
                    🫘 {showRenal[key] ? "Hide" : "Show"} Renal Dosing
                  </button>

                  {showRenal[key] && (
                    <div style={{ borderRadius: "8px", border: "1px solid #BFDBFE", overflow: "hidden" }}>
                      <div style={{ background: "#EFF6FF", padding: "6px 12px", fontSize: "10px", fontWeight: 700, color: "#1E40AF", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Renal Dosing by GFR (mL/min)
                      </div>
                      {reg.renalDosing.map((r, k) => (
                        <div key={k} style={{
                          display: "flex", gap: "12px", padding: "8px 12px",
                          borderTop: k > 0 ? "1px solid #DBEAFE" : "none",
                          background: k % 2 === 0 ? "white" : "#F8FBFF",
                        }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#1E40AF", minWidth: "80px", flexShrink: 0 }}>GFR {r.gfr}</span>
                          <span style={{ fontSize: "12px", color: "#374151" }}>{r.dose}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {reg.notes && (
                    <div style={{ marginTop: "10px", fontSize: "11.5px", color: "#64748B", fontStyle: "italic", paddingTop: "8px", borderTop: "1px dashed #F1F5F9" }}>
                      📌 {reg.notes}
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
      // Merge: keep saved edits for known IDs, append any saved custom ones
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
  const [view, setView] = useState("select");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDxName, setNewDxName] = useState("");
  const [newDxColor, setNewDxColor] = useState(PALETTE[0]);
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  // Auto-save library whenever it changes
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
    <div style={{ minHeight: "100vh", background: "#F0F4F8", fontFamily: "'Georgia', serif" }}>

      {/* Top Bar */}
      <div style={{
        background: "#0F172A", color: "white",
        padding: "0 28px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "54px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px" }}>Hospitalist Dx Planner</span>
          <span style={{ fontSize: "11px", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>Evidence-Based</span>
          {savedFlash && (
            <span style={{ fontSize: "11px", color: "#10B981", display: "flex", alignItems: "center", gap: "4px", transition: "opacity 0.3s" }}>
              ✓ Saved
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {[
            { id: "select", label: "Dx Planner" },
            { id: "plan",   label: `My Plan${selected.length > 0 ? ` (${selected.length})` : ""}` },
            { id: "abx",    label: "💊 Antibiotics" },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding: "6px 14px", borderRadius: "7px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 600, fontFamily: "inherit",
              background: view === id ? "#3B82F6" : "transparent",
              color: view === id ? "white" : "#64748B",
              transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 20px" }}>

        {/* CREATE MODAL */}
        {showCreateModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>Create New Diagnosis</div>
              <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "20px" }}>You can edit all details after creating.</div>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" }}>Diagnosis Name *</div>
                <input autoFocus value={newDxName} onChange={e => setNewDxName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && createNewDx()}
                  placeholder="e.g. Hepatic Encephalopathy"
                  style={{ width: "100%", padding: "9px 11px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "22px" }}>
                <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Color</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {PALETTE.map(c => (
                    <div key={c} onClick={() => setNewDxColor(c)} style={{
                      width: "26px", height: "26px", borderRadius: "50%", background: c, cursor: "pointer",
                      border: newDxColor === c ? "3px solid #0F172A" : "3px solid transparent",
                      boxSizing: "border-box", transition: "border 0.15s",
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={createNewDx} disabled={!newDxName.trim()} style={{
                  flex: 1, padding: "10px", borderRadius: "8px",
                  background: newDxName.trim() ? "#3B82F6" : "#E2E8F0",
                  color: newDxName.trim() ? "white" : "#94A3B8",
                  border: "none", cursor: newDxName.trim() ? "pointer" : "default",
                  fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
                }}>Create & Edit</button>
                <button onClick={() => { setShowCreateModal(false); setNewDxName(""); }} style={{
                  padding: "10px 18px", borderRadius: "8px", background: "white",
                  border: "1px solid #E2E8F0", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", color: "#64748B",
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ── SELECT VIEW ── */}
        {view === "select" && (
          <>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search diagnoses..."
                style={{
                  flex: 1, padding: "9px 14px", borderRadius: "9px",
                  border: "1px solid #E2E8F0", fontSize: "14px", fontFamily: "inherit",
                  background: "white", outline: "none",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              />
              <button onClick={() => setShowCreateModal(true)} style={{
                padding: "9px 18px", borderRadius: "9px", background: "#0F172A",
                color: "white", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap",
              }}>+ New Diagnosis</button>
            </div>
            <div style={{ marginBottom: "16px", padding: "8px 12px", borderRadius: "8px", background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#166534" }}>
                💾 All changes and custom diagnoses are automatically saved to this browser.
              </span>
              <button onClick={() => { if (window.confirm("Reset all diagnoses to defaults? Custom diagnoses will be removed and edits will be lost.")) { setLibrary(DEFAULT_DIAGNOSES); setSelected([]); }}}
                style={{ fontSize: "11px", color: "#94A3B8", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", marginLeft: "12px" }}>
                Reset to defaults
              </button>
            </div>

            {selected.length > 0 && (
              <div style={{ marginBottom: "18px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "#64748B" }}>{selected.length} selected:</span>
                {activeDiagnoses.map(d => (
                  <span key={d.id} style={{
                    fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
                    background: d.color + "18", color: d.color,
                    border: `1px solid ${d.color}44`, fontWeight: 600,
                  }}>{d.name}</span>
                ))}
                <button onClick={() => setView("plan")} style={{
                  padding: "5px 14px", borderRadius: "7px", background: "#3B82F6",
                  color: "white", border: "none", cursor: "pointer",
                  fontSize: "12px", fontWeight: 700, fontFamily: "inherit",
                }}>View Plan →</button>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {filteredLib.map(dx => {
                const isSel = selected.includes(dx.id);
                return (
                  <div key={dx.id} onClick={() => toggleSelect(dx.id)} style={{
                    padding: "14px 16px", borderRadius: "11px", cursor: "pointer",
                    border: `2px solid ${isSel ? dx.color : "#E2E8F0"}`,
                    background: isSel ? dx.color + "10" : "white",
                    transition: "all 0.15s",
                    boxShadow: isSel ? `0 2px 12px ${dx.color}22` : "0 1px 3px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: dx.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "14px", fontWeight: 700, color: isSel ? dx.color : "#1E293B" }}>{dx.name}</span>
                      {isSel && <span style={{ marginLeft: "auto", color: dx.color, fontSize: "15px" }}>✓</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", paddingLeft: "17px" }}>
                      {dx.sections.reduce((a, s) => a + s.items.length, 0)} items · {dx.sections.length} sections
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredLib.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                No diagnoses match "{search}"
              </div>
            )}
          </>
        )}

        {/* ── PLAN VIEW ── */}
        {view === "plan" && (
          <>
            {activeDiagnoses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
                <div style={{ fontSize: "15px", color: "#64748B", marginBottom: "16px" }}>No diagnoses selected yet.</div>
                <button onClick={() => setView("select")} style={{
                  padding: "9px 20px", borderRadius: "8px", background: "#3B82F6",
                  color: "white", border: "none", cursor: "pointer",
                  fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
                }}>← Select Diagnoses</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>
                      Active Plan — {activeDiagnoses.length} Diagnosis{activeDiagnoses.length > 1 ? "es" : ""}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                      Fill in clinical criteria, edit any item, then copy to EMR
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setView("select")} style={{
                      padding: "7px 14px", borderRadius: "7px", background: "white",
                      border: "1px solid #E2E8F0", cursor: "pointer",
                      fontSize: "12px", fontFamily: "inherit", color: "#475569", fontWeight: 600,
                    }}>← Edit Selection</button>
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
                <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                  <button onClick={() => setShowCreateModal(true)} style={{
                    padding: "8px 16px", borderRadius: "8px", background: "white",
                    border: "1px dashed #CBD5E1", cursor: "pointer",
                    fontSize: "13px", fontFamily: "inherit", color: "#64748B", fontWeight: 600,
                  }}>+ Create New Diagnosis</button>
                </div>
              </>
            )}
          </>
        )}
        {/* ── ANTIBIOTIC VIEW ── */}
        {view === "abx" && <AntibioticTool />}

      </div>
    </div>
  );
}
