import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Importa los estilos CSS
import Tareas from './Tareas/Tareas.jsx'; // Importa el componente Tareas
import BotonPanicoModal from './BotonPanico/BotonPanicoModal.jsx'; // 1. Importamos el nuevo Modal

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showTareas, setShowTareas] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Estados globales para controlar el Botón de Pánico
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [modoTunelActivo, setModoTunelActivo] = useState(false);

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

  // Función que se disparará cuando el usuario elija una opción en el modal de pánico
  const handleActivarModoTunel = (motivo) => {
    setIsPanicOpen(false);
    setModoTunelActivo(true);
    console.log(`Modo Túnel activado por motivo: ${motivo}`);
  };

  const handleSkip = async () => {
    setStatusMessage('');
    setIsSaving(true);

    const defaultName = 'Usuario Anónimo';
    const defaultBirthDate = '2000-01-01';

    setName(defaultName);
    setBirthDate(defaultBirthDate);

    try {
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: defaultName,
          fecha_nacimiento: defaultBirthDate,
          limite_horas_productividad: productivityLimit,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar el usuario');
      }

      sessionStorage.setItem('mfa_userId', data.id_usuario);
      sessionStorage.setItem('mfa_userName', defaultName);
      setStatusMessage('Usuario guardado correctamente. ID: ' + data.id_usuario);
      setShowTareas(true);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

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

  // SI EL MODO TÚNEL ESTÁ ACTIVO, RENDERIZAMOS EL COMPONENTE INYECTÁNDOLO AQUÍ
  if (modoTunelActivo) {
    return (
      <ModoTunelComponent 
        modoTunelActivo={modoTunelActivo} 
        setModoTunelActivo={setModoTunelActivo} 
      />
    );
  }

  // Si pasamos el Onboarding, vamos a Tareas e inyectamos el disparador del modal
  if (showTareas) {
    return (
      <>
        <Tareas abrirPanico={() => setIsPanicOpen(true)} />
        
        {/* Renderizado global del modal para que funcione encima de Tareas */}
        <BotonPanicoModal 
          isOpen={isPanicOpen} 
          onClose={() => setIsPanicOpen(false)} 
          onConfirm={handleActivarModoTunel}
        />
      </>
    );
  }

  return (
    <div className="mindfull-container">
      {/* Encabezado global */}
      <header className="mindfull-header">
        <span className="brand-logo">MindFull</span>
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

            <h2>Bienvenida</h2>
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
                  <span className="slider-fixed-value">
                    {productivityLimit}h
                  </span>
                </div>
                
                <div className="slider-control">
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

              <button 
                type="button" 
                className="btn-link" 
                onClick={handleSkip}
                disabled={isSaving}
              >
                Omitir por ahora
              </button>

              {statusMessage && (
                <p className="status-message">{statusMessage}</p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Renderizado global opcional del modal en la pantalla de bienvenida */}
      <BotonPanicoModal 
        isOpen={isPanicOpen} 
        onClose={() => setIsPanicOpen(false)} 
        onConfirm={handleActivarModoTunel}
      />
    </div>
  );
}

// ==========================================
// COMPONENTE TOTALMENTE INDEPENDIENTE (AFUERA)
// ==========================================
function ModoTunelComponent({ modoTunelActivo, setModoTunelActivo }) {
  const tiempoTotal = 1800; // 30 minutos estrictos
  const [segundosRestantes, setSegundosRestantes] = React.useState(tiempoTotal); 
  
  const [pasoAnclaje, setPasoAnclaje] = React.useState(0);
  const [mostrarModalHielo, setMostrarModalHielo] = React.useState(false);
  const [faseRespiracion, setFaseRespiracion] = React.useState("Inhala");
  const [escalaEstrella, setEscalaEstrella] = React.useState(1);
  
  const audioCtxRef = React.useRef(null);
  const gainOlasRef = React.useRef(null);

  // 1. Efecto de control de reinicio definitivo: Clava el reloj en 30:00 al activarse
  React.useEffect(() => {
    if (modoTunelActivo) {
      setSegundosRestantes(tiempoTotal);
      setPasoAnclaje(0);
    }
  }, [modoTunelActivo]);

  // 2. Temporizador principal
  React.useEffect(() => {
    if (!modoTunelActivo) return;
    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [modoTunelActivo]);

  // 3. Audio Nativo Avanzado + Ciclo de respiración
  React.useEffect(() => {
    if (!modoTunelActivo) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; 
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const gainOlas = ctx.createGain();
    gainOlas.gain.setValueAtTime(0.03, ctx.currentTime); 

    noiseSource.connect(gainOlas);
    gainOlas.connect(ctx.destination);
    noiseSource.start();
    gainOlasRef.current = gainOlas;

    const cicloRespiracion = setInterval(() => {
      setFaseRespiracion((faseActual) => {
        if (faseActual === "Inhala") {
          setEscalaEstrella(1.3);
          gainOlas.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 3.5);
          return "Mantén";
        } else if (faseActual === "Mantén") {
          setEscalaEstrella(1.3);
          return "Exhala";
        } else {
          setEscalaEstrella(1);
          gainOlas.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 3.5);
          return "Inhala";
        }
      });
    }, 4000);

    return () => {
      clearInterval(cicloRespiracion);
      try { noiseSource.stop(); } catch(e){}
      ctx.close();
    };
  }, [modoTunelActivo]);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tiempoFormateado = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

  const guiaAnclaje = [
    { titulo: "👁️ 5 Cosas que ves", desc: "Mira a tu alrededor y detalla 5 objetos. Nota sus formas y colores." },
    { titulo: "🖐️ 4 Cosas que puedes tocar", desc: "Siente la textura de tu ropa, la mesa o tu propio cabello." },
    { titulo: "👂 3 Cosas que oyes", desc: "Presta atención a los sonidos lejanos. ¿Un carro, el viento, un reloj?" },
    { titulo: "👃 2 Cosas que hueles", desc: "Inhala profundo. Intenta identificar algún aroma en el ambiente." },
    { titulo: "👅 1 Cosa que saboreas", desc: "Nota el sabor actual en tu boca o toma un sorbo de agua." }
  ];

   const recursosCalma = [
    { 
      tipo: "🎙️ AUDIO / MEDITACIÓN (5 min)", 
      titulo: "Calmar la Ansiedad Rápidamente", 
      autor: "Encontrando el Balance / YouTube", 
      url: "http://www.youtube.com/watch?v=vr7oKogGLeM" 
    },
    { 
      tipo: "🎙️ AUDIO / MEDITACIÓN (10 min)", 
      titulo: "Relajar la Mente en Momentos Difíciles", 
      autor: "Anabel Otero / YouTube", 
      url: "http://www.youtube.com/watch?v=pDigD65kLpE" 
    },
    { 
      tipo: "🎙️ AUDIO / CONSEJOS", 
      titulo: "Cómo controlar el estrés (Audio disponible)", 
      autor: "Artículo Práctico / JW.ORG", 
      url: "https://www.jw.org/es/biblioteca/revistas/despertad-2020-numero1-mar-abr/como-controlar-estres/" 
    },
    { 
      tipo: "🎙️ AUDIO / ANIMACIÓN", 
      titulo: "Borra la tristeza", 
      autor: "Pizarra Animada / JW.ORG", 
      url: "https://www.jw.org/open?docid=502019627&prefer=lang&wtlocale=S" 
    },
    { 
      tipo: "🎙️ AUDIO / PAISAJE", 
      titulo: "Música de Fondo Relajante para Enfoque", 
      autor: "Sonido de Lluvia y Piano / YouTube", 
      url: "https://www.youtube.com/watch?v=2BmdKnVcPtc" 
    },
    { 
      tipo: "📖 GUÍA EN PDF", 
      titulo: "En Tiempos de Estrés: Haz lo que Importa", 
      autor: "Manual Ilustrado Oficial / OMS", 
      url: "https://iris.who.int/bitstream/handle/10665/333420/9789240007833-spa.pdf" 
    }
  ];

  return (
    <div style={{
      margin: 0, padding: '24px 40px', width: '100vw', height: '100vh', boxSizing: 'border-box',
      backgroundColor: '#f7f9fa',
      backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(200, 240, 240, 0.4) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(210, 245, 220, 0.5) 0%, transparent 40%)',
      fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 9999
    }}>
      
      {/* MODAL DE EMERGENCIA */}
      {mostrarModalHielo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(7, 79, 61, 0.2)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000
        }}>
          <div style={{
            backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px',
            maxWidth: '450px', width: '90%', textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0f2fe', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ fontSize: '48px' }}>🧊</div>
            <h2 style={{ fontSize: '22px', color: '#0369a1', margin: 0, fontWeight: '700' }}>Un respiro para tu mente</h2>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
              Estás a salvo, todo va a estar bien. Si el sobrepensamiento se siente muy pesado, ve por un <b>cubito de hielo</b> y sostenlo firmemente en tu mano. 
            </p>
            <p style={{ fontSize: '13px', color: '#0284c7', fontStyle: 'italic', margin: 0, backgroundColor: '#f0f9ff', padding: '10px 16px', borderRadius: '12px', width: '100%' }}>
              "El frío enviará una señal directa a tu cerebro para traerlo de vuelta al presente, calmando la tormenta en tu pecho."
            </p>
            <button 
              onClick={() => setMostrarModalHielo(false)}
              style={{ backgroundColor: '#0369a1', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', width: '100%' }}
            >
              Estoy listo, voy a respirar
            </button>
          </div>
        </div>
      )}

      {/* 1. BARRA SUPERIOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontWeight: 'bold', color: '#074f3d', fontSize: '20px' }}>Mind Full</span>
        <button 
          onClick={() => setMostrarModalHielo(true)}
          style={{ backgroundColor: '#ffe3e3', color: '#dc2626', border: '1px solid #fca5a5', padding: '10px 18px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          🚨 SOS: Alivio de Emergencia
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: '24px', width: '100%', flexGrow: 1, alignItems: 'center', margin: '10px 0', overflow: 'hidden' }}>
        
        {/* COLUMNA IZQUIERDA: ANCLAJE */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(229, 231, 235, 0.6)', height: '85%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '12px', color: '#074f3d', margin: '0 0 16px 0', letterSpacing: '1.5px', fontWeight: '700', textAlign: 'center' }}>⚓ ANCLA TU MENTE</h3>
          
          {pasoAnclaje === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5', marginBottom: '20px' }}>Si sientes que tu mente va muy rápido, hagamos un ejercicio táctil para conectar con tu espacio físico.</p>
              <button 
                onClick={() => setPasoAnclaje(1)}
                style={{ backgroundColor: '#074f3d', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', width: '100%' }}
              >
                Iniciar Ejercicio 5-4-3-2-1
              </button>
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#074f3d', fontWeight: '700' }}>PASO {pasoAnclaje} DE 5</span>
              <h4 style={{ fontSize: '16px', color: '#1f2937', margin: '10px 0' }}>{guiaAnclaje[pasoAnclaje - 1].titulo}</h4>
              <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5', marginBottom: '20px', height: '45px' }}>{guiaAnclaje[pasoAnclaje - 1].desc}</p>
              <button 
                onClick={() => setPasoAnclaje(pasoAnclaje < 5 ? pasoAnclaje + 1 : 0)}
                style={{ backgroundColor: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', width: '100%' }}
              >
                {pasoAnclaje < 5 ? "Listo, lo encontré ✔" : "Terminar y regresar"}
              </button>
            </div>
          )}
        </div>

        {/* COLUMNA CENTRAL: ESTRELLA Y MAR */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '36px', margin: 0, fontWeight: '700', color: '#1f2937' }}>{tiempoFormateado}</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>Sesión de enfoque activa</p>
          </div>
          
          <div style={{ 
            position: 'relative', width: '150px', height: '150px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${escalaEstrella})`,
            transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <div style={{ position: 'absolute', color: '#854d0e', fontWeight: '800', fontSize: '14px' }}>
              {faseRespiracion}
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#074f3d', fontWeight: '600', maxWidth: '280px', height: '20px', margin: 0 }}>
            {faseRespiracion === "Inhala" && "🌊 Siente las olas subir... toma aire lento"}
            {faseRespiracion === "Mantén" && "⏸️ Sostén el aire con suavidad"}
            {faseRespiracion === "Exhala" && "🍃 Deja que el mar se lleve la tensión..."}
          </p>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>🔊 Escucha el sonido de las olas de fondo para calmar tu mente</span>
        </div>

        {/* COLUMNA DERECHA: BIBLIOTECA DE CALMA */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', padding: '20px', 
          borderRadius: '20px', border: '1px solid rgba(229, 231, 235, 0.6)', height: '85%', 
          display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
        }}>
          <h3 style={{ fontSize: '12px', color: '#074f3d', margin: '0 0 12px 0', letterSpacing: '1.5px', fontWeight: '700', textAlign: 'center' }}>📚 BIBLIOTECA DE CALMA</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
            {recursosCalma.map((recurso, index) => (
              <div 
                key={index}
                onClick={() => window.open(recurso.url, '_blank')}
                style={{
                  backgroundColor: '#ffffff', padding: '12px', borderRadius: '12px',
                  border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#074f3d';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '9px', fontWeight: '700', color: '#074f3d', display: 'block', marginBottom: '2px', letterSpacing: '0.5px' }}>
                  {recurso.tipo}
                </span>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', lineHeight: '1.2' }}>
                  {recurso.titulo}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                  {recurso.autor}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. BARRA INFERIOR */}
      <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '50px', justifyContent: 'center' }}>
        <button 
          onClick={() => setModoTunelActivo(false)} 
          style={{ backgroundColor: '#ffffff', color: '#1f2937', border: '1px solid #d1d5db', padding: '8px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}
        >
          ✕ Salir de la Sesión
        </button>
      </div>

    </div>
  );
}