import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';

@Module({
  controllers: [ResenaController],
  providers: [ResenaService],
})
export class ResenaModule {}
