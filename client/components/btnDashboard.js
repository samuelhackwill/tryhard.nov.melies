import { streamer } from '../../both/streamer.js'

import { addToDataAttribute } from '../pages/show.js'

import { handlePupitreMessage } from '../components/feed.js'

import './btnDashboard.html'

toggleColumn = function () {
  const column = document.getElementById('offscreen-column')
  column.classList.toggle('translate-x-[calc(100%+2rem)]')
  column.classList.toggle('translate-x-0')
}

Template.btnDashboard.onCreated(function () {
  this.text = new ReactiveVar('')
  this.readingIndex = new ReactiveVar(0)

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
    case 'showBtnSaluerLaFoule-sprint-1p':
      addButton('saluer', 'Saluer la foule')
      break
    case 'showBtnStart2p-sprint-1p':
      addButton('addp2', 'Faire venir un.e autre joueur.euse')
      break
    case 'showBtnMMO-sprint-1p':
      addButton('addpxxx', 'Faire venir tout le monde')
      break
    case 'toggleBtnDashboard-sprint-1p':
      toggleColumn()
      break
    case 'showBtnSanglier-sprint-1p':
      addButton('addBoar', 'Faire venir le sanglier de Calydon /!\\ DANGER! /!\\ ')
      break

    default:
      break
  }
}

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
