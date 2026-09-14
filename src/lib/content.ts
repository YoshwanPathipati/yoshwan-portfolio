/**
 * Single source of truth for every word and fact on the site.
 * Components read from here and render nothing that is not defined below.
 *
 * House rule: no em-dashes in any string that reaches the page.
 */

export const site = {
  name: 'Yoshwan Pathipati',
  title: 'Yoshwan Pathipati - Cloud Security & Distributed Systems',
  description:
    'Computer science student at Virginia Tech building a locally-hosted LLM feedback pipeline for the Dept. of Engineering Education, the SpaceNet satellite-constellation testbed at the Hume Center, and cloud security tooling from a cybersecurity internship at Triple Point Security. AWS Certified Solutions Architect. Graduating May 2027.',
  url: 'https://yoshwanpathipati.com',
  locale: 'en_US',
  docNumber: 'YP-2027',
  revision: 'REV S26',
  status: 'ACTIVE',
  /** Flip to true after dropping a real photo at public/headshot.jpg. */
  hasHeadshot: false,
} as const;

export const stampIn = {
  lines: [`DOC NO. ${site.docNumber}`, site.revision, `STATUS: ${site.status}`],
} as const;

export type NavItem = { code: string; label: string; href: string };

export const nav: NavItem[] = [
  { code: '01', label: 'Profile', href: '#profile' },
  { code: '02', label: 'Field record', href: '#field-record' },
  { code: '03', label: 'Research', href: '#research' },
  { code: '04', label: 'Builds', href: '#builds' },
  { code: '05', label: 'Instrumentation', href: '#instrumentation' },
  { code: '06', label: 'Credentials', href: '#credentials' },
  { code: '07', label: 'Contact', href: '#contact' },
];

export const hero = {
  eyebrow: "YOSHWAN PATHIPATI · CS @ VIRGINIA TECH '27 · AWS CERTIFIED SOLUTIONS ARCHITECT",
  headline: ['I secure clouds', 'and simulate satellite', 'constellations.'],
  sub: "AI Research Assistant at Virginia Tech's Dept. of Engineering Education. Researcher on the SpaceNet Testbed at the Hume Center. I like problems with real constraints, and I ship.",
  primaryCta: { label: 'View work', href: '#builds' },
  secondaryCta: { label: 'Download résumé', href: '/resume.pdf' },
  tertiaryCta: { label: 'View résumé', href: '/resume.pdf' },
  figure: {
    id: 'FIG. 01',
    caption: 'LEO MESH GROUND TRACK / 12 SV / 3 PLANES / INC 53°',
    /** Read aloud in place of the canvas. */
    alt: 'Animated equirectangular plot of a twelve-satellite low Earth orbit constellation. Three orbital planes trace sinusoidal ground tracks across a latitude and longitude grid, with inter-satellite links drawn between neighbouring satellites and data packets pulsing along them.',
  },
} as const;

export type Telemetry =
  | { kind: 'count'; to: number; suffix?: string; label: string }
  | { kind: 'delta'; from: number; to: number; unit: string; label: string }
  | { kind: 'text'; value: string; label: string };

export const telemetry: Telemetry[] = [
  { kind: 'count', to: 104, suffix: '+', label: 'critical & high-severity findings surfaced' },
  { kind: 'delta', from: 45, to: 8, unit: 'min', label: 'CI/CD deploy time' },
  { kind: 'count', to: 100, suffix: '+', label: 'students reached with automated AI feedback' },
  { kind: 'text', value: 'AWS', label: 'Certified Solutions Architect' },
];

export const profile = {
  code: 'SEC 01',
  title: 'Profile',
  body: "I'm a computer science student at Virginia Tech (May 2027, minors in AI, Cybersecurity, and Math) working at the intersection of applied AI, distributed systems, and cloud security. Right now I'm building a locally-hosted LLM pipeline for the Dept. of Engineering Education and the SpaceNet Testbed at VT's Hume Center, a platform that simulates large-scale satellite constellations before anything launches; this past summer I secured multi-cloud AWS/Azure environments as a cybersecurity intern at Triple Point Security. AWS-certified, Dean's List (top 20% of class), co-founder of an 80-member coding club. Trilingual (English, Hindi, Telugu), with the adaptability and global perspective that comes from building a career across two continents.",
  facts: [
    { label: 'Based', value: 'Blacksburg, VA' },
    { label: 'Graduating', value: 'May 2027' },
    { label: 'Languages', value: 'English, Hindi, Telugu' },
  ],
  headshotAlt: 'Yoshwan Pathipati',
} as const;

export type Role = {
  ref: string;
  org: string;
  role: string;
  dates: string;
  place?: string;
  /** A short state flag, shown only when a role isn't simply active, e.g. paused pending a return date. */
  status?: string;
  bullets: string[];
};

