// Seed data. When the backend exists, GET /jobs replaces this file.
const jobs = [
  { id: 1, title: "Frontend Developer", company: "Pixelforge", location: "Chandigarh", type: "Full-time", mode: "Hybrid", experience: "1-3 years", salary: 8, skills: ["React", "JavaScript", "Bootstrap"], postedDaysAgo: 1, description: "Build responsive interfaces for our SaaS dashboard and work closely with designers and backend engineers." },
  { id: 2, title: "Python Developer", company: "DataLoom", location: "Mohali", type: "Full-time", mode: "On-site", experience: "1-3 years", salary: 9, skills: ["Python", "MySQL", "REST APIs"], postedDaysAgo: 2, description: "Design and maintain internal services and data pipelines that power analytics for retail clients." },
  { id: 3, title: "Machine Learning Intern", company: "NeuraLab", location: "Remote", type: "Internship", mode: "Remote", experience: "Fresher", salary: 3, skills: ["Python", "Scikit-learn", "Pandas"], postedDaysAgo: 3, description: "Help train and evaluate classification models on real customer datasets under a senior ML engineer." },
  { id: 4, title: "Full Stack Developer", company: "Cartwheel", location: "Bengaluru", type: "Full-time", mode: "Hybrid", experience: "3+ years", salary: 18, skills: ["React", "Node.js", "MongoDB"], postedDaysAgo: 4, description: "Own features end to end across our React storefront and Node.js order services." },
  { id: 5, title: "UI/UX Designer", company: "Studio Nine", location: "Pune", type: "Full-time", mode: "On-site", experience: "1-3 years", salary: 10, skills: ["Figma", "Prototyping", "User research"], postedDaysAgo: 5, description: "Turn research findings into clear flows and polished screens for web and mobile products." },
  { id: 6, title: "Data Analyst", company: "InsightWorks", location: "Gurugram", type: "Full-time", mode: "Hybrid", experience: "Fresher", salary: 6, skills: ["SQL", "Excel", "Power BI"], postedDaysAgo: 6, description: "Prepare weekly dashboards and answer ad-hoc business questions using SQL and BI tools." },
  { id: 7, title: "React Native Developer", company: "Tripkart", location: "Remote", type: "Contract", mode: "Remote", experience: "1-3 years", salary: 14, skills: ["React Native", "TypeScript", "Redux"], postedDaysAgo: 7, description: "Ship new booking features for our travel app on a six-month contract with a chance to extend." },
  { id: 8, title: "DevOps Engineer", company: "CloudNimbus", location: "Hyderabad", type: "Full-time", mode: "Hybrid", experience: "3+ years", salary: 22, skills: ["AWS", "Docker", "CI/CD"], postedDaysAgo: 8, description: "Automate deployments, monitor production and keep our cloud costs under control." },
  { id: 9, title: "Web Development Intern", company: "Pixelforge", location: "Chandigarh", type: "Internship", mode: "On-site", experience: "Fresher", salary: 2, skills: ["HTML", "CSS", "JavaScript"], postedDaysAgo: 2, description: "Learn on the job while building landing pages and small features alongside our frontend team." },
  { id: 10, title: "Backend Developer (Node.js)", company: "Ledgerly", location: "Noida", type: "Full-time", mode: "On-site", experience: "1-3 years", salary: 12, skills: ["Node.js", "Express", "PostgreSQL"], postedDaysAgo: 9, description: "Build secure payment and reporting APIs used by thousands of small businesses." },
  { id: 11, title: "QA Engineer", company: "TestHarbor", location: "Mohali", type: "Part-time", mode: "Hybrid", experience: "Fresher", salary: 4, skills: ["Manual testing", "Selenium", "Jira"], postedDaysAgo: 10, description: "Write test cases, run regression suites and report defects for a fast-moving product team." },
  { id: 12, title: "AI Research Engineer", company: "NeuraLab", location: "Bengaluru", type: "Full-time", mode: "Hybrid", experience: "3+ years", salary: 28, skills: ["PyTorch", "NLP", "MLOps"], postedDaysAgo: 12, description: "Prototype language-model features and take the best ideas from notebook to production." },
];

export default jobs;

export const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];
export const WORK_MODES = ["On-site", "Hybrid", "Remote"];
export const EXPERIENCE_LEVELS = ["Fresher", "1-3 years", "3+ years"];
export const LOCATIONS = [...new Set(jobs.map((j) => j.location))].sort();
