import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-contact',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Contact',
  icon: '📧',
  path: '/embed/contact',
  title: 'Contact Widget Demo',
  description: 'Contact form with embedded support chat',
  parentId: 'embeddable_mode'
}

const pricingTiers = [
  {
    id: 'tier-hobby',
    name: 'Hobby',
    featured: false,
    monthlyPrice: 19,
    yearlyPrice: 199,
    description: 'The essentials to provide your best work for clients.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics']
  },
  {
    id: 'tier-freelancer',
    name: 'Freelancer',
    featured: false,
    monthlyPrice: 29,
    yearlyPrice: 299,
    description: 'The essentials to provide your best work for clients.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time']
  },
  {
    id: 'tier-startup',
    name: 'Startup',
    featured: true,
    monthlyPrice: 59,
    yearlyPrice: 599,
    description: 'A plan that scales with your rapidly growing business.',
    features: ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time', 'Marketing automations']
  },
  {
    id: 'tier-enterprise',
    name: 'Enterprise',
    featured: false,
    monthlyPrice: 99,
    yearlyPrice: 999,
    description: 'Dedicated support and infrastructure for your company.',
    features: ['Unlimited products', 'Unlimited subscribers', 'Advanced analytics', '1-hour, dedicated support response time', 'Marketing automations', 'Custom reporting tools']
  }
]

