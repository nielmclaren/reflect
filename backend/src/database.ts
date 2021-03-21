import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Entity, Table } from 'dynamodb-toolbox';

export class Database {
    private table: Table;
    private entry: Entity<any>;

    async getEntry(entryId: string): Promise<any> {
        const resp = await this.entry.get({ entryId });
        if (resp?.Item) {
            return resp.Item;
        }
        return null;
    }

    constructor(tableName: string, documentClient: DocumentClient) {
        this.table = new Table({
            name: tableName,
            partitionKey: 'PK',
            attributes: {
                PK: 'string',
            },
            DocumentClient: documentClient,
        });

        this.entry = new Entity({
            name: 'ENTRY',
            attributes: {
                PK: { partitionKey: true, default: data => `ENTRY#${data.entryId}` },
                entryId: 'string',
                body: 'string',
                moment: 'string',
                type: { type: 'string', default: () => 'ENTRY' },
            },
            table: this.table,
        });
    }
}
