import type { SubjectNode } from '@/types/syllabus';

export const MAINS_SUBJECTS_SEED: SubjectNode[] = [
  {
    id: "mains.essay",
    paper: "Essay (Paper I)",
    stage: "mains",
    subject: "Essay Paper (250 Marks)",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 60,
    order_index: 0,
    topics: [
      {
        id: "mains.essay.philosophical",
        title: "Section A: Philosophical, Ethical & Abstract Themes",
        subtopics: [
          { id: "m-ess-1", title: "Philosophical & Epistemological Prompts: Critical Thinking & Perspective Structuring", weight: 1.2, estimated_hours: 6 },
          { id: "m-ess-2", title: "Ethical Dimensions of Life, Integrity, Compassion & Moral Dilemmas", weight: 1.1, estimated_hours: 5 }
        ]
      },
      {
        id: "mains.essay.socio_economic",
        title: "Section B: Socio-Economic, Technology & Governance Themes",
        subtopics: [
          { id: "m-ess-3", title: "Social Justice, Women Empowerment, Education & Public Health", weight: 1.1, estimated_hours: 5 },
          { id: "m-ess-4", title: "Economic Resilience, Sustainable Development & Emerging Technology Disruption", weight: 1.2, estimated_hours: 6 }
        ]
      }
    ]
  },
  {
    id: "mains.gs1",
    paper: "Mains GS I",
    stage: "mains",
    subject: "Indian Heritage, Society & World Geography",
    node_type: "subject",
    weight: 1.0,
    estimated_study_hours: 110,
    order_index: 1,
    topics: [
      {
        id: "mains.gs1.art_culture",
        title: "Indian Art, Architecture & Literature",
        subtopics: [
          { id: "m-gs1-1", title: "Temple Architecture Styles: Nagara, Dravida, Vesara", weight: 1.0, estimated_hours: 5 },
          { id: "m-gs1-2", title: "Classical Dances, Folk Forms & Martial Arts of India", weight: 1.0, estimated_hours: 4 },
          { id: "m-gs1-3", title: "Literary Traditions from Ancient to Modern Times", weight: 0.9, estimated_hours: 4 }
        ]
      },
      {
        id: "mains.gs1.society",
        title: "Indian Society & Social Issues",
        subtopics: [
          { id: "m-gs1-4", title: "Salient Features of Indian Society & Diversity", weight: 1.0, estimated_hours: 4 },
          { id: "m-gs1-5", title: "Role of Women & Women's Organizations, Population Issues", weight: 1.2, estimated_hours: 6 },
          { id: "m-gs1-6", title: "Poverty, Urbanization Problems & Remedies", weight: 1.1, estimated_hours: 5 },
          { id: "m-gs1-7", title: "Effects of Globalization, Communalism, Regionalism & Secularism", weight: 1.2, estimated_hours: 6 }
        ]
      },
      {
        id: "mains.gs1.world_history",
        title: "World History (18th Century Onwards)",
        subtopics: [
          { id: "m-gs1-8", title: "Industrial Revolution, World Wars & Redrawal of National Boundaries", weight: 1.0, estimated_hours: 6 },
          { id: "m-gs1-9", title: "Colonization, Decolonization, Political Philosophies (Communism, Capitalism)", weight: 1.0, estimated_hours: 6 }
        ]
      }
    ]
  },
  {
    id: "mains.gs2",
    paper: "Mains GS II",
    stage: "mains",
    subject: "Governance, Constitution, Polity & IR",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 125,
    order_index: 2,
    topics: [
      {
        id: "mains.gs2.polity_comparison",
        title: "Constitutional Comparison & Federalism",
        subtopics: [
          { id: "m-gs2-1", title: "Comparison of Indian Constitutional Scheme with Other Countries", weight: 1.1, estimated_hours: 5 },
          { id: "m-gs2-2", title: "Issues and Challenges Pertaining to Federal Structure (Cooperative vs Fiscal Federalism)", weight: 1.3, estimated_hours: 7 },
          { id: "m-gs2-3", title: "Separation of Powers, Dispute Redressal Mechanisms & Institutions", weight: 1.1, estimated_hours: 5 }
        ]
      },
      {
        id: "mains.gs2.governance",
        title: "Governance & Civil Services in a Democracy",
        subtopics: [
          { id: "m-gs2-4", title: "E-Governance: Applications, Models, Successes & Limitations", weight: 1.2, estimated_hours: 6 },
          { id: "m-gs2-5", title: "Citizens Charters, Transparency, Accountability & Institutional Measures", weight: 1.1, estimated_hours: 5 },
          { id: "m-gs2-6", title: "Role of Civil Services in a Democracy & Administrative Reforms", weight: 1.1, estimated_hours: 5 }
        ]
      },
      {
        id: "mains.gs2.ir",
        title: "International Relations & Bilateral Groupings",
        subtopics: [
          { id: "m-gs2-7", title: "India and its Neighborhood-Relations (Neighborhood First)", weight: 1.3, estimated_hours: 7 },
          { id: "m-gs2-8", title: "Bilateral, Regional and Global Groupings (Quad, BRICS, SCO, G20)", weight: 1.3, estimated_hours: 7 },
          { id: "m-gs2-9", title: "Important International Institutions (UN, WTO, IMF) - Structure and Mandate", weight: 1.1, estimated_hours: 5 }
        ]
      }
    ]
  },
  {
    id: "mains.gs3",
    paper: "Mains GS III",
    stage: "mains",
    subject: "Economy, S&T, Biodiversity & Internal Security",
    node_type: "subject",
    weight: 1.1,
    estimated_study_hours: 120,
    order_index: 3,
    topics: [
      {
        id: "mains.gs3.tech_innovation",
        title: "Science & Technology Innovations",
        subtopics: [
          { id: "m-gs3-1", title: "Developments & Applications: AI, Quantum Computing, Robotics, Nanotechnology", weight: 1.2, estimated_hours: 6 },
          { id: "m-gs3-2", title: "Indigenization of Technology & Achievements of Indians in S&T", weight: 1.0, estimated_hours: 5 },
          { id: "m-gs3-3", title: "Issues Relating to Intellectual Property Rights (IPR)", weight: 1.0, estimated_hours: 4 }
        ]
      },
      {
        id: "mains.gs3.disaster_security",
        title: "Disaster Management & Internal Security",
        subtopics: [
          { id: "m-gs3-4", title: "Disaster and Disaster Management (NDMA, Sendai Framework, Resilient Infra)", weight: 1.1, estimated_hours: 6 },
          { id: "m-gs3-5", title: "Linkages Between Development and Spread of Extremism (LWE)", weight: 1.2, estimated_hours: 5 },
          { id: "m-gs3-6", title: "Cyber Security, Money Laundering & Border Area Management Challenges", weight: 1.3, estimated_hours: 7 }
        ]
      }
    ]
  },
  {
    id: "mains.gs4",
    paper: "Mains GS IV",
    stage: "mains",
    subject: "Ethics, Integrity & Aptitude",
    node_type: "subject",
    weight: 1.3,
    estimated_study_hours: 95,
    order_index: 4,
    topics: [
      {
        id: "mains.gs4.theory",
        title: "Ethics & Human Interface, Attitude",
        subtopics: [
          { id: "m-gs4-1", title: "Ethics in Public and Private Relationships, Consequences of Ethics", weight: 1.1, estimated_hours: 5 },
          { id: "m-gs4-2", title: "Attitude: Content, Structure, Function, Moral & Political Attitudes", weight: 1.0, estimated_hours: 5 },
          { id: "m-gs4-3", title: "Emotional Intelligence: Concepts, Utilities & Applications in Administration", weight: 1.2, estimated_hours: 6 },
          { id: "m-gs4-4", title: "Contributions of Moral Thinkers and Philosophers from India and World", weight: 1.2, estimated_hours: 6 }
        ]
      },
      {
        id: "mains.gs4.case_studies",
        title: "Probity in Governance & Case Studies",
        subtopics: [
          { id: "m-gs4-5", title: "Public/Civil Service Values and Ethics in Public Administration", weight: 1.2, estimated_hours: 6 },
          { id: "m-gs4-6", title: "Ethical Concerns and Dilemmas in Government and Private Institutions", weight: 1.3, estimated_hours: 7 },
          { id: "m-gs4-7", title: "Case Studies on Administrative Dilemmas, Corruption & Public Grievances", weight: 1.4, estimated_hours: 10 }
        ]
      }
    ]
  },
  {
    id: "mains.qualifying.language",
    paper: "Qualifying Paper A",
    stage: "mains",
    subject: "Compulsory Indian Language (Qualifying)",
    node_type: "subject",
    weight: 0.8,
    estimated_study_hours: 35,
    order_index: 5,
    topics: [
      {
        id: "mains.qual.lang.comprehension",
        title: "Reading Comprehension & Precis Writing",
        subtopics: [
          { id: "m-qlang-1", title: "Comprehension of Given Passages in Chosen Indian Language", weight: 1.0, estimated_hours: 4 },
          { id: "m-qlang-2", title: "Precis Writing & Condensation Skills", weight: 1.0, estimated_hours: 4 }
        ]
      },
      {
        id: "mains.qual.lang.expression",
        title: "Essay, Usage & Translation",
        subtopics: [
          { id: "m-qlang-3", title: "Short Essay Writing & Advanced Idiomatic Vocabulary", weight: 1.0, estimated_hours: 4 },
          { id: "m-qlang-4", title: "Translation: English to Chosen Indian Language and vice-versa", weight: 1.1, estimated_hours: 5 }
        ]
      }
    ]
  },
  {
    id: "mains.qualifying.english",
    paper: "Qualifying Paper B",
    stage: "mains",
    subject: "English Language (Qualifying)",
    node_type: "subject",
    weight: 0.8,
    estimated_study_hours: 35,
    order_index: 6,
    topics: [
      {
        id: "mains.qual.eng.comprehension",
        title: "Reading Comprehension & Precis Writing",
        subtopics: [
          { id: "m-qeng-1", title: "Comprehension of Advanced English Prose Passages", weight: 1.0, estimated_hours: 4 },
          { id: "m-qeng-2", title: "Precis Writing (Summarizing Passages into One-Third Length)", weight: 1.0, estimated_hours: 4 }
        ]
      },
      {
        id: "mains.qual.eng.grammar",
        title: "Short Essay, Usage & Grammar",
        subtopics: [
          { id: "m-qeng-3", title: "Short Essay Formulation & Structural Clarity", weight: 1.0, estimated_hours: 4 },
          { id: "m-qeng-4", title: "Applied Grammar: Active/Passive, Direct/Indirect, Idioms & Prepositions", weight: 1.1, estimated_hours: 5 }
        ]
      }
    ]
  }
];
