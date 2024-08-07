import React from 'react'
import { RiTwitterXLine, RiGithubLine, RiLinkedinBoxLine, RiRocketLine, RiBookOpenLine, RiBriefcaseLine, RiQuestionLine } from "@remixicon/react";

interface NavigationItem {
  name: string
  href: string
  icon: React.ReactNode
}

const navigation: {
  main: NavigationItem[]
  social: NavigationItem[]
} = {
  main: [
    { name: 'Features', href: '#features', icon: <RiRocketLine className="mr-2" /> },
    { name: 'Learn', href: '#learn', icon: <RiBookOpenLine className="mr-2" /> },
    { name: 'Careers', href: '#careers', icon: <RiBriefcaseLine className="mr-2" /> },
    { name: 'Support', href: '#support', icon: <RiQuestionLine className="mr-2" /> },
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/',
      icon: <RiTwitterXLine className="h-6 w-6" aria-hidden="true" />,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/',
      icon: <RiGithubLine className="h-6 w-6" aria-hidden="true" />,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in',
      icon: <RiLinkedinBoxLine className="h-6 w-6" aria-hidden="true" />,
    },
  ],
}

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-black to-[#200D42] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <RiRocketLine className="mr-2 text-purple-400" />
              Kalendar AI
            </h2>
            <p className="text-purple-200 mb-4">
              Revolutionizing scheduling with AI-powered intelligence. Optimize your time, boost productivity, and never miss an important appointment again.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {navigation.main.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-purple-200 hover:text-white transition-colors duration-200 flex items-center"
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#privacy" className="text-purple-200 hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#terms" className="text-purple-200 hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#cookies" className="text-purple-200 hover:text-white transition-colors duration-200">Cookie Policy</a>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Connect With Us</h3>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-purple-200 hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-purple-800">
          <p className="text-center text-sm text-purple-200">
            &copy; {new Date().getFullYear()} Kalendar AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
