import React from 'react';
import {Tabs} from "tdesign-react";
import TabPanel from "tdesign-react/es/tabs/TabPanel";
import XorSumPage from "@views/crypto/XorSumPage.tsx";
import Crc32Page from "@views/crypto/Crc32Page.tsx";
import Base64Page from "@views/crypto/Base64Page.tsx";

function CryptoView() {
  return (
      <div className='w-full h-full p-4 flex flex-col'>
        {/* 将Tabs组件固定在顶部 */}
        <Tabs
          placement={'top'}
          size={'medium'}
          defaultValue={1}
          style={{
            transition: 'all 0.3s ease-in-out',
            // 确保tabs标题栏固定在顶部
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'inherit'
          }}
        >
          {/* 修改TabPanel结构，让内容区域可滚动 */}
          <TabPanel value={1} label="XOR">
            <div className="h-[calc(100vh-80px)] w-full p-1 overflow-auto">
              <XorSumPage/>
            </div>
          </TabPanel>
          <TabPanel value={2} label="CRC32">
            <div className="h-[calc(100vh-80px)] w-full p-1 overflow-auto">
              <Crc32Page/>
            </div>
          </TabPanel>
          <TabPanel value={3} label="Base64">
            <div className="h-[calc(100vh-80px)] w-full p-1 overflow-auto">
              <Base64Page/>
            </div>
          </TabPanel>
        </Tabs>
      </div>
  );
}

export default CryptoView;
