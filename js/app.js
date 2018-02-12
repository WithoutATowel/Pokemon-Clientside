$(document).ready(function() {
    // Load data as global variables
    $.getJSON("data/NPCsAndObjects.json").done(function(data) {
        staticObjects = data.staticObjects;
        claimableObjects = data.claimableObjects;
        allNPCs = data.allNPCs;
        loadNPCsAndObjects(currentLocation);
    });
    $.getJSON("data/maps.json").done(function(data) {
        mapLocations = data.mapLocations;
    });
    $.getJSON("data/pokedex.json").done(function(data) {
        pokedex = data.pokedex;
        pokeMoves = data.pokeMoves;
    });
    setGameControls();
    $("#muteButton").on("click", muteUnmute);

    //muteUnmute function assumes button has just been clicked, so swap retrieved "mute" value
    mute = (localStorage.mute === "true") ? false : true;
    muteUnmute();
    mapMusic.play();
});

// Declare global variables, mostly player-state related
var currentLocation = "pallet";
var mapWidth = 0;
var mapHeight = 0;
var squareSize = 2.5;
var playerY = 7; 
var playerX = 6;
var playerState = "standing";
var playerDirection = "down";
var moveInterval = null;
var walkingAnimationInterval = null;
var walkingSpriteToken = 0;
var moving = false;
var inventory = [];
var myPokemon = { currentHP : 0, maxHP : 0 }
var ranPokemon = null;
var inFight = false;
var enemyTrainer = null;
var turn = 0;

// Define music objects and set volumes
var mapMusic = new Audio("music/pallet.mp3");;
var walkingSound = new Audio("music/footsteps.mp3")
var doorSound = new Audio("music/door.wav");
var menuSound = new Audio("music/menu-move.wav");
var damageSound = new Audio("music/damage.wav");
var defeatSound = new Audio("music/defeated.wav");
var explosionSound = new Audio("music/explosion.wav");
mapMusic.volume = 0.25;
walkingSound.volume = 0.1;
menuSound.volume = 0.5;
explosionSound.volume = 0.5;
mapMusic.loop = true;
walkingSound.loop = true;


// Function to update player coordinates, adjust map, and trigger different events depending on 
// the type of ground walked onto.
function movePlayer(direction) {
    if (playerState !== "locked") {
        playerState = "walking";
        playerDirection = direction;
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
                } else if (squareType === 4) {
                    walkingAnimation(direction);
                    if (Math.random() < 0.15) {
                        changeMusic("route1", "wildPokemonFight");
                        clearInterval(moveInterval);
                        playerState = "locked";
                        walkingAnimation(direction);
                        setTimeout(function() { enterFightMode("wild"); }, 1000); 
                    }
                } else if (squareType === 5) {
                    // If walking over a ledge, move the player one square further
                    movePlayer(direction);
                }
            // Reposition background as player moves
            var mapY = ((6 - playerY) * squareSize) + "vw";  
            var mapX = ((6 - playerX) * squareSize) + "vw";
            $("#screen").css("top", mapY);
            $("#screen").css("left", mapX);
            // Prevent movePlayer from executing again until the first move has finished
            moving = true;
            setTimeout(function() { moving = false }, 150)
        } else {
            walkingAnimation(direction);
        }
    }
}

// Helper function for movePlayer to make sure a move is permitted before allowing the player to 
// enter the square.
function checkPermittedMove(direction) {
    var targetSquare = null;
    mapWidth = mapLocations[currentLocation][0][1].length;
    mapHeight = mapLocations[currentLocation][0].length;
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
        // Invisible barrier. Can't cross without a healthy pokemon.
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

// Helper function for movePlayer to animate player sprite while walking.
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
        clearInterval(walkingAnimationInterval);
        walkingAnimationInterval = null;
        $("#player").css("background-position", spriteX + " 0%");
        walkingSound.pause();
    } else if (playerState === "walking" && walkingAnimationInterval === null) {
        $("#player").css("background-position", spriteX + " 0%")
        walkingAnimationInterval = setInterval(function() {
            if(walkingSpriteToken === 0) {
                $("#player").css("background-position", spriteX + " " + spriteY1);
                walkingSpriteToken = 1;
            } else {
                $("#player").css("background-position", spriteX + " " + spriteY2);
                walkingSpriteToken = 0;
            }   
        }, 150);
        walkingSound.play();
    } 
}

