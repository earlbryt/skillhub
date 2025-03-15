
import React from 'react';

export const withStyle = (element: React.ReactElement, style: React.CSSProperties): React.ReactElement => {
  return React.cloneElement(element, { style: { ...element.props.style, ...style } });
};
