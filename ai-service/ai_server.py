from flask import Flask, request, jsonify
import numpy as np
import joblib

app = Flask(__name__)

# Load trained models
iso_model = joblib.load("isolation_model.pkl")
rf_model = joblib.load("rf_model.pkl")

@app.route("/detect", methods=["POST"])
def detect():
    data = request.json
    amount = data["amount"]

    input_data = np.array([[amount]])

    iso_pred = iso_model.predict(input_data)
    rf_pred = rf_model.predict(input_data)

    result = {
        "suspicious": 1 if iso_pred[0] == -1 else 0,
        "fraud_alert": int(rf_pred[0])
    }

    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001 , debug=True)