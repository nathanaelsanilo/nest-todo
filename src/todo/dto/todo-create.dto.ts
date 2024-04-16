import { IsBoolean, IsString } from 'class-validator';

export class TodoCreateDto {
  @IsString()
  description: string;

  @IsString()
  timestamp: string;

  @IsBoolean()
  is_complete: boolean = false;
}
