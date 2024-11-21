import { streamer } from '../../both/streamer.js'

import './btnDashboard.html'

toggleColumn = function () {
  const column = document.getElementById('offscreen-column')
  column.classList.toggle('translate-x-[calc(100%+2rem)]')
  column.classList.toggle('translate-x-0')
}

Template.btnDashboard.onCreated(function () {
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
  'click button'() {
    console.log('hey, button clicked in the dashboard m8 yall right')
  },
})
