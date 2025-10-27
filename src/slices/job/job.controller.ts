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
import { CreateJobDto, UpdateJobDto } from './dto/create-job.dto';
import { Job } from './entity/job.entity';
import { JobService } from './job.service';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva vacante' })
  @ApiResponse({ status: 201, description: 'Vacante creada', type: Job })
  async create(@Body() createJobDto: CreateJobDto & { company_id: string }): Promise<Job> {
    return await this.jobService.create(createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las vacantes activas' })
  @ApiResponse({ status: 200, description: 'Lista de vacantes', type: [Job] })
  async findAll(
    @Query('company') companyId?: string,
    @Query('type') jobType?: string,
    @Query('location') location?: string
  ): Promise<Job[]> {
    return await this.jobService.findAll(companyId, jobType, location);
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener vacantes activas' })
  async findActive(): Promise<Job[]> {
    return await this.jobService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una vacante por ID' })
  @ApiResponse({ status: 200, description: 'Vacante encontrada', type: Job })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  async findOne(@Param('id') id: string): Promise<Job> {
    return await this.jobService.findOne(id);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Obtener vacantes por empresa' })
  async findByCompany(@Param('companyId') companyId: string): Promise<Job[]> {
    return await this.jobService.findByCompany(companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar vacante' })
  @ApiResponse({ status: 200, description: 'Vacante actualizada', type: Job })
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    return await this.jobService.update(id, updateJobDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar vacante' })
  @ApiResponse({ status: 200, description: 'Vacante eliminada' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.jobService.remove(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar vacante' })
  async deactivate(@Param('id') id: string): Promise<Job> {
    return await this.jobService.deactivate(id);
  }
}