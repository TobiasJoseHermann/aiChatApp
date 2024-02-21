import { Message } from "./message";

export type Conversation = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Name: string;
    Email: string;
    Messages: Message[];
};
