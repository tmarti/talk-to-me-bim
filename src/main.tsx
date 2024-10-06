import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Viewer, XKTLoaderPlugin } from '@xeokit/xeokit-sdk'
import { MessageList } from './MessageList.ts'
import { ObjectSelection } from './ObjectSelection.ts'
import { setXeokit } from './XeokitSingleton.ts'
import { AiMessageHandler } from './AiMessageHandler'
import { BusyIndicator } from './BusyIndicator.ts'

import initSqlJs from 'sql.js';
import { setSqlite } from './SqliteSingleton.ts'

const initDb = async (dbUrl: string) => {
  // Initialize sql.js
  const SQL = await initSqlJs({
    locateFile: () => `public/sql-wasm.wasm`,
  });

  // Load your existing database file
  const dbFileArrayBuffer = await fetch(dbUrl).then(res => res.arrayBuffer());

  // Create a database instance
  const db = new SQL.Database(new Uint8Array(dbFileArrayBuffer));

  return db;
};

(async () => {
  const db = await initDb('public/Duplex.sqlite');

  setSqlite(db);

  const canvasElement = document.getElementById('xeokit-canvas') as HTMLCanvasElement;

  const viewer = new Viewer({
    canvasElement,
    transparent: true,
    antialias: true,
  });

  setXeokit(viewer);

  const loader = new XKTLoaderPlugin(viewer, {
    objectDefaults: {
      // @ts-ignore
      DEFAULT: null,
      IfcSpace: {
        pickable: false,
        visible: false,
      }
    }
  });

  const model = loader.load({
    id: 'my-model',
    src: 'public/Duplex.xkt'
  });
  
  model.on('loaded', () => viewer.cameraFlight.flyTo());

  let canvasPos = [0, 0];

  canvasElement.addEventListener('mousedown', ev => {
    canvasPos = [ev.clientX, ev.clientY];
  });

  const objectSelection = new ObjectSelection();

  canvasElement.addEventListener('mouseup', ev => {
    if (Math.abs(ev.clientX - canvasPos[0]) > 10) return;
    if (Math.abs(ev.clientY - canvasPos[1]) > 10) return;

    model.entityList.forEach (e => e.highlighted = false);

    const entity = viewer.scene.pick({canvasPos })?.entity ?? null;

    if (entity) {
      entity.highlighted = true;
    }

    objectSelection.setSelectedObject(entity);
  });

  const messageList = new MessageList();

  messageList.addMessage({
    id: "1",
    text: `**Welcome to talk2meBim 🤗**`,
    who: 'system'
  });

  const busyIndicator = new BusyIndicator();
  const _aiMessageHandler = new AiMessageHandler(messageList, busyIndicator);

  createRoot(document.getElementById('react-root')!).render(
    <StrictMode>
      <App messageList={messageList} objectSelection={objectSelection} busyIndicator={busyIndicator}/>
    </StrictMode>,
  )
})()