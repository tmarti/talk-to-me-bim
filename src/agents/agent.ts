import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { ModelLookupTool } from './ModelLookupTool';
import { ObjectQuestionTool } from './ObjectQuestionTool';
import { NavigateToObjectTool } from './NavigateToObjectTool';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const openAIApiKey = '{your key here}';

// Function to handle user input
export async function handleUserInput(messages: (HumanMessage | SystemMessage)[]) {
    const llm = new ChatOpenAI({
        openAIApiKey,
        temperature: 0,
        streaming: true,
    });
      
    // Define your tools
    const tools = [
        new ModelLookupTool(),
        // new ObjectQuestionTool(),
        new NavigateToObjectTool(),
    ];

    // Get the prompt to use - you can modify this!
    // If you want to see the prompt in full, you can at:
    // https://smith.langchain.com/hub/hwchase17/openai-functions-agent
    const prompt = await pull<ChatPromptTemplate>(
        "hwchase17/openai-functions-agent"
    );      

    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools,
        prompt
    });

    // Initialize the agent executor
    const agentExecutor = new AgentExecutor({
        agent,
        tools,
    });

    // Call the executor with the user input and chat history
    const response = await agentExecutor.invoke({
        input: messages.at(-1)?.content,
        chat_history: messages.slice(0, -1),
    });

    return response.output as string;
}