import { Test, TestingModule } from '@nestjs/testing';
import { TodoCreateDto } from '../dto/todo-create.dto';
import { TodoDetailDto } from '../dto/todo-detail.dto';
import { TodoListDto } from '../dto/todo-list.dto';
import { TodoService } from '../service/todo.service';
import { TodoController } from './todo.controller';

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
            delete: jest.fn().mockResolvedValue(true),
            complete: jest.fn(),
            countComplete: jest.fn(),
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

  it('should return all todo', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return all todo with query', async () => {
    const spyAll = jest.spyOn(service, 'findAll');
    const mockAll: TodoListDto[] = [
      {
        description: 'lunch',
        id: 1,
        is_complete: false,
        timestamp: '',
      },
      {
        description: 'dinner',
        id: 2,
        is_complete: false,
        timestamp: '',
      },
    ];
    spyAll.mockResolvedValueOnce(mockAll);

    const result = await controller.findAll();
    expect(result).toEqual(mockAll);
    expect(service.findAll).toHaveBeenCalled();

    const mockQueryResult = [
      {
        description: 'lunch',
        id: 1,
        is_complete: false,
        timestamp: '',
      },
    ];
    spyAll.mockResolvedValueOnce(mockQueryResult);

    const queryName = 'lunch';
    const queryResult = await controller.findAll(queryName);

    expect(service.findAll).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalledWith(queryName);

    expect(queryResult).toEqual(mockQueryResult);
  });

  it('should create new todo', () => {
    controller.create(createDto);

    expect(controller.create(createDto)).resolves.toEqual(mockDetailDto);
    expect(service.create).toHaveBeenCalled();
  });

  it('should delete todo', () => {
    const id = 1;
    controller.delete(id);

    expect(service.delete).toHaveBeenCalledTimes(1);
    expect(service.delete).toHaveBeenCalledWith(id);
    expect(controller.delete(id)).resolves.toBe(true);
  });

  it('should complete todo', async () => {
    const dto = {
      id: 1,
      timestamp: '',
      description: '',
      is_complete: false,
    };
    jest.spyOn(service, 'complete').mockResolvedValue(dto);

    const id = 1;
    const result = await controller.complete(id);

    expect(service.complete).toHaveBeenCalledTimes(1);
    expect(service.complete).toHaveBeenCalledWith(id);
    expect(result).toEqual(dto);
  });

  it('should count completed todo', async () => {
    jest.spyOn(service, 'countComplete').mockResolvedValueOnce({
      completed: 1,
      progress: 50,
      total: 2,
    });

    const result = await controller.countComplete();

    expect(service.countComplete).toHaveBeenCalled();
    expect(result).toEqual({
      completed: 1,
      progress: 50,
      total: 2,
    });
  });
});
