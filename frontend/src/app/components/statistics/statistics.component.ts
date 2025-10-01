import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-green-600 to-blue-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Impact in Numbers
          </h1>
          <p class="text-xl text-green-100 leading-relaxed">
            Discover how we're transforming the insurance landscape and making a real difference 
            in people's lives through data-driven insights and exceptional service.
          </p>
        </div>
      </div>
    </section>

    <!-- Key Metrics -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Key Performance Metrics</h2>
            <p class="text-xl text-gray-600">
              Real-time data showcasing our growth and impact
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Total Customers -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div class="text-gray-600 font-medium">Happy Customers</div>
              <div class="text-sm text-gray-500 mt-2">Growing by 15% monthly</div>
            </div>

            <!-- Policies Sold -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="text-4xl font-bold text-green-600 mb-2">75,000+</div>
              <div class="text-gray-600 font-medium">Policies Sold</div>
              <div class="text-sm text-gray-500 mt-2">Across all categories</div>
            </div>

            <!-- Claims Processed -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="text-4xl font-bold text-purple-600 mb-2">₹2.5Cr+</div>
              <div class="text-gray-600 font-medium">Claims Processed</div>
              <div class="text-sm text-gray-500 mt-2">This year alone</div>
            </div>

            <!-- Customer Satisfaction -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <div class="text-4xl font-bold text-orange-600 mb-2">4.8/5</div>
              <div class="text-gray-600 font-medium">Customer Rating</div>
              <div class="text-sm text-gray-500 mt-2">Based on 10,000+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Growth Analytics -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Growth Analytics</h2>
            <p class="text-xl text-gray-600">
              Our journey of continuous growth and improvement
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Monthly Growth -->
            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Monthly Growth Rate</h3>
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">New Customers</span>
                  <div class="flex items-center">
                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-4">
                      <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                    </div>
                    <span class="text-green-600 font-semibold">+15%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Policy Sales</span>
                  <div class="flex items-center">
                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-4">
                      <div class="bg-blue-500 h-2 rounded-full" style="width: 78%"></div>
                    </div>
                    <span class="text-blue-600 font-semibold">+12%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Revenue Growth</span>
                  <div class="flex items-center">
                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-4">
                      <div class="bg-purple-500 h-2 rounded-full" style="width: 92%"></div>
                    </div>
                    <span class="text-purple-600 font-semibold">+18%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Claims Processed</span>
                  <div class="flex items-center">
                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-4">
                      <div class="bg-orange-500 h-2 rounded-full" style="width: 88%"></div>
                    </div>
                    <span class="text-orange-600 font-semibold">+22%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Policy Distribution -->
            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Policy Distribution</h3>
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span class="text-gray-600">Life Insurance</span>
                  </div>
                  <span class="font-semibold text-gray-900">35%</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span class="text-gray-600">Health Insurance</span>
                  </div>
                  <span class="font-semibold text-gray-900">28%</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                    <span class="text-gray-600">Auto Insurance</span>
                  </div>
                  <span class="font-semibold text-gray-900">20%</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                    <span class="text-gray-600">Home Insurance</span>
                  </div>
                  <span class="font-semibold text-gray-900">12%</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-teal-500 rounded mr-3"></div>
                    <span class="text-gray-600">Other</span>
                  </div>
                  <span class="font-semibold text-gray-900">5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Performance Metrics -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
            <p class="text-xl text-gray-600">
              Key indicators of our operational excellence
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Claim Settlement Time -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Average Claim Settlement</h3>
              <div class="text-3xl font-bold text-green-600 mb-2">2.3 Days</div>
              <p class="text-gray-600">Industry average: 15 days</p>
            </div>

            <!-- Customer Support Response -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Support Response Time</h3>
              <div class="text-3xl font-bold text-blue-600 mb-2">1.2 Minutes</div>
              <p class="text-gray-600">24/7 customer support</p>
            </div>

            <!-- System Uptime -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
              <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">System Uptime</h3>
              <div class="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <p class="text-gray-600">Last 12 months</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Awards & Recognition -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Awards & Recognition</h2>
            <p class="text-xl text-gray-600">
              Industry recognition for our excellence and innovation
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div class="text-4xl mb-4">🏆</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Best InsurTech 2024</h3>
              <p class="text-gray-600 text-sm">Insurance Innovation Awards</p>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div class="text-4xl mb-4">⭐</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Customer Choice Award</h3>
              <p class="text-gray-600 text-sm">Financial Services Excellence</p>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div class="text-4xl mb-4">🚀</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Innovation Leader</h3>
              <p class="text-gray-600 text-sm">Digital Insurance Summit</p>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div class="text-4xl mb-4">💎</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Trusted Brand</h3>
              <p class="text-gray-600 text-sm">Consumer Trust Index</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class StatisticsComponent {}

