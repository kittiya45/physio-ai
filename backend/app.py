from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

model = None
encoder = None

try:
    import tensorflow as tf
    import pickle
    model = tf.keras.models.load_model("exercise_model.h5")
    encoder = pickle.load(open("label_encoder.pkl", "rb"))
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"⚠️  Model not loaded: {e}")
    print("   /predict will return fallback response until model is trained")


@app.route("/predict", methods=["POST"])
def predict():
    if model is None or encoder is None:
        return jsonify({"prediction": "ไม่พบโมเดล (กรุณา train ก่อน)", "confidence": 0.0})

    data = request.json
    keypoints = np.array(data["keypoints"]).reshape(1, -1)
    prediction = model.predict(keypoints, verbose=0)
    idx = int(np.argmax(prediction))
    label = encoder.inverse_transform([idx])[0]
    confidence = float(prediction[0][idx])
    return jsonify({"prediction": label, "confidence": confidence})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
