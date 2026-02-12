/* ===================================================================
   BIOLOGICAL LOCOMOTION — Curated Reference Hub
   How organisms move and how engineers learn from nature
   =================================================================== */

const SECTIONS = [

/* ---------------------------------------------------------------
   1. OVERVIEW — Introduction to Biological Locomotion
   --------------------------------------------------------------- */
{
  id: "overview",
  icon: "◇",
  label: "Overview",
  intro: `
    <p>Biological locomotion is the study of how living organisms move through their
    environments&mdash;running across savannas, soaring through turbulent air, gliding
    through abyssal waters, or burrowing through soil. The field sits at the intersection
    of physics, biology, and engineering, drawing on fluid mechanics, solid mechanics,
    neuroscience, and evolutionary biology to explain the staggering diversity of
    movement strategies evolved over 600&nbsp;million years.</p>
    <ul>
      <li><strong>Scaling laws</strong> &mdash; Body size governs nearly every aspect of locomotion:
      stride frequency, metabolic cost, Reynolds number, and maximum speed all obey
      power-law relationships with mass.</li>
      <li><strong>Energetics</strong> &mdash; The cost of transport (energy per unit mass per
      unit distance) varies by orders of magnitude across swimming, flying, and running,
      shaping ecological strategies and body plans.</li>
      <li><strong>Diversity of strategies</strong> &mdash; From jet-propelled squid to
      undulating snakes, from hovering hummingbirds to brachiation in gibbons, evolution
      has explored a vast locomotor design space constrained by physics and phylogeny.</li>
      <li><strong>Bio-inspiration</strong> &mdash; Understanding biological locomotion
      directly informs the design of robots, vehicles, prosthetics, and energy-harvesting
      devices that aim to match nature's efficiency and adaptability.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Foundational Texts",
      items: [
        {
          title: "Principles of Animal Locomotion",
          author: "R. McNeill Alexander",
          type: "book",
          level: "intermediate",
          url: "https://press.princeton.edu/books/paperback/9780691126340/principles-of-animal-locomotion",
          desc: "The definitive overview of how animals run, walk, jump, crawl, swim, soar, hover, and fly, covering mechanisms and energetics across all major locomotor modes."
        },
        {
          title: "Animal Locomotion (2nd Edition)",
          author: "Andrew A. Biewener & Sheila N. Patek",
          type: "book",
          level: "intermediate",
          url: "https://biology.duke.edu/books/animal-locomotion-2nd-edition",
          desc: "Integrates biomechanics, physiology, energetics, and neural control of locomotion with new content on non-vertebrate systems and bio-inspired robotics."
        },
        {
          title: "Animal Locomotion: Physical Principles and Adaptations",
          author: "Malcolm S. Gordon et al.",
          type: "book",
          level: "advanced",
          url: "https://www.routledge.com/Animal-Locomotion-Physical-Principles-and-Adaptations/Gordon-Blickhan-Dabiri-Videler/p/book/9780367657956",
          desc: "A professional-level review summarizing the current understanding of macroscopic metazoan animal movement, covering physical principles and evolutionary adaptations."
        },
        {
          title: "Scaling: Why is Animal Size So Important?",
          author: "Knut Schmidt-Nielsen",
          type: "book",
          level: "beginner",
          url: "https://www.cambridge.org/core/books/scaling/9742A68BC9691FDCB14810AE74F89C8D",
          desc: "A classic introduction to allometric scaling in biology, explaining how body size governs metabolic rate, locomotion cost, stride frequency, and structural design."
        },
        {
          title: "How Animals Work",
          author: "Knut Schmidt-Nielsen",
          type: "book",
          level: "beginner",
          url: "https://www.cambridge.org/core/books/how-animals-work/6641128B9EFC5AEDC3125354A7C0597F",
          desc: "A lucid introduction to comparative physiology covering respiration, circulation, energy supply, and locomotion energetics in relation to body size and environment."
        }
      ]
    },
    {
      title: "Introductory Lectures",
      items: [
        {
          title: "Biomechanics of Movement (Stanford Course Materials)",
          author: "Thomas K. Uchida & Scott L. Delp",
          type: "course",
          level: "intermediate",
          url: "https://biomech.stanford.edu/",
          desc: "Open course materials from Stanford ME 281 including lecture slides and videos, using simple models to study walking, running, and musculoskeletal mechanics."
        },
        {
          title: "Bipedalism: The Science of Upright Walking",
          author: "Dartmouth College (Coursera)",
          type: "course",
          level: "beginner",
          url: "https://www.coursera.org/specializations/bipedalism-the-science-of-upright-walking",
          desc: "An interdisciplinary specialization exploring human bipedal locomotion through anthropology, biomechanics, anatomy, evolution, and paleontology."
        },
        {
          title: "The Science of Movement Specialization",
          author: "University of Colorado Boulder (Coursera)",
          type: "course",
          level: "beginner",
          url: "https://www.coursera.org/specializations/science-of-movement",
          desc: "Three-course series covering how the nervous system controls muscle forces that drive movement, from neural circuitry to whole-body coordination."
        },
        {
          title: "Molecular, Cellular, and Tissue Biomechanics",
          author: "MIT OpenCourseWare",
          type: "course",
          level: "advanced",
          url: "https://ocw.mit.edu/courses/20-310j-molecular-cellular-and-tissue-biomechanics-spring-2015/",
          desc: "MIT course applying scaling laws and continuum mechanics to biomechanical phenomena from molecular to tissue level, with full lecture notes available."
        }
      ]
    },
    {
      title: "Review Articles",
      items: [
        {
          title: "Locomotion: Energy Cost of Swimming, Flying, and Running",
          author: "Knut Schmidt-Nielsen",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.1126/science.177.4045.222",
          desc: "The seminal 1972 Science paper comparing the cost of transport across swimming, flying, and running, establishing the energetic hierarchy of locomotor modes."
        },
        {
          title: "Mechanics of Animal Movement",
          author: "R. McNeill Alexander",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/j.cub.2005.08.016",
          desc: "A Current Biology primer reviewing the fundamental mechanical principles governing animal movement, from muscle mechanics to whole-body dynamics."
        },
        {
          title: "Animal Robots: The Neuromechanics of Animal Locomotion",
          author: "Pavan Ramdya & Auke Ijspeert",
          type: "notes",
          level: "intermediate",
          url: "https://www.epfl.ch/labs/ramdya-lab/wp-content/uploads/2024/05/RamdyaIjspeert_2023.pdf",
          desc: "A 2023 review bridging neuroscience and robotics, showing how robots can test hypotheses about biological locomotion control and vice versa."
        },
        {
          title: "Animal Locomotion Biomechanics (ISB Tutorial Videos)",
          author: "International Society of Biomechanics",
          type: "video",
          level: "beginner",
          url: "https://isbweb.org/activities/videos/154-tutorials/187-animal-locomotion-biomechanics",
          desc: "Tutorial video series from the International Society of Biomechanics introducing core concepts of animal locomotion research to newcomers."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   2. FLIGHT — Biological Flight & Bio-Inspired Aerodynamics
   --------------------------------------------------------------- */
{
  id: "flight",
  icon: "◈",
  label: "Flight",
  intro: `
    <p>Biological flight has evolved independently at least four times&mdash;in insects,
    pterosaurs, birds, and bats&mdash;each lineage solving the same aerodynamic
    challenges with remarkably different morphologies. Understanding these solutions
    has revolutionized our knowledge of unsteady aerodynamics and inspired a new
    generation of flapping-wing micro air vehicles (MAVs).</p>
    <ul>
      <li><strong>Leading-edge vortices (LEVs)</strong> &mdash; Insects and hummingbirds
      exploit stable vortices on the wing's leading edge to generate lift far beyond
      what steady-state aerodynamics would predict.</li>
      <li><strong>Wing morphing</strong> &mdash; Birds and bats dynamically change wing
      shape, camber, and sweep during flight, enabling agile maneuvers and efficient
      cruising that rigid-wing aircraft cannot match.</li>
      <li><strong>Flapping kinematics</strong> &mdash; Stroke amplitude, frequency, angle
      of attack, and wing rotation timing interact to produce thrust, lift, and
      torques for control across hovering, forward flight, and turning.</li>
      <li><strong>Micro air vehicles</strong> &mdash; Engineers are translating insect and
      bird flight principles into centimeter-scale flying robots for search-and-rescue,
      environmental monitoring, and pollination.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Insect Aerodynamics",
      items: [
        {
          title: "Wing Rotation and the Aerodynamic Basis of Insect Flight",
          author: "Michael H. Dickinson, Fritz-Olaf Lehmann & Sanjay P. Sane",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1126/science.284.5422.1954",
          desc: "The landmark 1999 Science paper identifying three distinct mechanisms of insect lift generation: delayed stall, rotational circulation, and wake capture."
        },
        {
          title: "The Aerodynamics of Insect Flight",
          author: "Sanjay P. Sane",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1242/jeb.00663",
          desc: "Comprehensive 2003 review in the Journal of Experimental Biology surveying the unsteady aerodynamic mechanisms that allow insects to hover and maneuver."
        },
        {
          title: "Distinct Aerodynamics of Insect-Scale Flight",
          author: "Csaba Hefler, Chang-kwon Kang, Huihe Qiu & Wei Shyy",
          type: "book",
          level: "advanced",
          url: "https://www.cambridge.org/core/books/distinct-aerodynamics-of-insectscale-flight/F31009849C52FFBB8316411BB19B50F3",
          desc: "Cambridge monograph examining the unique aerodynamic phenomena at insect-relevant Reynolds numbers, including LEV stability and clap-and-fling mechanisms."
        },
        {
          title: "Insects Take Flight: Slow-Motion Footage (Ant Lab)",
          author: "Adrian Smith (Ant Lab)",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=NmyMnQR7KwA",
          desc: "Stunning 3200 fps slow-motion footage of 23 insect species taking flight, revealing the diversity of wing kinematics across taxonomic orders."
        }
      ]
    },
    {
      title: "Bird & Bat Flight",
      items: [
        {
          title: "Aerodynamics, Evolution and Ecology of Avian Flight",
          author: "Anders Hedenstrom",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/S0169-5347(02)02440-4",
          desc: "A Trends in Ecology & Evolution review linking aerodynamic theory with ecological and evolutionary perspectives on bird flight performance."
        },
        {
          title: "The Biophysics of Bird Flight: Functional Relationships",
          author: "Douglas Altshuler et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1139/cjz-2015-0103",
          desc: "Integrates aerodynamics, morphology, kinematics, muscle physiology, and sensory biology into a unified framework for understanding avian flight."
        },
        {
          title: "Advances in the Study of Bat Flight: The Wing and the Wind",
          author: "Sharon Swartz & Kenneth Breuer",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1139/cjz-2015-0117",
          desc: "Reviews how bat wing flexibility, membrane dynamics, and hair-based sensing produce flight capabilities distinct from birds, including rapid maneuvers."
        },
        {
          title: "Biomechanics and Biomimetics in Insect-Inspired Flight Systems",
          author: "Richard Bomphrey et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1098/rstb.2015.0390",
          desc: "Philosophical Transactions review connecting insect and bird flight biomechanics to engineering design principles for bio-inspired aircraft."
        }
      ]
    },
    {
      title: "Micro Air Vehicles",
      items: [
        {
          title: "RoboBees: Autonomous Flying Microrobots",
          author: "Robert J. Wood (Harvard Wyss Institute)",
          type: "notes",
          level: "intermediate",
          url: "https://wyss.harvard.edu/technology/robobees-autonomous-flying-microrobots/",
          desc: "Overview of the Harvard RoboBee project: an 80 mg flapping-wing MAV achieving controlled flight with piezoelectric actuators at 120 Hz wing beat frequency."
        },
        {
          title: "Sticking the Landing: Insect-Inspired Landing for Flapping-Wing MAVs",
          author: "Kevin Chen et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1126/scirobotics.adq3059",
          desc: "A 2025 Science Robotics paper demonstrating controlled, safe landing on natural terrain using the RoboBee platform and insect-inspired strategies."
        },
        {
          title: "A Review of Flapping-Wing Robots: Recent Progress and Challenges",
          author: "Saeed Rafee Nekoo et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1177/02783649251343638",
          desc: "A 2025 review in the International Journal of Robotics Research surveying the state of the art in flapping-wing robot design, control, and autonomy."
        },
        {
          title: "Flapping Wing MAV Kinematics, Membranes, and Mechanisms",
          author: "T.N. Pornsin-Sirirak et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/S1000-9361(16)30097-8",
          desc: "Reviews ornithopter and insect-inspired flapping mechanisms, covering membrane wing design, kinematic modeling, and propulsive efficiency."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   3. SWIMMING — Aquatic Locomotion
   --------------------------------------------------------------- */
{
  id: "swimming",
  icon: "∿",
  label: "Swimming",
  intro: `
    <p>Water is roughly 800 times denser than air, and aquatic locomotion is shaped
    by this fundamental physical fact. Fish, marine mammals, cephalopods, and jellyfish
    have evolved an extraordinary range of propulsion strategies&mdash;from the
    high-efficiency thunniform swimming of tuna to the pulsatile jetting of jellyfish.
    Understanding these mechanisms informs the design of bio-inspired underwater vehicles
    that promise greater efficiency and maneuverability than propeller-driven craft.</p>
    <ul>
      <li><strong>BCF vs. MPF swimming</strong> &mdash; Body-and-caudal-fin (BCF) swimming
      uses trunk and tail undulation for high-speed cruising, while median-and-paired-fin
      (MPF) swimming enables precise low-speed maneuvering in complex habitats.</li>
      <li><strong>Vortex dynamics</strong> &mdash; Fish and cetaceans shed organized vortex
      rings and reverse K&aacute;rm&aacute;n streets to generate thrust efficiently; the
      Strouhal number governs optimal propulsive kinematics.</li>
      <li><strong>Jellyfish efficiency</strong> &mdash; Jellyfish achieve the lowest known
      cost of transport among metazoans through passive energy recapture during bell
      relaxation.</li>
      <li><strong>Underwater robotics</strong> &mdash; Bio-inspired AUVs mimic fish body
      waves, cetacean flukes, and jellyfish pulsation to achieve efficient, quiet, and
      maneuverable underwater locomotion.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Fish Hydrodynamics",
      items: [
        {
          title: "Hydrodynamics of Fishlike Swimming",
          author: "Michael S. Triantafyllou, George S. Triantafyllou & Dick K.P. Yue",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1146/annurev.fluid.32.1.33",
          desc: "The authoritative Annual Review of Fluid Mechanics article on fish propulsion, covering vortex wake dynamics, Strouhal number optimization, and thrust generation."
        },
        {
          title: "Fish Locomotion: An Eco-Ethological Perspective",
          author: "Paolo Domenici & B.G. Kapoor (Eds.)",
          type: "book",
          level: "intermediate",
          url: "https://doi.org/10.1201/b10190",
          desc: "Edited volume linking fish swimming biomechanics to ecology and behavior, covering fast-start escapes, sustained cruising, and environmental adaptations."
        },
        {
          title: "Numerical Investigation of Carangiform Swimming Hydrodynamics",
          author: "Iman Borazjani & Fotis Sotiropoulos",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1242/jeb.015644",
          desc: "Journal of Experimental Biology paper using high-fidelity CFD to simulate carangiform swimming across transitional and inertial flow regimes."
        },
        {
          title: "Multi-Body Hydrodynamic Interactions in Fish-Like Swimming",
          author: "Melike Kurt et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1115/1.4062219",
          desc: "ASME Applied Mechanics Reviews paper examining how multiple fish interact hydrodynamically during schooling, with implications for efficient formation swimming."
        }
      ]
    },
    {
      title: "Marine Mammal & Jellyfish Locomotion",
      items: [
        {
          title: "Hydrodynamic Flow Control in Marine Mammals",
          author: "Frank E. Fish",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1093/icb/icn029",
          desc: "Integrative and Comparative Biology review of how cetaceans, pinnipeds, and sirenians use flippers, flukes, and body morphology for hydrodynamic flow control."
        },
        {
          title: "Passive Cambering and Flexible Propulsors: Cetacean Flukes",
          author: "Frank E. Fish et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1088/1748-3182/1/4/S12",
          desc: "Bioinspiration & Biomimetics paper analyzing how the passive flexibility of dolphin and whale flukes contributes to propulsive efficiency and thrust modulation."
        },
        {
          title: "Passive Energy Recapture in Jellyfish Contributes to Propulsive Advantage",
          author: "Brad J. Gemmell et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1073/pnas.1306983110",
          desc: "PNAS paper showing that Aurelia aurita recaptures energy during bell relaxation, traveling 30% further per cycle and achieving the lowest metazoan cost of transport."
        },
        {
          title: "Suction-Based Propulsion as a Basis for Efficient Animal Swimming",
          author: "Brad J. Gemmell, Sean P. Colin & John O. Dabiri",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/ncomms9790",
          desc: "Nature Communications paper revealing that suction-based propulsion, not jet thrust, is the primary mechanism in jellyfish and lamprey swimming."
        }
      ]
    },
    {
      title: "Bio-Inspired Underwater Vehicles",
      items: [
        {
          title: "Tuna Robotics: A High-Frequency Experimental Platform",
          author: "Hilary Bart-Smith et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/scirobotics.aax4615",
          desc: "Science Robotics paper on the Tunabot, a 255 mm robotic fish achieving 4.0 body lengths per second at 15 Hz tail-beat, closely matching real tuna kinematics."
        },
        {
          title: "A Review of Developments Towards Biologically Inspired Propulsion for AUVs",
          author: "D.T. Roper et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1177/1475090210397438",
          desc: "Reviews the engineering of bio-inspired propulsion systems for autonomous underwater vehicles, comparing fish-like undulation, flapping fins, and jet propulsion."
        },
        {
          title: "A Versatile Jellyfish-Like Robotic Platform for Underwater Propulsion",
          author: "Tianlu Wang et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/sciadv.adg0292",
          desc: "Science Advances paper presenting a soft jellyfish robot with effective underwater propulsion and manipulation capabilities inspired by medusa kinematics."
        },
        {
          title: "Biomimetic Robotic Fish-Type Submersible: Status and Challenges",
          author: "Multiple authors",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.34133/olar.0036",
          desc: "Comprehensive review of current technical challenges in developing fish-type submersible robots, covering actuation, sensing, control, and hydrodynamic design."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   4. TERRESTRIAL — Walking, Running, Jumping, Climbing
   --------------------------------------------------------------- */
{
  id: "terrestrial",
  icon: "⊕",
  label: "Terrestrial",
  intro: `
    <p>Terrestrial locomotion on legs is one of the most mechanically complex forms
    of animal movement. From the spring-mass dynamics of running cockroaches to the
    inverted-pendulum gait of walking humans, legged animals must continuously manage
    balance, ground reaction forces, and energy storage while navigating uneven terrain.
    Central pattern generators in the spinal cord coordinate limb rhythms, while sensory
    feedback enables real-time adaptation.</p>
    <ul>
      <li><strong>Spring-loaded inverted pendulum (SLIP)</strong> &mdash; A unifying
      template for running gaits across species: the leg acts as a compliant spring
      redirecting the center of mass in a series of ballistic arcs.</li>
      <li><strong>Central pattern generators (CPGs)</strong> &mdash; Neural oscillator
      circuits in the spinal cord generate rhythmic locomotor patterns that can be
      modulated by descending commands and sensory feedback.</li>
      <li><strong>Gecko adhesion</strong> &mdash; Van der Waals forces between billions of
      nanoscale spatulae enable geckos to climb smooth vertical surfaces, inspiring
      dry adhesive technologies.</li>
      <li><strong>Power-amplified jumps</strong> &mdash; Fleas, froghoppers, and mantis
      shrimp use latch-mediated spring actuation (LaMSA) to achieve accelerations
      exceeding 100&nbsp;g, far beyond what muscles alone can produce.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Legged Locomotion Principles",
      items: [
        {
          title: "Central Pattern Generators for Locomotion Control in Animals and Robots: A Review",
          author: "Auke Jan Ijspeert",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/j.neunet.2008.03.014",
          desc: "Comprehensive Neural Networks review covering biological CPGs and their implementation as coupled oscillators for controlling locomotion in articulated robots."
        },
        {
          title: "Biomechanics of Mammalian Terrestrial Locomotion",
          author: "Andrew A. Biewener",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/science.250.4984.1097",
          desc: "Science paper examining how mammals from mice to elephants modulate limb posture, muscle mechanics, and skeletal loading to locomote across a 10,000-fold mass range."
        },
        {
          title: "Templates and Anchors: Neuromechanical Hypotheses of Legged Locomotion on Land",
          author: "Robert J. Full & Daniel E. Koditschek",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1242/jeb.202.23.3325",
          desc: "Foundational paper proposing that simple mechanical templates (like SLIP) capture the dynamics of running, while anchors add neuromechanical detail."
        },
        {
          title: "Biomechanics of Movement (Textbook)",
          author: "Thomas K. Uchida & Scott L. Delp",
          type: "book",
          level: "intermediate",
          url: "https://biomech.stanford.edu/",
          desc: "Stanford textbook presenting conceptual biomechanical models for walking and running, integrating musculoskeletal anatomy with mechanical analysis."
        }
      ]
    },
    {
      title: "Climbing & Adhesion",
      items: [
        {
          title: "Adhesive Force of a Single Gecko Foot-Hair",
          author: "Kellar Autumn et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/35015073",
          desc: "The landmark 2000 Nature paper measuring the adhesive force of individual gecko setae, revealing that van der Waals forces alone explain gecko adhesion."
        },
        {
          title: "Gecko Adhesion as a Model System for Integrative Biology",
          author: "Kellar Autumn et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1146/annurev-ecolsys-120213-091839",
          desc: "Annual Review of Ecology, Evolution, and Systematics paper reviewing gecko adhesion as a model for interdisciplinary science and bio-inspired engineering."
        },
        {
          title: "Adhesion and Friction in Gecko Toe Attachment and Detachment",
          author: "Bing Zhao et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1073/pnas.0608841103",
          desc: "PNAS paper analyzing the micromechanics of how geckos rapidly switch between attachment and detachment through toe hyperextension and peeling angles."
        },
        {
          title: "Gecko-Inspired Controllable Adhesive: Structure, Fabrication, and Application",
          author: "Multiple authors",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.3390/biomimetics9030149",
          desc: "A 2024 review of synthetic gecko-inspired adhesives covering micro/nanostructure fabrication methods and applications in robotics and manufacturing."
        }
      ]
    },
    {
      title: "Jumping & Rapid Movement",
      items: [
        {
          title: "A Physical Model of Mantis Shrimp for Exploring Ultrafast Systems",
          author: "Jacob S. Harrison et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1073/pnas.2026833118",
          desc: "PNAS paper presenting a physical model of the mantis shrimp strike mechanism, achieving forces over 1500 N through latch-mediated spring actuation."
        },
        {
          title: "Biomechanics: Froghopper Insects Leap to New Heights",
          author: "Malcolm Burrows",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/424509a",
          desc: "Nature paper demonstrating that froghoppers are the champion insect jumpers, using catapult mechanisms in the pleural arch to produce extraordinary accelerations."
        },
        {
          title: "The Jumping Mechanism of Flea Beetles and Its Application to Bionics",
          author: "Konstantin Nadein & Oliver Betz",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.3390/biomimetics5010011",
          desc: "Biomimetics paper analyzing the elastic energy storage and release mechanism in flea beetle legs with preliminary designs for a robotic jumping leg."
        },
        {
          title: "The Power of the Mantis Shrimp Strike (Smarter Every Day)",
          author: "Destin Sandlin",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=E0Li1k5hGBE",
          desc: "Engaging high-speed video exploration of the mantis shrimp's extraordinary appendage strike, explaining the latch-spring mechanism behind its power."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   5. SOFT BODY — Soft-Bodied Locomotion
   --------------------------------------------------------------- */
{
  id: "softbody",
  icon: "≈",
  label: "Soft Body",
  intro: `
    <p>Soft-bodied organisms&mdash;worms, caterpillars, snails, octopuses&mdash;move
    without rigid skeletons, using muscular hydrostats and hydrostatic skeletons to
    generate force and transmit it to the environment. These animals can squeeze through
    tight spaces, conform to irregular surfaces, and exhibit a continuum of body
    deformations impossible for rigid-bodied creatures. Their mechanics have become
    the foundation of the rapidly growing field of soft robotics.</p>
    <ul>
      <li><strong>Peristalsis</strong> &mdash; Earthworms and caterpillars propagate
      waves of muscle contraction along their bodies, using alternating anchor points
      to ratchet forward against friction or substrate compliance.</li>
      <li><strong>Muscular hydrostats</strong> &mdash; Octopus arms and elephant trunks
      are organs composed entirely of muscle that can bend, twist, elongate, and stiffen
      without any skeletal support.</li>
      <li><strong>Pedal waves</strong> &mdash; Snails generate locomotion through
      traveling waves of contraction in the foot sole, lubricated by shear-thinning
      mucus that acts as both adhesive and lubricant.</li>
      <li><strong>Soft robotics</strong> &mdash; Engineers use pneumatic actuators,
      dielectric elastomers, and shape-memory alloys to build robots inspired by
      soft-bodied animals, achieving compliance and adaptability unmatched by rigid
      machines.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Worm & Caterpillar Movement",
      items: [
        {
          title: "Mechanics of Peristaltic Locomotion and Role of Anchoring",
          author: "Wendy Zhang et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1098/rsif.2011.0386",
          desc: "Journal of the Royal Society Interface paper modeling peristaltic crawling mechanics, showing how anchor zones and body elasticity determine locomotion speed and efficiency."
        },
        {
          title: "Caterpillar-Inspired Soft Crawling Robot with Programmable Thermal Actuation",
          author: "Shuang Wu et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/sciadv.adf8014",
          desc: "Science Advances paper presenting a soft robot with distributed thermal actuators mimicking caterpillar wave locomotion across varied terrain."
        },
        {
          title: "An Earthworm-Like Modular Soft Robot for Multi-Terrain Locomotion",
          author: "Multiple authors",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/s41598-023-28873-w",
          desc: "Scientific Reports paper demonstrating a modular peristaltic robot that adapts to pipes, flat surfaces, and inclines by adjusting wave parameters."
        }
      ]
    },
    {
      title: "Cephalopod Locomotion",
      items: [
        {
          title: "Soft Robot Arm Inspired by the Octopus",
          author: "Cecilia Laschi et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1163/156855312X626343",
          desc: "Advanced Robotics paper describing the design and control of a soft robotic arm that replicates the bending, elongation, and stiffening of octopus arms."
        },
        {
          title: "Soft Robotics: A Bioinspired Evolution in Robotics",
          author: "Sangbae Kim, Cecilia Laschi & Barry Trimmer",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/j.tibtech.2013.03.002",
          desc: "Trends in Biotechnology review of how octopus, caterpillar, and worm locomotion principles are driving a paradigm shift from rigid to soft robotic systems."
        },
        {
          title: "Fundamentals of Soft Robot Locomotion",
          author: "Carmel Majidi",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1098/rsif.2017.0101",
          desc: "Journal of the Royal Society Interface paper establishing a theoretical framework for soft robot locomotion, covering continuum mechanics and material nonlinearity."
        },
        {
          title: "Bioinspired Locomotion and Grasping: The Soft Eight-Arm OCTOPUS Robot",
          author: "Cecilia Laschi et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1088/1748-3190/10/3/035003",
          desc: "Bioinspiration & Biomimetics paper on the OCTOPUS robot, a fully soft underwater robot with eight silicone arms for locomotion and grasping in water."
        }
      ]
    },
    {
      title: "Soft Robotic Applications",
      items: [
        {
          title: "Gym-SoftRobot: OpenAI Gym Environments for Soft Robots",
          author: "Seung Hyun Kim et al.",
          type: "code",
          level: "intermediate",
          url: "https://github.com/skim0119/gym-softrobot",
          desc: "Open-source Python package providing reinforcement learning gym environments for simulating soft robot locomotion including crawling and swimming gaits."
        },
        {
          title: "SofaGym: Machine Learning Framework for SOFA Simulation",
          author: "SOFA Consortium (Defrost Team)",
          type: "code",
          level: "advanced",
          url: "https://github.com/SofaDefrost/SofaGym",
          desc: "Open-source framework integrating the SOFA physics engine with OpenAI Gym for reinforcement learning of soft robot locomotion and manipulation tasks."
        },
        {
          title: "SoftGym: Benchmarking Deep RL for Deformable Object Manipulation",
          author: "Xingyu Lin et al.",
          type: "code",
          level: "advanced",
          url: "https://github.com/Xingyu-Lin/softgym",
          desc: "Benchmark environments built on Nvidia FleX for developing and comparing algorithms for manipulating and locomoting with deformable soft bodies."
        },
        {
          title: "Low-Power Microelectronics Embedded in Live Jellyfish Enhance Propulsion",
          author: "Nicole W. Xu & John O. Dabiri",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/sciadv.aaz3194",
          desc: "Science Advances paper demonstrating that embedded micro-electronics can triple jellyfish swimming speed, opening a path for biohybrid soft robots."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   6. COLLECTIVE — Collective & Swarm Movement
   --------------------------------------------------------------- */
{
  id: "collective",
  icon: "⬡",
  label: "Collective",
  intro: `
    <p>Some of nature's most awe-inspiring spectacles arise when thousands or millions
    of individuals move as a coordinated whole&mdash;starling murmurations, herring
    schools, army ant raids, bacterial swarms. These collective behaviors emerge from
    simple local interaction rules without centralized control, producing group-level
    patterns that enhance foraging, predator evasion, and migration efficiency.</p>
    <ul>
      <li><strong>Self-organization</strong> &mdash; Global order arises from local
      rules: each individual responds to its nearest neighbors' positions and velocities,
      yet the group exhibits coherent turning, splitting, and reforming.</li>
      <li><strong>Hydrodynamic and aerodynamic benefits</strong> &mdash; Schooling fish
      and flocking birds exploit wake vortices shed by neighbors to reduce their own
      energetic cost of locomotion, analogous to drafting in cycling.</li>
      <li><strong>Stigmergy</strong> &mdash; Ant colonies coordinate foraging trails
      through pheromone deposition: indirect communication via environmental modification
      enables robust, decentralized path optimization.</li>
      <li><strong>Active matter physics</strong> &mdash; Bacterial swarms and cell sheets
      are modeled as active matter systems where energy input at the particle level drives
      non-equilibrium phase transitions and emergent flows.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Schooling & Flocking",
      items: [
        {
          title: "Collective Memory and Spatial Sorting in Animal Groups",
          author: "Iain D. Couzin et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1006/jtbi.2002.3065",
          desc: "Foundational 2002 Journal of Theoretical Biology paper introducing the Couzin model with repulsion, alignment, and attraction zones that produces schooling and milling."
        },
        {
          title: "Hydrodynamic Schooling of Flapping Swimmers",
          author: "Liang Li et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/ncomms9514",
          desc: "Nature Communications paper demonstrating through simulation and experiment that fish in diamond formations gain hydrodynamic energy savings of up to 50%."
        },
        {
          title: "From Behavioural Analyses to Models of Collective Motion in Fish Schools",
          author: "Daniel S. Calovi et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1098/rsfs.2012.0033",
          desc: "Interface Focus paper bridging behavioral experiments with mathematical models, showing how fish adjust speed, turning, and spacing to maintain group cohesion."
        },
        {
          title: "Flocks, Herds, and Schools: A Distributed Behavioral Model",
          author: "Craig W. Reynolds",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1145/37402.37406",
          desc: "The landmark 1987 SIGGRAPH paper introducing the Boids algorithm with three simple rules (separation, alignment, cohesion) that produce realistic flocking behavior."
        }
      ]
    },
    {
      title: "Insect Collective Movement",
      items: [
        {
          title: "A Locally-Blazed Ant Trail Achieves Efficient Collective Navigation",
          author: "Ehud Fonio et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.7554/eLife.20185",
          desc: "eLife paper showing how ant colonies achieve efficient navigation through locally-blazed trails despite limited individual information, using pheromone amplification."
        },
        {
          title: "Surveying a Swarm: Techniques to Examine Bacterial Collective Motion",
          author: "Siobhan A. Brayshaw & Erin S. Gloag",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1128/aem.01853-21",
          desc: "Applied and Environmental Microbiology review of experimental methods for cultivating genuine swarmers and observing collective bacterial motion patterns."
        },
        {
          title: "A Phase Diagram for Bacterial Swarming",
          author: "Iago Grobas et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/s42005-020-0327-1",
          desc: "Communications Physics paper mapping how bacteria shape and density determine emergent swarming phases, connecting biological swarming to active matter physics."
        }
      ]
    },
    {
      title: "Mathematical Models",
      items: [
        {
          title: "Collective States, Multistability, and Transitional Behavior in Schooling Fish",
          author: "Albert B. Kao & Iain D. Couzin",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1371/journal.pcbi.1002915",
          desc: "PLOS Computational Biology paper showing that fish groups exhibit multistability, with multiple collective states coexisting for identical individual behavior."
        },
        {
          title: "Collective Behavior in Animal Groups: Theoretical Models and Empirical Studies",
          author: "Irene Giardina",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.2976/1.2961038",
          desc: "Reviews the Vicsek model and extensions, showing how minimal alignment rules in self-propelled particles produce phase transitions to ordered flocking states."
        },
        {
          title: "Boids: Craig Reynolds' Flocking Simulation",
          author: "Ryan Strauss",
          type: "code",
          level: "beginner",
          url: "https://github.com/rystrauss/boids",
          desc: "Clean Python implementation of Craig Reynolds' Boids algorithm for simulating flocking, schooling, and herding behaviors with adjustable interaction parameters."
        },
        {
          title: "Schools of Fish and Flocks of Birds: Shape and Internal Structure",
          author: "Daniel S. Calovi et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1371/journal.pcbi.1002678",
          desc: "PLOS Computational Biology paper analyzing how self-organized fish schools and bird flocks develop characteristic shapes and density distributions."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   7. TOOLS — Computational Tools & Datasets
   --------------------------------------------------------------- */
{
  id: "tools",
  icon: "⟐",
  label: "Tools",
  intro: `
    <p>Modern research in biological locomotion relies on a powerful computational
    toolkit: computational fluid dynamics to simulate the flows around wings and fins,
    markerless motion capture to track animal kinematics in the field, and musculoskeletal
    modeling software to reconstruct internal forces from external movement data. Many
    of these tools are open source, enabling reproducible science and rapid prototyping.</p>
    <ul>
      <li><strong>CFD for bio-locomotion</strong> &mdash; Immersed boundary methods and
      overset grids handle the moving, deforming boundaries of flapping wings and
      undulating bodies that challenge conventional CFD approaches.</li>
      <li><strong>Markerless pose estimation</strong> &mdash; Deep-learning tools like
      DeepLabCut track animal body points from video without physical markers, enabling
      biomechanical analysis in natural environments.</li>
      <li><strong>Musculoskeletal simulation</strong> &mdash; OpenSim provides a complete
      pipeline from inverse kinematics through muscle-driven forward dynamics, enabling
      researchers to estimate internal forces and test locomotor hypotheses in&nbsp;silico.</li>
      <li><strong>Open datasets</strong> &mdash; Shared datasets of animal kinematics,
      morphology, and biomechanics accelerate discovery and enable benchmarking across
      laboratories.</li>
    </ul>
  `,
  subsections: [
    {
      title: "CFD & Simulation",
      items: [
        {
          title: "IBAMR: Adaptive Immersed Boundary Method Framework",
          author: "Boyce Griffith et al.",
          type: "code",
          level: "advanced",
          url: "https://github.com/IBAMR/IBAMR",
          desc: "Distributed-memory parallel implementation of the immersed boundary method with AMR, widely used for simulating biological fluid-structure interaction in swimming and flying."
        },
        {
          title: "IB2d: Immersed Boundary Method in 2D (MATLAB & Python)",
          author: "Nicholas A. Battista et al.",
          type: "code",
          level: "intermediate",
          url: "https://github.com/nickabattista/IB2d",
          desc: "User-friendly 2D immersed boundary solver with 75+ built-in biological examples including swimming, pumping, and locomotion through fluid."
        },
        {
          title: "OpenSim: Open-Source Musculoskeletal Modeling and Simulation",
          author: "Scott Delp et al. (SimTK)",
          type: "code",
          level: "intermediate",
          url: "https://github.com/opensim-org/opensim-core",
          desc: "Stanford-developed platform for modeling, simulating, and analyzing the neuromusculoskeletal system with inverse kinematics, forward dynamics, and optimal control."
        },
        {
          title: "Review of CFD in Biomimetic Applications for Underwater Vehicles",
          author: "Multiple authors",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.3390/biomimetics9010035",
          desc: "A 2024 Biomimetics review surveying CFD methods applied to bio-inspired underwater vehicle design, covering mesh strategies, turbulence models, and validation."
        }
      ]
    },
    {
      title: "Motion Capture & Analysis",
      items: [
        {
          title: "DeepLabCut: Markerless Pose Estimation for All Animals",
          author: "Alexander Mathis et al.",
          type: "code",
          level: "intermediate",
          url: "https://github.com/DeepLabCut/DeepLabCut",
          desc: "State-of-the-art deep learning toolbox for 2D and 3D markerless pose estimation of any animal, requiring only 50-200 labeled frames for training."
        },
        {
          title: "A Primer on Motion Capture with Deep Learning",
          author: "Alexander Mathis et al.",
          type: "notes",
          level: "beginner",
          url: "https://github.com/DeepLabCut/Primer-MotionCapture",
          desc: "Companion guide to DeepLabCut covering principles, pitfalls, and best practices for applying deep learning to animal motion capture in research."
        },
        {
          title: "OpenSim Creator: A UI for Building OpenSim Models",
          author: "Computational Biomechanics Lab",
          type: "code",
          level: "beginner",
          url: "https://github.com/ComputationalBiomechanicsLab/opensim-creator",
          desc: "Standalone graphical application for building and editing OpenSim musculoskeletal models without programming, available for Windows, Mac, and Linux."
        },
        {
          title: "Awesome Biomechanics: Curated Resource List",
          author: "Luca Modenese et al.",
          type: "data",
          level: "beginner",
          url: "https://github.com/modenaxe/awesome-biomechanics",
          desc: "Community-curated list of biomechanics datasets, processing tools, simulation software, educational videos, and lectures for human and animal motion analysis."
        }
      ]
    },
    {
      title: "Open Datasets",
      items: [
        {
          title: "Awesome Animal Papers: Markerless Animal Motion Capture",
          author: "An Le",
          type: "data",
          level: "intermediate",
          url: "https://github.com/anl13/animal_papers",
          desc: "Curated collection of papers and datasets for markerless animal motion capture and 3D reconstruction, organized by species and method."
        },
        {
          title: "IBAMR Publications and Benchmark Data",
          author: "IBAMR Development Team",
          type: "data",
          level: "advanced",
          url: "https://ibamr.github.io/publications",
          desc: "Publications list with associated benchmark data for immersed boundary simulations of biological fluid dynamics, including cardiac and locomotion problems."
        },
        {
          title: "OpenSim Models and Examples Repository",
          author: "OpenSim Project",
          type: "data",
          level: "intermediate",
          url: "https://simtk.org/projects/opensim",
          desc: "Central repository hosting hundreds of validated musculoskeletal models, example simulations, and locomotion datasets contributed by the biomechanics community."
        },
        {
          title: "SMPL2AddBiomechanics: From 3D Pose to OpenSim Models",
          author: "Marilyn Keller",
          type: "code",
          level: "advanced",
          url: "https://github.com/MarilynKeller/SMPL2AddBiomechanics",
          desc: "Pipeline for converting SMPL body model sequences into OpenSim musculoskeletal models, bridging computer vision motion capture with biomechanical analysis."
        }
      ]
    }
  ]
}

];

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