const faqs = [
  { question: "What's the best thing about Switzerland?", answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat." },
  { question: "How do you make holy water?", answer: "You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam aut tempora vitae odio inventore fuga aliquam nostrum quod porro. Delectus quia facere id sequi expedita natus." },
  { question: "What do you call someone with no body and no nose?", answer: "Nobody knows. Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptas ipsa quia excepturi, quibusdam natus exercitationem sapiente tempore labore voluptatem." },
  { question: "Why do you never see elephants hiding in trees?", answer: "Because they're so good at it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat." },
  { question: "Why can't you hear a pterodactyl go to the bathroom?", answer: "Because the pee is silent. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam, quas voluptatibus ex culpa ipsum, aspernatur blanditiis fugiat ullam magnam suscipit deserunt illum natus facilis atque vero consequatur! Quisquam, debitis error." },
  { question: "Why did the invisible man turn down the job offer?", answer: "He couldn't see himself doing it. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet perspiciatis officiis corrupti tenetur. Temporibus ut voluptatibus, perferendis sed unde rerum deserunt eius." }
]

export default function Contact() {
  const [frequency, setFrequency] = useState<'monthly' | 'annually'>('monthly')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showStart, setShowStart] = useState(true)
  const [showWidget, setShowWidget] = useState(false)
  const [showForm, setShowForm] = useState(true)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    window.zEMessenger = { autorender: false }

    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  const handleGetSupport = () => {
    setShowStart(false)
  }

  const handleChat = () => {
    setShowWidget(true)
    setShowForm(false)
    setTimeout(() => {
      if (window.zE) {
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: {
            targetElement: '#widget',
          }
        })
        window.zE('messenger', 'open')
      }
    }, 100)
  }

  return (
    <>
      <div className="fixed top-0 w-full flex h-16 justify-start items-center gap-x-6 bg-matcha px-6 py-2.5 z-50">
        <p className="text-sm text-licorice dark:text-white">
          Click get support and discover the embedded chat
        </p>
        <a
          href="https://internalnote.com/embeddable-zendesk-widget?utm_source=demo_pages"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-licorice px-3.5 py-1 text-sm font-semibold text-white shadow-xs"
        >
          View article <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="pt-16 w-full bg-white dark:bg-gray-900">
        {/* Header */}
        <header>
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=600" alt="" className="h-8 w-auto dark:hidden" />
                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=500" alt="" className="h-8 w-auto hidden dark:block" />
              </a>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              <a href="#" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600">Product</a>
              <a href="#" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600">Features</a>
              <a href="#" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600">Marketplace</a>
              <a href="#" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600">Company</a>
              <button onClick={handleGetSupport} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer">
                Get support
              </button>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <a href="#" className="text-sm font-semibold text-gray-900 dark:text-white">
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </nav>
        </header>

        {showStart && (
          <main>
            {/* Pricing section */}
            <section className="bg-white pt-24 sm:pt-32 dark:bg-gray-900">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                  <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400">Pricing</h2>
                  <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                    Pricing that grows with you
                  </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 sm:text-xl dark:text-gray-400">
                  Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
                </p>
                <div className="mt-16 flex justify-center">
                  <fieldset>
                    <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold ring-1 ring-inset ring-gray-200 dark:ring-white/10">
                      <label className={`rounded-full px-2.5 py-1 cursor-pointer ${frequency === 'monthly' ? 'bg-blue-600 text-white dark:bg-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        <input
                          type="radio"
                          name="frequency"
                          value="monthly"
                          checked={frequency === 'monthly'}
                          onChange={() => setFrequency('monthly')}
                          className="sr-only"
                        />
                        <span>Monthly</span>
                      </label>
                      <label className={`rounded-full px-2.5 py-1 cursor-pointer ${frequency === 'annually' ? 'bg-blue-600 text-white dark:bg-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        <input
                          type="radio"
                          name="frequency"
                          value="annually"
                          checked={frequency === 'annually'}
                          onChange={() => setFrequency('annually')}
                          className="sr-only"
                        />
                        <span>Annually</span>
                      </label>
                    </div>
                  </fieldset>
                </div>
                <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
                  {pricingTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`rounded-3xl p-8 ring-1 ${tier.featured ? 'ring-2 ring-blue-600 dark:ring-blue-400' : 'ring-gray-200 dark:ring-white/15'} dark:bg-gray-800/50`}
                    >
                      <div className="flex items-center justify-between gap-x-4">
                        <h3 className={`text-lg font-semibold ${tier.featured ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                          {tier.name}
                        </h3>
                        {tier.featured && (
                          <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500 dark:text-white">
                            Most popular
                          </p>
                        )}
                      </div>
                      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{tier.description}</p>
                      <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                          ${frequency === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                        </span>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          /{frequency === 'monthly' ? 'month' : 'year'}
                        </span>
                      </p>
                      <a
                        href="#"
                        className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold ${
                          tier.featured
                            ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400'
                            : 'text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300 dark:bg-white/10 dark:text-white dark:ring-white/5 dark:hover:bg-white/20'
                        }`}
                      >
                        Buy plan
                      </a>
                      <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex gap-x-3">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400">
                              <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" fillRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Logo cloud */}
            <div className="mx-auto mt-24 max-w-7xl px-6 sm:mt-32 lg:px-8">
              <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg" alt="Transistor" className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:hidden" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-white.svg" alt="Transistor" className="col-span-2 max-h-12 w-full object-contain hidden dark:block lg:col-span-1" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg" alt="Reform" className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:hidden" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-white.svg" alt="Reform" className="col-span-2 max-h-12 w-full object-contain hidden dark:block lg:col-span-1" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg" alt="Tuple" className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:hidden" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-white.svg" alt="Tuple" className="col-span-2 max-h-12 w-full object-contain hidden dark:block lg:col-span-1" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-gray-900.svg" alt="SavvyCal" className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1 dark:hidden" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-white.svg" alt="SavvyCal" className="col-span-2 max-h-12 w-full object-contain hidden dark:block sm:col-start-2 lg:col-span-1" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg" alt="Statamic" className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1 dark:hidden" />
                <img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-white.svg" alt="Statamic" className="col-span-2 col-start-2 max-h-12 w-full object-contain hidden dark:block sm:col-start-auto lg:col-span-1" />
              </div>
              <div className="mt-16 flex justify-center">
                <p className="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm text-gray-600 ring-1 ring-inset ring-gray-900/5 dark:bg-gray-800/75 dark:text-gray-400 dark:ring-white/10">
                  <span className="hidden md:inline">Transistor saves up to $40,000 per year, per employee by working with us.</span>
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    <span className="absolute inset-0"></span> See our case study <span aria-hidden="true">&rarr;</span>
                  </a>
                </p>
              </div>
            </div>

            {/* Testimonial section */}
            <div className="mx-auto mt-24 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden bg-gray-900 px-6 py-20 shadow-xl sm:rounded-3xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
                <img src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80" alt="" className="absolute inset-0 size-full object-cover brightness-150 saturate-0" />
                <div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply"></div>
                <div className="relative mx-auto max-w-2xl lg:mx-0">
                  <img src="https://tailwindcss.com/plus-assets/img/logos/workcation-logo-white.svg" alt="" className="h-12 w-auto" />
                  <figure>
                    <blockquote className="mt-6 text-lg font-semibold text-white sm:text-xl">
                      <p>"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis."</p>
                    </blockquote>
                    <figcaption className="mt-6 text-base text-white">
                      <div className="font-semibold">Judith Black</div>
                      <div className="mt-1">CEO of Workcation</div>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>

            {/* FAQ section */}
            <div className="mx-auto mt-24 max-w-7xl px-6 sm:mt-56 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                  Frequently asked questions
                </h2>
                <dl className="mt-16 divide-y divide-gray-900/10 dark:divide-white/10">
                  {faqs.map((faq, index) => (
                    <div key={index} className="py-6">
                      <dt>
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white"
                        >
                          <span className="text-base font-semibold">{faq.question}</span>
                          <span className="ml-6 flex h-7 items-center">
                            {expandedFaq === index ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                                <path d="M18 12H6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                                <path d="M12 6v12m6-6H6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        </button>
                      </dt>
                      {expandedFaq === index && (
                        <dd className="mt-2 pr-12">
                          <p className="text-base text-gray-600 dark:text-gray-400">{faq.answer}</p>
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </main>
        )}

        {/* Contact section */}
        {!showStart && (
          <div className="relative isolate bg-white dark:bg-gray-900">
            <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
              <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
                <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                  <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 border-t border-r border-gray-900/10 lg:w-1/2 dark:bg-gray-900 dark:border-white/10">
                    <svg className="absolute inset-0 size-full [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200 dark:stroke-white/10">
                      <defs>
                        <pattern id="pattern" width="200" height="200" x="100%" y="-1" patternUnits="userSpaceOnUse">
                          <path d="M130 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" strokeWidth="0" className="fill-white dark:fill-gray-900" />
                      <svg x="100%" y="-1" className="overflow-visible fill-gray-50 dark:fill-gray-800/20">
                        <path d="M-470.5 0h201v201h-201Z" strokeWidth="0" />
                      </svg>
                      <rect width="100%" height="100%" fill="url(#pattern)" strokeWidth="0" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">Get in touch</h2>
                  <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                    Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu. Sed ut tincidunt integer elementum id sem. Arcu sed malesuada et magna.
                  </p>
                  <dl className="mt-10 space-y-4 text-base text-gray-600 dark:text-gray-300">
                    <div className="flex gap-x-4">
                      <dt className="flex-none">
                        <span className="sr-only">Address</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-6 text-gray-400">
                          <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </dt>
                      <dd>545 Mavis Island<br />Chicago, IL 99191</dd>
                    </div>
                    <div className="flex gap-x-4">
                      <dt className="flex-none">
                        <span className="sr-only">Telephone</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-6 text-gray-400">
                          <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </dt>
                      <dd><a href="tel:+1 (555) 234-5678" className="hover:text-gray-900 dark:hover:text-white">+1 (555) 234-5678</a></dd>
                    </div>
                    <div className="flex gap-x-4">
                      <dt className="flex-none">
                        <span className="sr-only">Email</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-6 text-gray-400">
                          <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </dt>
                      <dd><a href="mailto:hello@example.com" className="hover:text-gray-900 dark:hover:text-white">hello@example.com</a></dd>
                    </div>
                  </dl>
                  <button
                    onClick={handleChat}
                    className="flex gap-4 items-center mt-10 rounded-md bg-blue-600 px-3.5 pr-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                    Let's talk
                  </button>
                </div>
              </div>
              {showWidget ? (
                <div className="p-6 lg:p-8 h-full border-t border-gray-900/10">
                  <div id="widget" className="rounded-lg border overflow-hidden h-[600px] lg:h-full"></div>
                </div>
              ) : showForm ? (
                <form className="border-t border-gray-900/10 px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48">
                  <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900 dark:text-white">First name</label>
                        <div className="mt-2.5">
                          <input id="first-name" type="text" name="first-name" autoComplete="given-name" className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-white dark:outline-white/10" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900 dark:text-white">Last name</label>
                        <div className="mt-2.5">
                          <input id="last-name" type="text" name="last-name" autoComplete="family-name" className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-white dark:outline-white/10" />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white">Email</label>
                        <div className="mt-2.5">
                          <input id="email" type="email" name="email" autoComplete="email" className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-white dark:outline-white/10" />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-900 dark:text-white">Phone number</label>
                        <div className="mt-2.5">
                          <input id="phone-number" type="tel" name="phone-number" autoComplete="tel" className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-white dark:outline-white/10" />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white">Message</label>
                        <div className="mt-2.5">
                          <textarea id="message" name="message" rows={4} className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-white dark:outline-white/10"></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button type="submit" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">Send message</button>
                    </div>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mx-auto max-w-7xl px-6 pt-24 pb-8 sm:pt-56 lg:px-8">
          <div className="border-t border-gray-900/10 pt-24 dark:border-white/10">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=600" alt="Company name" className="h-9 dark:hidden" />
              <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=500" alt="Company name" className="h-9 hidden dark:block" />
              <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Solutions</h3>
                    <ul className="mt-6 space-y-4">
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Marketing</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Analytics</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Automation</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Commerce</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Insights</a></li>
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h3>
                    <ul className="mt-6 space-y-4">
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Submit ticket</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Documentation</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Guides</a></li>
                    </ul>
                  </div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
                    <ul className="mt-6 space-y-4">
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">About</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Blog</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Jobs</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Press</a></li>
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
                    <ul className="mt-6 space-y-4">
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Terms of service</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Privacy policy</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">License</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

declare global {
  interface Window {
    zE?: any
    zEMessenger?: any
  }
}
