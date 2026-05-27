"""
╔══════════════════════════════════════════════════════════╗
║  SAFEVOICE — ml/prepare_dataset.py                       ║
║  STEP 3: Run after scrape_data.py                        ║
║  Command: python ml/prepare_dataset.py                   ║
║  Output:  ml/dataset.csv                                 ║
╚══════════════════════════════════════════════════════════╝
"""

import pandas as pd
import re
import os

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
RAW_PATH    = os.path.join(BASE_DIR, "raw_data.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "dataset.csv")

VALID_CRIME_TYPES = {
    "domestic_violence", "sexual_assault", "workplace_harassment",
    "stalking", "cyber_stalking", "cyber_crime", "dowry_harassment",
    "acid_attack", "trafficking", "honour_crime", "molestation",
    "property_rights", "labour_exploitation"
}

# ─── CLEANING ─────────────────────────────────────────────

def clean_text(text):
    if not isinstance(text, str): return ""
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s,.\-'():/]", "", text)
    return text.lower()

def clean_df(df):
    df = df.copy()
    df["description"] = df["description"].apply(clean_text)
    df = df[df["description"].str.len() > 25]
    df = df.dropna(subset=["crime_type", "severity"])
    df["severity"] = df["severity"].astype(int).clip(1, 4)
    df = df[df["crime_type"].isin(VALID_CRIME_TYPES)]
    df = df.drop_duplicates(subset=["description"])
    return df.reset_index(drop=True)

# ─── DATA AUGMENTATION ────────────────────────────────────
# Simple synonym replacement creates variant descriptions
# to increase dataset size and model robustness.

SYNONYM_PAIRS = [
    ("husband",         "spouse"),
    ("wife",            "partner"),
    ("beat ",           "assaulted "),
    ("threatened",      "intimidated"),
    ("messages",        "texts"),
    ("workplace",       "office"),
    ("boss",            "supervisor"),
    ("she was",         "the victim was"),
    ("her ",            "the woman "),
    ("naked photo",     "obscene image"),
]

def augment_row(row):
    text = row["description"]
    for original, replacement in SYNONYM_PAIRS:
        if original in text:
            text = text.replace(original, replacement, 1)
            break
    row = row.copy()
    row["description"] = text
    row["source"]      = "augmented"
    return row

def augment_df(df):
    augmented = [augment_row(r.to_dict()) for _, r in df.iterrows()]
    aug_df    = pd.DataFrame(augmented)
    combined  = pd.concat([df, aug_df], ignore_index=True)
    combined  = combined.drop_duplicates(subset=["description"])
    return combined.reset_index(drop=True)

# ─── MAIN ─────────────────────────────────────────────────

def run():
    print("=" * 55)
    print("  SafeVoice Dataset Preparation")
    print("=" * 55)

    if not os.path.exists(RAW_PATH):
        print(f"\n  ERROR: {RAW_PATH} not found.")
        print("  → Run: python scraper/scrape_data.py first\n")
        return

    df = pd.read_csv(RAW_PATH)
    print(f"\n  Loaded     : {len(df)} rows from raw_data.csv")

    df = clean_df(df)
    print(f"  After clean: {len(df)} rows")

    df = augment_df(df)
    print(f"  After augm : {len(df)} rows")

    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")

    print(f"\n  Severity distribution:")
    print(df["severity"].value_counts().sort_index().rename({
        1:"1-Low", 2:"2-Medium", 3:"3-High", 4:"4-Critical"
    }).to_string())

    print(f"\n{'='*55}")
    print(f"  ✅ DONE — {len(df)} rows saved to ml/dataset.csv")
    print(f"{'='*55}")
    print("\n→ Next step: python ml/train_model.py")

if __name__ == "__main__":
    run()
