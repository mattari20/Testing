# V2 Market Gap Analysis — eStudent CV Builder

## Research date

2026-09-29

## Scope

This document compares the audited eStudent production V1 capability set with current publicly documented capabilities of major international resume/CV platforms. It is descriptive research, not a ranking of vendors.

## eStudent V1 — observed public positioning

The current eStudent CV Builder presents itself as a free online CV builder for students and job seekers. Its public flow is organized around career level, industry and style, with templates for student/internship, entry level, mid level and senior/executive users. The public page also describes education, experience, skills, projects, certifications and achievements as CV content areas, and advertises editable sections, free PDF download, one-click layout switching and real-time preview.

Source: https://estudent.pk/cv-builder/

## International capability trends

### 1. Resume analysis is becoming a first-class workflow

Teal documents both a Resume Score and a separate Match Score. Its Resume Analyzer checks foundational resume structure/content and surfaces issue cards.

Source:
- https://www.tealhq.com/tools/resume-builder
- https://help.tealhq.com/en/articles/9524748-using-the-resume-analyzer

Rezi also offers an upload-based ATS Resume Checker that accepts PDF/DOCX and provides content and ATS-compatibility feedback.

Source:
- https://www.rezi.ai/tools/resume-checker

### 2. Job-specific matching is becoming central

Teal supports attaching a job description to a resume, extracting skills/keywords/phrasing, comparing the resume to the job and returning a Match Score plus recommendations.

Source:
- https://www.tealhq.com/tool/resume-job-description-match
- https://help.tealhq.com/en/articles/12060992-using-the-job-matcher

Rezi documents job-description tailoring and keyword-focused resume scoring.

Source:
- https://www.rezi.ai/tools/resume-checker
- https://www.rezi.ai/ai-resume-builder

### 3. AI assistance is moving inside the editor

Current platforms describe AI assistance for summaries, bullets, skills, rewriting and job-specific tailoring rather than treating AI as a separate generic chatbot.

Source:
- https://www.tealhq.com/tools/resume-builder
- https://www.rezi.ai/ai-resume-builder
- https://www.kickresume.com/en/ai-resume-writer/

### 4. Resume import is an important onboarding shortcut

Teal supports importing an existing resume and LinkedIn profile data. Kickresume also documents LinkedIn/PDF import.

Source:
- https://www.tealhq.com/tools/resume-builder
- https://www.kickresume.com/en/

This supports adding a V2 Import/Recovery workflow so users do not always start from a blank form.

### 5. Multiple resume versions are normal

Teal explicitly supports unlimited resume versions and job-specific matching. This supports a V2 Master Profile -> Multiple CV Versions architecture.

Source:
- https://www.tealhq.com/tools/resume-builder

### 6. Cover letters are integrated with resume workflows

Teal and Kickresume both document AI-assisted cover-letter generation tied to resumes/job descriptions.

Source:
- https://www.tealhq.com/tools/resume-builder
- https://www.kickresume.com/en/cover-letter-generator-from-resume/

### 7. Career platforms are expanding beyond the resume

Kickresume combines resume, cover letter, ATS checker, website builder, job-application tracking, mobile access and career planning.

Source:
- https://www.kickresume.com/en/
- https://www.kickresume.com/en/online-web/
- https://www.kickresume.com/en/job-application-tracker/

This supports designing eStudent's future Student Career Wallet as an extension point rather than making the CV Builder a closed standalone tool.

### 8. Cloud backup/storage options are already part of the market

Rezi documents Google Drive saving as an available capability.

Source:
- https://www.rezi.ai/ai-resume-builder

This validates keeping Google Drive backup as a possible V2/V3 option, while maintaining local-first use for users who do not want accounts.

## What this means for eStudent V2

The largest gap is not the number of templates. The largest gap is the absence of a flexible career-document data layer and intelligence layer around the existing renderer.

### High-priority capability areas

1. In-builder ATS readiness analysis.
2. Standalone ATS/CV checker with PDF/DOCX upload.
3. Job-description matching and Match Score.
4. Keyword/skill gap analysis.
5. AI-assisted section-level writing and rewriting.
6. Import existing CV.
7. Multiple CV versions from a master profile.
8. Dynamic/custom sections and fields.
9. Preview-side editing.
10. Semantic multi-page pagination.
11. Optional account/cloud save.
12. Backup/restore and user-controlled export.
13. Future Student Career Wallet integration.
14. Future job/application integration.
15. SEO architecture for tool pages and genuine search intents.

## Important product principle

Market features should not be copied merely because competitors expose them. V2 should implement the underlying capability where it fits eStudent's student-first product direction and long-term architecture.

## ATS wording principle

V2 should describe ATS results as readiness/compatibility analysis and job matching guidance, not as a guarantee that a particular employer ATS will accept or rank a resume in a specific way.
