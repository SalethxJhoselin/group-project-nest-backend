import { Injectable, NotFoundException } from '@nestjs/common';
import { AiTestGeneratorService, Question } from './ai-test-generator.service';

interface Answer {
    questionId: number;
    answer: any;
    type: string;
    correctAnswer: any;
    points: number;
    options?: string[];
    question?: string;
}

@Injectable()
export class TestsService {
    constructor(private aiGenerator: AiTestGeneratorService) { }

    async generateTest(applicationId: number, userId: number) {
        // TODO: Cuando tengas las entidades, obtener la aplicación y el job
        // const application = await this.applicationRepository.findOne({
        //   where: { id: applicationId, student: { id: userId } },
        //   relations: ['job']
        // });

        // Mock data mientras implementas las entidades
        const job = {
            id: 1,
            title: 'Desarrollador Frontend',
            requirements: 'React, JavaScript, TypeScript, CSS, HTML, Redux',
            description: 'Buscamos desarrollador frontend con experiencia en React',
        };

        // Extraer habilidades del job
        const skills = this.extractSkills(job.requirements);

        // Generar preguntas con IA
        const questions = await this.aiGenerator.generateQuestions(
            job.title,
            skills,
            'medium',
            6, // Reducido a 6 para evitar MAX_TOKENS
        );

        // TODO: Guardar el test en la base de datos
        // const test = this.testRepository.create({ ... });
        // await this.testRepository.save(test);

        return {
            testId: `test-${Date.now()}`,
            applicationId,
            title: `Test de ${job.title}`,
            description: `Test generado por IA basado en las habilidades requeridas para ${job.title}`,
            duration: 30,
            totalQuestions: questions.length,
            totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
            questions,
            generatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
    }

    async submitTest(testId: string, answers: Answer[], userId: number) {
        // TODO: Obtener el test de la base de datos
        // const test = await this.testRepository.findOne({ where: { id: testId } });

        // Evaluar respuestas
        const results = answers.map((answer) => {
            const isCorrect = this.evaluateAnswer(answer);

            return {
                questionId: answer.questionId,
                isCorrect,
                userAnswer: answer.answer,
                correctAnswer: answer.correctAnswer,
                points: isCorrect ? answer.points : 0,
                type: answer.type,
                options: answer.options || null,
                question: answer.question || null,
                explanation: null, // TODO: agregar explicaciones desde la BD
            };
        });

        const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
        const maxPoints = answers.reduce((sum, a) => sum + a.points, 0);
        const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

        // TODO: Guardar resultado en la base de datos
        // const testResult = this.testResultRepository.create({ ... });
        // await this.testResultRepository.save(testResult);

        return {
            testId,
            score,
            totalPoints,
            maxPoints,
            results,
            completedAt: new Date().toISOString(),
            feedback: this.generateFeedback(score),
        };
    }

    async getAvailableTests(userId: number) {
        // TODO: Obtener de la base de datos
        // return await this.applicationRepository.find({ ... });

        // Mock data
        return [
            {
                id: 1,
                applicationId: 1,
                jobTitle: 'Frontend Developer',
                companyName: 'TechCorp Bolivia',
                status: 'pending',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 2,
                applicationId: 2,
                jobTitle: 'Full Stack Developer',
                companyName: 'Innovatech S.R.L.',
                status: 'pending',
                expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
    }

    async getTestHistory(userId: number) {
        // TODO: Obtener de la base de datos
        // return await this.testResultRepository.find({ ... });

        // Mock data
        return [
            {
                id: 1,
                testId: 'test-123',
                jobTitle: 'Backend Developer',
                companyName: 'StartupBolivia',
                score: 85,
                totalPoints: 68,
                maxPoints: 80,
                completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 28,
            },
        ];
    }

    private extractSkills(requirements: string): string[] {
        const commonSkills = [
            'React',
            'Angular',
            'Vue',
            'JavaScript',
            'TypeScript',
            'Node.js',
            'Python',
            'Java',
            'C#',
            'PHP',
            'Ruby',
            'Go',
            'SQL',
            'MongoDB',
            'PostgreSQL',
            'MySQL',
            'Docker',
            'Kubernetes',
            'AWS',
            'Git',
            'REST',
            'GraphQL',
            'HTML',
            'CSS',
            'Redux',
            'Express',
            'NestJS',
        ];

        return commonSkills.filter((skill) =>
            requirements.toLowerCase().includes(skill.toLowerCase()),
        );
    }

    private evaluateAnswer(answer: Answer): boolean {
        if (answer.type === 'multiple-choice') {
            // Ambos deben ser índices numéricos
            return Number(answer.answer) === Number(answer.correctAnswer);
        }

        if (answer.type === 'true-false') {
            // Convertir a booleano si viene como string
            const userAnswer = typeof answer.answer === 'string'
                ? answer.answer === 'true'
                : Boolean(answer.answer);
            const correctAnswer = typeof answer.correctAnswer === 'string'
                ? answer.correctAnswer === 'true'
                : Boolean(answer.correctAnswer);
            return userAnswer === correctAnswer;
        }

        if (answer.type === 'code') {
            // Evaluación básica de código por similitud
            const userCode = String(answer.answer || '').trim().toLowerCase();
            const correctCode = String(answer.correctAnswer || '').trim().toLowerCase();

            if (userCode.length < 10) return false;

            // Verificar si contiene palabras clave de la solución
            const keywords = correctCode.split(/\W+/).filter((w) => w.length > 3);
            const matchedKeywords = keywords.filter((k) => userCode.includes(k));

            return matchedKeywords.length >= keywords.length * 0.6;
        }

        return false;
    }

    private generateFeedback(score: number) {
        if (score >= 90) {
            return {
                level: 'excellent',
                message: 'Excelente trabajo! Demuestras un dominio sólido de los conceptos.',
                recommendations: [
                    'Estás listo para roles senior',
                    'Considera aplicar a posiciones de liderazgo técnico',
                    'Comparte tu conocimiento con la comunidad',
                ],
            };
        } else if (score >= 70) {
            return {
                level: 'good',
                message: 'Buen desempeño! Tienes una base sólida.',
                recommendations: [
                    'Refuerza los temas donde tuviste errores',
                    'Practica más ejercicios de código',
                    'Revisa la documentación oficial',
                ],
            };
        } else if (score >= 50) {
            return {
                level: 'average',
                message: 'Desempeño aceptable, pero hay áreas de mejora.',
                recommendations: [
                    'Dedica más tiempo a estudiar los fundamentos',
                    'Realiza proyectos prácticos',
                    'Toma cursos online especializados',
                ],
            };
        } else {
            return {
                level: 'needs-improvement',
                message: 'Necesitas reforzar tus conocimientos en esta área.',
                recommendations: [
                    'Comienza con tutoriales básicos',
                    'Practica diariamente con ejercicios simples',
                    'Busca mentoría o cursos estructurados',
                    'No te desanimes, sigue practicando',
                ],
            };
        }
    }
}
