var yPos = 6;
var xPos = 5;
var playerDirection = "";
var playerState = "standing";
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
                targetSquare = mapLocations[currentLocation][0][yPos - 1][xPos];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (yPos > 0 && targetSquare === 0) {
                    yPos--
                }
                break;
            case "down":
                targetSquare = mapLocations[currentLocation][0][yPos + 1][xPos];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (yPos < 18 && targetSquare === 0) {
                    yPos++
                }
                break;
            case "left":
                targetSquare = mapLocations[currentLocation][0][yPos][xPos - 1];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (xPos > 0 && targetSquare === 0) {
                    xPos--
                }
                break;
            case "right":
                targetSquare = mapLocations[currentLocation][0][yPos][xPos + 1];
                if (typeof targetSquare === "string") {
                    loadNewMapArea(targetSquare);
                } else if (xPos < 20 && targetSquare === 0) {
                    xPos++
                }
                break;
            default:
        };
        $("#player").css("top", ((100 / 18) * yPos) + "%");
        $("#player").css("left", ((100 / 20) * xPos) + "%");
        moving = true;
        setTimeout(function(){ moving = false }, 240)
        playerState = "walking";
        animatePlayer();
    } else {
        console.log("stuck");
    }
}

function loadNewMapArea(name) {
    var lastLocation = currentLocation;
    currentLocation = name;
    $("#player").hide();
    $("#screen").css("background-image", "url(img/" + name + ".png)");
    yPos = mapLocations[currentLocation][1][lastLocation][0];
    xPos = mapLocations[currentLocation][1][lastLocation][1];
    $("#player").css("top", ((100 / 18) * yPos) + "%");
    $("#player").css("left", ((100 / 20) * xPos) + "%");
    setTimeout(function() {
        $("#player").show();
    }, 100);
}

function animatePlayer() {
    var spriteX = "";
    var spriteY1 = "50%";
    var spriteY2 = "100%";
    switch (playerDirection) {
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

$(document).ready(function() {
    $(document).on("keydown", function(event) {
        switch (event.keyCode) {
            case 37:
                playerDirection = "left";
                break;
            case 38:
                playerDirection = "up";
                break;
            case 39:
                playerDirection = "right";
                break;
            case 40:
                playerDirection = "down";
                break;
            default:
        };
        movePlayer(playerDirection);
    });
    $(document).on("keyup", function() {
        playerState = "standing";
        animatePlayer();
    });
});