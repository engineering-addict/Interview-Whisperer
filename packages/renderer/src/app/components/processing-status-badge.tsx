import { onScreenshotProcessingStatus } from '@vite-electron-builder/preload'

import { Circle, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ProcessingStatusBadge() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  useEffect(() => {
    return onScreenshotProcessingStatus((processing) => {
      setIsProcessing(processing)
    })
  }, [])

  return (
    <div className="flex items-center">
      {isProcessing ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
    </div>
  )
}
