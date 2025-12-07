import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { supabase } from 'src/shared/supabase.client';
import { Company } from '../company/company.entity';
import { Student } from '../student/student.entity';
import { LoginDto, RegisterCompanyDto, RegisterStudentDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/login_response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  // ----------------------------
  // Registro de Estudiante
  // ----------------------------
  async registerStudent(dto: RegisterStudentDto) {
    const { data, error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.user) {
      throw new BadRequestException(error?.message || 'No se pudo registrar el usuario.');
    }

    const newStudent = this.studentRepo.create({
      id: data.user.id,
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
      message: 'Estudiante registrado correctamente. Revisa tu correo para confirmar la cuenta.',
      user: newStudent,
    };
  }

  // ----------------------------
  // Registro de Empresa
  // ----------------------------
  async registerCompany(dto: RegisterCompanyDto) {
    const { data, error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.user) {
      throw new BadRequestException(error?.message || 'No se pudo registrar la empresa.');
    }

    const newCompany = this.companyRepo.create({
      id: data.user.id,
      name: dto.name,
      description: dto.description,
      website: dto.website,
      email: dto.email,
      phone_number: dto.phone_number,
    });

    await this.companyRepo.save(newCompany);

    return {
      message: 'Empresa registrada correctamente. Revisa tu correo para confirmar la cuenta.',
      user: newCompany,
    };
  }

  // ----------------------------
  // Inicio de sesión con validación de tipo
  // ----------------------------
  async login(dto: LoginDto, userType: 'student' | 'company'): Promise<LoginResponseDto> {
    // Modo desarrollo: bypass de Supabase Auth para testing local
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    let userId: string;

    if (isDevelopment) {
      // En desarrollo, buscar el usuario directamente en la BD sin validar Supabase
      
      if (userType === 'student') {
        const student = await this.studentRepo.findOne({ where: { email: dto.email } });
        if (!student) {
          throw new UnauthorizedException('Estudiante no encontrado.');
        }
        userId = student.id;
      } else if (userType === 'company') {
        const company = await this.companyRepo.findOne({ where: { email: dto.email } });
        if (!company) {
          throw new UnauthorizedException('Empresa no encontrada.');
        }
        userId = company.id;
      } else {
        throw new UnauthorizedException('Tipo de usuario no válido.');
      }
    } else {
      // En producción, validar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

      if (error) {
        if (error.message === 'Email not confirmed') {
          throw new UnauthorizedException('Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.');
        }
        if (error.message === 'Invalid login credentials') {
          throw new UnauthorizedException('Credenciales incorrectas.');
        }
        throw new UnauthorizedException(error.message);
      }
      userId = data.user.id;
    }

    if (userType === 'student') {
      const student = await this.studentRepo.findOne({ where: { id: userId } });
      if (!student) throw new UnauthorizedException('No eres un estudiante registrado.');
      return {
        user: { ...student, user_type: 'student' },
        access_token: 'dev-token-' + userId,
        refresh_token: 'dev-refresh-' + userId,
      };
    }

    if (userType === 'company') {
      const company = await this.companyRepo.findOne({ where: { id: userId } });
      if (!company) throw new UnauthorizedException('No eres una empresa registrada.');
      return {
        user: { ...company, user_type: 'company' },
        access_token: 'dev-token-' + userId,
        refresh_token: 'dev-refresh-' + userId,
      };
    }

    throw new UnauthorizedException('Tipo de usuario no válido.');
  }

  // ----------------------------
  // Confirmar correo (opcional)
  // ----------------------------
  async confirmEmail(userId: string) {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });

    if (error) throw new BadRequestException(error.message);

    return {
      message: 'Correo confirmado correctamente.',
      user: data.user,
    };
  }
}
