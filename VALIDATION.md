# Skills Taxonomy - Validation Guide

## Overview

As the taxonomy grows, automated validation is critical to maintain data quality and integrity. This guide explains our validation system.

## Validation Tools

### 1. Main Validator: `validate_taxonomy.py`

**Runs 19 comprehensive tests:**

```bash
python3 validate_taxonomy.py
```

**Test Categories:**

#### ✅ Test 1: Basic Structure (4 tests)
- JSON is valid
- Has required top-level fields (version, last_updated, categories)
- All skills have required fields (id, canonical_name, aliases, etc.)
- Proficiency levels complete (beginner, intermediate, advanced, expert)

#### ✅ Test 2: Data Integrity (8 tests)
- No duplicate skill IDs
- No duplicate canonical names
- Skill IDs follow format (lowercase_with_underscores)
- Parent skills exist (no broken references)
- Child skills exist (no broken references)
- Related skills exist (no broken references)
- Transferability targets exist (no broken references)
- Prerequisites exist (no broken references)

#### ✅ Test 3: Consistency (7 tests)
- Transferability scores between 0-1
- All skills have aliases
- No self-references
- Category/subcategory match location
- Industry demand is valid (very_high, high, medium, low, declining)
- All skills have typical roles
- Description length 10-500 characters

**Output:**

```
🔍 VALIDATING SKILLS TAXONOMY
======================================================================

📋 Test 1: Basic Structure
✅ JSON is valid
✅ Has required top-level fields
✅ All skills have required fields
✅ Proficiency levels complete

📋 Test 2: Data Integrity
✅ No duplicate skill IDs
✅ No duplicate canonical names
✅ Skill IDs follow format
✅ Parent skills exist
✅ Child skills exist
✅ Related skills exist
✅ Transferability targets exist
✅ Prerequisites exist

📋 Test 3: Consistency
✅ Transferability scores 0-1
✅ All skills have aliases
✅ No self-references
✅ Category/subcategory match location
✅ Industry demand is valid
✅ All skills have typical roles
✅ Description length 10-500 chars

📊 STATISTICS
Total Skills: 34
Total Aliases: 103 (avg 3.0/skill)
Total Transferability Links: 32

By Category:
  business: 7 skills
  technology: 27 skills

By Demand:
  Very High: 21 skills
  High: 10 skills
  Medium: 2 skills
  Low: 1 skills

📋 VALIDATION SUMMARY
Tests Passed: 19
Tests Failed: 0
Warnings: 0

✅ 🎉 All 19 tests passed! Taxonomy is valid.
```

### 2. Reference Fixer: `fix_references.py`

**Automatically fixes broken skill references:**

```bash
python3 fix_references.py
```

**What it does:**
- Removes references to skills not yet in taxonomy
- Cleans up parent_skills, child_skills, related_skills
- Removes invalid transferability targets
- Removes invalid prerequisites

**Example output:**
```
🔧 Fixing broken skill references...
----------------------------------------------------------------------
Available skill IDs: 34

  'typescript': Removed missing transferability: {'csharp'}
  'python': Removed missing children: {'flask', 'pandas'}
  'react': Removed missing parents: {'frontend_development'}
  ...

✅ Fixed 91 broken references
💾 Saved to taxonomy.json
```

**When to use:**
- After manually editing taxonomy.json
- When validation shows broken references
- Before adding new skills that reference future skills

### 3. Library Tests: `test_examples.py`

**Tests Python library with real examples:**

```bash
python3 test_examples.py
```

**What it tests:**
- Skill normalization
- Transferability scoring
- Gap analysis
- Statistics generation

**Example output:**
```
Running Skills Taxonomy Examples
============================================================

Example 1: Normalize Skill Variations
  'react.js' → 'React'
  'JS' → 'JavaScript'

Example 2: Skill Transferability Scores
  Vue.js → React: 0.85
  Express → Node.js: 0.90

Example 3: Skill Gap Analysis
  Transferable skills:
    - React ← Vue.js (transfer: 85%)
    - TypeScript ← JavaScript (transfer: 95%)

✅ All examples completed successfully!
```

### 4. TypeScript Tests

```bash
npx tsx examples/typescript_example.ts
```

Same functionality as Python tests but for TypeScript library.

## Pre-Commit Hook

**Automatic validation before every commit:**

### Setup

```bash
# Link the hook
ln -s ../../.githooks/pre-commit .git/hooks/pre-commit

# Make executable (if needed)
chmod +x .githooks/pre-commit
```

### How it works

When you run `git commit`:
1. Automatically runs `validate_taxonomy.py`
2. If validation fails, commit is blocked
3. You must fix errors before committing

### Bypass (not recommended)

```bash
git commit --no-verify
```

## Validation Workflow

### When Adding New Skills

1. **Edit taxonomy.json** - Add your new skill
2. **Run validation** - `python3 validate_taxonomy.py`
3. **Fix any errors** - Usually broken references
4. **Run fixer if needed** - `python3 fix_references.py`
5. **Test libraries** - `python3 test_examples.py`
6. **Commit** - Pre-commit hook validates automatically

### Common Errors & Fixes

#### Error: "Skill references missing parent/child/related"

**Cause:** You referenced a skill that doesn't exist yet

**Fix Options:**
1. Add the referenced skill first
2. Remove the reference temporarily
3. Run `fix_references.py` to auto-clean

**Example:**
```json
{
  "id": "react",
  "parent_skills": ["frontend_development"]  // ERROR if frontend_development doesn't exist
}
```

