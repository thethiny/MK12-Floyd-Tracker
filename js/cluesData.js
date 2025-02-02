const clues = [
    {
        "id": 1,
        "name": "Total Disrespect",
        "rounds": "Taunt 4 Times in a match",
        "additional": "If you taunt 4 times and it doesn't work just skip",
        "trigger": "During fight"
    },
    {
        "id": 2,
        "name": "Jumping Gets You Nowhere",
        "rounds": "Win without jumping",
        "additional": "This is tricky, you might get it while doing something else by accident",
        "trigger": "After match"
    },
    {
        "id": 3,
        "name": "Klean Sweep",
        "rounds": "Win while having performed exactly 13 Sweeps",
        "additional": "Do not sweep more than 13 times / Extra: Chat suggests running out of time after 13 sweeps",
        "trigger": "After match"
    },
    {
        "id": 4,
        "name": "Get Over Here Already",
        "character": "Scorpion",
        "rounds": "Win as Scorpion and do a Fatality or an Animality",
        "trigger": "During fight"
    },
    {
        "id": 5,
        "name": "Flipping Out",
        "rounds": "Flip Stance exactly 16 times and win the match",
        "additional": "Do not flip stance more than 16 times",
        "trigger": "After match"
    },
    {
        "id": 6,
        "name": "Up & Away",
        "rounds": "Perform 5 Uppercuts exactly in one match and win",
        "additional": "Uppercut must not finish with Brutality",
        "trigger": "After match"
    },
    {
        "id": 7,
        "name": "No Elder God",
        "character": "Raiden",
        "rounds": "Get first hit against Raiden",
        "trigger": "During fight"
    },
    {
        "id": 8,
        "name": "I Make The Rules",
        "character": "Liu Kang",
        "rounds": "Double Flawless as Liu Kang",
        "trigger": "During fight"
    },
    {
        "id": 9,
        "name": "No Luna",
        "character": "Reptile",
        "rounds": "Double Flawless against Reptile",
        "trigger": "During fight"
    },
    {
        "id": 10,
        "name": "Fire & Ice",
        "character": "Scorpion",
        "rounds": "400 Damage combo using Scorpion and Subzero Kameo",
        "additional": "Pull the enemy towards you, Hit Fatal Blow and mash the buttons",
        "trigger": "During fight"
    },
    {
        "id": 11,
        "name": "Ice & Fire",
        "character": "Subzero",
        "rounds": "5 Hit Combo as Subzero using Scorpion Kameo",
        "additional": "B 2 2 Kameo B 2 2",
        "trigger": "During fight"
    },
    {
        "id": 12,
        "name": "Perfect Kouple",
        "character": "Johnny Cage",
        "rounds": "As Johnny Cage have Sonya as your Kameo & Double Flawless",
        "trigger": "After match"
    },
    {
        "id": 13,
        "name": "Get The Horns",
        "character": "Shao Kahn",
        "rounds": "As Shao Kahn let Motaro do the Fatal Blow",
        "additional": "Fatal Blow requires first hit from Motaro",
        "trigger": "During fight"
    },
    {
        "id": 14,
        "name": "Hip Hop 4 Ever",
        "rounds": "Jump exactly 22 times and win the match",
        "additional": "Do not jump more than 22 times",
        "trigger": "After match"
    },
    {
        "id": 15,
        "name": "Yeet!!!",
        "rounds": "Throw exactly 7 times and win the match",
        "additional": "Backwards Throw (No Kameo) 7 times",
        "trigger": "After match"
    },
    {
        "id": 16,
        "name": "This Is Where You Fall Down",
        "character": "Johnny Cage",
        "rounds": "Lose to Johnny Cage with less than 9 seconds left",
        "requirements": "Final Round",
        "additional": "Reference to Johnny Cage from 1995 Movie",
        "trigger": "After match"
    },
    {
        "id": 17,
        "name": "Timed Out",
        "rounds": "Lose by running out of time",
        "requirements": "Final Round",
        "trigger": "After match"
    },
    {
        "id": 18,
        "name": "You Suck",
        "character": "Shao Kahn",
        "rounds": "Lose to Shao Kahn on the Final Round when he has Critical health (< 11)",
        "requirements": "Final Round",
        "additional": "It's official. You Suck!",
        "trigger": "After match"
    },
    {
        "id": 19,
        "name": "I'm Down Too",
        "rounds": "Win by Spamming Down 2 (Uppercut) Into Brutality",
        "requirements": "Final Round",
        "additional": "You can punch but not recommended. Max 1 punch. Brutality is Optional.",
        "trigger": "After match"
    },
    {
        "id": 20,
        "name": "Fists Of Fury",
        "rounds": "Win by using Punches Only",
        "additional": "Do not do jump punches",
        "trigger": "After match"
    },
    {
        "id": 21,
        "name": "Kicking It",
        "rounds": "Win by using Kicks Only",
        "additional": "Use Scorpion's 3, 3, 3 combo. Easiest way to do it.",
        "trigger": "During fight"
    },
    {
        "id": 22,
        "name": "Sans Jade",
        "rounds": "Win by using Front Kicks only",
        "additional": "Front Kick is 3 - X on PS, A on Xbox, B on Switch, K on PC",
        "trigger": "During fight"
    },
    {
        "id": 23,
        "name": "Losing Is Winning",
        "rounds": "Lose without doing anything",
        "requirements": "Round 1",
        "additional": "Just put the controller down and let the AI beat you",
        "trigger": "During fight"
    },
    {
        "id": 24,
        "name": "Keep Kalm & Finish",
        "rounds": "Press 0 buttons in round 1, win round 2 and 3.",
        "requirements": "Round 1",
        "additional": "Do the same, but then win 2 rounds in a row.",
        "trigger": "After match"
    }, {
        "id": 25,
        "name": "Demonic Duo",
        "character": "Ashrah",
        "rounds": "Use Sareena Kameo's Jataaka Blessing on yourself after using up 3 meter bars",
        "additional": "Let enemy hit you until you have 3 bars. Use your Ex moves until your bar is 0% and MISS (so you don't gain meter by accident). Use Down + Kameo (R1) so you regain a meter.",
        "trigger": "During fight"
    },
    {
        "id": 26,
        "name": "Frosty!!!",
        "character": "Subzero",
        "enemy": "Subzero",
        "rounds": "Use all 3 Deep Freeze Kameo moves (Cancel, Throw, Parry) on ENEMY SubZero",
        "additional": "Enemy Subzero. Parry: Hold Kameo + Down, then let Subzero hit you. Throw: Hold Kameo + Down then Kameo + Right. Cancel: Hold Kameo + Down then Kameo + Back.",
        "trigger": "During fight"
    },
    {
        "id": 27,
        "name": "Toasty!!!",
        "character": "Scorpion",
        "enemy": "Scorpion",
        "rounds": "Use Flame Aura 3 times on yourself & the enemy",
        "additional": "Hold Kameo Button (R1) 3 times on yourself",
        "trigger": "During fight"
    },
    {
        "id": 28,
        "name": "Ka Ballin",
        "character": "Mileena",
        "rounds": "Land 7 Mileena Ball Rolls",
        "trigger": "During fight"
    },
    {
        "id": 29,
        "name": "Hat Trick",
        "character": "Kung Lao",
        "rounds": "Hit your enemy with every hat from you and your Kameo including Upwards Hat",
        "additional": "All Hat moves must hit. Char: Hat Toss, Hat Toss High, Hat Toss Air, Buzzsaw. Kameo: Orbit Hat, Kameo Buzzsaw.",
        "trigger": "During fight"
    },
    {
        "id": 30,
        "name": "Fatal Finish",
        "rounds": "Do 1 Fatality with 5 characters",
        "trigger": "During fight"
    },
    {
        "id": 31,
        "name": "You Finish Yet???",
        "rounds": "Do 5 Fatalities with 1 character",
        "trigger": "During fight"
    },
    {
        "id": 32,
        "name": "Inner Beast",
        "rounds": "Do 2 animalities with 1 character",
        "trigger": "During fight"
    },
    {
        "id": 33,
        "name": "Shaolin Monks",
        "character": "Liu Kang",
        "enemy": "Kung Lao",
        "rounds": "Klassic Ladder as Liu Kang With Kung Lao Kameo",
        "requirements": "Next Match Start",
        "additional": "Open a versus match when you're done to get the notification",
        "trigger": "During fight"
    },
    {
        "id": 34,
        "name": "Door Buster",
        "character": "Baraka",
        "rounds": "Succeed in Baraka's Test Your Might (Chapter 5, the last 2 episodes, Trapped) in Story Mode",
        "requirements": "Next Match Start",
        "additional": "Easy Test Your Might Must be off (Settings > Accessibility > Gameplay Assistance > Story Test Your Might ON). Quit and open a versus match to get the notification.",
        "trigger": "During fight"
    },
    {
        "id": 35,
        "name": "Climb The Pyramid",
        "rounds": "Replay Chapter 15 and reach the top of the Pyramid",
        "requirements": "Next Match Start",
        "additional": "Quit after beating Shang and open a versus match to get the notification",
        "trigger": "During fight"
    },
    {
        "id": 36,
        "name": "Challenge Accepted",
        "rounds": "Earn 20 points from Towers of Time Daily/Weekly Challenges",
        "requirements": "Next Match Start",
        "additional": "Press Start to see your Daily Challenges / Tower Points do not count, must be challenge.",
        "trigger": "During fight"
    },
    {
        "id": 37,
        "name": "Quest Keeper",
        "rounds": "Complete a Daily Challenge 2 times",
        "additional": "Daily Challenge in the Kombat Profile (Weekly may work)",
        "trigger": "During fight"
    }
]