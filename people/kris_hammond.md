# Kristian J. Hammond
## Academic Mentor | Northwestern MSAI Director | Case-Based Reasoning Pioneer

---

## Identity

**Name:** Kristian J. Hammond
**Title:** Bill and Cathy Osborn Professor of Computer Science
**Institution:** Northwestern University, McCormick School of Engineering
**Lab:** C3 Lab (Cognition, Creativity, Communication)
**Roles:**
- Founding Director, Master of Science in Artificial Intelligence Program
- Director, Center for Advancing Safety of Machine Intelligence (CASMI)
- Director, CS+X Initiative
- Co-Founder, Narrative Science (acquired by Salesforce, 2021)

**Education:**
| Institution | Degree |
|-------------|--------|
| Yale University | Ph.D. Computer Science |
| Yale University | M.S. Computer Science |
| Yale University | B.A. Philosophy |

**Fellowship:** Association for the Advancement of Artificial Intelligence (AAAI), 2023

---

## Intellectual Lineage

Hammond studied under **Roger Schank** at Yale's AI Lab. Schank pioneered conceptual dependency theory and dynamic memory — the idea that memory is predominantly episodic, richly indexed, and changes in organization over time. Human reasoning is not the application of rules to situations. It is the retrieval, adaptation, and reindexing of prior experience.

This is the tradition Hammond inherited and carried forward: **memory before abstraction**.

---

## The CHEF System

Hammond's doctoral dissertation introduced **CHEF**, a case-based planning system that generates new plans by retrieving and adapting old ones. The domain was Szechwan cooking.

### How CHEF Works

Given a goal (make a stir fry with chicken and broccoli), CHEF:

