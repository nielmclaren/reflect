import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk';
import csv from 'csvtojson';

import { Database } from './src/database';

let isInitialized = false;
let database = null;
let s3 = null;

export async function handler(event, context) {
  console.log("Invoke lambda.");
  console.log("event");
  console.log(event);
  console.log("context");
  console.log(context);

  await initialize();

  const stream = await s3.getObject({ Bucket: 'nielmclaren-reflect-import', Key: 'TimeTags2.csv' }).createReadStream();
  const json = await csv().fromStream(stream);
  for (let i = 0; i < json.length; i++) {
    const old = json[i];
    const entryId = parseDate(old.Date);
    const entry = {
      entryId,
      body: old.Text,
      isImported: true,
      isRead: false,
      moment: old.MomentOfTheDay,
      submittedAt: parseDatetime(old.Entry_DateCreated),
    };
    console.log("Updating entry.", entryId);
    await database.updateEntry(entry);
    console.log("Finished updating entry.", entryId);
  }

  return { statusCode: 200, body: {} };
}

async function initialize(): Promise<void> {
  if (!isInitialized) {
    const tableName = "ReflectTable"; // TODO Factor out constant.
    const documentClient = new DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
    database = new Database(tableName, documentClient);
    s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  }
  isInitialized = true;
}

function parseDate(d: string): string {
  const dateParts = d.split('/');
  const month = dateParts[0];
  const date = dateParts[1];
  const year = dateParts[2];
  return `${year.padStart(2, '0')}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`;
}

function parseDatetime(d: string): string {
  const parts = d.split(' ');
  const dateParts = parts[0].split('/');
  const month = parseInt(dateParts[0], 10) - 1;
  const date = parseInt(dateParts[1], 10);
  const year = parseInt(dateParts[2], 10);
  const timeParts = parts[1].split(':');
  const hour = parseInt(timeParts[0], 10) + (parts[2] === 'AM' ? 0 : 12);
  const minute = parseInt(timeParts[1], 10);
  const second = 0;
  const millisecond = 0;
  return new Date(Date.UTC(year, month, date, hour, minute, second, millisecond)).toISOString();
}