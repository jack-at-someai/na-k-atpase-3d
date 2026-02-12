/* ============================================================
   BIOMIMETIC MATERIALS — Curated Reference Hub
   Engineered materials that mimic biological strategies:
   self-healing, shape memory, bio-adhesives, hierarchical
   composites, responsive surfaces, and advanced manufacturing.
   ============================================================ */

const SECTIONS = [

  /* ──────────────────────────────────────────────────────────
     1. OVERVIEW — Introduction to Biomimetic Materials
     ────────────────────────────────────────────────────────── */
  {
    id: "overview",
    icon: "◈",
    label: "Overview",
    intro: `
      <p>Biomimetic materials science draws on <strong>3.8 billion years of evolution</strong> as a
      design library. Organisms have optimized structures under constraints far stricter than any
      engineering spec&mdash;ambient temperature processing, water-based chemistry, a limited
      elemental palette&mdash;yet they produce materials of extraordinary performance: bone that
      resists fracture, nacre that is 3,000&times; tougher than its constituent mineral, and silk
      that outperforms steel per unit weight.</p>
      <p>The <em>materials-by-design</em> paradigm reverses the classical approach. Instead of
      discovering a material and then finding applications, researchers identify a target property
      set and engineer hierarchical architectures to achieve it. Key principles include:</p>
      <ul>
        <li><strong>Hierarchy</strong> &mdash; Structure at every length scale, from molecular
        to macroscopic, each level contributing distinct mechanical function.</li>
        <li><strong>Multifunctionality</strong> &mdash; A single material simultaneously provides
        structural support, sensing, self-repair, and environmental response.</li>
        <li><strong>Adaptation</strong> &mdash; Living materials remodel in response to load, damage,
        and environmental change&mdash;an aspiration for next-generation engineered systems.</li>
        <li><strong>Sustainability</strong> &mdash; Biological fabrication uses mild conditions and
        abundant elements, pointing toward greener manufacturing routes.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          {
            title: "Biomimetics: Biologically Inspired Technologies",
            author: "Yoseph Bar-Cohen (Ed.)",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1201/9781420037715",
            desc: "Comprehensive edited volume covering biomimetic robotics, materials, and sensors. A standard reference for engineers entering the field."
          },
          {
            title: "Biomimicry: Innovation Inspired by Nature",
            author: "Janine M. Benyus",
            type: "book",
            level: "beginner",
            url: "https://www.harpercollins.com/products/biomimicry-janine-m-benyus",
            desc: "The book that popularized biomimicry as a design philosophy, accessible to non-specialists and rich with natural-history examples."
          },
          {
            title: "Structural Biological Materials: Design Strategies",
            author: "Peter Fratzl (Ed.)",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-3-7091-2584-5",
            desc: "Advanced treatment of biological material design principles including bone, wood, and silk. Emphasizes hierarchical architecture and mechanical optimization."
          },
          {
            title: "Materials Design Inspired by Nature: Function Through Inner Architecture",
            author: "Peter Fratzl, John W. C. Dunlop, Richard Weinkamer",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1039/9781849737555",
            desc: "Royal Society of Chemistry volume connecting biological architecture to engineering materials design through multiscale analysis."
          }
        ]
      },
      {
        title: "Review Articles",
        items: [
          {
            title: "Biological Materials: Structure and Mechanical Properties",
            author: "Marc A. Meyers, Po-Yu Chen, Albert Y.-M. Lin, Yasuaki Seki",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.pmatsci.2007.06.001",
            desc: "Landmark review in Progress in Materials Science cataloguing biological structural materials from shells to bone to spider silk."
          },
          {
            title: "Bio-inspired Materials: Mining the Old Literature for New Ideas",
            author: "Ulrike G. K. Wegst, Hao Bai, Eduardo Saiz, Antoni P. Tomsia, Robert O. Ritchie",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nmat4089",
            desc: "Nature Materials perspective on translating biological design principles into synthetic structural materials, with an Ashby-map framework."
          },
          {
            title: "Bioinspired Structural Materials",
            author: "Ulrike G. K. Wegst, Hao Bai, Eduardo Saiz, Antoni P. Tomsia, Robert O. Ritchie",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nmat4089",
            desc: "Seminal Nature Materials review mapping biological materials onto materials-property space and outlining fabrication strategies for bio-inspired composites."
          },
          {
            title: "Lessons from Nature about Solar Light Harvesting",
            author: "Gregory D. Scholes, Graham R. Fleming, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nchem.1145",
            desc: "Nature Chemistry review on how photosynthetic organisms manage energy transfer, inspiring biomimetic solar materials."
          }
        ]
      },
      {
        title: "Introductory Lectures",
        items: [
          {
            title: "Biomimicry — Janine Benyus TED Talk",
            author: "Janine Benyus",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=sf4oW8OtaPY",
            desc: "Benyus introduces biomimicry principles with vivid examples, from self-cleaning surfaces to energy-efficient buildings."
          },
          {
            title: "Bioinspired Design — MIT OpenCourseWare 2.680",
            author: "MIT OCW",
            type: "course",
            level: "intermediate",
            url: "https://ocw.mit.edu/courses/2-680-bio-inspired-structures-spring-2023/",
            desc: "MIT graduate course covering design extraction from biology, biomechanics, and translation into engineering structures."
          },
          {
            title: "Nature's Hidden Engineering — Veritasium",
            author: "Derek Muller",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=7s0CpRfyYp8",
            desc: "Accessible video exploring how natural materials achieve remarkable mechanical properties through hierarchical design."
          },
          {
            title: "AskNature — Biomimicry Institute Database",
            author: "Biomimicry Institute",
            type: "data",
            level: "beginner",
            url: "https://asknature.org/",
            desc: "Open-access database of biological strategies organized by function, bridging biology and engineering design."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────
     2. SELF-HEALING — Vascular, Microcapsule & Intrinsic
     ────────────────────────────────────────────────────────── */
  {
    id: "selfhealing",
    icon: "⊕",
    label: "Self-Healing",
    intro: `
      <p>Biological organisms routinely repair damage: skin heals cuts, bones mend fractures,
      and trees seal wounds with resin. <strong>Self-healing materials</strong> aim to replicate
      these capabilities in engineered systems, extending service life and reducing maintenance
      costs in applications from aerospace composites to protective coatings.</p>
      <p>Three dominant strategies have emerged:</p>
      <ul>
        <li><strong>Microcapsule-based healing</strong> &mdash; Healing agents are sequestered in
        capsules that rupture upon crack propagation, releasing monomers that polymerize in
        the damage zone (inspired by platelet-mediated clotting).</li>
        <li><strong>Vascular networks</strong> &mdash; Interconnected channels deliver healing
        agents to damage sites repeatedly, analogous to the circulatory system supplying
        clotting factors to a wound.</li>
        <li><strong>Intrinsic self-healing</strong> &mdash; Reversible bonds (hydrogen bonds,
        Diels&ndash;Alder linkages, disulfide exchange) allow the polymer matrix itself to
        re-form broken connections, mimicking the dynamic cross-linking in biological tissues.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Biological Healing Mechanisms",
        items: [
          {
            title: "Wound Healing: From Embryos to Adults and Back",
            author: "Sabine Werner, Richard Grose",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1126/science.1092385",
            desc: "Science review of biological wound healing cascades, the biological blueprint that inspires self-healing material design."
          },
          {
            title: "Self-Healing Materials: Fundamentals, Design Strategies, and Applications",
            author: "Swapan Kumar Ghosh (Ed.)",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1002/9783527625376",
            desc: "Wiley monograph covering all major self-healing strategies with detailed discussion of biological healing parallels."
          },
          {
            title: "Biological Self-Healing of Cement Paste and Morite by Bacteria",
            author: "Henk M. Jonkers",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.ecoleng.2010.02.005",
            desc: "Pioneering paper on bacteria-mediated self-healing concrete, using Bacillus spores that precipitate calcite to seal cracks."
          },
          {
            title: "How Trees Heal: Wound Closure and Compartmentalization",
            author: "Alex L. Shigo",
            type: "book",
            level: "beginner",
            url: "https://www.shigoandtrees.com/",
            desc: "Classic text on compartmentalization of decay in trees (CODIT model), a key biological reference for self-healing material researchers."
          }
        ]
      },
      {
        title: "Microcapsule & Vascular Systems",
        items: [
          {
            title: "Autonomic Healing of Polymer Composites",
            author: "Scott R. White, Nancy R. Sottos, Philippe H. Geubelle, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/35057232",
            desc: "The landmark 2001 Nature paper that launched the microcapsule self-healing field using DCPD-filled urea-formaldehyde capsules."
          },
          {
            title: "Restoration of Large Damage Volumes in Polymers",
            author: "Kathleen S. Toohey, Nancy R. Sottos, Jennifer A. Lewis, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nmat1934",
            desc: "Nature Materials paper demonstrating vascular self-healing networks with repeated healing cycles in epoxy coatings."
          },
          {
            title: "Self-Healing Materials with Microvascular Networks",
            author: "Brett J. Hansen, University of Illinois",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=AGoFnfLqUYA",
            desc: "Illinois Autonomous Materials Systems group video demonstrating vascular self-healing in action with UV-fluorescent healing agents."
          },
          {
            title: "Self-Healing Polymers and Composites — White Group",
            author: "Autonomous Materials Systems Group, UIUC",
            type: "data",
            level: "intermediate",
            url: "https://autonomic.beckman.illinois.edu/",
            desc: "Research group portal with publications, videos, and datasets on microcapsule and vascular self-healing systems."
          }
        ]
      },
      {
        title: "Intrinsic Self-Healing Polymers",
        items: [
          {
            title: "Thermally Remendable Cross-Linked Polymers via Diels-Alder Chemistry",
            author: "Xiangxu Chen, Marten A. Dam, Kanji Ono, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1065879",
            desc: "Science paper introducing thermally reversible Diels-Alder cross-links for repeatedly healable polymer networks."
          },
          {
            title: "Self-Healing Rubber from Supramolecular Assembly",
            author: "Philippe Cordier, Francois Tournilhac, Corinne Soulie-Ziakovic, Ludwik Leibler",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nature06669",
            desc: "Nature paper demonstrating a self-healing rubber based on hydrogen-bonded supramolecular networks that heal at room temperature."
          },
          {
            title: "Self-Healing Polymer Chemistry — Royal Society of Chemistry",
            author: "Wayne Hayes, Barnaby Greenland (Eds.)",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1039/9781788013321",
            desc: "RSC book covering dynamic covalent chemistry, supramolecular approaches, and characterization methods for self-healing polymers."
          },
          {
            title: "Dynamic Covalent Chemistry in Polymer Networks",
            author: "Christopher J. Kloxin, Christopher N. Bowman",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1039/C3CS60195A",
            desc: "Chemical Society Reviews tutorial on dynamic covalent bonds in polymer networks, the chemical basis for intrinsic self-healing."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────
     3. SHAPE MEMORY — Alloys, Polymers & 4D Printing
     ────────────────────────────────────────────────────────── */
  {
    id: "shapememory",
    icon: "∿",
    label: "Shape Memory",
    intro: `
      <p>Many biological structures change shape in response to environmental cues: pine cones
      open as they dry, Venus flytraps snap shut in milliseconds, and plant tendrils coil
      upon contact. These <strong>shape-changing mechanisms</strong> rely on differential swelling,
      pre-stressed bilayers, and hydraulic actuation&mdash;principles now harnessed in
      shape memory alloys (SMAs), shape memory polymers (SMPs), and <strong>4D printing</strong>.</p>
      <p>Key concepts in this domain include:</p>
      <ul>
        <li><strong>Shape memory alloys</strong> &mdash; Metallic alloys (e.g., NiTi) that
        recover a programmed shape upon heating through a martensitic phase transformation.</li>
        <li><strong>Shape memory polymers</strong> &mdash; Polymers that can be deformed and
        fixed into a temporary shape, then recover their permanent shape via thermal, light,
        or chemical triggers.</li>
        <li><strong>Hygromorphs</strong> &mdash; Plant-inspired bilayer structures that bend
        in response to humidity changes, used in adaptive building facades and soft actuators.</li>
        <li><strong>4D printing</strong> &mdash; 3D-printed structures programmed to change
        shape over time (the fourth dimension), combining additive manufacturing with
        stimulus-responsive materials.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Shape Memory Fundamentals",
        items: [
          {
            title: "Shape Memory Materials",
            author: "K. Otsuka, C. M. Wayman (Eds.)",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1017/CBO9780511614286",
            desc: "Cambridge University Press reference covering the metallurgy and thermodynamics of shape memory alloys, especially NiTi systems."
          },
          {
            title: "Shape-Memory Polymers",
            author: "Andreas Lendlein, Steffen Kelch",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/anie.200190169",
            desc: "Angewandte Chemie review introducing shape memory polymer principles, programming methods, and biomedical applications."
          },
          {
            title: "Shape Memory Alloys — Introduction",
            author: "Dimitris Lagoudas",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=wI-qAxKJoSU",
            desc: "Clear lecture introduction to the martensitic transformation, one-way and two-way shape memory effects, and superelasticity."
          },
          {
            title: "Shape Memory and Superelastic Technologies (SMST)",
            author: "ASM International",
            type: "data",
            level: "intermediate",
            url: "https://www.asminternational.org/web/smst",
            desc: "Professional society resource hub for shape memory alloy research, conferences, and technical data."
          }
        ]
      },
      {
        title: "Plant-Inspired Actuation",
        items: [
          {
            title: "Movement of the Mimosa Pudica — Bio-Actuators",
            author: "Yoel Forterre",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.ceb.2012.10.008",
            desc: "Review of rapid plant movements from Venus flytraps to Mimosa, analyzing hydraulic actuation and elastic instability mechanisms."
          },
          {
            title: "Plant Movements as Concept Generators for Biomimetic Materials",
            author: "Simon Poppinga, Olga Speck, Thomas Speck",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1088/1748-3190/aa8ea0",
            desc: "Bioinspiration & Biomimetics paper on translating plant movement strategies into deployable structures and adaptive materials."
          },
          {
            title: "Hygromorphic Wood Bilayers as Adaptive Building Skins",
            author: "Achim Menges, Steffen Reichert",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=1fGGaHfGaXQ",
            desc: "ICD Stuttgart video on the HygroScope pavilion, where wood veneer bilayers open and close autonomously in response to humidity."
          },
          {
            title: "Responsive Architecture — ICD University of Stuttgart",
            author: "Institute for Computational Design",
            type: "data",
            level: "intermediate",
            url: "https://www.icd.uni-stuttgart.de/",
            desc: "Research group developing plant-inspired adaptive architectural systems including hygromorphic facades and fiber-composite structures."
          }
        ]
      },
      {
        title: "4D Printing & Applications",
        items: [
          {
            title: "4D Printing: Multi-Material Shape Change",
            author: "A. Sydney Gladman, Elisabetta A. Matsumoto, Ralph G. Nuzzo, L. Mahadevan, Jennifer A. Lewis",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nmat4544",
            desc: "Nature Materials paper on 4D-printed hydrogel composites that mimic plant-inspired shape changes using anisotropic swelling."
          },
          {
            title: "Active Origami by 4D Printing",
            author: "Qi Ge, Howon Lee, Conner K. Dunn, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1088/0964-1726/23/9/094007",
            desc: "Smart Materials and Structures paper demonstrating 4D-printed origami structures with programmable folding sequences."
          },
          {
            title: "Self-Assembly Lab — MIT 4D Printing",
            author: "Skylar Tibbits, MIT",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=0gMCZFHv9v8",
            desc: "Skylar Tibbits TED talk introducing 4D printing and programmable matter with demonstrations of self-assembling structures."
          },
          {
            title: "Self-Assembly Lab",
            author: "MIT Self-Assembly Lab",
            type: "data",
            level: "intermediate",
            url: "https://selfassemblylab.mit.edu/",
            desc: "MIT lab pioneering 4D printing, programmable materials, and self-assembly at the architectural scale."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────
     4. ADHESIVES — Mussel, Gecko & Surgical
     ────────────────────────────────────────────────────────── */
  {
    id: "adhesives",
    icon: "⊗",
    label: "Bio-Adhesives",
    intro: `
      <p>Nature has evolved remarkably diverse adhesion strategies: mussels cling to wave-battered
      rocks using catechol chemistry, geckos walk on ceilings via van der Waals interactions
      across millions of spatulae, and barnacles cement themselves permanently to ship hulls.
      <strong>Bio-inspired adhesives</strong> translate these mechanisms into synthetic materials
      for applications from surgical tissue sealants to reusable industrial fasteners.</p>
      <p>Major bio-adhesion paradigms include:</p>
      <ul>
        <li><strong>DOPA chemistry</strong> &mdash; The catechol amino acid
        3,4-dihydroxyphenylalanine (DOPA) in mussel foot proteins forms strong bonds to
        virtually any surface, even underwater&mdash;inspiring a new class of wet adhesives.</li>
        <li><strong>Gecko-inspired dry adhesion</strong> &mdash; Hierarchical fibrillar
        structures maximize van der Waals contact area, enabling strong, reversible, and
        residue-free attachment without chemical bonding.</li>
        <li><strong>Barnacle cement</strong> &mdash; A protein-based underwater adhesive that
        cures into an incredibly strong bond, studied for dental and orthopedic applications.</li>
        <li><strong>Surgical bio-adhesives</strong> &mdash; Materials designed to bond living
        tissue in wet, dynamic environments, replacing sutures and staples for internal
        wound closure.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Mussel & DOPA Chemistry",
        items: [
          {
            title: "Mussel-Inspired Adhesives and Coatings",
            author: "Bruce P. Lee, P. B. Messersmith, J. N. Israelachvili, J. H. Waite",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1146/annurev-matsci-062910-100429",
            desc: "Annual Review of Materials Research article covering the molecular basis of mussel adhesion and synthetic polydopamine coatings."
          },
          {
            title: "A Universally Applicable Surface Chemistry (Polydopamine)",
            author: "Haeshin Lee, Shara M. Dellatore, William M. Miller, Phillip B. Messersmith",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1147241",
            desc: "Science paper demonstrating that dopamine self-polymerizes into universal adhesive coatings on virtually any surface."
          },
          {
            title: "Mussel Foot Proteins and Underwater Adhesion",
            author: "J. Herbert Waite",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=hSB3YSCz1dc",
            desc: "Lecture by Waite on the biochemistry of mussel byssus threads and the role of DOPA in wet adhesion."
          },
          {
            title: "The Adhesion of Mussel Foot Proteins to Different Substrate Surfaces",
            author: "Dong Soo Hwang, Matthew J. Harrington, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.jbc.2021.100737",
            desc: "Detailed study of how mussel foot protein variants interact with metal, mineral, and polymer surfaces at the molecular level."
          }
        ]
      },
      {
        title: "Gecko-Inspired Adhesives",
        items: [
          {
            title: "Evidence for van der Waals Adhesion in Gecko Setae",
            author: "Kellar Autumn, Yiching A. Liang, S. Tonia Hsieh, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1073/pnas.192252799",
            desc: "PNAS paper providing the first direct evidence that gecko adhesion is dominated by van der Waals forces, not capillary effects."
          },
          {
            title: "Gecko-Inspired Adhesives — Mark Cutkosky Lab",
            author: "Mark Cutkosky, Stanford University",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=BctVhJVtaGQ",
            desc: "Video from the Cutkosky lab showing gecko-inspired adhesive pads enabling a robot to climb smooth vertical surfaces."
          },
          {
            title: "Microstructured Dry Adhesives — Sitti Lab",
            author: "Metin Sitti, Carnegie Mellon / Max Planck",
            type: "data",
            level: "intermediate",
            url: "https://pi.is.mpg.de/",
            desc: "Max Planck Physical Intelligence group developing gecko-inspired fibrillar adhesives, micro-robots, and biomedical adhesive devices."
          },
          {
            title: "Gecko Adhesion: Structure, Function, and Applications",
            author: "Aránzazu del Campo, Eduard Arzt",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/adma.200501141",
            desc: "Advanced Materials review on the hierarchical structure of gecko foot-hairs and engineering approaches to synthetic gecko tape."
          }
        ]
      },
      {
        title: "Medical & Surgical Adhesives",
        items: [
          {
            title: "A Blood-Resistant Surgical Glue (Tough Adhesive)",
            author: "Jianyu Li, Adam D. Celiz, David J. Mooney, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.aah6362",
            desc: "Science paper presenting a tough adhesive inspired by the defensive mucus of slugs, bonding strongly to wet biological tissues."
          },
          {
            title: "Bioinspired Tissue Adhesives and Their Biomedical Applications",
            author: "Nasim Annabi, Alexander Tamayol, et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1021/acs.nanolett.7b04994",
            desc: "Review of bio-inspired surgical adhesives including mussel-inspired, gecko-inspired, and hybrid adhesive systems for clinical use."
          },
          {
            title: "GelCMA: A Mussel-Inspired Surgical Sealant",
            author: "Nasim Annabi, Northeastern University",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=6zHZwYqoFsI",
            desc: "Presentation on photocrosslinkable mussel-inspired hydrogel sealants for cardiac and arterial wound closure."
          },
          {
            title: "Barnacle Cement: Underwater Adhesion Mechanisms",
            author: "Nick Aldred, Anthony S. Clare",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1088/1748-3182/3/1/014002",
            desc: "Bioinspiration & Biomimetics paper analyzing barnacle cement proteins and their curing mechanism as inspiration for underwater adhesives."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────
     5. COMPOSITES — Nacre, Helicoidal & Graded
     ────────────────────────────────────────────────────────── */
  {
    id: "composites",
    icon: "△",
    label: "Bio-Composites",
    intro: `
      <p>Nature builds composites of astonishing performance from mundane ingredients. Nacre
      (mother-of-pearl) achieves a fracture toughness 3,000&times; greater than monolithic
      aragonite through its <strong>brick-and-mortar architecture</strong>. Bone combines
      compliant collagen with stiff hydroxyapatite in a hierarchical fibrous composite.
      The mantis shrimp dactyl club uses <strong>helicoidal (Bouligand) stacking</strong> to
      resist catastrophic crack propagation during high-velocity strikes.</p>
      <p>Major bio-composite architectures include:</p>
      <ul>
        <li><strong>Brick-and-mortar (nacre)</strong> &mdash; Stiff mineral platelets bonded by
        thin organic layers, producing enormous toughness via crack deflection and platelet
        pull-out.</li>
        <li><strong>Helicoidal (Bouligand)</strong> &mdash; Fiber layers rotate progressively
        through the thickness, creating quasi-isotropic stiffness and exceptional impact
        resistance.</li>
        <li><strong>Functionally graded</strong> &mdash; Gradual transitions in composition
        or structure (e.g., the squid beak) eliminate stress concentrations between hard
        and soft regions.</li>
        <li><strong>Hierarchical fiber composites</strong> &mdash; Multi-level fiber
        organization (as in wood and bone) providing damage tolerance and multifunctional
        response.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Nacre-Inspired Composites",
        items: [
          {
            title: "The Mechanical Design of Nacre",
            author: "Francois Barthelat, Zhen Yin, Markus J. Buehler",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/natrevmats.2016.7",
            desc: "Nature Reviews Materials article dissecting the multiscale toughening mechanisms in nacre and their synthetic replication."
          },
          {
            title: "Ice Templating (Freeze Casting) of Nacre-Like Ceramics",
            author: "Sylvain Deville, Eduardo Saiz, Antoni P. Tomsia",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1120937",
            desc: "Science paper demonstrating freeze-casting as a route to layered ceramic scaffolds mimicking nacre's architecture."
          },
          {
            title: "Bioinspired Ceramics: Turning Brittleness into Toughness",
            author: "Hao Bai, Fei Chen, Bo Li, et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.matt.2019.09.023",
            desc: "Matter review on how nacre-inspired layered and brick-and-mortar architectures transform brittle ceramics into tough composites."
          },
          {
            title: "Freeze Casting: Nacre-Inspired Composites Tutorial",
            author: "Sylvain Deville",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=rYGKb_4hAHQ",
            desc: "Tutorial video explaining the freeze-casting process for creating lamellar and nacre-like architectures from ceramic slurries."
          }
        ]
      },
      {
        title: "Helicoidal & Bouligand",
        items: [
          {
            title: "The Stomatopod Dactyl Club: A Formidable Damage-Tolerant Biological Hammer",
            author: "James C. Weaver, Garrett W. Milliron, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1218764",
            desc: "Science paper revealing the Bouligand structure in the mantis shrimp club and its role in impact damage tolerance."
          },
          {
            title: "Helicoidally Arranged Fiber-Reinforced Composites",
            author: "Lorenzo Mencattelli, Silvestre T. Pinho",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.compscitech.2020.108171",
            desc: "Composites Science and Technology paper analyzing the mechanics of Bouligand-inspired fiber layups for impact-resistant laminates."
          },
          {
            title: "Bio-inspired Helicoidal Composites — Kisailus Lab",
            author: "David Kisailus, UC Irvine / UC Riverside",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=PbT3-p9iYSY",
            desc: "Research presentation on translating the mantis shrimp Bouligand structure into synthetic impact-resistant composites."
          },
          {
            title: "Twisted Plywood Architecture of Collagen Fibrils in Bone",
            author: "Marie-Madeleine Giraud-Guille",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1007/s002230010164",
            desc: "Calcified Tissue International paper on the cholesteric liquid-crystal-like arrangement of collagen fibrils forming Bouligand structures in bone."
          }
        ]
      },
      {
        title: "Functionally Graded Materials",
        items: [
          {
            title: "The Transition from Stiff to Compliant Materials in Squid Beaks",
            author: "Ali Miserez, Todd Schneberk, Chengjun Sun, Frank W. Zok, J. Herbert Waite",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1154117",
            desc: "Science paper on the squid beak's gradient from hard tip to soft base, eliminating stress concentrations at the tissue interface."
          },
          {
            title: "Functionally Graded Materials: Design, Processing, and Applications",
            author: "Yoshinari Miyamoto, W. A. Kaysser, B. H. Rabin, et al.",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1007/978-1-4615-5289-6",
            desc: "Springer monograph on FGM theory and fabrication, including bio-inspired gradient architectures."
          },
          {
            title: "Graded Materials in Biology: The Tooth as a Model System",
            author: "Paul Zaslansky",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/adfm.200600288",
            desc: "Advanced Functional Materials study of the enamel-to-dentin gradient in teeth as a paradigm for engineered graded interfaces."
          },
          {
            title: "Bamboo: A Functionally Graded Composite Material",
            author: "Lorna J. Gibson",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.actbio.2012.04.005",
            desc: "Acta Biomaterialia paper analyzing bamboo's radial density gradient and fiber-volume-fraction grading as an engineering model."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────
     6. RESPONSIVE — Chromogenic, Self-Cleaning & Hydrogels
     ────────────────────────────────────────────────────────── */
  {
    id: "responsive",
    icon: "⬡",
    label: "Responsive Materials",
    intro: `
      <p>Living systems continuously sense and respond to their environment: chameleons change
      color, lotus leaves repel water, and sea cucumbers switch between rigid and compliant
      states. <strong>Responsive and adaptive materials</strong> capture these capabilities
      for applications in camouflage, self-cleaning coatings, drug delivery, and soft
      robotics.</p>
      <p>Major categories of bio-inspired responsive materials:</p>
      <ul>
        <li><strong>Chromogenic materials</strong> &mdash; Materials that change color in response
        to strain, temperature, or light, inspired by cephalopod chromatophores and butterfly
        wing photonic crystals.</li>
        <li><strong>Self-cleaning surfaces</strong> &mdash; Superhydrophobic or photocatalytic
        coatings inspired by the lotus leaf, pitcher plants, and shark skin that resist
        fouling and contamination.</li>
        <li><strong>Stimulus-responsive hydrogels</strong> &mdash; Hydrogels that swell, contract,
        or change properties in response to pH, temperature, light, or biochemical signals,
        mimicking the turgor-driven movements of plant cells.</li>
        <li><strong>Biomimetic sensors</strong> &mdash; Materials and devices inspired by
        biological sensory systems, from piezoelectric hair-cell analogs to artificial
        electronic skins.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Chromogenic Materials",
        items: [
          {
            title: "Adaptive Optics in Cephalopods: Mechanisms and Biomimetic Potential",
            author: "Leila F. Deravi, Andrew P. Magyar, Sean P. Sheehy, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/adma.201301472",
            desc: "Advanced Materials paper on cephalopod chromatophore mechanics and their translation into artificial adaptive coloration systems."
          },
          {
            title: "Structural Colour and the Lotus Effect",
            author: "Pete Vukusic, J. Roy Sambles",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nature01941",
            desc: "Nature review on photonic structures in butterfly wings and beetle shells that produce structural color without pigments."
          },
          {
            title: "Mechanochromic Photonic Crystals",
            author: "Jianping Ge, Yadong Yin",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/anie.201006999",
            desc: "Angewandte Chemie review on colloidal crystal assemblies that shift color under mechanical strain, inspired by chameleon skin."
          },
          {
            title: "Cephalopod-Inspired Camouflage — How It Works",
            author: "TED-Ed",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=SfkhEm3LfvE",
            desc: "Animated explainer on how cephalopods achieve rapid camouflage and what engineers are learning from their skin."
          }
        ]
      },
      {
        title: "Self-Cleaning Surfaces",
        items: [
          {
            title: "Purity of the Sacred Lotus (The Lotus Effect)",
            author: "Wilhelm Barthlott, Christoph Neinhuis",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/s004250050096",
            desc: "The original 1997 paper documenting the lotus leaf's self-cleaning superhydrophobicity, launching an entire field of biomimetic surfaces."
          },
          {
            title: "Bioinspired Self-Cleaning Surfaces with Superhydrophobicity",
            author: "Yongmei Zheng, Xuefeng Gao, Lei Jiang",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1039/B818940D",
            desc: "Soft Matter review on superhydrophobic surface fabrication methods inspired by lotus, rice leaf, and butterfly wing architectures."
          },
          {
            title: "SLIPS: Slippery Liquid-Infused Porous Surfaces",
            author: "Tak-Sing Wong, Sung Hoon Kang, Sindy K. Y. Tang, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nature10447",
            desc: "Nature paper on pitcher-plant-inspired SLIPS coatings that repel virtually all liquids and resist biofouling."
          },
          {
            title: "Shark Skin and Anti-Fouling Surfaces — Sharklet",
            author: "Anthony Brennan, University of Florida",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=HOHi5cQbyBk",
            desc: "Video on how the microtopography of shark skin inspired Sharklet, a texture that inhibits bacterial colonization without chemicals."
          }
        ]
      },
      {
        title: "Stimulus-Responsive Systems",
        items: [
          {
            title: "Hydrogels in Biology and Medicine",
            author: "Nikolaos A. Peppas, Jindrich Kopecek, et al.",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1007/978-3-662-57776-1",
            desc: "Springer volume on stimulus-responsive hydrogels for drug delivery, tissue engineering, and soft actuators."
          },
          {
            title: "Bio-Inspired pH-Responsive Polymers for Drug Delivery",
            author: "Simona Mura, Julien Nicolas, Patrick Couvreur",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nmat3776",
            desc: "Nature Materials review on stimulus-responsive nanocarriers that release payloads in response to biological triggers."
          },
          {
            title: "Electronic Skin (E-Skin): Biomimetic Tactile Sensors",
            author: "Zhenan Bao, Stanford University",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=0UB5JTwIkYg",
            desc: "Stanford lecture on pressure-sensitive electronic skin inspired by human mechanoreceptors for prosthetics and robotics."
          },
          {
            title: "Artificial Muscles from Fishing Line and Sewing Thread",
            author: "Carter S. Haines, Marcio D. Lima, Na Li, et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1126/science.1246906",
            desc: "Science paper on twisted-fiber artificial muscles that actuate thermally, inspired by biological muscle hierarchical structure."
          }
        ]
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────
     7. MANUFACTURING — 3D Printing, Electrospinning & Assembly
     ────────────────────────────────────────────────────────── */
  {
    id: "manufacturing",
    icon: "⟐",
    label: "Manufacturing",
    intro: `
      <p>Translating biological architectures into real materials demands manufacturing methods
      capable of controlling structure across multiple length scales. Conventional processing
      (casting, machining) cannot reproduce the hierarchical, anisotropic, and graded
      architectures found in bone, nacre, or wood. <strong>Advanced manufacturing</strong>
      techniques&mdash;additive manufacturing, electrospinning, freeze-casting, and molecular
      self-assembly&mdash;now enable increasingly faithful replication of nature's designs.</p>
      <p>Key manufacturing approaches for biomimetic materials:</p>
      <ul>
        <li><strong>3D printing / additive manufacturing</strong> &mdash; Layer-by-layer
        fabrication enabling complex internal architectures, multi-material gradients, and
        patient-specific biomedical implants.</li>
        <li><strong>Electrospinning</strong> &mdash; Electrostatic drawing of polymer solutions
        into nanofibers mimicking the extracellular matrix, widely used for tissue engineering
        scaffolds and filtration membranes.</li>
        <li><strong>Freeze-casting / ice-templating</strong> &mdash; Directional solidification
        of aqueous slurries to create lamellar or nacre-like architectures in ceramics and
        composites.</li>
        <li><strong>Molecular self-assembly</strong> &mdash; Bottom-up formation of nanostructures
        from peptides, block copolymers, or DNA origami, paralleling how biology builds from
        molecular building blocks.</li>
      </ul>
    `,
    subsections: [
      {
        title: "3D Printing & Bio-Fabrication",
        items: [
          {
            title: "3D Bioprinting of Tissues and Organs",
            author: "Sean V. Murphy, Anthony Atala",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nbt.2958",
            desc: "Nature Biotechnology review covering bioprinting strategies, bioink development, and organ fabrication challenges."
          },
          {
            title: "Multi-Material 3D Printing of Biomimetic Composites",
            author: "Lizhi Xu, Markus J. Buehler, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/adma.201904845",
            desc: "Advanced Materials paper on multi-material 3D printing of nacre-inspired and bone-inspired composite architectures."
          },
          {
            title: "Bioprinting — 3D Printing Human Tissues",
            author: "Organovo / Nature Video",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=gzU-93gEpRg",
            desc: "Nature video explaining how bioprinters deposit living cells to build tissue constructs layer by layer."
          },
          {
            title: "Slic3r / PrusaSlicer — Open Source 3D Printing Toolchain",
            author: "Prusa Research",
            type: "code",
            level: "intermediate",
            url: "https://github.com/prusa3d/PrusaSlicer",
            desc: "Open-source slicer for FDM and SLA printing, extensible for custom infill patterns inspired by biological architectures."
          }
        ]
      },
      {
        title: "Electrospinning & Nanofibers",
        items: [
          {
            title: "Electrospinning: A Fascinating Fiber Fabrication Technique",
            author: "Naveen Bhardwaj, Subhas C. Kundu",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.biotechadv.2010.01.004",
            desc: "Biotechnology Advances review covering electrospinning fundamentals, fiber morphology control, and biomimetic scaffold applications."
          },
          {
            title: "An Introduction to Electrospinning and Nanofibers",
            author: "Seeram Ramakrishna, Kazutoshi Fujihara, Wee-Eong Teo, et al.",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1142/5894",
            desc: "World Scientific textbook providing a thorough introduction to electrospinning theory, practice, and biomedical applications."
          },
          {
            title: "Electrospun Nanofibers for Tissue Engineering Scaffolds",
            author: "Wan-Ju Li, Cato T. Laurencin, Edward J. Caterson, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/jbm.a.10167",
            desc: "Journal of Biomedical Materials Research paper on electrospun PLGA nanofiber scaffolds mimicking the collagen matrix of cartilage."
          },
          {
            title: "How Electrospinning Works — Georgia Tech",
            author: "Georgia Tech Materials Lab",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=D4jPTlwJJGE",
            desc: "Short explainer video demonstrating the electrospinning process and showing nanofiber mat formation in real time."
          }
        ]
      },
      {
        title: "Self-Assembly & Bottom-Up Methods",
        items: [
          {
            title: "Self-Assembly at All Scales",
            author: "George M. Whitesides, Bartosz Grzybowski",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1126/science.1070821",
            desc: "Science review on self-assembly from molecular to macroscopic scales, a cornerstone reference for bottom-up biomimetic fabrication."
          },
          {
            title: "DNA Origami: Scaffolded DNA Nanostructures",
            author: "Paul W. K. Rothemund",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nature04586",
            desc: "Nature paper introducing DNA origami, enabling programmable nanoscale shapes that serve as templates for biomimetic material assembly."
          },
          {
            title: "Peptide Self-Assembly for Materials Science",
            author: "Shuguang Zhang",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nbt874",
            desc: "Nature Biotechnology perspective on designer peptides that self-assemble into nanofibers, hydrogels, and functional biomaterials."
          },
          {
            title: "Block Copolymer Self-Assembly for Nanolithography",
            author: "Caroline A. Ross, Karl K. Berggren, et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nmat3785",
            desc: "Nature Materials review on block copolymer microphase separation as a bottom-up patterning technique for nanoscale materials."
          },
          {
            title: "cadnano — Open Source DNA Origami Design Tool",
            author: "Shawn Douglas, Wyss Institute",
            type: "code",
            level: "intermediate",
            url: "https://github.com/cadnano/cadnano2.5",
            desc: "Open-source software for designing DNA origami nanostructures, used to create programmable templates for biomimetic assembly."
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
