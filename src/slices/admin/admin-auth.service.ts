import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './admin.entity';
import { LoginDto } from '../auth/dto/auth.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  /**
   * Login para administradores usando JWT
   * Valida contra tabla admin_users directamente
   */
  async adminLogin(dto: LoginDto): Promise<any> {
    // 1. Validar que el email existe en tabla admin_users
    const adminUser = await this.adminRepo.findOne({
      where: { email: dto.email, is_active: true }
    });

    if (!adminUser) {
      throw new ForbiddenException('❌ Acceso denegado. Este correo no tiene permisos de administrador.');
    }

    // 2. Validar contraseña (en producción, usar bcrypt)
    // Para development, validar contraseña simple
    const isPasswordValid = await this.validateAdminPassword(dto.password, adminUser.email);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('❌ Credenciales incorrectas.');
    }

    // 3. Generar JWT token
    const payload = {
      id: adminUser.id,
      email: adminUser.email,
      user_type: 'admin',
      role: adminUser.role,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '24h'
    });

    // 4. Actualizar último login
    await this.adminRepo.update(adminUser.id, {
      last_login: new Date()
    });

    return {
      access_token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        first_name: adminUser.first_name,
        last_name: adminUser.last_name,
        user_type: 'admin',
        role: adminUser.role,
      }
    };
  }

  /**
   * Validar contraseña de admin
   * TODO: Implementar bcrypt hash para producción
   */
  private async validateAdminPassword(password: string, email: string): Promise<boolean> {
    // Credenciales válidas de desarrollo
    const validCredentials: Record<string, string> = {
      'admin@ficct.edu': 'AdminPassword123!',
    };

    return validCredentials[email] === password;
  }

  /**
   * Obtener información del admin
   */
  async getAdminProfile(adminId: string): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new UnauthorizedException('Admin no encontrado');
    }
    return admin;
  }

  /**
   * Crear nuevo admin (solo super_admin)
   */
  async createAdmin(adminData: Partial<Admin>, createdBy: string): Promise<Admin> {
    const creator = await this.adminRepo.findOne({ where: { id: createdBy } });
    
    if (!creator || creator.role !== 'super_admin') {
      throw new ForbiddenException('Solo super_admins pueden crear nuevos admins');
    }

    const existingAdmin = await this.adminRepo.findOne({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      throw new BadRequestException('Este email ya está registrado como admin');
    }

    const newAdmin = this.adminRepo.create(adminData);
    return await this.adminRepo.save(newAdmin);
  }

  /**
   * Listar todos los admins (solo super_admin)
   */
  async listAdmins(requesterId: string): Promise<Admin[]> {
    const requester = await this.adminRepo.findOne({ where: { id: requesterId } });
    
    if (!requester || requester.role !== 'super_admin') {
      throw new ForbiddenException('Solo super_admins pueden listar admins');
    }

    return await this.adminRepo.find({
      order: { created_at: 'DESC' }
    });
  }
}
