import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PersistentEntity } from './base/persistent-entity';

@Entity('PostImages')
export class PostImage extends PersistentEntity {
    @Column()
    postId?: number;

    @Column()
    location: string;
}