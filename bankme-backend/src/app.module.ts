import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayableModule } from './payable/payable.module';
import { AssignorModule } from './assignor/assignor.module';

@Module({
  imports: [ConfigModule.forRoot(), AssignorModule, PayableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
