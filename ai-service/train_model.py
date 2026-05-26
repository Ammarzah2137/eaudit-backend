import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestClassifier
import joblib

# Load dataset
data = pd.read_csv("transactions_dataset.csv")

X = data[["amount"]]
y = data["fraud_label"]

# Unsupervised model
iso_model = IsolationForest(contamination=0.2)
iso_model.fit(X)

# Supervised model
rf_model = RandomForestClassifier()
rf_model.fit(X, y)

# Save models
joblib.dump(iso_model, "isolation_model.pkl")
joblib.dump(rf_model, "rf_model.pkl")

print("Models trained successfully!")