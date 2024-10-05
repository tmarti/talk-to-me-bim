import { DynamicStructuredTool } from 'langchain/tools';
import { BimModelInterface } from '../BimModelInterface';
import { z } from "zod";

export class ModelLookupTool extends DynamicStructuredTool {
    constructor() {
        super({
            name: 'object_question',
            description: 'Displays data related to a specified object in the BIM model by its ID.',
            schema: z.object({
                objectId: z.string().describe("The object ID"),
            }),
            func: async ({objectId}:{objectId:string}) => {
                return await BimModelInterface.modelLookup(objectId);
            }
        });
    }
}
