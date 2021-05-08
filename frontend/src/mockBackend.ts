import { Util } from './util';

export class MockBackend {
    private entries: { [key: string]: any };

    constructor() {
        this.entries = {};

        this.mockEntry(Util.daysAgo(0), "This is the entry for today.", "Today's moment.", false);
        this.mockEntry(Util.daysAgo(1), "This is the entry for yesterday.", "Yesterday's moment.", false);
        this.mockEntry(Util.daysAgo(2), "This is the entry for the day before yesterday.", "A recent moment.", true);
        this.mockEntry(Util.daysAgo(3), "This is the entry for three days ago.", "A recent moment.", false);
    }

    async getEntry(entryId: string): Promise<any | null> {
        console.log("getEntry", entryId);
        await Util.sleep(500);
        return this.entries[entryId];
    }

    async postEntry(entry: any): Promise<boolean> {
        console.log("postEntry", entry.entryId, entry);
        await Util.sleep(500);
        this.entries[entry.entryId] = Object.assign(this.entries[entry.entryId], entry);
        return true;
    }

    private mockEntry(date: Date, body: string, moment: string, isRead: boolean): void {
        const entryId = Util.dateToString(date);
        const lastReadAt = Util.daysAgo(2).toISOString();
        const submittedAtDate = new Date(date);
        submittedAtDate.setHours(21);
        submittedAtDate.setMinutes(30);
        submittedAtDate.setSeconds(59);
        const submittedAt = submittedAtDate.toISOString();
        this.entries[entryId] = { entryId, body, submittedAt, isRead, lastReadAt, moment };
    }
}