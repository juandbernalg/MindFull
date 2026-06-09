Instrucciones rápidas

1) Crear un entorno virtual y instalar dependencias:

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r backend/ai/requirements.txt
```

2) Entrenar modelo con datos de ejemplo:

```bash
# Entrenar con scikit-learn baseline
python backend/ai/train.py

# (Opcional) Entrenar un modelo TensorFlow más potente
python backend/ai/train_tf.py
```

3) Probar comparación entre dos tareas:

```bash
python backend/ai/predict.py --a '{"titulo":"Entrega informe final","duracion_minutos":120,"categoria":"Trabajo","es_urgente":1}' --b '{"titulo":"Leer por gusto","duracion_minutos":30,"categoria":"Personal","es_urgente":0}'
```

Integración sugerida

- Ejecutar el script `predict.py` desde Node (child_process) para decisiones rápidas.
- O exponer una API Python (Flask/FastAPI) que reciba dos tareas y devuelva la comparación.

Notas

- El modelo actual es un clasificador simple (LogisticRegression) entrenado con pares de ejemplo. Para mejor rendimiento, recolecta y etiqueta pares reales de tus usuarios y reentrena.
 
Además de scikit-learn, puedes entrenar el modelo TensorFlow con `train_tf.py`. La API y el script `predict.py` preferirán el modelo TensorFlow si existe en `backend/ai/tf_model`.
