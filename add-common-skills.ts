/**
 * Add Common Missing Skills to Taxonomy
 *
 * This script adds 20 commonly-used skills that are currently missing
 * from the taxonomy, based on production data from Tanova.
 */

import fs from 'fs'
import path from 'path'

// Load existing taxonomy
const taxonomyPath = path.join(process.cwd(), 'taxonomy.json')
const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf-8'))

// Skills to add (from local-skills-extension.json)
const newSkills = [
  {
    id: "dotnet",
    canonical_name: ".NET",
    aliases: ["dotnet", "dot net", ".net framework", "dotnet framework"],
    category: "technology",
    subcategory: "backend_frameworks",
    tags: ["backend", "microsoft", "framework"],
    description: "Microsoft's developer platform for building applications across web, mobile, desktop, and cloud",
    parent_skills: ["csharp"],
    child_skills: [],
    related_skills: ["aspnet_core", "csharp", "java"],
    transferability: {
      "csharp": 0.95,
      "aspnet_core": 0.90,
      "java": 0.65
    },
    proficiency_levels: {
      beginner: {
        markers: ["Built console applications", "Used basic .NET libraries", "Followed tutorials"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Built web applications", "Used Entity Framework", "Implemented authentication"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Designed microservices", "Optimized performance", "Used advanced patterns"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Contributed to .NET ecosystem", "Architected enterprise solutions", "Deep CLR knowledge"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Backend Developer", ".NET Developer", "Full Stack Developer"],
    industry_demand: "high",
    prerequisites: ["csharp"],
    last_updated: "2025-12-31"
  },
  {
    id: "azure_devops",
    canonical_name: "Azure DevOps",
    aliases: ["azure devops", "ado", "vsts", "visual studio team services"],
    category: "technology",
    subcategory: "devops",
    tags: ["ci/cd", "microsoft", "cloud", "pipelines"],
    description: "Microsoft's DevOps platform providing CI/CD pipelines, repos, boards, and testing tools",
    parent_skills: ["devops"],
    child_skills: [],
    related_skills: ["jenkins", "github_actions", "gitlab"],
    transferability: {
      "jenkins": 0.75,
      "github_actions": 0.80,
      "gitlab": 0.75
    },
    proficiency_levels: {
      beginner: {
        markers: ["Created basic pipelines", "Used boards for tracking", "Managed repos"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Multi-stage pipelines", "Automated testing", "Release management"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Custom extensions", "Security integration", "Multi-repo orchestration"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise-scale implementations", "Advanced security", "Custom tooling"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["DevOps Engineer", "Platform Engineer", "Release Manager"],
    industry_demand: "high",
    prerequisites: ["git", "ci_cd"],
    last_updated: "2025-12-31"
  },
  {
    id: "github",
    canonical_name: "GitHub",
    aliases: ["github", "gh"],
    category: "technology",
    subcategory: "tools",
    tags: ["version-control", "git", "collaboration"],
    description: "Git repository hosting and collaboration platform with CI/CD, issues, and project management",
    parent_skills: ["git"],
    child_skills: [],
    related_skills: ["bitbucket", "gitlab", "git"],
    transferability: {
      "bitbucket": 0.95,
      "gitlab": 0.95,
      "git": 0.85
    },
    proficiency_levels: {
      beginner: {
        markers: ["Created repos", "Made pull requests", "Cloned repositories"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Code reviews", "GitHub Actions", "Branch protection"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Organization management", "Advanced CI/CD workflows", "GitHub Apps"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise administration", "Security best practices", "Custom integrations"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Software Developer", "DevOps Engineer", "Engineering Manager"],
    industry_demand: "very_high",
    prerequisites: ["git"],
    last_updated: "2025-12-31"
  },
  {
    id: "bitbucket",
    canonical_name: "Bitbucket",
    aliases: ["bitbucket", "atlassian bitbucket"],
    category: "technology",
    subcategory: "tools",
    tags: ["version-control", "git", "atlassian"],
    description: "Git repository hosting and collaboration platform by Atlassian with CI/CD pipelines",
    parent_skills: ["git"],
    child_skills: [],
    related_skills: ["github", "gitlab", "git"],
    transferability: {
      "github": 0.95,
      "gitlab": 0.95,
      "git": 0.85
    },
    proficiency_levels: {
      beginner: {
        markers: ["Created repos", "Made pull requests", "Basic pipelines"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Code reviews", "Pipeline configuration", "Branch permissions"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Workspace management", "Advanced pipelines", "Jira integration"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise setup", "Migration strategies", "Custom automation"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Software Developer", "DevOps Engineer"],
    industry_demand: "medium",
    prerequisites: ["git"],
    last_updated: "2025-12-31"
  },
  {
    id: "slack",
    canonical_name: "Slack",
    aliases: ["slack"],
    category: "technology",
    subcategory: "tools",
    tags: ["communication", "collaboration"],
    description: "Team communication and collaboration platform with channels, integrations, and workflows",
    parent_skills: [],
    child_skills: [],
    related_skills: ["microsoft_teams", "discord"],
    transferability: {
      "microsoft_teams": 0.90,
      "discord": 0.75
    },
    proficiency_levels: {
      beginner: {
        markers: ["Used channels", "Direct messages", "File sharing"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Created workflows", "Used integrations", "Channel management"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Built Slack apps", "Workspace administration", "Custom bots"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise grid management", "Complex integrations", "API mastery"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["All Roles"],
    industry_demand: "very_high",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "microsoft_teams",
    canonical_name: "Microsoft Teams",
    aliases: ["microsoft teams", "ms teams", "teams"],
    category: "technology",
    subcategory: "tools",
    tags: ["communication", "collaboration", "microsoft"],
    description: "Microsoft's team collaboration and communication platform with chat, meetings, and file sharing",
    parent_skills: [],
    child_skills: [],
    related_skills: ["slack", "zoom"],
    transferability: {
      "slack": 0.90,
      "zoom": 0.70
    },
    proficiency_levels: {
      beginner: {
        markers: ["Used chat", "Joined meetings", "File sharing"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Created teams", "Used apps", "Meeting organization"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Built Teams apps", "Power Automate integration", "Admin center"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise deployment", "Governance policies", "Custom solutions"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["All Roles"],
    industry_demand: "very_high",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "sonarqube",
    canonical_name: "SonarQube",
    aliases: ["sonarqube", "sonar"],
    category: "technology",
    subcategory: "tools",
    tags: ["code-quality", "static-analysis", "testing"],
    description: "Code quality and security analysis platform for continuous inspection",
    parent_skills: [],
    child_skills: [],
    related_skills: ["code_review", "testing"],
    transferability: {
      "eslint": 0.60,
      "code_review": 0.70
    },
    proficiency_levels: {
      beginner: {
        markers: ["Ran scans", "Read reports", "Fixed code smells"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Configured quality gates", "Integrated with CI/CD", "Custom rules"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Quality profiles management", "Custom plugins", "Enterprise setup"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Plugin development", "Large-scale deployments", "Security expertise"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["DevOps Engineer", "QA Engineer", "Software Developer"],
    industry_demand: "medium",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "microsoft_project",
    canonical_name: "Microsoft Project",
    aliases: ["microsoft project", "ms project", "msproject"],
    category: "technology",
    subcategory: "tools",
    tags: ["project-management", "microsoft", "planning"],
    description: "Microsoft's project management software for planning, scheduling, and resource allocation",
    parent_skills: [],
    child_skills: [],
    related_skills: ["jira", "asana"],
    transferability: {
      "jira": 0.65,
      "asana": 0.60
    },
    proficiency_levels: {
      beginner: {
        markers: ["Created project plans", "Gantt charts", "Task tracking"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Resource leveling", "Baseline management", "Reports"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Multi-project portfolios", "Custom fields", "Integration"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise resource management", "Advanced formulas", "PPM expertise"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Project Manager", "Program Manager", "PMO"],
    industry_demand: "medium",
    prerequisites: [],
    last_updated: "2025-12-31"
  }
]

// Add business skills
const businessSkills = [
  {
    id: "kanban",
    canonical_name: "Kanban",
    aliases: ["kanban"],
    category: "business",
    subcategory: "project_management",
    tags: ["agile", "methodology", "workflow"],
    description: "Agile project management methodology focused on visualizing work and continuous delivery",
    parent_skills: ["agile"],
    child_skills: [],
    related_skills: ["scrum", "agile"],
    transferability: {
      "scrum": 0.85,
      "agile": 0.90
    },
    proficiency_levels: {
      beginner: {
        markers: ["Used Kanban board", "Managed WIP limits", "Basic workflow"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Optimized flow", "Metrics tracking", "Team facilitation"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Process improvement", "Multi-team Kanban", "Scaling"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Organizational transformation", "Training/coaching", "Enterprise Kanban"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Agile Coach", "Project Manager", "Scrum Master"],
    industry_demand: "high",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "scrum_master",
    canonical_name: "Scrum Master",
    aliases: ["scrum master", "sm", "certified scrum master", "csm"],
    category: "business",
    subcategory: "project_management",
    tags: ["agile", "scrum", "leadership"],
    description: "Agile role responsible for facilitating Scrum process and removing impediments for the team",
    parent_skills: ["agile", "scrum"],
    child_skills: [],
    related_skills: ["agile", "project_management", "team_leadership"],
    transferability: {
      "agile": 0.90,
      "project_management": 0.80,
      "team_leadership": 0.75
    },
    proficiency_levels: {
      beginner: {
        markers: ["Facilitated ceremonies", "Maintained backlog", "Removed blockers"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Coached teams", "Stakeholder management", "Metrics tracking"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Organizational change", "Scaled Scrum", "Multiple teams"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise transformation", "Training/certification", "Thought leadership"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Scrum Master", "Agile Coach", "Delivery Lead"],
    industry_demand: "high",
    prerequisites: ["agile"],
    last_updated: "2025-12-31"
  },
  {
    id: "safe",
    canonical_name: "SAFe",
    aliases: ["safe", "scaled agile", "scaled agile framework"],
    category: "business",
    subcategory: "project_management",
    tags: ["agile", "scaling", "enterprise"],
    description: "Scaled Agile Framework for implementing agile practices at enterprise scale",
    parent_skills: ["agile"],
    child_skills: [],
    related_skills: ["agile", "scrum"],
    transferability: {
      "agile": 0.85,
      "scrum": 0.80
    },
    proficiency_levels: {
      beginner: {
        markers: ["Understood SAFe principles", "Participated in PI planning", "Basic roles"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Led ARTs", "Facilitated ceremonies", "Metrics tracking"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Portfolio management", "Value streams", "Multiple ARTs"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise transformation", "SAFe training", "Consultant-level expertise"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Release Train Engineer", "Agile Coach", "Program Manager"],
    industry_demand: "medium",
    prerequisites: ["agile", "scrum"],
    last_updated: "2025-12-31"
  },
  {
    id: "change_management",
    canonical_name: "Change Management",
    aliases: ["change management", "organizational change"],
    category: "business",
    subcategory: "management",
    tags: ["transformation", "leadership", "strategy"],
    description: "Managing organizational change and transformation initiatives effectively",
    parent_skills: [],
    child_skills: [],
    related_skills: ["project_management", "stakeholder_management", "leadership"],
    transferability: {
      "project_management": 0.75,
      "stakeholder_management": 0.80,
      "leadership": 0.75
    },
    proficiency_levels: {
      beginner: {
        markers: ["Supported change initiatives", "Basic communication plans", "Stakeholder analysis"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Led small changes", "Resistance management", "Training delivery"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Large transformation programs", "Change frameworks", "Organizational design"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise transformations", "Cultural change", "Executive sponsorship"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Change Manager", "Organizational Development", "Program Manager"],
    industry_demand: "high",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "vendor_management",
    canonical_name: "Vendor Management",
    aliases: ["vendor management", "supplier management", "third-party management"],
    category: "business",
    subcategory: "management",
    tags: ["procurement", "relationships", "contracts"],
    description: "Managing relationships and contracts with external vendors and service providers",
    parent_skills: [],
    child_skills: [],
    related_skills: ["stakeholder_management", "negotiation"],
    transferability: {
      "stakeholder_management": 0.80,
      "negotiation": 0.75
    },
    proficiency_levels: {
      beginner: {
        markers: ["Basic vendor coordination", "Contract tracking", "Invoice management"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["RFP processes", "SLA management", "Vendor evaluation"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Strategic partnerships", "Cost optimization", "Risk management"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise vendor strategy", "Complex negotiations", "Governance"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Procurement Manager", "Vendor Manager", "Operations Manager"],
    industry_demand: "medium",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "process_optimization",
    canonical_name: "Process Optimization",
    aliases: ["process optimization", "process improvement", "operational excellence"],
    category: "business",
    subcategory: "strategy",
    tags: ["efficiency", "improvement", "lean"],
    description: "Improving and optimizing business processes for efficiency and effectiveness",
    parent_skills: [],
    child_skills: [],
    related_skills: ["lean", "six_sigma", "business_analysis"],
    transferability: {
      "lean": 0.85,
      "six_sigma": 0.80,
      "business_analysis": 0.75
    },
    proficiency_levels: {
      beginner: {
        markers: ["Process mapping", "Basic analysis", "Improvement suggestions"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Process redesign", "Metrics tracking", "Stakeholder buy-in"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Enterprise-wide optimization", "Change management", "ROI measurement"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Operational transformation", "Lean Six Sigma expertise", "Consulting"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Business Analyst", "Operations Manager", "Process Consultant"],
    industry_demand: "high",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "risk_management",
    canonical_name: "Risk Management",
    aliases: ["risk management", "risk assessment"],
    category: "business",
    subcategory: "strategy",
    tags: ["strategy", "planning", "mitigation"],
    description: "Identifying, assessing, and mitigating business and project risks",
    parent_skills: [],
    child_skills: [],
    related_skills: ["project_management", "strategic_planning", "business_analysis"],
    transferability: {
      "project_management": 0.80,
      "strategic_planning": 0.75,
      "business_analysis": 0.70
    },
    proficiency_levels: {
      beginner: {
        markers: ["Risk identification", "Basic assessment", "Risk register"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Risk analysis", "Mitigation plans", "Monitoring"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Enterprise risk framework", "Quantitative analysis", "Board reporting"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["ERM expertise", "Risk strategy", "Crisis management"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Risk Manager", "Project Manager", "Compliance Officer"],
    industry_demand: "high",
    prerequisites: [],
    last_updated: "2025-12-31"
  }
]

// Add soft skills
const softSkills = [
  {
    id: "mentoring",
    canonical_name: "Mentoring",
    aliases: ["mentoring", "coaching", "mentorship"],
    category: "business",
    subcategory: "management",
    tags: ["leadership", "development", "teaching"],
    description: "Guiding and developing others through knowledge transfer and support",
    parent_skills: [],
    child_skills: [],
    related_skills: ["team_leadership", "teaching", "coaching"],
    transferability: {
      "team_leadership": 0.80,
      "teaching": 0.85,
      "coaching": 0.90
    },
    proficiency_levels: {
      beginner: {
        markers: ["Informal guidance", "Knowledge sharing", "Peer support"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Structured mentoring", "Career guidance", "Regular sessions"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Multiple mentees", "Program development", "Impact measurement"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Mentoring programs", "Executive coaching", "Thought leadership"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Senior Engineer", "Team Lead", "Manager"],
    industry_demand: "high",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "stakeholder_communication",
    canonical_name: "Stakeholder Communication",
    aliases: ["stakeholder communication", "stakeholder management"],
    category: "business",
    subcategory: "management",
    tags: ["communication", "management", "relationships"],
    description: "Effectively communicating with and managing stakeholder expectations",
    parent_skills: [],
    child_skills: [],
    related_skills: ["communication", "relationship_management", "negotiation"],
    transferability: {
      "communication": 0.90,
      "relationship_management": 0.85,
      "negotiation": 0.70
    },
    proficiency_levels: {
      beginner: {
        markers: ["Basic updates", "Email communication", "Meeting participation"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Presentations", "Regular updates", "Issue escalation"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Influence strategies", "Executive communication", "Conflict resolution"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["C-suite communication", "Complex negotiations", "Crisis communication"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Project Manager", "Product Manager", "Business Analyst"],
    industry_demand: "very_high",
    prerequisites: [],
    last_updated: "2025-12-31"
  },
  {
    id: "conflict_resolution",
    canonical_name: "Conflict Resolution",
    aliases: ["conflict resolution", "conflict management", "dispute resolution"],
    category: "business",
    subcategory: "management",
    tags: ["leadership", "mediation", "communication"],
    description: "Resolving conflicts and disputes in professional settings effectively",
    parent_skills: [],
    child_skills: [],
    related_skills: ["negotiation", "communication", "team_leadership"],
    transferability: {
      "negotiation": 0.80,
      "communication": 0.75,
      "team_leadership": 0.70
    },
    proficiency_levels: {
      beginner: {
        markers: ["Basic mediation", "Active listening", "De-escalation"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Team conflicts", "Facilitation", "Win-win solutions"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Complex disputes", "Organizational conflicts", "Formal mediation"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Executive conflicts", "Training others", "Conflict prevention"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Manager", "Team Lead", "HR Business Partner"],
    industry_demand: "high",
    prerequisites: [],
    last_updated: "2025-12-31"
  }
]

// Technology skills (continued)
const techSkillsDevOps = [
  {
    id: "release_management",
    canonical_name: "Release Management",
    aliases: ["release management", "deployment management"],
    category: "technology",
    subcategory: "devops",
    tags: ["deployment", "ci/cd", "operations"],
    description: "Managing software releases and deployments across environments",
    parent_skills: ["devops"],
    child_skills: [],
    related_skills: ["ci_cd", "project_management"],
    transferability: {
      "devops": 0.85,
      "ci_cd": 0.85,
      "project_management": 0.70
    },
    proficiency_levels: {
      beginner: {
        markers: ["Basic deployments", "Release notes", "Schedule coordination"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Automated releases", "Rollback procedures", "Multi-environment"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Blue-green deployments", "Canary releases", "Release automation"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Enterprise release strategy", "Continuous deployment", "Zero-downtime"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["Release Manager", "DevOps Engineer", "SRE"],
    industry_demand: "high",
    prerequisites: ["ci_cd"],
    last_updated: "2025-12-31"
  },
  {
    id: "quality_assurance_strategy",
    canonical_name: "Quality Assurance Strategy",
    aliases: ["qa strategy", "quality assurance strategy", "testing strategy"],
    category: "technology",
    subcategory: "testing",
    tags: ["qa", "testing", "strategy"],
    description: "Developing comprehensive quality assurance strategies for software products",
    parent_skills: [],
    child_skills: [],
    related_skills: ["test_automation", "software_testing"],
    transferability: {
      "test_automation": 0.75,
      "software_testing": 0.85
    },
    proficiency_levels: {
      beginner: {
        markers: ["Basic test planning", "Test case creation", "Bug reporting"],
        typical_experience: "0-1 years"
      },
      intermediate: {
        markers: ["Test strategy docs", "Automation framework", "Metrics tracking"],
        typical_experience: "1-3 years"
      },
      advanced: {
        markers: ["Enterprise QA", "Process improvement", "Team leadership"],
        typical_experience: "3-5 years"
      },
      expert: {
        markers: ["Organization-wide QA", "Strategic planning", "Quality culture"],
        typical_experience: "5+ years"
      }
    },
    typical_roles: ["QA Manager", "Test Architect", "Quality Director"],
    industry_demand: "medium",
    prerequisites: ["software_testing"],
    last_updated: "2025-12-31"
  }
]

// Combine all skills
const allNewSkills = [
  ...newSkills,
  ...businessSkills,
  ...softSkills,
  ...techSkillsDevOps
]

console.log(`Adding ${allNewSkills.length} new skills to taxonomy...`)

// Find the correct categories and add skills
for (const skill of allNewSkills) {
  const category = taxonomy.categories[skill.category]
  if (!category) {
    console.error(`Category ${skill.category} not found!`)
    continue
  }

  const subcategory = category.subcategories[skill.subcategory]
  if (!subcategory) {
    console.error(`Subcategory ${skill.subcategory} not found in ${skill.category}!`)
    continue
  }

  // Check if skill already exists
  const exists = subcategory.skills.some((s: any) => s.id === skill.id)
  if (exists) {
    console.log(`  ⏭️  Skipping ${skill.canonical_name} (already exists)`)
    continue
  }

  // Add skill
  subcategory.skills.push(skill)
  console.log(`  ✅ Added ${skill.canonical_name} to ${skill.category}/${skill.subcategory}`)
}

// Write updated taxonomy
fs.writeFileSync(taxonomyPath, JSON.stringify(taxonomy, null, 2))

console.log(`\n✅ Done! Added ${allNewSkills.length} skills to taxonomy.json`)
console.log('\nNext steps:')
console.log('1. Validate: python validate_taxonomy.py')
console.log('2. Review changes: git diff taxonomy.json')
console.log('3. Commit: git commit -am "Add 20 common skills from Tanova production data"')
console.log('4. Push: git push')
