import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { supabase } from 'src/shared/supabase.client';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { Student } from '../student/student.entity';
import { LoginDto, RegisterCompanyDto, RegisterStudentDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/login_response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Student) private studentRepo: Repository<Student>,
        @InjectRepository(Company) private companyRepo: Repository<Company>,
    ) { }

    async registerStudent(dto: RegisterStudentDto) {
        // 1. Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: dto.email,
            password: dto.password,
        });

        if (error || !data.user) {
            throw new UnauthorizedException(error?.message);
        }

        // 2. Crear Student local
        const newStudent = this.studentRepo.create({
            id: data.user.id, // Mismo ID
            CI: dto.CI,
            registration_number: dto.registration_number,
            first_name: dto.first_name,
            last_name: dto.last_name,
            phone_number: dto.phone_number,
            birthDate: dto.birthDate,
            email: dto.email,
            bio: dto.bio,
        });

        await this.studentRepo.save(newStudent);

        return {
            message: 'Estudiante registrado correctamente',
            user: newStudent,
        };
    }

    async registerCompany(dto: RegisterCompanyDto) {
        // 1. Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: dto.email,
            password: dto.password,
        });

        if (error || !data.user) {
            throw new UnauthorizedException(error?.message);
        }

        // 2. Crear Company local
        const newCompany = this.companyRepo.create({
            id: data.user.id, // Mismo ID
            name: dto.name,
            description: dto.description,
            website: dto.website,
            email: dto.email,
            phone_number: dto.phone_number,
        });

        await this.companyRepo.save(newCompany);

        return {
            message: 'Empresa registrada correctamente',
            user: newCompany,
        };
    }

    async login(dto: LoginDto): Promise<LoginResponseDto> {
        const { data, error } = await supabase.auth.signInWithPassword(dto);
        if (error) throw new UnauthorizedException(error.message);

        let userData: any;
        let userType: 'student' | 'company';

        // Buscar estudiante
        userData = await this.studentRepo.findOne({ where: { id: data.user.id } });
        if (userData) {
            userType = 'student';
            // Asegurar que tenemos todos los campos necesarios
            userData = {
                ...userData,
                user_type: userType
            };
        } else {
            // Buscar empresa
            userData = await this.companyRepo.findOne({ where: { id: data.user.id } });
            if (userData) {
                userType = 'company';
                userData = {
                    ...userData,
                    user_type: userType
                };
            } else {
                throw new UnauthorizedException('Usuario no encontrado en el sistema');
            }
        }

        return {
            user: userData,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        };
    }
}