import {useState} from 'react';
import {Button, Card, Divider, Space, Textarea, Tooltip} from 'tdesign-react';
import {message} from "@tauri-apps/plugin-dialog";
import {ArrowLeftRight1Icon, CheckIcon, CopyIcon, InfoCircleIcon, RefreshIcon} from 'tdesign-icons-react';

export default function Base64Page() {
  // 状态管理
  const [textContent, setTextContent] = useState<string>('');
  const [base64Content, setBase64Content] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<'text' | 'base64' | 'idle'>('idle');

  // 文本转Base64
  const textToBase64 = (text: string): string => {
    try {
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(text);
      const binaryStr = String.fromCharCode(...uint8Array);
      return btoa(binaryStr);
    } catch (error) {
      console.error('文本转Base64失败:', error);
      throw new Error('编码失败，请检查输入内容');
    }
  };

  // Base64转文本
  const base64ToText = (base64Str: string): string => {
    try {
      if (!/^[A-Za-z0-9+/=]+$/.test(base64Str)) {
        throw new Error('无效的Base64格式');
      }
      const binaryStr = atob(base64Str);
      const uint8Array = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        uint8Array[i] = binaryStr.charCodeAt(i);
      }
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(uint8Array);
    } catch (error) {
      console.error('Base64转文本失败:', error);
      throw new Error(error instanceof Error ? error.message : '解码失败，请检查Base64字符串');
    }
  };

  // 处理文本输入变化
  const handleTextChange = (value: string) => {
    setTextContent(value);
  };

  // 处理Base64输入变化
  const handleBase64Change = (value: string) => {
    setBase64Content(value);
  };

  // 文本转Base64
  const handleTextToBase64 = () => {
    if (!textContent.trim()) {
      message('请输入需要编码的文本');
      return;
    }

    try {
      const result = textToBase64(textContent);
      setBase64Content(result);
      //message('文本转Base64成功');
    } catch (error) {
      if (error instanceof Error) {
        message(error.message);
      } else {
        message('转换失败，请检查输入');
      }
    }
  };

  // Base64转文本
  const handleBase64ToText = () => {
    if (!base64Content.trim()) {
      message('请输入需要解码的Base64字符串');
      return;
    }

    try {
      const result = base64ToText(base64Content);
      setTextContent(result);
      // message('Base64转文本成功');
    } catch (error) {
      if (error instanceof Error) {
        message(error.message);
      } else {
        message('转换失败，请检查输入');
      }
    }
  };

  // 复制内容
  const copyToClipboard = (type: 'text' | 'base64') => {
    const content = type === 'text' ? textContent : base64Content;
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus(type);
      setTimeout(() => setCopyStatus('idle'), 2000);
      // message(`${type === 'text' ? '文本' : 'Base64'}已复制到剪贴板`);
    }).catch(err => {
      console.error('复制失败:', err);
      message('复制失败，请手动复制');
    });
  };

  // 交换内容
  const swapContent = () => {
    const temp = textContent;
    setTextContent(base64Content);
    setBase64Content(temp);
    //message('内容已交换');
  };

  // 清空所有内容
  const clearAll = () => {
    setTextContent('');
    setBase64Content('');
    setCopyStatus('idle');
  };

  // 插入示例内容
  const insertExample = () => {
    setTextContent('这是一段测试文本，用于Base64转换示例！Hello Base64!');
    setBase64Content('6L+Z5piv5LiA5pWw5rWL6K+V5pa55pyN5Yqh77yM5LMu5o6L54K55pm65Lqe5omL77yBSGVsbG8gQmFzZTY0IQ==');
  };

  return (
      <div className="h-full flex flex-col">
        <div className='pt-4'>
          <div className="flex-1 flex flex-col p-1">
            {/* 顶部操作区 */}
            <div className="mb-4 flex justify-between items-center">
              <Space>
                <Button
                    onClick={clearAll}
                    icon={<RefreshIcon className="h-4 w-4"/>}
                >
                  清空
                </Button>
                <Tooltip content="插入示例数据">
                  <Button
                      variant="outline"
                      icon={<InfoCircleIcon className="h-4 w-4"/>}
                      onClick={insertExample}
                  >
                    示例
                  </Button>
                </Tooltip>
              </Space>
              <Button
                  onClick={swapContent}
                  icon={<ArrowLeftRight1Icon className="h-4 w-4"/>}
              >
                交换内容
              </Button>
            </div>

            {/* 左右输入区 */}
            <div className="flex-1 flex gap-6 mb-4">
              {/* 左侧文本输入区 */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium pt-2">原文</label>
                  <Button
                      variant="text"
                      size="small"
                      onClick={() => copyToClipboard('text')}
                      icon={copyStatus === 'text' ? <CheckIcon className="h-4 w-4"/> : <CopyIcon className="h-4 w-4"/>}
                  >
                    {copyStatus === 'text' ? '已复制' : '复制'}
                  </Button>
                </div>
                <Textarea
                    value={textContent}
                    onChange={handleTextChange}
                    placeholder="请输入文本..."
                    className="flex-1 font-mono text-sm mb-2"
                />
                <Button
                    onClick={handleTextToBase64}
                    disabled={!textContent.trim()}
                >
                  文本 → Base64
                </Button>
              </div>

              {/* 右侧Base64输入区 */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium pt-2">Base64</label>
                  <Button
                      variant="text"
                      size="small"
                      onClick={() => copyToClipboard('base64')}
                      icon={copyStatus === 'base64' ? <CheckIcon className="h-4 w-4"/> :
                          <CopyIcon className="h-4 w-4"/>}
                  >
                    {copyStatus === 'base64' ? '已复制' : '复制'}
                  </Button>
                </div>
                <Textarea
                    value={base64Content}
                    onChange={handleBase64Change}
                    placeholder="请输入Base64字符串..."
                    className="flex-1 font-mono text-sm mb-2"
                />
                <Button
                    onClick={handleBase64ToText}
                    disabled={!base64Content.trim()}
                >
                  Base64 → 文本
                </Button>
              </div>
            </div>

            <Divider>使用说明</Divider>
            <div className="text-sm text-gray-500 mt-2 space-y-1">
              <p>1. 左侧输入文本，点击"文本 → Base64"生成编码</p>
              <p>2. 右侧输入Base64，点击"Base64 → 文本"解码</p>
              <p>3. 可通过交换按钮快速切换内容，方便双向转换</p>
            </div>
          </div>
        </div>
      </div>
  );
}