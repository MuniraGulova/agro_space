import React from 'react';

const Card = ({ width, height, top, left, backgroundColor, boxShadow, borderRadius = '20px' }) => {
  const cardStyle = {
    width: width,
    height: height,
    position: 'absolute',
    top: top,
    left: left,
    backgroundColor: backgroundColor,
    borderRadius: borderRadius,
    boxShadow: boxShadow,
    overflow: 'hidden'
  };

  return <div style={cardStyle}></div>;
};

export default Card;
