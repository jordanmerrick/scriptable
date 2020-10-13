// Tesla Security Status
// By Jordan Merrick
// jordanmerrick.com

// Use the Tesla Scriptable Widget shortcut to get your access token and car ID
const accessToken = ''
const carId = ''

// Authorization for API request header
const auth = 'Bearer ' + accessToken

// Wake the car and get the vehicle status
let wakeStatus = await wakeCar()
let vehicleStatus = await getVehicleDetails()

// Create widget
let widget = await createWidget()

if (config.runsInWidget) {

  Script.setWidget(widget)

} else {

  widget.presentSmall()

}

Script.complete()

async function createWidget() {

  // Create widget
  let widget = new ListWidget();

  // Widget color
  let gradient = new LinearGradient()

  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("090f03"),
    new Color("451111")
  ]

  widget.backgroundGradient = gradient;

  // Title stack
  let titleStack = widget.addStack()
  let titleIcon = SFSymbol.named('lock.shield.fill')
  titleIcon.applyMediumWeight()
  let titleIconElement = titleStack.addImage(titleIcon.image)
  titleIconElement.imageSize = new Size(16, 18)
  titleIconElement.tintColor = Color.white()
  titleStack.addSpacer(8)  
  let titleElement = titleStack.addText(vehicleStatus.response.vehicle_name)
  titleElement.textColor = Color.white()
  titleElement.font = Font.boldSystemFont(16)
  titleStack.addSpacer()

  widget.addSpacer()

  // Locked stack
  let lockStack = widget.addStack()
  let lockIcon = SFSymbol.named('lock.circle');
  let lockIconElement = lockStack.addImage(lockIcon.image)
  lockIconElement.imageSize = new Size(15, 15)
  lockStack.addSpacer(8)  

  // Lock status
  if (vehicleStatus.response.locked) {
    lockIconElement.tintColor = Color.white()
    let lockElement = lockStack.addText('Locked')
    lockElement.textColor = Color.white()
    lockElement.font = Font.systemFont(14)
  } else {
    lockIconElement.tintColor = Color.red()
    let lockElement = lockStack.addText('Unlocked')
    lockElement.textColor = Color.red()
    lockElement.font = Font.systemFont(14)
  }
  widget.addSpacer()
  
  // Sentry mode stack
  let sentryStack = widget.addStack()
  let sentryIcon = SFSymbol.named('sun.min')
  let sentryIconElement = sentryStack.addImage(sentryIcon.image)
    sentryIconElement.imageSize = new Size(15, 15)
    sentryStack.addSpacer(8)

  if (vehicleStatus.response.sentry_mode) {
    sentryIconElement.tintColor = Color.red()
    let sentryElement = sentryStack.addText('Sentry On')
    sentryElement.textColor = Color.red()
    sentryElement.font = Font.systemFont(14)
  } else {
    sentryIconElement.tintColor = Color.white()
    let sentryElement = sentryStack.addText('Sentry Off')
    sentryElement.textColor = Color.white()
    sentryElement.font = Font.systemFont(14)
  }
  
  widget.addSpacer()
  
    // Last updated stack
  let lastUpdatedStack = widget.addStack()
  let currentDate = new Date()
  let lastUpdated = currentDate.toLocaleString("default", {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
  let lastUpdatedElement = lastUpdatedStack.addText(lastUpdated)
  lastUpdatedElement.textColor = Color.white()
  lastUpdatedElement.font = Font.systemFont(10)

  return widget
}

// Wake call
async function wakeCar() {

  let wakeUrl = 'https://owner-api.teslamotors.com/api/1/vehicles/' + carId + '/wake_up'
  let wakeRequest = new Request(wakeUrl)
  wakeRequest.method = 'post'
  wakeRequest.headers = {
    'Authorization': auth,
    'Content-Type': 'application/json'
  }
  return await wakeRequest.loadJSON()

}

// Vehicle status call
async function getVehicleDetails() {

  if (wakeStatus.response.state == 'online') {

    let vehicleDetailsUrl = 'https://owner-api.teslamotors.com/api/1/vehicles/' + carId + '/data_request/vehicle_state'
    let vehicleDetailsRequest = new Request(vehicleDetailsUrl)
    vehicleDetailsRequest.method = 'get'
    vehicleDetailsRequest.headers = {
      'Authorization': auth,
      'Content-Type': 'application/json'
    }

    return await vehicleDetailsRequest.loadJSON()

  } else {
    return 'Error communicating with your car. Please try again.'
  }
}
