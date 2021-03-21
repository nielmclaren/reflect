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