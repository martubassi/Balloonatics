const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { EventEmitter } = require('node:events');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const load = name => import(pathToFileURL(path.join(root, 'public/js', name)).href);

// El doble de física permite probar la animación sin iniciar WebGL.
class Sprite extends EventEmitter {
  constructor(scene, x, y, key) {
    super(); Object.assign(this, { scene, x, y, texture:{key}, active:true, angle:0, width:64, height:96 });
  }
  setVisible(v) { this.visible=v; return this; }
  setOrigin() { return this; }
  setDisplaySize(w,h) { this.displayWidth=w; this.displayHeight=h; return this; }
  setAngle(a) { this.angle=a; return this; }
  setTint(v) { this.tint=v; return this; }
  clearTint() { this.tint=null; return this; }
  setScale(v) { this.scale=v; return this; }
  setPosition(x,y) {this.x=x;this.y=y;return this;}
  setVelocity(x,y) {this.body.velocity={x,y};return this;}
  setVelocityX(x) {this.body.velocity.x=x;return this;}
  setVelocityY(y) {this.body.velocity.y=y;return this;}
  setCollideWorldBounds() {return this;}
  setCircle(radius) {this.body.radius=radius;return this;}
  setBounce() {return this;}
  setDamping() {return this;}
  destroy() {this.active=false;this.emit('destroy');}
}
global.Phaser = {
  Scene:class {}, Physics:{Arcade:{Sprite,Image:Sprite}},
  Math:{Linear:(a,b,t)=>a+(b-a)*t,Clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),Wrap:(v,a,b)=>((v-a)%(b-a)+(b-a))%(b-a)+a}
};

