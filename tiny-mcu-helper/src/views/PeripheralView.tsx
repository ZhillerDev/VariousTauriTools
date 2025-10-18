import React from 'react';
import {Space, Tabs} from "tdesign-react";
import TabPanel from "tdesign-react/es/tabs/TabPanel";
import ClockCalcPage from "@views/peripheral/ClockCalcPage.tsx";

function PeripheralView() {
  return (
      <div className='w-full h-full p-4'>
        <Space direction="vertical" style={{width: '100%', height: '100%', borderRadius: '8px'}}>
          <Tabs placement={'top'} size={'medium'} defaultValue={1}
                style={{transition: 'all 0.3s ease-in-out'}}>
            <TabPanel value={1} label="时钟" className='h-full'>
              <div className="h-full w-full p-1 overflow-auto">
                <ClockCalcPage/>
              </div>
            </TabPanel>
          </Tabs>
        </Space>
      </div>
  );
}

export default PeripheralView;
