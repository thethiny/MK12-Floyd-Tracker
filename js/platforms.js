const platforms = [
    { name: 'PSN', platform_id: 'psn', description: 'Playstation Network Account.', enabled: true, logo: 'https://picsum.photos/60' },
    { name: 'Steam', platform_id: 'steam', description: 'Steam Username, Steam ID, or Steam Community URL. Find your Steam64 ID <a href="https://www.steamidfinder.com/" target="_blank">here</a>.', enabled: true, logo: 'https://picsum.photos/60' },
    { name: 'Epic Games', platform_id: 'epic', description: 'Epic Games ID from <a href="https://epic-lookup.com/" target="_blank">Epic Lookup</a>.', enabled: true, logo: 'https://picsum.photos/60' },
    { name: 'Xbox', platform_id: 'xsx', description: 'Xbox is not supported, please use WB.', enabled: false, logo: 'https://picsum.photos/60' },
    { name: 'Nintendo Switch', platform_id: 'nx', description: 'Nintendo Switch is not supported, please use WB.', enabled: false, logo: 'https://picsum.photos/60' },
    { name: 'Warner Bros ID (Network)', platform_id: 'wb_network', description: 'Search by WBID or WB email.', enabled: true, logo: 'https://picsum.photos/60' },
    { name: 'Warner Bros ID (Friend)', platform_id: 'wb_friend', description: 'If you are friends with `thethinyapi` on <a href="https://account.wbgames.com/friends" target="_blank">WB Network</a>', enabled: true, logo: 'https://picsum.photos/60' },
    { name: 'Warner Bros ID (Friend Request)', platform_id: 'wb_incoming', description: 'Add `thethinyapi` on <a href="https://account.wbgames.com/friends" target="_blank">WB Friends</a> and that\'s it. If it\'s not working then cancel the request and add again.', enabled: true, logo: 'https://picsum.photos/60' },
];