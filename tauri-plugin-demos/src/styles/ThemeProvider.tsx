// src/context/theme-context.tsx
import * as React from 'react';
import {createContext, useContext, useState} from 'react';
import {ConfigProvider, theme} from 'antd';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {
  },
});

export function ThemeProvider({children}: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    // 从 localStorage 读取持久化状态
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });
  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
      <ThemeContext.Provider value={{isDark, toggleTheme}}>
        <ConfigProvider theme={{
          algorithm: (isDark ? theme.darkAlgorithm : theme.defaultAlgorithm),
          components: {
            Layout: {
              triggerBg: 'transparent',
              lightTriggerBg: 'transparent',
              lightSiderBg: 'transparent',
              siderBg: 'transparent',
            }
          }
        }}>
          {children}
        </ConfigProvider>
      </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);