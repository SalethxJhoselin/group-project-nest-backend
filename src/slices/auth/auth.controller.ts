import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterCompanyDto, RegisterStudentDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/login_response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register/student')
    async registerStudent(@Body() dto: RegisterStudentDto) {
        return this.authService.registerStudent(dto);
    }

    @Post('register/company')
    async registerCompany(@Body() dto: RegisterCompanyDto) {
        return this.authService.registerCompany(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(dto);
    }
}