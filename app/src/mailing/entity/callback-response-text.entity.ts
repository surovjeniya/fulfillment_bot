import { InjectRepository } from '@nestjs/typeorm';
import { Column, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity({ name: 'callback_text_responses' })
export class CallbackResponseText {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;
}
