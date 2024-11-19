import { Meteor } from "meteor/meteor"
import { streamer } from "../both/streamer.js"

const description = "Playtest de Novembre '24 au Melies."

WebApp.connectHandlers.use("/api/hello", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // Allow all origins (use specific domains for more security)
  res.setHeader("Content-Type", "text/plain")

  res.write(description)
  res.end()
})

streamer.allowRead("all")
streamer.allowWrite("all")

streamer.on("pointerMessage", function (message) {
  //eventQueue.push(message);
})

Meteor.startup(async () => {
  console.log("nuking all clients ")
})
