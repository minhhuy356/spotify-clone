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
  BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from '@/decorator/customize';
import path from 'path';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
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
  @Post('upload/preview')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Upload and generate preview')
  async uploadAndCreatePreview(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(audio\/(mpeg|mp3|wav|ogg|flac|aac|m4a|wma)|video\/mp4)$/,
        })
        .addMaxSizeValidator({
          maxSize: 100 * 1024 * 1024, // 20MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,

    @Body()
    body: { start: number; end: number },
  ) {
    const start = Number(body.start);
    const end = Number(body.end);
    const duration = end - start;

    if (isNaN(start) || isNaN(end) || duration <= 0) {
      throw new BadRequestException('Invalid start or end time');
    }

    const inputPath = file.path;
    const previewName = `preview-${Date.now()}.mp4`;
    const outputFolder = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'tracks',
      'preview',
    );
    const outputPath = path.join(outputFolder, previewName);

    fs.mkdirSync(outputFolder, { recursive: true });

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(duration)
        .outputOptions('-movflags +faststart') // Cho HTML5
        .output(outputPath)
        // Bỏ dòng copy codec
        // .audioCodec('copy')
        // .videoCodec('copy')
        .audioCodec('aac')
        .videoCodec('libx264')
        .on('start', (cmd) => console.log('FFmpeg start command:', cmd))
        .on('stderr', (line) => console.log('FFmpeg stderr:', line))
        .on('end', () => {
          resolve({
            message: 'Preview created',
            preview: previewName,
            url: `/public/track/preview/${previewName}`,
          });
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject({ message: 'Failed to create preview', error: err.message });
        })
        .run();
    });
  }
}
