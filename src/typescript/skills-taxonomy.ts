/**
 * Tanova Skills Taxonomy - TypeScript Library
 *
 * A comprehensive, machine-readable skills taxonomy for AI-powered recruitment and HR tech.
 *
 * Created and maintained by Tanova.ai - https://tanova.ai
 * License: CC BY 4.0
 *
 * @example
 * ```typescript
 * import { SkillsTaxonomy } from '@tanova/skills-taxonomy'
 *
 * const taxonomy = new SkillsTaxonomy()
 *
 * // Normalize skill variations
 * taxonomy.normalize('react.js')  // Returns "React"
 *
 * // Get transferability score
 * taxonomy.getTransferability('Vue.js', 'React')  // Returns 0.85
 * ```
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

/**
 * Proficiency level definition for a skill
 */
export interface ProficiencyLevel {
  markers: string[]
  typical_experience: string
  example_projects?: string[]
}

/**
 * Skill definition in the taxonomy
 */
export interface Skill {
  id: string
  canonical_name: string
  aliases: string[]
  category: string
  subcategory: string
  tags: string[]
  description: string
  parent_skills: string[]
  child_skills: string[]
  related_skills: string[]
  transferability: Record<string, number>
  proficiency_levels: {
    beginner: ProficiencyLevel
    intermediate: ProficiencyLevel
    advanced: ProficiencyLevel
    expert: ProficiencyLevel
  }
  typical_roles: string[]
  industry_demand: 'very_high' | 'high' | 'medium' | 'low' | 'declining'
  prerequisites: string[]
  last_updated?: string
  deprecated?: boolean
  replacement_skills?: string[]
}

/**
 * Taxonomy data structure
 */
export interface TaxonomyData {
  version: string
  last_updated: string
  categories: Record<string, {
    name: string
    subcategories: Record<string, {
      name: string
      skills: Skill[]
    }>
  }>
}

/**
 * Gap analysis result
 */
export interface GapAnalysis {
  matches: string[]
  critical_gaps: string[]
  minor_gaps: string[]
  transferable: Array<{
    required: string
    has: string
    transferability: number
  }>
}

/**
 * Learning path recommendation
 */
export interface LearningPathItem {
  skill: string
  priority: 'high' | 'medium' | 'low'
  priority_score: number
  prerequisites_met: boolean
  why: string
}

/**
 * Taxonomy statistics
 */
export interface TaxonomyStatistics {
  total_skills: number
  categories: number
  subcategories: number
  total_aliases: number
  demand_distribution: Record<string, number>
  average_transferability_links: number
}

/**
 * Main class for interacting with the Tanova Skills Taxonomy.
 *
 * Provides methods for:
 * - Normalizing skill variations
 * - Finding related skills
 * - Calculating transferability scores
 * - Assessing proficiency levels
 * - Analyzing skill gaps
 */
export class SkillsTaxonomy {
  private skills: Map<string, Skill> = new Map()
  private aliasMap: Map<string, string> = new Map()
  private taxonomyData: TaxonomyData | null = null

  /**
   * Initialize the taxonomy.
   *
   * @param taxonomyPath - Path to taxonomy.json file. If not provided, uses default location.
   */
  constructor(taxonomyPath?: string) {
    // Handle __dirname in ES modules
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const defaultPath = taxonomyPath || path.join(__dirname, '../../taxonomy.json')
    this.loadTaxonomy(defaultPath)
  }

  /**
   * Load taxonomy from JSON file
   */
  private loadTaxonomy(taxonomyPath: string): void {
    if (!fs.existsSync(taxonomyPath)) {
      throw new Error(`Taxonomy file not found: ${taxonomyPath}`)
    }

    const data = JSON.parse(fs.readFileSync(taxonomyPath, 'utf-8')) as TaxonomyData
    this.taxonomyData = data

    // Parse all skills from categories
    for (const [categoryId, categoryData] of Object.entries(data.categories)) {
      for (const [subcategoryId, subcategoryData] of Object.entries(categoryData.subcategories)) {
        for (const skillData of subcategoryData.skills) {
          this.skills.set(skillData.id, skillData)

          // Build alias map
          // Map canonical name (case-insensitive)
          this.aliasMap.set(skillData.canonical_name.toLowerCase(), skillData.id)

          // Map all aliases (case-insensitive)
          for (const alias of skillData.aliases) {
            this.aliasMap.set(alias.toLowerCase(), skillData.id)
          }
        }
      }
    }
  }

