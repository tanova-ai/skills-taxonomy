#!/usr/bin/env python3
"""
Comprehensive validation for Skills Taxonomy (no external dependencies).

Validates:
1. JSON structure
2. Data integrity (no duplicates, valid references)
3. Consistency (transferability, aliases)
4. Completeness (required fields)
5. Business rules
"""

import json
from pathlib import Path
from collections import defaultdict

# Colors for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.END}")

def print_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.END}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.END}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.END}")

# Load taxonomy
TAXONOMY_PATH = Path(__file__).parent / 'taxonomy.json'

try:
    with open(TAXONOMY_PATH) as f:
        TAXONOMY = json.load(f)
except Exception as e:
    print_error(f"Failed to load taxonomy: {e}")
    exit(1)

def get_all_skills():
    """Extract all skills from taxonomy"""
    skills = []
    for category in TAXONOMY['categories'].values():
        for subcategory in category['subcategories'].values():
            skills.extend(subcategory['skills'])
    return skills

def get_skill_ids():
    """Get all skill IDs"""
    return {skill['id'] for skill in get_all_skills()}

def run_test(name, test_func):
    """Run a single test and report result"""
    try:
        test_func()
        print_success(name)
        return True
    except AssertionError as e:
        print_error(f"{name}: {e}")
        return False
    except Exception as e:
        print_error(f"{name}: Unexpected error - {e}")
        return False

