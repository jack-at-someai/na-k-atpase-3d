/* ===================================================================
   BIOMIMETIC ARCHITECTURE  --  Curated Reference Hub
   Nature-inspired building design: ventilation, structures, facades,
   and urban ecology.
   =================================================================== */

const SECTIONS = [

  /* ---------------------------------------------------------------
     1. OVERVIEW  --  Introduction to Biomimetic Architecture
     --------------------------------------------------------------- */
  {
    id: "overview",
    icon: "◈",
    label: "Overview",
    intro: `
      <p>
        Biomimetic architecture draws design principles from biological organisms
        and ecosystems, translating millions of years of evolutionary refinement
        into buildings that breathe, adapt, and perform. From Antoni Gaud&iacute;'s
        catenary arches&mdash;derived from hanging chain experiments that mirror
        natural load paths&mdash;to Frei Otto's soap-film models of minimal surfaces,
        the discipline has deep historical roots and an accelerating contemporary practice.
      </p>
      <ul>
        <li><strong>Biomimicry</strong> &mdash; The conscious emulation of biological
            strategies to solve human design challenges, coined by Janine Benyus in 1997.</li>
        <li><strong>Biomorphism</strong> &mdash; Design that borrows visual forms from
            nature without necessarily replicating function.</li>
        <li><strong>Bio-utilisation</strong> &mdash; Direct use of living organisms
            (green walls, algae facades) as functional building components.</li>
        <li><strong>Bio-computation</strong> &mdash; Algorithms inspired by biological
            processes&mdash;genetic algorithms, swarm optimization&mdash;applied to
            architectural form-finding and structural optimization.</li>
      </ul>
      <p>
        The resources below introduce the intellectual foundations, survey the
        state of the art, and highlight landmark lectures that have shaped the field.
      </p>`,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          {
            title: "Biomimicry: Innovation Inspired by Nature",
            author: "Janine Benyus",
            type: "book",
            level: "beginner",
            url: "https://www.harpercollins.com/products/biomimicry-janine-m-benyus",
            desc: "The foundational text that popularized biomimicry as a design discipline. Benyus surveys how engineers and architects can learn from biological models across scales."
          },
          {
            title: "The Architectural Relevance of Biological Structures",
            author: "Werner Nachtigall",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1007/978-3-319-19120-1",
            desc: "Comprehensive treatment of how structural principles in biology inform architectural engineering, from insect shells to plant mechanics."
          },
          {
            title: "Architecture Follows Nature: Biomimetic Principles for Innovative Design",
            author: "Ilaria Mazzoleni",
            type: "book",
            level: "intermediate",
            url: "https://www.routledge.com/Architecture-Follows-Nature-Biomimetic-Principles-for-Innovative-Design/Mazzoleni/p/book/9781138794368",
            desc: "A richly illustrated guide linking specific biological organisms to architectural strategies, with detailed case studies and design methods."
          },
          {
            title: "Nature's Building Methods: Biology as Inspiration for Architecture",
            author: "Petra Gruber",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-7091-1693-8",
            desc: "Gruber systematically maps biological strategies to building functions, providing a rigorous methodology for translating nature's solutions into architecture."
          }
        ]
      },
      {
        title: "Survey Articles",
        items: [
          {
            title: "Biomimetics in Architecture: Architecture of Life and Buildings",
            author: "Petra Gruber & Barbara Imhof",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/978-3-7091-1693-8_1",
            desc: "A survey chapter mapping the intersection of biology, materials science, and architectural design with a focus on transfer methodologies."
          },
          {
            title: "A Review of Biomimicry in Building Energy Efficiency",
            author: "Moham M. Alzoubi & Yousef Al-Zoubi",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.enbuild.2020.110448",
            desc: "Systematic review of how biomimetic strategies have been applied to building envelopes, HVAC systems, and energy management."
          },
          {
            title: "Biomimicry in Architecture: State of the Art and Challenges",
            author: "Natasha Chayaamor-Heil & Nikoletta Hannachi-Belkadi",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1051/e3sconf/202017218001",
            desc: "Explores current challenges in translating biological knowledge into viable architectural systems, including interdisciplinary collaboration barriers."
          },
          {
            title: "Learning from Nature: Biomimetic Design for Sustainable Architecture",
            author: "Maibritt Pedersen Zari",
            type: "notes",
            level: "beginner",
            url: "https://doi.org/10.1108/14601060810845271",
            desc: "Accessible introduction distinguishing organism-level mimicry from behaviour-level and ecosystem-level mimicry in architectural design."
          }
        ]
      },
      {
        title: "Notable Lectures",
        items: [
          {
            title: "Janine Benyus: Biomimicry in Action",
            author: "Janine Benyus (TED)",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=k_GFq12w5WU",
            desc: "Benyus presents real-world examples of designs inspired by nature, including self-cleaning surfaces and energy-efficient buildings."
          },
          {
            title: "Michael Pawlyn: Using Nature's Genius in Architecture",
            author: "Michael Pawlyn (TED)",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=3QZp6smeSQA",
            desc: "Architect Michael Pawlyn demonstrates three habits of nature that could transform architecture: radical resource efficiency, closed loops, and solar energy."
          },
          {
            title: "Neri Oxman: Design at the Intersection of Technology and Biology",
            author: "Neri Oxman (TED)",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=CVa_IZVzUoc",
            desc: "Oxman presents her lab's work on material ecology, where computational design and biological fabrication converge to create adaptive structures."
          },
          {
            title: "Biomimicry: A Short Introduction (Crash Course)",
            author: "Biomimicry Institute",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=UHb3TVMfOJg",
            desc: "A concise animated introduction to the core principles of biomimicry and how they apply across design disciplines including architecture."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     2. CLIMATE  --  Termite-Inspired Climate Control
     --------------------------------------------------------------- */
  {
    id: "climate",
    icon: "∿",
    label: "Climate Control",
    intro: `
      <p>
        Termite mounds are among nature's most sophisticated climate-control
        systems. Species like <em>Macrotermes michaelseni</em> maintain internal
        temperatures within a narrow band despite ambient swings of 30&nbsp;&deg;C
        or more, using convective airflow driven through elaborate tunnel networks.
        The Eastgate Centre in Harare, Zimbabwe&mdash;designed by Mick Pearce and
        Arup&mdash;famously drew on this principle to eliminate conventional
        air conditioning in a large commercial building.
      </p>
      <ul>
        <li><strong>Stack ventilation</strong> &mdash; Buoyancy-driven airflow where
            warm air rises through a central chimney, drawing cooler air in at the base.</li>
        <li><strong>Thermal mass</strong> &mdash; Dense materials absorb heat during the
            day and release it at night, dampening temperature oscillations.</li>
        <li><strong>Metabolic heat</strong> &mdash; Termite fungus gardens generate heat
            that drives airflow; analogous to internal loads in occupied buildings.</li>
        <li><strong>Evaporative cooling</strong> &mdash; Moisture from subsoil evaporates
            in termite mound galleries, paralleling evaporative cooling towers in buildings.</li>
      </ul>
      <p>
        These resources cover the biology of termite thermoregulation, passive
        ventilation engineering, and built case studies that translate these
        principles into practice.
      </p>`,
    subsections: [
      {
        title: "Termite Mound Science",
        items: [
          {
            title: "Termite Mounds as Organismal Constructions",
            author: "J. Scott Turner",
            type: "book",
            level: "advanced",
            url: "https://www.hup.harvard.edu/books/9780674018150",
            desc: "Turner's landmark work recasts the termite mound as an extended organ of the colony, analyzing gas exchange, humidity regulation, and the physics of airflow."
          },
          {
            title: "Termite-Inspired Thermoregulation: Lessons for Architecture",
            author: "Rupert Soar & J. Scott Turner",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1098/rsif.2008.0354",
            desc: "Detailed study of how Macrotermes mounds regulate CO2 and temperature through porous wall structures, with implications for building-envelope design."
          },
          {
            title: "How Termites Build Complex Mounds (BBC Earth)",
            author: "BBC Earth",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=G1fz6KKBEaQ",
            desc: "Accessible documentary segment showing CT scans and thermal imaging of termite mound ventilation systems."
          },
          {
            title: "The Extended Organism: The Physiology of Animal-Built Structures",
            author: "J. Scott Turner",
            type: "book",
            level: "intermediate",
            url: "https://www.hup.harvard.edu/books/9780674009851",
            desc: "Broader treatment of animal-built structures as physiological extensions, with a central chapter on termite mound thermoregulation."
          }
        ]
      },
      {
        title: "Passive Ventilation Design",
        items: [
          {
            title: "Natural Ventilation in Buildings: A Design Handbook",
            author: "Francis Allard (ed.)",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.4324/9781315073781",
            desc: "Comprehensive engineering handbook covering stack-effect ventilation, cross-ventilation, and wind-driven strategies for naturally ventilated buildings."
          },
          {
            title: "Ventilation and Airflow in Buildings: Methods for Diagnosis and Evaluation",
            author: "Claude-Alain Roulet",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.4324/9781849770620",
            desc: "Technical guide to measuring and modeling airflow in buildings, including tracer gas methods and computational fluid dynamics techniques."
          },
          {
            title: "Passive Cooling of Buildings (Coursera)",
            author: "University of Louvain",
            type: "course",
            level: "intermediate",
            url: "https://www.coursera.org/learn/energy-efficiency",
            desc: "Online course covering passive cooling strategies including natural ventilation, thermal mass, earth coupling, and evaporative cooling."
          },
          {
            title: "DesignBuilder CFD Simulation Tutorials",
            author: "DesignBuilder Software",
            type: "code",
            level: "intermediate",
            url: "https://designbuilder.co.uk/helpv7.2/Content/CFDOverview.htm",
            desc: "Official tutorial series for simulating natural ventilation and thermal comfort in buildings using integrated EnergyPlus and CFD engines."
          }
        ]
      },
      {
        title: "Case Studies",
        items: [
          {
            title: "Eastgate Centre, Harare: Biomimicry in Practice",
            author: "Mick Pearce Architects",
            type: "notes",
            level: "beginner",
            url: "https://www.mickpearce.com/eastgate.html",
            desc: "Architect's own account of the Eastgate Centre, which uses termite-inspired passive ventilation and thermal mass to cool a 31,000 m2 building without air conditioning."
          },
          {
            title: "CH2 Melbourne City Council House",
            author: "City of Melbourne & DesignInc",
            type: "notes",
            level: "intermediate",
            url: "https://www.melbourne.vic.gov.au/building-and-development/sustainable-building/council-house-2/Pages/council-house-2.aspx",
            desc: "Case study of Melbourne's 6-star Green Star building featuring biomimetic night-purge ventilation, shower towers, and phase-change materials."
          },
          {
            title: "BedZED: Beddington Zero Energy Development",
            author: "Bill Dunster Architects",
            type: "notes",
            level: "beginner",
            url: "https://www.bioregional.com/projects-and-services/case-studies/bedzed",
            desc: "South London mixed-use development using wind-driven ventilation cowls and high thermal mass to achieve near-zero heating demand."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     3. SHELLS  --  Shell Structures & Lightweight Construction
     --------------------------------------------------------------- */
  {
    id: "shells",
    icon: "△",
    label: "Shells & Forms",
    intro: `
      <p>
        Biological shells&mdash;from sea urchin tests to diatom frustules&mdash;achieve
        extraordinary strength-to-weight ratios through geometric efficiency.
        Architects and engineers have long studied these forms: Frei Otto's
        soap-film experiments revealed minimal surfaces for tensile roofs,
        Buckminster Fuller's geodesic domes approximated the icosahedral
        symmetry of radiolaria, and Heinz Isler's concrete shells followed
        hanging-cloth catenary forms akin to eggshell geometry.
      </p>
      <ul>
        <li><strong>Minimal surfaces</strong> &mdash; Surfaces that minimize area for
            given boundary conditions, found in soap films and biological membranes.</li>
        <li><strong>Tensegrity</strong> &mdash; Structural systems where isolated
            compression members float in a continuous tension network, inspired by
            cellular cytoskeletons.</li>
        <li><strong>Geodesic geometry</strong> &mdash; Subdivision of a sphere into
            triangular facets for maximum structural rigidity with minimum material.</li>
        <li><strong>Form-finding</strong> &mdash; Computational or physical methods to
            discover optimal structural shapes under given loads and boundary conditions.</li>
      </ul>
      <p>
        The following resources cover the mathematical theory, physical modelling
        traditions, and modern computational approaches to shell and membrane structures.
      </p>`,
    subsections: [
      {
        title: "Shell & Membrane Theory",
        items: [
          {
            title: "Finding Form: Towards an Architecture of the Minimal",
            author: "Frei Otto & Bodo Rasch",
            type: "book",
            level: "intermediate",
            url: "https://www.degruyter.com/document/doi/10.1515/9783035603286/html",
            desc: "Otto's seminal work documenting decades of form-finding experiments with soap films, hanging chains, and pneumatic models."
          },
          {
            title: "Thin Shell Concrete Structures",
            author: "David P. Billington",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-1-4613-8017-1",
            desc: "Classic engineering text on the analysis and design of thin concrete shells, covering membrane theory, bending theory, and stability."
          },
          {
            title: "Biology and the Mechanics of Shells",
            author: "A. R. Studart",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nmat4089",
            desc: "Review of how biological mineralized shells achieve fracture toughness through hierarchical microstructures, with lessons for engineered composites."
          },
          {
            title: "The Architecture of Heinz Isler: Shells for Living",
            author: "John Chilton",
            type: "book",
            level: "intermediate",
            url: "https://www.routledge.com/Heinz-Isler-Shells-for-Architecture/Chilton/p/book/9780415522724",
            desc: "Monograph on Isler's concrete shell designs, documenting his hanging-model technique and over 1,500 built shell structures."
          }
        ]
      },
      {
        title: "Tensegrity & Geodesic",
        items: [
          {
            title: "Geodesic Math and How to Use It",
            author: "Hugh Kenner",
            type: "book",
            level: "intermediate",
            url: "https://www.ucpress.edu/book/9780520239319/geodesic-math-and-how-to-use-it",
            desc: "Practical mathematical guide to constructing geodesic structures, explaining the coordinate geometry and frequency subdivisions behind Fuller's domes."
          },
          {
            title: "Tensegrity: Structural Systems for the Future",
            author: "Ren&eacute; Motro",
            type: "book",
            level: "advanced",
            url: "https://www.elsevier.com/books/tensegrity/motro/978-1-903996-37-9",
            desc: "Comprehensive treatment of tensegrity mechanics, from Kenneth Snelson's sculptures to deployable space structures and biological cytoskeletons."
          },
          {
            title: "Buckminster Fuller: Starting with the Universe",
            author: "Whitney Museum of American Art",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=BfBkBKyHVm0",
            desc: "Documentary overview of Fuller's geodesic domes, Dymaxion designs, and his philosophy of doing more with less."
          },
          {
            title: "Tensegrity Structures: Form, Stability, and Symmetry",
            author: "Jing Yao Zhang & Makoto Ohsaki",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-4-431-54813-3",
            desc: "Mathematical framework for the analysis and design of tensegrity structures, covering form-finding algorithms, stability criteria, and symmetry groups."
          }
        ]
      },
      {
        title: "Computational Form-Finding",
        items: [
          {
            title: "Kangaroo Physics for Grasshopper",
            author: "Daniel Piker",
            type: "code",
            level: "intermediate",
            url: "https://www.food4rhino.com/en/app/kangaroo-physics",
            desc: "Real-time physics engine for Grasshopper enabling interactive form-finding of shells, membranes, and tensile structures through particle-spring simulation."
          },
          {
            title: "Form Finding and Optimization of Membranes and Minimal Surfaces",
            author: "Kai-Uwe Bletzinger",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-7091-2410-0_2",
            desc: "Technical paper on finite-element-based form-finding methods for membrane structures, including the updated reference strategy and force density method."
          },
          {
            title: "Karamba3D: Parametric Structural Analysis",
            author: "Clemens Preisinger",
            type: "code",
            level: "intermediate",
            url: "https://www.karamba3d.com/",
            desc: "Structural analysis plugin for Grasshopper allowing real-time feedback on shell thickness, stress distribution, and deflection during parametric design."
          },
          {
            title: "The Force Density Method for Form Finding (Lecture)",
            author: "ETH Zurich Block Research Group",
            type: "video",
            level: "advanced",
            url: "https://www.youtube.com/watch?v=8hYKpMHU0cI",
            desc: "Lecture from Philippe Block's group explaining the force density method and thrust network analysis for compression-only shell design."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     4. FACADES  --  Adaptive & Responsive Facades
     --------------------------------------------------------------- */
  {
    id: "facades",
    icon: "⬡",
    label: "Adaptive Facades",
    intro: `
      <p>
        Nature is full of surfaces that respond to environmental stimuli: plant
        stomata open and close to regulate gas exchange, pinecone scales bend
        with humidity to control seed dispersal, and cephalopod skin changes
        colour and texture in milliseconds. Architects are increasingly
        translating these adaptive mechanisms into building facades that
        modulate daylight, ventilation, and thermal gain in real time&mdash;without
        energy-hungry mechanical systems.
      </p>
      <ul>
        <li><strong>Stomatal regulation</strong> &mdash; Microscopic pores on leaf
            surfaces that open and close based on turgor pressure, inspiring
            humidity-responsive ventilation panels.</li>
        <li><strong>Hygromorphic actuation</strong> &mdash; Shape change driven by
            moisture absorption, as in pinecone scales and wheat awns, enabling
            passive, zero-energy responsive elements.</li>
        <li><strong>Kinetic architecture</strong> &mdash; Building elements that
            physically move in response to sun, wind, or occupancy, such as the
            Al Bahar Towers' origami-inspired screen.</li>
        <li><strong>Smart materials</strong> &mdash; Shape-memory alloys,
            electrochromic glass, and thermobimetals that change properties
            with temperature, voltage, or light.</li>
      </ul>
      <p>
        These resources explore the biological inspiration, engineering
        implementation, and material science behind next-generation adaptive facades.
      </p>`,
    subsections: [
      {
        title: "Adaptive Mechanisms in Nature",
        items: [
          {
            title: "Plant Biomechanics: An Engineering Approach to Plant Form and Function",
            author: "Karl J. Niklas",
            type: "book",
            level: "advanced",
            url: "https://press.uchicago.edu/ucp/books/book/chicago/P/bo3683003.html",
            desc: "Rigorous biomechanical analysis of plant structures, including turgor-driven movements, hygroscopic actuation, and nastic responses relevant to facade design."
          },
          {
            title: "Biomimetic Research for Architecture and Building Construction",
            author: "Jan Knippers, Klaus Nickel & Thomas Speck (eds.)",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-319-46374-2",
            desc: "Collected research from the German SFB-TRR 141 programme, including chapters on plant-inspired adaptive shading and flap mechanisms."
          },
          {
            title: "How Do Pinecones Open? Hygromorphic Actuation Explained",
            author: "Lorna J. Gibson (MIT)",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=wNVME6H0Yb0",
            desc: "Short lecture explaining the bilayer mechanism that drives pinecone scale opening and its potential for architectural applications."
          },
          {
            title: "The Adaptive Building Initiative: Bio-inspired Facades",
            author: "Achim Menges & Steffen Reichert",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/ad.1956",
            desc: "Description of the HygroScope and HygroSkin pavilions at the University of Stuttgart, where wood veneer elements respond passively to humidity changes."
          }
        ]
      },
      {
        title: "Responsive Building Skins",
        items: [
          {
            title: "Al Bahar Towers: Adaptive Facade Case Study",
            author: "Aedas Architects & Arup",
            type: "notes",
            level: "intermediate",
            url: "https://www.arup.com/projects/al-bahar-towers",
            desc: "Technical case study of the kinetic mashrabiya screen in Abu Dhabi, which uses origami-folding elements to reduce solar gain by up to 50%."
          },
          {
            title: "Adaptive Building Skins: Design and Technology",
            author: "Ulrich Knaack et al.",
            type: "book",
            level: "intermediate",
            url: "https://www.degruyter.com/document/doi/10.1515/9783035610246/html",
            desc: "Survey of state-of-the-art responsive facades covering mechanical, pneumatic, and material-based actuation systems."
          },
          {
            title: "Climate Adaptive Building Shells (CABS) Database",
            author: "TU Delft",
            type: "data",
            level: "intermediate",
            url: "https://www.cabs.bk.tudelft.nl/",
            desc: "Curated database of over 100 climate-adaptive building shell concepts with performance data, categorized by adaptation mechanism."
          },
          {
            title: "One Ocean Pavilion: Kinetic Facade (Yeosu Expo 2012)",
            author: "soma architecture",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=hPuo2C7ZXjw",
            desc: "Time-lapse and behind-the-scenes footage of the SOMA pavilion's lamellar kinetic facade, inspired by the movement of fish gills."
          }
        ]
      },
      {
        title: "Smart Materials for Facades",
        items: [
          {
            title: "Smart Materials in Architecture, Interior Architecture and Design",
            author: "Axel Ritter",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1007/978-3-7643-7327-6",
            desc: "Comprehensive guide to shape-memory alloys, electrochromic glazing, thermochromic coatings, and photovoltaic integration in building envelopes."
          },
          {
            title: "Thermobimetal Responsive Architecture",
            author: "Doris Sung (USC)",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=igrqMzGjXkI",
            desc: "Sung demonstrates thermobimetal panels that curl autonomously with temperature change, providing self-ventilating building skins without electricity."
          },
          {
            title: "Shape Memory Alloy Actuators for Adaptive Facades",
            author: "A. Aelenei et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.rser.2016.01.043",
            desc: "Review of shape-memory alloy applications in building facades, covering nitinol actuator design, fatigue life, and energy-harvesting potential."
          },
          {
            title: "Electrochromic Glazing: Performance and Control Strategies",
            author: "Eleanor S. Lee et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.enbuild.2005.12.008",
            desc: "Lawrence Berkeley National Lab study on dynamic electrochromic windows that modulate visible transmittance in response to glare and solar heat gain."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     5. STRUCTURES  --  Structural Optimization from Nature
     --------------------------------------------------------------- */
  {
    id: "structures",
    icon: "⊕",
    label: "Bio-Structures",
    intro: `
      <p>
        Load-bearing structures in nature are the product of evolutionary
        optimization under resource scarcity. Bones remodel by depositing
        material along principal stress trajectories and resorbing it where
        loads are low&mdash;a process that directly parallels computational
        topology optimization. Tree trunks taper and branch according to
        the axiom of uniform stress (Mattheck's "constant stress hypothesis"),
        and coral colonies grow fractal geometries that maximize surface area
        while resisting wave action.
      </p>
      <ul>
        <li><strong>Topology optimization</strong> &mdash; Computational removal of
            material from a design domain to find the most efficient load path,
            analogous to Wolff's law of bone remodeling.</li>
        <li><strong>Adaptive growth</strong> &mdash; Trees add growth rings
            preferentially where stresses are highest, a strategy that can be
            simulated to design branching columns and nodes.</li>
        <li><strong>Additive biofabrication</strong> &mdash; 3D printing with
            bio-inspired materials (concrete, clay, fiber composites) enables
            complex geometries previously impossible with formwork.</li>
        <li><strong>Hierarchical materials</strong> &mdash; Bone, nacre, and wood
            achieve toughness through nested structural levels from nano to macro scale.</li>
      </ul>
      <p>
        The resources below span topology optimization theory, tree-inspired
        branching design, and emerging 3D-printed bio-structures.
      </p>`,
    subsections: [
      {
        title: "Topology Optimization",
        items: [
          {
            title: "Topology Optimization: Theory, Methods, and Applications",
            author: "Martin P. Bends&oslash;e & Ole Sigmund",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-662-05086-6",
            desc: "The definitive textbook on computational topology optimization, covering SIMP, homogenization, and level-set methods with engineering applications."
          },
          {
            title: "A 99-Line Topology Optimization Code in MATLAB",
            author: "Ole Sigmund",
            type: "code",
            level: "intermediate",
            url: "https://doi.org/10.1007/s001580050176",
            desc: "Classic paper and accompanying MATLAB code providing a minimal working implementation of SIMP-based topology optimization."
          },
          {
            title: "TopOpt: Interactive Topology Optimization (Web App)",
            author: "Technical University of Denmark",
            type: "code",
            level: "beginner",
            url: "https://www.topopt.mek.dtu.dk/",
            desc: "Free web-based tool for experimenting with 2D topology optimization in real time, illustrating how bone-like structures emerge from load conditions."
          },
          {
            title: "Design in Nature: Wolff's Law and Bone Remodeling",
            author: "Rik Huiskes",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/35015116",
            desc: "Concise review of Wolff's law and computational bone remodeling, connecting biological adaptation to engineering topology optimization."
          }
        ]
      },
      {
        title: "Tree-Inspired Structures",
        items: [
          {
            title: "Design in Nature: Learning from Trees",
            author: "Claus Mattheck",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1007/978-3-642-58747-4",
            desc: "Mattheck presents the constant stress hypothesis, showing how trees optimize their shape at branch junctions, and applies these principles to engineering design."
          },
          {
            title: "The Stuttgart Airport Tree Columns",
            author: "Buro Happold & GMP Architects",
            type: "notes",
            level: "beginner",
            url: "https://www.burohappold.com/projects/stuttgart-airport/",
            desc: "Case study of the Stuttgart Airport terminal's tree-like branching steel columns that distribute roof loads efficiently inspired by natural branching patterns."
          },
          {
            title: "Branching Structures in Architecture",
            author: "Remo Pedreschi",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=tjRkdL-bMKs",
            desc: "Lecture on how tree-branching morphology has been adapted for architectural columns, canopies, and long-span roof supports."
          }
        ]
      },
      {
        title: "3D-Printed Bio-Structures",
        items: [
          {
            title: "Large-Scale 3D Printing for Construction",
            author: "Behrokh Khoshnevis (USC)",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=JdbJP8X3OYQ",
            desc: "Overview of Contour Crafting technology for 3D-printing buildings, including how topology-optimized and bio-inspired geometries become feasible at building scale."
          },
          {
            title: "Digital Grotesque: 3D Printed Room",
            author: "Michael Hansmeyer & Benjamin Dillenburger",
            type: "notes",
            level: "intermediate",
            url: "https://www.yourarchitecturesite.com/digital-grotesque",
            desc: "Project documentation of the first fully 3D-printed room, featuring algorithmically generated ornamentation with coral-like fractal geometry."
          },
          {
            title: "Mediated Matter Group: Bio-Inspired Digital Fabrication",
            author: "Neri Oxman (MIT Media Lab)",
            type: "code",
            level: "advanced",
            url: "https://www.media.mit.edu/groups/mediated-matter/overview/",
            desc: "Research group portfolio documenting multi-material 3D printing inspired by biological structures, including the Silk Pavilion and Aguahoja projects."
          },
          {
            title: "3D Printing Architecture: Workflows, Case Studies, Innovations",
            author: "Carlos Baieta",
            type: "book",
            level: "intermediate",
            url: "https://www.routledge.com/3D-Printing-Architecture/Baieta/p/book/9781032100173",
            desc: "Survey of current 3D printing workflows for architecture, with case studies featuring bio-inspired structural optimization and computational design pipelines."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     6. URBAN  --  Urban Ecology & Biophilic Design
     --------------------------------------------------------------- */
  {
    id: "urban",
    icon: "☘",
    label: "Urban Ecology",
    intro: `
      <p>
        If buildings can learn from organisms, cities can learn from ecosystems.
        Biophilic urbanism integrates nature into the urban fabric not as
        decoration but as functional infrastructure: green roofs attenuate
        stormwater, urban forests mitigate heat islands, and living walls
        filter particulates. The biophilic design framework&mdash;advanced by
        E. O. Wilson, Stephen Kellert, and Timothy Beatley&mdash;argues that
        humans have an innate affiliation with living systems, and that
        incorporating nature into cities yields measurable benefits for health,
        productivity, and social cohesion.
      </p>
      <ul>
        <li><strong>Biophilic design</strong> &mdash; Incorporating direct nature,
            natural analogues, and spatial configurations found in nature to satisfy
            humans' innate need for contact with living systems.</li>
        <li><strong>Green infrastructure</strong> &mdash; Networks of green roofs,
            bioswales, urban forests, and permeable surfaces that provide ecosystem
            services like stormwater management and air purification.</li>
        <li><strong>Urban metabolism</strong> &mdash; Treating cities as ecosystems
            with material and energy flows, aiming for circular, closed-loop resource cycles.</li>
        <li><strong>Ecosystem services</strong> &mdash; Quantifiable benefits that urban
            nature provides: carbon sequestration, microclimate regulation, biodiversity
            support, and mental health restoration.</li>
      </ul>
      <p>
        These resources span biophilic design theory, green infrastructure
        engineering, and quantitative urban ecosystem services research.
      </p>`,
    subsections: [
      {
        title: "Biophilic Design Principles",
        items: [
          {
            title: "Biophilic Design: The Theory, Science and Practice of Bringing Buildings to Life",
            author: "Stephen R. Kellert, Judith Heerwagen & Martin Mador",
            type: "book",
            level: "intermediate",
            url: "https://www.wiley.com/en-us/Biophilic+Design%3A+The+Theory%2C+Science+and+Practice+of+Bringing+Buildings+to+Life-p-9780470163344",
            desc: "Foundational anthology defining 14 patterns of biophilic design with evidence from environmental psychology, neuroscience, and architectural practice."
          },
          {
            title: "14 Patterns of Biophilic Design",
            author: "Terrapin Bright Green",
            type: "notes",
            level: "beginner",
            url: "https://www.terrapinbrightgreen.com/reports/14-patterns/",
            desc: "Free report distilling biophilic design into 14 actionable patterns with built examples, metrics, and implementation guidance for designers."
          },
          {
            title: "Biophilic Cities: Integrating Nature into Urban Design and Planning",
            author: "Timothy Beatley",
            type: "book",
            level: "beginner",
            url: "https://islandpress.org/books/biophilic-cities",
            desc: "Beatley surveys cities worldwide that have successfully integrated nature into urban planning, from Singapore to Oslo."
          },
          {
            title: "The Nature of the View from Home: Psychological Benefits",
            author: "Rachel & Stephen Kaplan",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1177/001391650103300401",
            desc: "Landmark study demonstrating that views of nature from residential windows correlate with higher satisfaction, well-being, and cognitive function."
          }
        ]
      },
      {
        title: "Green Infrastructure",
        items: [
          {
            title: "Green Roof Systems: A Guide to the Planning, Design and Construction",
            author: "Susan Weiler & Katrin Scholz-Barth",
            type: "book",
            level: "intermediate",
            url: "https://www.wiley.com/en-us/Green+Roof+Systems-p-9780471674955",
            desc: "Practical design guide for extensive and intensive green roofs, covering substrate engineering, plant selection, waterproofing, and stormwater performance."
          },
          {
            title: "Bosco Verticale: Vertical Forest, Milan",
            author: "Stefano Boeri Architetti",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=cMEyaLFsnSU",
            desc: "Documentary on Milan's Bosco Verticale towers, which host over 900 trees and 20,000 plants on residential balconies to filter air and moderate microclimate."
          },
          {
            title: "i-Tree: Urban Forest Assessment Tools",
            author: "USDA Forest Service",
            type: "code",
            level: "intermediate",
            url: "https://www.itreetools.org/",
            desc: "Free suite of tools for quantifying the ecosystem services of urban trees, including carbon storage, air pollution removal, and stormwater interception."
          },
          {
            title: "Green Infrastructure for Landscape Planning",
            author: "Gary Austin",
            type: "book",
            level: "intermediate",
            url: "https://www.routledge.com/Green-Infrastructure-for-Landscape-Planning/Austin/p/book/9780415843539",
            desc: "Integration of bioswales, rain gardens, constructed wetlands, and urban forests into landscape planning with quantitative sizing methods."
          }
        ]
      },
      {
        title: "Urban Ecosystem Services",
        items: [
          {
            title: "The Economics of Ecosystems and Biodiversity (TEEB) Manual for Cities",
            author: "TEEB",
            type: "notes",
            level: "intermediate",
            url: "https://teebweb.org/publications/teeb-for/local-and-regional-policy-makers/",
            desc: "Guidance document for municipal decision-makers on how to value and integrate urban ecosystem services into planning and budgeting."
          },
          {
            title: "Urban Ecosystem Services: A Review",
            author: "Erik G&oacute;mez-Baggethun & David N. Barton",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.ecolecon.2012.02.005",
            desc: "Comprehensive review of urban ecosystem services research, covering valuation methods, typologies, and policy integration challenges."
          },
          {
            title: "Nature-Based Solutions for Climate Resilience (EU Report)",
            author: "European Commission",
            type: "data",
            level: "intermediate",
            url: "https://research-and-innovation.ec.europa.eu/research-area/environment/nature-based-solutions_en",
            desc: "EU research portal on nature-based solutions for urban flood management, heat mitigation, and biodiversity conservation."
          },
          {
            title: "Singapore: City in Nature (National Parks Board)",
            author: "NParks Singapore",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=NIqbBdEtS1k",
            desc: "Overview of Singapore's strategy to become a City in Nature by 2030, integrating skyrise greenery, ecological corridors, and therapeutic gardens."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     7. TOOLS  --  Design Tools & Software
     --------------------------------------------------------------- */
  {
    id: "tools",
    icon: "⊗",
    label: "Design Tools",
    intro: `
      <p>
        Biomimetic architecture increasingly relies on computational tools that
        can handle the geometric complexity and multi-objective performance criteria
        inherent in nature-inspired design. Parametric design environments like
        Grasshopper for Rhino allow architects to define formal relationships
        algorithmically, while generative algorithms&mdash;L-systems, agent-based
        models, evolutionary solvers&mdash;can explore vast design spaces to find
        solutions optimized for structure, daylight, thermal comfort, and material use.
      </p>
      <ul>
        <li><strong>Parametric design</strong> &mdash; Design driven by parameters and
            relationships rather than fixed geometry, enabling rapid exploration of
            nature-inspired forms.</li>
        <li><strong>Generative algorithms</strong> &mdash; L-systems for branching,
            Voronoi tessellation for cellular structures, agent-based models for
            swarm behaviour and growth simulation.</li>
        <li><strong>Environmental simulation</strong> &mdash; Daylight analysis (Radiance),
            energy modelling (EnergyPlus), CFD (OpenFOAM) integrated into the design loop.</li>
        <li><strong>Digital fabrication</strong> &mdash; CNC milling, robotic arms,
            and large-format 3D printing that turn computationally derived forms into
            physical prototypes and building components.</li>
      </ul>
      <p>
        The following resources cover the leading software tools, simulation
        engines, and fabrication workflows used by biomimetic designers.
      </p>`,
    subsections: [
      {
        title: "Parametric & Generative Design",
        items: [
          {
            title: "Grasshopper: Algorithmic Modeling for Rhino",
            author: "Robert McNeel & Associates",
            type: "code",
            level: "beginner",
            url: "https://www.grasshopper3d.com/",
            desc: "The industry-standard visual programming environment for parametric design, enabling complex bio-inspired geometry through node-based workflows."
          },
          {
            title: "The Algorithmic Beauty of Plants",
            author: "Przemyslaw Prusinkiewicz & Aristid Lindenmayer",
            type: "book",
            level: "intermediate",
            url: "http://algorithmicbotany.org/papers/abop/abop.pdf",
            desc: "Classic text on L-systems for modeling plant growth and branching, freely available online. Foundation for generative branching algorithms in architecture."
          },
          {
            title: "Galapagos: Evolutionary Solver in Grasshopper",
            author: "David Rutten",
            type: "code",
            level: "intermediate",
            url: "https://www.grasshopper3d.com/group/galapagos",
            desc: "Built-in evolutionary optimization component for Grasshopper that uses genetic algorithms to solve multi-objective design problems."
          },
          {
            title: "Morphogenesis and Computation: A Design Exploration (MIT OCW)",
            author: "MIT Media Lab / Neri Oxman",
            type: "course",
            level: "advanced",
            url: "https://ocw.mit.edu/courses/4-500-design-computation-fall-2002/",
            desc: "MIT OpenCourseWare materials on computational design processes inspired by biological morphogenesis, covering agent-based models and reaction-diffusion systems."
          },
          {
            title: "Nature of Code",
            author: "Daniel Shiffman",
            type: "book",
            level: "beginner",
            url: "https://natureofcode.com/",
            desc: "Free online textbook teaching simulation of natural systems (physics, flocking, cellular automata, fractals) through code, directly applicable to generative design."
          }
        ]
      },
      {
        title: "Environmental Simulation",
        items: [
          {
            title: "Ladybug Tools: Environmental Analysis for Grasshopper",
            author: "Mostapha Sadeghipour Roudsari",
            type: "code",
            level: "intermediate",
            url: "https://www.ladybug.tools/",
            desc: "Open-source plugin suite connecting Grasshopper to EnergyPlus, Radiance, and OpenFOAM for daylight, energy, and airflow simulation within parametric workflows."
          },
          {
            title: "EnergyPlus: Whole Building Energy Simulation",
            author: "US Department of Energy",
            type: "code",
            level: "advanced",
            url: "https://energyplus.net/",
            desc: "Open-source building energy simulation engine capable of modeling natural ventilation, thermal mass, and adaptive facade strategies at sub-hourly resolution."
          },
          {
            title: "Radiance: Physically-Based Lighting Simulation",
            author: "Greg Ward (LBNL)",
            type: "code",
            level: "advanced",
            url: "https://www.radiance-online.org/",
            desc: "Industry-standard ray-tracing engine for daylight analysis, used to optimize biomimetic shading and light-redirecting facades."
          },
          {
            title: "Environmental Design of Buildings (Coursera)",
            author: "University of Cambridge",
            type: "course",
            level: "intermediate",
            url: "https://www.coursera.org/learn/designing-sustainable-buildings",
            desc: "Course covering building physics, thermal comfort, and environmental simulation methods for sustainable architecture."
          }
        ]
      },
      {
        title: "Digital Fabrication",
        items: [
          {
            title: "Robots in Architecture: KUKA|prc for Grasshopper",
            author: "Association for Robots in Architecture",
            type: "code",
            level: "advanced",
            url: "https://www.robotsinarchitecture.org/kuka-prc",
            desc: "Plugin for programming KUKA robotic arms directly from Grasshopper, enabling robotic fabrication of complex bio-inspired building components."
          },
          {
            title: "How to Make (Almost) Anything (MIT Fab Lab)",
            author: "Neil Gershenfeld (MIT)",
            type: "course",
            level: "intermediate",
            url: "https://fab.cba.mit.edu/classes/863.24/",
            desc: "MIT course on digital fabrication spanning CNC milling, laser cutting, 3D printing, and electronics&mdash;skills essential for prototyping biomimetic designs."
          },
          {
            title: "ICD/ITKE Research Pavilions (University of Stuttgart)",
            author: "Achim Menges & Jan Knippers",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=elJDYMb4nMo",
            desc: "Documentation of the ICD/ITKE research pavilion series, which uses robotic fabrication to build lightweight fiber structures inspired by beetle elytra and sea urchin plates."
          },
          {
            title: "Fabrication Information Modeling: Digital Fabrication Handbook",
            author: "Fabian Scheurer & Hanno Stehling",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/ad.1416",
            desc: "Paper on integrating digital fabrication constraints into parametric design models, ensuring computationally derived bio-inspired forms are buildable."
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
