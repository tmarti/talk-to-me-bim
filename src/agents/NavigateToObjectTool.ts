// NavigateToObjectTool.ts

import { DynamicStructuredTool } from 'langchain/tools';
import { BimModelInterface } from '../BimModelInterface';
import { z } from "zod";

export class NavigateToObjectTool extends DynamicStructuredTool {
    constructor() {
        super({
            name: 'navigate_to_object',
            description: 'Navigates to and isolates a specified object in the BIM viewer by its ID.',
            schema: z.object({
              objectId: z.string().describe("The object ID"),
            }),
            func: async ({objectId}:{objectId:string}) => {
              return await BimModelInterface.navigateToObject(objectId);
            }
        });
    }
}
