import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import astronautImg from './astronaut.png'; 
import farmerImg from './farmer.png';

const RoleSelectionPage = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();
  const { role } = useParams();

  const handleContinue = () => {
    if (selectedProfile) {
      localStorage.setItem('selectedRole', selectedProfile);
      navigate(`/main/${selectedProfile}`);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      position: 'relative',
    },
    title: {
      fontSize: '22px',
      fontWeight: '500',
      color: '#1a1a1a',
      textAlign: 'center',
      marginTop: '60px',
      marginBottom: '40px',
    },
    cardsWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px',
      width: '100%',
    },
    card: {
      width: '256px',
      height: '214px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    },
    cardSelected: {
      transform: 'scale(1.02)',
      border: '2px solid #6366f1',
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    },
    image: {
      width: '60%',
      height: 'auto',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: '40px',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    button: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    buttonDisabled: {
      backgroundColor: '#e5e7eb',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose your profile</h1>

      <div style={styles.cardsWrapper}>
        {/* Astronaut */}
        <div
          style={{
            ...styles.card,
            ...(selectedProfile === 'astronaut' ? styles.cardSelected : {}),
          }}
          onClick={() => setSelectedProfile('astronaut')}
        >
          <img src={astronautImg} alt="Astronaut" style={styles.image} />
        </div>

        {/* Farmer */}
        <div
          style={{
            ...styles.card,
            ...(selectedProfile === 'farmer' ? styles.cardSelected : {}),
          }}
          onClick={() => setSelectedProfile('farmer')}
        >
          <img src={farmerImg} alt="Farmer" style={styles.image} />
        </div>
      </div>

      {/* Continue button */}
      <div style={styles.buttonContainer}>
        <button
          onClick={handleContinue}
          disabled={!selectedProfile}
          style={{
            ...styles.button,
            ...(selectedProfile ? {} : styles.buttonDisabled),
          }}
        >
          <ArrowRight size={24} color="white" />
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
