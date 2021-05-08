import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { add } from 'date-fns';

import { Database } from './src/database';

let isInitialized = false;
let database = null;

export async function handler(event, context) {
  console.log("Invoke lambda.");
  console.log("event");
  console.log(event);
  console.log("context");
  console.log(context);

  await initialize();

  const startDate = new Date(2021, 3, 1);
  const endDate = new Date();

  for (let d = startDate; d.getTime() <= endDate.getTime(); d = add(d, { days: 1 })) {
    let entryId = dateToString(d);
    console.log("Getting entry.", { entryId });
    const entry = await database.getEntry(entryId);
    console.log("Finished getting entry.", { entry });
    if (entry) {
      entry.submittedAt = entry.created;

      console.log("Updating entry.", { entry });
      await database.updateEntry(entry);
      console.log("Finished updating entry.");
    }
  }
  return { statusCode: 200, body: {} };
}

async function initialize(): Promise<void> {
  if (!isInitialized) {
    const tableName = "ReflectTable"; // TODO Factor out constant.
    const documentClient = new DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
    database = new Database(tableName, documentClient);
  }
  isInitialized = true;
}


function dateToString(date: Date): string {
  // Returns a date string for the given date in the local timezone.
  const offset = (new Date()).getTimezoneOffset() * 60000; // Offset in milliseconds
  return (new Date(date.getTime() - offset)).toISOString().slice(0, 10);
}