import {Layout, Switch} from 'tdesign-react';
import HeadMenu from 'tdesign-react/es/menu/HeadMenu';
import {useSettingStore} from "@stores/settingStore.ts";


const {Header} = Layout;

export const HeaderBar = () => {
  const {config, updatePartialConfig} = useSettingStore();

  // 切换主题：调用 settingStore 的 updatePartialConfig 方法切换主题
  const toggleTheme = async () => {
    await updatePartialConfig({darkTheme: !config.darkTheme});
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
                    value={config.darkTheme}
                    onChange={toggleTheme}
                    label={["🌙", "☀️"]}
                />
              </div>
            }
        >
        </HeadMenu>
      </Header>
  );
};