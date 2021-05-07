import { Util } from "./util";

describe('Util', () => {
    describe('isEditableDate', () => {
        let now: Date;
        let earlyEnough: Date;
        let tooLate: Date;

        beforeEach(() => {
            now = new Date();
            earlyEnough = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 59, 59);
            tooLate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);
        });

        it('allows editing today', () => {
            expect(Util.isEditableDate(new Date(), now)).toBe(true);
            expect(Util.isEditableDate(new Date(), earlyEnough)).toBe(true);
            expect(Util.isEditableDate(new Date(), tooLate)).toBe(true);
        });

        it('allows editing yesterday until the wee hours of the morning', () => {
            const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            expect(Util.isEditableDate(yesterday, now)).toBe(false);
            expect(Util.isEditableDate(yesterday, earlyEnough)).toBe(true);
            expect(Util.isEditableDate(yesterday, tooLate)).toBe(false);
        });

        it('does not allow editing days before yesterday', () => {
            const theDayBeforeYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
            expect(Util.isEditableDate(theDayBeforeYesterday, now)).toBe(false);
            expect(Util.isEditableDate(theDayBeforeYesterday, earlyEnough)).toBe(false);
            expect(Util.isEditableDate(theDayBeforeYesterday, tooLate)).toBe(false);

            const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            expect(Util.isEditableDate(lastWeek, now)).toBe(false);
            expect(Util.isEditableDate(lastWeek, earlyEnough)).toBe(false);
            expect(Util.isEditableDate(lastWeek, tooLate)).toBe(false);
        });

        it('does not allow editing days after today', () => {
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            expect(Util.isEditableDate(tomorrow, now)).toBe(false);
            expect(Util.isEditableDate(tomorrow, earlyEnough)).toBe(false);
            expect(Util.isEditableDate(tomorrow, tooLate)).toBe(false);

            const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
            expect(Util.isEditableDate(nextWeek, now)).toBe(false);
            expect(Util.isEditableDate(nextWeek, earlyEnough)).toBe(false);
            expect(Util.isEditableDate(nextWeek, tooLate)).toBe(false);
        });
    });

    describe('dateToTime', () => {
        it('should give the correct time', () => {
            const second = 1000;
            const minute = 60 * second;
            const hour = 60 * minute;

            expect(Util.dateToTimeInMs(new Date(2020, 0, 1, 5, 30, 15))).toBe(5 * hour + 30 * minute + 15 * second);
            expect(Util.dateToTimeInMs(new Date(1980, 11, 25, 17, 15, 59))).toBe(17 * hour + 15 * minute + 59 * second);
        });
    });
});