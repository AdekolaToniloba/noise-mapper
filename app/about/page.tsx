// app/about/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AboutPage() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Data arrays
  const impactStats = [
    {
      value: "50K+",
      label: "Noise Reports",
      description: "Collected from communities worldwide",
      color: "blue",
    },
    {
      value: "100+",
      label: "Cities Mapped",
      description: "Growing coverage every day",
      color: "teal",
    },
    {
      value: "24/7",
      label: "Real-time Data",
      description: "Always current, always accurate",
      color: "purple",
    },
  ];

  const values = [
    {
      title: "Community First",
      description:
        "Every data point comes from real people experiencing their city. We're building this together.",
    },
    {
      title: "Privacy Focused",
      description:
        "Your data is yours. We never share personal information and all reports are anonymized.",
    },
    {
      title: "Open Access",
      description:
        "Basic noise mapping is free for everyone. We believe in democratizing urban data.",
    },
    {
      title: "Scientific Accuracy",
      description:
        "We use calibrated measurements and validated methodologies to ensure data reliability.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
              >
                Noise Map
              </Link>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/map"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Open Map
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 overflow-hidden">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            About Noise Map
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Empowering communities to create quieter, more livable cities
            through crowdsourced noise data.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <motion.div
          className="max-w-4xl mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Mission
          </motion.h2>
          <div className="prose prose-lg mx-auto">
            <motion.p
              className="text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              We believe everyone deserves peaceful spaces in their urban
              environment. Noise Map empowers communities to collectively map
              and navigate around noise pollution, creating a more livable city
              for all.
            </motion.p>
            <motion.p
              className="text-gray-600 leading-relaxed mt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              By combining real-time data from thousands of users, we&apos;re
              building the world&apos;s most comprehensive urban noise
              database—helping individuals find quiet moments and helping cities
              make informed decisions about noise management.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* How It Started */}
      <section className="py-16">
        <motion.div
          className="max-w-4xl mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Started
          </motion.h2>
          <motion.div
            className="bg-blue-50 rounded-2xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.p
              className="text-gray-700 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Noise Map was born from a simple observation: in our increasingly
              urbanized world, finding quiet spaces has become a luxury. What
              started as a personal project to find peaceful walking routes has
              grown into a community-driven platform helping thousands navigate
              their cities more peacefully.
            </motion.p>
            <motion.p
              className="text-gray-700 leading-relaxed mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              We realized that while individual experiences with noise vary,
              collectively we could create something powerful—a real-time map of
              urban soundscapes that benefits everyone.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Impact
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeIn}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className={`text-4xl font-bold text-${stat.color}-600 mb-2`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: index * 0.1,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
                <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Values
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-6 cursor-pointer"
                variants={fadeIn}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  borderColor: "#3b82f6",
                }}
                onHoverStart={() => setHoveredValue(index)}
                onHoverEnd={() => setHoveredValue(null)}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.h3
                  className="text-xl font-semibold mb-3"
                  animate={{
                    color: hoveredValue === index ? "#2563eb" : "#111827",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {value.title}
                </motion.h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 overflow-hidden">
        <motion.div
          className="max-w-4xl mx-auto text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Join Us in Creating Quieter Cities
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Every report helps build a more peaceful urban environment for
            everyone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/map"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              Start Mapping
              <motion.svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-gray-300 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn}>
              <h4 className="text-white font-semibold mb-4">Noise Map</h4>
              <p className="text-sm">Find your quiet in the city</p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <h5 className="text-white font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/map"
                    className="hover:text-white transition-colors"
                  >
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quiet-routes"
                    className="hover:text-white transition-colors"
                  >
                    Quiet Routes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/map"
                    className="hover:text-white transition-colors"
                  >
                    Report Noise
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={fadeIn}>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={fadeIn}>
              <h5 className="text-white font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:admin@noisemap.xyz"
                    className="hover:text-white transition-colors"
                  >
                    admin@noisemap.xyz
                  </a>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-8 pt-8 border-t border-gray-800 text-center text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p>&copy; 2024 Noise Map. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
