import { Switch, Layout } from 'antd';
import { useTheme } from "../styles/ThemeProvider.tsx";

const { Header: AntHeader } = Layout;

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const textColor = isDark ? '#ffffff' : '#000000'; // 设置文本颜色变量

  return (
      <AntHeader className="flex items-center justify-between px-6 !bg-transparent">
        <h1 className="text-xl font-bold" style={{ color: textColor }}>
          Tauri Demos
        </h1>
        <div className="flex items-center gap-2">
          <Switch
              checked={isDark}
              onChange={toggleTheme}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
          />
        </div>
      </AntHeader>
  );
};