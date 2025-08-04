import connectDB from "../lib/database";
import Project from "../models/Project";
import Task from "../models/Task";

// Sample project data
const sampleProjects = [
  {
    title: "E-commerce Website",
    description:
      "A modern e-commerce platform built with Next.js and Stripe integration for seamless online shopping experience.",
    status: "in-progress",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
  },
  {
    title: "Mobile Task Manager",
    description:
      "Cross-platform mobile app for task management with real-time synchronization and offline support.",
    status: "planning",
    tags: ["React Native", "Firebase", "Redux", "AsyncStorage"],
  },
  {
    title: "AI Chatbot Integration",
    description:
      "Intelligent chatbot system with natural language processing for customer support automation.",
    status: "completed",
    tags: ["Python", "OpenAI", "FastAPI", "Docker"],
  },
  {
    title: "Data Analytics Dashboard",
    description:
      "Real-time analytics dashboard with interactive charts and data visualization for business insights.",
    status: "review",
    tags: ["React", "D3.js", "Node.js", "PostgreSQL"],
  },
  {
    title: "IoT Device Management",
    description:
      "Comprehensive platform for managing and monitoring IoT devices with real-time data streaming.",
    status: "on-hold",
    tags: ["MQTT", "InfluxDB", "Grafana", "Docker"],
  },
  {
    title: "Social Media Scheduler",
    description:
      "Automated social media posting tool with content scheduling and analytics tracking.",
    status: "in-progress",
    tags: ["Vue.js", "Node.js", "MongoDB", "Cron Jobs"],
  },
  {
    title: "Video Streaming Platform",
    description:
      "Netflix-like streaming service with user authentication, content management, and payment processing.",
    status: "planning",
    tags: ["React", "AWS S3", "CDN", "Microservices"],
  },
  {
    title: "Blockchain Wallet",
    description:
      "Secure cryptocurrency wallet with multi-coin support and DeFi integration capabilities.",
    status: "completed",
    tags: ["Solidity", "Web3.js", "Ethereum", "MetaMask"],
  },
  {
    title: "Learning Management System",
    description:
      "Online education platform with course management, progress tracking, and interactive assessments.",
    status: "review",
    tags: ["Laravel", "MySQL", "WebRTC", "Redis"],
  },
  {
    title: "Restaurant POS System",
    description:
      "Point-of-sale system for restaurants with inventory management and order tracking.",
    status: "in-progress",
    tags: ["Angular", "Express.js", "Socket.io", "Payment Gateway"],
  },
];

// Sample tasks for each project (will be associated after projects are created)
const sampleTasksTemplate = [
  // E-commerce Website tasks
  {
    projectIndex: 0,
    tasks: [
      {
        title: "Set up Next.js project structure",
        description:
          "Initialize Next.js project with TypeScript and configure basic folder structure",
        status: "completed" as const,
        attachments: [],
      },
      {
        title: "Implement product catalog",
        description:
          "Create product listing page with search and filter functionality",
        status: "in-progress" as const,
        attachments: [],
      },
      {
        title: "Integrate Stripe payment",
        description: "Set up Stripe payment gateway for checkout process",
        status: "todo" as const,
        attachments: [],
      },
    ],
  },
  // Mobile Task Manager tasks
  {
    projectIndex: 1,
    tasks: [
      {
        title: "Design app wireframes",
        description: "Create wireframes and mockups for the mobile application",
        status: "completed" as const,
        attachments: [],
      },
      {
        title: "Set up React Native environment",
        description: "Configure development environment and dependencies",
        status: "in-progress" as const,
        attachments: [],
      },
      {
        title: "Implement offline synchronization",
        description:
          "Add offline support with data synchronization when online",
        status: "todo" as const,
        attachments: [],
      },
    ],
  },
  // AI Chatbot Integration tasks
  {
    projectIndex: 2,
    tasks: [
      {
        title: "Research NLP libraries",
        description:
          "Evaluate different natural language processing libraries and APIs",
        status: "completed" as const,
        attachments: [],
      },
      {
        title: "Implement OpenAI integration",
        description: "Connect with OpenAI API for intelligent responses",
        status: "completed" as const,
        attachments: [],
      },
      {
        title: "Deploy to production",
        description: "Deploy chatbot system to production environment",
        status: "completed" as const,
        attachments: [],
      },
    ],
  },
  // Data Analytics Dashboard tasks
  {
    projectIndex: 3,
    tasks: [
      {
        title: "Create dashboard layout",
        description:
          "Design and implement the main dashboard layout with responsive grid",
        status: "completed" as const,
        attachments: [],
      },
      {
        title: "Implement data visualization charts",
        description:
          "Add interactive charts using D3.js for data representation",
        status: "review" as const,
        attachments: [],
      },
      {
        title: "Set up real-time data updates",
        description:
          "Implement WebSocket connections for real-time data streaming",
        status: "review" as const,
        attachments: [],
      },
    ],
  },
  // IoT Device Management tasks
  {
    projectIndex: 4,
    tasks: [
      {
        title: "Design system architecture",
        description:
          "Plan the overall system architecture for IoT device management",
        status: "completed" as const,
        attachments: [],
      },
      {
        title: "Implement MQTT broker",
        description: "Set up MQTT broker for device communication",
        status: "cancelled" as const,
        attachments: [],
      },
    ],
  },
];

async function seedProjects() {
  try {
    console.log("🌱 Starting project and task seeding...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("🧹 Cleared existing projects and tasks");

    // Insert sample projects
    const createdProjects = await Project.insertMany(sampleProjects);
    console.log(`✅ Successfully seeded ${createdProjects.length} projects:`);

    // Display created projects
    createdProjects.forEach(
      (project: { title: string; status: string }, index: number) => {
        console.log(`   ${index + 1}. ${project.title} (${project.status})`);
      }
    );

    // Create and insert tasks
    console.log("\n🔧 Creating tasks for projects...");
    let totalTasksCreated = 0;

    for (const taskTemplate of sampleTasksTemplate) {
      const project = createdProjects[taskTemplate.projectIndex];
      const tasksToCreate = taskTemplate.tasks.map((task) => ({
        ...task,
        projectId: project._id,
      }));

      const createdTasks = await Task.insertMany(tasksToCreate);

      // Update project with task references
      await Project.findByIdAndUpdate(project._id, {
        $push: { tasks: { $each: createdTasks.map((task) => task._id) } },
      });

      console.log(
        `   📋 Created ${createdTasks.length} tasks for "${project.title}"`
      );
      totalTasksCreated += createdTasks.length;
    }

    console.log(`\n✅ Successfully created ${totalTasksCreated} tasks total`);
    console.log("\n🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding projects and tasks:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedProjects();
