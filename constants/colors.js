// constants/colors.js
const colors = {
    // Core Colors
    primary: '#f35369',      // Brand color (reddish-pink)
    primaryLight: '#ff8597',
    primaryDark: '#bc003e',

  secondary: "#F58F00",
    secondaryLight: '#a9adff',
    secondaryDark: '#3a53b2',
    
    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    gray: '#D3D3D3',
    lightGray: '#F5F5F5',
    darkGray: '#6C757D',
    mediumGray: '#A0A0A0',
    
    // Status Colors
    success: '#28A745',
    successLight: '#d4edda',
    successDark: '#1e7e34',
    warning: '#FFC107',
    warningLight: '#fff3cd',
    warningDark: '#d39e00',
    error: '#DC3545',
    errorLight: '#f8d7da',
    errorDark: '#bd2130',
    info: '#17A2B8',
    infoLight: '#d1ecf1',
    infoDark: '#117a8b',
    
    // Background Colors
    background: '#FFFFFF',
    backgroundDark: '#F0F0F0',
    surface: '#FFFFFF',
    
    // Text Colors
    textPrimary: '#212529',
    textSecondary: '#495057',
    textDisabled: '#6C757D',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    
    // Border Colors
    borderLight: '#E0E0E0',
    borderMedium: '#C0C0C0',
    borderDark: '#808080',
    
    // Additional Colors
    highlight: '#FFF9C4',
    overlay: 'rgba(0,0,0,0.5)',
    shadow: 'rgba(0,0,0,0.15)',
    
    // Social Colors
    facebook: '#3b5998',
    google: '#db4437',
    twitter: '#1da1f2',
    
    // Gradients
    get primaryGradient() {
      return [this.primary, this.primaryDark];
    },
    get secondaryGradient() {
      return [this.secondary, this.secondaryDark];
    },
    get successGradient() {
      return [this.success, this.successDark];
    }
  };
  
  // Utility functions
  colors.getTextColorForBackground = function(backgroundColor) {
    const color = backgroundColor.charAt(0) === '#' 
      ? backgroundColor.substring(1, 7) 
      : backgroundColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return ((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186 
      ? this.textPrimary 
      : this.textOnPrimary;
  };
  
  colors.withOpacity = function(color, opacity) {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };
  
  export default colors;