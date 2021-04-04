import { AwsClient } from 'aws4fetch'

export class Backend {
    private awsClient: AwsClient;

    constructor(awsClient: AwsClient) {
        this.awsClient = awsClient;
    }

    async getEntry(entryId: string): Promise<any | null> {
        console.log("getEntry", entryId);

        const url = `https://reflect-api.nielmclaren.com/api/v1/entries/${entryId}`;
        const options = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            method: 'GET',
        };
        const response = await this.awsClient.fetch(url, options);
        if (response && response.ok) {
            return await response.json();
        }
        if (response.status === 404) {
            return null;
        }
        console.error("Error", response.status, response.statusText);
        return null;
    }

    async postEntry(entry: any): Promise<boolean> {
        console.log("postEntry", entry.entryId, entry);

        const url = `https://reflect-api.nielmclaren.com/api/v1/entries/${entry.entryId}`;
        const options = {
            body: JSON.stringify(entry),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            method: "POST",
        };
        const response = await this.awsClient.fetch(url, options);
        if (response && response.ok) {
            return true;
        }
        console.error("Error", response.status, response.statusText);
        return false;
    }
}