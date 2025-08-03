import connectDB from '../lib/database';
import Project from '../models/Project';

// Sample project data
const sampleProjects = [
  {
    title: 'E-commerce Website',
    description: 'A modern e-commerce platform built with Next.js and Stripe integration for seamless online shopping experience.',
    status: 'in-progress',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS']
  },
  {
    title: 'Mobile Task Manager',
    description: 'Cross-platform mobile app for task management with real-time synchronization and offline support.',
    status: 'planning',
    tags: ['React Native', 'Firebase', 'Redux', 'AsyncStorage']
  },
  {
    title: 'AI Chatbot Integration',
    description: 'Intelligent chatbot system with natural language processing for customer support automation.',
    status: 'completed',
    tags: ['Python', 'OpenAI', 'FastAPI', 'Docker']
  },
  {
    title: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard with interactive charts and data visualization for business insights.',
    status: 'review',
    tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL']
  },
  {
    title: 'IoT Device Management',
    description: 'Comprehensive platform for managing and monitoring IoT devices with real-time data streaming.',
    status: 'on-hold',
    tags: ['MQTT', 'InfluxDB', 'Grafana', 'Docker']
  },
  {
    title: 'Social Media Scheduler',
    description: 'Automated social media posting tool with content scheduling and analytics tracking.',
    status: 'in-progress',
    tags: ['Vue.js', 'Node.js', 'MongoDB', 'Cron Jobs']
  },
  {
    title: 'Video Streaming Platform',
    description: 'Netflix-like streaming service with user authentication, content management, and payment processing.',
    status: 'planning',
    tags: ['React', 'AWS S3', 'CDN', 'Microservices']
  },
  {
    title: 'Blockchain Wallet',
    description: 'Secure cryptocurrency wallet with multi-coin support and DeFi integration capabilities.',
    status: 'completed',
    tags: ['Solidity', 'Web3.js', 'Ethereum', 'MetaMask']
  },
  {
    title: 'Learning Management System',
    description: 'Online education platform with course management, progress tracking, and interactive assessments.',
    status: 'review',
    tags: ['Laravel', 'MySQL', 'WebRTC', 'Redis']
  },
  {
    title: 'Restaurant POS System',
    description: 'Point-of-sale system for restaurants with inventory management and order tracking.',
    status: 'in-progress',
    tags: ['Angular', 'Express.js', 'Socket.io', 'Payment Gateway']
  }
];

async function seedProjects() {
  try {
    console.log('🌱 Starting project seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing projects (optional - comment out if you want to keep existing data)
    await Project.deleteMany({});
    console.log('🧹 Cleared existing projects');

    // Insert sample projects
    const createdProjects = await Project.insertMany(sampleProjects);
    console.log(`✅ Successfully seeded ${createdProjects.length} projects:`);
    
    // Display created projects
    createdProjects.forEach((project: { title: string; status: string }, index: number) => {
      console.log(`   ${index + 1}. ${project.title} (${project.status})`);
    });

    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedProjects();
