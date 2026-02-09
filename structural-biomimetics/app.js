/* ================================================================
   STRUCTURAL BIOMIMETICS  --  Curated Reference Hub
   How nature builds structural materials & how engineers replicate them
   ================================================================ */

const SECTIONS = [

  /* ---------------------------------------------------------------
     1. OVERVIEW
     --------------------------------------------------------------- */
  {
    id: "overview",
    icon: "◈",
    label: "Overview",
    intro: `
      <p>
        Structural biomimetics is the science of understanding <strong>how living organisms
        build load-bearing materials</strong> and translating those strategies into
        engineered systems. From the mineralized collagen of bone to the
        brick-and-mortar architecture of nacre, biology achieves extraordinary
        mechanical performance using a limited palette of weak constituents
        arranged in <em>hierarchical, multi-scale architectures</em>.
      </p>
      <ul>
        <li><strong>Hierarchy</strong> &mdash; structural features span from the nanoscale
            (protein fibrils, mineral platelets) through the microscale (lamellae,
            osteons) to the macroscale (whole organs), each level contributing
            distinct mechanical functions.</li>
        <li><strong>Composite design</strong> &mdash; natural materials combine hard
            (mineral) and soft (polymer) phases to break the classic
            strength&ndash;toughness trade-off that limits synthetic engineering
            materials.</li>
        <li><strong>Adaptive growth</strong> &mdash; unlike manufactured parts, biological
            structures grow, remodel, and self-heal in response to mechanical
            loading (Wolff&rsquo;s law), creating optimized architectures that
            engineers seek to replicate through additive manufacturing, freeze-casting,
            and self-assembly.</li>
      </ul>
      <p>
        The resources below provide a broad foundation&mdash;from landmark textbooks
        and review papers to introductory lectures and online courses.
      </p>`,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          {
            title: "Biological Materials Science",
            author: "Marc A. Meyers & Po-Yu Chen",
            type: "book",
            level: "intermediate",
            url: "https://www.cambridge.org/core/books/biological-materials-science/EDC36F5999F032F98464C60E1CA07460",
            desc: "Comprehensive Cambridge textbook covering biological materials, bioinspired materials, and biomaterials from a materials-science perspective. Ideal graduate-level reference with 644 pages spanning shells, silk, bone, and wood."
          },
          {
            title: "Materials Design Inspired by Nature: Function Through Inner Architecture",
            author: "Peter Fratzl, John Dunlop & Richard Weinkamer (Eds.)",
            type: "book",
            level: "advanced",
            url: "https://pubs.rsc.org/en/content/ebook/978-1-84973-553-7",
            desc: "Multi-author volume exploring how nature's inner architectures produce function, from self-assembly of mineralized tissues to actuation in plant systems."
          },
          {
            title: "Cellular Solids: Structure and Properties",
            author: "Lorna J. Gibson & Michael F. Ashby",
            type: "book",
            level: "intermediate",
            url: "https://www.cambridge.org/core/books/cellular-solids/BC25789552BAA8E3CAD5E1D105612AB5",
            desc: "Classic Cambridge text on honeycomb and foam mechanics with extensive treatment of natural cellular materials including wood, cork, and cancellous bone."
          },
          {
            title: "Architectured Materials in Nature and Engineering",
            author: "Yuri Estrin, Yves Brechet, John Dunlop & Peter Fratzl (Eds.)",
            type: "book",
            level: "advanced",
            url: "https://link.springer.com/book/10.1007/978-3-030-11942-3",
            desc: "Springer volume bridging architecture in biological systems with engineered architectured materials, covering topology, interfaces, and multi-functionality."
          }
        ]
      },
      {
        title: "Lectures & Overviews",
        items: [
          {
            title: "Biomimicry in Action (TED Talk)",
            author: "Janine Benyus",
            type: "video",
            level: "beginner",
            url: "https://www.ted.com/talks/janine_benyus_biomimicry_in_action",
            desc: "Foundational 20-minute TED talk introducing biomimicry principles: how engineers can look to nature first when solving design problems in materials, structures, and systems."
          },
          {
            title: "Biomimetic Principles and Design (MIT OCW 2.A35)",
            author: "Michael Triantafyllou, MIT",
            type: "course",
            level: "beginner",
            url: "https://ocw.mit.edu/courses/2-a35-biomimetic-principles-and-design-fall-2013/",
            desc: "MIT freshman seminar introducing biomimetic design through systematic study of live organisms, covering locomotion, sensing, and structural adaptation."
          },
          {
            title: "Cellular Solids: Structure, Properties and Applications (MIT OCW 3.054)",
            author: "Lorna J. Gibson, MIT",
            type: "course",
            level: "intermediate",
            url: "https://ocw.mit.edu/courses/3-054-cellular-solids-structure-properties-and-applications-spring-2015/",
            desc: "Full MIT course with video lectures on honeycombs, foams, natural cellular materials (wood, trabecular bone), and biomedical applications such as tissue scaffolds."
          },
          {
            title: "Nanomechanics of Materials and Biomaterials (MIT OCW 3.052)",
            author: "Christine Ortiz, MIT",
            type: "course",
            level: "advanced",
            url: "https://ocw.mit.edu/courses/3-052-nanomechanics-of-materials-and-biomaterials-spring-2007/",
            desc: "Graduate-level MIT course exploring nanoscale mechanical behavior of synthetic and biological materials, including cartilage, bone, and nacre at the single-molecule level."
          }
        ]
      },
      {
        title: "Review Articles",
        items: [
          {
            title: "Bioinspired Structural Materials",
            author: "Wegst, Bai, Saiz, Tomsia & Ritchie",
            type: "notes",
            level: "intermediate",
            url: "https://www.nature.com/articles/nmat4089",
            desc: "Landmark 2015 Nature Materials review surveying common design motifs in natural structural materials and the challenges of replicating hierarchical architectures synthetically."
          },
          {
            title: "Biomimetic Materials Research: What Can We Really Learn from Nature's Structural Materials?",
            author: "Peter Fratzl",
            type: "notes",
            level: "intermediate",
            url: "https://royalsocietypublishing.org/doi/10.1098/rsif.2007.0218",
            desc: "Influential essay in Journal of the Royal Society Interface arguing that the key lessons from nature are principles of hierarchical structuring and adaptive growth rather than specific chemistries."
          },
          {
            title: "Nature's Hierarchical Materials",
            author: "Peter Fratzl & Richard Weinkamer",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.pmatsci.2007.06.001",
            desc: "Progress in Materials Science review detailing how hierarchy creates multi-functionality in bone, wood, and other biological composites across multiple length scales."
          },
          {
            title: "Biomimetic Structural Materials: Inspiration from Design and Assembly",
            author: "Zhao, Guo, Zhu, Espinosa & He",
            type: "notes",
            level: "advanced",
            url: "https://www.annualreviews.org/doi/10.1146/annurev-physchem-040215-112621",
            desc: "Annual Review of Physical Chemistry article examining the assembly principles behind nacre, bone, and silk and how they inform next-generation composite design."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     2. NACRE
     --------------------------------------------------------------- */
  {
    id: "nacre",
    icon: "◇",
    label: "Nacre & Bio-Ceramics",
    intro: `
      <p>
        Nacre, the iridescent inner lining of mollusk shells, is the archetype
        of a <strong>biological ceramic composite</strong>. It is composed of
        roughly 95&nbsp;vol% brittle aragonite (CaCO<sub>3</sub>) tablets
        bonded by ~5&nbsp;vol% organic biopolymer in a
        <em>brick-and-mortar</em> microstructure. Despite being almost entirely
        ceramic, nacre achieves a work of fracture approximately
        <strong>3,000&times;</strong> higher than monolithic aragonite.
      </p>
      <ul>
        <li><strong>Tablet sliding</strong> &mdash; under tension, polygonal
            tablets slide on one another in large numbers, dissipating energy
            through frictional and viscoelastic mechanisms at the organic
            interfaces.</li>
        <li><strong>Mineral bridges &amp; nanoasperities</strong> &mdash;
            nanoscale bridges and surface roughness features across the
            tablet&ndash;organic interface enhance load transfer and crack
            deflection.</li>
        <li><strong>Synthetic nacre</strong> &mdash; researchers use
            freeze-casting, layer-by-layer deposition, and 3D printing to
            replicate the brick-and-mortar motif in alumina, glass, and
            polymer systems.</li>
      </ul>`,
    subsections: [
      {
        title: "Biological Studies",
        items: [
          {
            title: "An Experimental Investigation of Deformation and Fracture of Nacre -- Mother of Pearl",
            author: "Francois Barthelat & Horacio D. Espinosa",
            type: "notes",
            level: "advanced",
            url: "https://link.springer.com/article/10.1007/s11340-007-9040-1",
            desc: "Experimental Mechanics paper combining nanoindentation and in-situ SEM tensile tests to reveal how nacre's microstructure controls tablet sliding, crack bridging, and energy dissipation."
          },
          {
            title: "Mechanical Properties of Nacre Constituents and Their Impact on Mechanical Performance",
            author: "Barthelat, Li, Comi & Espinosa",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1557/jmr.2006.0239",
            desc: "Journal of Materials Research study using nanoindentation of individual aragonite tablets from red abalone to measure elastic and inelastic properties at the constituent level."
          },
          {
            title: "Nacre from Mollusk Shells: A Model for High-Performance Structural Materials",
            author: "Francois Barthelat",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1088/1748-3182/5/3/035001",
            desc: "Bioinspiration & Biomimetics review establishing nacre as the model system for studying toughening by hierarchical architecture in biological ceramics."
          },
          {
            title: "Mollusk Shell Nacre Ultrastructure Correlates with Environmental Temperature and Pressure",
            author: "Olson, Metzler, Tamura et al.",
            type: "notes",
            level: "advanced",
            url: "https://pubs.acs.org/doi/full/10.1021/ja210808s",
            desc: "JACS paper demonstrating that nacre tablet thickness and organic-layer spacing vary with environment, linking ultrastructural features to biomineralization conditions."
          }
        ]
      },
      {
        title: "Synthetic Nacre",
        items: [
          {
            title: "Tough, Bio-Inspired Hybrid Materials",
            author: "Launey, Munch, Alsem, Saiz, Tomsia & Ritchie",
            type: "notes",
            level: "advanced",
            url: "https://www.science.org/doi/abs/10.1126/science.1164865",
            desc: "Science paper on freeze-cast alumina-PMMA composites achieving nacre-like brick-and-mortar architectures with fracture toughness values exceeding 30 MPa m^(1/2)."
          },
          {
            title: "A Review of Nacre-Inspired Materials: Chemistry, Strengthening-Deformation Mechanism, Synthesis, and Applications",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.sciencedirect.com/science/article/abs/pii/S0079642523001007",
            desc: "Comprehensive 2023 Progress in Materials Science review covering the full landscape of nacre-inspired composites from chemistry-level understanding to large-scale applications."
          },
          {
            title: "Impact-Resistant Nacre-Like Transparent Materials",
            author: "Yin, Hannard & Barthelat",
            type: "notes",
            level: "advanced",
            url: "https://www.science.org/doi/10.1126/science.aaw8988",
            desc: "Science paper demonstrating that laser-engraved glass panels with nacre-inspired tablet architectures dramatically increase impact resistance while maintaining transparency."
          },
          {
            title: "Bio-Based Artificial Nacre with Excellent Mechanical and Barrier Properties",
            author: "Wan, Hu, Chen et al.",
            type: "notes",
            level: "intermediate",
            url: "https://pubs.acs.org/doi/10.1021/acsnano.6b05780",
            desc: "ACS Nano paper presenting a facile in-situ reduction and cross-linking method to produce artificial nacre from montmorillonite and cellulose nanofibers."
          }
        ]
      },
      {
        title: "Mechanical Modeling",
        items: [
          {
            title: "Toughness Amplification in Natural Composites",
            author: "Francois Barthelat & Reza Rabiei",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.jmps.2011.03.007",
            desc: "Journal of the Mechanics and Physics of Solids paper presenting analytical and FE models of tablet pullout, crack bridging, and process-zone toughening in staggered composites."
          },
          {
            title: "The Toughening Mechanism of Nacre and Structural Materials Inspired by Nacre",
            author: "Sun & Bhushun",
            type: "notes",
            level: "intermediate",
            url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5090675/",
            desc: "Open-access RSC Advances review synthesizing the main toughening mechanisms: crack deflection, fiber pullout, organic-layer viscoelasticity, and mineral bridging."
          },
          {
            title: "Biomimetic Design of Materials and Biomaterials Inspired by the Structure of Nacre",
            author: "Luz & Mano",
            type: "notes",
            level: "intermediate",
            url: "https://royalsocietypublishing.org/doi/10.1098/rsta.2009.0007",
            desc: "Philosophical Transactions of the Royal Society A paper reviewing how hierarchical organization and nanoscale features produce the remarkable mechanical properties of nacre."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     3. SILK
     --------------------------------------------------------------- */
  {
    id: "silk",
    icon: "∿",
    label: "Silk & Bio-Fibers",
    intro: `
      <p>
        Spider dragline silk combines a <strong>tensile strength approaching
        that of steel</strong> with an elasticity five times greater than
        Kevlar, yielding one of the highest specific toughness values of any
        known material. Silkworm (<em>Bombyx mori</em>) silk, while more
        modest in performance, is produced on an industrial scale and has
        inspired millennia of textile engineering.
      </p>
      <ul>
        <li><strong>Protein structure</strong> &mdash; dragline silk is composed
            of major ampullate spidroins (MaSp1/MaSp2) with alternating
            crystalline beta-sheet domains and amorphous glycine-rich linkers
            that give the fiber its unique combination of stiffness and
            extensibility.</li>
        <li><strong>Spinning process</strong> &mdash; the spider&rsquo;s spinneret
            applies shear and pH gradients to convert a liquid-crystalline
            protein dope into a solid fiber; this process is a target for
            biomimetic replication.</li>
        <li><strong>Recombinant silk</strong> &mdash; companies such as Bolt
            Threads, Spiber, and AMSilk use engineered bacteria, yeast, or
            transgenic silkworms to produce spidroin analogs at scale.</li>
      </ul>`,
    subsections: [
      {
        title: "Silk Biology & Chemistry",
        items: [
          {
            title: "Liquid Crystalline Spinning of Spider Silk",
            author: "Fritz Vollrath & David P. Knight",
            type: "notes",
            level: "advanced",
            url: "https://www.nature.com/articles/35069000",
            desc: "Nature paper demonstrating that spider silk is spun from a liquid-crystalline dope via a sophisticated die, overturning the simple-composite model and establishing modern silk science."
          },
          {
            title: "Spider Silks: Recombinant Synthesis, Assembly, Spinning, and Engineering of Synthetic Proteins",
            author: "Vendrely & Scheibel",
            type: "notes",
            level: "advanced",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC534800/",
            desc: "Comprehensive review of spidroin gene structure, recombinant production strategies, in-vitro assembly, and biomimetic spinning approaches."
          },
          {
            title: "Silk Spinning in Silkworms and Spiders",
            author: "Eisoldt, Smith & Scheibel",
            type: "notes",
            level: "intermediate",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5000687/",
            desc: "Comparative review of the spinning apparatus and molecular mechanisms in silkworms and spiders, highlighting shared principles and evolutionary divergence."
          },
          {
            title: "Spider Silk Proteins -- Mechanical Property and Gene Sequence",
            author: "Hayashi, Shipley & Lewis",
            type: "notes",
            level: "intermediate",
            url: "https://bioone.org/journals/zoological-science/volume-22/issue-3/zsj.22.273/Spider-Silk-Proteins--Mechanical-Property-and-Gene-Sequence/10.2108/zsj.22.273.full",
            desc: "Zoological Science review correlating spidroin gene sequences across spider species with the resulting mechanical properties of dragline, flagelliform, and minor ampullate silks."
          }
        ]
      },
      {
        title: "Engineered Silk Materials",
        items: [
          {
            title: "Doing What Spiders Cannot -- A Road Map to Supreme Artificial Silk Fibers",
            author: "Arndt, Mueller, Gosline et al.",
            type: "notes",
            level: "advanced",
            url: "https://pubs.acs.org/doi/10.1021/acsnano.0c08933",
            desc: "ACS Nano perspective outlining the gap between natural and recombinant silk performance and proposing strategies for molecular-weight control, spinning optimization, and post-spin drawing."
          },
          {
            title: "Towards Engineering and Production of Artificial Spider Silk Using Tools of Synthetic Biology",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9996717/",
            desc: "Open-access review covering synthetic-biology toolkits (E. coli, yeast, plants, transgenic silkworms) for producing high-molecular-weight spidroins at industrial scale."
          },
          {
            title: "Transgenic Silkworms (Bombyx mori) Produce Recombinant Spider Dragline Silk in Cocoons",
            author: "Wen, Lan, Zhang et al.",
            type: "notes",
            level: "advanced",
            url: "https://link.springer.com/article/10.1007/s11033-009-9615-2",
            desc: "Molecular Biology Reports paper demonstrating that piggyBac-transformed silkworms can spin cocoons containing MaSp1 dragline silk with enhanced tensile strength and elasticity."
          },
          {
            title: "Bioengineering of Spider Silks for the Production of Biomedical Materials",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.frontiersin.org/journals/bioengineering-and-biotechnology/articles/10.3389/fbioe.2022.958486/full",
            desc: "Frontiers in Bioengineering review of silk-based biomaterials for scaffolds, hydrogels, films, fibers, and nanoparticles in tissue engineering."
          }
        ]
      },
      {
        title: "Applications & Industry",
        items: [
          {
            title: "Microsilk -- Vegan Silk Inspired by Spider Silk (Bolt Threads)",
            author: "Bolt Threads",
            type: "data",
            level: "beginner",
            url: "https://boltthreads.com/technology/microsilk/",
            desc: "Product page for Bolt Threads' Microsilk platform, describing how yeast fermentation produces spider-silk-inspired protein fibers for textiles in partnership with Patagonia."
          },
          {
            title: "Spider Silk Biomimetics Programs to Inform the Development of New Wearable Technologies",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.frontiersin.org/journals/materials/articles/10.3389/fmats.2020.00029/full",
            desc: "Frontiers in Materials review exploring how spider-silk biomimetics inform next-generation wearable devices and smart textiles through tunable mechanical and sensing properties."
          },
          {
            title: "Review of Spider Silk Applications in Biomedical and Tissue Engineering",
            author: "Various authors",
            type: "notes",
            level: "beginner",
            url: "https://www.mdpi.com/2313-7673/9/3/169",
            desc: "Open-access 2024 Biomimetics journal review surveying spider silk in wound healing, drug delivery, nerve conduits, and bone scaffolds."
          },
          {
            title: "Disentangling the Web: An Interdisciplinary Review on the Potential and Feasibility of Spider Silk Bioproduction",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://pubs.acs.org/doi/10.1021/acsbiomaterials.4c00145",
            desc: "ACS Biomaterials Science & Engineering review evaluating the technical and economic feasibility of scaling recombinant spider silk production for real-world applications."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     4. BONE
     --------------------------------------------------------------- */
  {
    id: "bone",
    icon: "△",
    label: "Bone & Skeletal",
    intro: `
      <p>
        Bone is a <strong>mineralized collagen composite</strong> that
        combines the stiffness of hydroxyapatite nanocrystals with the
        toughness of a Type-I collagen matrix. At every hierarchical level
        &mdash; from the ~67&nbsp;nm staggered mineralized fibrils, through
        the lamellar and osteonal microstructure, to the cortical&ndash;trabecular
        macrostructure &mdash; bone exhibits design principles that engineers
        seek to replicate.
      </p>
      <ul>
        <li><strong>Wolff&rsquo;s law</strong> &mdash; bone remodels its
            architecture in response to mechanical loading, a biological
            implementation of topology optimization that continually minimizes
            mass for a given load case.</li>
        <li><strong>Toughening cascades</strong> &mdash; at the nanoscale,
            sacrificial bonds in the organic matrix dissipate energy; at the
            microscale, crack deflection along cement lines and uncracked
            ligament bridging arrest propagation.</li>
        <li><strong>Bone-inspired scaffolds</strong> &mdash; 3D-printed and
            freeze-cast scaffolds mimic trabecular porosity and cortical
            lamination for bone tissue engineering and implant design.</li>
      </ul>`,
    subsections: [
      {
        title: "Bone Biology & Mechanics",
        items: [
          {
            title: "Bones: Structure and Mechanics",
            author: "John D. Currey",
            type: "book",
            level: "intermediate",
            url: "https://press.princeton.edu/books/paperback/9780691180496/bones",
            desc: "Definitive Princeton University Press text on the mechanical design of bone, covering mineralization, microstructure, fracture, fatigue, and the mechanical adaptations of antler, dentine, and enamel."
          },
          {
            title: "The Structure and Mechanics of Bone",
            author: "Jae-Young Rho, Liisa Kuhn-Spearing & Peter Zioupos",
            type: "notes",
            level: "intermediate",
            url: "https://link.springer.com/article/10.1007/s10853-011-5914-9",
            desc: "Journal of Materials Science review covering bone hierarchy from nanoscale mineral crystals to macroscale cortical and trabecular organization, with extensive mechanical-property data."
          },
          {
            title: "From Wolff's Law to the Utah Paradigm: Insights About Bone Physiology and Its Clinical Applications",
            author: "Harold M. Frost",
            type: "notes",
            level: "advanced",
            url: "https://onlinelibrary.wiley.com/doi/full/10.1002/ar.1049",
            desc: "Anatomical Record paper tracing the evolution of understanding from Wolff's original law to the mechanostat model, clarifying how bone cells sense and respond to strain."
          },
          {
            title: "Multiscale Toughening Mechanisms in Biological Materials and Bioinspired Designs",
            author: "Huang, Rahbar, Ritchie et al.",
            type: "notes",
            level: "advanced",
            url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/adma.201901561",
            desc: "Advanced Materials review cataloging intrinsic and extrinsic toughening mechanisms across hierarchical levels in bone, nacre, and tooth enamel."
          }
        ]
      },
      {
        title: "Bone-Inspired Engineering",
        items: [
          {
            title: "Integrating Computational and Experimental Advances in Bone Multiscale Mechanics",
            author: "Various authors",
            type: "notes",
            level: "advanced",
            url: "https://www.sciencedirect.com/science/article/pii/S0079642525000490",
            desc: "Progress in Materials Science review bridging DFT, MD, and continuum-FE modeling with experimental techniques to build a bottom-up understanding of bone mechanics."
          },
          {
            title: "Multiscale Modeling of Bone Tissue Mechanobiology",
            author: "Various authors",
            type: "notes",
            level: "advanced",
            url: "https://www.sciencedirect.com/science/article/pii/S8756328221001940",
            desc: "Bone journal review surveying computational models that link cellular mechanotransduction to tissue-level remodeling, informing bone-inspired adaptive structures."
          },
          {
            title: "Biomimetic Approaches for the Design and Fabrication of Bone-to-Soft Tissue Interfaces",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://pubs.acs.org/doi/10.1021/acsbiomaterials.1c00620",
            desc: "ACS Biomaterials Science & Engineering review on graded interfaces inspired by the tendon-bone enthesis, addressing gradient mineralization and fiber orientation."
          },
          {
            title: "Data-Driven Computational Simulation in Bone Mechanics",
            author: "Hambli et al.",
            type: "notes",
            level: "advanced",
            url: "https://pubmed.ncbi.nlm.nih.gov/32681405/",
            desc: "Review of machine-learning and data-driven approaches to predicting bone mechanical response, bridging traditional FEA with neural-network surrogates."
          }
        ]
      },
      {
        title: "Biomedical Scaffolds",
        items: [
          {
            title: "Biomimetic Structural Design in 3D-Printed Scaffolds for Bone Tissue Engineering",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.sciencedirect.com/science/article/pii/S2590006425002224",
            desc: "Recent review on how 3D-printed scaffolds replicate multi-level microporous bone architecture to support cellular processes while optimizing mechanical properties."
          },
          {
            title: "Design, Materials, and Mechanobiology of Biodegradable Scaffolds for Bone Tissue Engineering",
            author: "Velasco et al.",
            type: "notes",
            level: "intermediate",
            url: "https://onlinelibrary.wiley.com/doi/10.1155/2015/729076",
            desc: "Open-access BioMed Research International review covering scaffold design parameters, material selection, and the mechanobiological environment for bone regeneration."
          },
          {
            title: "Ti6Al4V Biomimetic Scaffolds for Bone Tissue Engineering: Fabrication, Biomechanics and Osseointegration",
            author: "Various authors",
            type: "notes",
            level: "advanced",
            url: "https://www.sciencedirect.com/science/article/pii/S0264127523007451",
            desc: "Materials & Design paper demonstrating that 65% porosity and 550 um pore size in titanium alloy scaffolds best mimics trabecular bone and promotes osseointegration."
          },
          {
            title: "Machine Learning Approaches for the Design of Biomechanically Compatible Bone Tissue Engineering Scaffolds",
            author: "Various authors",
            type: "notes",
            level: "advanced",
            url: "https://www.sciencedirect.com/science/article/pii/S0045782524000987",
            desc: "CMAME paper using ML to automatically identify TPMS scaffold microstructures satisfying mechanical, mechano-biological, and manufacturing constraints simultaneously."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     5. WOOD
     --------------------------------------------------------------- */
  {
    id: "wood",
    icon: "☘",
    label: "Wood & Plant Structures",
    intro: `
      <p>
        Wood, bamboo, and other plant tissues are nature&rsquo;s most
        abundant <strong>structural composites</strong>, built from cellulose
        microfibrils embedded in a hemicellulose&ndash;lignin matrix. These
        cellular solids achieve remarkable specific stiffness and strength
        through the orientation of fiber-reinforced cell walls, the graded
        density of growth rings, and the hierarchical porosity that spans
        from nanoscale fibril bundles to macroscale vessels.
      </p>
      <ul>
        <li><strong>Cellulose microfibrils</strong> &mdash; individual
            crystalline cellulose chains (~3&ndash;5&nbsp;nm diameter)
            aggregate into microfibrils with a tensile modulus exceeding
            130&nbsp;GPa, rivalling glass and Kevlar fibers.</li>
        <li><strong>Bamboo</strong> &mdash; with theoretical fiber strengths
            of 1,200&ndash;1,930&nbsp;MPa and a density-graded distribution
            of vascular bundles, bamboo is among the most efficient natural
            structural materials per unit mass.</li>
        <li><strong>Nanocellulose</strong> &mdash; cellulose nanocrystals (CNC)
            and cellulose nanofibers (CNF) extracted from wood pulp serve as
            renewable reinforcing phases for bio-inspired composites, coatings,
            and transparent films.</li>
      </ul>`,
    subsections: [
      {
        title: "Plant Structural Biology",
        items: [
          {
            title: "Cellular Materials in Nature and Medicine",
            author: "Lorna J. Gibson, Michael F. Ashby & Brendan A. Harley",
            type: "book",
            level: "intermediate",
            url: "https://www.cambridge.org/core/books/cellular-materials-in-nature-and-medicine/B0B0F25753CA045EFD1E07B4011E2B29",
            desc: "Cambridge text extending the cellular-solids framework to biological tissues including wood, cork, palm, and trabecular bone, with detailed structure-property models."
          },
          {
            title: "Mechanical Behavior of Bamboo, and Its Biomimetic Composites and Structural Members: A Systematic Review",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://link.springer.com/article/10.1007/s42235-023-00430-1",
            desc: "Journal of Bionic Engineering systematic review covering bamboo's gradient microstructure, mechanical properties, and how biomimetic composites replicate its architecture."
          },
          {
            title: "Multifunctional Bamboo Based Materials Empowered by Multiscale Hierarchical Structures",
            author: "Huang et al.",
            type: "notes",
            level: "advanced",
            url: "https://advanced.onlinelibrary.wiley.com/doi/10.1002/adma.202507844",
            desc: "Advanced Materials critical review summarizing bamboo's chemical composition, gradient and hollow structures, and new composite materials inspired by its structural features."
          }
        ]
      },
      {
        title: "Cellulose & Nanocellulose",
        items: [
          {
            title: "Advanced Functional Materials Based on Bamboo Cellulose Fibers with Different Crystal Structures",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.sciencedirect.com/science/article/abs/pii/S1359835X2100470X",
            desc: "Composites Part A paper exploring how cellulose polymorphs (I, II, III) from bamboo influence properties of films, aerogels, and reinforced composites."
          },
          {
            title: "Bioinspired Structural Hydrogels with Highly Ordered Hierarchical Orientations by Flow-Induced Alignment of Nanofibrils",
            author: "Various authors",
            type: "notes",
            level: "advanced",
            url: "https://www.nature.com/articles/s41467-023-44481-8",
            desc: "Nature Communications paper demonstrating flow-induced alignment of cellulose nanofibrils into hydrogels mimicking the anisotropic architecture of wood and tendon."
          },
          {
            title: "Transformation of Bamboo: From Multiscale Fibers to Robust and Degradable Cellulose-Based Materials for Plastic Substitution",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://pubmed.ncbi.nlm.nih.gov/40256834/",
            desc: "Study on multiscale interface engineering to transform bamboo into moldable, biodegradable cellulose materials with specific strength of ~271.8 kN m/kg and impact toughness of ~58 kJ/m2."
          },
          {
            title: "Characterization and Structural Properties of Bamboo Fibre Solid Foams",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://link.springer.com/article/10.1007/s10570-020-03565-0",
            desc: "Cellulose journal paper investigating bamboo-fiber-based solid foams as sustainable, lightweight structural materials with tunable porosity and mechanical performance."
          }
        ]
      },
      {
        title: "Wood-Inspired Design",
        items: [
          {
            title: "Engineering Transverse Cell Deformation of Bamboo by Controlling Localized Moisture Content",
            author: "Various authors",
            type: "notes",
            level: "advanced",
            url: "https://www.nature.com/articles/s41467-025-59453-3",
            desc: "Nature Communications paper demonstrating programmable shape change in bamboo through moisture control, inspiring hygroscopic actuators and adaptive building materials."
          },
          {
            title: "Bioinspired Building Materials -- Lessons from Nature",
            author: "Various authors",
            type: "notes",
            level: "beginner",
            url: "https://www.frontiersin.org/journals/materials/articles/10.3389/fmats.2023.1283163/full",
            desc: "Open-access Frontiers in Materials review of how wood, bamboo, and other plant structures inspire sustainable construction materials and green building design."
          },
          {
            title: "Replacing Plastic with Bamboo: A Review of the Properties and Green Applications of Bamboo-Fiber-Reinforced Polymer Composites",
            author: "Various authors",
            type: "notes",
            level: "beginner",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10647463/",
            desc: "Open-access Polymers review evaluating bamboo-fiber-reinforced composites as sustainable alternatives to petroleum-based plastics in structural and packaging applications."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     6. HIERARCHICAL
     --------------------------------------------------------------- */
  {
    id: "hierarchical",
    icon: "⬡",
    label: "Hierarchical Design",
    intro: `
      <p>
        The defining feature of biological structural materials is
        <strong>hierarchy</strong>: the nesting of structural motifs across
        length scales, from nanometers to centimeters. This multi-scale
        architecture enables combinations of properties (strength + toughness,
        stiffness + damping) that are inaccessible to single-scale designs.
        Engineers now exploit similar principles to create
        <em>mechanical metamaterials</em> with programmable, often
        counterintuitive behaviors.
      </p>
      <ul>
        <li><strong>Fractal-like architectures</strong> &mdash; self-similar
            structures at successive length scales introduce multiple band gaps,
            hybrid Bragg-type and locally resonant wave-attenuation properties,
            and enhanced energy absorption.</li>
        <li><strong>Size effects</strong> &mdash; at the nanoscale, individual
            features approach the theoretical strength of their constituent
            materials, suppressing defect-dominated failure and enabling
            flaw-tolerant design.</li>
        <li><strong>Topology optimization</strong> &mdash; computational methods
            (finite elements, Bayesian optimization, machine learning) are
            increasingly used to discover hierarchical topologies that approach
            theoretical bounds on stiffness, strength, and multifunctionality.</li>
      </ul>`,
    subsections: [
      {
        title: "Principles of Hierarchy",
        items: [
          {
            title: "Quantitative Biomimetics of High-Performance Materials",
            author: "Barthelat et al.",
            type: "notes",
            level: "advanced",
            url: "https://www.nature.com/articles/s41578-024-00753-3",
            desc: "Nature Reviews Materials article presenting a quantitative framework to assess how closely synthetic systems replicate the hierarchical features and performance of biological templates."
          },
          {
            title: "Biological and Bioinspired Materials: Structure Leading to Functional and Mechanical Performance",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.sciencedirect.com/science/article/pii/S2452199X20300943",
            desc: "Bioactive Materials review analyzing how hierarchical structuring in nacre, bone, silk, and wood leads to simultaneous optimization of multiple mechanical functions."
          },
          {
            title: "Architectured Materials in Engineering and Biology (Review)",
            author: "Francois Barthelat",
            type: "notes",
            level: "intermediate",
            url: "https://www.colorado.edu/lab/barthelat/media/108",
            desc: "Full critical review establishing the concept of architectured materials and comparing biological examples (nacre, bone, wood) with engineered lattice and woven composites."
          },
          {
            title: "Hierarchical Structure and Mechanical Adaptation of Biological Materials",
            author: "Peter Fratzl & Richard Weinkamer",
            type: "notes",
            level: "advanced",
            url: "https://link.springer.com/chapter/10.1007/1-4020-2648-X_2",
            desc: "Springer book chapter exploring how hierarchy enables mechanical adaptation in bone, wood, and tendon through remodeling, growth, and damage tolerance."
          }
        ]
      },
      {
        title: "Bio-Inspired Metamaterials",
        items: [
          {
            title: "Mechanical Metamaterials at the Theoretical Limit of Isotropic Elastic Stiffness",
            author: "Berger, Wadley & McMeeking",
            type: "notes",
            level: "advanced",
            url: "https://www.nature.com/articles/nature21075",
            desc: "Nature paper identifying plate-lattice topologies that reach the Hashin-Shtrikman upper bounds on stiffness, inspired by the load-distribution efficiency of biological cellular solids."
          },
          {
            title: "Ultralight, Ultrastiff Mechanical Metamaterials",
            author: "Zheng, Lee, Weisgraber et al.",
            type: "notes",
            level: "advanced",
            url: "https://www.science.org/doi/10.1126/science.1252291",
            desc: "Science paper reporting micro-architected lattices fabricated by projection micro-stereolithography that maintain near-constant specific stiffness at ultralow densities."
          },
          {
            title: "Design and Fabrication of Bioinspired Hierarchical Dissipative Elastic Metamaterials",
            author: "Various authors",
            type: "notes",
            level: "advanced",
            url: "https://link.aps.org/doi/10.1103/PhysRevApplied.10.024012",
            desc: "Physical Review Applied paper demonstrating that hierarchical lattice metamaterials with fractal-like substructures exhibit broadband wave attenuation mimicking the damping in biological tissues."
          },
          {
            title: "Mechanical Metamaterials and Beyond",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.nature.com/articles/s41467-023-41679-8",
            desc: "Nature Communications perspective surveying the full landscape of mechanical metamaterials, from auxetics to shape-morphing structures, with connections to biological inspiration."
          }
        ]
      },
      {
        title: "Computational Design",
        items: [
          {
            title: "Bioinspired Additive Manufacturing of Hierarchical Materials: From Biostructures to Functions",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://spj.science.org/doi/10.34133/research.0164",
            desc: "Science Partner Journal review bridging computational topology optimization with additive manufacturing to produce hierarchical composites inspired by nacre, bone, and wood."
          },
          {
            title: "Predictive Multiscale Materials Design (MIT Professional Education)",
            author: "Markus Buehler, MIT",
            type: "course",
            level: "advanced",
            url: "https://professional.mit.edu/course-catalog/predictive-multiscale-materials-design",
            desc: "MIT professional course on leveraging multi-scale modeling, machine learning, and additive manufacturing to design materials from molecules to structures, with biological applications."
          },
          {
            title: "Laboratory for Atomistic and Molecular Mechanics (LAMM)",
            author: "Markus Buehler Lab, MIT",
            type: "code",
            level: "advanced",
            url: "http://lamm.mit.edu/",
            desc: "Research lab home page with publications, codes, and datasets for multi-scale computational modeling of biological and bio-inspired materials including silk, collagen, and bone."
          },
          {
            title: "Bioinspired Acoustic Metamaterials: From Natural Designs to Optimized Structures",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.frontiersin.org/journals/materials/articles/10.3389/fmats.2023.1176457/full",
            desc: "Frontiers in Materials review on how natural acoustic-damping strategies (moth wings, owl feathers, spider webs) inspire the design of acoustic metamaterials through computational optimization."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     7. FABRICATION
     --------------------------------------------------------------- */
  {
    id: "fabrication",
    icon: "⊕",
    label: "Fabrication Methods",
    intro: `
      <p>
        Replicating nature&rsquo;s hierarchical architectures in the lab
        demands manufacturing strategies that can <strong>control structure
        across multiple length scales</strong> simultaneously. The past decade
        has seen rapid advances in additive manufacturing (3D printing),
        freeze-casting (ice templating), and directed self-assembly that
        bring biomimetic composites from concept to reality.
      </p>
      <ul>
        <li><strong>Additive manufacturing</strong> &mdash; multi-material 3D
            printing (inkjet, direct-ink-write, stereolithography) enables
            voxel-level control of composition and orientation, mimicking the
            local heterogeneity of bone, nacre, and wood.</li>
        <li><strong>Freeze-casting</strong> &mdash; directional ice templating
            creates lamellar or honeycomb pore architectures in ceramics and
            polymers that recapitulate the brick-and-mortar motif of nacre.</li>
        <li><strong>Self-assembly</strong> &mdash; molecular and colloidal
            self-assembly processes (layer-by-layer, electrophoretic deposition,
            liquid-crystal templating) produce hierarchical nanostructures
            under mild, bio-compatible conditions.</li>
      </ul>`,
    subsections: [
      {
        title: "Additive Manufacturing",
        items: [
          {
            title: "Bioinspired Additive Manufacturing of Hierarchical Materials: From Biostructures to Functions",
            author: "Yang, Song, Chen et al.",
            type: "notes",
            level: "intermediate",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10254471/",
            desc: "Open-access review cataloging AM techniques (DIW, SLA, inkjet, FDM) and their application to printing nacre-, bone-, and wood-inspired hierarchical composites."
          },
          {
            title: "Multi-Material 3D Printed Composites Inspired by Nacre: A Hard/Soft Mechanical Interplay",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.nature.com/articles/s41598-025-91080-2",
            desc: "Scientific Reports paper demonstrating multi-material 3D printing of nacre-inspired hard/soft architectures and characterizing the resulting mechanical interplay and toughness."
          },
          {
            title: "Natural Cellular Structures in Engineering Designs Built via Additive Manufacturing",
            author: "Various authors",
            type: "notes",
            level: "beginner",
            url: "https://www.tandfonline.com/doi/full/10.1080/10667857.2024.2443211",
            desc: "Materials Technology review of how natural cellular morphologies (honeycomb, trabecular, plant parenchyma) are replicated through AM for lightweight engineering structures."
          },
          {
            title: "Bio-Inspired Continuously Reinforced Polymer Composites: Synthesis of Nature and Additive Manufacturing",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.ije.ir/article_222858.html",
            desc: "International Journal of Engineering review exploring how continuous fiber-reinforced 3D printing mimics the aligned fiber architectures found in tendon, bone, and wood."
          }
        ]
      },
      {
        title: "Freeze-Casting & Templating",
        items: [
          {
            title: "Freezing Colloids: Observations, Principles, Control, and Use (Ice-Templating and Freeze-Casting)",
            author: "Sylvain Deville",
            type: "book",
            level: "advanced",
            url: "https://link.springer.com/book/10.1007/978-3-319-50515-2",
            desc: "Springer monograph providing the definitive treatment of ice-templating science and its practical application to fabricating biomimetic lamellar and porous ceramic architectures."
          },
          {
            title: "Freeze Casting: From Low-Dimensional Building Blocks to Aligned Porous Structures -- A Review of Novel Materials, Methods, and Applications",
            author: "Shao et al.",
            type: "notes",
            level: "intermediate",
            url: "https://advanced.onlinelibrary.wiley.com/doi/10.1002/adma.201907176",
            desc: "Advanced Materials review covering freeze-casting of nanoparticles, polymer chains, nanofibers, and nanosheets into aligned porous scaffolds mimicking biological lamellae."
          },
          {
            title: "Hierarchical Self-Assembly of Zirconium Toughened Alumina Based Bioinspired Microporous Material by Freeze Casting",
            author: "Various authors",
            type: "notes",
            level: "advanced",
            url: "https://link.springer.com/article/10.1007/s10934-022-01316-z",
            desc: "Journal of Porous Materials paper fabricating nacre-like ZTA-glass microporous structures via freeze-casting, demonstrating how ice templating recreates the brick-and-mortar motif."
          },
          {
            title: "Advances in Ice-Templated and Freeze-Casted Ceramics",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.mdpi.com/2571-6131/2/4/42",
            desc: "Open-access Encyclopedia of Ceramics article reviewing the state-of-the-art in ice-templated ceramics for biomedical, energy, and structural applications."
          }
        ]
      },
      {
        title: "Self-Assembly Methods",
        items: [
          {
            title: "Nacre-Inspired Composites with Different Macroscopic Dimensions: Strategies for Improved Mechanical Performance and Applications",
            author: "Various authors",
            type: "notes",
            level: "intermediate",
            url: "https://www.nature.com/articles/s41427-018-0009-6",
            desc: "NPG Asia Materials review of layer-by-layer, vacuum filtration, and electrophoretic self-assembly strategies for building nacre-inspired composites from 1D to 3D scales."
          },
          {
            title: "Bioinspired Composite Structures: A Comprehensive Review of Natural Materials, Fabrication Methods, and Engineering Applications",
            author: "Various authors",
            type: "notes",
            level: "beginner",
            url: "https://www.sciencedirect.com/science/article/pii/S2666682025000222",
            desc: "Recent comprehensive review covering self-assembly, layer-by-layer, mineralization, and bio-templating methods for producing composites inspired by shell, bone, and silk."
          },
          {
            title: "Molecular Principles of Biomaterials (MIT OCW 20.462J)",
            author: "Darrell Irvine, MIT",
            type: "course",
            level: "advanced",
            url: "https://ocw.mit.edu/courses/20-462j-molecular-principles-of-biomaterials-spring-2006/",
            desc: "MIT course on molecular-scale analysis and design of self-assembling biomaterials, covering polymer physics, protein folding, and supramolecular assembly for tissue engineering."
          },
          {
            title: "Introduction to Biological Engineering Design (MIT OCW 20.020)",
            author: "Natalie Kuldell et al., MIT",
            type: "course",
            level: "beginner",
            url: "https://ocw.mit.edu/courses/20-020-introduction-to-biological-engineering-design-spring-2009/",
            desc: "MIT course introducing the principles of biological engineering design, including self-assembly and directed evolution approaches to building functional biological systems."
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
