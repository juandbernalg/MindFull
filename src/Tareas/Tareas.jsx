import React, { useState, useEffect } from 'react';
import './index.css';
import MindFullDashboard from '../Panel de Salud/panelsalud.jsx';

// 1. Recibimos 'abrirPanico' como prop desde App.jsx
export default function MindFull({ abrirPanico }) {
  const [activeSection, setActiveSection] = useState('Tareas');

  const defaultTasks = [
    {icon:'green', title:'Revisar documentación del sistema de diseño', time:'30m', tag:'Estudio'},
    {icon:'pink', title:'Práctica de mindfulness nocturna', time:'15m', tag:'Personal'},
    {icon:'teal', title:'Enviar proyecto final del módulo de React', time:'120m', tag:'Trabajo', urgent:true},
  ];

  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(() => sessionStorage.getItem('mfa_userId'));
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('30m');
  const [newTag, setNewTag] = useState('Personal');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    localStorage.removeItem('tareas');

    const handleUnload = () => {
      sessionStorage.removeItem('mfa_userId');
      sessionStorage.removeItem('mfa_userName');
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tareas?id_usuario=${userId}`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar las tareas');
        }
        const data = await response.json();
        setTasks(data.length ? data.map((task) => ({
          id: task.id_tarea,
          icon: task.es_urgente ? 'red' : 'blue',
          title: task.titulo,
          time: `${task['duración_minutos'] ?? 30}m`,
          tag: task.categoria || 'Personal',
          urgent: task.es_urgente === 1,
        })) : []);
      } catch (error) {
        setStatusMessage(error.message);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [userId]);

  const normalizeCategory = (tag) => {
    const normalized = tag.trim().toLowerCase();
    if (normalized.includes('trabajo')) return 'Trabajo';
    if (normalized.includes('personal')) return 'Personal';
    if (normalized.includes('estudio')) return 'Estudio';
    if (normalized.includes('equipo')) return 'Equipo';
    return 'Personal';
  };

  const parseTime = (value) => {
    const parsed = parseInt(value.replace(/[^0-9]/g, ''), 10);
    return Number.isNaN(parsed) ? 30 : parsed;
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const durationValue = parseTime(newTime);
    const categoryValue = normalizeCategory(newTag);
    const taskToSave = {
      id_usuario: userId,
      titulo: newTitle.trim(),
      duracion_minutos: durationValue,
      categoria: categoryValue,
      orden_prioridad: tasks.length + 1,
      es_urgente: categoryValue === 'Trabajo' || newTag.toLowerCase().includes('urgente'),
      estado: 'pendiente',
    };

    try {
      const response = await fetch('http://localhost:3000/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToSave),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar la tarea');
      }

      const newTask = {
        id: data.id_tarea,
        icon: taskToSave.es_urgente ? 'red' : 'blue',
        title: taskToSave.titulo,
        time: `${durationValue}m`,
        tag: categoryValue,
        urgent: taskToSave.es_urgente,
      };
      setTasks((prev) => [...prev, newTask]);
      setNewTitle('');
      setNewTime('30m');
      setNewTag('Personal');
      setStatusMessage('Tarea guardada en la base de datos');
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <MindFullDashboard />;
      case 'Tareas':
        return null;
      case 'Enfoque':
        return (
          <div>
            <h1>Enfoque</h1>
            <p>Herramientas de enfoque.</p>
          </div>
        );
      case 'Estadísticas':
        return (
          <div>
            <h1>Estadísticas</h1>
            <p>Gráficos y estadísticas.</p>
          </div>
        );
      case 'Ajustes':
        return (
          <div>
            <h1>Ajustes</h1>
            <p>Configuración de la cuenta.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">Mind Full</div>
        <div className="modo">Modo Túnel</div>
        <div className="top-right">
          <div className="pill-limite">Límite: 75%</div>
          
          {/* 2. Añadimos el evento onClick para detonar el modal global */}
          <button className="btn-panico" onClick={abrirPanico}>
            Botón de Pánico
          </button>
          
          <div className="icon-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </div>
          <div className="icon-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">B</div>
          <div className="profile-info">
            <h3>Breathe</h3>
            <p>Mantente Presente</p>
          </div>
        </div>
        <nav className="nav">
          <button
            className={`nav-item ${activeSection === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('Dashboard')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'Tareas' ? 'active' : ''}`}
            onClick={() => setActiveSection('Tareas')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Tareas
          </button>
          <button
            className={`nav-item ${activeSection === 'Enfoque' ? 'active' : ''}`}
            onClick={() => setActiveSection('Enfoque')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Enfoque
          </button>
          <button
            className={`nav-item ${activeSection === 'Estadísticas' ? 'active' : ''}`}
            onClick={() => setActiveSection('Estadísticas')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            Estadísticas
          </button>
          <button
            className={`nav-item ${activeSection === 'Ajustes' ? 'active' : ''}`}
            onClick={() => setActiveSection('Ajustes')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Ajustes
          </button>
        </nav>
        <button className="btn-sesion">Sesión de Enfoque</button>
      </aside>

      <main className="main">
        {activeSection === 'Dashboard' ? (
          <MindFullDashboard hideSidebar />
        ) : activeSection !== 'Tareas' ? (
          <div className="section-placeholder">
            {renderSection()}
          </div>
        ) : (
          <>
            <div className="main-header">
              <div>
                <h1>Prioridades Diarias</h1>
                <p>Organiza tu mente, una elección a la vez.</p>
              </div>
              <div className="tareas-pill">{tasks.length} Tareas Pendientes</div>
            </div>

            <section className="motor">
              <div className="motor-label">MOTOR DE DECISIONES</div>
              <h2>¿Qué contribuye más a tu paz?</h2>
              <div className="vs-grid">
                <div className="task-card" onClick={() => alert('Elegiste TRABAJO')}>
                  <span className="tag trabajo">TRABAJO</span>
                  <h3>Finalizar Estrategia de Presupuesto Q3</h3>
                  <div className="task-meta">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    45 mins
                  </div>
                </div>
                <div className="vs-circle">vs</div>
                <div className="task-card" onClick={() => alert('Elegiste PERSONAL')}>
                  <span className="tag personal">PERSONAL</span>
                  <h3>Compra y Preparación de Comidas</h3>
                  <div className="task-meta">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    90 mins
                  </div>
                </div>
              </div>
              <p className="motor-foot">Reconoce tu capacidad. Elige la tarea que se alinee con tu nivel actual de energía.</p>
            </section>

            <div className="content-grid">
              <div>
                <div className="section-head">
                  <h3>Bandeja de Entrada</h3>
                  <div className="section-actions">
                    <a href="#">Seleccionar todo</a> | Ordenar por tiempo
                  </div>
                </div>

                {tasks.map((t) => (
                  <div className="inbox-item" key={t.id}>
                    <div className={`inbox-icon ${t.icon}`}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/></svg>
                    </div>
                    <div className="inbox-content">
                      <h4>{t.title}</h4>
                      <div className="inbox-meta">
                        <span>◷ {t.time}</span>
                        <span className={t.urgent ? 'urgente' : ''}>{t.tag}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <form className="add-task" onSubmit={addTask}>
                  <label className="field">
                    <span className="field-label">Tarea</span>
                    <input
                      type="text"
                      placeholder="Describe la tarea..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </label>

                  <label className="field small">
                    <span className="field-label">Duración</span>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      aria-label="duración"
                    />
                  </label>

                  <label className="field small">
                    <span className="field-label">Etiqueta</span>
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      aria-label="etiqueta"
                    />
                  </label>

                  <button type="submit">Añadir</button>
                </form>
              </div>

              <div>
                <div className="enfoque">
                  <h3>Enfoque Diario</h3>
                  <p>Tienes 4.5 horas estimadas de trabajo.</p>
                  <div className="progress-bg"><div className="progress-fill"></div></div>
                  <div className="enfoque-stats">
                    <div className="stat"><div className="stat-num">12</div><div className="stat-label">HECHAS</div></div>
                    <div className="stat"><div className="stat-num">08</div><div className="stat-label">PENDIENTES</div></div>
                  </div>
                </div>

                <div className="distribucion">
                  <h4>DISTRIBUCIÓN</h4>
                  <div className="dist-item">
                    <div className="dist-head"><span><span className="dot trabajo"></span>Trabajo</span><span>55%</span></div>
                    <div className="dist-bar"><div className="dist-fill trabajo"></div></div>
                  </div>
                  <div className="dist-item">
                    <div className="dist-head"><span><span className="dot estudio"></span>Estudio</span><span>30%</span></div>
                    <div className="dist-bar"><div className="dist-fill estudio"></div></div>
                  </div>
                  <div className="dist-item">
                    <div className="dist-head"><span><span className="dot personal"></span>Personal</span><span>15%</span></div>
                    <div className="dist-bar"><div className="dist-fill personal"></div></div>
                  </div>
                </div>

                <div className="quote">
                  <div className="quote-content">
                    <div className="quote-text">"La simplicidad es la máxima sofisticación."</div>
                    <div className="quote-author">— LEONARDO DA VINCI</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <div className="fab">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
      </div>
    </div>
  );
}