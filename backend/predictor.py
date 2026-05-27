"""
╔══════════════════════════════════════════════════════════╗
║  SAFEVOICE — backend/predictor.py                        ║
║  Core inference engine — used by app.py at runtime       ║
╚══════════════════════════════════════════════════════════╝
"""

import joblib
import os
import sys

# Allow importing similar_cases from ml/
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "../ml"))
from similar_cases import find_similar_case

MODELS_DIR    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../ml/models")
SEVERITY_PATH = os.path.join(MODELS_DIR, "severity_model.pkl")
CRIME_PATH    = os.path.join(MODELS_DIR, "crime_model.pkl")

# ════════════════════════════════════════════════════════════
# LEGAL DATABASE  (verified Indian law — updated 2024)
# ════════════════════════════════════════════════════════════

LEGAL_DB = {
    "domestic_violence": {
        "ipc_sections": [
            "IPC 498A — Cruelty by husband or his relatives (up to 3 years jail)",
            "IPC 323  — Voluntarily causing hurt",
            "IPC 506  — Criminal intimidation",
            "IPC 307  — Attempt to murder (if life-threatening)"
        ],
        "acts": [
            "Protection of Women from Domestic Violence Act, 2005",
            "Dowry Prohibition Act, 1961 (if dowry-related)"
        ],
        "authority": [
            "Nearest Police Station (file FIR under IPC 498A)",
            "Protection Officer — District Women & Child Development Office",
            "Magistrate Court — for Protection Order / Residence Order",
            "One Stop Centre (OSC) — free shelter, legal aid, medical help"
        ],
        "helplines": [
            "Women Helpline: 181 (24x7, FREE)",
            "NCW Helpline: 7827-170-170",
            "Police Emergency: 100",
            "One Stop Centre: 181"
        ],
        "ngos": [
            "iCall TISS — 9152987821",
            "Majlis Law — Mumbai",
            "SNEHI — Delhi",
            "Vimochana — Bangalore",
            "Swayam — Kolkata"
        ],
        "steps": [
            "Step 1: If in immediate danger, call 100 (Police) or 181 (Women Helpline) RIGHT NOW.",
            "Step 2: Go to a safe place — neighbour, relative, or One Stop Centre (call 181).",
            "Step 3: Photograph all injuries and keep records of all incidents with dates and times.",
            "Step 4: File a Domestic Incident Report (DIR) with a Protection Officer at your District Women & Child office.",
            "Step 5: File FIR at the nearest police station under IPC 498A. Police cannot refuse — it is a cognizable offence.",
            "Step 6: Apply to Magistrate for a Protection Order (stops abuser approaching you) and Residence Order (right to stay in home).",
            "Step 7: Claim maintenance/monetary relief under Section 20 of the DV Act.",
            "Step 8: Reach out to an NGO (see list above) for free legal representation."
        ]
    },

    "sexual_assault": {
        "ipc_sections": [
            "IPC 376  — Rape (minimum 7 years, up to life imprisonment)",
            "IPC 376D — Gang rape (minimum 20 years, up to life)",
            "IPC 354  — Assault or use of criminal force to outrage modesty",
            "POCSO Act Sections 3–6 — if victim is below 18 years"
        ],
        "acts": [
            "Criminal Law (Amendment) Act, 2013",
            "POCSO Act, 2012 (Protection of Children from Sexual Offences)"
        ],
        "authority": [
            "Nearest Police Station — police MUST register FIR (Supreme Court — Lalita Kumari judgment)",
            "Special Fast-Track Court for rape/POCSO cases",
            "One Stop Centre — free shelter, medical exam, legal aid"
        ],
        "helplines": [
            "Women Helpline: 181 (24x7, FREE)",
            "One Stop Centre: 181",
            "Police Emergency: 100",
            "Childline (if under 18): 1098"
        ],
        "ngos": [
            "Majlis Law — Mumbai",
            "Lawyers Collective — Delhi/Mumbai",
            "Sakhi — Kerala",
            "iCall TISS — 9152987821"
        ],
        "steps": [
            "Step 1: Go to the nearest government hospital or One Stop Centre. Medical examination is FREE.",
            "Step 2: Do NOT bathe, change clothes, or wash yourself before medical examination — this preserves evidence.",
            "Step 3: Police MUST register your FIR. If they refuse, complain to the DSP/SP directly.",
            "Step 4: Request a woman police officer to record your statement (you have this legal right).",
            "Step 5: Your identity will NOT be revealed in media — this is protected by law.",
            "Step 6: The case will be heard in a Fast Track Special Court.",
            "Step 7: Apply for victim compensation under your State's Victim Compensation Scheme.",
            "Step 8: Seek free legal aid from DLSA (District Legal Services Authority) — call NALSA: 15100."
        ]
    },

    "workplace_harassment": {
        "ipc_sections": [
            "IPC 354A — Sexual harassment (up to 3 years jail)",
            "IPC 509  — Word, gesture or act to insult modesty of a woman",
            "IPC 506  — Criminal intimidation (if threatened)"
        ],
        "acts": [
            "Sexual Harassment of Women at Workplace (Prevention, Prohibition & Redressal) Act, 2013 — POSH Act",
            "IPC 354A added by Criminal Law Amendment Act 2013"
        ],
        "authority": [
            "Internal Complaints Committee (ICC) — mandatory for organisations with 10+ employees",
            "Local Complaints Committee (LCC) — at District Collector's office if no ICC or employer is accused",
            "Labour Commissioner",
            "Police Station (if criminal complaint required)"
        ],
        "helplines": [
            "SHe-Box Portal: shebox.nic.in (online complaints for government employees)",
            "NCW Helpline: 7827-170-170",
            "Women Helpline: 181"
        ],
        "ngos": [
            "Majlis Law",
            "SEWA — Ahmedabad",
            "Sakshi NGO — Delhi",
            "iCall TISS — 9152987821"
        ],
        "steps": [
            "Step 1: Write down every incident — date, time, location, what happened, any witnesses.",
            "Step 2: Save all evidence — messages, emails, call records, screenshots.",
            "Step 3: File a written complaint with the ICC within 3 months of the incident.",
            "Step 4: If the organisation has no ICC (illegal for 10+ employees), file with LCC at District Collector's office.",
            "Step 5: The ICC/LCC must complete inquiry within 60 days.",
            "Step 6: You can also file FIR at police station under IPC 354A simultaneously.",
            "Step 7: An employer who does not constitute an ICC faces a fine of up to Rs 50,000.",
            "Step 8: File complaint on SHe-Box (shebox.nic.in) if it involves a government office or PSU."
        ]
    },

    "stalking": {
        "ipc_sections": [
            "IPC 354D — Stalking (1st offence: up to 3 years; repeat: up to 5 years)",
            "IPC 507  — Criminal intimidation by anonymous communication",
            "IT Act 66C/67 — if stalking is done online"
        ],
        "acts": ["Information Technology Act, 2000 (for cyber stalking component)"],
        "authority": [
            "Nearest Police Station — file FIR under IPC 354D",
            "Magistrate Court — for restraining order",
            "Cyber Crime Cell — if any online component"
        ],
        "helplines": [
            "Women Helpline: 181",
            "Police Emergency: 100",
            "Cyber Crime Helpline: 1930"
        ],
        "ngos": ["iCall TISS — 9152987821", "Vanangana — UP", "Jagori — Delhi"],
        "steps": [
            "Step 1: Document every incident — date, time, location, what happened, witnesses.",
            "Step 2: Screenshot and preserve all messages, calls, and online activity.",
            "Step 3: File FIR at nearest police station under IPC 354D. Stalking is a cognizable offence.",
            "Step 4: Apply to Magistrate for a restraining/protection order against the stalker.",
            "Step 5: Inform trusted friends, family, and workplace security about the stalker.",
            "Step 6: For online stalking, also file at cybercrime.gov.in or call 1930.",
            "Step 7: Change your routes, timings, and online privacy settings."
        ]
    },

    "cyber_stalking": {
        "ipc_sections": [
            "IPC 354D — Stalking (online component explicitly included)",
            "IT Act Section 66C — Identity theft",
            "IT Act Section 67  — Publishing obscene material electronically",
            "IPC 507 — Criminal intimidation by anonymous communication"
        ],
        "acts": ["Information Technology Act, 2000", "IT (Amendment) Act, 2008"],
        "authority": [
            "Cyber Crime Portal: cybercrime.gov.in",
            "Local Cyber Crime Cell (in every district SP's office)",
            "Nearest Police Station"
        ],
        "helplines": [
            "Cyber Crime Helpline: 1930 (24x7)",
            "Women Helpline: 181",
            "Police Emergency: 100"
        ],
        "ngos": ["iCall TISS — 9152987821", "Cyber Peace Foundation", "Point of View — Mumbai"],
        "steps": [
            "Step 1: Do NOT delete any messages, emails or posts — they are evidence.",
            "Step 2: Screenshot everything with timestamps visible.",
            "Step 3: Report at cybercrime.gov.in (available 24x7) or call 1930.",
            "Step 4: File FIR at local police station under IPC 354D + IT Act.",
            "Step 5: Report the account/content to the platform (WhatsApp/Instagram/Facebook) for takedown.",
            "Step 6: Apply to court for a restraining order against the perpetrator.",
            "Step 7: Update all your account passwords and privacy settings immediately."
        ]
    },

    "cyber_crime": {
        "ipc_sections": [
            "IT Act Section 66E — Punishment for violation of privacy (nude/private images)",
            "IT Act Section 67A — Publishing sexually explicit material online",
            "IPC 354C — Voyeurism (capturing/publishing private images)",
            "IT Act Section 66C — Identity theft (fake profiles)",
            "IPC 509 — Word, gesture, or act to insult the modesty of a woman"
        ],
        "acts": ["Information Technology Act, 2000", "IT (Amendment) Act, 2008"],
        "authority": [
            "Cyber Crime Portal: cybercrime.gov.in (most effective first step)",
            "Local Cyber Crime Cell",
            "Nearest Police Station"
        ],
        "helplines": [
            "Cyber Crime Helpline: 1930 (24x7)",
            "NCW Helpline: 7827-170-170",
            "Women Helpline: 181"
        ],
        "ngos": ["iCall TISS — 9152987821", "Cyber Peace Foundation", "Point of View — Mumbai"],
        "steps": [
            "Step 1: Report immediately at cybercrime.gov.in — available 24x7, no need to visit police station first.",
            "Step 2: Call 1930 (Cyber Crime Helpline) for urgent guidance.",
            "Step 3: Collect all evidence — URLs, usernames, screenshots with timestamps.",
            "Step 4: Report the content to the platform using their reporting feature for urgent removal.",
            "Step 5: File FIR at the nearest police station or cyber crime cell with your evidence.",
            "Step 6: Under IT Act, platforms must remove reported content within 36 hours (intermediary rules).",
            "Step 7: If the content is on WhatsApp, report to: grievance@support.whatsapp.com"
        ]
    },

    "dowry_harassment": {
        "ipc_sections": [
            "IPC 498A — Cruelty related to dowry demand (up to 3 years)",
            "Dowry Prohibition Act 1961 Section 3 — Giving/taking dowry (up to 5 years)",
            "Dowry Prohibition Act 1961 Section 4 — Demanding dowry (up to 2 years)",
            "IPC 304B — Dowry death within 7 years of marriage (minimum 7 years)"
        ],
        "acts": [
            "Dowry Prohibition Act, 1961",
            "Protection of Women from Domestic Violence Act, 2005"
        ],
        "authority": [
            "Police Station — FIR under IPC 498A",
            "Dowry Prohibition Officer (appointed by state government in each district)",
            "NCW — National Commission for Women",
            "Magistrate Court"
        ],
        "helplines": [
            "NCW Helpline: 7827-170-170",
            "Women Helpline: 181",
            "Police Emergency: 100"
        ],
        "ngos": ["Majlis Law", "Swayam — Kolkata", "Stree Shakti", "iCall TISS — 9152987821"],
        "steps": [
            "Step 1: Keep a record of all dowry demands — messages, call recordings, witness accounts.",
            "Step 2: Call NCW helpline 7827-170-170 for immediate guidance.",
            "Step 3: File FIR at police station under IPC 498A and Dowry Prohibition Act.",
            "Step 4: Contact the Dowry Prohibition Officer in your district for official intervention.",
            "Step 5: Apply for protection and residence order under the DV Act.",
            "Step 6: The NCW can take up your case directly and summon parties for conciliation.",
            "Step 7: In dowry death cases (IPC 304B), the burden of proof shifts to the accused — they must prove innocence."
        ]
    },

    "acid_attack": {
        "ipc_sections": [
            "IPC 326A — Voluntarily causing grievous hurt by use of acid (minimum 10 years, up to life)",
            "IPC 326B — Voluntarily throwing or attempting to throw acid (up to 7 years)"
        ],
        "acts": [
            "Acid Attack Victim Compensation Scheme (Supreme Court mandated — minimum Rs 3 lakh)",
            "Drugs and Cosmetics Act (restricts acid sale)"
        ],
        "authority": [
            "Police — FIR is mandatory (file at hospital itself)",
            "District Legal Services Authority (DLSA) — for compensation: call 15100",
            "Government Hospital — treatment is FREE under Supreme Court order",
            "District Collector — for interim compensation"
        ],
        "helplines": [
            "Police Emergency: 100",
            "Women Helpline: 181",
            "NALSA Legal Aid: 15100",
            "Chhanv Foundation: +91-9999-488-230"
        ],
        "ngos": [
            "Chhanv Foundation — Delhi (acid attack rehabilitation)",
            "Make Love Not Scars — Mumbai",
            "Sheroes Hangout Café — Agra/Lucknow"
        ],
        "steps": [
            "Step 1: EMERGENCY — Call 100 immediately. First aid: flush the affected area with large amounts of WATER for 20 minutes continuously. Do NOT use milk, toothpaste, or baking soda.",
            "Step 2: Go to the nearest government hospital immediately. All treatment is FREE under Supreme Court order.",
            "Step 3: Police must register FIR at the hospital itself — do not wait.",
            "Step 4: Apply for interim compensation of MINIMUM Rs 3 lakh from the District Collector within 2 months.",
            "Step 5: Contact DLSA (15100) for free legal representation.",
            "Step 6: Contact Chhanv Foundation for long-term rehabilitation, surgery support, and reintegration.",
            "Step 7: Under the Drugs and Cosmetics Act, ask police to trace who sold the acid — seller may also be prosecuted."
        ]
    },

    "trafficking": {
        "ipc_sections": [
            "IPC 370  — Trafficking of persons (up to 7-10 years imprisonment)",
            "IPC 370A — Exploitation of a trafficked person",
            "POCSO Act — if victim is a minor",
            "ITPA Sections 3-9 — Immoral Traffic Prevention Act"
        ],
        "acts": [
            "Immoral Traffic (Prevention) Act, 1956",
            "POCSO Act, 2012 (if minor involved)"
        ],
        "authority": [
            "Anti-Human Trafficking Unit (AHTU) — present in every district police HQ",
            "Child Welfare Committee (CWC) — if victim is a minor",
            "Nearest Police Station"
        ],
        "helplines": [
            "Anti-Trafficking Helpline: 1800-419-8588 (FREE, 24x7)",
            "Childline (if under 18): 1098",
            "Police Emergency: 100",
            "Women Helpline: 181"
        ],
        "ngos": [
            "Prajwala — Hyderabad (rescues and rehabilitates)",
            "Apne Aap Women Worldwide",
            "Shakti Vahini — Delhi",
            "Rescue Foundation — Mumbai"
        ],
        "steps": [
            "Step 1: Call 1800-419-8588 (Anti-Trafficking Helpline — FREE, 24x7) immediately.",
            "Step 2: If a child is involved, call Childline 1098.",
            "Step 3: Contact AHTU (Anti-Human Trafficking Unit) at the nearest district police station.",
            "Step 4: The VICTIM cannot be prosecuted — only the traffickers are guilty under Indian law.",
            "Step 5: After rescue, claim rehabilitation support under the Ujjawala Scheme (WCD Ministry).",
            "Step 6: Compensation is available under the Victim Compensation Scheme in each state.",
            "Step 7: Contact Prajwala or Apne Aap for long-term shelter, education, and livelihood support."
        ]
    },

    "honour_crime": {
        "ipc_sections": [
            "IPC 302  — Murder (life imprisonment or death penalty)",
            "IPC 307  — Attempt to murder (up to 10 years)",
            "IPC 506  — Criminal intimidation (up to 7 years)",
            "IPC 120B — Criminal conspiracy"
        ],
        "acts": [
            "Constitutional Right to Life — Article 21",
            "Special Marriage Act 1954 (protects inter-caste/inter-religion marriages)"
        ],
        "authority": [
            "Police — URGENT: request immediate personal protection from SP/DCP",
            "High Court — file habeas corpus petition if detained by family",
            "District Magistrate — for witness/victim protection"
        ],
        "helplines": [
            "Police Emergency: 100",
            "Women Helpline: 181",
            "NCW: 7827-170-170",
            "Love Commandos: +91-9313924charity"
        ],
        "ngos": [
            "Shakti Vahini — Delhi (emergency shelter + relocation)",
            "Love Commandos — Delhi",
            "Dhanak — Haryana"
        ],
        "steps": [
            "Step 1: Call 100 IMMEDIATELY if your life is in danger. This is an emergency.",
            "Step 2: Contact Shakti Vahini for emergency shelter and safe relocation.",
            "Step 3: File an FIR against the threatening family members — name them specifically.",
            "Step 4: File a petition in the High Court for protection (Writ of Habeas Corpus if you are being held against your will).",
            "Step 5: Request personal protection from the Superintendent of Police.",
            "Step 6: The Supreme Court has ruled honour killings as 'rarest of rare' crimes — perpetrators can receive death penalty.",
            "Step 7: If you are married or in a relationship, register under the Special Marriage Act 1954 for legal protection."
        ]
    },

    "molestation": {
        "ipc_sections": [
            "IPC 354  — Assault or criminal force to outrage modesty (up to 5 years)",
            "IPC 354A — Sexual harassment (up to 3 years)",
            "IPC 509  — Word, gesture or act to insult modesty"
        ],
        "acts": ["Criminal Law (Amendment) Act, 2013"],
        "authority": [
            "Nearest Police Station — file FIR under IPC 354",
            "Mahila Police Volunteer (available in many districts)",
            "One Stop Centre — 181"
        ],
        "helplines": [
            "Women Helpline: 181",
            "Police Emergency: 100",
            "NCW: 7827-170-170"
        ],
        "ngos": ["iCall TISS — 9152987821", "Vanangana — UP", "Jagori — Delhi"],
        "steps": [
            "Step 1: Call 181 or 100 immediately after the incident.",
            "Step 2: Note down the description of the accused — appearance, clothes, direction they went.",
            "Step 3: Identify any CCTV cameras or witnesses in the area.",
            "Step 4: File FIR at the nearest police station under IPC 354. It is a cognizable offence.",
            "Step 5: Request a woman police officer to record your statement — you have this right.",
            "Step 6: If it happened in a bus/metro/railway, inform the transport authority and request CCTV footage."
        ]
    },

    "property_rights": {
        "ipc_sections": [
            "IPC 406 — Criminal breach of trust (up to 3 years)",
            "IPC 420 — Cheating and dishonestly inducing delivery of property"
        ],
        "acts": [
            "Hindu Succession Act, 1956 (amended 2005) — daughters have EQUAL rights in ancestral property",
            "Indian Succession Act, 1925 (for non-Hindu women)"
        ],
        "authority": [
            "District Civil Court — file a partition suit",
            "District Legal Services Authority (DLSA) — free legal aid (call 15100)",
            "Tehsildar / Revenue Office — for land records"
        ],
        "helplines": [
            "NALSA Legal Aid: 15100 (free)",
            "NCW: 7827-170-170"
        ],
        "ngos": ["Lawyers Collective", "DLSA in your district"],
        "steps": [
            "Step 1: Call NALSA at 15100 for completely FREE legal aid.",
            "Step 2: Collect all property documents — sale deeds, property tax receipts, will (if any).",
            "Step 3: Hindu women have equal right to ancestral property since the 2005 amendment — this applies even if marriage was before 2005.",
            "Step 4: File a civil suit for partition of property in your District Civil Court.",
            "Step 5: Apply for an injunction to stop any illegal sale/transfer of property during the case.",
            "Step 6: If brothers/relatives are threatening you, file FIR under IPC 406.",
            "Step 7: The case can be settled through mediation — ask DLSA for mediation services."
        ]
    },

    "labour_exploitation": {
        "ipc_sections": [
            "IPC 374 — Unlawful compulsory labour (up to 1 year)",
            "Bonded Labour System (Abolition) Act 1976 — if bonded/forced labour"
        ],
        "acts": [
            "Payment of Wages Act, 1936",
            "Minimum Wages Act, 1948",
            "Bonded Labour System (Abolition) Act, 1976"
        ],
        "authority": [
            "Labour Commissioner Office — file complaint for unpaid wages",
            "District Magistrate — for bonded/forced labour release",
            "Labour Court"
        ],
        "helplines": [
            "Labour Helpline: 1800-425-1514 (FREE)",
            "Women Helpline: 181",
            "eMigrate Helpline (migrant workers): 1800-11-3090"
        ],
        "ngos": ["SEWA — Ahmedabad", "Jan Sahas — MP", "Pratham"],
        "steps": [
            "Step 1: File a written complaint with the Labour Commissioner of your district.",
            "Step 2: If you are being held against your will, contact the District Magistrate immediately for release under Bonded Labour Act.",
            "Step 3: You are entitled to the full Minimum Wages for your state — check rates at labour.gov.in.",
            "Step 4: File a case in Labour Court for recovery of all unpaid wages.",
            "Step 5: For migrant workers, call eMigrate helpline 1800-11-3090.",
            "Step 6: Contact SEWA or Jan Sahas for support, legal aid, and livelihood rehabilitation."
        ]
    }
}

