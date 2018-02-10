// LATER
// Add NPC movement
// Have different spawn rates per pokemon type
// Save game + load game
// "Turn Gameboy off/on"
// Intro animation
// Fix that annoying menu wiggle bug?
// Start game in Ashe's room?
// Add dialog beyond a single line of text?
// create "keyboard" menu for entering your player's name. Store it in localStorage.
// Fix walking bug: https://stackoverflow.com/questions/29279805/keydown-doesnt-continuously-fire-when-pressed-and-hold?rq=1
// Clean code!!

// DONE

// NEXT
// Add music + sound effects + mute button
// Make d-pad + buttons work
// Make Growl do something
// make walking over a fence force you to go an extra square
// Responsive + mediaqueries
// Add animations to show button presses (regardless of input method used)
// Prevent selecting invalid menu options

$(document).ready(function() {
    // Load data as global variables
    $.getJSON("data/maps.json").done(function(data) {
        mapLocations = data.mapLocations;
    });
    $.getJSON("data/npcs.json").done(function(data) {
        allNPCs = data.allNPCs;
    });
    $.getJSON("data/pokedex.json").done(function(data) {
        pokedex = data.pokedex;
        pokeMoves = data.pokeMoves;
        myPokemon = instantiatePokemon(0); //DON'T FORGET TO REMOVE THIS
    });
    $.getJSON("data/interactiveObjects.json").done(function(data) {
        staticObjects = data.staticObjects;
        claimableObjects = data.claimableObjects;
        loadNPCsAndObjects(currentLocation);
    });
    setGameControls();
    mapMusic = new Audio("music/pallet.mp3");
    mapMusic.volume = 0.25;
    mapMusic.loop = true;
    mapMusic.play();
});

var squareSize = 2.5;
var playerY = 7; 
var playerX = 6;
var playerState = "standing";
var playerDirection = "down";
var walkingInterval = null;
var moving = false;
var token = 0;
var currentLocation = "pallet";
var mapWidth = 0;
var mapHeight = 0;
var inventory = [];
var myPokemon = null;
var ranPokemon = null;
var enemyTrainer = null;
var turn = 0;

// Define music objects and set volumes
var walkingSound = new Audio("music/footsteps.mp3")
var doorSound = new Audio("music/door.wav");
var menuSound = new Audio("music/menu-move.wav");
var damageSound = new Audio("music/damage.wav");
var defeatSound = new Audio("music/defeated.wav");
var explosionSound = new Audio("music/explosion.wav");
var mapMusic = null;
walkingSound.volume = 0.1;
walkingSound.loop = true;
menuSound.volume = 0.5;
explosionSound.volume = 0.5;


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
                    playerState = "locked";
                    loadNewMapArea(squareType);
                } else if (squareType === 0) {
                    walkingAnimation(direction);
                } else if (squareType === 3) {
                    // 3 = water
                    // swimAnimation();
                } else if (squareType === 4) {
                    walkingAnimation(direction);
                    // if (Math.random() < 0.15) {
                    //     changeMusic("route1", "wildPokemonFight");
                    //     playerState = "locked";
                    //     walkingAnimation(direction);
                    //     setTimeout(enterFightMode, 1000); 
                    // }
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
    mapWidth = mapLocations[currentLocation][0][1].length;
    mapHeight = mapLocations[currentLocation][0].length;
    //THIS CHECKS WHETHER targetSquare IS A STRING 4X. REFACTOR.
    switch (direction) {
        case "up":
            // Make sure player isn't already at the top of the map, but let them move if 
            // the next square leads to a different map.
            targetSquare = mapLocations[currentLocation][0][playerY - 1][playerX];
            if (typeof targetSquare === "string"){
                return true;
            } else if (playerY === 0) {
                return false;
            }
            break;
        case "down":
            // Make sure player isn't already at the bottom of the map, but let them move if 
            // the next square leads to a different map.
            targetSquare = mapLocations[currentLocation][0][playerY + 1][playerX];
            if (typeof targetSquare === "string"){
                return true;
            } else if (playerY === mapHeight) {
                return false;
            }
            break;
        case "left":
            // Make sure player isn't already at the left edge of the map, but let them move if 
            // the next square leads to a different map.
            targetSquare = mapLocations[currentLocation][0][playerY][playerX - 1];
            if (typeof targetSquare === "string"){
                return true;
            } else if (playerX === 0) {
                return false;
            }
            break;
        case "right":
            // Make sure player isn't already at the right edge of the map, but let them move if 
            // the next square leads to a different map.
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
    } else if (targetSquare.toString()[0] === "8") {
        if (myPokemon === null) {
            showText("You'll need a pokemon to leave town. Find Professor Oak.");
            return false;
        } else if (myPokemon.currentHP === 0) {
            showText("Your pokemon has 0 HP! Talk to Mom to heal.");
            return false;
        } else {
            return true;
        }
    } else {
        // Default to true. Nothing disqualifies the square.
        return true;
    }
}

