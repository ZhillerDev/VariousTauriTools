import {useRef, useState} from 'react';
import {Button, Card, Space, Textarea, Tooltip} from 'tdesign-react';
import {CheckIcon, CopyIcon, InfoCircleIcon, RefreshIcon} from 'tdesign-icons-react';
import {message} from "@tauri-apps/plugin-dialog";

// 异或和计算工具组件
export default function XorSumPage() {
  // 状态管理
  const [inputValues, setInputValues] = useState<string>('');
  const [xorResult, setXorResult] = useState<string>('');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const resultRef = useRef<HTMLDivElement>(null);

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInputValues(value);
    // 输入变化时重置状态
    if (isCalculated) {
      setIsCalculated(false);
      setXorResult('');
    }
  };

  // 验证输入格式
  const validateInput = (values: string[]): boolean => {
    if (values.length === 0) {
      message('请输入至少一个数值');
      return false;
    }

    for (const val of values) {
      // 支持十六进制(0x前缀)、十进制和二进制(0b前缀)
      if (!/^0x[0-9a-fA-F]+$|^0b[01]+$|^\d+$/.test(val.trim())) {
        message(`无效的数值格式: ${val}，请检查输入`);
        return false;
      }
    }
    return true;
  };

  // 计算异或和
  const calculateXorSum = () => {
    // 分割输入值（支持逗号、空格、换行分隔）
    const values = inputValues
        .split(/[\s,，\n]+/)
        .filter(val => val.trim() !== '');

    if (!validateInput(values)) return;

    try {
      // 转换为数字并计算异或和
      let xorSum = 0;
      values.forEach(val => {
        // 自动识别数值类型并转换
        if (val.startsWith('0x')) {
          xorSum ^= parseInt(val, 16);
        } else if (val.startsWith('0b')) {
          xorSum ^= parseInt(val, 2);
        } else {
          xorSum ^= parseInt(val, 10);
        }
      });

      // 展示多种格式的结果
      setXorResult(`
        十进制: ${xorSum}<br/>
        十六进制: 0x${xorSum.toString(16).toUpperCase()}<br/>
        二进制: 0b${xorSum.toString(2)}
      `);
      setIsCalculated(true);
    } catch (error) {
      console.error('计算失败:', error);
      message('计算过程出错，请检查输入');
    }
  };

  // 复制结果到剪贴板
  const copyToClipboard = () => {
    if (!xorResult) return;

    // 提取纯文本结果
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = xorResult;
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
    setInputValues('');
    setXorResult('');
    setIsCalculated(false);
    setCopyStatus('idle');
  };

  // 示例输入
  const insertExample = () => {
    setInputValues('10, 0x1A, 25, 0b1010');
    setIsCalculated(false);
    setXorResult('');
  };

  return (
      <div className="h-full flex flex-col">
        <div className='pt-4'>
          <div className="flex-1 flex flex-col">
            {/* 输入区域 */}
            <div className="mb-6 flex-1">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">
                  输入数值（支持十进制、十六进制(0x前缀)、二进制(0b前缀)，使用逗号、空格或换行分隔）
                </label>
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
                  value={inputValues}
                  onChange={handleInputChange}
                  placeholder="例如: 10, 0x1A, 25, 0b1010"
                  className="h-full font-mono text-sm"
              />
            </div>

            {/* 操作按钮 */}
            <Space className="mb-2">
              <Button
                  onClick={calculateXorSum}
                  disabled={!inputValues.trim()}
                  className="flex-1"
              >
                计算异或和
              </Button>
              <Button
                  onClick={clearAll}
                  icon={<RefreshIcon className="h-4 w-4"/>}
              >
                清空
              </Button>
            </Space>

            {/* 结果展示 */}
            <div className="mt-4 flex-1 flex flex-col">
              <div
                  ref={resultRef}
                  className={`p-4 rounded-md font-mono text-sm flex-1 ${
                      isCalculated
                          ? 'border '
                          : ' border border-dashed'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: isCalculated
                        ? xorResult
                        : '计算结果将显示在这里...'
                  }}
              />

              {isCalculated && (
                  <div className="mt-3 flex justify-end">
                    <Button
                        variant="text"
                        size="small"
                        onClick={copyToClipboard}
                        icon={copyStatus === 'copied' ? <CheckIcon className="h-4 w-4"/> :
                            <CopyIcon className="h-4 w-4"/>}
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