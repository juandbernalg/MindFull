import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Importa los estilos CSS
import Tareas from './Tareas/Tareas.jsx'; // Importa el componente Tareas

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showTareas, setShowTareas] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 1. Inicialización única de localStorage al montar el componente
  const [productivityLimit, setProductivityLimit] = useState(() => {
    try {
      const saved = localStorage.getItem('productivityLimit');
      if (saved) {
        const parsed = parseInt(saved, 10);
        return Number.isNaN(parsed) ? 6 : parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return 6;
  });

  // Referencia para guardar el temporizador del LocalStorage
  const timeoutRef = useRef(null);

  // 2. Evento instantáneo: Cambia el estado de la UI inmediatamente sin tocar el disco duro
  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setProductivityLimit(val);

    // Limpiamos el guardado anterior si el usuario sigue arrastrando
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Retrasamos la escritura en localStorage 150ms para que la UI respire y fluya
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('productivityLimit', val.toString());
      } catch (err) {
        console.error(err);
      }
    }, 150);
  };

  // Limpieza del temporizador si el componente se desmonta inesperadamente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const sliderPosition = ((productivityLimit - 1) / 11) * 100;

  

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setStatusMessage('');
    setIsSaving(true);

    try {
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          fecha_nacimiento: birthDate,
          limite_horas_productividad: productivityLimit,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar el usuario');
      }

      sessionStorage.setItem('mfa_userId', data.id_usuario);
      sessionStorage.setItem('mfa_userName', name);
      setStatusMessage('Usuario guardado correctamente. ID: ' + data.id_usuario);
      setShowTareas(true);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (showTareas) {
    return <Tareas />;
  }

  return (
    <div className="mindfull-container">
      {/* Encabezado global */}
      <header className="mindfull-header">
        <span className="brand-logo">MindFull</span>
        <span className="step-indicator-text">Paso 1 de 3</span>
      </header>

      <main className="mindfull-main">
        {/* Panel Izquierdo - Imagen y Mensaje */}
        <section className="left-panel">
          <div className="left-content">
            <h1>Tu espacio de calma comienza aquí.</h1>
            <p>Diseñamos MindFull para proteger tu bienestar mental en un mundo digital ruidoso.</p>
          </div>
        </section>

        {/* Panel Derecho - Formulario de Personalización */}
        <section className="right-panel">
          <div className="form-container">
            {/* Indicador de pasos visual (Puntos) */}
            <div className="dots-indicator">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>

            <h2>Bienvenida y Personalización</h2>
            <p className="subtitle">
              Empecemos configurando los pilares de tu nueva rutina equilibrada.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Campo Nombre */}
              <div className="form-group">
                <label htmlFor="name">¿Cómo te llamas?</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Campo Fecha de Nacimiento */}
              <div className="form-group">
                <label htmlFor="birthdate">Fecha de nacimiento</label>
                <input
                  type="date"
                  id="birthdate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              {/* Campo Slider de Productividad */}
              <div className="form-group slider-group">
                <div className="slider-header">
                  <label>Límite Saludable de Productividad</label>
                </div>
                <div className="slider-control">
                  <span 
                    className="slider-value-bubble" 
                    style={{ left: `${sliderPosition}%`, pointerEvents: 'none' }}
                  >
                    {productivityLimit} {productivityLimit === 1 ? 'hora' : 'horas'}
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={productivityLimit}
                    onChange={handleSliderChange}
                    className="custom-slider"
                  />
                </div>
                <div className="slider-labels">
                  <span>1 HORA</span>
                  <span>12 HORAS</span>
                </div>
                <p className="slider-help-text">
                  Este es el tiempo máximo que dedicarás a tareas de alta concentración antes de que MindFull active el Modo Túnel.
                </p>
              </div>

              {/* Botones de acción */}
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Continuar'} <span>→</span>
              </button>

              <button type="button" className="btn-link">
                Omitir por ahora
              </button>

              {statusMessage && (
                <p className="status-message">{statusMessage}</p>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}