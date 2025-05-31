import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion"
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  LineChart,
  Users,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: false, amount: 0.5 })

  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [1, 0.2])
  const scale = useTransform(scrollY, [0, 100], [1, 0.95])
  const heroImageY = useTransform(scrollY, [0, 500], [0, 150])
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      setGradientPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "learn-more", "for-parents", "for-teachers", "contact"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= 200 && rect.bottom >= 200
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at ${gradientPosition.x * 100}% ${gradientPosition.y * 100}%, rgba(99, 102, 241, 0.8), transparent 40%)`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-2 left-2 right-2 z-50  px-3 sm:px-6 py-2 sm:py-3 backdrop-blur-md bg-slate-900/60 dark:bg-gray-900/70 shadow-lg transition-all duration-500 ease-in-out rounded-b-xl rounded-t-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                className="flex-shrink-0 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <BookOpen className="h-8 w-8 text-indigo-400" />
                </motion.div>
                <motion.span
                  className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  EdConnect
                </motion.span>
              </motion.div>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {["features", "for-students", "for-parents", "for-teachers", "contact"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeSection === item
                      ? "text-white bg-indigo-600/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800",
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </motion.a>
              ))}
              <motion.button
                className="ml-6 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Login
              </motion.button>
            </div>
            <div className="flex items-center md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900 border-b border-slate-800">
                {["features", "for-students", "for-parents", "for-teachers", "contact"].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item}`}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium",
                      activeSection === item
                        ? "text-white bg-indigo-600/20"
                        : "text-slate-300 hover:text-white hover:bg-slate-800",
                    )}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </motion.a>
                ))}
                <motion.button
                  className="w-full mt-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <div id="hero" ref={heroRef} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <motion.div
              style={{ opacity, scale }}
              className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
            >
              <motion.div
                className="sm:text-center lg:text-left"
                initial={{ opacity: 0, y: 50 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="relative"
                >
                  <motion.div
                    className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute top-20 right-0 w-60 h-60 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.25, 0.2],
                    }}
                    transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                  />
                </motion.div>

                <motion.h1
                  className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    Transform school
                  </motion.span>
                  <motion.span
                    className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    management digitally
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-base text-slate-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Connect students, parents, and teachers on one comprehensive platform. Manage assignments, track
                  progress, view timetables, and facilitate transparent communication throughout the educational
                  journey.
                </motion.p>
                <motion.div
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.div
                    className="rounded-md shadow"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 md:py-4 md:text-lg md:px-10 shadow-lg shadow-indigo-600/20"
                    >
                      Get Started
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    </a>
                  </motion.div>
                  <motion.div
                    className="mt-3 sm:mt-0 sm:ml-3"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href="#learn-more"
                      className="w-full flex items-center justify-center px-8 py-3 border border-indigo-500 text-base font-medium rounded-md text-indigo-300 bg-transparent hover:bg-indigo-900/20 md:py-4 md:text-lg md:px-10"
                    >
                      Learn More
                    </a>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <motion.div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2" style={{ y: heroImageY }}>
          <motion.div
            className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent z-10 lg:hidden" />
            {/* Floating elements */}
            <motion.div
              className="absolute top-1/4 right-1/4 bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ width: "120px" }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Calendar className="h-6 w-6 text-indigo-300 mb-1" />
                <div className="text-xs font-medium">Math Quiz</div>
                <div className="text-xs text-slate-300">Today, 2PM</div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-1/4 left-1/4 bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{ width: "130px" }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
              >
                <LineChart className="h-6 w-6 text-green-300 mb-1" />
                <div className="text-xs font-medium">Grade Improved</div>
                <div className="text-xs text-green-300">+15% this month</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-sm text-slate-400 mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 text-indigo-400" />
          </motion.div>
        </motion.div>
      </div>
      <FeaturesSection />
      <HowItWorksSection />
      <StatisticsSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}

const FeaturesSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Assignment Management",
      description: "Track homework and assignments with due dates, submissions, and feedback all in one place.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Interactive Timetables",
      description: "View personalized schedules for classes, exams, and extracurricular activities.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Document Generation",
      description: "Generate admit cards, result sheets, and other important documents with just a few clicks.",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Real-time Notifications",
      description: "Stay updated with important announcements, grade releases, and upcoming deadlines.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Parent-Teacher Collaboration",
      description: "Facilitate direct communication between parents and teachers for better student support.",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Performance Analytics",
      description: "Track academic progress with insightful reports and visualization tools.",
    },
  ]

  return (
    <div id="features" ref={ref} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="lg:text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center bg-indigo-900/30 rounded-full px-4 py-1 text-sm font-medium text-indigo-300 mb-3"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Features
          </motion.div>
          <motion.h2
            className="text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Everything you need in one place
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-slate-300 lg:mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            EdConnect brings together all essential educational management tools on a single, intuitive platform.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        {feature.icon}
      </motion.div>
      <h3 className="mt-6 text-lg font-medium">{feature.title}</h3>
      <p className="mt-2 text-base text-slate-400 text-center">{feature.description}</p>
    </motion.div>
  )
}

const HowItWorksSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <div id="learn-more" ref={ref} className="py-20 bg-slate-900/50 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.05 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full h-full bg-[url('/placeholder.svg?height=800&width=800')] bg-no-repeat bg-center opacity-10" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="lg:text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center bg-indigo-900/30 rounded-full px-4 py-1 text-sm font-medium text-indigo-300 mb-3"
          >
            <Clock className="mr-2 h-4 w-4" />
            How It Works
          </motion.div>
          <motion.h2
            className="text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Simple workflow for everyone
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-slate-300 lg:mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our platform is designed to be intuitive and accessible for students, parents, and teachers alike.
          </motion.p>
        </motion.div>

        <div className="mt-10">
          <div className="relative">
            {/* Workflow line */}
            <motion.div
              className="hidden md:block absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 -ml-px"
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Student Workflow */}
            <WorkflowItem
              id="for-students"
              title="For Students"
              description="Access assignments, check timetables, download admit cards, and view results in real-time."
              image="/placeholder.svg?height=400&width=600"
              steps={[
                "Log in with your school code and student credentials",
                "View your personalized dashboard with pending tasks",
                "Access assignments, submit work, and download resources",
                "Generate documents like admit cards and check results",
              ]}
              isReversed={false}
              index={0}
            />

            {/* Parent Workflow */}
            <WorkflowItem
              id="for-parents"
              title="For Parents"
              description="Monitor your child's performance, receive important notifications, and collaborate with teachers."
              image="/placeholder.svg?height=400&width=600"
              steps={[
                "Receive an invitation from the school to create an account",
                "Connect to your child's profile with the provided code",
                "Monitor academic progress and receive notifications",
                "Communicate directly with teachers when needed",
              ]}
              isReversed={true}
              index={1}
            />

            {/* Teacher Workflow */}
            <WorkflowItem
              id="for-teachers"
              title="For Teachers"
              description="Manage classes, assign and grade work, create timetables, and communicate with parents."
              image="/placeholder.svg?height=400&width=600"
              steps={[
                "Log in with teacher credentials provided by the school",
                "Create and assign work to classes or individual students",
                "Grade submissions and provide constructive feedback",
                "View personal timetable and manage class schedules",
              ]}
              isReversed={false}
              index={2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const WorkflowItem = ({
  id,
  title,
  description,
  image,
  steps,
  isReversed,
  index,
}: {
  id: string
  title: string
  description: string
  image: string
  steps: string[]
  isReversed: boolean
  index: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <motion.div
      id={id}
      ref={ref}
      className={`relative md:flex md:items-center mb-24 ${isReversed ? "md:flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 * index }}
    >
      <div className={`md:w-1/2 ${isReversed ? "md:pl-12 text-left" : "md:pr-12 md:text-right"}`}>
        <motion.h3
          className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 + 0.1 * index }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="mt-3 text-lg text-slate-300"
          initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 + 0.1 * index }}
        >
          {description}
        </motion.p>
      </div>
      <motion.div
        className={`mt-6 md:mt-0 md:w-1/2 ${isReversed ? "md:pr-12" : "md:pl-12"}`}
        initial={{ opacity: 0, scale: 0.9, x: isReversed ? -20 : 20 }}
        animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 + 0.1 * index }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-slate-700">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="relative">
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
          </motion.div>
          <div className="p-6">
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <motion.li
                  key={i}
                  className="flex"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + 0.1 * i + 0.1 * index }}
                >
                  <motion.span
                    className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-900 text-indigo-300 font-medium text-sm"
                    whileHover={{ scale: 1.2, backgroundColor: "#4f46e5" }}
                  >
                    {i + 1}
                  </motion.span>
                  <span className="ml-4 text-slate-300">{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const StatisticsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const stats = [
    { label: "Schools", value: "500+" },
    { label: "Students", value: "100,000+" },
    { label: "Assignments Completed", value: "5M+" },
  ]

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:py-32 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-extrabold sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trusted by schools across the country
          </motion.h2>
          <motion.p
            className="mt-3 text-xl text-indigo-200 sm:mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Join thousands of students, parents, and teachers already using EdConnect
          </motion.p>
        </motion.div>

        <motion.dl
          className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col mt-10 sm:mt-0"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">{stat.label}</dt>
              <dd className="order-1 text-5xl font-extrabold">
                <CountUp value={stat.value} />
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </div>
  )
}

const CountUp = ({ value }: { value: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })
  const [displayValue, setDisplayValue] = useState("0")

  useEffect(() => {
    if (isInView) {
      setDisplayValue(value)
    }
  }, [isInView, value])

  return <span ref={ref}>{displayValue}</span>
}

const TestimonialsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const testimonials = [
    {
      quote:
        "EdConnect has transformed how we manage assignments and communicate with parents. The platform is intuitive and saves us hours of administrative work.",
      name: "John Davis",
      role: "Principal, Lincoln High School",
      initials: "JD",
    },
    {
      quote:
        "As a parent, I love getting real-time updates about my daughter's progress. Being able to directly message her teachers has improved our collaboration tremendously.",
      name: "Sarah Mills",
      role: "Parent",
      initials: "SM",
    },
    {
      quote:
        "The timetable feature and assignment tracker have helped me stay organized. I never miss deadlines now, and generating my admit card is super convenient.",
      name: "Kevin Patel",
      role: "Student, Grade 10",
      initials: "KP",
    },
  ]

  return (
    <div ref={ref} className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="lg:text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center bg-indigo-900/30 rounded-full px-4 py-1 text-sm font-medium text-indigo-300 mb-3"
          >
            <Users className="mr-2 h-4 w-4" />
            Testimonials
          </motion.div>
          <motion.h2
            className="text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            What our users are saying
          </motion.h2>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const TestimonialCard = ({ testimonial, index }: { testimonial: any; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-xl border border-slate-700 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
    >
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: index * 2 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 + 0.1 * index }}
      >
        <p className="text-slate-300 italic relative">
          <span className="text-4xl text-indigo-400 absolute -top-2 -left-2 opacity-30">"</span>
          {testimonial.quote}
          <span className="text-4xl text-indigo-400 absolute -bottom-5 -right-2 opacity-30">"</span>
        </p>
      </motion.div>

      <motion.div
        className="mt-6 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 + 0.1 * index }}
      >
        <motion.div
          className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <span className="text-white font-medium">{testimonial.initials}</span>
        </motion.div>
        <div className="ml-3">
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className="text-sm text-slate-400">{testimonial.role}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

const CTASection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-900"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          className="text-3xl font-extrabold sm:text-4xl mb-2"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Ready to get started?
          </motion.span>
          <motion.span
            className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect your school today.
          </motion.span>
        </motion.h2>
        <motion.p
          className="mt-4 text-lg leading-6 text-indigo-200"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Join thousands of schools already using EdConnect to streamline education management.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8"
        >
          <a
            href="/signup"
            className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 sm:w-auto shadow-lg shadow-indigo-900/30"
          >
            Get Started
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </div>
  )
}

const FooterSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <footer id="contact" ref={ref} className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <BookOpen className="h-8 w-8 text-indigo-400" />
              </motion.div>
              <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                EdConnect
              </span>
            </div>
            <p className="mt-4 text-slate-400 text-sm">
              Transforming education management with innovative digital solutions.
            </p>
          </motion.div>

          <FooterColumn
            title="Solutions"
            links={[
              { label: "For Schools", href: "#" },
              { label: "For Students", href: "#for-students" },
              { label: "For Parents", href: "#for-parents" },
              { label: "For Teachers", href: "#for-teachers" },
            ]}
            delay={0.2}
          />

          <FooterColumn
            title="Support"
            links={[
              { label: "Help Center", href: "#" },
              { label: "Documentation", href: "#" },
              { label: "API", href: "#" },
              { label: "Contact Us", href: "#" },
            ]}
            delay={0.3}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center text-slate-400">
                <Clock className="h-5 w-5 mr-2 text-indigo-400" />
                <span>Mon-Fri: 9AM - 5PM</span>
              </li>
              <li className="flex items-center text-slate-400">
                <span>info@edconnect.com</span>
              </li>
              <li className="flex items-center text-slate-400">
                <span>1-800-EDU-CONN</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 border-t border-slate-800 pt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-base text-slate-400 text-center">
            &copy; {new Date().getFullYear()} EdConnect. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

const FooterColumn = ({
  title,
  links,
  delay,
}: {
  title: string
  links: { label: string; href: string }[]
  delay: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">{title}</h3>
      <ul className="mt-4 space-y-4">
        {links.map((link, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.1 * index }}
          >
            <motion.a
              href={link.href}
              className="text-base text-slate-400 hover:text-white transition-colors"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label}
            </motion.a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default LandingPage
