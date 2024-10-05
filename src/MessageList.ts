export type MessageDto = {
    id: string;
    text: string;
    who: 'system' | 'user';
    hidden?: boolean;
};

export class MessageList {
    private messages: MessageDto[] = [];
    private subscribers: ((messages: MessageDto[]) => void)[] = [];

    constructor(initialMessages: MessageDto[] = []) {
        this.messages = initialMessages;
    }

    // Method to add a new message
    addMessage(message: MessageDto) {
        this.messages.push(message);
        this.notifySubscribers();
    }

    // Method to update the last message (useful for streaming AI responses)
    updateLastMessage(newText: string) {
        if (this.messages.length === 0) return;
        
        // Update the last message text
        const lastMessage = this.messages[this.messages.length - 1];
        this.messages[this.messages.length - 1] = { ...lastMessage, text: newText };

        // Notify subscribers of the updated messages
        this.notifySubscribers();
    }

    // Subscribe method for React component to register a callback
    subscribe(callback: (messages: MessageDto[]) => void) {
        this.subscribers.push(callback);
    }

    // Unsubscribe method to remove the callback when the component unmounts
    unsubscribe(callback: (messages: MessageDto[]) => void) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    // Notify subscribers (React component in this case)
    private notifySubscribers() {
        this.subscribers.forEach(callback => callback([...this.messages]));
    }

    // Method to get current messages
    getMessages() {
        return [...this.messages];
    }
}