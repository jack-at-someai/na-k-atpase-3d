/* ================================================================
   ECOLOGICAL SYSTEMS DESIGN — Curated Reference Hub
   Designing human systems that function like ecosystems:
   circular economies, industrial ecology, regenerative design,
   and cradle-to-cradle frameworks.
   ================================================================ */

const SECTIONS = [

  /* ──────────────────────────────────────────────────────────────
     1. OVERVIEW — Introduction to Ecological Systems Design
     ────────────────────────────────────────────────────────────── */
  {
    id: "overview",
    icon: "◈",
    label: "Overview",
    intro: `
      <p>Ecological systems design applies the organizing principles of natural
      ecosystems&mdash;nutrient cycling, symbiosis, resilience through diversity,
      and zero-waste metabolism&mdash;to the design of human-made systems. Rather
      than the linear &ldquo;take-make-dispose&rdquo; model that has dominated
      industrial economies since the 18th century, ecological design asks:
      <em>what if every output became an input?</em></p>
      <p>The field draws on decades of work in ecology, systems thinking, and
      sustainable engineering. Key premises include:</p>
      <ul>
        <li><strong>Waste equals food</strong> &mdash; In nature, the waste product
        of one organism is the nutrient for another. Industrial systems can be
        redesigned so that by-products flow into new production cycles.</li>
        <li><strong>Solar income</strong> &mdash; Natural ecosystems run on current
        solar energy rather than stored reserves. Ecological design seeks to power
        human systems from renewable flows.</li>
        <li><strong>Diversity builds resilience</strong> &mdash; Monocultures are
        fragile; diverse, interconnected systems absorb shocks and adapt to change.</li>
        <li><strong>Local adaptation</strong> &mdash; Ecosystems are finely tuned to
        their place. Human systems should be designed with sensitivity to local
        materials, climate, culture, and ecology.</li>
      </ul>
      <p>This section gathers foundational texts, review articles, and introductory
      courses that frame the discipline and its intellectual roots.</p>`,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          {
            title: "Design with Nature",
            author: "Ian McHarg",
            type: "book",
            level: "beginner",
            url: "https://www.wiley.com/en-us/Design+with+Nature-p-9780471114604",
            desc: "The landmark 1969 book that pioneered ecological land-use planning, arguing that natural processes should guide the design of human settlements and infrastructure."
          },
          {
            title: "Ecological Design",
            author: "Sim Van der Ryn & Stuart Cowan",
            type: "book",
            level: "beginner",
            url: "https://islandpress.org/books/ecological-design-tenth-anniversary-edition",
            desc: "A foundational guide that proposes five principles for integrating ecological thinking into design practice, from architecture to agriculture."
          },
          {
            title: "Biomimicry: Innovation Inspired by Nature",
            author: "Janine Benyus",
            type: "book",
            level: "beginner",
            url: "https://www.harpercollins.com/products/biomimicry-janine-m-benyus",
            desc: "Introduces biomimicry as a design discipline, showing how engineers and designers can emulate nature's time-tested patterns and strategies."
          },
          {
            title: "The Ecology of Commerce",
            author: "Paul Hawken",
            type: "book",
            level: "beginner",
            url: "https://www.harpercollins.com/products/the-ecology-of-commerce-revised-edition-paul-hawken",
            desc: "Argues that business and environmental interests are not opposed, proposing an industrial system modeled on biological metabolism."
          },
          {
            title: "Thinking in Systems: A Primer",
            author: "Donella Meadows",
            type: "book",
            level: "beginner",
            url: "https://www.chelseagreen.com/product/thinking-in-systems/",
            desc: "An accessible introduction to systems dynamics and feedback loops, providing the conceptual toolkit for understanding ecosystems and designing systemic interventions."
          }
        ]
      },
      {
        title: "Review Articles",
        items: [
          {
            title: "Industrial Ecology: Goals and Definitions",
            author: "Robert White",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/B978-0-08-052381-0.50005-4",
            desc: "An early overview that defines industrial ecology and maps its relationship to environmental science, engineering, and public policy."
          },
          {
            title: "A Review of the Circular Economy and its Implementation",
            author: "Guiltinan et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1111/jiec.12605",
            desc: "A comprehensive review examining circular economy definitions, conceptual frameworks, and barriers to implementation across sectors."
          },
          {
            title: "Regenerative Development and Design: A Framework for Evolving Sustainability",
            author: "Bill Reed",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1080/09613218.2007.9496515",
            desc: "Introduces the trajectory from green to sustainable to regenerative design, proposing a framework for human systems that co-evolve with living systems."
          },
          {
            title: "The Concept of Industrial Ecology: Origins and Future Directions",
            author: "Robert Frosch",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1162/jiec.1992.1.1.1",
            desc: "One of the seminal papers in the field, articulating the vision of industrial systems as analogues to biological ecosystems."
          }
        ]
      },
      {
        title: "Introductory Courses",
        items: [
          {
            title: "Circular Economy: An Introduction",
            author: "Delft University of Technology",
            type: "course",
            level: "beginner",
            url: "https://www.edx.org/learn/circular-economy/delft-university-of-technology-circular-economy-an-introduction",
            desc: "A free edX course covering the basics of circular economy thinking, from linear to circular business models, with real-world case studies."
          },
          {
            title: "Systems Thinking In Practice",
            author: "The Open University",
            type: "course",
            level: "beginner",
            url: "https://www.open.edu/openlearn/science-maths-technology/systems-thinking-and-practice/content-section-0",
            desc: "Free course on systems thinking fundamentals, teaching how to identify feedback loops, emergent properties, and leverage points in complex systems."
          },
          {
            title: "Biomimicry: A Beginner's Guide",
            author: "Biomimicry Institute",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=sf4oW8OtaPY",
            desc: "Janine Benyus introduces biomimicry and explains how designers and engineers can learn from 3.8 billion years of evolutionary R&D."
          },
          {
            title: "What is Industrial Ecology?",
            author: "Yale University",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=GKFYBjpraus",
            desc: "A concise introduction to the field from Yale's Center for Industrial Ecology, covering core concepts and research directions."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────
     2. CIRCULAR — Circular Economy
     ────────────────────────────────────────────────────────────── */
  {
    id: "circular",
    icon: "⊕",
    label: "Circular Economy",
    intro: `
      <p>The circular economy is an economic model that replaces the linear
      &ldquo;take-make-waste&rdquo; paradigm with closed-loop systems in which
      materials are continuously cycled at their highest value. Inspired by the
      metabolism of natural ecosystems, it distinguishes between two fundamental
      material cycles:</p>
      <ul>
        <li><strong>Biological cycle</strong> &mdash; Materials derived from living
        systems (wood, cotton, food) that can safely return to the biosphere through
        composting or anaerobic digestion.</li>
        <li><strong>Technical cycle</strong> &mdash; Synthetic and mineral materials
        (metals, polymers, alloys) that are maintained in circulation through reuse,
        repair, remanufacturing, and recycling.</li>
        <li><strong>Product-as-a-service</strong> &mdash; Business models where
        manufacturers retain ownership and customers pay for access, incentivizing
        durability and recyclability.</li>
        <li><strong>Design for disassembly</strong> &mdash; Products engineered so
        that components can be separated, repaired, and remanufactured at end of use.</li>
      </ul>
      <p>Championed by organizations such as the Ellen MacArthur Foundation, the
      circular economy has moved from academic concept to policy priority in the
      European Union, China, and beyond.</p>`,
    subsections: [
      {
        title: "Circular Economy Frameworks",
        items: [
          {
            title: "Towards the Circular Economy (Vol. 1)",
            author: "Ellen MacArthur Foundation",
            type: "notes",
            level: "beginner",
            url: "https://www.ellenmacarthurfoundation.org/towards-the-circular-economy-vol-1-an-economic-and-business-rationale-for-an",
            desc: "The foundational report that popularized the circular economy concept, laying out economic rationale and the butterfly diagram of biological and technical cycles."
          },
          {
            title: "Cradle to Cradle: Remaking the Way We Make Things",
            author: "William McDonough & Michael Braungart",
            type: "book",
            level: "beginner",
            url: "https://www.northpointpress.com/books/cradle-to-cradle/",
            desc: "The influential manifesto proposing that products be designed from the start for perpetual cycling, with no concept of waste."
          },
          {
            title: "The Circular Economy: A Wealth of Flows",
            author: "Ken Webster",
            type: "book",
            level: "intermediate",
            url: "https://www.ellenmacarthurfoundation.org/a-new-dynamic-2-effective-systems-in-a-circular-economy",
            desc: "A detailed exploration of circular economy theory drawing on systems thinking, complexity science, and real business cases."
          },
          {
            title: "Circular Economy: A Review of Definitions, Processes and Impacts",
            author: "Kirchherr, Reike & Hekkert",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.resconrec.2017.09.005",
            desc: "Analyzes 114 definitions of the circular economy, identifying core dimensions and common misconceptions in the literature."
          }
        ]
      },
      {
        title: "Business Model Innovation",
        items: [
          {
            title: "Business Model Generation",
            author: "Alexander Osterwalder & Yves Pigneur",
            type: "book",
            level: "beginner",
            url: "https://www.wiley.com/en-us/Business+Model+Generation-p-9780470876411",
            desc: "The business model canvas toolkit, widely used to prototype circular business models including product-as-service and sharing platforms."
          },
          {
            title: "The Circular Economy Business Model",
            author: "TU Delft (edX)",
            type: "course",
            level: "intermediate",
            url: "https://www.edx.org/learn/circular-economy/delft-university-of-technology-engineering-design-for-a-circular-economy",
            desc: "Explores how companies can redesign products and business models for circularity, with engineering case studies and design challenges."
          },
          {
            title: "Circular Business Models: Defining a Concept and Framing an Emerging Research Field",
            author: "Mentink",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.3390/su12114904",
            desc: "A systematic review that categorizes circular business model archetypes: access models, extending product value, and resource recovery."
          },
          {
            title: "Ellen MacArthur Foundation Case Studies",
            author: "Ellen MacArthur Foundation",
            type: "data",
            level: "beginner",
            url: "https://www.ellenmacarthurfoundation.org/topics/circular-economy-introduction/examples",
            desc: "A curated collection of real-world circular economy case studies from companies like Renault, Philips, and Interface."
          }
        ]
      },
      {
        title: "Policy & Implementation",
        items: [
          {
            title: "EU Circular Economy Action Plan",
            author: "European Commission",
            type: "notes",
            level: "intermediate",
            url: "https://environment.ec.europa.eu/strategy/circular-economy-action-plan_en",
            desc: "The official EU policy framework for transitioning to a circular economy, covering product design, waste reduction, and secondary raw materials."
          },
          {
            title: "Policies for the Circular Economy",
            author: "OECD",
            type: "notes",
            level: "advanced",
            url: "https://www.oecd.org/en/topics/sub-issues/circular-economy-and-resource-productivity.html",
            desc: "OECD analysis of policy instruments for circular economy transitions, including extended producer responsibility and green public procurement."
          },
          {
            title: "Circular Economy Practitioner Guide",
            author: "World Business Council for Sustainable Development",
            type: "notes",
            level: "intermediate",
            url: "https://www.ceguide.org/",
            desc: "A practical guide for businesses looking to implement circular economy strategies, with tools, frameworks, and step-by-step processes."
          },
          {
            title: "Circular Economy: Getting the Background Right",
            author: "Walter Stahel (TED Talk)",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=JMh9hDS0MKE",
            desc: "Walter Stahel, who coined the phrase 'cradle to cradle' in 1970s architecture, explains the performance economy and its circular logic."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────
     3. INDUSTRIAL — Industrial Ecology
     ────────────────────────────────────────────────────────────── */
  {
    id: "industrial",
    icon: "⬡",
    label: "Industrial Ecology",
    intro: `
      <p>Industrial ecology studies material and energy flows through industrial
      systems with the goal of closing loops, reducing waste, and optimizing resource
      use. The field treats industrial systems as analogues to biological ecosystems,
      where the waste of one process becomes the feedstock for another.</p>
      <ul>
        <li><strong>Industrial symbiosis</strong> &mdash; Networks of companies that
        exchange by-products, water, and energy. The Kalundborg Eco-Industrial Park
        in Denmark is the world's best-known example.</li>
        <li><strong>Life Cycle Assessment (LCA)</strong> &mdash; A systematic method
        for quantifying the environmental impacts of a product or process from raw
        material extraction through end-of-life.</li>
        <li><strong>Material Flow Analysis (MFA)</strong> &mdash; Tracks the flows
        and stocks of materials within a defined system boundary, identifying
        inefficiencies and opportunities for cycling.</li>
        <li><strong>Eco-industrial parks</strong> &mdash; Planned industrial zones
        designed to facilitate symbiotic exchanges of materials, energy, and
        information among co-located firms.</li>
      </ul>
      <p>Rooted in the seminal 1989 article by Frosch and Gallopoulos in
      <em>Scientific American</em>, industrial ecology has matured into a rigorous
      discipline with its own journals, professional societies, and policy influence.</p>`,
    subsections: [
      {
        title: "Industrial Symbiosis",
        items: [
          {
            title: "Industrial Ecology and Industrial Ecosystems",
            author: "Robert Frosch & Nicholas Gallopoulos",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/scientificamerican0989-144",
            desc: "The 1989 Scientific American article that launched the field, proposing that industrial systems should mimic the cycling behavior of biological ecosystems."
          },
          {
            title: "The Kalundborg Symbiosis",
            author: "Kalundborg Symbiosis",
            type: "data",
            level: "beginner",
            url: "https://www.symbiosis.dk/en/",
            desc: "Official site of the world's first industrial symbiosis network, documenting how companies in Kalundborg, Denmark exchange waste streams as resources."
          },
          {
            title: "Industrial Symbiosis: Literature and Taxonomy",
            author: "Marian Chertow",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1146/annurev.energy.25.1.313",
            desc: "A comprehensive literature review that defines industrial symbiosis, classifies examples, and identifies enabling factors for successful exchanges."
          },
          {
            title: "Handbook of Industrial Ecology",
            author: "Robert Ayres & Leslie Ayres (Eds.)",
            type: "book",
            level: "advanced",
            url: "https://www.e-elgar.com/shop/usd/a-handbook-of-industrial-ecology-9781840645064.html",
            desc: "An authoritative reference covering the full scope of industrial ecology: theory, methods, case studies, and policy implications."
          }
        ]
      },
      {
        title: "Life Cycle Assessment",
        items: [
          {
            title: "Life Cycle Assessment: Theory and Practice",
            author: "Walter Kl&ouml;pffer & Birgit Grahl",
            type: "book",
            level: "intermediate",
            url: "https://www.springer.com/gp/book/9783319564746",
            desc: "A comprehensive textbook covering LCA methodology, including goal and scope definition, inventory analysis, impact assessment, and interpretation."
          },
          {
            title: "Life Cycle Assessment: Principles and Practice",
            author: "US EPA (EPA/600/R-06/060)",
            type: "notes",
            level: "beginner",
            url: "https://www.epa.gov/sites/default/files/2014-04/documents/framework-psa-lca-702702.pdf",
            desc: "The EPA's practical guide to LCA, explaining the four-phase ISO 14040 framework with clear examples and decision flowcharts."
          },
          {
            title: "Introduction to Life Cycle Assessment",
            author: "Universiteit Leiden (Coursera)",
            type: "course",
            level: "beginner",
            url: "https://www.coursera.org/learn/life-cycle-assessment",
            desc: "A structured online course from Leiden University walking through each phase of LCA with hands-on exercises and real product case studies."
          },
          {
            title: "openLCA — Open Source Life Cycle Assessment Software",
            author: "GreenDelta",
            type: "code",
            level: "intermediate",
            url: "https://github.com/GreenDelta/olca-app",
            desc: "The GitHub repository for openLCA, a free and open-source LCA software widely used in research and industry for environmental modeling."
          }
        ]
      },
      {
        title: "Material Flow Analysis",
        items: [
          {
            title: "Practical Handbook of Material Flow Analysis",
            author: "Paul Brunner & Helmut Rechberger",
            type: "book",
            level: "intermediate",
            url: "https://www.taylorfrancis.com/books/mono/10.1201/9780203507209/practical-handbook-material-flow-analysis-paul-brunner-helmut-rechberger",
            desc: "The standard reference for MFA methodology, covering system definition, data reconciliation, uncertainty analysis, and software implementation."
          },
          {
            title: "STAN — Substance Flow Analysis Software",
            author: "TU Vienna",
            type: "code",
            level: "intermediate",
            url: "https://www.stan2web.net/",
            desc: "Free software from the Vienna University of Technology for performing material flow analysis with graphical Sankey diagrams and data reconciliation."
          },
          {
            title: "The Weight of Nations: Material Outflows from Industrial Economies",
            author: "World Resources Institute",
            type: "data",
            level: "intermediate",
            url: "https://www.wri.org/research/weight-nations-material-outflows-industrial-economies",
            desc: "A landmark WRI report quantifying total material outflows from five industrial countries, revealing the scale of hidden material flows."
          },
          {
            title: "Economy-Wide Material Flow Accounts (EW-MFA) Handbook",
            author: "Eurostat",
            type: "notes",
            level: "advanced",
            url: "https://ec.europa.eu/eurostat/web/environment/material-flows-and-resource-productivity",
            desc: "Eurostat's methodological guide for compiling economy-wide material flow accounts, the basis for domestic material consumption indicators."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────
     4. CRADLE — Cradle-to-Cradle Design
     ────────────────────────────────────────────────────────────── */
  {
    id: "cradle",
    icon: "∿",
    label: "Cradle-to-Cradle",
    intro: `
      <p>Cradle-to-Cradle (C2C) is a design philosophy developed by architect
      William McDonough and chemist Michael Braungart. It reimagines industrial
      production so that all materials are either <em>biological nutrients</em>
      that safely biodegrade or <em>technical nutrients</em> that circulate
      indefinitely in closed-loop industrial cycles.</p>
      <ul>
        <li><strong>Biological nutrients</strong> &mdash; Materials safe for the
        biosphere that can be composted or consumed without toxic residue, modeled
        on nature's decomposition cycles.</li>
        <li><strong>Technical nutrients</strong> &mdash; Synthetic materials like
        metals and polymers designed for perpetual cycling through disassembly,
        recovery, and remanufacturing.</li>
        <li><strong>Material health</strong> &mdash; Assessing every chemical
        ingredient in a product against human and environmental health criteria,
        eliminating substances of concern.</li>
        <li><strong>C2C Certified&trade;</strong> &mdash; A third-party certification
        program that rates products across five categories: material health, material
        reutilization, renewable energy, water stewardship, and social fairness.</li>
      </ul>
      <p>C2C thinking has influenced product design, architecture, urban planning,
      and policy worldwide, moving beyond eco-efficiency (&ldquo;less bad&rdquo;)
      toward eco-effectiveness (&ldquo;more good&rdquo;).</p>`,
    subsections: [
      {
        title: "C2C Philosophy",
        items: [
          {
            title: "Cradle to Cradle: Remaking the Way We Make Things",
            author: "William McDonough & Michael Braungart",
            type: "book",
            level: "beginner",
            url: "https://www.northpointpress.com/books/cradle-to-cradle/",
            desc: "The original manifesto that articulates the C2C vision: a world of abundance where human industry nourishes rather than depletes natural systems."
          },
          {
            title: "The Upcycle: Beyond Sustainability — Designing for Abundance",
            author: "William McDonough & Michael Braungart",
            type: "book",
            level: "intermediate",
            url: "https://www.northpointpress.com/books/the-upcycle/",
            desc: "The sequel to Cradle to Cradle, presenting a decade of implementation experience and a vision for scaling C2C principles to cities and economies."
          },
          {
            title: "William McDonough: Cradle to Cradle Design",
            author: "TED",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=IoRjz8iTVoo",
            desc: "McDonough's TED talk explaining C2C principles through compelling examples from architecture, manufacturing, and urban design."
          },
          {
            title: "Cradle to Cradle: Creating Healthy Emissions — A Strategy for Eco-Effective Product and System Design",
            author: "Braungart, McDonough & Bollinger",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.jclepro.2006.08.003",
            desc: "An academic articulation of C2C theory, contrasting eco-efficiency with eco-effectiveness and detailing the concept of healthy emissions."
          }
        ]
      },
      {
        title: "Material Health & Chemistry",
        items: [
          {
            title: "Cradle to Cradle Certified Product Standard (Version 4.0)",
            author: "Cradle to Cradle Products Innovation Institute",
            type: "notes",
            level: "advanced",
            url: "https://www.c2ccertified.org/the-standard",
            desc: "The official C2C certification standard, detailing assessment criteria for material health, circularity, clean air, water stewardship, and social fairness."
          },
          {
            title: "GreenScreen for Safer Chemicals",
            author: "Clean Production Action",
            type: "data",
            level: "intermediate",
            url: "https://www.greenscreenchemicals.org/",
            desc: "A chemical hazard assessment tool used in C2C certification to benchmark chemicals against health and environmental criteria and identify safer alternatives."
          },
          {
            title: "ChemFORWARD — Chemical Footprint Project",
            author: "ChemFORWARD",
            type: "data",
            level: "intermediate",
            url: "https://www.chemforward.org/",
            desc: "A nonprofit platform providing standardized chemical hazard data to help manufacturers assess material health and reduce toxic substances in products."
          },
          {
            title: "Healthy Building Network — Pharos Database",
            author: "Healthy Building Network",
            type: "data",
            level: "intermediate",
            url: "https://pharosproject.net/",
            desc: "A comprehensive database for evaluating chemical ingredients in building products, widely used alongside C2C certification for material health assessment."
          }
        ]
      },
      {
        title: "Certified Products & Case Studies",
        items: [
          {
            title: "C2C Certified Product Registry",
            author: "Cradle to Cradle Products Innovation Institute",
            type: "data",
            level: "beginner",
            url: "https://www.c2ccertified.org/products/registry",
            desc: "The official searchable database of all Cradle to Cradle Certified products, spanning textiles, building materials, packaging, and consumer goods."
          },
          {
            title: "Interface: Mission Zero to Climate Take Back",
            author: "Interface Inc.",
            type: "notes",
            level: "beginner",
            url: "https://www.interface.com/sustainability/",
            desc: "How carpet manufacturer Interface transformed its business using C2C principles, achieving carbon-negative flooring products."
          },
          {
            title: "Case Study: Park 20|20 — Cradle to Cradle Business District",
            author: "William McDonough + Partners",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=iG5fRt6c0Kc",
            desc: "Documentary on Park 20|20 in the Netherlands, the world's first C2C-inspired business park, showcasing material passports and circular building design."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────
     5. REGENERATIVE — Regenerative Design
     ────────────────────────────────────────────────────────────── */
  {
    id: "regenerative",
    icon: "☘",
    label: "Regenerative Design",
    intro: `
      <p>Regenerative design goes beyond sustainability&mdash;which aims to do
      &ldquo;no harm&rdquo;&mdash;to actively restore and revitalize the social
      and ecological systems on which human well-being depends. A regenerative
      approach asks not &ldquo;how can we minimize damage?&rdquo; but
      &ldquo;how can this project leave the living world healthier than it
      found it?&rdquo;</p>
      <ul>
        <li><strong>Regenerative vs. sustainable</strong> &mdash; Sustainability
        holds the line; regeneration bends the curve upward. The goal shifts from
        reducing negative impacts to generating net-positive outcomes for ecosystems
        and communities.</li>
        <li><strong>Permaculture</strong> &mdash; A design system for creating
        permanent, self-sustaining human habitats modeled on natural ecosystem
        patterns, developed by Bill Mollison and David Holmgren.</li>
        <li><strong>Regenerative agriculture</strong> &mdash; Farming practices that
        rebuild soil organic matter, restore degraded soil biodiversity, and sequester
        atmospheric carbon into the ground.</li>
        <li><strong>Living Building Challenge</strong> &mdash; The world's most
        rigorous green building standard, requiring net-positive energy, water, and
        waste performance over a twelve-month operating period.</li>
      </ul>
      <p>Regenerative design is inherently place-based, integrating indigenous
      knowledge, local ecology, and community participation into a holistic
      design process.</p>`,
    subsections: [
      {
        title: "Regenerative Design Theory",
        items: [
          {
            title: "Regenerative Development and Design",
            author: "Regenesis Group (Pamela Mang & Bill Reed)",
            type: "book",
            level: "intermediate",
            url: "https://www.wiley.com/en-us/Regenerative+Development+and+Design%3A+A+Framework+for+Evolving+Sustainability-p-9781118972861",
            desc: "A comprehensive framework for regenerative practice, integrating living systems thinking with place-based approaches to design and development."
          },
          {
            title: "The Regenerative Imperative: A New Paradigm for Sustainability",
            author: "John Tillman Lyle",
            type: "book",
            level: "intermediate",
            url: "https://www.wiley.com/en-us/Regenerative+Design+for+Sustainable+Development-p-9780471555827",
            desc: "Lyle's pioneering work on regenerative design for landscapes and communities, proposing strategies for self-renewing human settlements."
          },
          {
            title: "A Shift from Sustainability to Regeneration",
            author: "Bill Reed",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=3v_1DaOOgBw",
            desc: "Bill Reed explains the spectrum from conventional to regenerative design, arguing that true sustainability requires active participation in living systems."
          },
          {
            title: "The Philosophy of Regenerative Design",
            author: "Daniel Wahl",
            type: "book",
            level: "beginner",
            url: "https://www.triarchypress.net/designing-regenerative-cultures.html",
            desc: "Designing Regenerative Cultures explores how to create conditions for life to thrive, weaving together ecology, economics, governance, and worldview."
          }
        ]
      },
      {
        title: "Permaculture & Agriculture",
        items: [
          {
            title: "Permaculture: A Designers' Manual",
            author: "Bill Mollison",
            type: "book",
            level: "intermediate",
            url: "https://www.tagari.com/product/permaculture-a-designers-manual/",
            desc: "The definitive permaculture reference, covering design principles, water harvesting, soil building, agroforestry, and community planning across all climates."
          },
          {
            title: "Introduction to Permaculture",
            author: "Geoff Lawton (Online Course)",
            type: "course",
            level: "beginner",
            url: "https://www.geofflawton.com/",
            desc: "A comprehensive online permaculture design course from one of the world's leading practitioners, covering ethics, principles, and hands-on design."
          },
          {
            title: "Drawdown: The Most Comprehensive Plan Ever Proposed to Reverse Global Warming",
            author: "Paul Hawken (Ed.)",
            type: "book",
            level: "beginner",
            url: "https://drawdown.org/the-book",
            desc: "Ranks 80 solutions to climate change by impact, with regenerative agriculture and silvopasture among the top strategies for carbon sequestration."
          },
          {
            title: "Kiss the Ground",
            author: "Josh Tickell (Director)",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=K3-V1j-zMZw",
            desc: "An acclaimed documentary on regenerative agriculture, showing how healthy soil can sequester carbon, restore ecosystems, and revitalize farming communities."
          },
          {
            title: "Rodale Institute: Regenerative Organic Agriculture and Climate Change",
            author: "Rodale Institute",
            type: "notes",
            level: "intermediate",
            url: "https://rodaleinstitute.org/why-organic/organic-farming-practices/regenerative-organic-agriculture/",
            desc: "Research from the Rodale Institute's 40-year Farming Systems Trial comparing regenerative organic and conventional farming yields, energy use, and soil health."
          }
        ]
      },
      {
        title: "Living Buildings",
        items: [
          {
            title: "Living Building Challenge Standard (Version 4.1)",
            author: "International Living Future Institute",
            type: "notes",
            level: "intermediate",
            url: "https://living-future.org/lbc/",
            desc: "The official standard for the world's most ambitious green building certification, organized around seven performance areas or 'petals.'"
          },
          {
            title: "The Bullitt Center: A Living Building Case Study",
            author: "Bullitt Foundation",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=MRqEMIDPlek",
            desc: "A video tour of the Bullitt Center in Seattle, often called the greenest commercial building in the world, certified under the Living Building Challenge."
          },
          {
            title: "Living Building Challenge Case Studies",
            author: "International Living Future Institute",
            type: "data",
            level: "intermediate",
            url: "https://living-future.org/lbc/case-studies/",
            desc: "A collection of certified Living Building projects with detailed performance data on energy, water, materials, and occupant satisfaction."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────
     6. ECOSYSTEM — Ecosystem Services & Natural Capital
     ────────────────────────────────────────────────────────────── */
  {
    id: "ecosystem",
    icon: "△",
    label: "Ecosystem Services",
    intro: `
      <p>Ecosystem services are the benefits that humans derive from functioning
      natural ecosystems&mdash;clean water, pollination, climate regulation, flood
      protection, recreation, and more. Natural capital accounting attempts to
      measure and value these services so they can be integrated into economic
      decision-making.</p>
      <ul>
        <li><strong>Provisioning services</strong> &mdash; Direct products from
        ecosystems: food, freshwater, timber, fiber, and genetic resources.</li>
        <li><strong>Regulating services</strong> &mdash; Benefits from ecosystem
        processes: climate regulation, water purification, pest control, pollination,
        and erosion prevention.</li>
        <li><strong>Cultural services</strong> &mdash; Non-material benefits:
        recreation, aesthetic value, spiritual enrichment, and sense of place.</li>
        <li><strong>Supporting services</strong> &mdash; Fundamental processes that
        underpin all others: soil formation, nutrient cycling, primary production,
        and the water cycle.</li>
      </ul>
      <p>Nature-based solutions (NbS) leverage these services to address societal
      challenges like urban flooding, heat islands, and biodiversity loss&mdash;often
      at lower cost and higher co-benefit than engineered alternatives.</p>`,
    subsections: [
      {
        title: "Ecosystem Services Frameworks",
        items: [
          {
            title: "The Value of the World's Ecosystem Services and Natural Capital",
            author: "Robert Costanza et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/387253a0",
            desc: "The landmark 1997 Nature paper that first estimated the global value of ecosystem services at $33 trillion per year, sparking a new research field."
          },
          {
            title: "Millennium Ecosystem Assessment: Ecosystems and Human Well-being",
            author: "United Nations",
            type: "notes",
            level: "intermediate",
            url: "https://www.millenniumassessment.org/en/index.html",
            desc: "The comprehensive UN assessment of the state of the world's ecosystems, establishing the four-category framework for ecosystem services."
          },
          {
            title: "The Economics of Ecosystems and Biodiversity (TEEB)",
            author: "UNEP",
            type: "data",
            level: "intermediate",
            url: "https://teebweb.org/",
            desc: "A global initiative drawing attention to the economic benefits of biodiversity, providing tools and methods for valuing ecosystem services in policy."
          },
          {
            title: "Natural Capital: Valuing the Planet",
            author: "Dieter Helm",
            type: "book",
            level: "intermediate",
            url: "https://yalebooks.yale.edu/book/9780300210989/natural-capital/",
            desc: "An economist's argument for a natural capital approach to environmental policy, proposing aggregate natural capital rules and compensation mechanisms."
          }
        ]
      },
      {
        title: "Natural Capital Accounting",
        items: [
          {
            title: "System of Environmental-Economic Accounting (SEEA)",
            author: "United Nations",
            type: "data",
            level: "advanced",
            url: "https://seea.un.org/",
            desc: "The UN's international statistical standard for environmental-economic accounting, providing a framework for measuring natural capital alongside GDP."
          },
          {
            title: "Natural Capital Protocol",
            author: "Capitals Coalition",
            type: "notes",
            level: "intermediate",
            url: "https://capitalscoalition.org/capitals-approach/natural-capital-protocol/",
            desc: "A standardized framework for businesses to identify, measure, and value their direct and indirect impacts and dependencies on natural capital."
          },
          {
            title: "InVEST — Integrated Valuation of Ecosystem Services and Tradeoffs",
            author: "Stanford Natural Capital Project",
            type: "code",
            level: "intermediate",
            url: "https://github.com/natcap/invest",
            desc: "Open-source software that models and maps ecosystem services like carbon storage, water purification, and crop pollination to inform land-use decisions."
          },
          {
            title: "ARIES — Artificial Intelligence for Ecosystem Services",
            author: "ARIES Consortium",
            type: "code",
            level: "advanced",
            url: "https://aries.integratedmodelling.org/",
            desc: "A modeling platform that uses AI and semantic web technologies to rapidly assess ecosystem services at multiple scales with context-appropriate models."
          }
        ]
      },
      {
        title: "Nature-Based Solutions",
        items: [
          {
            title: "Nature-Based Solutions for Climate Change Adaptation and Mitigation",
            author: "IUCN",
            type: "notes",
            level: "beginner",
            url: "https://www.iucn.org/theme/nature-based-solutions",
            desc: "The IUCN's global standard for nature-based solutions, defining principles, criteria, and indicators for NbS design and implementation."
          },
          {
            title: "Green Infrastructure and Climate Change",
            author: "US EPA",
            type: "notes",
            level: "beginner",
            url: "https://www.epa.gov/green-infrastructure",
            desc: "EPA resources on green infrastructure approaches including rain gardens, green roofs, permeable pavements, and urban tree canopy for stormwater management."
          },
          {
            title: "Sponge Cities: Water-Resilient Urban Design",
            author: "World Bank",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=cKqALiGA_os",
            desc: "An overview of China's Sponge City initiative, which uses green infrastructure to absorb, clean, and reuse rainwater in urban environments."
          },
          {
            title: "Nature-Based Solutions to Climate Change Adaptation in Urban Areas",
            author: "Kabisch et al. (Eds.)",
            type: "book",
            level: "advanced",
            url: "https://www.springer.com/gp/book/9783319536507",
            desc: "An open-access Springer volume examining how urban nature-based solutions can address climate risks while delivering biodiversity and well-being co-benefits."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────
     7. TOOLS — Assessment Tools & Databases
     ────────────────────────────────────────────────────────────── */
  {
    id: "tools",
    icon: "⊗",
    label: "Tools & Databases",
    intro: `
      <p>Designing ecological systems requires rigorous assessment of material
      flows, environmental impacts, and sustainability performance. A growing
      ecosystem of software tools, databases, and metrics frameworks supports
      practitioners in making evidence-based design decisions.</p>
      <ul>
        <li><strong>LCA software</strong> &mdash; Applications like SimaPro, GaBi,
        and openLCA that model the environmental impacts of products and processes
        across their full life cycle.</li>
        <li><strong>Material databases</strong> &mdash; Repositories of environmental
        data on materials, chemicals, and processes (e.g., ecoinvent, USLCI) that
        feed into LCA and MFA models.</li>
        <li><strong>Sustainability metrics</strong> &mdash; Frameworks for measuring
        and reporting environmental performance: carbon footprinting, water
        footprinting, environmental product declarations (EPDs), and planetary
        boundaries.</li>
        <li><strong>Design decision tools</strong> &mdash; Interactive platforms that
        help designers evaluate trade-offs, compare scenarios, and communicate
        environmental performance to stakeholders.</li>
      </ul>
      <p>Open-source tools have democratized access to sophisticated environmental
      analysis, enabling small firms, students, and community organizations to
      conduct assessments previously limited to large consultancies.</p>`,
    subsections: [
      {
        title: "LCA Software & Databases",
        items: [
          {
            title: "openLCA — Open Source LCA Software",
            author: "GreenDelta",
            type: "code",
            level: "intermediate",
            url: "https://github.com/GreenDelta/olca-app",
            desc: "A free, open-source life cycle assessment tool supporting all LCA phases, compatible with major databases including ecoinvent and USLCI."
          },
          {
            title: "Brightway2 — Python LCA Framework",
            author: "Chris Mutel",
            type: "code",
            level: "advanced",
            url: "https://github.com/brightway-lca/brightway2",
            desc: "An open-source Python framework for advanced LCA calculations, enabling uncertainty analysis, parametric modeling, and integration with data science workflows."
          },
          {
            title: "ecoinvent Database",
            author: "ecoinvent Association",
            type: "data",
            level: "intermediate",
            url: "https://ecoinvent.org/",
            desc: "The world's most comprehensive and consistent LCA database, containing over 18,000 datasets covering energy, transport, materials, and waste treatment."
          },
          {
            title: "US Life Cycle Inventory Database (USLCI)",
            author: "NREL",
            type: "data",
            level: "intermediate",
            url: "https://www.nrel.gov/lci/",
            desc: "A free, publicly available database of life cycle inventory data for commonly used materials, products, and processes in the United States."
          },
          {
            title: "openLCA Nexus — LCA Data Repository",
            author: "GreenDelta",
            type: "data",
            level: "intermediate",
            url: "https://nexus.openlca.org/",
            desc: "A central repository for accessing both free and commercial LCA databases in openLCA format, including ELCD, USLCI, and agribalyse."
          }
        ]
      },
      {
        title: "Sustainability Metrics",
        items: [
          {
            title: "Planetary Boundaries: Exploring the Safe Operating Space for Humanity",
            author: "Rockstr&ouml;m et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/461472a",
            desc: "The seminal 2009 Nature paper proposing nine planetary boundaries within which humanity must operate to maintain a stable Earth system."
          },
          {
            title: "The GHG Protocol Corporate Standard",
            author: "WRI & WBCSD",
            type: "notes",
            level: "intermediate",
            url: "https://ghgprotocol.org/corporate-standard",
            desc: "The most widely used international accounting standard for measuring and reporting greenhouse gas emissions from corporate operations."
          },
          {
            title: "Water Footprint Assessment Manual",
            author: "Water Footprint Network",
            type: "notes",
            level: "intermediate",
            url: "https://waterfootprint.org/en/resources/publications/water-footprint-assessment-manual/",
            desc: "A comprehensive guide to water footprint assessment methodology, covering green, blue, and grey water footprints for products, processes, and nations."
          },
          {
            title: "Environmental Product Declarations (EPD) International",
            author: "EPD International",
            type: "data",
            level: "intermediate",
            url: "https://www.environdec.com/",
            desc: "The global program for Type III environmental declarations based on ISO 14025 and EN 15804, providing standardized environmental data for products."
          }
        ]
      },
      {
        title: "Design Decision Tools",
        items: [
          {
            title: "MaterialMapper — Circular Material Selection",
            author: "Ellen MacArthur Foundation",
            type: "data",
            level: "beginner",
            url: "https://www.ellenmacarthurfoundation.org/resources/learn/circular-design-toolkit",
            desc: "A toolkit helping designers select materials and design strategies for circular products, with prompts for biological and technical cycle thinking."
          },
          {
            title: "Circulytics — Company Circularity Measurement",
            author: "Ellen MacArthur Foundation",
            type: "data",
            level: "intermediate",
            url: "https://www.ellenmacarthurfoundation.org/resources/circulytics/overview",
            desc: "A comprehensive circularity measurement tool for companies, assessing enablers and outcomes across the full value chain."
          },
          {
            title: "One Click LCA — Building Life Cycle Assessment",
            author: "One Click LCA",
            type: "code",
            level: "intermediate",
            url: "https://www.oneclicklca.com/",
            desc: "Cloud-based LCA software specifically designed for the construction industry, integrating with BIM workflows and EPD databases."
          },
          {
            title: "Activity Browser — GUI for Brightway2",
            author: "LCA-ActivityBrowser",
            type: "code",
            level: "advanced",
            url: "https://github.com/LCA-ActivityBrowser/activity-browser",
            desc: "An open-source graphical interface for the Brightway2 LCA framework, making advanced life cycle assessment accessible without writing Python code."
          }
        ]
      }
    ]
  }

];

/* ================================================================
   RENDERING ENGINE
   ================================================================ */

/* rendering engine */
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