SEVERITY_LABELS = {1: "Low", 2: "Medium", 3: "High", 4: "Critical"}
SEVERITY_MESSAGES = {
    1: "This is a serious matter. You deserve legal protection. You are not alone — help is available.",
    2: "This requires immediate action. Document everything and reach out to authorities or an NGO today.",
    3: "This is a high-severity situation. Please seek help immediately. Do not face this alone.",
    4: "⚠️ CRITICAL: Your life may be in danger. Please call 100 (Police) or 181 (Women Helpline) RIGHT NOW if you are at risk."
}

# ─── MODEL LOADER ─────────────────────────────────────────

_severity_model = None
_crime_bundle   = None

def _load():
    global _severity_model, _crime_bundle
    if _severity_model is None:
        _severity_model = joblib.load(SEVERITY_PATH)
    if _crime_bundle is None:
        _crime_bundle   = joblib.load(CRIME_PATH)

# ─── PREDICT ──────────────────────────────────────────────

def predict(description: str) -> dict:
    _load()

    sev_level    = int(_severity_model.predict([description])[0])
    sev_proba    = float(max(_severity_model.predict_proba([description])[0]))

    pipeline     = _crime_bundle["pipeline"]
    le           = _crime_bundle["label_encoder"]
    crime_enc    = pipeline.predict([description])[0]
    crime_type   = le.inverse_transform([crime_enc])[0]

    legal        = LEGAL_DB.get(crime_type, LEGAL_DB["domestic_violence"])

    similar      = find_similar_case(description, top_n=1)
    similar_case = similar[0] if similar else None

    return {
        "severity_level":      sev_level,
        "severity_label":      SEVERITY_LABELS[sev_level],
        "severity_message":    SEVERITY_MESSAGES[sev_level],
        "severity_confidence": round(sev_proba, 3),
        "crime_type":          crime_type,
        "legal":               legal,
        "similar_case":        similar_case
    }