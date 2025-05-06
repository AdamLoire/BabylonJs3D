export function setupCamera(scene, canvas) {
  const target = new BABYLON.TransformNode("target", scene);

  const camera = new BABYLON.ArcRotateCamera(
    "ArcCam",
    Math.PI,
    BABYLON.Tools.ToRadians(50),
    10,
    target.position,
    scene
  );

  camera.attachControl(canvas, false);

  // débloquer la cam, pouvoir voir de haut en bas sous arc Cam
  camera.lowerBetaLimit   = BABYLON.Tools.ToRadians(5);             // ≈ 5°
  camera.upperBetaLimit   = Math.PI - BABYLON.Tools.ToRadians(5);   // ≈ 175°
  camera.lowerRadiusLimit = 7;
  camera.upperRadiusLimit = 14;
  camera.allowUpsideDown  = true;

  camera.inputs.clear(); // pointeur lock souris

  let isPointerLocked = false;

  const onMouseMove = (e) => {
    if (!isPointerLocked) return;
    const deltaY = e.movementY || 0;
    const sensitivity = 0.002;
    camera.beta -= deltaY * sensitivity;
    // clamp entre lowerBetaLimit et upperBetaLimit
    camera.beta = Math.max(camera.lowerBetaLimit, Math.min(camera.upperBetaLimit, camera.beta));
  };

  const onPointerLockChange = () => {
    isPointerLocked = (document.pointerLockElement === canvas);
  };

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  document.addEventListener("pointerlockchange", onPointerLockChange);
  document.addEventListener("mousemove", onMouseMove);

  return camera;
}
