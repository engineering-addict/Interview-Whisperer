import { closeWindow } from '@vite-electron-builder/preload'
import { useTheme } from './theme-provider'
import { cn } from '../utils/cn'
import { Moon, Sun, X } from 'lucide-react'
import { ProcessingStatusBadge } from './processing-status-badge'
import { SettingsDropdown } from './settings-dropdown'

const WebAppRegion = '-webkit-app-region' as string

export function AppToolbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-end space-x-2">
      <div
        className="flex-1 bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,.2)]"
        style={{
          cursor: 'grab',
          height: 30,
          [WebAppRegion]: 'drag',
          borderRadius: 4,
          position: 'relative',
        }}
      >
        &nbsp;
        <span className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center text-sm opacity-20">
          [drag me]
        </span>
      </div>

      <div className="flex items-center gap-3 pl-2">
        <ProcessingStatusBadge />
        <SettingsDropdown />
        <button
          type="button"
          className={cn('rounded-full p-1')}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>

        {/* Close button */}
        <button
          className={cn('rounded-full p-1')}
          onClick={closeWindow}
          title="Close window"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
