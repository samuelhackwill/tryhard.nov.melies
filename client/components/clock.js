import './clock.html'
import { streamer } from '../../both/streamer.js'

let startTime = null // Track the animation start time
const duration = 60000 // 1 minute in milliseconds

Template.clock.onCreated(function () {
  //Listen to admin calls to action (like displaying score ou quoi)
  streamer.on('pupitreAction', handlePupitreAction)
})

const handlePupitreAction = function (message) {
  console.log(message)
  switch (message.content) {
    case 'startTimer-prologue':
      console.log('start anim fuck')
      // Start the animation
      requestAnimationFrame(animate)
      break
  }
}

animate = function (time) {
  const needle = document.getElementById('needle')
  const clockFace = document.getElementById('clock-face')

  if (!startTime) startTime = time

  const elapsed = time - startTime
  const progress = Math.min(elapsed / duration, 1) // Calculate progress (0 to 1)

  // Calculate the current angle
  const angle = 360 * progress

  // Update the needle's rotation
  needle.style.transform = `translateX(-50%) rotate(${angle}deg)`

  // Update the conic gradient's angle to create the trail effect
  clockFace.style.setProperty('--trail-angle', `${angle}deg`)

  // Continue the animation if not finished
  if (progress < 1) {
    requestAnimationFrame(animate)
  } else {
    console.log('time is over')
    // close dashboard,
    // fade bg to black
  }
}
