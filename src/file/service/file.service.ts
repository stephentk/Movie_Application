import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { FileTypeEnum } from '../enum/file.enum';
import { Multer } from 'multer';

export const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('./upload'))
      fs.mkdirSync('./upload', {
        mode: '0777',
      });
    cb(null, './upload');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.')[1];
    cb(null, `${new Date().getTime()}.${extension}`);
  },
});

@Injectable()
export class FileService {
  private readonly baseUrl = cloudinary;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadDocument2(url: any, location): Promise<any> {
    try {
      const file = path.join(process.cwd(), 'upload', `/${url}`);
      Logger.log(`Updaloding file in progress...`);
      const { secure_url, public_id, format, resource_type } =
        await this.baseUrl.uploader.upload(file, {
          folder: location,
        });
      return { secure_url, public_id, format, resource_type };
    } catch (error) {
      console.log('File upload failed...', error);
      Logger.log('File upload failed...', error);
      throw new BadRequestException('Unable to upload file');
    }
  }

  getFileType(file: Multer.File) {
    // TODO: consider looking at other possible types and add them here
    const [mimeType, fileExtension] = file.mimetype.split('/');
    const imageFileTypes = ['image'];
    const documentFileExtensionType = ['pdf'];
    const videoFileType = ['video'];
    const audioFileType = ['audio'];
    //
    if (imageFileTypes.includes(mimeType)) {
      return FileTypeEnum.Image;
    } else if (documentFileExtensionType.includes(fileExtension)) {
      return FileTypeEnum.Document;
    } else if (videoFileType.includes(mimeType)) {
      return FileTypeEnum.Video;
    } else if (audioFileType.includes(mimeType)) {
      return FileTypeEnum.Audio;
    }
  }

  async uploadDocument(url: string, location): Promise<any> {
    try {
      const data = await this.baseUrl.uploader.upload(
        url,
        //  {
        //   folder: location,
        // }
      );
      const { secure_url, public_id } = data;
      return { secure_url, public_id };
    } catch (error) {
      console.log('File upload failed...', error);
      throw new BadRequestException('Unable to upload file');
    }
  }
}
