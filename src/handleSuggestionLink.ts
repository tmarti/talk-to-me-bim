import { MessageList } from "./MessageList";

export const handleSuggestionLink = (href: string, messageList: MessageList) => {
    switch (href) {
        case '#isolate-object':
            messageList.addMessage({
                id: (new Date()).getTime().toString(),
                text: 'Isolate the last mentioned object',
                who: 'user',
                hidden: true,
            })
            break;
        case '#show-object-data':
            messageList.addMessage({
                id: (new Date()).getTime().toString(),
                text: 'Show me the most relevant data for the last selected object in table format',
                who: 'user',
                hidden: true,
            })
            break;
        default:
            break;
    }
}