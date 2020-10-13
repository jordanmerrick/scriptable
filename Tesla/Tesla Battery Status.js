// Tesla Battery Status
// By Jordan Merrick
// jordanmerrick.com

// Use the Tesla Scriptable Widget shortcut to get your access token and car ID
const accessToken = ''
const carId = ''

// Authorization for API request header
const auth = 'Bearer ' + accessToken

// Wake the car and get information
let wakeStatus = await wakeCar()
let guiSettingsInformation = await guiSettings()
let batteryStatus = await getBatteryLevel()
let vehicleStatus = await getVehicleDetails()

// Create widget
let widget = await createWidget()

// Update the widget with the output of the script or present
// a preview if the script was run

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
    new Color("0b393e")
  ]

  widget.backgroundGradient = gradient;

  // Title stack
  let titleStack = widget.addStack()
  let titleIcon = SFSymbol.named('bolt.car.fill')
  titleIcon.applyMediumWeight()
  let titleIconElement = titleStack.addImage(titleIcon.image)
  titleIconElement.imageSize = new Size(17, 19)
    titleIconElement.tintColor = Color.white()
  titleStack.addSpacer(8)  
  let titleElement = titleStack.addText(vehicleStatus.response.vehicle_name)
  titleElement.textColor = Color.white()
  titleElement.font = Font.boldSystemFont(16)
  titleStack.addSpacer()

  widget.addSpacer()

  // Battery stack
  let batteryStack = widget.addStack()

  // Battery icon
  let boltIcon = SFSymbol.named('bolt.fill.batteryblock');
  let boltIconElement = batteryStack.addImage(boltIcon.image)
  boltIconElement.imageSize = new Size(15, 15)
  batteryStack.addSpacer(8)

  // Set color based on charging state
  if (batteryStatus.response.charging_state == 'Charging') {
    boltIconElement.tintColor = Color.green()
  } else {
    boltIconElement.tintColor = Color.white()
  }

  let batteryElement = batteryStack.addText(batteryStatus.response.battery_level + '%')
  batteryElement.textColor = Color.white()
  batteryElement.font = Font.systemFont(14)
  widget.addSpacer()

  // Range stack
  let rangeStack = widget.addStack()

  let rangeIcon = SFSymbol.named('gauge');
  let rangeIconElement = rangeStack.addImage(rangeIcon.image)
  rangeIconElement.imageSize = new Size(15, 15)
  rangeIconElement.tintColor = Color.white()
  rangeStack.addSpacer(8)

  let rangeDistance = Math.floor(batteryStatus.response.battery_range)

  // Use the car's set unit of distance and convert to km if required
  if (guiSettingsInformation.response.gui_charge_rate_units == 'mi/hr') {
    let rangeDistanceConverted = rangeDistance
    let rangeUnits = ' mi'
    let rangeElement = rangeStack.addText(rangeDistanceConverted + rangeUnits)
    rangeElement.textColor = Color.white()
    rangeElement.font = Font.systemFont(14)
  } else {
    let rangeDistanceConverted = Math.floor(rangeDistance * 1.609344)
    let rangeUnits = ' km'
    let rangeElement = rangeStack.addText(rangeDistanceConverted + rangeUnits)
    rangeElement.textColor = Color.white()
    rangeElement.font = Font.systemFont(14)
  }

  widget.addSpacer()

  // Time to charge stack
  if (batteryStatus.response.charging_state == 'Charging') {

    let timeToChargeStack = widget.addStack()

    let timeToChargeIcon = SFSymbol.named('clock.arrow.circlepath');
    let timeToChargeIconElement = timeToChargeStack.addImage(timeToChargeIcon.image)
    timeToChargeIconElement.imageSize = new Size(15, 15)
    timeToChargeIconElement.tintColor = Color.white()
    timeToChargeStack.addSpacer(8)

    function timeConvert(n) {
      let num = n
      let hours = (num / 60)
      let rhours = Math.floor(hours)
      let minutes = (hours - rhours) * 60
      let rminutes = Math.round(minutes)
      return rhours + " hr " + rminutes + " min"
    }

    let timeToChargeElement = timeToChargeStack.addText(timeConvert(batteryStatus.response.minutes_to_full_charge))
    timeToChargeElement.textColor = Color.white()
    timeToChargeElement.font = Font.systemFont(14)
    widget.addSpacer()
  }

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

// GUI settings call
async function guiSettings() {

  if (wakeStatus.response.state == 'online') {
    let guiSettingsUrl = 'https://owner-api.teslamotors.com/api/1/vehicles/' + carId + '/data_request/gui_settings'
    let guiSettingsRequest = new Request(guiSettingsUrl)
    guiSettingsRequest.method = 'get'
    guiSettingsRequest.headers = {
      'Authorization': auth,
      'Content-Type': 'application/json'
    }

    return await guiSettingsRequest.loadJSON()
  } else {
    return 'Error communicating with your car. Please try again.'
  }
}

// Charge status call
async function getBatteryLevel() {

  if (wakeStatus.response.state == 'online') {
    let chargeStateUrl = 'https://owner-api.teslamotors.com/api/1/vehicles/' + carId + '/data_request/charge_state'
    let batteryLevelRequest = new Request(chargeStateUrl)
    batteryLevelRequest.method = 'get'
    batteryLevelRequest.headers = {
      'Authorization': auth,
      'Content-Type': 'application/json'
    }

    return await batteryLevelRequest.loadJSON()

  } else {
    return 'Error communicating with your car. Please try again.'
  }
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