function loadNewMapArea(name) {
    var lastLocation = currentLocation;
    currentLocation = name;
    changeMusic(lastLocation, currentLocation);
    mapWidth = mapLocations[currentLocation][0][1].length - 2;
    mapHeight = mapLocations[currentLocation][0].length - 2;
    playerDirection = mapLocations[currentLocation][1][lastLocation][2];
    walkingAnimation(playerDirection);
    $("#player").hide();
    $("#screen").hide("clip");
    setTimeout(function() {
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
        $("#screen").show("clip");
        setTimeout(function() {
            $("#player").show();
            if ($("#textBox").css("display") === "none") {
                playerState = "standing";
            } else {
                playerState = "locked";
            }
        }, 400);
    }, 450);
}

function changeMusic(lastLocation, newLocation) {

    function fadeSwitch(file){
        var turnDown = setInterval(function() {
            if (mapMusic.volume > 0.05) {
                mapMusic.volume -= 0.05;
            }
            }, 100);
            setTimeout(function(){
                clearInterval(turnDown);
                mapMusic.pause();
                mapMusic = new Audio("music/" + file);
                mapMusic.volume = 0.25;
                mapMusic.loop = true;
                mapMusic.play();
            }, 500);
        }

    switch (newLocation) {
        case "ashHouse1":
        case "rivalHouse":
        case "oakLab":
            doorSound.play();
            break;
        case "pallet":
            if (lastLocation === "route1") {
                fadeSwitch("pallet.mp3");
            } else {
                doorSound.play();
            }
            break;
        case "route1":
            fadeSwitch("route1.mp3");
            break;
        case "finalFourLair":
            fadeSwitch("final-four-lair.mp3");
            break;
        case "wildPokemonFight":
            fadeSwitch("wild-pokemon.mp3");
            break;
        case "normalTrainerFight":
            fadeSwitch("vs-trainer.mp3");
            break;
        case "finalFourFight":
            fadeSwitch("final-four.mp3");
            break;
        case "winScreen":
            fadeSwitch("hall-of-fame.mp3");
            break;
        default:
    }
}

function loadNPCsAndObjects(location) {
    $(".npc").remove();
    $(".claimableObject").remove();
    if (allNPCs[location]) {
        var currentNPCs = allNPCs[location];
        currentNPCs.forEach(function(item) {
            $("#screen").append("<div class='npc' id='" + item.name + "'></div>");
            $("#" + item.name).css("background-image", "url(" + item.background + ")");
            var npcPosY = ((item.location[0] - 1) * squareSize) + "vw";
            var npcPosX = ((item.location[1] - 1) * squareSize) + "vw";
            $("#" + item.name).css("top", npcPosY);
            $("#" + item.name).css("left", npcPosX);
        });
    }
    if (claimableObjects[location]) {
        var currentClaimableObjects = claimableObjects[location];
        currentClaimableObjects.forEach(function(item) {
            if (item.status === "unclaimed") {
                $("#screen").append("<div class='claimableObject' id='" + item.name + "'></div>");
                $("#" + item.name).css("background-image", "url(" + item.background + ")");
                var itemPosY = ((item.location[0] - 1) * squareSize - 0.4) + "vw";
                var itemPosX = ((item.location[1] - 1) * squareSize) + "vw";
                $("#" + item.name).css("top", itemPosY);
                $("#" + item.name).css("left", itemPosX);
            }
        });
    }
}

