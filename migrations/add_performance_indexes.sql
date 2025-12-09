-- ======================================================
-- OPTIMIZACIONES DE ÍNDICES PARA POSTGRESSQL
-- Agregará significativamente al performance
-- ======================================================

-- =====================================================
-- ÍNDICES PARA STUDENTS (tabla más consultada)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_student_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_student_created_at ON students(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_email_created_at ON students(email, created_at DESC);

-- =====================================================
-- ÍNDICES PARA JOBS (tabla crítica)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_job_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_job_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_job_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_job_company_active ON jobs(company_id, is_active);

-- =====================================================
-- ÍNDICES PARA JOB_APPLICATIONS (relaciones críticas)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_job_application_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_application_student_id ON job_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_job_application_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_application_created_at ON job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_application_job_student ON job_applications(job_id, student_id);

-- =====================================================
-- ÍNDICES PARA PROJECTS (creationDate en lugar de created_at)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_project_student_id ON projects(student_id);
CREATE INDEX IF NOT EXISTS idx_project_creation_date ON projects("creationDate" DESC);

-- =====================================================
-- ÍNDICES PARA CERTIFICATIONS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_certification_student_id ON certifications(student_id);
CREATE INDEX IF NOT EXISTS idx_certification_created_at ON certifications(created_at DESC);

-- =====================================================
-- ÍNDICES PARA SKILLS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_student_skill_student_id ON student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skill_skill_id ON student_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_name ON skills(name);

-- =====================================================
-- ÍNDICES PARA PROFILE VIEWS
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_student_profile_view_student_id ON student_profile_views(student_id);
CREATE INDEX IF NOT EXISTS idx_student_profile_view_created_at ON student_profile_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_profile_view_company_id ON company_profile_views(company_id);
CREATE INDEX IF NOT EXISTS idx_company_profile_view_created_at ON company_profile_views(created_at DESC);

-- =====================================================
-- ÍNDICES PARA COMPANY
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_company_created_at ON companies(created_at DESC);

-- =====================================================
-- ÍNDICES PARA ACADEMIC_INFO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_academic_info_student_id ON academic_infos(student_id);

-- =====================================================
-- ÍNDICES PARA RECOMMENDATIONS/SEARCH (opcional - requiere extensión pg_trgm)
-- =====================================================
-- CREATE INDEX IF NOT EXISTS idx_student_skills_text ON students USING GIN(to_tsvector('spanish', bio));
-- CREATE INDEX IF NOT EXISTS idx_job_description_text ON jobs USING GIN(to_tsvector('spanish', description));
-- CREATE INDEX IF NOT EXISTS idx_job_requirements_text ON jobs USING GIN(to_tsvector('spanish', requirements));

-- =====================================================
-- VACUUM Y ANALYZE (ejecutar después de crear índices)
-- =====================================================
-- VACUUM ANALYZE;

-- =====================================================
-- VER ÍNDICES CREADOS
-- =====================================================
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public';
