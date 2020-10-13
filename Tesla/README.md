# Tesla Scriptable Widgets

Each script gets specific information about your Tesla from Tesla's API and creates a widget for you to use on the Home screen. You can also add these scripts to Siri and display them when making a Siri request.

The scripts automatically retrieves the name of your car and the unit of measurement it uses for temperature and distance. Tesla's API returns celsius and miles units so the scripts automatically convert these for you.

## Screenshot

![Screenshot](screenshot.png)

## Prerequisites

These scripts use Tesla’s (unofficial) API to get information about your car. An access token is required for authentication when making these API requests, along with a specific car’s ID. The token is initially generated using your Tesla login credentials. 

To obtain an access token and the ID of your Tesla, see the **Installation** section.

## Available scripts

Each script displays a widget of relevant information about your Tesla. If you have multiple Teslas and want to show the same information for each, duplicate the script and change the ID being used.

### Tesla Battery Status

Displays the battery level and estimated range of your Tesla in either miles or kilometers. Also displays the estimated charge time if the car is currently charging.

### Tesla Climate Status

Displays the interior and exterior temperatures in either celsius or fahrenheit. Also displays the specified climate control temperature if the car is preconditioning.

### Tesla Security Status

Displays the locked or unlocked status of the doors and whether Sentry Mode is on or off.

### Tesla Trunk and Frunk Status

Displays the open or closed status of the trunk and frunk.

## Installation

Use the following shortcuts for the Shortcuts iOS app to generate the necessary token information using your login credentials and retrieve the ID of your Tesla. If you have multiple Teslas associated with your account, you can select which ID to retrieve.

- [Scriptable Widgets for Tesla](https://www.icloud.com/shortcuts/37b6bfd5d6b94cf2b7e1e0e938ff9c89)
- [Tesla Settings](https://www.icloud.com/shortcuts/71a2986e51e8455c8a6266c053c80174)
- [Tesla Car Select](https://www.icloud.com/shortcuts/f257a5e6d75f456b91af850014e7f2c6)

The shortcuts to generate tokens and get Tesla IDs were created as part of my [Shortcuts for Tesla](https://jordanmerrick.com/shortcuts/shortcuts-for-tesla/) collection: a set of shortcuts to control and get information about your Tesla.

All three shortcuts are needed although you only need to run the Scriptable Widgets for Tesla shortcut. 

On its first run, the Tesla Settings shortcut prompts for your Tesla login credentials so it can create the access token for your account. **Your password is not saved at any point and is only used to create the token with Tesla’s API**. The shortcut then gets the ID of your Tesla. If you have more than one Tesla associated with your account, the Tesla Car Select shortcut displays a list to select from.

The token and car ID are copied to the clipboard as variables to paste into each script. For example:

```
const accessToken = 'token123'
const carId = '123id'
```

Paste this into each script so it can retrieve information about your Tesla.

## Credits

My thanks to @timdorr for his [unofficial Tesla API documentation](https://tesla-api.timdorr.com/).