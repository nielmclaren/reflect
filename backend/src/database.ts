import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Entity, Table } from 'dynamodb-toolbox';

enum RecordType {
    ENTRY = 'ENTRY',
};

type Entry = {
    entryId: string;
    body: string;
    isImported?: boolean;
    isRead?: boolean;
    lastReadAt?: string;
    moment: string;
    submittedAt: string;
    type: RecordType;
};

export class Database {
    private table: Table;
    private entry: Entity<any>;

    async getEntry(entryId: string): Promise<Entry> {
        const resp = await this.entry.get({ entryId });
        if (resp?.Item) {
            return resp.Item as Entry;
        }
        return null;
    }

    async updateEntry(entry: Entry): Promise<void> {
        await this.entry.update(entry);
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
                isImported: { type: 'boolean', default: () => false },
                isRead: { type: 'boolean', default: () => false },
                lastReadAt: 'string',
                moment: 'string',
                submittedAt: 'string',
                type: { type: 'string', default: () => 'ENTRY' },
            },
            table: this.table,
        });
    }
}
