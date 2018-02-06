// LATER
// Fix walking bug:
// https://stackoverflow.com/questions/29279805/keydown-doesnt-continuously-fire-when-pressed-and-hold?rq=1

// TODAY
// add buffer rows + columns around maps, move map transition squares back
// add jump behavior for ledges
// add objects + NPCs to maps
// update maps.js --> JSON, start that server thing, load data using AJAX
// add npcs data to dedicated
// make map transitions smoother

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
    if (!moving) {
        //if not already moving, move
        var targetSquare = null;
        switch (direction) {
            case "up":
                playerDirection = "up";
                targetSquare = mapLocations[currentLocation][0][playerY - 1][playerX];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (playerY > 0 && targetSquare !== 1) {
                    playerY--
                }
                break;
            case "down":
                playerDirection = "down";
                targetSquare = mapLocations[currentLocation][0][playerY + 1][playerX];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (targetSquare === 4) {
                    triggerFight();
                } else if (playerY < mapHeight && targetSquare !== 1) {
                    playerY++
                }
                break;
            case "left":
                playerDirection = "left";
                targetSquare = mapLocations[currentLocation][0][playerY][playerX - 1];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (playerX > 0 && targetSquare !== 1) {
                    playerX--
                }
                break;
            case "right":
                playerDirection = "right";
                targetSquare = mapLocations[currentLocation][0][playerY][playerX + 1];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (playerX < mapWidth && targetSquare !== 1) {
                    playerX++
                }
                break;
            default:
        };
        var mapY = ((6 - playerY) * squareSize) + "vw";  // (5 squares on screen above + offset by 1 buffer row) - playerY
        var mapX = ((6 - playerX) * squareSize) + "vw";  // (5 squares on screen above + offset by 1 buffer col) - playerX
        $("#screen").css("background-position", mapX + " " + mapY);
        moving = true;
        setTimeout(function(){ moving = false }, 150)
        playerState = "walking";
        animatePlayerMovement(direction);
    }
}

function loadNewMapArea(name) {
    var lastLocation = currentLocation;
    currentLocation = name;
    mapWidth = mapLocations[currentLocation][0][1].length - 2;
    mapHeight = mapLocations[currentLocation][0].length - 2;
    $("#player").hide();
    $("#screen").css("background-image", "url(img/" + name + ".png)");
    $("#screen").css("background-size", (mapWidth * squareSize) + "vw " + (mapHeight * squareSize) + "vw");
    playerY = mapLocations[currentLocation][1][lastLocation][0];
    playerX = mapLocations[currentLocation][1][lastLocation][1];
    var mapY = ((6 - playerY) * squareSize) + "vw";
    var mapX = ((6 - playerX) * squareSize) + "vw";
    $("#screen").css("background-position", mapX + " " + mapY);
    setTimeout(function() {
        $("#player").show();
    }, 400);
}

function animatePlayerMovement(direction) {
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

function buttonPress(button) {
    console.log(button, "was pressed");
}

function triggerFight() {
    console.log("This square can trigger a fight");
}

$(document).ready(function() {
    $(document).on("keydown", function(event) {
        switch (event.keyCode) {
            case 37:
                //left arrow
                movePlayer("left");
                break;
            case 65:
                //"a" button
                movePlayer("left");
                break;
            case 38:
                //up arrow
                movePlayer("up");
                break;
            case 87:
                //"w" button
                movePlayer("up");
                break;
            case 39:
                //right arrow
                movePlayer("right");
                break;
            case 68:
                //"d" button
                movePlayer("right");
                break;
            case 40:
                //down arrow
                movePlayer("down");
                break;
            case 83:
                //"s" button
                movePlayer("down");
                break;
            case 75:
                //"k" button
                buttonPress("B");
                break;
            case 76:
                //"l" button
                buttonPress("A");
                break;
            case 71:
                //"g" button
                buttonPress("select");
                break;
            case 72:
                //"h" button
                buttonPress("start");
                break;
            default:
        };     
    });

    $(document).on("keyup", function(event) {
        var gameButtons = [37, 65, 38, 87, 39, 68, 40, 83, 75, 76, 71, 72];
        if (gameButtons.includes(event.keyCode)) {
            playerState = "standing";
            animatePlayerMovement(playerDirection);
        }
    });
});