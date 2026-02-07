// Neural Geometry Reference — data + rendering

const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '\u25C8',
    intro: `<p><strong>Neural Geometry</strong> is the study of geometric, topological, and algebraic structures that arise in neural representations — both biological and artificial.</p>
<p>The brain doesn't store information as flat tables. Neural activity traces out <em>manifolds</em> in high-dimensional firing-rate space. Symmetries of the world are mirrored by <em>equivariances</em> in neural codes. The topology of cognitive maps — grid cells, head-direction rings, conceptual spaces — reveals deep structure that pure statistics would miss.</p>
<p>Meanwhile, modern deep learning has converged on the same insight: the most powerful architectures are those that <em>respect the geometry</em> of their domains. CNNs exploit translation symmetry. Graph networks exploit permutation symmetry. Transformers exploit set structure. The <strong>Geometric Deep Learning</strong> blueprint unifies all of these under one principle: <em>symmetry and invariance</em>.</p>
<h3>How to use this reference</h3>
<p>This guide is organized into six domains. Each section opens with a conceptual introduction explaining <em>what</em> the field studies, <em>why</em> it matters for neural geometry, and <em>how</em> it connects to the other domains. Resources are tagged by type — books, videos, code, notes — so you can filter for the format you prefer.</p>
<h3>Suggested learning path</h3>
<ol>
<li><strong>Start with Group Theory</strong> — understand symmetry as a mathematical object</li>
<li><strong>Move to Differential Geometry</strong> — learn about manifolds, the spaces where neural activity lives</li>
<li><strong>Explore Topology</strong> — understand shape beyond geometry (holes, connectivity, persistence)</li>
<li><strong>Study Geometric ML</strong> — see how these ideas design better neural networks</li>
<li><strong>Dive into Computational Neuroscience</strong> — connect the math to the biology</li>
<li><strong>Information Geometry</strong> — the advanced bridge between statistics, geometry, and neural coding</li>
</ol>
<h3>Source</h3>
<p>Resources curated from the <a href="https://github.com/neurreps/reading-list" target="_blank">Awesome Neural Geometry</a> reading list, collaboratively maintained by the <a href="https://communityinviter.com/apps/neurreps/join" target="_blank">Symmetry and Geometry in Neural Representations</a> community.</p>`,
    subsections: []
  },
  {
    id: 'algebra',
    title: 'Abstract Algebra & Group Theory',
    icon: '\u2295',
    intro: `<p><strong>Group theory</strong> is the mathematics of symmetry. A <em>group</em> is a set of transformations — rotations, reflections, translations — that can be composed and inverted. This simple definition underlies an enormous amount of structure in both physics and neuroscience.</p>
<p>In the brain, neural representations are often <em>equivariant</em> to symmetry groups: when the stimulus transforms, the neural response transforms in a predictable, structured way. Head-direction cells encode orientation equivariantly with respect to rotations. Grid cells form representations equivariant to translations. Place cells break these symmetries selectively.</p>
<p>In deep learning, group theory tells us exactly which network architectures will respect which symmetries. A CNN is equivariant to translations because convolution commutes with shifts — this is a direct consequence of group theory. <strong>Representation theory</strong> (how groups act on vector spaces) is the key tool for designing equivariant layers.</p>
<p><strong>Tensors</strong> generalize vectors and matrices as objects that transform in specific ways under group actions. Understanding tensors is essential for both general relativity and modern geometric deep learning.</p>`,
    subsections: [
      {
        title: 'Textbooks & Notes',
        resources: [
          { title: 'Group Theory: A Primer', author: 'Luciano da Fontoura Costa', year: 2019, url: 'https://www.researchgate.net/profile/Luciano-Da-F-Costa/publication/334126746_Group_Theory_A_Primer_CDT-11/links/5da83b2f299bf1c1e4c8ffb4/Group-Theory-A-Primer-CDT-11.pdf', type: 'book', level: 'beginner', desc: 'Concise introduction covering the core definitions and theorems of group theory without heavy prerequisites.' },
          { title: 'Tensors in Computations', author: 'Lek-Heng Lim', year: 2021, url: 'https://arxiv.org/pdf/2106.08090.pdf', type: 'notes', level: 'intermediate', desc: 'Comprehensive treatment of tensors from the computational perspective — decompositions, ranks, and applications.' },
          { title: 'Aspects of Harmonic Analysis and Representation Theory', author: 'Gallier & Quaintance', year: 2021, url: 'https://drive.google.com/file/d/1eK8B1UpTJTnCXV6DL4-blDaKo6XQk28r/view?usp=sharing', type: 'book', level: 'advanced', desc: 'Deep treatment of harmonic analysis on groups, connecting Fourier analysis to representation theory.' },
          { title: 'Basic Concepts of Representation Theory', author: 'Amritanshu Prasad', year: 2013, url: 'https://cel.archives-ouvertes.fr/cel-00963677/document', type: 'notes', level: 'intermediate', desc: 'Accessible lecture notes on how groups act on vector spaces — the mathematical backbone of equivariant networks.' },
          { title: 'Representation Theory of Finite Groups', author: 'Benjamin Steinberg', year: 2012, url: 'https://drive.google.com/file/d/1fe1qnVAkCHEY1hn9sOvcA6Ocww66fMmP/view?usp=sharing', type: 'book', level: 'intermediate', desc: 'Thorough textbook on finite group representations with applications to combinatorics and algebra.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Essence of Group Theory', author: 'Mathemaniac', year: null, url: 'https://youtube.com/playlist?list=PLDcSwjT2BF_VuNbn8HiHZKKy59SgnIAeO', type: 'video', level: 'beginner', desc: 'Visual, intuition-first introduction to groups, subgroups, cosets, and quotient groups.' },
          { title: 'Abstract Algebra', author: 'Socratica', year: null, url: 'https://youtube.com/playlist?list=PLi01XoE8jYoi3SgnnGorR_XOW3IcK-TP6', type: 'video', level: 'beginner', desc: 'Short, clear videos covering groups, rings, and fields from scratch.' },
          { title: "Euler's Formula with Introductory Group Theory", author: '3Blue1Brown', year: null, url: 'https://www.youtube.com/watch?v=mvmuCPvRoWQ', type: 'video', level: 'beginner', desc: 'Beautiful visual exploration connecting complex exponentials to group structure.' },
          { title: 'What is a Tensor?', author: 'XylyXylyX', year: null, url: 'https://youtube.com/playlist?list=PLRlVmXqzHjUQARA37r4Qw3SHPqVXgqO6c', type: 'video', level: 'intermediate', desc: 'Detailed series building tensor understanding from first principles.' },
          { title: 'Representation Theory', author: 'Math Doctor Bob', year: null, url: 'https://youtube.com/playlist?list=PL57457844458A5A1F', type: 'video', level: 'intermediate', desc: 'University-level lectures on representation theory of finite groups and Lie algebras.' },
          { title: 'Category Theory for AI', author: 'cats.for.ai', year: 2022, url: 'https://cats.for.ai/', type: 'course', level: 'advanced', desc: 'Online course connecting category theory — the "mathematics of mathematics" — to AI and machine learning.' }
        ]
      }
    ]
  },
  {
    id: 'diffgeo',
    title: 'Differential Geometry & Lie Groups',
    icon: '\u2202',
    intro: `<p><strong>Differential geometry</strong> studies smooth curved spaces called <em>manifolds</em>. A manifold is a space that locally looks like flat Euclidean space but can be globally curved — think of the surface of a sphere, or the configuration space of a robot arm.</p>
<p>This is arguably the most important mathematical framework for neural geometry. Neural population activity doesn't fill the high-dimensional space of all possible firing rates — it traces out <em>low-dimensional manifolds</em>. The geometry of these manifolds (their curvature, metric, geodesics) encodes the structure of the computation the circuit performs.</p>
<p><strong>Lie groups</strong> are groups that are also smooth manifolds — continuous symmetries like rotations (SO(3)), translations, or scaling. The Lie algebra captures the infinitesimal structure of these symmetries. In neuroscience, head-direction cells live on SO(2), grid cells tessellate a torus (a Lie group quotient), and motor cortex activity traces manifolds shaped by the body's biomechanics.</p>
<p><strong>Riemannian geometry</strong> equips manifolds with a metric — a way to measure distances, angles, and volumes. This lets us do statistics, optimization, and machine learning on curved spaces using tools like <em>geodesics</em> (shortest paths), <em>parallel transport</em> (moving vectors along curves), and the <em>exponential map</em> (mapping tangent space to the manifold).</p>`,
    subsections: [
      {
        title: 'Textbooks & Notes',
        resources: [
          { title: 'Lie Groups, Lie Algebras, and Representations', author: 'Brian C. Hall', year: 2003, url: 'https://link.springer.com/book/10.1007/978-3-319-13467-3', type: 'book', level: 'intermediate', desc: 'Standard graduate text. Matrix Lie groups approach makes it concrete and accessible.' },
          { title: 'Differential Geometry and Lie Groups: A Computational Perspective', author: 'Gallier & Quaintance', year: 2020, url: 'https://link.springer.com/book/10.1007/978-3-030-46040-2', type: 'book', level: 'intermediate', desc: 'Computationally-oriented treatment ideal for ML practitioners.' },
          { title: 'Intro to Riemannian Geometry and Geometric Statistics with Geomstats', author: 'Guigui, Miolane & Pennec', year: 2022, url: 'https://hal.inria.fr/hal-03766900/', type: 'notes', level: 'intermediate', desc: 'Theory-to-code bridge: Riemannian geometry concepts with working Python implementations.' },
          { title: 'Geometry, Topology and Physics', author: 'Nakahara', year: 2003, url: 'https://www.amazon.com/Geometry-Topology-Physics-Graduate-Student/dp/0750306068', type: 'book', level: 'advanced', desc: 'Classic reference covering manifolds, fiber bundles, characteristic classes. Dense but comprehensive.' },
          { title: 'Differential Forms and Connections', author: 'Darling', year: 2012, url: 'https://www.cambridge.org/core/books/differential-forms-and-connections/767FC792F030D351AF5E65D0434248F5', type: 'book', level: 'intermediate', desc: 'Gentle introduction to differential forms, the modern language of calculus on manifolds.' },
          { title: 'Connections, Curvature, and Characteristic Classes', author: 'Loring W. Tu', year: 2017, url: 'https://link.springer.com/book/10.1007/978-3-319-55084-8', type: 'book', level: 'advanced', desc: 'Sequel to Tu\'s "Introduction to Manifolds." Vector bundles, connections, Chern-Weil theory.' },
          { title: 'Riemannian Manifolds: An Introduction to Curvature', author: 'John M. Lee', year: 2000, url: 'https://link.springer.com/book/10.1007/b98852', type: 'book', level: 'intermediate', desc: 'Exceptionally clear introduction to Riemannian geometry. Gold standard for self-study.' },
          { title: 'A Comprehensive Introduction to Differential Geometry', author: 'Michael Spivak', year: 1999, url: 'https://dl.icdst.org/pdfs/files3/e9091aa2ddcfcbf04faeb46c68d7dc49.pdf', type: 'book', level: 'advanced', desc: 'Five-volume masterwork. Exhaustive and rigorous. Reference rather than first read.' },
          { title: 'Riemannian Geometry', author: 'Mikhail Postnikov', year: 2001, url: 'https://link.springer.com/book/10.1007/978-3-662-04433-9', type: 'book', level: 'advanced', desc: 'Russian school approach to Riemannian geometry. Elegant, compact proofs.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Geometry and Topology', author: 'Sean Carroll', year: null, url: 'https://youtu.be/kp1k90zNVLc', type: 'video', level: 'beginner', desc: 'Physicist\'s intuitive overview of manifolds, metrics, and curvature.' },
          { title: 'Symmetry', author: 'Sean Carroll', year: null, url: 'https://youtu.be/yCxacFBLHIY', type: 'video', level: 'beginner', desc: 'Accessible lecture on symmetry in physics — groups, Noether\'s theorem, gauge symmetry.' },
          { title: 'Differential Geometry for Computer Science', author: 'Justin Solomon', year: null, url: 'https://youtube.com/playlist?list=PLQ3UicqQtfNvPmZftPyQ-qK1wdXBxj86W', type: 'course', level: 'intermediate', desc: 'MIT-style course connecting differential geometry to graphics, vision, and ML.' },
          { title: 'Discrete Differential Geometry', author: 'CMU', year: null, url: 'https://www.youtube.com/playlist?list=PL9_jI1bdZmz0hIrNCMQW1YmZysAiIYSSS', type: 'course', level: 'intermediate', desc: 'CMU course on computational differential geometry — meshes, curvature, Laplacians.' },
          { title: 'What is a Manifold?', author: 'XylyXylyX', year: null, url: 'https://youtube.com/playlist?list=PLRlVmXqzHjUQHEx63ZFxV-0Ortgf-rpJo', type: 'video', level: 'beginner', desc: 'Patient, thorough series building manifold intuition from topological spaces.' },
          { title: 'Manifolds', author: 'Robert Davie', year: null, url: 'https://youtube.com/playlist?list=PLeFwDGOexoe8cjplxwQFMvGLSxbOTUyLv', type: 'video', level: 'intermediate', desc: 'Focused playlist on smooth manifolds, tangent spaces, and differential maps.' },
          { title: 'Lie Groups and Lie Algebras', author: 'XylyXylyX', year: null, url: 'https://youtube.com/playlist?list=PLRlVmXqzHjURZO0fviJuyikvKlGS6rXrb', type: 'video', level: 'intermediate', desc: 'Deep dive into Lie theory from the manifold perspective.' },
          { title: 'Geometric Anatomy of Theoretical Physics', author: 'Frederic Schuller', year: null, url: 'https://youtube.com/playlist?list=PLPH7f_7ZlzxTi6kS4vCmv4ZKm9u8g5yic', type: 'course', level: 'advanced', desc: 'Legendary lecture series covering topology, manifolds, bundles, connections with extraordinary clarity.' },
          { title: 'Weekend with Bernie (Riemann)', author: 'Soren Hauberg (DTU)', year: null, url: 'http://www2.compute.dtu.dk/~sohau/weekendwithbernie/', type: 'course', level: 'intermediate', desc: 'Crash-course in Riemannian geometry for ML researchers. Hands-on with code.' },
          { title: 'Geometric Methods in Robot Learning', author: 'IROS 2022 Tutorial', year: 2022, url: 'https://youtube.com/playlist?list=PL_oEZ6dld4ignAdbFvcP_LAJgNbdrNBKC', type: 'video', level: 'intermediate', desc: 'Riemannian optimization and control for robotics applications.' },
          { title: 'Riemannian Geometry and ML for Non-Euclidean Data', author: 'Park & Jang', year: 2019, url: 'https://aisociety.kr/KJMLW2019/slides/fcp.pdf', type: 'notes', level: 'intermediate', desc: 'Slide deck bridging Riemannian geometry concepts to practical ML on non-Euclidean data.' }
        ]
      },
      {
        title: 'Notebooks & Blogposts',
        resources: [
          { title: 'Geomstats Jupyter Notebooks', author: 'Geomstats Team', year: null, url: 'https://github.com/geomstats/geomstats/tree/master/notebooks', type: 'code', level: 'intermediate', desc: 'Hands-on notebooks implementing Riemannian operations, geodesics, and statistics on manifolds.' },
          { title: 'Differential Geometry for Machine Learning', author: 'Roger Grosse', year: null, url: 'https://metacademy.org/roadmaps/rgrosse/dgml', type: 'notes', level: 'intermediate', desc: 'Structured learning roadmap connecting differential geometry concepts to ML applications.' },
          { title: 'Manifolds: A Gentle Introduction', author: 'Brian Keng', year: null, url: 'https://bjlkeng.github.io/posts/manifolds/', type: 'notes', level: 'beginner', desc: 'Blog post building manifold intuition with clear examples and minimal prerequisites.' },
          { title: 'Differential Geometry of ML', author: 'Kyuhyeon Choi', year: null, url: 'https://research.fal.ai/blog/differential-geometry-of-ml/', type: 'notes', level: 'intermediate', desc: 'Modern blog post connecting curvature, geodesics, and parallel transport to loss landscapes.' },
          { title: 'A Mathematical Framework of Intelligence and Consciousness Based on Riemannian Geometry', author: 'Meng Lu', year: 2024, url: 'https://arxiv.org/abs/2407.11024', type: 'notes', level: 'advanced', desc: 'Speculative but fascinating paper framing intelligence and consciousness through Riemannian geometry.' }
        ]
      }
    ]
  },
  {
    id: 'infogeo',
    title: 'Information Geometry',
    icon: '\u2111',
    intro: `<p><strong>Information geometry</strong> applies differential geometry to the space of probability distributions. Every parametric family of distributions (Gaussians, exponentials, etc.) forms a <em>statistical manifold</em> — a smooth space where each point is a distribution and the geometry is determined by how distinguishable nearby distributions are.</p>
<p>The <strong>Fisher information matrix</strong> serves as the natural Riemannian metric on this manifold. It measures the local curvature of the log-likelihood: high Fisher information means the data is very informative about the parameters, and nearby distributions are easy to tell apart.</p>
<p>In neuroscience, information geometry connects directly to <strong>neural coding efficiency</strong>. The Fisher information of a neural population's response determines the precision of stimulus estimation. The Cramer-Rao bound — a core result of information geometry — sets a fundamental limit on how well any decoder can extract stimulus information from neural activity.</p>
<p>In machine learning, the <strong>natural gradient</strong> (the gradient with respect to the Fisher metric rather than the Euclidean metric) gives the steepest descent direction in distribution space, leading to faster, more invariant optimization.</p>`,
    subsections: [
      {
        title: 'Primers',
        resources: [
          { title: 'The Many Faces of Information Geometry', author: 'Frank Nielsen', year: 2022, url: 'https://www.ams.org/journals/notices/202201/rnoti-p36.pdf', type: 'notes', level: 'intermediate', desc: 'AMS Notices survey covering dualistic geometry, divergences, and connections to statistics and ML.' },
          { title: 'Parametric Information Geometry with Geomstats', author: 'Alice Le Brigant et al.', year: 2022, url: 'https://arxiv.org/abs/2211.11643', type: 'notes', level: 'intermediate', desc: 'Hands-on paper implementing information geometric computations with the Geomstats library.' }
        ]
      }
    ]
  },
  {
    id: 'topology',
    title: 'Topology',
    icon: '\u2203',
    intro: `<p><strong>Topology</strong> studies properties that are preserved under continuous deformation — stretching, bending, but not tearing or gluing. Where geometry cares about distances and angles, topology cares about <em>connectivity</em>, <em>holes</em>, and <em>boundaries</em>.</p>
<p>A coffee cup and a donut are topologically equivalent (both have one hole). A sphere and a torus are not. This kind of qualitative, structural reasoning turns out to be powerful for understanding neural data.</p>
<p><strong>Topological Data Analysis (TDA)</strong> extracts topological features from point clouds and networks. The key tool is <em>persistent homology</em>: by growing balls around data points and tracking when topological features (connected components, loops, voids) appear and disappear, we get a "barcode" or "persistence diagram" that summarizes the multi-scale shape of the data.</p>
<p>In neuroscience, TDA has revealed that:</p>
<ul>
<li>Grid cell population activity has the topology of a <strong>torus</strong></li>
<li>Head-direction cells form a <strong>ring</strong> (circle) in neural state space</li>
<li>Place cell representations have non-trivial <strong>higher-order topology</strong></li>
</ul>
<p><strong>Topological deep learning</strong> extends graph neural networks to higher-order domains — simplicial complexes, cell complexes, hypergraphs — where relationships involve more than pairwise connections.</p>`,
    subsections: [
      {
        title: 'Textbooks & Notes',
        resources: [
          { title: 'Elementary Applied Topology', author: 'Robert Ghrist', year: null, url: 'https://www2.math.upenn.edu/~ghrist/notes.html', type: 'book', level: 'intermediate', desc: 'Beautiful, illustrated textbook covering homology, cohomology, and applications. Free online.' },
          { title: 'A Survey of Topological Machine Learning Methods', author: 'Hensel, Moor & Rieck', year: 2021, url: 'https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2021.681108/full', type: 'notes', level: 'intermediate', desc: 'Comprehensive survey mapping the landscape of TDA methods applied to machine learning.' },
          { title: 'Topological Deep Learning: Graphs, Complexes, Sheaves', author: 'Cristian Bodnar', year: 2022, url: 'https://www.repository.cam.ac.uk/items/06b0b8e5-57d1-4120-8fad-643ce4d40eda', type: 'book', level: 'advanced', desc: 'PhD thesis extending message-passing beyond graphs to simplicial and cell complexes.' },
          { title: 'Topological Deep Learning: Going Beyond Graph Data', author: 'Mustafa Hajij et al.', year: 2023, url: 'https://arxiv.org/abs/2206.00606', type: 'notes', level: 'intermediate', desc: 'Foundational paper defining the topological deep learning framework and its building blocks.' },
          { title: 'Architectures of Topological Deep Learning', author: 'Mathilde Papillon et al.', year: 2023, url: 'https://arxiv.org/abs/2304.10031', type: 'notes', level: 'intermediate', desc: 'Survey of message-passing topological neural networks — taxonomy and comparison of architectures.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Computational Algebraic Topology', author: 'Vidit Nanda', year: null, url: 'https://youtube.com/playlist?list=PLnLAqsCN_2ke8_EUd_KoJsLkPO0BKrrc6', type: 'course', level: 'intermediate', desc: 'Oxford lectures on computational homology, persistent homology, and discrete Morse theory.' },
          { title: 'Foundations of Topological Data Analysis', author: 'Robert Ghrist & Vidit Nanda', year: null, url: 'https://www.youtube.com/playlist?list=PL8erL0pXF3JaR4no7ivppQ5zwhq2QnzzQ', type: 'course', level: 'intermediate', desc: 'Foundational course on TDA from two leading researchers in applied topology.' },
          { title: 'Topological Data Analysis for Machine Learning', author: 'Bastian Rieck', year: null, url: 'https://www.youtube.com/playlist?list=PLjFHG9gPsecYteKmbVbPhjiz2jHRtKT20', type: 'course', level: 'intermediate', desc: 'Practical course on using TDA features in ML pipelines — persistence images, landscapes, kernels.' }
        ]
      }
    ]
  },
  {
    id: 'geoml',
    title: 'Geometric Machine Learning',
    icon: '\u25B3',
    intro: `<p><strong>Geometric deep learning</strong> is the unifying framework that derives neural network architectures from first principles of symmetry and geometry. The core insight: if your data has structure (symmetries, topology, domain geometry), your network should respect that structure.</p>
<p>The <strong>Geometric Deep Learning Blueprint</strong> (Bronstein et al., 2021) shows that CNNs, GNNs, Transformers, DeepSets, and more are all instances of a single template: <em>equivariant message passing on geometric domains</em>. The domain (grid, graph, manifold, set) determines the symmetry group; the group determines the architecture.</p>
<p>Key concepts:</p>
<ul>
<li><strong>Invariance</strong>: the output doesn't change when the input is transformed (e.g., image classification is rotation-invariant)</li>
<li><strong>Equivariance</strong>: the output transforms predictably when the input transforms (e.g., object detection is translation-equivariant)</li>
<li><strong>Gauge equivariance</strong>: equivariance on manifolds where there's no canonical coordinate frame</li>
</ul>
<p><strong>E(3)-equivariant networks</strong> respect 3D rotations and translations — essential for molecular dynamics, protein structure, and point clouds. <strong>Steerable CNNs</strong> generalize standard convolutions to arbitrary symmetry groups. <strong>Equivariant MLPs</strong> construct equivariant layers for any matrix group.</p>
<p>Optimization on manifolds (Riemannian optimization) is another pillar: when your parameters live on a manifold (rotation matrices, positive definite matrices, Stiefel manifolds), standard gradient descent is wrong — you need geodesic steps.</p>`,
    subsections: [
      {
        title: 'Textbooks & Surveys',
        resources: [
          { title: 'Geometric Deep Learning: Grids, Groups, Graphs, Geodesics, and Gauges', author: 'Bronstein, Bruna, Cohen & Velickovic', year: 2021, url: 'https://arxiv.org/abs/2104.13478', type: 'book', level: 'intermediate', desc: 'THE foundational text. Unifies CNNs, GNNs, Transformers under symmetry principles. Essential reading.' },
          { title: 'Group Invariance Applications in Statistics', author: 'Morris Eaton', year: 1989, url: 'https://www.jstor.org/stable/4153172', type: 'book', level: 'advanced', desc: 'Classic text on how group invariance structures statistical problems. Historical foundation.' },
          { title: 'Group Theoretical Methods in Machine Learning', author: 'Risi Kondor (PhD Thesis)', year: 2008, url: 'http://www.cs.columbia.edu/~jebara/papers/thesisKondor.pdf', type: 'book', level: 'advanced', desc: 'Pioneering thesis applying group theory to kernels, features, and learning on non-Euclidean domains.' },
          { title: 'Pattern Theory: The Stochastic Analysis of Real-World Signals', author: 'Mumford & Desolneux', year: 2010, url: 'https://www.routledge.com/Pattern-Theory-The-Stochastic-Analysis-of-Real-World-Signals/Mumford-Desolneux/p/book/9781568815794', type: 'book', level: 'advanced', desc: 'Grenander\'s pattern theory: understanding signals through their symmetry and deformation groups.' },
          { title: 'Equivariant Convolutional Networks', author: 'Taco Cohen (PhD Thesis)', year: 2021, url: 'https://pure.uva.nl/ws/files/60770359/Thesis.pdf', type: 'book', level: 'advanced', desc: 'Definitive treatment of group-equivariant CNNs, steerable filters, and gauge equivariance.' },
          { title: 'An Introduction to Optimization on Smooth Manifolds', author: 'Nicolas Boumal', year: 2022, url: 'https://sma.epfl.ch/~nboumal/book/IntroOptimManifolds_Boumal_2022.pdf', type: 'book', level: 'intermediate', desc: 'Modern, accessible textbook on Riemannian optimization. Free PDF. Excellent for ML researchers.' },
          { title: 'Beyond Euclid: An Illustrated Guide to Modern ML with Geometric Structures', author: 'Mathilde Papillon et al.', year: 2025, url: 'https://arxiv.org/abs/2407.09468', type: 'notes', level: 'intermediate', desc: 'Beautifully illustrated guide connecting geometric, topological, and algebraic structures to modern ML.' },
          { title: 'Symmetry in Neural Network Parameter Spaces', author: 'Zhao, Walters & Yu', year: 2025, url: 'https://arxiv.org/abs/2506.13018', type: 'notes', level: 'advanced', desc: 'Studies symmetries in weight space itself — permutation symmetries, mode connectivity, loss landscape geometry.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Geometric Deep Learning (2nd Edition)', author: 'Bronstein, Bruna, Cohen & Velickovic', year: null, url: 'https://www.youtube.com/watch?v=5c_-KX1sRDQ&list=PLn2-dEmQeTfSLXW8yXP4q_Ii58wFdxb3C', type: 'course', level: 'intermediate', desc: 'AMMI course by the authors of the GDL blueprint. The definitive video lecture series.' },
          { title: 'Machine Learning Methods in 3D and Geometric Deep Learning', author: 'Animesh Garg (U of T)', year: 2021, url: 'https://youtube.com/playlist?list=PLki3HkfgNEsLrbI_r2iqNogmL5DW6HJXF', type: 'course', level: 'intermediate', desc: 'Graduate course covering point clouds, meshes, implicit surfaces, and equivariant architectures.' },
          { title: 'An Introduction to Group-Equivariant Deep Learning', author: 'Erik Bekkers (UvA)', year: 2022, url: 'https://www.youtube.com/playlist?list=PL8FnQMH2k7jzPrxqdYufoiYVHim8PyZWd', type: 'course', level: 'intermediate', desc: 'Focused course on building equivariant networks from scratch. Excellent pedagogy.' },
          { title: 'Italian Summer School on Geometric Deep Learning', author: 'Bodnar, Bronstein, Di Giovanni, de Haan, Weiler', year: 2022, url: 'https://www.youtube.com/playlist?list=PLn2-dEmQeTfRQXLKf9Fmlk3HmReGg3YZZ', type: 'course', level: 'intermediate', desc: 'Intensive summer school covering the full spectrum of geometric deep learning.' },
          { title: 'Geometry and Generative Models', author: 'Joey Bose & Prakash Panangaden (MILA)', year: 2022, url: 'https://joeybose.github.io/Blog/GenCourse', type: 'course', level: 'advanced', desc: 'MILA course on geometric structure in generative models — flows on manifolds, Riemannian diffusion.' }
        ]
      },
      {
        title: 'Notebooks & Blogposts',
        resources: [
          { title: 'Geometric Foundations of Deep Learning', author: 'Bronstein, Bruna, Cohen & Velickovic', year: null, url: 'https://towardsdatascience.com/geometric-foundations-of-deep-learning-94cdd45b451d', type: 'notes', level: 'beginner', desc: 'Accessible blog post summarizing the GDL blueprint for a general ML audience.' },
          { title: 'What Does 2022 Hold for Geometric & Graph ML?', author: 'Michael Bronstein', year: 2022, url: 'https://towardsdatascience.com/predictions-and-hopes-for-geometric-graph-ml-in-2022-aa3b8b79f5cc', type: 'notes', level: 'beginner', desc: 'Survey of open problems and future directions in geometric and graph ML.' },
          { title: 'Geometric ML for Shape Analysis (Jupyter Notebooks)', author: 'Nina Miolane', year: null, url: 'https://github.com/bioshape-lab/ece594n/tree/main/lectures', type: 'code', level: 'intermediate', desc: 'Course notebooks implementing shape analysis with Geomstats — geodesics, Frechet means, shape spaces.' }
        ]
      }
    ]
  },
  {
    id: 'neuro',
    title: 'Computational Neuroscience',
    icon: '\u2B21',
    intro: `<p><strong>Computational neuroscience</strong> builds mathematical and computational models of neural systems — from single ion channels to whole-brain dynamics. It asks: how does the brain compute? How do networks of neurons represent, transform, and store information?</p>
<p>Key frameworks include:</p>
<ul>
<li><strong>Dynamical systems theory</strong>: Neural circuits are dynamical systems. Fixed points, limit cycles, attractors, and bifurcations explain how circuits implement memory, oscillations, and decisions. The geometry of the phase portrait — the shapes traced by the system's trajectories — directly encodes computational function.</li>
<li><strong>Neural coding</strong>: How do spike trains and firing rates represent stimuli? Rate codes, temporal codes, population codes, and predictive codes each suggest different geometric structures in neural state space.</li>
<li><strong>Network models</strong>: From Hopfield networks to modern RNNs, the architecture and connectivity of neural networks determine the manifold structure of their representations.</li>
<li><strong>Neural oscillations</strong>: Rhythmic activity (theta, gamma, alpha, beta) organizes computation in time. The geometry of coupled oscillators connects to topology (the circle group) and synchronization theory.</li>
</ul>
<p>The bridge to geometry: when we record from large neural populations, the activity patterns form low-dimensional manifolds whose geometric and topological properties reveal the structure of the brain's internal models.</p>`,
    subsections: [
      {
        title: 'Textbooks',
        resources: [
          { title: 'Introduction to the Theory of Neural Computation', author: 'Hertz, Krogh & Palmer', year: 1991, url: 'https://drive.google.com/file/d/1jjAHNSZld1tjH0wiqXc9wCv3Y6h5sjok/view?usp=sharing', type: 'book', level: 'intermediate', desc: 'Classic text on neural network theory — Hopfield nets, Boltzmann machines, perceptrons, statistical mechanics.' },
          { title: 'Theoretical Neuroscience', author: 'Peter Dayan & L.F. Abbott', year: 2001, url: 'http://www.gatsby.ucl.ac.uk/~lmate/biblio/dayanabbott.pdf', type: 'book', level: 'intermediate', desc: 'THE standard textbook. Neural coding, network models, adaptation, plasticity. Essential.' },
          { title: 'Dynamical Systems in Neuroscience', author: 'Eugene M. Izhikevich', year: 2006, url: 'https://drive.google.com/file/d/1CXQCPl6MN8XSmoyo6J0TbdlWhBmaib62/view?usp=sharing', type: 'book', level: 'intermediate', desc: 'Bifurcation theory meets neuroscience. Shows how the geometry of phase portraits explains neuronal excitability.' },
          { title: 'Neuronal Dynamics', author: 'Gerstner, Kistler, Naud & Paninsky', year: 2014, url: 'https://neuronaldynamics.epfl.ch/', type: 'book', level: 'intermediate', desc: 'Free online textbook. Single neurons to networks to cognition. Interactive Python exercises.' },
          { title: 'Principles of Neural Design', author: 'Peter Sterling & Simon Laughlin', year: 2015, url: 'https://drive.google.com/file/d/1cskdlUJBjAY5wH7GeZa2IxT9iSXZ_3_0/view?usp=sharing', type: 'book', level: 'intermediate', desc: 'Why brains are designed the way they are. Information theory meets neuroanatomy.' }
        ]
      },
      {
        title: 'General Audience Books',
        resources: [
          { title: 'Rhythms of the Brain', author: 'Gyorgy Buzsaki', year: 2006, url: 'https://drive.google.com/file/d/1DtGEb54qJNS2wkny1FXM4b_dfT-b140y/view?usp=sharing', type: 'book', level: 'beginner', desc: 'Masterful overview of neural oscillations, hippocampal rhythms, and the temporal organization of the brain.' },
          { title: 'Networks of the Brain', author: 'Olaf Sporns', year: 2010, url: 'https://drive.google.com/file/d/1MsGNsFVF7AxPtnyv1WnH-YnZMGvhUkHb/view?usp=sharing', type: 'book', level: 'beginner', desc: 'Graph theory and network science applied to brain connectivity. Connectomics, small-world networks, hubs.' },
          { title: 'Models of the Mind', author: 'Grace Lindsay', year: 2021, url: 'https://www.goodreads.com/en/book/show/50884536-models-of-the-mind', type: 'book', level: 'beginner', desc: 'Engaging popular science book on how physics, engineering, and mathematics have shaped neuroscience.' }
        ]
      },
      {
        title: 'Courses & Tutorials',
        resources: [
          { title: 'Neural Computation VS265', author: 'Bruno Olshausen (UC Berkeley)', year: null, url: 'https://redwood.berkeley.edu/courses/vs265/', type: 'course', level: 'intermediate', desc: 'Berkeley course on neural computation — efficient coding, sparse representations, neural dynamics.' },
          { title: 'Generative Models for Neural Data Analysis', author: 'COSYNE Workshops 2023', year: 2023, url: 'https://github.com/davindicode/cosyne-2023-generative-models', type: 'code', level: 'advanced', desc: 'Tutorial on using generative models (VAEs, flows, diffusion) to analyze neural population recordings.' }
        ]
      }
    ]
  },
  {
    id: 'data',
    title: 'Datasets & Software',
    icon: '\u2616',
    intro: `<p>The tools and data that make neural geometry research possible. Open datasets provide the neural recordings, brain imaging, and behavioral data. Software libraries implement the geometric, topological, and algebraic computations.</p>`,
    subsections: [
      {
        title: 'Neuroscience Datasets',
        resources: [
          { title: 'OpenNeuro', author: null, year: null, url: 'https://openneuro.org/', type: 'data', level: null, desc: 'Free platform for sharing neuroimaging data — fMRI, EEG, MEG, iEEG, PET.' },
          { title: 'NeuroVault', author: null, year: null, url: 'https://neurovault.org/', type: 'data', level: null, desc: 'Repository for unthresholded statistical brain maps — meta-analysis and visualization.' },
          { title: 'CRCNS', author: null, year: null, url: 'https://crcns.org/data-sets', type: 'data', level: null, desc: 'Collaborative Research in Computational Neuroscience — electrophysiology, calcium imaging, behavior.' },
          { title: 'NeuroData Without Borders', author: null, year: null, url: 'https://www.nwb.org/example-datasets/', type: 'data', level: null, desc: 'Standardized format for neurophysiology data. Example datasets for getting started.' },
          { title: 'Allen Brain Atlas', author: null, year: null, url: 'https://portal.brain-map.org/', type: 'data', level: null, desc: 'Comprehensive gene expression, connectivity, and cell type atlases for mouse and human brain.' },
          { title: 'Kavli Grid Cell Database', author: null, year: null, url: 'https://www.ntnu.edu/kavli/research/grid-cell-data', type: 'data', level: null, desc: 'Grid cell, head-direction cell, and spatial cell recordings from the Moser lab.' },
          { title: 'The Natural Scenes Dataset', author: null, year: null, url: 'http://naturalscenesdataset.org/', type: 'data', level: null, desc: 'Massive fMRI dataset: 8 subjects viewing 10,000 natural images. Gold standard for visual neuroscience.' }
        ]
      },
      {
        title: 'Software Libraries',
        resources: [
          { title: 'Geomstats', author: null, year: null, url: 'https://geomstats.github.io/', type: 'code', level: null, desc: 'Computation, statistics, and machine learning on Riemannian manifolds. Python/NumPy/PyTorch.' },
          { title: 'E3NN', author: null, year: null, url: 'https://github.com/e3nn/e3nn', type: 'code', level: null, desc: 'E(3)-equivariant neural networks. Spherical harmonics, tensor products, steerable features.' },
          { title: 'Giotto-TDA', author: null, year: null, url: 'https://giotto-ai.github.io/gtda-docs/0.5.1/library.html', type: 'code', level: null, desc: 'Topological Data Analysis for Python — persistent homology, Vietoris-Rips, persistence diagrams.' },
          { title: 'equivariant-MLP', author: null, year: null, url: 'https://github.com/mfinzi/equivariant-MLP', type: 'code', level: null, desc: 'Construct equivariant multilayer perceptrons for arbitrary matrix groups automatically.' },
          { title: 'SHTOOLS', author: null, year: null, url: 'https://github.com/SHTOOLS/SHTOOLS', type: 'code', level: null, desc: 'Spherical harmonic transforms, spectral analysis, and Slepian functions.' },
          { title: 'LieConv', author: null, year: null, url: 'https://github.com/mfinzi/LieConv', type: 'code', level: null, desc: 'Convolutional networks equivariant to arbitrary Lie groups on continuous data.' },
          { title: 'LieTorch', author: null, year: null, url: 'https://gitlab.com/bsmetsjr/lietorch', type: 'code', level: null, desc: 'Geometric machine learning and Lie analysis tools for PyTorch.' },
          { title: 'pyRiemann', author: null, year: null, url: 'https://github.com/pyRiemann/pyRiemann', type: 'code', level: null, desc: 'ML through Riemannian geometry of symmetric positive definite matrices. BCI applications.' },
          { title: 'Pymanopt', author: null, year: null, url: 'https://pymanopt.org/', type: 'code', level: null, desc: 'Optimization on manifolds — Stiefel, Grassmann, SPD, sphere. Automatic differentiation.' },
          { title: 'Geoopt', author: null, year: null, url: 'https://geoopt.readthedocs.io/en/latest/', type: 'code', level: null, desc: 'Riemannian adaptive optimization for PyTorch — Riemannian SGD, Adam on manifolds.' },
          { title: 'TopoX', author: null, year: null, url: 'https://pyt-team.github.io/', type: 'code', level: null, desc: 'Topological deep learning suite — simplicial, cell, and combinatorial complexes.' },
          { title: 'TopoBench', author: null, year: null, url: 'https://github.com/geometric-intelligence/TopoBench', type: 'code', level: null, desc: 'Benchmarking framework for topological deep learning methods.' },
          { title: 'Open Neuroscience', author: null, year: null, url: 'https://open-neuroscience.com/', type: 'code', level: null, desc: 'Database of open-source neuroscience tools, hardware, and software.' }
        ]
      }
    ]
  },
  {
    id: 'conferences',
    title: 'Conferences & Workshops',
    icon: '\u2691',
    intro: `<p>Where the neural geometry community meets. These workshops bring together researchers from geometry, topology, algebra, machine learning, and neuroscience.</p>`,
    subsections: [
      {
        title: 'Workshops',
        resources: [
          { title: 'NeurIPS: Symmetry and Geometry in Neural Representations', author: null, year: 2023, url: 'https://neurreps.org', type: 'notes', level: null, desc: 'The flagship workshop for the neural geometry community. Talks, posters, and discussions.' },
          { title: 'ICML: Topology, Algebra and Geometry in ML', author: null, year: 2023, url: 'https://www.tagds.com/events/conference-workshops/tag-ml23', type: 'notes', level: null, desc: 'TAG-ML workshop connecting algebraic, geometric, and topological methods to machine learning.' },
          { title: 'RSS: Symmetries in Robot Learning', author: null, year: 2023, url: 'https://sites.google.com/view/rss23-sym', type: 'notes', level: null, desc: 'Equivariance and symmetry priors for robotics — manipulation, locomotion, planning.' },
          { title: 'NeurIPS: Symmetry and Geometry in Neural Representations', author: null, year: 2022, url: 'https://www.neurreps.org/past-workshops', type: 'notes', level: null, desc: 'First edition of the NeURReps workshop. Foundational talks and community formation.' },
          { title: 'ICML: Topology, Algebra and Geometry in ML', author: null, year: 2022, url: 'https://www.tagds.com/events/conference-workshops/tag-ml22', type: 'notes', level: null, desc: 'Second TAG-ML workshop with expanded scope into topological deep learning.' },
          { title: 'ICLR: Geometrical and Topological Representation Learning', author: null, year: 2022, url: 'https://gt-rl.github.io/', type: 'notes', level: null, desc: 'Workshop on geometric and topological inductive biases in representation learning.' },
          { title: 'Bernstein: Symmetry, Invariance and Neural Representations', author: null, year: 2022, url: 'https://bernstein-network.de/bernstein-conference/program/satellite-workshops/symmetry-invariance-and-neural-representations/', type: 'notes', level: null, desc: 'Satellite workshop at the Bernstein Conference on Computational Neuroscience.' }
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
  data:   { label: 'Dataset',  cls: 'badge-data' }
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
      <button class="filter-btn${activeFilter === 'code' ? ' active' : ''}" data-filter="code">Code</button>
      <button class="filter-btn${activeFilter === 'data' ? ' active' : ''}" data-filter="data">Data</button>
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
