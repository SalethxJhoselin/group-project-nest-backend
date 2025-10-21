import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './slices/auth/auth.module';
import { CompanyModule } from './slices/company/company.module';
import { StudentModule } from './slices/student/student.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    StudentModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
