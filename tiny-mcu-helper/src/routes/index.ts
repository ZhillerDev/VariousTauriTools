import {createBrowserRouter} from "react-router";
import * as React from "react";
import ErrorPage from "./ErrorPage.tsx";
import {Body} from "../layouts/Body.tsx";
import PeripheralView from "../views/PeripheralView.tsx";
import CryptoView from "../views/CryptoView.tsx";
import SettingView from "../views/SettingView.tsx";

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
        // 认证相关路由路径
        path: '/peripheral',
        // 使用认证布局组件（AuthLayout需要提前导入）
        Component: PeripheralView,
      },
      {
        // 默认路由配置
        path: '/crypto',
        // 使用默认布局组件（DefaultLayout需要提前导入）
        Component: CryptoView,
      },
      {
        // 默认路由配置
        path: '/setting',
        // 使用默认布局组件（DefaultLayout需要提前导入）
        Component: SettingView,
      },
    ],
  },
]);