
import React from 'react';

export const withStyle = (element: React.ReactElement, style: React.CSSProperties): React.ReactElement => {
  return React.cloneElement(element, { style: { ...element.props.style, ...style } });
};

// Add this utility to help fix the HeroSection.tsx error
export const addStyleToElement = (element: Element, styles: React.CSSProperties): void => {
  if (element instanceof HTMLElement) {
    Object.assign(element.style, styles);
  }
};
