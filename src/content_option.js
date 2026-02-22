const logotext = "Mustafa Ali Mirza";
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

const operatingPrinciples = [
  {
    id: "adoption-before-breadth",
    principle: "Adoption before breadth",
    example:
      "Start with the smallest behavior change users will repeat, then expand scope.",
    tag: "strategy",
  },
  {
    id: "trust-visible",
    principle: "Make trust visible",
    example:
      "Use source cues, confidence boundaries, and clear fallbacks for AI experiences.",
    tag: "quality",
  },
  {
    id: "workflow-first",
    principle: "Design around workflows",
    example:
      "Improve handoffs, timing, and defaults before introducing more screens.",
    tag: "delivery",
  },
  {
    id: "instrument-decisions",
    principle: "Instrument decisions",
    example:
      "Tie product bets to an owner, a metric, and a review date.",
    tag: "growth",
  },
  {
    id: "reduce-load",
    principle: "Reduce cognitive load first",
    example:
      "Prioritize sequencing and clarity before adding visual complexity.",
    tag: "research",
  },
  {
    id: "ship-reversible",
    principle: "Ship with reversibility",
    example:
      "Prefer rollout paths that let the team learn quickly without operational risk.",
    tag: "collaboration",
  },
];

const decisionLog = [
  {
    id: "goblue-trust-first-ia",
    title: "GoBlue AI Redesign",
    context:
      "Students wanted AI help, but low awareness and low trust blocked adoption.",
    constraint:
      "Concept project with no internal product access or institutional rollout path.",
    call:
      "Prioritized trust and task-first IA before expanding feature breadth.",
    outcome:
      "Produced a research-backed prototype with a clearer adoption and trust hypothesis.",
    projectId: "goblue-ai-redesign",
    projectSectionId: "chapter-4-insights-approach",
    visibility: "public",
  },
  {
    id: "carforce-unify-core-workflow",
    title: "CarForce CRM",
    context:
      "Lead handling across inspections, financing, and affiliates was fragmented.",
    constraint:
      "High-volume operations and NDA limits reduced how much could be redesigned at once.",
    call:
      "Unified lead-task-follow-up workflow primitives before edge-case feature requests.",
    outcome:
      "Improved execution consistency and reduced operational friction across teams.",
    projectId: "carforce-crm",
    projectSectionId: "chapter-2-impact-outcomes",
    visibility: "nda-safe",
  },
  {
    id: "whatsapp-embed-not-mirror",
    title: "CRM WhatsApp Integration",
    context:
      "Agents were switching between devices and systems, losing continuity and accountability.",
    constraint:
      "Official channel and compliance constraints ruled out a loose chat-style clone.",
    call:
      "Embedded messaging into CRM workflows instead of mirroring consumer chat UX.",
    outcome:
      "Improved follow-up continuity and captured client interactions inside one system.",
    projectId: "crm-whatsapp-integration",
    projectSectionId: "chapter-2-impact-outcomes",
    visibility: "nda-safe",
  },
  {
    id: "affiliate-self-serve-vs-ops-bottleneck",
    title: "Dubizzle Affiliate App",
    context:
      "Affiliate evaluations and payouts relied on manual coordination and repetitive checks.",
    constraint:
      "Finance/compliance workflows required accuracy and traceability over speed-only shortcuts.",
    call:
      "Built a self-serve partner surface with an automated backend for finance operations.",
    outcome:
      "Reduced processing friction while improving trust and consistency for partner payouts.",
    projectId: "dubizzle-affiliate-app",
    projectSectionId: "chapter-2-impact-outcomes",
    visibility: "nda-safe",
  },
];

