import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class TodoDetailDto {
  @IsNumber()
  id: number;

  @IsString()
  timestamp: string;

  @IsString()
  description: string;

  @IsBoolean()
  is_complete: boolean;
}
