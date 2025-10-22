import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Card, MessagePlugin, Textarea} from 'tdesign-react';
import {marked} from 'marked';
import hljs from 'highlight.js';
// 引入代码高亮样式
import 'highlight.js/styles/github-dark.css';
import 'highlight.js/styles/github.css';
import '@styles/markdown-styles.css';
import {useSettingStore} from "@stores/settingStore.ts";
import {DownloadIcon, FolderOpenIcon} from 'tdesign-icons-react';
import {invoke} from "@tauri-apps/api/core";

function MarkdownPdfConvertPage() {
  // 从 zustand 获取主题状态
  const isDarkMode = useSettingStore((state) => state.config);

  // 状态管理
  const [markdownContent, setMarkdownContent] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [noticeText, setNoticeText] = useState('目前没有导出任何文件...');

  // 文件输入框引用
  const fileInputRef = useRef(null);

  // 配置 marked
  useEffect(() => {
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await invoke("convert_markdown_to_pdf", {
        markdownContent: markdownContent,
        pdfFileName: "export",
      })
      setNoticeText("成功导出至根目录 generate/export.pdf")
      setIsExporting(false)
    } catch (error) {
      setNoticeText("导出失败")
      setIsExporting(false)
    }
  };

  // 处理文件选择
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      setErrorMessage('请选择 .md 或 .markdown 格式的文件');
      return;
    }

    setIsLoading(true);
    setFileName(file.name);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      // @ts-ignore
      setMarkdownContent(content);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setErrorMessage('文件读取失败，请重试');
      setIsLoading(false);
    };
    reader.readAsText(file);

    e.target.value = '';
  };

  // 点击选择文件按钮
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  // 当 Markdown 内容变化时更新预览
  useEffect(() => {
    if (markdownContent) {
      const htmlContent = marked.parse(markdownContent);
      // @ts-ignore
      setPreviewContent(htmlContent);
    } else {
      setPreviewContent('');
    }
  }, [markdownContent]);

  // 根据主题动态生成 className
  const getPreviewClassName = () => {
    const baseClass = 'markdown-preview h-[calc(100vh-200px)] overflow-auto p-4 rounded-md';
    const themeClass = isDarkMode.darkTheme ? 'markdown-preview-dark' : 'markdown-preview-light';
    return `${baseClass} ${themeClass}`;
  };

  return (
      <div className="flex flex-col">
        {/* 顶部导航栏 */}
        <header className="shadow-sm">
          <div className="container mx-auto py-4 flex justify-between items-center">

            <div className='flex flex-row gap-2'>
              <Button
                  disabled={markdownContent === ''}
                  onClick={handleExportPDF}
                  theme="primary"
                  variant="base"
                  className="flex items-center gap-2 px-4 py-2 h-10"
                  loading={isExporting}
                  icon={<DownloadIcon/>}
              >
                导出PDF
              </Button>

              <Button
                  onClick={handleSelectFile}
                  theme="default"
                  variant="outline"
                  className="flex items-center gap-2 px-4 py-2 h-10 border-dashed hover:border-blue-500 transition-colors"
                  loading={isLoading}
                  icon={<FolderOpenIcon/>}
              >
                选择 Markdown 文件
              </Button>
            </div>

            <div>
              {noticeText}
            </div>


            {/* 隐藏的文件输入框 */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown"
                onChange={handleFileSelect}
                className="hidden"
            />
          </div>
        </header>

        {/* 主内容区 */}
        <main className="flex-1 container mx-auto  py-6">
          {/* 错误提示 */}
          {errorMessage && (
              <Alert
                  theme="error"
                  message={errorMessage}
                  className="mb-4"
                  onClose={() => setErrorMessage('')}
              />
          )}

          {/* 初始提示 */}
          {!markdownContent && !errorMessage && (
              <Card className="text-center p-8">
                <div className="flex flex-col items-center justify-center">
                  <i className="fab fa-markdown text-6xl mb-4 "></i>
                  <h3 className="text-lg font-medium mb-2 ">
                    还没有选择文件
                  </h3>
                  <p className="mb-6 text-gray-600">
                    点击上方按钮选择一个 Markdown 文件进行预览
                  </p>
                  <Button
                      onClick={handleSelectFile}
                      theme="primary"
                      className="flex items-center"
                  >
                    <i className="fas fa-file-import mr-2"></i>
                    选择文件
                  </Button>
                </div>
              </Card>
          )}

          {/* 预览区域 */}
          {markdownContent && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[calc(100vh-250px)] flex flex-col">
                  {/* 标题区域 - 固定高度 */}
                  <div className="flex-shrink-0 flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold ">
                      原始文本
                    </h2>
                    <span className="text-sm truncate max-w-xs">
                      {fileName}
                    </span>
                  </div>

                  {/* 文本区域 - 占据剩余空间 */}
                  <div className="flex-1 min-h-0"> {/* min-h-0 防止 flex 子元素溢出 */}
                    <Textarea
                        value={markdownContent}
                        onChange={setMarkdownContent}
                        autosize={true}
                        className="font-mono text-sm w-full resize-none"
                        placeholder="Markdown 内容将显示在这里..."
                    />
                  </div>
                </div>

                {/* 右侧：预览结果 - 动态切换 className */}
                <div className="h-[calc(100vh-250px)]">
                  {/* 标题区域 - 固定高度 */}
                  <div className="flex-shrink-0 flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold ">
                      渲染内容
                    </h2>
                  </div>

                  <div
                      className={getPreviewClassName()}
                      dangerouslySetInnerHTML={{__html: previewContent}}
                  />
                </div>
              </div>
          )}
        </main>
      </div>
  );
}

export default MarkdownPdfConvertPage;