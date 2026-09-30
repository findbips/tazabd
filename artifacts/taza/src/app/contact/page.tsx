"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-taza-900">
          Get in Touch
        </h1>
        <p className="text-taza-600 mt-2 max-w-lg mx-auto">
          Have a question about our products, delivery, or partnership?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                detail: "House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh",
              },
              {
                icon: Phone,
                title: "Call Us",
                detail: "+880 1712-345678\n+880 1812-345678",
              },
              {
                icon: Mail,
                title: "Email Us",
                detail: "hello@taza.com.bd\nsupport@taza.com.bd",
              },
              {
                icon: Clock,
                title: "Working Hours",
                detail: "Sat – Thu: 9:00 AM – 8:00 PM\nFriday: Closed",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-taza-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-taza-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-taza-900">{item.title}</h3>
                  <p className="text-sm text-taza-600 mt-0.5 whitespace-pre-line">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-taza-50 rounded-2xl p-6 border border-taza-100">
            <h3 className="font-semibold text-taza-900 mb-2">
              Delivery Coverage
            </h3>
            <p className="text-sm text-taza-600">
              We currently deliver across Dhaka, Chattogram, Rajshahi, Khulna,
              Sylhet, and major district towns. Free delivery on orders over ৳1,000.
              Cash on Delivery available everywhere.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-taza-100 shadow-sm p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-taza-100 flex items-center justify-center">
                <Send className="w-7 h-7 text-taza-600" />
              </div>
              <h3 className="text-xl font-bold text-taza-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-taza-600">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-taza-700 font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-taza-800 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-taza-200 focus:border-taza-500 focus:ring-2 focus:ring-taza-100 outline-none transition-all text-taza-900"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-taza-800 mb-1.5"
                >
                  Email or Phone
                </label>
                <input
                  type="text"
                  id="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-taza-200 focus:border-taza-500 focus:ring-2 focus:ring-taza-100 outline-none transition-all text-taza-900"
                  placeholder="email@example.com or 01XXXXXXXXX"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-taza-800 mb-1.5"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl border border-taza-200 focus:border-taza-500 focus:ring-2 focus:ring-taza-100 outline-none transition-all text-taza-900 bg-white"
                >
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Partnership / Farm</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-taza-800 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-taza-200 focus:border-taza-500 focus:ring-2 focus:ring-taza-100 outline-none transition-all text-taza-900 resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-taza-600 hover:bg-taza-700 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
