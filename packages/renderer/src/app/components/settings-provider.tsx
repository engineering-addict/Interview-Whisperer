import {
  getUserSettings,
  saveUserSettings,
} from '@vite-electron-builder/preload'
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import type { UserSettings } from '../../../../main/src/services/user-settings-service'
import { SettingsForm } from './settings-form'

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

interface SettingsProviderProps {
  children: ReactNode
}

export const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
] as const

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettings>({
    language: 'javascript',
    apiKey: '',
    windowOpacity: 0.8,
  })

  useEffect(() => {
    getUserSettings().then((settings) => {
      setSettings((prev) => ({ ...prev, ...settings }))
      setIsLoading(false)
    })
  }, [])

  const updateSettings = (settings: Partial<UserSettings>) => {
    saveUserSettings(settings).then(() => {
      setSettings((prev) => {
        return { ...prev, ...settings }
      })
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!settings.apiKey) {
    return <SettingsForm settings={settings} onSubmit={updateSettings} />
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
