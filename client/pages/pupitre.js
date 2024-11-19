import './pupitre.html'

import { streamer } from '../../both/streamer.js'

Template.pupitre.onCreated(function () {
  this.text = new ReactiveVar('')
  this.selectedHeader = new ReactiveVar('')
  this.readingIndex = new ReactiveVar(0)

  Meteor.call('returnText', (err, res) => {
    if (err) {
      alert(err)
    } else {
      this.text.set(res)
    }
  })
})

Template.pupitre.events({
  'click .header'() {
    Template.instance().selectedHeader.set(this.key)
    // the timeout is to make sure blaze has rendered, lulz.
    Meteor.setTimeout(() => {
      console.dir(document.getElementById('textLinesColumn').children[0].children[0].focus())
    }, 0)
  },

  'click .line'() {
    // we need to send the text when it's text, but when it's an action then it'll be something else RIGHT
    sendLine(String(this))
  },

  'keyup .line'(e) {
    if (e.key == 'Enter') {
      sendLine(String(this))
    } else {
      return
    }
  },
})

Template.pupitre.helpers({
  // getPointer() {
  //   console.log(this)
  // },

  getHeaders() {
    obj = Template.instance().text.get()
    const headers = Object.entries(obj).map(([key, value]) => {
      return { key: key, content: value }
    })

    return headers
  },

  getContent() {
    select = Template.instance().selectedHeader.get()
    if (select) {
      return Template.instance().text.get()[select]
    } else {
      return ''
    }
  },
})

const sendLine = function (string) {
  console.dir(string)
  streamer.emit('pupitreMessage', { type: 'newLine', content: string })
}
