import { Entity } from "@xeokit/xeokit-sdk";

export class ObjectSelection {
    private selectedObject: Entity | null = null;
    private subscribers: ((object: Entity | null) => void)[] = [];

    // Method to set the selected object ID
    setSelectedObject(object: Entity | null) {
        this.selectedObject = object;
        this.notifySubscribers();
    }

    // Method to clear the selection (optional)
    clearSelection() {
        this.selectedObject = null;
        this.notifySubscribers();
    }

    // Method to get the current selected object ID
    getSelectedObject(): Entity | null {
        return this.selectedObject;
    }

    // Subscribe method for other classes to register a callback
    subscribe(callback: (object: Entity | null) => void) {
        this.subscribers.push(callback);
    }

    // Unsubscribe method to remove a callback
    unsubscribe(callback: (object: Entity | null) => void) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    // Notify subscribers of selection changes
    private notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.selectedObject));
    }
}
