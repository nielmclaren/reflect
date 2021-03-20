import { response } from "./src/response";
import { handleEntriesGet } from "./src/handleEntries";

export async function handler(event, context) {
  console.log("Invoke lambda.");
  console.log("event");
  console.log(event);
  console.log("context");
  console.log(context);

  const { httpMethod, pathParameters } = event;
  switch (httpMethod) {
    case 'GET':
      return await handleEntriesGet(event, pathParameters.entryId);
  }

  return response(event, 200, {});
}
