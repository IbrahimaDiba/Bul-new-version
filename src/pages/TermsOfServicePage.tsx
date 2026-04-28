import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, BookOpen, Users } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
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
              Terms of Service
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Please read these terms carefully before using our services.
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
            {/* Agreement */}
            <section>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">Agreement to Terms</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>
                  By accessing or using the Basketball University League website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">User Responsibilities</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>As a user of our services, you agree to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Respect the rights of other users</li>
                  <li>Use the services for lawful purposes only</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">Intellectual Property</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>
                  The Basketball University League and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">Prohibited Activities</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>You may not:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Use our services for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access</li>
                  <li>Interfere with the proper functioning of the services</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-crimson-500 mr-3" />
                <h2 className="text-2xl font-bold text-navy-900">Limitation of Liability</h2>
              </div>
              <div className="prose prose-lg text-gray-600">
                <p>
                  In no event shall the Basketball University League be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at:
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

export default TermsOfServicePage; 