/**
 * Single source of truth for every word and fact on the site.
 * Components read from here and render nothing that is not defined below.
 *
 * House rule: no em-dashes in any string that reaches the page.
 */

export const site = {
  name: 'Yoshwan Pathipati',
  title: 'Yoshwan Pathipati — Cloud Security & Distributed Systems',
  description:
    'Computer science student at Virginia Tech securing multi-cloud AWS and Azure environments at Triple Point Security, and building the SpaceNet satellite-constellation testbed at the Hume Center. AWS Certified Solutions Architect. Graduating May 2027.',
  // TODO: update to the real Vercel URL after first deploy (or a custom domain later).
  url: 'https://yoshwan-portfolio.vercel.app',
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
  sub: "Cybersecurity intern at Triple Point Security. Researcher on the SpaceNet Testbed at Virginia Tech's Hume Center. I like problems with real constraints, and I ship.",
  primaryCta: { label: 'View work', href: '#research' },
  secondaryCta: { label: 'Download résumé', href: '/resume.pdf' },
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
  { kind: 'count', to: 100, suffix: '+', label: 'critical & high-severity findings surfaced' },
  { kind: 'delta', from: 45, to: 8, unit: 'min', label: 'CI/CD deploy time' },
  { kind: 'count', to: 10, suffix: '+', label: 'researchers on my dashboards' },
  { kind: 'text', value: 'AWS', label: 'Certified Solutions Architect' },
];

export const profile = {
  code: 'SEC 01',
  title: 'Profile',
  body: "I'm a computer science student at Virginia Tech (May 2027, minors in AI, Cybersecurity, and Math) working at the intersection of cloud security and distributed systems. This summer I'm securing multi-cloud AWS/Azure environments at Triple Point Security; the rest of the year I build the SpaceNet Testbed at VT's Hume Center, a platform that simulates large-scale satellite constellations before anything launches. AWS-certified, Dean's List, co-founder of an 80-member coding club. Trilingual (English, Hindi, Telugu), with the adaptability and global perspective that comes from building a career across two continents.",
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
  bullets: string[];
};

export const fieldRecord = {
  code: 'SEC 02',
  title: 'Field record',
  primary: [
    {
      ref: 'FR-04',
      org: 'Triple Point Security',
      role: 'Cybersecurity Intern',
      dates: 'May 2026 – Present',
      place: 'Hybrid, Blacksburg VA',
      bullets: [
        'Architected a multi-cloud network linking AWS and Azure through VPC/VNet peering and a site-to-site VPN. Debugged a cross-provider IKE policy mismatch to bring the tunnel up, then automated the entire build with Terraform.',
        'Ran authenticated and unauthenticated Nessus scans across a 5-host lab, surfacing 100+ critical and high-severity findings, validated with Wireshark packet analysis.',
        'Caught a compliance-framework mismatch across four cross-referenced NIST/CMMC source documents before a 4-person team built a Security Hub mapping on the wrong control structure.',
        "When OpenVAS's web UI stalled mid-assessment, drove scans directly through the GMP protocol via CLI in its Docker deployment, and delivered on schedule.",
      ],
    },
    {
      ref: 'FR-03',
      org: 'Hume Center, Virginia Tech',
      role: 'Undergraduate Research Assistant, SpaceNet Testbed',
      dates: 'Sep 2025 – Present',
      place: 'Blacksburg VA',
      bullets: [
        'Designed Flask REST APIs that let 5+ aerospace researchers configure satellite simulations, launch experiments, and monitor real-time telemetry across concurrent workflows.',
        'Built 4 React dashboards (pnpm workspaces) for experiment control and live telemetry visualization, used by a 10+ person research team.',
        'Cut deployment from 45 to 8 minutes with a Docker + GitHub Actions CI/CD pipeline; reproducible builds across dev and production.',
      ],
    },
    {
      ref: 'FR-02',
      org: 'Virginia Tech Dept. of Computer Science',
      role: 'Undergraduate Research Assistant (OpenDSA)',
      dates: 'Jun – Aug 2025',
      bullets: [
        'Built Ruby on Rails backend features for the OpenDSA learning platform powering CS 3114.',
        'Refactored 3 instructor-facing controllers, eliminating N+1 queries and cutting database query time ~30% across analytics and progress-tracking modules.',
      ],
    },
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
  ] satisfies Role[],
  secondaryLabel: 'Earlier record',
  secondary: [
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
    { label: 'Program', value: "Hume Center, Virginia Tech" },
    { label: 'Role', value: 'Undergraduate Research Assistant' },
    { label: 'Stack', value: 'Docker · Flask · React · GitHub Actions' },
    { label: 'Presented', value: 'VT Summer Research Conference, 2026' },
    { label: 'Status', value: 'Active' },
  ],
} as const;

export type Build = {
  ref: string;
  name: string;
  year: string;
  tags: string[];
  body: string;
};

export const builds = {
  code: 'SEC 04',
  title: 'Selected builds',
  items: [
    {
      ref: 'BLD-01',
      name: 'Organic Farm E-Commerce Platform',
      year: '2025 – Present',
      tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
      body: "Digitizing my family's farm business: a full-stack storefront with Stripe payments and real-time inventory across 100+ produce SKUs, replacing spreadsheet order-taking. Built mobile-first for the ~70% of customers who shop from their phones.",
    },
    {
      ref: 'BLD-02',
      name: 'AI Restaurant Phone Assistant',
      year: '2026',
      tags: ['Twilio', 'LLM API', 'Flask', 'React'],
      body: 'A phone agent that answers restaurant calls, handles FAQs, and books reservations autonomously, with an owner dashboard for live call logs, transcripts, and analytics, and a Flask backend managing conversation state, business-specific prompts, and call routing.',
    },
    {
      ref: 'BLD-03',
      name: 'UniScheduler',
      year: '2026',
      tags: ['React', 'Python', 'Heuristic optimization'],
      body: 'An AI-assisted scheduling tool that generates conflict-free course timetables for 100+ students from preferences, time constraints, and degree requirements, with real-time schedule visualization and filtering.',
    },
  ] satisfies Build[],
} as const;

export const instrumentation = {
  code: 'SEC 05',
  title: 'Instrumentation',
  groups: [
    {
      ref: 'INS-01',
      name: 'Languages',
      items: ['Python', 'Java', 'C', 'JavaScript/TypeScript', 'SQL', 'Bash', 'PowerShell'],
    },
    {
      ref: 'INS-02',
      name: 'Cloud & infrastructure',
      items: [
        'AWS (VPC, EC2, IAM, S3, Security Hub, GuardDuty, Inspector, CloudWatch, CloudTrail)',
        'Azure (VNets, NSGs)',
        'Terraform',
        'Docker',
        'GitHub Actions',
        'Linux',
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
        'Flask',
        'Django',
        'Ruby on Rails',
        'MongoDB',
        'MySQL',
        'PostgreSQL',
      ],
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
    { name: 'NIST Risk Management Framework (RMF)', meta: '' },
  ],
  education: {
    school: 'Virginia Tech',
    degree: 'B.S. Computer Science',
    dates: 'May 2027',
    details: [
      { label: 'Minors', value: 'AI, Cybersecurity, Math' },
      { label: 'GPA', value: '3.42' },
      { label: 'Honors', value: "Dean's List" },
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
