import {useRef, useState} from 'react';
import {Button, Card, Select, Space, Textarea, Tooltip} from 'tdesign-react';
import {CheckIcon, CopyIcon, InfoCircleIcon, RefreshIcon} from 'tdesign-icons-react';
import {message} from "@tauri-apps/plugin-dialog";

// 进制转换工具组件
export default function BaseConvertPage() {
  // 状态管理
  const [inputValue, setInputValue] = useState<string>('');
  const [fromBase, setFromBase] = useState<string>('10'); // 源进制
  const [convertResult, setConvertResult] = useState<string>('');
  const [isConverted, setIsConverted] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
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

  // 处理源进制变化
  const handleFromBaseChange = (value: string) => {
    setFromBase(value);
    // 进制变化时重置状态
    if (isConverted) {
      setIsConverted(false);
      setConvertResult('');
    }
  };



  // 验证输入格式
  const validateInput = (value: string, base: number): boolean => {
    if (!value.trim()) {
      message('请输入要转换的数值');
      return false;
    }

    // 根据进制验证输入格式
    let regex: RegExp;
    switch (base) {
      case 2:
        regex = /^[01]+$/;
        break;
      case 8:
        regex = /^[0-7]+$/;
        break;
      case 10:
        regex = /^\d+$/;
        break;
      case 16:
        regex = /^[0-9a-fA-F]+$/;
        break;
      default:
        return false;
    }

    if (!regex.test(value.trim())) {
      const baseName = getBaseName(base);
      message(`无效的${baseName}格式，请检查输入`);
      return false;
    }

    return true;
  };

  // 获取进制名称
  const getBaseName = (base: number): string => {
    switch (base) {
      case 2:
        return '二进制';
      case 8:
        return '八进制';
      case 10:
        return '十进制';
      case 16:
        return '十六进制';
      default:
        return '未知进制';
    }
  };

  // 获取进制前缀
  const getBasePrefix = (base: number): string => {
    switch (base) {
      case 2:
        return '0b';
      case 8:
        return '0o';
      case 16:
        return '0x';
      default:
        return '';
    }
  };

  // 执行进制转换
  const performConversion = () => {
    const fromBaseNum = parseInt(fromBase, 10);
    const value = inputValue.trim();

    if (!validateInput(value, fromBaseNum)) return;

    try {
      // 先转换为十进制
      const decimalValue = parseInt(value, fromBaseNum);
      
      // 生成所有其他三种进制的结果
      const allBases = [2, 8, 10, 16];
      const otherBases = allBases.filter(base => base !== fromBaseNum);
      
      let resultHtml = `<div><strong>转换结果:</strong></div>
        <div class="mt-2">${getBaseName(fromBaseNum)}: ${value}</div>`;
      
      otherBases.forEach(base => {
        let result = decimalValue.toString(base);
        // 十六进制结果转为大写
        if (base === 16) {
          result = result.toUpperCase();
        }
        resultHtml += `<div>${getBaseName(base)}: ${getBasePrefix(base)}${result}</div>`;
      });
      
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
    setInputValue('100');
    setFromBase('10');
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
                <label className="text-sm font-medium">输入数值</label>
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
                placeholder="请输入要转换的数值"
                className="font-mono text-sm"
              />
            </div>

            {/* 进制选择区域 */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2">输入值类型</label>
              <Select
                value={fromBase}
                onChange={(value) => setFromBase(value as string)}
                className="w-full max-w-xs"
              >
                <Select.Option value="2">二进制 (0b)</Select.Option>
                <Select.Option value="8">八进制 (0o)</Select.Option>
                <Select.Option value="10">十进制</Select.Option>
                <Select.Option value="16">十六进制 (0x)</Select.Option>
              </Select>
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