import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ name: 'is_complete', default: false })
  isComplete: boolean;

  @Column({ type: 'timestamp' })
  timestamp: string;
}
