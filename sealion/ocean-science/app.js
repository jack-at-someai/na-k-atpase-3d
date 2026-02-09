// Ocean Science Reference — data + rendering
// Sea Lion research division: scuba diving, swarm intelligence, marine observation & preservation

const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '\u{1F30A}',
    intro: `<p><strong>Ocean Science</strong> is Sea Lion's core research domain — everything we do to pursue scuba diving research and advance our understanding of the underwater world. This hub maps the intersection of <strong>modern science</strong>, <strong>diving technology</strong>, <strong>swarm intelligence</strong>, and <strong>marine preservation</strong>.</p>
<p>The ocean covers 71% of the planet's surface. We have better maps of Mars than we do of the seafloor. Less than 20% of the ocean has been observed at all. The instruments for changing this are converging right now: <strong>bio-inspired autonomous underwater vehicles</strong> that move in coordinated swarms, <strong>AI systems</strong> that can classify species and assess reef health from imagery in real time, <strong>environmental DNA</strong> that can census an ecosystem from a water sample, and <strong>next-generation dive technology</strong> that extends human reach deeper, longer, and safer than ever before.</p>
<p>This is not abstract. This is operational. Sea Lion exists at the waterline — a rescue diver building a dive shop, surrounded by the technology to turn every dive into a data collection event and every diver into a citizen scientist.</p>
<h3>Why swarm intelligence matters here</h3>
<p>The ocean is too vast for single-point observation. A lone ROV or a single diver covers a pinhole. But a <em>swarm</em> — dozens or hundreds of small, cheap, bio-inspired underwater robots coordinating through acoustic signals and local rules — can blanket a reef, patrol a marine protected area, or map a seamount in parallel. The algorithms come from nature: fish schools, krill aggregations, dolphin pods. The engineering comes from biomimicry. The data feeds into systems like Charlotte. This is the pipeline.</p>
<h3>The biomimicry research lab connection</h3>
<p>Many of the technologies catalogued here — soft robotic fish, manta ray gliders, jellyfish propulsion systems, cephalopod-inspired camouflage — require a dedicated <strong>biomimicry research lab</strong> to prototype, test, and iterate. That lab is a future build. This reference hub is the prerequisite: mapping the knowledge space so that when the lab stands up, the research directions are already charted.</p>
<h3>How to use this reference</h3>
<ol>
<li><strong>Dive Physiology & Decompression Science</strong> — the hard science of what happens to the human body underwater</li>
<li><strong>Next-Generation Dive Technology</strong> — rebreathers, HUDs, biosensors, underwater comms, and where the gear is going</li>
<li><strong>Underwater Swarm Robotics</strong> — multi-agent coordination, bio-inspired AUVs, decentralized ocean monitoring</li>
<li><strong>Ocean Biomimicry</strong> — the organisms that solved underwater engineering millions of years ago</li>
<li><strong>Marine Observation & Monitoring</strong> — sensor networks, acoustic ecology, eDNA, satellite integration</li>
<li><strong>Coral Reef Science & Restoration</strong> — bleaching, restoration, photogrammetry, citizen science, MPA design</li>
<li><strong>Underwater Computer Vision & AI</strong> — species ID, coral classification, underwater SLAM, deep learning on ocean data</li>
<li><strong>Freediving Science</strong> — the physiology and performance science of breath-hold diving</li>
<li><strong>Datasets & Software</strong> — open data, code libraries, and tools for ocean research</li>
<li><strong>Organizations & Expeditions</strong> — who is doing this work and where to plug in</li>
</ol>`,
    subsections: []
  },

  // ============================================================
  // SECTION 2: DIVE PHYSIOLOGY & DECOMPRESSION SCIENCE
  // ============================================================
  {
    id: 'dive-physiology',
    title: 'Dive Physiology & Decompression Science',
    icon: '\u{1F9EC}',
    intro: `<p><strong>Dive physiology</strong> is the study of how the human body responds to the underwater environment — increased ambient pressure, breathing compressed gases, thermal stress, and the mechanical effects of depth on air-filled spaces. Every modern advance in dive safety traces back to this science.</p>
<p><strong>Decompression theory</strong> is the crown jewel. When a diver breathes compressed gas at depth, inert gases (nitrogen, helium) dissolve into tissues according to Henry's Law. Ascend too fast and those gases come out of solution as bubbles — decompression sickness (DCS), "the bends." The entire history of decompression modeling is an attempt to predict and prevent this.</p>
<p>The field has evolved through three generations:</p>
<ul>
<li><strong>Haldanean models</strong> (1908–1980s): Tissues as parallel compartments with exponential gas loading. Haldane's original tables, US Navy tables, DSAT tables. Simple, conservative, effective — but they model dissolved gas only and ignore bubble formation entirely.</li>
<li><strong>Bubble models</strong> (1980s–2010s): VPM (Varying Permeability Model) and RGBM (Reduced Gradient Bubble Model) account for micronuclei and bubble mechanics. They predict deeper stops and different ascent profiles. The debate between "deep stops" and "shallow stops" dominated technical diving for decades.</li>
<li><strong>Probabilistic models</strong> (2010s–present): Instead of binary safe/unsafe thresholds, these models estimate DCS probability as a continuous function. The Navy's NMRI probabilistic models and Duke's D-PBPK model represent this frontier. Machine learning is entering the space, training on Doppler bubble grade data from thousands of dives.</li>
</ul>
<p>Modern advances include <strong>real-time Doppler ultrasound</strong> for venous gas emboli detection, <strong>transcutaneous oximetry</strong> for tissue perfusion monitoring, <strong>wearable biosensors</strong> that track heart rate variability and peripheral vasoconstriction during dives, and <strong>computational fluid dynamics</strong> models of bubble growth in realistic tissue geometries. The goal is moving from population-level tables to <strong>personalized decompression</strong> — adaptive algorithms that account for your hydration, fitness, thermal state, and dive history in real time.</p>`,
    subsections: [
      {
        title: 'Foundational Texts',
        resources: [
          { title: 'The Physiology and Medicine of Diving', author: 'Bennett & Elliott', year: 2003, url: 'https://www.amazon.com/Bennett-Elliotts-Physiology-Medicine-Diving/dp/0702025712', type: 'book', level: 'advanced', desc: 'THE definitive reference on dive medicine. Covers every system affected by pressure. The bible of hyperbaric physiology.' },
          { title: 'Decompression Theory', author: 'Bruce Wienke', year: 2003, url: 'https://www.amazon.com/Science-Diving-Decompression-Theory-Technical/dp/1930536682', type: 'book', level: 'advanced', desc: 'Comprehensive treatment of dissolved gas models, bubble models, VPM, and RGBM by the creator of RGBM.' },
          { title: 'Deeper Into Diving', author: 'John Lippmann & Simon Mitchell', year: 2005, url: 'https://www.amazon.com/Deeper-Into-Diving-John-Lippmann/dp/0975590103', type: 'book', level: 'intermediate', desc: 'Accessible yet rigorous coverage of dive physiology, decompression, gas toxicity, and medical fitness to dive.' },
          { title: 'Diving and Subaquatic Medicine', author: 'Edmonds, Lowry, Pennefather & Walker', year: 2015, url: 'https://www.amazon.com/Diving-Subaquatic-Medicine-Fifth-Edmonds/dp/1482260123', type: 'book', level: 'advanced', desc: 'Clinical reference for dive medicine practitioners. Barotrauma, gas toxicity, marine envenomation, decompression illness.' },
          { title: 'Deco for Divers', author: 'Mark Powell', year: 2019, url: 'https://www.amazon.com/Deco-Divers-Decompression-Theory-Physiology/dp/1905492294', type: 'book', level: 'intermediate', desc: 'Best bridge between theory and practice. Explains Buhlmann, VPM, RGBM in plain language with worked examples. Essential for tech divers.' }
        ]
      },
      {
        title: 'Key Research Papers',
        resources: [
          { title: 'Decompression Theory — A Dynamic Critical-Volume Hypothesis', author: 'D.E. Yount', year: 1979, url: 'https://apps.dtic.mil/sti/citations/ADA192642', type: 'notes', level: 'advanced', desc: 'Foundational paper for the Varying Permeability Model (VPM). Introduces the concept of micronuclei and critical crushing pressure.' },
          { title: 'ZH-L16 Algorithm for Decompression Calculation', author: 'Albert Buhlmann', year: 1984, url: 'https://www.amazon.com/Decompression-Sickness-Albert-Buhlmann/dp/3540152792', type: 'book', level: 'advanced', desc: 'Buhlmann\'s 16-compartment dissolved gas model. The algorithm running in most modern dive computers today.' },
          { title: 'Patent Foramen Ovale and Decompression Sickness in Sport Divers', author: 'Wilmshurst et al.', year: 2001, url: 'https://pubmed.ncbi.nlm.nih.gov/11157917/', type: 'notes', level: 'intermediate', desc: 'Landmark study linking PFO (a cardiac shunt present in ~25% of people) to elevated DCS risk. Changed pre-dive screening protocols.' },
          { title: 'Validation of a Probabilistic Decompression Model', author: 'Howle, Weber et al. (Duke)', year: 2017, url: 'https://pubmed.ncbi.nlm.nih.gov/28915577/', type: 'notes', level: 'advanced', desc: 'Duke\'s probabilistic biophysical model validated against 3,000+ dives. Represents the state of the art in DCS prediction.' },
          { title: 'Deep Stops vs. Shallow Stops: The NEDU Study', author: 'Doolette & Mitchell', year: 2013, url: 'https://pubmed.ncbi.nlm.nih.gov/24279045/', type: 'notes', level: 'intermediate', desc: 'US Navy Experimental Diving Unit study that challenged the deep stops hypothesis. One of the most important and controversial studies in modern decompression science.' },
          { title: 'Venous Gas Emboli as a Predictive Tool for Decompression Sickness', author: 'Papadopoulou et al.', year: 2013, url: 'https://pubmed.ncbi.nlm.nih.gov/24279049/', type: 'notes', level: 'intermediate', desc: 'Meta-analysis of Doppler bubble detection as a proxy for DCS risk. Foundational for real-time bubble monitoring.' },
          { title: 'Thermal Status and Decompression Sickness: Review of the Evidence', author: 'Gerth et al.', year: 2007, url: 'https://pubmed.ncbi.nlm.nih.gov/18019094/', type: 'notes', level: 'intermediate', desc: 'How body temperature modulates inert gas uptake and elimination. Warm at depth loads gas faster; cold on ascent slows off-gassing.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'DAN Dive Medicine Course', author: 'Divers Alert Network', year: null, url: 'https://www.diversalertnetwork.org/training/', type: 'course', level: 'intermediate', desc: 'DAN\'s official dive medicine education programs. Covers oxygen first aid, neurological assessment, and dive emergency management.' },
          { title: 'Decompression Physiology and the Pathophysiology of DCS', author: 'Simon Mitchell', year: 2019, url: 'https://www.youtube.com/watch?v=LMFmKJIT5bM', type: 'video', level: 'intermediate', desc: 'One of the world\'s leading dive medicine researchers explains modern decompression theory. Excellent overview of where the science actually stands.' },
          { title: 'GUE Fundamentals — The Physics and Physiology of Diving', author: 'Global Underwater Explorers', year: null, url: 'https://www.gue.com/fundamentals', type: 'course', level: 'beginner', desc: 'GUE\'s Fundamentals course — the gold standard in foundational dive training. Covers physics, physiology, and team protocols.' },
          { title: 'Doppler Bubble Detection and Decompression Research', author: 'Azimuth Foundation', year: 2020, url: 'https://www.youtube.com/watch?v=4KWiKo_WHBY', type: 'video', level: 'intermediate', desc: 'How researchers use Doppler ultrasound to detect venous gas emboli post-dive and what the data tells us about decompression stress.' }
        ]
      },
      {
        title: 'Emerging Frontiers',
        resources: [
          { title: 'Machine Learning for Personalized Decompression', author: 'Fai Willmon & Buzzacott', year: 2023, url: 'https://pubmed.ncbi.nlm.nih.gov/37199257/', type: 'notes', level: 'advanced', desc: 'Review of ML approaches to decompression modeling — training on dive computer logs and bubble grade data to predict individual DCS risk.' },
          { title: 'Wearable Biosensors for Dive Physiology Monitoring', author: 'Cialoni et al.', year: 2021, url: 'https://pubmed.ncbi.nlm.nih.gov/34439736/', type: 'notes', level: 'intermediate', desc: 'State of the art in wearable sensors for divers: heart rate variability, skin temperature, SpO2, and their correlation with decompression stress.' },
          { title: 'The Future of Decompression: From Tables to Real-Time Adaptation', author: 'Neal Pollock (DAN)', year: 2022, url: 'https://dan.org/health-medicine/health-resources/', type: 'notes', level: 'intermediate', desc: 'DAN researcher\'s vision for next-generation adaptive decompression algorithms that incorporate real-time physiological telemetry.' },
          { title: 'Hyperbaric Oxygen Therapy: Molecular Mechanisms and Clinical Applications', author: 'Thom', year: 2011, url: 'https://pubmed.ncbi.nlm.nih.gov/21418232/', type: 'notes', level: 'advanced', desc: 'How hyperbaric oxygen works at the molecular level — stem cell mobilization, anti-inflammatory cascades, angiogenesis. The science behind the recompression chamber.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 3: NEXT-GENERATION DIVE TECHNOLOGY
  // ============================================================
  {
    id: 'dive-tech',
    title: 'Next-Generation Dive Technology',
    icon: '\u{1F9BF}',
    intro: `<p>Scuba diving technology is undergoing its most significant transformation since Cousteau and Gagnan invented the Aqua-Lung in 1943. The convergence of <strong>microelectronics</strong>, <strong>material science</strong>, <strong>AI</strong>, and <strong>communications engineering</strong> is reshaping every piece of equipment a diver carries.</p>
<p>Key technological vectors:</p>
<ul>
<li><strong>Closed-Circuit Rebreathers (CCR)</strong> — recycle exhaled gas, scrub CO2, inject O2 to maintain setpoint. Result: 4-6x gas efficiency, no bubbles (critical for marine life research), dramatically extended bottom times, and optimal decompression gas at every depth. Modern eCCRs like the AP Inspiration, rEvo, and Shearwater NERD integrate real-time PO2 monitoring across triple redundant galvanic O2 sensors, automatic setpoint switching, and bailout valve integration. The next frontier is solid-state optical O2 sensors (no more consumable galvanic cells) and AI-assisted CO2 scrubber life prediction.</li>
<li><strong>Dive Computers</strong> — evolved from lookup tables to multi-gas, multi-algorithm, air-integrated units. Shearwater, Garmin, and Ratio computers now run Buhlmann ZH-L16C with gradient factors AND VPM-B simultaneously, displaying tissue loading in real time. Coming next: integration with wearable biosensors for physiologically-adaptive decompression.</li>
<li><strong>Heads-Up Displays</strong> — AR information overlays projected into the dive mask. Depth, time, gas, compass heading, buddy location, and eventually species identification overlays. Companies like Scubapro and Form are prototyping swim/dive AR goggles.</li>
<li><strong>Underwater Communications</strong> — acoustic and ultrasonic through-water voice comms (Ocean Reef, Casio). Optical Li-Fi communication for high-bandwidth underwater data links. Mesh networking among dive teams for coordination and safety.</li>
<li><strong>Materials & Thermal</strong> — heated undersuits with lithium battery packs. Graphene-enhanced drysuits. Titanium rebreather components. The thermal barrier is what limits cold-water dive duration more than gas supply — solving it opens the polar oceans.</li>
</ul>
<p>The thesis: when a diver carries a rebreather with AI-assisted gas management, wears biosensors feeding a personalized decompression algorithm, sees AR data overlays in their mask, and communicates with their team and surface support in real time — that diver is no longer just a recreational visitor. They are a <strong>mobile ocean observation platform</strong>.</p>`,
    subsections: [
      {
        title: 'Rebreather Technology',
        resources: [
          { title: 'Rebreather Diving: A Complete Guide', author: 'Jeff Bozanic', year: 2010, url: 'https://www.amazon.com/Mastering-Rebreathers-Jeffrey-Bozanic/dp/0941332896', type: 'book', level: 'intermediate', desc: 'Comprehensive guide to CCR theory and practice. Gas physics, scrubber chemistry, failure modes, bailout planning.' },
          { title: 'An Introduction to Closed-Circuit Rebreathers', author: 'NOAA Diving Program', year: 2023, url: 'https://www.omao.noaa.gov/learn/diving-program', type: 'notes', level: 'beginner', desc: 'NOAA\'s official overview of rebreather use in scientific diving operations. How and why federal research programs adopted CCR.' },
          { title: 'Solid-State Luminescence Quenching O2 Sensors for Rebreathers', author: 'Analytical Sensor Technologies', year: 2022, url: 'https://pubmed.ncbi.nlm.nih.gov/35303152/', type: 'notes', level: 'advanced', desc: 'The replacement for galvanic oxygen sensors. Optical quenching sensors with no consumable components, faster response, and wider operating range.' },
          { title: 'CO2 Scrubber Duration Prediction with Machine Learning', author: 'Deng et al.', year: 2022, url: 'https://pubmed.ncbi.nlm.nih.gov/35303152/', type: 'notes', level: 'advanced', desc: 'Predicting remaining scrubber life from temperature profile data using ML models. Addresses the most dangerous failure mode in rebreather diving.' }
        ]
      },
      {
        title: 'Dive Computers & Algorithms',
        resources: [
          { title: 'Shearwater Research — Perdix 2 / Peregrine / NERD 2', author: 'Shearwater Research', year: null, url: 'https://www.shearwater.com/', type: 'code', level: null, desc: 'Industry-leading dive computers. Multi-gas Buhlmann with gradient factors and VPM-B. The standard for technical diving.' },
          { title: 'Ratio Dive Computers — iX3M 2', author: 'Ratio Computers', year: null, url: 'https://www.intl.ratiocomputers.com/', type: 'code', level: null, desc: 'Italian-made computers running Buhlmann ZH-L16C with configurable GFs. Notable for AI integration roadmap.' },
          { title: 'Subsurface — Open Source Dive Log', author: 'Linus Torvalds & Dirk Hohndel', year: null, url: 'https://subsurface-divelog.org/', type: 'code', level: null, desc: 'Open-source dive log software started by Linus Torvalds. Downloads data from 70+ dive computers. Tissue loading visualization, dive planning, gas consumption tracking.' },
          { title: 'Gradient Factors in Decompression Modeling', author: 'Erik Baker', year: 1998, url: 'https://www.shearwater.com/wp-content/uploads/2012/08/Gradient-Factors.pdf', type: 'notes', level: 'intermediate', desc: 'The paper that introduced gradient factors — the parameters (GF Low / GF High) that every modern tech diver configures. Bridges Buhlmann and bubble models.' }
        ]
      },
      {
        title: 'Underwater Communications & HUDs',
        resources: [
          { title: 'Ocean Reef — Underwater Communication Systems', author: 'Ocean Reef Group', year: null, url: 'https://www.oceanreefgroup.com/', type: 'code', level: null, desc: 'Full-face mask integrated voice communications. GSM, buddy-to-buddy, and surface-to-diver systems. Standard for commercial and scientific diving.' },
          { title: 'Underwater Optical Wireless Communication: A Comprehensive Survey', author: 'Zeng et al.', year: 2017, url: 'https://ieeexplore.ieee.org/document/7593257', type: 'notes', level: 'advanced', desc: 'Complete survey of underwater Li-Fi — visible light communication for high-bandwidth underwater links. Could enable real-time video streaming from divers.' },
          { title: 'Acoustic Communication for Underwater Vehicles', author: 'Akyildiz et al.', year: 2005, url: 'https://www.sciencedirect.com/science/article/pii/S1570870505000168', type: 'notes', level: 'advanced', desc: 'Foundational paper on underwater acoustic networking. Propagation challenges, modulation schemes, MAC protocols for the underwater channel.' },
          { title: 'AR-Enhanced Dive Mask Prototyping', author: 'Form Swim / Scubapro', year: 2024, url: 'https://www.formswim.com/', type: 'notes', level: 'beginner', desc: 'Form\'s AR swim goggles represent the leading edge of heads-up display technology moving toward dive applications. Real-time metrics overlaid on the visual field.' }
        ]
      },
      {
        title: 'Thermal & Material Science',
        resources: [
          { title: 'Thermoregulation in Diving: A Review', author: 'Pendergast & Lundgren', year: 2009, url: 'https://pubmed.ncbi.nlm.nih.gov/19487918/', type: 'notes', level: 'intermediate', desc: 'How cold water strips heat 25x faster than air. Vasoconstriction, shivering thermogenesis, and the interaction between thermal stress and decompression.' },
          { title: 'Heated Undersuit Systems for Extended Cold-Water Diving', author: 'Santi Diving / Fourth Element', year: null, url: 'https://www.intl.santidiving.com/', type: 'notes', level: 'beginner', desc: 'Lithium-powered heated base layers that extend cold-water dive time from hours to effectively unlimited thermal endurance. The technology that opens polar diving.' },
          { title: 'Graphene-Enhanced Neoprene for Next-Gen Wetsuits', author: 'Materials Science Forum', year: 2021, url: 'https://pubmed.ncbi.nlm.nih.gov/33880885/', type: 'notes', level: 'intermediate', desc: 'Graphene nanocomposite neoprene with improved thermal insulation, flexibility, and durability. The material science behind the next generation of exposure suits.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 4: UNDERWATER SWARM ROBOTICS
  // ============================================================
  {
    id: 'swarm-robotics',
    title: 'Underwater Swarm Robotics',
    icon: '\u{1F41F}',
    intro: `<p>The ocean is too large for single-agent observation. A single ROV, a single diver, a single research vessel — each covers a vanishingly small fraction of the space. <strong>Swarm robotics</strong> is the answer: many small, cheap, autonomous underwater vehicles (AUVs) operating collectively through <strong>local interaction rules</strong> rather than centralized control.</p>
<p>The principles come directly from biology. A school of fish has no leader — each fish follows simple rules: match your neighbors' heading, maintain minimum distance, steer toward the group center. From these local rules, global coordination emerges: the school moves as one, responds to threats collectively, and explores efficiently. This is <strong>swarm intelligence</strong>.</p>
<p>Key concepts for underwater swarms:</p>
<ul>
<li><strong>Decentralized coordination</strong> — no single point of failure. If one unit dies, the swarm adapts. Critical for ocean deployments where retrieval is expensive and loss is expected.</li>
<li><strong>Acoustic communication</strong> — radio waves die in water. Underwater swarms communicate via acoustic modems (slow, ~1-10 kbps) or optical links (fast but short-range). This bandwidth constraint forces elegantly simple coordination protocols.</li>
<li><strong>Stigmergy</strong> — indirect communication through the environment. A robot that detects a chemical plume or acoustic signature leaves a virtual "trail" (logged coordinates + readings) that others follow. Borrowed from ant foraging.</li>
<li><strong>Bio-inspired locomotion</strong> — propeller-driven AUVs are loud and energy-inefficient. Fish-inspired undulatory swimming, manta ray gliding, and jellyfish pulsation are quieter, more efficient, and less disruptive to marine life.</li>
<li><strong>Heterogeneous swarms</strong> — not all units need to be identical. Surface vehicles handle GPS and long-range comms. Mid-water AUVs patrol the water column. Benthic crawlers work the seafloor. Aerial drones provide top-down coordination. Different morphologies for different ecological niches — just like a real ecosystem.</li>
</ul>
<p>Applications for Sea Lion: <strong>reef health surveys</strong> (swarm blankets a reef, each unit photographs a section, AI stitches the mosaic), <strong>marine protected area patrol</strong> (persistent presence deters illegal fishing), <strong>environmental monitoring</strong> (water quality, temperature, pH, dissolved oxygen sampled across a 3D volume simultaneously), <strong>search and rescue</strong> (swarm searches a grid pattern in parallel), and <strong>underwater archaeology</strong> (coordinated photogrammetry of wreck sites).</p>`,
    subsections: [
      {
        title: 'Foundational Swarm Intelligence',
        resources: [
          { title: 'Swarm Intelligence: From Natural to Artificial Systems', author: 'Bonabeau, Dorigo & Theraulaz', year: 1999, url: 'https://www.amazon.com/Swarm-Intelligence-Artificial-Institute-Complexity/dp/0195131592', type: 'book', level: 'intermediate', desc: 'THE foundational text on swarm intelligence. Ant colony optimization, particle swarm, stigmergy, self-organization. Required reading.' },
          { title: 'Collective Intelligence in Multi-Agent Robotics', author: 'Sahin & Winfield', year: 2008, url: 'https://link.springer.com/chapter/10.1007/978-3-540-74089-6_3', type: 'notes', level: 'intermediate', desc: 'How swarm intelligence principles translate to physical robot teams. Design patterns for decentralized multi-robot systems.' },
          { title: 'Reynolds Flocking: Boids Algorithm', author: 'Craig Reynolds', year: 1987, url: 'https://www.red3d.com/cwr/boids/', type: 'notes', level: 'beginner', desc: 'The original boids paper and interactive demos. Three simple rules (separation, alignment, cohesion) produce emergent flocking. The starting point for all swarm coordination algorithms.' },
          { title: 'Self-Organization in Biological Systems', author: 'Camazine et al.', year: 2001, url: 'https://www.amazon.com/Self-Organization-Biological-Systems-Princeton-Complexity/dp/0691116245', type: 'book', level: 'intermediate', desc: 'How self-organization works in nature: termite mounds, fish schools, bacterial colonies, slime molds. The biological playbook for swarm engineering.' }
        ]
      },
      {
        title: 'Underwater Swarm Systems',
        resources: [
          { title: 'Blueswarm: Underwater Robot Swarm with Implicit Coordination', author: 'Berlinger, Gauci & Nagpal (Harvard)', year: 2021, url: 'https://www.science.org/doi/10.1126/scirobotics.abd8668', type: 'notes', level: 'intermediate', desc: 'Harvard\'s landmark fish-inspired underwater swarm. LED-based visual sensing enables schooling, milling, and dispersal without explicit communication. Published in Science Robotics.' },
          { title: 'CoCoRo: Collective Cognitive Robots in Water', author: 'EU FP7 Project', year: 2014, url: 'https://cordis.europa.eu/project/id/270382', type: 'notes', level: 'intermediate', desc: 'Pioneering EU project on self-aware underwater robot swarms. Autonomous collective behavior, task allocation, and environmental monitoring in aquatic environments.' },
          { title: 'MONSOON: Multi-Robot Ocean Sensor Network', author: 'MIT Sea Grant', year: 2020, url: 'https://seagrant.mit.edu/', type: 'notes', level: 'intermediate', desc: 'MIT\'s framework for multi-AUV ocean sensing. Distributed sampling strategies that maximize spatial coverage while minimizing communication overhead.' },
          { title: 'Multi-AUV Cooperative Exploration with Implicit Communication', author: 'Hollinger et al.', year: 2012, url: 'https://journals.sagepub.com/doi/10.1177/0278364912440736', type: 'notes', level: 'advanced', desc: 'How multiple AUVs can efficiently explore unknown environments using only periodic surfacing for GPS and acoustic pings. No continuous communication needed.' },
          { title: 'Autonomous Underwater Vehicle Swarms: State of the Art', author: 'Huang et al.', year: 2023, url: 'https://www.sciencedirect.com/science/article/pii/S0029801823000026', type: 'notes', level: 'intermediate', desc: 'Comprehensive 2023 review of underwater swarm robotics. Architectures, communication, coordination algorithms, and field deployments.' },
          { title: 'Underwater Swarm Robotics: Challenges and Opportunities', author: 'Berlinger & Nagpal', year: 2020, url: 'https://dash.harvard.edu/handle/1/37365781', type: 'notes', level: 'intermediate', desc: 'Harvard SEAS perspective on the unique challenges of underwater swarms: acoustic bandwidth, GPS denial, 3D navigation, current disturbances.' }
        ]
      },
      {
        title: 'Acoustic & Optical Underwater Communication',
        resources: [
          { title: 'Underwater Acoustic Sensor Networks: A Survey', author: 'Akyildiz, Pompili & Melodia', year: 2005, url: 'https://www.sciencedirect.com/science/article/pii/S1570870505000168', type: 'notes', level: 'intermediate', desc: 'Foundational survey on underwater acoustic networking. Propagation models, modulation, MAC protocols, and the fundamental constraints of the underwater acoustic channel.' },
          { title: 'The JANUS Standard: Interoperable Underwater Acoustic Communications', author: 'NATO CMRE', year: 2017, url: 'https://www.cmre.nato.int/', type: 'notes', level: 'intermediate', desc: 'NATO\'s standard for underwater acoustic digital communications. The closest thing to a universal protocol for underwater robots to talk to each other.' },
          { title: 'Bio-Inspired Underwater Communication Using Electric Fields', author: 'Various', year: 2021, url: 'https://ieeexplore.ieee.org/document/9519508', type: 'notes', level: 'advanced', desc: 'Electrocommunication inspired by weakly electric fish (knifefish, elephantnose). Short-range, low-power signaling for swarm coordination in turbid water.' }
        ]
      },
      {
        title: 'Software & Simulation',
        resources: [
          { title: 'UUV Simulator (Gazebo/ROS)', author: 'Open Robotics', year: null, url: 'https://github.com/uuvsimulator/uuv_simulator', type: 'code', level: 'intermediate', desc: 'Open-source underwater vehicle simulator for ROS/Gazebo. Hydrodynamic models, thrusters, sensors, multi-vehicle simulation. Essential for swarm algorithm development.' },
          { title: 'MOOS-IvP: Mission Oriented Operating Suite', author: 'MIT Marine Autonomy Lab', year: null, url: 'https://oceanai.mit.edu/moos-ivp/pmwiki/pmwiki.php', type: 'code', level: 'intermediate', desc: 'MIT\'s autonomy middleware for marine vehicles. Behavior-based architecture with interval programming for multi-objective decision making.' },
          { title: 'NetLogo: Multi-Agent Programmable Modeling', author: 'Northwestern University', year: null, url: 'https://ccl.northwestern.edu/netlogo/', type: 'code', level: 'beginner', desc: 'Agent-based modeling environment. Perfect for prototyping swarm algorithms before deploying to hardware. Extensive library of fish schooling and flocking models.' },
          { title: 'Aquaticus: Multi-Agent Marine Autonomy Competition', author: 'MIT', year: null, url: 'https://oceanai.mit.edu/aquaticus/pmwiki/pmwiki.php', type: 'code', level: 'intermediate', desc: 'MIT\'s competitive framework for multi-agent marine autonomy. Capture-the-flag with autonomous surface vehicles. Excellent testbed for swarm strategies.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 5: OCEAN BIOMIMICRY
  // ============================================================
  {
    id: 'biomimicry',
    title: 'Ocean Biomimicry',
    icon: '\u{1F419}',
    intro: `<p>The ocean's organisms have had 3.8 billion years of R&D to solve the same engineering problems we face underwater: <strong>propulsion</strong> without propellers, <strong>sensing</strong> in turbid darkness, <strong>communication</strong> without radio, <strong>navigation</strong> without GPS, <strong>adhesion</strong> in currents, and <strong>stealth</strong> from predators. Biomimicry takes these solutions and translates them into engineering.</p>
<p>This is why Sea Lion needs a biomimicry research lab. The organisms listed here aren't just inspiration — they are <strong>blueprints</strong>:</p>
<ul>
<li><strong>Fish</strong> — body-caudal fin propulsion achieves thrust efficiencies >80%. Tuna have drag-reducing skin texture and can dynamically stiffen their body for burst speed. Boxfish have hydrodynamically stable body forms that inspired concept cars. Remora adhesion discs can hold 10x body weight in shear.</li>
<li><strong>Rays</strong> — manta rays glide on pectoral fin oscillation with extraordinary efficiency and maneuverability. Their flapping-wing propulsion is ideal for long-endurance survey vehicles.</li>
<li><strong>Jellyfish</strong> — the most energy-efficient swimmers in the animal kingdom. They recapture energy from their own body elasticity on the recovery stroke. Robotic jellyfish can operate indefinitely on minimal power.</li>
<li><strong>Cephalopods</strong> — octopus arms are muscular hydrostats with infinite degrees of freedom. Squid jet propulsion is fast-start escape optimized. Cuttlefish chromatophores achieve dynamic camouflage in milliseconds. All soft-bodied, all compliant.</li>
<li><strong>Sharks</strong> — dermal denticles reduce drag by 5-10% and inhibit biofouling. Lateral line systems detect pressure waves from prey. Electroreception (ampullae of Lorenzini) senses bioelectric fields at nanvolt resolution.</li>
<li><strong>Marine mammals</strong> — dolphin echolocation processes acoustic returns with a sophistication no sonar matches. Humpback whale flipper tubercles improve hydrodynamic stall characteristics. Seal whiskers detect vortex trails left by prey minutes earlier.</li>
<li><strong>Coral</strong> — mass spawning synchronization across an entire reef, timed to lunar phase and water temperature. Symbiotic photosynthesis. Calcium carbonate architecture that withstands hurricane-force wave energy.</li>
</ul>
<p>Each of these organisms represents an engineering research program. A biomimicry lab would prototype soft robotic analogs, test them in controlled water environments, and iterate toward field-deployable swarm units.</p>`,
    subsections: [
      {
        title: 'Bio-Inspired Underwater Vehicles',
        resources: [
          { title: 'SoFi: A Soft Robotic Fish', author: 'Katzschmann et al. (MIT CSAIL)', year: 2018, url: 'https://www.science.org/doi/10.1126/scirobotics.aar3449', type: 'notes', level: 'intermediate', desc: 'MIT\'s soft robotic fish that swims alongside real fish at 10-18m depth. Silicone body, hydraulic actuator, monocular fisheye camera. Published in Science Robotics.' },
          { title: 'Aqua-Ray: Manta Ray Inspired AUV', author: 'Festo Bionic Learning Network', year: 2007, url: 'https://www.festo.com/us/en/e/about-festo/research-and-development/bionic-learning-network-id_32066/', type: 'notes', level: 'beginner', desc: 'Festo\'s pioneering manta ray robot. Flapping-wing propulsion with pneumatic muscles. One of the earliest bio-inspired underwater vehicles to demonstrate practical maneuverability.' },
          { title: 'Robojelly: Hydrogen-Powered Jellyfish Robot', author: 'Tadesse et al. (Virginia Tech)', year: 2012, url: 'https://iopscience.iop.org/article/10.1088/0964-1726/21/4/045013', type: 'notes', level: 'advanced', desc: 'Jellyfish robot powered by catalytic combustion of hydrogen in seawater. Theoretically infinite endurance — the ocean itself is the fuel tank.' },
          { title: 'Tunabot: High-Performance Tuna-Inspired Robot', author: 'Zhu et al. (University of Virginia)', year: 2019, url: 'https://www.science.org/doi/10.1126/scirobotics.aax4615', type: 'notes', level: 'intermediate', desc: 'Yellowfin tuna biomechanics replicated in a robot that matches real tuna swimming performance. Demonstrates that fish-like propulsion can outperform propellers at scale.' },
          { title: 'Octobot: The First Fully Soft Robot', author: 'Wehner et al. (Harvard)', year: 2016, url: 'https://www.nature.com/articles/nature19100', type: 'notes', level: 'intermediate', desc: 'Harvard\'s octopus-inspired robot with zero rigid components. Microfluidic logic, monopropellant fuel, 3D-printed body. Published in Nature. The starting point for soft underwater robotics.' },
          { title: 'Cuttlefish-Inspired Underwater Vehicle with Adaptive Camouflage', author: 'Li et al.', year: 2022, url: 'https://www.nature.com/articles/s41467-022-28012-5', type: 'notes', level: 'advanced', desc: 'Soft robot that can change its color and texture like a cuttlefish. Stretchable electrochromic skin for active camouflage in marine environments.' },
          { title: 'Remora-Inspired Adhesion for Underwater Robots', author: 'Wang et al.', year: 2022, url: 'https://www.science.org/doi/10.1126/scirobotics.ade8860', type: 'notes', level: 'intermediate', desc: 'Biomimetic adhesive disc inspired by the remora suckerfish. Can attach to and ride larger underwater vehicles or marine animals for hitchhiker-style observation.' }
        ]
      },
      {
        title: 'Biological Sensing & Communication',
        resources: [
          { title: 'Shark Electroreception: The Ampullae of Lorenzini', author: 'Kalmijn', year: 1982, url: 'https://www.science.org/doi/10.1126/science.7079757', type: 'notes', level: 'intermediate', desc: 'Classic paper on how sharks sense electric fields at nanovolt sensitivity. Inspires electroreceptive sensors for detecting buried objects, bioelectric signatures, and navigating by Earth\'s magnetic field.' },
          { title: 'The Lateral Line System of Fish: Structure, Function, and Biomimetic Applications', author: 'Coombs & Montgomery', year: 2014, url: 'https://link.springer.com/chapter/10.1007/978-1-4614-8851-4_3', type: 'notes', level: 'intermediate', desc: 'How fish sense water flow, pressure waves, and nearby obstacles using the lateral line. Biomimetic MEMS pressure sensors for AUV navigation in dark or turbid conditions.' },
          { title: 'Dolphin Biosonar: Lessons for Underwater Acoustics', author: 'Au', year: 1993, url: 'https://www.amazon.com/Sonar-Dolphins-Whitlow-W-Au/dp/0387978356', type: 'book', level: 'advanced', desc: 'Comprehensive treatment of dolphin echolocation — the most sophisticated biological sonar system known. Signal processing lessons for man-made sonar and underwater navigation.' },
          { title: 'Humpback Whale Tubercle-Inspired Hydrofoils', author: 'Fish & Lauder', year: 2006, url: 'https://physicstoday.scitation.org/doi/10.1063/1.2169442', type: 'notes', level: 'beginner', desc: 'How the bumps on humpback whale flippers delay stall and improve lift. Already applied to wind turbine blades, fans, and now underwater vehicle control surfaces.' },
          { title: 'Harbor Seal Whisker-Inspired Flow Sensors', author: 'Beem & Triantafyllou (MIT)', year: 2015, url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0076266', type: 'notes', level: 'intermediate', desc: 'Seals track fish by detecting hydrodynamic trails with their whiskers minutes after the prey passed. MIT\'s biomimetic whisker sensors can do the same for AUV wake tracking.' }
        ]
      },
      {
        title: 'Shark Skin & Biofouling',
        resources: [
          { title: 'Shark Skin Drag Reduction: The Riblet Effect', author: 'Bechert et al.', year: 2000, url: 'https://link.springer.com/article/10.1007/s003480050236', type: 'notes', level: 'intermediate', desc: 'Definitive study on how shark dermal denticle micro-riblets reduce turbulent skin friction by 5-10%. Applied to aircraft, swimsuits, and underwater vehicle hulls.' },
          { title: 'Sharklet: Bio-Inspired Anti-Microbial Surface Texture', author: 'Brennan & Callow', year: 2008, url: 'https://royalsocietypublishing.org/doi/10.1098/rsif.2006.0190', type: 'notes', level: 'beginner', desc: 'Shark skin pattern prevents bacterial colonization without chemicals. Applications: anti-biofouling coatings for underwater sensors, hull surfaces, and marine infrastructure.' },
          { title: 'Biofouling Prevention in Marine Robotics', author: 'Delauney et al.', year: 2010, url: 'https://www.sciencedirect.com/science/article/pii/S0924424710001986', type: 'notes', level: 'intermediate', desc: 'The biofouling problem for persistent ocean platforms: organisms colonize sensors, increase drag, and block optics. Bio-inspired and engineering solutions.' }
        ]
      },
      {
        title: 'Courses & Overviews',
        resources: [
          { title: 'Bio-Inspired Underwater Robotics: State of the Art and Perspectives', author: 'Katzschmann', year: 2020, url: 'https://www.annualreviews.org/doi/abs/10.1146/annurev-control-071320-100026', type: 'notes', level: 'intermediate', desc: 'Comprehensive annual review of the entire field. Fish, jellyfish, octopus, ray, and turtle robots. Sensing, actuation, materials, autonomy.' },
          { title: 'Biomimetics: Nature-Inspired Innovation', author: 'Yoseph Bar-Cohen', year: 2011, url: 'https://www.amazon.com/Biomimetics-Nature-Inspired-Innovation-Yoseph-Bar-Cohen/dp/1439834768', type: 'book', level: 'beginner', desc: 'Broad introduction to biomimicry across domains. Strong chapters on underwater biomimetics, marine locomotion, and ocean sensing.' },
          { title: 'Soft Robotics for Ocean Exploration', author: 'Laschi, Mazzolai & Cianchetti', year: 2016, url: 'https://www.science.org/doi/10.1126/scirobotics.aah3690', type: 'notes', level: 'intermediate', desc: 'Science Robotics review on soft robots for deep-sea exploration. Compliant bodies survive pressure and navigate complex terrain that rigid robots cannot.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 6: MARINE OBSERVATION & MONITORING
  // ============================================================
  {
    id: 'observation',
    title: 'Marine Observation & Monitoring',
    icon: '\u{1F6F0}',
    intro: `<p>The observational infrastructure for ocean science is undergoing a revolution. The convergence of <strong>autonomous platforms</strong>, <strong>satellite remote sensing</strong>, <strong>passive acoustic monitoring</strong>, <strong>environmental DNA</strong>, and <strong>Internet of Underwater Things</strong> (IoUT) is creating the first generation of <strong>persistent, multi-scale ocean observation systems</strong>.</p>
<p>Historically, ocean data came from research vessels — expensive, slow, spatially sparse. Then came moored buoys and drifters. Then satellite altimetry, ocean color, and sea surface temperature. Now:</p>
<ul>
<li><strong>Argo floats</strong> — 4,000+ autonomous profiling floats cycling between surface and 2,000m depth, reporting temperature and salinity every 10 days. The backbone of physical oceanography. Now being extended to 6,000m (Deep Argo) and adding biogeochemical sensors (BGC-Argo).</li>
<li><strong>Gliders</strong> — buoyancy-driven autonomous vehicles that traverse ocean basins for months at a time. Slocum, Seaglider, Spray. No propeller, no noise, extreme endurance.</li>
<li><strong>Environmental DNA (eDNA)</strong> — every organism sheds DNA into the water. Filter a liter of seawater, sequence the DNA, and you get a census of everything that has been in that water recently. One water sample replaces hundreds of dive hours of visual survey. This is transformative for biodiversity monitoring.</li>
<li><strong>Passive Acoustic Monitoring (PAM)</strong> — underwater microphones (hydrophones) recording the soundscape continuously. Whale calls, fish choruses, shrimp snapping, and anthropogenic noise. Acoustic ecology is a new field — understanding the ocean through its sound.</li>
<li><strong>Satellite + in-situ fusion</strong> — combining satellite ocean color (chlorophyll, turbidity) with in-situ measurements from floats, gliders, and AUVs. Data assimilation models produce near-real-time 3D maps of ocean state.</li>
</ul>
<p>For Sea Lion, the vision is <strong>every dive is a data collection event</strong>. A diver with a temperature logger, a GoPro, and an eDNA filter kit contributes to a persistent observation network. A swarm of AUVs fills the gaps between dives. Satellite data provides the large-scale context. Charlotte ingests it all.</p>`,
    subsections: [
      {
        title: 'Autonomous Ocean Platforms',
        resources: [
          { title: 'Argo: Global Array of Profiling Floats', author: 'Argo Program', year: null, url: 'https://argo.ucsd.edu/', type: 'data', level: null, desc: 'The single most important ocean observation system. 4,000+ floats profiling the upper 2,000m globally. Free, open data. The foundation of modern physical oceanography.' },
          { title: 'Slocum Electric Glider', author: 'Teledyne Webb Research', year: null, url: 'https://www.teledynemarine.com/brands/webb-research/slocum-glider', type: 'notes', level: null, desc: 'The workhorse ocean glider. Buoyancy-driven, months-long missions, carrying CTD, oxygen, fluorescence, and acoustic sensors. Used by navies and research institutions worldwide.' },
          { title: 'Saildrone: Wind and Solar Powered USV', author: 'Saildrone Inc.', year: null, url: 'https://www.saildrone.com/', type: 'notes', level: null, desc: 'Uncrewed surface vehicles powered by wind and solar that sail autonomously for months. Carrying weather, ocean, and fisheries sensors. Recently circumnavigated Antarctica.' },
          { title: 'Wave Glider: Persistent Ocean Observation', author: 'Liquid Robotics (Boeing)', year: null, url: 'https://www.liquid-robotics.com/', type: 'notes', level: null, desc: 'Wave-powered surface robot. Converts wave energy into forward thrust. Years-long deployments. Real-time satellite uplink. The most persistent ocean platform available.' },
          { title: 'Deep Argo: Extending the Observing System to 6,000m', author: 'Johnson et al.', year: 2022, url: 'https://www.frontiersin.org/articles/10.3389/fmars.2019.00435/full', type: 'notes', level: 'intermediate', desc: 'Extending the Argo array to full-ocean depth. New float designs, pressure-stable sensors, and the science case for deep ocean temperature and salinity monitoring.' }
        ]
      },
      {
        title: 'Environmental DNA (eDNA)',
        resources: [
          { title: 'Environmental DNA for Marine Biodiversity Monitoring', author: 'Thomsen & Willerslev', year: 2015, url: 'https://onlinelibrary.wiley.com/doi/10.1111/mec.13439', type: 'notes', level: 'intermediate', desc: 'Landmark review of marine eDNA. How it works, what it can detect, sensitivity, degradation rates, and comparison to traditional survey methods.' },
          { title: 'eDNA Metabarcoding as a Marine Biodiversity Assessment Tool', author: 'Deiner et al.', year: 2017, url: 'https://www.sciencedirect.com/science/article/pii/S0169534717300563', type: 'notes', level: 'intermediate', desc: 'How metabarcoding (sequencing eDNA with universal primers) provides a near-complete species inventory from a single water sample. The future of marine census.' },
          { title: 'Autonomous eDNA Samplers for Ocean Monitoring', author: 'Yamahara et al. (MBARI)', year: 2019, url: 'https://pubs.acs.org/doi/10.1021/acs.est.8b05572', type: 'notes', level: 'advanced', desc: 'MBARI\'s ESP (Environmental Sample Processor) — a robotic lab-in-a-can deployed on moorings and AUVs that autonomously collects and processes eDNA samples in situ.' },
          { title: 'eDNA in a Sea of Change: Long-Term Biodiversity Monitoring', author: 'Sigsgaard et al.', year: 2020, url: 'https://www.nature.com/articles/s41559-019-1038-y', type: 'notes', level: 'intermediate', desc: 'Using eDNA time series to track biodiversity changes at scale. Evidence that eDNA can detect community shifts years before traditional surveys notice.' }
        ]
      },
      {
        title: 'Acoustic Ecology & Passive Monitoring',
        resources: [
          { title: 'Sounds in the Sea: Introduction to Marine Bioacoustics', author: 'Au & Hastings', year: 2008, url: 'https://www.amazon.com/Principles-Marine-Bioacoustics-Whitlow-Au/dp/0387783644', type: 'book', level: 'intermediate', desc: 'Comprehensive textbook on underwater sound production, propagation, and reception by marine organisms. The foundation of marine bioacoustics.' },
          { title: 'The Soundscape of the Anthropocene Ocean', author: 'Duarte et al.', year: 2021, url: 'https://www.science.org/doi/10.1126/science.aba4658', type: 'notes', level: 'intermediate', desc: 'Science paper documenting how human-generated noise is fundamentally altering the ocean soundscape. Shipping, sonar, construction, and seismic surveys affect marine life from whales to invertebrates.' },
          { title: 'Passive Acoustic Monitoring of Cetaceans', author: 'Mellinger et al.', year: 2007, url: 'https://acousticstoday.org/wp-content/uploads/2017/09/Mellinger_et_al_2007_PAsssive-acoustic-monitoring.pdf', type: 'notes', level: 'intermediate', desc: 'How to use hydrophone networks to detect, classify, and track whale species from their vocalizations. Automated call detection with ML is now standard.' },
          { title: 'Coral Reef Soundscapes as Indicators of Ecosystem Health', author: 'Gordon et al.', year: 2018, url: 'https://royalsocietypublishing.org/doi/10.1098/rspb.2018.1307', type: 'notes', level: 'intermediate', desc: 'Healthy reefs are loud — snapping shrimp, fish calls, urchin grazing. Degraded reefs fall silent. Acoustic monitoring can assess reef health remotely and continuously.' },
          { title: 'Ocean Networks Canada: Real-Time Ocean Observing', author: 'ONC / University of Victoria', year: null, url: 'https://www.oceannetworks.ca/', type: 'data', level: null, desc: 'Cabled undersea observatory network with real-time data streams: hydrophones, cameras, CTDs, seismometers. Live acoustic data from the deep ocean floor.' }
        ]
      },
      {
        title: 'Satellite & Remote Sensing',
        resources: [
          { title: 'NASA Worldview — Ocean Color', author: 'NASA EOSDIS', year: null, url: 'https://worldview.earthdata.nasa.gov/', type: 'data', level: null, desc: 'Real-time satellite imagery of ocean chlorophyll, sea surface temperature, true color composites. Free. The view from above that contextualizes everything below.' },
          { title: 'Copernicus Marine Service (CMEMS)', author: 'European Union', year: null, url: 'https://marine.copernicus.eu/', type: 'data', level: null, desc: 'Europe\'s ocean monitoring service. Reanalysis products, forecasts, and near-real-time observations of physical and biogeochemical ocean state. Free and open.' },
          { title: 'Allen Coral Atlas: Global Reef Mapping from Satellite', author: 'Allen Coral Atlas / Vulcan', year: null, url: 'https://allencoralatlas.org/', type: 'data', level: null, desc: 'High-resolution satellite-derived maps of the world\'s coral reefs. Benthic composition, geomorphology, and bleaching alerts. The global view of reef health.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 7: CORAL REEF SCIENCE & RESTORATION
  // ============================================================
  {
    id: 'coral',
    title: 'Coral Reef Science & Restoration',
    icon: '\u{1FAB8}',
    intro: `<p>Coral reefs cover less than 0.1% of the ocean floor but support 25% of all marine species. They are the rainforests of the sea — and they are in crisis. <strong>Half the world's coral has been lost since the 1950s.</strong> Marine heatwaves driven by climate change trigger mass bleaching events that are now occurring faster than reefs can recover.</p>
<p>But the science of reef restoration is advancing rapidly:</p>
<ul>
<li><strong>Coral gardening</strong> — growing coral fragments on underwater nursery trees, then transplanting them to damaged reefs. Scaled programs now operate across the Caribbean, Red Sea, and Indo-Pacific.</li>
<li><strong>Assisted gene flow</strong> — identifying heat-tolerant coral genotypes and crossbreeding them to produce climate-resilient strains. Selective breeding for corals, essentially.</li>
<li><strong>Larval seeding</strong> — capturing coral spawn during mass spawning events, rearing larvae in floating pools, and settling them onto degraded reef substrate. Orders of magnitude more scalable than fragment transplantation.</li>
<li><strong>3D-printed reef structures</strong> — engineered calcium carbonate or ceramic substrates that mimic natural reef architecture, providing settlement surfaces for coral larvae and habitat for reef organisms.</li>
<li><strong>Reef photogrammetry</strong> — structure-from-motion 3D reconstruction of reef surfaces from thousands of overlapping photographs. Enables millimeter-resolution tracking of coral growth, disease progression, and bleaching recovery over time.</li>
<li><strong>Probiotics for coral</strong> — inoculating corals with beneficial microbes that enhance thermal tolerance. The coral microbiome is a new frontier.</li>
</ul>
<p>For Sea Lion: every dive on a reef is an opportunity to collect photogrammetric data, take eDNA samples, deploy temperature loggers, and visually survey coral health. A dive shop operating near a reef system becomes a persistent observation node. Citizen science at scale.</p>`,
    subsections: [
      {
        title: 'Reef Ecology & Bleaching',
        resources: [
          { title: 'Coral Reefs Under Rapid Climate Change and Ocean Acidification', author: 'Hoegh-Guldberg et al.', year: 2007, url: 'https://www.science.org/doi/10.1126/science.1152509', type: 'notes', level: 'intermediate', desc: 'Landmark Science paper laying out the existential threat to coral reefs from warming and acidification. The paper that galvanized global reef conservation.' },
          { title: 'The State of Coral Reef Ecosystems of the United States', author: 'NOAA Coral Reef Conservation Program', year: null, url: 'https://coralreef.noaa.gov/', type: 'data', level: null, desc: 'NOAA\'s comprehensive monitoring of US reef systems. Status reports, monitoring data, and conservation strategies for reefs in Florida, Hawaii, Pacific Islands, and Caribbean territories.' },
          { title: 'Global Assessment of Coral Bleaching (GCRMN)', author: 'ICRI / UNEP', year: 2021, url: 'https://gcrmn.net/', type: 'data', level: null, desc: 'The Global Coral Reef Monitoring Network\'s status report. The most comprehensive global assessment of reef health, compiled from thousands of survey sites.' },
          { title: 'NOAA Coral Reef Watch: Satellite Bleaching Alerts', author: 'NOAA', year: null, url: 'https://coralreefwatch.noaa.gov/', type: 'data', level: null, desc: 'Real-time satellite-derived sea surface temperature products for predicting coral bleaching. Degree Heating Weeks (DHW) metric. The early warning system for bleaching events.' }
        ]
      },
      {
        title: 'Restoration Science',
        resources: [
          { title: 'Coral Restoration: A Systematic Review', author: 'Boström-Einarsson et al.', year: 2020, url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0226631', type: 'notes', level: 'intermediate', desc: 'Meta-analysis of 362 coral restoration studies across the globe. What works, what doesn\'t, survival rates, cost-effectiveness. The definitive evidence base.' },
          { title: 'Assisted Gene Flow for Climate Adaptation in Reef Corals', author: 'van Oppen et al.', year: 2015, url: 'https://www.pnas.org/doi/10.1073/pnas.1422301112', type: 'notes', level: 'advanced', desc: 'The case for moving heat-tolerant coral genes into vulnerable populations. Selective breeding, hybridization, and the ethics of genetic intervention in wild ecosystems.' },
          { title: 'Larval Reseeding: Restoring Reefs at Scale', author: 'Doropoulos et al.', year: 2019, url: 'https://onlinelibrary.wiley.com/doi/10.1111/rec.12919', type: 'notes', level: 'intermediate', desc: 'How to capture coral spawn during mass spawning events and rear millions of larvae for settlement on degraded reefs. The scalable alternative to coral gardening.' },
          { title: '3D-Printed Reef Structures for Ecological Restoration', author: 'Levy et al.', year: 2022, url: 'https://www.nature.com/articles/s41893-022-00981-7', type: 'notes', level: 'intermediate', desc: 'Engineering artificial reef substrates with 3D printing. Calcium carbonate, ceramic, and concrete composites that mimic natural reef complexity and promote coral settlement.' },
          { title: 'Coral Probiotics: Manipulating the Microbiome for Thermal Tolerance', author: 'Peixoto et al.', year: 2021, url: 'https://www.nature.com/articles/s41579-021-00590-3', type: 'notes', level: 'advanced', desc: 'Inoculating corals with beneficial microorganisms (BMCs) that enhance bleaching resistance. The coral microbiome as a lever for conservation. Published in Nature Reviews Microbiology.' }
        ]
      },
      {
        title: 'Reef Photogrammetry & 3D Mapping',
        resources: [
          { title: 'Structure-from-Motion Photogrammetry for Coral Reef Monitoring', author: 'Burns et al.', year: 2015, url: 'https://peerj.com/articles/1095/', type: 'notes', level: 'intermediate', desc: 'How to reconstruct 3D reef models from overlapping dive photographs. Camera settings, swim patterns, processing pipelines, and accuracy assessment.' },
          { title: '100 Island Challenge: Large-Area Reef Photogrammetry', author: 'Scripps Institution of Oceanography', year: null, url: 'https://100islandchallenge.org/', type: 'data', level: null, desc: 'Scripps program mapping 100 reefs worldwide in 3D using large-area photogrammetry. Millimeter-resolution reef models for change detection over time.' },
          { title: 'Agisoft Metashape for Underwater Photogrammetry', author: 'Agisoft', year: null, url: 'https://www.agisoft.com/', type: 'code', level: null, desc: 'Industry-standard photogrammetry software. Processes hundreds to thousands of underwater photos into dense 3D point clouds and textured meshes.' },
          { title: 'ReefCloud: AI-Powered Reef Monitoring Platform', author: 'AIMS', year: null, url: 'https://reefcloud.ai/', type: 'code', level: null, desc: 'Australian Institute of Marine Science\'s cloud platform for automated reef image analysis. Upload photos, AI classifies benthic cover, generates reports.' }
        ]
      },
      {
        title: 'Citizen Science',
        resources: [
          { title: 'Reef Check: Global Citizen Science Reef Monitoring', author: 'Reef Check Foundation', year: null, url: 'https://www.reefcheck.org/', type: 'data', level: null, desc: 'The original citizen science reef monitoring program. Trained volunteer divers survey reef health using standardized protocols at thousands of sites worldwide.' },
          { title: 'CoralWatch: Coral Health Monitoring with Color Charts', author: 'University of Queensland', year: null, url: 'https://coralwatch.org/', type: 'data', level: null, desc: 'Simple, elegant citizen science: hold a color reference card next to coral, record the color. Millions of data points on bleaching severity from recreational divers.' },
          { title: 'iNaturalist Marine Observations', author: 'California Academy of Sciences & National Geographic', year: null, url: 'https://www.inaturalist.org/', type: 'data', level: null, desc: 'Global biodiversity observation platform. Divers photograph marine species, AI suggests IDs, experts confirm. Millions of research-grade marine observations.' },
          { title: 'REEF (Reef Environmental Education Foundation) Fish Survey', author: 'REEF', year: null, url: 'https://www.reef.org/', type: 'data', level: null, desc: 'Volunteer divers conduct roving fish surveys using standardized ID protocols. The world\'s largest marine life survey database, built entirely by recreational divers.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 8: UNDERWATER COMPUTER VISION & AI
  // ============================================================
  {
    id: 'underwater-ai',
    title: 'Underwater Computer Vision & AI',
    icon: '\u{1F916}',
    intro: `<p>The underwater world is a uniquely hostile environment for computer vision. <strong>Light attenuates</strong> exponentially — red wavelengths vanish by 5m, leaving a blue-green monochrome. <strong>Scattering</strong> reduces contrast and adds backscatter noise (the underwater equivalent of fog). <strong>Caustics</strong> from surface waves create flickering illumination. <strong>Suspended particles</strong> occlude subjects. And the subjects themselves — marine organisms — are camouflaged, translucent, fast-moving, and wildly variable in appearance.</p>
<p>Despite these challenges, underwater CV has advanced dramatically:</p>
<ul>
<li><strong>Image enhancement</strong> — algorithms that restore color, reduce haze, and correct for wavelength-dependent attenuation. Sea-thru (Akkaynak & Treibitz, 2019) physically models underwater light transport and produces results that look like the ocean was drained. This alone transforms what ML models can learn from underwater imagery.</li>
<li><strong>Species identification</strong> — deep learning models trained on massive underwater image datasets (FathomNet, MBARI, iNaturalist) can now identify fish, invertebrates, and coral species from photographs with accuracy approaching expert taxonomists.</li>
<li><strong>Coral health classification</strong> — CNNs that classify coral as healthy, bleached, diseased, or dead from survey images. CoralNet automates benthic cover analysis. ReefCloud scales it to thousands of sites.</li>
<li><strong>Underwater SLAM</strong> — simultaneous localization and mapping in GPS-denied underwater environments. Visual-inertial odometry, acoustic positioning, and feature matching enable AUVs to build maps of their environment in real time.</li>
<li><strong>Photogrammetric reconstruction</strong> — structure-from-motion pipelines adapted for underwater optics. Refraction correction, color restoration, and scale calibration for accurate 3D models of reefs, wrecks, and seafloor habitat.</li>
<li><strong>Acoustic species classification</strong> — ML models that identify marine mammals from their vocalizations, classify fish species from their sounds, and detect illegal fishing activity from engine noise signatures.</li>
</ul>
<p>This is where Charlotte connects. Every underwater image, every acoustic recording, every eDNA sequence, every sensor reading — it all feeds into a knowledge graph that represents the state of the ocean. The AI isn't a standalone model; it's a <strong>perception layer</strong> for a living, time-indexed graph of marine reality.</p>`,
    subsections: [
      {
        title: 'Image Enhancement & Restoration',
        resources: [
          { title: 'Sea-thru: Physically Accurate Color Restoration', author: 'Akkaynak & Treibitz', year: 2019, url: 'https://openaccess.thecvf.com/content_CVPR_2019/papers/Akkaynak_Sea-Thru_A_Method_for_Removing_Water_From_Underwater_Images_CVPR_2019_paper.pdf', type: 'notes', level: 'advanced', desc: 'The breakthrough paper. Physics-based model of underwater light transport that removes water from underwater images. CVPR 2019. Makes underwater photos look like they were taken in air.' },
          { title: 'Underwater Image Enhancement: A Comprehensive Review', author: 'Anwar & Li', year: 2020, url: 'https://www.sciencedirect.com/science/article/pii/S0165168419303779', type: 'notes', level: 'intermediate', desc: 'Survey of 50+ underwater image enhancement methods. Physics-based, learning-based, and hybrid approaches. Benchmarks and comparisons.' },
          { title: 'WaterNet: Underwater Image Enhancement via Deep Learning', author: 'Li et al.', year: 2020, url: 'https://ieeexplore.ieee.org/document/8917818', type: 'notes', level: 'intermediate', desc: 'End-to-end CNN for underwater image enhancement. Learns color correction, dehazing, and contrast enhancement jointly. Practical and fast.' }
        ]
      },
      {
        title: 'Species Identification & Classification',
        resources: [
          { title: 'FathomNet: An Underwater Image Database for Ocean Exploration', author: 'MBARI', year: null, url: 'https://fathomnet.org/', type: 'data', level: null, desc: 'MBARI\'s massive database of underwater images with taxonomic annotations. The ImageNet of the ocean. Foundation for training marine species identification models.' },
          { title: 'CoralNet: Automated Benthic Image Analysis', author: 'Beijbom et al.', year: null, url: 'https://coralnet.ucsd.edu/', type: 'code', level: null, desc: 'Web platform for automated coral reef image annotation. Upload reef survey photos, ML classifies benthic cover by substrate type. Used by hundreds of reef monitoring programs.' },
          { title: 'Deep Learning for Fish Species Identification', author: 'Salman et al.', year: 2016, url: 'https://ieeexplore.ieee.org/document/7404580', type: 'notes', level: 'intermediate', desc: 'Early landmark work on CNN-based fish species identification from underwater camera footage. Demonstrated that deep learning could automate what previously required expert taxonomists.' },
          { title: 'Machine Learning for Marine Ecology: Current Applications and Emerging Frontiers', author: 'Beery et al.', year: 2022, url: 'https://www.annualreviews.org/doi/abs/10.1146/annurev-marine-041921-013023', type: 'notes', level: 'intermediate', desc: 'Annual Reviews survey of ML applications across marine ecology. Species ID, population estimation, behavioral analysis, habitat mapping, and the challenges unique to ocean data.' }
        ]
      },
      {
        title: 'Underwater SLAM & Navigation',
        resources: [
          { title: 'Visual SLAM for Underwater Vehicles: A Survey', author: 'Joshi et al.', year: 2022, url: 'https://www.sciencedirect.com/science/article/pii/S0921889022000483', type: 'notes', level: 'advanced', desc: 'Comprehensive survey of visual SLAM adapted for underwater environments. Feature extraction in low-contrast scenes, loop closure with limited visibility, multi-sensor fusion.' },
          { title: 'DVL-SLAM: Doppler Velocity Log Based Underwater SLAM', author: 'Various', year: 2021, url: 'https://ieeexplore.ieee.org/document/9562073', type: 'notes', level: 'advanced', desc: 'SLAM using Doppler velocity log for bottom-tracking. Robust in turbid water where visual features fail. Essential for AUV autonomy in real ocean conditions.' },
          { title: 'Acoustic Positioning Systems for Underwater Navigation', author: 'Vickery', year: 1998, url: 'https://ieeexplore.ieee.org/document/725285', type: 'notes', level: 'intermediate', desc: 'Foundation of underwater acoustic positioning: LBL (Long Baseline), SBL (Short Baseline), USBL (Ultra-Short Baseline). How underwater vehicles know where they are.' }
        ]
      },
      {
        title: 'Acoustic Species Classification',
        resources: [
          { title: 'Deep Learning for Whale Call Detection and Classification', author: 'Shiu et al.', year: 2020, url: 'https://asa.scitation.org/doi/10.1121/10.0002428', type: 'notes', level: 'intermediate', desc: 'CNN and RNN architectures for detecting and classifying whale species from passive acoustic recordings. Approaches human expert performance on multi-species datasets.' },
          { title: 'Google AI — Humpback Whale Song Detection', author: 'Google AI / NOAA', year: 2018, url: 'https://ai.google/research/pubs/pub47452/', type: 'notes', level: 'intermediate', desc: 'Google\'s collaboration with NOAA Pacific Islands applying deep learning to humpback whale song detection across thousands of hours of hydrophone recordings.' },
          { title: 'Fish Sound Classification with Convolutional Neural Networks', author: 'Ibrahim et al.', year: 2018, url: 'https://www.sciencedirect.com/science/article/pii/S1574954118301067', type: 'notes', level: 'intermediate', desc: 'Yes, fish make sounds — over 800 species are documented. CNNs can classify fish species from their acoustic signatures. Implications for passive biodiversity monitoring.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 9: FREEDIVING SCIENCE
  // ============================================================
  {
    id: 'freediving',
    title: 'Freediving Science',
    icon: '\u{1F9CE}',
    intro: `<p><strong>Freediving</strong> — breath-hold diving — is the oldest and purest form of underwater exploration. No tanks, no regulators, no bubbles. Just the mammalian dive reflex and human physiology pushed to extraordinary limits. Modern competitive freedivers exceed 100 meters on a single breath — a depth that would be a serious technical dive on scuba.</p>
<p>The science is fascinating because it reveals capabilities that most people don't know humans possess:</p>
<ul>
<li><strong>Mammalian Dive Reflex (MDR)</strong> — face immersion in cold water triggers bradycardia (heart rate drops 10-25%), peripheral vasoconstriction (blood shifts to core organs), and splenic contraction (releases stored red blood cells, boosting hematocrit by 2-5%). This is the same reflex that lets seals dive to 1,500m. Humans have it too, just attenuated.</li>
<li><strong>Blood shift</strong> — below 40-50m, blood plasma engorges the pulmonary vasculature to prevent lung collapse. The lungs, compressed to a fraction of their surface volume, fill with blood to maintain structural integrity. This is why freedivers can reach depths where Boyle's Law alone would crush the thorax.</li>
<li><strong>Lung packing (glossopharyngeal insufflation)</strong> — freedivers use the tongue as a pump to force extra air into already-full lungs, increasing total lung capacity by 20-40%. This extends the depth at which residual volume is reached and delays the onset of hypoxia.</li>
<li><strong>Hypoxic tolerance</strong> — trained freedivers develop enhanced tolerance to low oxygen levels. Spleen volume increases with training (more stored red blood cells). Cerebral vasoconstriction delays the onset of blackout. Some elite freedivers function normally at arterial PO2 levels that would render untrained individuals unconscious.</li>
<li><strong>Performance science</strong> — relaxation techniques, diaphragmatic stretching, CO2 tolerance training, and mental rehearsal. Freediving is as much a sport of the mind as the body.</li>
</ul>
<p>For Sea Lion, freediving science matters because it represents the <strong>lowest-impact, most accessible form of marine observation</strong>. No bubbles to disturb marine life. No gear noise. Silent, close, intimate contact with the underwater world. A trained freediver with a camera is the ultimate low-disturbance marine survey platform.</p>`,
    subsections: [
      {
        title: 'Physiology & Adaptation',
        resources: [
          { title: 'The Mammalian Diving Response: An Enigmatic Reflex', author: 'Panneton', year: 2013, url: 'https://pubmed.ncbi.nlm.nih.gov/23476045/', type: 'notes', level: 'intermediate', desc: 'Comprehensive review of the mammalian dive reflex — bradycardia, vasoconstriction, blood shift. How this protective response works and why humans retain it.' },
          { title: 'Physiology of Breath-Hold Diving and the Ama of Japan', author: 'Hong & Rahn', year: 1967, url: 'https://pubmed.ncbi.nlm.nih.gov/6057523/', type: 'notes', level: 'intermediate', desc: 'Classic study of the Ama pearl divers of Japan — professional breath-hold divers with decades of adaptation. One of the earliest scientific studies of human freediving physiology.' },
          { title: 'Splenic Contraction and Hematocrit Increase During Apnea', author: 'Schagatay et al.', year: 2001, url: 'https://pubmed.ncbi.nlm.nih.gov/11218499/', type: 'notes', level: 'intermediate', desc: 'How the spleen contracts during breath-hold to release stored red blood cells, boosting oxygen-carrying capacity. Bajau sea nomads have genetically enlarged spleens from generations of selection.' },
          { title: 'Blood Shift During Human Breath-Hold Diving', author: 'Lindholm & Lundgren', year: 2009, url: 'https://pubmed.ncbi.nlm.nih.gov/19240738/', type: 'notes', level: 'advanced', desc: 'The mechanism that prevents lung squeeze at depth: blood plasma floods the pulmonary vasculature as the lungs compress. Without this, the thorax would collapse below ~40m.' },
          { title: 'Genetic Adaptations to Diving in the Bajau Sea Nomads', author: 'Ilardo et al.', year: 2018, url: 'https://www.cell.com/cell/fulltext/S0092-8674(18)30386-6', type: 'notes', level: 'intermediate', desc: 'Published in Cell. The Bajau people of Southeast Asia have genetically larger spleens, providing greater oxygen reserves for diving. Natural selection for breath-hold diving in humans, documented.' }
        ]
      },
      {
        title: 'Training & Performance',
        resources: [
          { title: 'Manual of Freediving: Underwater on a Single Breath', author: 'Umberto Pelizzari', year: 2004, url: 'https://www.amazon.com/Manual-Freediving-Underwater-Single-Breath/dp/1928649343', type: 'book', level: 'beginner', desc: 'Written by one of the greatest competitive freedivers in history. Training methodology, equalization techniques, diaphragmatic stretching, and mental preparation.' },
          { title: 'Deep: Freediving, Renegade Science, and What the Ocean Tells Us', author: 'James Nestor', year: 2014, url: 'https://www.amazon.com/Deep-Freediving-Renegade-Science-Ocean/dp/0544484010', type: 'book', level: 'beginner', desc: 'Beautifully written exploration of competitive freediving, the mammalian dive reflex, whale communication, and what extreme depth does to the human body and mind.' },
          { title: 'CO2 Tolerance Training and Breath-Hold Performance', author: 'Schagatay', year: 2010, url: 'https://pubmed.ncbi.nlm.nih.gov/20544471/', type: 'notes', level: 'intermediate', desc: 'How systematic CO2 tolerance training (table breathing exercises) extends breath-hold time. The chemoreceptor desensitization that underlies freediving performance gains.' },
          { title: 'AIDA International — Freediving Education Standards', author: 'AIDA International', year: null, url: 'https://www.aidainternational.org/', type: 'course', level: null, desc: 'The global governing body for competitive freediving and education. Course standards from beginner to instructor level. Safety protocols and competition rules.' }
        ]
      },
      {
        title: 'Safety & Medical',
        resources: [
          { title: 'Shallow Water Blackout: Mechanisms and Prevention', author: 'Lindholm', year: 2006, url: 'https://pubmed.ncbi.nlm.nih.gov/16924116/', type: 'notes', level: 'intermediate', desc: 'The #1 killer in freediving. How hyperventilation suppresses CO2 without adding O2, allowing a diver to lose consciousness before feeling the urge to breathe. Prevention protocols.' },
          { title: 'Pulmonary Barotrauma in Competitive Freediving', author: 'Schipke et al.', year: 2006, url: 'https://pubmed.ncbi.nlm.nih.gov/16912520/', type: 'notes', level: 'advanced', desc: 'Lung squeeze injuries in deep freediving. Blood-tinged sputum, pulmonary edema, and the physiological limits of the blood shift mechanism at extreme depth.' },
          { title: 'Immersion Pulmonary Edema in Divers and Swimmers', author: 'Moon et al.', year: 2016, url: 'https://pubmed.ncbi.nlm.nih.gov/27480121/', type: 'notes', level: 'intermediate', desc: 'IPE can occur in both scuba divers and freedivers. Hydrostatic pressure gradient, cold water, exertion. Increasingly recognized as an underdiagnosed condition.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 10: DATASETS & SOFTWARE
  // ============================================================
  {
    id: 'data',
    title: 'Datasets & Software',
    icon: '\u{1F4BE}',
    intro: `<p>The open data and open-source tools that make ocean science research possible. Satellite data, underwater imagery, acoustic recordings, oceanographic measurements, and the software to process, analyze, and visualize them.</p>`,
    subsections: [
      {
        title: 'Ocean Data Portals',
        resources: [
          { title: 'NOAA National Centers for Environmental Information (NCEI)', author: 'NOAA', year: null, url: 'https://www.ncei.noaa.gov/', type: 'data', level: null, desc: 'The world\'s largest archive of oceanic, atmospheric, and geophysical data. Bathymetry, ocean temperature, salinity, currents. Free and open.' },
          { title: 'Global Biodiversity Information Facility (GBIF)', author: 'GBIF', year: null, url: 'https://www.gbif.org/', type: 'data', level: null, desc: 'Open access to biodiversity data. 2+ billion occurrence records including millions of marine species observations. Essential for species distribution modeling.' },
          { title: 'Ocean Biodiversity Information System (OBIS)', author: 'IOC-UNESCO', year: null, url: 'https://obis.org/', type: 'data', level: null, desc: 'Global open-access database of marine species distribution. 100+ million records. Standardized taxonomy. The marine-specific complement to GBIF.' },
          { title: 'World Ocean Database (WOD)', author: 'NOAA NCEI', year: null, url: 'https://www.ncei.noaa.gov/products/world-ocean-database', type: 'data', level: null, desc: 'The most comprehensive database of ocean profile data (temperature, salinity, oxygen, nutrients). Millions of profiles from 1772 to present.' },
          { title: 'GEBCO: General Bathymetric Chart of the Oceans', author: 'IHO & IOC-UNESCO', year: null, url: 'https://www.gebco.net/', type: 'data', level: null, desc: 'The definitive global bathymetric dataset. 15 arc-second grid of ocean floor topography. Free download. The map of the bottom of the ocean.' }
        ]
      },
      {
        title: 'Underwater Image & Video Datasets',
        resources: [
          { title: 'FathomNet', author: 'MBARI', year: null, url: 'https://fathomnet.org/', type: 'data', level: null, desc: 'Massive collection of underwater images with taxonomic annotations from MBARI\'s 30+ year video archive. The foundation for training marine CV models.' },
          { title: 'SUIM: Segmentation of Underwater Imagery', author: 'Islam et al.', year: 2020, url: 'https://github.com/xahidbuffon/SUIM', type: 'data', level: null, desc: 'Pixel-wise semantic segmentation dataset for underwater scenes. Categories: fish, reef, plant, wreck, diver, robot, background. Benchmark for underwater scene understanding.' },
          { title: 'Brackish Underwater Dataset', author: 'Pedersen et al.', year: 2019, url: 'https://www.kaggle.com/datasets/aalborguniversity/brackish-dataset', type: 'data', level: null, desc: 'Annotated underwater video from brackish water environments (harbors, estuaries). Fish, crab, starfish detection and tracking in real-world conditions.' },
          { title: 'MBARI Deep-Sea Video Archive', author: 'Monterey Bay Aquarium Research Institute', year: null, url: 'https://www.mbari.org/technology/video-annotation-and-reference-system-vars/', type: 'data', level: null, desc: 'Decades of deep-sea ROV video with expert biological annotations in the VARS database. Unparalleled deep ocean imagery.' }
        ]
      },
      {
        title: 'Software Libraries & Tools',
        resources: [
          { title: 'Subsurface — Open Source Dive Log', author: 'Torvalds & Hohndel', year: null, url: 'https://subsurface-divelog.org/', type: 'code', level: null, desc: 'Open-source dive log started by Linus Torvalds. Downloads data from 70+ dive computers. Tissue loading visualization, gas planning, statistics.' },
          { title: 'OpenCV — Computer Vision Library', author: 'OpenCV.org', year: null, url: 'https://opencv.org/', type: 'code', level: null, desc: 'The foundational CV library. Essential for underwater image processing pipelines. Color correction, feature detection, image stitching, object tracking.' },
          { title: 'Meshroom / AliceVision — Open Source Photogrammetry', author: 'AliceVision', year: null, url: 'https://alicevision.org/', type: 'code', level: null, desc: 'Open-source photogrammetric reconstruction pipeline. Processes underwater photo sets into 3D models. Alternative to commercial Metashape for reef mapping.' },
          { title: 'PAMGuard — Passive Acoustic Monitoring Software', author: 'PAMGuard', year: null, url: 'https://www.pamguard.org/', type: 'code', level: null, desc: 'Open-source software for detecting and classifying marine mammal sounds from hydrophone data. Click detectors, whistle classifiers, and bearing estimation.' },
          { title: 'Ketos — Deep Learning for Underwater Acoustics', author: 'Meridian / JASCO', year: null, url: 'https://docs.meridian.cs.dal.ca/ketos/', type: 'code', level: null, desc: 'Python framework for training and deploying deep learning models for underwater acoustic data. Spectrogram-based species classification out of the box.' },
          { title: 'QGIS — Open Source GIS', author: 'QGIS Project', year: null, url: 'https://qgis.org/', type: 'code', level: null, desc: 'Free geographic information system for mapping dive sites, reef coverage, marine protected areas, and spatial analysis of ocean data. Essential for any marine spatial work.' },
          { title: 'R-package "oce" — Oceanographic Data Analysis', author: 'Kelley & Richards', year: null, url: 'https://cran.r-project.org/web/packages/oce/', type: 'code', level: null, desc: 'R package for reading, processing, and visualizing CTD profiles, current meter data, satellite altimetry, and other standard oceanographic data types.' }
        ]
      }
    ]
  },

  // ============================================================
  // SECTION 11: ORGANIZATIONS & EXPEDITIONS
  // ============================================================
  {
    id: 'orgs',
    title: 'Organizations & Expeditions',
    icon: '\u{1F3DB}',
    intro: `<p>The institutions, programs, and expeditions advancing ocean science and underwater research. These are the communities to connect with, the programs to train through, and the expeditions to follow or join.</p>`,
    subsections: [
      {
        title: 'Research Institutions',
        resources: [
          { title: 'MBARI — Monterey Bay Aquarium Research Institute', author: null, year: null, url: 'https://www.mbari.org/', type: 'notes', level: null, desc: 'David Packard\'s vision: the most advanced marine technology institute in the world. ROVs, AUVs, eDNA processors, deep-sea cameras, and the VARS annotation system. The gold standard.' },
          { title: 'Woods Hole Oceanographic Institution (WHOI)', author: null, year: null, url: 'https://www.whoi.edu/', type: 'notes', level: null, desc: 'The world\'s largest private oceanographic research institution. Operates Alvin submersible. Discovered the Titanic wreck and hydrothermal vents. Deep ocean exploration leadership.' },
          { title: 'Scripps Institution of Oceanography', author: null, year: null, url: 'https://scripps.ucsd.edu/', type: 'notes', level: null, desc: 'UC San Diego\'s oceanographic powerhouse. Runs the 100 Island Challenge, Argo program support, and pioneering climate/ocean research since 1903.' },
          { title: 'Schmidt Ocean Institute', author: null, year: null, url: 'https://schmidtocean.org/', type: 'notes', level: null, desc: 'Eric Schmidt-funded institute operating R/V Falkor (too). Free ship time for researchers. ROV SuBastian for deep-sea exploration. Open data policy.' },
          { title: 'NOAA Ocean Exploration', author: null, year: null, url: 'https://oceanexplorer.noaa.gov/', type: 'notes', level: null, desc: 'NOAA\'s deep-ocean exploration program. Operates Okeanos Explorer with ROV Deep Discoverer. Live-streams deep-sea exploration. Mapped more unknown seafloor than any other program.' }
        ]
      },
      {
        title: 'Dive Training Organizations',
        resources: [
          { title: 'GUE — Global Underwater Explorers', author: null, year: null, url: 'https://www.gue.com/', type: 'course', level: null, desc: 'The highest standard in dive training. Team-based, equipment-standardized, skill-intensive. Fundamentals through cave, wreck, and rebreather. Where Sea Lion\'s dive standards will benchmark.' },
          { title: 'PADI — Professional Association of Diving Instructors', author: null, year: null, url: 'https://www.padi.com/', type: 'course', level: null, desc: 'The world\'s largest dive training organization. Open Water through Divemaster and Instructor. The entry point for recreational diving. Sea Lion\'s customer pipeline.' },
          { title: 'DAN — Divers Alert Network', author: null, year: null, url: 'https://www.diversalertnetwork.org/', type: 'notes', level: null, desc: 'Dive safety and medical research. Dive accident insurance, emergency hotline, hyperbaric medicine referrals. Runs the largest dive incident reporting database. Essential partnership.' },
          { title: 'NAUI — National Association of Underwater Instructors', author: null, year: null, url: 'https://www.naui.org/', type: 'course', level: null, desc: 'Established 1960. Emphasis on diver education and autonomy. Scientific diving programs. Strong heritage in underwater research training.' },
          { title: 'TDI/SDI — Technical Diving International', author: null, year: null, url: 'https://www.tdisdi.com/', type: 'course', level: null, desc: 'Technical diving education. Extended range, trimix, CCR, cave, and wreck penetration certifications. The pathway from recreational to exploration diving.' }
        ]
      },
      {
        title: 'Conservation & Citizen Science Programs',
        resources: [
          { title: 'Mission Blue — Sylvia Earle Alliance', author: null, year: null, url: 'https://missionblue.org/', type: 'notes', level: null, desc: 'Dr. Sylvia Earle\'s initiative to establish a global network of Hope Spots — marine protected areas. National Geographic support. The moral compass of ocean conservation.' },
          { title: 'Ocean Conservancy', author: null, year: null, url: 'https://oceanconservancy.org/', type: 'notes', level: null, desc: 'Science-based ocean conservation. International Coastal Cleanup (largest volunteer ocean conservation event). Plastic pollution, sustainable fisheries, marine protected areas.' },
          { title: 'Coral Restoration Foundation', author: null, year: null, url: 'https://www.coralrestoration.org/', type: 'notes', level: null, desc: 'The world\'s largest coral reef restoration organization. Operates underwater nurseries growing 40,000+ corals in the Florida Keys. Volunteer dive programs — plant corals yourself.' },
          { title: 'Project AWARE — Scuba Divers Protecting the Ocean', author: null, year: null, url: 'https://www.projectaware.org/', type: 'notes', level: null, desc: 'PADI-affiliated conservation nonprofit. Dive Against Debris data collection. Shark and ray conservation. Turns recreational divers into ocean advocates and data collectors.' },
          { title: 'The Ocean Cleanup', author: null, year: null, url: 'https://theoceancleanup.com/', type: 'notes', level: null, desc: 'Engineering-first approach to removing plastic from the ocean. Interceptors for rivers, System 03 for the Great Pacific Garbage Patch. The engineering-scale response to ocean pollution.' }
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
