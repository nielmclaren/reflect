export async function handler(event, context) {
  console.log("Invoke lambda.");
  console.log("event");
  console.log(event);
  console.log("context");
  console.log(context);
  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: "Rock that!",
  };
}
