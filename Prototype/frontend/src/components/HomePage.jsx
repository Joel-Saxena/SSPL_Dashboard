import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiLogIn, FiShield, FiUsers, FiFileText, 
  FiBarChart2, FiSettings, FiAward, 
  FiLock, FiActivity, FiGlobe, FiDatabase,
  FiChevronRight, FiClock, FiKey, FiMonitor
} from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function AdminLanding() {
  const [currentDate, setCurrentDate] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  const handleAdminLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      navigate('/login');
    }, 50);
  };

  const features = [
    {
      icon: <FiUsers className="text-[#1a3a70]" size={24} />,
      title: "Personnel Management",
      description: "Role-based access control for all DRDO staff with advanced security protocols."
    },
    {
      icon: <FiFileText className="text-[#1a3a70]" size={24} />,
      title: "Document Control",
      description: "End-to-end encrypted document handling with blockchain-based verification."
    },
    {
      icon: <FiBarChart2 className="text-[#1a3a70]" size={24} />,
      title: "Advanced Analytics",
      description: "AI-powered dashboards with predictive analytics for strategic decisions."
    },
    {
      icon: <FiDatabase className="text-[#1a3a70]" size={24} />,
      title: "Data Warehouse",
      description: "Secure centralized repository for all administrative data assets."
    }
  ];

  const securityFeatures = [
    {
      icon: <FiLock size={20} className="text-[#1a3a70]" />,
      title: "Military-Grade Encryption",
      description: "256-bit AES encryption for all data transmission and storage"
    },
    {
      icon: <FiMonitor size={20} className="text-[#1a3a70]" />,
      title: "Real-time Monitoring",
      description: "24/7 surveillance of all system activities with anomaly detection"
    },
    {
      icon: <FiKey size={20} className="text-[#1a3a70]" />,
      title: "Multi-Factor Auth",
      description: "Biometric + OTP + Hardware token authentication"
    },
    {
      icon: <FiClock size={20} className="text-[#1a3a70]" />,
      title: "Session Timeout",
      description: "Automatic logout after 15 minutes of inactivity"
    }
  ];

  const stats = [
    { value: "850+", label: "Administrators" },
    { value: "52", label: "DRDO Labs" },
    { value: "99.99%", label: "Uptime" },
    { value: "256-bit", label: "Encryption" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fbff] to-[#e8f2ff]">
      {/* Enhanced Security Header (unchanged as requested) */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-[#1b2940] text-[#c9d8ff] text-sm py-3 px-6 flex justify-between items-center shadow-lg border-b border-[#7a9eff]/30"
      >
        <div className="flex items-center space-x-2">
          <FiLock className="text-[#7a9eff] animate-pulse" size={16} />
          <span className="font-mono tracking-wider">SSPL (DRDO) SECURE ADMIN PORTAL - CLASSIFIED ACCESS ONLY</span>
        </div>
        <div className="font-mono text-xs bg-[#1b2940]/80 px-3 py-1 rounded-full border border-[#7a9eff]/20">
          {currentDate}
        </div>
      </motion.div>

      {/* Hero Section with Enhanced Visuals */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-75">
          <img 
            src="bgdrdo.png"
            alt="Background Image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Hero Content */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center lg:text-left lg:w-1/2"
            >
              <div className="inline-flex items-center justify-center lg:justify-start mb-8">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="bg-white/90 p-4 rounded-full shadow-2xl backdrop-blur-sm border-2 border-[#d6e3ff]"
                >
                  <img src="/DrdoLogo.png" alt="DRDO Logo" className="h-24 w-24" />
                </motion.div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                <span className="text-[#7a9eff]">SSPL</span>{' '}
                <span className="text-white">Administration Portal</span>
              </h1>
              <p className="text-xl text-[#c9d8ff] max-w-3xl mx-auto lg:mx-0 leading-relaxed mb-10">
                Secure, efficient management system for SSPL's classified administrative operations with military-grade encryption.
              </p>

              {/* Stats Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0"
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-[#d6e3ff] shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="text-2xl font-bold text-[#1a3a70]">{stat.value}</div>
                    <div className="text-sm text-[#4a5a7a]">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Enhanced Login Card */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-full lg:w-96"
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl border border-[#d6e3ff] hover:-translate-y-1">
                <div className="bg-gradient-to-r from-[#1b2940] to-[#1a3a70] p-6 text-white border-b border-[#7a9eff]/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center">
                      <FiShield className="mr-3 text-[#7a9eff]" size={24} />
                      Secure Access
                    </h2>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    </div>
                  </div>
                  <p className="text-sm text-[#c9d8ff] mt-2">Classified access for authorized personnel only</p>
                </div>
                <div className="p-8">
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <motion.div 
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -inset-2 bg-[#7a9eff]/20 rounded-full blur-md"
                      />
                      <button
                        onClick={handleAdminLogin}
                        disabled={isAuthenticating}
                        className={`relative flex justify-center items-center py-4 px-10 rounded-full shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-[#1a3a70] to-[#1b2940] hover:from-[#1b2940] hover:to-[#1a3a70] focus:outline-none focus:ring-2 focus:ring-[#7a9eff] focus:ring-offset-2 transition-all ${isAuthenticating ? 'opacity-90' : ''}`}
                      >
                        {isAuthenticating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Authenticating...
                          </>
                        ) : (
                          <>
                            <FiLogIn className="mr-3" size={20} />
                            Proceed to Login
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-center text-sm text-[#4a5a7a] space-y-2">
                    <div className="flex items-center justify-center space-x-4">
                      <FiGlobe className="text-[#1a3a70]" />
                      <span>Restricted to SSPL Intranet Only</span>
                    </div>
                    <Link to="/help" className="text-[#1a3a70] hover:text-[#1b2940] inline-flex items-center font-medium">
                      <FiActivity className="mr-2" size={14} />
                      Need security clearance assistance?
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the code remains unchanged */}
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-10 relative z-20">
        {/* About Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e6f0ff]">
            <div className="grid md:grid-cols-2">
              <div className="p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1a3a70] to-[#1b2940]">
                    About the Admin Portal
                  </span>
                </h2>
                <div className="prose text-gray-700">
                  <p className="text-lg">
                    The SSPL Administration Portal is a secure, centralized platform designed exclusively for authorized 
                    administrative personnel to manage the organization's critical operations with military-grade security protocols.
                  </p>
                  <div className="space-y-4 mt-6">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 bg-gradient-to-br from-[#f5f9ff] to-[#e6f0ff] p-2 rounded-lg mr-4 shadow-sm">
                          {feature.icon}
                        </div>
                        <div>
                          <strong className="text-[#1a3a70]">{feature.title}</strong>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block relative min-h-[400px] bg-gradient-to-br from-[#1a3a70] to-[#1b2940]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-[#7a9eff]/20 rounded-full"
                    ></motion.div>
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8 border-4 border-[#7a9eff]/30 rounded-full"
                    ></motion.div>
                    <div className="relative z-10 p-8 text-center">
                      <FiAward className="mx-auto mb-6 text-[#7a9eff]" size={48} />
                      <h3 className="text-2xl font-bold text-white mb-2">Trusted by 850+ Security-Cleared Administrators</h3>
                      <p className="text-[#c9d8ff]">Across all 52 DRDO laboratories nationwide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-28 relative"
        >
          {/* Decorative security pattern */}
          <div className="absolute -top-20 left-0 right-0 h-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCI+PHBhdGggZD0iTTAgNTBoMTAwIiBzdHJva2U9IiMxYTI5NDAiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNSw1Ii8+PC9zdmc+')] opacity-20"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1a3a70] via-[#2a4a8a] to-[#1b2940]">
                  Portal Features
                </span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-[#4a5a7a] max-w-3xl mx-auto"
              >
                Advanced tools designed for <span className="font-semibold text-[#1a3a70]">secure defense administration</span> workflows
              </motion.p>
            </div>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Animated background element */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 1.5 }}
                className="absolute -inset-8 bg-[radial-gradient(circle_at_center,#1a3a70_0%,transparent_70%)] rounded-full"
              />

              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6, type: 'spring' }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  {/* Card glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1a3a70]/30 to-[#1b2940]/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition duration-300"></div>
                  
                  {/* Main card */}
                  <div className="relative h-full bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#e6f0ff] group-hover:border-[#c9d8ff]/50 transition-all duration-300 overflow-hidden">
                    {/* Animated border */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#1a3a70] to-[#1b2940]"
                    />
                    
                    {/* Icon container with parallax effect */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="mb-8 relative"
                    >
                      <div className="absolute -inset-4 bg-[#1a3a70]/10 rounded-full scale-0 group-hover:scale-100 transition duration-500"></div>
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f5f9ff] to-[#e6f0ff] shadow-inner flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </motion.div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-[#1b2940] mb-3 relative">
                      {feature.title}
                    </h3>
                    <p className="text-[#4a5a7a] mb-6">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-20 flex justify-center"
            >
              <div className="inline-flex items-center bg-gradient-to-br from-[#f5f9ff] to-[#e6f0ff] px-6 py-3 rounded-full border border-[#d6e3ff] shadow-sm">
                <FiShield className="text-[#1a3a70] mr-3" size={20} />
                <span className="font-medium text-[#1a3a70]">ISO 27001 Certified Security</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Security Notice */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#f5f9ff] to-[#e6f0ff] border border-[#d6e3ff] rounded-2xl p-8 max-w-4xl mx-auto shadow-inner"
        >
          <div className="flex">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 3 }}
              className="flex-shrink-0 bg-gradient-to-br from-[#e6f0ff] to-[#d6e3ff] p-4 rounded-xl shadow-sm"
            >
              <FiShield className="h-8 w-8 text-[#1a3a70]" />
            </motion.div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-[#1b2940] mb-3">Security Notice</h3>
              <div className="text-[#1b2940] space-y-3">
                <p className="font-medium">
                  This system contains information protected under the Official Secrets Act 1923 and IT Act 2000.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All access attempts are logged and monitored 24/7</li>
                  <li>Unauthorized access will result in prosecution</li>
                  <li>You are accountable for all activities under your credentials</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Enhanced Footer (unchanged as requested) */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-[#1b2940] text-[#c9d8ff] py-16 border-t border-[#1a3a70]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 mb-5"
              >
                <img src="/DrdoLogo.png" alt="DRDO Logo" className="h-12 w-12" />
                <span className="text-white font-bold text-lg">DRDO Admin Portal</span>
              </motion.div>
              <p className="text-sm text-[#c9d8ff]/80">
                The official secure administration system for DRDO.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/help" className="hover:text-[#7a9eff] hover:underline flex items-center text-sm">
                    <FiChevronRight className="mr-2 text-xs opacity-70" /> Help Center
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/policy" className="hover:text-[#7a9eff] hover:underline flex items-center text-sm">
                    <FiChevronRight className="mr-2 text-xs opacity-70" /> Security Policy
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/training" className="hover:text-[#7a9eff] hover:underline flex items-center text-sm">
                    <FiChevronRight className="mr-2 text-xs opacity-70" /> Admin Training
                  </Link>
                </motion.li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/docs" className="hover:text-[#7a9eff] hover:underline flex items-center text-sm">
                    <FiChevronRight className="mr-2 text-xs opacity-70" /> Documentation
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/api" className="hover:text-[#7a9eff] hover:underline flex items-center text-sm">
                    <FiChevronRight className="mr-2 text-xs opacity-70" /> API Access
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/reports" className="hover:text-[#7a9eff] hover:underline flex items-center text-sm">
                    <FiChevronRight className="mr-2 text-xs opacity-70" /> Monthly Reports
                  </Link>
                </motion.li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Contact</h4>
              <address className="not-italic text-sm space-y-3">
                <p className="text-[#c9d8ff]/80">DRDO Headquarters, Delhi</p>
                <motion.p whileHover={{ x: 5 }}>
                  <Link to="tel:+911123456789" className="hover:text-[#7a9eff] hover:underline flex items-center">
                    <FiChevronRight className="mr-2 text-xs opacity-70" /> +91 11 2345 6789
                  </Link>
                </motion.p>
                <motion.p whileHover={{ x: 5 }}>
                  <Link to="mailto:admin-support@drdo.in" className="hover:text-[#7a9eff] hover:underline flex items-center">
                    <FiChevronRight className="mr-2 text-xs opacity-70" /> admin-support@drdo.in
                  </Link>
                </motion.p>
              </address>
            </div>
          </div>
          <motion.div 
            whileInView={{ scale: 1 }}
            initial={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-[#1a3a70] text-sm text-center text-[#c9d8ff]/60"
          >
            <p>© {new Date().getFullYear()} DRDO, Ministry Of Defence, India. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}