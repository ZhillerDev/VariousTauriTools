import {createBrowserRouter} from "react-router";
import * as React from "react";
import ErrorPage from "./ErrorPage.tsx";
import {Body} from "../layouts/Body.tsx";
import HomeView from "../views/HomeView.tsx";
import NoticeView from "../views/NoticeView.tsx";
import FileView from "../views/FileView.tsx";
import CmdView from "../views/CmdView.tsx";
import SystemInfoView from "../views/SystemInfoView.tsx";
import CrudView from "../views/CrudView.tsx";
import RequestView from "../views/RequestView.tsx";
import SplashPage from "./SplashPage.tsx";
import ToolsView from "../views/ToolsView.tsx";
// 使用React Router的createBrowserRouter函数创建一个路由配置
export const router = createBrowserRouter([
  {
    // 根路径路由配置
    path: '/',
    // 使用根布局组件（RootLayout需要提前导入）
    Component: Body,
    // 错误处理组件（使用React.createElement动态创建ErrorPage组件）
    errorElement: React.createElement(ErrorPage),
    // 嵌套子路由配置
    children: [
      {
        path: '/splash',
        Component: SplashPage,
      },
      {
        // 认证相关路由路径
        path: '/home',
        // 使用认证布局组件（AuthLayout需要提前导入）
        Component: HomeView,
      },
      {
        // 认证相关路由路径
        path: '/notice',
        // 使用认证布局组件（AuthLayout需要提前导入）
        Component: NoticeView,
      },
      {
        // 认证相关路由路径
        path: '/file',
        // 使用认证布局组件（AuthLayout需要提前导入）
        Component: FileView,
      },
      {
        // 认证相关路由路径
        path: '/cmd',
        // 使用认证布局组件（AuthLayout需要提前导入）
        Component: CmdView,
      },
      {
        path: '/system-info',
        Component: SystemInfoView,
      },
      {
        path: '/crud',
        Component: CrudView,
      },
      {
        path: '/request',
        Component: RequestView
      },
      {
        path: '/tools',
        Component: ToolsView,
      }
    ],
  },
]);