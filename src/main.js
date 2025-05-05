import { createScene } from "./map.js";
import { setupCamera } from "./camera.js";
import { Player } from "./player.js";
import { setupControls } from "./controls.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const scene = createScene(engine);
const camera = setupCamera(scene, canvas);

const player = new Player(scene);
player.load().then(() => {
  setupControls(scene, player, camera);
});

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
