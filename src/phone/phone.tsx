import './phone.css'
import { TinderIcon } from "../icons/tinder";
import { TinderCard } from '../tinder-card/tinder-card';
import { useState } from 'react';
import { BoltIcon } from '../icons/bolt';
import { HeartIcon } from '../icons/heart';
import { XIcon } from '../icons/x';
import { ReloadIcon } from '../icons/reload';

const defaultTinderUsers = [
  {
    id: 1,
    src: 'https://raw.githubusercontent.com/midudev/javascript-100-proyectos/main/01-tinder-swipe/photos/2.webp',
    alt: 'Tinder image 1',
    name: 'John',
    age: 25
  },
  {
    id: 2,
    src: 'https://raw.githubusercontent.com/midudev/javascript-100-proyectos/main/01-tinder-swipe/photos/1.webp',
    alt: 'Tinder image 2',
    name: 'Jane',
    age: 23  
  }
]

export function Phone () {
  const [tinderUsers, setTinderUsers] = useState(defaultTinderUsers)

  function handleSwipe (tinderUser: typeof tinderUsers[0], liked: boolean) {
    console.log(liked)
    setTinderUsers((prev) => prev.filter((user) => user.id !== tinderUser.id))
  }

  const { length } = tinderUsers

  return (
    <section className='phone'>
      <header className='phone-header'>
        <TinderIcon />
      </header>
      <section className='tinder-list'>
        {length > 0 && tinderUsers.map((tinderUser, index) => (
          <TinderCard onSwipe={(liked) => handleSwipe(tinderUser, liked)} key={index} {...tinderUser} />
        ))}
        {length === 0 && <p>No more users. <br></br> Please reload the page</p>}
      </section>
      <footer className='phone-footer'>
        <ReloadIcon />
        <XIcon />
        <BoltIcon />
        <HeartIcon />
        <BoltIcon />
      </footer>
    </section>
  )
}