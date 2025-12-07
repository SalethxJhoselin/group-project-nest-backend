import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../job/entity/job.entity';
import { Student } from '../student/student.entity';
import { StudentSkill } from '../skill/entity/student-skill.entity.dto';
import { JobApplication } from '../job/entity/job-application.entity';

interface SkillMatch {
  skill: string;
  studentLevel?: number;
  jobRequired: boolean;
}

interface JobRecommendation {
  jobId: string;
  title: string;
  company: string;
  matchScore: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
}

interface StudentCandidateMatch {
  studentId: string;
  studentName: string;
  matchScore: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(StudentSkill)
    private studentSkillRepo: Repository<StudentSkill>,
    @InjectRepository(JobApplication)
    private jobApplicationRepo: Repository<JobApplication>,
  ) {}

  /**
   * Extrae skills de un string (ej: "React, Node.js, TypeScript")
   * Normaliza el texto para comparaciones
   */
  private extractSkills(skillsText: string): string[] {
    if (!skillsText) return [];
    return skillsText
      .split(',')
      .map((skill) => skill.trim().toLowerCase())
      .filter((skill) => skill.length > 0);
  }

  /**
   * Calcula similitud entre dos strings usando Levenshtein distance
   * Rango: 0 (no similar) a 1 (idéntico)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    if (s1 === s2) return 1;

    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 1;

    const editDistance = this.getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calcula distancia de Levenshtein entre dos strings
   */
  private getEditDistance(s1: string, s2: string): number {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  /**
   * Encuentra los mejores matches de skills entre estudiante y job
   */
  private matchSkills(
    studentSkills: string[],
    jobSkills: string[],
  ): { matched: string[]; missing: string[] } {
    const matched: string[] = [];
    const missing: string[] = [];
    const similarityThreshold = 0.7; // 70% de similitud mínima

    for (const jobSkill of jobSkills) {
      let found = false;

      for (const studentSkill of studentSkills) {
        const similarity = this.calculateSimilarity(studentSkill, jobSkill);

        if (similarity >= similarityThreshold) {
          matched.push(jobSkill);
          found = true;
          break;
        }
      }

      if (!found) {
        missing.push(jobSkill);
      }
    }

    return { matched, missing };
  }

  /**
   * Calcula score de matching entre estudiante y job (0-100)
   */
  private calculateMatchingScore(
    matched: number,
    missing: number,
  ): { score: number; percentage: number } {
    const total = matched + missing;

    if (total === 0) {
      return { score: 50, percentage: 50 }; // Score neutral si no hay skills requeridos
    }

    const percentage = (matched / total) * 100;
    const score = Math.round(percentage);

    return { score, percentage: Math.round(percentage * 100) / 100 };
  }

  /**
   * Obtiene todas las skills del estudiante desde la BD
   */
  async getStudentSkills(studentId: string): Promise<string[]> {
    try {
      const skills = await this.studentSkillRepo.find({
        where: { student_id: studentId },
        relations: ['skill'],
      });

      if (!skills || skills.length === 0) {
        this.logger.warn(`No skills found for student ${studentId}`);
        return [];
      }

      return skills
        .map((s) => s.skill?.name?.toLowerCase().trim())
        .filter((s) => s && s.length > 0);
    } catch (error) {
      this.logger.error(`Error fetching skills for student ${studentId}:`, error);
      return [];
    }
  }

  /**
   * Recomienda empleos a un estudiante
   * Retorna top N empleos ordenados por score de matching
   */
  async recommendJobsForStudent(
    studentId: string,
    limit: number = 5,
  ): Promise<JobRecommendation[]> {
    try {
      // Obtener estudiante
      const student = await this.studentRepo.findOne({
        where: { id: studentId },
      });

      if (!student) {
        this.logger.warn(`Student ${studentId} not found`);
        return [];
      }

      // Obtener skills del estudiante
      const studentSkills = await this.getStudentSkills(studentId);

      // Obtener empleos activos
      const activeJobs = await this.jobRepo.find({
        where: { is_active: true },
        relations: ['company'],
      });

      if (!activeJobs || activeJobs.length === 0) {
        this.logger.warn('No active jobs found');
        return [];
      }

      // Calcular recomendaciones
      const recommendations: JobRecommendation[] = [];

      for (const job of activeJobs) {
        const jobSkills = this.extractSkills(job.requirements || '');
        const { matched, missing } = this.matchSkills(studentSkills, jobSkills);
        const { score, percentage } = this.calculateMatchingScore(
          matched.length,
          missing.length,
        );

        recommendations.push({
          jobId: job.id,
          title: job.title,
          company: job.company?.name || 'Unknown',
          matchScore: score,
          matchPercentage: percentage,
          matchedSkills: matched,
          missingSkills: missing,
          reasoning: this.generateReasoning(matched.length, missing.length, score),
        });
      }

      // Ordenar por score descendente y retornar top N
      return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      this.logger.error(
        `Error recommending jobs for student ${studentId}:`,
        error,
      );
      return [];
    }
  }

  /**
   * Recomienda candidatos (estudiantes) para un empleo
   * Basado en matching de skills con job requirements
   */
  async recommendCandidatesForJob(
    jobId: string,
    limit: number = 10,
  ): Promise<StudentCandidateMatch[]> {
    try {
      // Obtener job
      const job = await this.jobRepo.findOne({
        where: { id: jobId },
      });

      if (!job) {
        this.logger.warn(`Job ${jobId} not found`);
        return [];
      }

      const jobSkills = this.extractSkills(job.requirements || '');

      if (jobSkills.length === 0) {
        this.logger.warn(`No skills defined for job ${jobId}`);
        return [];
      }

      // Obtener todos los estudiantes
      const students = await this.studentRepo.find();

      if (!students || students.length === 0) {
        this.logger.warn('No students found');
        return [];
      }

      // Calcular matches
      const matches: StudentCandidateMatch[] = [];

      for (const student of students) {
        const studentSkills = await this.getStudentSkills(student.id);
        const { matched, missing } = this.matchSkills(studentSkills, jobSkills);
        const { score, percentage } = this.calculateMatchingScore(
          matched.length,
          missing.length,
        );

        matches.push({
          studentId: student.id,
          studentName: `${student.first_name} ${student.last_name}`,
          matchScore: score,
          matchPercentage: percentage,
          matchedSkills: matched,
          missingSkills: missing,
        });
      }

      // Ordenar por score y retornar top N
      return matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      this.logger.error(
        `Error recommending candidates for job ${jobId}:`,
        error,
      );
      return [];
    }
  }

  /**
   * Calcula un score de matching con contexto adicional
   * Considera: skills matching, aplicaciones previas, etc.
   */
  async getDetailedMatchScore(
    studentId: string,
    jobId: string,
  ): Promise<{
    matchScore: number;
    skillsScore: number;
    diversityScore: number;
    totalScore: number;
  }> {
    try {
      const student = await this.studentRepo.findOne({
        where: { id: studentId },
      });
      const job = await this.jobRepo.findOne({
        where: { id: jobId },
      });

      if (!student || !job) {
        this.logger.warn(`Student ${studentId} or Job ${jobId} not found`);
        return {
          matchScore: 0,
          skillsScore: 0,
          diversityScore: 0,
          totalScore: 0,
        };
      }

      // Score basado en skills
      const studentSkills = await this.getStudentSkills(studentId);
      const jobSkills = this.extractSkills(job.requirements || '');
      const { matched, missing } = this.matchSkills(studentSkills, jobSkills);
      const { score: skillsScore } = this.calculateMatchingScore(
        matched.length,
        missing.length,
      );

      // Score de diversidad (bonus si no ha aplicado antes)
      const previousApplication = await this.jobApplicationRepo.findOne({
        where: { student_id: studentId, job_id: jobId },
      });
      const diversityScore = previousApplication ? 0 : 10;

      // Total
      const totalScore = Math.min(100, skillsScore + diversityScore);

      return {
        matchScore: skillsScore,
        skillsScore,
        diversityScore,
        totalScore,
      };
    } catch (error) {
      this.logger.error(
        `Error calculating detailed match score:`,
        error,
      );
      return {
        matchScore: 0,
        skillsScore: 0,
        diversityScore: 0,
        totalScore: 0,
      };
    }
  }

  /**
   * Genera un string explicativo del matching
   */
  private generateReasoning(matched: number, missing: number, score: number): string {
    if (score >= 80) {
      return `Excelente match. Tienes ${matched} de ${matched + missing} skills requeridos.`;
    }
    if (score >= 60) {
      return `Buen match. Tienes ${matched} de ${matched + missing} skills requeridos. Te faltan ${missing}.`;
    }
    if (score >= 40) {
      return `Match moderado. Tienes ${matched} de ${matched + missing} skills requeridos.`;
    }
    return `Match bajo. Solo tienes ${matched} de ${matched + missing} skills requeridos.`;
  }
}
