import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowUp } from 'lucide-react';

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
      overflow: 'hidden' // Чтобы модальное окно не выходило за пределы контейнера
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
    upperCard: {
      width: '314px',
      height: '236px',
      position: 'absolute',
      top: '202px',
      left: '39px',
      backgroundColor: '#F7F8F9', // Такой же цвет как у нижней карточки
      borderRadius: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Такая же тень как у нижней карточки
      overflow: 'hidden'
    },
    lowerCard: {
      width: '314px',
      height: '236px',
      position: 'absolute',
      top: '497px',
      left: '39px',
      backgroundColor: '#F7F8F9',
      borderRadius: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
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
      position: 'absolute',
      width: '390px',
      height: '673px',
      top: isModalOpen ? '172px' : '100%', // Если модальное окно открыто, оно на позиции 172px, иначе за пределами экрана
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
      transition: 'top 0.3s ease-in-out',
      zIndex: 101
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

      {/* Upper Card */}
      <div style={styles.upperCard}></div>

      {/* Lower Card */}
      <div style={styles.lowerCard}></div>

      {/* Button */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={toggleModal}>
          <ArrowUp style={{ color: 'white' }} />
        </button>
      </div>

      {/* Modal Overlay */}
      <div style={styles.modalOverlay} onClick={toggleModal}></div>

      {/* Modal Content */}
      <div style={styles.modal}></div>
    </div>
  );
};

export default MainPage;

// раоаооа