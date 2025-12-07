import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';
import { CVResponseDto } from './dto/cv-response.dto';
import { Student } from './student.entity';
import { StudentService } from './student.service';
// import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard'; // Para después

@ApiTags('students')
@Controller('students')
// @UseGuards(SupabaseAuthGuard) // Agregar después
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo estudiante' })
    @ApiResponse({ status: 201, description: 'Estudiante creado', type: Student })
    @ApiResponse({ status: 409, description: 'CI o matrícula ya existe' })
    async create(@Body() createStudentDto: CreateStudentDto & { id: string }) {
        return await this.studentService.create(createStudentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los estudiantes' })
    @ApiResponse({ status: 200, description: 'Lista de estudiantes', type: [Student] })
    async findAll(): Promise<Student[]> {
        return await this.studentService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un estudiante por ID' })
    @ApiResponse({ status: 200, description: 'Estudiante encontrado', type: Student })
    @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
    async findOne(@Param('id') id: string): Promise<Student> {
        return await this.studentService.findOne(id);
    }

    @Get('email/:email')
    @ApiOperation({ summary: 'Obtener estudiante por email' })
    async findByEmail(@Param('email') email: string): Promise<Student | null> {
        return await this.studentService.findByEmail(email);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar estudiante' })
    @ApiResponse({ status: 200, description: 'Estudiante actualizado', type: Student })
    async update(
        @Param('id') id: string,
        @Body() updateStudentDto: UpdateStudentDto,
    ): Promise<Student> {
        return await this.studentService.update(id, updateStudentDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar estudiante' })
    @ApiResponse({ status: 200, description: 'Estudiante eliminado' })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.studentService.remove(id);
    }

    @Get(':id/profile')
    @ApiOperation({ summary: 'Obtener perfil del estudiante' })
    async getProfile(@Param('id') id: string): Promise<Student> {
        return await this.studentService.getProfile(id);
    }

    @Get(':id/cv-data')
    @ApiOperation({ summary: 'Obtener todos los datos del estudiante para generar CV' })
    @ApiResponse({
        status: 200,
        description: 'Datos completos para CV',
        type: CVResponseDto
    })
    @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
    async getCVData(@Param('id') id: string): Promise<CVResponseDto> {
        return await this.studentService.getCompleteCVData(id);
    }

    @Post(':id/track-view')
    @ApiOperation({ summary: 'Registrar vista de perfil de estudiante' })
    @ApiResponse({ status: 201, description: 'Vista registrada' })
    async trackView(
        @Param('id') studentId: string,
        @Body() body: { company_id?: string; ip_address?: string; user_agent?: string }
    ) {
        await this.studentService.trackProfileView(
            studentId,
            body.company_id,
            body.ip_address,
            body.user_agent
        );
        return { message: 'Vista registrada' };
    }

    @Get(':id/views/count')
    @ApiOperation({ summary: 'Obtener conteo de vistas de perfil de estudiante' })
    @ApiResponse({ status: 200, description: 'Conteo de vistas' })
    async getViewsCount(
        @Param('id') studentId: string,
        @Query('days') days?: number
    ) {
        const count = await this.studentService.getProfileViewsCount(studentId, days);
        return { count };
    }

    @Get(':id/recent-viewers')
    @ApiOperation({ summary: 'Obtener empresas que vieron el perfil recientemente' })
    @ApiResponse({ status: 200, description: 'Lista de empresas' })
    async getRecentViewers(
        @Param('id') studentId: string,
        @Query('limit') limit?: number
    ) {
        const viewers = await this.studentService.getRecentViewers(studentId, limit || 10);
        return viewers;
    }
}