import { Test, TestingModule } from '@nestjs/testing';
import { TodoListDto } from '../dto/todo-list.dto';
import { TodoService } from '../service/todo.service';
import { TodoController } from './todo.controller';
import { TodoCreateDto } from '../dto/todo-create.dto';
import { TodoDetailDto } from '../dto/todo-detail.dto';

const mockAll: TodoListDto[] = [
  {
    description: 'lunch',
    id: 1,
    is_complete: false,
    timestamp: '',
  },
  {
    description: 'breakfast',
    id: 2,
    is_complete: true,
    timestamp: '',
  },
];

const createDto = new TodoCreateDto();
createDto.description = 'lunch';
createDto.is_complete = false;
createDto.timestamp = '';

const mockDetailDto = new TodoDetailDto();
mockDetailDto.id = 1;
mockDetailDto.description = 'lunch';
mockDetailDto.is_complete = false;
mockDetailDto.timestamp = '';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockAll),
            create: jest.fn().mockResolvedValue(mockDetailDto),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all todo', async () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create new todo', async () => {
    controller.create(createDto);

    expect(controller.create(createDto)).resolves.toEqual(mockDetailDto);
    expect(service.create).toHaveBeenCalled();
  });
});
