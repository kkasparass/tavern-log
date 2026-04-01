'use client'
import { useRef, useState } from 'react'

export function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const onTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
  }

  const onEnded = () => {
    setIsPlaying(false)
    setProgress(0)
  }

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={audioUrl} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />
      <button
        onClick={toggle}
        className="w-8 h-8 rounded-full bg-[var(--theme-accent)] flex items-center justify-center text-white text-xs shrink-0 hover:opacity-80 transition-opacity"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '■' : '▶'}
      </button>
      <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-[var(--theme-accent)] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
