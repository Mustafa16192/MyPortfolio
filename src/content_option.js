const logotext = "MAM";
const meta = {
  title: "Mustafa Ali Mirza",
  description:
    "I’m Mustafa Ali Mirza, a Product Manager and UX-driven technologist from Pakistan",
};

const introdata = {
  title: "Hello, I’m Mustafa!",
  animated: {
    first: "I design impactful digital experiences",
    second: "I build scalable tech products",
    third: "I drive growth through UX & data",
  },
  description:
    "I’m a product manager with a strong foundation in user-centered design, technical development, and business strategy. I’ve helped scale tech products across industries like automotive, fintech, and classifieds in Pakistan and the UAE.",
};

const dataabout = {
  title: "About Myself",
  aboutme:
    "I’m an experienced product manager, currently admitted to the University of Michigan’s MSI program with a focus on User-Centered Product Development. Over the past years, I’ve built and optimized products for Dubizzle Group and other tech firms, improving engagement, automating operations, and driving millions in revenue.",
};

const earlyLife = {
  title: "Early Life and Background",
  description:
    "Born and raised in Lahore, Pakistan, I was always fascinated by systems, design, and how users interact with digital tools. From tinkering with websites in my teens to launching real products that serve thousands, my path has been a blend of curiosity, creativity, and persistence.",
};

const careerHighlights = {
  title: "Career Highlights",
  description:
    "At Dubizzle Group, I led CRM product development for their UAE automotive business, optimizing lead flows, sales processes, and affiliate integrations that generated over $2M in monthly revenue. Previously, I worked across startups and agencies to deliver web platforms, dashboards, and data-rich applications.",
};

const playingStyle = {
  title: "Product Thinking & UX Approach",
  description:
    "My style blends user empathy with a builder’s mindset. I work cross-functionally with engineering, design, and business teams to define user journeys, wireframes, roadmaps, and success metrics — ensuring that every feature solves a real user pain point while aligning with business goals.",
};

const personalTraits = {
  title: "Traits and Values",
  description:
    "I’m analytical, curious, and obsessed with improving how products serve users. I value clarity, data-backed decisions, and collaborative problem-solving. Outside work, I’m passionate about fitness, fragrances, and staying updated with emerging tech and markets.",
};

const philanthropy = {
  title: "Personal Projects & Initiatives",
  description:
    "Beyond full-time roles, I mentor aspiring product managers, write about user research, and contribute to open-source tooling for analytics workflows. I believe in sharing knowledge and helping grow the local tech ecosystem in Pakistan.",
};

const worktimeline = [
  {
    jobtitle: "Associate Product Manager",
    where: "Dubizzle Group UAE",
    date: "2024-Present",
  },
  {
    jobtitle: "AI Product Intern",
    where: "SoftAims",
    date: "2023",
  },
  {
    jobtitle: "Product Research Intern",
    where: "Alt Ventures",
    date: "2022",
  },
];

const skills = [
  {
    name: "Product Strategy",
    value: 90,
  },
  {
    name: "UX Design & Wireframing",
    value: 85,
  },
  {
    name: "Analytics & Reporting",
    value: 88,
  },
  {
    name: "Frontend Development",
    value: 80,
  },
  {
    name: "Stakeholder Communication",
    value: 90,
  },
];

const milestones = [
  {
    title: "March 2025: Admitted to University of Michigan",
    description:
      "Received admission into the University of Michigan’s School of Information (MSI) to specialize in User-Centered Product Development.",
  },
  {
    title: "February 2025: Built Affiliate Management System",
    description:
      "Product managed an affiliate system for car dealers, bankers, and DSOs, tracking commissions and lead flows.",
  },
  {
    title: "January 2025: Optimized Auto Lead Funnel",
    description:
      "Redesigned Dubizzle’s auto buyer-seller pipeline, improving task automation and agent efficiency across 3 sales teams.",
  },
  {
    title: "August 2024: Launched CarForce CRM",
    description:
      "Led development of a high-revenue CRM system managing car inspections, financing, and affiliate services across the UAE.",
  },
  {
    title: "June 2024: Expanded Tech Strategy",
    description:
      "Worked with founders to define and execute product strategies across multiple startups in finance, ecommerce, and auto-tech.",
  },
];

