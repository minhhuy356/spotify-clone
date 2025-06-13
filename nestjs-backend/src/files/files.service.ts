import { Injectable } from '@nestjs/common';
// import { CreateFileDto } from './dto/create-file.dto';
// import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  uploadFileLocal(file: Express.Multer.File) {
    // Logic xử lý lưu file
    const filePath = `/uploads/${file.filename}`;
    return { filePath };
  }
}
