export default function FaqSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Find answers to common questions about our service.
          </p>
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto">
          {/* FAQ Item 1 */}
          <div className="border-b border-neutral-200 pb-6 mb-6">
            <h3 className="text-lg font-medium text-neutral-800">Is TwitchViewer safe to use?</h3>
            <p className="mt-2 text-neutral-600">
              Yes, TwitchViewer is designed to be safe and compliant with Twitch's terms of service. We provide real viewer engagement that helps grow your channel naturally.
            </p>
          </div>
          
          {/* FAQ Item 2 */}
          <div className="border-b border-neutral-200 pb-6 mb-6">
            <h3 className="text-lg font-medium text-neutral-800">How quickly will I see results?</h3>
            <p className="mt-2 text-neutral-600">
              Most users see increased viewers within minutes of activating our service. Long-term metrics like follower growth and channel recommendations typically improve within 2-4 weeks of consistent use.
            </p>
          </div>
          
          {/* FAQ Item 3 */}
          <div className="border-b border-neutral-200 pb-6 mb-6">
            <h3 className="text-lg font-medium text-neutral-800">Can I cancel my subscription anytime?</h3>
            <p className="mt-2 text-neutral-600">
              Absolutely! You can cancel your subscription at any time from your account dashboard. There are no long-term contracts or hidden fees.
            </p>
          </div>
          
          {/* FAQ Item 4 */}
          <div className="border-b border-neutral-200 pb-6 mb-6">
            <h3 className="text-lg font-medium text-neutral-800">Will this help me reach Affiliate or Partner status?</h3>
            <p className="mt-2 text-neutral-600">
              TwitchViewer helps you meet the viewer count requirements for both Affiliate and Partner status. Many of our users have successfully achieved these milestones with our help.
            </p>
          </div>
          
          {/* FAQ Item 5 */}
          <div>
            <h3 className="text-lg font-medium text-neutral-800">Do you offer custom solutions for larger channels?</h3>
            <p className="mt-2 text-neutral-600">
              Yes, we offer custom solutions for established streamers and organizations. Please contact our support team to discuss your specific needs and goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
