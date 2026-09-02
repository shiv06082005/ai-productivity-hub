import Link from "next/link";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaComments,
  FaPenNib,
  FaLightbulb,
  FaUserTie,
  FaPlane,
} from "react-icons/fa";

const cards = [
  {
    title: "Resume Builder",
    icon: <FaFileAlt className="text-4xl text-blue-400" />,
    path: "/resume",
    description: "Create ATS-friendly resumes instantly.",
  },
  {
    title: "Study Planner",
    icon: <FaCalendarAlt className="text-4xl text-green-400" />,
    path: "/study-planner",
    description: "Generate personalized study schedules.",
  },
  {
    title: "Email Assistant",
    icon: <FaEnvelope className="text-4xl text-yellow-400" />,
    path: "/email",
    description: "Write professional emails with AI.",
  },
  {
    title: "AI Chat",
    icon: <FaComments className="text-4xl text-cyan-400" />,
    path: "/chat",
    description: "Ask anything and get AI responses.",
  },
  {
    title: "Blog Writer",
    icon: <FaPenNib className="text-4xl text-pink-400" />,
    path: "/blog",
    description: "Generate SEO-friendly blogs.",
  },
  {
    title: "Business Ideas",
    icon: <FaLightbulb className="text-4xl text-orange-400" />,
    path: "/business",
    description: "Generate startup ideas using AI.",
  },
  {
    title: "Interview Prep",
    icon: <FaUserTie className="text-4xl text-purple-400" />,
    path: "/interview",
    description: "Prepare for interviews confidently.",
  },
  {
    title: "Travel Planner",
    icon: <FaPlane className="text-4xl text-red-400" />,
    path: "/travel",
    description: "Plan your next trip with AI.",
  },
];

export default function Home() {
  return (
    <div>

      {/* Hero Section */}

      <div className="mb-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-4">
          🚀 AI Productivity Hub
        </h1>

        <p className="text-xl text-blue-100 max-w-3xl">
          One platform with multiple AI-powered productivity tools to boost
          your productivity, learning, creativity and career.
        </p>

        {/* Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-5 border border-slate-700">
            <h3 className="text-3xl font-bold text-blue-400">8</h3>
            <p className="text-gray-300 mt-2">AI Modules</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-5 border border-slate-700">
            <h3 className="text-3xl font-bold text-green-400">100%</h3>
            <p className="text-gray-300 mt-2">Groq Powered</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-5 border border-slate-700">
            <h3 className="text-3xl font-bold text-yellow-400">24×7</h3>
            <p className="text-gray-300 mt-2">AI Available</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-5 border border-slate-700">
            <h3 className="text-3xl font-bold text-purple-400">Next.js</h3>
            <p className="text-gray-300 mt-2">Built With</p>
          </div>

        </div>

      </div>

      {/* Modules */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.path}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
          >

            <div className="mb-6">
              {card.icon}
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {card.title}
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              {card.description}
            </p>

            <span className="text-blue-400 font-semibold">
              Open Module →
            </span>

          </Link>
        ))}

      </div>

    </div>
  );
}