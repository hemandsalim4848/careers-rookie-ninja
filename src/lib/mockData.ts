export interface Job {
  _id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  remote: boolean
  salaryMin?: number
  salaryMax?: number
  currency: string
  description: string
  responsibilities: string[]
  requirements: string[]
  niceToHave?: string[]
  status: 'open' | 'closed'
  postedAt: string
  applicationCount?: number
}

export const MOCK_JOBS: Job[] = [
  {
    _id: '1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Chennai, India',
    type: 'Full-time',
    remote: true,
    salaryMin: 2000000,
    salaryMax: 3200000,
    currency: 'INR',
    description: 'We are looking for a Senior Frontend Engineer to help build the next generation of our platform. You will work closely with designers, backend engineers, and product managers.',
    responsibilities: [
      'Architect and build scalable React/Next.js applications',
      'Collaborate with design to implement pixel-perfect UI',
      'Mentor junior engineers and conduct code reviews',
      'Drive frontend performance and accessibility standards',
    ],
    requirements: [
      '5+ years of React/Next.js experience',
      'Strong TypeScript knowledge',
      'Experience with REST and GraphQL APIs',
      'Understanding of CI/CD and modern deployment pipelines',
    ],
    niceToHave: [
      'Experience with Three.js or WebGL',
      'Open-source contributions',
    ],
    status: 'open',
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    applicationCount: 12,
  },
  {
    _id: '2',
    title: 'Backend Engineer — Node.js',
    department: 'Engineering',
    location: 'Bangalore, India',
    type: 'Full-time',
    remote: false,
    salaryMin: 1800000,
    salaryMax: 2800000,
    currency: 'INR',
    description: 'Join our backend team to design, build, and scale APIs that power millions of requests per day.',
    responsibilities: [
      'Design and implement RESTful and GraphQL APIs',
      'Optimize database queries and schema design',
      'Build real-time features using WebSockets',
      'Ensure security best practices across services',
    ],
    requirements: [
      '4+ years backend experience with Node.js',
      'Strong MongoDB or PostgreSQL knowledge',
      'Experience with microservices architecture',
      'Familiarity with AWS or GCP',
    ],
    status: 'open',
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    applicationCount: 8,
  },
  {
    _id: '3',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    remote: true,
    salaryMin: 1600000,
    salaryMax: 2400000,
    currency: 'INR',
    description: 'We are looking for a Product Designer who is passionate about craft, systems thinking, and user-centred design.',
    responsibilities: [
      'Own end-to-end design flows from research to delivery',
      'Build and maintain our design system',
      'Run user research and usability testing',
      'Collaborate with PMs and engineers in agile sprints',
    ],
    requirements: [
      '3+ years product design experience',
      'Proficiency in Figma',
      'Portfolio showing systems thinking and interaction design',
    ],
    niceToHave: ['Motion design skills', 'Familiarity with Framer'],
    status: 'open',
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    applicationCount: 21,
  },
  {
    _id: '4',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Hyderabad, India',
    type: 'Full-time',
    remote: true,
    salaryMin: 1700000,
    salaryMax: 2600000,
    currency: 'INR',
    description: 'Help us build and operate world-class infrastructure. You will own reliability, scalability, and deployment automation.',
    responsibilities: [
      'Manage Kubernetes clusters and container orchestration',
      'Build and maintain CI/CD pipelines',
      'Implement observability: logging, metrics, alerting',
      'Drive incident response and postmortem culture',
    ],
    requirements: [
      '3+ years DevOps / SRE experience',
      'Kubernetes and Docker expertise',
      'Terraform or Pulumi for IaC',
      'AWS or GCP certifications a plus',
    ],
    status: 'open',
    postedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    applicationCount: 5,
  },
  {
    _id: '5',
    title: 'Marketing Intern',
    department: 'Marketing',
    location: 'Chennai, India',
    type: 'Internship',
    remote: false,
    currency: 'INR',
    description: 'A great opportunity for a marketing enthusiast to work with our growth team and learn content, social media, and campaign management.',
    responsibilities: [
      'Assist in creating content for social media channels',
      'Help run email marketing campaigns',
      'Research competitor strategies',
      'Support event coordination',
    ],
    requirements: [
      'Pursuing or recently completed a degree in Marketing, Communications, or related',
      'Strong written communication skills',
      'Familiarity with social media platforms',
    ],
    status: 'open',
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    applicationCount: 34,
  },
  {
    _id: '6',
    title: 'Data Engineer',
    department: 'Data',
    location: 'Remote',
    type: 'Contract',
    remote: true,
    salaryMin: 150000,
    salaryMax: 220000,
    currency: 'USD',
    description: 'Contract engagement to build and maintain our data pipelines and analytics infrastructure.',
    responsibilities: [
      'Design and build ETL pipelines',
      'Maintain our data warehouse in BigQuery',
      'Collaborate with analysts to model data',
      'Ensure data quality and observability',
    ],
    requirements: [
      '4+ years data engineering experience',
      'Python and SQL expertise',
      'Experience with dbt, Airflow, or similar',
      'BigQuery or Snowflake knowledge',
    ],
    status: 'open',
    postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    applicationCount: 9,
  },
]

export const DEPARTMENTS = [...new Set(MOCK_JOBS.map(j => j.department))]
export const LOCATIONS   = [...new Set(MOCK_JOBS.map(j => j.location))]
export const JOB_TYPES   = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const