function walkingAnimation(direction) {
    var spriteX = "";
    var spriteY1 = "50%";
    var spriteY2 = "100%";
    direction = (direction) ? direction : playerDirection;
    switch (direction) {
        case "up":
            spriteX = "33.333%";
            break;
        case "down":
            spriteX = "0%";
            break;
        case "left":
            spriteX = "66.666%";
            break;
        case "right":
            spriteX = "100%";
            break;
        default:
    };
    if (playerState !== "walking") {
        clearInterval(walkingInterval);
        walkingInterval = null;
        $("#player").css("background-position", spriteX + " 0%");
        walkingSound.pause();
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
        walkingSound.play();
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
        // Static, interactive objects
        item = staticObjects[currentLocation][parseInt(targetSquare.toString()[1])];
        showText(item.text);
    } else if (targetSquare.toString()[0] === "6") {
        // NPCs
        item = allNPCs[currentLocation][parseInt(targetSquare.toString()[1])];
        if (item.healer && myPokemon.currentHP < myPokemon.maxHP) {
            myPokemon.currentHP = myPokemon.maxHP;
            showText(item.name + ": Here's some chocolate for your injured Pokemon. There you go, all better!");
        } else if (item.trainer) {
            enemyTrainer = allNPCs[currentLocation][parseInt(targetSquare.toString()[1])];
            showText(item.dialog);
            var trainerType = (enemyTrainer.finalFour) ? "finalFourFight" : "normalTrainerFight";
            changeMusic("", trainerType);
            $(document).off();
            setTimeout(enterFightMode, 1000);
        } else {
            showText(item.dialog);
        }
    } else if (targetSquare.toString()[0] === "7") {
        // Claimable items
        var itemId = parseInt(targetSquare.toString()[1]);
        item = claimableObjects[currentLocation][itemId];
        if (item.status === "locked") {
            showText("You already took a Pokemon.");
        } else if (item.confirmText) {
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
    var item = null;
    if (itemId !== "false") {
        item = claimableObjects[currentLocation][itemId];
        // Place item into appropriate location... inventory or pokedex 
        if (item.type === "pokemon") {
            myPokemon = instantiatePokemon(item.pokeId);
        } else {
            inventory.push(item);
        }
        // Update item statuses in claimableObjects
        claimableObjects[currentLocation].forEach(function(obj) {
            obj.status = "locked";
        });
        // Remove item from the map & screen
        var itemY = item.location[0];
        var itemX = item.location[1];
        mapLocations[currentLocation][0][itemY][itemX] = 1;
        $("#" + item.name).remove();
        // If item required confirmation, restore game controls
        if (item.confirmText) {
            $("#confirm").hide();
            cancelOrBack();
            setGameControls(); 
        }
    } else {
        $("#confirm").hide();
        cancelOrBack();
        setGameControls();
    } 
}

function instantiatePokemon(pokeId) {
    var myNewPokemon = Object.assign({}, pokedex[pokeId]);

    var attackBonus = Math.round(Math.random() * 3) - 1;
    myNewPokemon.attack += attackBonus;

    var defenseBonus = Math.round(Math.random() * 3) - 1;
    myNewPokemon.defense += defenseBonus;


    if (pokeId === 0 || pokeId === 1 || pokeId === 2) {
        var expNeeded = 10 * myNewPokemon.level;
        myNewPokemon.expNeeded = expNeeded;
        myNewPokemon.currentExp = 0;
    } else {
        var levelBonus = Math.round(Math.random());
        myNewPokemon.level += levelBonus;
    }


    var maxHPBonus = (myNewPokemon.level - 4) * (Math.round(Math.random() * 3) - 1);
    var newMaxHP = pokedex[pokeId].maxHP + 2 * myNewPokemon.level + maxHPBonus;
    myNewPokemon.maxHP = newMaxHP;
    myNewPokemon.currentHP = newMaxHP;

    return myNewPokemon
}

function showText(text) {
    playerState = "locked";
    $("#text").text(text);
    $("#textBox").show();
}

function cancelOrBack() {
    if ($("#levelUpScreen").css("display") !== "none") {
        $("#levelUpScreen").hide();
        menuSound.play();
        return;
    } else if ($("#battleScreen").css("display") !== "none") {
        $("#battleScreen").hide();
        menuSound.play();
    } else if ($("#textBox").css("display") !== "none") {
        $("#textBox").hide();
        $("#confirm").hide();
        playerState = "standing";
    }
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
                menuSound.play();
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
                menuSound.play();
                break;
            case 75:
                //"k" button -> A. Return data-value of item with the "selectedOption" class.
                $(document).off("keydown");
                callback(options[selectedOption].getAttribute("data-value"));
                menuSound.play();
                break;
            case 76:
                //"l" button -> B
                $(document).off("keydown");
                cancelOrBack();
                setGameControls();
                menuSound.play();
                break;
            default:
        };
    });
}

