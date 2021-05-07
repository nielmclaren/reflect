export class Util {
    static dateToString(date: Date): string {
        // Returns a date string for the given date in the local timezone.
        const offset = (new Date()).getTimezoneOffset() * 60000; // Offset in milliseconds
        return (new Date(date.getTime() - offset)).toISOString().slice(0, 10);
    }

    static dateToTimeString(date: Date): string {
        // Returns a time string for the given date in the local timezone.
        const offset = (new Date()).getTimezoneOffset() * 60000; // Offset in milliseconds
        return (new Date(date.getTime() - offset)).toISOString().slice(11, 19);
    }

    static daysAgoString(daysAgo: number): string {
        return this.dateToString(this.daysAgo(daysAgo));
    }

    static daysAgo(daysAgo: number): Date {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return d;
    }

    static isToday(date: Date): boolean {
        return this.daysAgoString(0) === this.dateToString(date);
    }

    static isYesterday(date: Date): boolean {
        return this.daysAgoString(1) === this.dateToString(date);
    }

    static isEditableDate(candidate: Date, now: Date = new Date()): boolean {
        return this.isToday(candidate) || (this.isYesterday(candidate) && this.dateToTimeInMs(now) < 6 * 60 * 60 * 1000);
    }

    static dateToTimeInMs(date: Date): number {
        const second = 1000;
        const minute = 60 * second;
        const hour = 60 * minute;
        return date.getHours() * hour + date.getMinutes() * minute + date.getSeconds() * second;
    }

    static isLocalhost() {
        return window.location.href.startsWith("http://localhost:3000");
    }

    static async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}