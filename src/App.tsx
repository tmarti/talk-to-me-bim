import './App.css'
import { BusyIndicator } from './BusyIndicator'
import { ChatComponent } from './ChatComponent'
import { MessageList } from './MessageList'
import { ObjectSelection } from './ObjectSelection'

function App({messageList,objectSelection, busyIndicator}: {messageList: MessageList, objectSelection: ObjectSelection, busyIndicator: BusyIndicator}) {
  return (
    <>
      <ChatComponent messageList={messageList} objectSelection={objectSelection} busyIndicator={busyIndicator}></ChatComponent>
    </>
  )
}

export default App
