import { Util } from './util';

export class MockBackend {
    private entries: { [key: string]: any };

    constructor() {
        this.entries = {};

        this.mockEntry(Util.today(), "This is the entry for today.");
        this.mockEntry(Util.daysAgo(1), "This is the entry for yesterday.");
        this.mockEntry(Util.daysAgo(2), "This is the entry for the day before yesterday.");
        this.mockEntry(Util.daysAgo(3), "This is the entry for three days ago.");
    }

    async getEntry(entryId: string): Promise<any | null> {
        console.log("getEntry", entryId);
        await Util.sleep(3000);
        return this.entries[entryId];
    }

    async postEntry(entry: any): Promise<boolean> {
        console.log("postEntry", entry.entryId, entry);
        await Util.sleep(3000);
        this.entries[entry.entryId] = Object.assign(entry);
        return true;
    }

    private mockEntry(entryId: string, body: string): void {
        this.entries[entryId] = { entryId, body };
    }
}