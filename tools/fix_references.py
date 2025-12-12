#!/usr/bin/env python3
"""
Fix broken skill references in taxonomy.

Broken references found:
1. 'react' references missing parent 'frontend_development'
2. 'python' references missing child 'flask'
3. 'python' references missing related 'r'
4. 'typescript' has transferability to missing 'csharp'
5. 'postgresql' references missing prerequisite 'sql'

Strategy: Remove references to skills not yet in taxonomy
"""

import json
from pathlib import Path

taxonomy_path = Path('taxonomy.json')
taxonomy = json.load(open(taxonomy_path))

def get_skill_ids():
    ids = set()
    for cat in taxonomy['categories'].values():
        for subcat in cat['subcategories'].values():
            for skill in subcat['skills']:
                ids.add(skill['id'])
    return ids

def fix_skill_references():
    all_ids = get_skill_ids()
    fixed_count = 0

    for cat in taxonomy['categories'].values():
        for subcat in cat['subcategories'].values():
            for skill in subcat['skills']:
                skill_id = skill['id']

                # Fix parent_skills
                original_parents = skill['parent_skills'][:]
                skill['parent_skills'] = [p for p in skill['parent_skills'] if p in all_ids]
                if len(skill['parent_skills']) != len(original_parents):
                    removed = set(original_parents) - set(skill['parent_skills'])
                    print(f"  '{skill_id}': Removed missing parents: {removed}")
                    fixed_count += 1

                # Fix child_skills
                original_children = skill['child_skills'][:]
                skill['child_skills'] = [c for c in skill['child_skills'] if c in all_ids]
                if len(skill['child_skills']) != len(original_children):
                    removed = set(original_children) - set(skill['child_skills'])
                    print(f"  '{skill_id}': Removed missing children: {removed}")
                    fixed_count += 1

                # Fix related_skills
                original_related = skill['related_skills'][:]
                skill['related_skills'] = [r for r in skill['related_skills'] if r in all_ids]
                if len(skill['related_skills']) != len(original_related):
                    removed = set(original_related) - set(skill['related_skills'])
                    print(f"  '{skill_id}': Removed missing related: {removed}")
                    fixed_count += 1

                # Fix transferability
                original_transfer = list(skill['transferability'].keys())
                skill['transferability'] = {
                    k: v for k, v in skill['transferability'].items()
                    if k in all_ids
                }
                if len(skill['transferability']) != len(original_transfer):
                    removed = set(original_transfer) - set(skill['transferability'].keys())
                    print(f"  '{skill_id}': Removed missing transferability: {removed}")
                    fixed_count += 1

                # Fix prerequisites
                original_prereqs = skill['prerequisites'][:]
                skill['prerequisites'] = [p for p in skill['prerequisites'] if p in all_ids]
                if len(skill['prerequisites']) != len(original_prereqs):
                    removed = set(original_prereqs) - set(skill['prerequisites'])
                    print(f"  '{skill_id}': Removed missing prerequisites: {removed}")
                    fixed_count += 1

    return fixed_count

print("🔧 Fixing broken skill references...")
print("-" * 70)

all_ids = get_skill_ids()
print(f"Available skill IDs: {len(all_ids)}")
print(f"Skills: {sorted(all_ids)}\n")

fixed = fix_skill_references()

print(f"\n✅ Fixed {fixed} broken references")

# Save
json.dump(taxonomy, open(taxonomy_path, 'w'), indent=2, ensure_ascii=False)
print(f"💾 Saved to {taxonomy_path}")

print("\n🔍 Run validation again: python3 validate_taxonomy.py")
