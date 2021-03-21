import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Database } from './src/database';
import { handleEntriesGet } from "./src/handleEntries";
import { response } from "./src/response";

let isInitialized = false;
let database = null;

export async function handler(event, context) {
  console.log("Invoke lambda.");
  console.log("event");
  console.log(event);
  console.log("context");
  console.log(context);

  await initialize();

  const { httpMethod, pathParameters } = event;
  switch (httpMethod) {
    case 'GET':
      console.log("Handling GET request.");
      const dependencies = { database };
      return await handleEntriesGet(event, pathParameters.entryId, dependencies);
    case 'OPTIONS':
      console.log("Handling OPTIONS request.");
      return await response(event, 200, {});
  }

  return response(event, 200, {});
}

async function initialize(): Promise<void> {
  if (!isInitialized) {
    const tableName = "ReflectTable"; // TODO Factor out constant.
    const documentClient = new DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
    database = new Database(tableName, documentClient);
  }
  isInitialized = true;
}