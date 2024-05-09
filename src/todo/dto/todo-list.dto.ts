import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class TodoListDto {
  @IsString()
  description: string;

  @IsBoolean()
  is_complete: boolean;

  @IsNumber()
  id: number;

  @IsDateString()
  timestamp: string;

  @IsNumber()
  order_key: number;
}
