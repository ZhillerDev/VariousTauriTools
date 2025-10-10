import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/index.css'
import {ThemeProvider} from "./styles/ThemeProvider.tsx";
import {Header} from "./layouts/Header.tsx";
import {Layout} from 'antd';
import {RouterProvider} from "react-router/dom";
import {router} from "./route";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <Layout className="h-screen w-screen flex transition-colors duration-200">
          <Header/>
          <div className="flex-1">
            <RouterProvider router={router}/>
          </div>
        </Layout>
      </ThemeProvider>
    </StrictMode>
)