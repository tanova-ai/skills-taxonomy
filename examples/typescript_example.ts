/**
 * Tanova Skills Taxonomy - TypeScript Usage Examples
 *
 * This file demonstrates common use cases for the Tanova Skills Taxonomy library.
 *
 * Created by Tanova.ai - https://tanova.ai
 */

import { SkillsTaxonomy } from '../src/typescript/skills-taxonomy'

// Initialize taxonomy once
const taxonomy = new SkillsTaxonomy()

/**
 * Example 1: Normalize skill variations
 */
function example1NormalizeSkills(): void {
  console.log('='.repeat(60))
  console.log('Example 1: Normalize Skill Variations')
  console.log('='.repeat(60))

  const variations = [
    'react.js',
    'ReactJS',
    'React Framework',
    'JS',
    'Javascript',
    'ECMAScript',
    'Python3',
    'Golang',
    'K8s'
  ]

  console.log('\nNormalizing skill variations:')
  variations.forEach(variation => {
    const normalized = taxonomy.normalize(variation)
    if (normalized) {
      console.log(`  '${variation}' → '${normalized}'`)
    }
  })

  console.log()
}

/**
 * Example 2: Calculate skill transferability scores
 */
function example2Transferability(): void {
  console.log('='.repeat(60))
  console.log('Example 2: Skill Transferability Scores')
  console.log('='.repeat(60))

  const transfers: Array<[string, string]> = [
    ['Vue.js', 'React'],
    ['Python', 'JavaScript'],
    ['React', 'Angular'],
    ['PostgreSQL', 'MySQL'],
    ['Docker', 'Kubernetes'],
    ['B2B Sales', 'SaaS Sales']
  ]

  console.log('\nTransferability scores (0.0 = no transfer, 1.0 = perfect transfer):')
  transfers.forEach(([fromSkill, toSkill]) => {
    const score = taxonomy.getTransferability(fromSkill, toSkill)
    console.log(`  ${fromSkill} → ${toSkill}: ${score.toFixed(2)}`)
  })

  console.log()
}

/**
 * Example 3: Analyze skill gaps between job requirements and candidate
 */
function example3SkillGapAnalysis(): void {
  console.log('='.repeat(60))
  console.log('Example 3: Skill Gap Analysis')
  console.log('='.repeat(60))

  // Job requirements
  const requiredSkills = ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL']

  // Candidate skills
  const candidateSkills = ['Vue.js', 'JavaScript', 'Express', 'GCP', 'MongoDB']

  console.log(`\nJob requires: ${requiredSkills.join(', ')}`)
  console.log(`Candidate has: ${candidateSkills.join(', ')}\n`)

  // Analyze gaps
  const analysis = taxonomy.analyzeGaps(requiredSkills, candidateSkills)

  console.log('Gap Analysis Results:')
  console.log(`  ✅ Direct matches: ${analysis.matches.join(', ') || 'None'}`)
  console.log(`  ⚠️  Critical gaps: ${analysis.critical_gaps.join(', ') || 'None'}`)
  console.log(`  🔄 Transferable skills:`)
  analysis.transferable.forEach(transfer => {
    console.log(`     - ${transfer.required} ← ${transfer.has} (transfer: ${(transfer.transferability * 100).toFixed(0)}%)`)
  })

  console.log()
}

/**
 * Example 4: Assess proficiency level from context
 */
function example4ProficiencyAssessment(): void {
  console.log('='.repeat(60))
  console.log('Example 4: Proficiency Assessment')
  console.log('='.repeat(60))

  const contexts: Array<[string, string]> = [
    ['React', 'Built simple todo app following tutorial'],
    ['React', 'Architected micro-frontend platform for 50+ teams, optimized performance'],
    ['Python', 'Used in data analysis projects with pandas and numpy'],
    ['Machine Learning', 'Published research on novel algorithms, contributed to scikit-learn']
  ]

  console.log('\nAssessing proficiency from context:')
  contexts.forEach(([skill, context]) => {
    const level = taxonomy.assessProficiency(skill, context)
    console.log(`\n  Skill: ${skill}`)
    console.log(`  Context: "${context}"`)
    console.log(`  → Assessed level: ${level || 'Unable to determine'}`)
  })

  console.log()
}

