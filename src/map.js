export function createScene(engine) {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 0.9, 1);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1.2;

  const ground = BABYLON.MeshBuilder.CreateGround("lobbyGround", { width: 300, height: 300 }, scene);
  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/cake_base.jpg", scene);
  groundMat.diffuseTexture.uScale = 50;
  groundMat.diffuseTexture.vScale = 50;
  ground.material = groundMat;
  ground.checkCollisions = true;

  const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
  wallMat.diffuseTexture = new BABYLON.Texture("assets/textures/granite_tile_diff_4k.jpg", scene);
  wallMat.bumpTexture = new BABYLON.Texture("assets/textures/granite_tile_disp_4k.png", scene);
  wallMat.diffuseTexture.uScale = 6;
  wallMat.diffuseTexture.vScale = 6;

  const museumWidth = 40;
  const museumDepth = 80;
  const museumHeight = 25;

  const floor = BABYLON.MeshBuilder.CreateBox("floor", {
    width: museumWidth,
    height: 1,
    depth: museumDepth
  }, scene);
  floor.position.y = 0.5;
  floor.material = wallMat;
  floor.checkCollisions = true;

  const wallY = museumHeight / 2 + 0.5;

  const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", {
    width: 1,
    height: museumHeight,
    depth: museumDepth
  }, scene);
  leftWall.position = new BABYLON.Vector3(-museumWidth / 2, wallY, 0);
  leftWall.material = wallMat;
  leftWall.checkCollisions = true;

  const rightWall = leftWall.clone("rightWall");
  rightWall.position.x = museumWidth / 2;

  const backWall = BABYLON.MeshBuilder.CreateBox("backWall", {
    width: museumWidth,
    height: museumHeight,
    depth: 1
  }, scene);
  backWall.position = new BABYLON.Vector3(0, wallY, -museumDepth / 2);
  backWall.material = wallMat;
  backWall.checkCollisions = true;

  const doorWidth = 10;
  const frontWallLeft = BABYLON.MeshBuilder.CreateBox("frontWallLeft", {
    width: (museumWidth - doorWidth) / 2,
    height: museumHeight,
    depth: 1
  }, scene);
  frontWallLeft.position = new BABYLON.Vector3(-((museumWidth + doorWidth) / 4), wallY, museumDepth / 2);
  frontWallLeft.material = wallMat;
  frontWallLeft.checkCollisions = true;

  const frontWallRight = frontWallLeft.clone("frontWallRight");
  frontWallRight.position.x *= -1;

  const roof = BABYLON.MeshBuilder.CreateBox("roof", {
    width: museumWidth,
    height: 1,
    depth: museumDepth
  }, scene);
  roof.position.y = museumHeight + 0.5;
  roof.material = wallMat;
  roof.checkCollisions = true;

  const stepCount = 6;
  const stepHeight = 0.5;
  const stepDepth = 1;
  const stepWidth = doorWidth;
  const topZ = museumDepth / 2;

  for (let i = 0; i < stepCount; i++) {
    const step = BABYLON.MeshBuilder.CreateBox(`step_${i}`, {
      width: stepWidth,
      height: stepHeight,
      depth: stepDepth
    }, scene);

    step.position = new BABYLON.Vector3(
      0,
      (i + 1) * stepHeight / 2 - 0.7,
      topZ + stepDepth * (stepCount - i - 0.5)
    );

    step.material = wallMat;
    step.checkCollisions = true;
  }

  // 🎨 Portraits (gauche du musée)
  const portraitCount = 3;
  const spacing = 12;
  const baseX = -museumWidth / 2 + 5.5;
  const startZ = 20;

  const dreamPositions = [
    new BABYLON.Vector3(1000, 2, 0),
    new BABYLON.Vector3(2000, 2, 0),
    new BABYLON.Vector3(3000, 2, 0),
  ];

  for (let i = 0; i < portraitCount; i++) {
    const z = startZ - i * spacing;

    const portrait = BABYLON.MeshBuilder.CreateBox(`portrait_${i}`, {
      width: 4,
      height: 6,
      depth: 0.3
    }, scene);

    portrait.position = new BABYLON.Vector3(baseX, 3, z);
    portrait.rotation.y = -Math.PI / 2;
    portrait.checkCollisions = false;
    portrait.isPickable = false;

    const mat = new BABYLON.StandardMaterial(`portraitMat_${i}`, scene);
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    portrait.material = mat;

    portrait.metadata = {
      isPortrait: true,
      teleportTo: dreamPositions[i]
    };

    const base = BABYLON.MeshBuilder.CreateCylinder(`socle_${i}`, {
      diameter: 2.5,
      height: 0.4
    }, scene);
    base.position = new BABYLON.Vector3(baseX, 0.2, z);
    const baseMat = new BABYLON.StandardMaterial(`socleMat_${i}`, scene);
    baseMat.diffuseColor = new BABYLON.Color3(0.6, 0.2, 0.2);
    base.material = baseMat;
    base.checkCollisions = true;
  }

  // 🌌 Plates-formes des rêves
  for (let i = 0; i < 3; i++) {
    const platform = BABYLON.MeshBuilder.CreateBox(`dream_platform_${i}`, {
      width: 300,
      height: 2,
      depth: 300
    }, scene);
    platform.position = dreamPositions[i];
    platform.material = groundMat;
    platform.checkCollisions = true;
  }

  // 🍭 Sucettes suspendues au sol
  const addLollipop = (name, position) => {
    // bâton
    const stick = BABYLON.MeshBuilder.CreateCylinder(`${name}_stick`, {
      height: 4,
      diameter: 0.2
    }, scene);
    stick.position = position.clone();
    stick.position.y -= 2; // le bâton part du sol vers le bonbon
    const stickMat = new BABYLON.StandardMaterial(`${name}_stickMat`, scene);
    stickMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    stick.material = stickMat;

    // bonbon
    const candy = BABYLON.MeshBuilder.CreateSphere(`${name}_head`, {
      diameter: 1.5,
      segments: 16
    }, scene);
    candy.position = position.clone();
    const candyMat = new BABYLON.StandardMaterial(`${name}_mat`, scene);
    candyMat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    candyMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    candyMat.alpha = 0.9;
    candy.material = candyMat;
  };

  // Place la base des sucettes sur le sol (Y=2 pour que le bâton descende jusqu'à Y=0)
  addLollipop("lollipop1", new BABYLON.Vector3(-10, 2, 35));
  addLollipop("lollipop2", new BABYLON.Vector3(10, 2, 35));

  return scene;
}
