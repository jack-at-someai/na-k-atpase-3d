/* ============================================================
   BIO-INSPIRED ROBOTICS — Curated Reference Hub
   ============================================================ */

const SECTIONS = [

/* ──────────────────────────────────────────────
   1. OVERVIEW
   ────────────────────────────────────────────── */
{
  id: "overview",
  icon: "◈",
  label: "Overview",
  intro: `
    <p>Bio-inspired robotics draws on millions of years of evolutionary optimisation
    to produce machines that walk, swim, fly, and grasp with astonishing grace.
    Where classical industrial robots rely on rigid links and precise models,
    biomimetic systems embrace compliance, redundancy, and distributed sensing&mdash;
    principles perfected in nature.</p>
    <ul>
      <li><strong>Biomimetics</strong> &mdash; the abstraction and transfer of design principles found in biological organisms to engineered systems.</li>
      <li><strong>Bio-inspiration vs. Bio-mimicry</strong> &mdash; bio-inspired robots take functional cues from nature without replicating anatomy exactly, while bio-mimicry aims for close morphological fidelity.</li>
      <li><strong>Embodied Intelligence</strong> &mdash; leveraging the body&rsquo;s mechanical properties to simplify control, a concept central to bio-inspired design.</li>
      <li><strong>Evolutionary Robotics</strong> &mdash; using artificial evolution to optimise robot morphologies and controllers, bridging biology and engineering.</li>
    </ul>
    <p>This section collects foundational texts, broad surveys, and introductory
    lectures that orient newcomers to the field.</p>
  `,
  subsections: [
    {
      title: "Foundational Texts",
      items: [
        {
          title: "Bio-Inspired Artificial Intelligence: Theories, Methods, and Technologies",
          author: "Dario Floreano & Claudio Mattiussi",
          type: "book",
          level: "intermediate",
          url: "https://mitpress.mit.edu/9780262062718/bio-inspired-artificial-intelligence/",
          desc: "A comprehensive MIT Press text spanning neural networks, evolutionary computation, and embodied intelligence as they apply to robotics and AI."
        },
        {
          title: "Biorobotics: Using Robots to Emulate and Investigate Agile Animal Locomotion",
          author: "Auke Jan Ijspeert",
          type: "book",
          level: "intermediate",
          url: "https://doi.org/10.1126/science.1254486",
          desc: "Seminal Science review framing biorobotics as a two-way street: robots test biological hypotheses while biology inspires robot design."
        },
        {
          title: "Biomimetics: Biologically Inspired Technologies",
          author: "Yoseph Bar-Cohen (Editor)",
          type: "book",
          level: "intermediate",
          url: "https://www.taylorfrancis.com/books/edit/10.1201/9781420037715/biomimetics-yoseph-bar-cohen",
          desc: "Edited volume covering electroactive polymers, gecko adhesion, and other biomimetic technologies relevant to robotics."
        },
        {
          title: "How the Body Shapes the Way We Think",
          author: "Rolf Pfeifer & Josh Bongard",
          type: "book",
          level: "beginner",
          url: "https://mitpress.mit.edu/9780262162395/how-the-body-shapes-the-way-we-think/",
          desc: "Foundational book on embodied intelligence, arguing that morphology and materials are as important as the controller in bio-inspired robots."
        }
      ]
    },
    {
      title: "Survey Articles",
      items: [
        {
          title: "Robots That Can Adapt Like Animals",
          author: "Antoine Cully, Jeff Clune, Danesh Tarapore & Jean-Baptiste Mouret",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/nature14422",
          desc: "Nature paper presenting the Intelligent Trial-and-Error algorithm that lets damaged robots rapidly adapt, drawing on animal resilience."
        },
        {
          title: "Soft Robotics: Biological Inspiration, State of the Art, and Future Research",
          author: "Daniela Rus & Michael T. Tolley",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1002/adfm.201800712",
          desc: "Comprehensive survey in Advanced Functional Materials covering the landscape of soft robotics and its biological underpinnings."
        },
        {
          title: "Bioinspired Robot Design: A Comprehensive Review",
          author: "Shuai Li et al.",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.3389/frobt.2021.788164",
          desc: "Frontiers in Robotics and AI survey providing a broad taxonomy of bio-inspired robots across locomotion, manipulation, and sensing."
        },
        {
          title: "From Animals to Animats: Simulation of Adaptive Behavior (SAB proceedings)",
          author: "Jean-Arcady Meyer & Stewart W. Wilson",
          type: "notes",
          level: "advanced",
          url: "https://mitpress.mit.edu/9780262631389/from-animals-to-animats/",
          desc: "Proceedings of the foundational SAB conference series where the animat framework bridging ethology and robotics was established."
        }
      ]
    },
    {
      title: "Introductory Lectures",
      items: [
        {
          title: "Bio-Inspired Robotics (ETH Zurich Lecture Series)",
          author: "ETH Zurich / Robert Katzschmann",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=jVJvFGGKuIE",
          desc: "Lecture series from ETH Zurich introducing key concepts in bio-inspired robot design, including soft robotics and locomotion."
        },
        {
          title: "Introduction to Robotics — Stanford CS223A",
          author: "Oussama Khatib",
          type: "course",
          level: "beginner",
          url: "https://see.stanford.edu/Course/CS223A",
          desc: "Stanford lecture series covering classical robotics fundamentals that underpin bio-inspired extensions in kinematics, dynamics, and control."
        },
        {
          title: "Biologically Inspired Robotics — MIT OpenCourseWare",
          author: "MIT OCW",
          type: "course",
          level: "intermediate",
          url: "https://ocw.mit.edu/courses/6-s078-biologically-inspired-robotics-fall-2021/",
          desc: "MIT course exploring how principles from biology can inform the design of robots, covering locomotion, manipulation, and sensing."
        }
      ]
    }
  ]
},

/* ──────────────────────────────────────────────
   2. SOFT ROBOTICS
   ────────────────────────────────────────────── */
{
  id: "soft",
  icon: "∿",
  label: "Soft Robotics",
  intro: `
    <p>Soft robots abandon rigid links in favour of continuously deformable structures
    made from elastomers, gels, and textiles. Inspired by organisms like the octopus,
    earthworm, and elephant trunk, they can squeeze through confined spaces, conform
    to delicate objects, and interact safely with humans.</p>
    <ul>
      <li><strong>Pneumatic Networks (PneuNets)</strong> &mdash; inflatable chambers in elastomeric bodies that produce bending, twisting, and elongation.</li>
      <li><strong>Dielectric Elastomer Actuators (DEAs)</strong> &mdash; electrically driven polymer membranes that expand when voltage is applied, mimicking muscle contraction.</li>
      <li><strong>Shape Memory Alloys (SMAs)</strong> &mdash; metallic alloys that recover a memorised shape when heated, enabling compact, silent actuation.</li>
      <li><strong>Continuum Robots</strong> &mdash; robots with no discrete joints, achieving motion through distributed deformation of their backbone structure.</li>
    </ul>
    <p>This section covers actuator technologies, octopus-inspired arms, and the
    fabrication methods that make soft robots possible.</p>
  `,
  subsections: [
    {
      title: "Soft Actuator Technologies",
      items: [
        {
          title: "Design, Fabrication and Control of Soft Robots",
          author: "Daniela Rus & Michael T. Tolley",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/nature14543",
          desc: "Nature review on how compliant materials and novel fabrication methods are creating a new class of robots fundamentally different from rigid machines."
        },
        {
          title: "Elastomeric Origami: Programmable Paper-Elastomer Composites as Pneumatic Actuators",
          author: "R. V. Martinez et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1002/adfm.201202876",
          desc: "Paper demonstrating how combining paper and elastomer layers enables programmable pneumatic soft actuators with complex motions."
        },
        {
          title: "Dielectric Elastomers as Next-Generation Polymeric Actuators",
          author: "Ron Pelrine et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1002/adma.200400737",
          desc: "Early and influential paper on dielectric elastomer actuators achieving large strains and high energy densities comparable to biological muscle."
        },
        {
          title: "Soft Robotics Toolkit",
          author: "Harvard Biodesign Lab",
          type: "code",
          level: "beginner",
          url: "https://softroboticstoolkit.com/",
          desc: "Open-source collection of design files, fabrication tutorials, and control software for building pneumatic soft robots."
        }
      ]
    },
    {
      title: "Octopus & Continuum Robots",
      items: [
        {
          title: "An Octopus-Bioinspired Solution to Movement and Manipulation for Soft Robots",
          author: "Cecilia Laschi et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1088/1748-3190/7/2/025004",
          desc: "Bioinspiration & Biomimetics paper describing the design of an octopus-inspired robotic arm with cable-driven and SMA actuation."
        },
        {
          title: "Soft Robotics: Academic Review and Bibliometric Analysis",
          author: "Cecilia Laschi, Barbara Mazzolai & Matteo Cianchetti",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1089/soro.2013.0001",
          desc: "One of the first papers in the journal Soft Robotics, mapping the field and identifying octopus-inspired manipulation as a key research thread."
        },
        {
          title: "A Continuum Robot for Remote Minimally Invasive Surgery",
          author: "Nabil Simaan et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1109/ROBOT.2004.1307975",
          desc: "IEEE ICRA paper presenting a snake-like continuum robot for surgical applications, demonstrating dexterous manipulation in confined spaces."
        },
        {
          title: "Soft Robotics (Springer Textbook)",
          author: "Akon Higashimori & Kenjiro Tadakuma (Editors)",
          type: "book",
          level: "intermediate",
          url: "https://link.springer.com/book/10.1007/978-3-031-39504-8",
          desc: "Springer textbook covering the mechanics, modelling, and design of soft robotic systems from biological principles to engineering practice."
        }
      ]
    },
    {
      title: "Fabrication Methods",
      items: [
        {
          title: "3D Printing of Soft Robots",
          author: "Thomas J. Wallin, Jennifer Pikul & Robert F. Shepherd",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/s41578-018-0002-2",
          desc: "Nature Reviews Materials paper surveying multi-material additive manufacturing techniques for creating functional soft robots."
        },
        {
          title: "Multigait Soft Robot (Whitesides Group)",
          author: "Robert F. Shepherd et al.",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.1073/pnas.1116564108",
          desc: "PNAS paper presenting the iconic soft quadruped capable of multiple locomotion gaits, fabricated via soft lithography."
        },
        {
          title: "OpenSoft — Open-Source Soft Robotics Platform",
          author: "Various Contributors",
          type: "code",
          level: "beginner",
          url: "https://github.com/SoftRobotics/opensoft",
          desc: "GitHub repository with open-source designs, STL files, and control code for building and experimenting with soft robots."
        }
      ]
    }
  ]
},

/* ──────────────────────────────────────────────
   3. LEGGED ROBOTS
   ────────────────────────────────────────────── */
{
  id: "legged",
  icon: "⊕",
  label: "Legged Robots",
  intro: `
    <p>Legged locomotion allows robots to traverse uneven, discontinuous terrain
    that defeats wheeled or tracked platforms. Biological walkers and runners&mdash;
    from cockroaches to cheetahs&mdash;achieve remarkable agility through compliant
    legs, reflexive control, and rhythmic neural circuits.</p>
    <ul>
      <li><strong>Dynamic Walking &amp; Running</strong> &mdash; passive-dynamic principles and spring-loaded inverted pendulum (SLIP) models that explain efficient legged locomotion.</li>
      <li><strong>Hexapod Robots</strong> &mdash; six-legged platforms inspired by insects, offering static stability and high terrain adaptability.</li>
      <li><strong>Central Pattern Generators (CPGs)</strong> &mdash; neural oscillator circuits that produce rhythmic motor patterns without continuous sensory feedback.</li>
      <li><strong>Proprioceptive Control</strong> &mdash; using joint torques and leg forces rather than vision, enabling blind but robust locomotion over rough ground.</li>
    </ul>
    <p>Resources below span from Boston Dynamics lineage to insect-scale research
    robots and the neural control architectures that coordinate them.</p>
  `,
  subsections: [
    {
      title: "Dynamic Legged Locomotion",
      items: [
        {
          title: "Legged Robots That Balance",
          author: "Marc H. Raibert",
          type: "book",
          level: "intermediate",
          url: "https://mitpress.mit.edu/9780262181174/legged-robots-that-balance/",
          desc: "The classic MIT Press monograph by the founder of Boston Dynamics, establishing the principles of dynamic legged locomotion."
        },
        {
          title: "Learning Agile and Dynamic Motor Skills for Legged Robots",
          author: "Jemin Hwangbo et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1126/scirobotics.aau5872",
          desc: "Science Robotics paper showing ANYmal learning locomotion via reinforcement learning, achieving performance rivalling hand-crafted controllers."
        },
        {
          title: "MIT Cheetah: Design and Control of a Legged Robot",
          author: "Sangbae Kim et al.",
          type: "video",
          level: "intermediate",
          url: "https://www.youtube.com/watch?v=QZ1DaQgg3lE",
          desc: "MIT presentation on the Cheetah robot series covering bio-inspired leg design, proprioceptive control, and high-speed running."
        },
        {
          title: "Learning Quadrupedal Locomotion over Challenging Terrain",
          author: "Takahiro Miki et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1126/scirobotics.abk2822",
          desc: "Science Robotics paper on ANYmal navigating challenging outdoor terrain using learned proprioceptive policies with attention mechanisms."
        }
      ]
    },
    {
      title: "Insect-Inspired Robots",
      items: [
        {
          title: "RHex: A Simple and Highly Mobile Hexapod Robot",
          author: "Uluc Saranli, Martin Buehler & Daniel E. Koditschek",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1177/02783649020210070101",
          desc: "International Journal of Robotics Research paper on RHex, a cockroach-inspired hexapod using compliant C-shaped legs for agile locomotion."
        },
        {
          title: "DASH: A Dynamic 16g Hexapedal Robot",
          author: "Paul Birkmeyer, Kevin Peterson & Ronald S. Fearing",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1109/IROS.2009.5354561",
          desc: "IEEE IROS paper on a palm-sized cockroach-inspired robot built using smart composite manufacturing and capable of rapid running."
        },
        {
          title: "An Insect-Scale Robot Reveals Design Principles for Locomotion on Small Scales",
          author: "Ryan St. Pierre & Sarah Bergbreiter",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1088/1748-3190/ab tried",
          desc: "Bioinspiration & Biomimetics paper examining scaling laws and design trade-offs for miniature legged robots inspired by insects."
        },
        {
          title: "Hebi Robotics DAISY Hexapod",
          author: "Hebi Robotics",
          type: "code",
          level: "beginner",
          url: "https://github.com/HebiRobotics/hebi-matlab-examples",
          desc: "Open-source MATLAB examples for controlling the DAISY hexapod, enabling experiments with biologically-inspired walking gaits."
        }
      ]
    },
    {
      title: "CPG & Neural Control",
      items: [
        {
          title: "Central Pattern Generators for Locomotion Control in Animals and Robots",
          author: "Auke Jan Ijspeert",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/j.neunet.2008.03.014",
          desc: "Comprehensive Neural Networks review of CPG models, from lamprey swimming to quadruped trotting, with robot implementations."
        },
        {
          title: "From Swimming to Walking with a Salamander Robot Driven by a Spinal Cord Model",
          author: "Auke Jan Ijspeert et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/science.1138353",
          desc: "Science paper on Salamandra robotica, demonstrating gait transitions from swimming to walking using a CPG-based spinal cord model."
        },
        {
          title: "Neuromechanics and Control of Physical Behavior (Neurobiology of Motor Control)",
          author: "Avis H. Cohen, Serge Rossignol & Sten Grillner",
          type: "book",
          level: "advanced",
          url: "https://doi.org/10.1002/cne.903120209",
          desc: "Foundational work on vertebrate locomotion neuroscience, providing the biological basis for CPG models used in legged robotics."
        },
        {
          title: "PyBullet Locomotion Environments",
          author: "Erwin Coumans & Yunfei Bai",
          type: "code",
          level: "beginner",
          url: "https://github.com/bulletphysics/bullet3",
          desc: "Open-source physics simulator with legged robot environments widely used for testing CPG and reinforcement-learning locomotion controllers."
        }
      ]
    }
  ]
},

/* ──────────────────────────────────────────────
   4. AERIAL ROBOTS
   ────────────────────────────────────────────── */
{
  id: "aerial",
  icon: "△",
  label: "Aerial Robots",
  intro: `
    <p>Birds, bats, and insects achieve flight performance that dwarfs conventional
    fixed-wing and rotorcraft designs at small scales. Bio-inspired aerial robots
    exploit flapping wings, morphing surfaces, and unsteady aerodynamics to
    manoeuvre in cluttered environments, perch on surfaces, and hover with
    remarkable efficiency.</p>
    <ul>
      <li><strong>Flapping-Wing MAVs</strong> &mdash; micro aerial vehicles using wing strokes that generate lift through leading-edge vortices and clap-and-fling mechanisms.</li>
      <li><strong>Insect-Scale Robots</strong> &mdash; sub-gram platforms like the Harvard RoboBee that fly using piezoelectric actuators at wing-beat frequencies exceeding 100&thinsp;Hz.</li>
      <li><strong>Morphing Wings</strong> &mdash; bird-inspired wing structures that change shape in flight, adapting camber, span, and sweep for efficiency and agility.</li>
      <li><strong>Perching &amp; Grasping</strong> &mdash; mechanisms inspired by raptor talons and bat thumbs that allow aerial robots to land on branches, wires, and walls.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Flapping-Wing Platforms",
      items: [
        {
          title: "A Tailless Aerial Robotic Flapper Reveals that Flies Use Torque Coupling in Rapid Banked Turns",
          author: "Matej Karasek et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1126/science.aat0350",
          desc: "Science paper presenting the DelFly Nimble, a tailless flapping-wing robot that reveals new insights into insect flight manoeuvres."
        },
        {
          title: "SmartBird — Festo Bionic Learning Network",
          author: "Festo",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=nnR8fDW3Ilo",
          desc: "Video showcasing Festo's SmartBird, a herring-gull-inspired robot that achieves efficient flight through active wing torsion."
        },
        {
          title: "The DelFly: Design, Aerodynamics, and Artificial Intelligence of a Flapping Wing Robot",
          author: "Guido C. H. E. de Croon et al.",
          type: "book",
          level: "intermediate",
          url: "https://link.springer.com/book/10.1007/978-94-017-9208-0",
          desc: "Springer book covering over a decade of research on the DelFly platform, from aerodynamic design to autonomous vision-based flight."
        },
        {
          title: "Flapping Wing Micro Air Vehicle Design and Control (AIAA)",
          author: "Hao Liu et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.2514/1.C034804",
          desc: "AIAA Journal of Aircraft review covering computational and experimental approaches to flapping-wing MAV design and flight control."
        }
      ]
    },
    {
      title: "Insect-Scale Flight",
      items: [
        {
          title: "Controlled Flight of a Biologically Inspired, Insect-Scale Robot",
          author: "Kevin Y. Ma et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1126/science.1231806",
          desc: "Science paper presenting the RoboBee, achieving controlled hovering flight at the insect scale using piezoelectric bimorph actuators."
        },
        {
          title: "Untethered Flight of an Insect-Sized Flapping-Wing Microscale Aerial Vehicle",
          author: "Noah T. Jafferis et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/s41586-019-1322-0",
          desc: "Nature paper demonstrating the first untethered flight of RoboBee X-Wing powered by lightweight solar cells."
        },
        {
          title: "Harvard Microrobotics Lab — RoboBee Project Page",
          author: "Harvard SEAS",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=FfBEJHGzciI",
          desc: "Overview video of the Harvard RoboBee project, explaining the fabrication, actuation, and control of insect-scale flying robots."
        },
        {
          title: "Insect Flight Dynamics and Stability (Annual Reviews)",
          author: "Steven N. Fry, Rosalyn Sayaman & Michael H. Dickinson",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1146/annurev.fluid.010908.165134",
          desc: "Annual Review of Fluid Mechanics article explaining the unsteady aerodynamic mechanisms that insect-scale robots seek to replicate."
        }
      ]
    },
    {
      title: "Bird-Inspired Design",
      items: [
        {
          title: "A Bioinspired Multi-Joint Soft Robotic Wing for Aerial Vehicles",
          author: "Stefano Mintchev & Dario Floreano",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1088/1748-3190/11/4/046001",
          desc: "Bioinspiration & Biomimetics paper on a drone with bird-inspired foldable wings that passively absorb collisions and recover."
        },
        {
          title: "A Morphing Wing with Feather-Inspired Mechanisms",
          author: "Amanda Stowers & David Lentink",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1088/1748-3190/10/4/046002",
          desc: "Paper exploring how overlapping feather-like structures can create morphing wing surfaces for improved aerodynamic performance."
        },
        {
          title: "PigeonBot: A Biohybrid Morphing Wing Robot with Real Feathers",
          author: "Eric Chang et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/scirobotics.aay1246",
          desc: "Science Robotics paper on PigeonBot, which uses real pigeon feathers to achieve bird-like wing morphing during flight."
        },
        {
          title: "SNAG: A Bird-Inspired Robot That Perches and Catches",
          author: "William Roderick et al.",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=pnuoGjS1eaE",
          desc: "Stanford video demonstrating SNAG, a raptor-inspired grasping mechanism that allows drones to perch on branches and catch objects."
        }
      ]
    }
  ]
},

/* ──────────────────────────────────────────────
   5. AQUATIC ROBOTS
   ────────────────────────────────────────────── */
{
  id: "aquatic",
  icon: "≈",
  label: "Aquatic Robots",
  intro: `
    <p>Aquatic organisms exploit fins, jets, and undulation to move through water
    with minimal turbulence and high manoeuvrability. Bio-inspired underwater
    robots promise silent propulsion, efficient cruising, and the ability to
    operate in sensitive marine environments without disturbing wildlife.</p>
    <ul>
      <li><strong>Robotic Fish</strong> &mdash; autonomous platforms that mimic body-caudal-fin swimming in tuna, trout, and other fish through oscillating tail mechanisms.</li>
      <li><strong>Manta Ray Robots</strong> &mdash; pectoral-fin swimmers that use undulatory flapping of large, flexible fins for efficient and silent gliding.</li>
      <li><strong>Jellyfish Robots</strong> &mdash; bell-contraction swimmers offering energy-efficient propulsion and the ability to operate in delicate coral reef environments.</li>
      <li><strong>Turtle-Inspired Platforms</strong> &mdash; robots using four independently controlled flippers for versatile underwater and amphibious locomotion.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Robotic Fish",
      items: [
        {
          title: "Autonomous Robots: From Biological Inspiration to Implementation and Control (Chapter on Underwater Robots)",
          author: "George A. Bekey",
          type: "book",
          level: "intermediate",
          url: "https://mitpress.mit.edu/9780262025782/autonomous-robots/",
          desc: "MIT Press textbook with chapters on bio-inspired underwater locomotion, including fish-like swimming and control architectures."
        },
        {
          title: "RoboTuna: An Autonomous Robotic Fish",
          author: "Michael S. Triantafyllou & George S. Triantafyllou",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1109/100.382983",
          desc: "IEEE Spectrum article on the MIT RoboTuna, one of the earliest robotic fish platforms demonstrating fish-like propulsive efficiency."
        },
        {
          title: "SoFi: A Soft Robotic Fish for Coral Reef Observation",
          author: "Robert K. Katzschmann et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/scirobotics.aar3449",
          desc: "Science Robotics paper on a soft robotic fish that can swim alongside real fish in coral reefs without disturbing marine life."
        },
        {
          title: "SoFi Robot — MIT CSAIL Demo",
          author: "MIT CSAIL",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=ux8KMAtfMzo",
          desc: "Video demonstration of the SoFi soft robotic fish operating autonomously in the ocean alongside live coral reef fish."
        }
      ]
    },
    {
      title: "Ray & Jellyfish Robots",
      items: [
        {
          title: "A Tissue-Engineered Jellyfish with Biomimetic Propulsion",
          author: "Janna C. Nawroth et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/nbt.2269",
          desc: "Nature Biotechnology paper on Medusoid, a biohybrid jellyfish built from rat cardiac muscle cells on a silicone scaffold."
        },
        {
          title: "A Self-Powered Biohybrid Stingray Robot",
          author: "Sung-Jin Park et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1126/science.aaf4292",
          desc: "Science paper on a tissue-engineered stingray powered by optogenetically modified rat cardiomyocytes, steered by light."
        },
        {
          title: "Manta Ray Inspired Robotic Fish with Electro-Active Polymer Pectoral Fins",
          author: "Zheng Chen et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1109/ICMA.2012.6283508",
          desc: "IEEE conference paper on a manta-ray-inspired underwater robot using ionic polymer-metal composite actuators for pectoral fin propulsion."
        }
      ]
    },
    {
      title: "Autonomous Underwater Bio-Robots",
      items: [
        {
          title: "Naro-Tartaruga: A Bioinspired Sea Turtle Robot",
          author: "Jonas Shintake et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1088/1748-3190/aa5d4e",
          desc: "Bioinspiration & Biomimetics paper on a sea-turtle-inspired robot with four flipper actuators for versatile underwater manoeuvring."
        },
        {
          title: "Pliant Energy Systems — Velox Bio-Inspired Underwater Robot",
          author: "Pliant Energy Systems",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=ZnVKLFGaBXI",
          desc: "Video showing the Velox robot that uses undulating fins inspired by cuttlefish and rays for amphibious and underwater locomotion."
        },
        {
          title: "Aqua2: An Amphibious Hexapod Robot",
          author: "Gregory Dudek et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1007/s10514-006-9014-0",
          desc: "Autonomous Robots journal paper on an amphibious hexapod that swims using oscillating flippers and walks on land using the same limbs."
        },
        {
          title: "Underwater Robot Simulation — UUV Simulator (ROS/Gazebo)",
          author: "Musa Morena Marcusso Manhaes et al.",
          type: "code",
          level: "beginner",
          url: "https://github.com/uuvsimulator/uuv_simulator",
          desc: "Open-source ROS/Gazebo package for simulating underwater vehicles, useful for testing bio-inspired locomotion controllers."
        }
      ]
    }
  ]
},

