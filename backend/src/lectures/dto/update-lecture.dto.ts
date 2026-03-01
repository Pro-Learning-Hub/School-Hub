import { IsString, IsOptional } from 'class-validator';

export class UpdateLectureDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  videoLink?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  audioLink?: string;

  @IsString()
  @IsOptional()
  slides?: string;

  @IsString()
  @IsOptional()
  subtitles?: string;

  @IsString()
  @IsOptional()
  transcript?: string;

  @IsOptional()
  resources?: Array<{ id?: string; title: string; url: string; type: string }>;
}
