let psn = {
    name: 'PSN',
    platform_id: 'psn',
    description: 'Playstation Network Account.',
    enabled: true,
    logo: 'https://loodibee.com/wp-content/uploads/PlayStation-Logo.png'
};

let steam = {
    name: 'Steam',
    platform_id: 'steam',
    description: 'Steam Username, Steam ID, or Steam Community URL. Find your Steam64 ID <a href="https://www.steamidfinder.com/" target="_blank">here</a>.',
    enabled: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png'
};

let epicGames = {
    name: 'Epic Games',
    platform_id: 'epic',
    description: 'Epic Games ID from <a href="https://epic-lookup.com/" target="_blank">Epic Lookup</a>.',
    enabled: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/882px-Epic_Games_logo.svg.png'
};

let xbox = {
    name: 'Xbox',
    platform_id: 'xsx',
    description: 'Xbox is not supported, please use WB.',
    enabled: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Xbox_Logo.svg/372px-Xbox_Logo.svg.png'
};

let nintendoSwitch = {
    name: 'Nintendo Switch',
    platform_id: 'nx',
    description: 'Nintendo Switch is not supported, please use WB.',
    enabled: false,
    logo: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/mobile/nintendo-switch-online-mobile/boxart'
};

let wbNetwork = {
    name: 'Warner Bros ID (Network)',
    platform_id: 'wb_network',
    description: 'Search by WBID or WB email.',
    enabled: true,
    logo: 'https://cdn.cookielaw.org/logos/1b21e05d-c206-4e0b-970e-2d73a23e42e8/f00cc75c-15c8-451e-831b-8ee683b4b250/5fedc951-d984-480e-a455-d2e40dd3af75/WB_Logo.png'
};

let wbFriend = {
    name: 'Warner Bros ID (Friend)',
    platform_id: 'wb_friend',
    description: 'If you are friends with `thethinyapi` on <a href="https://account.wbgames.com/friends" target="_blank">WB Network</a>',
    enabled: true,
    logo: 'https://cdn.cookielaw.org/logos/1b21e05d-c206-4e0b-970e-2d73a23e42e8/f00cc75c-15c8-451e-831b-8ee683b4b250/5fedc951-d984-480e-a455-d2e40dd3af75/WB_Logo.png'
};

let wbIncoming = {
    name: 'Warner Bros ID (Friend Request)',
    platform_id: 'wb_incoming',
    description: 'Add `thethinyapi` on <a href="https://account.wbgames.com/friends" target="_blank">WB Friends</a> and that\'s it. If it\'s not working then cancel the request and add again.',
    enabled: true,
    logo: 'https://cdn.cookielaw.org/logos/1b21e05d-c206-4e0b-970e-2d73a23e42e8/f00cc75c-15c8-451e-831b-8ee683b4b250/5fedc951-d984-480e-a455-d2e40dd3af75/WB_Logo.png'
};

const platforms = [
    psn,
    steam,
    epicGames,
    xbox,
    nintendoSwitch,
    wbNetwork,
    wbFriend,
    wbIncoming
];
