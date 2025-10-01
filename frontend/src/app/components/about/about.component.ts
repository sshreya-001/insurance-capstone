import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-blue-600 to-purple-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
            About Insurance Portal
          </h1>
          <p class="text-xl text-blue-100 leading-relaxed">
            Revolutionizing the insurance industry with cutting-edge technology, 
            exceptional service, and a customer-first approach.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p class="text-lg text-gray-600 leading-relaxed mb-6">
                To make insurance accessible, transparent, and affordable for everyone. 
                We believe that financial security should not be a luxury, but a fundamental right 
                that every individual and family deserves.
              </p>
              <p class="text-lg text-gray-600 leading-relaxed">
                Through innovative technology and personalized service, we're transforming 
                the way people think about and purchase insurance.
              </p>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p class="text-gray-600">
                  To become the leading digital insurance platform that empowers millions 
                  of people to secure their future with confidence and ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p class="text-xl text-gray-600">
              Founded in 2020, Insurance Portal was born out of a simple belief: 
              insurance should be simple, transparent, and accessible to everyone.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">2020</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Founded</h3>
              <p class="text-gray-600">Started with a vision to revolutionize insurance</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">50K+</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Customers</h3>
              <p class="text-gray-600">Trusted by thousands of families</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">₹2.5Cr+</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Claims Paid</h3>
              <p class="text-gray-600">Supporting our customers when they need us most</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p class="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Trust</h3>
              <p class="text-gray-600">Building lasting relationships through transparency and reliability</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p class="text-gray-600">Constantly improving through technology and creativity</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Care</h3>
              <p class="text-gray-600">Putting our customers at the heart of everything we do</p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p class="text-gray-600">Striving for the highest standards in everything we do</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p class="text-xl text-gray-600">
              The passionate professionals behind Insurance Portal
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">AS</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Amit Sharma</h3>
              <p class="text-blue-600 font-medium mb-4">CEO & Founder</p>
              <p class="text-gray-600">15+ years in insurance technology and digital transformation</p>
            </div>

            <div class="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div class="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">PK</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Priya Kumar</h3>
              <p class="text-blue-600 font-medium mb-4">CTO</p>
              <p class="text-gray-600">Expert in cloud architecture and AI-driven solutions</p>
            </div>

            <div class="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div class="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">RJ</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Rajesh Jain</h3>
              <p class="text-blue-600 font-medium mb-4">Head of Customer Success</p>
              <p class="text-gray-600">Dedicated to ensuring exceptional customer experiences</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {}

