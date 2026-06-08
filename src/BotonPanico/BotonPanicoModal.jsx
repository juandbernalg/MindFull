import React, { useState } from 'react';
import './BotonPanicoModal.css';

export default function BotonPanicoModal({ isOpen, onClose, onConfirm }) {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedOption) {
      alert("Por favor, selecciona una opción antes de continuar.");
      return;
    }
    onConfirm(selectedOption);
  };

  return (
    <div className="panic-modal-overlay">
      <div className="panic-modal-card">
        {/* Icono de Alerta Superior */}
        <div className="panic-alert-icon-container">
          <div className="panic-alert-icon">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
        </div>

        {/* Textos Principales */}
        <h2 className="panic-modal-title">¿Qué ha pasado?</h2>
        <p className="panic-modal-subtitle">
          Respira. Estamos aquí para ayudarte a recuperar el equilibrio.<br />
          Cuéntanos qué interrupción has tenido.
        </p>

        {/* Grid de 3 Columnas para las Opciones */}
        <div className="panic-options-grid">
          <button 
            type="button" 
            className={`panic-option-card ${selectedOption === 'urgente' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('urgente')}
          >
            <div className="option-icon-wrapper">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <span>Imprevisto Urgente</span>
          </button>

          <button 
            type="button" 
            className={`panic-option-card ${selectedOption === 'sobrecarga' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('sobrecarga')}
          >
            <div className="option-icon-wrapper">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <span>Sobrecarga Emocional</span>
          </button>

          <button 
            type="button" 
            className={`panic-option-card ${selectedOption === 'planes' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('planes')}
          >
            <div className="option-icon-wrapper">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <span>Cambio de Planes</span>
          </button>
        </div>

        {/* Botones de Acción */}
        <div className="panic-actions-container">
          <button className="panic-btn-confirm" onClick={handleConfirm}>
            Confirmar y Recalcular
          </button>
          <button className="panic-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}