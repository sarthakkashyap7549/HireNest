USE job_portal;

INSERT INTO jobs (id, title, company, location, type, mode, experience, salary, skills, posted_days_ago, description) VALUES
(1, 'Frontend Developer', 'Pixelforge', 'Chandigarh', 'Full-time', 'Hybrid', '1-3 years', 8, JSON_ARRAY('React', 'JavaScript', 'Bootstrap'), 1, 'Build responsive interfaces for our SaaS dashboard and work closely with designers and backend engineers.'),
(2, 'Python Developer', 'DataLoom', 'Mohali', 'Full-time', 'On-site', '1-3 years', 9, JSON_ARRAY('Python', 'MySQL', 'REST APIs'), 2, 'Design and maintain internal services and data pipelines that power analytics for retail clients.'),
(3, 'Machine Learning Intern', 'NeuraLab', 'Remote', 'Internship', 'Remote', 'Fresher', 3, JSON_ARRAY('Python', 'Scikit-learn', 'Pandas'), 3, 'Help train and evaluate classification models on real customer datasets under a senior ML engineer.'),
(4, 'Full Stack Developer', 'Cartwheel', 'Bengaluru', 'Full-time', 'Hybrid', '3+ years', 18, JSON_ARRAY('React', 'Node.js', 'MongoDB'), 4, 'Own features end to end across our React storefront and Node.js order services.'),
(5, 'UI/UX Designer', 'Studio Nine', 'Pune', 'Full-time', 'On-site', '1-3 years', 10, JSON_ARRAY('Figma', 'Prototyping', 'User research'), 5, 'Turn research findings into clear flows and polished screens for web and mobile products.'),
(6, 'Data Analyst', 'InsightWorks', 'Gurugram', 'Full-time', 'Hybrid', 'Fresher', 6, JSON_ARRAY('SQL', 'Excel', 'Power BI'), 6, 'Prepare weekly dashboards and answer ad-hoc business questions using SQL and BI.'),
(7, 'React Native Developer', 'Tripkart', 'Remote', 'Contract', 'Remote', '1-3 years', 14, JSON_ARRAY('React Native', 'TypeScript', 'Redux'), 7, 'Ship new booking features for our travel app on a six-month contract with a chance to extend.'),
(8, 'DevOps Engineer', 'CloudNimbus', 'Hyderabad', 'Full-time', 'Hybrid', '3+ years', 22, JSON_ARRAY('AWS', 'Docker', 'CI/CD'), 8, 'Automate deployments, monitor production and keep cloud costs under control.'),
(9, 'Web Development Intern', 'Pixelforge', 'Chandigarh', 'Internship', 'On-site', 'Fresher', 2, JSON_ARRAY('HTML', 'CSS', 'JavaScript'), 2, 'Learn on the job while building landing pages and small features alongside our frontend team.'),
(10, 'Backend Developer (Node.js)', 'Ledgerly', 'Noida', 'Full-time', 'On-site', '1-3 years', 12, JSON_ARRAY('Node.js', 'Express', 'PostgreSQL'), 9, 'Build secure payment and reporting APIs used by thousands of small businesses.'),
(11, 'QA Engineer', 'TestHarbor', 'Mohali', 'Part-time', 'Hybrid', 'Fresher', 4, JSON_ARRAY('Manual testing', 'Selenium', 'Jira'), 10, 'Write test cases, run regression suites and report defects for a fast-moving product team.'),
(12, 'AI Research Engineer', 'NeuraLab', 'Bengaluru', 'Full-time', 'Hybrid', '3+ years', 28, JSON_ARRAY('PyTorch', 'NLP', 'MLOps'), 12, 'Prototype language-model features and take the best ideas from notebook to production.')
ON DUPLICATE KEY UPDATE id = id;
