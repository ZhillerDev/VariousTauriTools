// components/Body.jsx
import {useState} from 'react';
import {Layout, Menu, theme} from 'antd';
import {Outlet} from "react-router";
import {useTheme} from "../styles/ThemeProvider.tsx";
import {menuList} from "./MenuList.tsx";

const {Sider, Content} = Layout;

export const Body = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {token} = theme.useToken();
  const {isDark} = useTheme()

  return (
      <Layout className="h-full">
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={200}
            theme={isDark ? 'dark' : 'light'}
        >
          <Menu
              mode="inline"
              defaultSelectedKeys={['home']}
              items={menuList}
              style={{
                backgroundColor: 'transparent', // 透明背景
                borderRight: 0, // 移除右侧边框
              }}
          />
        </Sider>
        <Layout className="flex-1">
          <Content
              className="transition-colors duration-200 rounded-xl"
              style={{
                background: token.colorBgContainer, // 使用相同的主题背景色
              }}
          >
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
  );
};