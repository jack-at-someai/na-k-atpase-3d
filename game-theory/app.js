// Game Theory Reference — data + rendering

const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '\u265F',
    intro: `<p><strong>Game theory</strong> is the mathematical study of strategic interaction — situations where the outcome for each participant depends on the choices of all. It provides a formal language for reasoning about conflict, cooperation, competition, and coordination.</p>
<p>Born from the work of <em>John von Neumann</em> and <em>Oskar Morgenstern</em> in the 1940s, and revolutionized by <em>John Nash</em> in the 1950s, game theory has become foundational across economics, political science, biology, computer science, and artificial intelligence. It asks: when rational agents interact, what outcomes emerge? When should you cooperate? When should you compete? How do you design systems where self-interested agents produce good collective outcomes?</p>
<h3>How to use this reference</h3>
<p>This guide is organized into eight domains. Each section opens with a conceptual introduction explaining <em>what</em> the field studies, <em>why</em> it matters, and <em>how</em> it connects to the broader landscape. Resources are tagged by type and difficulty so you can filter for your level.</p>
<h3>Suggested learning path</h3>
<ol>
<li><strong>Start with Classical Game Theory</strong> — learn the foundational concepts: players, strategies, payoffs, Nash equilibrium</li>
<li><strong>Explore Cooperative Game Theory</strong> — understand coalitions, fair division, and the Shapley value</li>
<li><strong>Study Evolutionary Game Theory</strong> — see how strategy emerges without rationality, through selection and adaptation</li>
<li><strong>Dive into Mechanism Design</strong> — learn to design the rules of the game: auctions, voting, incentives</li>
<li><strong>Tackle Algorithmic Game Theory</strong> — computational complexity of equilibria, price of anarchy, online mechanisms</li>
<li><strong>Understand Behavioral Game Theory</strong> — how real humans deviate from perfect rationality</li>
<li><strong>Explore Combinatorial & Network Games</strong> — games on graphs, congestion, and networked strategic interaction</li>
<li><strong>See Applications</strong> — AI, multi-agent systems, economics, biology, and beyond</li>
</ol>
<h3>The big ideas</h3>
<ul>
<li><strong>Nash Equilibrium</strong> — a state where no player can improve by unilaterally changing strategy</li>
<li><strong>Prisoner's Dilemma</strong> — individual rationality leads to collective irrationality</li>
<li><strong>Shapley Value</strong> — the uniquely fair way to distribute value among cooperating agents</li>
<li><strong>Mechanism Design</strong> — "reverse game theory" — designing games to produce desired outcomes</li>
<li><strong>Price of Anarchy</strong> — how much worse is selfish behavior than optimal coordination?</li>
<li><strong>Evolutionary Stability</strong> — strategies that persist under natural selection</li>
</ul>`,
    subsections: []
  },
  {
    id: 'classical',
    title: 'Classical Game Theory',
    icon: '\u2696',
    intro: `<p><strong>Classical (non-cooperative) game theory</strong> studies strategic interactions where each player independently chooses a strategy to maximize their own payoff. The foundational solution concept is the <strong>Nash equilibrium</strong>: a profile of strategies where no player can gain by unilaterally deviating.</p>
<p>Key concepts include:</p>
<ul>
<li><strong>Normal form games</strong> — simultaneous moves, represented as payoff matrices</li>
<li><strong>Extensive form games</strong> — sequential moves, represented as game trees</li>
<li><strong>Dominant strategies</strong> — strategies that are best regardless of what others do</li>
<li><strong>Mixed strategies</strong> — randomizing over pure strategies to achieve equilibrium</li>
<li><strong>Subgame perfect equilibrium</strong> — Nash equilibrium that holds in every subgame (backward induction)</li>
<li><strong>Bayesian games</strong> — games under incomplete information about other players' types</li>
<li><strong>Repeated games</strong> — how cooperation can emerge through repetition (folk theorems)</li>
</ul>
<p>This is the bedrock. Every other branch of game theory builds on or reacts against these foundations.</p>`,
    subsections: [
      {
        title: 'Foundational Texts',
        resources: [
          { title: 'Theory of Games and Economic Behavior', author: 'John von Neumann & Oskar Morgenstern', year: 1944, url: 'https://press.princeton.edu/books/paperback/9780691130613/theory-of-games-and-economic-behavior', type: 'book', level: 'advanced', desc: 'The founding text of game theory. Establishes the mathematical framework for strategic interaction, minimax theorem, and expected utility theory.' },
          { title: 'Non-Cooperative Games (PhD Thesis)', author: 'John Nash', year: 1950, url: 'https://rbsc.princeton.edu/sites/default/files/Non-Cooperative_Games_Nash.pdf', type: 'paper', level: 'advanced', desc: 'The 27-page thesis that introduced the Nash equilibrium. One of the most influential documents in 20th-century mathematics.' },
          { title: 'The Strategy of Conflict', author: 'Thomas C. Schelling', year: 1960, url: 'https://www.hup.harvard.edu/books/9780674840317', type: 'book', level: 'beginner', desc: 'Nobel laureate Schelling on focal points, credible commitments, and the strategy of deterrence. Readable and profound.' }
        ]
      },
      {
        title: 'Textbooks',
        resources: [
          { title: 'A Course in Game Theory', author: 'Martin J. Osborne & Ariel Rubinstein', year: 1994, url: 'https://mitpress.mit.edu/9780262650403/a-course-in-game-theory/', type: 'book', level: 'intermediate', desc: 'Rigorous graduate-level treatment. Covers strategic, extensive, coalitional, and Bayesian games. Free PDF from authors\' website.' },
          { title: 'Game Theory', author: 'Drew Fudenberg & Jean Tirole', year: 1991, url: 'https://mitpress.mit.edu/9780262061414/game-theory/', type: 'book', level: 'advanced', desc: 'The comprehensive graduate reference. Extensive form, repeated games, incomplete information, equilibrium refinements.' },
          { title: 'An Introduction to Game Theory', author: 'Martin J. Osborne', year: 2004, url: 'https://www.economics.utoronto.ca/osborne/igt/', type: 'book', level: 'beginner', desc: 'Best undergraduate textbook. Clear exposition, good exercises. Covers all the essentials without excessive formalism.' },
          { title: 'Game Theory: Analysis of Conflict', author: 'Roger B. Myerson', year: 1991, url: 'https://www.hup.harvard.edu/books/9780674341166', type: 'book', level: 'advanced', desc: 'By the Nobel laureate who extended Nash\'s work. Deep treatment of Bayesian games, mechanism design, and incentive theory.' },
          { title: 'Strategy: An Introduction to Game Theory', author: 'Joel Watson', year: 2013, url: 'https://wwnorton.com/books/9780393918380', type: 'book', level: 'beginner', desc: 'Accessible introduction emphasizing contract and institutional design. Excellent for first exposure.' },
          { title: 'Playing for Real: A Text on Game Theory', author: 'Ken Binmore', year: 2007, url: 'https://global.oup.com/academic/product/playing-for-real-9780195300574', type: 'book', level: 'intermediate', desc: 'Comprehensive and opinionated. Binmore brings philosophical depth alongside mathematical rigor.' },
          { title: 'Game Theory: An Introduction', author: 'Steven Tadelis', year: 2013, url: 'https://press.princeton.edu/books/hardcover/9780691129082/game-theory', type: 'book', level: 'intermediate', desc: 'Modern graduate text balancing rigor and intuition. Strong on information economics and mechanism design.' },
          { title: 'Game Theory 101: The Complete Textbook', author: 'William Spaniel', year: 2014, url: 'https://gametheory101.com/courses/game-theory-101/', type: 'book', level: 'beginner', desc: 'Companion to the popular YouTube series. Step-by-step solutions to standard game theory problems.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Game Theory (Yale Open Courses)', author: 'Ben Polak', year: 2007, url: 'https://oyc.yale.edu/economics/econ-159', type: 'course', level: 'beginner', desc: 'Outstanding introductory course. 24 lectures covering dominance, Nash equilibrium, mixed strategies, auctions, and evolution. Freely available.' },
          { title: 'Game Theory (Stanford/UBC via Coursera)', author: 'Matthew O. Jackson, Kevin Leyton-Brown & Yoav Shoham', year: 2013, url: 'https://www.coursera.org/learn/game-theory-1', type: 'course', level: 'beginner', desc: 'Two-part Coursera specialization. Part I covers fundamentals; Part II covers mechanism design and advanced topics.' },
          { title: 'Game Theory 101', author: 'William Spaniel', year: null, url: 'https://www.youtube.com/playlist?list=PLKI1h_nAkaQoDzI4xDIXzx6ImY0QCw4Wj', type: 'video', level: 'beginner', desc: 'Excellent YouTube series. Short, clear videos covering Nash equilibrium, extensive form games, Bayesian games, and more.' },
          { title: 'Game Theory (MIT 14.12)', author: 'MIT OpenCourseWare', year: 2012, url: 'https://ocw.mit.edu/courses/14-12-economic-applications-of-game-theory-fall-2012/', type: 'course', level: 'intermediate', desc: 'MIT\'s economic applications of game theory. Lecture notes, problem sets, and exams freely available.' },
          { title: 'Algorithmic Game Theory (Stanford CS364A)', author: 'Tim Roughgarden', year: 2013, url: 'https://www.youtube.com/playlist?list=PLEGCF-WLh2RJBqmxvZ0_ie-mleCFhi2N4', type: 'course', level: 'intermediate', desc: 'Legendary Stanford course. Mechanism design, auction theory, price of anarchy, equilibrium computation.' }
        ]
      },
      {
        title: 'Popular & Accessible',
        resources: [
          { title: 'Thinking Strategically', author: 'Avinash Dixit & Barry Nalebuff', year: 1991, url: 'https://wwnorton.com/books/Thinking-Strategically/', type: 'book', level: 'beginner', desc: 'The classic popular introduction. Real-world strategic situations analyzed with game-theoretic reasoning. No math required.' },
          { title: 'The Art of Strategy', author: 'Avinash Dixit & Barry Nalebuff', year: 2008, url: 'https://wwnorton.com/books/The-Art-of-Strategy/', type: 'book', level: 'beginner', desc: 'Updated and expanded version of Thinking Strategically. Covers bargaining, brinkmanship, voting, and more.' },
          { title: 'Rock, Paper, Scissors: Game Theory in Everyday Life', author: 'Len Fisher', year: 2008, url: 'https://www.goodreads.com/book/show/3164234-rock-paper-scissors', type: 'book', level: 'beginner', desc: 'Entertaining introduction connecting game theory to everyday dilemmas, from traffic to relationships.' },
          { title: 'Prisoner\'s Dilemma', author: 'William Poundstone', year: 1993, url: 'https://www.goodreads.com/book/show/29535.Prisoner_s_Dilemma', type: 'book', level: 'beginner', desc: 'History of game theory intertwined with the story of the Cold War, RAND Corporation, and John von Neumann.' }
        ]
      }
    ]
  },
  {
    id: 'cooperative',
    title: 'Cooperative Game Theory',
    icon: '\u2764',
    intro: `<p><strong>Cooperative game theory</strong> studies what happens when players can form binding agreements and coalitions. Rather than asking "what will each player do independently?", it asks: "which coalitions will form, and how should they divide the gains?"</p>
<p>Key concepts include:</p>
<ul>
<li><strong>Characteristic function</strong> — assigns a value to each coalition (what they can achieve together)</li>
<li><strong>The Core</strong> — the set of allocations where no coalition has incentive to break away</li>
<li><strong>Shapley Value</strong> — the unique allocation satisfying efficiency, symmetry, linearity, and null player axioms. Measures each player's marginal contribution.</li>
<li><strong>Nash Bargaining Solution</strong> — the outcome maximizing the product of players' gains from disagreement</li>
<li><strong>Nucleolus</strong> — minimizes the maximum dissatisfaction of any coalition</li>
<li><strong>Voting games</strong> — power indices (Shapley-Shubik, Banzhaf) measuring influence in weighted voting</li>
</ul>
<p>The Shapley value has become one of the most important concepts in modern AI/ML — it provides the theoretical foundation for <strong>SHAP</strong> (SHapley Additive exPlanations), the leading method for explaining machine learning model predictions.</p>`,
    subsections: [
      {
        title: 'Foundational Papers',
        resources: [
          { title: 'A Value for n-Person Games', author: 'Lloyd Shapley', year: 1953, url: 'https://www.rand.org/pubs/papers/P0295.html', type: 'paper', level: 'intermediate', desc: 'The paper that introduced the Shapley value. Elegant axiomatic derivation of the unique fair division rule.' },
          { title: 'The Bargaining Problem', author: 'John Nash', year: 1950, url: 'https://www.jstor.org/stable/1907266', type: 'paper', level: 'intermediate', desc: 'Nash\'s axiomatic approach to bilateral bargaining. Established the Nash bargaining solution.' },
          { title: 'Cores of Convex Games', author: 'Lloyd Shapley', year: 1971, url: 'https://www.sciencedirect.com/science/article/pii/0020719071900329', type: 'paper', level: 'advanced', desc: 'Proves that convex games always have non-empty cores. Foundational result for cooperative game theory.' }
        ]
      },
      {
        title: 'Textbooks',
        resources: [
          { title: 'Game Theory (Cooperative Chapter)', author: 'Osborne & Rubinstein', year: 1994, url: 'https://mitpress.mit.edu/9780262650403/a-course-in-game-theory/', type: 'book', level: 'intermediate', desc: 'Chapters 13-15 provide a rigorous introduction to coalitional games, the core, and the Shapley value.' },
          { title: 'Cooperative Game Theory and Applications', author: 'Imma Curiel', year: 1997, url: 'https://link.springer.com/book/10.1007/978-1-4757-2578-0', type: 'book', level: 'intermediate', desc: 'Comprehensive treatment of cooperative models with applications to operations research and cost allocation.' },
          { title: 'Fair Division and Collective Welfare', author: 'Herve Moulin', year: 2004, url: 'https://mitpress.mit.edu/9780262633116/fair-division-and-collective-welfare/', type: 'book', level: 'intermediate', desc: 'Axiomatic approach to fair division, cost sharing, and surplus sharing. Bridges cooperative game theory and social choice.' },
          { title: 'Bargaining and Markets', author: 'Martin J. Osborne & Ariel Rubinstein', year: 1990, url: 'https://www.economics.utoronto.ca/osborne/bm/', type: 'book', level: 'intermediate', desc: 'Alternating-offers bargaining model that became the standard framework. Free PDF available from authors.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Cooperative Game Theory (Shapley Value Explained)', author: 'William Spaniel', year: null, url: 'https://www.youtube.com/watch?v=w9O0fkfMkx0', type: 'video', level: 'beginner', desc: 'Clear visual explanation of the Shapley value with worked examples.' },
          { title: 'Game Theory II: Advanced Applications (Coursera)', author: 'Jackson, Leyton-Brown & Shoham', year: null, url: 'https://www.coursera.org/learn/game-theory-2', type: 'course', level: 'intermediate', desc: 'Covers cooperative game theory, the core, Shapley value, and stable matchings.' }
        ]
      }
    ]
  },
  {
    id: 'evolutionary',
    title: 'Evolutionary Game Theory',
    icon: '\uD83E\uDDEC',
    intro: `<p><strong>Evolutionary game theory</strong> studies how strategies spread, persist, or die out in populations — not through rational deliberation, but through <em>selection</em> and <em>replication</em>. It replaces the assumption of perfect rationality with the dynamics of evolution: strategies that do well get copied; strategies that do poorly disappear.</p>
<p>Key concepts include:</p>
<ul>
<li><strong>Evolutionarily Stable Strategy (ESS)</strong> — a strategy that, once prevalent, cannot be invaded by any rare mutant strategy (John Maynard Smith)</li>
<li><strong>Replicator dynamics</strong> — differential equations describing how strategy frequencies change over time based on relative fitness</li>
<li><strong>Hawk-Dove game</strong> — the evolutionary analog of Chicken; explains the evolution of aggression and conflict resolution</li>
<li><strong>Evolution of cooperation</strong> — how cooperation can evolve among selfish agents via kin selection, reciprocity, group selection, spatial structure</li>
<li><strong>Population games</strong> — large-population models where individuals are randomly matched to play games</li>
</ul>
<p>Evolutionary game theory bridges biology and economics. It explains phenomena from animal behavior and microbial warfare to cultural norms and language evolution. It also provides a <em>dynamic</em> foundation for equilibrium selection — which Nash equilibria are actually reachable through adaptive processes?</p>`,
    subsections: [
      {
        title: 'Foundational Texts',
        resources: [
          { title: 'Evolution and the Theory of Games', author: 'John Maynard Smith', year: 1982, url: 'https://www.cambridge.org/core/books/evolution-and-the-theory-of-games/A04C9948CF498C01C6C59E2B77EC61AC', type: 'book', level: 'intermediate', desc: 'The founding text. Introduced ESS to biology. Changed how we understand animal conflict, signaling, and cooperation.' },
          { title: 'The Evolution of Cooperation', author: 'Robert Axelrod', year: 1984, url: 'https://www.basicbooks.com/titles/robert-axelrod/the-evolution-of-cooperation/9780465005642/', type: 'book', level: 'beginner', desc: 'Classic account of the iterated Prisoner\'s Dilemma tournaments. Tit-for-Tat and the emergence of cooperation among egoists.' },
          { title: 'The Logic of Animal Conflict', author: 'John Maynard Smith & George Price', year: 1973, url: 'https://www.nature.com/articles/246015a0', type: 'paper', level: 'intermediate', desc: 'The original Nature paper that launched evolutionary game theory. Introduced the Hawk-Dove game and ESS concept.' }
        ]
      },
      {
        title: 'Textbooks',
        resources: [
          { title: 'Evolutionary Dynamics: Exploring the Equations of Life', author: 'Martin A. Nowak', year: 2006, url: 'https://www.hup.harvard.edu/books/9780674023383', type: 'book', level: 'intermediate', desc: 'Beautiful modern treatment. Covers replicator dynamics, spatial games, evolutionary graph theory, and the evolution of cooperation.' },
          { title: 'Population Games and Evolutionary Dynamics', author: 'William H. Sandholm', year: 2010, url: 'https://mitpress.mit.edu/9780262195874/population-games-and-evolutionary-dynamics/', type: 'book', level: 'advanced', desc: 'Definitive mathematical treatment. Revision protocols, deterministic dynamics, stochastic evolution.' },
          { title: 'Evolutionary Game Theory', author: 'Jorgen Weibull', year: 1995, url: 'https://mitpress.mit.edu/9780262731218/evolutionary-game-theory/', type: 'book', level: 'intermediate', desc: 'Rigorous but accessible. Connects evolutionary stability to classical equilibrium concepts.' },
          { title: 'Game Theory and the Social Contract (2 vols)', author: 'Ken Binmore', year: 1994, url: 'https://mitpress.mit.edu/9780262523493/game-theory-and-the-social-contract-volume-1/', type: 'book', level: 'advanced', desc: 'Ambitious application of evolutionary game theory to moral philosophy and social institutions.' },
          { title: 'The Calculus of Selfishness', author: 'Karl Sigmund', year: 2010, url: 'https://press.princeton.edu/books/paperback/9780691142753/the-calculus-of-selfishness', type: 'book', level: 'intermediate', desc: 'Elegant treatment of indirect reciprocity, reputation, and the evolution of social norms.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Evolutionary Game Theory (Yale, Lectures 10-13)', author: 'Ben Polak', year: 2007, url: 'https://oyc.yale.edu/economics/econ-159', type: 'course', level: 'beginner', desc: 'Four lectures on evolutionary stability and replicator dynamics within the broader game theory course.' },
          { title: 'Evolution of Cooperation (Primer)', author: 'Primer', year: null, url: 'https://www.youtube.com/watch?v=goePYJ74Ydg', type: 'video', level: 'beginner', desc: 'Beautifully animated exploration of the evolution of cooperation. Interactive simulations available on the channel.' },
          { title: 'Evolutionary Game Theory and Agents', author: 'Santa Fe Institute (Complexity Explorer)', year: null, url: 'https://www.complexityexplorer.org/', type: 'course', level: 'intermediate', desc: 'Santa Fe Institute courses on evolutionary dynamics, complex adaptive systems, and agent-based modeling.' }
        ]
      }
    ]
  },
  {
    id: 'mechanism',
    title: 'Mechanism Design & Auctions',
    icon: '\u2699',
    intro: `<p><strong>Mechanism design</strong> is "reverse game theory." Instead of analyzing a given game, you <em>design</em> the rules of the game to achieve a desired outcome — even when players are self-interested and possess private information.</p>
<p>Key concepts include:</p>
<ul>
<li><strong>Incentive compatibility</strong> — mechanisms where truthful reporting is optimal for each player</li>
<li><strong>The Revelation Principle</strong> — any mechanism can be replicated by a direct truthful mechanism</li>
<li><strong>Vickrey-Clarke-Groves (VCG) mechanism</strong> — a general truthful mechanism for efficient allocation</li>
<li><strong>Auction theory</strong> — English, Dutch, first-price, second-price, and combinatorial auctions</li>
<li><strong>Revenue equivalence</strong> — under standard assumptions, all standard auction formats yield the same expected revenue</li>
<li><strong>Optimal auction design</strong> — Myerson's characterization of the revenue-maximizing auction</li>
<li><strong>Matching markets</strong> — the Gale-Shapley deferred acceptance algorithm and stable matching theory</li>
</ul>
<p>Mechanism design has enormous practical impact: it underlies the design of <strong>ad auctions</strong> (Google, Facebook), <strong>spectrum auctions</strong> (FCC), <strong>kidney exchange</strong> programs, <strong>school choice</strong> systems, and <strong>market design</strong> broadly. The 2007, 2012, and 2020 Nobel Prizes in Economics were all related to mechanism design.</p>`,
    subsections: [
      {
        title: 'Foundational Papers',
        resources: [
          { title: 'Counterspeculation, Auctions, and Competitive Sealed Tenders', author: 'William Vickrey', year: 1961, url: 'https://www.jstor.org/stable/2977633', type: 'paper', level: 'advanced', desc: 'Introduced the second-price sealed-bid auction (Vickrey auction) and revenue equivalence. Nobel Prize-winning work.' },
          { title: 'Optimal Auction Design', author: 'Roger Myerson', year: 1981, url: 'https://www.jstor.org/stable/2691105', type: 'paper', level: 'advanced', desc: 'Characterizes the revenue-maximizing auction. One of the most cited papers in economics.' },
          { title: 'College Admissions and the Stability of Marriage', author: 'David Gale & Lloyd Shapley', year: 1962, url: 'https://www.jstor.org/stable/2312726', type: 'paper', level: 'intermediate', desc: 'Introduced the deferred acceptance algorithm and stable matching. Foundation of modern market design.' }
        ]
      },
      {
        title: 'Textbooks',
        resources: [
          { title: 'Auction Theory', author: 'Vijay Krishna', year: 2010, url: 'https://www.elsevier.com/books/auction-theory/krishna/978-0-12-374507-1', type: 'book', level: 'advanced', desc: 'The definitive graduate text on auction theory. Single-item, multi-item, combinatorial, and optimal auctions.' },
          { title: 'An Introduction to the Theory of Mechanism Design', author: 'Tilman Borgers', year: 2015, url: 'https://global.oup.com/academic/product/an-introduction-to-the-theory-of-mechanism-design-9780199734023', type: 'book', level: 'intermediate', desc: 'Clear, modern introduction. Covers social choice, VCG, optimal mechanisms, and implementation theory.' },
          { title: 'Putting Auction Theory to Work', author: 'Paul Milgrom', year: 2004, url: 'https://www.cambridge.org/core/books/putting-auction-theory-to-work/BDC5A4EAF237B7D30DEA81034C385E03', type: 'book', level: 'intermediate', desc: 'Practical auction design by the architect of the FCC spectrum auctions. Theory meets real-world implementation.' },
          { title: 'Who Gets What — and Why', author: 'Alvin Roth', year: 2015, url: 'https://www.hmhbooks.com/shop/books/who-gets-what-and-why/9780544705289', type: 'book', level: 'beginner', desc: 'Nobel laureate Roth on matching markets: kidney exchange, school choice, job markets. No math required.' },
          { title: 'Discovering Prices: Auction Design in Markets with Complex Constraints', author: 'Paul Milgrom', year: 2017, url: 'https://cup.columbia.edu/book/discovering-prices/9780231175982', type: 'book', level: 'intermediate', desc: 'The story of the incentive auction for TV broadcast spectrum. Combinatorial auctions in practice.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Twenty Lectures on Algorithmic Game Theory', author: 'Tim Roughgarden', year: 2016, url: 'https://www.cambridge.org/core/books/twenty-lectures-on-algorithmic-game-theory/A9D8427C977B62B9A14D808E70A407E2', type: 'book', level: 'intermediate', desc: 'Chapters on mechanism design, VCG, optimal auctions, and Myerson\'s lemma. Based on the Stanford course.' },
          { title: 'Mechanism Design (Coursera — Game Theory II)', author: 'Jackson, Leyton-Brown & Shoham', year: null, url: 'https://www.coursera.org/learn/game-theory-2', type: 'course', level: 'intermediate', desc: 'Weeks 2-3 cover mechanism design fundamentals, VCG, and combinatorial auctions.' },
          { title: 'Auction Theory (William Spaniel)', author: 'William Spaniel', year: null, url: 'https://www.youtube.com/watch?v=4kWuxfVbIaU', type: 'video', level: 'beginner', desc: 'Accessible introduction to first-price, second-price, English, and Dutch auctions with clear examples.' }
        ]
      }
    ]
  },
  {
    id: 'algorithmic',
    title: 'Algorithmic Game Theory',
    icon: '\u03BB',
    intro: `<p><strong>Algorithmic game theory</strong> sits at the intersection of computer science and game theory. It asks: what happens when we bring computational thinking to strategic interaction?</p>
<p>Three central questions:</p>
<ul>
<li><strong>Computational complexity of equilibria</strong> — Can we efficiently compute Nash equilibria? (In general: no. The PPAD-completeness result by Daskalakis, Goldberg, and Papadimitriou shows that computing Nash equilibria is computationally hard.)</li>
<li><strong>Price of anarchy / stability</strong> — How much worse is the outcome when self-interested agents make decisions independently vs. a centralized optimal solution? Roughgarden and Tardos showed that in routing games, selfish behavior can be arbitrarily worse than optimal.</li>
<li><strong>Algorithmic mechanism design</strong> — Can we design truthful mechanisms that are also computationally efficient? Sometimes incentive compatibility and computational tractability conflict.</li>
</ul>
<p>This field emerged in the late 1990s when computer scientists realized that the internet, ad markets, and multi-agent AI systems were massive games — and classical game theory didn't address computational constraints.</p>`,
    subsections: [
      {
        title: 'Textbooks & Surveys',
        resources: [
          { title: 'Algorithmic Game Theory', author: 'Nisan, Roughgarden, Tardos & Vazirani (eds.)', year: 2007, url: 'https://www.cambridge.org/core/books/algorithmic-game-theory/0092C07CA8B724E1B1BE2238DDD66B38', type: 'book', level: 'intermediate', desc: 'THE reference book. 25 chapters by leading researchers. Covers equilibrium computation, mechanism design, auctions, networks, and more.' },
          { title: 'Twenty Lectures on Algorithmic Game Theory', author: 'Tim Roughgarden', year: 2016, url: 'https://www.cambridge.org/core/books/twenty-lectures-on-algorithmic-game-theory/A9D8427C977B62B9A14D808E70A407E2', type: 'book', level: 'intermediate', desc: 'Distilled from the Stanford course. Self-contained, beautifully written. Covers mechanism design, price of anarchy, equilibrium computation.' },
          { title: 'Multiagent Systems: Algorithmic, Game-Theoretic, and Logical Foundations', author: 'Yoav Shoham & Kevin Leyton-Brown', year: 2009, url: 'https://www.masfoundations.org/', type: 'book', level: 'intermediate', desc: 'Comprehensive text bridging AI and game theory. Free PDF. Covers distributed optimization, social choice, and computational aspects.' }
        ]
      },
      {
        title: 'Key Papers',
        resources: [
          { title: 'The Complexity of Computing a Nash Equilibrium', author: 'Daskalakis, Goldberg & Papadimitriou', year: 2009, url: 'https://dl.acm.org/doi/10.1145/1461928.1461951', type: 'paper', level: 'advanced', desc: 'Proved that computing Nash equilibria is PPAD-complete. Resolved a major open question about equilibrium computation.' },
          { title: 'How Bad is Selfish Routing?', author: 'Tim Roughgarden & Eva Tardos', year: 2002, url: 'https://dl.acm.org/doi/10.1145/502090.502098', type: 'paper', level: 'intermediate', desc: 'Introduced the price of anarchy framework. Shows selfish routing can be 4/3 worse than optimal in linear latency networks.' },
          { title: 'Algorithmic Mechanism Design', author: 'Noam Nisan & Amir Ronen', year: 2001, url: 'https://link.springer.com/article/10.1007/s004530010050', type: 'paper', level: 'advanced', desc: 'Foundational paper connecting mechanism design with computational complexity. Launched the field.' },
          { title: 'Truthful Auctions for Pricing Search Keywords', author: 'Aggarwal, Goel & Motwani', year: 2006, url: 'https://dl.acm.org/doi/10.1145/1134707.1134729', type: 'paper', level: 'intermediate', desc: 'Early analysis of sponsored search auctions (the business model of Google). Theory meets internet economics.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Algorithmic Game Theory (CS364A)', author: 'Tim Roughgarden (Stanford)', year: 2013, url: 'https://www.youtube.com/playlist?list=PLEGCF-WLh2RJBqmxvZ0_ie-mleCFhi2N4', type: 'course', level: 'intermediate', desc: '20 lectures. Mechanism design, sponsored search, VCG, price of anarchy, equilibrium computation. The gold standard.' },
          { title: 'Advanced Mechanism Design (CS364B)', author: 'Tim Roughgarden (Stanford)', year: 2014, url: 'https://www.youtube.com/playlist?list=PLEGCF-WLh2RI77PL4gwLld_OU9Zh3CT5f', type: 'course', level: 'advanced', desc: 'Sequel course. Multi-parameter mechanism design, combinatorial auctions, optimal mechanism design.' },
          { title: 'Algorithmic Game Theory (Cornell)', author: 'Eva Tardos', year: null, url: 'https://www.cs.cornell.edu/courses/cs6840/2017sp/', type: 'course', level: 'advanced', desc: 'Cornell graduate course on AGT. Lecture notes and readings from one of the field\'s founders.' }
        ]
      }
    ]
  },
  {
    id: 'behavioral',
    title: 'Behavioral Game Theory',
    icon: '\uD83E\uDDE0',
    intro: `<p><strong>Behavioral game theory</strong> studies how real humans actually play games — and how they systematically deviate from the predictions of classical theory. People are not perfectly rational. They have limited computation, biased beliefs, social preferences (fairness, reciprocity, spite), and emotions.</p>
<p>Key concepts include:</p>
<ul>
<li><strong>Bounded rationality</strong> — players use heuristics and limited lookahead rather than full backward induction</li>
<li><strong>Level-k thinking</strong> — a hierarchy of strategic sophistication: Level-0 plays randomly, Level-1 best-responds to Level-0, Level-2 best-responds to Level-1, etc.</li>
<li><strong>Quantal response equilibrium (QRE)</strong> — players choose better strategies more often, but make mistakes proportional to payoff differences</li>
<li><strong>Social preferences</strong> — people care about fairness (inequity aversion), reciprocity, and others' welfare, not just their own payoff</li>
<li><strong>Prospect theory</strong> — Kahneman and Tversky's model of decision-making under risk: loss aversion, probability weighting, reference dependence</li>
<li><strong>Ultimatum / dictator games</strong> — canonical experiments showing that people reject unfair offers even at a cost to themselves</li>
</ul>
<p>Behavioral game theory connects to behavioral economics, psychology, and the design of real institutions where humans (not rational agents) interact.</p>`,
    subsections: [
      {
        title: 'Core Texts',
        resources: [
          { title: 'Behavioral Game Theory: Experiments in Strategic Interaction', author: 'Colin Camerer', year: 2003, url: 'https://press.princeton.edu/books/hardcover/9780691090399/behavioral-game-theory', type: 'book', level: 'intermediate', desc: 'THE reference. Covers decades of experimental evidence on how people actually play games. Essential reading.' },
          { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', year: 2011, url: 'https://us.macmillan.com/books/9780374533557/thinkingfastandslow', type: 'book', level: 'beginner', desc: 'Nobel laureate Kahneman on dual-process theory, heuristics, biases, and prospect theory. Not game theory per se, but foundational for behavioral approaches.' },
          { title: 'Prospect Theory: An Analysis of Decision under Risk', author: 'Daniel Kahneman & Amos Tversky', year: 1979, url: 'https://www.jstor.org/stable/1914185', type: 'paper', level: 'intermediate', desc: 'The most cited paper in economics. Introduced prospect theory: loss aversion, probability weighting, reference dependence.' },
          { title: 'A Theory of Fairness, Competition, and Cooperation', author: 'Ernst Fehr & Klaus Schmidt', year: 1999, url: 'https://academic.oup.com/qje/article/114/3/817/1848113', type: 'paper', level: 'intermediate', desc: 'Influential model of inequity aversion. Explains experimental anomalies in ultimatum, public goods, and market games.' }
        ]
      },
      {
        title: 'Textbooks & Surveys',
        resources: [
          { title: 'The Handbook of Experimental Economics', author: 'John Kagel & Alvin Roth (eds.)', year: 1995, url: 'https://press.princeton.edu/books/hardcover/9780691042909/the-handbook-of-experimental-economics', type: 'book', level: 'advanced', desc: 'Comprehensive reference on experimental methods in economics. Bargaining, auctions, public goods, coordination games.' },
          { title: 'Strategy and Choice', author: 'Richard Zeckhauser (ed.)', year: 1991, url: 'https://mitpress.mit.edu/9780262740128/strategy-and-choice/', type: 'book', level: 'intermediate', desc: 'Collection bridging theory and behavioral evidence. Essays by Schelling, Raiffa, and others.' },
          { title: 'Predictably Irrational', author: 'Dan Ariely', year: 2008, url: 'https://www.harpercollins.com/products/predictably-irrational-dan-ariely', type: 'book', level: 'beginner', desc: 'Accessible and entertaining. Shows systematic irrationalities in decision-making through clever experiments.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Behavioral Economics (MIT 14.13)', author: 'MIT OpenCourseWare', year: null, url: 'https://ocw.mit.edu/courses/14-13-psychology-and-economics-spring-2020/', type: 'course', level: 'intermediate', desc: 'MIT course covering reference dependence, social preferences, time inconsistency, and behavioral policy.' },
          { title: 'Crash Course Economics: Game Theory', author: 'Crash Course', year: null, url: 'https://www.youtube.com/watch?v=PCcVODWm-oY', type: 'video', level: 'beginner', desc: 'Quick, entertaining overview of game theory concepts including Prisoner\'s Dilemma and Nash equilibrium.' }
        ]
      }
    ]
  },
  {
    id: 'networks',
    title: 'Network & Combinatorial Games',
    icon: '\u26B8',
    intro: `<p><strong>Network game theory</strong> studies strategic interaction on graphs and networks. When agents are embedded in a network — social, economic, or physical — the structure of connections shapes incentives, information flow, and equilibrium behavior.</p>
<p>Key areas include:</p>
<ul>
<li><strong>Network formation games</strong> — agents strategically choose which connections to form, trading off benefits (information, trade) against costs (maintenance, risk)</li>
<li><strong>Congestion games</strong> — agents share resources (roads, bandwidth), and congestion creates negative externalities. Always possess pure-strategy Nash equilibria (Rosenthal's theorem).</li>
<li><strong>Influence and diffusion</strong> — how innovations, behaviors, and information spread through networks. Threshold models, cascade dynamics.</li>
<li><strong>Graphical games</strong> — games where a player's payoff depends only on their neighbors' actions, enabling compact representation and efficient computation</li>
<li><strong>Combinatorial game theory</strong> — the mathematical theory of two-player perfect-information games (chess, Go, Nim). Sprague-Grundy theory assigns values to game positions.</li>
</ul>
<p>Network games are central to understanding the internet, social media, epidemics, financial contagion, and any system where local interactions produce global outcomes.</p>`,
    subsections: [
      {
        title: 'Textbooks',
        resources: [
          { title: 'Networks, Crowds, and Markets', author: 'David Easley & Jon Kleinberg', year: 2010, url: 'https://www.cs.cornell.edu/home/kleinber/networks-book/', type: 'book', level: 'beginner', desc: 'Brilliant undergraduate text connecting graph theory, game theory, and network economics. Free pre-print online.' },
          { title: 'Social and Economic Networks', author: 'Matthew O. Jackson', year: 2008, url: 'https://press.princeton.edu/books/hardcover/9780691134406/social-and-economic-networks', type: 'book', level: 'intermediate', desc: 'Comprehensive treatment of network formation, diffusion, learning, and strategic interaction on networks.' },
          { title: 'The Oxford Handbook of the Economics of Networks', author: 'Bramoulle, Galeotti & Rogers (eds.)', year: 2016, url: 'https://academic.oup.com/edited-volume/27994', type: 'book', level: 'advanced', desc: 'Authoritative survey of network economics. Chapters on games on networks, peer effects, network formation.' },
          { title: 'Lessons in Play: An Introduction to Combinatorial Game Theory', author: 'Albert, Nowakowski & Wolfe', year: 2007, url: 'https://www.routledge.com/Lessons-in-Play/Albert-Nowakowski-Wolfe/p/book/9781568812779', type: 'book', level: 'intermediate', desc: 'Accessible introduction to combinatorial game theory. Nim values, Sprague-Grundy theory, surreal numbers.' },
          { title: 'Winning Ways for your Mathematical Plays (4 vols)', author: 'Berlekamp, Conway & Guy', year: 1982, url: 'https://www.routledge.com/Winning-Ways-for-Your-Mathematical-Plays/Berlekamp-Conway-Guy/p/book/9781568811307', type: 'book', level: 'advanced', desc: 'The magnum opus of combinatorial game theory. Encyclopedic, playful, and deep. A mathematical classic.' }
        ]
      },
      {
        title: 'Key Papers',
        resources: [
          { title: 'Congestion Games with Player-Specific Payoff Functions', author: 'Igal Milchtaich', year: 1996, url: 'https://www.sciencedirect.com/science/article/pii/S0899825696900752', type: 'paper', level: 'advanced', desc: 'Extends Rosenthal\'s congestion game framework. Existence of equilibria in games with heterogeneous players on networks.' },
          { title: 'A Strategic Model of Social and Economic Networks', author: 'Matthew O. Jackson & Asher Wolinsky', year: 1996, url: 'https://www.sciencedirect.com/science/article/pii/S0022053196900985', type: 'paper', level: 'advanced', desc: 'Foundational model of strategic network formation. Pairwise stability and efficiency in network structures.' },
          { title: 'Maximizing the Spread of Influence through a Social Network', author: 'Kempe, Kleinberg & Tardos', year: 2003, url: 'https://dl.acm.org/doi/10.1145/956750.956769', type: 'paper', level: 'intermediate', desc: 'Foundational paper on influence maximization in networks. NP-hard but admits a greedy (1-1/e) approximation.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Social and Economic Networks (Coursera)', author: 'Matthew O. Jackson', year: null, url: 'https://www.coursera.org/learn/social-economic-networks', type: 'course', level: 'beginner', desc: 'Accessible course on network analysis, models, and strategic behavior on networks by the leading researcher.' },
          { title: 'Networks (Playlist)', author: 'Reducible', year: null, url: 'https://www.youtube.com/c/Reducible', type: 'video', level: 'beginner', desc: 'Beautifully animated explanations of graph algorithms and network concepts relevant to game theory on networks.' }
        ]
      }
    ]
  },
  {
    id: 'applications',
    title: 'Applications & AI',
    icon: '\uD83C\uDFAF',
    intro: `<p>Game theory is not just theory — it is the <em>operating system</em> of strategic interaction in the real world and in artificial intelligence.</p>
<p>Key application areas:</p>
<ul>
<li><strong>Multi-agent AI</strong> — Training AI agents that interact strategically: self-play (AlphaGo, OpenAI Five), multi-agent reinforcement learning, emergent communication</li>
<li><strong>Adversarial ML</strong> — GANs as two-player zero-sum games; adversarial robustness as a minimax problem</li>
<li><strong>MARL (Multi-Agent Reinforcement Learning)</strong> — Learning in games: convergence, stability, and the challenge of non-stationarity</li>
<li><strong>Explainable AI</strong> — The Shapley value provides the theoretical foundation for SHAP, the leading feature attribution method</li>
<li><strong>Market design</strong> — Real-world mechanism design: ad auctions, spectrum allocation, kidney exchange, school choice</li>
<li><strong>Political science</strong> — Voting theory, social choice, and the impossibility theorems (Arrow, Gibbard-Satterthwaite)</li>
<li><strong>Biology</strong> — Evolutionary dynamics, microbial games, ecological interactions</li>
</ul>`,
    subsections: [
      {
        title: 'Multi-Agent AI & Reinforcement Learning',
        resources: [
          { title: 'Multi-Agent Reinforcement Learning: Foundations and Modern Approaches', author: 'Albrecht, Christianos & Schafer', year: 2024, url: 'https://www.marl-book.com/', type: 'book', level: 'intermediate', desc: 'Comprehensive modern textbook on MARL. Free online. Covers cooperative, competitive, and mixed settings.' },
          { title: 'Mastering the Game of Go without Human Knowledge', author: 'Silver et al. (DeepMind)', year: 2017, url: 'https://www.nature.com/articles/nature24270', type: 'paper', level: 'intermediate', desc: 'AlphaGo Zero: learning superhuman Go entirely through self-play. Game theory meets deep reinforcement learning.' },
          { title: 'OpenAI Five', author: 'OpenAI', year: 2019, url: 'https://arxiv.org/abs/1912.06680', type: 'paper', level: 'intermediate', desc: 'Dota 2 at professional level through multi-agent self-play. Demonstrates emergent team coordination in complex games.' },
          { title: 'Emergent Complexity via Multi-Agent Competition', author: 'Bansal et al.', year: 2018, url: 'https://arxiv.org/abs/1710.03748', type: 'paper', level: 'intermediate', desc: 'Shows that competitive self-play in simple environments produces increasingly complex behaviors — an arms race dynamic.' },
          { title: 'A Unified Game-Theoretic Approach to Multiagent Reinforcement Learning', author: 'Lanctot et al. (DeepMind)', year: 2017, url: 'https://arxiv.org/abs/1711.00832', type: 'paper', level: 'advanced', desc: 'Connects MARL to game-theoretic solution concepts. Policy-Space Response Oracles (PSRO) framework.' }
        ]
      },
      {
        title: 'Explainable AI & Shapley Values',
        resources: [
          { title: 'A Unified Approach to Interpreting Model Predictions', author: 'Scott Lundberg & Su-In Lee', year: 2017, url: 'https://arxiv.org/abs/1705.07874', type: 'paper', level: 'intermediate', desc: 'Introduced SHAP (SHapley Additive exPlanations). Connects Shapley values from cooperative game theory to ML interpretability.' },
          { title: 'From Local Explanations to Global Understanding with Explainable AI for Trees', author: 'Lundberg et al.', year: 2020, url: 'https://www.nature.com/articles/s42256-019-0138-9', type: 'paper', level: 'intermediate', desc: 'TreeSHAP: efficient exact Shapley value computation for tree-based models. Made SHAP practical at scale.' },
          { title: 'SHAP Documentation', author: 'Scott Lundberg', year: null, url: 'https://shap.readthedocs.io/', type: 'code', level: 'beginner', desc: 'The SHAP Python library. Tutorials, API docs, and examples for computing Shapley-value-based feature attributions.' }
        ]
      },
      {
        title: 'Market Design & Social Choice',
        resources: [
          { title: 'Who Gets What — and Why', author: 'Alvin Roth', year: 2015, url: 'https://www.hmhbooks.com/shop/books/who-gets-what-and-why/9780544705289', type: 'book', level: 'beginner', desc: 'Nobel laureate on real-world market design: kidney exchange, school choice, labor markets. Accessible and compelling.' },
          { title: 'Social Choice and Individual Values', author: 'Kenneth Arrow', year: 1951, url: 'https://www.jstor.org/stable/j.ctt1nqb90', type: 'book', level: 'advanced', desc: 'Arrow\'s impossibility theorem: no voting system can satisfy all fairness axioms simultaneously. A pillar of social choice theory.' },
          { title: 'The Design of Everyday Markets', author: 'Stanford Online', year: null, url: 'https://online.stanford.edu/courses/soe-ycs0004-game-theory', type: 'course', level: 'beginner', desc: 'Stanford online course on market design principles applied to matching, auctions, and allocation problems.' }
        ]
      },
      {
        title: 'Biology & Evolution',
        resources: [
          { title: 'Evolutionary Game Theory and Multi-Agent Reinforcement Learning', author: 'Karl Tuyls & Ann Nowe', year: 2005, url: 'https://academic.oup.com/comjnl/article/48/2/156/371137', type: 'paper', level: 'intermediate', desc: 'Bridge paper connecting evolutionary game dynamics to multi-agent learning algorithms.' },
          { title: 'SuperCooperators: Altruism, Evolution, and Why We Need Each Other', author: 'Martin Nowak & Roger Highfield', year: 2011, url: 'https://www.simonandschuster.com/books/SuperCooperators/Martin-Nowak/9781451626636', type: 'book', level: 'beginner', desc: 'Popular science book on the five mechanisms for the evolution of cooperation. By the leading mathematical biologist.' }
        ]
      }
    ]
  },
  {
    id: 'software',
    title: 'Software & Tools',
    icon: '\u2318',
    intro: `<p>Libraries, platforms, and datasets for computing equilibria, running experiments, and simulating strategic interaction.</p>`,
    subsections: [
      {
        title: 'Equilibrium Computation',
        resources: [
          { title: 'Gambit: Software Tools for Game Theory', author: 'McKelvey, McLennan & Turocy', year: null, url: 'http://www.gambit-project.org/', type: 'code', level: 'intermediate', desc: 'The standard open-source library for building, analyzing, and computing equilibria in finite games. Python and C++.' },
          { title: 'Nashpy', author: 'Vincent Knight et al.', year: null, url: 'https://nashpy.readthedocs.io/', type: 'code', level: 'beginner', desc: 'Lightweight Python library for computing Nash equilibria of two-player games. Clean API, good documentation.' },
          { title: 'Lemke-Howson Algorithm Visualizer', author: 'Various', year: null, url: 'https://github.com/s3rvac/lemke-howson', type: 'code', level: 'intermediate', desc: 'Implementation and visualization of the Lemke-Howson algorithm for computing Nash equilibria via complementary pivoting.' }
        ]
      },
      {
        title: 'Multi-Agent Simulation',
        resources: [
          { title: 'OpenSpiel', author: 'DeepMind', year: null, url: 'https://github.com/google-deepmind/open_spiel', type: 'code', level: 'intermediate', desc: 'Collection of games, algorithms, and tools for game-theoretic research. CFR, MCTS, PSRO, and more. Python/C++.' },
          { title: 'PettingZoo', author: 'Farama Foundation', year: null, url: 'https://pettingzoo.farama.org/', type: 'code', level: 'intermediate', desc: 'Multi-agent reinforcement learning environments. Standard API for cooperative and competitive games.' },
          { title: 'RLlib Multi-Agent', author: 'Ray/Anyscale', year: null, url: 'https://docs.ray.io/en/latest/rllib/rllib-env.html#multi-agent-and-hierarchical', type: 'code', level: 'intermediate', desc: 'Scalable multi-agent RL within the Ray framework. Supports shared/independent policies, parameter sharing.' },
          { title: 'Axelrod Python Library', author: 'Axelrod-Python', year: null, url: 'https://axelrod.readthedocs.io/', type: 'code', level: 'beginner', desc: 'Framework for iterated Prisoner\'s Dilemma tournaments. 200+ strategies implemented. Reproduce and extend Axelrod\'s classic tournaments.' },
          { title: 'Mesa: Agent-Based Modeling in Python', author: 'Project Mesa', year: null, url: 'https://mesa.readthedocs.io/', type: 'code', level: 'beginner', desc: 'General-purpose agent-based modeling framework. Build simulations of strategic interaction in spatial and network environments.' }
        ]
      },
      {
        title: 'Learning Resources & Platforms',
        resources: [
          { title: 'Game Theory Explorer', author: 'Rahul Savani et al.', year: null, url: 'https://www.gametheoryexplorer.org/', type: 'code', level: 'beginner', desc: 'Web-based tool for creating and solving extensive form games. Visual game tree builder with equilibrium computation.' },
          { title: 'QuantEcon', author: 'Thomas Sargent & John Stachurski', year: null, url: 'https://quantecon.org/', type: 'code', level: 'intermediate', desc: 'Open-source code for quantitative economics. Game theory modules in Python and Julia. Lectures and notebooks.' },
          { title: 'SHAP', author: 'Scott Lundberg', year: null, url: 'https://github.com/shap/shap', type: 'code', level: 'beginner', desc: 'SHapley Additive exPlanations library. Computes Shapley values for ML model interpretability. The most-used XAI library.' }
        ]
      }
    ]
  }
];

