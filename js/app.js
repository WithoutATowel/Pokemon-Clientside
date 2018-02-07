// LATER
// add jump animation for ledges
// make map transitions smoother
// update maps.js --> JSON, start that server thing, load data using AJAX
// Add NPC movement
// Fix walking bug: https://stackoverflow.com/questions/29279805/keydown-doesnt-continuously-fire-when-pressed-and-hold?rq=1
// Put a book on the table in rivalHouse?

// TODAY
// player inventory
// data structure for storing pokemon
// "claim pokemon" interaction
// build fight screens + logic w/ 1 hardcoded enemy pokemon
// Build API calls for randomly generated pokemon? 

var squareSize = 2.5;
var playerY = 7; 
var playerX = 6;
var playerState = "standing";
var playerDirection = "down";
var walkingInterval = null;
var moving = false;
var token = 0;
var currentLocation = "pallet";
var mapWidth = mapLocations[currentLocation][0][1].length;
var mapHeight = mapLocations[currentLocation][0].length;

function movePlayer(direction) {
    if (playerState !== "locked") {
        playerDirection = direction;
        playerState = "walking";
        if (!moving && checkPermittedMove(direction)) {
            //if not already moving and the next square is valid, move
            switch (direction) {
                case "up":
                    playerY--;
                    break;
                case "down":
                    playerY++;
                    break;
                case "left":
                    playerX--;
                    break;
                case "right":
                    playerX++;
                    break;
                default:
            };
            var squareType = mapLocations[currentLocation][0][playerY][playerX];
            if (typeof squareType === "string") {
                    loadNewMapArea(squareType);
                } else if (squareType === 0) {
                    walkingAnimation(direction);
                } else if (squareType === 3) {
                    // 3 = water
                    // swimAnimation();
                } else if (squareType === 4) {
                    walkingAnimation(direction);
                    triggerFight();
                } else if (squareType === 5) {
                    jumpAnimation(direction);
                }
            // (5 squares on screen above + offset by 1 buffer row) - playerY
            var mapY = ((6 - playerY) * squareSize) + "vw";
            // (5 squares on screen above + offset by 1 buffer col) - playerX  
            var mapX = ((6 - playerX) * squareSize) + "vw";
            $("#screen").css("top", mapY);
            $("#screen").css("left", mapX);
            moving = true;
            setTimeout(function() { moving = false }, 150)
        } else {
            walkingAnimation(direction);
        }
    }
}

function checkPermittedMove(direction) {
    var targetSquare = null;
    switch (direction) {
        case "up":
            //Make sure player isn't already at the top of the map
            targetSquare = mapLocations[currentLocation][0][playerY - 1][playerX];
            if (typeof targetSquare === "string"){
                return true;
            } else if (playerY === 0) {
                return false;
            }
            break;
        case "down":
            //Make sure player isn't already at the bottom of the map
            targetSquare = mapLocations[currentLocation][0][playerY + 1][playerX];
            if (typeof targetSquare === "string"){
                return true;
            } else if (playerY === mapHeight) {
                return false;
            }
            break;
        case "left":
            //Make sure player isn't already at the left edge of the map
            targetSquare = mapLocations[currentLocation][0][playerY][playerX - 1];
            if (typeof targetSquare === "string"){
                return true;
            } else if (playerX === 0) {
                return false;
            }
            break;
        case "right":
            //Make sure player isn't already at the right edge of the map
            targetSquare = mapLocations[currentLocation][0][playerY][playerX + 1];
            if (typeof targetSquare === "string"){
                return true;
            } else if (playerX === mapWidth) {
                return false;
            }
            break;
        default:
    }
    if (targetSquare === 1 || targetSquare === 3) {
        // Next square is an obstacle
        return false;
    } else if (targetSquare.toString()[0] === "2") {
        // Square is taken by an interactive object
        return false;
    } else if (targetSquare === 5 && direction !== "down") {
        // Can only jump *down* ledges
        return false;
    } else if (targetSquare === 5 && direction === "down") {
        // Next square is a ledge and the player is moving down
        return true;
    } else if (targetSquare.toString()[0] === "6") {
        // Square is taken by an NPC
        return false;
    } else if (targetSquare.toString()[0] === "7") {
        // Square is taken by a claimable object
        return false;
    } else {
        // Nothing disqualifies the square
        return true;
    }
}

