import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import ScenarioNameModal from '../components/addscenario';
import ResultCard from '../components/ResultCard';

const MainPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [formData, setFormData] = useState({
    n: '',
    p: '',
    k: '',
    ph: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    zn: '',
    s: '',
    peopleCount: '10' // Добавили поле для космонавта
  });
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [calcResult, setCalcResult] = useState(null);

  // Загрузка сценариев из localStorage при старте
  useEffect(() => {
    const savedScenarios = JSON.parse(localStorage.getItem('scenarios') || '[]');
    setScenarios(savedScenarios);
  }, []);

  // Проверка роли
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
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

  const handleCalculate = async () => {
    const payload = {
      mode: role === 'astronaut' ? 'STATION' : 'FARM',
      depParam: role === 'astronaut' 
        ? { 
            peopleNumber: Number(formData.peopleCount) || 10, // Берем из формы
            square: 100 
          } 
        : {
            Maize: { price: 200 },
            Potato: { price: 50 },
            Wheat: { price: 150 },
            Barley: { price: 100 },
            Bean: { price: 180 },
            Pea: { price: 120 }
          },
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
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      console.log('Calculate response:', data);
      setCalcResult(data);
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Calculate error:', err);
      alert('Ошибка при расчете: ' + err.message);
    }
  };

  // Сохранение сценария
  const handleScenarioSave = (name) => {
    const scenario = {
      id: Date.now(),
      name: name,
      role: role,
      parameters: formData,
      createdAt: new Date().toISOString(),
      description: 'Custom scenario'
    };
    
    const existingScenarios = JSON.parse(localStorage.getItem('scenarios') || '[]');
    const updatedScenarios = [...existingScenarios, scenario];
    
    localStorage.setItem('scenarios', JSON.stringify(updatedScenarios));
    setScenarios(updatedScenarios);
    setSelectedScenario(scenario);
    setIsScenarioModalOpen(false);
  };

  // Загрузка сценария
  const loadScenario = (scenario) => {
    setFormData(scenario.parameters);
    setSelectedScenario(scenario);
    setIsDropdownOpen(false);
  };

  // Создание нового сценария
  const handleCreateNewScenario = () => {
    setFormData({
      n: '',
      p: '',
      k: '',
      ph: '',
      temperature: '',
      humidity: '',
      rainfall: '',
      zn: '',
      s: '',
      peopleCount: '10' // Не забудьте добавить
    });
    setSelectedScenario(null);
    setIsScenarioModalOpen(true);
    setIsDropdownOpen(false);
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
      gap: '84px',
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

  console.log('Current role:', role); // Добавьте эту строку
  console.log('Is astronaut?', role === 'astronaut'); // И эту

  if (selectedRole === null) {
    return <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  const roleScenarios = scenarios.filter(s => s.role === role);

  return (
    <div style={styles.container}>
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

        <div style={styles.dropdown}>
          {roleScenarios.map((scenario) => (
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
                gap: '4px'
              }}
              onClick={() => loadScenario(scenario)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedScenario?.id === scenario.id ? '#F0F9F9' : 'transparent'}
            >
              <span style={{ fontWeight: '500' }}>{scenario.name}</span>
              <span style={{ fontSize: '14px', color: '#718096' }}>
                {scenario.description || 'Custom scenario'}
              </span>
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
              handleCreateNewScenario();
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Plus size={16} />
            <span>Create New Scenario</span>
          </div>
        </div>
      </div>

      <h1 style={styles.title}>
        {selectedScenario ? selectedScenario.name : 'Select a Scenario'}
      </h1>

      {/* Center content - либо инструкция, либо результаты */}
      {!selectedScenario && !calcResult && (
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

      {/* Results display */}
      {calcResult && !calcResult.error && (
        <div style={{
          width: '90%',
          maxWidth: '414px',
          margin: '0 auto',
          paddingBottom: '120px',
          overflowY: 'auto',
          height: 'calc(100vh - 300px)'
        }}>
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#E6F7F7',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              color: '#0D6E6E',
              fontWeight: '600'
            }}>
              {role === 'astronaut' 
                ? `Total: ${calcResult.total.toFixed(0)} days` 
                : `Total revenue: $${calcResult.total.toFixed(0)}`
              }
            </h2>
          </div>

          {calcResult.cultures.map((culture, index) => (
            <ResultCard
              key={index}
              title={culture.culture}
              titleRu={culture.culture} 
              productivity={culture.productivity}
              value={culture.value}
              isAstronaut={role === 'astronaut'}
            />
          ))}
        </div>
      )}

      {calcResult && calcResult.error && (
        <div style={styles.centerText}>
          <span style={{ color: '#E53E3E' }}>Error: {calcResult.error}</span>
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

          {/* Add new field for astronaut role */}
          {(role === 'astronaut' || role === 'ASTRONAUT') && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Number of People</label>
              <input
                type="number"
                name="peopleCount"
                value={formData.peopleCount}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter number of people"
                min="1"
              />
            </div>
          )}

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