import React, { useState } from 'react';

const ScenarioNameModal = ({ isOpen, onClose, onSave }) => {
  const [scenarioName, setScenarioName] = useState('');

  const handleSave = () => {
    if (scenarioName.trim()) {
      onSave(scenarioName);
      setScenarioName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
    },
    modal: {
      width: '90%',
      maxWidth: '400px',
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px 30px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: '30px',
      lineHeight: '1.3',
    },
    input: {
      width: '100%',
      padding: '16px',
      fontSize: '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      backgroundColor: '#f5f5f5',
      outline: 'none',
      marginBottom: '30px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#0D6E6E',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '15px',
    },
    hint: {
      fontSize: '14px',
      color: '#999',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Enter the scenario name</h2>
        <input
          type="text"
          style={styles.input}
          placeholder="Scenario 1"
          value={scenarioName}
          onChange={(e) => setScenarioName(e.target.value)}
          autoFocus
        />
        <button style={styles.button} onClick={handleSave}>
          Save
        </button>
        <p style={styles.hint}>Check the name before saving the data</p>
      </div>
    </div>
  );
};

export default ScenarioNameModal;