import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/create-application.dto';
import { JobApplication } from './entity/job-application.entity';
import { JobApplicationService } from './job-application.service';

@ApiTags('applications')
@Controller('applications')
export class JobApplicationController {
  constructor(private readonly applicationService: JobApplicationService) { }

  @Post()
  @ApiOperation({ summary: 'Aplicar a una vacante' })
  @ApiResponse({ status: 201, description: 'Aplicación creada', type: JobApplication })
  @ApiResponse({ status: 409, description: 'Ya aplicaste a esta vacante' })
  async create(
    @Body() createApplicationDto: CreateApplicationDto & { student_id: string }
  ): Promise<JobApplication> {
    return await this.applicationService.create(createApplicationDto);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Obtener aplicaciones de un estudiante' })
  @ApiResponse({ status: 200, description: 'Lista de aplicaciones', type: [JobApplication] })
  async findByStudent(@Param('studentId') studentId: string): Promise<JobApplication[]> {
    return await this.applicationService.findByStudent(studentId);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Obtener aplicaciones de una vacante' })
  async findByJob(@Param('jobId') jobId: string): Promise<JobApplication[]> {
    return await this.applicationService.findByJob(jobId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener aplicación por ID' })
  async findOne(@Param('id') id: string): Promise<JobApplication> {
    return await this.applicationService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de aplicación' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto
  ): Promise<JobApplication> {
    return await this.applicationService.updateStatus(id, updateStatusDto.status);
  }

  @Get('student/:studentId/job/:jobId')
  @ApiOperation({ summary: 'Verificar si estudiante ya aplicó a vacante' })
  async checkExistingApplication(
    @Param('studentId') studentId: string,
    @Param('jobId') jobId: string
  ): Promise<{ exists: boolean }> {
    const exists = await this.applicationService.checkExistingApplication(studentId, jobId);
    return { exists };
  }
}