function loadNewMapArea(name) {
    var lastLocation = currentLocation;
    currentLocation = name;
    mapWidth = mapLocations[currentLocation][0][1].length - 2;
    mapHeight = mapLocations[currentLocation][0].length - 2;
    $("#player").hide();
    $("#screen").css("background-image", "url(img/" + name + ".png)");
    $("#screen").css("width", (mapWidth * squareSize) + "vw ");
    $("#screen").css("height", (mapHeight * squareSize) + "vw");
    playerY = mapLocations[currentLocation][1][lastLocation][0];
    playerX = mapLocations[currentLocation][1][lastLocation][1];
    var mapY = ((6 - playerY) * squareSize) + "vw";
    var mapX = ((6 - playerX) * squareSize) + "vw";
    $("#screen").css("top", mapY);
    $("#screen").css("left", mapX);
    loadNPCsAndObjects(currentLocation);
    setTimeout(function() {
        $("#player").show();
    }, 400);
}

function loadNPCsAndObjects(location) {
    $(".npc").remove();
    $(".claimableObject").remove();
    if (allNPCs[location]) {
        var currentNPCs = allNPCs[location];
        currentNPCs.forEach(function(item) {
            $("#screen").append("<div class='npc' id='" + item.name + "'></div>");
            $("#" + item.name).css("background-image", "url(" + item.background + ")");
            var npcPosY = (item.location[0] * squareSize) + "vw";
            var npcPosX = (item.location[1] * squareSize) + "vw";
            $("#" + item.name).css("top", npcPosY);
            $("#" + item.name).css("left", npcPosX);
        });
    }
    if (claimableObjects[location]) {
        var currentClaimableObjects = claimableObjects[location];
        currentClaimableObjects.forEach(function(item) {
            if (item.status === "unclaimed") {
                $("#screen").append("<div class='claimableObject' id='" + item.id + "'></div>");
                $("#" + item.id).css("background-image", "url(" + item.background + ")");
                var itemPosY = (item.location[0] * squareSize - 0.4) + "vw";
                var itemPosX = (item.location[1] * squareSize) + "vw";
                $("#" + item.id).css("top", itemPosY);
                $("#" + item.id).css("left", itemPosX);
            }
        });
    }
}

function walkingAnimation(direction) {
    var spriteX = "";
    var spriteY1 = "50%";
    var spriteY2 = "100%";
    switch (direction) {
        case "up":
            spriteX = "33.333%";
            break;
        case "down":
            spriteX = "0%"
            break;
        case "left":
            spriteX = "66.666%"
            break;
        case "right":
            spriteX = "100%"
            break;
        default:
    };
    if (playerState === "standing") {
        clearInterval(walkingInterval);
        walkingInterval = null;
        $("#player").css("background-position", spriteX + " 0%");
    } else if (playerState === "walking" && walkingInterval === null) {
        $("#player").css("background-position", spriteX + " 0%")
        walkingInterval = setInterval(function() {
            if(token === 0) {
                $("#player").css("background-position", spriteX + " " + spriteY1);
                token = 1;
            } else {
                $("#player").css("background-position", spriteX + " " + spriteY2);
                token = 0;
            }   
        }, 150);
    } 
}

function jumpAnimation(direction) {
    console.log("Ashe jumped!");
    //extra line to make this foldable
}

function interactOrSelect() {
    var item = null;
    var targetSquare = null;
    switch (playerDirection) {
        case "up":
            targetSquare = mapLocations[currentLocation][0][playerY - 1][playerX];
            break;
        case "down":
            targetSquare = mapLocations[currentLocation][0][playerY + 1][playerX];
            break;
        case "left":
            targetSquare = mapLocations[currentLocation][0][playerY][playerX - 1];
            break;
        case "right":
            targetSquare = mapLocations[currentLocation][0][playerY][playerX + 1];
            break;
        default:
    }
    if (targetSquare.toString()[0] === "2") {
        item = staticObjects[currentLocation][parseInt(targetSquare.toString()[1])];
        showText(item.text);
    } else if (targetSquare.toString()[0] === "6") {
        item = allNPCs[currentLocation][parseInt(targetSquare.toString()[1])];
        showText(item.dialog);
    } else if (targetSquare.toString()[0] === "7") {
        var itemId = parseInt(targetSquare.toString()[1]);
        item = claimableObjects[currentLocation][itemId];
        if (item.confirmText) {
            showText(item.confirmText);
            $("#confirm").show();
            $("#yes").attr("data-value", itemId);
            chooseMenuItem(document.getElementById("confirmOptions").children, takeItem);
        } else {
            takeItem(itemId); // no confirm needed, so pass the item ID to takeItem()
        }
    }
}

