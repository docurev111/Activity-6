import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Shawshank Redemption', description: 'Movie title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Two imprisoned men bond over a number of years...', description: 'Movie description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Drama', description: 'Movie genre' })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty({ example: 1994, description: 'Release year' })
  @IsNumber()
  @Min(1888)
  @Max(2100)
  releaseYear: number;
}
