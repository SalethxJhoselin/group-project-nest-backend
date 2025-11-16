import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto
} from './dto/create-application.dto';
import { JobApplication } from './entity/job-application.entity';
import { JobApplicationService } from './job-application.service';

@ApiTags('applications')
@Controller('applications')
export class JobApplicationController {
  constructor(private readonly applicationService: JobApplicationService) {}

  @Post()
  @ApiOperation({ summary: 'Aplicar a una vacante' })
  @ApiResponse({ status: 201, description: 'Aplicación creada', type: JobApplication })
  async create(
    @Body() createApplicationDto: CreateApplicationDto & { student_id: string }
  ) {
    return await this.applicationService.create(createApplicationDto);
  }

  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string) {
    return await this.applicationService.findByStudent(studentId);
  }

  @Get('job/:jobId')
  async findByJob(@Param('jobId') jobId: string) {
    return await this.applicationService.findByJob(jobId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.applicationService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto
  ) {
    return await this.applicationService.updateStatus(id, dto.status);
  }

  @Get('student/:studentId/job/:jobId')
  async checkExistingApplication(
    @Param('studentId') studentId: string,
    @Param('jobId') jobId: string
  ) {
    return {
      exists: await this.applicationService.checkExistingApplication(studentId, jobId)
    };
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Obtener todos los candidatos de la empresa' })
  async getCandidatesForCompany(@Param('companyId') companyId: string) {
    return await this.applicationService.getCandidatesForCompany(companyId);
  }
}