function takeItem(itemId) {
    if (itemId !== false) {
        // Place item into appropriate location... inventory or pokedex 
        // Delete item from claimableObjects
        // Remove item from the gameboard
        console.log("You claimed item " + itemId);
    }
    
}

function showText(text) {
    playerState = "locked";
    $("#text").text(text);
    $("#textBox").show();
}

function cancelOrBack() {
    $("#textBox").hide();
    playerState = "standing";
}

function chooseMenuItem(options, callback) {
    var selectedOption = 0;
    
    // Place an indicator arrow in the appropriate row, mark option with class "selectedOption"
    function drawArrow() {
        options[selectedOption].innerHTML = "&#9658;"
        options[selectedOption].classList.add('selectedOption')
        for (i = 0; i < options.length; i++) {
            if (i !== selectedOption) {
                options[i].innerHTML = "&nbsp;";
            }
        }
    }
    drawArrow();

    // up + down buttons move the arrow around + add/remove "selectedOption" class
    $(document).off("keydown");
    $(document).on("keydown", function(event) {
        switch (event.keyCode) {
            case 38:
            case 87:
                // up arrow & keyboard "w" button
                if (selectedOption === 0) {
                    selectedOption = options.length - 1;
                } else {
                    selectedOption--;
                }
                drawArrow();
                break;
            case 40:
            case 83:
                // down arrow & keyboard "s" button
                if (selectedOption < (options.length - 1)) {
                    selectedOption++;
                } else {
                    selectedOption = 0;
                }
                drawArrow();
                break;
            case 75:
                //"k" button -> A. Return data-value of item with the "selectedOption" class.
                callback(options[selectedOption].getAttribute("data-value"));
                cancelOrBack();
                $(document).off("keydown");
                setGameControls();
                break;
            case 76:
                //"l" button -> B
                cancelOrBack();
                $(document).off("keydown");
                setGameControls();
                break;
            default:
        };
    });
}

function buttonPress(button) {
    console.log(button, "was pressed");
    //extra line to make this foldable
}

function triggerFight() {
    console.log("This square can trigger a fight");
    //extra line to make this foldable
}

function startMenu() {
    console.log("This button opens the start menu");
    //extra line to make this foldable
}

function setGameControls() {
    $(document).on("keydown", function(event) {
        switch (event.keyCode) {
            case 37:
                //left arrow
                movePlayer("left");
                break;
            case 65:
                //keyboard "a" button
                movePlayer("left");
                break;
            case 38:
                //up arrow
                movePlayer("up");
                break;
            case 87:
                //keyboard "w" button
                movePlayer("up");
                break;
            case 39:
                //right arrow
                movePlayer("right");
                break;
            case 68:
                //keyboard "d" button
                movePlayer("right");
                break;
            case 40:
                //down arrow
                movePlayer("down");
                break;
            case 83:
                //keyboard "s" button
                movePlayer("down");
                break;
            case 75:
                //"k" button -> A
                if (playerState !== "locked") {
                    interactOrSelect();
                } else {
                    chooseMenuItem();
                }
                break;
            case 76:
                //"l" button -> B
                cancelOrBack();
                break;
            case 71:
                //"g" button -> select
                buttonPress("select");
                break;
            case 72:
                //"h" button -> start
                startMenu("start");
                break;
            default:
        };     
    });

    $(document).on("keyup", function(event) {
        var gameButtons = [37, 65, 38, 87, 39, 68, 40, 83];
        if (gameButtons.includes(event.keyCode) && playerState === "walking") {
            playerState = "standing";
            walkingAnimation(playerDirection);
        }
    });
}

$(document).ready(function() {
    loadNPCsAndObjects(currentLocation);
    setGameControls();
});