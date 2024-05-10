import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayableModule } from './payable/payable.module';

@Module({
  imports: [ConfigModule.forRoot(), PayableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