def main():
    print("\n" + "=" * 70)
    print("🔍 VALIDATING SKILLS TAXONOMY")
    print("=" * 70 + "\n")

    passed = 0
    failed = 0
    warnings = 0

    # Test 1: Basic Structure
    print("📋 Test 1: Basic Structure")
    print("-" * 70)

    def test_json_valid():
        assert TAXONOMY is not None
        assert isinstance(TAXONOMY, dict)

    def test_top_level_fields():
        assert 'version' in TAXONOMY
        assert 'last_updated' in TAXONOMY
        assert 'categories' in TAXONOMY

    def test_required_fields():
        required = ['id', 'canonical_name', 'aliases', 'category', 'subcategory',
                   'tags', 'description', 'parent_skills', 'child_skills',
                   'related_skills', 'transferability', 'proficiency_levels',
                   'typical_roles', 'industry_demand', 'prerequisites']
        for skill in get_all_skills():
            for field in required:
                assert field in skill, f"Skill '{skill.get('id')}' missing '{field}'"

    def test_proficiency_levels():
        required_levels = {'beginner', 'intermediate', 'advanced', 'expert'}
        for skill in get_all_skills():
            levels = set(skill['proficiency_levels'].keys())
            assert levels == required_levels, \
                f"Skill '{skill['id']}' has wrong levels: {levels}"
            for level, data in skill['proficiency_levels'].items():
                assert 'markers' in data
                assert 'typical_experience' in data
                assert len(data['markers']) >= 2, \
                    f"Skill '{skill['id']}' level '{level}' needs ≥2 markers"

    tests = [
        ("JSON is valid", test_json_valid),
        ("Has required top-level fields", test_top_level_fields),
        ("All skills have required fields", test_required_fields),
        ("Proficiency levels complete", test_proficiency_levels),
    ]

    for name, func in tests:
        if run_test(name, func):
            passed += 1
        else:
            failed += 1

    # Test 2: Data Integrity
    print("\n📋 Test 2: Data Integrity")
    print("-" * 70)

    def test_no_duplicate_ids():
        ids = [s['id'] for s in get_all_skills()]
        dupes = [i for i in set(ids) if ids.count(i) > 1]
        assert len(dupes) == 0, f"Duplicate IDs: {dupes}"

    def test_no_duplicate_names():
        names = [s['canonical_name'].lower() for s in get_all_skills()]
        dupes = [n for n in set(names) if names.count(n) > 1]
        assert len(dupes) == 0, f"Duplicate names: {dupes}"

    def test_id_format():
        import re
        pattern = re.compile(r'^[a-z][a-z0-9_]*$')
        for skill in get_all_skills():
            assert pattern.match(skill['id']), \
                f"Bad ID format: '{skill['id']}'"

    def test_parent_refs():
        all_ids = get_skill_ids()
        for skill in get_all_skills():
            for parent in skill['parent_skills']:
                assert parent in all_ids, \
                    f"'{skill['id']}' references missing parent '{parent}'"

    def test_child_refs():
        all_ids = get_skill_ids()
        for skill in get_all_skills():
            for child in skill['child_skills']:
                assert child in all_ids, \
                    f"'{skill['id']}' references missing child '{child}'"

    def test_related_refs():
        all_ids = get_skill_ids()
        for skill in get_all_skills():
            for related in skill['related_skills']:
                assert related in all_ids, \
                    f"'{skill['id']}' references missing related '{related}'"

    def test_transfer_refs():
        all_ids = get_skill_ids()
        for skill in get_all_skills():
            for target in skill['transferability'].keys():
                assert target in all_ids, \
                    f"'{skill['id']}' has transferability to missing '{target}'"

    def test_prereq_refs():
        all_ids = get_skill_ids()
        for skill in get_all_skills():
            for prereq in skill['prerequisites']:
                assert prereq in all_ids, \
                    f"'{skill['id']}' references missing prerequisite '{prereq}'"

    tests = [
        ("No duplicate skill IDs", test_no_duplicate_ids),
        ("No duplicate canonical names", test_no_duplicate_names),
        ("Skill IDs follow format", test_id_format),
        ("Parent skills exist", test_parent_refs),
        ("Child skills exist", test_child_refs),
        ("Related skills exist", test_related_refs),
        ("Transferability targets exist", test_transfer_refs),
        ("Prerequisites exist", test_prereq_refs),
    ]

    for name, func in tests:
        if run_test(name, func):
            passed += 1
        else:
            failed += 1

    # Test 3: Consistency
    print("\n📋 Test 3: Consistency")
    print("-" * 70)

    def test_transfer_scores():
        for skill in get_all_skills():
            for target, score in skill['transferability'].items():
                assert 0.0 <= score <= 1.0, \
                    f"'{skill['id']}' → '{target}': invalid score {score}"

    def test_has_aliases():
        for skill in get_all_skills():
            assert len(skill['aliases']) > 0, \
                f"'{skill['id']}' has no aliases"

    def test_no_self_refs():
        for skill in get_all_skills():
            sid = skill['id']
            assert sid not in skill['parent_skills'], f"'{sid}' is its own parent"
            assert sid not in skill['child_skills'], f"'{sid}' is its own child"
            assert sid not in skill['related_skills'], f"'{sid}' is its own related"
            assert sid not in skill['transferability'], f"'{sid}' transfers to itself"

    def test_category_location():
        for cat_id, category in TAXONOMY['categories'].items():
            for subcat_id, subcategory in category['subcategories'].items():
                for skill in subcategory['skills']:
                    assert skill['category'] == cat_id, \
                        f"'{skill['id']}' category mismatch"
                    assert skill['subcategory'] == subcat_id, \
                        f"'{skill['id']}' subcategory mismatch"

    def test_valid_demand():
        valid = {'very_high', 'high', 'medium', 'low', 'declining'}
        for skill in get_all_skills():
            assert skill['industry_demand'] in valid, \
                f"'{skill['id']}' has invalid demand: {skill['industry_demand']}"

    def test_has_roles():
        for skill in get_all_skills():
            assert len(skill['typical_roles']) > 0, \
                f"'{skill['id']}' has no typical roles"

    def test_description_length():
        for skill in get_all_skills():
            length = len(skill['description'])
            assert 10 <= length <= 500, \
                f"'{skill['id']}' description length {length} not in 10-500"

    tests = [
        ("Transferability scores 0-1", test_transfer_scores),
        ("All skills have aliases", test_has_aliases),
        ("No self-references", test_no_self_refs),
        ("Category/subcategory match location", test_category_location),
        ("Industry demand is valid", test_valid_demand),
        ("All skills have typical roles", test_has_roles),
        ("Description length 10-500 chars", test_description_length),
    ]

    for name, func in tests:
        if run_test(name, func):
            passed += 1
        else:
            failed += 1

    # Statistics
    print("\n📊 STATISTICS")
    print("-" * 70)

    skills = get_all_skills()
    category_counts = defaultdict(int)
    demand_counts = defaultdict(int)

    for skill in skills:
        category_counts[skill['category']] += 1
        demand_counts[skill['industry_demand']] += 1

    total_aliases = sum(len(s['aliases']) for s in skills)
    total_transfer = sum(len(s['transferability']) for s in skills)

    print(f"Total Skills: {len(skills)}")
    print(f"Total Aliases: {total_aliases} (avg {total_aliases/len(skills):.1f}/skill)")
    print(f"Total Transferability Links: {total_transfer}")
    print(f"\nBy Category:")
    for cat, count in sorted(category_counts.items()):
        print(f"  {cat}: {count} skills")
    print(f"\nBy Demand:")
    for demand in ['very_high', 'high', 'medium', 'low', 'declining']:
        count = demand_counts.get(demand, 0)
        if count > 0:
            print(f"  {demand.replace('_', ' ').title()}: {count} skills")

    # Summary
    print("\n" + "=" * 70)
    print("📋 VALIDATION SUMMARY")
    print("=" * 70)
    print(f"Tests Passed: {passed}")
    print(f"Tests Failed: {failed}")
    print(f"Warnings: {warnings}")

    if failed == 0:
        print_success(f"\n🎉 All {passed} tests passed! Taxonomy is valid.\n")
        return 0
    else:
        print_error(f"\n💥 {failed} test(s) failed. Please fix errors above.\n")
        return 1

if __name__ == '__main__':
    import sys
    sys.exit(main())
