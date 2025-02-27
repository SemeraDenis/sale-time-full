import { Module } from '@nestjs/common';
import {MinioService} from "../s3/impl/minio.service";

@Module({
    providers: [
        {
            provide: 'S3Service',
            useClass: MinioService,
        },
        MinioService,
    ],
    exports: ['S3Service', MinioService],
})
export class S3Module {}