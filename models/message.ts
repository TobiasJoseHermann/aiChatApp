export type Message = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Text: string;
    ConversationID: number;
    IsAiResponse: boolean;
};
