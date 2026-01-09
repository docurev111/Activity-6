import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'Movie ID' })
  @IsNumber()
  movieId: number;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'Amazing movie! Must watch.', description: 'Review comment' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 5, description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
