import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CertificationService } from './certification.service';
import { CertificationResponseDto, CreateCertificationDto, UpdateCertificationDto } from './dto/certification.dto';

@ApiTags('Certifications')
@Controller('certifications')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) { }

  @Post('/student/:studentId')
  @ApiOperation({ summary: 'Crear certificación para un estudiante' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiBody({ type: CreateCertificationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Certificación creada exitosamente',
    type: CertificationResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Estudiante no encontrado' })
  async create(
    @Param('studentId') studentId: string,
    @Body() dto: CreateCertificationDto,
  ) {
    return await this.certificationService.create(studentId, dto);
  }

  @Get('/student/:studentId')
  @ApiOperation({ summary: 'Obtener todas las certificaciones de un estudiante' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de certificaciones del estudiante',
    type: [CertificationResponseDto]
  })
  async findByStudent(@Param('studentId') studentId: string) {
    return await this.certificationService.findByStudentId(studentId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar certificación' })
  @ApiParam({ name: 'id', description: 'ID de la certificación' })
  @ApiBody({ type: UpdateCertificationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Certificación actualizada exitosamente',
    type: CertificationResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Certificación no encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateCertificationDto) {
    return await this.certificationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar certificación' })
  @ApiParam({ name: 'id', description: 'ID de la certificación' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Certificación eliminada exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Certificación no encontrada' })
  async delete(@Param('id') id: string) {
    await this.certificationService.delete(id);
    return { message: 'Certificación eliminada exitosamente' };
  }
}