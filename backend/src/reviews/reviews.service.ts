import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return await this.reviewRepository.save(review);
  }

  async findByMovie(movieId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { movieId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    await this.reviewRepository.remove(review);
  }
}
