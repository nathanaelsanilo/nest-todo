import { Body, Controller, Get, Post } from '@nestjs/common';
import { TodoCreateDto } from '../dto/todo-create.dto';
import { TodoDetailDto } from '../dto/todo-detail.dto';
import { TodoListDto } from '../dto/todo-list.dto';
import { TodoService } from '../service/todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Promise<TodoListDto[]> {
    return this.todoService.findAll();
  }

  @Post()
  create(@Body() createDto: TodoCreateDto): Promise<TodoDetailDto> {
    return this.todoService.create(createDto);
  }
}
