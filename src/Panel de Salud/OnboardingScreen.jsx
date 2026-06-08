import React, { useState } from 'react';
import { LayoutDashboard, CheckCircle, Timer, BarChart3, Settings, Bell, User, Zap, MoreHorizontal, Wind } from 'lucide-react';

const MindFullDashboard = () => {
  const [activeTab, setActiveTab] = useState('mindfull');

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F7F8FA',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#FFFFFF',
      padding: '32px 20px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #E8EAED',
    },
    logo: {
      marginBottom: '48px',
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0D5C4B',
      letterSpacing: '-0.5px',
    },
    logoSubtext: {
      fontSize: '10px',
      color: '#6B7280',
      letterSpacing: '1px',
      marginTop: '2px',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '4px',
      cursor: 'pointer',
      color: '#4B5563',
      fontSize: '15px',
      transition: 'all 0.2s',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left',
    },
    navItemActive: {
      backgroundColor: '#F0FDF4',
      color: '#0D5C4B',
      fontWeight: '500',
    },
    loginBtn: {
      marginTop: 'auto',
      backgroundColor: '#0D5C4B',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    main: {
      flex: 1,
      padding: '24px 32px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      paddingBottom: '24px',
      borderBottom: '1px solid #E8EAED',
    },
    tabs: {
      display: 'flex',
      gap: '32px',
    },
    tab: {
      fontSize: '16px',
      color: '#6B7280',
      cursor: 'pointer',
      paddingBottom: '8px',
      borderBottom: '2px solid transparent',
      background: 'none',
      border: 'none',
      fontWeight: '500',
    },
    tabActive: {
      color: '#0D5C4B',
      borderBottomColor: '#0D5C4B',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    limiteText: {
      fontSize: '14px',
      color: '#6B7280',
    },
    panicBtn: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    iconBtn: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: '#F3F4F6',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    greeting: {
      fontSize: '32px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px',
    },
    subtext: {
      fontSize: '15px',
      color: '#6B7280',
      marginBottom: '32px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '20px',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    cardLarge: {
      gridColumn: 'span 2',
    },
    cardDark: {
      backgroundColor: '#0D5C4B',
      color: 'white',
    },
    cardTitle: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '8px',
      fontWeight: '500',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#E5E7EB',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '12px',
      marginBottom: '12px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#0D5C4B',
      borderRadius: '4px',
      transition: 'width 0.3s',
    },
    stats: {
      display: 'flex',
      gap: '16px',
      fontSize: '13px',
      color: '#6B7280',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#0D5C4B',
      display: 'inline-block',
      marginRight: '6px',
    },
    percentage: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#0D5C4B',
      lineHeight: '1',
    },
    tunnelIcon: {
      width: '48px',
      height: '48px',
      margin: '0 auto 16px',
      display: 'block',
    },
    tunnelTitle: {
      fontSize: '20px',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '8px',
    },
    tunnelText: {
      fontSize: '14px',
      textAlign: 'center',
      opacity: '0.9',
      marginBottom: '20px',
    },
    tunnelBtn: {
      width: '100%',
      backgroundColor: 'white',
      color: '#0D5C4B',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    tag: {
      display: 'inline-block',
      backgroundColor: '#D1FAE5',
      color: '#065F46',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      marginBottom: '12px',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '12px',
    },
    cardBody: {
      fontSize: '14px',
      color: '#4B5563',
      lineHeight: '1.6',
      marginBottom: '16px',
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    avatars: {
      display: 'flex',
      gap: '-8px',
    },
    avatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: '#E5E7EB',
      border: '2px solid white',
      marginLeft: '-8px',
    },
    timeText: {
      fontSize: '12px',
      color: '#9CA3AF',
    },
    cardGreen: {
      backgroundColor: '#E8F5E9',
      textAlign: 'center',
    },
    circleIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: '#D1FAE5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
    },
    chartContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: '80px',
      gap: '8px',
      marginTop: '16px',
    },
    bar: {
      flex: 1,
      backgroundColor: '#D1FAE5',
      borderRadius: '4px 4px 0 0',
    },
    barActive: {
      backgroundColor: '#0D5C4B',
    },
    quoteSection: {
      position: 'relative',
      height: '200px',
      borderRadius: '16px',
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, #E0F2FE 0%, #BAE6FD 30%, #7DD3FC 60%, #38BDF8 100%)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '32px',
    },
    quoteText: {
      color: 'white',
      fontSize: '16px',
      fontStyle: 'italic',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
      position: 'relative',
      zIndex: 2,
    },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>Mind</div>
          <div style={styles.logoSubtext}>MANTENTE PRESENTE</div>
        </div>
        
        <nav>
          <button style={{...styles.navItem, ...styles.navItemActive}}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button style={styles.navItem}>
            <CheckCircle size={20} /> Tareas
          </button>
          <button style={styles.navItem}>
            <Timer size={20} /> Enfoque
          </button>
          <button style={styles.navItem}>
            <BarChart3 size={20} /> Estadísticas
          </button>
          <button style={styles.navItem}>
            <Settings size={20} /> Configuración
          </button>
        </nav>

        <button style={styles.loginBtn}>Iniciar Sesión</button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.tabs}>
            <button 
              style={{...styles.tab, ...(activeTab === 'mindfull' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('mindfull')}
            >
              Mind Full
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'tunel' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('tunel')}
            >
              Modo Túnel
            </button>
          </div>
          
          <div style={styles.headerRight}>
            <span style={styles.limiteText}>Límite: 75%</span>
            <button style={styles.panicBtn}>Botón de Pánico</button>
            <button style={styles.iconBtn}><Bell size={18} /></button>
            <button style={styles.iconBtn}><User size={18} /></button>
          </div>
        </header>

        <h1 style={styles.greeting}>Buenas tardes, Julian</h1>
        <p style={styles.subtext}>Tu mente está enfocada al 75% en este momento. Respira profundo.</p>

        <div style={styles.grid}>
          <div style={{...styles.card, ...styles.cardLarge}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
              <div>
                <div style={{...styles.cardTitle, color: '#0D5C4B', fontWeight: '600'}}>Flujo de Productividad</div>
                <div style={{fontSize: '13px', color: '#6B7280'}}>Capacidad diaria utilizada</div>
              </div>
              <div style={styles.percentage}>75%</div>
            </div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: '75%'}}></div>
            </div>
            <div style={styles.stats}>
              <span><span style={styles.dot}></span>4.5h Enfocado</span>
              <span>• 1.5h Restante</span>
            </div>
          </div>

          <div style={{...styles.card, ...styles.cardDark}}>
            <Zap size={48} style={styles.tunnelIcon} />
            <div style={styles.tunnelTitle}>Modo Túnel</div>
            <div style={styles.tunnelText}>Silencia todos los estímulos no esenciales al instante.</div>
            <button style={styles.tunnelBtn}>Iniciar Modo Túnel</button>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.tag}>Enfoque Actual</span>
              <MoreHorizontal size={20} color="#9CA3AF" />
            </div>
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827'}}>Revisión de Estrategia</h3>
            <p style={styles.cardBody}>
              Análisis de métricas de rendimiento del H2 y preparación para la presentación para la junta directiva del jueves.
            </p>
            <div style={styles.cardFooter}>
              <div style={styles.avatars}>
                <div style={styles.avatar}></div>
                <div style={styles.avatar}></div>
              </div>
              <span style={styles.timeText}>Vence en 2h</span>
            </div>
          </div>

          <div style={{...styles.card, ...styles.cardGreen}}>
            <div style={styles.circleIcon}>
              <Wind size={28} color="#0D5C4B" />
            </div>
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#111827'}}>Respirar</h3>
            <p style={{fontSize: '14px', color: '#059669'}}>Sesión de 1 minuto</p>
          </div>

          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
              <span style={{...styles.cardTitle, margin: 0}}>PULSO DE ENFOQUE</span>
              <span style={{fontSize: '13px', color: '#059669', fontWeight: '500'}}>Estable</span>
            </div>
            <div style={styles.chartContainer}>
              <div style={{...styles.bar, height: '40%'}}></div>
              <div style={{...styles.bar, height: '60%'}}></div>
              <div style={{...styles.bar, height: '45%'}}></div>
              <div style={{...styles.bar, height: '80%'}}></div>
              <div style={{...styles.barActive, ...styles.bar, height: '100%'}}></div>
              <div style={{...styles.bar, height: '55%'}}></div>
              <div style={{...styles.bar, height: '70%'}}></div>
              <div style={{...styles.bar, height: '35%'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', marginTop: '8px'}}>
              <span>9 AM</span>
              <span>12PM</span>
              <span>4/6RA</span>
            </div>
          </div>
        </div>

        <div style={styles.quoteSection}>
          <p style={styles.quoteText}>
            "La naturaleza no se apresura, sin embargo, todo se logra." — Lao Tzu
          </p>
        </div>
      </main>
    </div>
  );
};

export default MindFullDashboard;