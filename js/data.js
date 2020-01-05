var maps = {
    "mapLocations": {
        "pallet" : [
            [ 
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, "route1", "route1", 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, "ashHouse1", 1, 1, 0, 0, 0, 0, 1, "rivalHouse", 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 20, 1, 0, 1, 1, 0, 0, 0, 22, 1, 0, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 60, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1, 1, 21, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, "oakLab", 1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 23, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 3, 3, 3, 3, 0, 0, 61, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 1, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            {
                "ashHouse1": [7, 6, "down"],
                "rivalHouse": [7, 14, "down"],
                "oakLab": [13, 13, "down"],
                "route1": [2, 11, "down"],
                "finalFourLair": [2, 11, "down"]
            }
        ],
        "ashHouse1" : [
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 1, 0, 0, 0, "ashHouse2", 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 60, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, "pallet", "pallet", 1, 1, 1, 1, 1]
            ],
            {
                "pallet": [8, 3, "up"],
                "ashHouse2": [2, 7, "left"]
            }
        ],
        "ashHouse2" : [
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 22, 1, 1, 0, 0, 0, 0, "ashHouse1", 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 20, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 21, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            {
                "ashHouse1": [2, 7, "left"]
            }
        ],
        "rivalHouse" : [
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 60, 1, 1, 1, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 1, "pallet", "pallet", 1, 1, 1, 1, 1]
            ],
            {
                "pallet": [8, 3, "up"]
            }
        ],
        "oakLab" : [
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 63, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 70, 71, 72, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 61, 0, 1],
                [1, 0, 62, 60, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, "pallet", "pallet", 1, 1, 1, 1, 1]
            ],
            {
                "pallet": [12, 5, "up"]
            }
        ],
        "route1" : [
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, "finalFourLair", "finalFourLair", 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 62, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 5, 5, 5, 5, 5, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 4, 61, 4, 4, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 5, 0, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 5, 5, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 60, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 5, 5, 0, 0, 0, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0, 1],
                [1, 0, 1, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 4, 4, 4, 4, 1, 0, 1],
                [1, 0, 1, 4, 4, 4, 4, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 1, 0, 1],
                [1, 0, 1, 4, 4, 4, 4, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, "pallet", "pallet", 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            {
                "pallet" : [36, 9, "up"],
                "finalFourLair" : [1, 9, "down"]
            }
        ],
        "finalFourLair" : [
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 0, 0, 60, 61, 62, 63, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, "route1", "route1", 1, 1, 1, 1, 1]
            ],
            {
                "route1" : [11, 5, "up"]
            }
        ]
    }
}

