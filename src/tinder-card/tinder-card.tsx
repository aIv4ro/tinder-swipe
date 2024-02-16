import { useEffect, useRef } from 'react'
import './tinder-card.css'

type DraggingRef = {
  initialX: number | null
  diff: number
}

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
  const articleRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<DraggingRef>({ initialX: null, diff: 0 })

  useEffect(() => {
    const article = articleRef.current
    if (article == null) return

    function handleDragMove (evt: TouchEvent | MouseEvent) {
      if (draggingRef.current.initialX == null) return
      let currentX: number
      if (evt instanceof TouchEvent) {
        currentX = evt.touches[0].pageX
      } else {
        currentX = evt.pageX
      }
      draggingRef.current.diff = currentX - draggingRef.current.initialX!
      const rotation = draggingRef.current.diff / 15
      article!.style.transform = `translateX(${draggingRef.current.diff}px) rotate(${rotation}deg)`
    }

    function handleDragStart (evt: TouchEvent | MouseEvent) {
      if (evt instanceof TouchEvent) {
        draggingRef.current.initialX = evt.touches[0].pageX
      } else {
        draggingRef.current.initialX = evt.pageX
      }      
      article!.addEventListener('mousemove', handleDragMove)
      article!.addEventListener('touchmove', handleDragMove, { passive: true })
    }

    function handleDragEnd () {
      if (draggingRef.current.initialX == null) return

      article!.style.transition = 'transform 1s ease-in-out'
      let liked: null | boolean = null
      if (draggingRef.current.diff > 170) {
        liked = true
        article!.style.transform = `translateX(1000px) rotate(60deg)`
      } else if (draggingRef.current.diff < -170) {
        liked = false
        article!.style.transform = `translateX(-1000px) rotate(-60deg)`
      } else {
        article!.style.transform = `translateX(0px) rotate(0deg)`
      }

      article!.addEventListener('transitionend', () => {
        article!.style.transition = ''
        if (liked != null) onSwipe(liked)
      }, { once: true })

      article!.removeEventListener('mousemove', handleDragMove)
      article!.removeEventListener('touchmove', handleDragMove)
      draggingRef.current.initialX = null
      draggingRef.current.diff = 0
    }

    article.addEventListener('touchstart', handleDragStart, { passive: true })
    article.addEventListener('mousedown', handleDragStart)
    window.addEventListener('touchend', handleDragEnd)
    window.addEventListener('mouseup', handleDragEnd)

    return () => {
      article.removeEventListener('touchstart', handleDragStart)
      article.removeEventListener('mousedown', handleDragStart)
      window.removeEventListener('touchend', handleDragEnd)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [onSwipe])

  return (
    <article 
      ref={articleRef}
      className='tinder-card'
    >
      <h2>{name}, {age}</h2>
      <picture>
        <img src={src} alt={alt} />
      </picture>
    </article>
  )
}