/**
 * Example 5: Generate learning path for career transition
 */
function example5LearningPath(): void {
  console.log('='.repeat(60))
  console.log('Example 5: Learning Path Generation')
  console.log('='.repeat(60))

  // Frontend developer wanting to become Full Stack
  const currentSkills = ['React', 'JavaScript', 'CSS', 'HTML']
  const targetRole = 'Full Stack Developer'

  console.log(`\nCurrent skills: ${currentSkills.join(', ')}`)
  console.log(`Target role: ${targetRole}\n`)

  const path = taxonomy.generateLearningPath(currentSkills, targetRole)

  console.log('Recommended Learning Path:')

  const highPriority = path.filter(p => p.priority === 'high')
  const mediumPriority = path.filter(p => p.priority === 'medium')

  console.log('\n🔥 High Priority:')
  highPriority.forEach(item => {
    console.log(`  - ${item.skill}: ${item.why}`)
  })

  console.log('\n📚 Medium Priority:')
  mediumPriority.forEach(item => {
    console.log(`  - ${item.skill}: ${item.why}`)
  })

  console.log()
}

/**
 * Example 6: Find related skills for skill recommendations
 */
function example6RelatedSkills(): void {
  console.log('='.repeat(60))
  console.log('Example 6: Related Skills Discovery')
  console.log('='.repeat(60))

  const skillsToExplore = ['React', 'Python', 'Digital Marketing']

  console.log('\nFinding related skills:\n')
  skillsToExplore.forEach(skillName => {
    const related = taxonomy.getRelated(skillName)
    console.log(`  ${skillName}:`)
    console.log(`    Related skills: ${related.map(s => s.canonical_name).join(', ')}`)

    // Get parent skills
    const parents = taxonomy.getParents(skillName)
    if (parents.length > 0) {
      console.log(`    Prerequisites: ${parents.map(s => s.canonical_name).join(', ')}`)
    }

    // Get child skills
    const children = taxonomy.getChildren(skillName)
    if (children.length > 0) {
      console.log(`    Advanced topics: ${children.map(s => s.canonical_name).join(', ')}`)
    }

    console.log()
  })
}

/**
 * Example 7: Get skills required for specific roles
 */
