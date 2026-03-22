import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Navigation groups
  const footerLinks = {
    shop: {
      title: 'Shop',
      links: [
        { name: 'Laptops', href: '/category/laptops' },
        { name: 'Smartphones', href: '/category/smartphones' },
        { name: 'Audio', href: '/category/audio' },
        { name: 'Wearables', href: '/category/wearables' },
        { name: 'Accessories', href: '/category/accessories' }
      ]
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Journal', href: '/journal' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Sustainability', href: '/sustainability' }
      ]
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Contact', href: '/contact' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Warranty', href: '/warranty' }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Cookies', href: '/cookies' },
        { name: 'Accessibility', href: '/accessibility' }
      ]
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' }
  ];

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      color: "#000000",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      color: "#000000",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const newsletterVariants = {
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    focus: {
      borderColor: "#000000",
      transition: {
        duration: 0.2
      }
    }
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
    // Show success message (có thể thêm toast notification sau)
  };

  return (
    <motion.footer
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="bg-white border-t border-black/5 relative overflow-hidden"
    >
      {/* Subtle geometric pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <Link to="/" className="inline-block mb-6">
              <motion.span 
                className="text-2xl font-light tracking-[-0.02em] text-black block"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                G2<span className="text-black/60">Tech</span>
              </motion.span>
            </Link>
            
            <p className="text-sm text-black/50 leading-relaxed mb-6 font-light">
              Technology reimagined through the lens of timeless design. 
              Established for those who appreciate the finer details.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <motion.div 
                className="flex items-center gap-3 text-sm text-black/60"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-light">123 Design District, San Francisco</span>
              </motion.div>
              
              <motion.a 
                href="tel:+1234567890"
                className="flex items-center gap-3 text-sm text-black/60 hover:text-black transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Phone className="h-4 w-4" />
                <span className="font-light">+1 (234) 567-890</span>
              </motion.a>
              
              <motion.a 
                href="mailto:hello@g2.tech"
                className="flex items-center gap-3 text-sm text-black/60 hover:text-black transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Mail className="h-4 w-4" />
                <span className="font-light">hello@g2.tech</span>
              </motion.a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="text-black/40 hover:text-black transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, group]) => (
            <motion.div 
              key={key}
              variants={itemVariants}
              className="lg:col-span-1"
            >
              <h4 className="text-xs text-black/40 tracking-[0.2em] uppercase mb-6">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                    custom={index}
                  >
                    <Link
                      to={link.href}
                      className="text-sm text-black/60 hover:text-black transition-colors font-light inline-flex items-center group"
                    >
                      {link.name}
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all group-hover:ml-2" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-black/5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-sm font-light text-black mb-2">
                Subscribe to our newsletter
              </h4>
              <p className="text-xs text-black/40 font-light">
                Receive curated updates on new collections and exclusive offers.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-3">
              <motion.div 
                className="flex-1 relative"
                variants={newsletterVariants}
                whileHover="hover"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-black/10 focus:border-black outline-none text-black placeholder-black/30 text-sm font-light transition-colors"
                  required
                />
                <motion.span 
                  className="absolute bottom-0 left-0 h-px bg-black"
                  variants={underlineVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
              </motion.div>
              
              <motion.button
                type="submit"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-black text-white text-sm font-light hover:bg-black/90 transition-colors flex items-center gap-2 group"
              >
                Subscribe
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-6 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-black/40 font-light">
            © {currentYear} G2 Tech. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-black/40 hover:text-black transition-colors font-light">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-black/40 hover:text-black transition-colors font-light">
              Terms
            </Link>
            <Link to="/cookies" className="text-xs text-black/40 hover:text-black transition-colors font-light">
              Cookies
            </Link>
            <Link to="/sitemap" className="text-xs text-black/40 hover:text-black transition-colors font-light">
              Sitemap
            </Link>
          </div>

          {/* Payment Icons (optional) */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-black/20">Visa</span>
            <span className="text-xs text-black/20">Mastercard</span>
            <span className="text-xs text-black/20">PayPal</span>
            <span className="text-xs text-black/20">Apple Pay</span>
          </div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-8 right-8 w-10 h-10 border border-black/10 rounded-sm flex items-center justify-center text-black/40 hover:text-black hover:border-black/30 transition-all group"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <ArrowRight className="h-4 w-4 -rotate-90 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      </div>
    </motion.footer>
  );
};

export default Footer;