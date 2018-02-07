// location is stored as [y index, x index]

// STEPS for adding an NPC:
// 1. Add the npc object to the appropriate map here
// 2. Add the npc's to the map data file
// 3. 

var allNPCs = {
    pallet : [
        { 
            name : "Jane",
            location : [8, 4], 
            background : "img/npcs/pallet/60.png", // 16px wide, 18px tall
            facing : "right", 
            trainer : false, 
            dialog : "What year is it? WHAT YEAR IS IT?!" 
        },
        { 
            name : "John",
            location : [15, 10],
            background : "img/npcs/pallet/61.png", 
            facing : "down", 
            trainer : false, 
            dialog : "GET IT OFF OF ME! IT BURNS!" 
        }
    ],
    ashHouse1 : [
        {
            name : "Mom",
            location : [4, 5], 
            background : "img/npcs/ashHouse1/60.png", 
            facing : "down", 
            trainer : false, 
            dialog : "You gotta eat! Who do you think you are?"
        }
    ],
    rivalHouse : [
        {
            name : "rivalSister",
            location : [3, 2], 
            background : "img/npcs/rivalHouse/60.png", // 18px wide, 19px tall
            facing : "right", 
            trainer : false, 
            dialog : "Why are you in my house? Mad creepy, bro."
        }
    ],
    oakLab : [
        {
            name : "nerdDude1",
            location : [10, 2], 
            background : "img/npcs/oakLab/60.png", // 18px wide, 19px tall
            facing : "left", 
            trainer : false, 
            dialog : "60 percent of the time it works every time."
        },
        {
            name : "nerdDude2",
            location : [9, 8], 
            background : "img/npcs/oakLab/60.png", // 18px wide, 19px tall
            facing : "left", 
            trainer : false, 
            dialog : "Why does Ted always get the ladies?"
        },
        {
            name : "nerdGirl",
            location : [10, 1], 
            background : "img/npcs/oakLab/61.png", // 18px wide, 19px tall
            facing : "down", 
            trainer : false, 
            dialog : "Do you have pizza bagels? I'm so stoned right now."
        },
        {
            name : "profOak",
            location : [2, 5], 
            background : "img/npcs/oakLab/62.png", // 18px wide, 19px tall
            facing : "down", 
            trainer : false, 
            dialog : "It's dangerous to go alone! Take a Pokemon."
        }
    ],
    route1 : []
}









