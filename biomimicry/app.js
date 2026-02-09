/* ===================================================================
   Biomimicry Foundations  --  Curated Reference Hub
   =================================================================== */

const SECTIONS = [

/* ---------------------------------------------------------------
   1. OVERVIEW  --  Introduction to Biomimicry
   --------------------------------------------------------------- */
{
  id: "overview",
  icon: "☘",
  label: "Overview",
  intro: `
    <p>
      <strong>Biomimicry</strong> is the practice of learning from and emulating
      nature's time-tested strategies to solve human design challenges. Coined and
      popularized by biologist <em>Janine Benyus</em> in her landmark 1997 book
      <em>Biomimicry: Innovation Inspired by Nature</em>, the field rests on
      a simple but profound insight: life has been solving engineering problems
      for 3.8 billion years, and the survivors hold the answers.
    </p>
    <p>Key premises of the biomimicry worldview:</p>
    <ul>
      <li><strong>Nature as Model</strong> &mdash; biological organisms and ecosystems offer blueprints for energy-efficient, waste-free, resilient designs.</li>
      <li><strong>Nature as Measure</strong> &mdash; after 3.8 billion years of evolution, nature provides the ultimate standard for sustainability.</li>
      <li><strong>Nature as Mentor</strong> &mdash; biomimicry shifts the human relationship with the natural world from extraction to apprenticeship.</li>
    </ul>
    <p>
      From self-cleaning surfaces inspired by lotus leaves to buildings cooled
      like termite mounds, biomimicry is now applied across architecture, medicine,
      materials science, agriculture, and urban planning. The resources below
      provide a comprehensive starting point.
    </p>`,
  subsections: [
    {
      title: "Foundational Texts",
      items: [
        {
          title: "Biomimicry: Innovation Inspired by Nature",
          author: "Janine M. Benyus",
          type: "book",
          level: "beginner",
          url: "https://www.harpercollins.com/products/biomimicry-janine-m-benyus",
          desc: "The seminal 1997 book that launched the modern biomimicry movement, exploring how nature's designs can inspire human innovation across energy, food, medicine, and manufacturing."
        },
        {
          title: "Biomimicry Resource Handbook: A Seed Bank of Best Practices",
          author: "Dayna Baumeister",
          type: "book",
          level: "intermediate",
          url: "https://biomimicry.net/the-buzz/resources/biomimicry-resource-handbook/",
          desc: "A 300-page practitioner's guide covering biomimicry thinking, methodology, and tools. The definitive companion for applying Life's Principles to real design work."
        },
        {
          title: "The Gecko's Foot: Bio-Inspiration -- Engineering New Materials from Nature",
          author: "Peter Forbes",
          type: "book",
          level: "beginner",
          url: "https://wwnorton.com/books/The-Geckos-Foot/",
          desc: "An accessible account of how nature's nano-scale engineering -- from lotus leaves to gecko feet -- is inspiring a new generation of smart materials."
        },
        {
          title: "The Shark's Paintbrush: Biomimicry and How Nature Is Inspiring Innovation",
          author: "Jay Harman",
          type: "book",
          level: "beginner",
          url: "https://www.penguinrandomhouse.com/books/312796/the-sharks-paintbrush-by-jay-harman/",
          desc: "Inventor Jay Harman explores how spiral geometries and other natural patterns are being translated into breakthrough industrial designs."
        }
      ]
    },
    {
      title: "Introductory Courses",
      items: [
        {
          title: "Biomimicry's Surprising Lessons from Nature's Engineers (TED Talk)",
          author: "Janine Benyus",
          type: "video",
          level: "beginner",
          url: "https://www.ted.com/talks/janine_benyus_biomimicry_s_surprising_lessons_from_nature_s_engineers",
          desc: "Benyus's foundational TED talk introducing the biomimicry concept with vivid examples of nature-inspired engineering."
        },
        {
          title: "Biomimicry in Action (TED Talk)",
          author: "Janine Benyus",
          type: "video",
          level: "beginner",
          url: "https://www.ted.com/talks/janine_benyus_biomimicry_in_action",
          desc: "A follow-up talk revealing dozens of new products and systems that take their cue from nature with spectacular results."
        },
        {
          title: "Introduction to Biomimicry (NPTEL / IIT Madras)",
          author: "IIT Madras via SWAYAM",
          type: "course",
          level: "beginner",
          url: "https://www.classcentral.com/course/swayam-introduction-to-biomimicry-91688",
          desc: "A free online course from IIT Madras covering biomimicry fundamentals, from tree-leaf solar cells to sharkskin antibacterial surfaces."
        },
        {
          title: "Biomimicry: A Sustainable Design Methodology",
          author: "Minneapolis College of Art and Design",
          type: "course",
          level: "beginner",
          url: "https://www.classcentral.com/course/canvas-network-biomimicry-a-sustainable-design-methodology-3259",
          desc: "Students explore nature weekly and develop novel biomimetic designs using the biomimicry design spiral."
        }
      ]
    },
    {
      title: "Cross-Disciplinary Resources",
      items: [
        {
          title: "Biomimicry as a Sustainable Design Methodology -- Introducing the 'Biomimicry for Sustainability' Framework",
          author: "Katharina Helms et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.3390/su14095biomimicry",
          desc: "A peer-reviewed paper synthesizing biomimicry literature across architecture, philosophy, sustainability, and design into a unified framework."
        },
        {
          title: "Biomimicry Institute -- What Is Biomimicry?",
          author: "The Biomimicry Institute",
          type: "notes",
          level: "beginner",
          url: "https://biomimicry.org/what-is-biomimicry/",
          desc: "The Biomimicry Institute's official primer on the discipline, with introductory definitions, examples, and links to deeper resources."
        },
        {
          title: "Nature's Unifying Patterns -- Biomimicry Toolbox",
          author: "The Biomimicry Institute",
          type: "notes",
          level: "beginner",
          url: "https://toolbox.biomimicry.org/core-concepts/natures-unifying-patterns/",
          desc: "An overview of the ten deep patterns found across all living systems, forming the conceptual foundation of biomimicry practice."
        },
        {
          title: "Biomimetics: Nature-Based Innovation (Routledge Handbook)",
          author: "Yoseph Bar-Cohen (ed.)",
          type: "book",
          level: "advanced",
          url: "https://www.routledge.com/Biomimetics-Nature-Based-Innovation/Bar-Cohen/p/book/9781439834763",
          desc: "A comprehensive reference covering the full breadth of biomimetics -- from robotics and materials to medical devices and artificial intelligence."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   2. METHODOLOGY  --  The Biomimicry Design Process
   --------------------------------------------------------------- */
{
  id: "methodology",
  icon: "◈",
  label: "Methodology",
  intro: `
    <p>
      Biomimicry methodology provides structured pathways for translating biological
      insights into human design solutions. The field recognizes two primary approaches:
      <strong>Biology-to-Design</strong> (a biological discovery inspires a new solution) and
      <strong>Design-to-Biology</strong> (a design challenge drives the search for natural models).
    </p>
    <p>The <strong>Biomimicry DesignLens</strong>, developed by Biomimicry 3.8, organizes
    the process into four phases:</p>
    <ul>
      <li><strong>Scoping</strong> &mdash; define the design challenge in functional, context-rich terms that translate to biology.</li>
      <li><strong>Discovering</strong> &mdash; research biological strategies that address the identified function.</li>
      <li><strong>Creating</strong> &mdash; abstract biological principles and brainstorm design concepts.</li>
      <li><strong>Evaluating</strong> &mdash; measure designs against Life's Principles as a sustainability benchmark.</li>
    </ul>
    <p>
      These phases are not strictly linear; teams iterate between them, using
      Life's Principles as a compass. The resources below span frameworks,
      research methods, and real-world case studies that demonstrate the process.
    </p>`,
  subsections: [
    {
      title: "Design Frameworks",
      items: [
        {
          title: "DesignLens: Biomimicry Thinking",
          author: "Biomimicry 3.8",
          type: "notes",
          level: "intermediate",
          url: "https://biomimicry.net/the-buzz/resources/designlens-biomimicry-thinking/",
          desc: "The official DesignLens visual framework showing Biology-to-Design and Design-to-Biology pathways with the four-phase process."
        },
        {
          title: "DesignLens: Life's Principles",
          author: "Biomimicry 3.8",
          type: "notes",
          level: "intermediate",
          url: "https://biomimicry.net/the-buzz/resources/designlens-lifes-principles/",
          desc: "A visual diagram of the 27 strategies all life on Earth uses to create conditions conducive to life, serving as the evaluation benchmark."
        },
        {
          title: "The Biomimicry Design Process -- Biomimicry Toolbox",
          author: "The Biomimicry Institute",
          type: "notes",
          level: "beginner",
          url: "https://toolbox.biomimicry.org/methods/process/",
          desc: "A step-by-step walkthrough of the six-step Biomimicry Design Spiral with downloadable exercises and worksheets."
        },
        {
          title: "A Design Process Framework and Tools for Teaching and Practicing Biomimicry",
          author: "Jacquelyn K. S. Nagel et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.3390/biomimetics9010050",
          desc: "A peer-reviewed article presenting a pedagogical framework for integrating biomimicry into engineering design curricula."
        }
      ]
    },
    {
      title: "Research Methods",
      items: [
        {
          title: "Discover Biological Strategies -- Biomimicry Toolbox",
          author: "The Biomimicry Institute",
          type: "notes",
          level: "intermediate",
          url: "https://toolbox.biomimicry.org/methods/discover/",
          desc: "Guidance on translating design functions into biological search terms and using databases like AskNature to find relevant strategies."
        },
        {
          title: "Biologically Inspired Design: Computational Methods and Tools",
          author: "Ashok K. Goel et al. (eds.)",
          type: "book",
          level: "advanced",
          url: "https://link.springer.com/book/10.1007/978-1-4471-5248-4",
          desc: "An edited volume covering computational approaches to biomimetic design, including the AskNature database and AI-driven biological analogy retrieval."
        },
        {
          title: "Biomimicry Design Frameworks for Nature-Inspired Innovation",
          author: "Learn Biomimicry",
          type: "notes",
          level: "intermediate",
          url: "https://www.learnbiomimicry.com/blog/biomimicry-design-frameworks",
          desc: "A comparative overview of the major biomimicry design frameworks, including the Design Spiral, BioTRIZ, and Dane and colleagues' four-box method."
        }
      ]
    },
    {
      title: "Case Study Collections",
      items: [
        {
          title: "AskNature -- Innovation Inspired by Nature",
          author: "The Biomimicry Institute",
          type: "data",
          level: "beginner",
          url: "https://asknature.org/",
          desc: "The largest free database of biological strategies for sustainable innovation, with over 1,600 articles organized by function."
        },
        {
          title: "Biomimicry in Architecture: A Review of Definitions, Case Studies, and Design Methods",
          author: "Natasha Chayaamor-Heil et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.3390/biomimetics8010107",
          desc: "A systematic survey of biomimicry in architecture covering terminologies, classification systems, and methodological frameworks with extensive case studies."
        },
        {
          title: "Biomimicry Innovation Toolkit: Sustainable Packaging",
          author: "Biomimicry 3.8",
          type: "notes",
          level: "intermediate",
          url: "https://biomimicry.net/the-buzz/resources/biomimicry-innovation-toolkit-sustainable-packaging/",
          desc: "A worked example applying the biomimicry design process to sustainable packaging, demonstrating each phase from scoping to evaluation."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   3. ORGANISMS  --  Biology Fundamentals for Biomimics
   --------------------------------------------------------------- */
{
  id: "organisms",
  icon: "◉",
  label: "Organisms",
  intro: `
    <p>
      Effective biomimicry requires a working knowledge of biology &mdash; not just
      catalogues of clever organisms, but an understanding of <em>why</em> organisms
      are shaped the way they are. This section covers the biological sciences most
      relevant to biomimics: evolutionary theory explains how organisms arrive at
      strategies; functional morphology reveals how structure serves function; and
      organism databases provide the raw material for bio-inspired design.
    </p>
    <ul>
      <li><strong>Evolutionary Biology</strong> &mdash; natural selection, adaptation, convergent evolution, and the constraints that channel biological innovation.</li>
      <li><strong>Functional Morphology</strong> &mdash; the study of the relationship between the form of an organism and the functions it performs, from fluid dynamics to structural mechanics.</li>
      <li><strong>Organism Databases</strong> &mdash; curated collections of biological strategies, species information, and field guides that serve as the biomimics' reference library.</li>
    </ul>
    <p>
      Understanding these fundamentals allows designers to move beyond superficial imitation
      toward the deep, principled emulation that defines rigorous biomimicry practice.
    </p>`,
  subsections: [
    {
      title: "Evolutionary Biology",
      items: [
        {
          title: "The Blind Watchmaker: Why the Evidence of Evolution Reveals a Universe Without Design",
          author: "Richard Dawkins",
          type: "book",
          level: "beginner",
          url: "https://wwnorton.com/books/The-Blind-Watchmaker/",
          desc: "A classic introduction to evolutionary theory that explains how natural selection produces complex, functional biological designs without a designer."
        },
        {
          title: "On Growth and Form",
          author: "D'Arcy Wentworth Thompson",
          type: "book",
          level: "advanced",
          url: "https://doi.org/10.1017/CBO9781107325852",
          desc: "The pioneering 1917 work arguing that physical forces and mathematical laws, alongside natural selection, shape biological form. A foundational text for biomimicry."
        },
        {
          title: "The Extended Phenotype: The Long Reach of the Gene",
          author: "Richard Dawkins",
          type: "book",
          level: "advanced",
          url: "https://global.oup.com/academic/product/the-extended-phenotype-9780198788911",
          desc: "Dawkins expands the concept of the phenotype beyond the organism to include structures like beaver dams and termite mounds -- key precedents for biomimicry."
        },
        {
          title: "Convergent Evolution: Limited Forms Most Beautiful",
          author: "George McGhee",
          type: "book",
          level: "intermediate",
          url: "https://mitpress.mit.edu/9780262016421/convergent-evolution/",
          desc: "An exploration of how unrelated species independently evolve similar solutions, demonstrating that nature's design space has reliable, repeatable patterns."
        }
      ]
    },
    {
      title: "Functional Morphology",
      items: [
        {
          title: "Comparative Biomechanics: Life's Physical World (2nd Edition)",
          author: "Steven Vogel",
          type: "book",
          level: "intermediate",
          url: "https://press.princeton.edu/books/hardcover/9780691155661/comparative-biomechanics",
          desc: "The definitive textbook on biological mechanics covering fluid dynamics, structural engineering, and material properties across the living world."
        },
        {
          title: "Cat's Paws and Catapults: Mechanical Worlds of Nature and People",
          author: "Steven Vogel",
          type: "book",
          level: "beginner",
          url: "https://wwnorton.com/books/Cats-Paws-and-Catapults/",
          desc: "Vogel compares biological and human-engineered mechanical systems, revealing why nature and technology have diverged and what each can learn from the other."
        },
        {
          title: "Structural Biomaterials (3rd Edition)",
          author: "Julian F. V. Vincent",
          type: "book",
          level: "advanced",
          url: "https://press.princeton.edu/books/paperback/9780691154008/structural-biomaterials",
          desc: "A molecular-to-macro analysis of biological structural materials -- silk, bone, wood, cuticle -- and what they teach about engineering better synthetics."
        },
        {
          title: "Life's Devices: The Physical World of Animals and Plants",
          author: "Steven Vogel",
          type: "book",
          level: "intermediate",
          url: "https://press.princeton.edu/books/paperback/9780691024189/lifes-devices",
          desc: "An engaging introduction to biomechanics showing how organisms interact with the physical forces of gravity, drag, and surface tension."
        }
      ]
    },
    {
      title: "Organism Databases & Field Guides",
      items: [
        {
          title: "AskNature -- Biological Strategies",
          author: "The Biomimicry Institute",
          type: "data",
          level: "beginner",
          url: "https://asknature.org/biological-strategies/",
          desc: "Over 1,600 biological strategy articles organized by function -- the primary search tool for finding natural models relevant to a design challenge."
        },
        {
          title: "Encyclopedia of Life (EOL)",
          author: "Smithsonian / EOL Consortium",
          type: "data",
          level: "beginner",
          url: "https://eol.org/",
          desc: "An open-access encyclopedia of species providing taxonomy, images, distribution maps, and ecological information for over 1.9 million species."
        },
        {
          title: "Tree of Life Web Project",
          author: "University of Arizona",
          type: "data",
          level: "intermediate",
          url: "http://tolweb.org/tree/",
          desc: "An interactive phylogenetic tree providing information about the diversity and evolutionary relationships of all life on Earth."
        },
        {
          title: "iNaturalist",
          author: "California Academy of Sciences / National Geographic",
          type: "data",
          level: "beginner",
          url: "https://www.inaturalist.org/",
          desc: "A citizen-science platform with millions of species observations; an invaluable field tool for biomimics studying organisms in their natural context."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   4. ECOSYSTEMS  --  Ecosystem-Level Biomimicry
   --------------------------------------------------------------- */
{
  id: "ecosystems",
  icon: "∿",
  label: "Ecosystems",
  intro: `
    <p>
      While organism-level biomimicry asks <em>"how does this creature solve a problem?"</em>,
      ecosystem-level biomimicry asks <em>"how does this community of organisms create
      conditions conducive to life?"</em> Ecosystems model the ultimate circular economies:
      waste equals food, energy flows from the sun, diversity ensures resilience, and
      feedback loops maintain dynamic equilibrium.
    </p>
    <ul>
      <li><strong>Nutrient Cycling</strong> &mdash; ecosystems produce no waste; the output of one process is the input of another.</li>
      <li><strong>Symbiosis &amp; Mutualism</strong> &mdash; organisms cooperate across species boundaries, forming networks that increase the fitness of the whole.</li>
      <li><strong>Resilience &amp; Self-Organization</strong> &mdash; ecosystems absorb disturbance and reorganize while retaining essential structure and function.</li>
      <li><strong>Succession</strong> &mdash; ecosystems develop and mature over time, moving toward increasing complexity and resource efficiency.</li>
    </ul>
    <p>
      These principles inform biomimicry at the systems level, guiding the design of
      industrial ecosystems, regenerative agriculture, circular supply chains, and
      resilient cities.
    </p>`,
  subsections: [
    {
      title: "Ecosystem Ecology",
      items: [
        {
          title: "Thinking in Systems: A Primer",
          author: "Donella H. Meadows",
          type: "book",
          level: "beginner",
          url: "https://www.chelseagreen.com/product/thinking-in-systems/",
          desc: "The essential introduction to systems thinking, explaining feedback loops, leverage points, and emergent behavior -- foundational concepts for ecosystem-level biomimicry."
        },
        {
          title: "The Ecology of Commerce: A Declaration of Sustainability",
          author: "Paul Hawken",
          type: "book",
          level: "beginner",
          url: "https://www.harpercollins.com/products/the-ecology-of-commerce-revised-edition-paul-hawken",
          desc: "Hawken argues that business can model itself on ecosystems, where waste equals food and energy flows from the sun, laying groundwork for industrial ecology."
        },
        {
          title: "Cradle to Cradle: Remaking the Way We Make Things",
          author: "William McDonough & Michael Braungart",
          type: "book",
          level: "beginner",
          url: "https://mcdonough.com/cradle-to-cradle/",
          desc: "A manifesto for designing products and systems that mimic nature's nutrient cycles, eliminating the concept of waste entirely."
        },
        {
          title: "The Systems View -- Biomimicry Toolbox",
          author: "The Biomimicry Institute",
          type: "notes",
          level: "intermediate",
          url: "https://toolbox.biomimicry.org/core-concepts/systems/",
          desc: "An introduction to viewing design challenges through an ecosystem lens, with guidance on identifying systemic functions and relationships."
        }
      ]
    },
    {
      title: "Symbiosis & Mutualism",
      items: [
        {
          title: "The Hidden Life of Trees: What They Feel, How They Communicate",
          author: "Peter Wohlleben",
          type: "book",
          level: "beginner",
          url: "https://www.greystone books.com/products/the-hidden-life-of-trees",
          desc: "A forester reveals how trees communicate and share resources through mycorrhizal networks -- the 'wood wide web' -- demonstrating ecosystem-level cooperation."
        },
        {
          title: "The Symbiotic Planet: A New Look at Evolution",
          author: "Lynn Margulis",
          type: "book",
          level: "intermediate",
          url: "https://www.hachettebookgroup.com/titles/lynn-margulis/symbiotic-planet/9780465072729/",
          desc: "Margulis presents symbiosis as a major driver of evolutionary innovation, arguing that cooperation is as fundamental as competition in shaping life."
        },
        {
          title: "Entangled Life: How Fungi Make Our Worlds, Change Our Minds & Shape Our Futures",
          author: "Merlin Sheldrake",
          type: "book",
          level: "beginner",
          url: "https://www.penguinrandomhouse.com/books/612710/entangled-life-by-merlin-sheldrake/",
          desc: "An exploration of the fungal kingdom and its role in ecosystems, from mycorrhizal networks to decomposition -- rich with biomimicry inspiration."
        },
        {
          title: "Suzanne Simard: How Trees Talk to Each Other (TED Talk)",
          author: "Suzanne Simard",
          type: "video",
          level: "beginner",
          url: "https://www.ted.com/talks/suzanne_simard_how_trees_talk_to_each_other",
          desc: "Forest ecologist Suzanne Simard explains her discovery of underground fungal networks connecting trees, with implications for resilient network design."
        }
      ]
    },
    {
      title: "Resilience & Adaptation",
      items: [
        {
          title: "Resilience Thinking: Sustaining Ecosystems and People in a Changing World",
          author: "Brian Walker & David Salt",
          type: "book",
          level: "intermediate",
          url: "https://islandpress.org/books/resilience-thinking",
          desc: "An accessible introduction to resilience science, explaining adaptive cycles, thresholds, and panarchy -- essential concepts for systems-level biomimicry."
        },
        {
          title: "Panarchy: Understanding Transformations in Human and Natural Systems",
          author: "Lance Gunderson & C. S. Holling (eds.)",
          type: "book",
          level: "advanced",
          url: "https://islandpress.org/books/panarchy",
          desc: "The foundational text on panarchy theory, describing how nested adaptive cycles at different scales create resilient systems."
        },
        {
          title: "Eric Berlow: Simplifying Complexity (TED Talk)",
          author: "Eric Berlow",
          type: "video",
          level: "beginner",
          url: "https://www.ted.com/talks/eric_berlow_simplifying_complexity",
          desc: "Ecologist Eric Berlow demonstrates how stepping back to see more of a complex system can actually make it simpler to understand and act upon."
        },
        {
          title: "Application of Biomimetics to Architectural and Urban Design: A Review across Scales",
          author: "Maria Teresa Villanueva et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.3390/su122399813",
          desc: "A review of 107 papers examining how ecosystem-level principles of resilience and adaptation are applied in urban design and architecture."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   5. APPLICATIONS  --  Real-World Biomimicry
   --------------------------------------------------------------- */
{
  id: "applications",
  icon: "⊕",
  label: "Applications",
  intro: `
    <p>
      Biomimicry's real power is demonstrated in application. From the Eastgate Centre
      in Harare (passively cooled like a termite mound) to Sharklet antibacterial surfaces
      (mimicking shark skin micro-textures), nature-inspired designs are delivering
      measurable improvements in efficiency, sustainability, and performance.
    </p>
    <p>Key application domains include:</p>
    <ul>
      <li><strong>Architecture &amp; Built Environment</strong> &mdash; self-cooling buildings, structural optimization inspired by bone and coral, responsive facades.</li>
      <li><strong>Medicine &amp; Healthcare</strong> &mdash; gecko-inspired adhesives, sharkskin antimicrobials, needle-free injections modeled on mosquito proboscises.</li>
      <li><strong>Energy &amp; Water</strong> &mdash; wind turbines shaped by whale flippers, fog-harvesting surfaces inspired by Namib Desert beetles, solar cells mimicking photosynthesis.</li>
    </ul>
    <p>
      Each application demonstrates a core principle: the deeper the biological understanding,
      the more effective and elegant the resulting design.
    </p>`,
  subsections: [
    {
      title: "Architecture & Built Environment",
      items: [
        {
          title: "Biomimicry in Architecture (3rd Edition)",
          author: "Michael Pawlyn",
          type: "book",
          level: "intermediate",
          url: "https://www.routledge.com/Biomimicry-in-Architecture/Pawlyn/p/book/9781915722683",
          desc: "RIBA's best-selling international title covering structural efficiency, closed-loop systems, and energy strategies inspired by living organisms."
        },
        {
          title: "Using Nature's Genius in Architecture (TED Talk)",
          author: "Michael Pawlyn",
          type: "video",
          level: "beginner",
          url: "https://www.ted.com/talks/michael_pawlyn_using_nature_s_genius_in_architecture",
          desc: "Architect Michael Pawlyn describes three habits of nature -- radical resource efficiency, closed loops, and solar energy -- that can transform architecture."
        },
        {
          title: "Passively Cooled Building Inspired by Termite Mounds (Eastgate Centre)",
          author: "AskNature / Mick Pearce",
          type: "notes",
          level: "beginner",
          url: "https://asknature.org/innovation/passively-cooled-building-inspired-by-termite-mounds/",
          desc: "A case study of the Eastgate Centre in Harare, Zimbabwe, which uses 35% less energy than conventional buildings by emulating termite-mound ventilation."
        },
        {
          title: "Applications of Biomimicry in Architecture, Construction and Civil Engineering",
          author: "Negin Imani et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.3390/biomimetics8010062",
          desc: "A comprehensive review of biomimetic strategies in the built environment, covering sustainable materials, energy-efficient designs, and waste reduction."
        }
      ]
    },
    {
      title: "Medicine & Healthcare",
      items: [
        {
          title: "Gecko-Inspired Controllable Adhesive: Structure, Fabrication, and Application",
          author: "Various (PMC Review)",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.3390/biomimetics9030159",
          desc: "A review of gecko-inspired adhesive technologies, from fundamental van der Waals mechanics to medical bandages that grip in wet environments."
        },
        {
          title: "MIT Creates Gecko-Inspired Bandage",
          author: "MIT News Office",
          type: "notes",
          level: "intermediate",
          url: "https://news.mit.edu/2008/adhesive-0218",
          desc: "MIT engineers developed a waterproof, biodegradable surgical bandage inspired by gecko foot nanoscale structures that adheres to wet tissue."
        },
        {
          title: "Shark-Inspired Biomimicry and Infection Prevention Technology",
          author: "Sharklet Technologies / TEDxMileHigh",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=BB2Z_QaA2wg",
          desc: "How shark skin's micro-texture inspired Sharklet, a surface pattern that reduces bacterial colonization by up to 97% without chemicals."
        },
        {
          title: "Bioinspired Surfaces and Applications (Nature Reviews Materials)",
          author: "Ke Liu et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/natrevmats.2016.36",
          desc: "A comprehensive review in Nature Reviews Materials covering lotus-effect self-cleaning, gecko adhesion, and other bio-inspired surface technologies."
        }
      ]
    },
    {
      title: "Energy & Water Systems",
      items: [
        {
          title: "Tubercle Effect: Whale-Inspired Wind Turbines",
          author: "AskNature / WhalePower",
          type: "notes",
          level: "intermediate",
          url: "https://asknature.org/innovation/wind-turbines-increase-efficiency/",
          desc: "Humpback whale flipper tubercles inspired wind turbine blade designs that increase efficiency and reduce stall, based on research by Frank Fish."
        },
        {
          title: "Fog Collection Inspired by Namib Desert Beetle",
          author: "AskNature",
          type: "notes",
          level: "beginner",
          url: "https://asknature.org/strategy/water-vapor-harvesting/",
          desc: "The Namib Desert beetle's hydrophilic bumps and hydrophobic troughs inspire fog-harvesting surfaces for water collection in arid regions."
        },
        {
          title: "Sahara Forest Project",
          author: "Sahara Forest Project Foundation",
          type: "notes",
          level: "intermediate",
          url: "https://www.saharaforestproject.com/",
          desc: "A biomimicry-driven initiative combining concentrated solar power and seawater greenhouses to create sustainable energy and agriculture in desert environments."
        },
        {
          title: "Biomimicry and Renewable Energy: Nature-Inspired Solutions",
          author: "Various Authors",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.3390/en15030935",
          desc: "A review of bio-inspired approaches to renewable energy including artificial photosynthesis, bio-inspired solar cells, and nature-inspired turbine designs."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   6. EDUCATION  --  Teaching and Learning Biomimicry
   --------------------------------------------------------------- */
{
  id: "education",
  icon: "△",
  label: "Education",
  intro: `
    <p>
      The biomimicry field has grown from a handful of practitioners in the late 1990s
      to a global community supported by university degree programs, professional
      certifications, K&ndash;12 curricula, and public engagement initiatives. Education
      is central to the field's mission: if biomimicry is to scale, every designer,
      engineer, and policy maker needs biological literacy.
    </p>
    <ul>
      <li><strong>University Programs</strong> &mdash; Arizona State University offers the world's only M.S. in Biomimicry; other universities integrate it into design and biology programs.</li>
      <li><strong>Professional Training</strong> &mdash; Biomimicry 3.8 offers Certified Biomimicry Professional and Specialist certifications combining online coursework with immersive workshops.</li>
      <li><strong>K&ndash;12 &amp; Public Engagement</strong> &mdash; The Biomimicry Youth Design Challenge, museum programs, and citizen-science platforms bring biomimicry to young learners and the general public.</li>
    </ul>
    <p>
      Whether you are an educator seeking curricula, a professional pursuing certification,
      or a lifelong learner exploring the field, these resources provide structured pathways.
    </p>`,
  subsections: [
    {
      title: "University Programs & Courses",
      items: [
        {
          title: "Master of Science in Biomimicry -- Arizona State University (Online)",
          author: "ASU College of Global Futures",
          type: "course",
          level: "advanced",
          url: "https://asuonline.asu.edu/online-degree-programs/graduate/master-science-biomimicry/",
          desc: "The world's only M.S. in Biomimicry, delivered fully online in partnership with Biomimicry 3.8. A two-year program for working professionals."
        },
        {
          title: "Graduate Certificate in Biomimicry -- Arizona State University",
          author: "ASU Biomimicry Center",
          type: "course",
          level: "intermediate",
          url: "https://globalfutures.asu.edu/biomimicry-center/asu-online-certificate-program/",
          desc: "A shorter ASU credential covering biomimicry fundamentals, design methodology, and Life's Principles for professionals seeking targeted training."
        },
        {
          title: "Advanced Creative Thinking and AI: Tools for Success (Biomimicry Module)",
          author: "Imperial College London via Coursera",
          type: "course",
          level: "intermediate",
          url: "https://www.coursera.org/learn/advanced-creative-thinking",
          desc: "A Coursera course from Imperial College London featuring a dedicated week exploring biomimicry principles and case studies."
        },
        {
          title: "Discover Biology on Coursera -- Biomimicry Institute Recommendation",
          author: "The Biomimicry Institute",
          type: "course",
          level: "beginner",
          url: "https://biomimicry.org/discover-biology-on-coursera/",
          desc: "The Biomimicry Institute's curated list of Coursera biology courses recommended as prerequisites for biomimicry practice."
        }
      ]
    },
    {
      title: "Professional Training",
      items: [
        {
          title: "Biomimicry Professional Certification Program",
          author: "Biomimicry 3.8 / ASU",
          type: "course",
          level: "advanced",
          url: "https://biomimicry.net/what-we-do/professional-training/b-professional-certification/",
          desc: "Combines ASU online coursework with in-person immersion workshops led by Dayna Baumeister, earning the Certified Biomimicry Professional designation."
        },
        {
          title: "Biomimicry Specialist Certification",
          author: "Biomimicry 3.8 / ASU",
          type: "course",
          level: "intermediate",
          url: "https://biomimicry.net/what-we-do/professional-training/b-professional-certification/",
          desc: "A certification pathway combining online study with immersive field workshops, designed for professionals integrating biomimicry into their existing practice."
        },
        {
          title: "Learn Biomimicry -- Short Courses",
          author: "Learn Biomimicry",
          type: "course",
          level: "beginner",
          url: "https://www.learnbiomimicry.com/short-courses",
          desc: "Self-paced online short courses introducing biomimicry concepts, design methods, and Life's Principles for beginners and professionals."
        },
        {
          title: "The Top Biomimicry Courses and Certificates of 2025",
          author: "Learn Biomimicry",
          type: "notes",
          level: "beginner",
          url: "https://www.learnbiomimicry.com/blog/top-biomimicry-courses",
          desc: "A comprehensive comparison of all available biomimicry courses and certificates, helping learners choose the right path."
        }
      ]
    },
    {
      title: "K-12 & Public Engagement",
      items: [
        {
          title: "Biomimicry Youth Design Challenge",
          author: "The Biomimicry Institute",
          type: "course",
          level: "beginner",
          url: "https://www.youthchallenge.biomimicry.org/",
          desc: "A free, project-based learning challenge for grades 6-12 aligned with NGSS standards, asking students to design bio-inspired solutions to real-world problems."
        },
        {
          title: "Youth Design Challenge -- Full Legacy Curriculum",
          author: "The Biomimicry Institute",
          type: "notes",
          level: "beginner",
          url: "https://www.youthchallenge.biomimicry.org/challenge-details",
          desc: "Downloadable curriculum materials for educators, covering the biomimicry design process from problem identification to prototype evaluation."
        },
        {
          title: "Biomimicry -- Ideas Worth Spreading (TED Topic Page)",
          author: "TED",
          type: "video",
          level: "beginner",
          url: "https://www.ted.com/topics/biomimicry",
          desc: "TED's curated collection of biomimicry talks spanning architecture, materials, robotics, and sustainability -- ideal for classroom use."
        },
        {
          title: "iNaturalist -- Citizen Science for Biomimics",
          author: "California Academy of Sciences / National Geographic",
          type: "data",
          level: "beginner",
          url: "https://www.inaturalist.org/",
          desc: "A citizen-science platform where students and the public can observe, identify, and record species -- building the biological literacy that biomimicry demands."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   7. TOOLS  --  Digital Tools, Databases & Organizations
   --------------------------------------------------------------- */
{
  id: "tools",
  icon: "⬡",
  label: "Tools",
  intro: `
    <p>
      The practice of biomimicry is supported by a growing ecosystem of digital tools,
      databases, and organizations. The <strong>Biomimicry Institute</strong> maintains
      <a href="https://asknature.org/">AskNature</a>, the world's largest free database
      of biological strategies. <strong>Biomimicry 3.8</strong> develops training programs
      and consulting frameworks. A constellation of regional networks, academic centers,
      and software tools extends the field's reach.
    </p>
    <ul>
      <li><strong>Databases &amp; Platforms</strong> &mdash; AskNature, the Biomimicry Toolbox, and species databases that power biological research.</li>
      <li><strong>Organizations &amp; Networks</strong> &mdash; the Biomimicry Institute, Biomimicry 3.8, regional networks, and academic centers driving the field forward.</li>
      <li><strong>Software &amp; Simulation</strong> &mdash; computational tools for biomimetic design, from topology optimization to evolutionary algorithms.</li>
    </ul>
    <p>
      These tools lower the barrier to entry, enabling designers without deep biological
      training to find, understand, and apply nature's strategies.
    </p>`,
  subsections: [
    {
      title: "Databases & Platforms",
      items: [
        {
          title: "AskNature",
          author: "The Biomimicry Institute",
          type: "data",
          level: "beginner",
          url: "https://asknature.org/",
          desc: "The world's largest free, open-source database of biological strategies organized by function, with over 1,600 articles and bio-inspired innovation case studies."
        },
        {
          title: "Biomimicry Design Toolbox",
          author: "The Biomimicry Institute",
          type: "data",
          level: "intermediate",
          url: "https://toolbox.biomimicry.org/",
          desc: "A comprehensive guide to applying biomimicry with downloadable exercises, worksheets, and a step-by-step design process."
        },
        {
          title: "Global Biotic Interactions (GloBI)",
          author: "Jorrit Poelen et al.",
          type: "data",
          level: "advanced",
          url: "https://www.globalbioticinteractions.org/",
          desc: "An open dataset of species interaction records -- who eats whom, who pollinates whom -- providing ecosystem-level data for biomimicry research."
        },
        {
          title: "GBIF -- Global Biodiversity Information Facility",
          author: "GBIF Secretariat",
          type: "data",
          level: "intermediate",
          url: "https://www.gbif.org/",
          desc: "An international open-data infrastructure providing access to over 2 billion species occurrence records from around the world."
        }
      ]
    },
    {
      title: "Organizations & Networks",
      items: [
        {
          title: "The Biomimicry Institute",
          author: "Biomimicry Institute",
          type: "notes",
          level: "beginner",
          url: "https://biomimicry.org/",
          desc: "The leading 501(c)(3) nonprofit advancing biomimicry through AskNature, the Youth Design Challenge, the Global Design Challenge, and public education."
        },
        {
          title: "Biomimicry 3.8",
          author: "Biomimicry 3.8",
          type: "notes",
          level: "intermediate",
          url: "https://biomimicry.net/",
          desc: "The world's leading biomimicry consultancy, co-founded by Janine Benyus and Dayna Baumeister, offering professional training and corporate consulting."
        },
        {
          title: "The Biomimicry Center at Arizona State University",
          author: "ASU College of Global Futures",
          type: "notes",
          level: "intermediate",
          url: "https://globalfutures.asu.edu/biomimicry-center/",
          desc: "ASU's academic center housing the M.S. program, research initiatives, and partnerships bridging biology and design."
        },
        {
          title: "Exploration Architecture (Michael Pawlyn)",
          author: "Exploration Architecture Ltd.",
          type: "notes",
          level: "intermediate",
          url: "https://www.exploration-architecture.com/",
          desc: "Michael Pawlyn's architecture practice specializing in biomimicry, responsible for the Sahara Forest Project and other landmark bio-inspired designs."
        }
      ]
    },
    {
      title: "Software & Simulation",
      items: [
        {
          title: "MIT Biomimetic Robotics Lab -- GitHub Repositories",
          author: "MIT Biomimetic Robotics Lab",
          type: "code",
          level: "advanced",
          url: "https://github.com/mit-biomimetics",
          desc: "Open-source repositories from MIT's biomimetic robotics lab, including controllers for legged locomotion inspired by animal movement."
        },
        {
          title: "AskNature Biomimicry Design Assistant (Open-Source)",
          author: "mjdyibrahim",
          type: "code",
          level: "intermediate",
          url: "https://github.com/mjdyibrahim/askNature",
          desc: "An open-source biomimicry design assistant built on the AskNature dataset, using AI to help users find biological strategies for design challenges."
        },
        {
          title: "OpenFOAM -- Computational Fluid Dynamics",
          author: "OpenFOAM Foundation",
          type: "code",
          level: "advanced",
          url: "https://www.openfoam.com/",
          desc: "The leading open-source CFD toolkit used for simulating bio-inspired fluid dynamics -- from fish locomotion to ventilation systems modeled on termite mounds."
        },
        {
          title: "Biomimetics on GitHub Topics",
          author: "GitHub Community",
          type: "code",
          level: "intermediate",
          url: "https://github.com/topics/biomimetics",
          desc: "A curated collection of GitHub repositories tagged with biomimetics, spanning evolutionary computation, robotics, and 3D printing applications."
        }
      ]
    }
  ]
}

]; /* end SECTIONS */


/* ===================================================================
   rendering engine
   =================================================================== */
const tabBar = document.getElementById("tab-bar");
const mainEl = document.getElementById("main-content");
const searchIn = document.getElementById("search-input");
const searchClr = document.getElementById("search-clear");
const statCount = document.getElementById("stat-count");
let activeTab = SECTIONS[0].id;
let activeFilter = "all";
let searchQuery = "";
const totalResources = SECTIONS.reduce((n, s) => n + s.subsections.reduce((m, sub) => m + sub.items.length, 0), 0);
statCount.textContent = totalResources;
function buildTabs() {
  tabBar.innerHTML = "";
  SECTIONS.forEach(sec => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (sec.id === activeTab ? " active" : "");
    btn.innerHTML = `<span class="tab-icon">${sec.icon}</span><span class="tab-label">${sec.label}</span>`;
    btn.onclick = () => { activeTab = sec.id; activeFilter = "all"; render(); };
    tabBar.appendChild(btn);
  });
}
function hl(text, q) {
  if (!q) return text;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${esc})`, "gi"), "<mark>$1</mark>");
}
function render() {
  buildTabs();
  const sec = SECTIONS.find(s => s.id === activeTab);
  if (!sec) return;
  const types = new Set();
  sec.subsections.forEach(sub => sub.items.forEach(it => types.add(it.type)));
  let html = `<div class="section-header"><h2><span class="section-icon">${sec.icon}</span>${sec.label}</h2></div>`;
  html += `<div class="section-intro">${sec.intro}</div>`;
  html += `<div class="filter-bar">`;
  html += `<button class="filter-btn${activeFilter === "all" ? " active" : ""}" data-filter="all">All</button>`;
  types.forEach(t => {
    html += `<button class="filter-btn${activeFilter === t ? " active" : ""}" data-filter="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</button>`;
  });
  html += `</div>`;
  sec.subsections.forEach(sub => {
    const filtered = sub.items.filter(it => {
      if (activeFilter !== "all" && it.type !== activeFilter) return false;
      if (searchQuery) {
        const hay = (it.title + " " + it.author + " " + it.desc).toLowerCase();
        return hay.includes(searchQuery);
      }
      return true;
    });
    if (filtered.length === 0) return;
    html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
    filtered.forEach(it => {
      html += `
        <a class="card" href="${it.url}" target="_blank" rel="noopener">
          <div class="card-top">
            <span class="type-badge badge-${it.type}">${it.type}</span>
            <span class="level-badge level-${it.level}">${it.level}</span>
          </div>
          <div class="card-title">${hl(it.title, searchQuery)}</div>
          <div class="card-author">${hl(it.author, searchQuery)}</div>
          <div class="card-desc">${hl(it.desc, searchQuery)}</div>
        </a>`;
    });
    html += `</div></div>`;
  });
  mainEl.innerHTML = html;
  mainEl.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => { activeFilter = btn.dataset.filter; render(); });
  });
}
searchIn.addEventListener("input", () => { searchQuery = searchIn.value.trim().toLowerCase(); render(); });
searchClr.addEventListener("click", () => { searchIn.value = ""; searchQuery = ""; render(); });
render();
