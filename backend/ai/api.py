from fastapi import FastAPI
from pydantic import BaseModel
from joblib import load
from pathlib import Path
from model_utils import featurize_task
import numpy as np

# Try to support TensorFlow model if available
TF_MODEL_DIR = BASE / 'tf_model'
_tf = None
_use_tf = False
try:
    import tensorflow as tf
    _tf = tf
except Exception:
    _tf = None

BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / 'model.pkl'
VECT_PATH = BASE / 'vectorizer.pkl'

app = FastAPI()

class Task(BaseModel):
    titulo: str = ''
    duracion_minutos: int = 30
    categoria: str = None
    es_urgente: int = 0
    orden_prioridad: int = 0

class CompareRequest(BaseModel):
    a: Task
    b: Task

# lazy load
_clf = None
_vect = None

_vect = None

def _load():
    global _clf, _vect, _use_tf
    if _vect is None:
        # load vectorizer first
        _vect = load(VECT_PATH)

    # prefer TF model if directory exists and TF is importable
    if _tf is not None and TF_MODEL_DIR.exists():
        if not _use_tf:
            try:
                _tf_model = _tf.keras.models.load_model(str(TF_MODEL_DIR))
                _use_tf = True
                return (_tf_model, _vect)
            except Exception:
                _use_tf = False

    # fallback to sklearn
    if _clf is None:
        _clf = load(MODEL_PATH)
    _use_tf = False
    return _clf, _vect

@app.post('/compare')
def compare(req: CompareRequest):
    model_or_clf, vect = _load()
    fa = featurize_task(req.a.dict(), vect)
    fb = featurize_task(req.b.dict(), vect)
    x = fa - fb
    
    # If TF is available and loaded, model_or_clf is a Keras model
    if _use_tf and _tf is not None:
        probs = model_or_clf.predict(x.reshape(1, -1))
        prob = float(probs.reshape(-1)[0])
        label = int(prob >= 0.5)
    else:
        clf = model_or_clf
        prob = float(clf.predict_proba(x.reshape(1, -1))[0,1])
        label = int(clf.predict(x.reshape(1, -1))[0])

    winner = 'A' if label == 1 else 'B'
    return {'winner': winner, 'prob_A_more_important': prob, 'using_tf': bool(_use_tf)}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
