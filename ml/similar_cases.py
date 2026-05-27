"""
SafeVoice — ml/similar_cases.py
Finds the most similar real case to a user's description.
Used by backend/predictor.py at runtime.
"""

import joblib
import numpy as np
import os
from sklearn.metrics.pairwise import cosine_similarity

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
INDEX_PATH = os.path.join(MODELS_DIR, "cases_index.pkl")


def find_similar_case(user_description: str, top_n: int = 1) -> list:
    """
    Returns list of dicts:
      description, crime_type, severity, resolution, source, similarity
    """
    if not os.path.exists(INDEX_PATH):
        return []

    index        = joblib.load(INDEX_PATH)
    vectorizer   = index["vectorizer"]
    tfidf_matrix = index["tfidf_matrix"]
    cases_df     = index["cases_df"]

    user_vec = vectorizer.transform([user_description.lower()])
    sims     = cosine_similarity(user_vec, tfidf_matrix).flatten()
    top_idxs = np.argsort(sims)[::-1][:top_n]

    results = []
    for idx in top_idxs:
        row = cases_df.iloc[idx]
        results.append({
            "description": str(row["description"]),
            "crime_type":  str(row["crime_type"]),
            "severity":    int(row["severity"]),
            "resolution":  str(row["resolution"]),
            "source":      str(row.get("source", "verified")),
            "similarity":  float(round(sims[idx], 3))
        })
    return results


if __name__ == "__main__":
    test = "My husband beats me every night and threatens to kill me."
    results = find_similar_case(test)
    if results:
        r = results[0]
        print(f"Similarity : {r['similarity']}")
        print(f"Crime type : {r['crime_type']}")
        print(f"Resolution : {r['resolution']}")
    else:
        print("No index found. Run train_model.py first.")