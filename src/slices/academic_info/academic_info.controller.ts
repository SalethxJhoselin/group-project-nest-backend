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
import { AcademicInfoService } from './academic_info.service';
import { AcademicInfoResponseDto, CreateAcademicInfoDto, UpdateAcademicInfoDto } from './dto/academic_info.dto';

@ApiTags('Academic Info')
@Controller('academic-info')
export class AcademicInfoController {
  constructor(private readonly academicInfoService: AcademicInfoService) { }

  @Post('/student/:studentId')
  @ApiOperation({ summary: 'Crear información académica para un estudiante' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiBody({ type: CreateAcademicInfoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Información académica creada exitosamente',
    type: AcademicInfoResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Estudiante no encontrado' })
  async create(
    @Param('studentId') studentId: string,
    @Body() dto: CreateAcademicInfoDto,
  ) {
    return await this.academicInfoService.create(studentId, dto);
  }

  @Get('/student/:studentId')
  @ApiOperation({ summary: 'Obtener toda la información académica de un estudiante' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de información académica del estudiante',
    type: [AcademicInfoResponseDto]
  })
  async findByStudent(@Param('studentId') studentId: string) {
    return await this.academicInfoService.findByStudentId(studentId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar información académica' })
  @ApiParam({ name: 'id', description: 'ID de la información académica' })
  @ApiBody({ type: UpdateAcademicInfoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Información académica actualizada exitosamente',
    type: AcademicInfoResponseDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Información académica no encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateAcademicInfoDto) {
    return await this.academicInfoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar información académica' })
  @ApiParam({ name: 'id', description: 'ID de la información académica' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Información académica eliminada exitosamente' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Información académica no encontrada' })
  async delete(@Param('id') id: string) {
    await this.academicInfoService.delete(id);
    return { message: 'Información académica eliminada exitosamente' };
  }
}