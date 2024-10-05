import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { MessageDto } from "./MessageList";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Insert here your openai API key
const openAIApiKey = '{your-key-here}';

const openai = new ChatOpenAI({
  openAIApiKey,
  streaming: true,
});

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

  return openai.stream(langchainMessages);
}