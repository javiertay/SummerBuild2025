import designRef from '../../designRef.json';

export const getThemeColors = (isDark = false) => {
  const theme = isDark ? designRef.colors.dark : designRef.colors.light;
  
  // Return a flattened structure compatible with existing components
  return {
    // Background colors
    background: theme.background.primary,
    card: theme.background.card,
    popover: theme.background.overlay,
    muted: theme.background.secondary,
    accent: theme.background.tertiary,
    
    // Text colors
    foreground: theme.text.primary,
    cardForeground: theme.text.primary,
    popoverForeground: theme.text.primary,
    mutedForeground: theme.text.muted,
    accentForeground: theme.text.secondary,
    
    // Border colors
    border: theme.border.primary,
    input: theme.border.primary,
    ring: designRef.colors.primary[500],
    
    // Primary colors
    primary: designRef.colors.primary[500],
    primaryForeground: "#ffffff",
    
    // Secondary colors
    secondary: designRef.colors.secondary[200],
    secondaryForeground: designRef.colors.secondary[700],
    
    // Destructive colors
    destructive: designRef.colors.accent.red,
    destructiveForeground: "#ffffff",
    
    // Additional colors for compatibility
    sidebar: theme.background.secondary,
    sidebarForeground: theme.text.primary,
    sidebarPrimary: designRef.colors.primary[500],
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent: theme.background.tertiary,
    sidebarAccentForeground: theme.text.primary,
    sidebarBorder: theme.border.primary,
    sidebarRing: designRef.colors.primary[500],
    
    // Chart colors
    chart: {
      1: designRef.colors.primary[500],
      2: designRef.colors.primary[400],
      3: designRef.colors.primary[600],
      4: designRef.colors.primary[300],
      5: designRef.colors.primary[700]
    }
  };
};

export const getThemeShadows = () => {
  return designRef.shadows;
};

export const getThemeRadius = () => {
  return designRef.borderRadius;
};

export const getThemeFonts = () => {
  return designRef.typography.fontFamilies;
};

export const getThemeTypography = () => {
  return designRef.typography;
};

export const getThemeSpacing = () => {
  return designRef.spacing;
};

export const getThemeComponents = () => {
  return designRef.components;
};

export const getThemeEffects = () => {
  return designRef.effects;
};

export const getThemeLayout = () => {
  return designRef.layout;
}; 