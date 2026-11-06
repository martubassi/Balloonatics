export function createButton(scene, x, y, label, onClick, enabled = true) {
  const btn = scene.add.text(x, y, label, {
    fontFamily: 'Arial', fontSize: '64px', fontStyle: 'bold',
    color: enabled ? '#ffffff' : '#666a80', backgroundColor: '#2a2f55',
    padding: { x: 40, y: 16 }
  }).setOrigin(0.5);

  if (enabled) {
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setColor('#F5C518'));
    btn.on('pointerout', () => btn.setColor('#ffffff'));
    btn.on('pointerdown', onClick);
  }
  return btn;
}
