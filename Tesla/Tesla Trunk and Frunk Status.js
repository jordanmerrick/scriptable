// Tesla Vehicle Status
// By Jordan Merrick
// https://github.com/jordanmerrick/scriptable

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
    new Color("353736")
  ]

  widget.backgroundGradient = gradient;

  // Title stack
  let titleStack = widget.addStack()
  let titleIcon = SFSymbol.named('slider.vertical.3')
  titleIcon.applyMediumWeight()
  let titleIconElement = titleStack.addImage(titleIcon.image)
  titleIconElement.imageSize = new Size(18, 18)
  titleIconElement.tintColor = Color.white()
  titleStack.addSpacer(8)  
  let titleElement = titleStack.addText(vehicleStatus.response.vehicle_name)
  titleElement.textColor = Color.white()
  titleElement.font = Font.boldSystemFont(16)
  titleStack.addSpacer()

  widget.addSpacer()
  
  // Trunk stack
  let trunkStack = widget.addStack()
  let caseIcon = SFSymbol.named('case');
  let caseIconElement = trunkStack.addImage(caseIcon.image)
  caseIconElement.imageSize = new Size(15, 15)
  trunkStack.addSpacer(4)  

  if (vehicleStatus.response.rt == 0) {
    caseIconElement.tintColor = Color.white()
    let caseElement = trunkStack.addText('Trunk Closed')
    caseElement.textColor = Color.white()
    caseElement.font = Font.systemFont(14)
  } else {
    caseIconElement.tintColor = Color.red()
    let caseElement = trunkStack.addText('Trunk Open')
    caseElement.textColor = Color.red()  
    caseElement.font = Font.systemFont(14)
  }
  
  widget.addSpacer()
  
    // Frunk stack
  let frunkStack = widget.addStack()
let briefcaseIcon = SFSymbol.named('briefcase');
    let briefcaseIconElement = frunkStack.addImage(briefcaseIcon.image)
    briefcaseIconElement.imageSize = new Size(15, 15)
    frunkStack.addSpacer(4)   

  if (vehicleStatus.response.ft == 0) {
    briefcaseIconElement.tintColor = Color.white()
    let briefcaseElement = frunkStack.addText('Frunk Closed')
    briefcaseElement.textColor = Color.white()
    briefcaseElement.font = Font.systemFont(14)
  } else {
    briefcaseIconElement.tintColor = Color.red()
    let briefcaseElement = frunkStack.addText('Frunk Open')
    briefcaseElement.textColor = Color.red()
    briefcaseElement.font = Font.systemFont(14)
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