// ---- Rendering ----

const TYPE_BADGES = {
  book:   { label: 'Book',     cls: 'badge-book' },
  notes:  { label: 'Notes',    cls: 'badge-notes' },
  video:  { label: 'Video',    cls: 'badge-video' },
  course: { label: 'Course',   cls: 'badge-course' },
  code:   { label: 'Code',     cls: 'badge-code' },
  paper:  { label: 'Paper',    cls: 'badge-paper' }
};

const LEVEL_BADGES = {
  beginner:     { label: 'Beginner',     cls: 'level-beginner' },
  intermediate: { label: 'Intermediate', cls: 'level-intermediate' },
  advanced:     { label: 'Advanced',     cls: 'level-advanced' }
};

let activeSection = 'overview';
let activeFilter = 'all';
let searchQuery = '';

function init() {
  renderTabs();
  renderContent();
  bindEvents();
  updateStats();
}

function renderTabs() {
  const bar = document.getElementById('tab-bar');
  bar.innerHTML = '';
  for (const s of SECTIONS) {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (s.id === activeSection ? ' active' : '');
    btn.dataset.id = s.id;
    btn.innerHTML = `<span class="tab-icon">${s.icon}</span><span class="tab-label">${s.title}</span>`;
    bar.appendChild(btn);
  }
}

