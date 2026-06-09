"""
Predict which of two tasks is more important using the trained model.
Usage:
  python predict.py --a '{"titulo":"...","duracion_minutos":30,...}' --b '{...}'

Or interactively edit the example tasks in the script.
"""
import argparse
import json
from pathlib import Path
from joblib import load
import numpy as np
from model_utils import featurize_task

BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / 'model.pkl'
VECT_PATH = BASE / 'vectorizer.pkl'
TF_MODEL_DIR = BASE / 'tf_model'

parser = argparse.ArgumentParser()
parser.add_argument('--a', help='JSON for task A', required=True)
parser.add_argument('--b', help='JSON for task B', required=True)
args = parser.parse_args()

a = json.loads(args.a)
b = json.loads(args.b)

vectorizer = load(VECT_PATH)

# Prefer TF model if available
try:
    import tensorflow as tf
    tf_available = True
except Exception:
    tf_available = False

if tf_available and TF_MODEL_DIR.exists():
    model = tf.keras.models.load_model(str(TF_MODEL_DIR))
    fa = featurize_task(a, vectorizer)
    fb = featurize_task(b, vectorizer)
    x = fa - fb
    prob = float(model.predict(x.reshape(1, -1)).reshape(-1)[0])
    label = 1 if prob >= 0.5 else 0
else:
    clf = load(MODEL_PATH)
    fa = featurize_task(a, vectorizer)
    fb = featurize_task(b, vectorizer)
    x = fa - fb
    prob = float(clf.predict_proba(x.reshape(1, -1))[0,1])
    label = int(clf.predict(x.reshape(1, -1))[0])

winner = 'A' if label == 1 else 'B'

print(json.dumps({
    'winner': winner,
    'prob_A_more_important': float(prob),
    'using_tf': bool(tf_available and TF_MODEL_DIR.exists())
}))
