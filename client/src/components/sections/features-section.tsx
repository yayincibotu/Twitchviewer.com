export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
            Why Choose TwitchViewer?
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Our platform offers the most reliable and effective way to increase your Twitch channel's visibility.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary/30 transition-colors duration-300 hover:shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Real Viewers</h3>
            <p className="mt-2 text-neutral-600">
              Our system delivers genuine viewers to your streams, improving your ranking in Twitch's recommendation algorithm.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary/30 transition-colors duration-300 hover:shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Instant Setup</h3>
            <p className="mt-2 text-neutral-600">
              Get started in minutes with our simple configuration. Just enter your channel name and we handle the rest.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary/30 transition-colors duration-300 hover:shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Safe & Compliant</h3>
            <p className="mt-2 text-neutral-600">
              Our service follows all of Twitch's guidelines to ensure your channel remains in good standing.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary/30 transition-colors duration-300 hover:shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Detailed Analytics</h3>
            <p className="mt-2 text-neutral-600">
              Monitor your growth with comprehensive analytics and performance tracking dashboards.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary/30 transition-colors duration-300 hover:shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-800">24/7 Availability</h3>
            <p className="mt-2 text-neutral-600">
              Our system runs around the clock, providing continuous support for your streaming schedule.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary/30 transition-colors duration-300 hover:shadow-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Expert Support</h3>
            <p className="mt-2 text-neutral-600">
              Our team of streaming experts is always ready to help you optimize your channel's performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
