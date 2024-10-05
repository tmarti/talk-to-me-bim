export class BusyIndicator {
    private busy: boolean = false;
    private subscribers: ((isBusy: boolean) => void)[] = [];

    // Method to set the busy flag
    setBusy(isBusy: boolean) {
        if (this.busy !== isBusy) {
            this.busy = isBusy;
            this.notifySubscribers();
        }
    }

    // Method to get the current busy flag state
    getBusy(): boolean {
        return this.busy;
    }

    // Subscribe method for other classes/components to register a callback
    subscribe(callback: (isBusy: boolean) => void) {
        this.subscribers.push(callback);
    }

    // Unsubscribe method to remove a callback
    unsubscribe(callback: (isBusy: boolean) => void) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    // Notify subscribers of busy state changes
    private notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.busy));
    }
}
