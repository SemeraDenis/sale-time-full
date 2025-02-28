import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../entity/offer.entity';
import { OfferController } from '../api/offer.controller';
import { DefaultOfferService } from '../service/impl/default-offer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [
    {
      provide: 'OfferService',
      useClass: DefaultOfferService,
    },
    DefaultOfferService,
  ],
  controllers: [OfferController]
})
export class OfferModule {
}