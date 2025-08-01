import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiLogIn, 
  FiShield, 
  FiUsers, 
  FiFileText, 
  FiBarChart2, 
  FiSettings, 
  FiAward, 
  FiLock, 
  FiActivity,
  FiChevronRight,
  FiArrowRight
} from 'react-icons/fi';

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
    navigate('/login');
  };

  const features = [
    {
      icon: <FiUsers className="text-blue-400" size={24} />,
      title: "Personnel Management",
      description: "Advanced tools with military-grade security protocols",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FiFileText className="text-amber-400" size={24} />,
      title: "Document Control",
      description: "End-to-end encrypted classified document handling",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <FiBarChart2 className="text-emerald-400" size={24} />,
      title: "Defense Analytics",
      description: "Real-time operational intelligence dashboards",
      color: "from-teal-500 to-emerald-600"
    },
    {
      icon: <FiSettings className="text-indigo-400" size={24} />,
      title: "System Admin",
      description: "Centralized control with granular permissions",
      color: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#e7ecf3] font-sans antialiased overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[url('/drdo-circuit-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b2940]/90 via-[#1b2940]/70 to-[#1b2940]/90"></div>
      </div>

      {/* Security Header */}
      <div className="bg-[#1b2940] text-gray-300 text-sm py-3 px-6 flex justify-between items-center border-b border-[#0a58aa] backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-70 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full">
              <FiLock className="text-blue-200" size={12} />
              <div className="absolute -inset-1 border-2 border-blue-400 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <span className="tracking-wider font-mono">SSPL SECURE ADMIN PORTAL</span>
        </div>
        <div className="font-mono text-xs bg-[#0a58aa]/50 px-3 py-1 rounded-full border border-[#1464c8] flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          {currentDate}
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/bg.png" 
            alt="DRDO Command Center" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1b2940]/90"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Logo and Heading */}
          <div className="inline-flex items-center justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[#00a3db] rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#1b2940] to-[#0a58aa] p-4 rounded-full shadow-2xl border border-[#1464c8] backdrop-blur-sm">
                <img src="/DrdoLogo.png" alt="DRDO Logo" className="h-28 w-28" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00a3db] to-blue-400">SSPL</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Administration</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">Portal</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Next-generation secure administration platform
          </p>
          
          <button
            onClick={handleAdminLogin}
            disabled={isAuthenticating}
            className={`relative flex items-center justify-center py-5 px-14 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-[#0a58aa] to-[#00a3db] hover:from-[#1464c8] hover:to-[#00a3db] shadow-lg transition-all duration-300 mx-auto ${isAuthenticating ? 'opacity-90' : ''}`}
          >
            {isAuthenticating ? 'Loading...' : 'Enter Secure Portal'}
          </button>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-20 bg-[#e7ecf3]"></div>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1b2940] text-center mb-12 relative">
            <span className="relative z-10 px-4 bg-[#e7ecf3] inline-block">Portal Features</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0a58aa] to-transparent -z-0"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 border border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden group"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1b2940] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl overflow-hidden border border-blue-100">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 lg:p-16">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-1 bg-gradient-to-r from-[#0a58aa] to-[#00a3db] mr-4"></div>
                  <span className="text-sm font-semibold tracking-wider text-[#0a58aa] uppercase">Quantum Security</span>
                </div>
                <h2 className="text-4xl font-bold text-[#1b2940] mb-8 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a58aa] to-[#00a3db]">Military-Grade</span> Administration Platform
                </h2>
                <div className="prose text-gray-700 space-y-6">
                  <p>
                    The <strong>SSPL Admin Portal</strong> represents the pinnacle of secure administration technology, 
                    incorporating <strong>quantum-resistant encryption</strong> and <strong>AI-powered anomaly detection</strong> 
                    to protect India's most sensitive defense operations.
                  </p>
                  <p>
                    Developed in collaboration with <strong>DRDO's Cyber Security Group</strong>, this platform exceeds 
                    <strong> ISO 27001</strong> and <strong>NIST SP 800-171</strong> standards, incorporating cutting-edge 
                    technologies like <strong>blockchain audit trails</strong> and <strong>biometric multi-factor authentication</strong>.
                  </p>
                  <p>
                    Our system undergoes <strong>real-time monitoring</strong> by the <strong>Defense Cyber Agency</strong> 
                    and features <strong>self-destruct protocols</strong> for emergency scenarios.
                  </p>
                </div>
              </div>
              <div className="hidden lg:block relative min-h-[600px]">
                <img 
                  src="/admin-about.png" 
                  alt="DRDO Command Center" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b2940]/90 via-[#1b2940]/50 to-transparent flex items-end p-12">
                  <div className="text-white">
                    <div className="flex items-center mb-6">
                      <FiAward className="mr-4 text-blue-400" size={32} />
                      <h3 className="text-3xl font-bold">Certified Excellence</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-[#00a3db]">850+</p>
                        <p className="text-blue-200">Top-Secret Clearances</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00a3db] to-blue-300">52</p>
                        <p className="text-[#00a3db]">Secure Facilities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Badge */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-40">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#1b2940] to-[#0a58aa] rounded-3xl border border-[#1464c8] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500 rounded-full opacity-10"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#00a3db] rounded-full opacity-10"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-[#0a58aa] to-[#00a3db] p-5 rounded-xl shadow-lg mb-6 md:mb-0 md:mr-8">
                  <FiShield className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Ultimate Security Protocol</h3>
                  <div className="prose prose-invert text-blue-100 space-y-4">
                    <p>
                      This system operates under <strong>Section 69 of the Information Technology Act</strong> and 
                      <strong> Official Secrets Act 1923</strong>. All activities are monitored by the 
                      <strong> Defense Cyber Security Establishment</strong> with <strong>quantum encryption</strong> 
                      and <strong>behavioral biometrics</strong>.
                    </p>
                    <p className="font-semibold text-blue-300">
                      Unauthorized access attempts trigger immediate response protocols and will result in prosecution.
                    </p>
                    <p>
                      You are <strong>personally accountable</strong> for all activities under your credentials. 
                      Session recordings are retained for <strong>10 years</strong> in secure archives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#1b2940] border-t border-[#0a58aa] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <img src="/DrdoLogo.png" alt="DRDO Logo" className="h-14 w-14" />
                <span className="text-white font-bold text-xl">Quantum Admin</span>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Next-generation secure administration platform for India's defense research infrastructure.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">System</h4>
              <ul className="space-y-3">
                <li><Link to="/help" className="text-blue-200 hover:text-white hover:underline flex items-center transition"><FiChevronRight className="mr-2" size={14} /> Help Center</Link></li>
                <li><Link to="/policy" className="text-blue-200 hover:text-white hover:underline flex items-center transition"><FiChevronRight className="mr-2" size={14} /> Security Policy</Link></li>
                <li><Link to="/training" className="text-blue-200 hover:text-white hover:underline flex items-center transition"><FiChevronRight className="mr-2" size={14} /> Admin Training</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/docs" className="text-blue-200 hover:text-white hover:underline flex items-center transition"><FiChevronRight className="mr-2" size={14} /> Documentation</Link></li>
                <li><Link to="/api" className="text-blue-200 hover:text-white hover:underline flex items-center transition"><FiChevronRight className="mr-2" size={14} /> API Reference</Link></li>
                <li><Link to="/status" className="text-blue-200 hover:text-white hover:underline flex items-center transition"><FiChevronRight className="mr-2" size={14} /> System Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">Security Contacts</h4>
              <address className="not-italic text-blue-200 space-y-3">
                <div>
                  <p className="text-xs text-blue-300 uppercase mb-1">Headquarters</p>
                  <p>DRDO Bhawan, New Delhi</p>
                </div>
                <div>
                  <p className="text-xs text-blue-300 uppercase mb-1">24/7 Support</p>
                  <p><Link to="tel:+911123456789" className="hover:text-white hover:underline">+91 11 2345 6789</Link></p>
                </div>
                <div>
                  <p className="text-xs text-blue-300 uppercase mb-1">Emergencies</p>
                  <p><Link to="tel:+911198765432" className="hover:text-white hover:underline">+91 11 9876 5432</Link></p>
                </div>
              </address>
            </div>
          </div>
          <div className="pt-8 border-t border-[#0a58aa] text-sm text-center text-blue-300">
            <p>© {new Date().getFullYear()} Defence Research and Development Organisation, Ministry of Defence, Government of India. All rights reserved.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/privacy" className="hover:text-white hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white hover:underline">Terms of Use</Link>
              <Link to="/compliance" className="hover:text-white hover:underline">Compliance</Link>
              <Link to="/sitemap" className="hover:text-white hover:underline">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}