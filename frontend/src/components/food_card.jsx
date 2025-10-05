import React from 'react';

const ResultCard = ({ 
  title, 
  line1Label, 
  line1Value,
  line2Label, 
  line2Value,
  line3Label, 
  line3Value,
  width = '90%',
  backgroundColor = 'white',
  borderRadius = '20px',
  boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
}) => {
  const cardStyle = {
    width: width,
    maxWidth: '400px',
    margin: '0 auto',
    backgroundColor: backgroundColor,
    borderRadius: borderRadius,
    boxShadow: boxShadow,
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  };

  const lineStyle = {
    fontSize: '18px',
    color: '#999',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const valueStyle = {
    fontWeight: '500',
    color: '#666'
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      
      <div style={lineStyle}>
        <span>{line1Label}</span>
        <span style={valueStyle}>{line1Value}</span>
      </div>
      
      <div style={lineStyle}>
        <span>{line2Label}</span>
        <span style={valueStyle}>{line2Value}</span>
      </div>
      
      <div style={lineStyle}>
        <span>{line3Label}</span>
        <span style={valueStyle}>{line3Value}</span>
      </div>
    </div>
  );
};

export default ResultCard;