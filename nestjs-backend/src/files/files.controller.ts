import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  UploadedFiles,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Upload single file')
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //   fileType:
        //    " /^(image\/(jpeg|jpg|png|gif|bmp|webp|tiff|svg\+xml)|audio\/(mpeg|mp3|wav|ogg|flac|aac|m4a|wma))$/",
        // })
        .addMaxSizeValidator({
          maxSize: 100 * 1024 * 1024, // Tăng giới hạn lên 10MB nếu cần
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return { fileName: file.filename, mimeType: file.mimetype };
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  @ResponseMessage('Upload multiple files')
  uploadFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /^(image\/(jpeg|jpg|png|gif|bmp|webp|tiff|svg\+xml)|audio\/(mpeg|mp3|wav|ogg|flac|aac|m4a|wma))$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // Giới hạn kích thước file là 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    // Trả về tên các file đã được upload
    return {
      files: files.map((file) => ({
        filename: file.filename,
      })),
    };
  }
}
