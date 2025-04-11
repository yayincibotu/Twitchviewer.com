import { useEffect, useRef } from "react";

const features = [
  {
    title: "Real Viewers",
    description: "Our system delivers genuine viewers to your streams, improving your ranking in Twitch's recommendation algorithm.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    color: "from-blue-500 to-indigo-500"
  },
  {
    title: "Instant Setup",
    description: "Get started in minutes with our simple configuration. Just enter your channel name and we handle the rest.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Safe & Compliant",
    description: "Our service follows all of Twitch's guidelines to ensure your channel remains in good standing.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "from-green-500 to-teal-500"
  },
  {
    title: "Detailed Analytics",
    description: "Monitor your growth with comprehensive analytics and performance tracking dashboards.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "from-red-500 to-orange-500"
  },
  {
    title: "24/7 Availability",
    description: "Our system runs around the clock, providing continuous support for your streaming schedule.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Expert Support",
    description: "Our team of streaming experts is always ready to help you optimize your channel's performance.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: "from-violet-500 to-purple-500"
  }
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="py-20 bg-white relative overflow-hidden opacity-0"
    >
      {/* Dekoratif arkaplan elementleri */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-50 to-white"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-800 font-heading">
            Why Choose TwitchViewer?
          </h2>
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
            Our platform offers the most reliable and effective way to increase your Twitch channel's visibility.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="feature-card group opacity-0 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-neutral-800 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="mt-3 text-neutral-600">
                {feature.description}
              </p>
              
              <div className="mt-6 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
                <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Trusted by over 5,000 streamers worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
}
