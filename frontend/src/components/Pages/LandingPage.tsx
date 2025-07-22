import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import studentDashboardImage from "@/assets/studentDashboard.png";
import teacherDashboardImage from "@/assets/teacherDashboard.png";
import adminDashboardImage from "@/assets/admin.png";
import parentDashboardImage from "@/assets/parentDashboard.png";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  LineChart,
  Users,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "features",
        "learn-more",
        "for-parents",
        "for-teachers",
        "contact",
      ];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 200 && rect.bottom >= 200;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [title, setTitle] = useState("Login");

  useEffect(() => {
    setTitle("Login");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 text-black overflow-hidden">
      <motion.div
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, black 0%, transparent 50%)`,
        }}
      />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-black" />
                <span className="ml-2 text-2xl font-bold text-black">
                  Classync
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                "features",
                "for-admin",
                "for-students",
                "for-parents",
                "for-teachers",
                "contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    activeSection === item
                      ? "text-black"
                      : "text-gray-600 hover:text-black"
                  )}
                >
                  {item
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </a>
              ))}
              <button
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 font-medium shadow-lg"
                onClick={() => navigate("/login")}
              >
                {title}
              </button>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-black"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {[
                "features",
                "for-students",
                "for-parents",
                "for-teachers",
                "contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </a>
              ))}
              <button
                className="w-full mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>
      <HeroSection mousePosition={mousePosition} />
      <FeaturesSection />
      <HowItWorksSection />
      <StatisticsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

const HeroSection = ({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, black 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex mt-[100px] items-center px-4 py-2 rounded-full border border-gray-700 bg-white/50 backdrop-blur-sm text-sm font-medium text-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 500+ schools nationwide
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <motion.span
              className="block text-black"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Transform
            </motion.span>
            <motion.span
              className="block text-black relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Education
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-black"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </motion.span>
            <motion.span
              className="block text-gray-600 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Digitally
            </motion.span>
          </h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Connect students, parents, and teachers on one comprehensive
            platform. Manage assignments, track progress, and facilitate
            transparent communication.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <a
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#learn-more"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 hover:text-black transition-colors"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        ></motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Assignment Management",
      description:
        "Track homework and assignments with due dates, submissions, and feedback all in one place.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Interactive Timetables",
      description:
        "View personalized schedules for classes, exams, and extracurricular activities.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Document Generation",
      description:
        "Generate admit cards, result sheets, and other important documents with just a few clicks.",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Real-time Notifications",
      description:
        "Stay updated with important announcements, grade releases, and upcoming deadlines.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Parent-Teacher Collaboration",
      description:
        "Facilitate direct communication between parents and teachers for better student support.",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Performance Analytics",
      description:
        "Track academic progress with insightful reports and visualization tools.",
    },
  ];

  return (
    <div id="features" ref={ref} className="relative z-10 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-black sm:text-4xl mb-4">
            Everything you need in one place
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Classync brings together all essential educational management tools
            on a single, intuitive platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-200"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-black text-white mb-4">
        {feature.icon}
      </div>
      <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div id="learn-more" ref={ref} className="relative z-10 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-black sm:text-4xl mb-4">
            Simple workflow for everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform is designed to be intuitive and accessible for
            students, parents, and teachers alike.
          </p>
        </motion.div>

        <div className="space-y-20">
          <WorkflowItem
            id="for-admin"
            title="For Admin"
            description="Monitor school operations, manage users, and oversee all educational activities from a centralized dashboard."
            image={adminDashboardImage}
            steps={[
              "Access comprehensive admin dashboard with full system control",
              "Manage user accounts and permissions across all roles",
              "Monitor school-wide performance metrics and analytics",
              "Generate reports and maintain institutional records",
            ]}
            isReversed={true}
            index={0}
          />
          <WorkflowItem
            id="for-students"
            title="For Students"
            description="Access assignments, check timetables, download admit cards, and view results in real-time."
            image={studentDashboardImage}
            steps={[
              "Log in with your school code and student credentials",
              "View your personalized dashboard with pending tasks",
              "Access assignments, submit work, and download resources",
              "Generate documents like admit cards and check results",
            ]}
            isReversed={false}
            index={1}
          />

          <WorkflowItem
            id="for-parents"
            title="For Parents"
            description="Monitor your child's performance, receive important notifications, and collaborate with teachers."
            image={parentDashboardImage}
            steps={[
              "Receive an invitation from the school to create an account",
              "Connect to your child's profile with the provided code",
              "Monitor academic progress and receive notifications",
              "Communicate directly with teachers when needed",
            ]}
            isReversed={true}
            index={2}
          />

          <WorkflowItem
            id="for-teachers"
            title="For Teachers"
            description="Manage classes, assign and grade work, create timetables, and communicate with parents."
            image={teacherDashboardImage}
            steps={[
              "Log in with teacher credentials provided by the school",
              "Create and assign work to classes or individual students",
              "Grade submissions and provide constructive feedback",
              "View personal timetable and manage class schedules",
            ]}
            isReversed={false}
            index={3}
          />
        </div>
      </div>
    </div>
  );
};

const WorkflowItem = ({
  id,
  title,
  description,
  image,
  steps,
  isReversed,
  index,
}: {
  id: string;
  title: string;
  description: string;
  image: string;
  steps: string[];
  isReversed: boolean;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      id={id}
      ref={ref}
      className={`lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center ${
        isReversed ? "lg:grid-flow-col-dense" : ""
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 * index }}
    >
      <div className={isReversed ? "lg:col-start-2" : ""}>
        <h3 className="text-2xl font-bold text-black mb-4">{title}</h3>
        <p className="text-lg text-gray-600 mb-6">{description}</p>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-black text-white font-medium text-sm mr-3">
                {i + 1}
              </span>
              <span className="text-gray-600">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={`mt-8 lg:mt-0 ${isReversed ? "lg:col-start-1" : ""}`}>
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
};

const StatisticsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { label: "Schools", value: "500+" },
    { label: "Students", value: "100,000+" },
    { label: "Assignments Completed", value: "5M+" },
  ];

  return (
    <div ref={ref} className="relative z-10 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-black sm:text-4xl mb-4">
            Trusted by schools across the country
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of students, parents, and teachers already using
            Classync
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className="text-4xl font-bold text-black mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div ref={ref} className="relative z-10 py-20 bg-white">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-black sm:text-4xl mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of schools already using Classync to streamline
            education management.
          </p>
          <a
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

const FooterSection = () => {
  return (
    <footer id="contact" className="bg-black text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-white" />
              <span className="ml-2 text-2xl font-bold">Classync</span>
            </div>
            <p className="text-gray-400">
              Transforming education management with innovative digital
              solutions.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white transition-colors blur-[1px]">
                  Careers
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white transition-colors blur-[1px]">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Solutions
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#for-students"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  For Students
                </a>
              </li>
              <li>
                <a
                  href="#for-parents"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  For Parents
                </a>
              </li>
              <li>
                <a
                  href="#for-teachers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  For Teachers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email us and we’ll get back to you within 24 hours 😊</li>
              <li>indianteched@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-800 "></div>
      </div>
    </footer>
  );
};

export default LandingPage;
