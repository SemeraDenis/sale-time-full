import { Response } from 'express';

export interface S3Service {
    uploadFile(file: Express.Multer.File):Promise<{
        key: string;
        mimeType: string;
        size: number;
    }>;
    downloadFile(fileKey: string, res: Response):Promise<void>;
}