// Updates the background and relocates the player when changing maps.
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
    // Set timeout to allow .hide() to animate
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
        // Set timeout to allow map to load and position before showing player
        setTimeout(function() {
            $("#player").show();
            // If player lost a battle, there will be text to clear before moving
            if ($("#text-box").css("display") === "none") {
                playerState = "standing";
            } else {
                playerState = "locked";
            }
        }, 400);
    }, 450);
}

// Helper function for loadNewMapArea that adds NPCs and other objects to the map.
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
            if (item.status !== "claimed") {
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

// Function for changing the background music. Called when changing maps, entering/leaving fights, and when game ends.
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
                if (mute) { mapMusic.muted = true };
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
            if (lastLocation === "route1" || lastLocation === "finalFourLair") {
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

// Mutes or unmutes all audio objects.
function muteUnmute() {
    if(mute) {
        $("#muteButton").css("background-image", "url(img/sound-allowed.png)");
        mute = false;
        localStorage.mute = false;
        mapMusic.muted = false;
        walkingSound.muted = false;
        doorSound.muted = false;
        menuSound.muted = false;
        damageSound.muted = false;
        defeatSound.muted = false;
        explosionSound.muted = false;
    } else {
        $("#muteButton").css("background-image", "url(img/mute-icon.png)");
        mute = true;
        localStorage.mute = true;
        mapMusic.muted = true;
        walkingSound.muted = true;
        doorSound.muted = true;
        menuSound.muted = true;
        damageSound.muted = true;
        defeatSound.muted = true;
        explosionSound.muted = true;
    }
}

// This function is called when you press the "A" button.
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
        playerState = "locked"
        clearInterval(moveInterval);
        walkingAnimation(playerDirection);
    } else if (targetSquare.toString()[0] === "6") {
        // NPCs
        playerState = "locked"
        clearInterval(moveInterval);
        walkingAnimation(playerDirection);
        item = allNPCs[currentLocation][parseInt(targetSquare.toString()[1])];
        if (item.healer && myPokemon.currentHP < myPokemon.maxHP) {
            myPokemon.currentHP = myPokemon.maxHP;
            showText(item.name + ": Here's some chocolate for your injured Pokemon. There you go, all better!");
        } else if (item.trainer) {
            enemyTrainer = item;
            showText(enemyTrainer.dialog);
            var trainerType = (enemyTrainer.finalFour) ? "finalFourFight" : "normalTrainerFight";
            changeMusic("", trainerType);
            $(document).off();
            setTimeout(function() { enterFightMode("trainer"); }, 1000);
        } else {
            showText(item.dialog);
        }
    } else if (targetSquare.toString()[0] === "7") {
        // Claimable items. Only pokemon at this point.
        var itemId = parseInt(targetSquare.toString()[1]);
        item = claimableObjects[currentLocation][itemId];
        if (item.status === "locked") {
            showText("You already took a Pokemon.");
        } else if (item.confirmText) {
            // This item requires confirmation before being taken
            showText(item.confirmText);
            $("#confirm-box").show();
            $("#yes").attr("data-value", itemId);
            chooseMenuItem(document.getElementById("confirm-options").children, takeItem);
        } else {
            // No confirmation needed, so pass the item ID to takeItem()
            takeItem(itemId); 
        }
    }
}

// Helper function for interactOrSelect to manipulate data and show appropriate messages/menus
// when picking up an item.
function takeItem(itemId) {
    var item = null;
    if (itemId !== "false") {
        item = claimableObjects[currentLocation][itemId];
        // Place item into appropriate location... inventory or pokedex 
        if (item.type === "pokemon") {
            myPokemon = instantiatePokemon(item.pokeId, "player");
        } else {
            inventory.push(item);
        }
        // Once an item has been claimed, all other items in the map area get locked in claimableObjects. This should 
        // really only happen for pokemon in Prof Oak's lab, but those are the only items in the game at the moment.
        claimableObjects[currentLocation].forEach(function(obj) {
            obj.status = "locked";
        });
        claimableObjects[currentLocation][itemId].status = "claimed";
        // Remove item from the mapLocations object & screen
        var itemY = item.location[0];
        var itemX = item.location[1];
        mapLocations[currentLocation][0][itemY][itemX] = 1;
        $("#" + item.name).remove();
        // If item required confirmation, restore game controls
        if (item.confirmText) {
            cancelOrBack();
            setGameControls(); 
        }
    } else {
        cancelOrBack();
        setGameControls();
    } 
}

