import React from 'react';
import {Space, Tabs} from "tdesign-react";
import TabPanel from "tdesign-react/es/tabs/TabPanel";
import XorSumPage from "@views/crypto/XorSumPage.tsx";
import Crc32Page from "@views/crypto/Crc32Page.tsx";
import Base64Page from "@views/crypto/Base64Page.tsx";

function CryptoView() {
  return (
      <div className='w-full h-full p-4'>
        <Space direction="vertical" style={{width: '100%', height: '100%', borderRadius: '8px'}}>
          <Tabs placement={'top'} size={'medium'} defaultValue={1}
                style={{transition: 'all 0.3s ease-in-out'}}>
            <TabPanel value={1} label="XOR" className='h-full'>
              <div className="h-full w-full p-1 overflow-auto">
                <XorSumPage/>
              </div>
            </TabPanel>
            <TabPanel value={2} label="CRC32">
              <div className="h-full w-full p-1 overflow-auto">
                <Crc32Page/>
              </div>
            </TabPanel>
            <TabPanel value={3} label="Base64">
              <div className="h-full w-full p-1 overflow-auto">
                <Base64Page/>
              </div>
            </TabPanel>
          </Tabs>
        </Space>
      </div>
  );
}

export default CryptoView;
