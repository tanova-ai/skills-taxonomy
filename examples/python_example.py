"""
Tanova Skills Taxonomy - Python Usage Examples

This file demonstrates common use cases for the Tanova Skills Taxonomy library.

Created by Tanova.ai - https://tanova.ai
"""

import sys
import os

# Add parent directory to path to import the library
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src', 'python'))

from tanova_skills_taxonomy import SkillsTaxonomy

def example_1_normalize_skills():
    """Example 1: Normalize skill variations"""
    print("=" * 60)
    print("Example 1: Normalize Skill Variations")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    variations = [
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

    print("\nNormalizing skill variations:")
    for variation in variations:
        normalized = taxonomy.normalize(variation)
        if normalized:
            print(f"  '{variation}' → '{normalized}'")

    print()


def example_2_transferability():
    """Example 2: Calculate skill transferability scores"""
    print("=" * 60)
    print("Example 2: Skill Transferability Scores")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    transfers = [
        ('Vue.js', 'React'),
        ('Python', 'JavaScript'),
        ('React', 'Angular'),
        ('PostgreSQL', 'MySQL'),
        ('Docker', 'Kubernetes'),
        ('B2B Sales', 'SaaS Sales'),
    ]

    print("\nTransferability scores (0.0 = no transfer, 1.0 = perfect transfer):")
    for from_skill, to_skill in transfers:
        score = taxonomy.get_transferability(from_skill, to_skill)
        print(f"  {from_skill} → {to_skill}: {score:.2f}")

    print()


def example_3_skill_gap_analysis():
    """Example 3: Analyze skill gaps between job requirements and candidate"""
    print("=" * 60)
    print("Example 3: Skill Gap Analysis")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    # Job requirements
    required_skills = ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL']

    # Candidate skills
    candidate_skills = ['Vue.js', 'JavaScript', 'Express', 'GCP', 'MongoDB']

    print(f"\nJob requires: {', '.join(required_skills)}")
    print(f"Candidate has: {', '.join(candidate_skills)}\n")

    # Analyze gaps
    analysis = taxonomy.analyze_gaps(required_skills, candidate_skills)

    print("Gap Analysis Results:")
    print(f"  ✅ Direct matches: {', '.join(analysis['matches']) if analysis['matches'] else 'None'}")
    print(f"  ⚠️  Critical gaps: {', '.join(analysis['critical_gaps']) if analysis['critical_gaps'] else 'None'}")
    print(f"  🔄 Transferable skills:")
    for transfer in analysis['transferable']:
        print(f"     - {transfer['required']} ← {transfer['has']} (transfer: {transfer['transferability']:.0%})")

    print()


def example_4_proficiency_assessment():
    """Example 4: Assess proficiency level from context"""
    print("=" * 60)
    print("Example 4: Proficiency Assessment")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    contexts = [
        ('React', 'Built simple todo app following tutorial'),
        ('React', 'Architected micro-frontend platform for 50+ teams, optimized performance'),
        ('Python', 'Used in data analysis projects with pandas and numpy'),
        ('Machine Learning', 'Published research on novel algorithms, contributed to scikit-learn'),
    ]

    print("\nAssessing proficiency from context:")
    for skill, context in contexts:
        level = taxonomy.assess_proficiency(skill, context)
        print(f"\n  Skill: {skill}")
        print(f"  Context: \"{context}\"")
        print(f"  → Assessed level: {level or 'Unable to determine'}")

    print()


def example_5_learning_path():
    """Example 5: Generate learning path for career transition"""
    print("=" * 60)
    print("Example 5: Learning Path Generation")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    # Frontend developer wanting to become Full Stack
    current_skills = ['React', 'JavaScript', 'CSS', 'HTML']
    target_role = 'Full Stack Developer'

    print(f"\nCurrent skills: {', '.join(current_skills)}")
    print(f"Target role: {target_role}\n")

    path = taxonomy.generate_learning_path(current_skills, target_role)

    print("Recommended Learning Path:")
    print("\n🔥 High Priority:")
    for item in [p for p in path if p['priority'] == 'high']:
        print(f"  - {item['skill']}: {item['why']}")

    print("\n📚 Medium Priority:")
    for item in [p for p in path if p['priority'] == 'medium']:
        print(f"  - {item['skill']}: {item['why']}")

    print()


def example_6_related_skills():
    """Example 6: Find related skills for skill recommendations"""
    print("=" * 60)
    print("Example 6: Related Skills Discovery")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    skills_to_explore = ['React', 'Python', 'Digital Marketing']

    print("\nFinding related skills:\n")
    for skill_name in skills_to_explore:
        related = taxonomy.get_related(skill_name)
        print(f"  {skill_name}:")
        print(f"    Related skills: {', '.join([s.canonical_name for s in related])}")

        # Get parent skills
        parents = taxonomy.get_parents(skill_name)
        if parents:
            print(f"    Prerequisites: {', '.join([s.canonical_name for s in parents])}")

        # Get child skills
        children = taxonomy.get_children(skill_name)
        if children:
            print(f"    Advanced topics: {', '.join([s.canonical_name for s in children])}")

        print()


def example_7_role_based_skills():
    """Example 7: Get skills required for specific roles"""
    print("=" * 60)
    print("Example 7: Role-Based Skill Mapping")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    role = 'Frontend Engineer'

    # Find all skills for this role
    role_skills = []
    for skill in taxonomy.skills.values():
        if role in skill.typical_roles:
            role_skills.append(skill)

    print(f"\nSkills for '{role}' role:\n")

    # Group by subcategory
    by_subcategory = {}
    for skill in role_skills:
        if skill.subcategory not in by_subcategory:
            by_subcategory[skill.subcategory] = []
        by_subcategory[skill.subcategory].append(skill)

    for subcategory, skills in sorted(by_subcategory.items()):
        print(f"  {subcategory.replace('_', ' ').title()}:")
        for skill in skills:
            demand_emoji = "🔥" if skill.industry_demand == 'very_high' else "📈" if skill.industry_demand == 'high' else "📊"
            print(f"    {demand_emoji} {skill.canonical_name}")
        print()


def example_8_taxonomy_statistics():
    """Example 8: Get taxonomy statistics"""
    print("=" * 60)
    print("Example 8: Taxonomy Statistics")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    stats = taxonomy.get_statistics()

    print(f"\nTaxonomy Statistics:")
    print(f"  Total skills: {stats['total_skills']}")
    print(f"  Categories: {stats['categories']}")
    print(f"  Subcategories: {stats['subcategories']}")
    print(f"  Total aliases: {stats['total_aliases']}")
    print(f"  Avg transferability links: {stats['average_transferability_links']:.1f}")

    print(f"\n  Demand Distribution:")
    for demand, count in sorted(stats['demand_distribution'].items(), key=lambda x: x[1], reverse=True):
        print(f"    {demand.replace('_', ' ').title()}: {count} skills")

    print()


def example_9_search_skills():
    """Example 9: Search for skills"""
    print("=" * 60)
    print("Example 9: Search Skills")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    queries = ['web', 'sales', 'data']

    print("\nSearching for skills:\n")
    for query in queries:
        results = taxonomy.search_skills(query, limit=5)
        print(f"  Query: '{query}'")
        print(f"  Results: {', '.join([s.canonical_name for s in results])}")
        print()


def example_10_real_world_scenario():
    """Example 10: Real-world hiring scenario"""
    print("=" * 60)
    print("Example 10: Real-World Hiring Scenario")
    print("=" * 60)

    taxonomy = SkillsTaxonomy()

    print("\n📋 Job Posting: Senior Backend Engineer")
    print("   Required: Python, Django, PostgreSQL, Docker, AWS\n")

    candidates = [
        {
            'name': 'Alice',
            'skills': ['Python', 'Django', 'PostgreSQL', 'Kubernetes', 'GCP']
        },
        {
            'name': 'Bob',
            'skills': ['Python', 'Flask', 'MongoDB', 'Docker', 'AWS']
        },
        {
            'name': 'Carol',
            'skills': ['JavaScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
        }
    ]

    required = ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS']

    print("Candidate Evaluation:\n")
    for candidate in candidates:
        analysis = taxonomy.analyze_gaps(required, candidate['skills'])

        match_score = len(analysis['matches']) * 10
        transfer_score = sum(t['transferability'] * 10 for t in analysis['transferable'])
        total_score = match_score + transfer_score

        print(f"  👤 {candidate['name']}:")
        print(f"     Skills: {', '.join(candidate['skills'])}")
        print(f"     Direct matches: {len(analysis['matches'])}/5 ({match_score:.0f} points)")
        print(f"     Transferable: {len(analysis['transferable'])} ({transfer_score:.0f} points)")
        print(f"     Critical gaps: {len(analysis['critical_gaps'])}")
        print(f"     ⭐ Total Score: {total_score:.0f}/100")

        if analysis['transferable']:
            print(f"     🔄 Transferable skills:")
            for t in analysis['transferable']:
                print(f"        • {t['has']} → {t['required']} ({t['transferability']:.0%})")

        print()


def main():
    """Run all examples"""
    print("\n" + "=" * 60)
    print("Tanova Skills Taxonomy - Python Examples")
    print("Created by Tanova.ai - https://tanova.ai")
    print("=" * 60 + "\n")

    examples = [
        example_1_normalize_skills,
        example_2_transferability,
        example_3_skill_gap_analysis,
        example_4_proficiency_assessment,
        example_5_learning_path,
        example_6_related_skills,
        example_7_role_based_skills,
        example_8_taxonomy_statistics,
        example_9_search_skills,
        example_10_real_world_scenario,
    ]

    for example in examples:
        example()
        input("Press Enter to continue to next example...")
        print("\n")


if __name__ == '__main__':
    main()
