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
    case 'toggleBtnDashboard-sprint-1p':
      toggleColumn()
      break
    default:
      break
  }
}

Template.btnDashboard.events({
  'mouseup button'(e, template, p) {
    // e is the jquery event, template is the template who called the simulate click apparently, and p is the stuff we're passing the toggle event (look at show.js and leave me alone)
    // console.log(e, p.pointer.nick)

    index = e.target.getAttribute('clickedIndex') ?? 0

    data = Template.instance().text.get()
    const values = data.find((item) => item.header === 'pointer-1p-salue-la-foule')?.content || []

    if (index > values.length - 1) {
      index = 0
      e.target.setAttribute('clickedIndex', 0)
    }

    const inputString = values[index].value
    const nick = p.pointer.nick
    valueAndNick = inputString.replace(/\$/g, nick)

    handlePupitreMessage({ type: 'newline', content: valueAndNick })

    // store a counter in the button lol
    addToDataAttribute(e.target, 'clickedIndex', +1)
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
