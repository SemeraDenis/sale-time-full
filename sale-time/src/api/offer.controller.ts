import { Controller, Inject } from '@nestjs/common';
import { OfferService } from '../service/offer.service';

@Controller()
export class OfferController{
  constructor(
    @Inject('OfferService') private readonly offerService: OfferService
  ) {}
}