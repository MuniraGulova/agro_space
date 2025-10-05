import React from 'react';

const ResultCard = ({
  titleRu,
  productivity,
  value,
  isAstronaut
}) => {
  return (
    <div style={{
      width: '85%',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '40px 24px', 
      marginBottom: '24px',
      minHeight: '200px'
    }}>
    <h3 style={{
      fontSize: '32px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '50px',
      // margin: 0,  ← УДАЛИТЕ ЭТУ СТРОКУ
      textAlign: 'left'
    }}>
      {titleRu}
    </h3>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-start'
      }}>
        <div style={{
          fontSize: '18px', // Увеличили размер шрифта
          color: '#999',
          textAlign: 'left',
          width: '100%',
          lineHeight: '1.6' // Добавили межстрочный интервал
        }}>
          Productivity: <span style={{ fontWeight: '500', color: '#666' }}>
            {isAstronaut 
              ? `${productivity.toFixed(2)} kg/m²`
              : `${productivity.toFixed(2)} t/ha`
            }
          </span>
        </div>
        
        {isAstronaut ? (
          <div style={{
            fontSize: '18px',
            color: '#999',
            textAlign: 'left',
            width: '100%',
            lineHeight: '1.6'
          }}>
            Food supply: <span style={{ fontWeight: '500', color: '#666' }}>
              {value.toFixed(0)} days
            </span>
          </div>
        ) : (
          <>
            <div style={{
              fontSize: '18px',
              color: '#999',
              textAlign: 'left',
              width: '100%',
              lineHeight: '1.6'
            }}>
              Estimated revenue: <span style={{ fontWeight: '500', color: '#666' }}>
                ${value.toFixed(0)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultCard;