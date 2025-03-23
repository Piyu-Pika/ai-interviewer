// Mock data for the AI Interviewer application

// Interview question interface
export interface InterviewQuestion {
  id: string
  text: string
  category: 'experience' | 'behavioral' | 'technical' | 'situational' | 'cultural'
  difficulty: 'easy' | 'medium' | 'hard'
  expectedDuration?: number // in seconds
}

// Interview feedback interface
export interface InterviewFeedback {
  score: number // 0-100
  feedback: string
  strengths: string[]
  improvements: string[]
  keywords: {
    matched: string[]
    missed: string[]
  }
}

// Job interface
export interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  locationType: 'remote' | 'hybrid' | 'onsite'
  requirements: string[]
  salary: {
    min: number
    max: number
    currency: string
  }
  datePosted: string
  isPrivate: boolean
}

// Candidate interface
export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  resume?: string
  profile?: {
    title?: string
    bio?: string
    skills?: string[]
    experience?: string[]
    education?: string[]
  }
}

// Interview interface
export interface Interview {
  id: string
  jobId: string
  candidateId: string
  status: 'scheduled' | 'completed' | 'cancelled'
  date: string
  overallScore?: number
  questions: InterviewQuestion[]
  answers: {
    questionId: string
    transcript?: string
    videoUrl?: string
    feedback?: InterviewFeedback
  }[]
}

// User interface for authentication
export interface User {
  id: string
  name: string
  email: string
  role: 'candidate' | 'recruiter' | 'admin'
  company?: string
  avatar?: string
}

// Mock Jobs Data
export const jobs: Job[] = [
  {
    id: 'job-001',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    description: 'We are looking for an experienced Frontend Developer to join our team. The ideal candidate should have strong knowledge of React, TypeScript, and modern web development practices. You will be responsible for developing user interfaces, implementing features, and ensuring high-quality code.',
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    requirements: [
      'Proficient in JavaScript, TypeScript, and React',
      '5+ years of frontend development experience',
      'Experience with state management (Redux, Context API)',
      'Understanding of web accessibility standards',
      'Experience with responsive design',
      'Ability to work in an Agile environment'
    ],
    salary: {
      min: 120000,
      max: 160000,
      currency: '$'
    },
    datePosted: '2023-05-15',
    isPrivate: false
  },
  {
    id: 'job-002',
    title: 'UX/UI Designer',
    company: 'DesignCo',
    description: 'DesignCo is seeking a talented UX/UI Designer to create beautiful, intuitive interfaces for our products. You will work closely with product managers and developers to design user-centered experiences across web and mobile platforms.',
    location: 'New York, NY',
    locationType: 'remote',
    requirements: [
      'Portfolio demonstrating strong UI design skills',
      '3+ years experience in UI/UX design',
      'Proficiency in Figma and Adobe Creative Suite',
      'Experience conducting user research and usability testing',
      'Ability to create wireframes, prototypes, and high-fidelity designs',
      'Understanding of design systems and component libraries'
    ],
    salary: {
      min: 90000,
      max: 130000,
      currency: '$'
    },
    datePosted: '2023-05-20',
    isPrivate: false
  },
  {
    id: 'job-003',
    title: 'Full Stack Developer',
    company: 'InnovateTech',
    description: 'InnovateTech is looking for a Full Stack Developer to help build our next-generation SaaS platform. You will be working on both frontend and backend aspects of our applications, implementing new features, improving performance, and ensuring code quality.',
    location: 'Austin, TX',
    locationType: 'onsite',
    requirements: [
      'Strong experience with JavaScript/TypeScript, Node.js, and React',
      'Familiarity with relational and NoSQL databases',
      'Understanding of RESTful APIs and API design',
      'Experience with cloud services (AWS, GCP, or Azure)',
      'Knowledge of CI/CD pipelines',
      'Ability to work in a fast-paced startup environment'
    ],
    salary: {
      min: 100000,
      max: 140000,
      currency: '$'
    },
    datePosted: '2023-05-10',
    isPrivate: true
  },
  {
    id: 'job-004',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    locationType: 'hybrid',
    description: `CloudTech is seeking a DevOps Engineer to help automate and maintain our cloud infrastructure. You'll be responsible for CI/CD pipelines, infrastructure as code, and monitoring systems.`,
    requirements: [
      'Experience with AWS or Azure',
      'Knowledge of Docker and Kubernetes',
      'Experience with CI/CD tools',
      'Infrastructure as Code experience (Terraform, CloudFormation)',
      'Strong scripting skills (Bash, Python)'
    ],
    salary: {
      min: 125000,
      max: 155000,
      currency: 'USD'
    },
    datePosted: '2023-09-01',
    isPrivate: false,
    creatorId: 'user-002'
  },
  {
    id: 'job-005',
    title: 'Senior UX Designer',
    company: 'DesignFirst',
    location: 'Remote',
    locationType: 'remote',
    description: `DesignFirst is looking for a Senior UX Designer to create beautiful, functional user experiences for our clients. You'll work on a variety of projects from concept to implementation.`,
    requirements: [
      '5+ years of UX design experience',
      'Strong portfolio of web and mobile designs',
      'Experience with Figma or Sketch',
      'User research experience',
      'Understanding of accessibility standards'
    ],
    salary: {
      min: 115000,
      max: 145000,
      currency: 'USD'
    },
    datePosted: '2023-09-05',
    isPrivate: false,
    creatorId: 'user-003'
  },
  {
    id: 'job-006',
    title: 'Business Development Manager',
    company: 'GrowthCo',
    location: 'Chicago, IL',
    locationType: 'onsite',
    description: `GrowthCo is seeking a Business Development Manager to expand our client base and identify new market opportunities. You'll be responsible for generating leads, negotiating deals, and building relationships with key stakeholders.`,
    requirements: [
      '5+ years in business development or sales',
      'Track record of closing large deals',
      'Experience in the tech industry',
      'Strong negotiation skills',
      'Excellent presentation abilities'
    ],
    salary: {
      min: 100000,
      max: 130000,
      currency: 'USD'
    },
    datePosted: '2023-09-10',
    isPrivate: true,
    accessCode: 'GC-BD-2023',
    creatorId: 'user-003'
  }
];

// Mock Candidates Data
export const candidates: Candidate[] = [
  {
    id: 'cand-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-123-4567',
    profile: {
      title: 'Full Stack Developer',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      experience: [
        'Senior Developer at TechCorp (2018-Present)',
        'Web Developer at DevInc (2015-2018)'
      ],
      education: ['B.S. Computer Science, University of Technology (2015)']
    }
  },
  {
    id: 'cand-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 555-987-6543',
    profile: {
      title: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      experience: [
        'Lead Designer at DesignCo (2019-Present)',
        'UI Designer at CreativeLabs (2016-2019)'
      ],
      education: ['M.A. Design, Art Institute (2016)']
    }
  },
  {
    id: 'candidate-003',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '555-234-5678',
    resumeUrl: '/resumes/michael-chen-resume.pdf',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Machine Learning'],
    experience: {
      years: 7,
      relevant: 5
    },
    jobId: 'job-002',
    status: 'hired',
    interviews: [
      {
        id: 'interview-002',
        score: 92
      }
    ]
  },
  {
    id: 'candidate-004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '555-345-6789',
    resumeUrl: '/resumes/emily-davis-resume.pdf',
    skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis'],
    experience: {
      years: 5,
      relevant: 3
    },
    jobId: 'job-003',
    status: 'applied',
    interviews: []
  }
];