  /**
   * Normalize a skill name to its canonical form.
   *
   * @param skillName - The skill name or alias to normalize
   * @returns Canonical skill name, or null if not found
   *
   * @example
   * ```typescript
   * taxonomy.normalize('react.js')  // Returns "React"
   * taxonomy.normalize('JS')        // Returns "JavaScript"
   * ```
   */
  normalize(skillName: string): string | null {
    const skillId = this.aliasMap.get(skillName.toLowerCase())
    if (skillId) {
      const skill = this.skills.get(skillId)
      return skill ? skill.canonical_name : null
    }
    return null
  }

  /**
   * Find a skill by name or alias.
   *
   * @param query - Skill name or alias
   * @returns Skill object, or null if not found
   */
  findSkill(query: string): Skill | null {
    const skillId = this.aliasMap.get(query.toLowerCase())
    if (skillId) {
      return this.skills.get(skillId) || null
    }
    return null
  }

  /**
   * Get parent skills in hierarchy.
   *
   * @param skillName - Name or alias of the skill
   * @returns Array of parent Skill objects
   */
  getParents(skillName: string): Skill[] {
    const skill = this.findSkill(skillName)
    if (!skill) return []

    const parents: Skill[] = []
    for (const parentId of skill.parent_skills) {
      const parent = this.skills.get(parentId)
      if (parent) parents.push(parent)
    }
    return parents
  }

  /**
   * Get child/sub-skills.
   *
   * @param skillName - Name or alias of the skill
   * @returns Array of child Skill objects
   */
  getChildren(skillName: string): Skill[] {
    const skill = this.findSkill(skillName)
    if (!skill) return []

    const children: Skill[] = []
    for (const childId of skill.child_skills) {
      const child = this.skills.get(childId)
      if (child) children.push(child)
    }
    return children
  }

  /**
   * Get related skills (same domain, transferable).
   *
   * @param skillName - Name or alias of the skill
   * @returns Array of related Skill objects
   */
  getRelated(skillName: string): Skill[] {
    const skill = this.findSkill(skillName)
    if (!skill) return []

    const related: Skill[] = []
    for (const relatedId of skill.related_skills) {
      const relatedSkill = this.skills.get(relatedId)
      if (relatedSkill) related.push(relatedSkill)
    }
    return related
  }

  /**
   * Check if two skills are related.
   *
   * @param skill1 - First skill name
   * @param skill2 - Second skill name
   * @returns True if skills are related, false otherwise
   */
  areRelated(skill1: string, skill2: string): boolean {
    const s1 = this.findSkill(skill1)
    const s2 = this.findSkill(skill2)

    if (!s1 || !s2) return false

    // Check if they're in each other's related_skills
    if (s1.related_skills.includes(s2.id) || s2.related_skills.includes(s1.id)) {
      return true
    }

    // Check if they share the same subcategory
    if (s1.subcategory === s2.subcategory) {
      return true
    }

    return false
  }

  /**
   * Get transferability score (0-1) between skills.
   *
   * @param fromSkill - Source skill name
   * @param toSkill - Target skill name
   * @returns Transferability score from 0 (no transfer) to 1 (perfect transfer)
   *
   * @example
   * ```typescript
   * taxonomy.getTransferability('Vue.js', 'React')  // Returns 0.85
   * ```
   */
  getTransferability(fromSkill: string, toSkill: string): number {
    const skill = this.findSkill(fromSkill)
    const target = this.findSkill(toSkill)

    if (!skill || !target) return 0.0

    // Direct transferability score if defined
    if (skill.transferability[target.id] !== undefined) {
      return skill.transferability[target.id]
    }

    // Check reverse direction
    if (target.transferability[skill.id] !== undefined) {
      return target.transferability[skill.id]
    }

    // Same subcategory = moderate transferability
    if (skill.subcategory === target.subcategory) {
      return 0.50
    }

    // Same category = low transferability
    if (skill.category === target.category) {
      return 0.30
    }

    // No relationship
    return 0.0
  }

