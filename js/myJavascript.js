var saveSuccess = false;
var sweeper = false;
var noTouched = false;
var shotOpen = false;
var shotFreeKickAndPenalty = false;
var shotCor = false;
var shotKick = false;
var shotCh = false;
var pressureDuration;
var passDuration;
var shotDuration;
var passCor = false;
var passComp = false;
var advantageChain = false;
var completeDribble = false;
var chain = false;
let event = "";
let events = []; // List to store each text value
let nextEventId = 1; // To generate unique IDs for events
var ActionTime;

// Global variables for extra attributes
let extra1 = null;
let extra2 = null;
let extra3 = null;
let extra4 = null;
let extra5 = null;
let extra6 = null;

function resetExtras() {
    extra1 = null;
    extra2 = null;
    extra3 = null;
    extra4 = null;
    extra5 = null;
    extra6 = null;
}

function downloadExcel() {
    generateExcel(events);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.round((seconds % 1) * 100);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secs.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
} 

(function localFileVideoPlayerInit(win) {
    
    var URL = win.URL || win.webkitURL,
        displayMessage = (function displayMessageInit() {
            var node = document.querySelector('#message');
            return function displayMessage(message, isError) {
                node.innerHTML = message;
                node.className = isError ? 'error' : 'info';
            };
        }()),


        playSelectedFile = function playSelectedFileInit(event) {
            var file = this.files[0],
				//type = file.type,
				//HTML Element video
                videoNode = document.querySelector('video'),
                fileURL = URL.createObjectURL(file);
            videoNode.src = fileURL;
            videoNode.muted = true; // Mute the video3

            //synchronize your events list with the video time and automatically scroll to highlight the event
            videoNode.addEventListener('timeupdate', function () {
                syncEventWithVideoTime(videoNode.currentTime);
            });


            document.addEventListener('keydown', function (event) {
                if (event.key === 'Delete') {
                    deleteHighlightedEvent();
                }
            });

            /*function handleEvent(eventType, actionTime) {
                event = JSON.stringify({
                    time: formatTime(actionTime),
                    Event: eventType,
                });

                events.push(event); // Store text in the list
                addEventToList(formatTime(actionTime), eventType, actionTime);
                compareEvents(event);
                renderEvents();

                // Reset extras after handling the event
                resetExtras();
            }*/

            // Updated handleEvent to accept extra attributes
            function handleEvent(eventType, actionTime, extra1 = null, extra2 = null, extra3 = null, extra4 = null, extra5 = null, extra6 = null) {
                // Create an event object
                const event = {
                    time: formatTime(actionTime),
                    Event: eventType,
                    extras: {
                        extra1: extra1 || null,
                        extra2: extra2 || null,
                        extra3: extra3 || null,
                        extra4: extra4 || null,
                        extra5: extra5 || null,
                        extra6: extra6 || null,
                    }
                };

                // Add extra attributes to the event object if they are not null
                /*if (extra1) event.extra1 = extra1;
                if (extra2) event.extra2 = extra2;
                if (extra3) event.extra3 = extra3;
                if (extra4) event.extra4 = extra4;
                if (extra5) event.extra5 = extra5;
                if (extra6) event.extra6 = extra6;*/

                // Convert the event object to a JSON string and store it in the events list
                events.push(JSON.stringify(event));

                // Add the event to the list display
                addEventToList(formatTime(actionTime), eventType, actionTime, true, event.extras);
                // Compare events and render the updated events
                compareEvents(event);
                renderEvents();

                // Reset extras after handling the event
                resetExtras();
            }

            function pressure() {
                videoNode.pause();
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('pressureDivOpen').style.visibility = "visible";
                pressureDuration = videoNode.currentTime;
                ActionTime = videoNode.currentTime;
                event = 'Pressure';
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
                //handleEvent("Pressure", ActionTime);
            }

            function endPressure() {
                document.getElementById('pressureDivOpen').style.visibility = "hidden";
                document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'End Pressure';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);


                //handleEvent("End Pressure", ActionTime);
            }

            function shot() {
                videoNode.pause();
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('shotDivOpen').style.visibility = "visible";
                shotDuration = videoNode.currentTime;
                ActionTime = videoNode.currentTime;
                event = 'Shot';

                //handleEvent("Shot", ActionTime);
            }
            function shotChain() {
                videoNode.pause();
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayDivOpen').style.visibility = "visible";
                shotCh = true;
                shotDuration = videoNode.currentTime;
                ActionTime = videoNode.currentTime;
                event = 'Shot';

                //handleEvent("Shot", ActionTime);
            }

            function pass() {
                videoNode.pause();
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "visible";
                passDuration = videoNode.currentTime;
                ActionTime = videoNode.currentTime;
                event = 'pass';
               
                //handleEvent("Pass", ActionTime);
            }

            function passChain() {
                videoNode.pause();
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('passChainHeightDivOpen').style.visibility = "visible";
                passDuration = videoNode.currentTime;
                ActionTime = videoNode.currentTime;
                event = 'pass';

                //handleEvent("Pass", ActionTime);
            }

            function halfStart() {
                document.getElementById('startDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Half Start';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                //handleEvent("Half Start", ActionTime);
            }

            function duel() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('duelDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Duel';

                //handleEvent("Duel", ActionTime);
            }
            function tackle() {
                document.getElementById('duelDivOpen').style.visibility = "hidden";
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "visible";
                extra1 = 'tackle';

            }
            function won() {
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "visible";
                chain = true;
                extra2 = 'won';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function successIn() {
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'success In';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function successOut() {
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'success Out';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function lostIn() {
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'Lost In';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function lostOut() {
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'Lost Out';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function aerialLost() {
                document.getElementById('duelDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra1 = 'Aerial Lost';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);


            }
            function block() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('blockDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Block';
                //handleEvent("Block", ActionTime);
            }
            function blockDefensive() {
                document.getElementById('blockDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra1 = 'Defensive';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function blockOffensive() {
                document.getElementById('blockDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra1 = 'Offensive';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function foulcommitted() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Foul Committed';
                
                //handleEvent("Foul Committed", ActionTime);

            }
            function noCard() {
                document.getElementById('foulCommittedDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "visible";
                extra1 = 'No Card';
            }
            function yellowCard() {
                document.getElementById('foulCommittedDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "visible";
                extra1 = 'Yellow Card';
            }
            function secondYellowCard() {
                document.getElementById('foulCommittedDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "visible";
                extra1 = 'Second Yellow';
            }
            function redCard() {
                document.getElementById('foulCommittedDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "visible";
                extra1 = 'Red Card';
            }
            function foulReguler() {
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'Regular';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function foulHandball() {
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'HandBall';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function foulOut() {
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'Foul Out';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function foul6Seconds() {
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = '6 Seconds';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function foulBackPass() {
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'BackPass';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function foulDangerousPlay() {
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'Dangerous Play';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function foulDive() {
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'Dive';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function dribblePast() {
                document.getElementById('dribblePastBtn').focus();
                ActionTime = videoNode.currentTime;
                event = "Dribble Past";
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }

            /******************************** PASS FUNCTION NOT COMPLETED *******************************/


            /***************************** PASS TYPE *************************/

            function interceptionPass() {
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility = "visible";
                extra1 = 'Interception';
               
            }
            function recoveryPass() {
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility = "visible";
                extra1 = 'Recovery';
            }
            function kickOffPass() {
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "visible";
                extra1 = 'Kick-off';

            }
            function freeKickPass() {
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "visible";
                extra1 = 'Free Kick';

            }
            function cornerPass() {
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "visible";
                passCor = true;
                extra1 = 'Corner';

            }
            function throwInPass() {
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainThrowInHeightDivOpen').style.visibility = "visible";
                extra1 = 'Throw-in';

            }
            function goalKickPass() {
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "visible";
                extra1 = 'Goal Kick';

            }
            /***************************** PASS height *************************/

            function groundPass() {
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainBodyDivOpen').style.visibility = "visible";
                passDuration = videoNode.currentTime;
                ActionTime = videoNode.currentTime;
                event = 'Pass';
                extra2 = 'Ground';

            }
            function lowPass() {
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainBodyDivOpen').style.visibility = "visible";
                event = 'Pass';
                extra2 = 'Low';

            }
            function highPass() {
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainBodyDivOpen').style.visibility = "visible";
                event = 'Pass';
                extra2 = 'High';

            }
            function groundPassRecoveryAndInterception() {
                document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility = "visible";
                extra2 = 'Ground';

            }
            function lowPassRecoveryAndInterception() {
                document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility = "visible";
                extra2 = 'Low';
}
            function highPassRecoveryAndInterception() {
                document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility = "visible";
                extra2 = 'High';
}
            function lowPassThrowIn() {
                document.getElementById('passNoChainThrowInHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra2 = 'Low';
}
            function highPassThrowIn() {
                document.getElementById('passNoChainThrowInHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra2 = 'High';
}

            /***************************** PASS BODY *************************/

            function rightFoot() {
                document.getElementById('passNoChainBodyDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Right Foot';
            }
            function leftFoot() {
                document.getElementById('passNoChainBodyDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Left Foot';

            }
            function head() {
                document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Head';

            }
            function other() {
                document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Other';

            }

            /***************************** PASS DURATION *************************/
            /***************************** PASS OUTCOME *************************/
            function passDefault() {
                document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "visible";
            }
            function passComplete() {
                passComp = true;
                document.getElementById('passDurationDivOpen').style.visibility = "hidden";
                document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "hidden";
                extra4 = 'Complete';
                if (passCor) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "visible";
                }
                else if (!passCor) {
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
                }
                
            }
            function passInComplete() {
                document.getElementById('passDurationDivOpen').style.visibility = "hidden";
                document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "hidden";
                extra4 = 'InComplete';

                if (passCor) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "visible";
                }
                else if (!passCor) {
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                }
                chain = false;
            }
            function passOut() {
                document.getElementById('passDurationDivOpen').style.visibility = "hidden";
                document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "hidden";
                extra4 = 'Out';
                if (passCor) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "visible";
                }
                else if (!passCor) {
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                }
                chain = false;
            }
            function passOffside() {
                document.getElementById('passDurationDivOpen').style.visibility = "hidden";
                document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "hidden";
                extra4 = 'Offside';
                if (passCor) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "visible";
                }
                else if (!passCor) {
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                }
                chain = false;
            }
            function passInjuryClearance() {
                document.getElementById('passDurationDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "hidden";
                extra4 = 'Injury Clearance';
                if (passCor) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "visible";
                }
                else if (!passCor) {
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
                }
                chain = false;
            }
            function passUnknown() {
                document.getElementById('passDurationDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "hidden";
                extra4 = 'Unknown';
                if (passCor) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "visible";
                }
                else if (!passCor) {
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                }
                chain = false;
            }
            /***************************** CORNER TECHNIQUE  *************************/
            function inswinging() {
                passCor = false;
                extra5 = 'inswinging';
                if (passComp) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                    passComp = false;
                }
                else if (!passComp) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                }
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function outswinging() {
                passCor = false;
                extra5 = 'outswinging';

                if (passComp) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                    passComp = false;
                }
                else if (!passComp) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                }
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function straight() {
                passCor = false;
                extra5 = 'straight';
                if (passComp) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                    passComp = false;
                }
                else if (!passComp) {
                    document.getElementById('cornerTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                }
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            /******************************** PASS FUNCTION *******************************/

            function clearance() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('clearanceDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Clearance';
                //handleEvent("Clearance", ActionTime);
            }
            function leftFootClearance() {
                document.getElementById('clearanceDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra1 = 'Left Foot';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function rightFootClearance() {
                document.getElementById('clearanceDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra1 = 'Right Foot';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function headClearance() {
                document.getElementById('clearanceDivOpen').style.visibility = "hidden";
                document.getElementById('headClearanceDivOpen').style.visibility = "visible";
                extra1 = 'Head';
            }
            function regular() {
                document.getElementById('headClearanceDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'Regular';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function aerialWon() {
                document.getElementById('headClearanceDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'Aerial Won';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function otherClearance() {
                document.getElementById('clearanceDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra1 = 'Other';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }


            /************************** PRESSURE NOT COMPLETED **************************/

            /************************** GOAL KEEPER **************************/
            function goalKeeper() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('goalKeeperDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Goal Keeper';
                //handleEvent("goal Keeper", ActionTime);
            }
            /****** TYPE OF GOAL KEEPER ******/
            function collected() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('collectedDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Collected";
                
            }
            function punch() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('punchDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Punch";
            }
            function smother() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('smotherDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Smother";
            }
            function goalSaved() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('savedDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Saved";
            }
            function shotFaced() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('shotFacedDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Shot Faced";
            }
            function keeperSweeper() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('keeperSweeperDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Sweeper";
            }
            function goalConceded() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('goalAndPenaltyConcededDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Goal Conceded";

            }
            function penaltyConceded() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('goalAndPenaltyConcededDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Penalty Conceded";
                        
            }
            function penaltySaved() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "visible";
                document.getElementById('savedDivOpen').style.visibility = "hidden";
                ActionTime = videoNode.currentTime;
                extra1 = "Penalty Saved";

            }
            function save() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('savedDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Save";

            }
            function shotSavedOffT() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('savedDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Saved Off-Target";

            }
            function savedToPost() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('savedToPostDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Saved To Post";
            }
            function shotSavedToPostKeeper() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('savedToPostDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Shot Saved To Post";
            }
            function penaltySavedToPost() {
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('savedToPostDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                extra1 = "Penalty Saved To Post";
            }
            /****** OUTCOME OF GOAL KEEPER *****/
            function collectedSuccess() {
                document.getElementById('collectedDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "visible";
                chain = true;
                extra2 = "Success";
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function collectedFail() {
                document.getElementById('collectedDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = "Fail";
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function collectedTwice() {
                document.getElementById('collectedDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "visible";
                chain = true;
                extra2 = "Collected Twice";
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function punchFail() {
                document.getElementById('punchDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'Fail';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function punchInPlaySafe() {
                document.getElementById('punchDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'In Play Safe';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function punchInPlayDanger() {
                document.getElementById('punchDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'In Play Danger';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function punchOut() {
                document.getElementById('punchDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'Out';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function smotherWon() {
                document.getElementById('smotherDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "visible";
                chain = true;
                extra2 = 'Won';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function smotherLostInPlay() {
                document.getElementById('smotherDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'Lost In Play';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function smotherLostOut() {
                document.getElementById('smotherDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'Lost Out';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function smotherSuccessInPlay() {
                document.getElementById('smotherDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'Success In Play';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function smotherSuccessOut() {
                document.getElementById('smotherDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra2 = 'Success Out';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function savedSuccess() {
                document.getElementById('savedDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedStateDivOpen').style.visibility = "visible";
                saveSuccess = true;
                chain = true;
                extra2 = 'Success';

            }
            function savedInPlaySafe() {
                document.getElementById('savedToPostDivOpen').style.visibility = "hidden";
                document.getElementById('savedDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedStateDivOpen').style.visibility = "visible";
                saveSuccess = false;
                extra2 = 'In Play Safe';

            }
            function savedInPlayDanger() {
                document.getElementById('savedToPostDivOpen').style.visibility = "hidden";
                document.getElementById('savedDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedStateDivOpen').style.visibility = "visible";
                saveSuccess = false;
                extra2 = 'In Play Danger';

            }
            function savedTwice() {
                document.getElementById('savedDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedStateDivOpen').style.visibility = "visible";
                saveSuccess = true;
                chain = true;
                extra2 = 'Saved Twice';

            }
            function savedTouchOut() {
                document.getElementById('savedToPostDivOpen').style.visibility = "hidden";
                document.getElementById('savedDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedStateDivOpen').style.visibility = "visible";
                saveSuccess = false;
                extra2 = 'Touched Out';

            }
            function keeperSweeperClear() {
                document.getElementById('keeperSweeperDivOpen').style.visibility = "hidden";
                document.getElementById('goalKeeperBodyDivOpen').style.visibility = "visible";
                sweeper = true;
                extra2 = 'Clear';

            }
            function keeperSweeperClaim() {
                document.getElementById('keeperSweeperDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "visible";
                chain = true;
                extra2 = 'Claim';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function goalAndPenaltyConcededTouchedIn() {
                document.getElementById('goalAndPenaltyConcededDivOpen').style.visibility = "hidden";
                noTouched = false;
                document.getElementById('shotSavedStateDivOpen').style.visibility = "visible";
                extra2 = 'Touched In';
            }
            function goalAndPenaltyConcededNoTouch() {
                document.getElementById('goalAndPenaltyConcededDivOpen').style.visibility = "hidden";
                noTouched = true;
                document.getElementById('shotSavedStateDivOpen').style.visibility = "visible";
                extra2 = 'No Touch';

            }
            /****** STATE OF GOAL KEEPER *****/
            function shotSavedStateSet() {
                if (noTouched) {
                    document.getElementById('shotSavedStateDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";

                }
                else if (!noTouched) {
                    document.getElementById('shotSavedStateDivOpen').style.visibility = "hidden";
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "visible";
                }
                extra3 = 'Set';
                sweeper = false;
            }
            function shotSavedStateProne() {
                if (noTouched) {
                    document.getElementById('shotSavedStateDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";
                }
                else if (!noTouched) {
                    document.getElementById('shotSavedStateDivOpen').style.visibility = "hidden";
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "visible";
                }
                extra3 = 'Prone';
                sweeper = false;
            }
            function shotSavedStateMoving() {
                if (noTouched) {
                    document.getElementById('shotSavedStateDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";
                }
                else if (!noTouched) {
                    document.getElementById('shotSavedStateDivOpen').style.visibility = "hidden";
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "visible";
                }
                extra3 = 'Moving';
                sweeper = false;
            }
            function shotFacedSet() {
                document.getElementById('shotFacedDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra3 = 'Set';
            }
            function shotFacedProne() {
                document.getElementById('shotFacedDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra3 = 'Prone';

            }
            function shotFacedMoving() {
                document.getElementById('shotFacedDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra3 = 'Moving';

            }
            /****** BODY PART OF GOAL KEEPER *****/
            function goalBothHands() {
                extra4 = 'Both Hands';

                if (sweeper) {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                } else {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";

                }
            }
            function goalRightFoot() {
                extra4 = 'Right Foot';

                if (sweeper) {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                } else {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";

                }
            }
            function goalLeftFoot() {
                extra4 = 'Left Foot';

                if (sweeper) {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                } else {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";

                }
            }
            function goalHead() {
                extra4 = 'Head';

                if (sweeper) {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                } else {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";

                }
            }
            function goalRightHand() {
                extra4 = 'Right Hand';

                if (sweeper) {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                } else {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";

                }
            }
            function goalLeftHand() {
                extra4 = 'Left Hand';

                if (sweeper) {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
                } else {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";
                }
            }
            function goalChest() {
                extra4 = 'Chest';

                if (sweeper) {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    // Call handleEvent and pass the extras
                    handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
                } else {
                    document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "visible";
                }
            }
            /****** TECHNIQUE OF GOAL KEEPER *****/
            function shotSavedDiving() {
                extra5 = 'Diving';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                if (saveSuccess) {
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                }
                else if (!saveSuccess) {
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                }
            }
            function shotSavedStanding() {
                extra5 = 'Standing';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

                if (saveSuccess) {
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                }
                else if (!saveSuccess) {
                    document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                }
            }
            /************************** GOAL KEEPER **************************/

            function ballRecovery() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('ballRecoveryDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Ball Recovery';
                //handleEvent("Ball Recovery", ActionTime);
            }
            function ballRecoveryComplete() {
                document.getElementById('ballRecoveryDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "visible";
                chain = true;
                extra1 = 'Complete';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function ballRecoveryFail() {
                document.getElementById('ballRecoveryDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra1 = 'Fail';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }

            /************************** SHOT NOT CHAIN **************************/


            function shotOpenPlay() {
                document.getElementById('shotDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayDivOpen').style.visibility = "visible";
                shotOpen = true;
                extra1 = 'Open Play';

            }
            function shotFreeKick() {
                document.getElementById('shotDivOpen').style.visibility = "hidden";
                document.getElementById('shotChainDivOpen').style.visibility = "visible";
                shotFreeKickAndPenalty = true;
                extra1 = 'Free Kick';
            }
            function shotPenalty() {
                document.getElementById('shotDivOpen').style.visibility = "hidden";
                document.getElementById('shotChainDivOpen').style.visibility = "visible";
                shotFreeKickAndPenalty = true;
                extra1 = 'Penalty';
            }
            function shotCorner() {
                document.getElementById('shotDivOpen').style.visibility = "hidden";
                document.getElementById('shotChainDivOpen').style.visibility = "visible";
                shotCor = true;
                extra1 = 'Corner';
            }
            function shotKickOff() {
                document.getElementById('shotDivOpen').style.visibility = "hidden";
                document.getElementById('shotChainDivOpen').style.visibility = "visible";
                shotKick = true;
                extra1 = 'Kick Off';
            }
            function rightFootShot() {
                extra2 = 'Right Foot';
                if (shotOpen || shotCh) {
                    document.getElementById('shotOpenPlayDivOpen').style.visibility = "hidden";
                    document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "visible";
                    shotOpen = false;
                }
                else if (shotFreeKickAndPenalty) {
                    document.getElementById('shotChainDivOpen').style.visibility = "hidden";
                    document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "visible";
                }
                else if (shotCor) {
                    document.getElementById('shotChainDivOpen').style.visibility = "hidden";
                    document.getElementById('shotDurationDivOpen').style.visibility = "visible";
                }
                else if (shotKick) {
                    document.getElementById('shotChainDivOpen').style.visibility = "hidden";
                    document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "visible";
                }
            }
            function leftFootShot() {
                extra2 = 'Left Foot';
                if (shotOpen || shotCh) {
                    document.getElementById('shotOpenPlayDivOpen').style.visibility = "hidden";
                    document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "visible";
                    shotOpen = false;
                }
                else if (shotFreeKickAndPenalty) {
                    document.getElementById('shotChainDivOpen').style.visibility = "hidden";
                    document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "visible";
                }
                else if (shotCor) {
                    document.getElementById('shotChainDivOpen').style.visibility = "hidden";
                    document.getElementById('shotDurationDivOpen').style.visibility = "visible";
                }
                else if (shotKick) {
                    document.getElementById('shotChainDivOpen').style.visibility = "hidden";
                    document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "visible";
                }
            }
            function headShot() {
                extra2 = 'Head';
                document.getElementById('shotOpenPlayDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "visible";
            }
            function otherShot() {
                extra2 = 'Other';
                document.getElementById('shotOpenPlayDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "visible";
            }

            function shotNormal() {
                extra3 = 'Normal';
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "visible";
                
            }
            function shotVolley() {
                extra3 = 'Volley';
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "visible";
            }
            function shotHalfVolley() {
                extra3 = 'Half Volley';
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "visible";
            }
            function shotDivingHeader() {
                extra3 = 'Diving Header';
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "visible";
            }
            function shotOverheadKick() {
                extra3 = 'Overhead Kick';
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "visible";
            }
            function shotLob() {
                extra3 = 'Lob';
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "visible";
            }
            function shotBackheel() {
                extra3 = 'Backheel';
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "visible";
            }
            /************************** SHOT NOT CHAIN **************************/

            function interception() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Interception';
                 
                //handleEvent("Interception", ActionTime);
            }

            function foulWon() {
                if (document.getElementById('chainDivOpen').style.visibility === "visible") {
                    advantageChain = true;
                    document.getElementById('chainDivOpen').style.visibility = "hidden";
                }
                else if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                    document.getElementById('noChainDivOpen').style.visibility = "hidden";
                }
                document.getElementById('foulWonNoChainDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Foul Won';
                //handleEvent("Foul Won", ActionTime);
            }
            function notPenalty() {
                document.getElementById('foulWonNoChainDivOpen').style.visibility = "hidden";
                document.getElementById('notPenaltyNoChainDivOpen').style.visibility = "visible";
                extra1 = 'Not Penalty';
            }
            function notAdvantageNoChain() {
                document.getElementById('notPenaltyNoChainDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra2 = 'Not Advantage';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function advantageNoChain() {
                document.getElementById('notPenaltyNoChainDivOpen').style.visibility = "hidden";
                if (advantageChain) {
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                }
                else if (!advantageChain) {
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                }
                advantageChain = false;
                extra2 = 'Advantage';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function penalty() {
                document.getElementById('foulWonNoChainDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                extra1 = 'Penalty';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function shield() {
                ActionTime = videoNode.currentTime;
                event = 'Shield';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }


            function fiftyFifty() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('fiftyFiftyDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Fifty Fifty';
                //handleEvent("Fifty Fifty", ActionTime);

            }
            function fiftyWon() {
                document.getElementById('fiftyFiftyDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "visible";
                chain = true;
                extra1 = 'Won';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function successToTeam() {
                document.getElementById('fiftyFiftyDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";

                extra1 = 'Success To Team';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
}
            function successToOpposition() {
                document.getElementById('fiftyFiftyDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";

                extra1 = 'Success To Opposition';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function lost() {
                document.getElementById('fiftyFiftyDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";

                extra1 = 'Lost';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function refereeBallDrop() {
                ActionTime = videoNode.currentTime;
                event = 'Referee Ball-Drop';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }

            function ownGoalAgainst() {
                ActionTime = videoNode.currentTime;
                event = 'Own Goal Against';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function ownGoalFor() {
                ActionTime = videoNode.currentTime;
                 
                event = 'Own Goal For';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function error() {
                ActionTime = videoNode.currentTime;
                event = 'Error';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }

            function offside() {
                ActionTime = videoNode.currentTime;
                event = 'Offside';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }

            function badBehaviour() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('badBehaviourDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
               
                event = 'Bad Behaviour';
            }
            function yellowCardBad() {
                document.getElementById('badBehaviourDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra1 = 'Yellow Card';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function secondYellowCardBad() {
                document.getElementById('badBehaviourDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;

                extra1 = 'Second Yellow';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function redCardBad() {
                document.getElementById('badBehaviourDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;

                extra1 = 'Red Card';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function halfEnd() {
                ActionTime = videoNode.currentTime;
                event = 'Half End';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
                compareAllUserEvents(events);
            }

            function injuryStoppage() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('injuryStoppageDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Injury Stoppage';
            }
            function injuryInChain() {
                document.getElementById('injuryStoppageDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra1 = 'In Chain';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function injuryNotInChain() {
                document.getElementById('injuryStoppageDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                extra1 = 'Not In Chain';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }

            /********************************** CHAIN ACTIONS **********************************************/

            function groundPassChain() {
                document.getElementById('passChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('groundPassChainDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Pass';
                extra2 = 'Ground';

            }
            function lowPassChain() {
                document.getElementById('passChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "visible";
                extra2 = 'Low';
            }
            function highPassChain() {
                document.getElementById('passChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "visible";
                extra2 = 'High';
            }
            function rightFootPassChain() {
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Right Foot';

            }
            function leftFootPassChain() {
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Left Foot';
            }
            function otherPassChain() {
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Other';
            }
            function headPassChain() {
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Head';
            }
            function keeperArmPassChain() {
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Keeper Arm';
            }
            function noTouchPassChain() {
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'No Touch';
            }
            function dropKickPassChain() {
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "visible";
                extra3 = 'Drop Kick';
            }
            function dispossessed() {
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                chain = false;
                ActionTime = videoNode.currentTime;
                event = 'Dispossessed';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function dribble() {
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('dribbleDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Dribble';
            }
            function dribbleComplete() {
                completeDribble = true;
                document.getElementById('dribbleDivOpen').style.visibility = "hidden";
                document.getElementById('dribbleOverrunDivOpen').style.visibility = "visible";
                chain = true;
                extra1 = 'Complete';
            }
            function dribbleInComplete() {
                document.getElementById('dribbleDivOpen').style.visibility = "hidden";
                document.getElementById('dribbleOverrunDivOpen').style.visibility = "visible";
                extra1 = 'InComplete';
            }
            function overrun() {
                extra2 = 'Overrun';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
                document.getElementById('dribbleOverrunDivOpen').style.visibility = "hidden";
                if (completeDribble) {
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                    completeDribble = false;
                }
                else {
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    chain = false;
                }
            }
            function notOverrun() {
                extra2 = 'Not Overrun';

                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
                document.getElementById('dribbleOverrunDivOpen').style.visibility = "hidden";
                if (completeDribble) {
                    document.getElementById('chainDivOpen').style.visibility = "visible";
                    completeDribble = false;
                }
                else {
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                    chain = false;
                }
            }
            function miscontrol() {
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('headClearanceDivOpen').style.visibility = "visible";
                ActionTime = videoNode.currentTime;
                event = 'Miscontrol';
                //handleEvent("Miscontrol", ActionTime);

            }
            function shotBlock() {
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                shotCh = false;
                chain = false;
                //ActionTime = videoNode.currentTime;
                extra4 = 'Block';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function shotGoal() {
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                shotCh = false;
                chain = false;
                //ActionTime = videoNode.currentTime;
                extra4 = 'Goal';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);
            }
            function shotSaved() {
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                shotCh = false;
                chain = false;
                //ActionTime = videoNode.currentTime;
                extra4 = 'Saved';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function shotOffT() {
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                shotCh = false;
                chain = false;
                //ActionTime = videoNode.currentTime;
                extra4 = 'Off-Target';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function shotPost() {
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                shotCh = false;
                chain = false;
                //ActionTime = videoNode.currentTime;
                extra4 = 'Post';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function shotWayward() {
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                shotCh = false;
                chain = false;
                //ActionTime = videoNode.currentTime;
                extra4 = 'Wayward';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function shotSavedToPost() {
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                shotCh = false;
                chain = false;
                //ActionTime = videoNode.currentTime;
                extra4 = 'SAved To Post';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }
            function savedOffT() {
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
                shotCh = false;
                chain = false;
                //ActionTime = videoNode.currentTime;
                extra4 = 'Saved Off-Target';
                // Call handleEvent and pass the extras
                handleEvent(event, ActionTime, extra1, extra2, extra3, extra4, extra5, extra6);

            }

            /*-------------------------------CLICKED BUTTONS----------------------------------*/
            function goBack() {
                window.history.back();
            }

            function cancel() {

                // Reset extras after handling the event
                resetExtras();

                if (document.getElementById('pressureDivOpen').style.visibility === "visible" || document.getElementById('endPressureDivOpen').style.visibility === "visible") {
                    document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                    document.getElementById('pressureDivOpen').style.visibility = "hidden";
                    document.getElementById('noChainDivOpen').style.visibility = "visible";
                   
                }

                else if (document.getElementById('shotDurationDivOpen').style.visibility === "visible") {
                    if (shotCh) {
                        document.getElementById('chainDivOpen').style.visibility = "visible";
                        document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                        shotCh = false;
                    } else if (!shotCh) {
                        document.getElementById('noChainDivOpen').style.visibility = "visible";
                        document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                    }

                }
                else if (document.getElementById('passDurationDivOpen').style.visibility === "visible") {
                    if (chain) {
                        chainEsc();
                    }
                    else
                        noChainEsc();
                }
            }
            function chainEsc() {
                document.getElementById('noChainDivOpen').style.visibility = "hidden";
                document.getElementById('duelDivOpen').style.visibility = "hidden";
                document.getElementById('blockDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('clearanceDivOpen').style.visibility = "hidden";
                document.getElementById('pressureDivOpen').style.visibility = "hidden";
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('ballRecoveryDivOpen').style.visibility = "hidden";
                document.getElementById('shotDivOpen').style.visibility = "hidden";
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('foulWonNoChainDivOpen').style.visibility = "hidden";
                document.getElementById('fiftyFiftyDivOpen').style.visibility = "hidden";
                document.getElementById('badBehaviourDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainThrowInHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainBodyDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "hidden";
                document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('cornerTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('headClearanceDivOpen').style.visibility = "hidden";
                document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                document.getElementById('collectedDivOpen').style.visibility = "hidden";
                document.getElementById('punchDivOpen').style.visibility = "hidden";
                document.getElementById('smotherDivOpen').style.visibility = "hidden";
                document.getElementById('savedDivOpen').style.visibility = "hidden";
                document.getElementById('shotFacedDivOpen').style.visibility = "hidden";
                document.getElementById('keeperSweeperDivOpen').style.visibility = "hidden";
                document.getElementById('goalAndPenaltyConcededDivOpen').style.visibility = "hidden";
                document.getElementById('savedToPostDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedStateDivOpen').style.visibility = "hidden";
                document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayDivOpen').style.visibility = "hidden";
                document.getElementById('shotChainDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('notPenaltyNoChainDivOpen').style.visibility = "hidden";
                document.getElementById('passChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('injuryStoppageDivOpen').style.visibility = "hidden";
                document.getElementById('dribbleOverrunDivOpen').style.visibility = "hidden";
                document.getElementById('chainDivOpen').style.visibility = "visible";
            }
            function noChainEsc() {
                document.getElementById('chainDivOpen').style.visibility = "hidden";
                document.getElementById('duelDivOpen').style.visibility = "hidden";
                document.getElementById('blockDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedDivOpen').style.visibility = "hidden";
                document.getElementById('foulCommittedTypeDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainTypeDivOpen').style.visibility = "hidden";
                document.getElementById('clearanceDivOpen').style.visibility = "hidden";
                document.getElementById('pressureDivOpen').style.visibility = "hidden";
                document.getElementById('goalKeeperDivOpen').style.visibility = "hidden";
                document.getElementById('ballRecoveryDivOpen').style.visibility = "hidden";
                document.getElementById('shotDivOpen').style.visibility = "hidden";
                document.getElementById('tackleAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('foulWonNoChainDivOpen').style.visibility = "hidden";
                document.getElementById('fiftyFiftyDivOpen').style.visibility = "hidden";
                document.getElementById('badBehaviourDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainThrowInHeightDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility = "hidden";
                document.getElementById('passNoChainBodyDivOpen').style.visibility = "hidden";
                document.getElementById('passDurationDivOpen').style.visibility = "hidden";
                document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('DefaultOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('cornerTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('headClearanceDivOpen').style.visibility = "hidden";
                document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                document.getElementById('collectedDivOpen').style.visibility = "hidden";
                document.getElementById('punchDivOpen').style.visibility = "hidden";
                document.getElementById('smotherDivOpen').style.visibility = "hidden";
                document.getElementById('savedDivOpen').style.visibility = "hidden";
                document.getElementById('shotFacedDivOpen').style.visibility = "hidden";
                document.getElementById('keeperSweeperDivOpen').style.visibility = "hidden";
                document.getElementById('goalAndPenaltyConcededDivOpen').style.visibility = "hidden";
                document.getElementById('savedToPostDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedStateDivOpen').style.visibility = "hidden";
                document.getElementById('goalKeeperBodyDivOpen').style.visibility = "hidden";
                document.getElementById('shotSavedTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayDivOpen').style.visibility = "hidden";
                document.getElementById('shotChainDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility = "hidden";
                document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility = "hidden";
                document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotKickOffTechniqueDivOpen').style.visibility = "hidden";
                document.getElementById('shotDurationDivOpen').style.visibility = "hidden";
                document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                document.getElementById('notPenaltyNoChainDivOpen').style.visibility = "hidden";
                document.getElementById('passChainHeightDivOpen').style.visibility = "hidden";
                document.getElementById('groundPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('lowPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('highPassChainDivOpen').style.visibility = "hidden";
                document.getElementById('injuryStoppageDivOpen').style.visibility = "hidden";
                document.getElementById('dribbleOverrunDivOpen').style.visibility = "hidden";
                document.getElementById('noChainDivOpen').style.visibility = "visible";
            }

            // Log action details including video time
            function logAction(actionName) {
                var actionTime = videoNode.currentTime;
                events.push({ action: actionName, time: actionTime });
                //console.log(`Action: ${actionName}, Time: ${actionTime}`);
            }

            /*--------------------------HIDE UPLOAD BUTTON---------------------------*/
            document.getElementById('chooseVideo').style.visibility = "hidden";
            //chooseVideo.hide();    
            //disable Choose input
            //chooseVideo.disable;     
            /*--------------------------HIDE UPLOAD BUTTON---------------------------*/

            document.getElementById('startDivOpen').style.visibility = "visible";
			           
            //if want to delete control of video
            //videoNode.removeAttribute('controls');

            
            //////////////Control Video/////////////////
            function ctrlFarward(event) {
                
           // event.preventDefault();
                var key = event.keyCode;
                if (key === 27) {
                    if (chain) {
                        chainEsc();
                    } else if (!chain) {
                        noChainEsc();
                    }
                    

                } else if (key === 32) {
                    if (document.getElementById('pressureDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - pressureDuration >= 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - pressureDuration < 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                            document.getElementById('pressureDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('shotDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - shotDuration >= 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - shotDuration < 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('shotDurationDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('passDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - passDuration >= 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - passDuration < 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('passDurationDivOpen').style.visibility = "visible";
                        }
                    }
                    if (videoNode.paused) {
                        videoNode.play();
                    } else if (videoNode.play) {
                        videoNode.pause();
                    }
                } else if (event.shiftKey && event.ctrlKey && key === 37) {
                    videoNode.pause();

                    videoNode.currentTime = videoNode.currentTime - 0.400;
                    if (document.getElementById('pressureDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - pressureDuration > 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - pressureDuration <= 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                            document.getElementById('pressureDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('shotDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - shotDuration > 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - shotDuration <= 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('shotDurationDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('passDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - passDuration > 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - passDuration <= 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('passDurationDivOpen').style.visibility = "visible";
                        }
                    }
                    
                    
                } else if (event.ctrlKey && key === 37) {
                    videoNode.pause();
                    videoNode.currentTime = videoNode.currentTime - 0.04;
                    if (document.getElementById('pressureDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - pressureDuration > 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - pressureDuration <= 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                            document.getElementById('pressureDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('shotDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - shotDuration > 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - shotDuration <= 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('shotDurationDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('passDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - passDuration > 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - passDuration <= 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('passDurationDivOpen').style.visibility = "visible";
                        }
                    }
                   
                } else if (event.shiftKey && event.ctrlKey && key === 39) {
               
                    videoNode.pause();
                    videoNode.currentTime = videoNode.currentTime + 0.400;
                    if (document.getElementById('pressureDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - pressureDuration > 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - pressureDuration <= 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                            document.getElementById('pressureDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('shotDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - shotDuration > 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - shotDuration <= 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('shotDurationDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('passDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - passDuration > 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - passDuration <= 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('passDurationDivOpen').style.visibility = "visible";
                        }
                    }
                } else if (event.ctrlKey && key === 39) {
                    videoNode.pause();
                    videoNode.currentTime = videoNode.currentTime + 0.04;
                    if (document.getElementById('pressureDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - myDuration1 > 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - myDuration1 <= 0) {
                            document.getElementById('endPressureDivOpen').style.visibility = "hidden";
                            document.getElementById('pressureDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('shotDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - shotDuration > 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - shotDuration <= 0) {
                            document.getElementById('shotOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('shotDurationDivOpen').style.visibility = "visible";
                        }
                    } else if (document.getElementById('passDurationDivOpen').style.visibility === "visible") {
                        if (videoNode.currentTime - passDuration > 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "visible";
                        } else if (videoNode.currentTime - passDuration <= 0) {
                            document.getElementById('passOutcomeDivOpen').style.visibility = "hidden";
                            document.getElementById('passDurationDivOpen').style.visibility = "visible";
                        }
                    }
                } else if (key === 83) {
                    if (document.getElementById('startDivOpen').style.visibility === "visible") {
                        halfStart();
                    } else if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        shot();
                    } else if (document.getElementById('chainDivOpen').style.visibility === "visible") {
                        shotChain();
                    } else if (document.getElementById('passOutcomeDivOpen').style.visibility === "visible") {
                        passOffside();
                    }
                    
				} else if (key === 65) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        duel();
                    } else if (document.getElementById('chainDivOpen').style.visibility === "visible") {
                        dispossessed();
                    } else if (document.getElementById('passOutcomeDivOpen').style.visibility === "visible") {
                        passOut();
                    }
				} else if (key === 66) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        block();
                    }
                } else if (key === 67) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible" || document.getElementById('chainDivOpen').style.visibility === "visible") {
                        foulcommitted();
                    }
                } else if (key === 68) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        dribblePast();
                    } else if (document.getElementById('chainDivOpen').style.visibility === "visible") {
                        dribble();
                    }
                } else if (key === 69) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        pass();
                    } else if (document.getElementById('chainDivOpen').style.visibility === "visible") {
                        passChain();
                    } else if (document.getElementById('passOutcomeDivOpen').style.visibility === "visible") {
                        passDefault();
                    }
                } else if (key === 70) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        clearance();
                    }
                } else if (key === 71) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        pressure();
                    } else if(document.getElementById('endPressureDivOpen').style.visibility === "visible") {
                        endPressure();
                    }
                } else if (key === 81) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        goalKeeper();
                    }
                     else if (document.getElementById('passOutcomeDivOpen').style.visibility === "visible") {
                        passInComplete();
                    }
                } else if (key === 82) {
                    if(document.getElementById('noChainDivOpen').style.visibility === "visible" ||document.getElementById('chainDivOpen').style.visibility === "visible") {
                        ballRecovery();
                    }
                } else if (key === 83) {
                    if(document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        shot();
                    }
                } else if (key === 86) {
                    if (document.getElementById('noChainDivOpen').style.visibility === "visible") {
                        interception();  
                    }
                    else if(document.getElementById('chainDivOpen').style.visibility === "visible") {
                        miscontrol();
                    }
                } else if (key === 87) {
                    if (document.getElementById('chainDivOpen').style.visibility === "visible") {
                        document.getElementById('chainDivOpen').style.visibility = "hidden";
                        document.getElementById('groundPassChainDivOpen').style.visibility = "visible";
                        groundPass();
                    }
                     else if (document.getElementById('passOutcomeDivOpen').style.visibility === "visible") {
                        passComplete();
                    }
                } else if (key === 90) {
                    if(document.getElementById('noChainDivOpen').style.visibility === "visible" ||document.getElementById('chainDivOpen').style.visibility === "visible") {
                        foulWon();
                    }
                    
                }
            
                /********************   *************************************************************************************************/
                /******************************************* KEYBOARD PRESS **********************************************************/
                /*********************************************************************************************************************/
                    else if (key === 49 || key === 97) {//#Number 1
                    if (document.getElementById('duelDivOpen').style.visibility === "visible") {
                        tackle();
                    } else if (document.getElementById('tackleAndInterceptionDivOpen').style.visibility === "visible") {
                        won();
                    } else if (document.getElementById('blockDivOpen').style.visibility === "visible") {
                        blockDefensive();
                    } else if (document.getElementById('foulCommittedDivOpen').style.visibility === "visible") {
                        noCard();
                    } else if (document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility === "visible") {
                        groundPassRecoveryAndInterception();
                    } else if (document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility === "visible" ||     document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility === "visible") {
                        other();
                    } else if (document.getElementById('passNoChainHeightDivOpen').style.visibility === "visible") {
                        groundPass();
                    } else if (document.getElementById('headClearanceDivOpen').style.visibility === "visible") {
                        regular();
                    } else if (document.getElementById('clearanceDivOpen').style.visibility === "visible") {
                        otherClearance();
                    } else if (document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        collected();
                    } else if (document.getElementById('smotherDivOpen').style.visibility === "visible") {
                        smotherWon();
                    } else if (document.getElementById('shotSavedStateDivOpen').style.visibility === "visible") {
                        shotSavedStateSet();
                    } else if (document.getElementById('shotFacedDivOpen').style.visibility === "visible") {
                        shotFacedSet();
                    } else if (document.getElementById('goalKeeperBodyDivOpen').style.visibility === "visible") {
                        goalBothHands();
                    } else if (document.getElementById('shotSavedTechniqueDivOpen').style.visibility === "visible") {
                        shotSavedDiving();
                    } else if (document.getElementById('ballRecoveryDivOpen').style.visibility === "visible") {
                        ballRecoveryComplete();
                    } else if (document.getElementById('foulWonNoChainDivOpen').style.visibility === "visible") {
                        notPenalty();
                    } else if (document.getElementById('notPenaltyNoChainDivOpen').style.visibility === "visible") {
                        notAdvantageNoChain();
                    } else if (document.getElementById('fiftyFiftyDivOpen').style.visibility === "visible") {
                        fiftyWon();
                    } else if (document.getElementById('badBehaviourDivOpen').style.visibility === "visible") {
                        yellowCardBad();
                    } else if (document.getElementById('passChainHeightDivOpen').style.visibility === "visible") {
                        groundPassChain();
                    } else if (document.getElementById('groundPassChainDivOpen').style.visibility === "visible" || document.getElementById('lowPassChainDivOpen').style.visibility === "visible" || document.getElementById('highPassChainDivOpen').style.visibility === "visible") {
                        otherPassChain();
                    } else if (document.getElementById('dribbleDivOpen').style.visibility === "visible") {
                        dribbleComplete();
                    } else if (document.getElementById('shotOutcomeDivOpen').style.visibility === "visible") {
                        shotBlock();
                    } else if (document.getElementById('shotDivOpen').style.visibility === "visible") {
                        shotOpenPlay();
                    } else if (document.getElementById('shotOpenPlayDivOpen').style.visibility === "visible") {
                        otherShot();
                    } else if (document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility === "visible" || document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility === "visible" || document.getElementById('shotKickOffTechniqueDivOpen').style.visibility === "visible") {
                        shotNormal();
                    } else if (document.getElementById('cornerTechniqueDivOpen').style.visibility === "visible") {
                        inswinging();
                    } else if (document.getElementById('injuryStoppageDivOpen').style.visibility === "visible") {
                        injuryInChain();
                    } else if (document.getElementById('foulCommittedTypeDivOpen').style.visibility === "visible") {
                        foulReguler();
                    } else if (document.getElementById('dribbleOverrunDivOpen').style.visibility === "visible") {
                        overrun();
                    } else if (document.getElementById('DefaultOutcomeDivOpen').style.visibility === "visible") {
                        passComplete();
                    }
                    
                }
                else if (key === 50 || key === 98) {//#Number 2
                    if (document.getElementById('duelDivOpen').style.visibility === "visible") {
                        aerialLost();
                    } else if (document.getElementById('tackleAndInterceptionDivOpen').style.visibility === "visible") {
                        successIn();
                    } else if (document.getElementById('blockDivOpen').style.visibility === "visible") {
                        blockOffensive();
                    } else if (document.getElementById('foulCommittedDivOpen').style.visibility === "visible") {
                        yellowCard();
                    } else if (document.getElementById('passNoChainTypeDivOpen').style.visibility === "visible") {
                        interceptionPass();
                    } else if (document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility === "visible") {
                        lowPassRecoveryAndInterception();
                    } else if (document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility === "visible" || document.getElementById('passNoChainBodyDivOpen').style.visibility === "visible" || document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility === "visible" ) {
                        rightFoot();
                    } else if (document.getElementById('passNoChainHeightDivOpen').style.visibility === "visible") {
                        lowPass();
                    } else if (document.getElementById('passNoChainThrowInHeightDivOpen').style.visibility === "visible") {
                        lowPassThrowIn();
                    } else if (document.getElementById('clearanceDivOpen').style.visibility === "visible") {
                        rightFootClearance();
                    } else if (document.getElementById('headClearanceDivOpen').style.visibility === "visible") {
                        aerialWon();
                    } else if (document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        punch();
                    } else if (document.getElementById('shotSavedStateDivOpen').style.visibility === "visible") {
                        shotSavedStateProne();
                    } else if (document.getElementById('shotFacedDivOpen').style.visibility === "visible") {
                        shotFacedProne();
                    } else if (document.getElementById('goalKeeperBodyDivOpen').style.visibility === "visible") {
                        goalRightFoot();
                    } else if (document.getElementById('shotSavedTechniqueDivOpen').style.visibility === "visible") {
                        shotSavedStanding();
                    } else if (document.getElementById('ballRecoveryDivOpen').style.visibility === "visible") {
                        ballRecoveryFail();
                    } else if (document.getElementById('foulWonNoChainDivOpen').style.visibility === "visible") {
                        penalty();
                    } else if (document.getElementById('notPenaltyNoChainDivOpen').style.visibility === "visible") {
                        advantageNoChain();
                    } else if (document.getElementById('fiftyFiftyDivOpen').style.visibility === "visible") {
                        successToTeam();
                    } else if (document.getElementById('badBehaviourDivOpen').style.visibility === "visible") {
                        secondYellowCardBad();
                    } else if (document.getElementById('passChainHeightDivOpen').style.visibility === "visible") {
                        lowPassChain();
                    } else if (document.getElementById('groundPassChainDivOpen').style.visibility === "visible" || document.getElementById('lowPassChainDivOpen').style.visibility === "visible" || document.getElementById('highPassChainDivOpen').style.visibility === "visible") {
                        rightFootPassChain();
                    } else if (document.getElementById('dribbleDivOpen').style.visibility === "visible") {
                        dribbleInComplete();
                    } else if (document.getElementById('shotOutcomeDivOpen').style.visibility === "visible") {
                        shotGoal();
                    } else if (document.getElementById('shotDivOpen').style.visibility === "visible") {
                        shotFreeKick();
                    } else if (document.getElementById('shotOpenPlayDivOpen').style.visibility === "visible" || document.getElementById('shotChainDivOpen').style.visibility === "visible") {
                        rightFootShot();
                    } else if (document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility === "visible" || document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility === "visible" || document.getElementById('shotKickOffTechniqueDivOpen').style.visibility === "visible") {
                        shotVolley();
                    } else if (document.getElementById('cornerTechniqueDivOpen').style.visibility === "visible") {
                        outswinging();
                    }  else if (document.getElementById('injuryStoppageDivOpen').style.visibility === "visible") {
                        injuryNotInChain();
                    } else if (document.getElementById('foulCommittedTypeDivOpen').style.visibility === "visible") {
                        foulHandball();
                    } else if (document.getElementById('dribbleOverrunDivOpen').style.visibility === "visible") {
                        notOverrun();
                    } else if (document.getElementById('DefaultOutcomeDivOpen').style.visibility === "visible") {
                        passInComplete();
                    }
    
                }
                else if (key === 51 || key === 99) {//#Number 3
                    if (document.getElementById('tackleAndInterceptionDivOpen').style.visibility === "visible") {
                        successOut();
                    } else if (document.getElementById('foulCommittedDivOpen').style.visibility === "visible") {
                        secondYellowCard();
                    } else if (document.getElementById('passNoChainTypeDivOpen').style.visibility === "visible") {
                        recoveryPass();
                    } else if (document.getElementById('passNoChainHeightRecoveryAndInterceptionDivOpen').style.visibility === "visible") {
                        highPassRecoveryAndInterception();
                    } else if (document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility === "visible" || document.getElementById('passNoChainBodyDivOpen').style.visibility === "visible" || document.getElementById('passNoChainGroundBodyRecoveryAndInterceptionDivOpen').style.visibility === "visible" ) {
                        leftFoot();
                    } else if (document.getElementById('passNoChainHeightDivOpen').style.visibility === "visible") {
                        highPass();
                    } else if (document.getElementById('passNoChainThrowInHeightDivOpen').style.visibility === "visible") {
                        highPassThrowIn();
                    } else if (document.getElementById('clearanceDivOpen').style.visibility === "visible") {
                        leftFootClearance();
                    } else if (document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        smother();
                    } else if (document.getElementById('collectedDivOpen').style.visibility === "visible") {
                        collectedSuccess();
                    } else if (document.getElementById('savedDivOpen').style.visibility === "visible") {
                        savedSuccess();
                    } else if (document.getElementById('shotSavedStateDivOpen').style.visibility === "visible") {
                        shotSavedStateMoving();
                    } else if (document.getElementById('shotFacedDivOpen').style.visibility === "visible") {
                        shotFacedMoving();
                    } else if (document.getElementById('goalKeeperBodyDivOpen').style.visibility === "visible") {
                        goalLeftFoot();
                    } else if (document.getElementById('fiftyFiftyDivOpen').style.visibility === "visible") {
                        successToOpposition();
                    } else if (document.getElementById('badBehaviourDivOpen').style.visibility === "visible") {
                        redCardBad();
                    } else if (document.getElementById('passChainHeightDivOpen').style.visibility === "visible") {
                        highPassChain();
                    } else if (document.getElementById('groundPassChainDivOpen').style.visibility === "visible" || document.getElementById('lowPassChainDivOpen').style.visibility === "visible" || document.getElementById('highPassChainDivOpen').style.visibility === "visible") {
                        leftFootPassChain();
                    } else if (document.getElementById('shotOutcomeDivOpen').style.visibility === "visible") {
                        shotSaved();
                    } else if (document.getElementById('shotDivOpen').style.visibility === "visible") {
                        shotPenalty();
                    } else if (document.getElementById('shotOpenPlayDivOpen').style.visibility === "visible" || document.getElementById('shotChainDivOpen').style.visibility === "visible") {
                        leftFootShot();
                    } else if (document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility === "visible" || document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility === "visible" || document.getElementById('shotKickOffTechniqueDivOpen').style.visibility === "visible") {
                        shotHalfVolley();
                    } else if (document.getElementById('cornerTechniqueDivOpen').style.visibility === "visible") {
                        straight();
                    } else if (document.getElementById('foulCommittedTypeDivOpen').style.visibility === "visible") {
                        foulOut();
                    } else if (document.getElementById('DefaultOutcomeDivOpen').style.visibility === "visible") {
                        passOut();
                    }
                }
                else if (key === 52 || key === 100) {//#Number 4
                    if (document.getElementById('tackleAndInterceptionDivOpen').style.visibility === "visible") {
                        lostIn();
                    } else if (document.getElementById('foulCommittedDivOpen').style.visibility === "visible") {
                        redCard();
                    } else if (document.getElementById('passNoChainTypeDivOpen').style.visibility === "visible") {
                        kickOffPass();
                    } else if (document.getElementById('passNoChainlowAndHighBodyRecoveryAndInterceptionDivOpen').style.visibility === "visible") {
                        head();
                    } else if (document.getElementById('clearanceDivOpen').style.visibility === "visible") {
                        headClearance();
                    } else if (document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        goalSaved();
                    } else if (document.getElementById('collectedDivOpen').style.visibility === "visible") {
                        collectedFail();
                    } else if (document.getElementById('punchDivOpen').style.visibility === "visible") {
                        punchFail();
                    } else if (document.getElementById('goalKeeperBodyDivOpen').style.visibility === "visible") {
                        goalHead();
                    } else if (document.getElementById('fiftyFiftyDivOpen').style.visibility === "visible") {
                        lost();
                    } else if (document.getElementById('groundPassChainDivOpen').style.visibility === "visible" || document.getElementById('lowPassChainDivOpen').style.visibility === "visible" || document.getElementById('highPassChainDivOpen').style.visibility === "visible") {
                        headPassChain();
                    } else if (document.getElementById('shotOutcomeDivOpen').style.visibility === "visible") {
                        shotOffT();
                    } else if (document.getElementById('shotDivOpen').style.visibility === "visible") {
                        shotCorner();
                    } else if (document.getElementById('shotOpenPlayDivOpen').style.visibility === "visible") {
                        headShot();
                    } else if (document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility === "visible" || document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility === "visible" || document.getElementById('shotKickOffTechniqueDivOpen').style.visibility === "visible") {
                        shotDivingHeader();
                    } else if (document.getElementById('foulCommittedTypeDivOpen').style.visibility === "visible") {
                        foul6Seconds();
                    } else if (document.getElementById('DefaultOutcomeDivOpen').style.visibility === "visible") {
                        passOffside();
                    }
                    
                } 
                else if (key === 53 || key === 101) {//#Number 5
                    if (document.getElementById('tackleAndInterceptionDivOpen').style.visibility === "visible") {
                        lostOut();
                    } else if (document.getElementById('passNoChainTypeDivOpen').style.visibility === "visible") {
                        freeKickPass();
                    } else if (document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        shotFaced();
                    } else if (document.getElementById('collectedDivOpen').style.visibility === "visible") {
                        collectedTwice();
                    } else if (document.getElementById('goalKeeperBodyDivOpen').style.visibility === "visible") {
                        goalRightHand();
                    } else if (document.getElementById('groundPassChainDivOpen').style.visibility === "visible" || document.getElementById('lowPassChainDivOpen').style.visibility === "visible" || document.getElementById('highPassChainDivOpen').style.visibility === "visible") {
                        keeperArmPassChain();
                    } else if (document.getElementById('DefaultOutcomeDivOpen').style.visibility === "visible") {
                        passInjuryClearance();
                    } else if (document.getElementById('shotOutcomeDivOpen').style.visibility === "visible") {
                        shotPost();
                    } else if (document.getElementById('shotDivOpen').style.visibility === "visible") {
                        shotKickOff();
                    } else if (document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility === "visible" || document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility === "visible" || document.getElementById('shotKickOffTechniqueDivOpen').style.visibility === "visible") {
                        shotOverheadKick();
                    } else if (document.getElementById('foulCommittedTypeDivOpen').style.visibility === "visible") {
                        foulBackPass();
                    }
                }
                else if (key === 54 || key === 102) {//#Number 6
                    if (document.getElementById('passNoChainTypeDivOpen').style.visibility === "visible") {
                        cornerPass();
                    } else if (document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        keeperSweeper();
                    } else if (document.getElementById('punchDivOpen').style.visibility === "visible") {
                        punchInPlaySafe();
                    } else if (document.getElementById('savedDivOpen').style.visibility === "visible" || document.getElementById('savedToPostDivOpen').style.visibility === "visible") {
                        savedInPlaySafe();
                    } else if (document.getElementById('goalKeeperBodyDivOpen').style.visibility === "visible") {
                        goalLeftHand();
                    } else if (document.getElementById('groundPassChainDivOpen').style.visibility === "visible" || document.getElementById('lowPassChainDivOpen').style.visibility === "visible" || document.getElementById('highPassChainDivOpen').style.visibility === "visible") {
                        dropKickPassChain();
                    } else if (document.getElementById('DefaultOutcomeDivOpen').style.visibility === "visible") {
                        passUnknown();
                    } else if (document.getElementById('shotOutcomeDivOpen').style.visibility === "visible") {
                        shotWayward();
                    } else if (document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility === "visible" || document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility === "visible" || document.getElementById('shotKickOffTechniqueDivOpen').style.visibility === "visible") {
                        shotLob();
                    } else if (document.getElementById('foulCommittedTypeDivOpen').style.visibility === "visible") {
                        foulDangerousPlay();
                    }
                } 
                else if (key === 55 || key === 103) {//#Number 7
                    if (document.getElementById('passNoChainTypeDivOpen').style.visibility === "visible") {
                        throwInPass();
                    } else if (document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        goalConceded();
                    } else if (document.getElementById('punchDivOpen').style.visibility === "visible") {
                        punchInPlayDanger();
                    } else if (document.getElementById('savedDivOpen').style.visibility === "visible" || document.getElementById('savedToPostDivOpen').style.visibility === "visible") {
                        savedInPlayDanger();
                    } else if (document.getElementById('goalKeeperBodyDivOpen').style.visibility === "visible") {
                        goalChest();
                    } else if (document.getElementById('groundPassChainDivOpen').style.visibility === "visible" || document.getElementById('lowPassChainDivOpen').style.visibility === "visible" || document.getElementById('highPassChainDivOpen').style.visibility === "visible") {
                        noTouchPassChain();
                    } else if (document.getElementById('shotOutcomeDivOpen').style.visibility === "visible") {
                        shotSavedToPost();
                    } else if (document.getElementById('shotOpenPlayTechniqueRLDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueHDivOpen').style.visibility === "visible" || document.getElementById('shotOpenPlayTechniqueODivOpen').style.visibility === "visible" || document.getElementById('shotFreeKickAndPenaltyTechniqueDivOpen').style.visibility === "visible" || document.getElementById('shotKickOffTechniqueDivOpen').style.visibility === "visible") {
                        shotBackheel();
                    } else if (document.getElementById('foulCommittedTypeDivOpen').style.visibility === "visible") {
                        foulDive();
                    }
                }
                else if (key === 56 || key === 104) {//#Number 8
                    if (document.getElementById('passNoChainTypeDivOpen').style.visibility === "visible") {
                        goalKickPass();
                    } else if (document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        penaltyConceded();
                    } else if (document.getElementById('savedDivOpen').style.visibility === "visible") {
                        savedTwice();
                    } else if (document.getElementById('shotOutcomeDivOpen').style.visibility === "visible") {
                        savedOffT();
                    }
                }
                else if (key === 57 || key === 105) {//#Number 9
                    if(document.getElementById('goalKeeperDivOpen').style.visibility === "visible") {
                        penaltySaved();
                    } else if (document.getElementById('savedDivOpen').style.visibility === "visible" || document.getElementById('savedToPostDivOpen').style.visibility === "visible") {
                        savedTouchOut();
                    } else if (document.getElementById('goalAndPenaltyConcededDivOpen').style.visibility === "visible") {
                        goalAndPenaltyConcededTouchedIn();
                    } else if (document.getElementById('clearanceDivOpen').style.visibility === "visible") {
                        otherClearance();
                    }
                }
                
            }
            /*-------------------FUNCTION OF CLICK KEYBOAED--------------------------*/
            document.addEventListener("keydown", ctrlFarward);
            

            /*-------------------FUNCTION OF CLICK Mouse--------------------------*/

            // Mapping of button IDs to their corresponding functions
            const eventMapping = {
                'halfStartBtn': halfStart,
                'duelBtn': duel,
                'blockBtn': block,
                'foulCommittedBtn': foulcommitted,
                'dribblePastBtn': dribblePast,
                'passBtn': pass,
                'clearanceBtn': clearance,
                'pressureBtn': pressure,
                'goalKeeperBtn': goalKeeper,
                'ballRecoveryBtn': ballRecovery,
                'shotBtn': shot,
                'interceptionBtn': interception,
                'foulWonBtn': foulWon,
                'shieldBtn': shield,
                'fiftyFiftyBtn': fiftyFifty,
                'refereeBallDropBtn': refereeBallDrop,
                'ownGoalAgainstBtn': ownGoalAgainst,
                'ownGoalForBtn': ownGoalFor,
                'errorBtn': error,
                'offsideBtn': offside,
                'badBehaviourBtn': badBehaviour,
                'halfEndBtn': halfEnd,
                'injuryStoppageBtn': injuryStoppage,
                'tackleBtn': tackle,
                'aerialLostBtn': aerialLost,
                'blockDefensiveBtn': blockDefensive,
                'blockOffensiveBtn': blockOffensive,
                'noCardBtn': noCard,
                'yellowCardBtn': yellowCard,
                'secondYellowCardBtn': secondYellowCard,
                'redCardBtn': redCard,
                'foulRegulerBtn': foulReguler,
                'foulHandballBtn': foulHandball,
                'foulOutBtn': foulOut,
                'foul6SecondsBtn': foul6Seconds,
                'foulBackPassBtn': foulBackPass,
                'foulDangerousPlayBtn': foulDangerousPlay,
                'foulDiveBtn': foulDive,
                'interceptionPassBtn': interceptionPass,
                'recoveryPassBtn': recoveryPass,
                'kickOffPassBtn': kickOffPass,
                'freeKickPassBtn': freeKickPass,
                'cornerPassBtn': cornerPass,
                'throwInPassBtn': throwInPass,
                'goalKickPassBtn': goalKickPass,
                'rightFootClearanceBtn': rightFootClearance,
                'leftFootClearanceBtn': leftFootClearance,
                'headClearanceBtn': headClearance,
                'otherClearanceBtn': otherClearance,
                'cancelBtn': cancel,
                'cancelBtn2': cancel,
                'cancelBtn3': cancel,
                'cancelBtn4': cancel,
                'cancelBtn5': cancel,
                'collectedBtn': collected,
                'punchBtn': punch,
                'smotherBtn': smother,
                'goalSavedBtn': goalSaved,
                'shotFacedBtn': shotFaced,
                'keeperSweeperBtn': keeperSweeper,
                'goalConcededBtn': goalConceded,
                'penaltyConcededBtn': penaltyConceded,
                'penaltySavedBtn': penaltySaved,
                'saveBtn': save,
                'savedToPostBtn': savedToPost,
                'shotSavedToPostKeeperBtn': shotSavedToPostKeeper,
                'penaltySavedToPostBtn': penaltySavedToPost,
                'ballRecoveryCompleteBtn': ballRecoveryComplete,
                'ballRecoveryFailBtn': ballRecoveryFail,
                'shotOpenPlayBtn': shotOpenPlay,
                'shotFreeKickBtn': shotFreeKick,
                'shotPenaltyBtn': shotPenalty,
                'shotCornerBtn': shotCorner,
                'shotKickOffBtn': shotKickOff,
                'wonBtn': won,
                'successInBtn': successIn,
                'successOutBtn': successOut,
                'lostInBtn': lostIn,
                'lostOutBtn': lostOut,
                'notPenaltyBtn': notPenalty,
                'penaltyBtn': penalty,
                'fiftyWonBtn': fiftyWon,
                'successToTeamBtn': successToTeam,
                'successToOppositionBtn': successToOpposition,
                'lostBtn': lost,
                'secondYellowCardBadBtn': secondYellowCardBad,
                'redCardBadBtn': redCardBad,
                'groundPassBtn': groundPass,
                'lowPassBtn': lowPass,
                'highPassBtn': highPass,
                'groundPassRecoveryAndInterceptionBtn': groundPassRecoveryAndInterception,
                'lowPassRecoveryAndInterceptionBtn': lowPassRecoveryAndInterception,
                'highPassRecoveryAndInterceptionBtn': highPassRecoveryAndInterception,
                'lowPassThrowInBtn': lowPassThrowIn,
                'highPassThrowInBtn': highPassThrowIn,
                'rightFootBtn': rightFoot,
                'leftFootBtn': leftFoot,
                'otherBtn': other,
                'headBtn': head,
                'passDefaultBtn': passDefault,
                'passCompleteBtn': passComplete,
                'passInCompleteBtn': passInComplete,
                'passOutBtn': passOut,
                'passOffsideBtn': passOffside,
                'passInjuryClearanceBtn': passInjuryClearance,
                'passUnknownBtn': passUnknown,
                'inswingingBtn': inswinging,
                'outswingingBtn': outswinging,
                'straightBtn': straight,
                'regularBtn': regular,
                'aerialWonBtn': aerialWon,
                'endPressureBtn': endPressure,
                'collectedSuccessBtn': collectedSuccess,
                'collectedFailBtn': collectedFail,
                'collectedTwiceBtn': collectedTwice,
                'punchFailBtn': punchFail,
                'punchInPlaySafeBtn': punchInPlaySafe,
                'punchInPlayDangerBtn': punchInPlayDanger,
                'punchOutBtn': punchOut,
                'smotherWonBtn': smotherWon,
                'smotherLostInPlayBtn': smotherLostInPlay,
                'smotherLostOutBtn': smotherLostOut,
                'smotherSuccessInPlayBtn': smotherSuccessInPlay,
                'smotherSuccessOutBtn': smotherSuccessOut,
                'savedSuccessBtn': savedSuccess,
                'savedInPlaySafeBtn': savedInPlaySafe,
                'savedInPlayDangerBtn': savedInPlayDanger,
                'savedTwiceBtn': savedTwice,
                'savedTouchOutBtn': savedTouchOut,
                'shotFacedSetBtn': shotFacedSet,
                'shotFacedProneBtn': shotFacedProne,
                'shotFacedMovingBtn': shotFacedMoving,
                'keeperSweeperClearBtn': keeperSweeperClear,
                'keeperSweeperClaimBtn': keeperSweeperClaim,
                'goalAndPenaltyConcededTouchedInBtn': goalAndPenaltyConcededTouchedIn,
                'goalAndPenaltyConcededNoTouchBtn': goalAndPenaltyConcededNoTouch,
                'shotSavedStateSetBtn': shotSavedStateSet,
                'shotSavedStateProneBtn': shotSavedStateProne,
                'shotSavedStateMovingBtn': shotSavedStateMoving,
                'goalBothHandsBtn': goalBothHands,
                'goalRightFootBtn': goalRightFoot,
                'goalLeftFootBtn': goalLeftFoot,
                'goalHeadBtn': goalHead,
                'goalRightHandBtn': goalRightHand,
                'goalLeftHandBtn': goalLeftHand,
                'goalChestBtn': goalChest,
                'shotSavedDivingBtn': shotSavedDiving,
                'shotSavedStandingBtn': shotSavedStanding,
                'rightFootShotBtn': rightFootShot,
                'leftFootShotBtn': leftFootShot,
                'headShotBtn': headShot,
                'otherShotBtn': otherShot,
                'shotNormalBtn': shotNormal,
                'shotVolleyBtn': shotVolley,
                'shotHalfVolleyBtn': shotHalfVolley,
                'shotOverheadKickBtn': shotOverheadKick,
                'shotLobBtn': shotLob,
                'shotBackheelBtn': shotBackheel,
                'shotDivingHeaderBtn': shotDivingHeader,
                'shotBlockBtn': shotBlock,
                'shotGoalBtn': shotGoal,
                'shotSavedBtn': shotSaved,
                'shotOffTBtn': shotOffT,
                'shotPostBtn': shotPost,
                'shotWaywardBtn': shotWayward,
                'notAdvantageNoChainBtn': notAdvantageNoChain,
                'advantageNoChainBtn': advantageNoChain,
                'passChainBtn': passChain,
                'dispossessedBtn': dispossessed,
                'dribbleBtn': dribble,
                'miscontrolBtn': miscontrol,
                'refereeBallDropBtn2': refereeBallDrop,
                'offsideBtn2': offside,
                'errorBtn2': error,
                'ownGoalAgainstBtn2': ownGoalAgainst,
                'ownGoalForBtn2': ownGoalFor,
                'badBehaviourBtn2': badBehaviour,
                'halfEndBtn2': halfEnd,
                'injuryStoppageBtn2': injuryStoppage,

            };

            // Loop through the mapping and set the onclick handlers
            for (const [btnId, eventHandler] of Object.entries(eventMapping)) {
                const element = document.getElementById(btnId);
                if (element) {
                    element.onclick = eventHandler;
                }
            }

            /*-------------------FUNCTION OF CLICK Mouse--------------------------*/

        },
        inputNode = document.querySelector('input');

    if (!URL) {
        displayMessage('Your browser is not ' +
                    '<a href="http://caniuse.com/bloburls">supported</a>!', true);
        return;
    }

    inputNode.addEventListener('change', playSelectedFile, false);
}(window));
/**********************************************************************************************/