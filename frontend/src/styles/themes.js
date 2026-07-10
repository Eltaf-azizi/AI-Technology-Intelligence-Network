const themes = {
  dark: {
    name: 'dark',
    colors: {
      bgPrimary: '#0a0e1a',
      bgSecondary: '#131a2e',
      bgTertiary: '#1a2340',
      bgElevated: '#1e2a4a',
      textPrimary: '#e8edf5',
      textSecondary: '#8892b0',
      textTertiary: '#5a6484',
      accentPrimary: '#00d4ff',
      accentSecondary: '#0088cc',
      borderPrimary: '#1e2a4a',
      borderSecondary: '#2a3a5c',
      success: '#00e676',
      warning: '#ffab00',
      error: '#ff5252',
      info: '#448aff',
    },
  },
  light: {
    name: 'light',
    colors: {
      bgPrimary: '#f8f9fc',
      bgSecondary: '#ffffff',
      bgTertiary: '#f0f2f8',
      bgElevated: '#e8ecf4',
      textPrimary: '#1a1d2e',
      textSecondary: '#5a6484',
      textTertiary: '#8892b0',
      accentPrimary: '#0088cc',
      accentSecondary: '#00d4ff',
      borderPrimary: '#e2e6f0',
      borderSecondary: '#cdd3e0',
      success: '#00c853',
      warning: '#ff8f00',
      error: '#d50000',
      info: '#2962ff',
    },
  },
};

export function createTheme(variant = 'dark') {
  return themes[variant] || themes.dark;
}

export default themes;
