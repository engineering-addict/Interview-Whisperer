import { useEffect, useState } from 'react'
import {
  onScreenshotSolution,
  ScreenshotSolution,
} from '@vite-electron-builder/preload'
import { SolutionContent } from './components/solution-content'
import { cn } from './utils/cn'
import { AppToolbar } from './components/app-toolbar'
import { useSettings } from './components/settings-provider'
import { AppShortcuts } from './components/app-shortcuts'

export function App() {
  const [solution, setSolution] = useState<ScreenshotSolution | null>(null)
  const { settings } = useSettings()

  useEffect(() => {
    return onScreenshotSolution((data) => {
      setSolution(data)
    })
  }, [])

  return (
    <div
      className={cn(
        'relative flex h-[100vh] w-full flex-col p-4 backdrop-blur-sm',
        'bg-white text-black dark:bg-gray-900 dark:text-white'
      )}
      style={{ opacity: settings.windowOpacity }}
    >
      <AppToolbar />

      <div className="mt-2 flex-1 overflow-auto">
        <div className="prose dark:prose-invert">
          {solution ? (
            <>
              <SolutionContent>
                {[
                  '#### Thoughts',
                  solution.thoughts.map((thought) => `- ${thought}`).join('\n'),
                  '#### Solution',
                  solution.code,
                  '### Complexity',
                  `**Time**: ${solution.complexity.time}`,
                  '\n\n',
                  `**Space**: ${solution.complexity.space}`,
                ].join('\n')}
              </SolutionContent>
            </>
          ) : (
            <AppShortcuts />
          )}
        </div>
      </div>
    </div>
  )
}
