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
    peopleCount: '10',
    maizePrice: '',
    potatoPrice: '',
    wheatPrice: '',
    barleyPrice: '',
    beanPrice: '',
    peaPrice: ''
  });
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [calcResult, setCalcResult] = useState(null);

  // Загрузка сценариев из localStorage при старте
  useEffect(() => {
    const savedScenarios = JSON.parse(localStorage.getItem('scenarios') || '[]');
    setScenarios(savedScenarios);
  }, []);

  // Загрузка сценария
  const loadScenario = (scenario) => {
    setFormData({
      n: scenario.parameters.n || '',
      p: scenario.parameters.p || '',
      k: scenario.parameters.k || '',
      ph: scenario.parameters.ph || '',
      temperature: scenario.parameters.temperature || '',
      humidity: scenario.parameters.humidity || '',
      rainfall: scenario.parameters.rainfall || '',
      zn: scenario.parameters.zn || '',
      s: scenario.parameters.s || '',
      peopleCount: scenario.parameters.peopleCount || '10',
      maizePrice: scenario.parameters.maizePrice || '',
      potatoPrice: scenario.parameters.potatoPrice || '',
      wheatPrice: scenario.parameters.wheatPrice || '',
      barleyPrice: scenario.parameters.barleyPrice || '',
      beanPrice: scenario.parameters.beanPrice || '',
      peaPrice: scenario.parameters.peaPrice || ''
    });
    setSelectedScenario(scenario);
    localStorage.setItem('selectedScenarioId', scenario.id); // ДОБАВЬТЕ
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (scenarios.length > 0) {
      const savedScenarioId = localStorage.getItem('selectedScenarioId');
      if (savedScenarioId) {
        const scenario = scenarios.find(s => s.id === Number(savedScenarioId));
        if (scenario && scenario.role === role) {
          loadScenario(scenario);
        }
      }
    }
  }, [scenarios, role]);

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
    // Проверяем все обязательные поля
    const requiredFields = [
      { name: 'n', label: 'Nitrogen' },
      { name: 'p', label: 'Phosphorus' },
      { name: 'k', label: 'Kalium' },
      { name: 'ph', label: 'pH Level' },
      { name: 'temperature', label: 'Temperature' },
      { name: 'humidity', label: 'Humidity' },
      { name: 'rainfall', label: 'Rainfall' },
      { name: 'zn', label: 'Zinc' },
      { name: 's', label: 'Sulfur' }
    ];

    // Находим пустые поля
    const emptyFields = requiredFields.filter(field => 
      formData[field.name] === '' || formData[field.name] === null || formData[field.name] === undefined
    );

    // Если есть пустые поля, показываем ошибку
    if (emptyFields.length > 0) {
      setCalcResult({
        error: `Пожалуйста, заполните все поля: ${emptyFields.map(f => f.label).join(', ')}`
      });
      return;
    }

    if (role === 'farmer' || role === 'FARMER') {
      const priceFields = [
        { name: 'maizePrice', label: 'Maize Price' },
        { name: 'potatoPrice', label: 'Potato Price' },
        { name: 'wheatPrice', label: 'Wheat Price' },
        { name: 'barleyPrice', label: 'Barley Price' },
        { name: 'beanPrice', label: 'Bean Price' },
        { name: 'peaPrice', label: 'Pea Price' }
      ];

      const emptyPrices = priceFields.filter(field => 
        formData[field.name] === '' || formData[field.name] === null || formData[field.name] === undefined
      );

      if (emptyPrices.length > 0) {
        setCalcResult({
          error: `Пожалуйста, заполните цены: ${emptyPrices.map(f => f.label).join(', ')}`
        });
        return;
      }
    }

    // Автоматически сохраняем сценарий перед расчетом
    const timestamp = new Date().toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const scenarioName = selectedScenario ? selectedScenario.name : `${role} Scenario ${timestamp}`;
    
    let scenario;
    if (selectedScenario) {
      // Обновляем существующий сценарий
      scenario = {
        ...selectedScenario,
        parameters: { ...formData }
      };
    } else {
      // Создаем новый сценарий
      scenario = {
        id: Date.now(),
        name: scenarioName,
        role: role,
        parameters: { ...formData },
        createdAt: new Date().toISOString(),
        description: 'Auto-saved scenario'
      };
    }

    // Сохраняем сценарий в localStorage
    const existingScenarios = JSON.parse(localStorage.getItem('scenarios') || '[]');
    let updatedScenarios;
    
    if (selectedScenario) {
      updatedScenarios = existingScenarios.map(s => 
        s.id === selectedScenario.id ? scenario : s
      );
    } else {
      updatedScenarios = [...existingScenarios, scenario];
    }
    
    localStorage.setItem('scenarios', JSON.stringify(updatedScenarios));
    localStorage.setItem('selectedScenarioId', scenario.id.toString());
    setScenarios(updatedScenarios);
    setSelectedScenario(scenario);

    // Если все поля заполнены, продолжаем с отправкой данных
    const payload = {
        mode: role === 'astronaut' ? 'STATION' : 'FARM',
        depParam: role === 'astronaut' 
          ? { 
              peopleNumber: Number(formData.peopleCount),
              square: 100
            } 
          : {
              Maize: { price: Number(formData.maizePrice) },
              Potato: { price: Number(formData.potatoPrice) },
              Wheat: { price: Number(formData.wheatPrice) },
              Barley: { price: Number(formData.barleyPrice) },
              Bean: { price: Number(formData.beanPrice) },
              Pea: { price: Number(formData.peaPrice) }
            },
        args: {
          N: Number(formData.n),
          P: Number(formData.p),
          K: Number(formData.k),
          ph: Number(formData.ph),
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          rainfall: Number(formData.rainfall),
          Zn: Number(formData.zn),
          S: Number(formData.s)
        }
      };

    try {
      // Send POST request to server
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse and handle the response
      const data = await response.json();
      console.log('Server response:', data);

      // Update the UI with results
      setCalcResult(data);
      
      // Close the modal after successful calculation
      setIsModalOpen(false);

    } catch (error) {
      console.error('Calculation error:', error);
      setCalcResult({ error: error.message });
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
    localStorage.setItem('selectedScenarioId', scenario.id); // ДОБАВЬТЕ
    setScenarios(updatedScenarios);
    setSelectedScenario(scenario);
    setIsScenarioModalOpen(false);
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
      peopleCount: '10',
      maizePrice: '',
      potatoPrice: '',
      wheatPrice: '',
      barleyPrice: '',
      beanPrice: '',
      peaPrice: ''
    });
    setSelectedScenario(null);
    // УДАЛИТЕ: setIsScenarioModalOpen(true);
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
      overflow: 'auto' 
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
      zIndex: 10,
      backgroundColor: 'transparent', 
      pointerEvents: 'none',
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
      backgroundColor: '#003b46',
      boxShadow: '0 4px 12px rgba(13, 110, 110, 0.25)',
      pointerEvents: 'auto', // ДОБАВЬТЕ ЭТУ СТРОКУ
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
      backgroundColor: '#003b46',
      boxShadow: '0 4px 12px rgba(13, 110, 110, 0.25)',
    },
    inputContainer: {
      padding: '40px 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '34px',
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
      backgroundColor: '#003b46',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(13, 110, 110, 0.25)',
    },
    // Add new styles for error popup
    errorOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    errorPopup: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '300px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
    },
    errorMessage: {
      color: '#E53E3E',
      marginBottom: '20px',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    errorButton: {
      padding: '12px 24px',
      backgroundColor: '#003b46',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      width: '100%'
    }
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
                color: selectedScenario?.id === scenario.id ? '#003b46' : '#2D3748',
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
              color: '#003b46',
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
              backgroundColor: '#003b46',
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
            paddingBottom: '140px', // Увеличили с 120px до 140px
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
              color: '#003b46',
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

      {/* Error display */}
      {calcResult && calcResult.error && (
        <div style={styles.errorOverlay}>
          <div style={styles.errorPopup}>
            <div style={styles.errorMessage}>
              {calcResult.error}
            </div>
            <button 
              style={styles.errorButton}
              onClick={() => setCalcResult(null)}
            >
              OK
            </button>
          </div>
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
            <label style={styles.label}>Kalium (K)</label>
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

        {/* Add price fields for farmer role */}
        {(role === 'farmer' || role === 'FARMER') && (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Maize Price ($ per kg)</label>
              <input
                type="number"
                name="maizePrice"
                value={formData.maizePrice}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter maize price"
                step="0.01"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Potato Price ($ per kg)</label>
              <input
                type="number"
                name="potatoPrice"
                value={formData.potatoPrice}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter potato price"
                step="0.01"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Wheat Price ($ per kg)</label>
              <input
                type="number"
                name="wheatPrice"
                value={formData.wheatPrice}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter wheat price"
                step="0.01"
              />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Barley Price ($ per kg)</label>
                <input
                  type="number"
                  name="barleyPrice"
                  value={formData.barleyPrice}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter barley price"
                  step="0.01"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Bean Price ($ per kg)</label>
                <input
                  type="number"
                  name="beanPrice"
                  value={formData.beanPrice}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter bean price"
                  step="0.01"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pea Price ($ per kg)</label>
                <input
                  type="number"
                  name="peaPrice"
                  value={formData.peaPrice}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter pea price"
                  step="0.01"
                />
              </div>
            </>
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