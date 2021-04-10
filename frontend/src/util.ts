export class Util {
    static dateToString(date: Date): string {
        // Returns a date string for the given date in the local timezone.
        const offset = (new Date()).getTimezoneOffset() * 60000; // Offset in milliseconds
        return (new Date(date.getTime() - offset)).toISOString().slice(0, 10);
    }

    static today(): string {
        return Util.dateToString(new Date());
    }

    static daysAgo(daysAgo: number): string {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return Util.dateToString(d);
    }

    static isLocalhost() {
        return window.location.href.startsWith("http://localhost:3000");
    }

    static async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}