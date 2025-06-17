// app/about/page.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Noise Map | Our Mission to Create Quieter Cities",
  description:
    "Learn about Noise Map's mission to help communities map urban soundscapes and find peaceful paths through the city.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
            >
              Noise Map
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/map"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Open Map
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Noise Map
          </h1>
          <p className="text-xl text-gray-600">
            Empowering communities to create quieter, more livable cities
            through crowdsourced noise data.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Mission
          </h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-600 leading-relaxed">
              We believe everyone deserves peaceful spaces in their urban
              environment. Noise Map empowers communities to collectively map
              and navigate around noise pollution, creating a more livable city
              for all.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              By combining real-time data from thousands of users, we&apos;re
              building the world&apos;s most comprehensive urban noise
              database—helping individuals find quiet moments and helping cities
              make informed decisions about noise management.
            </p>
          </div>
        </div>
      </section>

      {/* How It Started */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Started
          </h2>
          <div className="bg-blue-50 rounded-2xl p-8">
            <p className="text-gray-700 leading-relaxed">
              Noise Map was born from a simple observation: in our increasingly
              urbanized world, finding quiet spaces has become a luxury. What
              started as a personal project to find peaceful walking routes has
              grown into a community-driven platform helping thousands navigate
              their cities more peacefully.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We realized that while individual experiences with noise vary,
              collectively we could create something powerful—a real-time map of
              urban soundscapes that benefits everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Noise Reports</div>
              <p className="text-sm text-gray-500 mt-2">
                Collected from communities worldwide
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">100+</div>
              <div className="text-gray-600">Cities Mapped</div>
              <p className="text-sm text-gray-500 mt-2">
                Growing coverage every day
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Real-time Data</div>
              <p className="text-sm text-gray-500 mt-2">
                Always current, always accurate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Community First</h3>
              <p className="text-gray-600">
                Every data point comes from real people experiencing their city.
                We&apos;re building this together.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Privacy Focused</h3>
              <p className="text-gray-600">
                Your data is yours. We never share personal information and all
                reports are anonymized.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Open Access</h3>
              <p className="text-gray-600">
                Basic noise mapping is free for everyone. We believe in
                democratizing urban data.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                Scientific Accuracy
              </h3>
              <p className="text-gray-600">
                We use calibrated measurements and validated methodologies to
                ensure data reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Us in Creating Quieter Cities
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Every report helps build a more peaceful urban environment for
            everyone.
          </p>
          <Link
            href="/map"
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            Start Mapping
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Noise Map</h4>
              <p className="text-sm">Find your quiet in the city</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/map" className="hover:text-white">
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link href="/quiet-routes" className="hover:text-white">
                    Quiet Routes
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-white">
                    Report Noise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:admin@noisemap.xyz"
                    className="hover:text-white"
                  >
                    admin@noisemap.xyz
                  </a>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2024 Noise Map. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