function renderContent() {
  const main = document.getElementById('main-content');
  const section = SECTIONS.find(s => s.id === activeSection);
  if (!section) return;

  let html = `<div class="section-header"><h2><span class="section-icon">${section.icon}</span> ${section.title}</h2></div>`;
  html += `<div class="section-intro">${section.intro}</div>`;

  if (section.subsections.length) {
    html += `<div class="filter-bar">
      <button class="filter-btn${activeFilter === 'all' ? ' active' : ''}" data-filter="all">All</button>
      <button class="filter-btn${activeFilter === 'book' ? ' active' : ''}" data-filter="book">Books</button>
      <button class="filter-btn${activeFilter === 'video' ? ' active' : ''}" data-filter="video">Videos</button>
      <button class="filter-btn${activeFilter === 'course' ? ' active' : ''}" data-filter="course">Courses</button>
      <button class="filter-btn${activeFilter === 'notes' ? ' active' : ''}" data-filter="notes">Notes</button>
      <button class="filter-btn${activeFilter === 'paper' ? ' active' : ''}" data-filter="paper">Papers</button>
      <button class="filter-btn${activeFilter === 'code' ? ' active' : ''}" data-filter="code">Code</button>
    </div>`;

    for (const sub of section.subsections) {
      const filtered = filterResources(sub.resources);
      if (!filtered.length) continue;
      html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
      for (const r of filtered) {
        html += renderCard(r);
      }
      html += `</div></div>`;
    }
  }

  main.innerHTML = html;
  bindFilters();
}

