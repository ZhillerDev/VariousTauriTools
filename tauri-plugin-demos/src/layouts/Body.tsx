import {useState} from 'react';
import {Outlet} from 'react-router';
import {HeaderBar} from './HeaderBar'; // 假设已存在
import SideBar from './SideBar';
import Aside from "tdesign-react/es/layout/Aside";
import {Layout} from "tdesign-react"; // 假设已存在

export const Body = () => {
  // 控制侧边栏宽度的状态，默认140px
  const [sidebarWidth, setSidebarWidth] = useState(140);
  // 切换侧边栏宽度（80px <-> 140px）
  const toggleSidebar = () => {
    setSidebarWidth(prev => prev === 80 ? 140 : 80);
  };

  return (
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {/* 顶部HeaderBar - 固定高度80px */}
        <header className="h-16 w-full shadow-sm">
          <HeaderBar/>
        </header>

        {/* 主内容区 - 占据剩余高度 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧Sidebar - 可伸缩宽度 */}
          <Aside
              className="contents"
          >
            {/* 将伸缩函数传递给SideBar组件，以便在菜单中触发 */}
            <SideBar/>
          </Aside>

          {/* 主内容区域 - 占据剩余空间 */}
          <Layout className="flex-1 overflow-auto">
            <Outlet/>
          </Layout>
        </div>
      </div>
  );
};
