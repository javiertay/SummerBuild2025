import designRef from '../../designRef.json';

export const getThemeColors = (isDark = false) => {
  const theme = isDark ? designRef.theme.dark : designRef.theme.light;
  return theme.colors;
};

export const getThemeShadows = (isDark = false) => {
  const theme = isDark ? designRef.theme.dark : designRef.theme.light;
  return theme.shadows;
};

export const getThemeRadius = () => {
  return designRef.theme.light.radius;
};

export const getThemeFonts = () => {
  return designRef.theme.light.fonts;
}; 