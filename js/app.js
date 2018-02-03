function movePlayer(direction) {
    var xPos = parseInt( $("#player").css("grid-column") );
    var yPos = parseInt( $("#player").css("grid-row") );
    switch (direction) {
        case "up":
            yPos--
            $("#player").css("background", "url(img/ash-sprite.png) -19px 0");
            break;
        case "down":
            yPos++
            $("#player").css("background", "url(img/ash-sprite.png) 0 0");
            break;
        case "left":
            xPos--
            $("#player").css("background", "url(img/ash-sprite.png) -36px 0");
            break;
        case "right":
            xPos++
            $("#player").css("background", "url(img/ash-sprite.png) -54px 0");
            break;
        default:
    }
    $("#player").css("grid-column", xPos + "/auto");
    $("#player").css("grid-row", yPos + "/auto");

}

movePlayer("left");


$(document).ready(function() {
    $(document).on("keydown", function(event) {
        var direction = "";
        switch (event.keyCode) {
            case 37:
                direction = "left";
                break;
            case 38:
                direction = "up";
                break;
            case 39:
                direction = "right";
                break;
            case 40:
                direction = "down";
                break;
            default:
        };
        console.log(direction);
        movePlayer(direction);
    });
});

