import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import ScenarioNameModal from '../components/addscenario';

const MainPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [scenarios, setScenarios] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const handleCalculate = () => {
    console.log('Calculating with data:', formData);
    // Здесь будет вызов API
  };

  // Сохранение сценария в localStorage
  const handleScenarioSave = (name) => {
    const scenario = {
      id: Date.now(),
      name: name,
      role: role,
      parameters: formData,
      createdAt: new Date().toISOString()
    };
    
    const existingScenarios = JSON.parse(localStorage.getItem('scenarios') || '[]');
    const updatedScenarios = [...existingScenarios, scenario];
    
    localStorage.setItem('scenarios', JSON.stringify(updatedScenarios));
    
    setScenarios(updatedScenarios);
    setCurrentScenario(scenario);
    setIsScenarioModalOpen(false);
  };

  const handleCreateNewScenario = () => {
    // Очищаем все поля
    setFormData({
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
    setCurrentScenario(null);
    setIsScenarioModalOpen(true);
    setIsDropdownOpen(false);
  };


  // Загрузка сценария (заполнение полей)
  const loadScenario = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setFormData(scenario.parameters);
      setCurrentScenario(scenario);
      setIsDropdownOpen(false);
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
      width: '80%',
      maxWidth: '414px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      color: '#888',
      fontSize: '18px',
      height: '22px',
      cursor: 'pointer',
      position: 'relative',
      zIndex: 200,
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: '16px',
      marginTop: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      display: isDropdownOpen ? 'block' : 'none',
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

  if (!selectedRole) {
    return null;
  }

  // Фильтруем сценарии по текущей роли
  const roleScenarios = scenarios.filter(s => s.role === role);

  return (
    <div style={styles.container}>
      <div 
        style={styles.scenarioSelector}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>{currentScenario ? currentScenario.name : 'Scenarios'}</span>
        <ChevronDown 
          size={20} 
          style={{
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.3s ease'
          }}
        />
        
        <div style={styles.dropdown}>
          {roleScenarios.length > 0 ? (
            <>
              {roleScenarios.map((scenario) => (
                <div 
                  key={scenario.id} 
                  style={styles.dropdownItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    loadScenario(scenario.id);
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {scenario.name}
                </div>
              ))}
              <div 
                style={styles.createScenario}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateNewScenario(); // Вместо setIsScenarioModalOpen(true)
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                + Создать сценарий
              </div>
            </>
          ) : (
            <div 
              style={styles.createScenario}
              onClick={(e) => {
                e.stopPropagation();
                setIsScenarioModalOpen(true);
                setIsDropdownOpen(false);
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              + Создать сценарий
            </div>
          )}
        </div>
      </div>

      <h1 style={styles.title}>{currentScenario ? currentScenario.name : 'Scenario for Texas'}</h1>

      <div style={styles.centerText}>Add your first scenario</div>

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