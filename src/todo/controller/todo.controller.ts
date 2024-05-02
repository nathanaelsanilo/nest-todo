import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TodoCountCompletedDto } from '../dto/todo-count-completed.dto';
import { TodoCreateDto } from '../dto/todo-create.dto';
import { TodoDetailDto } from '../dto/todo-detail.dto';
import { TodoListDto } from '../dto/todo-list.dto';
import { TodoService } from '../service/todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(@Query('name') name?: string): Promise<TodoListDto[]> {
    return this.todoService.findAll(name);
  }

  @Post()
  create(@Body() createDto: TodoCreateDto): Promise<TodoDetailDto> {
    return this.todoService.create(createDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.todoService.delete(id);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number): Promise<TodoDetailDto> {
    return this.todoService.complete(id);
  }

  @Get('completed')
  countComplete(): Promise<TodoCountCompletedDto> {
    return this.todoService.countComplete();
  }
}
