import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'callback_analytics_text_responses' })
export class CallbackResponseTextEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;
}
