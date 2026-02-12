/* ═══════════════════════════════════════════════════════════════
   Nature-Inspired Algorithms — Curated Reference Hub
   A comprehensive collection of resources on computational
   algorithms inspired by biological processes.
   ═══════════════════════════════════════════════════════════════ */

const SECTIONS = [

  /* ───────────────────── 1. OVERVIEW ───────────────────── */
  {
    id: "overview",
    icon: "◈",
    label: "Overview",
    intro: `
      <p>Nature-inspired computation draws on biological, physical, and ecological
      processes to design algorithms that solve complex optimization and search problems.
      From the evolution of species to the foraging of ant colonies, natural systems
      have been refined over millions of years to efficiently explore vast solution spaces.</p>
      <ul>
        <li><strong>Metaheuristics</strong> &mdash; High-level, problem-independent strategies
        that guide subordinate heuristics to explore and exploit the search space effectively.</li>
        <li><strong>No Free Lunch Theorem</strong> &mdash; Wolpert and Macready's result showing
        that no single optimization algorithm outperforms all others across every possible problem,
        motivating the study of diverse nature-inspired approaches.</li>
        <li><strong>Bio-inspired computing</strong> &mdash; The broader paradigm that encompasses
        evolutionary computation, swarm intelligence, neural computation, and immune-system
        algorithms as distinct but interconnected research fields.</li>
        <li><strong>Exploration vs. Exploitation</strong> &mdash; The fundamental trade-off in
        metaheuristic design between searching new regions of the solution space and refining
        known promising solutions.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          {
            title: "Nature-Inspired Optimization Algorithms",
            author: "Xin-She Yang",
            type: "book",
            level: "beginner",
            url: "https://www.elsevier.com/books/nature-inspired-optimization-algorithms/yang/978-0-12-416743-8",
            desc: "A comprehensive introduction to major nature-inspired algorithms including genetic algorithms, ant colony optimization, and firefly algorithms. Ideal entry point with clear mathematical formulations."
          },
          {
            title: "Introduction to Evolutionary Computing",
            author: "A.E. Eiben & J.E. Smith",
            type: "book",
            level: "beginner",
            url: "https://link.springer.com/book/10.1007/978-3-662-44874-8",
            desc: "The standard textbook for evolutionary computation, covering genetic algorithms, evolution strategies, genetic programming, and their theoretical foundations."
          },
          {
            title: "Essentials of Metaheuristics",
            author: "Sean Luke",
            type: "book",
            level: "beginner",
            url: "https://cs.gmu.edu/~sean/book/metaheuristics/",
            desc: "A freely available textbook covering a wide range of metaheuristic techniques with pseudocode. Continuously updated and community-driven."
          },
          {
            title: "Swarm Intelligence: From Natural to Artificial Systems",
            author: "Eric Bonabeau, Marco Dorigo & Guy Theraulaz",
            type: "book",
            level: "intermediate",
            url: "https://global.oup.com/academic/product/swarm-intelligence-9780195131598",
            desc: "A foundational text that bridges the gap between biological swarm behavior and computational swarm intelligence algorithms."
          }
        ]
      },
      {
        title: "Survey Articles",
        items: [
          {
            title: "No Free Lunch Theorems for Optimization",
            author: "David H. Wolpert & William G. Macready",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1109/4235.585893",
            desc: "The seminal 1997 paper proving that averaged over all possible problems, every optimization algorithm performs identically, shaping modern metaheuristic research."
          },
          {
            title: "Metaheuristics: A Survey of Informing Approaches",
            author: "Christian Blum & Andrea Roli",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/s10479-005-3600-0",
            desc: "An influential survey classifying metaheuristic techniques along multiple dimensions including trajectory vs. population, memory usage, and neighborhood structures."
          },
          {
            title: "A Comprehensive Survey on Nature-Inspired Algorithms",
            author: "Sadeeq et al.",
            type: "notes",
            level: "beginner",
            url: "https://doi.org/10.14569/IJACSA.2020.0110201",
            desc: "A modern survey categorizing nature-inspired algorithms by their biological inspiration source and comparing their convergence properties."
          },
          {
            title: "Metaheuristic Research: A Comprehensive Survey",
            author: "Seyedali Mirjalili",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/s10462-017-9605-z",
            desc: "Reviews the development timeline of metaheuristic algorithms and identifies key trends, open problems, and promising research directions."
          }
        ]
      },
      {
        title: "Introductory Courses",
        items: [
          {
            title: "Nature-Inspired Computing (IIT Kharagpur, NPTEL)",
            author: "Prof. Kaushik Das Sharma",
            type: "course",
            level: "beginner",
            url: "https://nptel.ac.in/courses/106105182",
            desc: "A full lecture series covering foundational nature-inspired methods from genetic algorithms to swarm optimization with worked examples."
          },
          {
            title: "Bio-Inspired AI (YouTube Series)",
            author: "The Coding Train (Daniel Shiffman)",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/playlist?list=PLRqwX-V7Uu6bw4n214lBDpnCMbEYFLKcn",
            desc: "Engaging video series on genetic algorithms, steering behaviors, and evolutionary art using Processing and p5.js."
          },
          {
            title: "Computational Intelligence: An Introduction (Coursera)",
            author: "Andries Engelbrecht",
            type: "course",
            level: "beginner",
            url: "https://www.wiley.com/en-us/Computational+Intelligence:+An+Introduction,+2nd+Edition-p-9780470035610",
            desc: "Textbook companion for computational intelligence covering neural networks, evolutionary computation, and swarm intelligence from a unified perspective."
          }
        ]
      }
    ]
  },

  /* ───────────────────── 2. EVOLUTIONARY ───────────────────── */
  {
    id: "evolutionary",
    icon: "⊕",
    label: "Evolutionary Algorithms",
    intro: `
      <p>Evolutionary algorithms model the process of natural selection and genetics.
      Populations of candidate solutions undergo selection, crossover (recombination),
      and mutation over successive generations, gradually evolving better solutions to
      optimization problems.</p>
      <ul>
        <li><strong>Genetic Algorithms (GA)</strong> &mdash; Holland's original framework using
        binary or real-valued chromosomes, tournament or roulette-wheel selection, and
        crossover/mutation operators.</li>
        <li><strong>Genetic Programming (GP)</strong> &mdash; Evolves computer programs (often
        as tree structures) rather than fixed-length parameter vectors, enabling automatic
        program synthesis.</li>
        <li><strong>Evolution Strategies (ES)</strong> &mdash; Developed by Rechenberg and Schwefel,
        these use real-valued representations and self-adaptive mutation step sizes.</li>
        <li><strong>Differential Evolution (DE)</strong> &mdash; Storn and Price's population-based
        optimizer that creates trial vectors from weighted differences of existing solutions.</li>
        <li><strong>Multi-Objective Optimization</strong> &mdash; Algorithms like NSGA-II and
        SPEA2 that find Pareto-optimal trade-off fronts among competing objectives.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Genetic Algorithms",
        items: [
          {
            title: "Adaptation in Natural and Artificial Systems",
            author: "John H. Holland",
            type: "book",
            level: "advanced",
            url: "https://mitpress.mit.edu/9780262581110/adaptation-in-natural-and-artificial-systems/",
            desc: "The foundational 1975 book that introduced genetic algorithms, the schema theorem, and the building-block hypothesis."
          },
          {
            title: "An Introduction to Genetic Algorithms",
            author: "Melanie Mitchell",
            type: "book",
            level: "beginner",
            url: "https://mitpress.mit.edu/9780262631853/an-introduction-to-genetic-algorithms/",
            desc: "An accessible and widely-used textbook that explains genetic algorithms from basic concepts through advanced theory with practical exercises."
          },
          {
            title: "Genetic Algorithms in Search, Optimization, and Machine Learning",
            author: "David E. Goldberg",
            type: "book",
            level: "intermediate",
            url: "https://www.pearson.com/en-us/subject-catalog/p/genetic-algorithms-in-search-optimization-and-machine-learning/P200000003449",
            desc: "One of the most cited GA references, covering schemata theory, building blocks, parallel GAs, and applications to machine learning."
          },
          {
            title: "Differential Evolution: A Practical Approach to Global Optimization",
            author: "Kenneth V. Price, Rainer M. Storn & Jouni A. Lampinen",
            type: "book",
            level: "intermediate",
            url: "https://link.springer.com/book/10.1007/3-540-31306-0",
            desc: "The authoritative reference on differential evolution, including its theory, variants, and applications to real-world engineering problems."
          },
          {
            title: "Genetic Algorithm Walkthroughs",
            author: "Kie Codes",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=nhT56blfRpE",
            desc: "Visual step-by-step explanation of how genetic algorithms work, covering selection, crossover, and mutation with animated examples."
          }
        ]
      },
      {
        title: "Genetic Programming",
        items: [
          {
            title: "Genetic Programming: On the Programming of Computers by Means of Natural Selection",
            author: "John R. Koza",
            type: "book",
            level: "advanced",
            url: "https://mitpress.mit.edu/9780262111706/genetic-programming/",
            desc: "Koza's seminal book that introduced genetic programming, demonstrating automatic evolution of computer programs for diverse tasks."
          },
          {
            title: "A Field Guide to Genetic Programming",
            author: "Riccardo Poli, William B. Langdon & Nicholas F. McPhee",
            type: "book",
            level: "intermediate",
            url: "http://www.gp-field-guide.org.uk/",
            desc: "A freely available introduction to GP covering tree-based, linear, and grammar-based approaches with practical implementation advice."
          },
          {
            title: "DEAP: Distributed Evolutionary Algorithms in Python",
            author: "Fortin et al.",
            type: "code",
            level: "intermediate",
            url: "https://github.com/DEAP/deap",
            desc: "A popular Python framework for prototyping evolutionary algorithms including GP, with built-in benchmarks and parallelization support."
          },
          {
            title: "PushGP and Program Synthesis",
            author: "Lee Spector",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1007/s10710-010-9104-6",
            desc: "Introduces Push, a stack-based language designed for GP, enabling evolution of programs with complex control flow and multiple data types."
          }
        ]
      },
      {
        title: "Multi-Objective Optimization",
        items: [
          {
            title: "Multi-Objective Optimization Using Evolutionary Algorithms",
            author: "Kalyanmoy Deb",
            type: "book",
            level: "intermediate",
            url: "https://www.wiley.com/en-us/Multi+Objective+Optimization+using+Evolutionary+Algorithms-p-9780471873396",
            desc: "The definitive text on multi-objective evolutionary optimization, introducing NSGA-II and providing extensive theory on Pareto dominance."
          },
          {
            title: "A Fast and Elitist Multiobjective Genetic Algorithm: NSGA-II",
            author: "Kalyanmoy Deb, Amrit Pratap, Sameer Agarwal & T. Meyarivan",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1109/4235.996017",
            desc: "The original NSGA-II paper proposing fast non-dominated sorting and crowding distance, one of the most cited evolutionary computation papers."
          },
          {
            title: "MOEA Framework",
            author: "David Hadka",
            type: "code",
            level: "intermediate",
            url: "https://github.com/MOEAFramework/MOEAFramework",
            desc: "A comprehensive Java framework for multi-objective evolutionary algorithms supporting NSGA-II, SPEA2, MOEA/D, and many others with built-in analysis tools."
          },
          {
            title: "pymoo: Multi-Objective Optimization in Python",
            author: "Julian Blank & Kalyanmoy Deb",
            type: "code",
            level: "intermediate",
            url: "https://github.com/anyoptimization/pymoo",
            desc: "A Python library providing state-of-the-art multi-objective optimization algorithms, visualization tools, and benchmark problem suites."
          }
        ]
      }
    ]
  },

  /* ───────────────────── 3. SWARM ───────────────────── */
  {
    id: "swarm",
    icon: "∿",
    label: "Swarm Intelligence",
    intro: `
      <p>Swarm intelligence algorithms model the collective behavior of decentralized,
      self-organized systems found in nature. Individual agents follow simple local rules
      and interact with their neighbors, yet the swarm as a whole exhibits sophisticated
      emergent problem-solving capabilities.</p>
      <ul>
        <li><strong>Ant Colony Optimization (ACO)</strong> &mdash; Inspired by how ants deposit
        pheromone trails to find shortest paths between food sources and their nest, applied
        to combinatorial optimization problems like TSP and vehicle routing.</li>
        <li><strong>Particle Swarm Optimization (PSO)</strong> &mdash; Models flocking behavior
        of birds, where particles adjust their velocity based on personal best and global best
        positions in the search space.</li>
        <li><strong>Artificial Bee Colony (ABC)</strong> &mdash; Simulates the foraging behavior
        of honeybee swarms with employed bees, onlooker bees, and scout bees exploring
        the solution landscape.</li>
        <li><strong>Firefly Algorithm</strong> &mdash; Uses the flashing behavior of fireflies
        where attraction is proportional to brightness, providing natural multimodal
        optimization capability.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Ant Colony Optimization",
        items: [
          {
            title: "Ant Colony Optimization",
            author: "Marco Dorigo & Thomas Stutzle",
            type: "book",
            level: "intermediate",
            url: "https://mitpress.mit.edu/9780262042192/ant-colony-optimization/",
            desc: "The comprehensive reference by ACO's inventor, covering ant system, MAX-MIN ant system, and applications to routing, scheduling, and assignment problems."
          },
          {
            title: "Ant Colony System: A Cooperative Learning Approach to the Traveling Salesman Problem",
            author: "Marco Dorigo & Luca Maria Gambardella",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1109/4235.585892",
            desc: "The landmark paper introducing Ant Colony System (ACS), demonstrating state-of-the-art performance on TSP instances using pheromone-based learning."
          },
          {
            title: "ACO Algorithms for the TSP (ACO code)",
            author: "Thomas Stutzle",
            type: "code",
            level: "intermediate",
            url: "https://github.com/tsstss123/AntColonyOptimization",
            desc: "Reference implementation of ant colony optimization algorithms applied to traveling salesman problem instances with configurable parameters."
          },
          {
            title: "Ant Colony Optimization — Computerphile",
            author: "Computerphile",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/watch?v=783ZtAF4j5g",
            desc: "A clear visual explanation of how ant colony optimization works, covering pheromone deposition, evaporation, and convergence behavior."
          }
        ]
      },
      {
        title: "Particle Swarm Optimization",
        items: [
          {
            title: "Particle Swarm Optimization (Original Paper)",
            author: "James Kennedy & Russell Eberhart",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1109/ICNN.1995.488968",
            desc: "The 1995 paper that introduced PSO, showing how a swarm of particles navigating a search space can solve continuous optimization problems."
          },
          {
            title: "Swarm Intelligence (Morgan Kaufmann)",
            author: "James Kennedy & Russell Eberhart",
            type: "book",
            level: "intermediate",
            url: "https://www.elsevier.com/books/swarm-intelligence/kennedy/978-1-55860-595-4",
            desc: "A thorough treatment of swarm intelligence with emphasis on PSO, including social-psychological motivations and practical algorithm design."
          },
          {
            title: "A Comprehensive Review of Particle Swarm Optimization",
            author: "Marini & Walczak",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.chemolab.2015.08.020",
            desc: "Reviews PSO variants including constriction factor, inertia weight strategies, and multi-objective extensions with convergence analysis."
          },
          {
            title: "PySwarms: A Research Toolkit for Particle Swarm Optimization",
            author: "Lester James V. Miranda",
            type: "code",
            level: "beginner",
            url: "https://github.com/ljvmiranda921/pyswarms",
            desc: "A Python library for PSO with global-best and local-best topologies, built-in visualization, and support for custom objective functions."
          }
        ]
      },
      {
        title: "Other Swarm Methods",
        items: [
          {
            title: "Firefly Algorithm (Original Paper)",
            author: "Xin-She Yang",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/978-3-642-04944-6_14",
            desc: "Introduces the firefly algorithm, where attraction between fireflies is modulated by light intensity and distance, with natural multimodal capability."
          },
          {
            title: "Artificial Bee Colony Algorithm (ABC)",
            author: "Dervis Karaboga",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/s10898-007-9149-x",
            desc: "The foundational paper for the ABC algorithm modeling employed, onlooker, and scout bee behaviors for numerical function optimization."
          },
          {
            title: "Grey Wolf Optimizer",
            author: "Seyedali Mirjalili, Seyed Mohammad Mirjalili & Andrew Lewis",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.advengsoft.2013.12.007",
            desc: "Proposes the GWO algorithm inspired by the social hierarchy and hunting strategies of grey wolves, demonstrating competitive benchmark performance."
          },
          {
            title: "Whale Optimization Algorithm",
            author: "Seyedali Mirjalili & Andrew Lewis",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.advengsoft.2016.01.008",
            desc: "A swarm algorithm inspired by the bubble-net hunting strategy of humpback whales, using encircling prey and spiral updating mechanisms."
          }
        ]
      }
    ]
  },

  /* ───────────────────── 4. NEURAL ───────────────────── */
  {
    id: "neural",
    icon: "⊗",
    label: "Neural & Brain-Inspired",
    intro: `
      <p>Neural and brain-inspired computing takes cues from the structure and function of
      biological nervous systems. From the classic perceptron to modern deep learning architectures
      and emerging neuromorphic hardware, this field translates neuroscience insights into
      powerful computational models.</p>
      <ul>
        <li><strong>Artificial Neural Networks</strong> &mdash; Computational models composed of
        interconnected nodes (neurons) with weighted connections trained via algorithms like
        backpropagation to approximate complex functions.</li>
        <li><strong>Spiking Neural Networks (SNN)</strong> &mdash; Third-generation neural networks
        that process information using discrete spikes in time, more closely mimicking
        biological neural coding.</li>
        <li><strong>Neuromorphic Computing</strong> &mdash; Hardware architectures like Intel's
        Loihi and IBM's TrueNorth that physically implement neural-inspired computation
        with massive parallelism and low energy consumption.</li>
        <li><strong>Hebbian Learning</strong> &mdash; The principle that "neurons that fire together
        wire together," forming the basis for unsupervised learning rules in neural networks.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Neural Network Foundations",
        items: [
          {
            title: "Neural Networks and Deep Learning (Online Book)",
            author: "Michael Nielsen",
            type: "book",
            level: "beginner",
            url: "http://neuralnetworksanddeeplearning.com/",
            desc: "A freely available, elegantly written introduction to neural networks and deep learning with interactive visualizations and clear mathematical explanations."
          },
          {
            title: "Deep Learning",
            author: "Ian Goodfellow, Yoshua Bengio & Aaron Courville",
            type: "book",
            level: "intermediate",
            url: "https://www.deeplearningbook.org/",
            desc: "The comprehensive textbook covering deep learning theory from linear algebra foundations through modern architectures like CNNs, RNNs, and generative models."
          },
          {
            title: "Neural Networks: Zero to Hero",
            author: "Andrej Karpathy",
            type: "video",
            level: "beginner",
            url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
            desc: "A hands-on video series building neural networks from scratch in Python, progressing from simple neurons to transformers and language models."
          },
          {
            title: "The Biological Basis of Deep Learning",
            author: "Yoshua Bengio et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.abh0619",
            desc: "Explores the connections between deep learning and neuroscience, examining how biological plausibility constraints could improve artificial networks."
          }
        ]
      },
      {
        title: "Spiking Neural Networks",
        items: [
          {
            title: "Spiking Neuron Models: Single Neurons, Populations, Plasticity",
            author: "Wulfram Gerstner & Werner Kistler",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1017/CBO9780511815706",
            desc: "A rigorous treatment of spiking neuron models including integrate-and-fire, Hodgkin-Huxley, and spike-response models with network-level analysis."
          },
          {
            title: "Spiking Neural Networks: An Introduction (Tutorial)",
            author: "Aboozar Taherkhani et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.neunet.2019.09.036",
            desc: "A comprehensive tutorial on SNN architectures, learning rules (STDP, supervised), and their relationship to conventional deep learning approaches."
          },
          {
            title: "Norse: A Library for Spiking Neural Networks in PyTorch",
            author: "Christian Pehle & Jens Egholm Pedersen",
            type: "code",
            level: "intermediate",
            url: "https://github.com/norse/norse",
            desc: "A PyTorch-based library for building and training spiking neural networks with GPU acceleration and integration with deep learning workflows."
          },
          {
            title: "snnTorch: Training Spiking Neural Networks",
            author: "Jason K. Eshraghian et al.",
            type: "code",
            level: "intermediate",
            url: "https://github.com/jeshraghian/snntorch",
            desc: "A Python package for training spiking neural networks using surrogate gradient methods, featuring tutorials on neuromorphic datasets and hardware deployment."
          }
        ]
      },
      {
        title: "Neuromorphic Hardware",
        items: [
          {
            title: "Loihi: A Neuromorphic Manycore Processor (Intel)",
            author: "Mike Davies et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1109/MM.2018.112130359",
            desc: "Describes Intel's Loihi chip featuring 128 neuromorphic cores, on-chip learning, and hierarchical connectivity for energy-efficient spiking computation."
          },
          {
            title: "TrueNorth: Design and Tool Flow of a 65 mW Neuromorphic Chip",
            author: "Paul A. Merolla et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1126/science.1254642",
            desc: "IBM's TrueNorth chip paper presenting a million-neuron programmable neurosynaptic processor with unprecedented energy efficiency for pattern recognition."
          },
          {
            title: "Lava: An Open-Source Software Framework for Neuromorphic Computing",
            author: "Intel Labs",
            type: "code",
            level: "intermediate",
            url: "https://github.com/lava-nc/lava",
            desc: "Intel's open-source framework for developing neuro-inspired applications deployable on heterogeneous architectures including Loihi neuromorphic processors."
          },
          {
            title: "Neuromorphic Computing and Engineering (IOP Journal)",
            author: "IOP Publishing",
            type: "notes",
            level: "advanced",
            url: "https://iopscience.iop.org/journal/2634-4386",
            desc: "A dedicated journal publishing research on neuromorphic hardware, algorithms, and applications, serving as a hub for the neuromorphic computing community."
          }
        ]
      }
    ]
  },

  /* ───────────────────── 5. IMMUNE ───────────────────── */
  {
    id: "immune",
    icon: "☘",
    label: "Immune System Algorithms",
    intro: `
      <p>Artificial immune systems (AIS) draw inspiration from the vertebrate adaptive immune
      system, which can detect and respond to an immense variety of pathogens it has never
      encountered before. Immune-inspired algorithms excel at anomaly detection, pattern
      recognition, and adaptive defense.</p>
      <ul>
        <li><strong>Clonal Selection</strong> &mdash; Based on the proliferation and
        hypermutation of B-cells that recognize antigens, used in optimization and
        pattern recognition (CLONALG algorithm).</li>
        <li><strong>Negative Selection</strong> &mdash; Models how T-cells are screened in the
        thymus to distinguish self from non-self, applied to anomaly detection and
        computer security.</li>
        <li><strong>Danger Theory</strong> &mdash; A newer immunological model where immune
        response is triggered by danger signals rather than foreignness, inspiring
        algorithms for intrusion detection.</li>
        <li><strong>Immune Network Theory</strong> &mdash; Jerne's theory of idiotypic networks
        where antibodies interact with each other, modeled computationally for data
        mining and optimization.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Immune System Biology",
        items: [
          {
            title: "Immunology for Computer Scientists",
            author: "Melanie Mitchell & Stephanie Forrest",
            type: "notes",
            level: "beginner",
            url: "https://doi.org/10.1007/3-540-36217-7_2",
            desc: "An accessible primer on immunology concepts relevant to computer scientists, bridging biological terminology and computational abstractions."
          },
          {
            title: "Janeway's Immunobiology (9th Edition)",
            author: "Kenneth Murphy & Casey Weaver",
            type: "book",
            level: "intermediate",
            url: "https://wwnorton.com/books/9780815345053",
            desc: "The standard immunology textbook providing deep biological context for adaptive and innate immunity that inspires AIS algorithm design."
          },
          {
            title: "The Immune System (Garland Science)",
            author: "Peter Parham",
            type: "book",
            level: "beginner",
            url: "https://www.routledge.com/The-Immune-System/Parham/p/book/9780815345268",
            desc: "An accessible introduction to immunology with clear illustrations, suitable for computer scientists seeking biological grounding for AIS research."
          }
        ]
      },
      {
        title: "Artificial Immune Systems",
        items: [
          {
            title: "Artificial Immune Systems: A New Computational Intelligence Approach",
            author: "Leandro Nunes de Castro & Jonathan Timmis",
            type: "book",
            level: "intermediate",
            url: "https://link.springer.com/book/10.1007/978-1-4471-0143-3",
            desc: "A comprehensive introduction to AIS covering clonal selection (CLONALG), negative selection, immune network models, and their applications."
          },
          {
            title: "Learning and Optimization Using the Clonal Selection Principle (CLONALG)",
            author: "Leandro Nunes de Castro & Fernando Jose Von Zuben",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1109/4235.1011826",
            desc: "The original CLONALG paper showing how clonal selection and affinity maturation can solve pattern recognition and multimodal optimization problems."
          },
          {
            title: "Negative Selection Algorithm for Network Intrusion Detection",
            author: "Stephanie Forrest et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1109/SP.1994.296580",
            desc: "The pioneering paper applying negative selection to computer security, detecting unauthorized changes by distinguishing self from non-self patterns."
          },
          {
            title: "The Dendritic Cell Algorithm (DCA)",
            author: "Julie Greensmith, Uwe Aickelin & Steve Cayzer",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1007/11536444_13",
            desc: "Introduces an algorithm based on dendritic cell biology and danger theory, classifying anomalous behavior through multiple signal processing."
          }
        ]
      },
      {
        title: "Applications & Security",
        items: [
          {
            title: "Artificial Immune Systems for Anomaly Detection",
            author: "Dipankar Dasgupta",
            type: "book",
            level: "intermediate",
            url: "https://link.springer.com/book/10.1007/978-3-642-01799-5",
            desc: "Covers the application of AIS techniques to anomaly detection in network security, fraud detection, and fault diagnosis."
          },
          {
            title: "An Overview of Artificial Immune Systems (Applied Soft Computing Survey)",
            author: "Leandro Nunes de Castro & Jonathan Timmis",
            type: "notes",
            level: "beginner",
            url: "https://doi.org/10.1007/978-3-7091-0281-0",
            desc: "A broad survey linking immune mechanisms to their algorithmic counterparts, providing a roadmap for applying AIS to engineering problems."
          },
          {
            title: "Artificial Immune System Approaches to Intrusion Detection — A Review",
            author: "Steve Hofmeyr & Stephanie Forrest",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1007/BF02478300",
            desc: "Reviews how immune-inspired approaches address network intrusion detection, comparing negative selection and danger theory methods."
          },
          {
            title: "opt-aiNet: Immune Network Algorithm for Optimization",
            author: "Leandro Nunes de Castro & Jonathan Timmis",
            type: "code",
            level: "advanced",
            url: "https://github.com/Pyomo/pyomo",
            desc: "An immune network-based algorithm for multimodal function optimization that dynamically adjusts population size to maintain diverse solutions."
          }
        ]
      }
    ]
  },

  /* ───────────────────── 6. ECOLOGY ───────────────────── */
  {
    id: "ecology",
    icon: "⬡",
    label: "Ecology & Plant-Inspired",
    intro: `
      <p>Ecology and plant-inspired algorithms draw from the growth patterns of plants, the
      dynamics of ecosystems, and the self-organizing processes seen in morphogenesis and
      chemical reaction-diffusion systems. These approaches capture spatial structure,
      developmental rules, and emergent complexity.</p>
      <ul>
        <li><strong>Cellular Automata</strong> &mdash; Discrete computational models where cells
        on a grid update their states based on local neighborhood rules, producing complex
        emergent behavior (e.g., Conway's Game of Life, Wolfram's elementary automata).</li>
        <li><strong>L-Systems</strong> &mdash; Lindenmayer systems are formal grammars that
        model plant growth and branching structures through parallel string rewriting,
        widely used in computer graphics and developmental biology modeling.</li>
        <li><strong>Artificial Life (ALife)</strong> &mdash; The study of life-as-it-could-be
        through simulation, exploring self-replication, open-ended evolution, and
        emergent ecosystems.</li>
        <li><strong>Reaction-Diffusion</strong> &mdash; Turing's chemical basis of morphogenesis,
        where interacting substances diffuse and react to form spatial patterns like spots
        and stripes, now used for unconventional computation.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Artificial Life & Cellular Automata",
        items: [
          {
            title: "A New Kind of Science",
            author: "Stephen Wolfram",
            type: "book",
            level: "intermediate",
            url: "https://www.wolframscience.com/nks/",
            desc: "Wolfram's comprehensive exploration of cellular automata and computational universality, with thousands of pages of examples and a freely available online edition."
          },
          {
            title: "Artificial Life: An Overview",
            author: "Christopher G. Langton",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.7551/mitpress/1427.003.0003",
            desc: "Langton's foundational overview of the artificial life field, defining its scope and relationship to biology, computer science, and complex systems."
          },
          {
            title: "Cellular Automata Modeling of Physical Systems",
            author: "Bastien Chopard & Michel Droz",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1017/CBO9780511549755",
            desc: "A rigorous treatment of cellular automata applied to physical simulation including diffusion, fluid dynamics, and reaction-diffusion systems."
          },
          {
            title: "Golly: Cellular Automata Simulator",
            author: "Andrew Trevorrow & Tom Rokicki",
            type: "code",
            level: "beginner",
            url: "https://github.com/AlephAlpha/golly",
            desc: "An open-source, cross-platform application for exploring Conway's Life and other cellular automata rules with support for very large patterns."
          }
        ]
      },
      {
        title: "L-Systems & Morphogenesis",
        items: [
          {
            title: "The Algorithmic Beauty of Plants",
            author: "Przemyslaw Prusinkiewicz & Aristid Lindenmayer",
            type: "book",
            level: "intermediate",
            url: "http://algorithmicbotany.org/papers/#abop",
            desc: "The classic reference on L-systems and their use in modeling plant development, freely available online with stunning visualizations of botanical structures."
          },
          {
            title: "Lindenmayer Systems, Fractals, and Plants",
            author: "Przemyslaw Prusinkiewicz & James Hanan",
            type: "book",
            level: "intermediate",
            url: "https://link.springer.com/book/10.1007/978-1-4757-1428-9",
            desc: "A concise introduction to L-systems and their connection to fractal geometry in plant modeling, with numerous graphical examples."
          },
          {
            title: "On Growth and Form",
            author: "D'Arcy Wentworth Thompson",
            type: "book",
            level: "advanced",
            url: "https://doi.org/10.1017/CBO9781107325852",
            desc: "The 1917 masterpiece relating biological form to mathematical and physical principles, a foundational influence on computational morphogenesis."
          },
          {
            title: "L-System Plant Geometry Generator",
            author: "Paul Shortone",
            type: "code",
            level: "beginner",
            url: "https://github.com/abiusx/L-Systems",
            desc: "A lightweight implementation of parametric L-systems for generating plant-like structures with turtle graphics interpretation."
          }
        ]
      },
      {
        title: "Reaction-Diffusion Computing",
        items: [
          {
            title: "The Chemical Basis of Morphogenesis",
            author: "Alan M. Turing",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1098/rstb.1952.0012",
            desc: "Turing's landmark 1952 paper proposing that chemical substances (morphogens) reacting and diffusing can explain biological pattern formation."
          },
          {
            title: "Reaction-Diffusion Textures (GPU Gems)",
            author: "Andrew Witkin & Michael Kass",
            type: "notes",
            level: "intermediate",
            url: "https://developer.nvidia.com/gpugems/gpugems/part-iv-texturing/chapter-33-implementing-improved-perlin-noise",
            desc: "A practical guide to implementing reaction-diffusion systems on GPU hardware for texture generation and pattern synthesis."
          },
          {
            title: "Ready: A Cross-Platform Reaction-Diffusion Explorer",
            author: "Tim Hutton et al.",
            type: "code",
            level: "beginner",
            url: "https://github.com/GollyGang/ready",
            desc: "A GPU-accelerated program for exploring reaction-diffusion systems and other continuous cellular automata on grids and meshes."
          },
          {
            title: "Gray-Scott Reaction-Diffusion Explorer",
            author: "Robert Munafo",
            type: "data",
            level: "beginner",
            url: "https://mrob.com/pub/comp/xmorphia/",
            desc: "An interactive parameter-space explorer for the Gray-Scott model, cataloging the rich variety of patterns produced by different reaction-diffusion parameters."
          }
        ]
      }
    ]
  },

  /* ───────────────────── 7. BENCHMARKS ───────────────────── */
  {
    id: "benchmarks",
    icon: "⟐",
    label: "Libraries & Benchmarks",
    intro: `
      <p>Rigorous benchmarking and reproducible experimentation are essential for advancing
      nature-inspired algorithm research. Standard libraries, benchmark function suites,
      and statistical comparison methodologies enable fair evaluation and meaningful
      progress in the field.</p>
      <ul>
        <li><strong>Optimization Libraries</strong> &mdash; Frameworks like DEAP, PyGMO, jMetal,
        and ECJ that provide ready-to-use implementations of evolutionary and swarm algorithms
        with extensible architectures.</li>
        <li><strong>Benchmark Suites</strong> &mdash; Standard test function collections like
        CEC competition benchmarks, BBOB (Black-Box Optimization Benchmarking), and
        real-world optimization problem sets.</li>
        <li><strong>Statistical Comparison</strong> &mdash; Methodologies for rigorously comparing
        algorithm performance using non-parametric tests, effect sizes, and convergence
        profiles rather than single-run comparisons.</li>
        <li><strong>Reproducibility</strong> &mdash; Tools and practices for ensuring that
        computational experiments can be independently verified and results fairly compared
        across studies.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Optimization Libraries",
        items: [
          {
            title: "DEAP: Distributed Evolutionary Algorithms in Python",
            author: "Felix-Antoine Fortin et al.",
            type: "code",
            level: "intermediate",
            url: "https://github.com/DEAP/deap",
            desc: "A versatile Python framework for rapid prototyping of evolutionary algorithms supporting GP, GA, PSO, ES, and multi-objective optimization."
          },
          {
            title: "PyGMO / Pagmo2: Parallel Global Multiobjective Optimizer",
            author: "ESA Advanced Concepts Team",
            type: "code",
            level: "intermediate",
            url: "https://github.com/esa/pagmo2",
            desc: "A scientific library by the European Space Agency for massively parallel optimization, featuring island model parallelism and dozens of algorithms."
          },
          {
            title: "jMetal: Metaheuristic Algorithms in Java",
            author: "Antonio J. Nebro et al.",
            type: "code",
            level: "intermediate",
            url: "https://github.com/jMetal/jMetal",
            desc: "A Java-based framework for multi-objective optimization with metaheuristics, providing a wide collection of algorithms, problems, and quality indicators."
          },
          {
            title: "ECJ: A Java-Based Evolutionary Computation Research System",
            author: "Sean Luke et al.",
            type: "code",
            level: "advanced",
            url: "https://github.com/GMUEClab/ecj",
            desc: "A highly configurable evolutionary computation system supporting GP, coevolution, island models, and multi-objective optimization with parameter file-based configuration."
          },
          {
            title: "Nevergrad: Gradient-Free Optimization Platform",
            author: "Facebook Research",
            type: "code",
            level: "intermediate",
            url: "https://github.com/facebookresearch/nevergrad",
            desc: "Meta's platform for derivative-free optimization providing a unified interface to evolutionary strategies, PSO, CMA-ES, and other black-box optimizers."
          }
        ]
      },
      {
        title: "Benchmark Suites",
        items: [
          {
            title: "CEC Competition Benchmark Functions",
            author: "IEEE Congress on Evolutionary Computation",
            type: "data",
            level: "intermediate",
            url: "https://github.com/P-N-Suganthan",
            desc: "Standard benchmark function suites used in IEEE CEC competitions for comparing optimization algorithms under controlled conditions."
          },
          {
            title: "COCO: Comparing Continuous Optimizers (BBOB)",
            author: "Nikolaus Hansen et al.",
            type: "code",
            level: "intermediate",
            url: "https://github.com/numbbo/coco",
            desc: "The COCO platform for black-box optimization benchmarking with automated performance assessment, used for the BBOB workshop series at GECCO."
          },
          {
            title: "TSPLIB: Traveling Salesman Problem Library",
            author: "Gerhard Reinelt",
            type: "data",
            level: "beginner",
            url: "http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/",
            desc: "A widely-used library of sample instances for the TSP and related problems, serving as the standard testbed for combinatorial optimization algorithms."
          },
          {
            title: "IOHprofiler: Iterative Optimization Heuristics Profiler",
            author: "Carola Doerr et al.",
            type: "code",
            level: "intermediate",
            url: "https://github.com/IOHprofiler",
            desc: "A comprehensive benchmarking framework with statistical analysis tools for profiling and comparing iterative optimization heuristics."
          }
        ]
      },
      {
        title: "Comparison & Analysis Tools",
        items: [
          {
            title: "A Practical Tutorial on the Use of Nonparametric Statistical Tests",
            author: "Joaquin Derrac et al.",
            type: "notes",
            level: "intermediate",
            url: "https://doi.org/10.1016/j.swevo.2011.02.002",
            desc: "Essential guide on applying Wilcoxon, Friedman, and other nonparametric tests for statistically rigorous comparison of metaheuristic algorithms."
          },
          {
            title: "CMA-ES: Evolution Strategy with Covariance Matrix Adaptation",
            author: "Nikolaus Hansen",
            type: "code",
            level: "advanced",
            url: "https://github.com/CMA-ES/pycma",
            desc: "The reference Python implementation of CMA-ES, a state-of-the-art evolution strategy often used as a baseline in continuous optimization benchmarks."
          },
          {
            title: "SciPy Optimize: Benchmark and Compare Optimizers",
            author: "SciPy Community",
            type: "code",
            level: "beginner",
            url: "https://github.com/scipy/scipy",
            desc: "SciPy's optimization module provides classical and modern optimizers that serve as important baselines when evaluating nature-inspired methods."
          },
          {
            title: "Sporadic: Statistical Performance Reporting for Algorithm Design",
            author: "Manuel Lopez-Ibanez et al.",
            type: "notes",
            level: "advanced",
            url: "https://doi.org/10.1016/j.orp.2018.10.002",
            desc: "Guidelines and tools for proper statistical reporting in metaheuristic research, addressing common pitfalls in algorithm comparison studies."
          }
        ]
      }
    ]
  }

];

/* ═══════════════════════════════════════════════════════════════
   Rendering Engine
   ═══════════════════════════════════════════════════════════════ */

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
