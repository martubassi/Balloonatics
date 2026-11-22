const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_REPL_NODE_MODULE_DIRS || '.', '.'] }));
const root = path.resolve('public');
const server = http.createServer(async (req,res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const data = await fs.readFile(file);
    res.setHeader('Content-Type', {'.js':'text/javascript','.html':'text/html','.png':'image/png'}[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser = await chromium.launch({headless:true});
    const page = await browser.newPage({viewport:{width:1280,height:720}});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => {if(r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(`${r.status()} ${r.url()}`);});
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(async () => {
      if (!window.Phaser) return false;
      const {game} = await import('/js/main.js');
      window.testGame = game;
      return game.scene.isActive('MenuScene');
    }, null, {timeout:30000});
    await page.screenshot({path:path.resolve('art-menu-check.png')});
    await page.evaluate(() => testGame.scene.start('MapVoteScene'));
    await page.waitForTimeout(200);
    await page.screenshot({path:path.resolve('art-map-check.png')});
    for (const mapId of ['clasico','torres','piramide']) {
      await page.evaluate(id => {
        testGame.scene.stop('MapVoteScene');
        testGame.scene.start('GameScene',{mapId:id});
      }, mapId);
      await page.waitForTimeout(500);
      const dimensions = await page.evaluate(() => {
        const s = testGame.scene.getScene('GameScene');
        return [s.player1.body.width,s.player1.body.height,s.floor.getChildren()[0].body.top];
      });
      assert.deepEqual(dimensions,[64,96,1020]);
      await page.keyboard.down('d');
      const poses = [];
      for(let i=0;i<8;i++) {
        await page.waitForTimeout(40);
        poses.push(await page.evaluate(() => {
          const p=testGame.scene.getScene('GameScene').player1;
          return {angle:p.visual.angle,bounce:p.spriteMotion.bounce,bodyAngle:p.angle,width:p.body.width,bottom:p.body.bottom};
        }));
      }
      await page.keyboard.up('d');
      assert(poses.some(p=>Math.abs(p.angle)>2), 'Walking should rock the sprite');
      assert(poses.some(p=>p.bounce>1), 'Walking should bounce the sprite');
      assert(poses.every(p=>p.bodyAngle===0 && p.width===64), 'Animation must not rotate/resize physics');
      await page.keyboard.press('w');
      await page.waitForTimeout(100);
      assert(await page.evaluate(()=>testGame.scene.getScene('GameScene').player1.body.velocity.y<0),'Jump must work');
      await page.evaluate(() => {const s=testGame.scene.getScene('GameScene'); s.player1.lives=2; s.powerUps.spawn('heavy',800,500);});
      await page.waitForTimeout(100);
      assert.equal(await page.evaluate(()=>testGame.scene.getScene('GameScene').hearts[0][2].texture.key),'art_heart_pip_empty');
      if(mapId==='clasico') await page.screenshot({path:path.resolve('art-game-check.png')});
      await page.evaluate(()=>testGame.scene.stop('GameScene'));
    }
    for (const scene of ['SettingsScene','ControlsScene','CreditsScene','ResultScene']) {
      await page.evaluate(name=>testGame.scene.start(name,{ganador:'Pip',color:'#E94560'}),scene);
      await page.waitForTimeout(120);
      await page.evaluate(name=>testGame.scene.stop(name),scene);
    }
    await page.evaluate(()=>testGame.scene.start('GameScene',{mapId:'clasico'}));
    await page.waitForTimeout(200);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(120);
    assert(await page.evaluate(()=>testGame.scene.isActive('PauseScene')));
    await page.screenshot({path:path.resolve('art-pause-check.png')});
    assert.deepEqual(errors,[]);
    console.log('PASS: all scenes, three maps, fixed collision boxes, walking, jumping, lives and pause.');
  } finally {if(browser) await browser.close(); server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
