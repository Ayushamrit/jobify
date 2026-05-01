import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Mail, MapPin, Facebook, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-300 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] flex items-center justify-center'>
                <BriefcaseBusiness className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-2xl font-bold'>
                <span className='text-white'>Job</span>
                <span className='bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] bg-clip-text text-transparent'>ify</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mb-6">
              India's #1 job portal connecting talented professionals with top companies. Find your dream career today.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Mail className="w-4 h-4 text-[#6A38C2]" />
              <span>support@jobify.in</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-[#6A38C2]" />
              <span>Bangalore, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Jobs', to: '/browse' },
                { label: 'All Jobs', to: '/jobs' },
                { label: 'My Profile', to: '/profile' },
                { label: 'Saved Jobs', to: '/saved' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-[#8B5CF6] transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Recruiters</h3>
            <ul className="space-y-3">
              {[
                { label: 'Post a Job', to: '/admin/jobs/create' },
                { label: 'Manage Jobs', to: '/admin/jobs' },
                { label: 'Companies', to: '/admin/companies' },
                { label: 'View Applicants', to: '/admin/companies' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-[#8B5CF6] transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 <span className="text-[#8B5CF6] font-semibold">Jobify</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              { Icon: Github, href: 'https://github.com', label: 'GitHub' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#6A38C2] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;