const resume = `
John Doe
Software Engineer

Email: john.doe@example.com
Phone: (123) 456-7890
Location: Mumbai, India

PROFESSIONAL SUMMARY
Motivated Software Engineer with knowledge of full-stack web development,
object-oriented programming, database management, and software engineering
principles. Experienced in developing responsive applications and RESTful
APIs. Passionate about writing clean code, solving technical problems,
and continuously learning new technologies.

TECHNICAL SKILLS
Programming Languages: Java, JavaScript, Python
Frontend: HTML5, CSS3, React.js
Backend: Node.js, Express.js
Databases: MongoDB, MySQL
Tools: Git, GitHub, VS Code, Postman
Core Concepts: OOP, Data Structures and Algorithms, REST APIs

PROJECTS

1. E-Commerce Website
Technologies: React.js, Node.js, Express.js, MongoDB
- Developed a responsive e-commerce website with product browsing,
  searching, authentication, shopping cart, and checkout functionality.
- Built RESTful APIs for user, product, cart, and order management.
- Integrated MongoDB for persistent data storage.
- Implemented authentication and role-based access control.

2. Library Management System
Technologies: HTML, CSS, JavaScript, Node.js, Express.js, MongoDB
- Developed a system to manage books, users, and borrowing records.
- Implemented user authentication and role-based access for administrators
  and students.
- Created APIs to add, update, delete, and retrieve book information.
- Integrated a database to maintain library records.

3. Autism Detection Using MRI Brain Images
Technologies: Python, TensorFlow, Keras, CNN
- Developed a deep learning approach to classify MRI images into
  ASD and non-ASD categories.
- Applied image preprocessing and data augmentation techniques.
- Evaluated model performance using classification metrics.
- Explored explainable AI techniques to improve prediction transparency.

EDUCATION
Bachelor of Technology in Information Technology
Rajarambapu Institute of Technology
Expected Graduation: 2027

SOFT SKILLS
Problem-solving, teamwork, communication, adaptability,
time management, and willingness to learn.

CAREER OBJECTIVE
Seeking an entry-level Software Engineer position where I can apply
my programming knowledge, contribute to software development projects,
and grow professionally while delivering quality solutions.
`;

const selfDescription = `
I am a motivated and detail-oriented Software Engineer with a strong
foundation in Java, JavaScript, Data Structures and Algorithms, and
full-stack web development. I have experience developing web applications
using React.js, Node.js, Express.js, and MongoDB. I enjoy solving
programming problems, learning new technologies, and building practical
solutions. I am a quick learner, a team player, and eager to contribute
to real-world software development projects.
`;

const jobDescription = `
We are looking for a Software Engineer to design, develop, test, and
maintain scalable software applications.

Responsibilities:
- Develop responsive web applications.
- Write clean, reusable, and maintainable code.
- Build REST APIs using Node.js and Express.js.
- Work with databases such as MongoDB and MySQL.
- Collaborate with frontend and backend development teams.
- Debug issues and improve application performance.
- Participate in code reviews and testing.

Requirements:
- Knowledge of Java, JavaScript, and OOP concepts.
- Understanding of Data Structures and Algorithms.
- Experience with React.js, Node.js, Express.js, and MongoDB.
- Knowledge of REST APIs, Git, and GitHub.
- Good communication and problem-solving skills.
`;



console.log("SELF DESCRIPTION:");
console.log(selfDescription);

console.log("JOB DESCRIPTION:");
console.log(jobDescription);

console.log("RESUME:");
console.log(resume);

module.exports = {
    resume,
    selfDescription,
    jobDescription
};