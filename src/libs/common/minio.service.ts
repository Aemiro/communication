import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as Minio from 'minio';
import { lookup } from 'mime-types';
import * as dotenv from 'dotenv';
import { FileUploadDto } from './file-dto';
dotenv.config({ path: '.env' });
console.log(process.env['MINIO_HOST']);
const bucketName = 'pms-dev';
@Injectable()
export class MinioService {
  minioClient;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env['MINIO_HOST'] || '',
      port: process.env['MINIO_PORT']
        ? parseInt(process.env['MINIO_PORT'])
        : 9000,
      useSSL: process.env['MINIO_USE_SSL'] === 'true' ? true : false,
      accessKey: process.env['MINIO_ACCESS_KEY'] || '',
      secretKey: process.env['MINIO_SECRET_KEY'] || '',
      region: process.env['MINIO_REGION']
        ? process.env['MINIO_REGION']
        : 'us-east-1',
    });
  }
  async putObject(file: FileUploadDto, folderName: string, metadata = {}) {
    try {
      const uuidFileName = new Date().getTime();
      const fileExtension = path.extname(file.originalname);
      const objectName = `${folderName}/${uuidFileName}${fileExtension}`;
      const stream = file.buffer;

      const result = await this.minioClient
        .putObject(bucketName, objectName, stream, file.size, metadata)
        .catch((e) => {
          console.error(e);
          throw new Error('Error processing file upload');
        });
      console.log('Object uploaded successfully: ', result);
      const url = await this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        604800,
      ); // 7 days

      return {
        originalName: file.originalname,
        name: objectName,
        type: file.mimetype,
        size: file.size,
        url,
        bucketName,
      };
    } catch (error) {
      console.error('Error:', error);
      // return 'Error processing file upload';
      throw new Error('Error processing file upload');
    }
  }
  async uploadFile(fileName: string, folderName: string, metadata = {}) {
    try {
      const objectName = `${folderName}/${fileName}`;
      const result = await this.minioClient
        .fPutObject(bucketName, objectName, `/tmp/${fileName}`, metadata)
        .catch((e) => {
          console.error(e);
          throw new Error('Error processing file upload');
        });
      console.log('Object uploaded successfully: ', result);
      const url = await this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        604800,
      ); // 7 days
      const fileStat = fs.statSync(`/tmp/${fileName}`);
      return {
        originalName: fileName,
        name: objectName,
        type: lookup(`/tmp/${fileName}`),
        size: fileStat.size,
        url,
        bucketName,
      };
    } catch (error) {
      console.error('Error:', error);
      // return 'Error processing file upload';
      throw new Error('Error processing file upload');
    }
  }
  async getPresignedUrl(objectName: string, expiresInSecond = 360) {
    return await this.minioClient.presignedGetObject(
      bucketName,
      objectName,
      expiresInSecond,
    );
  }
  async isFileExist(fileName: string, option = {}) {
    const stat = await this.minioClient
      .statObject(bucketName, fileName, option)
      .catch((e) => {
        console.error(e);
        return false;
      });
    console.log(stat);
    return stat;
  }
  async deleteFile(objectName: string, option = {}) {
    const isFileExist = await this.isFileExist(objectName);
    if (!isFileExist) {
      return false;
    }
    await this.minioClient
      .removeObject(bucketName, objectName, option)
      .catch((e: any) => {
        console.error(e);
        return false;
      });
    return true;
  }
  async seedBuckets(buckets: string[]) {
    for await (const bucket of buckets) {
      const bucketExists = await this.minioClient.bucketExists(bucket);
      if (!bucketExists) {
        const bucketRegion = process.env['MINIO_REGION']
          ? process.env['MINIO_REGION']
          : 'us-east-1';
        await this.minioClient.makeBucket(bucket, bucketRegion);
      }
    }
  }
}
