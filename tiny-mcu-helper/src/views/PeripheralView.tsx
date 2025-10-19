import React from 'react';
import {Tabs} from "tdesign-react";
import TabPanel from "tdesign-react/es/tabs/TabPanel";
import ClockCalcPage from "@views/peripheral/ClockCalcPage.tsx";
import PwmCalcPage from "@views/peripheral/PwmCalcPage.tsx";

function PeripheralView() {
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
          <TabPanel value={1} label="时钟">
            <div className="h-[calc(100vh-80px)] w-full p-1 overflow-auto">
              <ClockCalcPage/>
            </div>
          </TabPanel>
          <TabPanel value={2} label="PWM">
            <div className="h-[calc(100vh-80px)] w-full p-1 overflow-auto">
              <PwmCalcPage/>
            </div>
          </TabPanel>
        </Tabs>
      </div>
  );
}

export default PeripheralView;