/* ──────────────────────────────────────────────
   6. SWARM ROBOTICS
   ────────────────────────────────────────────── */
{
  id: "swarm",
  icon: "⬡",
  label: "Swarm Robotics",
  intro: `
    <p>Social insects&mdash;ants, bees, termites&mdash;accomplish feats of construction,
    foraging, and defence far beyond any individual&rsquo;s capability. Swarm robotics
    translates these collective behaviours into teams of simple, low-cost robots
    that cooperate through local interaction rules without centralised command.</p>
    <ul>
      <li><strong>Stigmergy</strong> &mdash; indirect coordination through environment modification, as when ants lay pheromone trails or termites build mounds.</li>
      <li><strong>Self-Organisation</strong> &mdash; global patterns emerging from local rules, enabling flocking, aggregation, and task allocation without top-down planning.</li>
      <li><strong>Kilobots</strong> &mdash; low-cost, coin-sized robots designed for testing swarm algorithms at scales of hundreds to thousands of units.</li>
      <li><strong>Collective Construction</strong> &mdash; termite-inspired building strategies where robots place material based on local stimuli, creating coherent structures.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Swarm Algorithms",
      items: [
        {
          title: "Swarm Intelligence: From Natural to Artificial Systems",
          author: "Eric Bonabeau, Marco Dorigo & Guy Theraulaz",
          type: "book",
          level: "intermediate",
          url: "https://global.oup.com/academic/product/swarm-intelligence-9780195131598",
          desc: "Oxford University Press foundational text on swarm intelligence, covering ant colony optimisation, particle swarms, and collective robotics."
        },
        {
          title: "Ant Colony Optimization — A New Meta-Heuristic",
          author: "Marco Dorigo & Thomas Stuetzle",
          type: "book",
          level: "intermediate",
          url: "https://mitpress.mit.edu/9780262042192/ant-colony-optimization/",
          desc: "MIT Press monograph on ACO algorithms inspired by ant foraging behaviour, with applications to combinatorial optimisation and robot path planning."
        },
        {
          title: "Programmable Self-Assembly in a Thousand-Robot Swarm",
          author: "Michael Rubenstein, Alejandro Cornejo & Radhika Nagpal",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/science.1254295",
          desc: "Science paper demonstrating 1,024 Kilobots forming complex shapes through local interactions alone, a landmark in swarm robotics."
        },
        {
          title: "Designing Multi-Robot Systems (Swarm Robotics Tutorial)",
          author: "Manuele Brambilla et al.",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.1007/s11721-012-0075-2",
          desc: "Swarm Intelligence journal paper providing a systematic design methodology for swarm robotics behaviour from specification to implementation."
        }
      ]
    },
    {
      title: "Hardware Platforms",
      items: [
        {
          title: "Kilobot: A Low-Cost Robot for Swarm Robotics at Scale",
          author: "Michael Rubenstein, Christian Ahler & Radhika Nagpal",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.1016/j.robot.2013.06.006",
          desc: "Robotics and Autonomous Systems paper on the Kilobot, a $14 vibration-motor robot designed for experiments with hundreds of units."
        },
        {
          title: "The e-puck2 Robot for Education and Swarm Research",
          author: "GCtronic & EPFL",
          type: "code",
          level: "beginner",
          url: "https://github.com/e-puck2",
          desc: "GitHub organisation hosting firmware and tools for the e-puck2 miniature robot, widely used in swarm robotics education and research."
        },
        {
          title: "Robotarium: A Remotely Accessible Swarm Robotics Research Testbed",
          author: "Daniel Pickem et al.",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.1109/ICRA.2017.7989200",
          desc: "IEEE ICRA paper on the Georgia Tech Robotarium, a remotely accessible multi-robot platform for swarm experiments."
        },
        {
          title: "Robotarium MATLAB/Python Toolkit",
          author: "Georgia Tech",
          type: "code",
          level: "beginner",
          url: "https://github.com/robotarium/robotarium_python_simulator",
          desc: "Open-source Python simulator mirroring the Robotarium platform, enabling development and testing of swarm algorithms before deployment."
        }
      ]
    },
    {
      title: "Collective Construction",
      items: [
        {
          title: "Designing Collective Behavior in a Termite-Inspired Robot Construction Team",
          author: "Justin Werfel, Kirstin Petersen & Radhika Nagpal",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/science.1245842",
          desc: "Science paper on TERMES robots that build 3D structures using termite-inspired stigmergic algorithms without central coordination."
        },
        {
          title: "Collective Construction with Multiple Robots (AAAI Classic)",
          author: "Justin Werfel & Radhika Nagpal",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1007/978-3-540-30552-1_13",
          desc: "Early paper on multi-robot construction formalising how simple agents can build complex structures through purely local rules."
        },
        {
          title: "ARGoS: A Large-Scale Multi-Robot Simulator",
          author: "Carlo Pinciroli et al.",
          type: "code",
          level: "intermediate",
          url: "https://github.com/ilpincy/argos3",
          desc: "Open-source multi-robot simulator designed for large swarms, supporting physics-based simulation of thousands of robots."
        }
      ]
    }
  ]
},

/* ──────────────────────────────────────────────
   7. BIO-INSPIRED SENSORS & ACTUATORS
   ────────────────────────────────────────────── */
{
  id: "sensors",
  icon: "◉",
  label: "Sensors & Actuators",
  intro: `
    <p>Biological organisms possess sensory and motor systems of extraordinary
    sensitivity and efficiency. Artificial lateral lines detect hydrodynamic
    pressure like those on fish, whisker arrays map environments the way rats do,
    and compound-eye cameras provide wide-field-of-view motion detection inspired
    by insects. On the actuation side, electroactive polymers and pneumatic muscles
    approach the power density and compliance of biological muscle.</p>
    <ul>
      <li><strong>Artificial Lateral Line</strong> &mdash; arrays of pressure and flow sensors mimicking the fish lateral line organ for underwater flow mapping and obstacle detection.</li>
      <li><strong>Whisker Sensors</strong> &mdash; tactile arrays inspired by rodent vibrissae, enabling texture discrimination and shape recognition through active touch.</li>
      <li><strong>Compound Eyes</strong> &mdash; multi-aperture optical sensors inspired by insect eyes, providing panoramic vision and high-speed motion detection.</li>
      <li><strong>Artificial Muscles</strong> &mdash; actuators based on electroactive polymers, twisted-fibre muscles, and pneumatic artificial muscles (McKibben) that mimic biological muscle behaviour.</li>
    </ul>
  `,
  subsections: [
    {
      title: "Bio-Inspired Sensing",
      items: [
        {
          title: "Artificial Lateral Line Canals for Flow and Vortex Detection on Underwater Robots",
          author: "Yang Bing-Lin et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1088/1748-3190/11/4/046007",
          desc: "Bioinspiration & Biomimetics paper on MEMS-based artificial lateral line sensors for hydrodynamic sensing on robotic fish."
        },
        {
          title: "Active Tactile Sensing Inspired by Rat Whiskers",
          author: "Mathew J. Pearson et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1109/TNSRE.2011.2167235",
          desc: "IEEE TNSRE paper on the Whiskerbot platform, demonstrating texture classification and object localisation using biomimetic vibrissae."
        },
        {
          title: "CurvACE: A Curved Artificial Compound Eye",
          author: "Dario Floreano et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1073/pnas.1219068110",
          desc: "PNAS paper on a miniature curved compound-eye camera inspired by insect vision, achieving 180-degree field of view on a flexible PCB."
        },
        {
          title: "Neuromorphic Event-Based Vision Sensors (DVS)",
          author: "Tobi Delbruck & Patrick Lichtsteiner",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1109/JSSC.2007.914337",
          desc: "IEEE JSSC paper on the Dynamic Vision Sensor, a retina-inspired camera that outputs events asynchronously with microsecond latency."
        }
      ]
    },
    {
      title: "Artificial Muscles",
      items: [
        {
          title: "Artificial Muscles from Fishing Line and Sewing Thread",
          author: "Carter S. Haines et al.",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.1126/science.1246906",
          desc: "Science paper showing that twisted nylon fibres can produce powerful actuators rivalling biological muscle in specific work output."
        },
        {
          title: "Electroactive Polymer (EAP) Actuators as Artificial Muscles",
          author: "Yoseph Bar-Cohen",
          type: "book",
          level: "intermediate",
          url: "https://doi.org/10.1117/3.547465",
          desc: "SPIE Press book covering the fundamentals and applications of EAP actuators, from ionic polymer gels to dielectric elastomers."
        },
        {
          title: "HASEL Artificial Muscles — Soft Capacitive Actuators",
          author: "Eric Acome et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/science.aao6139",
          desc: "Science paper on hydraulically amplified self-healing electrostatic (HASEL) actuators combining the versatility of soft fluidic and dielectric elastomer actuators."
        },
        {
          title: "Soft Robotics Actuator Library — OpenSoftMachines",
          author: "Various Contributors",
          type: "code",
          level: "beginner",
          url: "https://github.com/SoftRobotics/soft-actuator-library",
          desc: "Open-source library of soft actuator designs including McKibben muscles, PneuNets, and DEA configurations with fabrication guides."
        }
      ]
    },
    {
      title: "Neuromorphic Control",
      items: [
        {
          title: "Neuromorphic Electronic Systems (Mead, 1990)",
          author: "Carver Mead",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1109/5.58356",
          desc: "The foundational Proceedings of the IEEE paper that launched the field of neuromorphic engineering, inspiring brain-like computing for robots."
        },
        {
          title: "Loihi: A Neuromorphic Manycore Processor with On-Chip Learning",
          author: "Mike Davies et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1109/MM.2018.112130359",
          desc: "IEEE Micro paper on Intel's Loihi neuromorphic chip, designed for spiking neural networks applicable to real-time robot control."
        },
        {
          title: "Spiking Neural Networks for Robot Control — Nengo Framework",
          author: "Applied Brain Research",
          type: "code",
          level: "intermediate",
          url: "https://github.com/nengo/nengo",
          desc: "Open-source Python framework for building spiking neural networks, with tutorials on neuromorphic robot control using the NEF."
        },
        {
          title: "Event-Driven Perception for Robotics (Tutorial)",
          author: "Davide Scaramuzza",
          type: "video",
          level: "intermediate",
          url: "https://www.youtube.com/watch?v=LauQ6LWTkFM",
          desc: "Lecture by Davide Scaramuzza on event cameras for high-speed robotic perception, covering algorithms for visual odometry and obstacle avoidance."
        }
      ]
    }
  ]
}

]; /* end SECTIONS */


/* ============================================================
   RENDERING ENGINE
   ============================================================ */

const tabBar    = document.getElementById("tab-bar");
const mainEl    = document.getElementById("main-content");
const searchIn  = document.getElementById("search-input");
const searchClr = document.getElementById("search-clear");
const statCount = document.getElementById("stat-count");

let activeTab    = SECTIONS[0].id;
let activeFilter = "all";
let searchQuery  = "";

const totalResources = SECTIONS.reduce(
  (n, s) => n + s.subsections.reduce((m, sub) => m + sub.items.length, 0), 0
);
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

searchIn.addEventListener("input", () => {
  searchQuery = searchIn.value.trim().toLowerCase();
  render();
});
searchClr.addEventListener("click", () => {
  searchIn.value = "";
  searchQuery = "";
  render();
});

render();
