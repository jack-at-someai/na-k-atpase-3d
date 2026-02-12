/* ===================================================================
   BIO-OPTICS & PHOTONICS  —  Curated Reference Hub
   How nature manipulates light & how engineers replicate these strategies
   =================================================================== */

const SECTIONS = [

  /* ---------------------------------------------------------------
     1. OVERVIEW — Introduction to Bio-Optics
     --------------------------------------------------------------- */
  {
    id: "overview",
    icon: "◈",
    label: "Overview",
    intro: `
      <p>Bio-optics is the study of how living organisms interact with light &mdash;
      absorbing, reflecting, refracting, emitting, and detecting photons across the
      electromagnetic spectrum. From the iridescent scales of a morpho butterfly to the
      bioluminescent lure of a deep-sea anglerfish, nature has evolved an astonishing
      toolkit for manipulating light over billions of years of evolution.</p>
      <ul>
        <li><strong>Signaling</strong> &mdash; bright colours and bioluminescence convey warnings, attract mates, or lure prey.</li>
        <li><strong>Camouflage</strong> &mdash; organisms dynamically tune their appearance to match surroundings.</li>
        <li><strong>Vision</strong> &mdash; eyes range from simple photoreceptor patches to compound arrays with polarisation sensitivity.</li>
        <li><strong>Photosynthesis</strong> &mdash; chloroplasts harvest photons with near-unity quantum efficiency.</li>
        <li><strong>Biomimetics</strong> &mdash; engineers translate biological optical strategies into devices such as anti-reflective coatings, structural-colour displays, and organic solar cells.</li>
      </ul>
      <p>This section gathers foundational texts, review articles, and introductory lectures
      that provide a panoramic view of the field before diving into specialised topics.</p>`,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          {
            title: "Photonics and Lasers: An Introduction",
            author: "Richard S. Quimby",
            type: "book",
            level: "beginner",
            url: "https://www.wiley.com/en-us/Photonics+and+Lasers%3A+An+Introduction-p-9780471719748",
            desc: "Broad introduction to photonics principles including light-matter interactions relevant to biological systems. Excellent starting point for students new to optics."
          },
          {
            title: "Optical Properties of Biological Tissues and Other Turbid Media",
            author: "Valery V. Tuchin",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1117/3.684093",
            desc: "Comprehensive reference on how light propagates through biological tissues, covering absorption, scattering, and fluorescence in living matter."
          },
          {
            title: "Biophotonics: Concepts to Applications",
            author: "Gerd Keiser",
            type: "book",
            level: "intermediate",
            url: "https://link.springer.com/book/10.1007/978-981-10-0945-7",
            desc: "Covers the fundamentals of light interaction with biological tissue and surveys modern biophotonics applications from diagnostics to therapy."
          },
          {
            title: "Light and Life: Processes in Photobiology",
            author: "Donat-P. Häder & Gilad Jori",
            type: "book",
            level: "intermediate",
            url: "https://doi.org/10.1039/9781847552266",
            desc: "Explores the diverse roles of light in biological systems from photosynthesis and vision to photodynamic therapy and UV damage."
          }
        ]
      },
      {
        title: "Review Articles",
        items: [
          {
            title: "Biological Photonic Crystals (Interface Focus, 2012)",
            author: "Vinodkumar Saranathan et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1098/rsfs.2011.0120",
            desc: "Thorough review cataloguing photonic crystal structures found across the animal kingdom and explaining their optical properties."
          },
          {
            title: "Natural Photonics for Industrial Inspiration",
            author: "Pete Vukusic & J. Roy Sambles",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1038/nature02947",
            desc: "Landmark Nature article surveying how natural photonic structures inspire new technologies in anti-counterfeiting, sensing, and display design."
          },
          {
            title: "Biophotonics: Harnessing Light for Biology and Medicine (Nobel Lecture)",
            author: "Stefan W. Hell",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/anie.201504315",
            desc: "Nobel laureate Stefan Hell outlines super-resolution microscopy and the broader role of photonics in biological discovery."
          },
          {
            title: "Bio-Inspired Optics: From Natural to Artificial (Advanced Materials)",
            author: "Mathias Kolle & Seungwoo Lee",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/adma.201702669",
            desc: "Reviews how biological optical systems are translated into engineered devices, covering structural colour, anti-reflection, and light guiding."
          }
        ]
      },
      {
        title: "Introductory Lectures",
        items: [
          {
            title: "The Physics of Biological Colour (Royal Institution)",
            author: "Andrew Parker",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=lnOTCFMKJNk",
            desc: "Engaging public lecture explaining how evolution has engineered photonic nanostructures in animals, by the scientist who proposed the Light Switch hypothesis."
          },
          {
            title: "MIT OpenCourseWare — Optics (8.03SC)",
            author: "Walter Lewin / MIT",
            type: "course",
            level: "beginner",
            url: "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/",
            desc: "Classic MIT physics course covering wave optics, interference, and diffraction — the physical foundations needed for bio-optics study."
          },
          {
            title: "Biophotonics — Coursera (EPFL)",
            author: "Demetri Psaltis / EPFL",
            type: "course",
            level: "intermediate",
            url: "https://www.coursera.org/learn/biophotonics",
            desc: "Online course introducing optical microscopy, spectroscopy, and photonic methods used in biological and medical research."
          },
          {
            title: "Light: The Invisible Embrace (PBS documentary excerpt)",
            author: "PBS / NOVA",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=IXxZRZxafEQ",
            desc: "Documentary segment exploring how organisms across the tree of life have evolved to produce, detect, and manipulate light."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     2. STRUCTURAL COLORATION
     --------------------------------------------------------------- */
  {
    id: "structural",
    icon: "◇",
    label: "Structural Color",
    intro: `
      <p>Structural coloration arises not from pigments but from the physical nanostructure
      of a surface. Periodic arrangements of materials with different refractive indices
      &mdash; photonic crystals, multilayer reflectors, and diffraction gratings &mdash;
      selectively interfere with visible wavelengths to produce some of the most vivid
      and angle-dependent colours in nature.</p>
      <ul>
        <li><strong>Photonic crystals</strong> &mdash; 1-D, 2-D, and 3-D periodic nanostructures that create photonic band gaps, reflecting specific wavelengths.</li>
        <li><strong>Multilayer interference</strong> &mdash; stacks of thin films (e.g., chitin and air in beetle elytra) act as Bragg reflectors.</li>
        <li><strong>Diffraction gratings</strong> &mdash; regularly spaced ridges on butterfly wing scales decompose white light into spectral colours.</li>
        <li><strong>Biomimetic fabrication</strong> &mdash; self-assembly, nanoimprinting, and colloidal crystals replicate these structures synthetically.</li>
      </ul>
      <p>Understanding structural colour bridges condensed-matter physics, evolutionary
      biology, and materials science, and has practical applications in paints, textiles,
      cosmetics, and anti-counterfeiting.</p>`,
    subsections: [
      {
        title: "Physics of Structural Color",
        items: [
          {
            title: "Structural Colours: On the Mechanisms of Colours of Morpho Butterflies",
            author: "Shuichi Kinoshita, Shinya Yoshioka & Junichi Miyazaki",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1088/0034-4885/71/7/076401",
            desc: "Detailed physics-focused review of how Morpho butterflies produce brilliant blue through multi-scale photonic nanostructures."
          },
          {
            title: "Structural Colour and Iridescence in Living Organisms",
            author: "Shuichi Kinoshita",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1142/front_cover/front_cover_7866.jpg",
            desc: "Monograph presenting the physics of structural colour across the animal and plant kingdoms with rigorous electromagnetic modelling."
          },
          {
            title: "Photonic Crystals: Molding the Flow of Light",
            author: "John D. Joannopoulos et al.",
            type: "book",
            level: "intermediate",
            url: "http://ab-initio.mit.edu/book/",
            desc: "The standard textbook on photonic crystal theory, freely available online. Essential for understanding band gaps and light confinement."
          },
          {
            title: "Optical Thin-Film Physics and Coating Design (Lecture)",
            author: "Angus Macleod",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=OIBM5soYf6w",
            desc: "Lecture covering thin-film interference theory that underpins the multilayer reflectors found in beetle and fish scales."
          }
        ]
      },
      {
        title: "Butterfly & Beetle Optics",
        items: [
          {
            title: "Mechanisms of Structural Colour in the Morpho Butterfly",
            author: "Pete Vukusic et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1098/rspb.1999.0650",
            desc: "Seminal Proceedings B paper dissecting how Morpho rhetenor wing-scale architecture produces intense directional blue reflectance."
          },
          {
            title: "Quantified Interference and Diffraction in Single Morpho Butterfly Scales",
            author: "Bodo D. Wilts et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1073/pnas.1412621111",
            desc: "PNAS study using microspectrophotometry and modelling to quantify optical contributions of individual scale elements."
          },
          {
            title: "Photonics of the Jewel Beetle Chrysina gloriosa",
            author: "Vivek Sharma, Mohan Crne, Jung Ok Park & Mohan Srinivasarao",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1172051",
            desc: "Science paper revealing how the jewel beetle produces circularly polarised reflections using a cholesteric liquid-crystal-like exocuticle."
          },
          {
            title: "The Secret Life of Butterflies — Structural Colour (Deep Look)",
            author: "KQED / PBS",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=LE2v3sUzTH4",
            desc: "Short, beautifully filmed video explaining how nanoscale structures on butterfly wings create colour without pigment."
          }
        ]
      },
      {
        title: "Synthetic Structural Color",
        items: [
          {
            title: "Scalable, Full-Colour and Controllable Chromotropic Plasmonic Printing",
            author: "Joel K. W. Yang et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/ncomms3361",
            desc: "Nature Communications paper demonstrating high-resolution plasmonic colour printing inspired by natural structural coloration."
          },
          {
            title: "Colloidal Assembly for Structural Colour",
            author: "Eric R. Dufresne et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1039/C5SM00549C",
            desc: "Review of colloidal self-assembly methods for producing synthetic photonic crystals that mimic biological structural colour."
          },
          {
            title: "MIT Photonic Bands (MPB) Simulation Software",
            author: "Steven G. Johnson / MIT",
            type: "code",
            level: "advanced",
            url: "https://github.com/NanoComp/mpb",
            desc: "Open-source software for computing photonic band structures; widely used to model bio-inspired photonic crystal designs."
          },
          {
            title: "Bio-Inspired Structural Colors Fabricated via Self-Assembly",
            author: "Jingxia Wang & Yanlin Song",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/adfm.201302359",
            desc: "Reviews self-assembly techniques for creating structural colour films, coatings, and fibres inspired by beetle and butterfly optics."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     3. BIOLUMINESCENCE & FLUORESCENCE
     --------------------------------------------------------------- */
  {
    id: "bioluminescence",
    icon: "⊕",
    label: "Bioluminescence",
    intro: `
      <p>Bioluminescence &mdash; the biochemical production of light by living organisms &mdash;
      occurs across a staggering diversity of life, from bacteria and dinoflagellates to
      fireflies and deep-sea fish. Fluorescence, the absorption and re-emission of light at
      longer wavelengths, is equally widespread and has given rise to transformative tools in
      cell biology and medicine.</p>
      <ul>
        <li><strong>Luciferin-luciferase systems</strong> &mdash; the enzyme-substrate chemistry that powers firefly flash, bacterial glow, and jellyfish luminescence.</li>
        <li><strong>Green Fluorescent Protein (GFP)</strong> &mdash; the 2008 Nobel Prize-winning molecular marker that revolutionised live-cell imaging.</li>
        <li><strong>Bioimaging</strong> &mdash; bioluminescent and fluorescent reporters enable non-invasive tracking of gene expression, tumour growth, and neural activity.</li>
        <li><strong>Deep-sea light</strong> &mdash; most deep-ocean organisms produce light for counter-illumination, prey luring, or communication in perpetual darkness.</li>
      </ul>
      <p>This section covers the biology of light-emitting organisms, the molecular biology
      of fluorescent proteins, and the biomedical applications that have emerged from these
      natural systems.</p>`,
    subsections: [
      {
        title: "Bioluminescence Biology",
        items: [
          {
            title: "Bioluminescence: Living Lights, Lights for Living",
            author: "Thérèse Wilson & J. Woodland Hastings",
            type: "book",
            level: "intermediate",
            url: "https://www.hup.harvard.edu/books/9780674067165",
            desc: "Definitive survey of bioluminescence across the tree of life — from bacteria to fish — by two pioneers of the field."
          },
          {
            title: "The Evolution of Bioluminescence in Eukaryotes",
            author: "Steven H. D. Haddock, Mark A. Moline & James F. Case",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1146/annurev-marine-120308-081028",
            desc: "Annual Review of Marine Science article surveying the independent evolutionary origins of bioluminescence across diverse marine lineages."
          },
          {
            title: "Deep-Sea Bioluminescence (Monterey Bay Aquarium Research Institute)",
            author: "MBARI",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=UXlGBb8ypMk",
            desc: "Stunning ROV footage of deep-sea bioluminescence with narration explaining the ecological functions of light production in the abyss."
          },
          {
            title: "Bioluminescence in the Sea",
            author: "Steven H. D. Haddock, Mark A. Moline & James F. Case",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1146/annurev-marine-120308-081028",
            desc: "Comprehensive review of marine bioluminescence covering biochemistry, ecology, and the extraordinary diversity of light-producing organisms."
          }
        ]
      },
      {
        title: "GFP & Fluorescent Proteins",
        items: [
          {
            title: "The GFP Story (Nobel Lecture — Osamu Shimomura)",
            author: "Osamu Shimomura",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/anie.200902240",
            desc: "Nobel laureate Shimomura's account of discovering green fluorescent protein in the jellyfish Aequorea victoria."
          },
          {
            title: "The Growing and Glowing Toolbox of Fluorescent and Photoactive Proteins",
            author: "Nathan C. Shaner, Paul A. Steinbach & Roger Y. Tsien",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nmeth.1209",
            desc: "Authoritative review of engineered fluorescent protein variants and their applications in live-cell imaging."
          },
          {
            title: "FPbase — Fluorescent Protein Database",
            author: "Talley Lambert / Harvard Medical School",
            type: "data",
            level: "intermediate",
            url: "https://www.fpbase.org/",
            desc: "Curated online database of fluorescent protein spectra, properties, and references. Essential tool for choosing fluorescent reporters."
          },
          {
            title: "GFP: Lighting Up Life (iBiology Lecture)",
            author: "Roger Tsien",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=9mJYY4LiLjk",
            desc: "iBiology talk by Nobel laureate Roger Tsien explaining GFP engineering and the rainbow of fluorescent proteins it inspired."
          }
        ]
      },
      {
        title: "Biomedical Imaging",
        items: [
          {
            title: "Bioluminescence Imaging in Living Organisms",
            author: "Christopher H. Contag & Michael H. Bachmann",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1146/annurev.bioeng.4.111901.093336",
            desc: "Annual Review of Biomedical Engineering paper covering how bioluminescent reporters enable non-invasive imaging of biological processes in vivo."
          },
          {
            title: "Fluorescence Microscopy: From Principles to Biological Applications",
            author: "Ulrich Kubitscheck (ed.)",
            type: "book",
            level: "intermediate",
            url: "https://www.wiley.com/en-us/Fluorescence+Microscopy%3A+From+Principles+to+Biological+Applications%2C+2nd+Edition-p-9783527332711",
            desc: "Textbook covering fluorescence microscopy theory and practical techniques for biologists, from widefield to super-resolution."
          },
          {
            title: "iBiology — Microscopy Series",
            author: "iBiology / HHMI",
            type: "course",
            level: "intermediate",
            url: "https://www.ibiology.org/online-biology-courses/microscopy-series/",
            desc: "Free video lecture series on modern microscopy methods, including confocal, two-photon, light-sheet, and super-resolution imaging."
          },
          {
            title: "Napari: Multi-Dimensional Image Viewer for Python",
            author: "napari contributors",
            type: "code",
            level: "intermediate",
            url: "https://github.com/napari/napari",
            desc: "Open-source Python tool for browsing and annotating multi-dimensional bioimaging data, widely used in fluorescence microscopy."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     4. BIOLOGICAL VISION SYSTEMS
     --------------------------------------------------------------- */
  {
    id: "vision",
    icon: "◉",
    label: "Vision Systems",
    intro: `
      <p>Eyes have evolved independently more than 40 times across the animal kingdom,
      producing a remarkable diversity of optical designs. From the simple pit eyes of
      flatworms to the compound eyes of arthropods and the camera-type eyes of vertebrates
      and cephalopods, each architecture represents a distinct solution to the challenge
      of extracting spatial, spectral, and temporal information from light.</p>
      <ul>
        <li><strong>Camera eyes</strong> &mdash; single-aperture optics with a lens focusing an image onto a retina (vertebrates, cephalopods, spiders).</li>
        <li><strong>Compound eyes</strong> &mdash; arrays of ommatidia providing wide fields of view with high temporal resolution (insects, crustaceans).</li>
        <li><strong>Mantis shrimp vision</strong> &mdash; 16 photoreceptor types spanning UV to far-red, plus linear and circular polarisation detection.</li>
        <li><strong>Tapetum lucidum</strong> &mdash; reflective layer behind the retina that enhances sensitivity in low-light environments (cats, deer, deep-sea fish).</li>
        <li><strong>Bio-inspired cameras</strong> &mdash; engineers mimic compound-eye geometry and foveal acuity for wide-angle and high-dynamic-range imaging.</li>
      </ul>
      <p>This section spans the biology of visual systems, exceptional examples of animal
      vision, and the engineering efforts to translate biological designs into cameras and
      sensors.</p>`,
    subsections: [
      {
        title: "Compound Eye Design",
        items: [
          {
            title: "Animal Eyes (Oxford Animal Biology Series)",
            author: "Michael F. Land & Dan-Eric Nilsson",
            type: "book",
            level: "intermediate",
            url: "https://global.oup.com/academic/product/animal-eyes-9780199581146",
            desc: "The standard reference on comparative eye design, covering optics, photoreceptor physiology, and the evolutionary pathways of eye types."
          },
          {
            title: "The Optics of Compound Eyes",
            author: "Michael F. Land",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1098/rstb.1981.0159",
            desc: "Classic Philosophical Transactions paper analysing the optical principles of apposition and superposition compound eyes."
          },
          {
            title: "How Do Compound Eyes Work? (Journey to the Microcosmos)",
            author: "Journey to the Microcosmos / Complexly",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=LUz8gPeCjjE",
            desc: "Accessible video explaining how insect compound eyes form images, trade-offs between resolution and sensitivity, and neural superposition."
          },
          {
            title: "Insect Vision Simulation Dataset",
            author: "Emily Baird lab / Lund University",
            type: "data",
            level: "intermediate",
            url: "https://doi.org/10.5281/zenodo.3836688",
            desc: "Zenodo-hosted dataset of simulated insect-eye views used for studying navigation and visual ecology in arthropods."
          }
        ]
      },
      {
        title: "Exceptional Vision Systems",
        items: [
          {
            title: "A Different Form of Colour Vision in Mantis Shrimp",
            author: "Hanne H. Thoen et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1245824",
            desc: "Science paper revealing that mantis shrimp use a unique colour-recognition system based on temporal scanning rather than opponent processing."
          },
          {
            title: "Polarisation Vision in Stomatopods",
            author: "Justin Marshall & Thomas Cronin",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/21264",
            desc: "Nature paper demonstrating circular polarisation vision in mantis shrimp, the first such finding in any animal."
          },
          {
            title: "The Mantis Shrimp Sees Like Nothing Else (True Facts)",
            author: "Ze Frank / BuzzFeed",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=F5FEj9U-CJM",
            desc: "Entertaining and informative video covering mantis shrimp visual superpowers, including their 16 photoreceptor types."
          },
          {
            title: "Tapetum Lucidum: Structure, Function and Evolution",
            author: "Ron H. Douglas & Jeffrey C. Partridge",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/978-1-4614-4355-1_2",
            desc: "Book chapter reviewing the structure, optical function, and evolutionary distribution of reflective tapeta across vertebrate taxa."
          }
        ]
      },
      {
        title: "Bio-Inspired Cameras",
        items: [
          {
            title: "Digital Cameras with Designs Inspired by the Arthropod Eye",
            author: "Young Min Song et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nature12083",
            desc: "Nature paper presenting a hemispherical compound-eye camera with 180-degree field of view and nearly infinite depth of field."
          },
          {
            title: "An Artificial Compound Eye for Machine Vision",
            author: "Ki-Hun Jeong et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1123053",
            desc: "Science paper demonstrating microfabricated artificial ommatidia arrays that mimic insect compound-eye geometry."
          },
          {
            title: "Bio-Inspired Camera Design (Stanford Computational Imaging Lab)",
            author: "Gordon Wetzstein / Stanford",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=oim7KzMNEDk",
            desc: "Lecture on computational imaging approaches inspired by biological visual systems, including foveated and event-driven cameras."
          },
          {
            title: "Event Camera — Dynamic Vision Sensor Simulator",
            author: "Robotics and Perception Group / UZH-RPG",
            type: "code",
            level: "advanced",
            url: "https://github.com/uzh-rpg/rpg_vid2e",
            desc: "Open-source simulator for event cameras, bio-inspired sensors that respond to changes in illumination like retinal ganglion cells."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     5. ANTI-REFLECTIVE SURFACES
     --------------------------------------------------------------- */
  {
    id: "antireflective",
    icon: "∿",
    label: "Anti-Reflective",
    intro: `
      <p>Many insects have evolved nanoscale surface textures that suppress reflection,
      rendering their wings transparent or their eyes non-glaring. The best-studied
      example is the moth-eye corneal nipple array &mdash; a sub-wavelength pattern of
      conical protuberances that creates a graded refractive-index transition between air
      and cuticle, eliminating the abrupt interface that would otherwise cause Fresnel
      reflection.</p>
      <ul>
        <li><strong>Moth-eye arrays</strong> &mdash; ~200 nm nipples on corneal surfaces reduce reflectance to &lt; 1% across visible wavelengths.</li>
        <li><strong>Cicada wings</strong> &mdash; nano-pillar arrays provide anti-reflection, self-cleaning, and antibacterial properties simultaneously.</li>
        <li><strong>Dragonfly wings</strong> &mdash; hierarchical nanostructures combine transparency, hydrophobicity, and bactericidal action.</li>
        <li><strong>Applications</strong> &mdash; bio-inspired AR coatings improve solar cell efficiency, display readability, and stealth optics.</li>
      </ul>
      <p>This section covers the physics of gradient-index anti-reflection, the biological
      exemplars, and the engineering of bio-inspired coatings for energy and display
      technology.</p>`,
    subsections: [
      {
        title: "Moth-Eye Nanostructures",
        items: [
          {
            title: "Moth-Eye Anti-Reflection Coatings: A Review",
            author: "Wilson W. Chen & K. Y. Lam",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.optlaseng.2018.10.015",
            desc: "Comprehensive review of moth-eye-inspired anti-reflective surfaces covering fabrication techniques and optical performance."
          },
          {
            title: "Reduction of Lens Reflexion by the Moth-Eye Principle",
            author: "C. G. Bernhard & W. H. Miller",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/0001-6160(62)90098-1",
            desc: "Pioneering paper identifying and explaining the anti-reflective nipple arrays on moth corneas — the origin of the moth-eye concept."
          },
          {
            title: "Broadband Moth-Eye Antireflection Coatings on Silicon",
            author: "Yu-Fang Huang et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nnano.2007.227",
            desc: "Nature Nanotechnology paper demonstrating sub-wavelength silicon nanostructures that achieve extremely low broadband reflectance."
          },
          {
            title: "Why Don't Moth Eyes Reflect Light? (MinuteEarth)",
            author: "MinuteEarth",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=dSAhD4KGVtQ",
            desc: "Short animated explainer on the gradient-index principle behind moth-eye anti-reflection and its industrial applications."
          }
        ]
      },
      {
        title: "Cicada & Dragonfly Wings",
        items: [
          {
            title: "Biophysical Model of Cicada Wing Nanopillar Antibacterial Activity",
            author: "Elena P. Ivanova et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/smll.201200528",
            desc: "Small paper demonstrating that cicada wing nanopillars physically rupture bacteria on contact — a dual optical and antimicrobial surface."
          },
          {
            title: "Natural Bactericidal Surfaces: Mechanical Rupture of P. aeruginosa by Cicada Wings",
            author: "Elena P. Ivanova et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/smll.201200528",
            desc: "Landmark study showing that the nanostructured surface of cicada wings kills gram-negative bacteria through physical mechanisms rather than chemistry."
          },
          {
            title: "Dragonfly Wing Nanostructures and Wettability",
            author: "Gregory S. Watson et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.actbio.2012.11.046",
            desc: "Study of hierarchical nanostructures on dragonfly wings that provide combined anti-reflective, superhydrophobic, and self-cleaning properties."
          },
          {
            title: "Nano-Fabrication by Insect Wings (Veritasium)",
            author: "Derek Muller / Veritasium",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=Nxb5JiKryDE",
            desc: "Popular science video exploring how insect wing nanostructures are inspiring next-generation antimicrobial and anti-reflective surfaces."
          }
        ]
      },
      {
        title: "Solar & Display Applications",
        items: [
          {
            title: "Bio-Inspired Anti-Reflective Surfaces for Solar Cells",
            author: "Yanlin Song et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/aenm.201200530",
            desc: "Advanced Energy Materials review of how moth-eye and leaf-inspired anti-reflective textures boost photovoltaic efficiency."
          },
          {
            title: "Moth-Eye-Inspired AR Coatings for Organic Solar Cells",
            author: "Seung-Hwan Jung et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1021/nn5017724",
            desc: "ACS Nano paper demonstrating that moth-eye textured PDMS films significantly reduce reflection losses in organic photovoltaics."
          },
          {
            title: "RCWA Simulation Tool (S4: Stanford Stratified Structure Solver)",
            author: "Victor Liu / Stanford",
            type: "code",
            level: "advanced",
            url: "https://github.com/victorliu/S4",
            desc: "Open-source rigorous coupled-wave analysis solver for simulating light interaction with periodic nanostructures like moth-eye arrays."
          },
          {
            title: "Nanoimprint Lithography for Bio-Inspired Optical Surfaces",
            author: "L. Jay Guo",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/adma.200600882",
            desc: "Reviews nanoimprint lithography as a scalable fabrication route for replicating bio-inspired anti-reflective and photonic structures."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     6. CAMOUFLAGE & ADAPTIVE COLORATION
     --------------------------------------------------------------- */
  {
    id: "camouflage",
    icon: "⊗",
    label: "Camouflage",
    intro: `
      <p>Camouflage is one of the most compelling demonstrations of evolutionary optics.
      Animals conceal themselves by matching their background, disrupting their outline,
      or dynamically changing colour in real time. The champions of adaptive coloration
      are the cephalopods &mdash; octopuses, cuttlefish, and squid &mdash; which control
      millions of chromatophore organs in their skin to shift colour, pattern, and texture
      within milliseconds, all without colour vision.</p>
      <ul>
        <li><strong>Chromatophores</strong> &mdash; pigment-filled sacs expanded by radial muscles in cephalopod skin to create colour patterns.</li>
        <li><strong>Iridophores &amp; leucophores</strong> &mdash; reflective cells beneath chromatophores that add iridescence and white backgrounds.</li>
        <li><strong>Chameleon nanocrystals</strong> &mdash; tunable photonic crystals in chameleon skin shift reflected wavelengths by lattice spacing changes.</li>
        <li><strong>Adaptive camouflage technology</strong> &mdash; e-paper, thermochromic, and electrochromic systems inspired by biological colour change.</li>
      </ul>
      <p>Understanding biological camouflage informs military stealth technology, active
      camouflage displays, soft robotics, and adaptive architecture.</p>`,
    subsections: [
      {
        title: "Cephalopod Color Change",
        items: [
          {
            title: "Cephalopod Dynamic Camouflage",
            author: "Roger T. Hanlon",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.cub.2007.10.008",
            desc: "Current Biology primer explaining how cuttlefish and octopus achieve rapid adaptive camouflage through neurally controlled chromatophore arrays."
          },
          {
            title: "Cephalopod Chromatophores: Neurobiology and Natural History",
            author: "Lydia M. Mäthger, Eric J. Denton, N. Justin Marshall & Roger T. Hanlon",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1111/j.1469-185X.2008.00050.x",
            desc: "Biological Reviews paper providing a comprehensive treatment of chromatophore physiology, neural control, and optical properties."
          },
          {
            title: "Kings of Camouflage (NOVA Documentary)",
            author: "PBS / NOVA",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=PmDTtkZlMwM",
            desc: "Full documentary following researchers studying cuttlefish camouflage abilities — how they see, process, and replicate visual scenes."
          },
          {
            title: "Octopus Skin — The Bioengineering of Adaptive Camouflage",
            author: "Smithsonian Channel",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=SfkhEm3LfsE",
            desc: "Short video exploring how octopus skin acts as a distributed display, changing colour and texture without direct brain commands."
          }
        ]
      },
      {
        title: "Chameleon & Other Systems",
        items: [
          {
            title: "Photonic Crystals Cause Active Colour Change in Chameleons",
            author: "Jérémie Teyssier et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/ncomms7368",
            desc: "Nature Communications paper revealing that chameleons shift colour by actively tuning a lattice of guanine nanocrystals, not by dispersing pigments."
          },
          {
            title: "Adaptive Infrared Camouflage in Squid Skin",
            author: "Alon A. Gorodetsky et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1002/adma.201301472",
            desc: "Advanced Materials paper on reflectin proteins in squid skin that dynamically modulate infrared reflectance, inspiring thermal camouflage."
          },
          {
            title: "Color Change in Animals: Mechanisms and Functions",
            author: "Russell Ligon & Kevin McGraw",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/9780470015902.a0026557",
            desc: "Encyclopedia of Life Sciences article reviewing physiological and morphological colour change across vertebrates and invertebrates."
          },
          {
            title: "How Do Chameleons Change Color? (SciShow)",
            author: "SciShow / Hank Green",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=fYJmFhTR3D0",
            desc: "Clear explanation of the photonic crystal mechanism behind chameleon colour change, debunking the pigment-dispersion myth."
          }
        ]
      },
      {
        title: "Adaptive Camouflage Technology",
        items: [
          {
            title: "Adaptive Camouflage Inspired by Cephalopods",
            author: "Cunjiang Yu et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1073/pnas.1410494111",
            desc: "PNAS paper describing flexible optoelectronic sheets that sense and adapt to background colour, inspired by cephalopod skin."
          },
          {
            title: "Soft Robotics with Cephalopod-Inspired Camouflage",
            author: "Stephen A. Morin et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1126/science.1222149",
            desc: "Science paper demonstrating pneumatically driven colour-changing skins on soft robots, mimicking cephalopod adaptive camouflage."
          },
          {
            title: "Artificial Cephalopod Skin (Stretchable Electronics)",
            author: "Cunjiang Yu / University of Houston",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=VYMnQeKX8T0",
            desc: "Research presentation on stretchable electronic skins that mimic cephalopod colour-changing abilities for wearable and robotics applications."
          },
          {
            title: "Thermochromic & Electrochromic Materials for Adaptive Camouflage",
            author: "Haider Butt et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1002/adom.201800091",
            desc: "Advanced Optical Materials review of stimuli-responsive materials that change colour in response to heat, electricity, or light for camouflage."
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     7. BIO-INSPIRED LIGHT HARVESTING
     --------------------------------------------------------------- */
  {
    id: "photosynthesis",
    icon: "⬡",
    label: "Light Harvesting",
    intro: `
      <p>Photosynthesis is the most important light-harvesting process on Earth, converting
      solar energy into chemical fuel with remarkable efficiency. The light-harvesting
      complexes of plants, algae, and photosynthetic bacteria capture photons and funnel
      excitation energy to reaction centres through a network of precisely arranged
      chromophores &mdash; a process so efficient that quantum coherence may play a role
      in the energy transfer.</p>
      <ul>
        <li><strong>Light-harvesting complexes (LHC)</strong> &mdash; chlorophyll-protein antennae that absorb photons and transfer energy over nanometre distances with near-unity efficiency.</li>
        <li><strong>Quantum coherence</strong> &mdash; long-lived quantum beating observed in photosynthetic complexes suggests wave-like energy transport through multiple pathways.</li>
        <li><strong>Artificial photosynthesis</strong> &mdash; synthetic molecular assemblies and photoelectrochemical cells that mimic natural light reactions to split water and produce fuel.</li>
        <li><strong>Organic photovoltaics</strong> &mdash; solar cells using conjugated organic molecules arranged like biological light-harvesting arrays.</li>
        <li><strong>Dye-sensitized solar cells</strong> &mdash; Grätzel cells that use molecular dyes adsorbed on TiO<sub>2</sub> to harvest light, analogous to chlorophyll on thylakoid membranes.</li>
      </ul>
      <p>This section traces the path from natural photosynthesis to artificial light
      harvesting, covering the fundamental science and the cutting-edge technologies
      inspired by biology's most ancient and essential optical process.</p>`,
    subsections: [
      {
        title: "Natural Photosynthesis Mechanisms",
        items: [
          {
            title: "Molecular Mechanisms of Photosynthesis",
            author: "Robert E. Blankenship",
            type: "book",
            level: "intermediate",
            url: "https://www.wiley.com/en-us/Molecular+Mechanisms+of+Photosynthesis%2C+3rd+Edition-p-9781119800019",
            desc: "The leading textbook on photosynthesis at the molecular level, covering light-harvesting, electron transfer, and carbon fixation."
          },
          {
            title: "Evidence for Wavelike Energy Transfer Through Quantum Coherence in Photosynthetic Systems",
            author: "Gregory S. Engel et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1038/nature05678",
            desc: "Landmark Nature paper demonstrating long-lived quantum coherence in the Fenna-Matthews-Olson complex at physiological temperatures."
          },
          {
            title: "Quantum Biology: Photosynthesis (Royal Society Lecture)",
            author: "Gregory Scholes",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=bDHuZBjKBbE",
            desc: "Royal Society lecture explaining how quantum effects may enhance the efficiency of photosynthetic light harvesting."
          },
          {
            title: "Principles of Photosynthesis (Khan Academy)",
            author: "Khan Academy",
            type: "course",
            level: "beginner",
            url: "https://www.khanacademy.org/science/biology/photosynthesis-in-plants",
            desc: "Free beginner-level course covering the light reactions, Calvin cycle, and the role of chlorophyll in photosynthesis."
          }
        ]
      },
      {
        title: "Artificial Photosynthesis",
        items: [
          {
            title: "Artificial Photosynthesis: From Molecular Catalysts for Light-Driven Water Splitting to Photoelectrochemical Cells",
            author: "Devens Gust, Thomas A. Moore & Ana L. Moore",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1021/ar200177q",
            desc: "Accounts of Chemical Research review tracing the evolution from natural photosynthetic reaction centres to artificial molecular devices for solar fuel production."
          },
          {
            title: "The Artificial Leaf",
            author: "Daniel G. Nocera",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1021/ar2003013",
            desc: "Nocera's influential review on silicon-based artificial leaves that split water using earth-abundant catalysts, mimicking photosystem II."
          },
          {
            title: "Solar Fuels via Artificial Photosynthesis (Caltech / JCAP)",
            author: "Joint Center for Artificial Photosynthesis / Caltech",
            type: "video",
            level: "intermediate",
            url: "https://www.youtube.com/watch?v=qlFgPl-ELTU",
            desc: "Overview of the JCAP research program developing photoelectrochemical systems for solar-driven water splitting and CO2 reduction."
          },
          {
            title: "Photoelectrochemistry Simulation Tools (SCAPS)",
            author: "Marc Burgelman / University of Gent",
            type: "code",
            level: "advanced",
            url: "https://scaps.elis.ugent.be/",
            desc: "Solar cell simulation software useful for modelling bio-inspired photoelectrochemical devices and dye-sensitized solar cells."
          }
        ]
      },
      {
        title: "Bio-Inspired Solar Cells",
        items: [
          {
            title: "Dye-Sensitized Solar Cells (The Grätzel Cell)",
            author: "Michael Grätzel",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.jphotochemrev.2003.09.002",
            desc: "Foundational review by Grätzel himself on dye-sensitized solar cells, which mimic photosynthetic light harvesting with molecular dyes on nanostructured oxides."
          },
          {
            title: "Organic Solar Cells: An Overview (Chemical Reviews)",
            author: "Gang Li et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1021/cr100440z",
            desc: "Comprehensive Chemical Reviews article covering organic photovoltaics from donor-acceptor molecular design to device physics."
          },
          {
            title: "Perovskite Solar Cells: Stability and Bio-Inspired Design",
            author: "Henry Snaith",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1021/jz501983v",
            desc: "Perspectives article discussing how lessons from biological light-harvesting antenna design inform perovskite photovoltaic architectures."
          },
          {
            title: "Build a Dye-Sensitized Solar Cell (DSSC) at Home",
            author: "The Thought Emporium",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=TULirBqoEbY",
            desc: "Hands-on tutorial for building a working Grätzel cell from berry juice and titanium dioxide, demonstrating bio-inspired solar energy conversion."
          },
          {
            title: "GPVDM: General-Purpose Photovoltaic Device Model",
            author: "Roderick C. I. MacKenzie",
            type: "code",
            level: "advanced",
            url: "https://github.com/roderickmackenzie/gpvdm",
            desc: "Open-source drift-diffusion simulator for organic and perovskite solar cells, useful for modelling bio-inspired photovoltaic architectures."
          }
        ]
      }
    ]
  }

];

/* ===================================================================
   RENDERING ENGINE
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