function buttonPress(button) {
    console.log(button, "was pressed");
    //extra line to make this foldable
}

function enterFightMode() {
    turn = 0;
    ranPokemon = instantiatePokemon(Math.round(Math.random() * 3) + 3);
    $("#enemyPokemonName").text(ranPokemon.name.toUpperCase());
    $("#enemyPokemonHealthBar").css("width", "8.1vw"); //this is a magic number
    $("#enemyPokemonLevel").text(ranPokemon.level);
    $("#enemyPokemonImage").hide();
    $("#enemyPokemonImage").attr("src", ranPokemon.frontImage);
    $("#friendlyPokemonName").text(myPokemon.name.toUpperCase());
    var healthBarWidth = 8.1 * (myPokemon.currentHP / myPokemon.maxHP);
    $("#friendlyPokemonHealthBar").css("width", healthBarWidth + "vw");
    $("#friendlyPokemonLevel").text(myPokemon.level);
    $("#friendlyPokemonHealthNum").html(myPokemon.currentHP + " &nbsp; &nbsp; &nbsp; &nbsp;" + myPokemon.maxHP);
    $("#friendlyPokemonImage").attr("src", myPokemon.backImage);
    $("#friendlyPokemonImage").show();
    var attackMoveDivs = $("#moveOptionsText").children();
    attackMoveDivs.each(function(index) {
        if (!isNaN(myPokemon.moves[index])) {
            this.innerText = pokeMoves[myPokemon.moves[index]].name;
            this.setAttribute("data-value", myPokemon.moves[index]);    
        } else {
            this.innerText = "--";
            this.setAttribute("data-value", "invalid");
        }
    });
    if (enemyTrainer) {
        $("#battleText").text("Poketrainer " + enemyTrainer.name + " sent out " + ranPokemon.name + "!");
    } else {
        $("#battleText").text("A wild " + ranPokemon.name + " appears!");
    }
    $("#battleOptions").hide();
    $("#battleText").show();
    $("#battleScreen").show("pulsate");
    $("#enemyPokemonImage").show("slide", { direction : "right", distance : 300 }, 800);
    $(document).off("keydown");
    $(document).on("keydown", function(event) {
        if (event.keyCode === 75) {
            takeTurn();
        }
    });
}

