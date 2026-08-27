export interface News {
    id: string;
    title: string;
    coverURL: string;
    content: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}