export function response(event: any, statusCode: number, body: any): any {
    return {
        isBase64Encoded: false,
        statusCode,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Headers": "Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "https://reflect.nielmclaren.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    };
}