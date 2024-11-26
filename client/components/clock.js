import './clock.html'

Template.clock.onRendered(function () {
  const needle = document.getElementById('needle')
  const clockFace = document.getElementById('clock-face')

  let startTime = null // Track the animation start time
  const duration = 60000 // 1 minute in milliseconds

  function animate(time) {
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
    }
  }

  // Start the animation
  requestAnimationFrame(animate)
})
