# Contributing to Tanova Skills Taxonomy

Thank you for your interest in contributing to the Tanova Skills Taxonomy! This is a **community-driven project** and we welcome contributions from developers, recruiters, HR professionals, and anyone passionate about making hiring more fair and intelligent.

---

## 🎯 How You Can Contribute

### 1. **Add New Skills**
The most valuable contribution is adding skills to the taxonomy with complete proficiency markers and transferability scores.

### 2. **Update Transferability Scores**
Based on real-world hiring data or personal experience, suggest improvements to skill transferability scores.

### 3. **Add Proficiency Markers**
Help us better assess candidate experience levels by adding specific, observable proficiency markers.

### 4. **Regional Variations**
Add localized skill names and variations (British vs. American English, regional terminology).

### 5. **Fix Errors**
Typos, wrong categorizations, outdated information, broken links, etc.

### 6. **Improve Documentation**
README improvements, usage examples, integration guides, tutorials.

---

## 📋 Contribution Guidelines

### Skill Addition Requirements

When adding a new skill, you **must** include:

1. **Canonical Name**: Properly capitalized official name
2. **Aliases**: At least 2-3 common variations
3. **Description**: Clear 1-2 sentence description (10-500 characters)
4. **Category & Subcategory**: Choose from existing or propose new
5. **Proficiency Levels**: All four levels (beginner, intermediate, advanced, expert) with:
   - At least 3 markers per level
   - Typical experience range
6. **Transferability Scores**: At least 2-3 related skills with scores (0-1 scale)
7. **Typical Roles**: At least 1 common role requiring this skill
8. **Industry Demand**: Realistic assessment (very_high, high, medium, low, declining)

### Schema Compliance

All skills must validate against [schemas/skill.schema.json](./schemas/skill.schema.json).

**Example valid skill:**

```json
{
  "id": "fastapi",
  "canonical_name": "FastAPI",
  "aliases": ["Fast API", "FastAPI Python", "FastAPI Framework"],
  "category": "technology",
  "subcategory": "backend_development",
  "tags": ["python", "web", "api", "async"],
  "description": "Modern, fast web framework for building APIs with Python",
  "parent_skills": ["python"],
  "child_skills": [],
  "related_skills": ["django", "flask", "starlette"],
  "transferability": {
    "django": 0.80,
    "flask": 0.85,
    "nodejs": 0.60
  },
  "proficiency_levels": {
    "beginner": {
      "markers": [
        "Built simple REST APIs",
        "Used Pydantic models",
        "Followed tutorials"
      ],
      "typical_experience": "0-1 years"
    },
    "intermediate": {
      "markers": [
        "Async endpoints",
        "Database integration",
        "Authentication and authorization",
        "Built production APIs"
      ],
      "typical_experience": "1-3 years"
    },
    "advanced": {
      "markers": [
        "Custom middleware",
        "Performance optimization",
        "Dependency injection patterns",
        "Testing strategies"
      ],
      "typical_experience": "3-5 years"
    },
    "expert": {
      "markers": [
        "Contributed to FastAPI ecosystem",
        "Built complex API architectures",
        "Deep understanding of async Python",
        "Authored FastAPI packages"
      ],
      "typical_experience": "5+ years"
    }
  },
  "typical_roles": [
    "Backend Developer",
    "Python Developer",
    "API Developer"
  ],
  "industry_demand": "high",
  "prerequisites": ["python"],
  "last_updated": "2025-12-11"
}
```

---

## 🛠️ How to Submit a Contribution

### Option 1: GitHub Pull Request (Recommended)

1. **Fork the repository**
   ```bash
   git clone https://github.com/tanova-ai/skills-taxonomy.git
   cd skills-taxonomy
   ```

2. **Create a new branch**
   ```bash
   git checkout -b add-skill-fastapi
   ```

3. **Add your skill** to `taxonomy.json` and `taxonomy.yaml`
   - Find the correct category and subcategory
   - Add your skill following the schema
   - Update both JSON and YAML files