// Mock Interviews Data
export const interviews: Interview[] = [
  {
    id: 'int-001',
    jobId: 'job-001',
    candidateId: 'cand-001',
    status: 'scheduled',
    date: '2023-06-15T14:00:00Z',
    questions: [
      {
        id: 'q1-job001',
        text: 'Tell me about your experience with React and TypeScript.',
        category: 'experience',
        difficulty: 'medium',
        expectedDuration: 120
      },
      {
        id: 'q2-job001',
        text: 'Describe a challenging project you worked on and how you overcame obstacles.',
        category: 'behavioral',
        difficulty: 'medium',
        expectedDuration: 180
      },
      {
        id: 'q3-job001',
        text: 'How do you approach state management in large React applications?',
        category: 'technical',
        difficulty: 'hard',
        expectedDuration: 150
      }
    ],
    answers: []
  },
  {
    id: 'int-002',
    jobId: 'job-002',
    candidateId: 'cand-002',
    status: 'completed',
    date: '2023-05-10T10:30:00Z',
    overallScore: 85,
    questions: [
      {
        id: 'q1-job002',
        text: 'Walk us through your design process from requirements to final deliverables.',
        category: 'experience',
        difficulty: 'medium',
        expectedDuration: 150
      },
      {
        id: 'q2-job002',
        text: 'How do you incorporate user feedback into your designs?',
        category: 'behavioral',
        difficulty: 'medium',
        expectedDuration: 120
      },
      {
        id: 'q3-job002',
        text: 'Describe a situation where you had to balance user needs against business requirements.',
        category: 'situational',
        difficulty: 'hard',
        expectedDuration: 180
      }
    ],
    answers: [
      {
        questionId: 'q1-job002',
        transcript: 'My design process typically begins with understanding the requirements and user needs. I start by conducting research to understand the problem space and user behaviors. Then I move to sketching and wireframing, followed by interactive prototypes. I collaborate with stakeholders throughout the process, iterating based on feedback. The final deliverables usually include high-fidelity mockups, design specifications, and sometimes a component library.',
        videoUrl: '/interviews/int-002-q1.mp4',
        feedback: {
          score: 90,
          feedback: 'Excellent response that demonstrates a thorough understanding of the design process. The candidate clearly articulated each step and emphasized the importance of collaboration and iteration.',
          strengths: [
            'Comprehensive explanation of the design process',
            'Emphasized user research and stakeholder collaboration',
            'Mentioned deliverables clearly'
          ],
          improvements: [
            'Could provide more specific examples from past work',
            'Might elaborate on tools used during different stages'
          ],
          keywords: {
            matched: ['research', 'wireframing', 'prototypes', 'iteration', 'feedback'],
            missed: ['usability testing', 'user personas']
          }
        }
      },
      {
        questionId: 'q2-job002',
        transcript: 'I believe user feedback is essential to creating effective designs. After collecting feedback through usability tests, surveys, or direct interviews, I organize the findings to identify patterns and prioritize issues. I then incorporate these insights into the next design iteration, focusing on addressing the most critical user pain points first. I also make sure to validate the changes with additional testing to ensure they actually solve the problems identified.',
        videoUrl: '/interviews/int-002-q2.mp4',
        feedback: {
          score: 85,
          feedback: 'Strong response showing a methodical approach to incorporating user feedback. The candidate demonstrates an iterative approach to design and values validation.',
          strengths: [
            'Shows clear process for collecting and prioritizing feedback',
            'Mentions validation testing',
            'Emphasizes iterative design approach'
          ],
          improvements: [
            'Could discuss how to handle conflicting feedback',
            'Might mention specific tools used for feedback collection and analysis'
          ],
          keywords: {
            matched: ['usability tests', 'iteration', 'validation', 'pain points'],
            missed: ['quantitative data', 'feedback loops']
          }
        }
      },
      {
        questionId: 'q3-job002',
        transcript: 'In my previous role, we were redesigning a checkout process to improve conversion rates. The business wanted a simplified one-page checkout to reduce abandonment, but our user research showed that customers preferred a stepped process with clear progress indicators. I resolved this by designing a multi-step checkout that visually appeared streamlined, used progressive disclosure to reduce cognitive load, and included a persistent summary of the order. This approach satisfied the business goal of reducing abandonment while meeting user needs for clarity and control.',
        videoUrl: '/interviews/int-002-q3.mp4',
        feedback: {
          score: 95,
          feedback: 'Exceptional response with a specific, relevant example that perfectly addresses the question. The candidate demonstrated how they found a creative solution that balanced competing priorities.',
          strengths: [
            'Provided a concrete, detailed example',
            'Clearly identified both business and user needs',
            'Explained the reasoning behind the solution',
            'Described outcomes that satisfied both parties'
          ],
          improvements: [
            'Could mention metrics used to validate the solution\'s success'
          ],
          keywords: {
            matched: ['conversion rates', 'user research', 'cognitive load', 'progressive disclosure'],
            missed: []
          }
        }
      }
    ]
  },
  {
    id: 'int-003',
    jobId: 'job-003',
    candidateId: 'cand-001',
    status: 'completed',
    date: '2023-05-05T15:45:00Z',
    overallScore: 78,
    questions: [
      {
        id: 'q1-job003',
        text: 'Describe your experience with both frontend and backend technologies.',
        category: 'experience',
        difficulty: 'medium',
        expectedDuration: 150
      },
      {
        id: 'q2-job003',
        text: 'How do you ensure code quality and maintainability in your projects?',
        category: 'technical',
        difficulty: 'medium',
        expectedDuration: 120
      },
      {
        id: 'q3-job003',
        text: 'Describe a time when you had to learn a new technology quickly for a project.',
        category: 'behavioral',
        difficulty: 'medium',
        expectedDuration: 180
      }
    ],
    answers: [
      {
        questionId: 'q1-job003',
        transcript: 'I have over 5 years of experience working with both frontend and backend technologies. On the frontend, I\'m proficient with React, Redux, and TypeScript, having built several complex SPAs. For backend work, I\'ve used Node.js with Express and MongoDB for RESTful API development, as well as some experience with PostgreSQL. I\'ve implemented authentication systems, payment integrations, and real-time features using WebSockets.',
        videoUrl: '/interviews/int-003-q1.mp4',
        feedback: {
          score: 80,
          feedback: 'Good overview of technical skills across the stack. The candidate demonstrates breadth of experience with relevant technologies.',
          strengths: [
            'Clear overview of both frontend and backend technologies',
            'Mentioned specific frameworks and databases',
            'Highlighted complex features implemented'
          ],
          improvements: [
            'Could provide more concrete examples of projects',
            'Might elaborate on architecture decisions made'
          ],
          keywords: {
            matched: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL'],
            missed: ['Docker', 'CI/CD', 'cloud services']
          }
        }
      },
      {
        questionId: 'q2-job003',
        transcript: 'To ensure code quality, I rely on a combination of practices. I use linting tools like ESLint with strict configurations, enforce type safety with TypeScript, and write comprehensive unit and integration tests aiming for high coverage. For maintainability, I follow SOLID principles and focus on creating clear documentation. I also believe in the value of code reviews and pair programming for knowledge sharing and catching issues early.',
        videoUrl: '/interviews/int-003-q2.mp4',
        feedback: {
          score: 85,
          feedback: 'Strong response covering both technical and process-oriented approaches to code quality. The candidate demonstrates awareness of best practices.',
          strengths: [
            'Mentioned both tools and practices',
            'Referenced important principles (SOLID)',
            'Included human factors like code reviews'
          ],
          improvements: [
            'Could discuss CI/CD integration',
            'Might mention metrics used to track code quality'
          ],
          keywords: {
            matched: ['ESLint', 'TypeScript', 'tests', 'code reviews'],
            missed: ['continuous integration', 'refactoring']
          }
        }
      },
      {
        questionId: 'q3-job003',
        transcript: 'In my previous job, we needed to implement a real-time dashboard using WebSockets, which I hadn\'t worked with before. I had just two weeks to deliver the feature. I started by finding official documentation and tutorials, then built a small proof of concept. I also reached out to a colleague who had some experience in this area. By breaking down the learning into manageable chunks and focusing on practical application rather than theory, I was able to implement the feature on time.',
        videoUrl: '/interviews/int-003-q3.mp4',
        feedback: {
          score: 70,
          feedback: 'Decent response showing initiative and a systematic approach to learning. The candidate could have provided more details about the technical challenges faced.',
          strengths: [
            'Provided a relevant, specific example',
            'Demonstrated resourcefulness in learning',
            'Showed practical focus on delivering results'
          ],
          improvements: [
            'Could explain more about the technical challenges faced',
            'Might elaborate on how they validated their solution',
            'Could mention what they would do differently next time'
          ],
          keywords: {
            matched: ['WebSockets', 'documentation', 'proof of concept'],
            missed: ['time management', 'learning strategy']
          }
        }
      }
    ]
  }
];

// Mock Users Data
export const users: User[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'candidate',
    avatar: '/avatars/john.png'
  },
  {
    id: 'user-002',
    name: 'Jane Roberts',
    email: 'jane.roberts@techcorp.com',
    role: 'recruiter',
    company: 'TechCorp',
    avatar: '/avatars/jane.png'
  },
  {
    id: 'user-003',
    name: 'Robert Chen',
    email: 'robert.chen@saassolutions.com',
    role: 'recruiter',
    company: 'SaaS Solutions',
    avatar: '/avatars/robert.png'
  },
  {
    id: 'user-004',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: '/avatars/admin.png'
  }
]; 