function example7RoleBasedSkills(): void {
  console.log('='.repeat(60))
  console.log('Example 7: Role-Based Skill Mapping')
  console.log('='.repeat(60))

  const role = 'Frontend Engineer'

  // Find all skills for this role
  const allSkills = taxonomy.getAllSkills()
  const roleSkills = allSkills.filter(skill => skill.typical_roles.includes(role))

  console.log(`\nSkills for '${role}' role:\n`)

  // Group by subcategory
  const bySubcategory: Record<string, typeof roleSkills> = {}
  roleSkills.forEach(skill => {
    if (!bySubcategory[skill.subcategory]) {
      bySubcategory[skill.subcategory] = []
    }
    bySubcategory[skill.subcategory].push(skill)
  })

  Object.entries(bySubcategory).sort().forEach(([subcategory, skills]) => {
    const title = subcategory.replace(/_/g, ' ').split(' ').map(w =>
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ')

    console.log(`  ${title}:`)
    skills.forEach(skill => {
      const demandEmoji = skill.industry_demand === 'very_high' ? '🔥' :
                         skill.industry_demand === 'high' ? '📈' : '📊'
      console.log(`    ${demandEmoji} ${skill.canonical_name}`)
    })
    console.log()
  })
}

/**
 * Example 8: Get taxonomy statistics
 */
function example8TaxonomyStatistics(): void {
  console.log('='.repeat(60))
  console.log('Example 8: Taxonomy Statistics')
  console.log('='.repeat(60))

  const stats = taxonomy.getStatistics()

  console.log('\nTaxonomy Statistics:')
  console.log(`  Total skills: ${stats.total_skills}`)
  console.log(`  Categories: ${stats.categories}`)
  console.log(`  Subcategories: ${stats.subcategories}`)
  console.log(`  Total aliases: ${stats.total_aliases}`)
  console.log(`  Avg transferability links: ${stats.average_transferability_links.toFixed(1)}`)

  console.log('\n  Demand Distribution:')
  Object.entries(stats.demand_distribution)
    .sort((a, b) => b[1] - a[1])
    .forEach(([demand, count]) => {
      const title = demand.replace(/_/g, ' ').split(' ').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ')
      console.log(`    ${title}: ${count} skills`)
    })

  console.log()
}

/**
 * Example 9: Search for skills
 */
function example9SearchSkills(): void {
  console.log('='.repeat(60))
  console.log('Example 9: Search Skills')
  console.log('='.repeat(60))

  const queries = ['web', 'sales', 'data']

  console.log('\nSearching for skills:\n')
  queries.forEach(query => {
    const results = taxonomy.searchSkills(query, 5)
    console.log(`  Query: '${query}'`)
    console.log(`  Results: ${results.map(s => s.canonical_name).join(', ')}`)
    console.log()
  })
}

/**
 * Example 10: Real-world hiring scenario
 */
function example10RealWorldScenario(): void {
  console.log('='.repeat(60))
  console.log('Example 10: Real-World Hiring Scenario')
  console.log('='.repeat(60))

  console.log('\n📋 Job Posting: Senior Backend Engineer')
  console.log('   Required: Python, Django, PostgreSQL, Docker, AWS\n')

  const candidates = [
    {
      name: 'Alice',
      skills: ['Python', 'Django', 'PostgreSQL', 'Kubernetes', 'GCP']
    },
    {
      name: 'Bob',
      skills: ['Python', 'Flask', 'MongoDB', 'Docker', 'AWS']
    },
    {
      name: 'Carol',
      skills: ['JavaScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
    }
  ]

  const required = ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS']

  console.log('Candidate Evaluation:\n')
  candidates.forEach(candidate => {
    const analysis = taxonomy.analyzeGaps(required, candidate.skills)

    const matchScore = analysis.matches.length * 10
    const transferScore = analysis.transferable.reduce(
      (sum, t) => sum + (t.transferability * 10), 0
    )
    const totalScore = matchScore + transferScore

    console.log(`  👤 ${candidate.name}:`)
    console.log(`     Skills: ${candidate.skills.join(', ')}`)
    console.log(`     Direct matches: ${analysis.matches.length}/5 (${matchScore.toFixed(0)} points)`)
    console.log(`     Transferable: ${analysis.transferable.length} (${transferScore.toFixed(0)} points)`)
    console.log(`     Critical gaps: ${analysis.critical_gaps.length}`)
    console.log(`     ⭐ Total Score: ${totalScore.toFixed(0)}/100`)

    if (analysis.transferable.length > 0) {
      console.log(`     🔄 Transferable skills:`)
      analysis.transferable.forEach(t => {
        console.log(`        • ${t.has} → ${t.required} (${(t.transferability * 100).toFixed(0)}%)`)
      })
    }

    console.log()
  })
}

/**
 * Main function to run all examples
 */
function main(): void {
  console.log('\n' + '='.repeat(60))
  console.log('Tanova Skills Taxonomy - TypeScript Examples')
  console.log('Created by Tanova.ai - https://tanova.ai')
  console.log('='.repeat(60) + '\n')

  const examples = [
    { name: 'Example 1', fn: example1NormalizeSkills },
    { name: 'Example 2', fn: example2Transferability },
    { name: 'Example 3', fn: example3SkillGapAnalysis },
    { name: 'Example 4', fn: example4ProficiencyAssessment },
    { name: 'Example 5', fn: example5LearningPath },
    { name: 'Example 6', fn: example6RelatedSkills },
    { name: 'Example 7', fn: example7RoleBasedSkills },
    { name: 'Example 8', fn: example8TaxonomyStatistics },
    { name: 'Example 9', fn: example9SearchSkills },
    { name: 'Example 10', fn: example10RealWorldScenario }
  ]

  examples.forEach((example, index) => {
    example.fn()
    if (index < examples.length - 1) {
      console.log('\n')
    }
  })
}

// Run if called directly (ES module compatible)
main()

// Export for use as library
export {
  example1NormalizeSkills,
  example2Transferability,
  example3SkillGapAnalysis,
  example4ProficiencyAssessment,
  example5LearningPath,
  example6RelatedSkills,
  example7RoleBasedSkills,
  example8TaxonomyStatistics,
  example9SearchSkills,
  example10RealWorldScenario
}
