import { streamer } from '../../both/streamer.js'

import { addToDataAttribute } from '../pages/show.js'

import { handlePupitreMessage } from '../components/feed.js'

import { prologue } from '../textAssets/dashboard.js'

import './btnDashboard.html'

Template.btnDashboard.onCreated(function () {
  this.text = new ReactiveVar('')
  this.readingIndex = new ReactiveVar(0)

  // fuck this i'm using global reactive sources
  isClockDisplayed = new ReactiveVar(false)

  Meteor.call('returnText', (err, res) => {
    if (err) {
      alert(err)
    } else {
      this.text.set(res)
    }
  })

  //Listen to admin calls to action (like displaying score ou quoi)
  streamer.on('pupitreAction', handlePupitreAction)
})

function handlePupitreAction(message) {
  switch (message.content) {
    case 'showBonjour-prologue':
      addCentralButton()
      break
    case 'showBtnSaluerLaFoule-sprint-1p':
      addButton('saluer', 'Saluer la foule')
      break
    case 'showBtnStart2p-sprint-1p':
      addButton('addp2', 'Faire venir un.e autre joueur.euse')
      break
    case 'showBtnMMO-sprint-1p':
      addButton('addpxxx', 'Faire venir tout le monde')
      break
    case 'toggleBtnDashboard-prologue':
      toggleColumn()
      break
    case 'showBtnSanglier-sprint-1p':
      addButton('addBoar', 'Faire venir le sanglier de Calydon /!\\ DANGER! /!\\ ')
      break
    case 'showDocteurs1-prologue':
      addText('doc1', prologue[1])
      break
    case 'showDocteurs2-prologue':
      addText('doc1', prologue[2])
      break
    case 'showDocteurs3-prologue':
      addText('doc1', prologue[3])
      break
    case 'showDocteurs4-prologue':
      addText('doc1', prologue[4])
      break
    case 'showClock-prologue':
      addClock()
      break

    default:
      break
  }
}

Template.btnDashboard.helpers({
  displayClock() {
    console.log(isClockDisplayed.get())
    return isClockDisplayed.get()
  },
})

Template.btnDashboard.events({
  'mouseup #saluer'(e, template, p) {
    // e is the jquery event, template is the template who called the simulate click apparently, and p is the stuff we're passing the toggle event (look at show.js and leave me alone)
    const nick = p.pointer.nick

    if (nick.startsWith('Méléagre')) {
      data = Template.instance().text.get()
      values = data.find((item) => item.header === 'pointer-2p-salue-la-foule')?.content || []
    } else {
      data = Template.instance().text.get()
      values = data.find((item) => item.header === 'pointer-1p-salue-la-foule')?.content || []
    }

    // bon pour le moment p1 et p2 ont le même index... zobi
    index = e.target.getAttribute('clickedIndex') ?? 0

    if (index > values.length - 1) {
      index = 0
      e.target.setAttribute('clickedIndex', 0)
    }

    const inputString = values[index].value
    valueAndNick = inputString.replace(/\¥/g, nick)

    handlePupitreMessage({ type: 'newline', content: valueAndNick })

    // store a counter in the button lol
    addToDataAttribute(e.target, 'clickedIndex', +1)
  },
  'mouseup button#addp2'(e, template, p) {
    // start a new race for the second player to appear.
    instance.scoreSprint2p.set('startTime', new Date())
    // this button must be untoggled
    e.target.classList.remove('bg-blue-800')
    e.target.classList.add('pointer-events-none')
    e.target.style.backgroundColor = '#6B7280'
    e.target.style.color = '#9CA3AF'
  },
  'mouseup button#addpxxx'(e, template, p) {
    namelessPeeps = Object.values(instance.pointers.all()).filter(
      (obj) => !obj.hasOwnProperty('nick'),
    )
    console.log(namelessPeeps)

    for (let x = 0; x < namelessPeeps.length; x++) {
      Meteor.setTimeout(() => {
        document
          .getElementById('pointer' + namelessPeeps[x].id)
          .classList.add('transition-all', 'duration-[1s]')
      }, x * 10)

      Meteor.setTimeout(() => {
        document.getElementById('pointer' + namelessPeeps[x].id).classList.remove('opacity-0')
      }, x * 1000)
    }
  },
})

