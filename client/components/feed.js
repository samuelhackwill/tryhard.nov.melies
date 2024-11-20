import './feed.html'
import { streamer } from '../../both/streamer.js'

let emphasisTrigger = false

Template.feed.onCreated(function () {
  streamer.on('pupitreMessage', handlePupitreMessage)
})

function handlePupitreMessage(message) {
  feed = document.getElementById('feed')

  const feedItem = document.createElement('div')
  feedItem.className =
    'text-white text-6xl mb-6 feedItem transition-opacity duration-1000 select-none'

  message.content.split('').forEach((char) => {
    // si c'est une étoile, passe en mode emphasis
    // si c'est une deuxième étoile passe en mode fin de l'emphasis
    if (char == '_') {
      emphasisTrigger = !emphasisTrigger
      return
    }
    const span = document.createElement('span')
    if (emphasisTrigger === true) {
      span.className = 'opacity-0 italic !font-serif !text-yellow-100'
    } else {
      span.className = 'opacity-0'
    }
    span.textContent = char // Assign the character to the span
    feedItem.appendChild(span) // Append the span to the div
  })

  feed.prepend(feedItem)

  // TYPING ANIMATION HERE
  Meteor.setTimeout(() => {
    index = 0
    arr = [...feed.children[0].children]

    prout = Meteor.setInterval(() => {
      if (index > arr.length - 1) {
        Meteor.clearInterval(prout)
        return
      }
      arr[index].style.opacity = 1
      index = index + 1
    }, 5)
  }, 0)

  // ALTERNATIVE TYPING ANIMATION HERE, SLOWER BUT MORE FLUID.
  // function revealChar() {
  //   if (index >= arr.length) return

  //   arr[index].style.opacity = 1
  //   index++
  //   requestAnimationFrame(revealChar)
  // }

  // requestAnimationFrame(revealChar)

  // ANIMATION OF AVANT-DERNIERE LINE HERE

  // we need to fade all the lines as they are added, but not the first one. The feed has an empty children so length is 3 when we've only got 2 lines of test for some reason.
  if (feed.children.length < 2) {
    return
  } else {
    Meteor.setTimeout(() => {
      feed.children[1].style.opacity = '0.2'
    }, 0)
  }
}
