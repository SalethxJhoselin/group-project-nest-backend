import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { LoginDto } from '../auth/dto/auth.dto';
import { Admin } from './admin.entity';

@ApiTags('Admin - Autenticación')
@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login de administrador',
    description: 'Endpoint seguro solo para usuarios con rol de admin registrados en la tabla admin_users'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 403, description: 'Acceso denegado - no es admin' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  async adminLogin(@Body() loginDto: LoginDto) {
    return await this.adminAuthService.adminLogin(loginDto);
  }

  @Get('profile/:adminId')
  @ApiOperation({ summary: 'Obtener perfil del admin' })
  async getAdminProfile(@Param('adminId') adminId: string): Promise<Admin> {
    return await this.adminAuthService.getAdminProfile(adminId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear nuevo admin (solo super_admin)' })
  async createAdmin(@Body() adminData: Partial<Admin>, @Request() req: any) {
    // El ID del super_admin viene del token JWT
    const adminId = req.user?.id;
    return await this.adminAuthService.createAdmin(adminData, adminId);
  }

  @Get('list')
  @ApiOperation({ summary: 'Listar todos los admins (solo super_admin)' })
  async listAdmins(@Request() req: any): Promise<Admin[]> {
    const adminId = req.user?.id;
    return await this.adminAuthService.listAdmins(adminId);
  }
}