export const fieldRecord = {
  code: 'SEC 02',
  title: 'Field record',
  primary: [
    {
      ref: 'FR-05',
      org: 'Virginia Tech Dept. of Engineering Education',
      role: 'AI Research Assistant, LLM Automation',
      dates: 'Sep 2026 – Present',
      place: 'Blacksburg VA',
      bullets: [
        'Develop Python preprocessing scripts and faculty-reviewed prompts for CATME feedback generation through Ollama, ensuring compliance with university data-handling policies and delivering automated feedback to over 100 first-year engineering students.',
        'Advise faculty on model selection and deployment by assessing three model families (Llama, Qwen, and Kimi), their computational requirements, and available Hokie AI and VT ARC resources, leading to the adoption of models that meet performance and cost targets for classroom use.',
        'Collaborate with faculty and another assistant to containerize the CATME feedback pipeline with Docker, standardizing dependencies and setup for a target cohort of 100+ engineering students.',
      ],
    },
    {
      ref: 'FR-04',
      org: 'Triple Point Security',
      role: 'Cybersecurity Intern',
      dates: 'May – Aug 2026',
      place: 'Blacksburg VA',
      status: 'Paused, Spring 2027 co-op return pending',
      bullets: [
        'Introduced Amazon EventBridge and Amazon SNS to the compliance team, training 3 teammates to deploy workflows across AWS Regions.',
        'Established an AWS-Azure site-to-site VPN, resolving a cross-provider IKE policy mismatch and teaching teammates VPN setup; provisioned infrastructure across AWS, Azure, and GCP with Terraform.',
        'Conducted authenticated and unauthenticated Nessus scans across 5 hosts, surfacing 20+ critical and 84 high-severity findings, validated with Wireshark packet analysis.',
        "Resolved a NIST/CMMC framework mismatch across 4 source publications, establishing the control structure for the team's AWS Security Hub compliance mapping.",
        "When OpenVAS's web UI stalled mid-assessment, drove scans directly through the GMP protocol via CLI in its Docker deployment, completing the vulnerability assessment across the 5-host lab on schedule.",
        'Compared self-hosted Llama 3 against cloud LLMs for vulnerability-report generation, identifying severity-classification errors, missed CVEs, and RAG reliability limits that led to updated detection rules and fewer false positives.',
      ],
    },
    {
      ref: 'FR-03',
      org: 'Hume Center National Security Institute, Virginia Tech',
      role: 'Research Assistant, Full-Stack Development (SpaceNet Testbed)',
      dates: 'Sep 2025 – Present',
      place: 'Blacksburg VA',
      bullets: [
        'Led development of SpaceNet, building Flask REST APIs that let 5 aerospace researchers configure satellite simulations, launch experiments, and monitor telemetry across two concurrent workflows, streamlining their research process.',
        'Advised aerospace researchers on software capabilities and limitations, translating goals into 4 React dashboards for experiment configuration and live telemetry, serving 10+ team members.',
        'Proposed and deployed a Docker application after assessing hosting cost, reliability, and scaling constraints; automated CI/CD with GitHub Actions, reducing deployment time from 45 to 8 minutes.',
      ],
    },
    {
      ref: 'FR-02',
      org: 'Virginia Tech Dept. of Computer Science',
      role: 'Research Assistant, Backend Development (OpenDSA)',
      dates: 'Jun – Aug 2025',
      place: 'Blacksburg VA',
      bullets: [
        "Developed Ruby on Rails backend features for the CS 3114 interactive learning system, collaborating with faculty and contributors to add automated grading and real-time feedback workflows that streamlined student-instructor interactions and reduced manual grading effort.",
        "Refactored 3 Ruby on Rails controllers in OpenDSA's course analytics and student-progress modules, eliminating N+1 queries and reducing database query time by 30%.",
      ],
    },
  ] satisfies Role[],
  secondaryLabel: 'Earlier record',
  secondary: [
    {
      ref: 'FR-01',
      org: 'Avenues, IIT Bombay',
      role: 'Python Developer Intern',
      dates: 'Jul – Oct 2024',
      place: 'Remote',
      bullets: [
        'Shipped Django + MySQL backend features (authentication, profile management, data validation) across three core modules.',
        'Found 6 critical bugs in the auth flow through API testing with Postman and the DRF test client; all fixed across two sprints.',
      ],
    },
    {
      ref: 'FR-00',
      org: 'Merit Software Technologies',
      role: 'Software Intern',
      dates: 'Jan – Mar 2023',
      bullets: [
        'Reproduced 12 edge-case bugs in C-based backend features; bug reports with stack traces and repro steps cut average resolution time from 4 days to 2.5.',
      ],
    },
  ] satisfies Role[],
} as const;

