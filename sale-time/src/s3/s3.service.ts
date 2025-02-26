export interface S3Service {
    uploadFile(file: Express.Multer.File):Promise<string>;
}