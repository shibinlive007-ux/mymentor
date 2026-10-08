import type { SubjectNode } from '@/types/syllabus';

export const OPTIONALS_SUBJECTS_SEED: SubjectNode[] = [
  // 1. Agriculture
  {
    id: "optional.agriculture",
    optional_code: "AGRICULTURE",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Agriculture Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 10,
    topics: [
      {
        id: "opt.agri.paper1",
        title: "Paper 1: Ecology, Agronomy, Weed Science, Forestry & Soil Conservation",
        subtopics: [
          { id: "opt-agri-1", title: "Agro-Ecology, Cropping Systems & Sustainable Agriculture", weight: 1.2, estimated_hours: 8 },
          { id: "opt-agri-2", title: "Soil Physical & Chemical Properties, Nutrient Management & Soil Conservation", weight: 1.1, estimated_hours: 7 },
          { id: "opt-agri-3", title: "Weed Biology, Integrated Weed Management & Farm Management Economics", weight: 1.0, estimated_hours: 6 },
        ],
      },
      {
        id: "opt.agri.paper2",
        title: "Paper 2: Genetics, Plant Breeding, Seed Tech, Physiology & Horticulture",
        subtopics: [
          { id: "opt-agri-4", title: "Plant Genetics, Cytogenetics, Hybrid Breeding & Molecular Markers", weight: 1.2, estimated_hours: 8 },
          { id: "opt-agri-5", title: "Plant Physiology: Photosynthesis, Respiration & Post-Harvest Technology", weight: 1.1, estimated_hours: 7 },
        ],
      },
    ],
  },

  // 2. Animal Husbandry & Veterinary Science
  {
    id: "optional.animal_husbandry",
    optional_code: "ANIMAL_HUSBANDRY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Animal Husbandry & Veterinary Science Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 11,
    topics: [
      {
        id: "opt.ahvs.paper1",
        title: "Paper 1: Animal Nutrition, Physiology, Reproduction & Genetics",
        subtopics: [
          { id: "opt-ahvs-1", title: "Animal Nutrition: Digestibility, Ruminant Metabolism & Feed Formulation", weight: 1.2, estimated_hours: 8 },
          { id: "opt-ahvs-2", title: "Genetics, Animal Breeding, Semen Preservation & Artificial Insemination", weight: 1.1, estimated_hours: 7 },
        ],
      },
      {
        id: "opt.ahvs.paper2",
        title: "Paper 2: Veterinary Pathology, Pharmacology, Surgery & Milk Hygiene",
        subtopics: [
          { id: "opt-ahvs-3", title: "Pathology of Infectious Livestock Diseases & Veterinary Public Health", weight: 1.2, estimated_hours: 8 },
          { id: "opt-ahvs-4", title: "Meat and Milk Technology, Zoonotic Disease Surveillance & Legislation", weight: 1.0, estimated_hours: 6 },
        ],
      },
    ],
  },

  // 3. Anthropology
  {
    id: "optional.anthropology",
    optional_code: "ANTHROPOLOGY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Anthropology Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 12,
    topics: [
      {
        id: "opt.anth.paper1",
        title: "Paper 1: Socio-Cultural, Biological & Archaeological Anthropology",
        subtopics: [
          { id: "opt-anth-1", title: "Human Evolution, Fossil Hominids, Primatology & Genetics", weight: 1.2, estimated_hours: 8 },
          { id: "opt-anth-2", title: "Theories of Culture: Evolutionism, Functionalism, Structuralism, Post-Modernism", weight: 1.2, estimated_hours: 8 },
          { id: "opt-anth-3", title: "Marriage, Family, Kinship Systems & Economic/Political Anthropology", weight: 1.0, estimated_hours: 6 },
        ],
      },
      {
        id: "opt.anth.paper2",
        title: "Paper 2: Indian Culture, Caste System & Tribal India",
        subtopics: [
          { id: "opt-anth-4", title: "Evolution of Indian Culture: Indus Valley to Great Tradition & Little Tradition", weight: 1.1, estimated_hours: 7 },
          { id: "opt-anth-5", title: "Tribal Problems: Land Alienation, Displacement, Forest Rights & Fifth/Sixth Schedule", weight: 1.3, estimated_hours: 9 },
        ],
      },
    ],
  },

  // 4. Botany
  {
    id: "optional.botany",
    optional_code: "BOTANY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Botany Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 13,
    topics: [
      {
        id: "opt.bot.paper1",
        title: "Paper 1: Microbiology, Cryptogams, Phanerogams, Morphogenesis",
        subtopics: [
          { id: "opt-bot-1", title: "Microbiology, Plant Pathology, Algae, Fungi, Bryophytes & Pteridophytes", weight: 1.2, estimated_hours: 8 },
          { id: "opt-bot-2", title: "Gymnosperms, Angiosperm Taxonomy, Anatomy & Embryology", weight: 1.1, estimated_hours: 7 },
        ],
      },
      {
        id: "opt.bot.paper2",
        title: "Paper 2: Cell Biology, Genetics, Plant Physiology & Ecology",
        subtopics: [
          { id: "opt-bot-3", title: "Cell Structure, Molecular Genetics, Epigenetics & Plant Biotechnology", weight: 1.2, estimated_hours: 8 },
          { id: "opt-bot-4", title: "Plant Physiology: Water Relations, Nitrogen Fixation & Photosynthesis", weight: 1.1, estimated_hours: 7 },
        ],
      },
    ],
  },

  // 5. Chemistry
  {
    id: "optional.chemistry",
    optional_code: "CHEMISTRY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Chemistry Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 150,
    order_index: 14,
    topics: [
      {
        id: "opt.chem.paper1",
        title: "Paper 1: Physical & Inorganic Chemistry",
        subtopics: [
          { id: "opt-chem-1", title: "Quantum Chemistry, Chemical Bonding & Thermodynamics", weight: 1.2, estimated_hours: 9 },
          { id: "opt-chem-2", title: "Coordination Chemistry, Bioinorganic Chemistry & Solid State", weight: 1.1, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.chem.paper2",
        title: "Paper 2: Organic Chemistry & Spectroscopy",
        subtopics: [
          { id: "opt-chem-3", title: "Reaction Mechanisms: Substitution, Elimination, Rearrangements & Pericyclic", weight: 1.3, estimated_hours: 9 },
          { id: "opt-chem-4", title: "Spectroscopic Techniques (UV-Vis, IR, NMR, Mass) & Synthetic Reagents", weight: 1.1, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 6. Civil Engineering
  {
    id: "optional.civil_eng",
    optional_code: "CIVIL_ENGINEERING",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Civil Engineering Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 150,
    order_index: 15,
    topics: [
      {
        id: "opt.ce.paper1",
        title: "Paper 1: Structural Engineering, Concrete & Geotechnical",
        subtopics: [
          { id: "opt-ce-1", title: "Strength of Materials, Structural Analysis & Steel Design", weight: 1.2, estimated_hours: 9 },
          { id: "opt-ce-2", title: "Soil Mechanics, Shallow/Deep Foundations & Retaining Walls", weight: 1.1, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.ce.paper2",
        title: "Paper 2: Fluid Mechanics, Hydrology & Transportation",
        subtopics: [
          { id: "opt-ce-3", title: "Fluid Mechanics, Open Channel Flow, Hydrology & Irrigation Engineering", weight: 1.2, estimated_hours: 9 },
          { id: "opt-ce-4", title: "Highway Geometric Design, Traffic Engineering & Environmental Wastewater", weight: 1.1, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 7. Commerce & Accountancy
  {
    id: "optional.commerce",
    optional_code: "COMMERCE",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Commerce & Accountancy Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 145,
    order_index: 16,
    topics: [
      {
        id: "opt.comm.paper1",
        title: "Paper 1: Accounting, Costing, Taxation & Financial Management",
        subtopics: [
          { id: "opt-comm-1", title: "Corporate Accounting, IND-AS, Cost Accounting & Auditing Standards", weight: 1.2, estimated_hours: 9 },
          { id: "opt-comm-2", title: "Financial Management: Capital Budgeting, Cost of Capital & Taxation Laws", weight: 1.2, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.comm.paper2",
        title: "Paper 2: Organization Theory, Behavior & Industrial Relations",
        subtopics: [
          { id: "opt-comm-3", title: "Organization Theory, Leadership Models & Human Resource Management", weight: 1.1, estimated_hours: 7 },
          { id: "opt-comm-4", title: "Industrial Relations, Labor Welfare & Dispute Resolution Framework", weight: 1.0, estimated_hours: 6 },
        ],
      },
    ],
  },

  // 8. Economics
  {
    id: "optional.economics",
    optional_code: "ECONOMICS",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Economics Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 150,
    order_index: 17,
    topics: [
      {
        id: "opt.econ.paper1",
        title: "Paper 1: Advanced Micro/Macro Economics, Trade & Public Finance",
        subtopics: [
          { id: "opt-econ-1", title: "Microeconomics (Consumer Choice, Market Forms) & Macro Frameworks (IS-LM, Growth Models)", weight: 1.3, estimated_hours: 9 },
          { id: "opt-econ-2", title: "International Trade Theories, Balance of Payments & Public Finance", weight: 1.1, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.econ.paper2",
        title: "Paper 2: Indian Economy - Pre & Post 1991 Reform Trajectory",
        subtopics: [
          { id: "opt-econ-3", title: "Colonial Drain of Wealth to Planning Era, Agriculture & Industry Reforms", weight: 1.1, estimated_hours: 8 },
          { id: "opt-econ-4", title: "Fiscal Federalism, Financial Sector, Trade Agreements & Employment Dynamics", weight: 1.2, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 9. Electrical Engineering
  {
    id: "optional.electrical_eng",
    optional_code: "ELECTRICAL_ENGINEERING",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Electrical Engineering Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 150,
    order_index: 18,
    topics: [
      {
        id: "opt.ee.paper1",
        title: "Paper 1: Circuits, Electromagnetic Fields & Electrical Machines",
        subtopics: [
          { id: "opt-ee-1", title: "Circuit Analysis, Network Theorems & Electromagnetic Field Theory", weight: 1.2, estimated_hours: 8 },
          { id: "opt-ee-2", title: "Transformers, Synchronous Machines, DC/Induction Motors & Measurement", weight: 1.2, estimated_hours: 9 },
        ],
      },
      {
        id: "opt.ee.paper2",
        title: "Paper 2: Control Systems, Power Systems & Digital Electronics",
        subtopics: [
          { id: "opt-ee-3", title: "Control Systems (State Space, Nyquist, Bode) & Microprocessors (8085/8086)", weight: 1.2, estimated_hours: 8 },
          { id: "opt-ee-4", title: "Power Systems: Load Flow, Fault Analysis, Protection & Power Electronics", weight: 1.2, estimated_hours: 9 },
        ],
      },
    ],
  },

  // 10. Geography
  {
    id: "optional.geography",
    optional_code: "GEOGRAPHY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Geography Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 150,
    order_index: 19,
    topics: [
      {
        id: "opt.geo.principles",
        title: "Paper 1: Principles of Geography",
        subtopics: [
          { id: "opt-geo-1", title: "Geomorphology: Slopes, Cycles of Erosion (Davis & Penck), Channel Morphology", weight: 1.2, estimated_hours: 8 },
          { id: "opt-geo-2", title: "Climatology: Koppen & Thornthwaite Classifications, Hydrological Cycle", weight: 1.1, estimated_hours: 7 },
          { id: "opt-geo-3", title: "Human Geography: Models, Theories and Laws in Human Geography", weight: 1.2, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.geo.india",
        title: "Paper 2: Geography of India",
        subtopics: [
          { id: "opt-geo-4", title: "Physical Setting, Resources, Agriculture, Industry & Regional Development", weight: 1.1, estimated_hours: 9 },
          { id: "opt-geo-5", title: "Contemporary Issues: Environmental Hazards, Border Area Development", weight: 1.0, estimated_hours: 6 },
        ],
      },
    ],
  },

  // 11. Geology
  {
    id: "optional.geology",
    optional_code: "GEOLOGY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Geology Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 20,
    topics: [
      {
        id: "opt.geol.paper1",
        title: "Paper 1: Geomorphology, Remote Sensing, Structural Geology & Paleontology",
        subtopics: [
          { id: "opt-geol-1", title: "Geomorphology, Aerial Photography, Remote Sensing & Geographic Info Systems", weight: 1.1, estimated_hours: 7 },
          { id: "opt-geol-2", title: "Structural Geology, Plate Tectonics, Stratigraphy of India & Paleontology", weight: 1.2, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.geol.paper2",
        title: "Paper 2: Mineralogy, Igneous/Metamorphic Petrology & Economic Geology",
        subtopics: [
          { id: "opt-geol-3", title: "Crystallography, Mineral Chemistry & Igneous/Metamorphic Petrogenesis", weight: 1.2, estimated_hours: 8 },
          { id: "opt-geol-4", title: "Economic Geology: Ore Genesis, Mineral Fuels & Groundwater Hydrology", weight: 1.1, estimated_hours: 7 },
        ],
      },
    ],
  },

  // 12. History
  {
    id: "optional.history",
    optional_code: "HISTORY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "History Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 155,
    order_index: 21,
    topics: [
      {
        id: "opt.hist.paper1",
        title: "Paper 1: Ancient & Medieval India (Archaeological & Literary Evidence)",
        subtopics: [
          { id: "opt-hist-1", title: "Early Indian Societies, Harappa, Vedic Culture, Mauryan State & Golden Age", weight: 1.2, estimated_hours: 9 },
          { id: "opt-hist-2", title: "Delhi Sultanate, Vijayanagar Empire, Mughal Agrarian Economy & Regional States", weight: 1.2, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.hist.paper2",
        title: "Paper 2: Modern India & World History",
        subtopics: [
          { id: "opt-hist-3", title: "British Colonial Rule, Drain of Wealth, 1857 Revolt & National Movement", weight: 1.2, estimated_hours: 9 },
          { id: "opt-hist-4", title: "World History: Enlightenment, American/French Revolutions, World Wars & Cold War", weight: 1.2, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 13. Law
  {
    id: "optional.law",
    optional_code: "LAW",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Law Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 145,
    order_index: 22,
    topics: [
      {
        id: "opt.law.paper1",
        title: "Paper 1: Constitutional Law, Administrative Law & International Law",
        subtopics: [
          { id: "opt-law-1", title: "Constitutional Governance, Fundamental Rights, Judicial Review & Emergency Powers", weight: 1.3, estimated_hours: 9 },
          { id: "opt-law-2", title: "Public International Law: Sources, Recognition, State Jurisdiction & Treaties", weight: 1.1, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.law.paper2",
        title: "Paper 2: Law of Crimes, Torts, Contracts & Mercantile Law",
        subtopics: [
          { id: "opt-law-3", title: "Law of Crimes (General Principles, Mens Rea, Homicide) & Law of Torts", weight: 1.2, estimated_hours: 8 },
          { id: "opt-law-4", title: "Law of Contracts, Sale of Goods, Consumer Protection & Cyber Laws", weight: 1.1, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 14. Management
  {
    id: "optional.management",
    optional_code: "MANAGEMENT",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Management Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 23,
    topics: [
      {
        id: "opt.mgmt.paper1",
        title: "Paper 1: Managerial Economics, OB, Operations Research & Marketing",
        subtopics: [
          { id: "opt-mgmt-1", title: "Managerial Economics, Quantitative Optimization & Financial Accounting", weight: 1.1, estimated_hours: 8 },
          { id: "opt-mgmt-2", title: "Marketing Management: Customer Segmentation, Brand Positioning & Digital Channels", weight: 1.1, estimated_hours: 7 },
        ],
      },
      {
        id: "opt.mgmt.paper2",
        title: "Paper 2: Strategic Management, Operations, HRM & Global Strategy",
        subtopics: [
          { id: "opt-mgmt-3", title: "Strategic Formulation, Porter Models, Corporate Restructuring & Governance", weight: 1.2, estimated_hours: 8 },
          { id: "opt-mgmt-4", title: "Operations Planning, Supply Chain Agility & Human Resource Development", weight: 1.1, estimated_hours: 7 },
        ],
      },
    ],
  },

  // 15. Mathematics
  {
    id: "optional.mathematics",
    optional_code: "MATHEMATICS",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Mathematics Optional",
    node_type: "subject",
    weight: 1.3,
    estimated_study_hours: 160,
    order_index: 24,
    topics: [
      {
        id: "opt.math.paper1",
        title: "Paper 1: Linear Algebra, Calculus, 3D Geometry, ODE & Mechanics",
        subtopics: [
          { id: "opt-math-1", title: "Linear Algebra (Matrices, Eigenvalues, Jordan Canonical) & Vector Analysis", weight: 1.3, estimated_hours: 10 },
          { id: "opt-math-2", title: "Ordinary Differential Equations, Analytical 3D Geometry & Statics/Dynamics", weight: 1.2, estimated_hours: 9 },
        ],
      },
      {
        id: "opt.math.paper2",
        title: "Paper 2: Modern Algebra, Real/Complex Analysis, PDE & Numerical Methods",
        subtopics: [
          { id: "opt-math-3", title: "Abstract Algebra (Groups, Rings, Fields) & Real/Complex Analysis", weight: 1.3, estimated_hours: 10 },
          { id: "opt-math-4", title: "Partial Differential Equations, Mechanics, Fluid Dynamics & Linear Programming", weight: 1.2, estimated_hours: 9 },
        ],
      },
    ],
  },

  // 16. Mechanical Engineering
  {
    id: "optional.mechanical_eng",
    optional_code: "MECHANICAL_ENGINEERING",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Mechanical Engineering Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 150,
    order_index: 25,
    topics: [
      {
        id: "opt.me.paper1",
        title: "Paper 1: Theory of Machines, Mechanics of Solids & Manufacturing",
        subtopics: [
          { id: "opt-me-1", title: "Mechanics of Materials, Design of Machine Elements & Kinematic Linkages", weight: 1.2, estimated_hours: 9 },
          { id: "opt-me-2", title: "Manufacturing Processes, CNC Machining, Metrology & Industrial Engineering", weight: 1.1, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.me.paper2",
        title: "Paper 2: Thermodynamics, Heat Transfer & Power Plants",
        subtopics: [
          { id: "opt-me-3", title: "Applied Thermodynamics, IC Engines, Gas Turbines & Rankine Cycles", weight: 1.2, estimated_hours: 9 },
          { id: "opt-me-4", title: "Heat Transfer (Conduction, Convection, Radiation) & Refrigeration Systems", weight: 1.1, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 17. Medical Science
  {
    id: "optional.medical_science",
    optional_code: "MEDICAL_SCIENCE",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Medical Science Optional",
    node_type: "subject",
    weight: 1.3,
    estimated_study_hours: 155,
    order_index: 26,
    topics: [
      {
        id: "opt.med.paper1",
        title: "Paper 1: Anatomy, Physiology, Biochemistry, Pathology & Pharmacology",
        subtopics: [
          { id: "opt-med-1", title: "Gross Human Anatomy, Embryology, Neuroanatomy & Medical Physiology", weight: 1.2, estimated_hours: 9 },
          { id: "opt-med-2", title: "Clinical Biochemistry, General Pathology, Microbiology & Pharmacology", weight: 1.2, estimated_hours: 9 },
        ],
      },
      {
        id: "opt.med.paper2",
        title: "Paper 2: General Medicine, Pediatrics, Surgery, OBG & Community Medicine",
        subtopics: [
          { id: "opt-med-3", title: "Internal Medicine, Infectious Diseases, Emergency Care & Pediatrics", weight: 1.3, estimated_hours: 9 },
          { id: "opt-med-4", title: "General Surgery, Obstetrics and Gynecology & National Health Programs", weight: 1.2, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 18. Philosophy
  {
    id: "optional.philosophy",
    optional_code: "PHILOSOPHY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Philosophy Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 27,
    topics: [
      {
        id: "opt.phil.paper1",
        title: "Paper 1: Western Philosophy & Classical Indian Philosophy",
        subtopics: [
          { id: "opt-phil-1", title: "Western Thinkers: Plato, Descartes, Spinoza, Locke, Kant, Hegel, Wittgenstein", weight: 1.2, estimated_hours: 8 },
          { id: "opt-phil-2", title: "Indian Schools: Nyaya, Vaisesika, Samkhya, Yoga, Mimamsa, Vedanta, Carvaka, Jaina, Bauddha", weight: 1.2, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.phil.paper2",
        title: "Paper 2: Socio-Political Philosophy & Philosophy of Religion",
        subtopics: [
          { id: "opt-phil-3", title: "Socio-Political Ideals: Equality, Justice, Liberty, Sovereignty & Humanism", weight: 1.1, estimated_hours: 7 },
          { id: "opt-phil-4", title: "Philosophy of Religion: God's Attributes, Problem of Evil, Faith vs Reason", weight: 1.1, estimated_hours: 7 },
        ],
      },
    ],
  },

  // 19. Physics
  {
    id: "optional.physics",
    optional_code: "PHYSICS",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Physics Optional",
    node_type: "subject",
    weight: 1.3,
    estimated_study_hours: 160,
    order_index: 28,
    topics: [
      {
        id: "opt.phy.paper1",
        title: "Paper 1: Classical Mechanics, Optics, Thermodynamics & Electrodynamics",
        subtopics: [
          { id: "opt-phy-1", title: "Lagrangian/Hamiltonian Dynamics, Special Relativity & Wave Optics", weight: 1.3, estimated_hours: 9 },
          { id: "opt-phy-2", title: "Electrodynamics, Maxwell Equations, Statistical Mechanics & Blackbody", weight: 1.2, estimated_hours: 9 },
        ],
      },
      {
        id: "opt.phy.paper2",
        title: "Paper 2: Quantum Mechanics, Atomic/Molecular & Nuclear/Solid State",
        subtopics: [
          { id: "opt-phy-3", title: "Schrodinger Wave Equation, Tunneling, Zeeman Effect & Laser Physics", weight: 1.3, estimated_hours: 9 },
          { id: "opt-phy-4", title: "Nuclear Models, Particle Physics, Band Theory of Solids & Semiconductor Devices", weight: 1.2, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 20. Political Science & International Relations (PSIR)
  {
    id: "optional.psir",
    optional_code: "PSIR",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Political Science & International Relations (PSIR)",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 150,
    order_index: 29,
    topics: [
      {
        id: "opt.psir.theory",
        title: "Paper 1: Political Theory & Indian Politics",
        subtopics: [
          { id: "opt-psir-1", title: "Western Political Thought: Plato, Aristotle, Machiavelli, Hobbes, Locke, Marx, Gramsci", weight: 1.2, estimated_hours: 8 },
          { id: "opt-psir-2", title: "Indian Political Thought: Kautilya, Gandhi, Ambedkar, MN Roy", weight: 1.1, estimated_hours: 6 },
          { id: "opt-psir-3", title: "Indian Nationalism, Constitutionalism & Grassroots Democracy", weight: 1.0, estimated_hours: 6 },
        ],
      },
      {
        id: "opt.psir.ir",
        title: "Paper 2: Comparative Politics & International Relations",
        subtopics: [
          { id: "opt-psir-4", title: "Theories of IR: Realism, Liberalism, Constructivism & Feminist Perspectives", weight: 1.2, estimated_hours: 8 },
          { id: "opt-psir-5", title: "India and the World Order: Nuclear Doctrine, NAM 2.0 & Global South", weight: 1.2, estimated_hours: 7 },
        ],
      },
    ],
  },

  // 21. Psychology
  {
    id: "optional.psychology",
    optional_code: "PSYCHOLOGY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Psychology Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 30,
    topics: [
      {
        id: "opt.psych.paper1",
        title: "Paper 1: Foundations of Psychology",
        subtopics: [
          { id: "opt-psych-1", title: "Research Methods, Sensation, Perception, Learning Principles & Memory Models", weight: 1.2, estimated_hours: 8 },
          { id: "opt-psych-2", title: "Cognition, Motivation, Emotion, Personality Theories & Psychological Testing", weight: 1.2, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.psych.paper2",
        title: "Paper 2: Issues and Applied Psychology",
        subtopics: [
          { id: "opt-psych-3", title: "Psychological Wellbeing, Mental Disorders, Psychotherapy & Stress Management", weight: 1.1, estimated_hours: 7 },
          { id: "opt-psych-4", title: "Organizational Psychology, Community Mental Health & Military/Sports Applications", weight: 1.1, estimated_hours: 7 },
        ],
      },
    ],
  },

  // 22. Public Administration
  {
    id: "optional.pubad",
    optional_code: "PUBLIC_ADMINISTRATION",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Public Administration Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 145,
    order_index: 31,
    topics: [
      {
        id: "opt.pubad.paper1",
        title: "Paper 1: Administrative Theory & Public Policy",
        subtopics: [
          { id: "opt-pubad-1", title: "Administrative Thinkers: Taylor, Fayol, Weber, Follett, Simon, Riggs, Likert", weight: 1.3, estimated_hours: 9 },
          { id: "opt-pubad-2", title: "Public Policy Formulation, Implementation, Accountability & New Public Governance", weight: 1.1, estimated_hours: 7 },
        ],
      },
      {
        id: "opt.pubad.paper2",
        title: "Paper 2: Indian Administration - Structure & Reforms",
        subtopics: [
          { id: "opt-pubad-3", title: "Evolution of Indian Administration, Union Executive & Federal Coordination", weight: 1.2, estimated_hours: 8 },
          { id: "opt-pubad-4", title: "District Administration, Local Governance, Citizen Interface & Administrative Reforms", weight: 1.2, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 23. Sociology
  {
    id: "optional.sociology",
    optional_code: "SOCIOLOGY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Sociology Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 32,
    topics: [
      {
        id: "opt.soc.fundamentals",
        title: "Paper 1: Fundamentals of Sociology",
        subtopics: [
          { id: "opt-soc-1", title: "Sociological Thinkers: Marx, Durkheim, Weber, Parsons, Merton, Mead", weight: 1.3, estimated_hours: 10 },
          { id: "opt-soc-2", title: "Stratification and Mobility: Concepts, Theories and Dimensions", weight: 1.1, estimated_hours: 7 },
        ],
      },
      {
        id: "opt.soc.india",
        title: "Paper 2: Indian Society - Structure and Change",
        subtopics: [
          { id: "opt-soc-3", title: "Perspectives on Indian Society: Indology (Ghurye), Structural Functionalism (Srinivas)", weight: 1.2, estimated_hours: 8 },
          { id: "opt-soc-4", title: "Caste System, Agrarian Social Structure & Social Movements in Modern India", weight: 1.1, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 24. Statistics
  {
    id: "optional.statistics",
    optional_code: "STATISTICS",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Statistics Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 145,
    order_index: 33,
    topics: [
      {
        id: "opt.stat.paper1",
        title: "Paper 1: Probability, Inference, Sampling & Design of Experiments",
        subtopics: [
          { id: "opt-stat-1", title: "Probability Distributions, Characteristic Functions & Statistical Estimation", weight: 1.2, estimated_hours: 8 },
          { id: "opt-stat-2", title: "Hypothesis Testing, Non-Parametric Tests, Sampling Techniques & ANOVA", weight: 1.2, estimated_hours: 8 },
        ],
      },
      {
        id: "opt.stat.paper2",
        title: "Paper 2: Industrial Statistics, Operations Research & Econometrics",
        subtopics: [
          { id: "opt-stat-3", title: "Statistical Quality Control, Reliability Theory & Optimization Techniques", weight: 1.1, estimated_hours: 7 },
          { id: "opt-stat-4", title: "Time Series Analysis, Econometric Modeling & Vital Statistics/Demography", weight: 1.1, estimated_hours: 7 },
        ],
      },
    ],
  },

  // 25. Zoology
  {
    id: "optional.zoology",
    optional_code: "ZOOLOGY",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Zoology Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 145,
    order_index: 34,
    topics: [
      {
        id: "opt.zoo.paper1",
        title: "Paper 1: Non-Chordata, Chordata, Ecology, Ethology & Biostatistics",
        subtopics: [
          { id: "opt-zoo-1", title: "Invertebrate & Vertebrate Systematics, Anatomy & Functional Adaptations", weight: 1.2, estimated_hours: 8 },
          { id: "opt-zoo-2", title: "Ecology, Animal Behavior, Economic Zoology (Apiculture, Sericulture) & Statistics", weight: 1.1, estimated_hours: 7 },
        ],
      },
      {
        id: "opt.zoo.paper2",
        title: "Paper 2: Cell Biology, Genetics, Evolution & Animal Physiology",
        subtopics: [
          { id: "opt-zoo-3", title: "Molecular Cell Biology, Mendelian/Human Genetics & Evolutionary Theories", weight: 1.2, estimated_hours: 8 },
          { id: "opt-zoo-4", title: "Comparative Animal Physiology, Endocrinology, Biochemistry & Immunology", weight: 1.2, estimated_hours: 8 },
        ],
      },
    ],
  },

  // 26. Literature
  {
    id: "optional.literature",
    optional_code: "LITERATURE",
    paper: "Optional Paper 1 & 2",
    stage: "optional",
    subject: "Literature of Indian Languages / English Optional",
    node_type: "subject",
    weight: 1.2,
    estimated_study_hours: 140,
    order_index: 35,
    topics: [
      {
        id: "opt.lit.paper1",
        title: "Paper 1: History of Language, Classical Works & Canonical Poetry",
        subtopics: [
          { id: "opt-lit-1", title: "Evolution of Language, Grammatical Foundations & Classical Poetic Traditions", weight: 1.2, estimated_hours: 8 },
          { id: "opt-lit-2", title: "Epic Literature, Medieval Devotional Poetry & Socio-Linguistic Context", weight: 1.1, estimated_hours: 7 },
        ],
      },
      {
        id: "opt.lit.paper2",
        title: "Paper 2: Modern Literature, Fiction, Drama & Literary Criticism",
        subtopics: [
          { id: "opt-lit-3", title: "Modern Novels, Short Stories, Dramatic Literature & Thematic Exploration", weight: 1.2, estimated_hours: 8 },
          { id: "opt-lit-4", title: "Literary Criticism, Modernist Movements & Cultural Identity in Literature", weight: 1.1, estimated_hours: 7 },
        ],
      },
    ],
  },
];
