import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Movie } from './entities/movie.entity';
import { Review } from './entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Movie, Review],
      synchronize: true,
    }),
    MoviesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
