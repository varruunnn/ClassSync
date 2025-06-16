import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import studentDashboardImage from '@/assets/studentDashboard.png';
import teacherDashboardImage from '@/assets/teacherDashboard.png';
import adminDashboardImage from '@/assets/admin.png'
import parentDashboardImage from '@/assets/parentDashboard.png'
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
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

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

  const [title, setTitle] = useState("Login");

  useEffect(()=>{
     const getrole = localStorage.getItem('role');
     
     if (getrole === null) {
      setTitle("Login");
     }else{
      setTitle("Dashboard");
     }
  },[])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">
                  EdConnect
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {["features", "for-students", "for-parents", "for-teachers", "contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    activeSection === item
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {item
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </a>
              ))}
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => navigate("/login")}
              >
               {title}
              </button>
            </div>
            
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-1">
              {["features", "for-students", "for-parents", "for-teachers", "contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </a>
              ))}
              <button
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatisticsSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}

const HeroSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div id="hero" ref={ref} className="pt-20 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-gray-900">Transform school</span>
              <span className="block text-blue-600">management digitally</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl">
              Connect students, parents, and teachers on one comprehensive platform. Manage assignments, track
              progress, view timetables, and facilitate transparent communication throughout the educational
              journey.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#learn-more"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </motion.div>
          
          <motion.div
            className="mt-12 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl"></div>
              <div className="relative bg-white rounded-xl shadow-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Math Quiz</div>
                    <div className="text-sm text-gray-600">Today, 2:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <LineChart className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Grade Improved</div>
                    <div className="text-sm text-green-600">+15% this month</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const FeaturesSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

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
    <div id="features" ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Everything you need in one place
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            EdConnect brings together all essential educational management tools on a single, intuitive platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white mb-4">
        {feature.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  )
}

const HowItWorksSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div id="learn-more" ref={ref} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Simple workflow for everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform is designed to be intuitive and accessible for students, parents, and teachers alike.
          </p>
        </motion.div>

        <div className="space-y-20">
          <WorkflowItem
            id="for-admin"
            title="For admin"
            description="Monitor your child's performance, receive important notifications, and collaborate with teachers."
            image={adminDashboardImage}
            steps={[
              "Receive an invitation from the school to create an account",
              "Connect to your child's profile with the provided code",
              "Monitor academic progress and receive notifications",
              "Communicate directly with teachers when needed",
            ]}
            isReversed={true}
            index={1}
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
            index={0}
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
            index={1}
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
            index={2}
          />
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
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      id={id}
      ref={ref}
      className={`lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center ${isReversed ? "lg:grid-flow-col-dense" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 * index }}
    >
      <div className={isReversed ? "lg:col-start-2" : ""}>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h3>
        <p className="text-lg text-gray-600 mb-6">
          {description}
        </p>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white font-medium text-sm mr-3">
                {i + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>
      
      <div className={`mt-8 lg:mt-0 ${isReversed ? "lg:col-start-1" : ""}`}>
        <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-64 object-cover" />
        </div>
      </div>
    </motion.div>
  )
}

const StatisticsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    { label: "Schools", value: "500+" },
    { label: "Students", value: "100,000+" },
    { label: "Assignments Completed", value: "5M+" },
  ]

  return (
    <div ref={ref} className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Trusted by schools across the country
          </h2>
          <p className="text-xl text-blue-100">
            Join thousands of students, parents, and teachers already using EdConnect
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
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TestimonialsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    {
      quote:
        "EdConnect has transformed how we manage assignments and communicate with parents. The platform is intuitive and saves us hours of administrative work.",
      name: "John Davis",
      role: "Principal, Lincoln High School",
      rating: 5,
    },
    {
      quote:
        "As a parent, I love getting real-time updates about my daughter's progress. Being able to directly message her teachers has improved our collaboration tremendously.",
      name: "Sarah Mills",
      role: "Parent",
      rating: 5,
    },
    {
      quote:
        "The timetable feature and assignment tracker have helped me stay organized. I never miss deadlines now, and generating my admit card is super convenient.",
      name: "Kevin Patel",
      role: "Student, Grade 10",
      rating: 5,
    },
  ]

  return (
    <div ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            What our users are saying
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

const TestimonialCard = ({ testimonial, index }: { testimonial: any; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className="flex items-center mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
      <div>
        <div className="font-semibold text-gray-900">{testimonial.name}</div>
        <div className="text-sm text-gray-600">{testimonial.role}</div>
      </div>
    </motion.div>
  )
}

const CTASection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div ref={ref} className="py-20">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of schools already using EdConnect to streamline education management.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </div>
  )
}

const FooterSection = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-2xl font-bold">EdConnect</span>
            </div>
            <p className="text-gray-400">
              Transforming education management with innovative digital solutions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><a href="#for-students" className="text-gray-400 hover:text-white transition-colors">For Students</a></li>
              <li><a href="#for-parents" className="text-gray-400 hover:text-white transition-colors">For Parents</a></li>
              <li><a href="#for-teachers" className="text-gray-400 hover:text-white transition-colors">For Teachers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Mon-Fri: 9AM - 5PM</li>
              <li>info@edconnect.com</li>
              <li>1-800-EDU-CONN</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-center">
            &copy; {new Date().getFullYear()} EdConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default LandingPage