// Spawns a random pokemon of the given ID, and adjusts level + stats depending on the owner and RNG.
// Wild pokemon are always 2-3 levels weaker than your pokemon. Trainer pokemon are the same level or 
// one higher.
function instantiatePokemon(pokeId, owner) {
    var myNewPokemon = Object.assign({}, pokedex[pokeId]);

    // Set random attack and defense bonuses to make each pokemon "unique"
    var attackBonus = Math.round(Math.random() * 3) - 1;
    myNewPokemon.attack += attackBonus;
    var defenseBonus = Math.round(Math.random() * 3) - 1;
    myNewPokemon.defense += defenseBonus;

    // Adjust level and experience based on owner type
    if (owner === "player") {
        var expNeeded = 10 * myNewPokemon.level;
        myNewPokemon.expNeeded = expNeeded;
        myNewPokemon.currentExp = 0;
    } else if (owner === "trainer") {
        myNewPokemon.level += Math.round(Math.random());
    } else if (owner === "wild") {
        myNewPokemon.level = myPokemon.level - Math.round(Math.random() + 2);
    }

    // Past level 4, new pokemon receive a scaling health bonus
    var maxHPBonus = Math.min(0, (myNewPokemon.level - 4)) * (Math.round(Math.random() * 3) - 1);
    var newMaxHP = pokedex[pokeId].maxHP + 2 * myNewPokemon.level + maxHPBonus;
    myNewPokemon.maxHP = newMaxHP;
    myNewPokemon.currentHP = newMaxHP;

    return myNewPokemon
}

// Function to show dialog or game messages.
function showText(text) {
    playerState = "locked";
    $("#text").text(text);
    $("#text-box").show();
}

// Function to go back one step in a menu or layered screens of variable depth.
function cancelOrBack() {
    if ($("#level-up-screen").css("display") !== "none") {
        $("#level-up-screen").hide();
        menuSound.play();
        return;
    } else if ($("#battle-screen").css("display") !== "none" && !inFight) {
        $("#battle-screen").hide();
        menuSound.play();
    } else if ($("#text-box").css("display") !== "none") {
        $("#text-box").hide();
        $("#confirm-box").hide();
        menuSound.play();
        playerState = "standing";
    }
}

// Generalized function for managing menu options and passing the selected value to a callback function.
function chooseMenuItem(options, callback) {
    var selectedOption = 0;
    
    // Place an indicator arrow in the appropriate row
    function drawArrow() {
        options[selectedOption].innerHTML = "&#9658;"
        for (i = 0; i < options.length; i++) {
            if (i !== selectedOption) {
                options[i].innerHTML = "&nbsp;";
            }
        }
    }
    drawArrow();

    // Generalized event handler that can work with keydown or mousedown/click events
    function eventHandler(event) {
        var token = event.keyCode ? event.keyCode : event.target.id;
        switch (token) {
            case "d-pad-up":
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
            case "d-pad-down":
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
            case "a-button":
            case 75:
                //"k" button -> A. Return data-value of the selected option.
                var value = options[selectedOption].getAttribute("data-value");
                if (value !== "--") {
                    $(document).off();
                    callback(value);
                    menuSound.play();
                }
                break;
            case "b-button":
            case 76:
                //"l" button -> B
                if(!inFight) {
                    $(document).off();
                    cancelOrBack();
                    setGameControls();
                    menuSound.play();
                }
                break;
            default:
        };
    }

    // up + down buttons move the arrow around + add/remove "selectedOption" class
    $(document).off();
    $(document).on("keydown", eventHandler);
    $(document).on("mousedown", eventHandler);
}

