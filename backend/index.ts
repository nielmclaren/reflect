export async function handler(event, context) {
  console.log("Invoke lambda.");
  console.log("event");
  console.log(event);
  console.log("context");
  console.log(context);

  let allowOrigin = "https://reflect.nielmclaren.com";
  if (event.headers && event.headers.origin && event.headers.origin === "http://localhost:3000") {
    // Make local development easier.
    allowOrigin = event.headers.origin;
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ body: "Rock that!" }),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
  };
}
