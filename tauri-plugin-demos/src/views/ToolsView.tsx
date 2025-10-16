import React from 'react';
import {Space, Tabs} from 'tdesign-react';
import XorSumPage from "./tools/XorSumPage.tsx";
import Base64Page from "./tools/Base64Page.tsx";
import Crc32Page from "./tools/Crc32Page.tsx";
import ClockCalcPage from "./tools/ClockCalcPage.tsx";

const {TabPanel} = Tabs;


function ToolsView() {

  return (
      <div className='w-full h-full p-4'>
        <Space direction="vertical" style={{width: '100%', borderRadius: '8px'}}>
          <Tabs placement={'top'} size={'medium'} defaultValue={1} style={{transition: 'all 0.3s ease-in-out'}}>
            <TabPanel value={1} label="异或和校验" className='h-full'>
              <div className="h-full w-full p-1">
                <XorSumPage/>
              </div>
            </TabPanel>
            <TabPanel value={2} label="Base64转换器">
              <div className="h-full w-full p-1">
                <Base64Page/>
              </div>
            </TabPanel>
            <TabPanel value={3} label="CRC32校验">
              <div className="h-full w-full p-1">
                <Crc32Page/>
              </div>
            </TabPanel>
            <TabPanel value={4} label="时钟计算器">
              <div className="h-full w-full p-1">
                <ClockCalcPage/>
              </div>
            </TabPanel>
          </Tabs>
        </Space>
      </div>
  );
}

export default ToolsView;