const dataportfolio = [
  {
    id: "carforce-crm",
    img: "project1.png",
    title: "CarForce CRM",
    description: "CarForce CRM – Optimized lead management and automation",
    timeline: "Aug 2024 - Present",
    role: "Product Manager",
    details:
      "A comprehensive CRM solution designed to streamline lead management and automate sales workflows. Key features include real-time lead tracking, automated follow-ups, and detailed performance analytics, resulting in a significant increase in conversion rates and operational efficiency.",
    sections: [
      {
        title: "Problem Statement",
        content: [
          "The existing lead management process was fragmented across multiple spreadsheets and disjointed tools, leading to a 30% drop-off rate in potential sales.",
          "Sales agents lacked visibility into lead history, resulting in redundant follow-ups and a frustrating customer experience.",
        ],
      },
      {
        title: "Solution & Approach",
        content: [
          "We designed a centralized CRM dashboard that aggregates leads from all sources (social media, website, referrals) into a single view.",
          "Implemented an automated task assignment engine that routes leads to the most appropriate agent based on availability and expertise.",
          "Developed a 'Customer 360' view providing agents with full conversation history, vehicle preferences, and previous interactions.",
        ],
        img: "project2.png",
      },
      {
        title: "Key Outcomes",
        content: [
          "Reduced lead response time from 4 hours to 15 minutes.",
          "Increased lead-to-appointment conversion rate by 25% within the first 3 months.",
          "Onboarded 50+ affiliate partners who now use the system exclusively for their lead submissions.",
        ],
      },
    ],
    link: "#",
  },
  {
    id: "crm-whatsapp-integration",
    img: "project2.png",
    title: "CRM WhatsApp Integration",
    description: "CRM WhatsApp Integration – Conversations, tasks, and follow-ups in sync",
    timeline: "2024",
    role: "Product Manager",
    details: "Seamlessly integrates WhatsApp conversations directly into the CRM. This allows agents to manage tasks, schedule follow-ups, and maintain a complete communication history within a single platform, improving response times and customer satisfaction.",
    sections: [
        {
            title: "Problem Statement",
            content: "Sales agents were juggling between personal WhatsApp accounts and the CRM, leading to lost communication data, untracked follow-ups, and a fragmented customer history."
        },
        {
            title: "Solution & Approach",
            content: "We integrated the official WhatsApp Business API directly into the CRM dashboard. This enabled features like one-click logging of chats, automated template messages for common queries, and unified task creation from within the chat interface."
        },
        {
            title: "Key Outcomes",
            content: "Achieved 100% data capture for client communications, reduced average response time by 40%, and significantly improved agent productivity by eliminating context switching."
        }
    ],
    link: "#",
  },
  {
    id: "dubizzle-affiliate-app",
    img: "project3.png",
    title: "Dubizzle Affiliate App",
    description: "Dubizzle Affiliate App – Bank evaluations, approvals, and payouts made simple",
    timeline: "2024",
    role: "Product Manager",
    details: "A dedicated application for managing affiliate partnerships. It simplifies the complex process of bank evaluations, streamlines approval workflows, and automates payout calculations, ensuring transparency and efficiency for all stakeholders.",
    sections: [
        {
            title: "Problem Statement",
            content: "Managing affiliate payouts and bank evaluations was a manual, error-prone process involving endless email chains and Excel sheets, causing delays in payments and partner dissatisfaction."
        },
        {
            title: "Solution & Approach",
            content: "Developed a dedicated mobile-first web app for affiliates to submit applications and track status in real-time. On the backend, we built an automated payout engine that calculates commissions based on complex tier structures."
        },
        {
            title: "Key Outcomes",
            content: "Reduced payout processing time from 15 days to 2 days, eliminated manual calculation errors, and improved partner satisfaction scores by over 30%."
        }
    ],
    link: "#",
  },
  {
    id: "uber-eats-combo-cart",
    img: "project4.png",
    title: "Uber Eats Combo Cart",
    description: "Uber Eats Combo Cart – Mix restaurants into one Uber Eats order",
    timeline: "Concept",
    role: "UX Designer",
    details: "An innovative feature concept for Uber Eats that allows users to order from multiple restaurants in a single transaction. This project focuses on the UX/UI challenges of combining different menus, delivery logistics, and unified checkout experiences.",
    sections: [
        {
            title: "Problem Statement",
            content: "Users often want to order items from different restaurants (e.g., main course from one, dessert from another) but are forced to place separate orders, incurring double delivery fees and logistical coordination issues."
        },
        {
            title: "Solution & Approach",
            content: "Designed a 'Combo Cart' experience that allows multi-merchant ordering. Key UX solutions included a unified checkout flow, clear delivery time estimation for batched orders, and a smart recommendation engine for complementary items."
        },
        {
            title: "Key Outcomes",
            content: "Validated the concept through user testing, showing a strong preference for the flexibility of mixed orders. The design reduced perceived friction in the ordering process and highlighted a potential revenue uplift from increased basket sizes."
        }
    ],
    link: "#",
  },
  {
    id: "goblue-ai-redesign",
    img: "goblue-ai.png",
    title: "GoBlue AI Redesign",
    description: "Independent concept work exploring trust and utility in a campus assistant",
    timeline: "2024",
    role: "Product Designer",
    details: "This is a research-driven redesign concept for a University of Michigan student campus life assistant experience. It is not an official University product redesign. It is a portfolio project that explores how an AI-powered campus assistant could become more useful, more trustworthy, and easier to adopt. The core issue is not just UI clutter, but adoption and trust.",
    sections: [
        {
            title: "1. Problem: The Gap Between AI Promise and Student Trust",
            content: [
                "University of Michigan students increasingly seek AI assistance, yet a critical barrier prevents widespread adoption: a profound lack of trust. This isn't merely a user interface problem; it's a foundational issue tied to perceived accuracy, reliability, U-M specificity, and privacy.",
                "The existing GoBlue App suffered from low awareness and usage, failing to meet the core needs and expectations students have for an intelligent campus companion. My goal was to explore how an AI-powered assistant could transcend these challenges."
            ],
            img: "goblue/go_blue_old.png",
            caption: "The existing landscape: Low awareness and unmet needs"
        },
        {
            title: "2. Research: Understanding the Student Landscape",
            content: [
                "To uncover the root causes of low trust, I conducted a survey (N=44) and user interviews.",
                "Key Findings:",
                "• 65.9% of students did not even know what the GoBlue app is.",
                "• 82.4% reported never using the app.",
                "• Top needs were 'Staying organized with deadlines' (72.7%) and 'Managing classes' (54.5%).",
                "Qualitative feedback was clear: \"I want AI help, but I need to know it's giving me accurate U-M specific answers.\""
            ],
            img: "AI.png",
            caption: "Survey and Interview Insights Driving the Redesign"
        },
        {
            title: "3. Insights & Approach",
            content: [
                "The research revealed that trust and utility are two sides of the same coin. Accuracy is king, and privacy is a foundation.",
                "My design strategy focused on:",
                "• Task-first IA: Organizing around moments, not features.",
                "• Prioritized Home: Surfacing deadlines and academic tasks immediately.",
                "• Trust as a Visible Layer: Using citations, freshness cues, and clear fallbacks to build confidence.",
                "• Calm UX: A direct, non-marketing tone suitable for high-stress academic environments."
            ]
        },
        {
            title: "4. Solution & Prototype",
            content: "The redesign introduces a proactive, highly relevant assistant. It surfaces critical info like deadlines and course overviews while integrating trust patterns to give students confidence in the data source."
        },
        {
            type: "video",
            src: "goblue/goblue.mp4",
            caption: "Concept Walkthrough: Building Trust and Utility"
        },
        {
            title: "5. Outcomes & Learnings",
            content: [
                "Outcomes: A validated understanding of student needs and a tangible prototype showcasing how a trustworthy AI experience could foster adoption.",
                "Learnings: Trust is not a feature; it is a foundational requirement. Focusing on immediate, task-oriented utility is crucial for overcoming initial skepticism."
            ],
            img: "blueprint-ai.png",
            caption: "Future vision: Integrating AI for a seamless campus experience"
        }
    ],
    link: "#",
  },
  {
    id: "snowgo-community-platform",
    img: "snowgo.png",
    title: "SnowGo",
    description: "Community driven platform for neighborhood snow assistance",
    timeline: "2023",
    role: "Product Lead",
    details: "A civic technology project designed to help neighborhoods coordinate snow clearing during winter emergencies. The platform enables residents to request or offer help, builds trust through lightweight verification, and prioritizes accessibility for non technical users. The project emphasizes human centered design under real world constraints.",
    sections: [
        {
            title: "Problem Statement",
            content: "During heavy snowfall, vulnerable residents (elderly, disabled) often struggle to clear their driveways, and existing volunteer coordination was ad-hoc and unreliable."
        },
        {
            title: "Solution & Approach",
            content: "Created a hyperlocal platform connecting neighbors willing to shovel with those in need. Features included a simple 'request help' flow, volunteer verification, and a map-based view of open requests to encourage community action."
        },
        {
            title: "Key Outcomes",
            content: "Facilitated over 200 snow clearing assists in the pilot neighborhood. Built a strong sense of community resilience and demonstrated the viability of civic tech in addressing local emergency needs."
        }
    ],
    link: "#",
  },
  {
    id: "umci-detroit-data-ecosystem",
    img: "umci-detroit.png",
    title: "UMCI Detroit Data Ecosystem",
    description: "Cross organization data product for urban decision making",
    timeline: "2023",
    role: "Data Strategist",
    details: "A systems level project analyzing how data flows between public agencies, nonprofits, and decision makers in Detroit. The work focuses on information architecture, stakeholder alignment, data governance, and usability for policy driven environments. Positioned as a data product rather than a class assignment.",
    sections: [
        {
            title: "Problem Statement",
            content: "Urban decision-making in Detroit was hampered by siloed data across various agencies, leading to inefficient resource allocation and a lack of holistic insight into community needs."
        },
        {
            title: "Solution & Approach",
            content: "Mapped the data ecosystem to identify bottlenecks and opportunities for integration. Proposed a shared data governance framework and a centralized data catalog to facilitate secure sharing and collaboration between stakeholders."
        },
        {
            title: "Key Outcomes",
            content: "Delivered a comprehensive strategic roadmap for data integration adopted by key stakeholder groups. The project laid the foundation for better cross-agency collaboration and data-informed policy making."
        }
    ],
    link: "#",
  },
  {
    id: "lantern-ai-walking-tour",
    img: "lantern-ai.png",
    title: "Lantern AI",
    description: "AI powered walking tour companion for immersive city exploration",
    timeline: "2023",
    role: "Product Designer",
    details: "An AI driven walking tour application designed to enhance city exploration through contextual storytelling, location aware prompts, and adaptive narratives. Lantern focuses on night walks and cultural discovery, balancing immersion with safety and usability. The project explores real time context awareness, content curation, and experience design for travel scenarios.",
    sections: [
        {
            title: "Problem Statement",
            content: "Traditional walking tours can be rigid and impersonal, while self-guided tours often lack depth and context, leaving travelers feeling disconnected from the city's stories."
        },
        {
            title: "Solution & Approach",
            content: "Designed 'Lantern', an AI companion that generates personalized audio narratives based on the user's location and interests. The interface uses dark mode and subtle cues to blend into the night walk experience without distracting from the surroundings."
        },
        {
            title: "Key Outcomes",
            content: "Created a highly immersive and flexible touring experience. User feedback highlighted the engaging nature of the AI-generated stories and the app's ability to uncover hidden local gems."
        }
    ],
    link: "#",
  },
  {
    id: "blueprint-ai",
    img: "blueprint-ai.png",
    title: "Blueprint AI",
    description: "AI powered research and synthesis tool for management consultants",
    timeline: "2023",
    role: "Product Lead",
    details: "An AI assisted application built to help management consultants rapidly synthesize research, structure problem statements, and generate first pass strategic insights. The product emphasizes workflow integration, source traceability, and decision support rather than generic text generation, supporting high stakes consulting environments.",
    sections: [
        {
            title: "Problem Statement",
            content: "Management consultants spend a disproportionate amount of time gathering and synthesizing initial research, reducing the time available for high-value strategic analysis."
        },
        {
            title: "Solution & Approach",
            content: "Developed Blueprint AI to automate the synthesis of large document sets. The tool structures unstructured data into frameworks (e.g., SWOT, PESTLE) and provides citations for every insight to ensure trust and traceability."
        },
        {
            title: "Key Outcomes",
            content: "Reduced initial research synthesis time by 70%. Consultants reported that the tool acted as a 'force multiplier', allowing them to reach actionable insights significantly faster."
        }
    ],
    link: "#",
  },
  {
    id: "plurals-multi-agent-research",
    img: "plurals.png",
    title: "Plurals Multi Agent Deliberation",
    description: "Research driven AI system for structured multi agent reasoning",
    timeline: "2023",
    role: "AI Researcher",
    details: "Research and engineering work on a multi agent deliberation library focused on persona generation, rate limiting, and batching strategies. The project investigates how structured disagreement and diverse perspectives can improve AI reasoning quality while addressing fairness and ethical considerations.",
    sections: [
        {
            title: "Problem Statement",
            content: "Single-agent LLM outputs can be biased or hallucinate. There was a need to explore how multi-agent debate and deliberation could improve the robustness and factual accuracy of AI responses."
        },
        {
            title: "Solution & Approach",
            content: "Engineered a library for orchestrating multi-agent debates. Implemented strategies for dynamic persona generation (e.g., 'The Skeptic', 'The Optimist') and structured the interaction to encourage diverse viewpoints and synthesis."
        },
        {
            title: "Key Outcomes",
            content: "Demonstrated that structured multi-agent deliberation significantly reduces hallucinations and improves the reasoning quality of complex queries compared to single-shot prompting."
        }
    ],
    link: "#",
  },
];

const contactConfig = {
  YOUR_EMAIL: "mustafa_mirza_56@outlook.com",
  YOUR_FONE: "+92 309 4363004",
  description:
    "Whether you're a founder, recruiter, or fellow builder — feel free to reach out if you want to collaborate, chat about product, or work together. I'm always open to meaningful conversations.",
  YOUR_SERVICE_ID: "your_service_id",
  YOUR_TEMPLATE_ID: "your_template_id",
  YOUR_USER_ID: "your_user_id",
};

const socialprofils = {
  github: "https://github.com/Mustafa16192?tab=repositories",
  facebook: "https://www.facebook.com/mustafa.mirza.549",
  linkedin: "https://www.linkedin.com/in/mustafa-ali-mirza/",
  twitter: "https://x.com/mustafa_16192?s=21",
  instagram: "https://x.com/mustafa_16192?s=21",
};

export {
  meta,
  dataabout,
  dataportfolio,
  worktimeline,
  skills,
  milestones,
  introdata,
  contactConfig,
  socialprofils,
  logotext,
  earlyLife,
  playingStyle,
  careerHighlights,
  personalTraits,
  philanthropy,
};
