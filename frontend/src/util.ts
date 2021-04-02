export class Util {
    static dateToString(date: Date): string {
        return date.toISOString().slice(0, 10);
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