import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OfferService } from '../offer.service';
import { Offer } from '../../entity/offer.entity';

@Injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
  ) {}


}