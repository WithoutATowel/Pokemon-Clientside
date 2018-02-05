var xPos = 4;
var yPos = 4;
var playerDirection = "";
var playerState = "standing";
var walkingInterval = null;
var moving = false;
var token = 0;

function movePlayer(direction) {
    if (!moving) {
        //if not already moving, move
        switch (direction) {
            case "up":
                yPos = (yPos > 0) ? yPos - 1 : 0;
                break;
            case "down":
                yPos = (yPos < 8) ? yPos + 1 : 8;
                break;
            case "left":
                xPos = (xPos > 0) ? xPos - 1 : 0;
                break;
            case "right":
                xPos = (xPos < 8) ? xPos + 1 : 8;
                break;
            default:
        };
        $("#player").css("left", ((100 / 9) * xPos) + "%");
        $("#player").css("top", ((100 / 9) * yPos) + "%");
        moving = true;
        setTimeout(function(){ moving = false }, 450)
        playerState = "walking";
        animateWalking();
    }
}

function animateWalking() {
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
        animateWalking();
    });
});

