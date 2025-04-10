export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Don't take our word for it - hear from streamers who've grown with TwitchViewer.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="text-amber-400 flex">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-neutral-600 text-sm">1 month ago</span>
            </div>
            <p className="mt-4 text-neutral-600">
              "Since using TwitchViewer, my channel has grown consistently. I've seen a 200% increase in followers and finally reached affiliate status!"
            </p>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800">Alex Rivera</p>
                <p className="text-xs text-neutral-500">Variety Streamer</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="text-amber-400 flex">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-neutral-600 text-sm">2 weeks ago</span>
            </div>
            <p className="mt-4 text-neutral-600">
              "The analytics are amazing! I can see exactly when my channel gets more attention and plan my streams accordingly. Support team is top-notch too."
            </p>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800">Sarah Chen</p>
                <p className="text-xs text-neutral-500">Gaming Streamer</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center">
              <div className="text-amber-400 flex">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-neutral-600 text-sm">1 month ago</span>
            </div>
            <p className="mt-4 text-neutral-600">
              "I was skeptical at first, but the results speak for themselves. My average viewer count is up and the service is reliable. Highly recommend!"
            </p>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800">Marcus Johnson</p>
                <p className="text-xs text-neutral-500">Speedrunner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
