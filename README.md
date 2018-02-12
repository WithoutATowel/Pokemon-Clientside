# WDI-Project-1: Pokemon

## Technologies Used 
For this project I used the following technologies:
* HTML
* CSS3
* Sass
* JavaScript
* JSON
* jQuery
* jQuery UI

Notably, I did *not* use HTML5 canvas, opting to rely on jQuery UI and CSS transitions for animation.

## Approach Taken
I originally planned to use this project as an excuse to learn and practice CSS grid, storing the player using column and row coordinates. Unfortunately, I found that moving objects between columns/rows can't be animated in CSS, so I didn't end up exploring grid in as much depth as I had hoped. 

Despite not being able to rely on CSS grid directly, I was able to create and use a grid metaphor by setting a fixed width/height for a "cell" and scaling elements accordingly. Hence I was able to store my player's location with X and Y coordinates, and to store map contents in a 2D array (loaded from JSON). Sass was helpful in keeping my CSS organized by a single "cell edge length" value.

The page itself is modeled after the original GameBoy, which I mocked up by cutting apart and repositioning an image of a GameBoy in Gimp. I also used screen grabs from the original game to design my fight system / screens. Mocks can be viewed [here](https://docs.google.com/presentation/d/1fgDLMFGyrjgU_yAUaeh4Pe-IuZw8EmwuOtK9M4iFZik/edit#slide=id.p)

## Unsolved Problems
On my local machine there are some strange bugs where DOM manipulation to load an image succeeds ("src" property is set correctly), but the wrong image is displayed. This may be an issue with the python server script I used to allow local AJAX requests.

There are a number of features I'd like to add in the future:
* Animations for HTML button press, and tie to all input methods.
* Add NPC movement
* Save game + load game
* "Turn Gameboy off/on"
* Intro animation + explanation of game
* Enter and store player's name at beginning of game