import React from 'react';
import {Card, Space, Switch} from "tdesign-react";
import {useSettingStore} from "@stores/settingStore.ts";

function SettingView() {
  const {config, updatePartialConfig} = useSettingStore();

  // 处理主题切换
  const handleDarkThemeChange = (checked: boolean) => {
    updatePartialConfig({darkTheme: checked}).then(r => r);
  };

  // 处理标题栏显示切换
  const handleHideHeaderChange = (checked: boolean) => {
    updatePartialConfig({hideHeaderBar: checked}).then(r => r);
  };

  return (
      <div className='w-full h-full p-4'>
        <Card
            title="基础设置"
            bordered={false}
            headerBordered
            style={{width: '100%'}}
        >
          {/* 使用 Row 和 Col 进行布局 */}
          <Space style={{width: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
            {/* 深色主题开关 */}
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <span>深色主题</span>
              <Switch
                  style={{padding: '4px'}}
                  value={config.darkTheme}
                  onChange={handleDarkThemeChange}
                  label={["🌙", "☀️"]}
              />
            </div>
            {/* 隐藏标题栏开关 */}
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <span>隐藏标题栏</span>
              <Switch
                  style={{padding: '4px'}}
                  value={config.hideHeaderBar}
                  onChange={handleHideHeaderChange}
                  label={["隐藏", "显示"]}
              />
            </div>
          </Space>
        </Card>
      </div>
  );
}

export default SettingView;
