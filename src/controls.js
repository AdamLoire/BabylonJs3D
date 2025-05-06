export function setupControls(scene, player, camera) {
  const keys = {};
  //sensibilité souris, ne pas modifier (sensibilité souris quand caméra lock avec J)
  const sensitivity = 0.005;
//events input
  window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "j") {
      const canvas = scene.getEngine().getRenderingCanvas();
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      } else {
        document.exitPointerLock();
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  const canvas = scene.getEngine().getRenderingCanvas();
  canvas.addEventListener("mousemove", (evt) => {
    if (document.pointerLockElement !== canvas || !camera) return;
    const movementX = evt.movementX || 0;
    camera.alpha -= movementX * sensitivity;
  });

  scene.registerBeforeRender(() => {
    if (!player.root) return;

    camera.target = player.root.position;

    const camMatrix = camera.getWorldMatrix();
    const forward = new BABYLON.Vector3(camMatrix.m[8], 0, camMatrix.m[10]).normalize();
    const right = new BABYLON.Vector3(camMatrix.m[0], 0, camMatrix.m[2]).normalize();
    //gestions inputs, à voir pour pouvoir faire un menu settings et avoir des touches dynamic
    let moveVector = BABYLON.Vector3.Zero();
    if (keys["z"]) moveVector.addInPlace(forward);
    if (keys["s"]) moveVector.addInPlace(forward.scale(-1));
    if (keys["q"]) moveVector.addInPlace(right.scale(-1));
    if (keys["d"]) moveVector.addInPlace(right);

    if (!moveVector.equals(BABYLON.Vector3.Zero())) {
      moveVector.normalize().scaleInPlace(player.speed ?? 0.015);
    }

    player.moveXZ(moveVector);
    // gravité, 2eme valeur pour gérer vitesse de chute 
    /*
    * chute a 0.1 pour avoir une gravité plus ou moins reel (gravité pas trop violente, mais assez pour suivre les courbures des maps)
    *A voir pour modifier pour les prochaines maps
    */
    player.root.moveWithCollisions(new BABYLON.Vector3(0, -0.1, 0)); 

    // Téléportation / check si le player touche un portrait -> console.log pour check
    for (const mesh of scene.meshes) {
      if (mesh.metadata?.isPortrait && player.root.intersectsMesh(mesh, false)) {
        console.log(`[TP] → ${mesh.name}`);
        player.root.position = mesh.metadata.teleportTo.clone();
      }
    }
  });
}
