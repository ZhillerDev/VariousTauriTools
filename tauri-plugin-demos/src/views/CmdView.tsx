import {invoke} from "@tauri-apps/api/core";
import {ActionCard, CardItem} from "../components/CardComps.tsx";

function CmdView() {

  const runCalc = async () => {
    await invoke("open_calc");
  };
  const runNotepad = async () => {
    await invoke("open_notepad");
  };

  const cmdCards: CardItem[] = [
    {
      label: '计算器',
      description: '打开计算器',
      color: '#52c41a',
      action: runCalc
    },
    {
      label: '记事本',
      description: '打开记事本',
      color: '#52c41a',
      action: runNotepad

    }
  ]

  return (
      <div className="p-6 w-full mx-auto">
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: 600
        }}>
          通知测试
        </h1>
        {/* 卡片网格布局 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {cmdCards.map((item, index) => (
              <ActionCard key={index} item={item}/>
          ))}
        </div>
      </div>
  );
}

export default CmdView;
