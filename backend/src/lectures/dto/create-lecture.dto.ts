import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLectureDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsNotEmpty()
  videoLink: string;

  @IsString()
  @IsNotEmpty()
  notes: string;

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

  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @IsOptional()
  resources?: Array<{ title: string; url: string; type: string }>;
}
