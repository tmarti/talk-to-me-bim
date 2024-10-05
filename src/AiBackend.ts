import { MessageDto } from "./MessageList";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { handleUserInput } from "./agents/agent";

function mapMessagesToLangchain(messages: MessageDto[]) {
  return messages.map(message => {
      if (message.who === 'system') {
          return new SystemMessage(message.text);
      } else {
          return new HumanMessage(message.text);
      }
  });
}

export async function aiChat(messages: MessageDto[]) {  
  const langchainMessages = mapMessagesToLangchain(messages);

  return handleUserInput(langchainMessages);
}