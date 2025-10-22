import React from 'react';
import {Tabs} from "tdesign-react";
import TabPanel from "tdesign-react/es/tabs/TabPanel";
import BaseConvertPage from "@views/conversion/BaseConvertPage.tsx";
import StorageConvertPage from "@views/conversion/StorageConvertPage.tsx";
import MarkdownPdfConvertPage from "@views/conversion/MarkdownPdfConvertPage.tsx";

function ConversionView() {
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
          <TabPanel value={1} label="进制">
            <div className="h-[calc(100vh-80px)] w-full p-1 overflow-auto">
              <BaseConvertPage/>
            </div>
          </TabPanel>
          <TabPanel value={2} label="存储单位">
            <div className="h-[calc(100vh-80px)] w-full p-1 overflow-auto">
              <StorageConvertPage/>
            </div>
          </TabPanel>
          <TabPanel value={3} label="Markdown">
            <div className="h-[calc(100vh-80px)] w-full p-1 overflow-auto">
              <MarkdownPdfConvertPage/>
            </div>
          </TabPanel>
        </Tabs>
      </div>
  );
}

export default ConversionView;