// Atomic Design Reference — data + rendering

const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '\u269B',
    intro: `<p><strong>Atomic Design</strong> is a methodology for creating design systems, introduced by <em>Brad Frost</em> in 2013. It borrows from chemistry: interfaces are composed of <strong>atoms</strong> (basic HTML elements), <strong>molecules</strong> (simple component groups), <strong>organisms</strong> (complex UI assemblies), <strong>templates</strong> (page-level wireframes), and <strong>pages</strong> (specific instances with real content).</p>
<p>This reference maps the <strong>convex hull</strong> of design system knowledge — the complete boundary enclosing every discipline you need to build robust, scalable, human-centered interfaces. From color science and typography at the atomic level, through interaction patterns and accessibility at the molecular level, to HCI theory, perception research, and game-theoretic decision design at the systemic level.</p>
<h3>How to use this reference</h3>
<p>Ten sections span the full knowledge space. Each opens with a conceptual introduction, then provides curated resources tagged by <em>type</em> (book, paper, video, course, code, tool, notes) and <em>level</em> (beginner, intermediate, advanced). Use the filters and search to navigate.</p>
<h3>Suggested learning paths</h3>
<ol>
<li><strong>Design system builder:</strong> Atoms \u2192 Molecules \u2192 Organisms \u2192 Templates &amp; Pages \u2192 Design Systems at Scale</li>
<li><strong>Theory-first:</strong> Color Theory \u2192 Perception &amp; Cognition \u2192 HCI \u2192 Game Theory &amp; Decision Design</li>
<li><strong>Practitioner:</strong> Overview \u2192 Atoms \u2192 Molecules \u2192 Organisms \u2192 Design Systems at Scale</li>
<li><strong>Researcher:</strong> Perception &amp; Cognition \u2192 HCI \u2192 Color Theory \u2192 Game Theory &amp; Decision Design</li>
</ol>
<h3>The big ideas</h3>
<ul>
<li><strong>Atomic hierarchy</strong> — interfaces decompose into five levels of increasing complexity</li>
<li><strong>Design tokens</strong> — the subatomic particles: named values (colors, spacing, type scales) that encode design decisions</li>
<li><strong>Gestalt principles</strong> — how humans perceive grouped elements as coherent wholes</li>
<li><strong>Cognitive load</strong> — every design decision either adds to or reduces the mental effort required of users</li>
<li><strong>Choice architecture</strong> — how the structure of options shapes human decisions (game theory meets UX)</li>
<li><strong>Accessibility</strong> — inclusive design is not optional; it is a fundamental constraint at every level</li>
</ul>`,
    subsections: []
  },
  {
    id: 'atoms',
    title: 'Atoms — Foundations',
    icon: '\u26AB',
    intro: `<p><strong>Atoms</strong> are the foundational building blocks of a design system — the smallest meaningful units that cannot be broken down further while remaining functional. In HTML terms, atoms are individual elements: buttons, inputs, labels, headings, colors, fonts, and spacing values.</p>
<p>At this level, we establish the fundamental design decisions that cascade through every layer above:</p>
<ul>
<li><strong>Color fundamentals</strong> — choosing palettes, understanding contrast, encoding meaning through hue</li>
<li><strong>Typography</strong> — selecting typefaces, establishing scales, ensuring readability</li>
<li><strong>Spacing &amp; scale</strong> — creating consistent spatial rhythms using mathematical relationships</li>
<li><strong>Iconography</strong> — universal symbols, icon grids, and visual language</li>
</ul>
<p>Get atoms right and everything above them inherits coherence. Get them wrong and no amount of component engineering can compensate.</p>`,
    subsections: [
      {
        title: 'Foundational Texts',
        resources: [
          { title: 'Atomic Design', author: 'Brad Frost', year: 2016, url: 'https://atomicdesign.bradfrost.com/', type: 'book', level: 'beginner', desc: 'The definitive text on atomic design methodology. Free to read online. Covers atoms through pages with practical examples.' },
          { title: 'The Elements of Typographic Style', author: 'Robert Bringhurst', year: 1992, url: 'https://www.goodreads.com/book/show/44735.The_Elements_of_Typographic_Style', type: 'book', level: 'intermediate', desc: 'The typographer\'s bible. Covers rhythm, proportion, harmony, and the relationship between type and the page.' },
          { title: 'Interaction of Color', author: 'Josef Albers', year: 1963, url: 'https://yalebooks.yale.edu/book/9780300179354/interaction-of-color/', type: 'book', level: 'beginner', desc: 'Foundational exploration of how colors behave in relation to each other. Changed how artists and designers understand color perception.' },
          { title: 'A Type Primer', author: 'John Kane', year: 2011, url: 'https://www.goodreads.com/book/show/926222.A_Type_Primer', type: 'book', level: 'beginner', desc: 'Clear, practical introduction to typography. Covers anatomy of letterforms, setting type, and designing with type.' },
          { title: 'Design Systems', author: 'Alla Kholmatova', year: 2017, url: 'https://www.smashingmagazine.com/design-systems-book/', type: 'book', level: 'beginner', desc: 'Practical guide to creating effective design systems. Covers patterns, practices, and principles from real-world systems.' }
        ]
      },
      {
        title: 'Color Fundamentals',
        resources: [
          { title: 'A Nerd\'s Guide to Color on the Web', author: 'Sarah Drasner', year: 2020, url: 'https://css-tricks.com/nerds-guide-color-web/', type: 'notes', level: 'beginner', desc: 'Comprehensive guide to color on the web: hex, RGB, HSL, and newer color spaces. Practical and well-illustrated.' },
          { title: 'Color & Contrast (Accessible Color Guide)', author: 'Aatash Parikh', year: 2021, url: 'https://colorandcontrast.com/', type: 'tool', level: 'beginner', desc: 'Interactive guide to accessible color combinations. Visualizes WCAG contrast ratios with real-time preview.' },
          { title: 'OKLCH Color Picker & Converter', author: 'Evil Martians', year: 2022, url: 'https://oklch.com/', type: 'tool', level: 'intermediate', desc: 'Interactive OKLCH color picker. OKLCH is the most perceptually uniform color space available in CSS.' },
          { title: 'Practical Color Theory for People Who Code', author: 'Natalya Shelburne', year: 2015, url: 'https://tallys.github.io/color-theory/', type: 'notes', level: 'beginner', desc: 'Color theory translated for developers. Covers hue, saturation, lightness, and building palettes programmatically.' },
          { title: 'Accessible Color Systems (Stripe)', author: 'Daryl Koopersmith & Wilson Miner', year: 2019, url: 'https://stripe.com/blog/accessible-color-systems', type: 'notes', level: 'intermediate', desc: 'How Stripe built an accessible color system. Methodology for generating palettes that meet WCAG AA across all combinations.' }
        ]
      },
      {
        title: 'Typography',
        resources: [
          { title: 'Practical Typography', author: 'Matthew Butterick', year: 2013, url: 'https://practicaltypography.com/', type: 'book', level: 'beginner', desc: 'Free online book covering typography essentials: font choice, page margins, line spacing, and body text formatting.' },
          { title: 'Responsive Typography: The Basics', author: 'Jason Pamental', year: 2014, url: 'https://www.goodreads.com/book/show/23131622-responsive-typography', type: 'book', level: 'intermediate', desc: 'How typography adapts across screen sizes. Covers fluid type, viewport units, and responsive type scales.' },
          { title: 'Type Scale', author: 'Jeremy Church', year: 2019, url: 'https://typescale.com/', type: 'tool', level: 'beginner', desc: 'Visual calculator for building type scales based on musical intervals (major third, perfect fourth, etc.).' },
          { title: 'Variable Fonts Guide', author: 'MDN Web Docs', year: 2023, url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide', type: 'notes', level: 'intermediate', desc: 'Comprehensive guide to OpenType variable fonts in CSS. Weight, width, slant, and custom axes.' },
          { title: 'Thinking with Type', author: 'Ellen Lupton', year: 2010, url: 'https://www.goodreads.com/book/show/69736.Thinking_with_Type', type: 'book', level: 'beginner', desc: 'Widely used design school textbook. Covers letter, text, and grid with historical context and practical exercises.' }
        ]
      },
      {
        title: 'Spacing & Scale',
        resources: [
          { title: 'Space in Design Systems', author: 'Nathan Curtis', year: 2016, url: 'https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62', type: 'notes', level: 'intermediate', desc: 'Definitive guide to spacing in design systems. Covers inset, stack, inline, and grid spacing models.' },
          { title: 'The 8-Point Grid System', author: 'Spec.fm', year: 2016, url: 'https://spec.fm/specifics/8-pt-grid', type: 'notes', level: 'beginner', desc: 'Why 8px is the most popular base unit for spacing grids. Aligns to common screen densities and creates visual rhythm.' },
          { title: 'Modular Scale', author: 'Tim Brown & Scott Kellum', year: 2012, url: 'https://www.modularscale.com/', type: 'tool', level: 'beginner', desc: 'Calculator for creating proportional scales using musical ratios. Applicable to type, spacing, and layout.' },
          { title: 'Layout and Composition', author: 'Alex White', year: 2011, url: 'https://www.goodreads.com/book/show/579394.The_Elements_of_Graphic_Design', type: 'book', level: 'intermediate', desc: 'The Elements of Graphic Design. Covers space, unity, page architecture, and the use of white space.' }
        ]
      },
      {
        title: 'Iconography & Symbols',
        resources: [
          { title: 'The Noun Project', author: 'Noun Project', year: 2010, url: 'https://thenounproject.com/', type: 'tool', level: 'beginner', desc: 'Library of over 5 million icons. Useful for understanding icon conventions and visual metaphors.' },
          { title: 'Phosphor Icons', author: 'Tobias Fried & Helena Zhang', year: 2020, url: 'https://phosphoricons.com/', type: 'tool', level: 'beginner', desc: 'Flexible icon family with 6 weights. Well-designed system that demonstrates consistent icon design principles.' },
          { title: 'Icon Usability (NNG)', author: 'Aurora Harley, Nielsen Norman Group', year: 2014, url: 'https://www.nngroup.com/articles/icon-usability/', type: 'notes', level: 'beginner', desc: 'Research-based guidelines for icon design: when to use icons alone, with labels, and recognition vs. recall.' },
          { title: 'Designing Better Icons', author: 'Scott Lewis', year: 2019, url: 'https://www.youtube.com/watch?v=0SDoXKe0wPQ', type: 'video', level: 'beginner', desc: 'Practical guide to icon design: grid systems, optical alignment, stroke consistency, and metaphor selection.' }
        ]
      }
    ]
  },
  {
    id: 'molecules',
    title: 'Molecules — Composition',
    icon: '\u2B21',
    intro: `<p><strong>Molecules</strong> are groups of atoms bonded together into the smallest fundamental units of a UI that do something useful. A search form molecule combines a label atom, an input atom, and a button atom. Individually those atoms are inert; together they accomplish a task.</p>
<p>At this level, we study:</p>
<ul>
<li><strong>Component composition</strong> — how to combine atoms into reusable, cohesive groups</li>
<li><strong>Form design</strong> — the science of input collection, validation, and error handling</li>
<li><strong>Micro-interactions</strong> — small animations and feedback that communicate state changes</li>
<li><strong>Accessibility patterns</strong> — ARIA roles, keyboard navigation, focus management at the component level</li>
</ul>
<p>Good molecules are <em>single-responsibility</em>: each does one thing well. They are portable, testable, and composable into the more complex organisms above.</p>`,
    subsections: [
      {
        title: 'Component Composition',
        resources: [
          { title: 'Designing Interfaces', author: 'Jenifer Tidwell, Charles Brewer & Aynne Valencia', year: 2020, url: 'https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/', type: 'book', level: 'intermediate', desc: 'Pattern library of UI components: navigation, lists, forms, actions, and information display. Third edition covers mobile and responsive.' },
          { title: 'Refactoring UI', author: 'Adam Wathan & Steve Schoger', year: 2018, url: 'https://www.refactoringui.com/', type: 'book', level: 'beginner', desc: 'Practical design tips for developers. Covers hierarchy, spacing, color, typography, and component design with before/after examples.' },
          { title: 'Component-Driven Development', author: 'Chromatic (Storybook)', year: 2020, url: 'https://www.componentdriven.org/', type: 'notes', level: 'beginner', desc: 'Methodology for building UIs from the bottom up: components in isolation, compose into screens, iterate with real data.' },
          { title: 'Patterns.dev — Component Patterns', author: 'Lydia Hallie & Addy Osmani', year: 2022, url: 'https://www.patterns.dev/', type: 'notes', level: 'intermediate', desc: 'Modern web development patterns including compound components, render props, hooks patterns, and performance optimization.' },
          { title: 'Compound Components Pattern', author: 'Kent C. Dodds', year: 2018, url: 'https://kentcdodds.com/blog/compound-components-with-react-hooks', type: 'notes', level: 'intermediate', desc: 'How to build flexible molecule-level components using the compound component pattern. Shares implicit state between children.' }
        ]
      },
      {
        title: 'Form Design',
        resources: [
          { title: 'Web Form Design', author: 'Luke Wroblewski', year: 2008, url: 'https://rosenfeldmedia.com/books/web-form-design/', type: 'book', level: 'beginner', desc: 'The definitive guide to form UX. Covers label placement, input types, validation, error handling, and progressive disclosure.' },
          { title: 'Form Design Patterns', author: 'Adam Silver', year: 2018, url: 'https://www.smashingmagazine.com/printed-books/form-design-patterns/', type: 'book', level: 'intermediate', desc: 'Practical patterns for accessible, usable forms. Registration, checkout, filtering, and complex multi-step forms.' },
          { title: 'Inline Validation in Web Forms (Research)', author: 'Luke Wroblewski', year: 2009, url: 'https://alistapart.com/article/inline-validation-in-web-forms/', type: 'paper', level: 'beginner', desc: 'Eye-tracking study showing how inline validation improves form completion. Evidence-based form design.' },
          { title: 'Best Practices for Form Design (Google)', author: 'Google Web Fundamentals', year: 2020, url: 'https://web.dev/learn/forms', type: 'course', level: 'beginner', desc: 'Google\'s guide to modern form design. Covers input types, autocomplete, validation, and accessibility.' }
        ]
      },
      {
        title: 'Micro-Interactions',
        resources: [
          { title: 'Microinteractions: Designing with Details', author: 'Dan Saffer', year: 2013, url: 'https://www.oreilly.com/library/view/microinteractions/9781491945957/', type: 'book', level: 'beginner', desc: 'The definitive book on micro-interactions. Covers triggers, rules, feedback, and loops/modes for small design moments.' },
          { title: 'The Illusion of Life: Disney Animation', author: 'Ollie Johnston & Frank Thomas', year: 1981, url: 'https://www.goodreads.com/book/show/106889.The_Illusion_of_Life', type: 'book', level: 'intermediate', desc: 'Disney\'s 12 principles of animation. Squash, stretch, anticipation, and follow-through apply directly to UI motion design.' },
          { title: 'Animation Principles for the Web', author: 'Rachel Nabors', year: 2016, url: 'https://rachelnabors.com/css-animations-guide/', type: 'notes', level: 'beginner', desc: 'Applies animation principles to web interfaces. Easing, timing, and the psychology of perceived performance.' },
          { title: 'Material Motion Guidelines', author: 'Google Material Design', year: 2021, url: 'https://m3.material.io/styles/motion/overview', type: 'notes', level: 'intermediate', desc: 'Google\'s comprehensive motion design system. Transition patterns, easing curves, and duration guidelines.' },
          { title: 'Designing Interface Animation', author: 'Val Head', year: 2016, url: 'https://rosenfeldmedia.com/books/designing-interface-animation/', type: 'book', level: 'intermediate', desc: 'Meaningful motion in UI design. Covers animation purpose, performance, choreography, and building an animation style guide.' }
        ]
      },
      {
        title: 'Accessibility Patterns',
        resources: [
          { title: 'Inclusive Components', author: 'Heydon Pickering', year: 2018, url: 'https://inclusive-components.design/', type: 'book', level: 'intermediate', desc: 'Pattern library of accessible component implementations. Toggle buttons, tabbed interfaces, data tables, tooltips, and more.' },
          { title: 'WAI-ARIA Authoring Practices', author: 'W3C', year: 2023, url: 'https://www.w3.org/WAI/ARIA/apg/', type: 'notes', level: 'intermediate', desc: 'Official W3C patterns for accessible widgets. Accordion, breadcrumb, carousel, dialog, menu, tabs, tree view, and more.' },
          { title: 'A Web for Everyone', author: 'Sarah Horton & Whitney Quesenbery', year: 2014, url: 'https://rosenfeldmedia.com/books/a-web-for-everyone/', type: 'book', level: 'beginner', desc: 'Accessible UX design from personas through implementation. Bridges the gap between accessibility standards and user experience.' },
          { title: 'Accessibility for Everyone', author: 'Laura Kalbag', year: 2017, url: 'https://abookapart.com/products/accessibility-for-everyone', type: 'book', level: 'beginner', desc: 'Concise introduction to web accessibility. Covers disabilities, guidelines, content, design, and development practices.' },
          { title: 'axe-core Accessibility Testing', author: 'Deque Systems', year: 2020, url: 'https://github.com/dequelabs/axe-core', type: 'code', level: 'intermediate', desc: 'Industry-standard accessibility testing engine. Automated WCAG 2.1 checking that integrates into development workflows.' }
        ]
      }
    ]
  },
  {
    id: 'organisms',
    title: 'Organisms — Complex Components',
    icon: '\uD83E\uDDE9',
    intro: `<p><strong>Organisms</strong> are relatively complex UI components composed of groups of molecules and atoms. They form distinct sections of an interface — a header with logo, navigation, and search; a product card grid; a data table with sorting and pagination.</p>
<p>At this level, components start to feel like recognizable interface sections:</p>
<ul>
<li><strong>Navigation systems</strong> — primary nav, breadcrumbs, sidebars, command palettes</li>
<li><strong>Data display</strong> — tables, charts, dashboards, data-dense interfaces</li>
<li><strong>Content patterns</strong> — card layouts, media objects, article templates</li>
<li><strong>Responsive components</strong> — components that adapt their internal layout at different sizes</li>
</ul>
<p>The challenge at the organism level is managing <em>complexity</em>: state management, data flow between sub-components, responsive behavior, and performance under real-world data loads.</p>`,
    subsections: [
      {
        title: 'Navigation Systems',
        resources: [
          { title: 'Don\'t Make Me Think', author: 'Steve Krug', year: 2014, url: 'https://www.goodreads.com/book/show/18197267-don-t-make-me-think-revisited', type: 'book', level: 'beginner', desc: 'The classic web usability book. Covers navigation conventions, homepage design, and usability testing in plain language.' },
          { title: 'Information Architecture', author: 'Louis Rosenfeld, Peter Morville & Jorge Arango', year: 2015, url: 'https://www.oreilly.com/library/view/information-architecture-4th/9781491911679/', type: 'book', level: 'intermediate', desc: 'The polar bear book. Comprehensive guide to organizing information: taxonomy, navigation systems, search, and labeling.' },
          { title: 'Navigation Patterns for Responsive Design', author: 'Brad Frost', year: 2012, url: 'https://bradfrost.com/blog/post/responsive-nav-patterns/', type: 'notes', level: 'beginner', desc: 'Survey of responsive navigation patterns: hamburger, priority+, toggle, footer anchor, and multi-level approaches.' },
          { title: 'Command Palette Pattern', author: 'Maggie Appleton', year: 2022, url: 'https://maggieappleton.com/command-bar', type: 'notes', level: 'intermediate', desc: 'Analysis of the command palette pattern (Cmd+K). How keyboard-driven navigation is reshaping complex application UIs.' }
        ]
      },
      {
        title: 'Data Display',
        resources: [
          { title: 'The Visual Display of Quantitative Information', author: 'Edward Tufte', year: 1983, url: 'https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/', type: 'book', level: 'intermediate', desc: 'The foundational text on data visualization. Data-ink ratio, chartjunk, graphical integrity, and the principles of graphical excellence.' },
          { title: 'Envisioning Information', author: 'Edward Tufte', year: 1990, url: 'https://www.edwardtufte.com/book/envisioning-information/', type: 'book', level: 'intermediate', desc: 'How to present complex information on a 2D surface. Escaping flatland, micro/macro readings, layering, and small multiples.' },
          { title: 'Visualization Analysis & Design', author: 'Tamara Munzner', year: 2014, url: 'https://www.cs.ubc.ca/~tmm/vadbook/', type: 'book', level: 'advanced', desc: 'Systematic framework for visualization design. What-why-how analysis, marks and channels, spatial layout, and evaluation.' },
          { title: 'D3.js — Data-Driven Documents', author: 'Mike Bostock', year: 2011, url: 'https://d3js.org/', type: 'code', level: 'intermediate', desc: 'The definitive JavaScript library for data visualization. Bindable data, transitions, and SVG/Canvas rendering.' },
          { title: 'Observable Plot', author: 'Observable', year: 2022, url: 'https://observablehq.com/plot/', type: 'code', level: 'beginner', desc: 'High-level charting library built on D3. Concise API for exploratory data visualization with sensible defaults.' },
          { title: 'Data Tables Design Patterns', author: 'Andrew Coyle', year: 2016, url: 'https://medium.com/nextux/design-better-data-tables-4ecc99d23356', type: 'notes', level: 'beginner', desc: 'Comprehensive survey of data table patterns: fixed headers, sorting, filtering, pagination, row expansion, and inline editing.' }
        ]
      },
      {
        title: 'Content Patterns',
        resources: [
          { title: 'Every Layout', author: 'Andy Bell & Heydon Pickering', year: 2019, url: 'https://every-layout.dev/', type: 'book', level: 'intermediate', desc: 'CSS layout primitives that compose into any interface: Stack, Sidebar, Cluster, Center, Cover, Grid, Frame, and Switcher.' },
          { title: 'Cards: UI Component Design', author: 'Nielsen Norman Group', year: 2016, url: 'https://www.nngroup.com/articles/cards-component/', type: 'notes', level: 'beginner', desc: 'Research-based guidelines for card design: content hierarchy, interaction, sizing, and common card anti-patterns.' },
          { title: 'UI Patterns (Collection)', author: 'Anders Toxboe', year: 2012, url: 'https://ui-patterns.com/', type: 'tool', level: 'beginner', desc: 'Large collection of UI design patterns. Input, navigation, content, social, and e-commerce patterns with examples.' },
          { title: 'Container Queries: A Quick Start Guide', author: 'Ahmad Shadeed', year: 2023, url: 'https://ishadeed.com/article/css-container-query-guide/', type: 'notes', level: 'intermediate', desc: 'How CSS container queries enable truly responsive components. Components adapt based on their container, not the viewport.' }
        ]
      },
      {
        title: 'Responsive Components',
        resources: [
          { title: 'Responsive Components (Patterns)', author: 'Philip Walton', year: 2019, url: 'https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/', type: 'notes', level: 'advanced', desc: 'Early exploration of responsive component patterns using ResizeObserver, before container queries landed natively.' },
          { title: 'The State of Responsive Design', author: 'Ethan Marcotte', year: 2022, url: 'https://ethanmarcotte.com/', type: 'notes', level: 'intermediate', desc: 'Reflections from the creator of responsive web design on where the discipline is headed in the container query era.' },
          { title: 'Modern Fluid Typography with clamp()', author: 'Adrian Bece', year: 2022, url: 'https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/', type: 'notes', level: 'intermediate', desc: 'How to create fluid type and spacing that scales smoothly between breakpoints using CSS clamp(), eliminating hard breakpoints.' }
        ]
      }
    ]
  },
  {
    id: 'templates',
    title: 'Templates & Pages — Layout',
    icon: '\uD83D\uDCCB',
    intro: `<p><strong>Templates</strong> provide page-level structure — the skeleton that arranges organisms into a complete layout. They articulate the design\'s underlying content structure without specific content. <strong>Pages</strong> are specific instances of templates with real, representative content.</p>
<p>At this level, we work with:</p>
<ul>
<li><strong>Grid systems</strong> — the mathematical frameworks that underlie page layouts (columns, gutters, margins)</li>
<li><strong>Responsive design</strong> — how layouts adapt from mobile to desktop through fluid grids, flexible images, and media queries</li>
<li><strong>Layout patterns</strong> — holy grail, sidebar, dashboard, marketing, and article page archetypes</li>
<li><strong>Page architecture</strong> — visual hierarchy, scanning patterns (F-pattern, Z-pattern), and content choreography</li>
</ul>
<p>Templates are where the design system meets real content. They reveal how content of varying lengths and types affects the design, and force us to account for edge cases: what happens with no content? With 10x the expected content?</p>`,
    subsections: [
      {
        title: 'Grid Systems',
        resources: [
          { title: 'Grid Systems in Graphic Design', author: 'Josef M\u00FCller-Brockmann', year: 1981, url: 'https://www.goodreads.com/book/show/350962.Grid_Systems_in_Graphic_Design', type: 'book', level: 'intermediate', desc: 'The foundational text on grid systems. Covers columns, margins, modules, and the mathematical basis of typographic grids.' },
          { title: 'Ordering Disorder: Grid Principles for Web Design', author: 'Khoi Vinh', year: 2011, url: 'https://www.goodreads.com/book/show/9712450-ordering-disorder', type: 'book', level: 'beginner', desc: 'Adapting print grid principles to the web. Practical approach to creating flexible, proportional grid layouts.' },
          { title: 'CSS Grid Layout (MDN)', author: 'MDN Web Docs', year: 2023, url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout', type: 'notes', level: 'beginner', desc: 'Comprehensive reference for CSS Grid. Tracks, lines, areas, auto-placement, and alignment in the native grid system.' },
          { title: 'An Interactive Guide to CSS Grid', author: 'Josh W. Comeau', year: 2023, url: 'https://www.joshwcomeau.com/css/interactive-guide-to-grid/', type: 'notes', level: 'beginner', desc: 'Visual, interactive guide to CSS Grid. Builds intuition through hands-on examples of grid behavior.' },
          { title: 'A New Canon of Page Layout', author: 'Mark Boulton', year: 2009, url: 'https://www.markboulton.co.uk/journal/a-richer-canvas/', type: 'notes', level: 'intermediate', desc: 'Rethinking grid design for the web. Argues for moving beyond the column-based grid to more flexible compositional frameworks.' }
        ]
      },
      {
        title: 'Responsive Design',
        resources: [
          { title: 'Responsive Web Design', author: 'Ethan Marcotte', year: 2011, url: 'https://abookapart.com/products/responsive-web-design', type: 'book', level: 'beginner', desc: 'The book that defined responsive web design. Fluid grids, flexible images, and media queries as the three pillars.' },
          { title: 'Responsive Web Design (Original Article)', author: 'Ethan Marcotte', year: 2010, url: 'https://alistapart.com/article/responsive-web-design/', type: 'paper', level: 'beginner', desc: 'The A List Apart article that launched the responsive design movement. Coined the term and laid out the core approach.' },
          { title: 'Intrinsic Web Design', author: 'Jen Simmons', year: 2018, url: 'https://www.youtube.com/watch?v=AMPKmh98XLY', type: 'video', level: 'intermediate', desc: 'Beyond responsive: using CSS Grid and Flexbox for layouts that are intrinsically flexible. Squish, stretch, wrap, and overflow.' },
          { title: 'Learn Responsive Design', author: 'Jeremy Keith (web.dev)', year: 2021, url: 'https://web.dev/learn/design/', type: 'course', level: 'beginner', desc: 'Google\'s comprehensive course on responsive design. Media queries, typography, images, theming, and interaction.' },
          { title: 'Utopia: Fluid Responsive Design', author: 'James Gilyead & Trys Mudford', year: 2020, url: 'https://utopia.fyi/', type: 'tool', level: 'intermediate', desc: 'Calculator for fluid type and space scales. Generates CSS clamp() values for seamless responsive design without breakpoints.' }
        ]
      },
      {
        title: 'Layout Patterns',
        resources: [
          { title: 'Layout Patterns (web.dev)', author: 'Una Kravets', year: 2021, url: 'https://web.dev/patterns/layout/', type: 'notes', level: 'beginner', desc: 'Collection of modern CSS layout patterns: sidebar, pancake stack, holy grail, RAM, and super-centered.' },
          { title: '1-Line Layouts', author: 'Una Kravets', year: 2020, url: 'https://1linelayouts.glitch.me/', type: 'code', level: 'beginner', desc: 'Ten modern CSS layout techniques in a single line of code each. Demonstrates the power of modern CSS layout.' },
          { title: 'Every Layout', author: 'Andy Bell & Heydon Pickering', year: 2019, url: 'https://every-layout.dev/', type: 'book', level: 'intermediate', desc: 'Compositional layout primitives: Stack, Sidebar, Cluster, Switcher, Cover, Grid. Axiomatic CSS for intrinsic layouts.' },
          { title: 'Flexbox Froggy', author: 'Codepip', year: 2015, url: 'https://flexboxfroggy.com/', type: 'tool', level: 'beginner', desc: 'Interactive game for learning CSS Flexbox. 24 levels covering justify-content, align-items, flex-direction, and more.' },
          { title: 'Grid Garden', author: 'Codepip', year: 2017, url: 'https://cssgridgarden.com/', type: 'tool', level: 'beginner', desc: 'Interactive game for learning CSS Grid. 28 levels covering grid-column, grid-row, grid-template, and grid-area.' }
        ]
      },
      {
        title: 'Page Architecture',
        resources: [
          { title: 'Designing for the Web', author: 'Mark Boulton', year: 2009, url: 'https://www.designingfortheweb.co.uk/', type: 'book', level: 'beginner', desc: 'Free online book on web design fundamentals. Typography, layout, color, and the process of designing for the web.' },
          { title: 'F-Shaped Pattern for Reading (Research)', author: 'Jakob Nielsen', year: 2006, url: 'https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/', type: 'paper', level: 'beginner', desc: 'Eye-tracking study showing how users scan web pages in an F-shaped pattern. Foundational for page layout decisions.' },
          { title: 'Visual Hierarchy in UI Design', author: 'Nielsen Norman Group', year: 2023, url: 'https://www.nngroup.com/articles/visual-hierarchy-ux-definition/', type: 'notes', level: 'beginner', desc: 'How size, color, contrast, spacing, and position create visual hierarchy. Research-based guidelines for page layout.' },
          { title: 'Above the Fold Revisited', author: 'Amy Schade, NNG', year: 2015, url: 'https://www.nngroup.com/articles/page-fold-manifesto/', type: 'paper', level: 'beginner', desc: 'Research on how users interact with content above and below the fold. Users scroll, but priority placement still matters.' }
        ]
      }
    ]
  },
  {
    id: 'color-theory',
    title: 'Color Theory',
    icon: '\uD83C\uDFA8',
    intro: `<p><strong>Color theory</strong> for design systems encompasses the science of how color works physically and perceptually, the systems we use to describe and manipulate color, and the practical application of color in user interfaces.</p>
<p>This section goes deeper than the color fundamentals covered in Atoms:</p>
<ul>
<li><strong>Color science &amp; perception</strong> — how the eye and brain process color, metamerism, color constancy, chromatic adaptation</li>
<li><strong>Color systems &amp; spaces</strong> — RGB, HSL, LAB, LCH, OKLCH, and why perceptual uniformity matters</li>
<li><strong>Color harmony &amp; palettes</strong> — complementary, analogous, triadic, split-complementary, and algorithmically generated palettes</li>
<li><strong>Color accessibility</strong> — WCAG contrast ratios, color blindness simulation, and inclusive color design</li>
<li><strong>Color in UI</strong> — semantic color, dark mode, theming systems, and dynamic color</li>
</ul>
<p>Understanding color deeply — from the physics of light through perceptual uniformity to accessible palette generation — is essential for building design systems that work across contexts, cultures, and abilities.</p>`,
    subsections: [
      {
        title: 'Color Science & Perception',
        resources: [
          { title: 'The Art of Color', author: 'Johannes Itten', year: 1961, url: 'https://www.goodreads.com/book/show/1385498.The_Art_of_Color', type: 'book', level: 'intermediate', desc: 'Bauhaus master\'s comprehensive color theory. Seven color contrasts, color harmony, subjective color experience, and color expression.' },
          { title: 'Interaction of Color', author: 'Josef Albers', year: 1963, url: 'https://yalebooks.yale.edu/book/9780300179354/interaction-of-color/', type: 'book', level: 'beginner', desc: 'Foundational work on color relativity. How colors change appearance based on their neighbors. Exercises in seeing.' },
          { title: 'The Dimensions of Colour', author: 'David Briggs', year: 2017, url: 'https://www.huevaluechroma.com/', type: 'notes', level: 'intermediate', desc: 'Free online resource covering color science for artists and designers. Comprehensive treatment of hue, value, and chroma.' },
          { title: 'Color and Light: A Guide for the Realist Painter', author: 'James Gurney', year: 2010, url: 'https://www.goodreads.com/book/show/8142965-color-and-light', type: 'book', level: 'beginner', desc: 'How light behaves in the real world: subsurface scattering, specular highlights, color temperature, and atmospheric perspective.' },
          { title: 'Color Appearance Models', author: 'Mark D. Fairchild', year: 2013, url: 'https://www.wiley.com/en-us/Color+Appearance+Models,+3rd+Edition-p-9781119967033', type: 'book', level: 'advanced', desc: 'Definitive technical reference for how humans perceive color. CIELAB, CIECAM02, and computational models of color appearance.' }
        ]
      },
      {
        title: 'Color Systems & Spaces',
        resources: [
          { title: 'A Perceptual Color Space for Image Processing (OKLAB)', author: 'Bj\u00F6rn Ottosson', year: 2020, url: 'https://bottosson.github.io/posts/oklab/', type: 'paper', level: 'advanced', desc: 'The paper that introduced OKLAB and OKLCH. A perceptually uniform color space that\'s now in CSS Color Level 4.' },
          { title: 'LCH Colors in CSS: What, Why, and How?', author: 'Lea Verou', year: 2020, url: 'https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/', type: 'notes', level: 'intermediate', desc: 'Why LCH is superior to HSL for design work. Perceptual uniformity, wider gamut, and practical CSS usage.' },
          { title: 'The Munsell Color System', author: 'Albert Munsell', year: 1905, url: 'https://munsell.com/color-education/', type: 'notes', level: 'intermediate', desc: 'The first systematic color ordering based on perceptual attributes: hue, value, and chroma. Foundation of modern color science.' },
          { title: 'CSS Color Level 4 Specification', author: 'W3C', year: 2023, url: 'https://www.w3.org/TR/css-color-4/', type: 'notes', level: 'advanced', desc: 'The specification introducing oklch(), oklab(), color(), color-mix(), and relative color syntax to CSS.' },
          { title: 'Color Spaces (Bartosz Ciechanowski)', author: 'Bartosz Ciechanowski', year: 2021, url: 'https://ciechanow.ski/color-spaces/', type: 'notes', level: 'intermediate', desc: 'Interactive visual explainer of color spaces. Beautiful illustrations showing how RGB, HSL, LAB, and LCH relate to each other.' }
        ]
      },
      {
        title: 'Color Harmony & Palettes',
        resources: [
          { title: 'The Principles of Harmony and Contrast of Colours', author: 'Michel Eug\u00E8ne Chevreul', year: 1839, url: 'https://www.goodreads.com/book/show/2272234.The_Principles_of_Harmony_and_Contrast_of_Colours', type: 'book', level: 'advanced', desc: 'The original text on simultaneous contrast. How adjacent colors alter each other\'s appearance. Influenced the Impressionists.' },
          { title: 'Color Harmonies: Beyond the Basics', author: 'Nita Leland', year: 2013, url: 'https://www.goodreads.com/book/show/115992.Exploring_Color', type: 'book', level: 'beginner', desc: 'Practical exploration of color harmonies: complementary, analogous, triadic, split-complementary, and tetradic schemes.' },
          { title: 'Huemint — AI Color Palette Generator', author: 'Huemint', year: 2022, url: 'https://huemint.com/', type: 'tool', level: 'beginner', desc: 'Machine learning-powered palette generator. Generates harmonious palettes for specific UI contexts: website, brand, gradient.' },
          { title: 'Coolors', author: 'Fabrizio Bianchi', year: 2015, url: 'https://coolors.co/', type: 'tool', level: 'beginner', desc: 'Popular palette generator with color blindness simulation, contrast checking, and export to various formats.' },
          { title: 'Building Color Palettes for Design Systems', author: 'Lydia Hallie', year: 2022, url: 'https://www.youtube.com/watch?v=eXcKOqviLE0', type: 'video', level: 'intermediate', desc: 'How to build systematic color palettes with consistent lightness steps, semantic naming, and theme support.' }
        ]
      },
      {
        title: 'Color Accessibility',
        resources: [
          { title: 'WCAG 2.2: Understanding Contrast (Minimum)', author: 'W3C WAI', year: 2023, url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', type: 'notes', level: 'beginner', desc: 'Official WCAG guidelines for color contrast. 4.5:1 for normal text, 3:1 for large text. The minimum standard for accessibility.' },
          { title: 'Who Can Use', author: 'Corey Ginnivan', year: 2019, url: 'https://www.whocanuse.com/', type: 'tool', level: 'beginner', desc: 'Shows how color combinations appear for people with different vision types. Simulates protanopia, deuteranopia, tritanopia, and more.' },
          { title: 'APCA Contrast Calculator', author: 'Andrew Somers (Myndex)', year: 2022, url: 'https://www.myndex.com/APCA/', type: 'tool', level: 'intermediate', desc: 'Advanced Perceptual Contrast Algorithm. The next-generation contrast method being developed for WCAG 3.0. More accurate than current ratios.' },
          { title: 'Color Accessibility Workflows', author: 'Geri Coady', year: 2017, url: 'https://abookapart.com/products/color-accessibility-workflows', type: 'book', level: 'beginner', desc: 'Practical guide to designing with color accessibility in mind. Testing tools, patterns, and common pitfalls.' }
        ]
      },
      {
        title: 'Color in UI',
        resources: [
          { title: 'Material Design 3: Dynamic Color', author: 'Google', year: 2022, url: 'https://m3.material.io/styles/color/dynamic-color/overview', type: 'notes', level: 'intermediate', desc: 'Google\'s system for generating personalized color schemes from a single seed color. Tonal palettes and color roles.' },
          { title: 'Dark Mode Design Guidelines', author: 'Apple Human Interface Guidelines', year: 2023, url: 'https://developer.apple.com/design/human-interface-guidelines/dark-mode', type: 'notes', level: 'beginner', desc: 'Apple\'s comprehensive dark mode guidance. Semantic colors, elevated surfaces, vibrancy, and accessibility considerations.' },
          { title: 'Designing Systematic Colors', author: 'Linda Dong (Lyft)', year: 2018, url: 'https://design.lyft.com/re-approaching-color-9e604ba22c88', type: 'notes', level: 'intermediate', desc: 'How Lyft rebuilt their color system. Perceptually uniform lightness curves, accessibility-first, and programmatic generation.' },
          { title: 'Radix Colors', author: 'Modulz', year: 2022, url: 'https://www.radix-ui.com/colors', type: 'code', level: 'intermediate', desc: 'Open-source color system for building design systems. 12-step scales for backgrounds, interactive components, borders, and text.' },
          { title: 'Open Color', author: 'yeun', year: 2016, url: 'https://yeun.github.io/open-color/', type: 'code', level: 'beginner', desc: 'Open-source color scheme optimized for UI design. 12 hues with 10 lightness steps each, designed for consistency.' }
        ]
      }
    ]
  },
  {
    id: 'hci',
    title: 'Human-Computer Interaction',
    icon: '\uD83D\uDD90',
    intro: `<p><strong>Human-Computer Interaction (HCI)</strong> is the study of how people interact with computers and the design of technologies that let humans interact with computers in novel ways. It sits at the intersection of computer science, cognitive psychology, and design.</p>
<p>For design systems, HCI provides the theoretical foundation for <em>why</em> certain patterns work:</p>
<ul>
<li><strong>Foundational HCI</strong> — affordances, signifiers, mappings, feedback, conceptual models</li>
<li><strong>Cognitive psychology</strong> — cognitive load, mental models, attention, memory, decision-making</li>
<li><strong>Usability engineering</strong> — heuristic evaluation, usability testing, error prevention, efficiency</li>
<li><strong>Interaction models</strong> — direct manipulation, Fitts\'s law, Hick\'s law, Gulf of Execution/Evaluation</li>
<li><strong>Accessibility</strong> — universal design, assistive technology, inclusive interaction paradigms</li>
</ul>
<p>Understanding HCI transforms design from intuition-driven to evidence-driven. Every successful interaction pattern in a design system has roots in HCI research.</p>`,
    subsections: [
      {
        title: 'Foundational HCI',
        resources: [
          { title: 'The Design of Everyday Things', author: 'Don Norman', year: 2013, url: 'https://www.goodreads.com/book/show/840.The_Design_of_Everyday_Things', type: 'book', level: 'beginner', desc: 'The foundational HCI text. Affordances, signifiers, mappings, feedback, and conceptual models. Required reading for every designer.' },
          { title: 'Designing the User Interface', author: 'Ben Shneiderman, Catherine Plaisant, et al.', year: 2016, url: 'https://www.cs.umd.edu/~ben/goldenrules.html', type: 'book', level: 'intermediate', desc: 'Comprehensive HCI textbook. Eight golden rules of interface design, direct manipulation, and information visualization.' },
          { title: 'About Face: The Essentials of Interaction Design', author: 'Alan Cooper, Robert Reimann & David Cronin', year: 2014, url: 'https://www.goodreads.com/book/show/289062.About_Face_3', type: 'book', level: 'intermediate', desc: 'Goal-directed design methodology. Personas, scenarios, and interaction design principles for digital products.' },
          { title: 'The Humane Interface', author: 'Jef Raskin', year: 2000, url: 'https://www.goodreads.com/book/show/344726.The_Humane_Interface', type: 'book', level: 'intermediate', desc: 'Radical rethinking of interface design by the creator of the Macintosh project. Modes, habituation, and cognetics.' },
          { title: 'Human-Computer Interaction (CS 5440)', author: 'Jeff Bigham (CMU)', year: 2021, url: 'https://www.youtube.com/playlist?list=PLumQbMONBEG_2oKVKFAVCTmRhVfkaPr3C', type: 'course', level: 'beginner', desc: 'Carnegie Mellon HCI course. Covers design thinking, prototyping, evaluation, accessibility, and AI in HCI.' }
        ]
      },
      {
        title: 'Cognitive Psychology',
        resources: [
          { title: 'Designing with the Mind in Mind', author: 'Jeff Johnson', year: 2020, url: 'https://www.goodreads.com/book/show/8564020-designing-with-the-mind-in-mind', type: 'book', level: 'beginner', desc: 'Cognitive psychology principles applied to UI design. Perception, attention, memory, learning, and decision-making for designers.' },
          { title: '100 Things Every Designer Needs to Know About People', author: 'Susan Weinschenk', year: 2011, url: 'https://www.goodreads.com/book/show/10003966-100-things-every-designer-needs-to-know-about-people', type: 'book', level: 'beginner', desc: 'Accessible survey of psychology for designers. How people see, read, remember, think, feel, decide, and are motivated.' },
          { title: 'Cognitive Load Theory in UX', author: 'Kathryn Whitenton, NNG', year: 2013, url: 'https://www.nngroup.com/articles/minimize-cognitive-load/', type: 'notes', level: 'beginner', desc: 'How to minimize cognitive load in interfaces. Intrinsic, extraneous, and germane load applied to UX design decisions.' },
          { title: 'Miller\'s Law: The Magical Number Seven', author: 'George A. Miller', year: 1956, url: 'https://psycnet.apa.org/record/1957-02914-001', type: 'paper', level: 'intermediate', desc: 'The classic paper on working memory capacity. Often misinterpreted — it\'s about chunking, not about limiting menus to 7 items.' },
          { title: 'Mental Models (NNG)', author: 'Jakob Nielsen', year: 2010, url: 'https://www.nngroup.com/articles/mental-models/', type: 'notes', level: 'beginner', desc: 'How users\' mental models of a system differ from the actual system model, and why this gap causes usability problems.' }
        ]
      },
      {
        title: 'Usability Engineering',
        resources: [
          { title: 'Usability Engineering', author: 'Jakob Nielsen', year: 1993, url: 'https://www.goodreads.com/book/show/1867.Usability_Engineering', type: 'book', level: 'intermediate', desc: 'The foundational usability text. Defines usability metrics, heuristic evaluation, and discount usability testing methods.' },
          { title: '10 Usability Heuristics for User Interface Design', author: 'Jakob Nielsen', year: 1994, url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', type: 'notes', level: 'beginner', desc: 'The most-used heuristic evaluation framework. Visibility, match, control, consistency, error prevention, recognition, flexibility, aesthetics, recovery, help.' },
          { title: 'Rocket Surgery Made Easy', author: 'Steve Krug', year: 2010, url: 'https://www.goodreads.com/book/show/6434440-rocket-surgery-made-easy', type: 'book', level: 'beginner', desc: 'Practical guide to DIY usability testing. How to run a test, what to look for, and how to prioritize fixes.' },
          { title: 'Measuring the User Experience', author: 'Tom Tullis & Bill Albert', year: 2013, url: 'https://www.goodreads.com/book/show/3025900-measuring-the-user-experience', type: 'book', level: 'intermediate', desc: 'Quantitative methods for UX. Task success, time-on-task, errors, satisfaction, SUS scores, and statistical analysis.' },
          { title: 'System Usability Scale (SUS)', author: 'John Brooke', year: 1996, url: 'https://www.usability.gov/how-to-and-tools/methods/system-usability-scale.html', type: 'paper', level: 'beginner', desc: 'The industry-standard quick usability questionnaire. 10 questions producing a 0-100 score. Simple, reliable, and widely benchmarked.' }
        ]
      },
      {
        title: 'Interaction Models',
        resources: [
          { title: 'Fitts\'s Law: Modeling Movement Time in HCI', author: 'Paul Fitts', year: 1954, url: 'https://www.interaction-design.org/literature/article/fitts-s-law-the-importance-of-size-and-distance-in-ui-design', type: 'paper', level: 'beginner', desc: 'The time to acquire a target is a function of distance and size. Foundational for button sizing, touch targets, and menu design.' },
          { title: 'Hick\'s Law: Making the Choice Easier', author: 'William Edmund Hick', year: 1952, url: 'https://www.interaction-design.org/literature/article/hick-s-law-making-the-choice-easier', type: 'paper', level: 'beginner', desc: 'Decision time increases logarithmically with the number of choices. Applies to navigation menus, option sets, and feature disclosure.' },
          { title: 'Direct Manipulation Interfaces', author: 'Edwin Hutchins, James Hollan & Don Norman', year: 1985, url: 'https://dl.acm.org/doi/10.1207/s15327051hci0104_2', type: 'paper', level: 'intermediate', desc: 'The theory behind direct manipulation: continuous representation, physical actions, rapid feedback. Why drag-and-drop feels natural.' },
          { title: 'Laws of UX', author: 'Jon Yablonski', year: 2020, url: 'https://lawsofux.com/', type: 'notes', level: 'beginner', desc: 'Beautifully designed collection of UX laws: Fitts, Hick, Jakob, Miller, Doherty, Tesler, and more. Each with clear explanations and examples.' },
          { title: 'The Gulf of Execution and Evaluation', author: 'Don Norman', year: 1986, url: 'https://www.nngroup.com/articles/two-ux-gulfs-evaluation-execution/', type: 'notes', level: 'beginner', desc: 'Norman\'s model of the gap between user intentions and system actions (execution) and between system state and user understanding (evaluation).' }
        ]
      },
      {
        title: 'Accessibility',
        resources: [
          { title: 'Web Content Accessibility Guidelines (WCAG) 2.2', author: 'W3C WAI', year: 2023, url: 'https://www.w3.org/TR/WCAG22/', type: 'notes', level: 'intermediate', desc: 'The international standard for web accessibility. Perceivable, operable, understandable, and robust (POUR) principles.' },
          { title: 'Inclusive Design Principles', author: 'Paciello Group', year: 2017, url: 'https://inclusivedesignprinciples.org/', type: 'notes', level: 'beginner', desc: 'Seven principles for designing inclusive experiences: comparable, considerate, consistent, controlled, contextual, contributory, and compliant.' },
          { title: 'Mismatch: How Inclusion Shapes Design', author: 'Kat Holmes', year: 2018, url: 'https://mitpress.mit.edu/9780262539487/mismatch/', type: 'book', level: 'beginner', desc: 'Reframes disability as a mismatched interaction between a person and their environment. Inclusion as a design driver.' },
          { title: 'The Accessibility of Styled Form Controls', author: 'Scott O\'Hara', year: 2021, url: 'https://scottaohara.github.io/a11y_styled_form_controls/', type: 'code', level: 'intermediate', desc: 'Accessible implementations of custom-styled form controls. Checkboxes, radios, switches, selects, and range sliders.' }
        ]
      }
    ]
  },
  {
    id: 'game-theory',
    title: 'Game Theory & Decision Design',
    icon: '\u265F',
    intro: `<p><strong>Game theory applied to design</strong> examines how users make decisions within designed environments — and how designers can structure those environments to produce better outcomes. Every interface is a game: users have goals, face choices, and respond to incentives.</p>
<p>This section bridges economics, behavioral science, and UX:</p>
<ul>
<li><strong>Decision theory</strong> — how rational agents choose under uncertainty; expected utility, risk aversion</li>
<li><strong>Incentive design</strong> — aligning user incentives with system goals; avoiding dark patterns</li>
<li><strong>Behavioral economics</strong> — systematic deviations from rationality; biases, heuristics, framing effects</li>
<li><strong>Convex hull &amp; strategy spaces</strong> — mapping the boundary of all possible design decisions</li>
<li><strong>Gamification</strong> — applying game mechanics to non-game contexts; motivation frameworks</li>
</ul>
<p>The convex hull metaphor is central: a design system defines the <em>strategy space</em> of possible interfaces. The convex hull of that space is the efficient frontier — the designs where no dimension can be improved without degrading another. Good design systems make it easy to stay on this frontier.</p>`,
    subsections: [
      {
        title: 'Decision Theory Foundations',
        resources: [
          { title: 'Theory of Games and Economic Behavior', author: 'John von Neumann & Oskar Morgenstern', year: 1944, url: 'https://press.princeton.edu/books/paperback/9780691130613/theory-of-games-and-economic-behavior', type: 'book', level: 'advanced', desc: 'The founding text of game theory and decision theory. Establishes expected utility, minimax, and the mathematical framework for strategic interaction.' },
          { title: 'The Foundations of Statistics', author: 'Leonard Savage', year: 1954, url: 'https://www.goodreads.com/book/show/1613tried.The_Foundations_of_Statistics', type: 'book', level: 'advanced', desc: 'Subjective expected utility theory. How rational agents should make decisions under uncertainty. Foundation for Bayesian decision theory.' },
          { title: 'Rational Choice Theory (Stanford Encyclopedia)', author: 'Sven Ove Hansson', year: 2019, url: 'https://plato.stanford.edu/entries/rationality-instrumental/', type: 'notes', level: 'intermediate', desc: 'Comprehensive overview of instrumental rationality and rational choice. The theoretical basis for understanding how users "should" choose.' },
          { title: 'Decision Theory: A Brief Introduction', author: 'Sven Ove Hansson', year: 2005, url: 'https://people.kth.se/~sMDCoh/decisiontheory.pdf', type: 'paper', level: 'beginner', desc: 'Accessible introduction to normative and descriptive decision theory. Good starting point before behavioral economics.' }
        ]
      },
      {
        title: 'Incentive Design',
        resources: [
          { title: 'Nudge: Improving Decisions About Health, Wealth, and Happiness', author: 'Richard Thaler & Cass Sunstein', year: 2008, url: 'https://www.goodreads.com/book/show/3450744-nudge', type: 'book', level: 'beginner', desc: 'The foundational text on choice architecture. How the structure of choices influences decisions. Default effects, feedback, mapping, and structuring.' },
          { title: 'Hooked: How to Build Habit-Forming Products', author: 'Nir Eyal', year: 2014, url: 'https://www.goodreads.com/book/show/22668729-hooked', type: 'book', level: 'beginner', desc: 'The Hook Model: trigger, action, variable reward, investment. Framework for designing engaging products (use ethically).' },
          { title: 'Evil by Design', author: 'Chris Nodder', year: 2013, url: 'https://www.goodreads.com/book/show/17261244-evil-by-design', type: 'book', level: 'intermediate', desc: 'How persuasive design patterns work — and when they cross into manipulation. Maps the seven deadly sins to design patterns.' },
          { title: 'Dark Patterns: Deceptive Design', author: 'Harry Brignull', year: 2010, url: 'https://www.deceptive.design/', type: 'notes', level: 'beginner', desc: 'Taxonomy of deceptive design patterns. Understanding dark patterns is essential for ethical design — know them to avoid them.' },
          { title: 'Persuasive Technology', author: 'B.J. Fogg', year: 2003, url: 'https://www.goodreads.com/book/show/227603.Persuasive_Technology', type: 'book', level: 'intermediate', desc: 'How computers can be designed to influence attitudes and behaviors. The Fogg Behavior Model: motivation, ability, and triggers.' }
        ]
      },
      {
        title: 'Behavioral Economics',
        resources: [
          { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', year: 2011, url: 'https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow', type: 'book', level: 'beginner', desc: 'Nobel laureate\'s synthesis of decades of research. System 1 (fast, intuitive) vs. System 2 (slow, deliberate). Biases, heuristics, and prospect theory.' },
          { title: 'Predictably Irrational', author: 'Dan Ariely', year: 2008, url: 'https://www.goodreads.com/book/show/1713426.Predictably_Irrational', type: 'book', level: 'beginner', desc: 'Systematic irrationality in human decision-making. Decoy effect, anchoring, free pricing, and social vs. market norms. Directly applicable to UI design.' },
          { title: 'Misbehaving: The Making of Behavioral Economics', author: 'Richard Thaler', year: 2015, url: 'https://www.goodreads.com/book/show/26530355-misbehaving', type: 'book', level: 'beginner', desc: 'How behavioral economics emerged as a field. Mental accounting, endowment effect, fairness, and the gap between Econs and Humans.' },
          { title: 'Prospect Theory: An Analysis of Decision Under Risk', author: 'Daniel Kahneman & Amos Tversky', year: 1979, url: 'https://www.jstor.org/stable/1914185', type: 'paper', level: 'advanced', desc: 'The paper that launched behavioral economics. Loss aversion, reference dependence, and the S-shaped value function.' },
          { title: 'Cognitive Biases in UX Design', author: 'David Dylan Thomas', year: 2020, url: 'https://abookapart.com/products/design-for-cognitive-bias', type: 'book', level: 'beginner', desc: 'Direct application of cognitive biases to UX. Framing, anchoring, confirmation bias, and sunk cost applied to interface design decisions.' }
        ]
      },
      {
        title: 'Convex Hull & Strategy Spaces',
        resources: [
          { title: 'Computational Geometry: Algorithms and Applications', author: 'Mark de Berg et al.', year: 2008, url: 'https://www.cs.uu.nl/geobook/', type: 'book', level: 'advanced', desc: 'Definitive text on computational geometry including convex hull algorithms. The mathematical foundation for understanding design space boundaries.' },
          { title: 'Multi-Objective Optimization in Design', author: 'various', year: 2016, url: 'https://link.springer.com/article/10.1007/s00158-015-1374-2', type: 'paper', level: 'advanced', desc: 'Pareto frontiers in design: the boundary of designs where no objective can be improved without worsening another. The convex hull of the design space.' },
          { title: 'Design Space Exploration', author: 'Hartmut Ehrig et al.', year: 2012, url: 'https://www.interaction-design.org/literature/topics/design-space-analysis', type: 'notes', level: 'intermediate', desc: 'Systematic exploration of the space of possible designs. Trade-off analysis, design dimensions, and mapping the boundaries of possibility.' }
        ]
      },
      {
        title: 'Gamification Frameworks',
        resources: [
          { title: 'Actionable Gamification: Beyond Points, Badges, and Leaderboards', author: 'Yu-kai Chou', year: 2015, url: 'https://www.goodreads.com/book/show/25416321-actionable-gamification', type: 'book', level: 'beginner', desc: 'The Octalysis framework: 8 core drives of motivation. Goes beyond superficial gamification to understand intrinsic motivation.' },
          { title: 'Reality Is Broken', author: 'Jane McGonigal', year: 2011, url: 'https://www.goodreads.com/book/show/7821348-reality-is-broken', type: 'book', level: 'beginner', desc: 'Why games make us better and how they can change the world. The psychology of voluntary engagement and intrinsic motivation.' },
          { title: 'Flow: The Psychology of Optimal Experience', author: 'Mihaly Csikszentmihalyi', year: 1990, url: 'https://www.goodreads.com/book/show/66354.Flow', type: 'book', level: 'beginner', desc: 'The science of optimal experience. Flow state requires clear goals, immediate feedback, and balance between challenge and skill — directly applicable to UX.' },
          { title: 'For the Win: How Game Thinking Can Revolutionize Your Business', author: 'Kevin Werbach & Dan Hunter', year: 2012, url: 'https://www.goodreads.com/book/show/15841464-for-the-win', type: 'book', level: 'beginner', desc: 'Framework for applying game elements to business contexts. Mechanics, dynamics, components, and the player journey.' },
          { title: 'Self-Determination Theory in UX', author: 'Raluca Budiu, NNG', year: 2020, url: 'https://www.nngroup.com/articles/self-determination-theory-ux/', type: 'notes', level: 'beginner', desc: 'Autonomy, competence, and relatedness applied to UX. The psychological needs framework that underlies sustainable engagement.' }
        ]
      }
    ]
  },
  {
    id: 'perception',
    title: 'Perception & Cognition',
    icon: '\uD83D\uDC41',
    intro: `<p><strong>Perception and cognition</strong> research reveals how the human visual system processes interfaces — what we notice first, how we group elements, why certain layouts feel balanced, and how emotion shapes interaction.</p>
<p>This section covers the perceptual and cognitive science that underlies all visual design:</p>
<ul>
<li><strong>Gestalt principles</strong> — proximity, similarity, continuity, closure, common fate, figure/ground</li>
<li><strong>Visual hierarchy</strong> — how size, contrast, color, spacing, and position direct attention</li>
<li><strong>Attention &amp; memory</strong> — pre-attentive processing, change blindness, inattentional blindness</li>
<li><strong>Emotional design</strong> — visceral, behavioral, and reflective levels; aesthetics-usability effect</li>
<li><strong>Semiotics</strong> — the study of signs and symbols; how interfaces communicate through icons, metaphors, and conventions</li>
</ul>
<p>Design systems are fundamentally perceptual systems. Every token, every component, every layout creates perceptual effects. Understanding these effects — not just following rules — is what separates systematic design from surface-level pattern matching.</p>`,
    subsections: [
      {
        title: 'Gestalt Principles',
        resources: [
          { title: 'Art and Visual Perception', author: 'Rudolf Arnheim', year: 1974, url: 'https://www.goodreads.com/book/show/6186.Art_and_Visual_Perception', type: 'book', level: 'intermediate', desc: 'The foundational text on visual perception in art and design. Balance, shape, form, growth, space, light, color, movement, tension, and expression.' },
          { title: 'Gestalt Principles for Data Visualization', author: 'Nadieh Bremer', year: 2019, url: 'https://www.youtube.com/watch?v=X3dUGvZFc5A', type: 'video', level: 'beginner', desc: 'Beautiful talk applying Gestalt principles to data visualization. Proximity, similarity, enclosure, connection, and continuity with visual examples.' },
          { title: 'Gestalt Principles in UI Design', author: 'Aurora Harley, NNG', year: 2019, url: 'https://www.nngroup.com/articles/gestalt-proximity/', type: 'notes', level: 'beginner', desc: 'Series of articles applying each Gestalt principle to interface design. Practical examples showing proximity, similarity, and common region in real UIs.' },
          { title: 'Universal Principles of Design', author: 'William Lidwell, Kritina Holden & Jill Butler', year: 2010, url: 'https://www.goodreads.com/book/show/130730.Universal_Principles_of_Design', type: 'book', level: 'beginner', desc: '125 design principles including all Gestalt laws, with examples from architecture, product design, and visual communication.' },
          { title: 'Laws of Simplicity', author: 'John Maeda', year: 2006, url: 'https://www.goodreads.com/book/show/225111.The_Laws_of_Simplicity', type: 'book', level: 'beginner', desc: 'Ten laws for simplifying complex systems: reduce, organize, time, learn, differences, context, emotion, trust, failure, and "the one."' }
        ]
      },
      {
        title: 'Visual Hierarchy',
        resources: [
          { title: 'Visual Grammar', author: 'Christian Leborg', year: 2006, url: 'https://www.goodreads.com/book/show/232413.Visual_Grammar', type: 'book', level: 'beginner', desc: 'Concise taxonomy of visual elements and their relationships. Abstract objects, activities, and relations that form the basis of visual communication.' },
          { title: 'Visual Thinking for Design', author: 'Colin Ware', year: 2008, url: 'https://www.goodreads.com/book/show/3657220-visual-thinking-for-design', type: 'book', level: 'intermediate', desc: 'How the visual system processes information for design. Pre-attentive processing, pattern perception, and visual queries.' },
          { title: 'Layout Essentials: 100 Design Principles', author: 'Beth Tondreau', year: 2009, url: 'https://www.goodreads.com/book/show/6411622-layout-essentials', type: 'book', level: 'beginner', desc: 'Practical layout principles: grids, hierarchy, white space, typography, and the anatomy of effective page layouts.' },
          { title: 'Pre-Attentive Visual Properties in Visualization', author: 'Christopher G. Healey', year: 2012, url: 'https://www.csc2.ncsu.edu/faculty/healey/PP/', type: 'notes', level: 'intermediate', desc: 'Interactive demonstration of pre-attentive visual properties: color, form, spatial position, and motion. What the eye detects in under 200ms.' }
        ]
      },
      {
        title: 'Attention & Memory',
        resources: [
          { title: 'Information Visualization: Perception for Design', author: 'Colin Ware', year: 2012, url: 'https://www.goodreads.com/book/show/13677463-information-visualization', type: 'book', level: 'advanced', desc: 'Definitive text on perception for visualization. Color, texture, motion, pattern, and how the visual brain creates meaning from data.' },
          { title: 'The Invisible Gorilla', author: 'Christopher Chabris & Daniel Simons', year: 2010, url: 'https://www.goodreads.com/book/show/7783191-the-invisible-gorilla', type: 'book', level: 'beginner', desc: 'Inattentional blindness and the illusions of attention. Why users miss obvious UI elements and how to design for limited attention.' },
          { title: 'Change Blindness in User Interfaces', author: 'Jakob Nielsen', year: 2018, url: 'https://www.nngroup.com/articles/change-blindness/', type: 'notes', level: 'beginner', desc: 'How users fail to notice changes on screen, even significant ones. Design implications for notifications, updates, and state changes.' },
          { title: 'Recognition Over Recall in User Interfaces', author: 'Raluca Budiu, NNG', year: 2014, url: 'https://www.nngroup.com/articles/recognition-and-recall/', type: 'notes', level: 'beginner', desc: 'Why recognition is easier than recall and how to design interfaces that leverage this. Menus over commands, autocomplete over free text.' }
        ]
      },
      {
        title: 'Emotional Design',
        resources: [
          { title: 'Emotional Design', author: 'Don Norman', year: 2004, url: 'https://www.goodreads.com/book/show/841.Emotional_Design', type: 'book', level: 'beginner', desc: 'Three levels of design processing: visceral (appearance), behavioral (function), and reflective (meaning). Why attractive things work better.' },
          { title: 'Designing for Emotion', author: 'Aarron Walter', year: 2011, url: 'https://abookapart.com/products/designing-for-emotion', type: 'book', level: 'beginner', desc: 'Maslow\'s hierarchy applied to UX: functional, reliable, usable, and pleasurable. How to design interfaces that create emotional connections.' },
          { title: 'Seductive Interaction Design', author: 'Stephen Anderson', year: 2011, url: 'https://www.goodreads.com/book/show/10273130-seductive-interaction-design', type: 'book', level: 'intermediate', desc: 'Psychology of engagement in UX. Curiosity, feedback loops, playfulness, and the science of creating delightful interactions.' },
          { title: 'The Aesthetic-Usability Effect', author: 'Kate Moran, NNG', year: 2017, url: 'https://www.nngroup.com/articles/aesthetic-usability-effect/', type: 'notes', level: 'beginner', desc: 'Research showing that aesthetically pleasing designs are perceived as more usable. Beautiful design builds trust and tolerance for minor usability issues.' }
        ]
      },
      {
        title: 'Semiotics',
        resources: [
          { title: 'Semiotics: The Basics', author: 'Daniel Chandler', year: 2017, url: 'https://www.goodreads.com/book/show/686498.Semiotics', type: 'book', level: 'beginner', desc: 'Clear introduction to the study of signs. Signifier/signified, icon/index/symbol, denotation/connotation applied to visual communication.' },
          { title: 'The Semiotics of Emoji', author: 'Marcel Danesi', year: 2016, url: 'https://www.goodreads.com/book/show/33830721-the-semiotics-of-emoji', type: 'book', level: 'intermediate', desc: 'How emoji function as a sign system. Relevant to understanding how icons and visual symbols communicate in interfaces.' },
          { title: 'Icon Classification: Resemblance, Reference, and Arbitrary', author: 'Page Laubheimer, NNG', year: 2019, url: 'https://www.nngroup.com/articles/classifying-icons/', type: 'notes', level: 'beginner', desc: 'Three types of icon-meaning relationships: resemblance (looks like the thing), reference (associated with the thing), and arbitrary (learned convention).' },
          { title: 'Visual Communication: Images with Messages', author: 'Paul Martin Lester', year: 2013, url: 'https://www.goodreads.com/book/show/134790.Visual_Communication', type: 'book', level: 'intermediate', desc: 'Comprehensive visual communication textbook. Covers visual perception, persuasion, semiotics, and the role of images in meaning-making.' }
        ]
      }
    ]
  },
  {
    id: 'systems-at-scale',
    title: 'Design Systems at Scale',
    icon: '\uD83C\uDFD7',
    intro: `<p><strong>Design systems at scale</strong> addresses the engineering and organizational challenges of maintaining design consistency across large teams, multiple platforms, and evolving requirements. This is where atomic design methodology meets real-world operations.</p>
<p>Scaling a design system requires:</p>
<ul>
<li><strong>Design tokens</strong> — the subatomic particles: named, platform-agnostic values that store design decisions</li>
<li><strong>Component libraries</strong> — shared, versioned component packages consumed by product teams</li>
<li><strong>Governance &amp; documentation</strong> — contribution models, decision records, living style guides</li>
<li><strong>Tooling &amp; infrastructure</strong> — Figma, Storybook, CI/CD for design, visual regression testing</li>
<li><strong>Case studies</strong> — lessons from Material Design, Lightning, Carbon, Polaris, Atlassian, and others</li>
</ul>
<p>A design system is not a project — it\'s a <em>product</em> that serves other products. Success requires treating it with the same rigor as any other production software: versioning, testing, documentation, and continuous iteration.</p>`,
    subsections: [
      {
        title: 'Design Tokens',
        resources: [
          { title: 'Design Tokens W3C Community Group', author: 'W3C', year: 2023, url: 'https://www.w3.org/community/design-tokens/', type: 'notes', level: 'intermediate', desc: 'The emerging standard for design token format. JSON-based specification for cross-platform token exchange.' },
          { title: 'Style Dictionary', author: 'Amazon', year: 2017, url: 'https://amzn.github.io/style-dictionary/', type: 'code', level: 'intermediate', desc: 'Build system for design tokens. Transforms tokens into platform-specific outputs: CSS, SCSS, iOS, Android, and more.' },
          { title: 'Tokens Studio for Figma', author: 'Tokens Studio', year: 2021, url: 'https://tokens.studio/', type: 'tool', level: 'beginner', desc: 'Figma plugin for managing design tokens. Connects Figma to code via token JSON files with Git sync.' },
          { title: 'Design Tokens — Beyond the Basics', author: 'Cristiano Rastelli', year: 2019, url: 'https://www.youtube.com/watch?v=Ka1I5TphDB0', type: 'video', level: 'intermediate', desc: 'Deep dive into token architecture: naming conventions, aliasing, theming, and multi-platform token management.' },
          { title: 'Naming Tokens in Design Systems', author: 'Nathan Curtis', year: 2016, url: 'https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676', type: 'notes', level: 'intermediate', desc: 'Systematic approach to token naming. Category-type-item pattern and how to create names that scale across themes and platforms.' }
        ]
      },
      {
        title: 'Component Libraries',
        resources: [
          { title: 'Modular Web Design', author: 'Nathan Curtis', year: 2010, url: 'https://www.goodreads.com/book/show/7170547-modular-web-design', type: 'book', level: 'intermediate', desc: 'How to create reusable component libraries. Component definition, documentation, governance, and organizational adoption.' },
          { title: 'Storybook', author: 'Storybook maintainers', year: 2017, url: 'https://storybook.js.org/', type: 'tool', level: 'beginner', desc: 'The standard tool for developing UI components in isolation. Documentation, visual testing, and interaction testing for component libraries.' },
          { title: 'Chromatic (Visual Regression Testing)', author: 'Chromatic', year: 2019, url: 'https://www.chromatic.com/', type: 'tool', level: 'intermediate', desc: 'Visual regression testing for Storybook. Catches unintended visual changes in components across browsers and viewports.' },
          { title: 'Component-Driven User Interfaces', author: 'Varun Vachhar (Chromatic)', year: 2020, url: 'https://www.componentdriven.org/', type: 'notes', level: 'beginner', desc: 'Methodology for building UIs from components. Build, test, document, and combine components into screens.' },
          { title: 'Headless UI Patterns', author: 'Diego Haz', year: 2020, url: 'https://www.merrickchristensen.com/articles/headless-user-interface-components/', type: 'notes', level: 'advanced', desc: 'Separation of component logic from presentation. Build accessible, unstyled components that teams can style to match any design system.' }
        ]
      },
      {
        title: 'Governance & Documentation',
        resources: [
          { title: 'Design Systems', author: 'Alla Kholmatova', year: 2017, url: 'https://www.smashingmagazine.com/design-systems-book/', type: 'book', level: 'beginner', desc: 'Practical guide covering how to establish, maintain, and evolve a design system. Pattern definition, naming, and governance models.' },
          { title: 'Team Models for Scaling Design Systems', author: 'Nathan Curtis', year: 2015, url: 'https://medium.com/eightshapes-llc/team-models-for-scaling-a-design-system-2cf9d03be6a0', type: 'notes', level: 'intermediate', desc: 'Organizational models for design system teams: solitary, centralized, federated, and cyclical. Pros and cons of each approach.' },
          { title: 'The Component Gallery', author: 'Various', year: 2022, url: 'https://component.gallery/', type: 'tool', level: 'beginner', desc: 'Collection of design system components across major systems. Compare implementations of the same component pattern across organizations.' },
          { title: 'ADRs (Architecture Decision Records)', author: 'Michael Nygard', year: 2011, url: 'https://adr.github.io/', type: 'notes', level: 'intermediate', desc: 'Lightweight format for recording architectural decisions. Essential for documenting the "why" behind design system choices.' },
          { title: 'Contribution Models for Design Systems', author: 'Nathan Curtis', year: 2019, url: 'https://medium.com/eightshapes-llc/contributions-to-design-systems-89261a9363d8', type: 'notes', level: 'intermediate', desc: 'How teams contribute to design systems: guidelines, processes, quality gates, and recognition models for contributors.' }
        ]
      },
      {
        title: 'Tooling & Infrastructure',
        resources: [
          { title: 'Figma for Design Systems', author: 'Figma', year: 2023, url: 'https://www.figma.com/best-practices/components-styles-and-shared-libraries/', type: 'notes', level: 'beginner', desc: 'Figma\'s official guide to building design systems. Components, styles, libraries, variables, and team collaboration.' },
          { title: 'Design System Versioning', author: 'Nathan Curtis', year: 2019, url: 'https://medium.com/eightshapes-llc/versioning-design-systems-48cceb5ace4d', type: 'notes', level: 'intermediate', desc: 'Semantic versioning for design systems. Breaking changes, deprecation strategies, and migration paths for consuming teams.' },
          { title: 'Visual Regression Testing for Design Systems', author: 'Varun Vachhar', year: 2020, url: 'https://storybook.js.org/docs/writing-tests/visual-testing', type: 'notes', level: 'intermediate', desc: 'How to set up visual regression testing with Storybook and Chromatic. Catch visual regressions before they ship.' },
          { title: 'Figma Plugin API', author: 'Figma', year: 2020, url: 'https://www.figma.com/plugin-docs/', type: 'code', level: 'advanced', desc: 'Build custom Figma plugins to automate design system workflows: token sync, lint, generate code, and enforce standards.' }
        ]
      },
      {
        title: 'Case Studies',
        resources: [
          { title: 'Material Design (Google)', author: 'Google', year: 2014, url: 'https://m3.material.io/', type: 'notes', level: 'beginner', desc: 'Google\'s comprehensive design system. Material 3 covers dynamic color, typography, motion, and components across platforms.' },
          { title: 'Lightning Design System (Salesforce)', author: 'Salesforce', year: 2015, url: 'https://www.lightningdesignsystem.com/', type: 'notes', level: 'intermediate', desc: 'Enterprise design system for Salesforce. Tokens, components, patterns, and accessibility standards for complex business applications.' },
          { title: 'Carbon Design System (IBM)', author: 'IBM', year: 2017, url: 'https://carbondesignsystem.com/', type: 'notes', level: 'intermediate', desc: 'IBM\'s open-source design system. Comprehensive components, data visualization, patterns, and contribution guidelines.' },
          { title: 'Polaris (Shopify)', author: 'Shopify', year: 2017, url: 'https://polaris.shopify.com/', type: 'notes', level: 'intermediate', desc: 'Shopify\'s design system for building admin experiences. Tokens, components, patterns, and content guidelines.' },
          { title: 'Spectrum (Adobe)', author: 'Adobe', year: 2019, url: 'https://spectrum.adobe.com/', type: 'notes', level: 'intermediate', desc: 'Adobe\'s cross-platform design system. Inclusive design, internationalization, and consistency across Creative Cloud products.' },
          { title: 'Primer (GitHub)', author: 'GitHub', year: 2016, url: 'https://primer.style/', type: 'code', level: 'intermediate', desc: 'GitHub\'s open-source design system. CSS framework, React components, and design guidelines powering GitHub\'s interface.' }
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
  paper:  { label: 'Paper',    cls: 'badge-paper' },
  tool:   { label: 'Tool',     cls: 'badge-tool' }
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
      <button class="filter-btn${activeFilter === 'tool' ? ' active' : ''}" data-filter="tool">Tools</button>
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
