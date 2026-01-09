import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column()
  userName: string;

  @Column('text')
  comment: string;

  @Column({ type: 'integer', width: 1 })
  rating: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Movie, (movie) => movie.reviews)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
}
