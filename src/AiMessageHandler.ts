import { aiChat } from './aiBackend';
import { BusyIndicator } from './BusyIndicator';
import { MessageList, MessageDto } from './MessageList';

async function talkToAiBackend(messages: MessageDto[], onUpdate: (responsePart: string) => void) {
    const responseStream = await aiChat(messages)

    let response = '';
    
    for await (const chunk of responseStream) {
        response += chunk.content;
        // await new Promise(resolve => setTimeout(resolve, 400));
        onUpdate(response);
    }
}

export class AiMessageHandler {
    private messageList: MessageList;
    private busyIndicator: BusyIndicator;

    constructor(messageList: MessageList, busyIndicator: BusyIndicator) {
        this.messageList = messageList;
        this.messageList.subscribe(this.handleNewMessage.bind(this)); // Subscribe to the message list

        this.busyIndicator = busyIndicator;
    }

    // Handle new messages from the message list
    private async handleNewMessage(messages: MessageDto[]) {
        const lastMessage = messages[messages.length - 1];

        // If the last message is from the user, initiate AI response
        if (lastMessage?.who === 'user') {
            this.busyIndicator.setBusy(true);
            this.injectEmptySystemMessage(); // Insert a placeholder message for AI response
            await this.handleAiResponse(); // Talk to AI and stream the response
            this.busyIndicator.setBusy(false);
        }
    }

    // Inject an empty message to indicate the AI is "thinking"
    private injectEmptySystemMessage() {
        this.messageList.addMessage({
            id: `system-${Date.now()}`, // Generate a unique ID
            text: '',
            who: 'system',
        });
    }

    // Handle the AI response, streaming it to the MessageList
    private async handleAiResponse() {
        await talkToAiBackend(this.messageList.getMessages().slice(0, -1), (responsePart: string) => {
            this.messageList.updateLastMessage(responsePart); // Stream the AI response
        });
    }

    // Clean up subscriptions when necessary
    public cleanup() {
        this.messageList.unsubscribe(this.handleNewMessage.bind(this)); // Unsubscribe from message list
    }
}
