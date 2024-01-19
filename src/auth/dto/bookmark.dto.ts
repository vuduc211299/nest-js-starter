import {
  IsNotEmpty,
  MinLength,
  IsString,
} from 'class-validator';

export class BookmarkDto {
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @MinLength(5)
  link: string;
}
