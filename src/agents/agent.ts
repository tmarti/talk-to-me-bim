import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { ModelLookupTool } from './ModelLookupTool';
import { AggegatedDataQuestionTool } from './AggegatedDataQuestionTool';
import { NavigateToObjectTool } from './NavigateToObjectTool';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const openAIApiKey = '{your-key-here}';

// Function to handle user input
export async function handleUserInput(messages: (HumanMessage | SystemMessage)[]) {
    const llm = new ChatOpenAI({
        openAIApiKey,
        temperature: 0,
        streaming: true,
        model: 'gpt-4o-mini'
    });
      
    // Define your tools
    const tools = [
        new ModelLookupTool(),
        new AggegatedDataQuestionTool(),
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

    // Create an async generator function to stream the response
    async function* streamResponse() {
        const queue: string[] = [];
        let isDone = false;
    
        // Callback handlers to process streaming tokens
        const callbacks = {
            handleLLMNewToken: (token: string) => {
                queue.push(token);
            },
            handleAgentEnd: () => {
                isDone = true;
            },
        };
    
        // Start the agent executor without awaiting it
        agentExecutor.invoke(
        {
            input: messages.at(-1)?.content,
            chat_history: messages.slice(0, -1),
        },
        {
            callbacks: [callbacks],
        }
        );
    
        // Yield tokens as they become available
        while (!isDone || queue.length > 0) {
            if (queue.length > 0) {
                const tata = queue.shift();
                yield tata;
            } else {
                // Wait briefly before checking the queue again
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
        }
    }

    return streamResponse();
}