import {useState} from 'react';
import {Button, Card, Divider, Radio, RadioGroup, Space, Textarea, Tooltip} from 'tdesign-react';
import {message} from "@tauri-apps/plugin-dialog";
import {ArrowDownIcon, CheckIcon, CopyIcon, InfoCircleIcon, RefreshIcon} from 'tdesign-icons-react';

// CRC32多项式常量 (0x04C11DB7)
const CRC32_POLYNOMIAL = 0xEDB88320; // 反向多项式
let crc32Table: number[] | null = null;

// 初始化CRC32表
const initCrc32Table = () => {
  if (crc32Table) return;

  crc32Table = new Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (CRC32_POLYNOMIAL ^ (crc >>> 1)) : (crc >>> 1);
    }
    crc32Table[i] = crc;
  }
};

// 计算CRC32校验值
const calculateCrc32 = (data: string, isHex: boolean = false): string => {
  initCrc32Table();
  if (!crc32Table) throw new Error('CRC32表初始化失败');

  let crc = 0xFFFFFFFF;

  if (isHex) {
    // 处理十六进制字符串
    const hexStr = data.replace(/\s/g, ''); // 去除所有空格
    if (!/^[0-9A-Fa-f]*$/.test(hexStr) || hexStr.length % 2 !== 0) {
      throw new Error('无效的十六进制格式，必须为偶数长度且只包含0-9、A-F、a-f');
    }

    for (let i = 0; i < hexStr.length; i += 2) {
      const byte = parseInt(hexStr.substr(i, 2), 16);
      crc = (crc >>> 8) ^ crc32Table[(crc ^ byte) & 0xFF];
    }
  } else {
    // 处理普通文本（UTF-8编码）
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);

    for (const byte of bytes) {
      crc = (crc >>> 8) ^ crc32Table[(crc ^ byte) & 0xFF];
    }
  }

  // 取反并转换为十六进制
  return ((~crc) >>> 0).toString(16).toUpperCase().padStart(8, '0');
};

export default function Crc32Page() {
  // 状态管理
  const [inputContent, setInputContent] = useState<string>('');
  const [crcResult, setCrcResult] = useState<string>('');
  const [inputType, setInputType] = useState<'text' | 'hex'>('text');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInputContent(value);
    if (isCalculated) {
      setIsCalculated(false);
      setCrcResult('');
    }
  };

  // 计算CRC32
  const handleCalculate = () => {
    if (!inputContent.trim()) {
      message('请输入需要计算CRC32的值');
      return;
    }

    try {
      const result = calculateCrc32(inputContent, inputType === 'hex');
      setCrcResult(result);
      setIsCalculated(true);
      //message('CRC32计算成功');
    } catch (error) {
      if (error instanceof Error) {
        message(error.message);
      } else {
        message('计算失败，请检查输入');
      }
      setCrcResult('');
      setIsCalculated(false);
    }
  };

  // 复制结果
  const copyToClipboard = () => {
    if (!crcResult) return;

    navigator.clipboard.writeText(crcResult).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
      //message('CRC32结果已复制到剪贴板');
    }).catch(err => {
      console.error('复制失败:', err);
      message('复制失败，请手动复制');
    });
  };

  // 清空内容
  const clearAll = () => {
    setInputContent('');
    setCrcResult('');
    setIsCalculated(false);
    setCopyStatus('idle');
  };

  // 插入示例
  const insertExample = () => {
    if (inputType === 'text') {
      setInputContent('Hello, CRC32!');
    } else {
      setInputContent('48656C6C6F2C20435243333221'); // "Hello, CRC32!"的十六进制
    }
    setCrcResult('');
    setIsCalculated(false);
  };

  return (
      <div className="h-full flex flex-col">
        <div className='pt-4'>
          <div className="flex-1 flex flex-col">
            {/* 输入类型选择 */}
            <RadioGroup
                value={inputType}
                onChange={(value) => setInputType(value as 'text' | 'hex')}
                className="mb-6"
            >
              <Radio value="text">文本输入</Radio>
              <Radio value="hex">十六进制输入</Radio>
            </RadioGroup>

            {/* 输入区域 */}
            <div className="mb-2 flex-1">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium pt-2">
                  {inputType === 'text'
                      ? '请输入需要计算CRC32的文本'
                      : '请输入需要计算CRC32的十六进制字符串（不含0x前缀）'
                  }
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
                  value={inputContent}
                  onChange={handleInputChange}
                  placeholder={inputType === 'text'
                      ? '输入文本后点击"计算CRC32"按钮...'
                      : '输入十六进制字符串（如：48656C6C6F）后点击"计算CRC32"按钮...'
                  }
                  className="h-full font-mono text-sm"
              />
            </div>

            {/* 操作按钮 */}
            <Space className="mb-2">
              <Button
                  onClick={handleCalculate}
                  disabled={!inputContent.trim()}
                  className="flex-1"
                  icon={<ArrowDownIcon className="h-4 w-4 mr-1"/>}
              >
                计算CRC32
              </Button>
              <Button
                  onClick={clearAll}
                  icon={<RefreshIcon className="h-4 w-4"/>}
              >
                清空
              </Button>
            </Space>

            <Divider>计算结果</Divider>

            {/* 结果展示 */}
            <div className="mt-4 flex-1 flex flex-col">
              <div
                  className={`p-4 rounded-md font-mono text-sm flex-1 overflow-auto border border-gray-200 ${
                      isCalculated
                          ? ''
                          : '50 border-dashed '
                  }`}
              >
                {isCalculated ? crcResult : 'CRC32计算结果将显示在这里...'}
              </div>

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
}