(async () => {
  const { ASSETS } = await load('assets.js');
  for(const [key,file] of Object.entries(ASSETS)) {
    const bytes=fs.readFileSync(path.join(root,'public/assets',file+'.png'));
    assert.equal(bytes.subarray(1,4).toString(),'PNG',`${key}: missing/invalid PNG`);
    assert(bytes.readUInt32BE(16)>0 && bytes.readUInt32BE(20)>0);
  }
  function checkSyntax(dir) {
    for(const item of fs.readdirSync(dir,{withFileTypes:true})) {
      const file=path.join(dir,item.name);
      if(item.isDirectory()) checkSyntax(file);
      else if(file.endsWith('.js')) {
        const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
        assert.equal(r.status,0,r.stderr);
      }
    }
  }
  checkSyntax(path.join(root,'public/js'));
  const {SpriteMotion}=await load('entities/SpriteMotion.js');
  const motion=new SpriteMotion();
  const moving=Array.from({length:120},()=>motion.step(1000/60,450,true));
  assert(moving.some(p=>p.angle>5) && moving.some(p=>p.angle < -5),'Rock to both sides');
  assert(moving.some(p=>p.bounce>3),'Small walking hops');
  let idle; for(let i=0;i<120;i++)idle=motion.step(1000/60,0,true);
  assert(Math.abs(idle.angle)<0.01 && idle.bounce<0.01,'Settle when stopped');
  motion.step(16,450,false);
  const landed=motion.step(16,0,true);
  assert(landed.scaleX>1 && landed.scaleY<1,'Squash on landing');
  assert(Number.isFinite(motion.step(5000,-1500,false).angle),'Handle frame stalls');
  motion.reset(); assert.equal(motion.angle,0);

  const {Player}=await load('entities/Player.js');
  const events=new EventEmitter();
  const scene={
    events, time:{now:1000}, children:{moveBelow(){}},
    add:{existing(){},sprite:(x,y,key)=>new Sprite(null,x,y,key),ellipse:(x,y)=>new Sprite(null,x,y,'shadow')},
    physics:{add:{existing(p){p.body={width:64,height:96,bottom:p.y+48,velocity:{x:0,y:0},blocked:{down:true},touching:{down:false},setGravityY(){},setDrag(){},setAccelerationX(){},setAllowGravity(){}};}}}
  };
  for(const key of ['pip','beto']) {
    const p=new Player(scene,{id:key,name:key,texture:key,x:480,y:972,rivalDirection:1});
    p.move(1);
    const positions=[];
    for(let i=0;i<60;i++) {p.tick(1000+i*16,16);p.updateVisual(1000+i*16,16);positions.push(p.visual.angle);}
    assert(positions.some(a=>Math.abs(a)>5));
    assert.deepEqual([p.body.width,p.body.height,p.angle,p.y],[64,96,0,972],'Cosmetic motion preserves physics');
    assert(p.visual.y<=p.body.bottom && p.visual.y>=p.body.bottom-6);
    p.jump(2000); assert(p.body.velocity.y<0,'Jump remains available');
    p.makeSlippery();p.updateVisual(0,16);assert.equal(p.visual.tint,0x9fe0ff);
    p.slipTime=0;p.updateVisual(0,16);assert.equal(p.visual.tint,null);
    const visual=p.visual;p.destroy();assert(!visual.active);
    assert.equal(events.listenerCount('postupdate'),0,'No listeners leak on scene restart');
  }
  const {Balloon}=await load('entities/Balloon.js');
  const balloon=new Balloon(scene,960,260);
  balloon.reset(960,260);
  balloon.setVelocity(400,-600);
  const initialVelocity={...balloon.body.velocity};
  for(let i=0;i<60;i++) balloon.animateFlight(1000/60,true);
  assert(balloon.angle>20,'Balloon turns during rightward flight');
  assert.deepEqual(balloon.body.velocity,initialVelocity,'Rotation preserves flight physics');
  assert.equal(balloon.body.radius,37,'Rotation preserves the circular hitbox');
  const angle=balloon.angle;
  balloon.animateFlight(1000,false);
  assert.equal(balloon.angle,angle,'Pause/countdown must freeze spin');
  balloon.reset(960,260);assert.equal(balloon.angle,0,'New serve resets the pose');
  balloon.setVelocity(-400,-600);
  for(let i=0;i<60;i++) balloon.animateFlight(1000/60,true);
  assert(balloon.angle < -20,'Spin follows leftward flight');
  balloon.setVelocity(10000,0);
  for(let i=0;i<300;i++) {
    balloon.animateFlight(16,true);
    assert(Math.abs(balloon.angle)<45,'Balloon must stay taller than wide during flight');
  }
  const {fitTexture}=await load('assets.js');
  const sourcePng=fs.readFileSync(path.join(root,'public/assets/Globo.png'));
  const sourceImage={width:sourcePng.readUInt32BE(16),height:sourcePng.readUInt32BE(20)};
  let drawArgs;
  fitTexture({textures:{get(){return{getSourceImage:()=>sourceImage};},createCanvas(){return{context:{drawImage(...args){drawArgs=args;}},refresh(){}};}}},'balloon',80,80,true);
  assert(drawArgs[4]>drawArgs[3],'Balloon texture must be taller than wide');
  assert(Math.abs(drawArgs[3]/drawArgs[4]-sourceImage.width/sourceImage.height)<1e-9,'Preserve original balloon proportions');
  const {onSceneKey}=await load('sceneInput.js');
  const keyboard=new EventEmitter();
  const screen=active=>({active,sys:{isActive(){return this.owner.active;}},events:new EventEmitter(),input:{keyboard}});
  const gameScreen=screen(true), pauseScreen=screen(false);
  gameScreen.sys.owner=gameScreen;pauseScreen.sys.owner=pauseScreen;
  let pauses=0,resumes=0;
  onSceneKey(gameScreen,'keydown-ESC',()=>{pauses++;gameScreen.active=false;pauseScreen.active=true;});
  onSceneKey(pauseScreen,'keydown-ESC',()=>{resumes++;pauseScreen.active=false;gameScreen.active=true;});
  keyboard.emit('keydown-ESC',{});
  assert.equal(pauses,1);assert.equal(resumes,0,'Opening pause must not also close it with the same Escape');
  keyboard.emit('keydown-ESC',{});assert.equal(resumes,1);
  gameScreen.active=false;pauseScreen.active=false;
  gameScreen.events.emit('shutdown');pauseScreen.events.emit('shutdown');
  assert.equal(keyboard.listenerCount('keydown-ESC'),0,'Exiting a game removes all its Escape listeners');
  for(let visit=0;visit<20;visit++) {
    const settingsScreen=screen(true);settingsScreen.sys.owner=settingsScreen;
    let backs=0;
    onSceneKey(settingsScreen,'keydown-ESC',()=>backs++);
    keyboard.emit('keydown-ESC',{repeat:true});assert.equal(backs,0);
    keyboard.emit('keydown-ESC',{});assert.equal(backs,1);
    assert.equal(pauses,1,'Settings Escape must never open an old game pause');
    settingsScreen.events.emit('shutdown');
    assert.equal(keyboard.listenerCount('keydown-ESC'),0,'Settings visits must not accumulate listeners');
  }
  const {createPanel,fitImage}=await load('ui.js');
  const calls=[];
  const uiScene={add:{nineslice(...args){calls.push(args);return{};},image(){return{width:128,height:192,setScale(scale){this.scale=scale;return this;}};}}};
  createPanel(uiScene,500,420,840,424);
  createPanel(uiScene,500,420,720,190);
  assert(calls.every(args=>args[2]==='ui_panel' && args.slice(6).every(n=>n===20)),'Panel corners keep their native size');
  assert.equal(fitImage(uiScene,0,0,'pip',66,100).scale,66/128,'Portraits keep their aspect ratio');
  const {platformSliceLayout,preparePlatformFrames}=await load('arenaVisuals.js');
  const short=platformSliceLayout(389,63,140,30);
  const long=platformSliceLayout(389,63,5000,30);
  assert.equal(short.ratio,long.ratio,'Long platforms keep the same texture scale');
  assert.equal(short.capWidth,long.capWidth,'End caps never stretch');
  assert.equal(short.tileWidth,long.tileWidth,'The middle repeats at a fixed pattern size');
  assert.equal(long.middleWidth+2*long.capWidth,5000,'Slices cover the requested width');
  const frames=[];
  preparePlatformFrames({textures:{get(){return{getSourceImage(){return{width:389,height:63};},add(...args){frames.push(args);}};}}},'clasico');
  assert.equal(frames[0][4]+frames[1][4]+frames[2][4],389,'Source slices cover the original exactly');
  const {MAP_CARD_LAYOUT}=await load('scenes/MapVoteScene.js');
  assert(MAP_CARD_LAYOUT.titleGap>=24,'Map titles have a dedicated gap below the image');
  const hd=fs.readFileSync(path.join(root,'public/assets/marco_laboratorio_hd.png'));
  assert(hd.readUInt32BE(16)>=1480,'Large frames must use native HD artwork');
  const {resultPlacements}=await load('scenes/ResultScene.js');
  for(const winnerKey of ['pip','beto']) {
    const placements=resultPlacements({winnerKey});
    assert.equal(placements[0].key,winnerKey,'Correct player celebrates in first place');
    assert.equal(placements[0].rank,1);
    assert.notEqual(placements[0].key,placements[1].key);
    assert(placements[0].top<placements[1].top,'Winner stands on the taller podium');
  }
  const {SettingsScene}=await load('scenes/SettingsScene.js');
  const settings=new SettingsScene(); const navigation=[];
  let pausedGame=true;
  settings.scene={start:(...args)=>navigation.push(args),isPaused:()=>pausedGame};
  settings.init({returnScene:'PauseScene',escenaOrigen:'GameScene'});settings.goBack();
  assert.equal(navigation[0][0],'PauseScene','Settings opened from pause returns to pause');
  assert.equal(navigation[0][1].escenaOrigen,'GameScene');
  settings.init({});settings.goBack();assert.equal(navigation[1][0],'MenuScene','Normal settings returns to menu');
  const staleData={returnScene:'PauseScene',escenaOrigen:'GameScene'};
  pausedGame=false;settings.init(staleData);settings.goBack();
  assert.equal(navigation[2][0],'MenuScene','Retained start data must not reopen pause after the game exits');
  pausedGame=true;settings.init(staleData);pausedGame=false;settings.goBack();
  assert.equal(navigation[3][0],'MenuScene','Return path is revalidated if the game disappears while settings is open');
  pausedGame=true;settings.init({returnScene:'MenuScene',escenaOrigen:null});settings.goBack();
  assert.equal(navigation[4][0],'MenuScene','Explicit menu entry resets the previous pause return');
  const {PauseScene}=await load('scenes/PauseScene.js');
  const orphanPause=new PauseScene();let recovered=false;
  orphanPause.scene={isPaused:()=>false,start:name=>{recovered=name==='MenuScene';}};
  orphanPause.create({escenaOrigen:'GameScene'});
  assert(recovered,'An orphan pause must recover to the menu before creating a blocking overlay');
  for(const name of ['BootScene','MenuScene','GameScene','MapVoteScene','PauseScene','ResultScene','ControlsScene','CreditsScene','SettingsScene']) await load(`scenes/${name}.js`);
  console.log(`PASS: ${Object.keys(ASSETS).length} artwork entries, JS syntax/imports, player motion, fixed hitboxes, balloon animation, UI proportions, repeated platform slices and map title spacing.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
