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

// Professional color system (header/footer: #1b2940)
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
    }, 100);
  };

  const features = [
    {
      icon: <FiUsers className="text-[#4a6fa5]" size={24} />,
      title: "Personnel Management",
      description: "Role-based access control for all DEFENCORE staff with advanced security protocols."
    },
    {
      icon: <FiFileText className="text-[#4a6fa5]" size={24} />,
      title: "Document Control",
      description: "End-to-end encrypted document handling with blockchain-based verification."
    },
    {
      icon: <FiBarChart2 className="text-[#4a6fa5]" size={24} />,
      title: "Advanced Analytics",
      description: "AI-powered dashboards with predictive analytics for strategic decisions."
    },
    {
      icon: <FiDatabase className="text-[#4a6fa5]" size={24} />,
      title: "Data Warehouse",
      description: "Secure centralized repository for all administrative data assets."
    }
  ];

  const securityFeatures = [
    {
      icon: <FiLock size={20} className="text-[#2c5282]" />,
      title: "Military-Grade Encryption",
      description: "256-bit AES encryption for all data transmission and storage"
    },
    {
      icon: <FiMonitor size={20} className="text-[#2c5282]" />,
      title: "Real-time Monitoring",
      description: "24/7 surveillance of all system activities with anomaly detection"
    },
    {
      icon: <FiKey size={20} className="text-[#2c5282]" />,
      title: "Multi-Factor Auth",
      description: "Biometric + OTP + Hardware token authentication"
    },
    {
      icon: <FiClock size={20} className="text-[#2c5282]" />,
      title: "Session Timeout",
      description: "Automatic logout after 15 minutes of inactivity"
    }
  ];

  const stats = [
    { value: "850+", label: "Administrators" },
    { value: "52", label: "DEFENCORE Labs" },
    { value: "99.99%", label: "Uptime" },
    { value: "256-bit", label: "Encryption" }
  ];

  return (
    <div className="min-h-screen bg-[#e7ecf3]">
      {/* Header - Maintained original styling */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-[#1b2940] text-[#c9d8ff] text-sm py-3 px-6 flex justify-between items-center shadow-lg border-b border-[#4a6fa5]"
      >
        <div className="flex items-center space-x-2">
          <FiLock className="text-[#63b3ed] animate-pulse" size={16} />
          <span className="font-mono tracking-wider">DEFENCORE SECURE ADMIN PORTAL - CLASSIFIED ACCESS ONLY</span>
        </div>
        <div className="font-mono text-xs bg-[#1b2940]/80 px-3 py-1 rounded-full border border-[#4a6fa5]">
          {currentDate}
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgwek00MCA0MGgtMjB2LTIwaDIweiIgZmlsbD0iIzFiMjk0MCIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Hero Content */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center lg:text-left lg:w-[55%]"
            >
              <div className="inline-flex items-center justify-center lg:justify-start mb-8">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="bg-white p-4 rounded-full shadow-xl border border-[#e2e8f0]"
                >
                  <img src="/DrdoLogo.png" alt="DEFENCORE Logo" className="h-20 w-20" />
                </motion.div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1b2940] mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1b2940] to-[#4a6fa5]">DefenCore</span>{' '}
                <span className="text-[#2c5282]">Administration</span>
              </h1>
              <p className="text-lg md:text-xl text-[#4a5568] max-w-3xl mx-auto lg:mx-0 leading-relaxed mb-10">
                Secure, efficient management system for DEFENCORE's classified administrative operations with military-grade encryption.
              </p>

              {/* Stats Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto lg:mx-0"
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white p-3 rounded-lg shadow-sm border border-[#e2e8f0]"
                  >
                    <div className="text-xl md:text-2xl font-bold text-[#1b2940]">{stat.value}</div>
                    <div className="text-xs md:text-sm text-[#4a5568]">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Login Card */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-full lg:w-[40%] max-w-md"
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#e2e8f0]">
                <div className="bg-[#1b2940] p-6 text-white border-b border-[#4a6fa5]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center">
                      <FiShield className="mr-3 text-[#63b3ed]" size={20} />
                      Secure Access
                    </h2>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    </div>
                  </div>
                  <p className="text-xs text-[#c9d8ff] mt-2">Classified access for authorized personnel only</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-6">
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
                        className="absolute -inset-2 bg-[#63b3ed]/20 rounded-full blur-md"
                      />
                      <button
                        onClick={handleAdminLogin}
                        disabled={isAuthenticating}
                        className={`relative flex justify-center items-center py-3 px-8 rounded-lg shadow text-base font-semibold text-white bg-[#1b2940] hover:bg-[#2c5282] focus:outline-none focus:ring-2 focus:ring-[#63b3ed] focus:ring-offset-2 transition-all ${isAuthenticating ? 'opacity-90' : ''}`}
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
                            <FiLogIn className="mr-3" size={18} />
                            Proceed to Login
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-center text-xs text-[#718096] space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <FiGlobe className="text-[#2c5282]" size={14} />
                      <span>Restricted to DEFENCORE Intranet Only</span>
                    </div>
                    <Link to="/help" className="text-[#2c5282] hover:text-[#1b2940] inline-flex items-center font-medium text-sm">
                      <FiActivity className="mr-2" size={12} />
                      Need security clearance assistance?
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-10 relative z-20">
        {/* About Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#e2e8f0]">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1b2940] mb-6">
                  About the Admin Portal
                </h2>
                <div className="prose text-[#4a5568]">
                  <p className="text-base md:text-lg">
                    The DefenCore Administration Portal is a secure, centralized platform designed exclusively for authorized 
                    administrative personnel to manage the organization's critical operations with military-grade security protocols.
                  </p>
                  <div className="space-y-3 mt-6">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 bg-[#ebf8ff] p-2 rounded-lg mr-3">
                          {feature.icon}
                        </div>
                        <div>
                          <strong className="text-sm md:text-base text-[#1b2940]">{feature.title}</strong>
                          <p className="text-xs md:text-sm text-[#718096]">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block relative min-h-[350px] bg-gradient-to-br from-[#1b2940] to-[#2c5282]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-[#63b3ed]/20 rounded-full"
                    ></motion.div>
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8 border-4 border-[#63b3ed]/30 rounded-full"
                    ></motion.div>
                    <div className="relative z-10 p-6 text-center">
                      <FiAward className="mx-auto mb-4 text-[#63b3ed]" size={40} />
                      <h3 className="text-xl font-bold text-white mb-2">Trusted by 850+ Security-Cleared Administrators</h3>
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
          className="mb-20 relative"
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-[#1b2940] mb-4"
              >
                Portal Features
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-lg text-[#718096] max-w-3xl mx-auto"
              >
                Advanced tools designed for <span className="font-semibold text-[#1b2940]">secure defense administration</span> workflows
              </motion.p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6, type: 'spring' }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  whileHover={{ y: -5 }}
                  className="relative"
                >
                  <div className="relative h-full bg-white p-6 rounded-lg shadow-md border border-[#e2e8f0] hover:border-[#c9d8ff] transition-all duration-300 overflow-hidden">
                    {/* Animated border */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#1b2940] to-[#4a6fa5]"
                    />
                    
                    {/* Icon container */}
                    <div className="mb-6 relative">
                      <div className="w-14 h-14 rounded-lg bg-[#ebf8ff] shadow-inner flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-bold text-[#1b2940] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#718096] mb-4">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-16 flex justify-center"
            >
              <div className="inline-flex items-center bg-[#ebf8ff] px-5 py-2 rounded-full border border-[#bee3f8] shadow-sm">
                <FiShield className="text-[#1b2940] mr-2" size={18} />
                <span className="font-medium text-[#1b2940] text-sm">ISO 27001 Certified Security</span>
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
          className="bg-[#ebf8ff] border border-[#bee3f8] rounded-xl p-6 max-w-4xl mx-auto shadow-sm"
        >
          <div className="flex flex-col sm:flex-row">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 3 }}
              className="flex-shrink-0 bg-[#1b2940] p-3 rounded-lg shadow-sm mb-4 sm:mb-0 sm:mr-6 self-start"
            >
              <FiShield className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-[#1b2940] mb-3">Security Notice</h3>
              <div className="text-[#1b2940] space-y-3">
                <p className="font-medium text-sm">
                  This system contains information protected under the Official Secrets Act 1923 and IT Act 2000.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>All access attempts are logged and monitored 24/7</li>
                  <li>Unauthorized access will result in prosecution</li>
                  <li>You are accountable for all activities under your credentials</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer - Maintained original styling */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-[#1b2940] text-[#c9d8ff] py-12 border-t border-[#4a6fa5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 mb-4"
              >
                <img src="/DrdoLogo.png" alt="DEFENCORE Logo" className="h-10 w-10" />
                <span className="text-white font-bold text-base">DEFENCORE Admin Portal</span>
              </motion.div>
              <p className="text-xs text-[#c9d8ff]/80">
                The official secure administration system for DefenCore.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/help" className="hover:text-[#63b3ed] hover:underline flex items-center text-xs">
                    <FiChevronRight className="mr-1 text-xs opacity-70" /> Help Center
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/policy" className="hover:text-[#63b3ed] hover:underline flex items-center text-xs">
                    <FiChevronRight className="mr-1 text-xs opacity-70" /> Security Policy
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/training" className="hover:text-[#63b3ed] hover:underline flex items-center text-xs">
                    <FiChevronRight className="mr-1 text-xs opacity-70" /> Admin Training
                  </Link>
                </motion.li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/docs" className="hover:text-[#63b3ed] hover:underline flex items-center text-xs">
                    <FiChevronRight className="mr-1 text-xs opacity-70" /> Documentation
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/api" className="hover:text-[#63b3ed] hover:underline flex items-center text-xs">
                    <FiChevronRight className="mr-1 text-xs opacity-70" /> API Access
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/reports" className="hover:text-[#63b3ed] hover:underline flex items-center text-xs">
                    <FiChevronRight className="mr-1 text-xs opacity-70" /> Monthly Reports
                  </Link>
                </motion.li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Contact</h4>
              <address className="not-italic text-xs space-y-2">
                <p className="text-[#c9d8ff]/80">DEFENCORE Headquarters, Delhi</p>
                <motion.p whileHover={{ x: 5 }}>
                  <Link to="tel:+911123456789" className="hover:text-[#63b3ed] hover:underline flex items-center">
                    <FiChevronRight className="mr-1 text-xs opacity-70" /> +91 11 2345 6789
                  </Link>
                </motion.p>
                <motion.p whileHover={{ x: 5 }}>
                  <Link to="mailto:admin-support@defeno.in" className="hover:text-[#63b3ed] hover:underline flex items-center">
                    <FiChevronRight className="mr-1 text-xs opacity-70" /> admin-support@defenco.in
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
            className="mt-12 pt-6 border-t border-[#4a6fa5] text-xs text-center text-[#c9d8ff]/60"
          >
            <p>© {new Date().getFullYear()} DefenCore, Ministry of Defence, Government of India. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}