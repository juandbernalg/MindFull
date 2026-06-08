import React, { useState } from 'react';
import './index.css';

// 1. Recibimos 'abrirPanico' como una prop de la aplicación
const MindFullDashboard = ({ hideSidebar = false, abrirPanico }) => {
  const [activeTab, setActiveTab] = useState('mindfull');

  const renderTab = () => {
    switch (activeTab) {
      case 'mindfull':
        return null; // Contenido por defecto
      case 'tareas':
        return (
          <div>
            <h1>Tareas</h1>
            <p>Lista de tareas y gestión.</p>
          </div>
        );
      case 'enfoque':
        return (
          <div>
            <h1>Enfoque</h1>
            <p>Modo y sesiones de enfoque.</p>
          </div>
        );
      case 'estadisticas':
        return (
          <div>
            <h1>Estadísticas</h1>
            <p>Gráficas y datos.</p>
          </div>
        );
      case 'ajustes':
        return (
          <div>
            <h1>Ajustes</h1>
            <p>Preferencias de la aplicación.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`container ${hideSidebar ? 'no-sidebar' : ''}`}>
      {!hideSidebar && (
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-text">Mind</div>
            <div className="logo-subtext">MANTENTE PRESENTE</div>
          </div>
        
          <nav>
            <button
              className={`nav-item ${activeTab === 'mindfull' ? 'nav-item-active' : ''}`}
              onClick={() => setActiveTab('mindfull')}
            >
              <span className="icon-text">📊</span> Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === 'tareas' ? 'nav-item-active' : ''}`}
              onClick={() => setActiveTab('tareas')}
            >
              <span className="icon-text">✅</span> Tareas
            </button>
            <button
              className={`nav-item ${activeTab === 'enfoque' ? 'nav-item-active' : ''}`}
              onClick={() => setActiveTab('enfoque')}
            >
              <span className="icon-text">⏱</span> Enfoque
            </button>
            <button
              className={`nav-item ${activeTab === 'estadisticas' ? 'nav-item-active' : ''}`}
              onClick={() => setActiveTab('estadisticas')}
            >
              <span className="icon-text">📈</span> Estadísticas
            </button>
            <button
              className={`nav-item ${activeTab === 'ajustes' ? 'nav-item-active' : ''}`}
              onClick={() => setActiveTab('ajustes')}
            >
              <span className="icon-text">⚙️</span> Configuración
            </button>
          </nav>

          <button className="login-btn">Iniciar Sesión</button>
        </aside>
      )}

      <main className="main">
        <header className="header">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'mindfull' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('mindfull')}
            >
              Mind Full
            </button>
            <button 
              className={`tab ${activeTab === 'tunel' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('tunel')}
            >
              Modo Túnel
            </button>
          </div>
          
          <div className="header-right">
            <span className="limite-text">Límite: 75%</span>
            
            {/* 2. Vinculamos el botón de pánico de la cabecera local */}
            <button className="panic-btn" onClick={abrirPanico}>
              Botón de Pánico
            </button>
            
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">👤</button>
          </div>
        </header>

        {activeTab !== 'mindfull' ? (
          <div className="tab-placeholder">{renderTab()}</div>
        ) : (
          <>
            <h1 className="greeting">Buenas tardes</h1>
            <p className="subtext">Tu mente está enfocada al 75% en este momento. Respira profundo.</p>

            <div className="grid">
              <div className="card card-large">
                <div className="card-top">
                  <div>
                    <div className="card-title-green">Flujo de Productividad</div>
                    <div className="card-subtitle">Capacidad diaria utilizada</div>
                  </div>
                  <div className="percentage">75%</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="stats">
                  <span><span className="dot"></span>4.5h Enfocado</span>
                  <span>• 1.5h Restante</span>
                </div>
              </div>

              <div className="card card-dark">
                <div className="tunnel-icon">⚡</div>
                <div className="tunnel-title">Modo Túnel</div>
                <div className="tunnel-text">Silencia todos los estímulos no esenciales al instante.</div>
                <button className="tunnel-btn">Iniciar Modo Túnel</button>
              </div>
            </div>

            <div className="grid">
              <div className="card">
                <div className="card-header">
                  <span className="tag">Enfoque Actual</span>
                  <span className="more-icon">⋯</span>
                </div>
                <h3 className="card-heading">Revisión de Estrategia</h3>
                <p className="card-body">
                  Análisis de métricas de rendimiento del H2 y preparación para la presentación para la junta directiva del jueves.
                </p>
                <div className="card-footer">
                  <div className="avatars">
                    <div className="avatar"></div>
                    <div className="avatar"></div>
                  </div>
                  <span className="time-text">Vence en 2h</span>
                </div>
              </div>

              <div className="card card-green">
                <div className="circle-icon">
                  <span className="wind-icon">🌬</span>
                </div>
                <h3 className="card-heading-center">Respirar</h3>
                <p className="session-text">Sesión de 1 minuto</p>
              </div>

              <div className="card">
                <div className="chart-header">
                  <span className="card-title">PULSO DE ENFOQUE</span>
                  <span className="status-text">Estable</span>
                </div>
                <div className="chart-container">
                  <div className="bar" style={{ height: '40%' }}></div>
                  <div className="bar" style={{ height: '60%' }}></div>
                  <div className="bar" style={{ height: '45%' }}></div>
                  <div className="bar" style={{ height: '80%' }}></div>
                  <div className="bar bar-active" style={{ height: '100%' }}></div>
                  <div className="bar" style={{ height: '55%' }}></div>
                  <div className="bar" style={{ height: '70%' }}></div>
                  <div className="bar" style={{ height: '35%' }}></div>
                </div>
                <div className="chart-labels">
                  <span>9 AM</span>
                  <span>12PM</span>
                  <span>4/6RA</span>
                </div>
              </div>
            </div>

            <div className="quote-section">
              <p className="quote-text">
                "La naturaleza no se apresura, sin embargo, todo se logra." — Lao Tzu
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MindFullDashboard;