import {Button} from 'tdesign-react';
import {TElement} from "tdesign-react/es/common";

// 定义卡片项接口
interface CardItem {
  label: string;
  description: string;
  color: string;
  action?: () => void;
  icon?: TElement;
}

// Action Card - 带点击动作的卡片（已修复左对齐问题）
const ActionCard = ({item}: { item: CardItem }) => {
  return (
      <Button
          variant="outline"
          onClick={item.action}
          style={{
            width: '100%',
            borderColor: item.color,
            backgroundColor: 'transparent',
            color: 'inherit',
            padding: '16px',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            borderRadius: '8px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            // 关键修改：确保文本内容左对齐
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 8px ${item.color}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
          }}
      >
        {item.icon && <span style={{fontSize: '20px'}}>{item.icon}</span>}
        <div style={{
          // 关键修改：使用 flex 和 text-align 确保左对齐
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          textAlign: 'left' // 确保内部文本左对齐
        }}>
          <h3 style={{
            margin: 0,
            color: item.color,
            fontSize: '16px',
            fontWeight: 500,
            // 关键修改：确保标题左对齐
            textAlign: 'left'
          }}>
            {item.label}
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#888',
            // 关键修改：确保描述左对齐
            textAlign: 'left'
          }}>
            {item.description}
          </p>
        </div>
      </Button>
  );
};

// Info Card - 信息提示卡片
const InfoCard = ({item}: { item: CardItem }) => {
  return (
      <div
          style={{
            backgroundColor: '#e3f2fd',
            border: `1px solid #90caf9`,
            borderRadius: '8px',
            padding: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
          }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          {item.icon && <span style={{color: item.color, fontSize: '20px'}}>{item.icon}</span>}
          <h3 style={{margin: 0, color: item.color, fontSize: '16px', fontWeight: 500}}>
            {item.label}
          </h3>
        </div>
        <p style={{margin: '0', fontSize: '12px', color: '#546e7a'}}>
          {item.description}
        </p>
      </div>
  );
};

// Warning Card - 警告提示卡片
const WarningCard = ({item}: { item: CardItem }) => {
  return (
      <div
          style={{
            backgroundColor: '#fff8e1',
            border: `1px solid #ffe082`,
            borderRadius: '8px',
            padding: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          {item.icon && <span style={{color: item.color, fontSize: '20px'}}>{item.icon}</span>}
          <h3 style={{margin: 0, color: item.color, fontSize: '16px', fontWeight: 500}}>
            {item.label}
          </h3>
        </div>
        <p style={{margin: '0', fontSize: '12px', color: '#e65100'}}>
          {item.description}
        </p>
      </div>
  );
};

// Error Card - 错误提示卡片
const ErrorCard = ({item}: { item: CardItem }) => {
  return (
      <div
          style={{
            backgroundColor: '#ffebee',
            border: `1px solid #ef9a9a`,
            borderRadius: '8px',
            padding: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          {item.icon && <span style={{color: item.color, fontSize: '20px'}}>{item.icon}</span>}
          <h3 style={{margin: 0, color: item.color, fontSize: '16px', fontWeight: 500}}>
            {item.label}
          </h3>
        </div>
        <p style={{margin: '0', fontSize: '12px', color: '#c62828'}}>
          {item.description}
        </p>
      </div>
  );
};

// 导出所有卡片组件
export {ActionCard, InfoCard, WarningCard, ErrorCard};