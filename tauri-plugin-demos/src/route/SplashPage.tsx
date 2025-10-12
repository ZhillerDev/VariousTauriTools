import {Progress} from 'tdesign-react';

const SplashPage: React.FC = () => {
  return (
      <div
          className="w-screen h-screen bg-gray-700 text-white flex flex-col justify-between items-start p-6 box-border">
        {/* 左上角标题区域 */}
        <div className="text-left">
          <h1 className="text-3xl font-bold">TaruiPluginDemos</h1>
          <p className="text-xs text-gray-400 mt-1">some demos for tauri plugin</p>
        </div>

        {/* 右下角蓝色视觉引导条 */}
        <div className="w-48 self-end">
          <Progress
              percentage={100} // 固定为100%，作为静态视觉引导条
              size="small" // 使用小尺寸
          />
        </div>
      </div>
  );
};

export default SplashPage;



