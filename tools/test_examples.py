"""
Quick test runner for all examples (non-interactive)
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src', 'python'))

from examples.python_example import (
    example_1_normalize_skills,
    example_2_transferability,
    example_3_skill_gap_analysis,
    example_8_taxonomy_statistics,
)

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("Running Skills Taxonomy Examples")
    print("=" * 60 + "\n")

    # Run a few key examples
    example_1_normalize_skills()
    example_2_transferability()
    example_3_skill_gap_analysis()
    example_8_taxonomy_statistics()

    print("✅ All examples completed successfully!")
