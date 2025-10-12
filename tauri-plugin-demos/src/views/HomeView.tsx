import {useEffect, useState} from 'react';
import {Table, TableProps, Typography} from 'tdesign-react';
import {
  appConfigDir,
  appDataDir,
  audioDir,
  basename,
  cacheDir,
  configDir,
  dataDir,
  desktopDir,
  dirname,
  documentDir,
  downloadDir,
  extname,
  homeDir,
  isAbsolute,
  join,
  normalize,
  publicDir,
  resolve,
  sep,
  tempDir,
  templateDir
} from '@tauri-apps/api/path';

// 定义数据类型
interface PathDataType {
  key: string;
  name: string;
  value: string;
}

export default function HomeView() {
  const [dataSource, setDataSource] = useState<PathDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaths = async () => {
      try {
        setLoading(true);
        const home = await homeDir();
        const docPath = await documentDir();
        const fullPath = await resolve(docPath, 'example.txt');

        const paths: PathDataType[] = [
          {key: '1', name: 'appConfigDir()', value: await appConfigDir()},
          {key: '2', name: 'appDataDir()', value: await appDataDir()},
          {key: '3', name: 'audioDir()', value: await audioDir()},
          {key: '4', name: 'binaryDir()', value: 'null'},
          {key: '5', name: 'cacheDir()', value: await cacheDir()},
          {key: '6', name: 'configDir()', value: await configDir()},
          {key: '7', name: 'dataDir()', value: await dataDir()},
          {key: '8', name: 'desktopDir()', value: await desktopDir()},
          {key: '9', name: 'documentDir()', value: docPath},
          {key: '10', name: 'downloadDir()', value: await downloadDir()},
          {key: '13', name: 'homeDir()', value: home},
          {key: '15', name: 'logDir()', value: 'null'},
          {key: '17', name: 'publicDir()', value: await publicDir()},
          {key: '20', name: 'templateDir()', value: await templateDir()},
          {key: '21', name: 'tempDir()', value: await tempDir()},
          {key: '22', name: 'sep()', value: sep()},
          {key: '23', name: 'join(home, "abc", "file.txt")', value: await join(home, 'abc', 'file.txt')},
          {key: '24', name: 'resolve(docPath, "example.txt")', value: fullPath},
          {key: '25', name: 'basename(fullPath)', value: await basename(fullPath)},
          {key: '26', name: 'dirname(fullPath)', value: await dirname(fullPath)},
          {key: '27', name: 'extname(fullPath)', value: await extname(fullPath)},
          {key: '28', name: 'normalize("folder/../file.txt")', value: await normalize('folder/../file.txt')},
          {key: '29', name: 'isAbsolute(fullPath)', value: (await isAbsolute(fullPath)).toString()}
        ];

        setDataSource(paths);
      } catch (err) {
        console.error('路径加载失败:', err);
        alert('路径加载失败: ' + String(err));
      } finally {
        setLoading(false);
      }
    };

    loadPaths();
  }, []);

  // TDesign 表格列定义
  const columns: TableProps['columns'] = [
    {
      colKey: 'name',
      title: 'Path 名称',
      width: 250,
    },
    {
      colKey: 'value',
      title: '值',
    },
  ];

  return (
      <div className="p-6 max-w-3xl mx-auto">
        <Typography.Title className="mb-6">系统路径信息</Typography.Title>

        <Table
            loading={loading}
            columns={columns}
            data={dataSource}
            bordered
            rowKey="key"
        />
      </div>
  );
}
