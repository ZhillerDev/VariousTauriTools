import {useState} from 'react';
import {Button, Divider, InputNumber, InputNumberValue, Select, Space, Tag, Tooltip} from 'tdesign-react';
import {CheckIcon, CopyIcon, InfoCircleIcon, PlayIcon, RefreshIcon} from 'tdesign-icons-react';
import {message} from "@tauri-apps/plugin-dialog";

// 频率单位换算系数 (相对于Hz)
const FREQUENCY_UNITS = {
  'Hz': 1,
  'kHz': 1000,
  'MHz': 1000000,
  'GHz': 1000000000
};

// 时钟源分频选项（参考单片机代码中的SYSCLKDIV1等）
const CLOCK_SOURCES = [
  {value: 'SYSCLKDIV1', label: '系统时钟 / 1', divider: 1},
  {value: 'SYSCLKDIV2', label: '系统时钟 / 2', divider: 2},
  {value: 'SYSCLKDIV4', label: '系统时钟 / 4', divider: 4},
  {value: 'SYSCLKDIV8', label: '系统时钟 / 8', divider: 8},
  {value: 'SYSCLKDIV16', label: '系统时钟 / 16', divider: 16},
  {value: 'SYSCLKDIV32', label: '系统时钟 / 32', divider: 32},
  {value: 'SYSCLKDIV64', label: '系统时钟 / 64', divider: 64},
  {value: 'SYSCLKDIV128', label: '系统时钟 / 128', divider: 128},
];

// uint16_t 最大值
const UINT16_MAX = 65535;

