import { Util } from './util';

export class MockBackend {
    private entries: { [key: string]: any };

    constructor() {
        this.entries = {};

        this.addEntry(Util.today(), "This is the entry for today.");
        this.addEntry(Util.daysAgo(1), "This is the entry for yesterday.");
        this.addEntry(Util.daysAgo(2), "This is the entry for the day before yesterday.");
        this.addEntry(Util.daysAgo(3), "This is the entry for three days ago.");
    }

    async getEntry(entryId: string): Promise<any | null> {
        console.log("getEntry", entryId);
        return this.entries[entryId];
    }

    async postEntry(entry: any): Promise<boolean> {
        console.log("postEntry", entry.entryId, entry);
        this.entries[entry.entryId] = Object.assign(entry);
        return true;
    }

    private addEntry(entryId: string, body: string): void {
        this.entries[entryId] = { entryId, body };
    }
}