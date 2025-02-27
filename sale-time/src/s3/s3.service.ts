import { Response } from 'express';

export interface S3Service {
    uploadFile(file: Express.Multer.File):Promise<string>;
    downloadFile(fileKey: string, res: Response):Promise<void>;
}