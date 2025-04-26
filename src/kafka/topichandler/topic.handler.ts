export interface TopicHandler {
    processMessage: (topic: string, message: string) => Promise<void>;
}