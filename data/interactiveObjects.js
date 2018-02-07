var staticObjects = {
    pallet : [
        { 
            item : "sign1",
            location : [8, 4], 
            text : "I believe in a thing called love." 
        },
        { 
            item : "sign2",
            location : [8, 4], 
            text : "Just listen to the rythm of my heart." 
        },
        { 
            item : "sign3",
            location : [8, 4], 
            text : "There's a chance we can make it now." 
        },
        { 
            item : "sign4",
            location : [8, 4], 
            text : "We'll be rocking 'til the sun goes down." 
        },
    ],
    ashHouse1 : [
        { 
            item : "tv",
            location : [8, 4], 
            text : "Hm. The original Matrix is on." 
        }
    ],
    ashHouse2 : [
        { 
            item : "tv",
            location : [8, 4], 
            text : "This is no time for games." 
        },
        { 
            item : "tv",
            location : [8, 4], 
            text : "This is no time for games." 
        },
        { 
            item : "computer",
            location : [8, 4], 
            text : "This is no time for games. Or whatever." 
        }
    ],
    oakLab : [
        { 
            item : "computer",
            location : [8, 4], 
            text : "More cat pics please." 
        }
    ]
};

var claimableObjects = {
    oakLab : [
        { 
            type : "pokemon",
            id : "bulbasaur",
            location : [4, 7],
            background : "img/objects/pokeball.png",
            confirmText : "Claim Bulbasaur as your first Pokemon?",
            status : "unclaimed"
        },
        { 
            type : "pokemon",
            id : "squirtle",
            location : [4, 8],
            background : "img/objects/pokeball.png",
            confirmText : "Claim Squirtle as your first Pokemon?",
            status : "unclaimed"
        },
        { 
            type : "pokemon",
            id : "charmander",
            location : [4, 9],
            background : "img/objects/pokeball.png",
            confirmText : "Claim Charmander as your first Pokemon?",
            status : "unclaimed"
        }
    ]
};