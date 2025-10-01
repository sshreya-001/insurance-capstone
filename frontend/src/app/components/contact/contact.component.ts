import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p class="text-xl text-indigo-100 leading-relaxed">
            We're here to help! Reach out to us for any questions, support, or inquiries. 
            Our team is ready to assist you 24/7.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Contact Form -->
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" id="firstName" name="firstName" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" name="lastName" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                  </div>
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="email" name="email" 
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" id="phone" name="phone" 
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                </div>
                <div>
                  <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select id="subject" name="subject" 
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="policy">Policy Information</option>
                    <option value="claim">Claim Support</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea id="message" name="message" rows="5" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Tell us how we can help you..."></textarea>
                </div>
                <button type="submit" 
                        class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Send Message
                </button>
              </form>
            </div>

            <!-- Contact Details -->
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div class="space-y-8">
                <!-- Phone -->
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Phone</h3>
                    <p class="text-gray-600">+91 98765 43210</p>
                    <p class="text-gray-600">+91 11 2345 6789</p>
                    <p class="text-sm text-gray-500">24/7 Customer Support</p>
                  </div>
                </div>

                <!-- Email -->
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Email</h3>
                    <p class="text-gray-600">support&#64;insuranceportal.com</p>
                    <p class="text-gray-600">info&#64;insuranceportal.com</p>
                    <p class="text-sm text-gray-500">We'll respond within 2 hours</p>
                  </div>
                </div>

                <!-- Address -->
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Office Address</h3>
                    <p class="text-gray-600">Insurance Portal Pvt. Ltd.</p>
                    <p class="text-gray-600">123 Business Park, Sector 18</p>
                    <p class="text-gray-600">Gurgaon, Haryana 122015</p>
                    <p class="text-gray-600">India</p>
                  </div>
                </div>

                <!-- Business Hours -->
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Business Hours</h3>
                    <p class="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p class="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p class="text-gray-600">Sunday: Closed</p>
                    <p class="text-sm text-gray-500">Emergency support available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p class="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">How do I file a claim?</h3>
              <p class="text-gray-600">You can file a claim through our online portal, mobile app, or by calling our 24/7 helpline. The process is simple and takes just a few minutes.</p>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">What documents do I need for a claim?</h3>
              <p class="text-gray-600">Required documents vary by policy type, but typically include: claim form, medical reports (for health claims), police report (for auto claims), and policy documents.</p>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">How long does claim processing take?</h3>
              <p class="text-gray-600">Most claims are processed within 2-3 business days. Simple claims can be approved instantly, while complex cases may take up to 7 days.</p>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Can I modify my policy after purchase?</h3>
              <p class="text-gray-600">Yes, you can modify your policy through your online account. Changes include updating personal information, adding riders, or adjusting coverage amounts.</p>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p class="text-gray-600">We accept all major credit/debit cards, net banking, UPI, digital wallets, and EMI options. You can also set up automatic payments for convenience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p class="text-xl text-indigo-100 mb-8">
            Our customer support team is here to help you 24/7. 
            Don't hesitate to reach out!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+919876543210" 
               class="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl">
              Call Now
            </a>
            <a href="mailto:support&#64;insuranceportal.com" 
               class="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {}
