import { IsNumber, IsString } from 'class-validator';

export class TodoReorderDto {
  @IsString()
  order: 'inc' | 'dec';

  @IsNumber()
  order_key: number;
}
