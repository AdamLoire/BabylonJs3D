export function setupControls(scene, player, camera) {
  const keys = {};
  const sensitivity = 0.005;

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

    let moveVector = BABYLON.Vector3.Zero();
    if (keys["z"]) moveVector.addInPlace(forward);
    if (keys["s"]) moveVector.addInPlace(forward.scale(-1));
    if (keys["q"]) moveVector.addInPlace(right.scale(-1));
    if (keys["d"]) moveVector.addInPlace(right);

    if (!moveVector.equals(BABYLON.Vector3.Zero())) {
      moveVector.normalize().scaleInPlace(player.speed ?? 0.015);
    }

    player.moveXZ(moveVector);
    player.root.moveWithCollisions(new BABYLON.Vector3(0, -0.02, 0)); // gravité simple

    // 🎯 Téléportation
    for (const mesh of scene.meshes) {
      if (mesh.metadata?.isPortrait && player.root.intersectsMesh(mesh, false)) {
        console.log(`[TP] → ${mesh.name}`);
        player.root.position = mesh.metadata.teleportTo.clone();
      }
    }
  });
}
