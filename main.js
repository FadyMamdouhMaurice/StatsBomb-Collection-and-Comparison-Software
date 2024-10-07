// main.js

/*const { app, BrowserWindow } = require('electron');
const path = require('path');
const squirrelStartup = require('electron-squirrel-startup');

if (squirrelStartup) {
  app.quit();
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        //nodeIntegration: false,  // Disable Node.js integration for security
        //contextIsolation: true,  // Enable context isolation for security
        //enableRemoteModule: false // Disable remote module for security
    },
  });

    mainWindow.loadFile('homeScreenHtml.html');

 
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});*/


const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// Default save folder (adjust as needed)
//const defaultSaveFolder = path.join(app.getPath('downloads'), 'FeedBack Videos');
const defaultSaveFolder = path.join('C:', 'FeedBack Videos'); 

//localStorage.setItem('videosSavedFolderPath', JSON.stringify(defaultSaveFolder)); // Save to localStorage
//store.set('videosSavedFolderPath', defaultSaveFolder); // Save to store

if (!fs.existsSync(defaultSaveFolder)) {
    fs.mkdirSync(defaultSaveFolder);
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    mainWindow.maximize(); // This will maximize the window
    mainWindow.loadFile('homeScreenHtml.html');
}

app.whenReady().then(createWindow);

ipcMain.on('save-video-segment', (event, { videoPath, eventName, startTime, duration }) => {
    // Helper function to format time as HH:MM:SS
    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
    };

    // Format start time for filename
    const formattedStartTime = formatTime(startTime + 2);

    // Create a sanitized event name (remove invalid characters for filenames)
    const sanitizedEventName = eventName.replace(/[<>:"/\\|?*]/g, '');

    // Define the output path for the video segment with formatted start time and event name
    const filePath = path.join(defaultSaveFolder, `${formattedStartTime}_${sanitizedEventName}.mp4`);

    ffmpeg(videoPath)
        .setStartTime(startTime) // Start time for the segment
        .setDuration(duration) // Duration of the segment (in seconds)
        .output(filePath)
        .on('end', () => {
            //console.log('Video segment saved successfully:', filePath);
        })
        .on('error', (err) => {
            console.error('Error cutting video:', err);
        })
        .run();
});