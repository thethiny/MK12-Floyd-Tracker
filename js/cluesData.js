const clues = [
    {
        "id": 1,
        "name": "Total Disrespect",
        "requirements": "Taunt 4 Times in a match",
        "trigger": "During fight",
        "video": `https://twitter.com/interloko/status/1881854543472030036`,
    },
    {
        "id": 2,
        "name": "Jumping Gets You Nowhere",
        "requirements": "Win without jumping",
        "additional": "This is tricky, you might get it while doing something else by accident",
        "trigger": "After match",
        
    },
    {
        "id": 3,
        "name": "Klean Sweep",
        "requirements": "Win while having performed exactly 13 Sweeps",
        "additional": "Do not sweep more than 13 times / Extra: Chat suggests running out of time after 13 sweeps",
        "trigger": "After match",
        "video": "https://www.twitch.tv/videos/2359622883?time=8h45m30s",
    },
    {
        "id": 4,
        "name": "Get Over Here Already",
        "character": "Scorpion",
        "requirements": "Win as Scorpion and do a Fatality or an Animality",
        "trigger": "During fight",
    },
    {
        "id": 5,
        "name": "Flipping Out",
        "requirements": "Flip Stance exactly 16 times and win the match",
        "additional": "Do not flip stance more than 16 times",
        "trigger": "After match",
        "video": "https://x.com/MaxViannaYT/status/1882275256704159999",
    },
    {
        "id": 6,
        "name": "Up & Away",
        "requirements": "Perform 5 Uppercuts exactly in one match and win",
        "additional": "Uppercut must not finish with Brutality",
        "trigger": "After match",
    },
    {
        "id": 7,
        "name": "No Elder God",
        "enemy": "Raiden",
        "requirements": "Get first hit against Raiden",
        "trigger": "During fight",
        "video": "https://www.youtube.com/watch?v=rdExr2eoe5o&t=551s"
    },
    {
        "id": 8,
        "name": "I Make The Rules",
        "character": "Liu Kang",
        "requirements": "Double Flawless as Liu Kang",
        "round": "1 & 2",
        "trigger": "During fight",
        "video": "https://x.com/MaxViannaYT/status/1882312440756441295",
    },
    {
        "id": 9,
        "name": "No Luna",
        "enemy": "Reptile",
        "requirements": "Double Flawless against Reptile",
        "round": "1 & 2",
        "trigger": "During fight",
    },
    {
        "id": 10,
        "name": "Fire & Ice",
        "character": "Scorpion & SubZero Kameo",
        "requirements": "400 Damage combo using Scorpion and Subzero Kameo",
        "additional": "Pull the enemy towards you, Hit Fatal Blow and mash the buttons",
        "trigger": "During fight",
        "video": "https://x.com/Raddkann/status/1881989951312871736",
    },
    {
        "id": 11,
        "name": "Ice & Fire",
        "character": "Subzero & Scorpion Kameo",
        "requirements": "5 Hit Combo as Subzero using Scorpion Kameo",
        "additional": "B 2 2 Kameo B 2 2",
        "trigger": "During fight",
        "video": "https://www.youtube.com/watch?v=x0MmrFI65tA"
    },
    {
        "id": 12,
        "name": "Perfect Kouple",
        "character": "Johnny Cage & Sonya Kameo",
        "requirements": "As Johnny Cage have Sonya as your Kameo & Double Flawless",
        "round": "1 & 2",
        "trigger": "After match",
    },
    {
        "id": 13,
        "name": "Get The Horns",
        "character": "Shao Kahn & Motaro Kameo",
        "requirements": "As Shao Kahn let Motaro do the Fatal Blow",
        "additional": "Fatal Blow requires first hit from Motaro",
        "trigger": "During fight",
        "video": "https://x.com/MaxViannaYT/status/1882274393155645667"
    },
    {
        "id": 14,
        "name": "Hip Hop 4 Ever",
        "requirements": "Jump exactly 22 times and win the match",
        "additional": "Do not jump more than 22 times",
        "trigger": "After match",
    },
    {
        "id": 15,
        "name": "Yeet!!!",
        "requirements": "Throw exactly 7 times and win the match",
        "additional": "Backwards Throw (No Kameo) 7 times",
        "trigger": "After match",
    },
    {
        "id": 16,
        "name": "This Is Where You Fall Down",
        "enemy": "Johnny Cage",
        "requirements": "Lose to Johnny Cage with less than 9 seconds left",
        "round": "Final Round",
        "additional": "Reference to Johnny Cage from 1995 Movie",
        "trigger": "After match",
        "video": "https://youtu.be/_Ppf398aV5A"
    },
    {
        "id": 17,
        "name": "Timed Out",
        "requirements": "Lose by running out of time",
        "round": "Final Round",
        "trigger": "After match",
        "video": "https://x.com/MK_habit_addict/status/1882518135624135000",
    },
    {
        "id": 18,
        "name": "You Suck",
        "enemy": "Shao Kahn",
        "requirements": "Lose to Shao Kahn on the Final Round when he has Critical health (< 11)",
        "round": "Final Round",
        "additional": "It's official. You Suck!",
        "trigger": "After match",
        "video": "https://x.com/EtherealSabbath/status/1882918441893642451",
    },
    {
        "id": 19,
        "name": "I'm Down Too",
        "requirements": "Win by Spamming Down 2 (Uppercut) Into Brutality",
        "round": "Final Round",
        "additional": "You can punch but not recommended. Max 1 punch. Brutality is Optional.",
        "trigger": "After match",
        "video": "https://x.com/RealDeadTrigger/status/1882570423260602532",
    },
    {
        "id": 20,
        "name": "Fists Of Fury",
        "requirements": "Win by using Punches Only",
        "additional": "Do not do jump punches",
        "trigger": "After match",
    },
    {
        "id": 21,
        "name": "Kicking It",
        "requirements": "Win by using Kicks Only",
        "additional": "Use Scorpion's 3, 3, 3 combo. Easiest way to do it.",
        "trigger": "During fight",
        "video": "https://x.com/RealDeadTrigger/status/1882571631673135176",
    },
    {
        "id": 22,
        "name": "Sans Jade",
        "requirements": "Win by using Front Kicks only",
        "additional": "Front Kick is 3 - X on PS, A on Xbox, B on Switch, K on PC",
        "trigger": "During fight",
    },
    {
        "id": 23,
        "name": "Losing Is Winning",
        "requirements": "Lose without doing anything",
        "round": "Round 1",
        "additional": "Just put the controller down and let the AI beat you",
        "trigger": "During fight",
    },
    {
        "id": 24,
        "name": "Keep Kalm & Finish",
        "requirements": "Press 0 buttons in round 1, win round 2 and 3.",
        "round": "Round 1",
        "additional": "Do the same as #23, but then win 2 rounds in a row.",
        "trigger": "After match",
        "video": "https://www.youtube.com/watch?v=hjbcWYeibgM",
    },
    {
        "id": 25,
        "name": "Demonic Duo",
        "character": "Ashrah & Sareena Kameo",
        "requirements": "As Ashrah, use Sareena Kameo's Jataaka Blessing on yourself after using up 3 meter bars",
        "additional": "Let enemy hit you until you have 3 bars. Use your Ex moves until your bar is 0% and MISS (so you don't gain meter by accident). Use Down + Kameo (R1) so you regain a meter.",
        "trigger": "During fight",
        "video": "https://x.com/alex8asant19/status/1884074150362505418",
    },
    {
        "id": 26,
        "name": "Frosty!!!",
        "character": "Subzero Kameo",
        "enemy": "Subzero Character",
        "requirements": "Use all 3 Deep Freeze Kameo moves (Cancel, Throw, Parry) on ENEMY SubZero",
        "additional": "Enemy Subzero. Parry: Hold Kameo + Down, then let Subzero hit you. Throw: Hold Kameo + Down then Kameo + Right. Cancel: Hold Kameo + Down then Kameo + Back.",
        "trigger": "During fight",
        "video": "https://x.com/shinnox/status/1884878440622415955",
    },
    {
        "id": 27,
        "name": "Toasty!!!",
        "character": "Scorpion & Scorpion Kameo",
        "requirements": "Use Flame Aura 3 times on yourself & the enemy",
        "additional": "Hold Kameo Button (R1) 3 times on yourself",
        "trigger": "During fight",
        "video": "https://x.com/RealDeadTrigger/status/1882400839404515489",
    },
    {
        "id": 28,
        "name": "Ka Ballin",
        "character": "Mileena",
        "requirements": "Land 7 Mileena Ball Rolls",
        "trigger": "During fight",
        "video": "https://x.com/RealDeadTrigger/status/1882573539196457182",
    },
    {
        "id": 29,
        "name": "Hat Trick",
        "character": "Kung Lao & Kung Lao Kameo",
        "requirements": "Hit your enemy with every hat from you and your Kameo including Upwards Hat",
        "additional": "All Hat moves must hit. Char: Hat Toss, Hat Toss High, Hat Toss Air, Buzzsaw. Kameo: Orbit Hat, Kameo Buzzsaw.",
        "trigger": "During fight",
        "video": "https://x.com/MaxViannaYT/status/1882327288533921941",
    },
    {
        "id": 30,
        "name": "Fatal Finish",
        "requirements": "Do 1 Fatality with 5 characters",
        "trigger": "During fight",
    },
    {
        "id": 31,
        "name": "You Finish Yet???",
        "requirements": "Do 5 Fatalities with 1 character",
        "trigger": "During fight",
    },
    {
        "id": 32,
        "name": "Inner Beast",
        "requirements": "Do 2 animalities with 1 character",
        "trigger": "During fight",
    },
    {
        "id": 33,
        "name": "Shaolin Monks",
        "character": "Liu Kang & Kung Lao Kameo",
        "requirements": "Beat the Klassic Ladder as Liu Kang With Kung Lao as your Kameo",
        "round": "Next Match Start",
        "additional": "Open a versus match when you're done to get the notification",
        "trigger": "During fight",
    },
    {
        "id": 34,
        "name": "Door Buster",
        "character": "Baraka",
        "requirements": "Succeed in Baraka's Test Your Might (Chapter 5, the last 2 episodes, Trapped) in Story Mode",
        "round": "Next Match Start",
        "additional": "Easy Test Your Might Must be off (Settings > Accessibility > Gameplay Assistance > Story Test Your Might ON). Quit and open a versus match to get the notification.",
        "trigger": "During fight",
        "video": "https://www.youtube.com/watch?v=hy8Zr07SYng",
    },
    {
        "id": 35,
        "name": "Climb The Pyramid",
        "requirements": "Replay Chapter 15 and reach the top of the Pyramid",
        "round": "Next Match Start",
        "additional": "Quit after beating Shang and open a versus match to get the notification",
        "trigger": "During fight",
    },
    {
        "id": 36,
        "name": "Challenge Accepted",
        "requirements": "Earn 20 points from Towers of Time Daily/Weekly Challenges",
        "round": "Next Match Start",
        "additional": "Press Start to see your Daily Challenges / Tower Points do not count, must be challenge.",
        "trigger": "During fight",
    },
    {
        "id": 37,
        "name": "Quest Keeper",
        "requirements": "Complete a Daily Challenge 2 times",
        "additional": "Daily Challenge in the Kombat Profile (Weekly may work)",
        "trigger": "During fight",
        "video": "https://x.com/MK_habit_addict/status/1881801421949145237"
    }
]