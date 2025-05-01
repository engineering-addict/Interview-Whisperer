import { supportedLanguages, useSettings } from './settings-provider'
import { cn } from '../utils/cn'
import { Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function SettingsDropdown() {
  const { settings, updateSettings } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          'flex items-center gap-1 rounded-full p-1',
          'hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-8 right-0 z-50 w-64 rounded-md border p-4',
            'bg-white shadow-lg dark:bg-gray-800',
            'border-gray-200 dark:border-gray-700'
          )}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Programming Language
              </label>
              <select
                id="language"
                value={settings?.language}
                onChange={(e) =>
                  updateSettings({
                    language: e.target.value as typeof settings.language,
                  })
                }
                className={cn(
                  'mt-1 block w-full rounded-md border p-2',
                  'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
                  'text-gray-900 dark:text-gray-100'
                )}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="opacity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Window Opacity
              </label>
              <input
                id="opacity"
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings?.windowOpacity}
                onChange={(e) =>
                  updateSettings({
                    windowOpacity: parseFloat(e.target.value),
                  })
                }
                className="mt-1 block w-full"
              />
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {Math.round(settings?.windowOpacity * 100)}%
              </div>
            </div>

            <div>
              <label
                htmlFor="openai-api-key"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                OpenAI API Key
              </label>
              <input
                id="openai-api-key"
                type="password"
                className={cn(
                  'mt-1 block w-full rounded-md border p-2',
                  'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
                  'text-gray-900 dark:text-gray-100'
                )}
                placeholder="Enter your OpenAI API key"
                defaultValue={settings?.apiKey}
              />
              {!settings?.apiKey && (
                <div className="mt-1 text-sm text-red-500">
                  Please enter a valid OpenAI API key
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
