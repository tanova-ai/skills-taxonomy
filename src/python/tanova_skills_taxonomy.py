"""
Tanova Skills Taxonomy - Python Library

A comprehensive, machine-readable skills taxonomy for AI-powered recruitment and HR tech.

Created and maintained by Tanova.ai - https://tanova.ai
License: MIT

Usage:
    from tanova_skills_taxonomy import SkillsTaxonomy

    taxonomy = SkillsTaxonomy()

    # Normalize skill variations
    skill = taxonomy.normalize('react.js')  # Returns "React"

    # Find related skills
    related = taxonomy.get_related('React')

    # Get transferability score
    score = taxonomy.get_transferability('Vue.js', 'React')  # Returns 0.85
"""

import json
import os
from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass
from pathlib import Path


@dataclass
class ProficiencyLevel:
    """Represents a proficiency level for a skill"""
    markers: List[str]
    typical_experience: str
    example_projects: Optional[List[str]] = None


@dataclass
class Skill:
    """Represents a skill in the taxonomy"""
    id: str
    canonical_name: str
    aliases: List[str]
    category: str
    subcategory: str
    tags: List[str]
    description: str
    parent_skills: List[str]
    child_skills: List[str]
    related_skills: List[str]
    transferability: Dict[str, float]
    proficiency_levels: Dict[str, ProficiencyLevel]
    typical_roles: List[str]
    industry_demand: str
    prerequisites: List[str]
    last_updated: Optional[str] = None
    deprecated: bool = False

    def to_dict(self) -> dict:
        """Convert skill to dictionary"""
        return {
            'id': self.id,
            'canonical_name': self.canonical_name,
            'aliases': self.aliases,
            'category': self.category,
            'subcategory': self.subcategory,
            'tags': self.tags,
            'description': self.description,
            'parent_skills': self.parent_skills,
            'child_skills': self.child_skills,
            'related_skills': self.related_skills,
            'transferability': self.transferability,
            'proficiency_levels': {
                level: {
                    'markers': prof.markers,
                    'typical_experience': prof.typical_experience
                }
                for level, prof in self.proficiency_levels.items()
            },
            'typical_roles': self.typical_roles,
            'industry_demand': self.industry_demand,
            'prerequisites': self.prerequisites
        }


class SkillsTaxonomy:
    """
    Main class for interacting with the Tanova Skills Taxonomy.

    Provides methods for:
    - Normalizing skill variations
    - Finding related skills
    - Calculating transferability scores
    - Assessing proficiency levels
    - Analyzing skill gaps
    """

    def __init__(self, taxonomy_path: Optional[str] = None):
        """
        Initialize the taxonomy.

        Args:
            taxonomy_path: Path to taxonomy.json file. If None, uses default location.
        """
        if taxonomy_path is None:
            # Default to taxonomy.json in the root of the package
            current_dir = Path(__file__).parent
            taxonomy_path = current_dir.parent.parent / 'taxonomy.json'

        self.taxonomy_path = Path(taxonomy_path)
        self.skills: Dict[str, Skill] = {}
        self._alias_map: Dict[str, str] = {}  # Maps aliases to canonical skill IDs
        self._load_taxonomy()

    def _load_taxonomy(self):
        """Load taxonomy from JSON file"""
        if not self.taxonomy_path.exists():
            raise FileNotFoundError(f"Taxonomy file not found: {self.taxonomy_path}")

        with open(self.taxonomy_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Parse all skills from categories
        for category_id, category_data in data.get('categories', {}).items():
            for subcategory_id, subcategory_data in category_data.get('subcategories', {}).items():
                for skill_data in subcategory_data.get('skills', []):
                    skill = self._parse_skill(skill_data)
                    self.skills[skill.id] = skill

                    # Build alias map
                    # Map canonical name (case-insensitive)
                    self._alias_map[skill.canonical_name.lower()] = skill.id

                    # Map all aliases (case-insensitive)
                    for alias in skill.aliases:
                        self._alias_map[alias.lower()] = skill.id

    def _parse_skill(self, data: dict) -> Skill:
        """Parse skill data from dictionary"""
        proficiency_levels = {}
        for level, level_data in data.get('proficiency_levels', {}).items():
            proficiency_levels[level] = ProficiencyLevel(
                markers=level_data.get('markers', []),
                typical_experience=level_data.get('typical_experience', ''),
                example_projects=level_data.get('example_projects')
            )

        return Skill(
            id=data['id'],
            canonical_name=data['canonical_name'],
            aliases=data.get('aliases', []),
            category=data['category'],
            subcategory=data['subcategory'],
            tags=data.get('tags', []),
            description=data['description'],
            parent_skills=data.get('parent_skills', []),
            child_skills=data.get('child_skills', []),
            related_skills=data.get('related_skills', []),
            transferability=data.get('transferability', {}),
            proficiency_levels=proficiency_levels,
            typical_roles=data.get('typical_roles', []),
            industry_demand=data.get('industry_demand', 'medium'),
            prerequisites=data.get('prerequisites', []),
            last_updated=data.get('last_updated'),
            deprecated=data.get('deprecated', False)
        )

    def normalize(self, skill_name: str) -> Optional[str]:
        """
        Normalize a skill name to its canonical form.

        Args:
            skill_name: The skill name or alias to normalize

        Returns:
            Canonical skill name, or None if not found

        Examples:
            >>> taxonomy.normalize('react.js')
            'React'
            >>> taxonomy.normalize('JS')
            'JavaScript'
        """
        skill_id = self._alias_map.get(skill_name.lower())
        if skill_id and skill_id in self.skills:
            return self.skills[skill_id].canonical_name
        return None

    def find_skill(self, query: str) -> Optional[Skill]:
        """
        Find a skill by name or alias.

        Args:
            query: Skill name or alias

        Returns:
            Skill object, or None if not found
        """
        skill_id = self._alias_map.get(query.lower())
        if skill_id:
            return self.skills.get(skill_id)
        return None

    def get_parents(self, skill_name: str) -> List[Skill]:
        """
        Get parent skills in hierarchy.

        Args:
            skill_name: Name or alias of the skill

        Returns:
            List of parent Skill objects
        """
        skill = self.find_skill(skill_name)
        if not skill:
            return []

        parents = []
        for parent_id in skill.parent_skills:
            if parent_id in self.skills:
                parents.append(self.skills[parent_id])
        return parents

    def get_children(self, skill_name: str) -> List[Skill]:
        """
        Get child/sub-skills.

        Args:
            skill_name: Name or alias of the skill

        Returns:
            List of child Skill objects
        """
        skill = self.find_skill(skill_name)
        if not skill:
            return []

        children = []
        for child_id in skill.child_skills:
            if child_id in self.skills:
                children.append(self.skills[child_id])
        return children

    def get_related(self, skill_name: str) -> List[Skill]:
        """
        Get related skills (same domain, transferable).

        Args:
            skill_name: Name or alias of the skill

        Returns:
            List of related Skill objects
        """
        skill = self.find_skill(skill_name)
        if not skill:
            return []

        related = []
        for related_id in skill.related_skills:
            if related_id in self.skills:
                related.append(self.skills[related_id])
        return related

    def are_related(self, skill1: str, skill2: str) -> bool:
        """
        Check if two skills are related.

        Args:
            skill1: First skill name
            skill2: Second skill name

        Returns:
            True if skills are related, False otherwise
        """
        s1 = self.find_skill(skill1)
        s2 = self.find_skill(skill2)

        if not s1 or not s2:
            return False

        # Check if they're in each other's related_skills
        if s2.id in s1.related_skills or s1.id in s2.related_skills:
            return True

        # Check if they share the same subcategory
        if s1.subcategory == s2.subcategory:
            return True

        return False

    def get_transferability(self, from_skill: str, to_skill: str) -> float:
        """
        Get transferability score (0-1) between skills.

        Args:
            from_skill: Source skill name
            to_skill: Target skill name

        Returns:
            Transferability score from 0 (no transfer) to 1 (perfect transfer)

        Examples:
            >>> taxonomy.get_transferability('Vue.js', 'React')
            0.85
        """
        skill = self.find_skill(from_skill)
        target = self.find_skill(to_skill)

        if not skill or not target:
            return 0.0

        # Direct transferability score if defined
        if target.id in skill.transferability:
            return skill.transferability[target.id]

        # Check reverse direction
        if skill.id in target.transferability:
            return target.transferability[skill.id]

        # Same subcategory = moderate transferability
        if skill.subcategory == target.subcategory:
            return 0.50

        # Same category = low transferability
        if skill.category == target.category:
            return 0.30

        # No relationship
        return 0.0

    def get_by_category(self, category: str) -> List[Skill]:
        """
        Get all skills in a category.

        Args:
            category: Category name (e.g., 'technology', 'business')

        Returns:
            List of Skill objects in that category
        """
        return [
            skill for skill in self.skills.values()
            if skill.category.lower() == category.lower()
        ]

    def get_by_subcategory(self, subcategory: str) -> List[Skill]:
        """
        Get all skills in a subcategory.

        Args:
            subcategory: Subcategory name (e.g., 'frontend_development', 'sales')

        Returns:
            List of Skill objects in that subcategory
        """
        return [
            skill for skill in self.skills.values()
            if skill.subcategory.lower() == subcategory.lower()
        ]

    def get_roles(self, skill_name: str) -> List[str]:
        """
        Get typical roles requiring this skill.

        Args:
            skill_name: Name or alias of the skill

        Returns:
            List of role names
        """
        skill = self.find_skill(skill_name)
        if skill:
            return skill.typical_roles
        return []

    def get_proficiency_markers(self, skill_name: str) -> Dict[str, dict]:
        """
        Get proficiency level markers for a skill.

        Args:
            skill_name: Name or alias of the skill

        Returns:
            Dictionary of proficiency levels with markers and typical experience
        """
        skill = self.find_skill(skill_name)
        if not skill:
            return {}

        return {
            level: {
                'markers': prof.markers,
                'typical_experience': prof.typical_experience
            }
            for level, prof in skill.proficiency_levels.items()
        }

    def assess_proficiency(self, skill_name: str, context: str) -> Optional[str]:
        """
        Estimate proficiency level from context description.

        Args:
            skill_name: Name or alias of the skill
            context: Description of experience/context

        Returns:
            Proficiency level ('beginner', 'intermediate', 'advanced', 'expert') or None
        """
        skill = self.find_skill(skill_name)
        if not skill:
            return None

        context_lower = context.lower()

        # Score each proficiency level based on marker matches
        scores = {}
        for level, prof in skill.proficiency_levels.items():
            score = sum(
                1 for marker in prof.markers
                if any(word.lower() in context_lower for word in marker.split())
            )
            scores[level] = score

        # Return level with highest score (if any matches)
        if max(scores.values()) > 0:
            return max(scores.items(), key=lambda x: x[1])[0]

        return None

    def analyze_gaps(self, required: List[str], candidate: List[str]) -> dict:
        """
        Analyze skill gaps between requirements and candidate skills.

        Args:
            required: List of required skill names
            candidate: List of candidate's skill names

        Returns:
            Dictionary with gap analysis
        """
        # Normalize skill names
        required_skills = {
            self.normalize(skill) or skill: skill
            for skill in required
        }
        candidate_skills = {
            self.normalize(skill) or skill: skill
            for skill in candidate
        }

        # Direct matches
        matches = set(required_skills.keys()) & set(candidate_skills.keys())

        # Missing skills
        missing = set(required_skills.keys()) - set(candidate_skills.keys())

        # Check transferability for missing skills
        transferable = []
        critical_gaps = []

        for req_skill in missing:
            best_transfer = 0.0
            best_match = None

            for cand_skill in candidate_skills.keys():
                transfer_score = self.get_transferability(cand_skill, req_skill)
                if transfer_score > best_transfer:
                    best_transfer = transfer_score
                    best_match = cand_skill

            if best_transfer >= 0.70:
                transferable.append({
                    'required': req_skill,
                    'has': best_match,
                    'transferability': best_transfer
                })
            else:
                critical_gaps.append(req_skill)

        return {
            'matches': list(matches),
            'critical_gaps': critical_gaps,
            'minor_gaps': [t['required'] for t in transferable if 0.50 <= t['transferability'] < 0.70],
            'transferable': [t for t in transferable if t['transferability'] >= 0.70]
        }

    def generate_learning_path(self, current_skills: List[str], target_role: str) -> List[dict]:
        """
        Generate recommended learning path from current skills to target role.

        Args:
            current_skills: List of current skill names
            target_role: Target job role name

        Returns:
            List of recommended skills with priority
        """
        # Find all skills for this role
        role_skills = []
        for skill in self.skills.values():
            if target_role in skill.typical_roles:
                role_skills.append(skill)

        # Normalize current skills
        current_normalized = set(
            self.normalize(skill) or skill
            for skill in current_skills
        )

        # Identify skills to learn
        recommendations = []
        for skill in role_skills:
            if skill.canonical_name in current_normalized:
                continue

            # Check prerequisites
            prereqs_met = all(
                self.normalize(prereq) in current_normalized
                for prereq in skill.prerequisites
            )

            # Calculate priority based on demand and transferability
            priority_score = 0.0

            if skill.industry_demand == 'very_high':
                priority_score += 3.0
            elif skill.industry_demand == 'high':
                priority_score += 2.0
            elif skill.industry_demand == 'medium':
                priority_score += 1.0

            # Boost if prerequisites are met
            if prereqs_met:
                priority_score += 2.0

            # Boost if related to current skills
            for current_skill in current_skills:
                transfer = self.get_transferability(current_skill, skill.canonical_name)
                priority_score += transfer

            priority = 'high' if priority_score >= 4.0 else 'medium' if priority_score >= 2.0 else 'low'

            recommendations.append({
                'skill': skill.canonical_name,
                'priority': priority,
                'priority_score': priority_score,
                'prerequisites_met': prereqs_met,
                'why': self._generate_learning_reason(skill, current_skills)
            })

        # Sort by priority score
        recommendations.sort(key=lambda x: x['priority_score'], reverse=True)

        return recommendations

    def _generate_learning_reason(self, skill: Skill, current_skills: List[str]) -> str:
        """Generate a reason why this skill should be learned"""
        # Check for related skills
        related_current = []
        for current in current_skills:
            if self.are_related(current, skill.canonical_name):
                related_current.append(current)

        if related_current:
            return f"Extends your knowledge of {', '.join(related_current[:2])}"

        if skill.industry_demand in ['very_high', 'high']:
            return f"High market demand ({skill.industry_demand.replace('_', ' ')})"

        if skill.parent_skills:
            return f"Builds on {skill.parent_skills[0]}"

        return "Essential for role"

    def search_skills(self, query: str, limit: int = 10) -> List[Skill]:
        """
        Search for skills by name, alias, or tag.

        Args:
            query: Search query
            limit: Maximum number of results

        Returns:
            List of matching Skill objects
        """
        query_lower = query.lower()
        results = []

        for skill in self.skills.values():
            # Check canonical name
            if query_lower in skill.canonical_name.lower():
                results.append(skill)
                continue

            # Check aliases
            if any(query_lower in alias.lower() for alias in skill.aliases):
                results.append(skill)
                continue

            # Check tags
            if any(query_lower in tag.lower() for tag in skill.tags):
                results.append(skill)
                continue

        return results[:limit]

    def get_statistics(self) -> dict:
        """
        Get taxonomy statistics.

        Returns:
            Dictionary with counts and statistics
        """
        categories = set(skill.category for skill in self.skills.values())
        subcategories = set(skill.subcategory for skill in self.skills.values())

        demand_counts = {}
        for skill in self.skills.values():
            demand = skill.industry_demand
            demand_counts[demand] = demand_counts.get(demand, 0) + 1

        return {
            'total_skills': len(self.skills),
            'categories': len(categories),
            'subcategories': len(subcategories),
            'total_aliases': sum(len(skill.aliases) for skill in self.skills.values()),
            'demand_distribution': demand_counts,
            'average_transferability_links': sum(
                len(skill.transferability) for skill in self.skills.values()
            ) / len(self.skills) if self.skills else 0
        }


# Convenience functions for quick access
def normalize_skill(skill_name: str) -> Optional[str]:
    """Convenience function to normalize a skill name"""
    taxonomy = SkillsTaxonomy()
    return taxonomy.normalize(skill_name)


def get_transferability_score(from_skill: str, to_skill: str) -> float:
    """Convenience function to get transferability score"""
    taxonomy = SkillsTaxonomy()
    return taxonomy.get_transferability(from_skill, to_skill)


if __name__ == '__main__':
    # Example usage
    taxonomy = SkillsTaxonomy()

    print("Tanova Skills Taxonomy - Python Library")
    print("=" * 50)
    print(f"Loaded {len(taxonomy.skills)} skills\n")

    # Example: Normalize skill
    print("Example 1: Normalize skill variations")
    print(f"  'react.js' → '{taxonomy.normalize('react.js')}'")
    print(f"  'JS' → '{taxonomy.normalize('JS')}'")
    print(f"  'Vue' → '{taxonomy.normalize('Vue')}'")
    print()

    # Example: Get transferability
    print("Example 2: Get transferability scores")
    print(f"  Vue.js → React: {taxonomy.get_transferability('Vue.js', 'React')}")
    print(f"  Python → JavaScript: {taxonomy.get_transferability('Python', 'JavaScript')}")
    print()

    # Example: Skill gap analysis
    print("Example 3: Skill gap analysis")
    required = ['React', 'TypeScript', 'Node.js', 'AWS']
    candidate = ['Vue.js', 'JavaScript', 'Express', 'GCP']
    gaps = taxonomy.analyze_gaps(required, candidate)
    print(f"  Required: {required}")
    print(f"  Candidate has: {candidate}")
    print(f"  Transferable skills: {[t['required'] for t in gaps['transferable']]}")
    print(f"  Critical gaps: {gaps['critical_gaps']}")
    print()

    # Stats
    stats = taxonomy.get_statistics()
    print(f"Taxonomy statistics:")
    print(f"  Total skills: {stats['total_skills']}")
    print(f"  Categories: {stats['categories']}")
    print(f"  Subcategories: {stats['subcategories']}")
