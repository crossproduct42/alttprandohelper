(function(window) {
    window.dungeon_layouts = () => ({
        eastern: {
            first: [['compass', 'cannonball', 'map', 'big_chest', 'big_key']],
            second: [['boss']]
        },
        desert: {
            first: [['boss'], ['north']],
            second: [['map', 'torch', 'big_key', 'compass', 'big_chest'], ['south']]
        },
        hera: {
            first: [['compass', 'big_chest', 'boss']],
            second: [['cage', 'map', 'big_key']]
        },
        darkness: {
            first: [
                ['map', 'compass', 'arena_ledge', 'arena_bridge', 'basement_left', 'basement_right',
                 'hellway', 'big_chest', 'maze_top', 'maze_bottom', 'boss'],
                ['arena', 'hellway', 'maze', 'boss']
            ],
            second: [['shooter', 'stalfos', 'big_key'], ['front', 'big_key']]
        },
        swamp: {
            first: [['waterfall', 'toilet_left', 'toilet_right', 'boss']],
            second: [['entrance', 'map', 'big_key', 'west', 'compass', 'big_chest']]
        },
        skull: {
            first: [['bridge', 'boss']], 
            second: [['big_key', 'compass', 'map', 'pot_prison', 'big_chest']]
        },
        thieves: {
            first: [['cell', 'big_chest', 'boss']],
            second: [['big_key', 'map', 'compass', 'ambush', 'attic']]
        },
        ice: {
            first: [['freezor', 'iced_t', 'big_chest', 'spike']],
            second: [['compass', 'map', 'big_key', 'boss']]
        },
        mire: {
            first: [['main', 'bridge', 'map', 'spike', 'compass', 'big_key', 'big_chest']],
            second: [['boss']]
        },
        turtle: {
            first: [['big_key', 'big_chest', 'crystaroller', 'eye_bl', 'eye_br', 'eye_tl', 'eye_tr'], ['crystaroller', 'boss']],
            second: [['compass', 'roller_left', 'roller_right', 'chain_chomps', 'boss']]
        }
    });
}(window));