export const research = {
  code: 'SEC 03',
  title: 'Featured research',
  name: 'SpaceNet Testbed',
  lede: 'Satellite constellations, simulated before they fly.',
  body: "SpaceNet simulates large-scale satellite constellations (think Starlink) before they're ever launched. It models real orbital mechanics and runs actual network traffic through a virtual constellation to measure real-world latency and throughput. My part: turning it into a Dockerized application. What used to mean hand-editing config files over SSH now runs in a browser: researchers configure experiments, launch simulations, and watch results render live in an interactive 3D view. No command line required. Presented as my first research poster at the Virginia Tech Summer Research Conference, 2026.",
  spec: [
    { label: 'Program', value: 'Hume Center National Security Institute, Virginia Tech' },
    { label: 'Role', value: 'Research Assistant, Full-Stack Development' },
    { label: 'Stack', value: 'Docker · Flask · React · GitHub Actions' },
    { label: 'Presented', value: 'VT Summer Research Conference, 2026' },
    { label: 'Status', value: 'Active' },
  ],
} as const;

export type BuildLane = 'AI Research' | 'Cloud Security' | 'AI Security' | 'Full-Stack' | 'Systems';
export type BuildStatus = 'LIVE' | 'SHIPPED' | 'IN PROGRESS';

export type Build = {
  codename: string;
  title: string;
  lane: BuildLane;
  status: BuildStatus;
  body: string;
  stack: string[];
  metrics: string[];
  /** Renders a "View demo" link when present. */
  demoUrl?: string;
  /** Renders a "Source" link when present. */
  repoUrl?: string;
};

export const builds = {
  code: 'SEC 04',
  title: 'Selected builds',
  /** Mono sub-label under the heading. Kept in sync with the data by hand. */
  subLabel: 'SIX SYSTEMS // THREE SHIPPED, THREE IN PROGRESS',
  // A plain annotation, not `satisfies`: several items omit demoUrl/repoUrl
  // entirely, and `satisfies` would infer each item's literal shape rather
  // than the full Build interface, so accessing an absent optional field
  // elsewhere would fail to typecheck even though it's a valid `undefined`.
  items: [
    {
      codename: 'BLD-01',
      title: 'Multimodal Associative Memory',
      lane: 'AI Research',
      status: 'IN PROGRESS',
      body: 'A symmetric recurrent energy-based model for audiovisual associative memory: continuous-time dynamics in JAX and a Modern Hopfield core with a Log-Sum-Exp energy function enable bidirectional pattern completion between audio and visual embeddings. Trained through Equilibrium Propagation, using local, biologically inspired weight updates instead of backpropagation.',
      stack: ['JAX', 'Modern Hopfield Networks', 'Equilibrium Propagation', 'Energy-Based Models'],
      metrics: ['Bidirectional audio-visual recall', 'Biologically plausible training', 'No backpropagation'],
    },
    {
      codename: 'BLD-02',
      title: 'CloudGuard',
      lane: 'Cloud Security',
      status: 'SHIPPED',
      body: 'A Terraform-provisioned AWS environment (VPC, EC2, S3, IAM) that wires up GuardDuty, Inspector, and Security Hub for continuous detection, mapping every finding to its NIST 800-53 control on a live React dashboard. A GitHub Actions pipeline runs tfsec on every push, so insecure infrastructure never merges.',
      stack: ['Terraform', 'AWS', 'GuardDuty', 'Security Hub', 'GitHub Actions', 'tfsec'],
      metrics: ['CI-time misconfig blocking', 'NIST 800-53 auto-mapped', 'Multi-service detection'],
    },
    {
      codename: 'BLD-03',
      title: 'PromptShield',
      lane: 'AI Security',
      status: 'IN PROGRESS',
      body: 'An LLM security testing harness that fires adversarial prompts (injection, jailbreaks, data exfiltration) structured around the OWASP Top 10 for LLM Applications, then proves an input and output guardrail that cuts the attack success rate. Benchmarks a self-hosted Llama3 model against a cloud model to compare how injectable each one is.',
      stack: ['Python', 'LLM APIs', 'Ollama', 'OWASP LLM Top 10'],
      metrics: ['Attack success rate before/after guardrail', 'OWASP LLM Top 10 coverage', 'Local vs cloud benchmark'],
    },
    {
      codename: 'BLD-04',
      title: 'AI Restaurant Phone Assistant',
      lane: 'AI Security',
      status: 'SHIPPED',
      body: 'A Twilio and LLM powered phone agent that answers restaurant calls, handles FAQs, and books reservations autonomously, with a Flask backend managing conversation state and call routing. A React owner dashboard behind secure auth shows live call logs and analytics, hardened against prompt injection using my own PromptShield harness.',
      stack: ['Twilio', 'LLM API', 'Flask', 'React', 'Secure Auth'],
      metrics: ['Autonomous call handling', 'Live transcript + analytics', 'Injection-hardened'],
    },
    {
      codename: 'BLD-05',
      title: 'Organic Farm E-Commerce Platform',
      lane: 'Full-Stack',
      status: 'IN PROGRESS',
      body: "Digitizing my family's farm business: a full-stack storefront with Stripe payments and real-time inventory across 100+ produce SKUs, replacing spreadsheet order-taking. Built mobile-first for the roughly 70% of customers who shop from their phones, with a guest demo mode to try the order flow without signing up.",
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
      metrics: ['100+ SKUs managed', 'Stripe checkout', 'Mobile-first'],
    },
    {
      codename: 'BLD-06',
      title: 'WhisperKey',
      lane: 'Systems',
      status: 'SHIPPED',
      body: 'Free, open-source alternative to Wispr Flow: hold a key, speak, and clean formatted text lands at your cursor in any Windows app, powered by local speech-to-text on the GPU and a local LLM cleanup pass. Fully offline: no cloud, no subscription, no audio ever leaves the machine.',
      stack: ['Python', 'faster-whisper', 'Ollama', 'CUDA'],
      metrics: ['Fully offline', 'GPU-accelerated', 'System-wide hotkey'],
      repoUrl: 'https://github.com/YoshwanPathipati/whisperkey',
    },
  ] as Build[],
} as const;

