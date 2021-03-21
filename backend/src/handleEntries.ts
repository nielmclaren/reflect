import { Database } from './database';
import { response } from './response';

type Dependencies = {
    database: Database;
};

export async function handleEntriesGet(event: any, entryId: string, dependencies: Dependencies): Promise<any> {
    console.log("handleEntriesGet");
    console.log("entryId", { entryId });
    const entry = await dependencies.database.getEntry(entryId);
    return response(event, 200, { body: entry.body });
}

export async function handleEntriesPost(event: any, entryId: string, entry: any, dependencies: Dependencies): Promise<any> {
    console.log("handleEntriesPost");
    console.log("entryId", { entryId });
    console.log("entry", { entry });
    entry.entryId = entryId;
    await dependencies.database.updateEntry(entry);
    return response(event, 200, {});
}