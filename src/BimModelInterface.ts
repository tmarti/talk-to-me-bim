// BimModelInterface.ts

import { VBOSceneModel } from "@xeokit/xeokit-sdk";
import { getXeokit } from "./XeokitSingleton";
import { ChatOpenAI } from "@langchain/openai";
import { openAIApiKey } from './agents/agent';
import { naturalLanguageToSqlitePrompt } from "./naturalLanguageToSqlitePrompt";
import { getSqlite } from "./SqliteSingleton";

export class BimModelInterface {
    /**
     * Displays data related to the last selected object in the BIM model.
     * @param input - Additional input if needed.
     * @returns A promise resolving to a string containing the object's details.
     */
    static async modelLookup(objectId: string): Promise<string> {
      // TODO: Implement your logic to retrieve and return data about the last selected object.
      // Example:
      // const selectedObject = await YourBIMModelAPI.getSelectedObject();
      // return formatObjectDetails(selectedObject);
      const xeokit = getXeokit()!;

      let result = 'These are the properties for the object:\n';

      xeokit.metaScene.metaObjects[objectId].propertySets.forEach(pset => {
        pset.properties.forEach(p => {
          result += `${pset.name}.${p.name}=${p.value}\n`;
        });
      });

      return result;
    }
  
    static async aggregatedDataQuestion(question: string): Promise<string> {

      const db = getSqlite();

      const llm = new ChatOpenAI({
        openAIApiKey,
        temperature: 0,
        streaming: true,
        model: 'gpt-4o-mini'
      });

      const result = await llm.invoke(
        naturalLanguageToSqlitePrompt(question)
      );

      let sql = result.content.toString();

      sql = sql.substring(7, sql.length - 4 ) + ';';

      // Execute a read-only query
      const sqlResult = db.exec(sql);
  
      // Process the result
      const plainTextResult = sqlResult[0].columns.join('|') + '\n' + sqlResult[0].values.map(v => v.join('|')).join('\n');
  
      return plainTextResult;
    }
  
    /**
     * Navigates to and isolates the object in the BIM viewer.
     * @param input - Additional input if needed.
     * @returns A promise resolving to a string confirming the navigation action.
     */
    static async navigateToObject(objectId: string): Promise<string> {
      // TODO: Implement your logic to navigate to the selected object in the BIM viewer.
      // Example:
      // await YourBIMViewerAPI.navigateToObject(selectedObjectId);
      const xeokit = getXeokit();
      (Object.values(xeokit!.scene.models)[0] as any as VBOSceneModel).entityList.forEach(e => e.visible = false);
      xeokit!.scene.objects[objectId].visible = true;
      await new Promise<void>(resolve => xeokit!.cameraFlight.flyTo(xeokit!.scene.objects[objectId], resolve));
      return "Done!";
    }
  }
  