function filterResources(resources) {
  return resources.filter(r => {
    if (activeFilter !== 'all' && r.type !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${r.title} ${r.author || ''} ${r.desc || ''}`.toLowerCase();
      return hay.includes(q);
    }
    return true;
  });
}

function renderCard(r) {
  const badge = TYPE_BADGES[r.type] || { label: r.type, cls: '' };
  const levelBadge = r.level && LEVEL_BADGES[r.level]
    ? `<span class="level-badge ${LEVEL_BADGES[r.level].cls}">${LEVEL_BADGES[r.level].label}</span>`
    : '';
  const author = r.author ? `<div class="card-author">${r.author}${r.year ? ` (${r.year})` : ''}</div>` : (r.year ? `<div class="card-author">${r.year}</div>` : '');

  return `<a class="card" href="${r.url}" target="_blank" rel="noopener">
    <div class="card-top">
      <span class="type-badge ${badge.cls}">${badge.label}</span>
      ${levelBadge}
    </div>
    <div class="card-title">${highlightMatch(r.title)}</div>
    ${author}
    <div class="card-desc">${highlightMatch(r.desc || '')}</div>
  </a>`;
}

function highlightMatch(text) {
  if (!searchQuery) return text;
  const re = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function updateStats() {
  let total = 0;
  for (const s of SECTIONS) {
    for (const sub of s.subsections) {
      total += sub.resources.length;
    }
  }
  const el = document.getElementById('stat-count');
  if (el) el.textContent = total;
}

function bindEvents() {
  // Tab clicks
  document.getElementById('tab-bar').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    activeSection = btn.dataset.id;
    activeFilter = 'all';
    renderTabs();
    renderContent();
    document.getElementById('main-content').scrollTop = 0;
  });

  // Search
  const search = document.getElementById('search-input');
  search.addEventListener('input', () => {
    searchQuery = search.value.trim();
    renderContent();
  });

  // Clear search
  document.getElementById('search-clear').addEventListener('click', () => {
    search.value = '';
    searchQuery = '';
    renderContent();
    search.focus();
  });
}

function bindFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      renderContent();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
