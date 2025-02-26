import { Controller, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OfferService } from '../service/offer.service';

@Controller()
export class OfferController{
  constructor(
    @Inject('OfferService') private readonly offerService: OfferService
  ) {}
}