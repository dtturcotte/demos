# Child Rummy

Hi, I decided to make a version of Child Rummy for fun. Hope you enjoy :)

![My Rummy Game!](http://i.imgur.com/dw877bK.png "My Rummy Game!")

#### Rules:

- Winning hands: First player to get sets of **3-of-a-kind, different suites** and a **4-card-run, same suits**

#### Technology:

- Gameplay logic: JavaScript with jQuery
- Animations: HTML5 Canvas and RaphaelJS
- Assets: Playing cards were used from OpenGameArt: http://opengameart.org/content/playing-cards-vector-png

## 1. Game Mechanics

The game is separated into four main classes:

- Manager.js: handles gameplay logic
- Table.js: simple table class for Raphael Paper
- Player.js: player class
- Card.js: card class, with click handlers 

The game allows you to play the computer, or have the computers play each other. `GameState` manages whose turn it is and current step (draw or discard)

The game will continue until a player has a winning hand or a stalemate is reached (deck is empty)

## 2. Goal Detection

All goal logic is handled in `api.calculate()`:

1. Group player's cards by suit and value. Value: Card of value '6' has `[diamonds, clubs, hearts]`, Suit: Card of suit 'Spades' has `[2, 3, 4, 5]`
2. Get meld values (3 of a kind, different suit) by checking suits per value meet the specified meld threshold (default 3)
3. Get run values (4 card run, same suit) by checking values per suit meet the specified run threshold (default 4)

    - Loop through each suit's values to check for valid incrementing values
    - Perform initial loop to check that values are incrementing
    - Perform second check to verify incrementing values actually create a valid run. Meaning, `[3, 4, 5, 11, 12]` are incrementing, but are multiple runs in one.
    - This needs to be performed forward and backward: Ex: `[8, 7, 6, 5 ... 3, 2]`, or `[2, 3, 4, 5 ... 7, 8]`, and splice out invalid values

4. Assign value sets to each card: Deadwood, Meld, Run. This will be used for AI to determine if a card is valuable. 

## 3. User Interface

I designed the player interface using HTML5 Canvas and Raphael JS SVGs:

1. Left Panel: Player data and scoring
2. Top Middle: Click "Deal" to start game
3. Right Panel: Control Panel

    - **"Enable AI game":** Choose this to have two computers play each other.
    - **"Show AI hand":** Reveal AI hand.
    - **"Run Threshold":** Scale up or down the amount of run cards needed in a set to win.
    - **"Meld Threshold":** Scale up or down the amount of meld cards needed in a set to win.
    - **"Game Speed":** Set the pace of the game (modifies # milliseconds for game timer).

4. Center: Players, player hands, deck, and discard pile

**Note:** `api.handleCardAnimation()` has a lot of conditionals for positioning as RaphaelJS's animations are often wonky and need tweaking based on saved coordinates of cards. You'll still occasionally see that card positions are a bit off.

## 4. AI

`api.nextTurn()` calls `AI()` if it's the computer's turn or "Enable AI game" is set to `true`.

The game evaluates the current state, get card or throw card:

1. Get Card:

    - Evaluate discard deck card: Runs `api.calculate()` on the hand if the discard deck card were included and checks if it's a valuable card (not deadwood).
    - It also needs to check if the potential card was just thrown. AI shouldn't pick up a card it just threw as it sometimes creates an infinite loop.

2. Throw Card:

    - Running `api.calculate()` in the "Get Card" state has preset the `valueSets` of each card as `meld`, `run`, or `deadwood`. 
    - Check if melds and runs have been satisfied, throw extra cards even if they are "valuable" as to free up options to create the other needed winning set.
    - Throw deadwood if any.
    - Set the thrown card id as to prevent reselecting it on draw.

**Note:** The AI is sub-optimal:

- It does not track cards that do not immediately satisfy a meld or a run. Meaning, if I have a `Spades: [2, 3]`, and a `4` of `spades` is available, it will not necessarily pick it up because it does not create a meld. It will pick it up if current hand is `Spades: [1, 2, 3]`.
- It does not track the other player's hand (AKA: tracking which cards the opponent has drawn from discard pile). Meaning, If opponent needs a card to win, CPU does not know to keep this card.

These are things I will work on for version 2.0 :)

----

## Things I will be working on for version 2:

- Fix AI to be optimal (as described above).
- Use websockets to create an online experience.
- Create a version for Mahjong (similar to Rummy), which is my favorite game!

