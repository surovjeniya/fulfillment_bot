import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Utm {
  fulfillment_assistant_lending = 'fulfillment_assistant_lending',
  registration_on_course = 'registration_on_course',
}

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegram_id: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  utm?: string;

  @Column({ type: 'text', nullable: true })
  order?: string;

  @CreateDateColumn()
  createdAt: Date;
}
