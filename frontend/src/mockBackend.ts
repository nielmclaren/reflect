import { Util } from './util';

export class MockBackend {
    private entries: { [key: string]: any };

    constructor() {
        this.entries = {};

        this.mockEntry(Util.daysAgo(0), "This is the entry for today.", "Today's moment.");
        this.mockEntry(Util.daysAgo(1), "This is the entry for yesterday.", "Yesterday's moment.");
        this.mockEntry(Util.daysAgo(2), "This is the entry for the day before yesterday.", "A recent moment.");
        this.mockEntry(Util.daysAgo(3), "This is the entry for three days ago.", "A recent moment.");
    }

    async getEntry(entryId: string): Promise<any | null> {
        console.log("getEntry", entryId);
        await Util.sleep(500);
        return this.entries[entryId];
    }

    async postEntry(entry: any): Promise<boolean> {
        console.log("postEntry", entry.entryId, entry);
        await Util.sleep(500);
        this.entries[entry.entryId] = Object.assign(entry);
        return true;
    }

    private mockEntry(date: Date, body: string, moment: string): void {
        const entryId = Util.dateToString(date);
        const created = new Date(date);
        created.setHours(21);
        created.setMinutes(30);
        created.setSeconds(59);
        this.entries[entryId] = { entryId, body, moment, created };
    }
}