import './feed.html'
import { streamer } from '../../both/streamer.js'

Template.feed.onCreated(function () {
  streamer.on('pupitreMessage', handlePupitreMessage)
})

function handlePupitreMessage(message) {
  feed = document.getElementById('feed')

  const feedItem = document.createElement('div')
  feedItem.className =
    'text-white text-6xl mb-6 feedItem transition-opacity duration-1000 select-none'
  feedItem.textContent = message.content

  feed.prepend(feedItem)

  console.log(feed.children)

  // we need to fade all the lines as they are added, but not the first one. The feed has an empty children so length is 3 when we've only got 2 lines of test for some reason.
  if (feed.children.length < 2) {
    return
  } else {
    Meteor.setTimeout(() => {
      feed.children[1].style.opacity = '0.2'
    }, 100)
  }
}
