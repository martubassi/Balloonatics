// Una pulsación no debe abrir Pausa y cerrarla al llegar a la siguiente escena.
const consumed = new WeakSet();

export function onSceneKey(scene, eventName, callback) {
  const keyboard = scene.input.keyboard;
  const handler = (event) => {
    if (!scene.sys.isActive() || event?.repeat) return;
    if (event && typeof event === 'object') {
      if (consumed.has(event)) return;
      consumed.add(event);
    }
    callback(event);
  };
  keyboard.on(eventName, handler);
  scene.events.once('shutdown', () => keyboard.off(eventName, handler));
  return handler;
}
