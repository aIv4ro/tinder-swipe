import { useEffect, useState } from 'react'
import './tinder-card.css'

export function TinderCard ({
  src,
  alt, 
  name,
  age,
  onSwipe
}: {
  src: string
  alt: string
  name: string
  age: number
  onSwipe: (liked: boolean) => void
}) {
  const [initialX, setInitialX] = useState<number | null>(null)
  const [xDiff, setXDiff] = useState(0)

  useEffect(() => {
    function handleDragEnd () {
      if (initialX == null) return
      setXDiff(prev => {
        return Math.abs(prev) > 170 ? Math.sign(prev) * 1000 : 0
      })
      setInitialX(null)
    }
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('touchend', handleDragEnd, { passive: true })
    return () => {
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [initialX])

  function handleDragStart (evt: React.TouchEvent | React.MouseEvent) {
    const {nativeEvent} = evt 
    const pageX = nativeEvent instanceof TouchEvent ? nativeEvent.touches[0].pageX : nativeEvent.pageX
    setInitialX(pageX)
  }

  function handleDragMove (evt: React.TouchEvent | React.MouseEvent) {
    if (initialX == null) return
    const {nativeEvent} = evt 
    const pageX = nativeEvent instanceof TouchEvent ? nativeEvent.touches[0].pageX : nativeEvent.pageX
    setXDiff(pageX - initialX)
  }

  const onDragMove = initialX != null ? handleDragMove : undefined
  const rotation = xDiff / 15
  const onTransitionEnd = Math.abs(xDiff) >= 1000 ? () => onSwipe(xDiff > 0) : undefined

  return (
    <article 
      className='tinder-card'
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={onDragMove}
      onTouchMove={onDragMove}
      onTransitionEnd={onTransitionEnd}
      style={{
        transform: `translateX(${xDiff}px) rotate(${rotation}deg)`,
        transition: initialX != null ? 'none' : 'transform .6s ease-in-out'
      }}
    >
      <h2>{name}, {age}</h2>
      <picture>
        <img src={src} alt={alt} />
      </picture>
    </article>
  )
}