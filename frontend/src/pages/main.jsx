import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../components/Card';


const MainPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // При загрузке страницы проверяем наличие выбранной роли
  useEffect(() => {
    // Получаем сохраненную роль из localStorage
    const savedRole = localStorage.getItem('selectedRole');
    
    // Если роль не выбрана или не соответствует параметру URL, перенаправляем на страницу выбора роли
    if (!savedRole || (role !== savedRole && role !== 'astronaut' && role !== 'farmer')) {
      navigate('/');
    } else {
      setSelectedRole(savedRole);
    }
  }, [role, navigate]);

  // Функция для открытия/закрытия модального окна
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
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
    scenarioSelector: {
      width: '90%',
      maxWidth: '414px',
      margin: '20px auto',
      padding: '16px',
      backgroundColor: '#f9f9f9',
      borderRadius: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      color: '#888',
      fontSize: '18px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '500',
      color: '#333',
      textAlign: 'center',
      margin: '24px 0'
    },
    centerText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#888',
      fontSize: '18px',
      fontWeight: '400',
      textAlign: 'center'
    },
    buttonContainer: {
      position: 'absolute',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10
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
      backgroundColor: '#0D6E6E',
      boxShadow: '0 4px 12px rgba(13, 110, 110, 0.25)'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 100,
      display: isModalOpen ? 'block' : 'none'
    },
    modal: {
      position: 'fixed',
      width: '100%',
      height: '673px',
      bottom: isModalOpen ? '0' : '-673px', // Анимация снизу
      left: '0',
      transform: 'none',
      backgroundColor: 'white',
      transition: 'bottom 0.3s ease-in-out',
      zIndex: 101,
    },
    modalButton: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0D6E6E',
      boxShadow: '0 4px 12px rgba(13, 110, 110, 0.25)',
    },
    modalCloseButton: {
      position: 'absolute',
      top: '-28px', // Половина высоты кнопки, чтобы она находилась на границе модального окна
      left: '50%',
      transform: 'translateX(-50%)',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0D6E6E',
      boxShadow: '0 4px 12px rgba(13, 110, 110, 0.25)',
      zIndex: 102
    }
  };

  // Отображаем контент только если роль выбрана
  if (!selectedRole) {
    return null; // Или можно показать загрузку: <div>Loading...</div>
  }

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

      {/* Scenario Selector */}
      <div style={styles.scenarioSelector}>
        <span>Scenarios</span>
        <ChevronDown size={20} />
      </div>

      {/* Title */}
      <h1 style={styles.title}>Scenario for Texas</h1>

      {/* Center Text */}
      <div style={styles.centerText}>Add your first scenario</div>

      {/* Button */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={toggleModal}>
          <ArrowUp style={{ color: 'white' }} />
        </button>
      </div>

      {/* Modal Overlay */}
      <div style={styles.modalOverlay} onClick={toggleModal}></div>

      {/* Modal Content */}
      <div style={styles.modal}>
        {isModalOpen && (
          <button style={styles.modalButton} onClick={toggleModal}>
            <ArrowDown style={{ color: 'white' }} />
          </button>
        )}
        {/* Здесь остальное содержимое модального окна */}
      </div>
    </div>
  );
};

export default MainPage;