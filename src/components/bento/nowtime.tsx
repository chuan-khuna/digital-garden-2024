import React, { useState, useEffect } from 'react'
import { getUserTimeZoneInBrowser } from '@/lib/browser-timezone'

const NowTime = ({
  timezone,
  hideSeconds = false,
}: {
  timezone?: string
  hideSeconds?: boolean
}) => {
  const [currentTime, setCurrentTime] = useState<string>('')

  // the author added a small 1 millisecond delay, I don't know why...
  // ref: https://github.com/tim-hub/techtim-astro-bento-portfolio/blob/template/src/components/react/NowTime.tsx
  const oneSecUpdate = 1001 // be naughty
  const fiveSecUpdate = 5001
  const secondUpdateDuration = hideSeconds ? fiveSecUpdate : oneSecUpdate

  // get user timezone
  const browserTimezone = getUserTimeZoneInBrowser()

  const usingTimezone = timezone ? timezone : browserTimezone

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date()
      const dateStr = date.toLocaleDateString('en-UK', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: usingTimezone,
      })
      const timeStr = date.toLocaleTimeString('en-UK', {
        hour: '2-digit',
        minute: '2-digit',
        second: hideSeconds ? undefined : '2-digit',
        hour12: false,
        timeZone: usingTimezone,
      })
      setCurrentTime(`${dateStr}|${timeStr}`)
    }, secondUpdateDuration)
    return () => clearInterval(interval)
  }, [usingTimezone, hideSeconds])

  const [theDate, theTime] = currentTime.split('|')

  const theTimeToShow = theTime

  return (
    <>
      {currentTime ? (
        <>
          <div>
            <p>{theDate}</p>
            <p className={'my-2 text-2xl'}>{theTimeToShow}</p>
            <p className="text-sm text-gray-500">{usingTimezone}</p>
          </div>
          {!timezone && (
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
          )}
        </>
      ) : (
        <div className="h-[100px] w-full">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200"></div>
                <div className="col-span-1 h-2 rounded bg-slate-200"></div>
              </div>
              <div className="h-2 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NowTime