// Performs DOM manipulation to show fight screen w/ friendly and enemy pokemon's data.
function enterFightMode(enemyType) {
    inFight = true;
    // Generate a random Pokemon
    var pokemonIndex = 0;
    if (enemyType === "wild") {
        pokemonIndex = (Math.round(Math.random() * 3) + 3);
    } else if (enemyType === "trainer") {
        pokemonIndex = Math.round(Math.random() * 6);
    }
    ranPokemon = instantiatePokemon(pokemonIndex, enemyType);

    // Load stats + images for both pokemon into DOM
    $("#enemy-pokemon-name").text(ranPokemon.name.toUpperCase());
    $("#enemy-pokemon-health-bar").css("width", "8.1vw");
    $("#enemy-pokemon-level").text(ranPokemon.level);
    $("#enemy-pokemon-image").hide();
    $("#enemy-pokemon-image").attr("src", ranPokemon.frontImage);
    $("#friendly-pokemon-name").text(myPokemon.name.toUpperCase());
    var healthBarWidth = 8.1 * (myPokemon.currentHP / myPokemon.maxHP);
    $("#friendly-pokemon-health-bar").css("width", healthBarWidth + "vw");
    $("#friendly-pokemon-level").text(myPokemon.level);
    $("#friendly-pokemon-health-num").html(myPokemon.currentHP + " &nbsp; &nbsp; &nbsp; &nbsp;" + myPokemon.maxHP);
    $("#friendly-pokemon-image").attr("src", myPokemon.backImage);
    $("#friendly-pokemon-image").show();
    var attackMoveDivs = $("#move-options-text").children();
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
        $("#battle-text").text("Poketrainer " + enemyTrainer.name + " sent out " + ranPokemon.name + "!");
    } else {
        $("#battle-text").text("A wild " + ranPokemon.name + " appears!");
    }
    $("#battle-options").hide();
    $("#battle-text").show();
    $("#battle-screen").show("pulsate");
    $("#enemy-pokemon-image").show("slide", { direction : "right", distance : 300 }, 800);
    $(document).off();
    $(document).on("keydown", function(event) {
        if (event.keyCode === 65 || event.keyCode === 75) {
            turn = 0;
            takeTurn();
        }
    });
    $(document).on("click", function(event) {
        if (event.target.id === "a-button" || event.target.id === "b-button") {
            turn = 0;
            takeTurn();
        }
    })
}

