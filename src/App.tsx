import { useEffect } from 'react'
import './App.css'
import { BusyIndicator } from './BusyIndicator'
import { ChatComponent } from './ChatComponent'
import { MessageList } from './MessageList'
import { ObjectSelection } from './ObjectSelection'
import { handleSuggestionLink } from './handleSuggestionLink'

function App({messageList,objectSelection, busyIndicator}: {messageList: MessageList, objectSelection: ObjectSelection, busyIndicator: BusyIndicator}) {
  useEffect(() => {
    // Event handler function
    function handleLinkClick(event: MouseEvent) {
      const target = event.target as HTMLLinkElement;
      if (target && target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        event.preventDefault();

        handleSuggestionLink(target.getAttribute('href')!, messageList);
      }
    }

    // Attach the event listener
    document.addEventListener('click', handleLinkClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return (
    <>
      <ChatComponent messageList={messageList} objectSelection={objectSelection} busyIndicator={busyIndicator}></ChatComponent>
    </>
  )
}

export default App
