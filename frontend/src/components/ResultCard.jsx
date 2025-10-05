import React from 'react';

const ResultCard = ({ title, titleRu, productivity, value, isAstronaut, image }) => {
  return (
    <div style={{
      width: '85%',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '30px 20px 40px 20px', 
      marginBottom: '24px',
      minHeight: '200px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {image && (
        <img 
          src={image} 
          alt={title} 
          style={{
            position: 'absolute',
            bottom: '0px',     
            right: '0px',
            width: '200px',     
            height: '170px',
            objectFit: 'cover',
            borderRadius: '12px',
            zIndex: 1
          }}
        />
      )}
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '32px',       
          margin: '0 0 32px 0',
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
            fontSize: '14px',
            color: '#999',
            textAlign: 'left',
            width: '100%',
            lineHeight: '1.4'
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
              fontSize: '14px',
              color: '#999',
              textAlign: 'left',
              width: '100%',
              lineHeight: '1.4'
            }}>
              Food supply: <span style={{ fontWeight: '500', color: '#666' }}>
                {value.toFixed(0)} days
              </span>
            </div>
          ) : (
            <div style={{
              fontSize: '14px',
              color: '#999',
              textAlign: 'left',
              width: '100%',
              lineHeight: '1.4'
            }}>
              Estimated revenue: <span style={{ fontWeight: '500', color: '#666' }}>
                ${value.toFixed(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;