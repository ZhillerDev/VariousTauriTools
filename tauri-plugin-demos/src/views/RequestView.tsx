import {Flex} from "antd";

function RequestView() {
  return (
      <Flex vertical gap="middle" className="p-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-center mb-6 font-bold text-gray-800">
            网络请求测试
          </h1>
        </div>
      </Flex>
  );
}

export default RequestView;
