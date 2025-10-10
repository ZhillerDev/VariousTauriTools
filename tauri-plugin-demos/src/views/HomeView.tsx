import {useEffect, useState} from 'react';
import type {TableColumnsType} from 'antd';
import {Flex, message, Table, Typography} from 'antd';
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

const {Text} = Typography;

interface PathDataType {
  key: string;
  name: string;
  value: string;
}

const columns: TableColumnsType<PathDataType> = [
  {
    title: 'Path 名称',
    dataIndex: 'name',
    key: 'name',
    width: 250
  },
  {
    title: '值',
    dataIndex: 'value',
    key: 'value',
    render: (text: string) => <Text copyable>{text || '[空]'}</Text>
  }
];

export default function HomeView() {
  const [dataSource, setDataSource] = useState<PathDataType[]>([]);

  useEffect(() => {
    const loadPaths = async () => {
      try {
        const home = await homeDir();
        const docPath = await documentDir();
        const fullPath = await resolve(docPath, 'example.txt');

        const paths: PathDataType[] = [
          {key: '1', name: 'appConfigDir()', value: await appConfigDir()},
          {key: '2', name: 'appDataDir()', value: await appDataDir()},
          {key: '3', name: 'audioDir()', value: await audioDir()},
          {key: '4', name: 'binaryDir()', value: "null"},
          {key: '5', name: 'cacheDir()', value: await cacheDir()},
          {key: '6', name: 'configDir()', value: await configDir()},
          {key: '7', name: 'dataDir()', value: await dataDir()},
          {key: '8', name: 'desktopDir()', value: await desktopDir()},
          {key: '9', name: 'documentDir()', value: docPath},
          {key: '10', name: 'downloadDir()', value: await downloadDir()},
          {key: '13', name: 'homeDir()', value: home},
          {key: '15', name: 'logDir()', value: "null"},
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
        message.error('路径加载失败: ' + String(err));
      }
    };

    loadPaths();
  }, []);

  return (
      <Flex vertical gap="middle" className="p-6 max-w-6xl mx-auto">
        <Table<PathDataType>
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            rowKey="key"
            scroll={{y: 600}}
            summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>路径项总数</Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text type="secondary">{dataSource.length}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
            )}
        />
      </Flex>
  );
}
