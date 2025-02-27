import { Response } from 'express';
import { Injectable } from "@nestjs/common";
import { Readable } from 'stream';
import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import {S3Service} from "../s3.service";
import {MinioConstants} from "./minio.constants";
import {CommonNotfoundException} from "../../errors/exceptions/common.notfound-exception";

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

        return fileKey;
    }

    async downloadFile(fileKey: string, res: Response) {
        const { Body, ContentType } = await this.s3Client.send(
            new GetObjectCommand({
                Bucket: MinioConstants.USER_UPLOAD_BUCKET,
                Key: fileKey,
            })
        );

        if (!Body) {
            throw new CommonNotfoundException('File not found or empty response');
        }

        const stream = Body as Readable;
        if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
            throw new Error('Body is not a readable stream');
        }

        // Преобразуем поток в Buffer
        const fileBuffer = await this.streamToBuffer(stream);

        // Устанавливаем заголовки
        res.setHeader('Content-Type', ContentType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileKey}"`);

        // Отправляем файл в ответ
        res.send(fileBuffer);
    }

    // Метод для конвертации Readable Stream в Buffer
    private async streamToBuffer(stream: Readable): Promise<Buffer> {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
    }
}