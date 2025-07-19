'use client'

import React, { useState } from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  LogOut, 
  Settings as SettingsIcon,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react'

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
  }

  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile Information', action: () => console.log('Profile') },
        { label: 'Change Password', action: () => console.log('Password') },
        { label: 'Email Preferences', action: () => console.log('Email') }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { 
          label: 'Push Notifications', 
          action: () => setNotifications(!notifications),
          toggle: notifications
        },
        { label: 'Email Notifications', action: () => console.log('Email notifications') },
        { label: 'SMS Notifications', action: () => console.log('SMS notifications') }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Privacy Settings', action: () => console.log('Privacy') },
        { label: 'Two-Factor Authentication', action: () => console.log('2FA') },
        { label: 'Data & Storage', action: () => console.log('Data') }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { 
          label: 'Dark Mode', 
          action: () => setDarkMode(!darkMode),
          toggle: darkMode
        },
        { label: 'Language', action: () => console.log('Language') },
        { label: 'Font Size', action: () => console.log('Font size') }
      ]
    },
    {
      title: 'General',
      icon: SettingsIcon,
      items: [
        { label: 'About', action: () => console.log('About') },
        { label: 'Help & Support', action: () => console.log('Help') },
        { label: 'Terms of Service', action: () => console.log('Terms') }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src={userInfo.avatar} 
              alt={userInfo.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{userInfo.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{userInfo.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Member since 2023</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <section.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{section.title}</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={item.action}
                        className="flex-1 text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {item.label}
                      </button>
                      <div className="flex items-center space-x-2">
                        {item.toggle !== undefined ? (
                          <button
                            onClick={item.action}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              item.toggle 
                                ? 'bg-blue-600 dark:bg-blue-500' 
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                item.toggle ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings