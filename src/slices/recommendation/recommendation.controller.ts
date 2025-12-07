import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

export interface JobRecommendation {
  jobId: string;
  title: string;
  company: string;
  matchScore: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
}

export interface StudentCandidateMatch {
  studentId: string;
  studentName: string;
  matchScore: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('jobs-for-student/:studentId')
  @ApiOperation({
    summary: 'Obtener recomendaciones de empleos para un estudiante',
    description:
      'Retorna una lista de empleos recomendados basados en el matching de skills del estudiante con los requirements del job',
  })
  @ApiParam({
    name: 'studentId',
    description: 'ID del estudiante',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número máximo de recomendaciones (default: 5)',
    required: false,
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de empleos recomendados',
    schema: {
      example: [
        {
          jobId: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Desarrollador Full Stack',
          company: 'Tech Company',
          matchScore: 85,
          matchPercentage: 85.5,
          matchedSkills: ['React', 'Node.js', 'TypeScript'],
          missingSkills: ['Docker'],
          reasoning: 'Excelente match. Tienes 3 de 4 skills requeridos.',
        },
      ],
    },
  })
  async getRecommendedJobsForStudent(
    @Param('studentId') studentId: string,
    @Query('limit') limit: number = 5,
  ): Promise<JobRecommendation[]> {
    return this.recommendationService.recommendJobsForStudent(
      studentId,
      parseInt(limit.toString()),
    );
  }

  @Get('candidates-for-job/:jobId')
  @ApiOperation({
    summary: 'Obtener recomendaciones de candidatos para un empleo',
    description:
      'Retorna una lista de estudiantes recomendados basados en matching de skills con job requirements',
  })
  @ApiParam({
    name: 'jobId',
    description: 'ID del empleo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número máximo de candidatos (default: 10)',
    required: false,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de candidatos recomendados',
    schema: {
      example: [
        {
          studentId: '123e4567-e89b-12d3-a456-426614174000',
          studentName: 'Juan Perez',
          matchScore: 85,
          matchPercentage: 85.5,
          matchedSkills: ['React', 'Node.js', 'TypeScript'],
          missingSkills: ['Docker'],
        },
      ],
    },
  })
  async getRecommendedCandidatesForJob(
    @Param('jobId') jobId: string,
    @Query('limit') limit: number = 10,
  ): Promise<StudentCandidateMatch[]> {
    return this.recommendationService.recommendCandidatesForJob(
      jobId,
      parseInt(limit.toString()),
    );
  }

  @Get('match-score/:studentId/:jobId')
  @ApiOperation({
    summary: 'Calcular score de matching detallado',
    description:
      'Retorna un análisis detallado del matching entre un estudiante y un empleo',
  })
  @ApiParam({
    name: 'studentId',
    description: 'ID del estudiante',
  })
  @ApiParam({
    name: 'jobId',
    description: 'ID del empleo',
  })
  @ApiResponse({
    status: 200,
    description: 'Score detallado de matching',
    schema: {
      example: {
        matchScore: 85,
        skillsScore: 85,
        diversityScore: 10,
        totalScore: 95,
      },
    },
  })
  async getDetailedMatchScore(
    @Param('studentId') studentId: string,
    @Param('jobId') jobId: string,
  ) {
    return this.recommendationService.getDetailedMatchScore(studentId, jobId);
  }
}