const dataportfolio = [
  {
    id: "goblue-ai-redesign",
    img: "go_blue_main.png",
    title: "GoBlue AI Redesign",
    description: "Independent concept work exploring trust and utility in a campus assistant",
    timeline: "August 2025 - December 2025",
    role: "UX Researcher & Designer",
    emoji: "🎓",
    quickGlance: ["0 - 1", "B2C", "UX Research"],
    details: "This is a research-driven redesign concept for a University of Michigan student campus life assistant experience. It is not an official University product redesign. It is a portfolio project that explores how an AI-powered campus assistant could become more useful, more trustworthy, and easier to adopt. The core issue is not just UI clutter, but adoption and trust.",
    tradeoffs: [
      {
        id: "breadth-vs-trust",
        title: "Narrower AI scope, higher trust",
        options: "AI feature breadth vs trust clarity",
        decision:
          "Focused on a smaller set of high-confidence campus tasks instead of broad AI coverage.",
        reason:
          "Students signaled that perceived accuracy and U-M specificity mattered more than novelty.",
        impact:
          "The concept reads calmer and more credible, with clearer adoption paths for first use.",
        confidence: "high",
      },
      {
        id: "proactive-vs-intrusive",
        title: "Useful prompts without overload",
        options: "Proactive assistance vs notification fatigue",
        decision:
          "Prioritized task-first reminders and contextual quick actions over constant AI prompts.",
        reason:
          "The product needed to feel supportive during high-stress academic moments, not distracting.",
        impact:
          "The home experience stays focused on deadlines and immediate utility.",
        confidence: "medium",
      },
      {
        id: "polish-vs-evidence",
        title: "Research evidence before visual polish",
        options: "High-fidelity polish vs early validation evidence",
        decision:
          "Invested first in survey/interview-backed direction, then translated findings into interface flows.",
        reason:
          "Trust problems were behavioral and informational, not only visual.",
        impact:
          "The redesign rationale is stronger and easier to defend in critique.",
        confidence: "high",
      },
    ],
    sections: [
        {
            title: "Problem Statement",
            content: [
                "University of Michigan students increasingly seek AI assistance, yet a critical barrier prevents widespread adoption: a profound lack of trust. This isn't merely a user interface problem; it's a foundational issue tied to perceived accuracy, reliability, U-M specificity, and privacy.",
                "The existing GoBlue App suffered from low awareness and usage, failing to meet the core needs and expectations students have for an intelligent campus companion."
            ],
            img: "images/Sketches/existing_go_blue.png",
            caption: "The existing landscape: Low awareness and unmet needs"
        },
        {
            title: "User Research",
            content: [
                "To uncover the root causes of low trust, I conducted a survey (N=44) and user interviews.",
                "Key Findings:",
                "• 65.9% of students did not even know what the GoBlue app is.",
                "• 82.4% reported never using the app.",
                "• Top needs were 'Staying organized with deadlines' (72.7%) and 'Managing classes' (54.5%).",
                "Qualitative feedback was clear: \"I want AI help, but I need to know it's giving me accurate U-M specific answers.\""
            ],
            img: "images/Sketches/user_responses_1.png",
            caption: "Survey Insights: What drives student trust?"
        },
        {
            title: "User Sentiment Analysis",
            content: "Students emphasized that trust is built through accuracy, specific internal data, and clear privacy boundaries. They want an assistant that feels like a reliable tool, not a social media gimmick.",
            img: "images/Sketches/user_responses_2.png",
            caption: "Direct quotes and likelihood of adoption based on features."
        },
        {
            title: "Insights & Approach",
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
            title: "Ideation & Sketching",
            content: "I started by mapping out the core user flows—checking deadlines, finding events, and asking quick queries. The goal was to reduce friction and make the 'smart' features accessible without being intrusive.",
            img: "images/Sketches/go_blue_sketch1.png",
            caption: "Early explorations of the home screen and navigation."
        },
        {
            title: "Smart Reminder Controls",
            content: "Iterating on the 'Smart Reminders' and settings to give users control over what the AI tracks and suggests.",
            img: "images/Sketches/go_blue_sketch2.png",
            caption: "Refining the settings and reminder controls."
        },
        {
            title: "Quick Query Exploration",
            content: "Drafting the 'Quick Query' interface, focusing on how to present AI suggestions based on recent context (e.g., bus times, dining).",
            img: "images/Sketches/go_blue_sketch3.png",
            caption: "Sketching the query interface and contextual suggestions."
        },
        {
            title: "Solution & Prototype",
            content: "The redesign introduces a proactive, highly relevant assistant. It surfaces critical info like deadlines and course overviews while integrating trust patterns to give students confidence in the data source."
        },
        {
            title: "Prototype Walkthrough",
            type: "video",
            src: "goblue/goblue.mp4",
            caption: "Concept Walkthrough: Building Trust and Utility"
        },
        {
            title: "Outcomes & Learnings",
            content: [
                "Outcomes: A validated understanding of student needs and a tangible prototype showcasing how a trustworthy AI experience could foster adoption.",
                "Learnings: Trust is not a feature; it is a foundational requirement. Focusing on immediate, task-oriented utility is crucial for overcoming initial skepticism."
            ]
        }
    ],
    link: "#",
  },
  {
    id: "carforce-crm",
    img: "project1.png",
    title: "CarForce CRM",
    description: "CarForce CRM – Optimized lead management and automation",
    timeline: "August 2024 - June 2025",
    role: "Product Manager",
    emoji: "🚗",
    quickGlance: ["B2B SaaS", "Automotive", "CRM"],
    details:
      "A comprehensive CRM solution designed to streamline lead management and automate sales workflows. Key features include real-time lead tracking, automated follow-ups, and detailed performance analytics, resulting in a significant increase in conversion rates and operational efficiency. Due to NDA restrictions, specific interface designs and internal data cannot be shared publicly.",
    tradeoffs: [
      {
        id: "configurability-vs-rollout-speed",
        title: "Opinionated defaults before deep configurability",
        options: "Configurability vs rollout speed",
        decision:
          "Shipped strong workflow defaults first instead of supporting every team variation on day one.",
        reason:
          "A unified operating model was needed to reduce process drift and training overhead.",
        impact:
          "Faster implementation with clearer behavior, then room for controlled iteration.",
        confidence: "high",
      },
      {
        id: "automation-vs-exceptions",
        title: "Automate common paths first",
        options: "Automation coverage vs exception handling depth",
        decision:
          "Automated high-frequency lead and follow-up paths before rare edge-case scenarios.",
        reason:
          "Most operational waste came from repetitive actions, not uncommon exceptions.",
        impact:
          "Delivered earlier efficiency gains while preserving a manual fallback for outliers.",
        confidence: "high",
      },
      {
        id: "visibility-vs-nda-disclosure",
        title: "Proof without oversharing",
        options: "Public case-study detail vs confidentiality constraints",
        decision:
          "Kept the public narrative focused on workflow outcomes, process logic, and scope.",
        reason:
          "Sensitive internal flows and metrics could not be exposed in a public portfolio.",
        impact:
          "The case remains credible and interview-ready without breaching confidentiality.",
        confidence: "high",
      },
    ],
    sections: [
      {
        title: "Overview",
        content: [
          "I led the development of a high-revenue CRM system managing car inspections, financing, and affiliate services. The goal was to replace fragmented manual processes with a unified, automated dashboard.",
        ],
      },
      {
        title: "Impact & Outcomes",
        content: [
          "The system significantly reduced lead response times and increased conversion rates by centralizing data and automating agent tasks.",
          "It is currently managing a significant portion of the automotive lead flow for the UAE market.",
        ],
      },
      {
        title: "Confidentiality Notice",
        content: "Detailed case studies, including wireframes, user flows, and specific metrics, are available for review during a private interview context, subject to confidentiality agreements."
      }
    ],
    link: "/contact",
    linkLabel: "Contact for Details"
  },
  {
    id: "crm-whatsapp-integration",
    img: "project2.png",
    title: "CRM WhatsApp Integration",
    description: "CRM WhatsApp Integration – Conversations, tasks, and follow-ups in sync",
    timeline: "August 2024 - June 2025",
    role: "Product Manager",
    emoji: "💬",
    quickGlance: ["B2B SaaS", "Conversational UX", "Workflow Automation"],
    details: "Seamlessly integrates WhatsApp conversations directly into the CRM. This allows agents to manage tasks, schedule follow-ups, and maintain a complete communication history within a single platform. Specific implementation details are proprietary.",
    tradeoffs: [
      {
        id: "chat-familiarity-vs-workflow-structure",
        title: "Workflow-native messaging over chat mimicry",
        options: "Consumer chat familiarity vs CRM workflow structure",
        decision:
          "Designed messaging around tasks, follow-ups, and records instead of recreating a pure chat app.",
        reason:
          "The business need was continuity and accountability, not just message exchange speed.",
        impact:
          "Agents retained context while managers gained auditable activity visibility.",
        confidence: "high",
      },
      {
        id: "speed-vs-compliance",
        title: "Compliance-aware interaction design",
        options: "Fast interaction shortcuts vs channel/compliance safeguards",
        decision:
          "Added guardrails and official-channel patterns even when they introduced minor friction.",
        reason:
          "Reliability and policy alignment mattered more than short-term convenience.",
        impact:
          "The integration stayed operationally viable and easier to scale across teams.",
        confidence: "high",
      },
      {
        id: "unification-vs-feature-depth",
        title: "Unify the core loop first",
        options: "Unified communication history vs advanced messaging feature depth",
        decision:
          "Prioritized centralized conversation history and follow-up continuity before advanced messaging tools.",
        reason:
          "Fragmented context was the root problem hurting agent performance.",
        impact:
          "Delivered immediate productivity gains without overcomplicating the first release.",
        confidence: "medium",
      },
    ],
    sections: [
        {
            title: "Overview",
            content: "Sales agents previously struggled with disconnected communication channels, using personal devices for business. This project embedded official WhatsApp Business capabilities directly into their daily workflow."
        },
        {
            title: "Impact & Outcomes",
            content: "Achieved 100% data capture for client interactions and improved agent productivity by eliminating context switching between devices and the CRM."
        },
        {
            title: "Confidentiality Notice",
            content: "Further details regarding the technical integration and specific user journey improvements can be discussed in a private setting."
        }
    ],
    link: "/contact",
    linkLabel: "Contact for Details"
  },
  {
    id: "dubizzle-affiliate-app",
    img: "project3.png",
    title: "Dubizzle Affiliate App",
    description: "Dubizzle Affiliate App – Bank evaluations, approvals, and payouts made simple",
    timeline: "August 2024 - June 2025",
    role: "Product Manager",
    emoji: "🤝",
    quickGlance: ["Fintech Ops", "Affiliate Platform", "B2B"],
    details: "A dedicated application for managing affiliate partnerships. It simplifies the complex process of bank evaluations, streamlines approval workflows, and automates payout calculations. Due to the sensitive nature of financial workflows, detailed designs are not public.",
    sections: [
        {
            title: "Overview",
            content: "Managing affiliate payouts and bank evaluations was a manual, high-friction process involving significant administrative overhead. We built a self-serve portal for partners and an automated backend for finance teams."
        },
        {
            title: "Impact & Outcomes",
            content: "Drastically reduced processing times and payment errors, improving trust and satisfaction among our partner network while ensuring compliance."
        },
        {
            title: "Confidentiality Notice",
            content: "I am happy to discuss my specific role in leading this product's lifecycle and the problem-solving methodologies used during an interview."
        }
    ],
    link: "/contact",
    linkLabel: "Contact for Details"
  },
  {
    id: "uber-eats-combo-cart",
    img: "project4.png",
    title: "Uber Eats Combo Cart",
    description: "Uber Eats Combo Cart – Mix restaurants into one Uber Eats order",
    timeline: "November 2024",
    role: "UX Designer",
    emoji: "🍽️",
    quickGlance: ["Consumer Apps", "Food Delivery", "Experience Design"],
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
    id: "snowgo-community-platform",
    img: "snow_go_main.png",
    title: "SnowGo",
    description: "Community driven platform for neighborhood snow assistance",
    timeline: "October 2025 - December 2025",
    role: "Product Lead",
    emoji: "❄️",
    quickGlance: ["Civic Tech", "Community", "Service Design"],
    details: "A civic technology project designed to help neighborhoods coordinate snow clearing during winter emergencies. The platform enables residents to request or offer help, builds trust through lightweight verification, and prioritizes accessibility for non-technical users. The project emphasizes human-centered design under real-world constraints.",
    sections: [
        {
            title: "Problem Statement",
            content: "During heavy snowfall, vulnerable residents (elderly, disabled) often struggle to clear their driveways, and existing volunteer coordination was ad-hoc and unreliable. Relying on social media posts often led to missed requests and safety concerns."
        },
        {
            title: "Solution Overview",
            content: "We created a hyperlocal platform connecting neighbors willing to shovel with those in need. The focus was on extreme simplicity and building trust within a defined geographic area.",
            img: "snow_go_home.png",
            caption: "The home screen emphasizes clear, large actions: 'Request Help' or 'Offer Help'."
        },
        {
            title: "Streamlined Request Flow",
            content: "Recognizing that many users in need might be elderly or less tech-savvy, we designed a linear, step-by-step request process. Large touch targets and plain language reduce cognitive load during stressful weather events.",
            img: "snow_go_request.png",
            caption: "A simple, guided flow for requesting assistance."
        },
        {
            title: "Visualizing Community Needs",
            content: "To encourage volunteerism, we built a map-based view that allows potential helpers to see requests in their immediate vicinity. This visualizes the collective need and gamifies the act of helping neighbors.",
            img: "snow_go_map.png",
            caption: "Map view showing open requests and active volunteers nearby."
        },
        {
            title: "Closing the Loop",
            content: "Once a volunteer accepts a task, the requester is notified, and a lightweight verification step ensures safety. The system tracks completion to ensure no request is left behind.",
            img: "snow_go_task_accepted.png",
            caption: "Task acceptance screen providing clear status updates."
        },
        {
            title: "Key Outcomes",
            content: "Facilitated over 200 snow clearing assists in the pilot neighborhood. Built a strong sense of community resilience and demonstrated the viability of civic tech in addressing local emergency needs."
        }
    ],
    link: "#",
  },
  {
    id: "lantern-ai-walking-tour",
    img: "lantern_main.png",
    title: "Lantern AI",
    description: "AI powered walking tour companion for immersive city exploration",
    timeline: "October 2025 - December 2025",
    role: "Product Designer",
    emoji: "🏮",
    quickGlance: ["AI Companion", "Travel", "Mobile UX"],
    details: "An AI-driven walking tour application designed to enhance city exploration through contextual storytelling, location-aware prompts, and adaptive narratives. Lantern focuses on night walks and cultural discovery, balancing immersion with safety and usability.",
    sections: [
        {
            title: "Problem Statement",
            content: "Traditional walking tours can be rigid and impersonal, while self-guided tours often lack depth and context, leaving travelers feeling disconnected from the city's stories. Users needed a way to explore safely at night while receiving curated, interesting content."
        },
        {
            title: "Concept & Entry Point",
            content: "Lantern positions itself as a 'digital companion' rather than just a map. The home screen invites users to start a new journey or resume a past one, with a dark-mode interface designed to minimize screen glare during night walks.",
            img: "lantern_home.png",
            caption: "The home screen sets the mood with a focus on 'Starting your Journey'."
        },
        {
            title: "Planning the Experience",
            content: "Users can select specific themes or interests (e.g., 'Haunted History', 'Street Art'). The app generates a route that balances safety (well-lit streets) with discovery.",
            img: "lantern_trip_detail.png",
            caption: "Trip detail view showing the curated route and estimated duration."
        },
        {
            title: "Immersive Guidance",
            content: "Once the trip starts, the interface simplifies. It uses audio cues and subtle haptics to guide the user, allowing them to keep their head up and observe their surroundings rather than staring at a screen.",
            img: "lantern_trip_started.png",
            caption: "Active trip mode with clear, minimal directions and audio controls."
        },
        {
            title: "Personalization & Accessibility",
            content: "To make the tour accessible to a global audience, Lantern includes robust language support and customization options, ensuring the stories resonate with every traveler.",
            img: "lantern_language.png",
            caption: "Language selection and audio customization settings."
        },
        {
            title: "Key Outcomes",
            content: "Created a highly immersive and flexible touring experience. User feedback highlighted the engaging nature of the AI-generated stories and the app's ability to uncover hidden local gems."
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
  decisionLog,
  operatingPrinciples,
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
