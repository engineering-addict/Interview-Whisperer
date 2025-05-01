import { cn } from '../utils/cn'
import { UserSettings } from '../../../../main/src/services/user-settings-service'
import { supportedLanguages } from './settings-provider'

type SettingsFormProps = {
  settings: UserSettings
  onSubmit: (settings: UserSettings) => void
}

export function SettingsForm({ settings, onSubmit }: SettingsFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    console.warn(formData)

    const newSettings = {
      language: formData.get('language') as string,
      apiKey: formData.get('apiKey') as string,
      windowOpacity: parseFloat(formData.get('opacity') as string) || 0.5,
    }

    onSubmit(newSettings)
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className={cn(
          'w-full max-w-md space-y-6 rounded-lg border p-6',
          'bg-white shadow-lg dark:bg-gray-800',
          'border-gray-200 dark:border-gray-700'
        )}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome! Let's set up your preferences
        </h2>

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
              name="language"
              defaultValue={settings?.language || 'javascript'}
              className={cn(
                'mt-1 block w-full rounded-md border p-2',
                'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
                'text-gray-900 dark:text-gray-100'
              )}
              required
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
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              OpenAI API Key
            </label>
            <input
              id="apiKey"
              name="apiKey"
              type="password"
              className={cn(
                'mt-1 block w-full rounded-md border p-2',
                'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
                'text-gray-900 dark:text-gray-100'
              )}
              placeholder="Enter your OpenAI API key"
              defaultValue={settings?.apiKey}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={cn(
            'w-full rounded-md bg-blue-600 px-4 py-2 text-white',
            'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
            'dark:bg-blue-500 dark:hover:bg-blue-600'
          )}
        >
          Save Settings
        </button>
      </form>
    </div>
  )
}