  /**
   * Get all skills in a category.
   *
   * @param category - Category name (e.g., 'technology', 'business')
   * @returns Array of Skill objects in that category
   */
  getByCategory(category: string): Skill[] {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.category.toLowerCase() === category.toLowerCase()
    )
  }

  /**
   * Get all skills in a subcategory.
   *
   * @param subcategory - Subcategory name (e.g., 'frontend_development', 'sales')
   * @returns Array of Skill objects in that subcategory
   */
  getBySubcategory(subcategory: string): Skill[] {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.subcategory.toLowerCase() === subcategory.toLowerCase()
    )
  }

  /**
   * Get typical roles requiring this skill.
   *
   * @param skillName - Name or alias of the skill
   * @returns Array of role names
   */
  getRoles(skillName: string): string[] {
    const skill = this.findSkill(skillName)
    return skill ? skill.typical_roles : []
  }

  /**
   * Get proficiency level markers for a skill.
   *
   * @param skillName - Name or alias of the skill
   * @returns Object with proficiency levels, markers, and typical experience
   */
  getProficiencyMarkers(skillName: string): Record<string, ProficiencyLevel> | null {
    const skill = this.findSkill(skillName)
    return skill ? skill.proficiency_levels : null
  }

  /**
   * Estimate proficiency level from context description.
   *
   * @param skillName - Name or alias of the skill
   * @param context - Description of experience/context
   * @returns Proficiency level ('beginner', 'intermediate', 'advanced', 'expert') or null
   */
  assessProficiency(skillName: string, context: string): string | null {
    const skill = this.findSkill(skillName)
    if (!skill) return null

    const contextLower = context.toLowerCase()

    // Score each proficiency level based on marker matches
    const scores: Record<string, number> = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      expert: 0
    }

    for (const [level, prof] of Object.entries(skill.proficiency_levels)) {
      for (const marker of prof.markers) {
        const markerWords = marker.toLowerCase().split(' ')
        if (markerWords.some(word => contextLower.includes(word))) {
          scores[level]++
        }
      }
    }

    // Return level with highest score (if any matches)
    const maxScore = Math.max(...Object.values(scores))
    if (maxScore > 0) {
      return Object.entries(scores).reduce((a, b) => (scores[a[0]] > scores[b[0]] ? a : b))[0]
    }

    return null
  }

  /**
   * Analyze skill gaps between requirements and candidate skills.
   *
   * @param required - Array of required skill names
   * @param candidate - Array of candidate's skill names
   * @returns Gap analysis object
   */
  analyzeGaps(required: string[], candidate: string[]): GapAnalysis {
    // Normalize skill names
    const requiredNormalized = new Set(
      required.map(skill => this.normalize(skill) || skill)
    )
    const candidateNormalized = new Set(
      candidate.map(skill => this.normalize(skill) || skill)
    )

    // Direct matches
    const matches = Array.from(requiredNormalized).filter(skill =>
      candidateNormalized.has(skill)
    )

    // Missing skills
    const missing = Array.from(requiredNormalized).filter(skill =>
      !candidateNormalized.has(skill)
    )

    // Check transferability for missing skills
    const transferable: Array<{ required: string; has: string; transferability: number }> = []
    const criticalGaps: string[] = []

    for (const reqSkill of missing) {
      let bestTransfer = 0.0
      let bestMatch: string | null = null

      for (const candSkill of Array.from(candidateNormalized)) {
        const transferScore = this.getTransferability(candSkill, reqSkill)
        if (transferScore > bestTransfer) {
          bestTransfer = transferScore
          bestMatch = candSkill
        }
      }

      if (bestTransfer >= 0.70 && bestMatch) {
        transferable.push({
          required: reqSkill,
          has: bestMatch,
          transferability: bestTransfer
        })
      } else {
        criticalGaps.push(reqSkill)
      }
    }

    return {
      matches,
      critical_gaps: criticalGaps,
      minor_gaps: transferable
        .filter(t => t.transferability >= 0.50 && t.transferability < 0.70)
        .map(t => t.required),
      transferable: transferable.filter(t => t.transferability >= 0.70)
    }
  }

  /**
   * Generate recommended learning path from current skills to target role.
   *
   * @param currentSkills - Array of current skill names
   * @param targetRole - Target job role name
   * @returns Array of recommended skills with priority
   */
  generateLearningPath(currentSkills: string[], targetRole: string): LearningPathItem[] {
    // Find all skills for this role
    const roleSkills = Array.from(this.skills.values()).filter(skill =>
      skill.typical_roles.includes(targetRole)
    )

    // Normalize current skills
    const currentNormalized = new Set(
      currentSkills.map(skill => this.normalize(skill) || skill)
    )

    // Identify skills to learn
    const recommendations: LearningPathItem[] = []

    for (const skill of roleSkills) {
      if (currentNormalized.has(skill.canonical_name)) continue

      // Check prerequisites
      const prerequisitesMet = skill.prerequisites.every(prereq =>
        currentNormalized.has(this.normalize(prereq) || prereq)
      )

      // Calculate priority based on demand and transferability
      let priorityScore = 0.0

      switch (skill.industry_demand) {
        case 'very_high':
          priorityScore += 3.0
          break
        case 'high':
          priorityScore += 2.0
          break
        case 'medium':
          priorityScore += 1.0
          break
      }

      // Boost if prerequisites are met
      if (prerequisitesMet) {
        priorityScore += 2.0
      }

      // Boost if related to current skills
      for (const currentSkill of currentSkills) {
        const transfer = this.getTransferability(currentSkill, skill.canonical_name)
        priorityScore += transfer
      }

      const priority: 'high' | 'medium' | 'low' =
        priorityScore >= 4.0 ? 'high' : priorityScore >= 2.0 ? 'medium' : 'low'

      recommendations.push({
        skill: skill.canonical_name,
        priority,
        priority_score: priorityScore,
        prerequisites_met: prerequisitesMet,
        why: this.generateLearningReason(skill, currentSkills)
      })
    }

    // Sort by priority score
    recommendations.sort((a, b) => b.priority_score - a.priority_score)

    return recommendations
  }

  /**
   * Generate a reason why this skill should be learned
   */
  private generateLearningReason(skill: Skill, currentSkills: string[]): string {
    // Check for related skills
    const relatedCurrent = currentSkills.filter(current =>
      this.areRelated(current, skill.canonical_name)
    )

    if (relatedCurrent.length > 0) {
      return `Extends your knowledge of ${relatedCurrent.slice(0, 2).join(', ')}`
    }

    if (skill.industry_demand === 'very_high' || skill.industry_demand === 'high') {
      return `High market demand (${skill.industry_demand.replace('_', ' ')})`
    }

    if (skill.parent_skills.length > 0) {
      return `Builds on ${skill.parent_skills[0]}`
    }

    return 'Essential for role'
  }

  /**
   * Search for skills by name, alias, or tag.
   *
   * @param query - Search query
   * @param limit - Maximum number of results (default: 10)
   * @returns Array of matching Skill objects
   */
  searchSkills(query: string, limit: number = 10): Skill[] {
    const queryLower = query.toLowerCase()
    const results: Skill[] = []

    for (const skill of this.skills.values()) {
      // Check canonical name
      if (skill.canonical_name.toLowerCase().includes(queryLower)) {
        results.push(skill)
        continue
      }

      // Check aliases
      if (skill.aliases.some(alias => alias.toLowerCase().includes(queryLower))) {
        results.push(skill)
        continue
      }

      // Check tags
      if (skill.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
        results.push(skill)
        continue
      }

      if (results.length >= limit) break
    }

    return results.slice(0, limit)
  }

  /**
   * Get taxonomy statistics.
   *
   * @returns Object with counts and statistics
   */
  getStatistics(): TaxonomyStatistics {
    const categories = new Set(
      Array.from(this.skills.values()).map(skill => skill.category)
    )
    const subcategories = new Set(
      Array.from(this.skills.values()).map(skill => skill.subcategory)
    )

    const demandCounts: Record<string, number> = {}
    for (const skill of this.skills.values()) {
      const demand = skill.industry_demand
      demandCounts[demand] = (demandCounts[demand] || 0) + 1
    }

    const totalTransferabilityLinks = Array.from(this.skills.values()).reduce(
      (sum, skill) => sum + Object.keys(skill.transferability).length,
      0
    )

    return {
      total_skills: this.skills.size,
      categories: categories.size,
      subcategories: subcategories.size,
      total_aliases: Array.from(this.skills.values()).reduce(
        (sum, skill) => sum + skill.aliases.length,
        0
      ),
      demand_distribution: demandCounts,
      average_transferability_links: this.skills.size > 0
        ? totalTransferabilityLinks / this.skills.size
        : 0
    }
  }

  /**
   * Get all skills as an array
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skills.values())
  }

  /**
   * Get taxonomy version
   */
  getVersion(): string {
    return this.taxonomyData?.version || 'unknown'
  }
}

// Convenience functions for quick access

/**
 * Normalize a skill name (convenience function)
 */
export function normalizeSkill(skillName: string): string | null {
  const taxonomy = new SkillsTaxonomy()
  return taxonomy.normalize(skillName)
}

/**
 * Get transferability score (convenience function)
 */
export function getTransferabilityScore(fromSkill: string, toSkill: string): number {
  const taxonomy = new SkillsTaxonomy()
  return taxonomy.getTransferability(fromSkill, toSkill)
}

// Export types
export type { TaxonomyData, GapAnalysis, LearningPathItem, TaxonomyStatistics }
