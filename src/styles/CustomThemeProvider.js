// ThemeProvider.js
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './them';

const CustomThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default CustomThemeProvider;