import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    MessageSeparator,
    TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
// import { MessageDirection } from "@chatscope/chat-ui-kit-react/src/types/unions";
import * as styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useEffect, useState } from "react";
import { MessageDto, MessageList as MyMessageList } from "./MessageList";
import { ObjectSelection } from "./ObjectSelection";
import { Entity } from "@xeokit/xeokit-sdk";
import { getXeokit } from "./XeokitSingleton";
import { BusyIndicator } from "./BusyIndicator";
import DOMPurify from 'dompurify';

const _b = styles;

import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

// Override code block renderer
md.renderer.rules.code_block = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    return '<pre class="inline-code">' + md.utils.escapeHtml(token.content) + '</pre>\n';
};

// Override fenced code block renderer
md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    return '<pre class="inline-code">' + md.utils.escapeHtml(token.content) + '</pre>\n';
};

// Override inline code renderer
md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    return '<span class="inline-code">' + md.utils.escapeHtml(token.content) + '</span>';
};

const markdownToHtml = (markdown: string) => {
    const html = md.render(markdown);
    const safeHtml = DOMPurify.sanitize(html, { SAFE_FOR_TEMPLATES: true });
    return safeHtml;
};

export const ChatComponent: React.FC<{ messageList: MyMessageList, objectSelection: ObjectSelection, busyIndicator: BusyIndicator }> = ({ messageList, objectSelection, busyIndicator }) => {
    
    const viewer = getXeokit();

    const [messages, setMessages] = useState(messageList.getMessages());
    const [thinking, setThinking] = useState(false);

    useEffect(() => {
        // Callback to update messages in the component
        const updateMessages = (newMessages: MessageDto[]) => {
            setMessages(newMessages);
        };

        // Subscribe to message updates
        messageList.subscribe(updateMessages);

        const handleSelectionChange = (object: Entity | null) => {
            if (!object) {
                return;
            }

            const meta = viewer?.metaScene.metaObjects[object.id]!;

            messageList.addMessage({
                id: (new Date()).getTime().toString(),
                text: `ℹ️  You have selected the **${meta.type}** with id **${meta.id}**

You can ask any question you have about the object.

Suggestions: [isolate the object](#isolate-object), or [inspect the most relevant object properties](#show-object-data)
`,
                who: "system"
            });
            // console.log(`Selected object ID is now: ${objectId}`);
        };
        
        objectSelection.subscribe(handleSelectionChange);
        
        const handleBusyChange = (isBusy: boolean) => {
            setThinking(isBusy)
        };;
        
        busyIndicator.subscribe(handleBusyChange);

        // Cleanup function to unsubscribe when component unmounts
        return () => {
            messageList.unsubscribe(updateMessages);
            objectSelection.unsubscribe(handleSelectionChange);
            busyIndicator.unsubscribe(handleBusyChange);
        };
    }, [messageList]);

    const handleSend = async (text: string) => {
        messageList.addMessage({
            id: (new Date()).getTime().toString(),
            text,
            who: "user"
        });
    };

    return (
        <div className="chat-component"
             style={{
                background: 'white'
            }}
        >
            <MainContainer>
                <ChatContainer>
                    <MessageList
                        typingIndicator={thinking?<TypingIndicator content="Thinking..." />:null}
                    >
                        {messages.filter(m => !m.hidden).map(msg => (
                            <Message key={msg.id} model={{
                                message: markdownToHtml(msg.text),
                                direction: msg.who == 'user' ? 'outgoing' : 'incoming',
                                position: 'normal',
                            }} style={{
                                maxWidth: '400px',
                                overflowX: 'auto'
                            }}/>
                        ))}
                    </MessageList>
                    <MessageInput
                        placeholder="Type message here"
                        onSend={handleSend}
                    />
                </ChatContainer>
            </MainContainer>
        </div>
    );
};