4. **Validate your changes**
   ```bash
   # Python validation
   python -c "import json; json.load(open('taxonomy.json'))"

   # Or use the schema validator
   npm install -g ajv-cli
   ajv validate -s schemas/skill.schema.json -d taxonomy.json
   ```

5. **Commit with clear message**
   ```bash
   git add taxonomy.json taxonomy.yaml
   git commit -m "Add FastAPI skill to backend_development"
   ```

6. **Push and create PR**
   ```bash
   git push origin add-skill-fastapi
   ```
   Then create a Pull Request on GitHub

7. **Describe your PR**
   - Why this skill is important
   - How you determined transferability scores
   - Any data/research backing your proficiency markers

### Option 2: Issue Submission

If you're not comfortable with Git:

1. Go to [GitHub Issues](https://github.com/tanova-ai/skills-taxonomy/issues)
2. Create a new issue titled: "New Skill: [Skill Name]"
3. Provide all required skill data in the issue description
4. We'll review and add it for you

---

## ✅ Review Process

### What We Look For

1. **Accuracy**: Is the skill definition correct?
2. **Completeness**: Are all required fields filled?
3. **Quality**: Are proficiency markers specific and observable?
4. **Transferability**: Are scores realistic based on real-world hiring?
5. **Consistency**: Does it match the style of existing skills?

### Response Time

- Simple additions: 1-3 days
- Complex additions (new categories): 5-7 days
- We'll provide feedback if changes are needed

---

## 🎓 Best Practices

### Writing Good Proficiency Markers

**❌ Bad markers** (too vague):
- "Knows React"
- "Good at Python"
- "Experienced developer"

**✅ Good markers** (specific, observable):
- "Built production React apps with 10K+ users"
- "Implemented async Python with asyncio and FastAPI"
- "Architected microservices handling 1M+ requests/day"

### Determining Transferability Scores

Use this scale:

- **0.90-1.0**: Nearly identical skills (TypeScript ↔ JavaScript = 0.95)
- **0.75-0.89**: Highly transferable (React ↔ Vue.js = 0.85)
- **0.60-0.74**: Moderately transferable (Python ↔ JavaScript = 0.60)
- **0.40-0.59**: Some transfer (Backend ↔ Frontend = 0.45)
- **0.20-0.39**: Low transfer (Technical ↔ Sales = 0.25)
- **0.00-0.19**: No meaningful transfer

**Base transferability on**:
- Shared concepts and patterns
- Learning curve for someone switching
- Real hiring data (if available)
- Community consensus

---

## 🚫 What We Won't Accept

1. **Proprietary skills** (company-internal tools not used industry-wide)
2. **Deprecated skills** without replacement_skills field
3. **Duplicate skills** already in taxonomy
4. **Promotional content** (no marketing speak in descriptions)
5. **Incomplete submissions** (missing required fields)
6. **Unrealistic transferability** (scores not backed by reasoning)

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Mentioned in our blog posts about taxonomy updates
- Invited to join our community Slack

**Top contributors** (5+ quality additions) may receive:
- Tanova swag
- Early access to Tanova features
- Invitations to contribute to other projects

---

## 📝 Style Guide

### Naming Conventions

- **Skill IDs**: lowercase_with_underscores
- **Canonical Names**: Proper Capitalization (React, not react)
- **Categories**: lowercase (technology, business, creative)
- **Subcategories**: lowercase_with_underscores

### Consistency

- Use British English **or** American English consistently (not both)
- Use "0-1 years" format for experience (not "less than 1 year")
- Use proper technical terminology (not slang)

---

## 💬 Questions?

- **GitHub Discussions**: [Ask a question](https://github.com/tanova-ai/skills-taxonomy/discussions)
- **Email**: hello@tanova.ai
- **Twitter**: [@tanova_ai](https://twitter.com/tanova_ai)

---

## 📜 Code of Conduct

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/).

**TL;DR**:
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- No harassment, discrimination, or trolling

---

## 🙏 Thank You!

By contributing, you're helping make hiring more fair and intelligent for everyone. We're building this together! 🚀

**Made with ❤️ by [Tanova.ai](https://tanova.ai) and the community**