**Fix:**
```json
{
  "id": "react",
  "parent_skills": ["javascript"]  // Reference existing skill
}
```

#### Error: "Duplicate skill ID"

**Cause:** Two skills have the same ID

**Fix:** Rename one of them

#### Error: "Skill ID doesn't match pattern"

**Cause:** ID uses wrong format (e.g., "React" instead of "react")

**Fix:** Use lowercase_with_underscores: `react`, `next_js`, `machine_learning`

#### Error: "Transferability score not between 0-1"

**Cause:** Invalid score like 1.5 or -0.3

**Fix:** Use score between 0.0 (no transfer) and 1.0 (perfect transfer)

#### Error: "Description length not 10-500 chars"

**Cause:** Description too short or too long

**Fix:** Write 1-2 sentence description (10-500 characters)

## File Structure Considerations

### Current Approach: Single File

**Pros:**
- ✅ Simple to manage
- ✅ Easy to load
- ✅ Single source of truth
- ✅ Works well up to 100+ skills

**Cons:**
- ❌ Large file can be hard to edit manually
- ❌ Git conflicts more likely with multiple contributors
- ❌ Harder to review changes in PRs

**Current size:** 34 skills, ~1,600 lines JSON - **Still manageable**

### Alternative: Split by Category

If taxonomy grows beyond 100 skills, consider splitting:

```
taxonomy/
├── technology/
│   ├── programming_languages.json
│   ├── frontend_development.json
│   ├── backend_development.json
│   └── ...
├── business/
│   ├── sales.json
│   ├── marketing.json
│   └── ...
└── index.json  # Master file with references
```

**When to split:** 100+ skills or frequent merge conflicts

**How to split:** Create `split_taxonomy.py` script to automate

## JSON Schema Validation

### Schema File: `schemas/skill.schema.json`

Defines the structure each skill must follow.

### Validate Against Schema

```bash
# Using ajv-cli (npm install -g ajv-cli)
ajv validate -s schemas/skill.schema.json -d taxonomy.json
```

### Schema Validation in Code

```python
import json
import jsonschema

with open('schemas/skill.schema.json') as f:
    schema = json.load(f)

with open('taxonomy.json') as f:
    taxonomy = json.load(f)

# Validate each skill
for skill in get_all_skills(taxonomy):
    jsonschema.validate(skill, schema)
```

## CI/CD Integration

### GitHub Actions (Recommended)

Create `.github/workflows/validate-taxonomy.yml`:

```yaml
name: Validate Taxonomy

on:
  pull_request:
    paths:
      - 'taxonomy.json'
      - 'taxonomy.yaml'
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Validate taxonomy
        run: python3 validate_taxonomy.py

      - name: Test Python library
        run: python3 test_examples.py

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Test TypeScript library
        run: npx tsx examples/typescript_example.ts
```

### GitLab CI

```yaml
validate:
  image: python:3.10
  script:
    - python3 validate_taxonomy.py
    - python3 test_examples.py
```

## Validation Checklist

Before committing changes to taxonomy:

- [ ] Run `python3 validate_taxonomy.py` - All tests pass
- [ ] Run `python3 test_examples.py` - Examples work
- [ ] Run `npx tsx examples/typescript_example.ts` - TypeScript works
- [ ] Check diff - Only intended changes
- [ ] Update CHANGELOG.md - Document what you added
- [ ] Update version number if needed

## Best Practices

### 1. Add Skills Incrementally

Don't add 50 skills at once. Add 5-10, validate, commit, repeat.

### 2. Test As You Go

After adding each skill, run validation immediately.

### 3. Use Reference Fixer

If you have many broken references, use `fix_references.py` instead of manual fixing.

### 4. Document Complex Skills

For skills with nuanced transferability, add comments explaining your reasoning.

### 5. Review Validation Output

Read the statistics section - it helps spot patterns and inconsistencies.

## Maintenance

### Weekly
- Run full validation
- Check for new production skills from `candidate_skills` table
- Review open issues/contributions

### Monthly
- Review transferability scores against real hiring data
- Update proficiency markers based on CV extraction patterns
- Add new skills from industry trends

### Quarterly
- Major version bump
- Comprehensive audit
- Community feedback review
- Performance optimization

## Troubleshooting

### Validation is slow

**Solution:** Currently validates 34 skills in <1 second. If it becomes slow (>5 seconds):
1. Profile with `python3 -m cProfile validate_taxonomy.py`
2. Optimize hot paths
3. Consider caching skill ID lookups

### Many broken references after editing

**Solution:** Run `python3 fix_references.py` to auto-clean all broken references at once.

### JSON syntax error

**Solution:** Use a JSON validator/linter:
```bash
python3 -c "import json; json.load(open('taxonomy.json'))"
```

Or use online tools: [jsonlint.com](https://jsonlint.com/)

### Git conflicts in taxonomy.json

**Solution:**
1. Coordinate with other contributors
2. Consider splitting into multiple files
3. Use `git mergetool` for complex conflicts

## Summary

✅ **19 automated tests** covering structure, integrity, and consistency
✅ **Pre-commit hook** prevents invalid commits
✅ **Reference fixer** auto-cleans broken references
✅ **Library tests** ensure Python/TypeScript code works
✅ **Statistics reporting** helps monitor taxonomy health

**Key command:** `python3 validate_taxonomy.py` - Run before every commit!

---

**Last Updated:** 2025-12-11
**Validation Version:** 1.0
**Current Status:** ✅ All 19 tests passing (34 skills)
