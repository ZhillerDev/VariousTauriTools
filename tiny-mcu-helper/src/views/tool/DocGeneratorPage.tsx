import React from 'react';
import {invoke} from "@tauri-apps/api/core";
import {Button} from "tdesign-react";

function DocGeneratorPage() {
  const gen = async () => {
    await invoke("create_file")
  }
  return (
      <div>
        <Button onClick={() => {
          gen().then(r => r)
        }}/>
      </div>
  );
}

export default DocGeneratorPage;