import {useEffect, useState} from 'react';
import {Layout, Switch} from 'tdesign-react';
import HeadMenu from 'tdesign-react/es/menu/HeadMenu';

const {Header} = Layout;

export const HeaderBar = () => {
  const [isDark, setIsDark] = useState(false);

  // 初始化读取本地存储的主题偏好
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute(
          'theme-mode',
          'dark'
      );
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light');
    document.documentElement.setAttribute(
        'theme-mode',
        newMode ? 'dark' : 'light'
    );
  };

  return (
      <Header height={'64px'}>
        <HeadMenu
            className='w-full h-20'
            value="item1"
            logo={<div className="font-bold text-xl">Tauri Plugin Demos</div>}
            operations={
              <div className="t-menu__operations">
                <Switch
                    value={isDark}
                    onChange={toggleTheme}
                    label={["🌙", "☀️"]}
                />
              </div>
            }
        >
          {/*<MenuItem value="item1">已选内容</MenuItem>*/}
          {/*<MenuItem value="item2">菜单内容一</MenuItem>*/}
          {/*<MenuItem value="item3">菜单内容二</MenuItem>*/}
          {/*<MenuItem value="item4" disabled>*/}
          {/*  菜单内容三*/}
          {/*</MenuItem>*/}
        </HeadMenu>
      </Header>
  );
};