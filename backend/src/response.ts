export function response(event: any, statusCode: number, body: any): any {
    let allowOrigin = "https://reflect.nielmclaren.com";
    if (event.headers && event.headers.origin && event.headers.origin === "http://localhost:3000") {
        // Make local development easier.
        allowOrigin = event.headers.origin;
    }

    return {
        isBase64Encoded: false,
        statusCode,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": allowOrigin,
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    };
}