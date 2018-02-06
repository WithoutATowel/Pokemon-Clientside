var squareSize = 2.5;
var playerY = 6; //map y = ((5 - playerY) * squareSize) + "vw";
var playerX = 5; //map x = ((5 - playerX) * squareSize) + "vw";
var playerState = "standing";
var playerDirection = "down";
var walkingInterval = null;
var moving = false;
var token = 0;
var currentLocation = "pallet";

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
                } else if (playerY > 0 && targetSquare === 0) {
                    playerY--
                }
                break;
            case "down":
                playerDirection = "down";
                targetSquare = mapLocations[currentLocation][0][playerY + 1][playerX];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (playerY < 18 && targetSquare === 0) {
                    playerY++
                }
                break;
            case "left":
                playerDirection = "left";
                targetSquare = mapLocations[currentLocation][0][playerY][playerX - 1];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (playerX > 0 && targetSquare === 0) {
                    playerX--
                }
                break;
            case "right":
                playerDirection = "right";
                targetSquare = mapLocations[currentLocation][0][playerY][playerX + 1];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (playerX < 20 && targetSquare === 0) {
                    playerX++
                }
                break;
            default:
        };
        var mapY = ((5 - playerY) * squareSize) + "vw";
        var mapX = ((5 - playerX) * squareSize) + "vw";
        $("#screen").css("background-position", mapX + " " + mapY);
        moving = true;
        setTimeout(function(){ moving = false }, 240)
        playerState = "walking";
        animatePlayerMovement(direction);
    }
}

function loadNewMapArea(name) {
    var lastLocation = currentLocation;
    currentLocation = name;
    $("#player").hide();
    $("#screen").css("background-image", "url(img/" + name + ".png)");
    playerY = mapLocations[currentLocation][1][lastLocation][0];
    playerX = mapLocations[currentLocation][1][lastLocation][1];
    var mapY = ((5 - playerY) * squareSize) + "vw";
    var mapX = ((5 - playerX) * squareSize) + "vw";
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
        }, 250);
    } 
}

function buttonPress(button) {
    console.log(button, "was pressed");
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
    //Need to only trigger this if a move key was hit... right now it fires for any key
    $(document).on("keyup", function() {
        playerState = "standing";
        animatePlayerMovement(playerDirection);
    });
});