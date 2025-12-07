import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
    CreateAnnouncementDto,
    AnnouncementDto,
} from './dto/announcement.dto';
import { UpdateUserStatusDto, ModerationUserDto } from './dto/moderation.dto';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // ========================================
    // DASHBOARD
    // ========================================
    @Get('dashboard-stats')
    @ApiOperation({
        summary: 'Obtener estadísticas del dashboard administrativo',
        description:
            'Retorna métricas generales del sistema: usuarios, empleos, postulaciones, etc.',
    })
    @ApiResponse({
        status: 200,
        description: 'Estadísticas obtenidas correctamente',
        type: DashboardStatsDto,
    })
    async getDashboardStats(): Promise<DashboardStatsDto> {
        return this.adminService.getDashboardStats();
    }

    // ========================================
    // USER MODERATION
    // ========================================
    @Get('moderation/users')
    @ApiOperation({
        summary: 'Obtener lista de usuarios para moderación',
        description:
            'Retorna todos los usuarios (estudiantes y empresas) con información de moderación',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios obtenida correctamente',
        type: [ModerationUserDto],
    })
    async getUsersForModeration(): Promise<ModerationUserDto[]> {
        return this.adminService.getUsersForModeration();
    }

    @Patch('moderation/users/:id/status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Actualizar estado de un usuario',
        description:
            'Permite aprobar, rechazar o suspender una cuenta de usuario',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del usuario',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({ type: UpdateUserStatusDto })
    @ApiResponse({
        status: 200,
        description: 'Estado actualizado correctamente',
    })
    async updateUserStatus(
        @Param('id') userId: string,
        @Body() dto: UpdateUserStatusDto,
    ): Promise<{ message: string }> {
        return this.adminService.updateUserStatus(userId, dto);
    }

    // ========================================
    // ANNOUNCEMENTS
    // ========================================
    @Get('announcements')
    @ApiOperation({
        summary: 'Obtener todos los anuncios activos',
        description: 'Retorna la lista de anuncios publicados por el administrador',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de anuncios obtenida correctamente',
        type: [AnnouncementDto],
    })
    async getAnnouncements(): Promise<AnnouncementDto[]> {
        return this.adminService.getAnnouncements();
    }

    @Post('announcements')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Crear un nuevo anuncio',
        description:
            'Permite al administrador crear anuncios para estudiantes, empresas o todos',
    })
    @ApiBody({ type: CreateAnnouncementDto })
    @ApiResponse({
        status: 201,
        description: 'Anuncio creado correctamente',
        type: AnnouncementDto,
    })
    async createAnnouncement(
        @Body() dto: CreateAnnouncementDto,
    ): Promise<AnnouncementDto> {
        // TODO: Get admin ID from JWT token
        const adminId = '00000000-0000-0000-0000-000000000000'; // Default UUID hasta implementar JWT
        return this.adminService.createAnnouncement(dto, adminId);
    }

    @Delete('announcements/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Eliminar un anuncio',
        description: 'Desactiva un anuncio (soft delete)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del anuncio',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Anuncio eliminado correctamente',
    })
    async deleteAnnouncement(
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        return this.adminService.deleteAnnouncement(id);
    }
}
