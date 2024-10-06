import { DynamicStructuredTool } from 'langchain/tools';
import { BimModelInterface } from '../BimModelInterface';
import { z } from "zod";

export class AggegatedDataQuestionTool extends DynamicStructuredTool {
    constructor() {
        super({
            name: 'aggregated_question',
            description: 'Answers questions related to data aggregation in the BIM model based in a natural language query.',
            schema: z.object({
                question: z.string().describe("The original user question"),
            }),
            func: async ({question}:{question:string}) => {
                return await BimModelInterface.aggregatedDataQuestion(question);
            }
        });
    }
}
