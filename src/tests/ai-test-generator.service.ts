import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Question {
    id: number;
    type: 'multiple-choice' | 'code' | 'true-false';
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    question: string;
    options?: string[];
    correctAnswer: number | boolean | string;
    explanation: string;
    points: number;
    code?: string;
    testCases?: Array<{ input: string; output: string }>;
}

@Injectable()
export class AiTestGeneratorService {
    private apiKey: string | undefined;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    }

    async generateQuestions(
        jobTitle: string,
        skills: string[],
        difficulty: string = 'medium',
        count: number = 8,
    ): Promise<Question[]> {
        if (!this.apiKey) {
            console.warn('No GEMINI_API_KEY found, using fallback questions');
            return this.getFallbackQuestions(jobTitle, skills, count);
        }

        try {
            const prompt = this.buildPrompt(jobTitle, skills, difficulty, count);
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8192, // Aumentado para evitar MAX_TOKENS
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API error:', errorText);
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();

            // Log completo para debugging
            console.log('Gemini response structure:', JSON.stringify(data, null, 2).substring(0, 500));

            if (!data.candidates || data.candidates.length === 0) {
                console.error('No candidates in response. Full response:', JSON.stringify(data));
                throw new Error('No candidates in Gemini response - possibly blocked by safety filters');
            }

            if (!data.candidates[0]?.content?.parts?.[0]?.text) {
                console.error('Invalid response structure:', JSON.stringify(data));
                throw new Error('Invalid Gemini response structure');
            }

            const generatedText = data.candidates[0].content.parts[0].text;
            console.log('Generated text length:', generatedText.length);

            const questions = this.parseGeneratedQuestions(generatedText);

            if (questions.length === 0) {
                throw new Error('No questions parsed from AI response');
            }

            console.log(`🎉 Successfully generated ${questions.length} questions with AI`);
            return questions;
        } catch (error) {
            console.error('Error generating questions with AI:', error.message);
            console.warn('Falling back to predefined questions');
            return this.getFallbackQuestions(jobTitle, skills, count);
        }
    }

    private buildPrompt(
        jobTitle: string,
        skills: string[],
        difficulty: string,
        count: number,
    ): string {
        return `Eres un experto en recursos humanos y evaluación técnica. Genera exactamente ${count} preguntas de evaluación técnica para un puesto de "${jobTitle}".

Las preguntas deben enfocarse en estas habilidades específicas: ${skills.join(', ')}

Nivel de dificultad: ${difficulty}

IMPORTANTE: Genera preguntas de diferentes tipos:
- 40% Múltiple opción (4 opciones, solo una correcta)
- 30% Código (ejercicios prácticos de programación)
- 30% Verdadero/Falso

Para cada pregunta, proporciona:
1. type: "multiple-choice" | "code" | "true-false"
2. difficulty: "easy" | "medium" | "hard"
3. category: La habilidad específica que evalúa (de la lista proporcionada)
4. question: La pregunta clara y específica
5. options: Array de 4 opciones (solo para multiple-choice)
6. correctAnswer: La respuesta correcta (índice 0-3 para multiple-choice, booleano para true-false, código para code)
7. explanation: Explicación detallada de por qué esa es la respuesta correcta
8. points: Puntos según dificultad (easy: 5-8, medium: 10-15, hard: 15-20)
9. code: Código inicial (solo para type "code")
10. testCases: Array de casos de prueba (solo para type "code")

Responde ÚNICAMENTE con un JSON válido en este formato exacto (sin markdown, sin texto adicional):
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "difficulty": "medium",
      "category": "React",
      "question": "¿Cuál es la forma correcta de actualizar el estado en React?",
      "options": ["setState(newValue)", "setState(prev => prev + 1)", "this.state = newValue", "state = newValue"],
      "correctAnswer": 1,
      "explanation": "Cuando el nuevo estado depende del anterior, debes usar la forma funcional de setState.",
      "points": 10
    },
    {
      "id": 2,
      "type": "code",
      "difficulty": "hard",
      "category": "JavaScript",
      "question": "Implementa una función que retorne los números pares duplicados:",
      "code": "function duplicateEvens(arr) {\\n  // Tu código aquí\\n}",
      "correctAnswer": "return arr.filter(n => n % 2 === 0).map(n => n * 2);",
      "testCases": [
        {"input": "[1, 2, 3, 4]", "output": "[4, 8]"}
      ],
      "explanation": "Primero filtramos los pares con filter(), luego los duplicamos con map().",
      "points": 15
    },
    {
      "id": 3,
      "type": "true-false",
      "difficulty": "easy",
      "category": "React",
      "question": "Los hooks de React solo pueden usarse en componentes de clase.",
      "correctAnswer": false,
      "explanation": "Los hooks solo pueden usarse en componentes funcionales.",
      "points": 5
    }
  ]
}`;
    }

    private parseGeneratedQuestions(text: string): Question[] {
        try {
            let jsonText = text.trim();

            // Remover markdown
            jsonText = jsonText.replace(/```json\s*/g, '');
            jsonText = jsonText.replace(/```\s*/g, '');

            // Extraer JSON
            const firstBrace = jsonText.indexOf('{');
            const lastBrace = jsonText.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1) {
                jsonText = jsonText.substring(firstBrace, lastBrace + 1);
            }

            const parsed = JSON.parse(jsonText);
            console.log(`✅ Parsed ${parsed.questions?.length || 0} questions`);
            return parsed.questions || [];

        } catch (error) {
            console.error('❌ Parse error:', error.message);
            console.log('Text (first 1000):', text.substring(0, 1000));
            return [];
        }
    }

    private getFallbackQuestions(
        jobTitle: string,
        skills: string[],
        count: number,
    ): Question[] {
        // Preguntas de fallback basadas en las habilidades
        const allQuestions: Question[] = [
            // React
            {
                id: 1,
                type: 'multiple-choice',
                difficulty: 'medium',
                category: 'React',
                question:
                    '¿Cuál es la forma correcta de actualizar el estado en React cuando depende del estado anterior?',
                options: [
                    'setState(newValue)',
                    'setState(prevState => prevState + 1)',
                    'this.state = newValue',
                    'state = newValue',
                ],
                correctAnswer: 1,
                explanation:
                    'Cuando el nuevo estado depende del anterior, debes usar la forma funcional de setState para evitar problemas de concurrencia.',
                points: 10,
            },
            // JavaScript
            {
                id: 2,
                type: 'code',
                difficulty: 'hard',
                category: 'JavaScript',
                question:
                    'Completa la función para que retorne un array con los números pares duplicados:',
                code: 'function duplicateEvens(arr) {\n  // Tu código aquí\n}',
                correctAnswer: 'return arr.filter(n => n % 2 === 0).map(n => n * 2);',
                testCases: [
                    { input: '[1, 2, 3, 4, 5]', output: '[4, 8]' },
                    { input: '[10, 15, 20]', output: '[20, 40]' },
                ],
                explanation:
                    'Primero filtramos los números pares con filter(), luego los duplicamos con map().',
                points: 15,
            },
            // Node.js
            {
                id: 3,
                type: 'multiple-choice',
                difficulty: 'medium',
                category: 'Node.js',
                question: '¿Cuál es la diferencia entre req.params y req.query en Express?',
                options: [
                    'No hay diferencia',
                    'params son parámetros de ruta, query son parámetros de URL',
                    'params son POST, query son GET',
                    'params son opcionales, query son obligatorios',
                ],
                correctAnswer: 1,
                explanation:
                    'req.params contiene parámetros de ruta (/user/:id), mientras que req.query contiene parámetros de query string (?name=value).',
                points: 10,
            },
            // TypeScript
            {
                id: 4,
                type: 'true-false',
                difficulty: 'easy',
                category: 'TypeScript',
                question: 'TypeScript es un superset de JavaScript.',
                correctAnswer: true,
                explanation:
                    'TypeScript es un superset de JavaScript que añade tipado estático opcional.',
                points: 5,
            },
            // SQL
            {
                id: 5,
                type: 'code',
                difficulty: 'hard',
                category: 'SQL',
                question: 'Escribe una query SQL para obtener los 5 productos más vendidos:',
                code: '-- Tu query aquí',
                correctAnswer:
                    'SELECT p.name, SUM(o.quantity) as total FROM products p JOIN orders o ON p.id = o.product_id GROUP BY p.id ORDER BY total DESC LIMIT 5;',
                testCases: [{ input: 'products: 10, orders: 50', output: 'Top 5 products' }],
                explanation:
                    'Usamos JOIN para relacionar productos con órdenes, GROUP BY para agrupar, y ORDER BY con LIMIT para obtener el top 5.',
                points: 15,
            },
            // CSS
            {
                id: 6,
                type: 'multiple-choice',
                difficulty: 'easy',
                category: 'CSS',
                question: '¿Qué propiedad CSS se usa para hacer que un elemento sea flexible?',
                options: ['display: block', 'display: flex', 'position: relative', 'float: left'],
                correctAnswer: 1,
                explanation:
                    'display: flex convierte un elemento en un contenedor flexible, permitiendo usar Flexbox.',
                points: 5,
            },
            // Python
            {
                id: 7,
                type: 'code',
                difficulty: 'medium',
                category: 'Python',
                question: 'Escribe una función que retorne el elemento más frecuente en una lista:',
                code: 'def most_frequent(arr):\n    # Tu código aquí\n    pass',
                correctAnswer:
                    'from collections import Counter\nreturn Counter(arr).most_common(1)[0][0]',
                testCases: [
                    { input: '[1, 2, 2, 3, 3, 3]', output: '3' },
                    { input: '[5, 5, 1, 1, 5]', output: '5' },
                ],
                explanation:
                    'Usamos Counter de collections para contar frecuencias y most_common() para obtener el más frecuente.',
                points: 12,
            },
            // API REST
            {
                id: 8,
                type: 'multiple-choice',
                difficulty: 'medium',
                category: 'API REST',
                question: '¿Qué código HTTP se debe retornar al crear un recurso exitosamente?',
                options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
                correctAnswer: 1,
                explanation:
                    '201 Created indica que el recurso fue creado exitosamente. 200 OK es para operaciones exitosas en general.',
                points: 10,
            },
        ];

        // Filtrar preguntas relevantes según las habilidades
        const relevantQuestions = allQuestions.filter((q) =>
            skills.some((skill) => q.category.toLowerCase().includes(skill.toLowerCase())),
        );

        // Si hay suficientes preguntas relevantes, usarlas; si no, usar todas
        const questionsToUse =
            relevantQuestions.length >= count ? relevantQuestions : allQuestions;

        // Retornar el número solicitado
        return questionsToUse.slice(0, count);
    }
}
