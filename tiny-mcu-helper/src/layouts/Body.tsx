import {Outlet, useLocation, useNavigate} from 'react-router';
import {HeaderBar} from './HeaderBar'; // 假设已存在
import SideBar from './SideBar';
import Aside from "tdesign-react/es/layout/Aside";
import {Layout} from "tdesign-react";
import {useEffect} from "react";
import {useSettingStore} from "@stores/settingStore.ts"; // 假设已存在

export const Body = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { config } = useSettingStore();


  // 监测路径是否为"/"，如果是则自动跳转到"/home"
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/peripheral", {replace: true});
    }

    // 初始化主题与settingStore
    const init = async () => {
      await useSettingStore.getState().initConfig();
    };
    init().then(r => r);
  }, [location.pathname, navigate]);

  // 检查当前路径是否为/splash
  const isSplashRoute = location.pathname === "/splash";

  // 如果是/splash路由，全屏渲染Outlet
  if (isSplashRoute) {
    return (
        <div className="h-screen w-screen">
          <Outlet/>
        </div>
    );
  }

  // 其他路由渲染正常框架
  return (
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {/* 顶部 HeaderBar - 仅在不隐藏时渲染 */}
        {!config.hideHeaderBar && (
            <header className="h-16 w-full shadow-sm z-10"> {/* z-10 确保在内容上方 */}
              <HeaderBar />
            </header>
        )}

        {/* 主内容区 - 占据剩余高度 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧Sidebar - 可伸缩宽度 */}
          <Aside className="contents">
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
