import { response } from './response';

export function handleEntriesGet(event: any, entryId: number): any {
    return response(event, 200, { body: "good good" });
}