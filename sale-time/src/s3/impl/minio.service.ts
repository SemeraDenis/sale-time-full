import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import * as fs from "fs";
import {S3Service} from "../s3.service";
import {MinioConstants} from "./minio.constants";

@Injectable()
export class MinioService implements S3Service {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            endpoint: MinioConstants.ENDPOINT, // Адрес MinIO
            region: "kz",
            credentials: {
                accessKeyId: MinioConstants.ACCESS_KEY,
                secretAccessKey: MinioConstants.ACCESS_KEY_SECRET,
            },
            forcePathStyle: true, // Обязательно для MinIO
        });
    }

    async uploadFile(file: Express.Multer.File) {
        const fileKey = `${uuid()}-${file.originalname}`;
        console.log(file);

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: MinioConstants.USER_UPLOAD_BUCKET,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
        );

        return `${MinioConstants.USER_UPLOAD_BUCKET}/${fileKey}`;
    }
}