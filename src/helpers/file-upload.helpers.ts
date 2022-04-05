import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

const s3 = new S3();
@Injectable()
export class FileUploadHelpers {
  static async uploadToS3(file, folder) {
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: file?.buffer || file,
        Key: `${folder}/${new Date().getTime()}-${file.originalname}`,
        ACL: 'public-read',
      })
      .promise();
    return uploadResult;
  }

  static async deleteFileFromS3(key) {
    try {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Key: key,
        })
        .promise();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
