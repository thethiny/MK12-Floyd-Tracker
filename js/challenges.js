// Shared challenge logic, used by the floyd page and the pinned challenges refresh

// Your 10: which bit format the profile uses decides the done state
function computeMyChallenges(apiData) {
    const parsed = apiData.parsed;
    const guessedChallenges = apiData.challenges.online !== undefined ? apiData.challenges.online : apiData.challenges;
    const guessedOfflineChallenges = apiData.challenges.offline || [];

    let use37Bit = false;
    let oldFormat = false;
    let myChallenges = [];

    if (
        guessedChallenges
        && guessedChallenges.length > 0
        && guessedChallenges.some(i => parsed.challenges_checklist[i])
    ) {
        const mask = BigInt(parsed.challenges_mask);
        const guessedSet = new Set(guessedChallenges);

        if (mask <= 1023n) {
            // 10-bit check
            const maskIndices = [];
            for (let i = 0; i < 10; i++) {
                if ((mask & (1n << BigInt(i))) !== 0n) {
                    maskIndices.push(i + 1);
                }
            }

            // If all set bits ARE in guessedChallenges → use 37-bit
            use37Bit = maskIndices.every(idx => guessedSet.has(idx));
        } else {
            use37Bit = true;
        }

        // 10-bit bits follow the unsorted guess order, so read them before sorting
        myChallenges = guessedChallenges.map((index, i) => ({
            id: index,
            done: use37Bit ? ((mask >> BigInt(index - 1)) & 1n) === 1n : (mask & (1n << BigInt(i))) !== 0n,
        }));
        oldFormat = !use37Bit;
    } else if (guessedChallenges && guessedChallenges.length > 0) {
        // Format can't be told apart, same as what the 37 grid shows
        myChallenges = guessedChallenges.map(id => ({ id, done: !!parsed.challenges_checklist[id] }));
    }
    myChallenges.sort((a, b) => a.id - b.id);

    return {
        guessedChallenges,
        myChallenges,
        offlineChallenges: [...guessedOfflineChallenges].sort((a, b) => a - b),
        oldFormat,
    };
}

// Finisher trackers come as { character: count }, the backend sends { Unknown: 1 } when there's no data
function getFinisherCounts(tracker) {
    if (!tracker || typeof tracker !== "object") return [];
    return Object.entries(tracker)
        .filter(([character]) => character !== "Unknown")
        .sort((a, b) => b[1] - a[1]);
}

// Challenges 30 to 37, progress against what each one needs
function computeProfileChallenges(raw) {
    const fatalities = getFinisherCounts(raw["Floyd Fatalities Tracker"]);
    const animalities = getFinisherCounts(raw["Floyd Animalities Tracker"]);
    const bestFatality = fatalities[0] || ["", 0];
    const bestAnimality = animalities[0] || ["", 0];
    const chapter15 = raw["Chapter 15 Current Location"];

    return [
        { id: 30, name: "Fatal Finish", target: 5, progress: fatalities.filter(([, count]) => count >= 1).length, unit: "characters" },
        { id: 31, name: "You Finish Yet???", target: 5, progress: bestFatality[1], unit: bestFatality[0] ? `as ${bestFatality[0]}` : "fatalities" },
        { id: 32, name: "Inner Beast", target: 2, progress: bestAnimality[1], unit: bestAnimality[0] ? `as ${bestAnimality[0]}` : "animalities" },
        { id: 33, name: "Shaolin Monks", target: 1, progress: raw["Shaolin Monks Tower Completions"] || 0 },
        { id: 34, name: "Door Buster", target: 1, progress: raw["Door Buster Completions"] || 0 },
        { id: 35, name: "Climb The Pyramid", target: 1, progress: chapter15 === "Complete" ? 1 : 0, status: typeof chapter15 === "string" ? chapter15 : "Not Started" },
        { id: 36, name: "Challenge Accepted", target: 20, progress: raw["Towers of Time Challenge Points"] || 0, unit: "points" },
        { id: 37, name: "Quest Keeper", target: 2, progress: raw["Quests Completed"] || 0, unit: "quests" },
    ].map(challenge => ({ ...challenge, done: challenge.progress >= challenge.target }));
}

// Segmented progress, big targets get grouped so there are at most 10 segments
function buildSegments(progress, target) {
    const segmentCount = Math.min(target, 10);
    const perSegment = target / segmentCount;
    const filled = Math.min(segmentCount, Math.floor(progress / perSegment));
    const bar = document.createElement("div");
    bar.className = "segments";
    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement("span");
        if (i < filled) segment.classList.add("filled");
        bar.appendChild(segment);
    }
    return bar;
}
