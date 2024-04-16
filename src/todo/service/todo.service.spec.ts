import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoCreateDto } from '../dto/todo-create.dto';
import { TodoDetailDto } from '../dto/todo-detail.dto';
import { Todo } from '../entity/todo.entity';
import { TodoService } from './todo.service';
import { TodoListDto } from '../dto/todo-list.dto';

const listTodo: Todo[] = [
  {
    id: 1,
    description: 'lunch',
    isComplete: false,
    timestamp: '',
  },
  {
    id: 2,
    description: 'breakfast',
    isComplete: true,
    timestamp: '',
  },
];

const mockListTodo: TodoListDto[] = [
  {
    id: 1,
    description: 'lunch',
    is_complete: false,
    timestamp: '',
  },
  {
    id: 2,
    description: 'breakfast',
    is_complete: true,
    timestamp: '',
  },
];

const oneTodo = {
  id: 1,
  description: 'lunch',
  isComplete: false,
  timestamp: 8888,
};

const mockDetailTodoDto = {
  id: 1,
  description: 'lunch',
  is_complete: false,
  timestamp: 8888,
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          // https://github.com/nestjs/nest/blob/master/sample/05-sql-typeorm/src/users/users.service.spec.ts#L2
          provide: getRepositoryToken(Todo),
          useValue: {
            save: jest.fn().mockResolvedValue(oneTodo),
            find: jest.fn().mockResolvedValue(listTodo),
            findOne: jest.fn().mockResolvedValue(oneTodo),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of todo', async () => {
    const data = await service.findAll();
    expect(data).toEqual(mockListTodo);
  });

  it('should create new todo', async () => {
    const mockTodo = new TodoCreateDto();
    mockTodo.description = 'lunch';
    mockTodo.timestamp = '';
    mockTodo.is_complete = false;

    const newTodo: TodoDetailDto = await service.create(mockTodo);

    expect(newTodo).toEqual(mockDetailTodoDto);
  });

  it('should return detail', async () => {
    const data: TodoDetailDto = await service.findOne(1);
    expect(data).toEqual(mockDetailTodoDto);
  });
});
