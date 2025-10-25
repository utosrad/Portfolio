"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Minimize2, Square, X } from "lucide-react"
import LandingPage from "./components/LandingPage"
import StarWars from "./components/StarWars"
import ASCIIText from "./components/ASCIIText"

// Custom component for clickable links in terminal
const TerminalLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => {
  const handleClick = () => {
    window.open(href, '_blank', 'noopener,noreferrer')
  }
  
  return (
    <span 
      className={`cursor-pointer hover:text-green-300 underline ${className}`}
      onClick={handleClick}
    >
      {children}
    </span>
  )
}

interface Command {
  input: string
  output: string[]
  timestamp: Date
}

export default function TerminalPortfolio() {
  const [showTerminal, setShowTerminal] = useState(false)
  const [currentPath, setCurrentPath] = useState("~")
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Command[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const [showStarWars, setShowStarWars] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const developer = {
    name: "Umar Darsot",
    title: "Machine Learning Researcher & Data Scientist",
    email: "udarsot@gmail.com",
    phone: "(416)-474-9987",
    address: "Waterloo, ON, Canada",
    github: "https://github.com/utosrad",
    linkedin: "https://linkedin.com/in/darsot",
    website: "https://darsot.ca",
  }

  const experience = [
    {
      title: "Machine Learning Researcher (Project EVE)",
      company: "WATAI",
      period: "2025 - Present",
      description: [
        "Built EVE, an AI system that lip-reads silent video using AV-HuBERT and generates natural speech with Tacotron 2 and HiFi-GAN to improve accessibility without audio",
        "Planned 8-month roadmap with staged MVPs (lip-reading → TTS → polished demo) for CUCAI showcase",
        "Benchmarked models on LRS2/LRS3 using WER, MOS, PESQ, and STOI",
        "Led onboarding bootcamps in PyTorch, Hugging Face, and OpenCV with bi-weekly demos",
      ],
    },
    {
      title: "IT, Data Management and Governance Intern",
      company: "Purolator Inc.",
      period: "May 2025 - Aug 2025",
      description: [
        "Engineered a Python pdfplumber pipeline to extract metadata from 50+ PDFs, cutting processing time by 90%+",
        "Directed a data-governance overhaul of 108 enterprise dashboards, standardizing ownership and deploying a Python-automated catalogue that improved discoverability by 90%",
        "Created a Master Data Glossary with 15 standardized elements, aligning variable definitions across all departments",
        "Consolidated 400+ vendor questions into 71 tailored RFP questions, earning recognition from Informatica and Atlan",
        "Delivered executive-level Power BI visualizations to the VP of Tech, influencing strategic analytics investments",
        "Completed AWS SageMaker Studio Lab course and built a proof-of-concept ML model using Amazon Q",
      ],
    },
  ]

  const education = [
    {
      degree: "Bachelor of Mathematics (BMath)",
      field: "Financial Analysis and Risk Management",
      institution: "University of Waterloo",
      period: "Expected 2029",
    },
  ]

  const skills = {
    languages: ["Python", "SQL", "JavaScript"],
    ml_frameworks: ["Pandas", "NumPy", "scikit-learn", "XGBoost", "Keras", "PyTorch", "spaCy", "Seaborn", "Hugging Face Transformers", "SageMaker", "OpenCV", "Tacotron 2", "HiFi-GAN"],
    tools_platforms: ["Jupyter", "PyCharm", "VSCode", "Git", "Docker", "Flask", "FastAPI", "Azure AI", "AWS"],
    other: ["LLM fine-tuning", "RAG workflows", "OCR/document extraction", "prompt/context engineering"],
  }

  const languages = {
    english: {
      speaking: "Native",
      listening: "Native",
      writing: "Native",
    },
  }

  const hobbies = [
    "🎯 Toronto Maple Leafs & Blue Jays Fan",
    "🎯 Stargazing & Telescopes", 
    "🎯 Fantasy Sports Analytics",
    "🎯 Formula 1",
    "🎯 UFC Enthusiast",
    "🎯 Pick-Up Basketball"
  ]

  const philosophy = {
    mindset: {
      title: "MINDSET",
      content: [
        "Belief is the first step toward transformation.",
        "",
        "\"From nothing. To something. To everything!\" - Conor McGregor",
        "",
        "It's a reminder that every breakthrough begins as an idea in the mind before it manifests in the world.",
        "But belief alone isn't enough. You must have the courage to declare it.",
        "",
        "\"If you can see it here, and you have the courage to speak it… it will happen.\"",
        "",
        "Vision without expression is potential left unrealized.",
        "Mindset, then, is a cycle: you see the possibility, voice it with conviction, believe it deeply, and act until it becomes real.",
        "It's not about arrogance; it's about alignment between your thoughts, your words, and your will.",
        "",
        "⸻"
      ]
    },
    decisions: {
      title: "DECISIONS", 
      content: [
        "Every decision you make is a reflection of who you are becoming.",
        "It's not just about choosing between options; it's about aligning your vision, voice, and values.",
        "",
        "A powerful question to ask is, \"Which choice expands me?\" or \"Which direction brings me closer to the person I'm building?\"",
        "",
        "The best decisions aren't simply logical; they're intuitive, courageous, and deeply intentional.",
        "They come from a place of awareness, not impulse.",
        "True decision-making means taking ownership of your direction, even when the outcome is uncertain.",
        "The people who thrive aren't those who avoid risk; they're the ones who move toward momentum with clarity of purpose.",
        "",
        "⸻"
      ]
    },
    craft: {
      title: "CRAFT",
      content: [
        "Your craft is the quiet force behind every great achievement.",
        "It isn't something you're born with; it's something you build, refine, and test through relentless consistency.",
        "True mastery of your craft demands repetition, patience, and the courage to fail forward.",
        "",
        "It's forged in the invisible hours, the late nights, the corrections, the small improvements no one sees that separate the exceptional from the average.",
        "",
        "\"Hard work beats talent when talent doesn't work hard.\"",
        "",
        "Talent may open the door, but discipline keeps you in the room.",
        "Your craft is what transforms vision into execution and execution into excellence.",
        "Over time, it becomes not just what you do, but who you are, precision made permanent through persistence.",
        "",
        "⸻"
      ]
    }
  }

  const projects = [
    {
      name: "Customer Churn Prediction with Deep Learning",
      description: "Engineered a Deep Neural Network (DNN) classifier using TensorFlow and Keras to predict customer churn, achieving 78% accuracy on the holdout test set",
      tech: ["TensorFlow", "Keras", "Pandas", "scikit-learn", "Seaborn"],
      status: "Completed",
      type: "Machine Learning Project",
    },
    {
      name: "UFC Fight Outcome Prediction Model",
      description: "Built a supervised classification model with scikit-learn (Random Forest, Logistic Regression, XGBoost) to predict UFC fight outcomes with 74% accuracy",
      tech: ["scikit-learn", "XGBoost", "Pandas", "Flask", "GridSearchCV"],
      status: "Completed",
      type: "Machine Learning Project",
    },
    {
      name: "ESG Investment Screener Web Application",
      description: "Developed a Python + Streamlit app to filter S&P 500 companies by ESG risk, sector, and financial ratios",
      tech: ["Python", "Streamlit", "Pandas", "Kaggle", "Financial Data"],
      status: "Completed",
      type: "Data Science Application",
    },
  ]

  const welcomeMessage = [
    `Welcome to ${developer.name}'s Portfolio Terminal`,
    `${developer.title} | ${developer.email}`,
    `Type 'help' to see available commands`,
    "",
  ]

  const handleEnter = () => {
    setShowTerminal(true)
  }

  useEffect(() => {
    setHistory([
      {
        input: "",
        output: welcomeMessage,
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])



  // Function to add command output instantly (no typing animation)
  const addInstantOutput = (cmd: string, output: string[]) => {
    const newCommand: Command = {
      input: cmd,
      output: output,
      timestamp: new Date(),
    }
    setHistory((prev) => [...prev, newCommand])
  }

  const typeText = async (text: string[], delay = 30) => {
    setIsTyping(true)
    const result: string[] = []

    for (const line of text) {
      let currentLine = ""
      for (const char of line) {
        currentLine += char
        result[result.length] = currentLine
        setHistory((prev) => [...prev.slice(0, -1), { ...prev[prev.length - 1], output: [...result] }])
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
      result[result.length - 1] = line
      result.push("")
    }

    setIsTyping(false)
  }

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    const args = trimmedCmd.split(" ")
    const command = args[0]

    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd.trim()])
    }

    let output: string[] = []

    switch (command) {
      case "help":
        output = [
          "Available commands:",
          "",
          "  help          - Show this help message",
          "  clear         - Clear the terminal",
          "  ls            - List directory contents",
          "  cd <dir>      - Change directory",
          "  cat <file>    - Display file contents",
          "  pwd           - Show current directory",
          "  whoami        - Display user information",
          "  open <url>    - Open URL in new tab",
          "  history       - Show command history",
          "",
          "Direct access commands:",
          "  resume        - Display complete resume",
          "  about         - Show about information",
          "  experience    - Display work experience",
          "  education     - Show education background",
          "  skills        - Display technical skills",
          "  projects      - Show portfolio projects",
          "  contact       - Display contact information",
          "  languages     - Show language proficiency",
          "  hobbies       - Display hobbies and interests",
          "  philosophy    - Show personal philosophy sections",
          "  starwars      - Watch Star Wars opening crawl",
          "",
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "clear":
        setHistory([])
        return

      case "about":
        output = [
          "░█████╗░██████╗░░█████╗░██╗░░░██╗████████╗",
          "██╔══██╗██╔══██╗██╔══██╗██║░░░██║╚══██╔══╝",
          "███████║██████╦╝██║░░██║██║░░░██║░░░██║░░░",
          "██╔══██║██╔══██╗██║░░██║██║░░░██║░░░██║░░░",
          "██║░░██║██████╦╝╚█████╔╝╚██████╔╝░░░██║░░░",
          "╚═╝░░╚═╝╚═════╝░░╚════╝░░╚═════╝░░░░╚═╝░░░",
          "",
          `Hi, I'm ${developer.name}!`,
          "",
          "As a Machine Learning Researcher and Data Scientist, my expertise lies in",
          "building AI systems that solve real-world problems and improve accessibility.",
          "",
          "I specialize in deep learning, computer vision, and natural language processing,",
          "with hands-on experience in PyTorch, TensorFlow, and cutting-edge ML frameworks.",
          "",
          "My current focus is on developing EVE, an AI system that lip-reads silent video",
          "and generates natural speech to improve accessibility without audio.",
          "",
          "Professional Summary:",
          "🤖 Machine Learning Researcher with focus on AI accessibility",
          "📊 Data Science expertise in financial analysis and risk management",
          "🎓 University of Waterloo BMath student (Financial Analysis specialization)",
          "🚀 Passionate about applying ML to solve real-world problems",
          "🤝 Strong collaboration and technical leadership skills",
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "experience":
        output = [
          "███████╗██╗░░██╗██████╗░███████╗██████╗░██╗███████╗███╗░░██╗░█████╗░███████╗",
          "██╔════╝╚██╗██╔╝██╔══██╗██╔════╝██╔══██╗██║██╔════╝████╗░██║██╔══██╗██╔════╝",
          "█████╗░░░╚███╔╝░██████╔╝█████╗░░██████╔╝██║█████╗░░██╔██╗██║██║░░╚═╝█████╗░░",
          "██╔══╝░░░██╔██╗░██╔═══╝░██╔══╝░░██╔══██╗██║██╔══╝░░██║╚████║██║░░██╗██╔══╝░░",
          "███████╗██╔╝╚██╗██║░░░░░███████╗██║░░██║██║███████╗██║░╚███║╚█████╔╝███████╗",
          "╚══════╝╚═╝░░╚═╝╚═╝░░░░░╚══════╝╚═╝░░╚═╝╚═╝╚══════╝╚═╝░░╚══╝░╚════╝░╚══════╝",
          "",
          "PROFESSIONAL EXPERIENCE:",
          "=".repeat(50),
          "",
          ...experience.flatMap((exp, index) => [
            `${index + 1}. ${exp.title}`,
            `   Company: ${exp.company}`,
            `   Period: ${exp.period}`,
            "",
            "   Key Responsibilities:",
            ...exp.description.map((desc) => `   • ${desc}`),
            "",
          ]),
        ]
        addInstantOutput(cmd, output)
        return

      case "education":
        output = [
          "███████╗██████╗░██╗░░░██╗░█████╗░░█████╗░████████╗██╗░█████╗░███╗░░██╗",
          "██╔════╝██╔══██╗██║░░░██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔══██╗████╗░██║",
          "█████╗░░██║░░██║██║░░░██║██║░░╚═╝███████║░░░██║░░░██║██║░░██║██╔██╗██║",
          "██╔══╝░░██║░░██║██║░░░██║██║░░██╗██╔══██║░░░██║░░░██║██║░░██║██║╚████║",
          "███████╗██████╔╝╚██████╔╝╚█████╔╝██║░░██║░░░██║░░░██║╚█████╔╝██║░╚███║",
          "╚══════╝╚═════╝░░╚═════╝░░╚════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚══╝",
          "",
          "EDUCATION:",
          "=".repeat(30),
          "",
          ...education.flatMap((edu) => [
            `🎓 ${edu.degree}`,
            `   Field: ${edu.field}`,
            `   Institution: ${edu.institution}`,
            `   Period: ${edu.period}`,
            "",
          ]),
          "CERTIFICATIONS & TRAINING:",
          "",
          "🏆 AWS SageMaker Studio Lab Course - Amazon (2025)",
          "📚 Machine Learning with Amazon Q - Proof of Concept",
          "🎯 PyTorch, Hugging Face, and OpenCV Bootcamps",
          "💻 Advanced Python & Data Science",
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "skills":
        // Original technical skills command
        output = [
          "░██████╗██╗░░██╗██╗██╗░░░░░██╗░░░░░░██████╗",
          "██╔════╝██║░██╔╝██║██║░░░░░██║░░░░░██╔════╝",
          "╚█████╗░█████═╝░██║██║░░░░░██║░░░░░╚█████╗░",
          "░╚═══██╗██╔═██╗░██║██║░░░░░██║░░░░░░╚═══██╗",
          "██████╔╝██║░╚██╗██║███████╗███████╗██████╔╝",
          "╚═════╝░╚═╝░░╚═╝╚═╝╚══════╝╚══════╝╚═════╝░",
          "",
          "TECHNICAL SKILLS:",
          "=".repeat(40),
          "",
          "Programming Languages:",
          ...skills.languages.map((lang) => `• ${lang}`),
          "",
          "ML/AI Frameworks:",
          ...skills.ml_frameworks.map((framework) => `• ${framework}`),
          "",
          "Tools & Platforms:",
          ...skills.tools_platforms.map((tool) => `• ${tool}`),
          "",
          "Other Skills:",
          ...skills.other.map((skill) => `• ${skill}`),
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "projects":
        output = [
          "██████╗░██████╗░░█████╗░░░░░░██╗███████╗░█████╗░████████╗░██████╗",
          "██╔══██╗██╔══██╗██╔══██╗░░░░░██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝",
          "██████╔╝██████╔╝██║░░██║░░░░░██║█████╗░░██║░░╚═╝░░░██║░░░╚█████╗░",
          "██╔═══╝░██╔══██╗██║░░██║██╗░░██║██╔══╝░░██║░░██╗░░░██║░░░░╚═══██╗",
          "██║░░░░░██║░░██║╚█████╔╝╚█████╔╝███████╗╚█████╔╝░░░██║░░░██████╔╝",
          "╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░╚════╝░╚══════╝░╚════╝░░░░╚═╝░░░╚═════╝░",
          "",
          "PORTFOLIO PROJECTS:",
          "=".repeat(40),
          "",
          ...projects.flatMap((proj, index) => [
            `${index + 1}. ${proj.name}`,
            `   Type: ${proj.type}`,
            `   Status: ${proj.status}`,
            `   Description: ${proj.description}`,
            "",
            "   Technologies Used:",
            ...proj.tech.map((tech) => `   • ${tech}`),
            "",
            "", // Extra line spacing between projects
          ]),
        ]
        addInstantOutput(cmd, output)
        return

      case "contact":
        output = [
          "░█████╗░░█████╗░███╗░░██╗████████╗░█████╗░░█████╗░████████╗",
          "██╔══██╗██╔══██╗████╗░██║╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝",
          "██║░░╚═╝██║░░██║██╔██╗██║░░░██║░░░███████║██║░░╚═╝░░░██║░░░",
          "██║░░██╗██║░░██║██║╚████║░░░██║░░░██╔══██║██║░░██╗░░░██║░░░",
          "╚█████╔╝╚█████╔╝██║░╚███║░░░██║░░░██║░░██║╚█████╔╝░░░██║░░░",
          "░╚════╝░░╚════╝░╚═╝░░╚══╝░░░╚═╝░░░╚═╝░░╚═╝░╚════╝░░░░╚═╝░░░",
          "",
          "CONTACT INFORMATION:",
          "=".repeat(40),
          "",
          `📧 Email: ${developer.email}`,
          `📱 Phone: ${developer.phone}`,
          `📍 Address: ${developer.address}`,
          "",
          "Social & Professional Links:",
          `🐙 GitHub: ${developer.github}`,
          `💼 LinkedIn: ${developer.linkedin}`,
          `🌐 Website: ${developer.website}`,
          "",
          "Feel free to connect and collaborate!",
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "languages":
        output = [
          "██╗░░░░░░█████╗░███╗░░██╗░██████╗░██╗░░░██╗░█████╗░░██████╗░███████╗░██████╗",
          "██║░░░░░██╔══██╗████╗░██║██╔════╝░██║░░░██║██╔══██╗██╔════╝░██╔════╝██╔════╝",
          "██║░░░░░███████║██╔██╗██║██║░░██╗░██║░░░██║███████║██║░░██╗░█████╗░░╚█████╗░",
          "██║░░░░░██╔══██║██║╚████║██║░░╚██╗██║░░░██║██╔══██║██║░░╚██╗██╔══╝░░░╚═══██╗",
          "███████╗██║░░██║██║░╚███║╚██████╔╝╚██████╔╝██║░░██║╚██████╔╝███████╗██████╔╝",
          "╚══════╝╚═╝░░╚═╝╚═╝░░╚══╝░╚═════╝░░╚═════╝░╚═╝░░╚═╝░╚═════╝░╚══════╝╚═════╝░",
          "",
          "LANGUAGE PROFICIENCY:",
          "=".repeat(40),
          "",
          "English:",
          `🗣️  Speaking: ${languages.english.speaking}`,
          `👂 Listening: ${languages.english.listening}`,
          `✍️  Writing: ${languages.english.writing}`,
          "",
          "French:",
          "🗣️  Speaking: Full Working Proficiency",
          "👂 Listening: Full Working Proficiency", 
          "✍️  Writing: Full Working Proficiency",
          "📜 Ontario French Diploma",
          "",
          "Gujarati:",
          "🗣️  Speaking: Native",
          "👂 Listening: Native",
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "hobbies":
        output = [
          "██╗░░██╗░█████╗░██████╗░██████╗░██╗███████╗░██████╗",
          "██║░░██║██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██╔════╝",
          "███████║██║░░██║██████╦╝██████╦╝██║█████╗░░╚█████╗░",
          "██╔══██║██║░░██║██╔══██╗██╔══██╗██║██╔══╝░░░╚═══██╗",
          "██║░░██║╚█████╔╝██████╦╝██████╦╝██║███████╗██████╔╝",
          "╚═╝░░╚═╝░╚════╝░╚═════╝░╚═════╝░╚═╝╚══════╝╚═════╝░",
          "",
          "HOBBIES & INTERESTS:",
          "=".repeat(40),
          "",
          ...hobbies.map((hobby) => hobby),
          "",
          "These activities help me stay creative and maintain work-life balance!",
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "philosophy":
        output = [
          "██████╗░██╗░░██╗██╗██╗░░░░░░█████╗░░██████╗░█████╗░██████╗░██╗░░██╗██╗░░░██╗",
          "██╔══██╗██║░░██║██║██║░░░░░██╔══██╗██╔════╝██╔══██╗██╔══██╗██║░░██║╚██╗░██╔╝",
          "██████╔╝███████║██║██║░░░░░██║░░██║╚█████╗░██║░░██║██████╔╝███████║░╚████╔╝░",
          "██╔═══╝░██╔══██║██║██║░░░░░██║░░██║░╚═══██╗██║░░██║██╔═══╝░██╔══██║░░╚██╔╝░░",
          "██║░░░░░██║░░██║██║███████╗╚█████╔╝██████╔╝╚█████╔╝██║░░░░░██║░░██║░░░██║░░░",
          "╚═╝░░░░░╚═╝░░╚═╝╚═╝╚══════╝░╚════╝░╚═════╝░░╚════╝░╚═╝░░░░░╚═╝░░╚═╝░░░╚═╝░░░",
          "",
          "PERSONAL PHILOSOPHY:",
          "=".repeat(40),
          "",
          "Welcome to my personal philosophy section.",
          "Here you'll find my core beliefs about mindset, decisions, and craft.",
          "",
          "Available philosophy sections:",
          "",
          "🧠 mindset    - Personal mindset philosophy",
          "🎯 decisions  - Decision-making philosophy", 
          "⚡ craft      - Craft development philosophy",
          "",
          "Type 'mindset', 'decisions', or 'craft' to explore each section.",
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "starwars":
      case "star wars":
        setShowStarWars(true)
        return

      case "ls":
        if (currentPath === "~") {
          output = [
            "about/",
            "experience/",
            "education/",
            "skills/",
            "projects/",
            "contact/",
            "languages/",
            "hobbies/",
            "README.md",
            "resume.txt",
          ]
        } else {
          output = [`Contents of ${currentPath}:`, ""]
          switch (currentPath) {
            case "~/about":
              output.push("bio.txt", "summary.txt")
              break
            case "~/experience":
              output.push(...experience.map((exp, i) => `job_${i + 1}.txt`))
              break
            case "~/education":
              output.push("degree.txt", "certifications.txt")
              break
            case "~/skills":
              output.push("frontend.txt", "backend.txt", "styling.txt", "cloud.txt", "tools.txt")
              break
            case "~/projects":
              output.push(...projects.map((p) => `${p.name.toLowerCase().replace(/\s+/g, "_")}.txt`))
              break
            case "~/contact":
              output.push("info.txt", "social.txt")
              break
            case "~/languages":
              output.push("urdu.txt", "english.txt")
              break
            case "~/hobbies":
              output.push("interests.txt")
              break
          }
        }
        addInstantOutput(cmd, output)
        return

      case "cd":
        const dir = args[1]
        if (!dir || dir === "~") {
          setCurrentPath("~")
          output = ["Changed to home directory"]
        } else if (
          ["about", "experience", "education", "skills", "projects", "contact", "languages", "hobbies"].includes(dir)
        ) {
          setCurrentPath(`~/${dir}`)
          output = [`Changed to ${dir} directory`]
        } else {
          output = [`cd: ${dir}: No such directory`]
        }
        break

      case "pwd":
        output = [currentPath]
        break

      case "whoami":
        output = [developer.name, developer.title, developer.email]
        break

      case "resume":
        output = [
          "██████╗░███████╗░██████╗██╗░░░██╗███╗░░░███╗███████╗",
          "██╔══██╗██╔════╝██╔════╝██║░░░██║████╗░████║██╔════╝",
          "██████╔╝█████╗░░╚█████╗░██║░░░██║██╔████╔██║█████╗░░",
          "██╔══██╗██╔══╝░░░╚═══██╗██║░░░██║██║╚██╔╝██║██╔══╝░░",
          "██║░░██║███████╗██████╔╝╚██████╔╝██║░╚═╝░██║███████╗",
          "╚═╝░░╚═╝╚══════╝╚═════╝░░╚═════╝░╚═╝░░░░░╚═╝╚══════╝",
          "",
          "=".repeat(60),
          `${developer.name.toUpperCase()}`,
          `${developer.title.toUpperCase()}`,
          "=".repeat(60),
          "",
          "📄 RESUME:",
          "",
          "🔗 Umar Darsot Resume",
          "   https://drive.google.com/file/d/1ALhoZuGP0E6zOqZy8cg53UjYfJg7h4QV/view?usp=sharing",
          "",
          "💡 Click the link above or use 'open' command to view resume",
          "",
          "📋 Resume Summary:",
          `   • ${developer.title}`,
          `   • ${experience.length} professional positions`,
          `   • ${projects.length} portfolio projects`,
          `   • ${skills.languages.length} programming languages`,
          `   • ${skills.ml_frameworks.length} ML/AI frameworks`,
          "",
          "For detailed information, please visit the link above.",
          "",
        ]
        addInstantOutput(cmd, output)
        return

      case "cat":
        const file = args[1]
        if (!file) {
          output = ["cat: missing file operand"]
          break
        }

        switch (file) {
          case "README.md":
            output = [
              "# Umar Darsot - Machine Learning Researcher Portfolio",
              "",
              `Welcome to ${developer.name}'s interactive terminal portfolio!`,
              "",
              "🤖 Machine Learning Researcher specializing in AI & Data Science",
              "📊 Data Science expertise in financial analysis and risk management",
              "🎓 University of Waterloo BMath student with hands-on industry experience",
              "",
              "Quick Commands:",
              "- resume      (Complete CV)",
              "- about       (About me)",
              "- experience  (Work history)",
              "- education   (Academic background)",
              "- skills      (Technical expertise)",
              "- projects    (Portfolio projects)",
              "- contact     (Get in touch)",
              "",
              "Type 'help' for all available commands",
              "",
            ]
            break

          case "resume.txt":
            executeCommand("resume")
            return

          default:
            output = [`cat: ${file}: No such file or directory`]
        }
        break

      case "open":
        const url = args[1]
        if (!url) {
          output = ["open: missing URL operand"]
        } else {
          window.open(url.startsWith("http") ? url : `https://${url}`, "_blank")
          output = [`Opening ${url} in new tab...`]
        }
        break

      case "history":
        output = commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`)
        break

      default:
        if (trimmedCmd) {
          output = [`Command not found: ${command}`, 'Type "help" for available commands']
        }
    }

    const newCommand: Command = {
      input: cmd,
      output: [],
      timestamp: new Date(),
    }

    setHistory((prev) => [...prev, newCommand])

    if (output.length > 0) {
      await typeText(output, 20)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isTyping) {
      executeCommand(input)
      setInput("")
      setHistoryIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  if (!showTerminal) {
    return <LandingPage onEnter={handleEnter} />
  }

  if (showStarWars) {
    return <StarWars onClose={() => setShowStarWars(false)} />
  }

  return (
    <div className="h-screen bg-black text-green-400 font-mono p-2 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Terminal Window Header */}
        <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-gray-300 text-sm">Terminal</div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Minimize2 size={14} />
            <Square size={14} />
            <X size={14} />
          </div>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="bg-black rounded-b-lg p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Command History */}
          {history.map((cmd, index) => (
            <div key={index} className="mb-2">
              {cmd.input && (
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">
                    {developer.name.toLowerCase().replace(/\s+/g, "")}@portfolio:{currentPath}$
                  </span>
                  <span className="text-white">{cmd.input}</span>
                </div>
              )}
              {cmd.output.map((line, lineIndex) => {
                // Check if this line contains the resume link
                if (line.includes("https://drive.google.com/file/d/1ALhoZuGP0E6zOqZy8cg53UjYfJg7h4QV/view?usp=sharing")) {
                  return (
                    <div key={lineIndex} className="text-green-300 whitespace-pre-wrap">
                      {line.split("https://drive.google.com/file/d/1ALhoZuGP0E6zOqZy8cg53UjYfJg7h4QV/view?usp=sharing")[0]}
                      <TerminalLink href="https://drive.google.com/file/d/1ALhoZuGP0E6zOqZy8cg53UjYfJg7h4QV/view?usp=sharing">
                        🔗 Umar Darsot Resume
                      </TerminalLink>
                    </div>
                  )
                }
                
                // Check if this line is a quote (starts and ends with quotes)
                if (line.startsWith('"') && line.endsWith('"')) {
                  return (
                    <div key={lineIndex} className="text-yellow-400 whitespace-pre-wrap italic">
                      {line}
                    </div>
                  )
                }
                
                // Check if this line is a title (contains ":" and is in caps)
                if (line.includes(":") && line === line.toUpperCase() && line.length < 50) {
                  return (
                    <div key={lineIndex} className="text-green-400 whitespace-pre-wrap font-bold">
                      {line}
                    </div>
                  )
                }
                
                // Check if this line is a separator (contains "=")
                if (line.includes("=") && line.length > 10) {
                  return (
                    <div key={lineIndex} className="text-green-500 whitespace-pre-wrap">
                      {line}
                    </div>
                  )
                }
                
                // Check if this line is a bullet point or list item
                if (line.startsWith("•") || line.startsWith("-") || line.startsWith("🎯") || line.startsWith("🧠") || line.startsWith("⚡") || line.startsWith("🎓") || line.startsWith("📧") || line.startsWith("📱") || line.startsWith("📍") || line.startsWith("🐙") || line.startsWith("💼") || line.startsWith("🌐")) {
                  return (
                    <div key={lineIndex} className="text-orange-400 whitespace-pre-wrap">
                      {line}
                    </div>
                  )
                }
                
                // Check if this line is a section divider
                if (line.includes("⸻")) {
                  return (
                    <div key={lineIndex} className="text-purple-400 whitespace-pre-wrap">
                      {line}
                    </div>
                  )
                }
                
                // Check if this line is a command or code
                if (line.startsWith("Type ") || line.startsWith("Usage:") || line.startsWith("Example:")) {
                  return (
                    <div key={lineIndex} className="text-cyan-400 whitespace-pre-wrap">
                      {line}
                    </div>
                  )
                }
                
                // Check if this line is a number (for project lists, etc.)
                if (/^\d+\./.test(line.trim())) {
                  return (
                    <div key={lineIndex} className="text-magenta-400 whitespace-pre-wrap">
                      {line}
                    </div>
                  )
                }
                
                // Default color for regular text
                return (
                  <div key={lineIndex} className="text-green-300 whitespace-pre-wrap">
                    {line}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Current Input */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-green-400 mr-2">
              {developer.name.toLowerCase().replace(/\s+/g, "")}@portfolio:{currentPath}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-white outline-none flex-1 caret-green-400"
              disabled={isTyping}
              autoComplete="off"
              spellCheck="false"
            />
            <span className="animate-pulse text-green-400 ml-1">█</span>
          </form>
        </div>

        {/* Quick Commands */}
        <div className="mt-2 text-center text-gray-500 text-xs space-y-1 flex-shrink-0">
          <p>
            Quick commands: <code className="bg-gray-800 px-1 rounded">resume</code> |{" "}
            <code className="bg-gray-800 px-1 rounded">experience</code> |{" "}
            <code className="bg-gray-800 px-1 rounded">skills</code> |{" "}
            <code className="bg-gray-800 px-1 rounded">projects</code> |{" "}
            <code className="bg-gray-800 px-1 rounded">starwars</code>
          </p>
          <p className="text-xs">
            Direct access: <code className="bg-gray-800 px-1 rounded">about</code>,{" "}
            <code className="bg-gray-800 px-1 rounded">contact</code>,{" "}
            <code className="bg-gray-800 px-1 rounded">education</code>,{" "}
            <code className="bg-gray-800 px-1 rounded">philosophy</code>
          </p>
          <p className="text-xs">
            Philosophy: <code className="bg-gray-800 px-1 rounded">philosophy</code>
          </p>
        </div>
      </div>

      {/* Large ASCII Text Effect at Bottom */}
      <div className="absolute bottom-0 right-0 w-96 h-64 z-10">
        <ASCIIText
          text="Umar Darsot"
          enableWaves={true}
          asciiFontSize={6}
          textFontSize={120}
          textColor="#00ff00"
          planeBaseHeight={5}
        />
      </div>

    </div>
  )
}
