import {useEffect, useState} from 'react';

import {Button, Menu, MenuValue} from 'tdesign-react';
import {
  ChatMessageIcon,
  CommandIcon,
  DataBaseIcon,
  FileCode1Icon,
  HomeIcon,
  LogoChromeIcon,
  System3Icon,
  ViewListIcon
} from "tdesign-icons-react";
import {useLocation, useNavigate} from "react-router";
import {TElement} from "tdesign-react/es/common";

const {MenuGroup, MenuItem, SubMenu} = Menu;

// 定义菜单项接口
interface MenuItemConfig {
  value: string;
  label: string;
  icon: TElement;
  path: string;
}

// 菜单项配置数组
const MENU_ITEMS: MenuItemConfig[] = [
  {value: 'item1', label: '主页', icon: <HomeIcon/>, path: '/home'},
  {value: 'item2', label: '系统参数', icon: <System3Icon/>, path: '/system-info'},
  {
    value: 'item3',
    label: '通知与对话框',
    icon: <ChatMessageIcon fillColor='transparent' strokeColor='currentColor' strokeWidth={2}/>,
    path: '/notice'
  },
  {
    value: 'item4',
    label: '文件操作',
    icon: <FileCode1Icon fillColor='transparent' strokeColor='currentColor' strokeWidth={2}/>,
    path: '/file'
  },
  {
    value: 'item5',
    label: '命令行',
    icon: <CommandIcon fillColor='transparent' strokeColor='currentColor' strokeWidth={2}/>,
    path: '/cmd'
  },
  {
    value: 'item6',
    label: 'CRUD',
    icon: <DataBaseIcon fillColor='transparent' strokeColor='currentColor' strokeWidth={2}/>,
    path: '/crud'
  },
  {
    value: 'item7',
    label: 'Request',
    icon: <LogoChromeIcon fillColor='transparent' strokeColor='currentColor' strokeWidth={2}/>,
    path: '/request'
  }
];

function SideBar() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
      navigate('/home');
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
            width={collapsed ? 80 : 200}
            value={value}
            onChange={handleMenuChange}
            collapsed={collapsed}
            operations={
              <Button
                  variant="text"
                  shape="square"
                  icon={<ViewListIcon/>}
                  onClick={() => setCollapsed(!collapsed)}
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