export const instrumentation = {
  code: 'SEC 05',
  title: 'Instrumentation',
  groups: [
    {
      ref: 'INS-01',
      name: 'Languages',
      items: [
        'Python',
        'Java',
        'C',
        'JavaScript/TypeScript',
        'HTML/CSS',
        'SQL',
        'Ruby',
        'Bash',
        'PowerShell',
      ],
    },
    {
      ref: 'INS-02',
      name: 'Cloud & infrastructure',
      items: [
        'AWS (VPC, EC2, IAM, S3, Security Hub, GuardDuty, Inspector, CloudWatch, CloudTrail)',
        'Azure (VNets, NSGs)',
        'GCP',
        'Terraform',
        'Docker',
        'VMware',
        'Git · GitHub Actions',
        'Linux',
        'pnpm',
      ],
    },
    {
      ref: 'INS-03',
      name: 'Security',
      items: [
        'Nessus',
        'OpenVAS',
        'Wireshark',
        'nmap',
        'vulnerability assessment',
        'NIST 800-53 / RMF',
        'CMMC',
      ],
    },
    {
      ref: 'INS-04',
      name: 'Web & data',
      items: [
        'React',
        'Node.js',
        'Express',
        'Flask',
        'Django',
        'Ruby on Rails',
        'MongoDB',
        'MySQL',
        'PostgreSQL',
        'Redis',
      ],
    },
    {
      ref: 'INS-05',
      name: 'AI & ML',
      items: ['JAX', 'Ollama', 'Llama / Llama 3', 'RAG'],
    },
  ],
} as const;

export const credentials = {
  code: 'SEC 06',
  title: 'Certifications & education',
  certifications: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      meta: 'July 2026',
      href: 'https://www.credly.com/badges/7534fd0b-e184-4361-9836-e2d27c96adf2',
      hrefLabel: 'Verify',
    },
    { name: 'CompTIA Security+', meta: 'In progress' },
    { name: 'NIST Risk Management Framework (RMF)', meta: '' },
  ],
  education: {
    school: 'Virginia Tech',
    degree: 'B.S. Computer Science',
    dates: 'May 2027',
    details: [
      { label: 'Minors', value: 'AI, Cybersecurity, Math' },
      { label: 'GPA', value: '3.42' },
      { label: 'Honors', value: "Dean's List, top 20% of class" },
      { label: 'Coursework', value: 'Machine Learning, Computer Systems, Data Structures and Algorithms, Intro to AI, Cloud Software Development, Cryptography' },
      { label: 'Leadership', value: 'Co-founder, Collaborative Coding Activities Club (80+ members)' },
    ],
  },
} as const;

export const contact = {
  code: 'SEC 07',
  title: 'Establish contact',
  status: 'Open to internships and full-time roles. Graduating May 2027.',
  email: 'yoshwanpathipati@vt.edu',
  links: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yoshwan-pathipati-b9b525269' },
    { label: 'GitHub', href: 'https://github.com/YoshwanPathipati' },
  ],
  resume: { label: 'Résumé', href: '/resume.pdf' },
} as const;

export const footer = {
  colophon: `Designed & built by ${site.name} · Next.js · ${new Date().getFullYear()}`,
  stamp: `DOC NO. ${site.docNumber} / ${site.revision} / STATUS: ${site.status}`,
} as const;

export const easterEgg = {
  trigger: 'hire',
  stamp: 'Approved for interview',
  sub: `DOC NO. ${site.docNumber} / ${site.revision}`,
  action: { label: 'Take the résumé', href: '/resume.pdf' },
  dismiss: 'Dismiss',
} as const;
