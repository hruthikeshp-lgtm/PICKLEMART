'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, phone number, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to submit inquiry. Please try again.');
      } else {
        setSuccessMessage('Thank you for writing to Pickle Mart! Grandma’s team will respond to you shortly.');
        setFormData({ name: '', phone: '', email: '', message: '' });
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-pickle-red">
          We&apos;d Love to Hear From You
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-pickle-darkText">
          Contact Pickle Mart
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Have a question about our pickle ingredients, custom bulk orders, or delivery status? Reach out directly to our friendly team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards on Left */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-pickle-darkred to-pickle-red text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-pickle-yellow uppercase tracking-wider">
                Store & Customer Care
              </span>
              <h2 className="font-serif text-2xl font-bold">Pickle Mart Kitchen</h2>
              <p className="text-xs text-pickle-cream/80 italic font-serif">
                &quot;Feel the real taste, made by Grandma.&quot;
              </p>
            </div>

            <div className="space-y-4 text-xs text-pickle-cream/90">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pickle-yellow shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Store & Kitchen Location:</strong>
                  <span className="text-gray-200 leading-relaxed">
                    Pickle Mart Central Store,<br />
                    Main Bazaar Heritage Lane,<br />
                    Andhra Pradesh & Telangana, India
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-pickle-yellow shrink-0" />
                <div>
                  <strong className="text-white block">Phone Support:</strong>
                  <a href="tel:+919876543210" className="hover:text-pickle-yellow">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-pickle-yellow shrink-0" />
                <div>
                  <strong className="text-white block">Email:</strong>
                  <a href="mailto:orders@picklemart.in" className="hover:text-pickle-yellow">
                    orders@picklemart.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-pickle-yellow shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Operating Hours:</strong>
                  <p>Monday - Saturday: 9:00 AM - 8:30 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20Pickle%20Mart!%20I%20have%20an%20inquiry%20regarding%20traditional%20pickles."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form on Right */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pickle-cream space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-serif text-xl font-bold text-pickle-darkText">Send Us a Message</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Leave your feedback, special order requests, or questions below.
            </p>
          </div>

          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Message Sent Successfully!</strong>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Rao"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. ananya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Message / Inquiry <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="How can we help you? (e.g. questions regarding spice level, bulk orders for weddings/events, packaging...)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pickle-red/30"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-pickle-red hover:bg-pickle-darkred text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-colors disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
