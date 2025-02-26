import { Column, Entity } from 'typeorm';
import { PersistentEntity } from './base/persistent-entity';

@Entity('Offers')
export class Offer extends PersistentEntity{

  @Column()
  postId: number;

  @Column()
  price: number;

  @Column()
  comment: string;
}
