import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  uploadFileLocal(file: Express.Multer.File) {
    const filePath = `/uploads/${file.filename}`;
    return { filePath };
  }
}