export default function PwmCalcPage() {
  // 状态管理
  const [clockFreq, setClockFreq] = useState<InputNumberValue>(24); // 系统主频
  const [clockUnit, setClockUnit] = useState<'Hz' | 'kHz' | 'MHz'>('MHz');
  const [targetFreq, setTargetFreq] = useState<InputNumberValue>(1); // 目标PWM频率
  const [targetFreqUnit, setTargetFreqUnit] = useState<'Hz' | 'kHz'>('kHz');
  const [dutyCycle, setDutyCycle] = useState<InputNumberValue>(50); // 占空比
  const [calculatedPeriod, setCalculatedPeriod] = useState<string>(''); // PWM_Period
  const [calculatedDuty, setCalculatedDuty] = useState<string>(''); // PWM_Duty
  const [selectedClockSource, setSelectedClockSource] = useState<string>('SYSCLKDIV1'); // 时钟源
  const [recommendedClockSource, setRecommendedClockSource] = useState<string>(''); // 推荐时钟源
  const [actualFreq, setActualFreq] = useState<string>(''); // 实际PWM频率
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'period' | 'duty' | 'code' | 'idle'>('idle');
  const [generatedCode, setGeneratedCode] = useState<string>(''); // 生成的代码

  // 辅助函数：将InputNumberValue转换为有效数字
  const parseNumberValue = (value: InputNumberValue): number | null => {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const num = typeof value === 'number' ? value : parseFloat(value);
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

  // 计算PWM参数
  const handleCalculate = () => {
    // 解析输入值
    const parsedClockFreq = parseNumberValue(clockFreq);
    const parsedTargetFreq = parseNumberValue(targetFreq);
    const parsedDutyCycle = parseNumberValue(dutyCycle);

    // 验证输入
    if (parsedClockFreq === null || parsedClockFreq <= 0) {
      message('请输入有效的系统主频（大于0的数字）');
      return;
    }

    if (parsedTargetFreq === null || parsedTargetFreq <= 0) {
      message('请输入有效的目标PWM频率（大于0的数字）');
      return;
    }

    if (parsedDutyCycle === null || parsedDutyCycle < 0 || parsedDutyCycle > 100) {
      message('请输入有效的占空比（0-100之间的数字）');
      return;
    }

    try {
      // 转换为Hz
      const clockFreqHz = parsedClockFreq * FREQUENCY_UNITS[clockUnit];
      const targetFreqHz = parsedTargetFreq * FREQUENCY_UNITS[targetFreqUnit];

      // 自动选择合适的时钟源，确保周期值不超过uint16_t范围
      let bestClockSource = CLOCK_SOURCES[0];
      let periodValue = 0;
      let overflow = false;

      // 尝试不同的时钟源，找到最合适的一个
      for (const source of CLOCK_SOURCES) {
        const timerFreqHz = clockFreqHz / source.divider;
        // PWM频率 = 定时器时钟频率 / (PWM_Period + 1)
        // 所以 PWM_Period = 定时器时钟频率 / PWM频率 - 1
        periodValue = Math.round(timerFreqHz / targetFreqHz) - 1;

        // 如果不溢出，且是第一次找到合适的，或者更接近目标频率，则选择这个时钟源
        if (periodValue <= UINT16_MAX && periodValue >= 0) {
          bestClockSource = source;
          break;
        }

        // 如果是最后一个时钟源还溢出，则使用最大可能的值
        if (source === CLOCK_SOURCES[CLOCK_SOURCES.length - 1]) {
          overflow = true;
          periodValue = UINT16_MAX;
        }
      }

      // 计算实际PWM频率
      const actualTimerFreqHz = clockFreqHz / bestClockSource.divider;
      const actualPwmFreqHz = actualTimerFreqHz / (periodValue + 1);

      // 格式化实际频率显示
      let actualFreqDisplay: string;
      if (actualPwmFreqHz >= 1000) {
        actualFreqDisplay = `${(actualPwmFreqHz / 1000).toFixed(3)} kHz`;
      } else {
        actualFreqDisplay = `${actualPwmFreqHz.toFixed(2)} Hz`;
      }
      setActualFreq(actualFreqDisplay);

      // 计算占空比值
      const dutyValue = Math.round(periodValue * parsedDutyCycle / 100);

      // 保存结果
      setCalculatedPeriod(periodValue.toString());
      setCalculatedDuty(dutyValue.toString());
      setSelectedClockSource(bestClockSource.value);
      setRecommendedClockSource(bestClockSource.label);

      // 生成代码
      const code = generatePwmCode(periodValue, dutyValue, bestClockSource.value);
      setGeneratedCode(code);

      // 显示溢出警告
      if (overflow) {
        message(`警告：即使使用最大分频，周期值仍接近上限。实际频率可能与目标有较大偏差。`);
      }

      setIsCalculated(true);
    } catch (error) {
      if (error instanceof Error) {
        message(error.message);
      } else {
        message('计算失败，请检查输入');
      }
      setIsCalculated(false);
    }
  };

  // 生成PWM初始化代码
  const generatePwmCode = (period: number, duty: number, clockSource: string): string => {
    return `void PWMInit(void) 
{ 
    PWM_InitTypeDef PWM_InitStructure; 
    GPIO_InitTypeDef GPIO_InitStructure; 

    RCC_APB0PeriphClockOnOff(RCC_APB0_PWM0, SH_ON); 
    RCC_AHBPeriphClockOnOff(RCC_AHB_IOCLK, SH_ON); 

    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_3;        //Set SPI0 CS Pin 
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_OUT;    //Set Output 
    GPIO_InitStructure.GPIO_ODrv = GPIO_ODrv_NORMAL; //Low Speed 
    GPIO_InitStructure.GPIO_OType = GPIO_OType_PP;   //output Push-Pull 
    GPIO_InitStructure.GPIO_PuPd = GPIO_PuPd_NOPULL; //Pull-up 
    GPIO_Init(GPIOA, &GPIO_InitStructure); 

    GPIO_PinAFConfig(GPIOA, GPIO_Pin_3, GPIO_AF_PWM0); 

    PWM_InitStructure.PWM_Period = ${period}; 
    PWM_InitStructure.PWM_Duty = ${duty}; //${Math.round(duty * 100 / period)}% 
    PWM_InitStructure.PWM_DeadBand = 1; 
    PWM_InitStructure.PWM_CLKSource = ${clockSource}; 

    PWM_Init(PWM0, &PWM_InitStructure); 
    PWM_OutPutEnable(PWM0, PWM_CHANNEL_A, SH_ENABLE); 
    PWM_OnOff(PWM0, SH_ON); 
}`;
  };

  // 复制结果
  const copyToClipboard = (type: 'period' | 'duty' | 'code') => {
    let content = '';
    if (type === 'period') content = calculatedPeriod;
    else if (type === 'duty') content = calculatedDuty;
    else if (type === 'code') content = generatedCode;

    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus(type);
      setTimeout(() => setCopyStatus('idle'), 2000);
    }).catch(err => {
      console.error('复制失败:', err);
      message('复制失败，请手动复制');
    });
  };

  // 清空内容
  const clearAll = () => {
    setClockFreq(24);
    setClockUnit('MHz');
    setTargetFreq(1);
    setTargetFreqUnit('kHz');
    setDutyCycle(50);
    setCalculatedPeriod('');
    setCalculatedDuty('');
    setSelectedClockSource('SYSCLKDIV1');
    setRecommendedClockSource('');
    setActualFreq('');
    setGeneratedCode('');
    setIsCalculated(false);
    setCopyStatus('idle');
  };

  // 插入示例
  const insertExample = () => {
    setClockFreq(24);
    setClockUnit('MHz');
    setTargetFreq(1);
    setTargetFreqUnit('kHz');
    setDutyCycle(50);
    setCalculatedPeriod('');
    setCalculatedDuty('');
    setActualFreq('');
    setGeneratedCode('');
    setIsCalculated(false);
  };

  return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-row p-4 justify-between">
          <div>
            {/* 输入区域 */}
            <div className="mb-6 space-y-4">
              <div className="w-full">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-2">系统主频</label>
                  <Space>
                    <InputNumber
                        value={clockFreq}
                        onChange={setClockFreq}
                        min={0.001}
                        step={1}
                        className="flex-1"
                    />
                    <Select
                        style={{width: '80px'}}
                        value={clockUnit}
                        onChange={(value) => setClockUnit(value as any)}
                    >
                      <Select.Option value="Hz">Hz</Select.Option>
                      <Select.Option value="kHz">kHz</Select.Option>
                      <Select.Option value="MHz">MHz</Select.Option>
                    </Select>
                  </Space>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium block mb-2">目标PWM频率</label>
                  <Space>
                    <InputNumber
                        value={targetFreq}
                        onChange={setTargetFreq}
                        min={0.001}
                        step={1}
                        className="flex-1"
                    />
                    <Select
                        style={{width: '80px'}}
                        value={targetFreqUnit}
                        onChange={(value) => setTargetFreqUnit(value as any)}
                    >
                      <Select.Option value="Hz">Hz</Select.Option>
                      <Select.Option value="kHz">kHz</Select.Option>
                    </Select>
                  </Space>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium block mb-2">占空比 (%)</label>
                <InputNumber
                    value={dutyCycle}
                    onChange={setDutyCycle}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <Space className="mb-6">
              <Button
                  onClick={handleCalculate}
                  disabled={!isPositiveNumber(clockFreq) || !isPositiveNumber(targetFreq)}
                  className="flex-1"
                  icon={<PlayIcon className="h-4 w-4 mr-1"/>}
              >
                计算
              </Button>

              <Button
                  onClick={clearAll}
                  icon={<RefreshIcon className="h-4 w-4"/>}
              >
                重置
              </Button>
              <Tooltip content="插入示例数据 (24MHz系统时钟，生成1kHz、50%占空比的PWM)">
                <Button
                    variant="outline"
                    icon={<InfoCircleIcon className="h-4 w-4"/>}
                    onClick={insertExample}
                >
                  示例
                </Button>
              </Tooltip>
            </Space>
          </div>

          <div className="flex-1 pl-8">
            <Divider>PWM配置参数</Divider>

            {/* 结果展示 */}
            <div className="mt-4 grid grid-cols-1 gap-4 flex-1">
              {/* 实际频率 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">实际PWM频率</label>
                <div
                    className={`p-3 rounded-md font-mono text-sm border`}
                >
                  {isCalculated ? actualFreq : '实际频率将显示在这里...'}
                </div>
              </div>

              {/* 时钟源 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">推荐时钟源</label>
                <div
                    className={`p-3 rounded-md font-mono text-sm border`}
                >
                  {isCalculated ? (
                      <div className="flex items-center">
                        <span>{recommendedClockSource}</span>
                        <Tag color="success" className="ml-2">自动选择</Tag>
                      </div>
                  ) : '推荐时钟源将显示在这里...'}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  (自动选择分频确保PWM_Period ≤ 65535)
                </div>
              </div>

              {/* 周期值 */}
              <div className="flex flex-col">
                <div className='flex flex-row justify-between items-center'>
                  <label className="text-sm font-medium mb-2">PWM_Period (uint16_t)</label>
                  {isCalculated && (
                      <div className="mb-2 flex justify-end">
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => copyToClipboard('period')}
                            icon={copyStatus === 'period' ? <CheckIcon className="h-4 w-4"/> :
                                <CopyIcon className="h-4 w-4"/>}
                        >
                          {copyStatus === 'period' ? '已复制' : '复制'}
                        </Button>
                      </div>
                  )}
                </div>
                <div
                    className={`p-3 rounded-md font-mono text-sm border`}
                >
                  {isCalculated ? (
                      <div className="flex items-center">
                        <span>{calculatedPeriod}</span>
                        {parseInt(calculatedPeriod) >= UINT16_MAX * 0.9 && (
                            <Tag color="warning" className="ml-2">接近上限</Tag>
                        )}
                      </div>
                  ) : '周期值将显示在这里...'}
                </div>
              </div>

              {/* 占空比值 */}
              <div className="flex flex-col">
                <div className='flex flex-row justify-between items-center'>
                  <label className="text-sm font-medium mb-2">PWM_Duty (uint16_t)</label>
                  {isCalculated && (
                      <div className="mb-2 flex justify-end">
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => copyToClipboard('duty')}
                            icon={copyStatus === 'duty' ? <CheckIcon className="h-4 w-4"/> :
                                <CopyIcon className="h-4 w-4"/>}
                        >
                          {copyStatus === 'duty' ? '已复制' : '复制'}
                        </Button>
                      </div>
                  )}
                </div>
                <div
                    className={`p-3 rounded-md font-mono text-sm border`}
                >
                  {isCalculated ? calculatedDuty : '占空比值将显示在这里...'}
                </div>
              </div>
            </div>

            <Divider className="mt-4"/>
            <div className="text-sm text-gray-500 mt-2 w-60">
              <p>计算公式：</p>
              <p>1. PWM_Period = 定时器时钟频率 / 目标PWM频率 - 1</p>
              <p>2. PWM_Duty = PWM_Period × 占空比(%) ÷ 100</p>
              <p>3. 自动选择最佳时钟源以确保PWM_Period ≤ 65535 (uint16_t最大值)</p>
            </div>
          </div>
        </div>
      </div>
  );
}