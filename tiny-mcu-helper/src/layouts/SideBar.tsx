import {useEffect, useState} from 'react';

import {Button, Menu, MenuValue} from 'tdesign-react';
import {CpuIcon, LockOnIcon, SettingIcon, ViewListIcon} from "tdesign-icons-react";
import {useLocation, useNavigate} from "react-router";
import {TElement} from "tdesign-react/es/common";
import {useSettingStore} from "@stores/settingStore.ts";

const {MenuItem} = Menu;

// 定义菜单项接口
interface MenuItemConfig {
  value: string;
  label: string;
  icon: TElement;
  path: string;
}

// 菜单项配置数组
const MENU_ITEMS: MenuItemConfig[] = [
  {
    value: 'item1',
    label: '外设',
    icon: <CpuIcon fillColor='transparent' strokeColor='currentColor' strokeWidth={2}/>,
    path: '/peripheral'
  },
  {
    value: 'item2',
    label: '加密',
    icon: <LockOnIcon fillColor='transparent' strokeColor='currentColor' strokeWidth={2}/>,
    path: '/crypto'
  },
  {
    value: 'item3',
    label: '设置',
    icon: <SettingIcon fillColor='transparent' strokeColor='currentColor' strokeWidth={2}/>,
    path: '/setting'
  }
];

function SideBar() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const {config, updatePartialConfig} = useSettingStore()

  // 1. 根据当前路由初始化选中项
  const [value, setValue] = useState<MenuValue>(() => {
    const currentPath = location.pathname;
    const item = MENU_ITEMS.find(item => item.path === currentPath);
    return item ? item.value : 'item1';
  });

  // 2. 监听路由变化，处理无效路径跳转
  useEffect(() => {
    const currentPath = location.pathname;
    const item = MENU_ITEMS.find(item => item.path === currentPath);

    // 如果当前路径不在菜单配置中，跳转到 /home
    if (!item) {
      navigate('/peripheral');
    } else {
      setValue(item.value);
    }
  }, [location.pathname, navigate]);

  // 3. 处理菜单点击事件
  const handleMenuChange = (value: MenuValue) => {
    const item = MENU_ITEMS.find(item => item.value === value);
    if (item) {
      navigate(item.path);
    }
  };

  return (
      <>
        <Menu
            width={config.expandSideBar ? 80 : 120}
            value={value}
            onChange={handleMenuChange}
            collapsed={config.expandSideBar}
            operations={
              <Button
                  variant="text"
                  shape="square"
                  icon={<ViewListIcon/>}
                  onClick={() => updatePartialConfig({expandSideBar: !config.expandSideBar})}
              />
            }
        >
          {MENU_ITEMS.map(item => (
              <MenuItem
                  key={item.value}
                  value={item.value}
                  icon={item.icon}
              >
                {item.label}
              </MenuItem>
          ))}
        </Menu>
      </>
  );
}

export default SideBar;