1. **Retrieves** the most similar prior case from memory (a beef and green pepper stir fry)
2. **Adapts** the old plan to fit the new situation:
   - Substitutes chicken for beef
   - Adds a bone-removal step (chicken has bones, beef doesn't)
   - Lengthens cooking time (broccoli is denser than green pepper)
3. **Executes** the adapted plan
4. **Evaluates** the result
5. **Stores** the outcome — success or failure — with causal annotations for future retrieval

### Why CHEF Matters

CHEF demonstrated that planning is not search through an abstract space of operators. **Planning is a memory task.** A planner that remembers what happened last time — including what went wrong and why — outperforms a planner that reasons from first principles every time.

The key insight: past experiences, organized by goals satisfied and failures avoided, are more useful than rules.

---

## Case-Based Reasoning (CBR)

Hammond's work at Yale and beyond established core principles of case-based reasoning:

### The CBR Cycle

```
RETRIEVE → ADAPT → EXECUTE → EVALUATE → STORE
     ↑                                      |
     └──────────────────────────────────────┘
```

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Memory is episodic** | Experience is the primary content of memory, not rules |
| **Memory is richly indexed** | Cases are connected by goals, failures, features, and outcomes |
| **Memory is dynamic** | Organization changes as new experiences are accumulated |
| **Adaptation requires domain knowledge** | You cannot blindly swap components — you must understand why the original plan worked |
| **Failures are first-class** | Failed plans, annotated with causal explanations, prevent future failures |

### CBR vs. Rule-Based Reasoning

| Rule-Based | Case-Based |
|------------|------------|
| Hand-authored rules | Accumulated experience |
| Applies general principles to specific cases | Adapts specific cases to new situations |
| Brittle when rules conflict or don't cover | Gracefully degrades — always has a nearest case |
| Knowledge engineering bottleneck | Learns from use |
| Explanation = rule chain | Explanation = "here's what happened last time" |

---

## Narrative Science & Quill

In 2010, Hammond co-founded **Narrative Science** with Larry Birnbaum. The company built **Quill**, a natural language generation platform that converts structured data into human-readable narratives.

### The Quill Insight

Most NLG systems start with data and template it into text. Quill inverted this:

1. Start with the **communication intent** — what does the audience need to understand?
2. Analyze the data for what is **important and interesting** relative to that intent
3. Structure a **narrative** with context, significance, and relevance
4. Generate natural language at scale

Quill generated earnings reports, sports recaps, portfolio reviews, and business intelligence narratives. It didn't summarize data — it explained data. The difference is intent.

Salesforce acquired Narrative Science in 2021 and integrated Quill into Tableau.

### Why Narrative Science Matters for Charlotte

Quill proved that **explanation is not summarization**. Explanation requires understanding what the audience needs, what is significant in the data, and how to structure a narrative that serves the user. This is the same principle Charlotte encodes: explanation is evidence-backed narration, not inference.

---

## The C3 Lab

Hammond's current research lab at Northwestern — **Cognition, Creativity, Communication** — builds systems that bridge the gap between raw data and human understanding.

### Active Projects

| Project | Domain | Focus |
|---------|--------|-------|
| **SCALES** | Legal systems | Conversational access to federal court data without technical expertise |
| **Mim** | Information retrieval | Conversational companion for querying unstructured text through dialogue |
| **Otus** | Education | Mining school operational data for personalized instruction insights |
| **CASMI** | AI safety | Operationalizing safety in machine intelligence — concrete harms, not speculative risk |
| **Academic Advisor** | Education | Navigating course selection through consolidated institutional knowledge |

The common thread: **make data accessible to humans who are not data-fluent, through conversation and narrative.**

---

## CASMI: AI Safety as Concrete Practice

Hammond directs the **Center for Advancing Safety of Machine Intelligence**, a collaboration between Northwestern and UL Research Institutes.

His position on AI safety is distinctive:

> Focus on present, concrete harms — not speculative existential risks.

CASMI researches:
- AI incident tracking and documentation
- Fairness and bias in deployed systems
- Human-AI decision-making reliability
- Data-driven policing ethics
- Deepfake detection
- Language model safety evaluation

This is safety as engineering discipline, not philosophy seminar.

---

## Teaching Philosophy

Hammond founded Northwestern's MSAI program and directed its first cohort (2018-2019) — the cohort Jack was part of.

His teaching philosophy:

> "My job is not to answer questions. My job is to teach you how to think, how to solve problems, and how to break down challenges into components."

This maps directly to how he thinks about AI:

> "Systems such as ChatGPT aren't looking for the right answer; they are looking for the most likely answer."

The distinction between **correct** and **likely** is everything. A system that returns the most probable response is doing pattern completion. A system that retrieves relevant experience, adapts it to the current situation, and explains its reasoning — that is intelligence.

---

## The Line from Hammond to Charlotte

### 1. Memory Before Abstraction

**Hammond:** Intelligence is not the application of abstract rules. It is the retrieval and adaptation of specific experiences stored in an organized, dynamic memory. CHEF doesn't know "rules of cooking" — it remembers what happened last time.

**Charlotte:** History is append-only. Signal history is accumulated experience. Completed lifecycles are sealed cases. The system does not abstract away from specifics — it preserves them. Meaning emerges from traversal of the record, not from generalized rules applied to snapshots.

### 2. Planning Is a Memory Task

**Hammond:** A planner that remembers prior plans and adapts them outperforms a planner that reasons from scratch. Past experience, indexed by goals and failures, is the primary resource.

**Charlotte:** Protocols are not generated from abstract optimization. They are expectations layered on accumulated signal history. When Charlotte proposes a course correction, it is adapting from observed trajectories — not deriving from first principles.

### 3. Failures Are First-Class

**Hammond:** CHEF stores failures with causal annotations. A plan that failed — and the explanation of why — is more valuable than a plan that succeeded without annotation. Failure cases prevent future failures.

**Charlotte:** Deviations from protocol expectations are signals, not errors to suppress. When reality diverges from expectation, that divergence is recorded, explained, and preserved. The gap between expected and observed is where knowledge lives.

### 4. Explanation Is Narration, Not Summarization

**Hammond/Narrative Science:** Quill doesn't template data into sentences. It understands communication intent, identifies what matters, and structures a narrative. The audience determines the explanation.

**Charlotte:** Explanation is evidence-backed narration. The agent does not summarize the graph — it narrates the trajectory with provenance. Every claim traces to source facts. The explanation serves the user's context, not a generic summary.

### 5. Data Should Serve Humans, Not Require Them to Be Data-Fluent

**Hammond/C3 Lab:** SCALES makes court data accessible through conversation. Mim makes encyclopedias queryable through dialogue. Otus turns school data into teacher insights. The human should never need to learn the system's language.

**Charlotte:** Five UI modes — Upcoming, Node, Calendar, Timeline, Agent — are different camera angles on the same graph. Users see what matters to them. The substrate is complex; the surface is conversational. Industry meaning is introduced through configuration, not through requiring users to understand graph theory.

### 6. Concrete Over Speculative

**Hammond/CASMI:** AI safety means tracking real incidents, measuring real bias, evaluating real decision-making failures. Not hypothetical superintelligence scenarios.

**Charlotte:** The system shows what *is* happening, not what *might* happen. Prediction is a byproduct of clean observation, not the purpose. The mirror reflects reality; speculation is the user's job.

---

## The Roger Schank → Kris Hammond → Charlotte Thread

There is a direct intellectual genealogy:

| Generation | Researcher | Core Contribution | Charlotte Echo |
|------------|-----------|-------------------|----------------|
| **Schank** (Yale) | Dynamic memory, conceptual dependency, scripts | Memory is episodic, indexed, and dynamic | Append-only history, signal indexing |
| **Hammond** (Yale → Chicago → Northwestern) | Case-based planning, CHEF, Narrative Science | Planning is memory retrieval + adaptation; explanation is narrative | Protocol as adapted expectation; agent as narrator |
| **Charlotte** (Jack Richard, Northwestern MSAI) | Graph-native substrate for observable reality | The system *is* the memory. Experience accumulates as facts. Explanation emerges from traversal. | — |

Schank said memory is how we think. Hammond proved planning is how we remember. Charlotte makes the memory observable, immutable, and shared.

---

## Key Publications

- **"Case-Based Planning: Viewing Planning as a Memory Task"** — Academic Press, 1989. The book-length treatment of CHEF and case-based planning.
- **"CHEF: A Model of Case-Based Planning"** — Proceedings of AAAI-86. The original paper introducing CHEF.
- **"Case-Based Planning: A Framework for Planning from Experience"** — Cognitive Science, 1990. The theoretical framework.
- **"Practical Artificial Intelligence for Dummies"** — Wiley (Narrative Science special edition). Hammond's accessible introduction to applied AI.

---

## Links

- C3 Lab: https://c3lab.northwestern.edu/
- CASMI: https://casmi.northwestern.edu/
- Faculty Page: https://www.mccormick.northwestern.edu/research-faculty/directory/profiles/hammond-kristian.html
- Northwestern MSAI: https://www.mccormick.northwestern.edu/artificial-intelligence/

---

*Document compiled from Northwestern faculty profiles, C3 Lab and CASMI web resources, Narrative Science coverage, AAAI publications, and author-provided context on intellectual lineage.*
