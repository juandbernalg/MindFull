"""
Train a small TensorFlow (Keras) binary classifier for task comparison.
Saves model to `backend/ai/tf_model` and the TF-IDF vectorizer to `vectorizer.pkl`.

Usage:
    python train_tf.py

Note: This is a simple example. Replace SAMPLES with your labeled data for better results.
"""
from pathlib import Path
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from joblib import dump
from model_utils import featurize_task, CATEGORY_LIST

BASE = Path(__file__).resolve().parent
TF_MODEL_DIR = BASE / 'tf_model'
VECT_PATH = BASE / 'vectorizer.pkl'

# Example labeled pairs (A, B, label) label=1 if A more important than B
SAMPLES = [
    (
        {'titulo':'Entrega informe final', 'duracion_minutos':120, 'categoria':'Trabajo', 'es_urgente':True, 'orden_prioridad':1},
        {'titulo':'Leer artículo por gusto', 'duracion_minutos':30, 'categoria':'Personal', 'es_urgente':False, 'orden_prioridad':5},
        1
    ),
    (
        {'titulo':'Estudiar para examen', 'duracion_minutos':90, 'categoria':'Estudio', 'es_urgente':True, 'orden_prioridad':2},
        {'titulo':'Preparar cena', 'duracion_minutos':45, 'categoria':'Personal', 'es_urgente':False, 'orden_prioridad':4},
        1
    ),
    (
        {'titulo':'Organizar reuniones equipo', 'duracion_minutos':60, 'categoria':'Equipo', 'es_urgente':False, 'orden_prioridad':3},
        {'titulo':'Responder emails', 'duracion_minutos':20, 'categoria':'Trabajo', 'es_urgente':False, 'orden_prioridad':6},
        1
    ),
    (
        {'titulo':'Ver serie', 'duracion_minutos':50, 'categoria':'Personal', 'es_urgente':False, 'orden_prioridad':7},
        {'titulo':'Practicar piano', 'duracion_minutos':30, 'categoria':'Personal', 'es_urgente':False, 'orden_prioridad':5},
        0
    ),
]

# Prepare vectorizer on all titles
all_titles = [t['titulo'] for pair in SAMPLES for t in pair[:2]]
vectorizer = TfidfVectorizer(max_features=200)
vectorizer.fit(all_titles)

def build_features(task, vectorizer):
    return featurize_task(task, vectorizer)

X = []
y = []
for a, b, label in SAMPLES:
    fa = build_features(a, vectorizer)
    fb = build_features(b, vectorizer)
    X.append(fa - fb)
    y.append(label)

X = np.vstack(X)
y = np.array(y)

# Build simple Keras model
import tensorflow as tf
from tensorflow import keras

input_dim = X.shape[1]
model = keras.Sequential([
    keras.layers.Input(shape=(input_dim,)),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

model.fit(X, y, epochs=60, batch_size=4, verbose=1)

TF_MODEL_DIR.mkdir(exist_ok=True)
model.save(str(TF_MODEL_DIR))

dump(vectorizer, VECT_PATH)
print('Saved TF model to', TF_MODEL_DIR, 'and vectorizer to', VECT_PATH)