// This function allows players to make moves, and gets called over and over until one Pokemon is defeated.
function takeTurn(moveIndex) {
    var computerMove = null;
    var damage = 0;

    if (moveIndex) {
        $("#friendlyPokemonImage").effect("bounce");
        $("#battleOptions").hide();
        damage = Math.round(((2 * myPokemon.level) / 100) * (myPokemon.attack / ranPokemon.defense) * pokeMoves[moveIndex].damage);
        ranPokemon.currentHP -= damage;
        var healthBarWidth = 8.1 * (ranPokemon.currentHP / ranPokemon.maxHP);
        setTimeout(function() {
            $("#enemyPokemonHealthBar").css("width", healthBarWidth + "vw");
            $("#enemyPokemonImage").effect("shake");
            // Check whether one of the pokemon has won the fight
            if (ranPokemon.currentHP <= 0) {
                explosionSound.play();
                pokemonDefeated(ranPokemon, true);
            } else {
                damageSound.play();
            }
        }, 500);
        // This has to be outside of the timeout to prevent the computer from taking another turn after being defeated.
        if (ranPokemon.currentHP <= 0) {
            return;
        }
    }

    if (turn === 0) {
        // Human player goes first
        $("#battleText").hide();
        $("#battleOptions").show();
        chooseMenuItem(document.getElementById("moveOptions").children, takeTurn);
        turn++;
    } else if (turn === 1) {
        // Computer goes second
        setTimeout(function() {
            var ranIndex = Math.round(Math.random() * (ranPokemon.moves.length - 1));
            computerMove = ranPokemon.moves[ranIndex];
            $("#battleText").show();
            $("#battleText").text(ranPokemon.name + " used " + pokeMoves[computerMove].name + "!");
            $("#enemyPokemonImage").effect("bounce");
            damage = Math.round(((2 * ranPokemon.level) / 100) * (ranPokemon.attack / myPokemon.defense) * pokeMoves[computerMove].damage);
            if (damage > myPokemon.currentHP) {
                myPokemon.currentHP = 0;
            } else {
                myPokemon.currentHP -= damage;
            }
            var healthBarWidth = 8.1 * (myPokemon.currentHP / myPokemon.maxHP);
            setTimeout(function() {
                $("#friendlyPokemonHealthBar").css("width", healthBarWidth + "vw");
                $("#friendlyPokemonHealthNum").html(myPokemon.currentHP + " &nbsp; &nbsp; &nbsp; &nbsp;" + myPokemon.maxHP);
                $("#friendlyPokemonImage").effect("shake");
                if (myPokemon.currentHP <= 0) {
                    defeatSound.play();
                    pokemonDefeated(myPokemon, false);
                    return;
                } else {
                    damageSound.play();
                }
            }, 500);
            turn--;
            $(document).on("keydown", function(event) {
                if (event.keyCode === 75) {
                    takeTurn();
                }
            });
        }, 1500);
    }
}

function pokemonDefeated(defeatedPokemon, playerWonBool) {
    $("#battleOptions").hide();
    $("#battleText").show();
    $("#battleText").text(defeatedPokemon.name + " has fainted!");
    if (playerWonBool) {
        $("#enemyPokemonImage").hide("explode");
        if (enemyTrainer) {
            enemyTrainer.defeated = true;
            if (checkWin()) {
                changeMusic("finalFourLair", "winScreen");
            } else {
                changeMusic("fight", currentLocation);
            }
            showText("How could I have lost?!");
        } else {
            changeMusic("fight", currentLocation);
        }
        myPokemon.currentExp += ranPokemon.level * 2;
    } else {
        $("#friendlyPokemonImage").hide("pulsate");
    }

    $(document).off();
    $(document).on("keydown", function(event) {
        if (event.keyCode === 65 || 75) {
            cancelOrBack();
            if (playerWonBool) {
                if (checkWin()) {
                     $(document).off();
                     $("#winScreen").show().css("display", "flex");
                } else if (myPokemon.currentExp >= myPokemon.expNeeded) {
                    levelUp();
                } else {
                    $(document).off();
                    setGameControls();
                } 
            } else {
                loadNewMapArea("pallet");
                showText("Your pokemon was defeated. Talk to Mom to heal up.");
                $(document).off();
                setGameControls();
            }
            enemyTrainer = null;
        }
    });
}

function levelUp(){
    myPokemon.level++;
    myPokemon.currentExp = 0;
    myPokemon.expNeeded = 10 * myPokemon.level;
    myPokemon.maxHP += 2;

    $("#pokemonLargeImage").attr("src", myPokemon.frontImage);
    $("#levelUpText").text(myPokemon.name + " has reached level " + myPokemon.level + "!");
    $("#levelUpScreen").show().css("display", "flex");
    $("#battleScreen").hide();
    $(document).off();
    $(document).on("keydown", function(event) {
        if (event.keyCode === 65 || 75) {
            cancelOrBack();
            $(document).off();
            setGameControls();
        }
    });
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
                    cancelOrBack();
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

function checkWin() {
    var defeatedBosses = allNPCs["finalFourLair"].filter(function(item) {
        if (item.defeated) {
            return true;
        } else {
            return false;
        }
    });
    if (defeatedBosses.length === 4) { 
        return true;
    } else {
        return false;
    }
}

// function npcWander() {
//     var walkOrStay = Math.random();
//     var 
// }