NPCsAndObjects = {
    "staticObjects" : {
        "pallet" : [
            { 
                "item" : "sign1",
                "location" : [8, 4], 
                "text" : "I believe in a thing called love." 
            },
            { 
                "item" : "sign2",
                "location" : [8, 4], 
                "text" : "Just listen to the rythm of my heart." 
            },
            { 
                "item" : "sign3",
                "location" : [8, 4], 
                "text" : "There's a chance we can make it now." 
            },
            { 
                "item" : "sign4",
                "location" : [8, 4], 
                "text" : "We'll be rocking 'til the sun goes down." 
            }
        ],
        "ashHouse1" : [
            { 
                "item" : "tv",
                "location" : [8, 4], 
                "text" : "Hm. The original Matrix is on." 
            }
        ],
        "ashHouse2" : [
            { 
                "item" : "tv",
                "location" : [8, 4], 
                "text" : "This is no time for games." 
            },
            { 
                "item" : "tv",
                "location" : [9, 4], 
                "text" : "This is no time for games." 
            },
            { 
                "item" : "computer",
                "location" : [8, 4], 
                "text" : "This is no time for games. Or whatever." 
            }
        ],
        "oakLab" : [
            { 
                "item" : "computer",
                "location" : [8, 4], 
                "text" : "More cat pics please." 
            }
        ]
    },
    "claimableObjects" : {
        "oakLab" : [
            { 
                "type" : "pokemon",
                "name" : "bulbasaur",
                "pokeId" : 0,
                "location" : [4, 7],
                "background" : "img/objects/pokeball.png",
                "confirmText" : "Claim Bulbasaur as your first Pokemon?",
                "status" : "unclaimed"
            },
            { 
                "type" : "pokemon",
                "name" : "squirtle",
                "pokeId" : 1,
                "location" : [4, 8],
                "background" : "img/objects/pokeball.png",
                "confirmText" : "Claim Squirtle as your first Pokemon?",
                "status" : "unclaimed"
            },
            { 
                "type" : "pokemon",
                "name" : "charmander",
                "pokeId" : 2,
                "location" : [4, 9],
                "background" : "img/objects/pokeball.png",
                "confirmText" : "Claim Charmander as your first Pokemon?",
                "status" : "unclaimed"
            }
        ]
    },
    "allNPCs" : {
        "pallet" : [
            { 
                "name" : "Jane",
                "location" : [9, 5], 
                "background" : "img/npcs/pallet/60.png",
                "facing" : "right", 
                "trainer" : false, 
                "dialog" : "What year is it? WHAT YEAR IS IT?!" 
            },
            { 
                "name" : "John",
                "location" : [16, 11],
                "background" : "img/npcs/pallet/61.png", 
                "facing" : "down", 
                "trainer" : false, 
                "dialog" : "GET IT OFF OF ME! IT BURNS!" 
            }
        ],
        "ashHouse1" : [
            {
                "name" : "Mom",
                "location" : [5, 6], 
                "background" : "img/npcs/ashHouse1/60.png", 
                "facing" : "down", 
                "trainer" : false, 
                "dialog" : "Mom: You gotta eat! Who do you think you are?",
                "healer" : true
            }
        ],
        "rivalHouse" : [
            {
                "name" : "rivalSister",
                "location" : [4, 3], 
                "background" : "img/npcs/rivalHouse/60.png",
                "facing" : "right", 
                "trainer" : false, 
                "dialog" : "Why are you in my house? Very creepy."
            }
        ],
        "oakLab" : [
            {
                "name" : "nerdDude1",
                "location" : [11, 3], 
                "background" : "img/npcs/oakLab/60.png",
                "facing" : "left", 
                "trainer" : false, 
                "dialog" : "60 percent of the time it works every time."
            },
            {
                "name" : "nerdDude2",
                "location" : [10, 9], 
                "background" : "img/npcs/oakLab/60.png",
                "facing" : "left", 
                "trainer" : false, 
                "dialog" : "Why does Ted always get the ladies?"
            },
            {
                "name" : "nerdGirl",
                "location" : [11, 2], 
                "background" : "img/npcs/oakLab/61.png",
                "facing" : "down", 
                "trainer" : false, 
                "dialog" : "I am SO stoned right now."
            },
            {
                "name" : "profOak",
                "location" : [3, 6], 
                "background" : "img/npcs/oakLab/62.png",
                "facing" : "down", 
                "trainer" : false, 
                "dialog" : "Prof Oak: It's dangerous to go alone! Take a Pokemon."
            }
        ],
        "route1" : [
            {
                "name" : "Doug",
                "location" : [26, 4],
                "background" : "img/npcs/route1/60.png",
                "facing" : "down",
                "trainer" : true,
                "dialog" : "How is this different from dog fighting? Hahaha!",
                "defeated" : false
            },
            {
                "name" : "Bert",
                "location" : [14, 14],
                "background" : "img/npcs/route1/61.png",
                "facing" : "left",
                "trainer" : true,
                "dialog" : "You don't stand a chance!",
                "defeated" : false
            },
            {
                "name" : "Mom",
                "location" : [3, 8], 
                "background" : "img/npcs/route1/62.png", 
                "facing" : "right", 
                "trainer" : false, 
                "dialog" : "Mom: Wait, how did I get here?",
                "healer" : true
            }
        ],
        "finalFourLair" : [
            {
                "name" : "DeVito",
                "location" : [2, 4],
                "background" : "img/npcs/finalFourLair/60.png",
                "facing" : "down",
                "trainer" : true,
                "dialog" : "Alright, let's do this...",
                "finalFour" : true,
                "defeated" : false
            },
            {
                "name" : "Dee",
                "location" : [2, 5],
                "background" : "img/npcs/finalFourLair/61.png",
                "facing" : "down",
                "trainer" : true,
                "dialog" : "What? Did you say something?",
                "finalFour" : true,
                "defeated" : false
            },
            {
                "name" : "Knuckles",
                "location" : [2, 6], 
                "background" : "img/npcs/finalFourLair/62.png", 
                "facing" : "down", 
                "trainer" : true, 
                "dialog" : "Don't touch my hair, dude.",
                "finalFour" : true,
                "defeated" : false
            },
            {
                "name" : "Walter",
                "location" : [2, 7], 
                "background" : "img/npcs/finalFourLair/63.png", 
                "facing" : "down", 
                "trainer" : true, 
                "dialog" : "Say.  My.  Name.",
                "finalFour" : true,
                "defeated" : false
            }
        ]
    }
}

pokemon = { 
    "pokedex" : [
        {
            "name" : "Bulbasaur",
            "maxHP" : 10,
            "level" : 5,
            "moves" : [0, 1],
            "attack" : 12,
            "defense" : 10,
            "frontImage" : "img/pokemon/front/bulbasaur.png",
            "backImage" : "img/pokemon/back/bulbasaur.png"
        },
        {
            "name" : "Squirtle",
            "maxHP" : 10,
            "level" : 5,
            "moves" : [0, 2],
            "attack" : 10,
            "defense" : 12,
            "frontImage" : "img/pokemon/front/squirtle.png",
            "backImage" : "img/pokemon/back/squirtle.png"
        },
        {
            "name" : "Charmander",
            "maxHP" : 9,
            "level" : 5,
            "moves" : [3, 1],
            "attack" : 13,
            "defense" : 9,
            "frontImage" : "img/pokemon/front/charmander.png",
            "backImage" : "img/pokemon/back/charmander.png"
        },
        {
            "name" : "Pidgey",
            "maxHP" : 12,
            "level" : 4,
            "moves" : [0],
            "attack" : 8,
            "defense" : 10,
            "frontImage" : "img/pokemon/front/pidgey.png"
        },
        {
            "name" : "Rattata",
            "maxHP" : 12,
            "level" : 4,
            "moves" : [0, 2],
            "attack" : 10,
            "defense" : 8,
            "frontImage" : "img/pokemon/front/rattata.png"
        },
        {
            "name" : "Pikachu",
            "maxHP" : 12,
            "level" : 4,
            "moves" : [4, 2],
            "attack" : 9,
            "defense" : 9,
            "frontImage" : "img/pokemon/front/pikachu.png"
        },
        {
            "name" : "Caterpie",
            "maxHP" : 12,
            "level" : 4,
            "moves" : [5, 0],
            "attack" : 9,
            "defense" : 9,
            "frontImage" : "img/pokemon/front/caterpie.png"
        }
    ],
    "pokeMoves" : [
        {
            "name" : "Tackle",
            "damage" : 40
        },
        {
            "name" : "Growl",
            "damage" : 20
        },
        {
            "name" : "Tail Whip",
            "damage" : 35
        },
        { 
            "name" : "Scratch",
            "damage" : 40
        },
        {    
            "name" : "Thunder Shock",
            "damage" : 35
        },
        { 
            "name" : "String Shot",
            "damage" : 30
        }
    ]
}