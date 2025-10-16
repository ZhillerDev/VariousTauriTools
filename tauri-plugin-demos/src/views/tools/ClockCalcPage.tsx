import {useState} from 'react';
import {Button, Card, Divider, InputNumber, InputNumberValue, Select, Space, Tooltip} from 'tdesign-react';
import {ArrowRightIcon, CheckIcon, CopyIcon, InfoCircleIcon, RefreshIcon} from 'tdesign-icons-react';
import {message} from "@tauri-apps/plugin-dialog";

// 频率单位换算系数 (相对于Hz)
const FREQUENCY_UNITS = {
  'Hz': 1,
  'kHz': 1000,
  'MHz': 1000000,
  'GHz': 1000000000
};

// 时间单位换算系数 (相对于秒)
const TIME_UNITS = {
  's': 1,
  'ms': 0.001,
  'μs': 0.000001,
  'ns': 0.000000001
};

export default function ClockCalcPage() {
  // 状态管理
  const [clockFreq, setClockFreq] = useState<InputNumberValue>(100);
  const [clockUnit, setClockUnit] = useState<'Hz' | 'kHz' | 'MHz' | 'GHz'>('MHz');
  const [divider, setDivider] = useState<InputNumberValue>(1);
  const [resultFreq, setResultFreq] = useState<string>('');
  const [resultTime, setResultTime] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<'s' | 'ms' | 'μs' | 'ns'>('ns');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'freq' | 'time' | 'idle'>('idle');


  // 辅助函数：将InputNumberValue转换为有效数字
  const parseNumberValue = (value: InputNumberValue): number | null => {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    // 转换为数字
    const num = typeof value === 'number' ? value : parseFloat(value);
    // 检查是否为有效数字
    return isNaN(num) ? null : num;
  };

  // 辅助函数：判断InputNumberValue是否为有效的正数
  const isPositiveNumber = (value: InputNumberValue): boolean => {
    if (value === '' || value === null || value === undefined) {
      return false;
    }
    const num = typeof value === 'number' ? value : parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  // 处理计算
  const handleCalculate = () => {
    // 解析输入值为数字
    const parsedClockFreq = parseNumberValue(clockFreq);
    const parsedDivider = parseNumberValue(divider);

    // 验证时钟频率
    if (parsedClockFreq === null || parsedClockFreq <= 0) {
      message('请输入有效的时钟频率（大于0的数字）');
      return;
    }

    // 验证分频系数
    if (parsedDivider === null || parsedDivider <= 0) {
      message('请输入有效的分频系数（大于0的数字）');
      return;
    }

    try {
      // 计算实际频率 (Hz)
      const baseFreqHz = parsedClockFreq * FREQUENCY_UNITS[clockUnit];
      const actualFreqHz = baseFreqHz / parsedDivider;


      // 计算周期 (秒)
      const periodSec = 1 / actualFreqHz;

      // 格式化频率结果
      let freqDisplay, freqUnit;
      if (actualFreqHz >= 1e9) {
        freqDisplay = (actualFreqHz / 1e9).toFixed(6);
        freqUnit = 'GHz';
      } else if (actualFreqHz >= 1e6) {
        freqDisplay = (actualFreqHz / 1e6).toFixed(6);
        freqUnit = 'MHz';
      } else if (actualFreqHz >= 1e3) {
        freqDisplay = (actualFreqHz / 1e3).toFixed(6);
        freqUnit = 'kHz';
      } else {
        freqDisplay = actualFreqHz.toFixed(6);
        freqUnit = 'Hz';
      }
      setResultFreq(`${parseFloat(freqDisplay)} ${freqUnit}`);

      // 格式化时间结果 (根据选择的单位)
      const timeValue = periodSec / TIME_UNITS[timeUnit];
      setResultTime(`${timeValue.toFixed(9)} ${timeUnit}`);

      setIsCalculated(true);
      //message('计算成功');
    } catch (error) {
      if (error instanceof Error) {
        message(error.message);
      } else {
        message('计算失败，请检查输入');
      }
      setIsCalculated(false);
    }
  };

  // 复制结果
  const copyToClipboard = (type: 'freq' | 'time') => {
    const content = type === 'freq' ? resultFreq : resultTime;
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus(type);
      setTimeout(() => setCopyStatus('idle'), 2000);
      //message(`${type === 'freq' ? '频率' : '周期'}结果已复制`);
    }).catch(err => {
      console.error('复制失败:', err);
      message('复制失败，请手动复制');
    });
  };

  // 清空内容
  const clearAll = () => {
    setClockFreq(100);
    setClockUnit('MHz');
    setDivider(1);
    setResultFreq('');
    setResultTime('');
    setIsCalculated(false);
    setCopyStatus('idle');
  };

  // 插入示例
  const insertExample = () => {
    setClockFreq(72);
    setClockUnit('MHz');
    setDivider(7200);
    setTimeUnit('μs');
    setResultFreq('');
    setResultTime('');
    setIsCalculated(false);
  };

  return (
      <div className="h-full flex flex-col">
        <Card title="时钟频率计算器" bordered={false} className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col p-2">
            {/* 输入区域 */}
            <div className="mb-6 space-y-4">
              <div className="w-full">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-2">时钟主频</label>
                  <Space>
                    <InputNumber
                        value={clockFreq}
                        onChange={setClockFreq}
                        min={0.001}
                        step={1}
                        className="flex-1"
                    />
                    <Select
                        value={clockUnit}
                        onChange={(value) => setClockUnit(value as any)}
                    >
                      <Select.Option value="Hz">Hz</Select.Option>
                      <Select.Option value="kHz">kHz</Select.Option>
                      <Select.Option value="MHz">MHz</Select.Option>
                      <Select.Option value="GHz">GHz</Select.Option>
                    </Select>
                  </Space>
                </div>


                <div className="mt-4">
                  <label className="text-sm font-medium block mb-2">分频系数</label>
                  <InputNumber
                      value={divider}
                      onChange={setDivider}
                      min={1}
                      step={1}
                      className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-32">
                  <label className="text-sm font-medium block mb-2">周期单位</label>
                  <Select
                      value={timeUnit}
                      onChange={(value) => setTimeUnit(value as any)}
                  >
                    <Select.Option value="s">秒 (s)</Select.Option>
                    <Select.Option value="ms">毫秒 (ms)</Select.Option>
                    <Select.Option value="μs">微秒 (μs)</Select.Option>
                    <Select.Option value="ns">纳秒 (ns)</Select.Option>
                  </Select>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <Space className="mb-6">
              <Button
                  onClick={handleCalculate}
                  disabled={!isPositiveNumber(clockFreq) || !isPositiveNumber(divider)}
                  className="flex-1"
                  icon={<ArrowRightIcon className="h-4 w-4 mr-1"/>}
              >
                计算频率和周期
              </Button>

              <Button
                  onClick={clearAll}
                  icon={<RefreshIcon className="h-4 w-4"/>}
              >
                清空
              </Button>
              <Tooltip content="插入示例数据 (72MHz / 7200 = 10kHz)">
                <Button
                    variant="outline"
                    icon={<InfoCircleIcon className="h-4 w-4"/>}
                    onClick={insertExample}
                >
                  示例
                </Button>
              </Tooltip>
            </Space>

            <Divider>计算结果</Divider>

            {/* 结果展示 */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* 频率结果 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">实际频率</label>
                <div className="flex-1 flex flex-col">
                  <div
                      className={`p-4 rounded-md font-mono text-sm flex-1 border `}
                  >
                    {isCalculated ? resultFreq : '频率结果将显示在这里...'}
                  </div>
                  {isCalculated && (
                      <div className="mt-2 flex justify-end">
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => copyToClipboard('freq')}
                            icon={copyStatus === 'freq' ? <CheckIcon className="h-4 w-4"/> :
                                <CopyIcon className="h-4 w-4"/>}
                        >
                          {copyStatus === 'freq' ? '已复制' : '复制频率'}
                        </Button>
                      </div>
                  )}
                </div>
              </div>

              {/* 周期结果 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">对应周期</label>
                <div className="flex-1 flex flex-col">
                  <div
                      className={`p-4 rounded-md font-mono text-sm flex-1 border `}
                  >
                    {isCalculated ? resultTime : '周期结果将显示在这里...'}
                  </div>
                  {isCalculated && (
                      <div className="mt-2 flex justify-end">
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => copyToClipboard('time')}
                            icon={copyStatus === 'time' ? <CheckIcon className="h-4 w-4"/> :
                                <CopyIcon className="h-4 w-4"/>}
                        >
                          {copyStatus === 'time' ? '已复制' : '复制周期'}
                        </Button>
                      </div>
                  )}
                </div>
              </div>
            </div>

            <Divider className="mt-4"/>
            <div className="text-sm text-gray-500 mt-2">
              <p>计算公式：实际频率 = 时钟主频 ÷ 分频系数</p>
              <p>周期 = 1 ÷ 实际频率（可选择不同时间单位）</p>
            </div>
          </div>
        </Card>
      </div>
  );
}