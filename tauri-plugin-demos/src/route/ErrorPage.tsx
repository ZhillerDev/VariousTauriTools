import {isRouteErrorResponse, Link, useRouteError} from 'react-router';
import {Button, Card, Space, Typography} from 'tdesign-react';


const {Title, Text} = Typography;

const ErrorPage = () => {
  const error = useRouteError();

  const getErrorConfig = () => {
    if (isRouteErrorResponse(error)) {
      return {
        status: error.status === 404 ? '404' : 'error',
        title: error.status === 404 ? '404' : error.status,
        subTitle: error.status === 404
            ? '页面离家出走了...'
            : error.data?.message || error.statusText
      };
    }
    return {
      status: 'error',
      title: '系统异常',
      subTitle: error instanceof Error
          ? error.message
          : '未知错误，请联系管理员'
    };
  };

  const {status, subTitle} = getErrorConfig();

  return (
      <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{maxWidth: '400px', width: '100%'}}>
            <Card bordered={false}>
              <div style={{textAlign: 'center'}}>
                <Title level={3} style={{margin: '0 0 16px 0'}}>
                  {status === '404' ? '404' : '系统错误'}
                </Title>
                <Text style={{fontSize: '16px', color: '#666'}}>
                  {subTitle}
                </Text>
                <div style={{marginTop: '24px'}}>
                  <Space>
                    <Link to="/home">
                      <Button
                          theme="primary"
                          size="large"
                      >
                        回到面板首页
                      </Button>
                    </Link>
                  </Space>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default ErrorPage;