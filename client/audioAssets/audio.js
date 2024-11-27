let bonjours = []

export const playAudio = function () {
  randomInt = Math.floor(Math.random() * 3 + 1)
  console.log(randomInt)
  bonjours.push(new Audio('/bonjours/b' + randomInt + '.mp3'))

  bonjours[bonjours.length - 1].play()
}
