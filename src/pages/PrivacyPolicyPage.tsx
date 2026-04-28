import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-crimson-900 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="space-y-12">
            {/* Information Collection */}
            <section>
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">Information We Collect</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Name and contact information</li>
                  <li>Account credentials</li>
                  <li>Payment information</li>
                  <li>Preferences and settings</li>
                  <li>Communication history</li>
                </ul>
              </div>
            </section>

            {/* Information Usage */}
            <section>
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">How We Use Your Information</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>We use the collected information for various purposes:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Providing and maintaining our services</li>
                  <li>Processing transactions</li>
                  <li>Sending notifications and updates</li>
                  <li>Improving user experience</li>
                  <li>Analyzing usage patterns</li>
                </ul>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">Data Protection</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>We implement appropriate security measures to protect your personal information:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data storage</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">Your Rights</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request data deletion</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about our Privacy Policy, please contact us at:
              </p>
              <div className="mt-4">
                <p className="text-gray-600">
                  Email: universityleague221@gmail.com
                </p>
                <p className="text-gray-600">
                  Phone: +1 (555) 123-4567
                </p>
              </div>
            </section>

            {/* Last Updated */}
            <div className="text-sm text-gray-500 border-t border-gray-200 pt-6">
              Last updated: March 15, 2024
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 