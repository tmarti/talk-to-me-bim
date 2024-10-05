import { DynamicStructuredTool } from 'langchain/tools';
import { BimModelInterface } from '../BimModelInterface';
import { z } from "zod";

export class ObjectQuestionTool extends DynamicStructuredTool {
    constructor() {
        super({
            name: 'object_question',
            description: 'Answers questions related to a specified object in the BIM model by its ID.',
            schema: z.object({
                question: z.string().describe("The original user question"),
                objectId: z.string().describe("The object ID"),
            }),
            func: async ({objectId, question}:{objectId:string, question:string}) => {
                return await BimModelInterface.objectQuestion(objectId, question);
            }
        });
    }
}
