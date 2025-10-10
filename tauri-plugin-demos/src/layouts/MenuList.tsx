// src/components/menuConfig.tsx
import {
  DashboardOutlined,
  DatabaseOutlined,
  FileOutlined,
  GoogleOutlined,
  MessageOutlined,
  SettingOutlined,
  WindowsOutlined
} from '@ant-design/icons';
import {Link} from "react-router";

export const menuList = [
  {
    key: 'home',
    label: <Link to="/home">项目首页</Link>,
    icon: <DashboardOutlined/>,
  },
  {
    key: 'notice',
    label: <Link to="/notice">对话框与通知</Link>,
    icon: <MessageOutlined/>,
  },
  {
    key: 'file',
    label: <Link to="/file">文件操作</Link>,
    icon: <FileOutlined/>,
  },
  {
    key: 'systemInfo',
    label: <Link to="/system-info">系统信息</Link>,
    icon: <SettingOutlined/>,
  },
  {
    key: 'cmd',
    label: <Link to="/cmd">命令行</Link>,
    icon: <WindowsOutlined/>,
  },
  {
    key: 'crud',
    label: <Link to="/crud">SQL</Link>,
    icon: <DatabaseOutlined/>,
  },
  {
    key: 'request',
    label: <Link to="/request">HTTP请求</Link>,
    icon: <GoogleOutlined/>,
  },
];