removeBgClassesFromNode = function (node) {
  if (!node || !node.classList) {
    console.error('Invalid node provided.')
    return
  }

  // Convert the classList to an array, filter out classes starting with 'bg-', and join them back
  const updatedClasses = Array.from(node.classList).filter((cls) => !cls.startsWith('bg-'))

  // Update the node's class attribute
  node.className = updatedClasses.join(' ')
}

addClock = function () {
  isClockDisplayed.set(true)
}

addButton = function (id, value) {
  const button = document.createElement('button')

  // Set the button's attributes and classes
  button.className = 'w-full px-4 py-2 mb-2 text-white bg-blue-800 rounded stops-events'
  button.id = id

  // Set the button's inner text
  button.textContent = value

  // Append the button to the desired parent element
  // For example, appending it to the body or a specific container
  document.getElementById('btnContainer').appendChild(button)
}

addCentralButton = function (id, value) {
  const button = document.createElement('button')

  // Set the button's attributes and classes
  button.className =
    'bg-blue-500 h-fit w-fit absolute left-[50%] top-[50%] -translate-y-[50%] -translate-x-[50%] text-white font-bold py-2 px-4 rounded shadow-md transition-transform shadow-neutral-800 transform stops-events select-none'
  button.id = 'bonjourSamuel'

  // Set the button's inner text
  button.textContent = 'Bonjour'

  // Append the button to the desired parent element
  // For example, appending it to the body or a specific container
  document.getElementsByClassName('backgroundContainer')[0].appendChild(button)
}

export const toggleColumn = function () {
  const column = document.getElementById('offscreen-column')
  column.classList.toggle('translate-x-[calc(100%+2rem)]')
  column.classList.toggle('translate-x-0')
}

addText = function (id, value) {
  // Get the offscreen column container
  const offscreenColumn = document.getElementById('offscreen-column')

  // Create a temporary wrapper div for the animation
  const tempWrapper = document.createElement('div')
  tempWrapper.className = 'flex flex-col transform transition-transform duration-500 ease-in-out'
  tempWrapper.style.transform = 'translateX(100%)' // Start off-screen

  // Create the actual content div that will eventually be appended to the offscreen column
  const parentDiv = document.createElement('div')
  parentDiv.className = 'flex flex-col'

  const innerDiv = document.createElement('div')
  innerDiv.className =
    'flex items-center justify-center flex-row m-4 w-fit self-end rounded-2xl h-auto bg-gray-200 shadow-lg'

  const childContainer = document.createElement('div')
  childContainer.classList.add('p-4', 'mb-2')

  const span = document.createElement('span')
  span.className = 'w-full text-black'
  span.id = id
  span.textContent = value

  childContainer.appendChild(span)
  innerDiv.appendChild(childContainer)
  parentDiv.appendChild(innerDiv)

  // Append the actual content div inside the temporary wrapper
  tempWrapper.appendChild(parentDiv)

  // Append the temporary wrapper to the offscreen column
  offscreenColumn.appendChild(tempWrapper)

  // Force reflow to ensure the browser registers the off-screen position
  const reflow = tempWrapper.offsetHeight

  // Trigger the animation by setting transform to 0 (slide in)
  tempWrapper.style.transform = 'translateX(0%)'

  // After the animation completes, move the content to the offscreen column and remove the temporary wrapper
  tempWrapper.addEventListener('transitionend', function () {
    // Move the inner content to the correct place in the column
    offscreenColumn.appendChild(parentDiv)

    // Remove the temporary wrapper
    tempWrapper.remove()
  })
}
