from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

CATEGORY_LIST = ['Trabajo', 'Personal', 'Estudio', 'Equipo']


def featurize_task(task, vectorizer=None):
    """Convert a single task dict to a numeric feature vector.
    Fields supported: 'titulo', 'duracion_minutos', 'categoria', 'es_urgente', 'orden_prioridad'
    If vectorizer is provided, use it for title TF-IDF; otherwise title feature is empty.
    Returns a 1D numpy array.
    """
    title = task.get('titulo', '')
    dur = task.get('duracion_minutos')
    try:
        dur = float(dur) if dur is not None else 30.0
    except Exception:
        dur = 30.0
    dur = np.array([dur], dtype=float)

    cat = task.get('categoria') or ''
    cat_vec = np.array([1.0 if cat == c else 0.0 for c in CATEGORY_LIST], dtype=float)

    urgent = 1.0 if task.get('es_urgente') in (True, 1, '1') else 0.0
    priority = float(task.get('orden_prioridad') or 0)

    if vectorizer is not None:
        title_vec = vectorizer.transform([title]).toarray().ravel()
    else:
        title_vec = np.zeros(0)

    return np.concatenate([title_vec, dur, cat_vec, np.array([urgent, priority], dtype=float)])
