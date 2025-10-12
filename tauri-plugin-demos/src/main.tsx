import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/index.css'
import {RouterProvider} from "react-router/dom";
import {router} from "./route";
import 'tdesign-react/es/style/index.css'; // 少量公共样式

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>
)