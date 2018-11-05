(function(window) {
    'use strict';

    const styled = window.styled.default;
    const css = window.styled.css;

    const Slot = styled.div`
      width: 64px;
      height: 64px;
    `;
    const ActiveItem = styled(Slot)`
      filter: contrast(${props => props.active ? 100 : 80}%)
              brightness(${props => props.active ? 100 : 30}%);
    `;

    const Item = (props) =>
      <ActiveItem
        className={classNames(props.name, props.value && `${props.name}--active`)}
        active={props.value}
        onClick={() => props.onToggle(props.name)} />;

    const LeveledItem = (props) =>
      <ActiveItem
        className={classNames(props.name, props.value && `${props.name}--active-${props.value}`)}
        active={props.value > 0}
        onClick={() => props.onLevel(props.name)} />

    const SubSlot = styled.div`
      width: 32px;
      height: 32px;
    `;
    const ActiveSubItem = styled(SubSlot)`
      filter: contrast(${props => props.active ? 100 : 80}%)
              brightness(${props => props.active ? 100 : 30}%);
    `;

    const BigKey = (props) =>
      <ActiveSubItem className="big-key"
        active={props.source.big_key}
        onClick={() => props.onToggle(props.name)} />;

    const StyledDungeon = styled(Slot)`
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas:
      ${props => props.keysanity ? `
        ".  mn"
        "bk pz"
      ` : `
        ".  ."
        "mn pz"
      `};
      & .medallion { grid-area: mn; }
      & .prize { grid-area: pz; }
      & .big-key { grid-area: bk; }
      & .boss { position: absolute; }
      & ${SubSlot} { z-index: 1; }
    `;

    const Dungeon = (props) =>
      <StyledDungeon keysanity={props.keysanity}>
        <ActiveItem
          className={`boss boss---${props.name}`}
          active={props.dungeon.completed}
          onClick={() => props.onCompletion(props.name)} />
        {props.medallion &&
        <SubSlot
          className={`medallion medallion--${props.dungeon.medallion}`}
          onClick={() => props.onMedallion(props.name)} />}
        {props.keysanity &&
        <BigKey name={props.name} source={props.dungeon} onToggle={props.onBigKey} />}
        <SubSlot
          className={`prize prize--${props.dungeon.prize}`}
          onClick={() => props.onPrize(props.name)} />
      </StyledDungeon>;

    const Chests = (props) =>
      <Slot className={`chest-${props.dungeon.chests}`}
        onClick={() => props.onLevel(props.name)} />;

    const OutlinedText = styled.span`
      color: white;
      font-weight: bold;
      text-shadow:
        -2px -2px black,  0px -2px black,
         2px -2px black,  2px  0px black,
         2px  2px black,  0px  2px black,
        -2px  2px black, -2px  0px black;
      user-select: none;
    `;
    const ChestText = styled(OutlinedText)`
      font-size: 20px;
    `;
    const KeyText = styled(OutlinedText)`
      font-size: 14px;
    `;
    const TextSubSlot = styled(SubSlot)`
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    const KeysanityChest = (props) =>
      <TextSubSlot className={classNames('chest', { 'chest--empty': !props.source.chests })}
        onClick={() => props.onLevel(props.name)}>
        <ChestText>{`${props.source.chests}`}</ChestText>
      </TextSubSlot>;

    const Keys = (props) => {
        const { keys, key_limit } = props.source;
        return !key_limit ?
            <TextSubSlot className="key"><KeyText>{'\u2014'}</KeyText></TextSubSlot> :
            <TextSubSlot className="key"
              onClick={() => props.onLevel(props.name)}>
              <KeyText>{`${keys}/${key_limit}`}</KeyText>
            </TextSubSlot>;
    };

    const Sprite = styled.div`
      width: ${props => props.keysanity ? 96 : 128}px;
      height: ${props => props.keysanity ? 96 : 128}px;
      background-size: 100%;
      display: grid;
      grid-template-areas:
        ".  sw"
        "sh mp";
      & .sword { grid-area: sw }
      & .shield { grid-area: sh }
      & .moonpearl { grid-area: mp }
      ${props => props.keysanity && css`
        & .sword,
        & .shield {
          width: 48px;
          height: 48px;
          background-size: 100%;
        }
      `}
      & .moonpearl {
        margin-top: ${props => props.keysanity ? 12 : 16}px;
        margin-left: ${props => props.keysanity ? 12 : 16}px;
        width: ${props => props.keysanity ? 36 : 48}px;
        height: ${props => props.keysanity ? 36 : 48}px;
        background-size: 100%;
      }
    `;

    const Portrait = (props) => {
      const { items, keysanity } = props;
      const { onToggle, onLevel } = props;
      return <Sprite
        className={classNames(`tunic--active-${items.tunic}`, { 'tunic--bunny': !items.moonpearl })}
        keysanity={keysanity}
        onClick={(e) => e.target === e.currentTarget && onLevel('tunic')}>
        <LeveledItem name="sword" value={items.sword} onLevel={onLevel} />
        <LeveledItem name="shield" value={items.shield} onLevel={onLevel} />
        <Item name="moonpearl" value={items.moonpearl} onToggle={onToggle} />
      </Sprite>;
    };

    const TrackerItemGrid = styled.div`
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(5, 1fr);
    `;
    const TrackerLwGrid = styled.div`
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-auto-flow: column;
    `;
    const TrackerDwGrid = styled.div`
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: 1fr 1fr;
    `;
    const TrackerGrid = styled.div`
      display: grid;
      grid-template-areas:
        "p i"
        "l i"
        "d d";
      & ${TrackerItemGrid} { grid-area: i; }
      & ${TrackerDwGrid} { grid-area: d; }
    `;
    const KeysanityPortrait = styled.div`
      width: 128px;
      height: 128px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 1fr);
      & ${Sprite} { grid-row: 1 / 4; }
    `;
    const KeysanityAgahnim = styled(Slot)`
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      & .agahnim { position: absolute; }
      & ${SubSlot} { z-index: 1; }
    `;
    const KeysanityDungeon = styled(Slot)`
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    class Tracker extends React.Component {
        render() {
            const { keysanity, model } = this.props;
            const { items, regions, encounters } = model;
            const { onToggle, onLevel, onKey, onChest, onCompletion, onBigKey } = this.props;
            return <TrackerGrid>
                {keysanity ?
                <KeysanityPortrait>
                  <Portrait keysanity={true} items={items} onToggle={onToggle} onLevel={onLevel} />
                  <KeysanityChest name="ganon_tower" source={regions.ganon_tower} onLevel={name => onChest('regions', name)} />
                  <Keys name="ganon_tower" source={regions.ganon_tower} onLevel={name => onKey('regions', name)} />
                  <BigKey name="ganon_tower" source={regions.ganon_tower} onToggle={name => onBigKey('regions', name)} />
                </KeysanityPortrait> :
                <Portrait items={items} onToggle={onToggle} onLevel={onLevel} />}
                <TrackerItemGrid>
                  <LeveledItem name="bow" value={items.bow} onLevel={onLevel} />
                  <LeveledItem name="boomerang" value={items.boomerang} onLevel={onLevel} />
                  <Item name="hookshot" value={items.hookshot} onToggle={onToggle} />
                  <Item name="mushroom" value={items.mushroom} onToggle={onToggle} />
                  <Item name="powder" value={items.powder} onToggle={onToggle} />
                  <Item name="firerod" value={items.firerod} onToggle={onToggle} />
                  <Item name="icerod" value={items.icerod} onToggle={onToggle} />
                  <Item name="bombos" value={items.bombos} onToggle={onToggle} />
                  <Item name="ether" value={items.ether} onToggle={onToggle} />
                  <Item name="quake" value={items.quake} onToggle={onToggle} />
                <Item name="lamp" value={items.lamp} onToggle={onToggle} />
                  <Item name="hammer" value={items.hammer} onToggle={onToggle} />
                  <Item name="shovel" value={items.shovel} onToggle={onToggle} />
                  <Item name="net" value={items.net} onToggle={onToggle} />
                  <Item name="book" value={items.book} onToggle={onToggle} />
                  <LeveledItem name="bottle" value={items.bottle} onLevel={onLevel} />
                  <Item name="somaria" value={items.somaria} onToggle={onToggle} />
                  <Item name="byrna" value={items.byrna} onToggle={onToggle} />
                  <Item name="cape" value={items.cape} onToggle={onToggle} />
                  <Item name="mirror" value={items.mirror} onToggle={onToggle} />
                  <Item name="boots" value={items.boots} onToggle={onToggle} />
                  <LeveledItem name="glove" value={items.glove} onLevel={onLevel} />
                  <Item name="flippers" value={items.flippers} onToggle={onToggle} />
                  <Item name="flute" value={items.flute} onToggle={onToggle} />
                  {keysanity ?
                  <KeysanityAgahnim>
                    <Item name="agahnim" value={encounters.agahnim.completed} onToggle={name => this.props.onCompletion('encounters', name)} />
                    <Keys name="castle_tower" source={regions.castle_tower} onLevel={name => this.props.onKey('regions', name)} />
                    <Keys name="escape" source={regions.escape} onLevel={name => this.props.onKey('regions', name)} />
                  </KeysanityAgahnim> :
                  <Item name="agahnim" value={encounters.agahnim.completed} onToggle={name => this.props.onCompletion('encounters', name)} />}
                </TrackerItemGrid>
                <TrackerLwGrid>
                  {this.dungeon('eastern')}
                  {this.dungeon('desert')}
                  {this.dungeon('hera')}
                  {this.inner_dungeon('eastern')}
                  {this.inner_dungeon('desert')}
                  {this.inner_dungeon('hera')}
                </TrackerLwGrid>
                <TrackerDwGrid>
                  {this.dungeon('darkness')}
                  {this.dungeon('swamp')}
                  {this.dungeon('skull')}
                  {this.dungeon('thieves')}
                  {this.dungeon('ice')}
                  {this.dungeon('mire', { medallion: true })}
                  {this.dungeon('turtle', { medallion: true })}
                  {this.inner_dungeon('darkness')}
                  {this.inner_dungeon('swamp')}
                  {this.inner_dungeon('skull')}
                  {this.inner_dungeon('thieves')}
                  {this.inner_dungeon('ice')}
                  {this.inner_dungeon('mire')}
                  {this.inner_dungeon('turtle')}
                </TrackerDwGrid>
            </TrackerGrid>;
        }

        dungeon(name, medallion = { medallion: false }) {
            const { onCompletion, onPrize, onMedallion, onBigKey } = this.props;
            return <Dungeon name={name} dungeon={this.props.model.dungeons[name]}
              {...medallion}
              keysanity={this.props.keysanity}
              onCompletion={name => onCompletion('dungeons', name)}
              onPrize={onPrize}
              onMedallion={onMedallion}
              onBigKey={name => onBigKey('dungeons', name)} />;
        }

        inner_dungeon(name) {
            const dungeon = this.props.model.dungeons[name];
            const { onKey, onChest } = this.props;
            return this.props.keysanity ?
              <KeysanityDungeon>
                <Keys name={name} source={dungeon} onLevel={name => onKey('dungeons', name)} />
                <KeysanityChest name={name} source={dungeon} onLevel={name => onChest('dungeons', name)} />
              </KeysanityDungeon> :
              <Chests name={name} dungeon={dungeon} onLevel={name => onChest('dungeons', name)} />;
        }
    }

    const WithHighlight = (Wrapped) =>
        class extends React.Component {
            state = { highlighted: false }

            render() {
                return <Wrapped
                  highlighted={this.state.highlighted}
                  onHighlight={this.onHighlight}
                  {...this.props} />
            }

            onHighlight = (highlighted) => {
                const model = this.props.model;
                const location = Wrapped.source(this.props);
                this.props.change_caption(highlighted ?
                    typeof location.caption === 'function' ? location.caption(model) : location.caption :
                    null);
                this.setState({ highlighted });
            }
        };

    const Availability = styled.div`
      background-color: ${props => ({
        marked: 'hsl(0 0% 50%)',
        available: 'lime',
        possible: 'yellow',
        dark: 'blue',
        'unavailable': 'red'
      }[props.state] || 'unset')}
    `;
    const Poi = styled(Availability)`
      border: solid hsl(${props => props.highlight ? '55 100% 50%' : '0 0% 10%'});
    `;
    const MinorPoi = styled(Poi)`
      width: 24px;
      height: 24px;
      margin-left: -12px;
      margin-top: -12px;
      position: absolute;
      border-width: 3px;
    `;

    const OverworldLocation = (props) => {
        const { name, model, highlighted } = props;
        const chest = model.chests[name];
        return <MinorPoi className={`world---${_.kebabCase(name)}`}
          state={
            chest.marked ? 'marked' :
            chest.is_available(model.items, model)
          }
          highlight={highlighted}
          onClick={() => props.onMark(name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    OverworldLocation.source = (props) => props.model.chests[props.name];

    const MedialPoi = styled(Poi)`
      width: 36px;
      height: 36px;
      margin-left: -18px;
      margin-top: -18px;
      position: absolute;
      border-width: 4px;
    `;
    const EncounterPoi = styled(MedialPoi)`
      background-repeat: no-repeat;
      background-position: center;
      background-size: 18px;
    `;

    const EncounterLocation = (props) => {
        const { name, model, highlighted } = props;
        const encounter = model.encounters[name];
        const location = _.kebabCase(name);
        return <EncounterPoi className={`world---${location} ${location}`}
          state={
            encounter.completed ? 'marked' :
            encounter.can_complete(model.items, model)
          }
          highlight={highlighted}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    EncounterLocation.source = (props) => props.model.encounters[props.name];

    const MajorPoi = styled(Poi)`
      width: 48px;
      height: 48px;
      margin-left: -24px;
      margin-top: -24px;
      position: absolute;
      border-width: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    const DungeonBoss = styled(Availability)`
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 18px;
    `;

    const DungeonLocation = (props) => {
        const { name, model, deviated, highlighted } = props;
        const dungeon = model.dungeons[name];
        return <MajorPoi className={`world---${_.kebabCase(name)}`}
          state={
            dungeon.chests === 0 ? 'marked' :
            deviated ? 'possible' :
            dungeon.can_progress(model.items, model)
          }
          highlight={highlighted}
          onClick={() => props.onDungeon(name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)}>
          <DungeonBoss className={`boss---${_.kebabCase(name)}`}
            state={
              dungeon.completed ? 'marked' :
              deviated ? 'possible' :
              dungeon.can_complete(model.items, model)
            } />
        </MajorPoi>;
    };

    DungeonLocation.source = (props) => props.model.dungeons[props.name];

    const OverworldLocationWithHighlight = WithHighlight(OverworldLocation);
    const EncounterLocationWithHighlight = WithHighlight(EncounterLocation);
    const DungeonLocationWithHighlight = WithHighlight(DungeonLocation);

    const MedialDungeonPoi = styled(MedialPoi)`
      background-repeat: no-repeat;
      background-position: center;
      background-size: 24px;
    `;

    const DungeonMapDoor = (props) => {
        const { model, name, dungeon_name, deviated, highlighted } = props;
        const dungeon = model.dungeons[dungeon_name];
        const door = dungeon.doors[name];
        return <MedialDungeonPoi className={classNames(
            `${dungeon_name}---door---${_.kebabCase(name)}`,
            `${dungeon_name}---door`,
            door.opened && `${dungeon_name}---door--open`
          )}
          state={
            door.opened ? 'marked' :
            deviated ? 'possible' :
            door.can_reach.call(dungeon, model.items, model)
          }
          highlight={highlighted}
          onClick={() => props.onMark(dungeon_name, name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    DungeonMapDoor.source = (props) => props.model.dungeons[props.dungeon_name].doors[props.name];

    const DungeonMapLocation = function(props) {
        const { model, name, dungeon_name, deviated, highlighted } = props;
        const dungeon = model.dungeons[dungeon_name];
        const location = dungeon.locations[name];
        const Poi = _.includes(['big_chest', 'boss'], name) ? MedialDungeonPoi : MinorPoi;
        return <Poi className={classNames(
            `${dungeon_name}---${_.kebabCase(name)}`, {
              'big-chest': name === 'big_chest',
              'big-chest--open': name === 'big_chest' && location.marked,
              [`boss---${dungeon_name}`]: name === 'boss'
          })}
          state={
            location.marked ? 'marked' :
            deviated ? 'possible' :
            location.can_reach.call(dungeon, model.items, model)
          }
          highlight={highlighted}
          onClick={() => props.onMark(dungeon_name, name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    DungeonMapLocation.source = (props) => props.model.dungeons[props.dungeon_name].locations[props.name];

    const DungeonMapDoorWithHighlight = WithHighlight(DungeonMapDoor);
    const DungeonMapLocationWithHighlight = WithHighlight(DungeonMapLocation);

    const Close = styled.span`
      margin: 10px;
      position: absolute;
      top: 0;
      color: white;
      line-height: 1;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;
    `;
    const StyledCaption = styled.div`
      width: 100%;
      position: absolute;
      bottom: 0;
      color: white;
      background-color: black;
      font-size: 16px;
      text-align: center;
    `;
    const CaptionIcon = styled.div`
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: text-bottom;
      background-size: 100%;
    `;

    const Caption = (props) => {
        const parts = /\{([\w-]+)\}|[^{]+/g;
        return <StyledCaption>
          {!props.text ? '\u00a0' :
            _.matchAll(props.text, parts).map(([text, icon]) =>
              !icon ? text :
              <CaptionIcon className={{
                  fightersword: 'sword--active-1',
                  mastersword: 'sword--active-2',
                  mitts: 'glove--active-2'
                }[icon] || icon
              } />
            )}
        </StyledCaption>;
    };

    const StyledMap = styled.div`
      width: 442px;
      height: 442px;
      position: relative;
    `;
    const MapGrid = styled.div`
      position: relative;
      display: grid;
      ${props => props.horizontal &&
      'grid-template-columns: 1fr 1fr;'}
      gap: 4px;
      & > ${StyledMap} { margin: 0 auto; }
    `;

    class Map extends React.Component {
        state = { caption: null }

        render() {
            const { horizontal, dungeon_name, onDungeon } = this.props;
            const maps = dungeon_name ? this.dungeon_maps() : this.world_maps();

            return <MapGrid horizontal={horizontal}>
                {maps}
                {dungeon_name && <Close onClick={() => onDungeon(null)} >{'\u00d7'}</Close>}
                <Caption text={this.state.caption} />
            </MapGrid>;
        }

        world_maps() {
            const { model, keysanity } = this.props;
            const { onOverworldMark } = this.props;
            const locations = _.partition([
                ..._.map(model.chests, (chest, name) => ({
                    second: chest.darkworld,
                      tag: <OverworldLocationWithHighlight name={name} model={model} onMark={onOverworldMark} change_caption={this.change_caption} />
                })),
                ..._.map(model.encounters, (encounter, name) => ({
                    second: encounter.darkworld,
                    tag: <EncounterLocationWithHighlight name={name} model={model} change_caption={this.change_caption} />
                })),
                ..._.map(model.dungeons, (dungeon, name) => ({
                    second: dungeon.darkworld,
                    tag: <DungeonLocationWithHighlight name={name} model={model} deviated={keysanity && dungeon.is_deviating()}
                      onDungeon={this.dungeon} change_caption={this.change_caption} />
                }))
            ], x => x.second);
            return [
                <StyledMap className="world---light">{_.map(locations[1], 'tag')}</StyledMap>,
                <StyledMap className="world---dark">{_.map(locations[0], 'tag')}</StyledMap>
            ];
        }

        dungeon_maps() {
            const { model, dungeon_name } = this.props;
            const dungeon = model.dungeons[dungeon_name];
            const deviated = dungeon.is_deviating();
            const { onDoorMark, onLocationMark } = this.props;

            const locations = _.partition([
                ..._.map(dungeon.doors, (door, name) => ({
                    second: door.second_map,
                    tag: <DungeonMapDoorWithHighlight
                        name={name} dungeon_name={dungeon_name} model={model} deviated={deviated}
                        onMark={onDoorMark} change_caption={this.change_caption} />
                })),
                ..._.map(dungeon.locations, (location, name) => ({
                    second: location.second_map,
                    tag: <DungeonMapLocationWithHighlight
                        name={name} dungeon_name={dungeon_name} model={model} deviated={deviated}
                        onMark={onLocationMark} change_caption={this.change_caption} />
                }))
            ], x => x.second);
            return [
                <StyledMap className={`${dungeon_name}---first`}>{_.map(locations[1], 'tag')}</StyledMap>,
                <StyledMap className={`${dungeon_name}---second`}>{_.map(locations[0], 'tag')}</StyledMap>
            ];
        }

        dungeon = (name) => {
            if (this.props.keysanity) {
                this.props.onDungeon(name);
                this.change_caption(null);
            }
        }

        change_caption = (caption) => {
            this.setState({ caption: caption });
        }
    }

    const StyledApp = styled.div`
      display: grid;
      ${props => props.horizontal &&
      `grid-template-columns: 1fr 1fr;`}
      gap: 4px;
      ${props => props.vertical && `
        height: 0px;
        transform: scale(.6, .6) translate(-33%, -33%);
      `}
    `;

    class App extends React.Component {
        constructor(props) {
            super(props);
            const { mode, ipbj, podbj } = props.query;
            const opts = { ipbj: !!ipbj, podbj: !!podbj };
            this.state = { model: { ...item_model(), ...location_model(mode, opts) } };
        }

        render() {
            const query = this.props.query;
            const keysanity = query.mode === 'keysanity';

            return <StyledApp className={query.sprite}
              horizontal={query.hmap}
              vertical={query.vmap}
              style={query.bg && { 'background-color': query.bg }}>
              <Tracker
                horizontal={query.hmap}
                model={this.state.model}
                keysanity={keysanity}
                onToggle={this.toggle}
                onLevel={this.level}
                onCompletion={this.completion}
                onPrize={this.prize}
                onMedallion={this.medallion}
                onBigKey={this.big_key}
                onKey={this.key}
                onChest={this.chest} />
              {(query.hmap || query.vmap) && <Map
                horizontal={query.hmap}
                model={this.state.model}
                keysanity={keysanity}
                dungeon_name={keysanity && this.state.dungeon_name}
                onOverworldMark={this.overworld_mark}
                onDungeon={this.dungeon}
                onDoorMark={this.door_mark}
                onLocationMark={this.location_mark} />}
            </StyledApp>;
        }

        dungeon = (name) => {
            this.setState({ dungeon_name: name });
        }

        toggle = (name) => {
            const items = this.state.model.items;
            this.setState({ model: update(this.state.model, { items: update.toggle(name) }) });
        }

        level = (name) => {
            const items = this.state.model.items;
            this.setState({ model: update(this.state.model, { items: { [name]: { $set: items.inc(name) } } }) });
        }

        completion = (source, name) => {
            const model = this.state.model;
            const target = model[source][name];
            const completed = target.completed;
            const update_keysanity = this.props.query.mode === 'keysanity' && source === 'dungeons';

            this.setState({ model: update(model, { [source]: { [name]: {
                    completed: { $set: !completed },
                    ...(update_keysanity && {
                        locations: { boss: { marked: { $set: !completed } } },
                        chests: !target.is_deviating() && (x => x - (!completed ? 1 : -1))
                    })
                } }
            }) });
        }

        prize = (name) => {
            const prize_order = ['unknown', 'pendant-green', 'pendant', 'crystal', 'crystal-red'];
            const prize = this.state.model.dungeons[name].prize;
            const index = prize_order.indexOf(prize);
            const modulo = prize_order.length;
            const value = prize_order[(index + 1) % modulo];
            this.setState({ model: update(this.state.model, { dungeons: { [name]: { prize: { $set: value } } } }) });
        }

        medallion = (name) => {
            const medallion_order = ['unknown', 'bombos', 'ether', 'quake'];
            const medallion = this.state.model.dungeons[name].medallion;
            const index = medallion_order.indexOf(medallion);
            const modulo = medallion_order.length;
            const value = medallion_order[(index + 1) % modulo];
            this.setState({ model: update(this.state.model, { dungeons: { [name]: { medallion: { $set: value } } } }) });
        }

        big_key = (source, name) => {
            this.setState({ model: update(this.state.model, { [source]: { [name]: update.toggle('big_key') } }) });
        }

        key = (source, name) => {
            const target = this.state.model[source][name],
                value = counter(target.keys, 1, target.key_limit);
            this.setState({ model: update(this.state.model, { [source]: { [name]: { keys: { $set: value } } } }) });
        }

        chest = (source, name) => {
            const target = this.state.model[source][name],
                value = counter(target.chests, -1, target.chest_limit);
            this.setState({ model: update(this.state.model, { [source]: { [name]: { chests: { $set: value } } } }) });
        }

        overworld_mark = (name) => {
            this.setState({ model: update(this.state.model, { chests: { [name]: update.toggle('marked') } }) });
        }

        door_mark = (dungeon, name) => {
            this.setState({ model: update(this.state.model, { dungeons: { [dungeon]: { doors: { [name]: update.toggle('opened') } } } }) });
        }

        location_mark = (dungeon, name) => {
            const model = this.state.model;
            const target = model.dungeons[dungeon];
            const marked = target.locations[name].marked;

            this.setState({ model: update(model, { dungeons: { [dungeon]: {
                    locations: { [name]: { marked: { $set: !marked } } },
                    completed: name === 'boss' && { $set: !marked },
                    chests: !target.is_deviating() && (x => x - (!marked ? 1 : -1))
                } }
            }) });
        }
    }

    window.start = () => {
        ReactDOM.render(<App query={uri_query()} />, document.getElementById('app'));
    }
}(window));
