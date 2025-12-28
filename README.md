# Open Skills Taxonomy

**A comprehensive, machine-readable skills taxonomy for AI-powered recruitment and HR tech**

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](./CHANGELOG.md)

> **Created and maintained by [Tanova.ai](https://tanova.ai)** - The AI platform where candidates see their fit score before applying.

---

## What is This?

The Open Skills Taxonomy is a **free, open-source library** of 100+ professional skills organized in a hierarchical, machine-readable format. It's designed to help developers, recruiters, and AI systems:

- **Normalize skill variations** ("React.js" = "ReactJS" = "React")
- **Understand skill relationships** (React is a subset of Frontend Development)
- **Map skills to proficiency levels** (Beginner → Expert)
- **Identify transferable skills** (Vue.js experience transfers to React)
- **Build better AI matching** (stop rejecting great candidates for keyword mismatches)

### Why We Built This

Traditional Applicant Tracking Systems (ATS) reject 75% of qualified candidates because of **keyword matching failures**:
- Candidate writes "Vue.js" → Job requires "React" → Rejected (even though skills transfer)
- Candidate writes "Machine Learning" → Job says "ML" → Rejected (same skill, different term)
- Self-taught engineer uses different terminology → Rejected (despite proven capability)

At **Tanova**, we use AI to evaluate candidates across 7 dimensions beyond keyword matching. This taxonomy powers our skill normalization and helps us find "hidden gem" candidates that traditional ATS systems miss.

**We're open-sourcing this so the entire HR tech community can build better tools.**

---

## Quick Start

### Installation

**Direct usage (recommended for v1.0):**
```bash
# Download taxonomy file
curl -O https://raw.githubusercontent.com/tanova/skills-taxonomy/main/taxonomy.json

# Or clone the repository
git clone https://github.com/tanova-ai/skills-taxonomy.git
```

**NPM/PyPI packages:**
```bash
# Coming soon - v1.1
npm install @tanova/skills-taxonomy  # Planned
pip install tanova-skills-taxonomy   # Planned
```

For now, import the JSON directly into your project.

### Basic Usage

**JavaScript/TypeScript:**
```typescript
import { SkillsTaxonomy } from '@tanova/skills-taxonomy'

const taxonomy = new SkillsTaxonomy()

// Normalize skill variations
taxonomy.normalize('react.js')  // → "React"
taxonomy.normalize('ReactJS')   // → "React"
taxonomy.normalize('React.js')  // → "React"

// Find skill by alias
taxonomy.findSkill('ML')        // → Returns full "Machine Learning" skill object

// Get skill hierarchy
taxonomy.getParents('React')    // → ["Frontend Development", "Web Development"]
taxonomy.getChildren('Frontend Development')  // → ["React", "Vue.js", "Angular", ...]

// Check if skills are related
taxonomy.areRelated('Vue.js', 'React')  // → true (both frontend frameworks)
taxonomy.getTransferability('Vue.js', 'React')  // → 0.85 (highly transferable)

// Find skills by category
taxonomy.getByCategory('programming_languages')  // → All programming languages

// Get typical roles for a skill
taxonomy.getRoles('React')  // → ["Frontend Engineer", "Full Stack Developer", ...]
```

**Python:**
```python
from tanova_skills_taxonomy import SkillsTaxonomy

taxonomy = SkillsTaxonomy()

# Normalize variations
skill = taxonomy.normalize('react.js')  # → "React"

# Find related skills
related = taxonomy.get_related('React')  # → ["Vue.js", "Angular", "JavaScript", ...]

# Get skill proficiency levels
levels = taxonomy.get_proficiency_markers('React')
# → {
#     "beginner": ["Built simple components", "Followed tutorials"],
#     "intermediate": ["Managed state with Redux", "Built production apps"],
#     "advanced": ["Optimized performance", "Built reusable libraries"],
#     "expert": ["Contributed to React core", "Architected large-scale apps"]
# }
```

---

## Taxonomy Structure

### Hierarchy

```
Category (e.g., Technology/Engineering)
  └─ Subcategory (e.g., Frontend Development)
      └─ Skill Group (e.g., JavaScript Frameworks)
          └─ Individual Skill (e.g., React)
              ├─ Aliases: ["React.js", "ReactJS", "React.js"]
              ├─ Related Skills: ["Vue.js", "Angular", "JavaScript"]
              ├─ Parent Skills: ["Frontend Development", "JavaScript"]
              ├─ Child Skills: ["React Hooks", "React Router", "Redux"]
              ├─ Proficiency Levels: [beginner, intermediate, advanced, expert]
              └─ Typical Roles: ["Frontend Engineer", "Full Stack Developer"]
```

### Skill Object Schema

Each skill includes:

```json
{
  "id": "react",
  "canonical_name": "React",
  "aliases": ["React.js", "ReactJS", "React.js", "React Framework"],
  "category": "technology",
  "subcategory": "frontend_development",
  "tags": ["javascript", "framework", "ui", "web"],
  "description": "JavaScript library for building user interfaces",
  "parent_skills": ["javascript", "frontend_development"],
  "child_skills": ["react_hooks", "react_router", "redux"],
  "related_skills": ["vue", "angular", "svelte"],
  "transferability": {
    "vue": 0.85,
    "angular": 0.75,
    "svelte": 0.80
  },
  "proficiency_levels": {
    "beginner": {
      "markers": ["Built simple components", "Followed tutorials", "Used create-react-app"],
      "typical_experience": "0-1 years"
    },
    "intermediate": {
      "markers": ["Managed state with hooks/Redux", "Built production apps", "Component lifecycle understanding"],
      "typical_experience": "1-3 years"
    },
    "advanced": {
      "markers": ["Performance optimization", "Custom hooks", "Testing strategies", "Micro-frontends"],
      "typical_experience": "3-5 years"
    },
    "expert": {
      "markers": ["React internals knowledge", "Contributed to React ecosystem", "Architected large-scale apps", "Mentors others"],
      "typical_experience": "5+ years"
    }
  },
  "typical_roles": [
    "Frontend Engineer",
    "Full Stack Developer",
    "React Developer",
    "UI Engineer"
  ],
  "industry_demand": "high",
  "last_updated": "2025-12-11"
}
```

---

## Coverage

### Categories

1. **Technology & Engineering** (~60 skills)
   - Programming Languages: Python, JavaScript, Java, C++, Go, Rust, etc.
   - Frontend: React, Vue.js, Angular, Svelte, TypeScript, etc.
   - Backend: Node.js, Django, Flask, Spring Boot, Express, etc.
   - Data & AI: Machine Learning, Data Science, TensorFlow, PyTorch, etc.
   - DevOps: Docker, Kubernetes, AWS, Azure, CI/CD, etc.
   - Databases: PostgreSQL, MongoDB, Redis, Elasticsearch, etc.

2. **Business & Finance** (~20 skills)
   - Strategy: Business Strategy, Market Analysis, Strategic Planning
   - Finance: Financial Analysis, Accounting, FP&A, Investment Analysis
   - Operations: Supply Chain, Logistics, Process Optimization
   - Consulting: Management Consulting, Strategy Consulting

3. **Marketing & Sales** (~10 skills)
   - Digital Marketing: SEO, SEM, Content Marketing, Social Media
   - Sales: B2B Sales, SaaS Sales, Account Management, Lead Generation
   - Analytics: Marketing Analytics, A/B Testing, Conversion Optimization

4. **Creative & Design** (~5 skills)
   - UX/UI Design: Figma, Sketch, User Research, Wireframing
   - Graphic Design: Adobe Creative Suite, Branding, Typography
   - Content: Copywriting, Content Strategy, Storytelling

5. **Data & Analytics** (~3 skills)
   - Data Analysis: SQL, Excel, Tableau, Power BI
   - Data Engineering: ETL, Data Pipelines, Spark, Airflow
   - Statistics: Statistical Analysis, Hypothesis Testing, Regression

6. **Product Management** (~2 skills)
   - Product Strategy, Roadmapping, User Stories, Agile/Scrum
   - A/B Testing, Product Analytics, Stakeholder Management

**Note:** Current version (1.0.0) focuses on technology skills. Future versions will expand business, marketing, and creative categories.

---

## Features

### 1. Alias Normalization

Handles common variations automatically:

```javascript
// All normalize to "JavaScript"
normalize('JavaScript')
normalize('JS')
normalize('Javascript')
normalize('java script')  // common typo
normalize('JAVASCRIPT')
normalize('ECMAScript')
```

### 2. Regional Variations

```javascript
// British vs. American English
normalize('Colour Theory')  // → "Color Theory"
normalize('Optimisation')   // → "Optimization"
normalize('Analyse')        // → "Analyze"
```

### 3. Transferability Scores

Quantify how easily skills transfer (0-1 scale):

```javascript
getTransferability('Vue.js', 'React')  // → 0.85 (highly transferable)
getTransferability('Python', 'JavaScript')  // → 0.60 (moderate transfer)
getTransferability('Python', 'Project Management')  // → 0.10 (low transfer)
```

**Use case:** When screening candidates, reduce "keyword mismatch" rejections by recognizing transferable skills.

### 4. Proficiency Markers

Identify candidate proficiency level based on context clues:

```javascript
assessProficiency('React', 'Built simple todo app following tutorial')
// → "beginner"

assessProficiency('React', 'Architected micro-frontend platform for 50+ teams')
// → "expert"
```

### 5. Skill Relationship Graph

Navigate skill relationships:

```javascript
// Get the full learning path
getSkillPath('Python', 'Machine Learning')
// → ["Python", "NumPy", "Pandas", "Scikit-learn", "Machine Learning"]

// Find prerequisite skills
getPrerequisites('Machine Learning')
// → ["Python", "Statistics", "Linear Algebra", "Calculus"]
```

---

## Use Cases

### 1. **AI-Powered Resume Screening**

Stop rejecting qualified candidates for keyword mismatches:

```typescript
// Candidate CV mentions "Vue.js", Job requires "React"
const transferability = taxonomy.getTransferability('vue', 'react')
// → 0.85 (highly transferable)

if (transferability > 0.7) {
  // Don't auto-reject - candidate can likely learn React quickly
  score.qualification -= 1  // Minor penalty instead of rejection
  score.capability = 8       // Vue.js experience = React capability
}
```

**Result:** Find 3-5x more qualified candidates.

### 2. **Skill Gap Analysis**

```typescript
const requiredSkills = ['react', 'typescript', 'node', 'aws']
const candidateSkills = ['vue', 'javascript', 'express', 'gcp']

const gaps = taxonomy.analyzeGaps(requiredSkills, candidateSkills)
// → {
//   critical_gaps: [],  // No critical gaps (all transferable)
//   minor_gaps: ['typescript'],  // Has JS, can learn TS
//   transferable: [
//     { required: 'react', has: 'vue', transferability: 0.85 },
//     { required: 'node', has: 'express', transferability: 0.90 },
//     { required: 'aws', has: 'gcp', transferability: 0.75 }
//   ]
// }
```

### 3. **Learning Path Recommendations**

```typescript
// Candidate wants to transition from Frontend to Full Stack
const currentSkills = ['react', 'javascript', 'css']
const targetRole = 'Full Stack Developer'

const learningPath = taxonomy.generateLearningPath(currentSkills, targetRole)
// → [
//   { skill: 'Node.js', priority: 'high', why: 'Extends JavaScript to backend' },
//   { skill: 'PostgreSQL', priority: 'high', why: 'Essential database skill' },
//   { skill: 'REST APIs', priority: 'medium', why: 'Connect frontend to backend' },
//   { skill: 'Docker', priority: 'low', why: 'Useful but not critical for junior full stack' }
// ]
```

### 4. **Job Posting Optimization**

```typescript
// Check if job requirements are too narrow
const jobSkills = ['react', 'redux', 'graphql', 'apollo']

const broadened = taxonomy.broadenRequirements(jobSkills)
// → {
//   required: ['react'],  // Keep this specific
//   alternatives: {
//     'redux': ['zustand', 'mobx', 'react_context'],  // State management alternatives
//     'graphql': ['rest_api', 'trpc'],  // API alternatives
//     'apollo': ['relay', 'urql', 'react_query']  // GraphQL client alternatives
//   }
// }
```

---

## How Tanova Uses This

At **[Tanova.ai](https://tanova.ai)**, we evaluate candidates using a 7-dimensional framework that goes far beyond keyword matching:

1. **Qualification Match** - Do they have the skills? (uses this taxonomy for normalization)
2. **Capability Confidence** - Can they actually do the job? (portfolio + transferable skills)
3. **Situational Stability** - Will they join and stay?
4. **Reward Potential** - What's the upside if this hire works out?
5. **Cultural Fit** - Will they thrive in your environment?
6. **Career Trajectory** - Are they growing and learning?
7. **Compensation Alignment** - Will salary expectations match budget?

**This taxonomy powers Dimension #1** (Qualification Match) and helps inform **Dimension #2** (Capability Confidence) by recognizing transferable skills.

**Try Tanova for free:** [tanova.ai/check-cv](https://tanova.ai/check-cv)

---

## API Reference

### Core Functions

#### `normalize(skill: string): string`
Normalize skill variations to canonical name.

#### `findSkill(query: string): Skill | null`
Find skill by canonical name or alias.

#### `getParents(skillId: string): Skill[]`
Get parent skills in hierarchy.

#### `getChildren(skillId: string): Skill[]`
Get child/sub-skills.

#### `getRelated(skillId: string, options?: { includeTransferable?: boolean, minTransferability?: number, namesOnly?: boolean }): Skill[] | string[]`
Get related skills (same domain, transferable).

**Options:**
- `includeTransferable` - Include skills with high transferability (default: `false`)
- `minTransferability` - Minimum transferability score when `includeTransferable` is true (default: `0.8`)
- `namesOnly` - Return skill names instead of full objects (default: `false`)

**Examples:**
```typescript
// Get explicitly related skills only (backward compatible)
taxonomy.getRelated('React')
// Returns: [{ id: 'vue', canonical_name: 'Vue.js', ... }, { id: 'angular', canonical_name: 'Angular', ... }]

// Include highly transferable skills (80%+)
taxonomy.getRelated('React', { includeTransferable: true })
// Returns: [...related skills + highly transferable skills]

// Include skills with lower transferability threshold (70%+)
taxonomy.getRelated('React', { includeTransferable: true, minTransferability: 0.7 })

// Get just skill names
taxonomy.getRelated('React', { namesOnly: true, includeTransferable: true })
// Returns: ['Vue.js', 'Angular', 'Svelte', ...]
```

#### `areRelated(skill1: string, skill2: string): boolean`
Check if two skills are related.

#### `getTransferability(from: string, to: string): number`
Get transferability score (0-1) between skills.

#### `getByCategory(category: string): Skill[]`
Get all skills in a category.

#### `getRoles(skillId: string): string[]`
Get typical roles requiring this skill.

#### `assessProficiency(skillId: string, context: string): ProficiencyLevel`
Estimate proficiency level from context description.

#### `analyzeGaps(required: string[], candidate: string[]): GapAnalysis`
Analyze skill gaps between requirements and candidate skills.

#### `generateLearningPath(current: string[], target: string): LearningPath`
Generate recommended learning path.

---

## Contributing

We welcome contributions! This taxonomy is meant to be a **community resource**.

### How to Contribute

1. **Add skills:** Create PR with new skills following schema
2. **Update transferability scores:** Based on real-world hiring data
3. **Add proficiency markers:** Help assess candidate experience levels
4. **Regional variations:** Add localized skill names
5. **Fix errors:** Typos, wrong categorizations, outdated info

### Contribution Guidelines

- Follow the JSON schema exactly
- Include at least 2-3 aliases per skill
- Add proficiency markers for all levels (beginner → expert)
- Test transferability scores against real job market
- Document your reasoning in PR description

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.**

---

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major** (1.x.x → 2.x.x): Breaking schema changes
- **Minor** (x.1.x → x.2.x): New skills, categories, or non-breaking features
- **Patch** (x.x.1 → x.x.2): Bug fixes, typos, minor updates

**Current version:** 1.0.0

**See [CHANGELOG.md](./CHANGELOG.md) for release notes.**

---

## License

**Creative Commons Attribution 4.0 International (CC BY 4.0)**

✓ Free to use in commercial and open-source projects
✓ Adapt and build upon the taxonomy
✗ Must provide attribution to Tanova

See [LICENSE](./LICENSE) for full terms.

**Attribution example:**
```
This project uses the Open Skills Taxonomy by Tanova
(https://github.com/tanova-ai/skills-taxonomy), licensed under CC BY 4.0.
```

---

## Credits

**Created and maintained by [Tanova.ai](https://tanova.ai)**

Tanova is the only platform where candidates see their fit score **before** applying—helping companies find hidden gem candidates that traditional ATS systems miss.

- **Website:** [tanova.ai](https://tanova.ai)
- **Try Free Tool:** [tanova.ai/check-cv](https://tanova.ai/check-cv)
- **API Access:** [tanova.ai/integrations](https://tanova.ai/integrations)
- **Contact:** hello@tanova.ai

### Contributors

- [Your Name / Tanova Team](https://tanova.ai)
- [Community contributors welcome!](./CONTRIBUTING.md)

---

## Acknowledgments

This taxonomy draws inspiration from:
- [O*NET](https://www.onetcenter.org/) - U.S. Department of Labor occupational database
- [ESCO](https://ec.europa.eu/esco/portal) - European Skills/Competences/Occupations
- [LinkedIn Skills Taxonomy](https://engineering.linkedin.com/) - Industry skills mapping
- Real-world hiring data from 100,000+ evaluations at Tanova

---

## Related Projects

- **[Tanova 7D Framework](https://tanova.ai/7d-framework)** - Multi-dimensional candidate evaluation
- **[OpenAI Job Descriptions](https://github.com/openai/job-descriptions)** - AI-generated job descriptions
- **[Resume Parser](https://github.com/topics/resume-parser)** - Open-source resume parsing

---

## Frequently Asked Questions

**Q: Is this really free?**
Yes! CC BY 4.0 licensed. Use it in your commercial products as long as you provide attribution.

**Q: Why did Tanova open-source this?**
We believe the recruiting industry needs better tools. Traditional ATS keyword matching fails everyone—candidates and companies. By open-sourcing our taxonomy, we help the entire industry build better AI.

**Q: How is this different from LinkedIn's taxonomy?**
LinkedIn's taxonomy is proprietary. Ours is open, machine-readable, and specifically designed for AI-powered recruiting with transferability scores and proficiency markers.

**Q: Can I contribute?**
Yes! See [CONTRIBUTING.md](./CONTRIBUTING.md).

**Q: How often is this updated?**
Monthly. We track emerging skills and market demand shifts.

**Q: Does this work for non-English languages?**
Version 1.0 is English-only. We're working on multilingual support for version 2.0.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/tanova-ai/skills-taxonomy/issues)
- **Discussions:** [GitHub Discussions](https://github.com/tanova-ai/skills-taxonomy/discussions)
- **Email:** hello@tanova.ai
- **Twitter:** [@tanova_ai](https://twitter.com/tanova_ai)

---

**Made with ❤️ by [Tanova.ai](https://tanova.ai) - Find talent that traditional ATS systems miss.**
