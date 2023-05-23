# Free-Choice: Eye-Tracker Control for Smart House with React and Electron

This is a software engineering project that utilizes React and Electron to develop an application that allows the use of eye-trackers to control a smart house. This repository provides you with the necessary information to get started and build the application.

## Prerequisites
Before you can start building this application, you need to have [Node.js](https://nodejs.org/en/download/) installed.

After cloning the repo, add an `.env` file in the root folder and define the following variables.
```
API_ENDPOINT_AUTH = 
API_ENDPOINT_LOGIN = 
API_ENDPOINT_SIGNUP = 
API_ENDPOINT_UPDATE_DEVICE =
API_ENDPOINT_GROUPS = 

FIREBASE_CONFIG_apiKey = 
FIREBASE_CONFIG_authDomain = 
FIREBASE_CONFIG_databaseURL = 
FIREBASE_CONFIG_projectId = 
FIREBASE_CONFIG_storageBucket = 
FIREBASE_CONFIG_messagingSenderId = 
FIREBASE_CONFIG_appId = 
```

### Installation
To install the dependencies, navigate to the root folder of the project and run the following command:
```
npm install
```

### Running app
To start the development server, use the following command:
```
npm run dev-server
```
The application will be available at http://localhost:3000/. If you want to develop in the Electron environment, run the following command after running the `dev-server` in another terminal instance:
```
npm run dev-client
```