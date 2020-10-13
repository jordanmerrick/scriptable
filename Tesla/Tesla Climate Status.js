// Tesla Climate Status
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
let climateStatus = await getClimateDetails()
let vehicleStatus = await getVehicleDetails()

// Create widget
let widget = await createWidget()

if (config.runsInWidget) {

  Script.setWidget(widget)

} else {

  widget.presentSmall()

}

Script.complete()

// Temperature conversion
function tempConvert(n) {
  let conversion = n * 9 / 5 + 32
  return conversion
}

async function createWidget() {

  // Create widget
  let widget = new ListWidget();

  // Widget color
  let gradient = new LinearGradient()

  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("090f03"),
    new Color("11224e")
  ]

  widget.backgroundGradient = gradient;

  // Title stack
  let titleStack = widget.addStack()
  let titleIcon = SFSymbol.named('snow')
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

  // Inside temperature stack
  let insideTempStack = widget.addStack()

  // Temperature icon
  let insideTempIcon = SFSymbol.named('thermometer');
  let insideTempIconElement = insideTempStack.addImage(insideTempIcon.image)
  insideTempIconElement.imageSize = new Size(15, 15)
  insideTempStack.addSpacer(4)
  insideTempIconElement.tintColor = Color.white()

  let insideTempValue = Math.round(climateStatus.response.inside_temp)

  // Use the car's set unit of temperature and convert to F if required
  if (guiSettingsInformation.response.gui_temperature_units == 'C') {
    let insideTempValueConverted = Math.round(insideTempValue)
    let tempUnits = 'ºC'
    let insideTempElement = insideTempStack.addText((insideTempValueConverted.toString()) + tempUnits)
    insideTempElement.textColor = Color.white()
    insideTempElement.font = Font.systemFont(14)
  } else {
    let insideTempValueConverted = Math.round(insideTempValue * 9 / 5 + 32)
    let tempUnits = 'ºF'
    let insideTempElement = insideTempStack.addText((insideTempValueConverted.toString()) + tempUnits)
    insideTempElement.textColor = Color.white()
    insideTempElement.font = Font.systemFont(14)
  }

  widget.addSpacer()

  // Outside temperature stack
  let outsideTempStack = widget.addStack()

  // Temperature icon
  let outsideTempIcon = SFSymbol.named('cloud.sun');
  let outsideTempIconElement = outsideTempStack.addImage(outsideTempIcon.image)
  outsideTempIconElement.imageSize = new Size(15, 15)
  outsideTempStack.addSpacer(4)
  outsideTempIconElement.tintColor = Color.white()

  let outsideTempValue = Math.round(climateStatus.response.outside_temp)

  // Use the car's set unit of temperature and convert to F if required
  if (guiSettingsInformation.response.gui_temperature_units == 'C') {
    let outsideTempValueConverted = Math.round(outsideTempValue)
    let tempUnits = 'ºC'
    let outsideTempElement = outsideTempStack.addText((outsideTempValueConverted.toString()) + tempUnits)
    outsideTempElement.textColor = Color.white()
    outsideTempElement.font = Font.systemFont(14)
  } else {
    let outsideTempValueConverted = Math.round(outsideTempValue * 9 / 5 + 32)
    let tempUnits = 'ºF'
    let outsideTempElement = outsideTempStack.addText((outsideTempValueConverted.toString()) + tempUnits)
    outsideTempElement.textColor = Color.white()
    outsideTempElement.font = Font.systemFont(14)
  }

  widget.addSpacer()

  // Precondition temperature stack
  if (climateStatus.response.is_preconditioning) {
    let preconditionTempStack = widget.addStack()

    // Temperature icon
    let preconditionTempIcon = SFSymbol.named('wind');
    let preconditionTempIconElement = preconditionTempStack.addImage(preconditionTempIcon.image)
    preconditionTempIconElement.imageSize = new Size(15, 15)
    preconditionTempStack.addSpacer(4)
    preconditionTempIconElement.tintColor = Color.green()

    let preconditionTempValue = Math.round(climateStatus.response.driver_temp_setting)

    // Use the car's set unit of temperature and convert to F if required
    if (guiSettingsInformation.response.gui_temperature_units == 'C') {
      let preconditionTempValueConverted = Math.round(preconditionTempValue)
      let tempUnits = 'ºC'
      let preconditionTempElement = preconditionTempStack.addText((preconditionTempValueConverted.toString()) + tempUnits)

      preconditionTempElement.textColor = Color.white()
      preconditionTempElement.font = Font.systemFont(14)
    } else {
      let preconditionTempValueConverted = Math.round(preconditionTempValue * 9 / 5 + 32)
      let tempUnits = 'ºF'
      let preconditionTempElement = preconditionTempStack.addText((preconditionTempValueConverted.toString()) + tempUnits)

      preconditionTempElement.textColor = Color.white()
      preconditionTempElement.font = Font.systemFont(14)
    }

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

  let wakeStatus = await wakeCar()

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

// Climate status call
async function getClimateDetails() {

  if (wakeStatus.response.state == 'online') {

    let climateDetailsUrl = 'https://owner-api.teslamotors.com/api/1/vehicles/' + carId + '/data_request/climate_state'
    let climateDetailsRequest = new Request(climateDetailsUrl)
    climateDetailsRequest.method = 'get'
    climateDetailsRequest.headers = {
      'Authorization': auth,
      'Content-Type': 'application/json'
    }

    return await climateDetailsRequest.loadJSON()

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