// This function allows players to make moves, and gets called over and over until one Pokemon is defeated.
function takeTurn(moveIndex) {
    var computerMove = null;
    var damage = 0;

    if (moveIndex) {
        $("#friendly-pokemon-image").effect("bounce");
        $("#battle-options").hide();
        damage = Math.round(((2 * myPokemon.level) / 100) * (myPokemon.attack / ranPokemon.defense) * pokeMoves[moveIndex].damage);
        ranPokemon.currentHP -= damage;
        var healthBarWidth = 8.1 * (ranPokemon.currentHP / ranPokemon.maxHP);
        setTimeout(function() {
            $("#enemy-pokemon-health-bar").css("width", healthBarWidth + "vw");
            $("#enemy-pokemon-image").effect("shake");
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
        $("#battle-text").hide();
        $("#battle-options").show();
        chooseMenuItem(document.getElementById("move-options").children, takeTurn);
        turn++;
    } else if (turn === 1) {
        // Computer goes second
        setTimeout(function() {
            var ranIndex = Math.round(Math.random() * (ranPokemon.moves.length - 1));
            computerMove = ranPokemon.moves[ranIndex];
            $("#battle-text").show();
            $("#battle-text").text(ranPokemon.name + " used " + pokeMoves[computerMove].name + "!");
            $("#enemy-pokemon-image").effect("bounce");
            damage = Math.round(((2 * ranPokemon.level) / 100) * (ranPokemon.attack / myPokemon.defense) * pokeMoves[computerMove].damage);
            if (damage > myPokemon.currentHP) {
                myPokemon.currentHP = 0;
            } else {
                myPokemon.currentHP -= damage;
            }
            var healthBarWidth = 8.1 * (myPokemon.currentHP / myPokemon.maxHP);
            setTimeout(function() {
                $("#friendly-pokemon-health-bar").css("width", healthBarWidth + "vw");
                $("#friendly-pokemon-health-num").html(myPokemon.currentHP + " &nbsp; &nbsp; &nbsp; &nbsp;" + myPokemon.maxHP);
                $("#friendly-pokemon-image").effect("shake");
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
                if (event.keyCode === 65 || event.keyCode === 75) {
                    takeTurn();
                }
            });
            $(document).on("click", function(event) {
                if (event.target.id === "a-button" || event.target.id === "b-button") {
                    takeTurn();
                }
            });
        }, 1500);
    }
}

// Performs DOM manipulation to show pokemon loss, grants experience when fight was won, takes player back to 
// Pallet Town when defeated.
function pokemonDefeated(defeatedPokemon, playerWonBool) {
    $("#battle-options").hide();
    $("#battle-text").show();
    $("#battle-text").text(defeatedPokemon.name + " has fainted!");
    inFight = false;
    if (playerWonBool) {
        $("#enemy-pokemon-image").hide("explode");
        if (enemyTrainer) {
            enemyTrainer.defeated = true;
            if (checkWin()) {
                changeMusic("finalFourLair", "winScreen");
            } else {
                changeMusic("fight", currentLocation, "pokemonDefeated, trainer fight");
            }
            showText("How could I have lost?!");
        } else {
            changeMusic("fight", currentLocation, "pokemonDefeated, wild pokemon fight");
        }
        myPokemon.currentExp += 5 + ranPokemon.level * 2;
    } else {
        $("#friendly-pokemon-image").hide("pulsate");
    }

    function eventHandler(event) {
        var token = event.keyCode ? event.keyCode : event.target.id;
        if (token === 65 || token === 75 || token === "a-button" || token === "b-button") {
            cancelOrBack();
            if (playerWonBool) {
                if (checkWin()) {
                     $(document).off();
                     $("#win-screen").show().css("display", "flex");
                } else if (myPokemon.currentExp >= myPokemon.expNeeded) {
                    levelUp();
                } else if (enemyTrainer) {
                    // Do nothing so that hitting A or B calls this eventHandler again, 
                    // triggering cancelOrBack to clear the trainer's loss message. This time,
                    // enemyTrainer will be null, so controls get reset.
                } else {
                    playerState = "standing"
                    $(document).off(); // Just do this at the beginning of setGameControls?
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
    }

    $(document).off();
    $(document).on("keydown", eventHandler);
    $(document).on("mousedown", eventHandler);
}

// Increases Pokemon's stats and resets "experience bar" when pokemon levels up. Also performs DOM 
// manipulation to show "level up screen."
function levelUp(){
    myPokemon.level++;
    myPokemon.currentExp = 0;
    myPokemon.expNeeded = 10 * myPokemon.level;
    myPokemon.maxHP += 2;

    $("#pokemon-large-image").attr("src", myPokemon.frontImage);
    $("#level-up-text").text(myPokemon.name + " has reached level " + myPokemon.level + "!");
    $("#level-up-screen").show().css("display", "flex");
    $("#battle-screen").hide();

    function eventHandler(event) {
        var token = event.keyCode ? event.keyCode : event.target.id;
        if (token === 65 || token === 75 || token === "a-button" || token === "b-button") {
            cancelOrBack();
            playerState = "standing";
            $(document).off();
            setGameControls();
        }
    }

    $(document).off();
    $(document).on("keydown", eventHandler);
    $(document).on("mousedown", eventHandler);
}

// Sets event listeners to allow game control through keyboard arrows, w/a/s/d, or HTML controls.
function setGameControls() {

    function eventHandler(event) {
        
        var token = event.keyCode ? event.keyCode : event.target.id;
        switch (token) {
            case "d-pad-left":
                moveInterval = setInterval(function() { movePlayer("left") }, 100);
            case 37:
            case 65:
                // D-pad left, left arrow, keyboard "a" button
                movePlayer("left");
                break;
            case "d-pad-up":
                moveInterval = setInterval(function() { movePlayer("up"); }, 100);
            case 38:
            case 87:
                // D-pad up, up arrow, keyboard "w" button
                movePlayer("up");
                break;
            case "d-pad-right":
                moveInterval = setInterval(function() { movePlayer("right"); }, 100);
            case 39:
            case 68:
                // D-pad right, right arrow, keyboard "d" button
                movePlayer("right");
                break;
            case "d-pad-down":
                moveInterval = setInterval(function() { movePlayer("down"); }, 100);
            case 40:
            case 83:
                //D-pad down, down arrow, keyboard "s" button
                movePlayer("down");
                break;
            case "a-button":
            case 75:
                // a-button, keyboard "k" button
                if (playerState !== "locked") {
                    interactOrSelect();
                } else {
                    cancelOrBack();
                }
                break;
            case "b-button":
            case 76:
                // b-button, keyboard "l" button
                cancelOrBack();
                break;
            case "select":
            case 71:
                // select, keyboard "g" button
                console.log("The select button was pressed");
                break;
            case "start":
            case 72:
                // start, keyboard "h" button
                console.log("The start button was pressed");
                break;
            default:
        };          
    }

    $(document).on("keydown", eventHandler);
    $(document).on("mousedown", eventHandler);

    $(document).on("keyup", function(event) {
        var gameButtons = [37, 65, 38, 87, 39, 68, 40, 83];
        if (gameButtons.includes(event.keyCode) && playerState === "walking") {
            playerState = "standing";
            walkingAnimation(playerDirection);
        }
    });

    $(document).on("mouseup", function(event) {
        clearInterval(moveInterval);
        if (playerState === "walking") {
            playerState = "standing";
            walkingAnimation(playerDirection);
        }
    });
}

// Checks to see whether all four trainers in the Final Four have been defeated.
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













