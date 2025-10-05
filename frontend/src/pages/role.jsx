import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RoleSelectionPage = () => {
  // Состояние для хранения выбранной роли
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  // Функция для перехода на страницу main.jsx
  const handleContinue = () => {
    if (selectedProfile) {
      // Сохраняем выбранную роль в localStorage для доступа на других страницах
      localStorage.setItem('selectedRole', selectedProfile);
      
      // Переходим на страницу main.jsx с параметром выбранной роли
      navigate(`/main/${selectedProfile}`);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 0,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      position: 'relative'
    },
    statusBar: {
      width: '100%',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxSizing: 'border-box'
    },
    time: {
      fontWeight: '600',
      fontSize: '15px'
    },
    statusIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    title: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '24.26px',
      fontWeight: '400',
      lineHeight: '100%',
      letterSpacing: '0%',
      color: '#1a1a1a',
      textAlign: 'center',
      marginTop: '40px',
      marginBottom: '60px'  // Увеличен отступ до карточек
    },
    cardsWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '40px',  // Увеличено расстояние между карточками с 24px до 40px
      width: '100%',
      marginTop: '20px'  // Дополнительный отступ сверху для смещения карточек вниз
    },
    emptyCard: {
      width: '256px',
      height: '214px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.3s ease',
      border: '3px solid transparent',
      overflow: 'hidden'
    },
    cardSelected: {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      border: '3px solid #6366f1'
    },
    buttonContainer: {
      position: 'absolute',
      bottom: '60px',
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    },
    buttonWrapper: {
      position: 'relative'
    },
    button: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    buttonEnabled: {
      backgroundColor: '#0f172a',
      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)'
    },
    buttonDisabled: {
      backgroundColor: '#e5e7eb',
      cursor: 'not-allowed'
    },
    buttonRing: {
      position: 'absolute',
      inset: '-8px',
      borderRadius: '50%',
      border: '3px solid rgba(255, 255, 255, 0.9)',
      pointerEvents: 'none'
    }
  };

  return (
    <div style={styles.container}>
      {/* Status Bar */}
      <div style={styles.statusBar}>
        <div style={styles.time}>9:41</div>
        <div style={styles.statusIcons}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="1" y="4" width="3" height="8" fill="black" opacity="0.4"/>
            <rect x="5" y="2" width="3" height="10" fill="black" opacity="0.6"/>
            <rect x="9" y="0" width="3" height="12" fill="black" opacity="0.8"/>
            <rect x="13" y="2" width="3" height="10" fill="black"/>
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path d="M1 3.5C1 3.5 3 0.5 7.5 0.5C12 0.5 14 3.5 14 3.5" stroke="black" strokeWidth="1.5"/>
            <path d="M14 7.5C14 7.5 12 10.5 7.5 10.5C3 10.5 1 7.5 1 7.5" stroke="black" strokeWidth="1.5"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="2" y="2" width="19" height="8" rx="2" stroke="black" strokeWidth="1"/>
            <rect x="22" y="4.5" width="1.5" height="3" rx="0.5" fill="black"/>
            <rect x="4" y="4" width="15" height="4" rx="1" fill="black"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 style={styles.title}>Choose your profile</h1>

      {/* Cards */}
      <div style={styles.cardsWrapper}>
        {/* Card 1 - Astronaut */}
        <div 
          style={{
            ...styles.emptyCard,
            ...(selectedProfile === 'astronaut' ? styles.cardSelected : {})
          }}
          onClick={() => setSelectedProfile('astronaut')}
        />

        {/* Card 2 - Farmer */}
        <div 
          style={{
            ...styles.emptyCard,
            ...(selectedProfile === 'farmer' ? styles.cardSelected : {})
          }}
          onClick={() => setSelectedProfile('farmer')}
        />
      </div>

      {/* Continue Button */}
      <div style={styles.buttonContainer}>
        <div style={styles.buttonWrapper}>
          {selectedProfile && <div style={styles.buttonRing}></div>}
          <button
            onClick={handleContinue}
            disabled={!selectedProfile}
            style={{
              ...styles.button,
              ...(selectedProfile ? styles.buttonEnabled : styles.buttonDisabled)
            }}
          >
            <ArrowRight style={{
              width: '24px',
              height: '24px',
              color: 'white'
            }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;