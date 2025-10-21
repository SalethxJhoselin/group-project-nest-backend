import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Student } from '../student/student.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Student,
            Company
        ]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }