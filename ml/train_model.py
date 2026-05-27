import pandas as pd, numpy as np, os, joblib, warnings
warnings.filterwarnings("ignore")
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report

BASE   = os.path.dirname(os.path.abspath(__file__))
DATA   = os.path.join(BASE, "dataset.csv")
OUTDIR = os.path.join(BASE, "models")
os.makedirs(OUTDIR, exist_ok=True)

print("="*55)
print("  SafeVoice Model Training")
print("="*55)

df = pd.read_csv(DATA).dropna(subset=["description","severity","crime_type"])
df["description"] = df["description"].astype(str)
df["severity"]    = df["severity"].astype(int)
X = df["description"]
print(f"\n  Loaded {len(df)} rows | {df['crime_type'].nunique()} crime types")

# ── 1. Severity model ──────────────────────────────────
print("\n[1/3] Training severity model...")
sev_pipe = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1,2), max_features=8000, sublinear_tf=True, min_df=1)),
    ("clf",   LogisticRegression(max_iter=1000, C=1.5, class_weight="balanced", random_state=42))
])
sev_pipe.fit(X, df["severity"])
joblib.dump(sev_pipe, os.path.join(OUTDIR, "severity_model.pkl"))
print("  OK severity_model.pkl")

# ── 2. Crime type model ────────────────────────────────
print("\n[2/3] Training crime type model...")
le = LabelEncoder()
y  = le.fit_transform(df["crime_type"])
crime_pipe = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1,3), max_features=10000, sublinear_tf=True, min_df=1)),
    ("clf",   RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42, n_jobs=-1))
])
crime_pipe.fit(X, y)
y_pred = crime_pipe.predict(X)
labels_present = np.unique(np.concatenate([y, y_pred]))
names_present  = le.inverse_transform(labels_present)
print(classification_report(y, y_pred, labels=labels_present, target_names=names_present, zero_division=0))
joblib.dump({"pipeline": crime_pipe, "label_encoder": le}, os.path.join(OUTDIR, "crime_model.pkl"))
print("  OK crime_model.pkl")

# ── 3. Cases index ─────────────────────────────────────
print("\n[3/3] Building cases index...")
cases = df[df["source"] != "augmented"].dropna(subset=["resolution"]).copy()
cases = cases[cases["resolution"].str.len() > 20].reset_index(drop=True)
vec   = TfidfVectorizer(ngram_range=(1,2), max_features=6000, sublinear_tf=True)
mat   = vec.fit_transform(cases["description"])
joblib.dump({"cases_df": cases, "vectorizer": vec, "tfidf_matrix": mat},
            os.path.join(OUTDIR, "cases_index.pkl"))
print(f"  OK cases_index.pkl ({len(cases)} cases)")

print("\n" + "="*55)
print("  ALL 3 MODELS TRAINED SUCCESSFULLY")
print("="*55)
print("  ml/models/severity_model.pkl")
print("  ml/models/crime_model.pkl")
print("  ml/models/cases_index.pkl")
print("\n  Now restart uvicorn:")
print("  cd backend")
print("  uvicorn app:app --reload --port 8000")