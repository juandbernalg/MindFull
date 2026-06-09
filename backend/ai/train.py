"""
Train a binary comparison model that predicts whether task A is more important than task B.
Saves model and vectorizer under backend/ai/

Example usage:
    python train.py

The script contains a small sample dataset; replace or extend with your labeled pairs.
"""
import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from joblib import dump
import numpy as np
from model_utils import featurize_task

BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / 'model.pkl'
VECT_PATH = BASE / 'vectorizer.pkl'

# Sample training data: list of (taskA, taskB, label) where label=1 if A more important than B
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

# Build TF-IDF on all titles
all_titles = [t['titulo'] for pair in SAMPLES for t in pair[:2]]
vectorizer = TfidfVectorizer(max_features=200)
vectorizer.fit(all_titles)

# Build training arrays using difference of features (A - B)
X = []
y = []
for a, b, label in SAMPLES:
    fa = featurize_task(a, vectorizer)
    fb = featurize_task(b, vectorizer)
    X.append(fa - fb)
    y.append(label)

X = np.vstack(X)
y = np.array(y)

clf = LogisticRegression(max_iter=1000)
clf.fit(X, y)

# Save
dump(clf, MODEL_PATH)
dump(vectorizer, VECT_PATH)
print('Model and vectorizer saved:', MODEL_PATH, VECT_PATH)
