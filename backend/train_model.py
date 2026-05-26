import os
import cv2
import numpy as np
import pandas as pd
import mediapipe as mp
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical
import pickle
import kagglehub

# ==============================
# 1️⃣ ดาวน์โหลด Dataset
# ==============================
path = kagglehub.dataset_download("mrigaankjaswal/exercise-detection-dataset")
print("Dataset Path:", path)

# ==============================
# 2️⃣ แปลงรูปภาพ → Keypoints
# ==============================
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

data = []
labels = []

for folder in os.listdir(path):
    folder_path = os.path.join(path, folder)

    if os.path.isdir(folder_path):
        print("Processing:", folder)

        for img_name in os.listdir(folder_path):
            img_path = os.path.join(folder_path, img_name)
            img = cv2.imread(img_path)

            if img is None:
                continue

            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            results = pose.process(img_rgb)

            if results.pose_landmarks:
                keypoints = []
                for lm in results.pose_landmarks.landmark:
                    keypoints.extend([lm.x, lm.y, lm.z])

                data.append(keypoints)
                labels.append(folder)

print("Total samples:", len(data))

# ==============================
# 3️⃣ เตรียมข้อมูลสำหรับ Train
# ==============================
X = np.array(data)
y = np.array(labels)

encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)
y_categorical = to_categorical(y_encoded)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_categorical, test_size=0.2, random_state=42
)

# ==============================
# 4️⃣ สร้างโมเดล
# ==============================
model = tf.keras.Sequential([
    tf.keras.layers.Dense(256, activation='relu', input_shape=(X.shape[1],)),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(y_categorical.shape[1], activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(X_train, y_train, epochs=20, validation_data=(X_test, y_test))

# ==============================
# 5️⃣ บันทึกไฟล์โมเดล
# ==============================
model.save("exercise_model.h5")
print("Saved: exercise_model.h5")

# ==============================
# 6️⃣ บันทึก Label Encoder
# ==============================
pickle.dump(encoder, open("label_encoder.pkl", "wb"))
print("Saved: label_encoder.pkl")