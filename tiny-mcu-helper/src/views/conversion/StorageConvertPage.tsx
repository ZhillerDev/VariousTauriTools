import {useRef, useState} from 'react';
import {Button, Card, Select, Space, Textarea, Tooltip} from 'tdesign-react';
import {CheckIcon, CopyIcon, InfoCircleIcon, RefreshIcon} from 'tdesign-icons-react';
import {message} from "@tauri-apps/plugin-dialog";

// 单位类型选项
type UnitType = 'register' | 'b' | 'B' | 'KB' | 'MB' | 'GB';
const unitOptions = [
  { label: '寄存器内存', value: 'register' },
  { label: '位 (b)', value: 'b' },
  { label: '字节 (B)', value: 'B' },
  { label: '千字节 (KB)', value: 'KB' },
  { label: '兆字节 (MB)', value: 'MB' },
  { label: '吉字节 (GB)', value: 'GB' },
];

// 存储单位转换工具组件
export default function StorageConvertPage() {
  // 状态管理
  const [inputValue, setInputValue] = useState<string>('');
  const [convertResult, setConvertResult] = useState<string>('');
  const [isConverted, setIsConverted] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('register');
  const resultRef = useRef<HTMLDivElement>(null);

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInputValue(value);
    // 输入变化时重置状态
    if (isConverted) {
      setIsConverted(false);
      setConvertResult('');
    }
  };

  // 解析输入值
  const parseInput = (input: string): number | null => {
    // 尝试匹配内存区间格式（仅对寄存器内存模式有效）
    if (selectedUnit === 'register') {
      // 尝试匹配内存区间格式，如 0x0000-0x4000 或 0x0-0x4000
      const rangeRegex = /^(0x[0-9a-fA-F]+)\s*-\s*(0x[0-9a-fA-F]+)$/;
      const rangeMatch = input.trim().match(rangeRegex);
      
      if (rangeMatch) {
        const startAddr = parseInt(rangeMatch[1], 16);
        const endAddr = parseInt(rangeMatch[2], 16);
        
        if (endAddr >= startAddr) {
          // 计算内存大小（字节），注意地址区间通常是包含起始和结束地址的
          return endAddr - startAddr + 1;
        } else {
          message('结束地址不能小于起始地址');
          return null;
        }
      }
    }
    
    // 尝试匹配数字输入（十进制或十六进制）
    const numRegex = /^(\d+(\.\d+)?)$/;
    const hexRegex = /^0x([0-9a-fA-F]+)$/;
    const numMatch = input.trim().match(numRegex);
    const hexMatch = input.trim().match(hexRegex);
    
    let size: number | null = null;
    
    if (numMatch) {
      // 十进制数字
      size = parseFloat(numMatch[1]);
    } else if (hexMatch) {
      // 十六进制数字
      size = parseInt(hexMatch[1], 16);
    }
    
    if (size !== null) {
      // 根据选择的单位转换为字节
      switch (selectedUnit) {
        case 'register':
          // 寄存器内存直接返回字节数
          return size;
        case 'b':
          // 位转换为字节（向上取整）
          return Math.ceil(size / 8);
        case 'B':
          return size;
        case 'KB':
          return size * 1024;
        case 'MB':
          return size * 1024 * 1024;
        case 'GB':
          return size * 1024 * 1024 * 1024;
        default:
          return size;
      }
    }
    
    message(`请输入有效的数字${selectedUnit === 'register' ? '、十六进制数值（如 0x3FFFF）或内存区间（如 0x0000-0xFFFFFFFF）' : ''}`);
    return null;
  };

  // 执行存储单位转换
  const performConversion = () => {
    const value = inputValue.trim();
    
    if (!value) {
      message('请输入要转换的内存地址区间或大小');
      return;
    }

    try {
      const bytes = parseInput(value);
      
      if (bytes === null) {
        return;
      }

      // 计算不同单位的表示
      const bits = bytes * 8;
      const kb = bytes / 1024;
      const mb = kb / 1024;
      const gb = mb / 1024;
      
      // 格式化结果，保留适当的小数位
      let resultHtml = `<div><strong>存储大小转换结果:</strong></div>
        <div class="mt-2">位 (bit): ${bits.toLocaleString()} bit</div>
        <div>字节 (B): ${bytes.toLocaleString()} B</div>`;
      
      if (kb >= 0.001) {
        resultHtml += `<div>千字节 (KB): ${kb.toFixed(kb >= 100 ? 0 : kb >= 10 ? 1 : 3)} KB</div>`;
      }
      
      if (mb >= 0.001) {
        resultHtml += `<div>兆字节 (MB): ${mb.toFixed(mb >= 100 ? 0 : mb >= 10 ? 1 : 3)} MB</div>`;
      }
      
      if (gb >= 0.001) {
        resultHtml += `<div>吉字节 (GB): ${gb.toFixed(gb >= 100 ? 0 : gb >= 10 ? 1 : 3)} GB</div>`;
      }
      
      setConvertResult(resultHtml);
      setIsConverted(true);
    } catch (error) {
      console.error('转换失败:', error);
      message('转换过程出错，请检查输入');
    }
  };

  // 复制结果到剪贴板
  const copyToClipboard = () => {
    if (!convertResult) return;

    // 提取纯文本结果
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = convertResult;
    const textToCopy = tempDiv.textContent || '';

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
      message('结果已复制到剪贴板');
    }).catch(err => {
      console.error('复制失败:', err);
      message('复制失败，请手动复制');
    });
  };

  // 清空输入和结果
  const clearAll = () => {
    setInputValue('');
    setConvertResult('');
    setIsConverted(false);
    setCopyStatus('idle');
  };

  // 示例输入
  const insertExample = () => {
    setInputValue('4000');
    setSelectedUnit('register');
    setIsConverted(false);
    setConvertResult('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className='pt-4'>
        <div className="flex-1 flex">
          {/* 左侧：输入和控制区域 */}
          <div className="flex-1 mr-4 flex flex-col">
            {/* 输入区域 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">输入值</label>
                <Tooltip content="插入示例数据">
                  <Button
                    variant="text"
                    size="small"
                    icon={<InfoCircleIcon className="h-4 w-4"/>}
                    onClick={insertExample}
                  />
                </Tooltip>
              </div>
              <Textarea
                value={inputValue}
                onChange={handleInputChange}
                placeholder={selectedUnit === 'register' ? '输入数字或内存区间\n' : '输入数字'}
                style={{width:'100%'}}
              />
              <div className="mt-2">
                <label className="text-sm font-medium mr-2">单位类型：</label>
                <Select
                  value={selectedUnit}
                  onChange={(value) => setSelectedUnit(value as UnitType)}
                  options={unitOptions}
                  className="w-[200px]"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500" style={{ whiteSpace: 'pre-line' }}>
                  提示：{selectedUnit === 'register' ? '\n支持输入寄存器长度（如 4000）\n十六进制数值（如 0x3FFFF）\n 或内存区间（如 0x0000-0xFFFFFFFF）' : `输入${unitOptions.find(opt => opt.value === selectedUnit)?.label}单位的数值`}
              </div>
            </div>

            {/* 操作按钮 */}
            <Space className="mb-2">
              <Button
                onClick={performConversion}
                disabled={!inputValue.trim()}
                className="flex-1"
              >
                执行转换
              </Button>
              <Button
                onClick={clearAll}
                icon={<RefreshIcon className="h-4 w-4"/>}
              >
                清空
              </Button>
            </Space>
          </div>

          {/* 右侧：结果展示区域 */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 mb-2">
              <div
                ref={resultRef}
                className={`p-4 rounded-md font-mono text-sm h-full ${isConverted ? 'border ' : ' border border-dashed'}`}
                dangerouslySetInnerHTML={{
                  __html: isConverted ? convertResult : '转换结果将显示在这里...'
                }}
              />
            </div>

            {isConverted && (
              <div className="flex justify-end">
                <Button
                  variant="text"
                  size="small"
                  onClick={copyToClipboard}
                  icon={copyStatus === 'copied' ? <CheckIcon className="h-4 w-4"/> : <CopyIcon className="h-4 w-4"/>}
                >
                  {copyStatus === 'copied' ? '已复制' : '复制结果'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};