import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import ScenarioNameModal from '../components/addscenario';

const MainPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios] = useState([
    { id: 1, name: 'Irrigation Plan', description: 'Optimize water usage' },
    { id: 2, name: 'Soil Analysis', description: 'Check soil nutrients' },
    { id: 3, name: 'Growth Forecast', description: 'Predict crop yields' }
  ]);
  const [formData, setFormData] = useState({
    n: '',
    p: '',
    k: '',
    ph: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    zn: '',
    s: ''
  });
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);



  // Загрузка сценариев из localStorage при старте
  useEffect(() => {
    const savedScenarios = JSON.parse(localStorage.getItem('scenarios') || '[]');
    setScenarios(savedScenarios);
  }, []);

  // Проверка роли
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');

    // Если роль не выбрана или не соответствует параметру URL, перенаправляем на страницу выбора роли
    if (!savedRole || (role !== savedRole && role !== 'astronaut' && role !== 'farmer')) {
      navigate('/');
    } else {
      setSelectedRole(savedRole);
    }
  }, [role, navigate]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [calcResult, setCalcResult] = useState(null);

  const handleCalculate = async () => {
    // Build payload using form values, with exact numbers requested by user as defaults
    const payload = {
      mode: 'STATION',
      depParam: { peopleNumber: 10, square: 100 },
      args: {
        N: Number(formData.n) || 1,
        P: Number(formData.p) || 1,
        K: Number(formData.k) || 1,
        ph: formData.ph !== '' ? Number(formData.ph) : 6.5,
        temperature: Number(formData.temperature) || 25,
        humidity: Number(formData.humidity) || 70,
        rainfall: Number(formData.rainfall) || 10,
        Zn: Number(formData.zn) || 2,
        S: Number(formData.s) || 10
      }
    };

    try {
      const res = await fetch('http://localhost:5000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      console.log('Calculate response:', data);
      setCalcResult(data);
    } catch (err) {
      console.error('Calculate error:', err);
      setCalcResult({ error: err.message });
    }
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
    scenarioSelector: {
      width: '90%',
      maxWidth: '414px',
      margin: '20px auto',
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      color: '#2D3748',
      fontSize: '16px',
      cursor: 'pointer',
      position: 'relative',
      zIndex: 200,
      border: '1px solid #E2E8F0',
      transition: 'all 0.2s ease'
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      marginTop: '8px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      overflow: 'hidden',
      opacity: isDropdownOpen ? 1 : 0,
      visibility: isDropdownOpen ? 'visible' : 'hidden',
      transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid #E2E8F0'
    },
    dropdownItem: {
      padding: '16px 20px',
      borderBottom: '1px solid #eee',
      color: '#666',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    createScenario: {
      padding: '16px 20px',
      color: '#0D6E6E',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s',
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
      bottom: isModalOpen ? '0' : '-673px',
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
    inputContainer: {
      padding: '40px 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '100%',
      overflow: 'auto',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      color: '#666',
      fontWeight: '500',
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      outline: 'none',
    },
    calculateButton: {
      position: 'sticky',
      bottom: '0',
      left: '0',
      right: '0',
      margin: '20px 20px 70px 20px',
      padding: '16px',
      backgroundColor: '#0D6E6E',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(13, 110, 110, 0.25)',
    },
  };

  // Show loading while checking role
  if (selectedRole === null) {
    return <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // Фильтруем сценарии по текущей роли
  const roleScenarios = scenarios.filter(s => s.role === role);

  return (
    <div style={styles.container}>
      {/* Scenario Selector with Dropdown */}
      <div style={styles.scenarioSelector}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span style={{ 
            color: selectedScenario ? '#2D3748' : '#718096',
            fontWeight: selectedScenario ? '500' : 'normal'
          }}>
            {selectedScenario?.name || 'Select Scenario'}
          </span>
          <ChevronDown
            size={20}
            style={{
              transform: `rotate(${isDropdownOpen ? '180deg' : '0deg'})`,
              transition: 'transform 0.3s ease',
              color: '#718096'
            }}
          />
        </div>

        {/* Dropdown Menu */}
        <div style={styles.dropdown}>
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: selectedScenario?.id === scenario.id ? '#F0F9F9' : 'transparent',
                color: selectedScenario?.id === scenario.id ? '#0D6E6E' : '#2D3748',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                ':hover': {
                  backgroundColor: '#F7FAFC'
                }
              }}
              onClick={() => {
                setSelectedScenario(scenario);
                setIsDropdownOpen(false);
              }}
            >
              <span style={{ fontWeight: '500' }}>{scenario.name}</span>
              <span style={{ 
                fontSize: '14px',
                color: '#718096'
              }}>{scenario.description}</span>
            </div>
          ))}
          <div
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              color: '#0D6E6E',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleModal();
              setIsDropdownOpen(false);
            }}
          >
            <Plus size={16} />
            <span>Create New Scenario</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 style={styles.title}>
        {selectedScenario ? selectedScenario.name : 'Select a Scenario'}
      </h1>

      {/* Center Text */}
      {!selectedScenario && (
        <div style={{
          ...styles.centerText,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{ color: '#4A5568', fontSize: '18px' }}>
            Choose a scenario to get started
          </span>
          <button
            onClick={() => setIsDropdownOpen(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0D6E6E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(13, 110, 110, 0.25)'
            }}
          >
            <Plus size={16} />
            Select Scenario
          </button>
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={toggleModal}>
          <ArrowUp style={{ color: 'white' }} />
        </button>
      </div>

      <div style={styles.modalOverlay} onClick={toggleModal}></div>

      <div style={styles.modal}>
        {isModalOpen && (
          <button style={styles.modalButton} onClick={toggleModal}>
            <ArrowDown style={{ color: 'white' }} />
          </button>
        )}
        <div style={styles.inputContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nitrogen (N)</label>
            <input
              type="number"
              style={styles.input}
              placeholder="Enter N value"
              name="n"
              value={formData.n}
              onChange={handleInputChange}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phosphorus (P)</label>
            <input
              type="number"
              name="p"
              value={formData.p}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter P value"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Potassium (K)</label>
            <input
              type="number"
              name="k"
              value={formData.k}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter K value"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>pH Level</label>
            <input
              type="number"
              name="ph"
              value={formData.ph}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter pH value"
              step="0.1"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Temperature (°C)</label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter temperature"
              step="0.1"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Humidity (%)</label>
            <input
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter humidity"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Rainfall (mm)</label>
            <input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter rainfall"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Zinc (Zn)</label>
            <input
              type="number"
              name="zn"
              value={formData.zn}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter Zn value"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Sulfur (S)</label>
            <input
              type="number"
              name="s"
              value={formData.s}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter S value"
            />
          </div>

          {/* Add Calculate button after all inputs */}
          <button
            style={styles.calculateButton}
            onClick={handleCalculate}
          >
            Рассчитать
          </button>
        </div>
      </div>

      <ScenarioNameModal 
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onSave={handleScenarioSave}
      />
    </div>
  );
};

export default MainPage;