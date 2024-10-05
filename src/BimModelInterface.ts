// BimModelInterface.ts

import { VBOSceneModel } from "@xeokit/xeokit-sdk";
import { getXeokit } from "./XeokitSingleton";

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
          result += `${pset.name}.${p.name}=${p.value}`;
        });
      });

      return result;
    }
  
    /**
     * Answers questions related to the last selected object in the BIM model.
     * @param question - The question to answer.
     * @returns A promise resolving to a string containing the answer.
     */
    static async objectQuestion(objectId: string, question: string): Promise<string> {
      console.log({question, objectId});
      // TODO: Implement your logic to answer questions about the selected object.
      // This may involve NLP processing and querying object properties.
      const xeokit = getXeokit();
      throw new Error('objectQuestion method not implemented.');
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
  
    /**
     * Sets the currently selected object in the BIM model.
     * @param objectId - The ID of the object to select.
     */
    static selectObject(objectId: string): void {
      // TODO: Implement your logic to set the selected object.
      // Example:
      // this.selectedObjectId = objectId;
      const xeokit = getXeokit();
      throw new Error('selectObject method not implemented.');
    }
  
    /**
     * Clears the current object selection.
     */
    static clearSelection(): void {
      // TODO: Implement your logic to clear the selected object.
      const xeokit = getXeokit();
      throw new Error('clearSelection method not implemented.');
    }
  }
  