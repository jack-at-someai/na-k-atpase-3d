/* ============================================================
   Biological Surfaces & Interfaces — Curated Reference Hub
   ============================================================ */

const SECTIONS = [

  /* -------------------------------------------------------
     1. OVERVIEW — Introduction to Biological Surfaces
     ------------------------------------------------------- */
  {
    id: "overview",
    icon: "◈",
    label: "Overview",
    intro: `
      <p>Nature has evolved an astonishing diversity of surface architectures over hundreds of millions of years.
      From the self-cleaning leaves of the lotus to the reversible adhesion of gecko toes, biological surfaces
      perform functions that human engineers are only beginning to replicate. The study of <strong>biological
      surfaces and interfaces</strong> spans wettability, adhesion, friction, optical properties, and anti-fouling
      &mdash; each governed by micro- and nanoscale structure rather than chemistry alone.</p>
      <h3>Core Concepts</h3>
      <ul>
        <li><strong>Wettability</strong> &mdash; How a surface interacts with water, governed by surface energy and roughness (Young, Wenzel, and Cassie-Baxter equations).</li>
        <li><strong>Adhesion</strong> &mdash; Attachment mechanisms ranging from van der Waals forces (gecko) to chemical bonding (mussel DOPA).</li>
        <li><strong>Friction &amp; Drag</strong> &mdash; Surface textures that modify boundary layers, reducing drag in aquatic and aerial locomotion.</li>
        <li><strong>Anti-fouling</strong> &mdash; Natural strategies to prevent colonization by bacteria, algae, and barnacles.</li>
        <li><strong>Structural Color</strong> &mdash; Interference and diffraction from nanostructures producing iridescence in butterflies and beetles.</li>
      </ul>
      <p>This hub collects foundational textbooks, landmark review articles, video lectures, courses, datasets,
      and open-source code for researchers entering the field or deepening their expertise.</p>
    `,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          {
            title: "Biological and Bioinspired Micro- and Nanostructured Surfaces",
            author: "Bharat Bhushan",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1007/978-3-030-45528-2",
            desc: "Comprehensive Springer reference covering hierarchical structuring in nature, wettability, adhesion, and friction at the micro/nanoscale."
          },
          {
            title: "Biomimetics: Biologically Inspired Technologies",
            author: "Yoseph Bar-Cohen (Ed.)",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1201/9781420037715",
            desc: "Wide-ranging CRC Press volume on bio-inspired engineering, including chapters on surfaces, adhesion, and locomotion."
          },
          {
            title: "Nature's Nanostructures",
            author: "Amanda S. Barnard & Haibo Guo (Eds.)",
            type: "book",
            level: "beginner",
            url: "https://doi.org/10.4032/9789814364218",
            desc: "Pan Stanford collection reviewing naturally occurring nanostructures across biological kingdoms and their functional roles."
          },
          {
            title: "Springer Handbook of Nanotechnology (Ch. on Bio-Surfaces)",
            author: "Bharat Bhushan (Ed.)",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-662-54357-3",
            desc: "The authoritative nanotechnology handbook with dedicated chapters on biological surface characterization and biomimetic surfaces."
          }
        ]
      },
      {
        title: "Review Articles",
        items: [
          {
            title: "Lessons from Nature: Bio-Inspired Surface Engineering",
            author: "Yao Lu et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1039/C4CS00107A",
            desc: "Chemical Society Reviews paper surveying bio-inspired surfaces including superhydrophobic, adhesive, anti-fouling, and structural-color systems."
          },
          {
            title: "Bio-Inspired Surfaces and Applications",
            author: "Zhiguang Guo et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.cis.2012.03.009",
            desc: "Advances in Colloid and Interface Science review on surface wettability, adhesion, and anti-fouling in biological systems."
          },
          {
            title: "Surface Engineering for Phase Change Heat Transfer: A Review",
            author: "Nenad Miljkovic & Evelyn N. Wang",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.ijheatmasstransfer.2012.09.045",
            desc: "Though heat-transfer focused, this review provides excellent context on engineered wettability and droplet dynamics on bio-inspired surfaces."
          },
          {
            title: "Bioinspired Structural Materials",
            author: "Ulrike G. K. Wegst et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nmat4089",
            desc: "Nature Materials review on how biological organisms build hierarchical structures that combine mechanical and surface functionality."
          }
        ]
      },
      {
        title: "Introductory Lectures",
        items: [
          {
            title: "Biomimicry: Inspired by Nature (MIT OpenCourseWare)",
            author: "MIT",
            type: "course",
            level: "beginner",
            url: "https://ocw.mit.edu/courses/ec-710-d-lab-design-fall-2010/",
            desc: "MIT OCW design lab introducing biomimetic principles including surface-level inspiration from organisms."
          },
          {
            title: "Nature-Inspired Engineering — Crash Course Engineering",
            author: "CrashCourse",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=iMtXqTmfta0",
            desc: "Accessible 10-minute overview of how engineers copy nature's surfaces, from Velcro to shark skin swimsuits."
          },
          {
            title: "Biomimetics: Learning from Nature (TED-Ed)",
            author: "TED-Ed",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=UHkEbemburs",
            desc: "Short animated lesson on biomimicry with examples of surface-inspired inventions."
          },
          {
            title: "Functional Surfaces in Biology (Vols. 1–3)",
            author: "Stanislav N. Gorb (Ed.)",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-1-4020-6697-9",
            desc: "Three-volume Springer set cataloguing functional surface structures across the animal and plant kingdoms, from adhesion to optical effects."
          }
        ]
      }
    ]
  },

  /* -------------------------------------------------------
     2. LOTUS — Superhydrophobicity & Self-Cleaning
     ------------------------------------------------------- */
  {
    id: "lotus",
    icon: "☘",
    label: "Lotus Effect",
    intro: `
      <p>In 1997, botanist <strong>Wilhelm Barthlott</strong> published his landmark study revealing that the
      self-cleaning property of the lotus leaf (<em>Nelumbo nucifera</em>) arises from a hierarchical
      combination of microscale papillae and nanoscale epicuticular wax crystals. Water droplets on such surfaces
      adopt a nearly spherical shape (contact angle &gt; 150&deg;) and roll off carrying contaminants &mdash;
      the <strong>lotus effect</strong>.</p>
      <h3>Key Physics</h3>
      <ul>
        <li><strong>Cassie-Baxter State</strong> &mdash; Droplets rest on top of surface asperities with air pockets trapped underneath, producing high contact angles and low roll-off angles.</li>
        <li><strong>Wenzel State</strong> &mdash; Droplets fully wet the textured surface; roughness amplifies intrinsic wettability (hydrophilic becomes more hydrophilic, hydrophobic more hydrophobic).</li>
        <li><strong>Contact Angle Hysteresis</strong> &mdash; The difference between advancing and receding contact angles determines how easily a droplet slides off.</li>
        <li><strong>Hierarchical Structuring</strong> &mdash; Combining micro- and nano-features is essential for robust superhydrophobicity that resists transition to the Wenzel state.</li>
      </ul>
      <p>The lotus effect has inspired self-cleaning glass, anti-icing coatings, waterproof textiles, and
      corrosion-resistant metal treatments.</p>
    `,
    subsections: [
      {
        title: "Fundamental Science",
        items: [
          {
            title: "Purity of the Sacred Lotus, or Escape from Contamination in Biological Surfaces",
            author: "Wilhelm Barthlott & Christoph Neinhuis",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/s004250050096",
            desc: "The 1997 Planta paper that introduced the 'lotus effect' to the scientific community, launching the field of biomimetic superhydrophobic surfaces."
          },
          {
            title: "Wettability of Porous Surfaces",
            author: "A. B. D. Cassie & S. Baxter",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1039/TF9444000546",
            desc: "The foundational 1944 Transactions of the Faraday Society paper deriving the Cassie-Baxter equation for composite interfaces."
          },
          {
            title: "Micro- and Nanoscale Characterization of Superhydrophobic Surfaces",
            author: "Bharat Bhushan & Yong Chae Jung",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-642-15263-4_2",
            desc: "Detailed study of hierarchical surface structure on lotus leaves using AFM and SEM, explaining stability of the Cassie state."
          },
          {
            title: "Superhydrophobic Surfaces — Lecture by Prof. Doris Vollmer",
            author: "Max Planck Institute",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=BvbkSm3kJuE",
            desc: "Research lecture on the physics of superhydrophobic coatings, Cassie-Wenzel transitions, and droplet dynamics."
          }
        ]
      },
      {
        title: "Synthetic Superhydrophobic Surfaces",
        items: [
          {
            title: "Superhydrophobic States",
            author: "Abraham Marmur",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1021/la034753r",
            desc: "Langmuir paper providing a thermodynamic framework for understanding Cassie and Wenzel superhydrophobic states."
          },
          {
            title: "Robust Superhydrophobic Surfaces (Nature Reviews Materials)",
            author: "Robin H. A. Ras et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/natrevmats.2017.36",
            desc: "Comprehensive review on mechanical durability challenges and design strategies for real-world superhydrophobic coatings."
          },
          {
            title: "Fabrication of Superhydrophobic Surfaces — GitHub Protocols",
            author: "Various contributors",
            type: "code",
            level: "intermediate",
            url: "https://github.com/topics/superhydrophobic",
            desc: "GitHub topic page aggregating open-source repositories on fabrication methods, image analysis, and contact angle computation for superhydrophobic surfaces."
          },
          {
            title: "Introduction to Superhydrophobic Coatings (Coursera)",
            author: "EPFL / Coursera",
            type: "course",
            level: "beginner",
            url: "https://www.coursera.org/learn/nanotechnology-fundamentals",
            desc: "Coursera nanotechnology fundamentals course with modules covering surface energy, wettability engineering, and lotus-inspired coatings."
          }
        ]
      },
      {
        title: "Industrial Applications",
        items: [
          {
            title: "Self-Cleaning Coatings: From the Lotus Leaf to Commercial Products",
            author: "Kerstin Koch et al.",
            type: "notes",
            level: "beginner",
            url: "https://doi.org/10.1098/rsta.2009.0056",
            desc: "Royal Society review tracing the lotus effect from biological discovery to industrial self-cleaning glass and facade coatings."
          },
          {
            title: "Anti-Icing Superhydrophobic Surfaces: Controlling Entropic and Energetic Factors",
            author: "Liangliang Cao et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1021/nn900437e",
            desc: "ACS Nano study demonstrating how superhydrophobic nanostructures delay ice formation, with applications to aircraft and power lines."
          },
          {
            title: "How Lotus-Inspired Tech Works (Real Engineering)",
            author: "Real Engineering",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=mMBFP2EMSqo",
            desc: "YouTube explainer on commercial products inspired by lotus-effect superhydrophobicity including NeverWet and self-cleaning glass."
          }
        ]
      }
    ]
  },

  /* -------------------------------------------------------
     3. GECKO — Adhesion via van der Waals Forces
     ------------------------------------------------------- */
  {
    id: "gecko",
    icon: "⊕",
    label: "Gecko Adhesion",
    intro: `
      <p>Geckos can run up glass walls and hang from ceilings by a single toe, thanks to millions of
      microscale <strong>setae</strong> that branch into nanoscale <strong>spatulae</strong>. The adhesion
      is primarily mediated by <strong>van der Waals forces</strong> &mdash; weak intermolecular attractions
      that become significant when summed over billions of contact points at the nanoscale.</p>
      <h3>Hierarchical Adhesion System</h3>
      <ul>
        <li><strong>Spatulae</strong> &mdash; ~200 nm wide tips that conform to surface irregularities, maximizing intimate contact area.</li>
        <li><strong>Setae</strong> &mdash; ~100 &mu;m long hair-like structures, each bearing 100&ndash;1000 spatulae, providing compliance.</li>
        <li><strong>Lamellae</strong> &mdash; Ridges on the toe pad that allow peeling detachment at controlled angles.</li>
        <li><strong>Self-Cleaning</strong> &mdash; Gecko adhesive pads self-clean during locomotion, shedding particles with each step.</li>
      </ul>
      <p>Understanding gecko adhesion has enabled <strong>dry adhesives</strong> that stick without glue, climbing
      robots, and grippers for space debris capture.</p>
    `,
    subsections: [
      {
        title: "Gecko Biology & Physics",
        items: [
          {
            title: "Adhesive Force of a Single Gecko Foot-Hair",
            author: "Kellar Autumn et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/35049572",
            desc: "The landmark 2000 Nature paper measuring adhesion of individual gecko setae and demonstrating the van der Waals mechanism."
          },
          {
            title: "Evidence for van der Waals Adhesion in Gecko Setae",
            author: "Kellar Autumn et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1073/pnas.162246899",
            desc: "PNAS follow-up providing rigorous evidence that van der Waals forces, not capillary or electrostatic effects, dominate gecko adhesion."
          },
          {
            title: "How Do Geckos Stick to Walls? (Veritasium)",
            author: "Veritasium",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=cEAdsbIIR2I",
            desc: "Popular science video explaining gecko adhesion, van der Waals forces, and the spatula hierarchy with clear visuals."
          },
          {
            title: "Self-Cleaning of Gecko-Inspired Adhesives",
            author: "Kellar Autumn & Wendy Hansen",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1073/pnas.0503774102",
            desc: "PNAS study showing that gecko toe pads recover adhesive function by shedding debris during walking, a built-in self-cleaning mechanism."
          }
        ]
      },
      {
        title: "Synthetic Gecko Adhesives",
        items: [
          {
            title: "Gecko-Inspired Nanofibrillar Adhesives (Geckskin)",
            author: "Michael Bartlett et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/adma.201200218",
            desc: "Advanced Materials paper on Geckskin, a gecko-inspired adhesive pad that holds 700 lbs on a smooth surface and releases cleanly."
          },
          {
            title: "Directional Adhesion of Gecko-Inspired Fibrillar Surfaces",
            author: "Metin Sitti & Ronald S. Fearing",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1063/1.1594820",
            desc: "Applied Physics Letters study on fabricating directional polymer nanofibrillar adhesives mimicking gecko seta geometry."
          },
          {
            title: "Gecko-Inspired Dry Adhesive — Fabrication Code",
            author: "Various contributors",
            type: "code",
            level: "intermediate",
            url: "https://github.com/topics/gecko-adhesion",
            desc: "GitHub topic aggregating simulation code, FEM models, and fabrication protocols for synthetic gecko-inspired adhesive structures."
          },
          {
            title: "Scalable Fabrication of Gecko-Inspired Adhesives",
            author: "Mark Cutkosky & Sangbae Kim",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1098/rsif.2008.0042",
            desc: "Journal of the Royal Society Interface paper on manufacturing scalable directional adhesives for robotic climbing applications."
          }
        ]
      },
      {
        title: "Climbing Robots & Applications",
        items: [
          {
            title: "Stickybot: A Gecko-Inspired Climbing Robot",
            author: "Sangbae Kim et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1109/ROBOT.2007.363827",
            desc: "IEEE paper on Stanford's Stickybot, a robot that climbs smooth vertical surfaces using directional gecko-inspired adhesive pads."
          },
          {
            title: "DARPA Z-Man Program — Gecko Climbing Paddles",
            author: "DARPA / Draper Laboratory",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=Bz_lgTx3bEY",
            desc: "Video demonstrating DARPA's Z-Man program, where a human climbs a glass wall using gecko-inspired handheld paddles."
          },
          {
            title: "Gecko Gripper for Space Debris Capture (NASA JPL)",
            author: "Aaron Parness et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1126/scirobotics.aan4986",
            desc: "Science Robotics paper on NASA JPL's gecko-inspired gripper for grasping and manipulating objects in microgravity."
          },
          {
            title: "Stanford Climbing Robots (Stanford BDML Lab)",
            author: "Stanford BDML",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=yjLgOuClJLA",
            desc: "Lab video showcasing various generations of climbing robots using gecko-inspired directional dry adhesives."
          }
        ]
      }
    ]
  },

  /* -------------------------------------------------------
     4. SHARK — Shark Skin & Drag Reduction
     ------------------------------------------------------- */
  {
    id: "shark",
    icon: "∿",
    label: "Shark Skin",
    intro: `
      <p>Shark skin is covered in tiny tooth-like scales called <strong>dermal denticles</strong> (placoid scales)
      with characteristic riblet patterns. These microstructures modify the turbulent boundary layer, reducing
      skin-friction drag by up to <strong>8&ndash;10%</strong>. The discovery inspired one of the most famous
      biomimetic products: the Speedo Fastskin swimsuit, and ongoing research into riblet films for aircraft
      and shipping.</p>
      <h3>Drag Reduction Principles</h3>
      <ul>
        <li><strong>Riblets</strong> &mdash; Longitudinal micro-grooves aligned with flow that dampen cross-stream turbulent fluctuations and reduce momentum transfer to the wall.</li>
        <li><strong>Dermal Denticles</strong> &mdash; Three-dimensional crown-and-ridge structures on shark skin that combine drag reduction with anti-fouling.</li>
        <li><strong>Boundary Layer Control</strong> &mdash; Riblets keep streamwise vortices lifted above the surface, reducing wall shear stress.</li>
        <li><strong>Anti-Fouling Synergy</strong> &mdash; The same microstructure that reduces drag also prevents settlement of algae and barnacles on living sharks.</li>
      </ul>
      <p>Research extends from competitive swimming to fuel savings on commercial aircraft, container ships,
      and wind turbine blades.</p>
    `,
    subsections: [
      {
        title: "Shark Skin Morphology",
        items: [
          {
            title: "Structure and Function of Shark Skin Denticles",
            author: "Johannes Oeffner & George V. Lauder",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1242/jeb.063040",
            desc: "Journal of Experimental Biology study using flow visualization to demonstrate how real shark skin denticles interact with the boundary layer."
          },
          {
            title: "Shark Skin Surfaces for Fluid-Drag Reduction in Turbulent Flow: A Review",
            author: "Amy W. Lang et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1098/rsta.2010.0294",
            desc: "Phil. Trans. Royal Society review comparing drag reduction performance of different denticle geometries across shark species."
          },
          {
            title: "The Hydrodynamics of Shark Skin (SmarterEveryDay)",
            author: "SmarterEveryDay",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=eMJGPJAti3Q",
            desc: "Engaging YouTube video using slow-motion footage and microscopy to show how shark skin denticles work at the boundary layer."
          },
          {
            title: "Diversity of Dermal Denticle Structure in Sharks",
            author: "Lisa K. Habegger et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/jmor.20359",
            desc: "Journal of Morphology comparative study of denticle geometry across shark species, linking denticle shape to ecological niche and swimming speed."
          }
        ]
      },
      {
        title: "Drag Reduction Engineering",
        items: [
          {
            title: "Experiments on Drag-Reducing Surfaces (Riblets)",
            author: "Dean W. Bechert et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1017/S0022112097006635",
            desc: "Landmark Journal of Fluid Mechanics paper providing comprehensive wind-tunnel data on riblet geometries for maximum drag reduction."
          },
          {
            title: "Turbulent Drag Reduction by Riblets (Annual Review)",
            author: "Ricardo Garcia-Mayoral & Javier Jimenez",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1098/rsta.2010.0359",
            desc: "Authoritative review of the fluid mechanics behind riblet-based drag reduction, including DNS simulation results."
          },
          {
            title: "OpenFOAM Riblet Simulation Tutorials",
            author: "Various contributors",
            type: "code",
            level: "advanced",
            url: "https://github.com/topics/riblet",
            desc: "GitHub repositories containing OpenFOAM configurations and Python scripts for simulating turbulent flow over riblet surfaces."
          },
          {
            title: "3D Printing Shark-Skin-Inspired Surfaces",
            author: "Li Wen et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1242/jeb.097097",
            desc: "Journal of Experimental Biology paper on 3D-printing biomimetic shark skin denticles and testing drag reduction in a flow tunnel."
          }
        ]
      },
      {
        title: "Commercial Applications",
        items: [
          {
            title: "Speedo Fastskin: Biomimicry in Competitive Swimming",
            author: "Speedo / Various journalists",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=7XHdPsNdVfI",
            desc: "Documentary segment on the development of Speedo's Fastskin swimsuit, inspired by shark denticle patterns, and its controversial Olympic ban."
          },
          {
            title: "Riblet Films for Fuel Savings on Commercial Aircraft (Lufthansa/BASF)",
            author: "Lufthansa Technik",
            type: "notes",
            level: "beginner",
            url: "https://doi.org/10.2514/6.2019-1960",
            desc: "AIAA paper on Lufthansa and BASF's shark-skin-inspired riblet film applied to aircraft fuselages, projecting 1% fuel savings fleet-wide."
          },
          {
            title: "Shark Skin for Ships: Anti-Fouling and Drag Reduction",
            author: "Various",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1088/1748-3190/7/4/046002",
            desc: "Bioinspiration & Biomimetics paper evaluating dual drag-reduction and anti-fouling performance of shark-skin-textured hull coatings."
          },
          {
            title: "Wind Turbine Blade Riblets for Energy Gain",
            author: "P. Sareen et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.2514/6.2012-1060",
            desc: "AIAA conference paper demonstrating that shark-skin-inspired riblet films on wind turbine blades improve aerodynamic efficiency by reducing boundary layer drag."
          }
        ]
      }
    ]
  },

  /* -------------------------------------------------------
     5. ANTIFOULING — Bio-Inspired Anti-Fouling Surfaces
     ------------------------------------------------------- */
  {
    id: "antifouling",
    icon: "⊗",
    label: "Anti-Fouling",
    intro: `
      <p><strong>Biofouling</strong> &mdash; the unwanted accumulation of micro-organisms, algae, and invertebrates
      on submerged surfaces &mdash; costs the shipping industry alone an estimated <strong>$150 billion per year</strong>
      in fuel penalties, hull cleaning, and corrosion. Traditional anti-fouling paints rely on toxic biocides
      (tributyltin, copper), causing severe environmental damage. Nature offers a better way: many marine organisms
      remain remarkably clean without chemistry.</p>
      <h3>Natural Anti-Fouling Strategies</h3>
      <ul>
        <li><strong>Topographical Defense</strong> &mdash; Surface textures at the attachment-point scale (&sim;2 &mu;m for bacteria, &sim;20 &mu;m for barnacle cyprids) physically prevent settlement.</li>
        <li><strong>Sharklet Pattern</strong> &mdash; A diamond-shaped microtexture inspired by shark dermal denticles that reduces bacterial colonization by up to 85%.</li>
        <li><strong>Mussel-Inspired Fouling-Release</strong> &mdash; Polydopamine and zwitterionic coatings create ultra-hydrophilic surfaces where foulers cannot adhere strongly.</li>
        <li><strong>Natural Antifoulants</strong> &mdash; Chemical deterrents produced by corals, sponges, and seaweeds that inhibit larval settlement without broad toxicity.</li>
      </ul>
      <p>The convergence of micro-texturing, surface chemistry, and biological deterrence is generating a new
      generation of non-toxic anti-fouling technologies for marine, biomedical, and industrial applications.</p>
    `,
    subsections: [
      {
        title: "Marine Anti-Fouling Biology",
        items: [
          {
            title: "Marine Biofouling: A Sticky Problem (Nature Reviews Microbiology)",
            author: "Jeremy A. Callow & Maureen E. Callow",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.biotechadv.2008.09.002",
            desc: "Comprehensive review of the biofouling process from biofilm formation to macrofouling, and the biological mechanisms organisms use to resist it."
          },
          {
            title: "Natural Anti-Fouling Defenses of Marine Organisms",
            author: "Rocky de Nys & Peter Steinberg",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1080/08927010009386328",
            desc: "Biofouling journal review cataloging chemical and physical anti-fouling strategies across marine phyla from sponges to seagrasses."
          },
          {
            title: "Biofouling: Lessons from Nature (Annual Review of Materials Research)",
            author: "Anthony Brennan & Thomas Callow",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1146/annurev-matsci-070909-104432",
            desc: "Annual Review article connecting natural anti-fouling mechanisms to material science design principles for synthetic surfaces."
          },
          {
            title: "Marine Biofouling — An Introduction (NOAA)",
            author: "NOAA Ocean Explorer",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=bIy3PoYkGis",
            desc: "Introductory video explaining what biofouling is, why it matters for shipping and marine ecosystems, and how organisms resist it."
          }
        ]
      },
      {
        title: "Synthetic Anti-Fouling Surfaces",
        items: [
          {
            title: "Sharklet AF: Micro-Pattern Inhibits Bacterial Settlement",
            author: "Anthony B. Brennan et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1088/1748-3182/2/4/S04",
            desc: "Bioinspiration & Biomimetics paper introducing the Sharklet micro-pattern, demonstrating 85% reduction in Staphylococcus aureus attachment."
          },
          {
            title: "Zwitterionic Polymer Coatings for Anti-Fouling",
            author: "Shaoyi Jiang & Zhiqiang Cao",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/adma.200903328",
            desc: "Advanced Materials paper on ultra-low-fouling zwitterionic polymer brushes that resist protein adsorption and cell attachment."
          },
          {
            title: "Slippery Liquid-Infused Porous Surfaces (SLIPS)",
            author: "Tak-Sing Wong et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nature10447",
            desc: "Nature paper on pitcher-plant-inspired SLIPS coatings that repel virtually all liquids and resist biofouling."
          },
          {
            title: "Anti-Fouling Coating Testing — Open Data",
            author: "AMBIO EU Project",
            type: "data",
            level: "intermediate",
            url: "https://doi.org/10.1080/08927014.2009.9911178",
            desc: "Published dataset from the EU AMBIO project evaluating anti-fouling performance of various bio-inspired coatings in marine field trials."
          }
        ]
      },
      {
        title: "Biomedical Anti-Fouling",
        items: [
          {
            title: "Anti-Biofilm Surfaces for Medical Implants",
            author: "Kara L. Mould et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1039/C5CS00013K",
            desc: "Chemical Society Reviews paper reviewing bio-inspired surface strategies to prevent bacterial biofilm on catheters, implants, and surgical tools."
          },
          {
            title: "PEG-Based Anti-Fouling Coatings for Biosensors",
            author: "Insung S. Choi et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1021/acs.langmuir.5b04171",
            desc: "Langmuir paper on poly(ethylene glycol) brush coatings that prevent nonspecific protein adsorption on biosensor surfaces."
          },
          {
            title: "Micro-Textured Surfaces to Combat Hospital Infections",
            author: "Sharklet Technologies",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=Z3W5gRDveRc",
            desc: "Video presentation on Sharklet Technologies' shark-skin-inspired micro-textures being applied to hospital surfaces to reduce HAIs."
          }
        ]
      }
    ]
  },

  /* -------------------------------------------------------
     6. ADHESION — Biological Adhesion Beyond Gecko
     ------------------------------------------------------- */
  {
    id: "adhesion",
    icon: "⬡",
    label: "Bio-Adhesion",
    intro: `
      <p>While gecko adhesion captures headlines, nature has evolved many other adhesion systems, each adapted
      to different environments. <strong>Mussels</strong> anchor to wet, salt-sprayed rocks using DOPA-containing
      proteins. <strong>Tree frogs</strong> maintain grip on rain-slicked leaves via toe pads that channel fluid
      films. <strong>Barnacles</strong> produce the strongest natural cement known. <strong>Insects</strong> combine
      hairy pads with fluid secretions for versatile adhesion on rough surfaces.</p>
      <h3>Adhesion Mechanisms in Nature</h3>
      <ul>
        <li><strong>DOPA Chemistry (Mussel)</strong> &mdash; 3,4-dihydroxyphenylalanine forms covalent and coordination bonds with virtually any surface, even underwater.</li>
        <li><strong>Wet Adhesion (Tree Frog)</strong> &mdash; Hexagonal epithelial cells separated by mucus-filled channels create viscous and hydrodynamic adhesion on wet substrates.</li>
        <li><strong>Barnacle Cement</strong> &mdash; A multi-protein complex that displaces water, cross-links, and cures into an adhesive stronger than commercial epoxy.</li>
        <li><strong>Insect Tarsal Pads</strong> &mdash; Fibrillar or smooth pads combined with thin liquid films producing capillary and viscous adhesion.</li>
      </ul>
      <p>These natural adhesives inspire surgical glues, underwater repair compounds, and reversible bonding
      technologies that work in conditions where synthetic adhesives fail.</p>
    `,
    subsections: [
      {
        title: "Mussel-Inspired Adhesives",
        items: [
          {
            title: "Mussel-Inspired Surface Chemistry for Multifunctional Coatings",
            author: "Haeshin Lee, Shara M. Dellatore, William M. Miller & Phillip B. Messersmith",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1126/science.1147241",
            desc: "Landmark 2007 Science paper showing polydopamine can coat virtually any surface, launched the field of mussel-inspired surface chemistry."
          },
          {
            title: "Mussel Adhesive Protein Mimetic Polymers",
            author: "Bruce P. Lee, Phillip B. Messersmith, Jeffrey N. Israelachvili & Jacob H. Waite",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1146/annurev-matsci-062910-100429",
            desc: "Annual Review of Materials Research on the chemistry of mussel foot proteins and synthetic DOPA-containing polymer design."
          },
          {
            title: "Polydopamine Surface Modification — Protocols",
            author: "Various contributors",
            type: "code",
            level: "intermediate",
            url: "https://github.com/topics/polydopamine",
            desc: "GitHub repositories with polydopamine coating protocols, XPS analysis scripts, and adhesion testing data processing tools."
          },
          {
            title: "How Mussels Stick to Anything (Deep Look / KQED)",
            author: "Deep Look / KQED",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=SDXkLLMYtCc",
            desc: "Beautiful short documentary on mussel byssus threads, DOPA chemistry, and how scientists are mimicking mussel glue."
          }
        ]
      },
      {
        title: "Tree Frog & Wet Adhesion",
        items: [
          {
            title: "Tree Frog Toe Pads: Mechanisms of Wet Adhesion",
            author: "W. Jon P. Barnes et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1098/rsif.2013.0234",
            desc: "Journal of the Royal Society Interface paper elucidating how tree frog pads use structured channels and mucus for grip on wet surfaces."
          },
          {
            title: "Wet Adhesion with No Adhesive: How Tree Frogs Stick",
            author: "Thomas Endlein et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1098/rspb.2012.2569",
            desc: "Proc. Royal Society B study using interferometry to reveal the thin fluid film dynamics underlying tree frog adhesion."
          },
          {
            title: "Bio-Inspired Wet Adhesive Surfaces — Fabrication",
            author: "Longjian Xue et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/adma.201104614",
            desc: "Advanced Materials paper on micropillar arrays with hexagonal tips mimicking tree frog toe pad geometry for wet adhesion."
          }
        ]
      },
      {
        title: "Underwater & Surgical Adhesives",
        items: [
          {
            title: "A Tissue Adhesive Inspired by Mussel and Gecko",
            author: "Phillip B. Messersmith et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nature06089",
            desc: "Nature paper combining gecko-inspired nanopillars with mussel-inspired DOPA coating to create a reversible wet/dry tissue adhesive."
          },
          {
            title: "Tough Adhesives for Diverse Wet Surfaces",
            author: "Jianyu Li et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1126/science.aah6362",
            desc: "Science paper introducing a slug-inspired tough adhesive that bonds strongly to wet biological tissues for surgical applications."
          },
          {
            title: "Barnacle Cement: The Strongest Bioadhesive",
            author: "Nick Aldred & Anthony S. Clare",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1088/1748-3182/3/4/046002",
            desc: "Bioinspiration & Biomimetics review on barnacle cement proteins, their water-displacement mechanism, and potential as surgical adhesive templates."
          },
          {
            title: "Bio-Inspired Surgical Glues (Nature Video)",
            author: "Nature Video",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=e7pMO8MvnWU",
            desc: "Nature journal video explaining how slug mucus and mussel proteins are inspiring a new generation of surgical tissue adhesives."
          }
        ]
      }
    ]
  },

  /* -------------------------------------------------------
     7. CHARACTERIZATION — Surface Characterization Tools
     ------------------------------------------------------- */
  {
    id: "characterization",
    icon: "△",
    label: "Characterization",
    intro: `
      <p>Studying biological surfaces requires a toolkit that spans from optical microscopy to atomic-scale
      probing. <strong>Contact angle goniometry</strong> quantifies wettability, <strong>atomic force microscopy
      (AFM)</strong> maps nanoscale topography and adhesion forces, <strong>scanning electron microscopy (SEM)</strong>
      reveals hierarchical micro/nanostructure, and <strong>tribometers</strong> measure friction and wear.
      Mastering these techniques is essential for anyone characterizing natural or biomimetic surfaces.</p>
      <h3>Core Characterization Techniques</h3>
      <ul>
        <li><strong>Contact Angle Goniometry</strong> &mdash; Measures static, advancing, and receding contact angles to determine surface energy and wettability state.</li>
        <li><strong>Atomic Force Microscopy (AFM)</strong> &mdash; Nanoscale topography and force spectroscopy, capable of measuring adhesion at the single-seta or single-spatula level.</li>
        <li><strong>Scanning Electron Microscopy (SEM)</strong> &mdash; High-resolution imaging of surface microstructure; cryo-SEM preserves hydrated biological specimens.</li>
        <li><strong>Tribology</strong> &mdash; Study of friction, wear, and lubrication; micro-tribometers measure forces on bio-surface specimens.</li>
        <li><strong>Profilometry</strong> &mdash; Optical (confocal, white-light interferometry) and stylus methods to quantify surface roughness parameters.</li>
      </ul>
      <p>This section collects resources on instrumentation, protocols, and open-source analysis software for
      biological surface research.</p>
    `,
    subsections: [
      {
        title: "Microscopy & Imaging",
        items: [
          {
            title: "Scanning Probe Microscopy of Biological Structures",
            author: "Bharat Bhushan",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-642-15263-4",
            desc: "Springer monograph on AFM techniques applied to biological surfaces, including force-distance measurements on gecko setae and lotus leaves."
          },
          {
            title: "SEM Imaging of Biological Surfaces (Royal Microscopical Society)",
            author: "Royal Microscopical Society",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=GY9lfO-tVfE",
            desc: "Tutorial video on preparing and imaging biological surfaces in SEM, including critical-point drying and sputter coating techniques."
          },
          {
            title: "Gwyddion — Open Source SPM Data Analysis",
            author: "David Necas & Petr Klapetek",
            type: "code",
            level: "intermediate",
            url: "http://gwyddion.net/",
            desc: "Free, open-source software for SPM (AFM, STM) data visualization and analysis, widely used in biological surface characterization."
          },
          {
            title: "ImageJ/Fiji for Surface Analysis",
            author: "NIH / Fiji contributors",
            type: "code",
            level: "beginner",
            url: "https://github.com/fiji/fiji",
            desc: "Open-source image processing platform with plugins for contact angle measurement, roughness analysis, and SEM image quantification."
          }
        ]
      },
      {
        title: "Wettability Measurement",
        items: [
          {
            title: "Contact Angle, Wettability and Adhesion (Mittal, Ed.)",
            author: "K. L. Mittal (Ed.)",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1201/b18470",
            desc: "Definitive CRC Press volume on contact angle measurement theory and practice, including sessile drop, captive bubble, and Wilhelmy plate methods."
          },
          {
            title: "Measurement of Contact Angles: A Critical Review",
            author: "A. Marmur & E. Bittoun",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1146/annurev-matsci-062910-100349",
            desc: "Annual Review critiquing common errors in contact angle measurement and providing guidelines for reporting superhydrophobic surface data."
          },
          {
            title: "OpenDrop — Open Source Contact Angle Analysis",
            author: "Various contributors",
            type: "code",
            level: "intermediate",
            url: "https://github.com/CrackingPacking/OpenDrop",
            desc: "Python-based open-source tool for pendant drop and sessile drop contact angle analysis from camera images."
          },
          {
            title: "How to Measure Contact Angle (Tutorial)",
            author: "Biolin Scientific",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=4G2gXaMhPGE",
            desc: "Instrument manufacturer tutorial on setting up sessile drop measurements, interpreting advancing/receding angles, and avoiding common pitfalls."
          }
        ]
      },
      {
        title: "Surface Mechanics Testing",
        items: [
          {
            title: "Nanotribology and Nanomechanics",
            author: "Bharat Bhushan",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-642-15263-4_15",
            desc: "Comprehensive Springer reference on micro/nano-tribology methods used to characterize friction and adhesion on biological surfaces."
          },
          {
            title: "AFM Force Spectroscopy on Biological Adhesives",
            author: "Markus Valtiner et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1021/la300684q",
            desc: "Langmuir paper demonstrating AFM-based single-molecule force spectroscopy on mussel adhesive proteins and DOPA-surface interactions."
          },
          {
            title: "Tribology Testing of Bio-Inspired Surfaces (JoVE)",
            author: "Journal of Visualized Experiments",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=LD6RFyAXh_c",
            desc: "JoVE protocol video on using micro-tribometers to measure friction coefficients on textured bio-inspired polymer surfaces."
          },
          {
            title: "Python Tribology — Computational Tools",
            author: "Various contributors",
            type: "code",
            level: "intermediate",
            url: "https://github.com/topics/tribology",
            desc: "GitHub topic collecting Python libraries and Jupyter notebooks for tribological data analysis, contact mechanics, and surface roughness computation."
          }
        ]
      }
    ]
  }

];

/* ============================================================
   RENDERING ENGINE
   ============================================================ */

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
