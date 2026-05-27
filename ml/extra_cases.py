"""
Run this ONCE to add targeted molestation + other tricky cases to your dataset.
Command: python ml/extra_cases.py
"""
import pandas as pd
import os

BASE = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE, "dataset.csv")

EXTRA = [
    # ── MOLESTATION — bus/public transport variants ──────
    ("I was touched inappropriately in a bus yesterday by a stranger.", "molestation", 2, "IPC 354, IPC 354A", "Police complaint filed. CCTV footage used. Accused identified and arrested."),
    ("A man groped me in the public bus today while it was crowded.", "molestation", 2, "IPC 354, IPC 354A", "FIR filed under IPC 354. Man identified through bus CCTV. Arrested."),
    ("Someone touched me without my consent on the metro train this morning.", "molestation", 2, "IPC 354, IPC 354A", "Metro security alerted. Police FIR filed. Man detained."),
    ("I was molested in a crowded market. A man grabbed me from behind.", "molestation", 2, "IPC 354, IPC 354A", "Police complaint registered. Accused arrested based on witness accounts."),
    ("A man touched me inappropriately while I was standing in a queue.", "molestation", 2, "IPC 354, IPC 509", "FIR filed. Police used CCTV. Accused arrested and fined."),
    ("Someone groped me at a concert. I screamed and people held him.", "molestation", 2, "IPC 354, IPC 354A", "Bystanders caught accused. Handed over to police. FIR registered."),
    ("I was inappropriately touched by a stranger at the railway station.", "molestation", 2, "IPC 354, IPC 354A", "RPF (Railway Police Force) complaint filed. Accused arrested."),
    ("An auto driver touched me when I sat in the auto. I got out immediately.", "molestation", 2, "IPC 354, IPC 354A", "Police complaint with vehicle number. Driver identified and arrested."),
    ("A man sitting next to me in the bus deliberately kept touching my arm.", "molestation", 2, "IPC 354", "Complained to bus conductor. Man removed. Later FIR filed at police station."),
    ("Someone pinched me in a crowded street festival. I could not see who it was.", "molestation", 2, "IPC 354", "Police complaint filed. Area CCTV reviewed. Awareness drive launched."),
    ("I was groped by a man while travelling in a shared auto.", "molestation", 2, "IPC 354, IPC 354A", "FIR filed. Auto number traced. Driver identified and arrested."),
    ("A stranger touched me inappropriately at the hospital waiting area.", "molestation", 2, "IPC 354", "Hospital security complaint. Police called. FIR registered."),
    ("Man touched me without consent in a shopping mall elevator.", "molestation", 2, "IPC 354, IPC 354A", "Mall CCTV footage obtained. Man identified. Arrested under IPC 354."),
    ("I was touched inappropriately by a colleague during a team outing.", "molestation", 2, "IPC 354A, POSH Act 2013", "ICC complaint filed. Colleague suspended pending inquiry. FIR also registered."),
    ("Someone groped me from behind while I was at an ATM.", "molestation", 2, "IPC 354, IPC 354A", "ATM CCTV footage obtained. Accused traced and arrested by police."),

    # ── STALKING — street/public variants ────────────────
    ("A man keeps following me every day when I walk to college.", "stalking", 2, "IPC 354D", "FIR under IPC 354D. Restraining order granted. College security alerted."),
    ("Someone I don't know follows me to the bus stop every morning.", "stalking", 2, "IPC 354D", "Police warned the person. He continued. FIR filed. Arrested."),
    ("An unknown person has been following me for weeks and staring at me.", "stalking", 2, "IPC 354D", "Police complaint filed. Person warned formally. Restraining order issued."),

    # ── CYBER CRIME — photo/video variants ────────────────
    ("Someone shared my private photos on a WhatsApp group without my permission.", "cyber_crime", 3, "IT Act 66E, IT Act 67A, IPC 354C", "Cyber crime complaint filed. Content removed. Accused traced and arrested."),
    ("My ex boyfriend posted my photos online after we broke up.", "cyber_crime", 3, "IT Act 66E, IT Act 67, IPC 354C", "Police filed case. Platform notified. Photos removed. Ex arrested."),
    ("Someone made a fake account with my photos and is sending messages to my contacts.", "cyber_crime", 3, "IT Act 66C, IT Act 66D, IPC 509", "Cyber cell complaint. Fake account removed. Perpetrator identified and arrested."),

    # ── DOMESTIC VIOLENCE — clear non-bus variants ────────
    ("My husband slaps me whenever he comes home drunk at night.", "domestic_violence", 3, "IPC 498A, IPC 323, DV Act 2005", "FIR filed under IPC 498A. Protection order granted. Husband arrested."),
    ("My in-laws abuse me verbally every single day and my husband does nothing.", "domestic_violence", 2, "IPC 498A, DV Act 2005 Section 3", "DV complaint filed. Protection officer issued notice. Counselling ordered."),

    # ── SEXUAL ASSAULT — clear variants ───────────────────
    ("I was raped by my neighbour when I was alone at home.", "sexual_assault", 4, "IPC 376", "FIR registered. Medical examination done. Neighbour arrested. Fast-track court case."),
    ("A man forced himself on me in a taxi late at night.", "sexual_assault", 4, "IPC 376, IPC 342", "GPS data used. Driver arrested. Fast-track court. Convicted."),
]

def run():
    if not os.path.exists(DATASET_PATH):
        print(f"ERROR: {DATASET_PATH} not found. Run prepare_dataset.py first.")
        return

    df = pd.read_csv(DATASET_PATH)
    before = len(df)

    new_rows = []
    for desc, crime_type, severity, legal, resolution in EXTRA:
        new_rows.append({
            "description":    desc,
            "crime_type":     crime_type,
            "severity":       severity,
            "legal_sections": legal,
            "resolution":     resolution,
            "source":         "seed_verified"
        })

    new_df = pd.DataFrame(new_rows)
    combined = pd.concat([df, new_df], ignore_index=True)
    combined = combined.drop_duplicates(subset=["description"])
    combined.to_csv(DATASET_PATH, index=False, encoding="utf-8")

    print(f"Before : {before} rows")
    print(f"Added  : {len(combined) - before} new rows")
    print(f"After  : {len(combined)} total rows")
    print(f"\nMolestation count: {(combined['crime_type']=='molestation').sum()}")
    print(f"\nCrime type breakdown:")
    print(combined["crime_type"].value_counts().to_string())
    print(f"\nDone. Now run: python ml/train_model.py")

if __name__ == "__main__":
    run()