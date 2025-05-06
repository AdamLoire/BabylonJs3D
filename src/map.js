// File: sceneMap.js

import { createDream1 } from "../assets/dreams/dream1.js";

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

  // création musée, à refaire
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

  // data pour création portraitss
  const portraitCount = 3;
  const spacing = 12;
  const baseX = -museumWidth / 2 + 5.5;
  const startZ = 20;

  // positions des tps (où le joueur va être tp quand il rentre dans le portraits)
  const dreamPositions = [
    new BABYLON.Vector3(900, 1, 120),
    new BABYLON.Vector3(2000, 2, 0),
    new BABYLON.Vector3(3000, 2, 0),
  ];

  // création portraits

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
    portrait.isPickable = true;

    const mat = new BABYLON.StandardMaterial(`portraitMat_${i}`, scene);
    //textures portrait 1
    if (i === 0) {
      mat.diffuseTexture = new BABYLON.Texture("assets/textures/Dream1.png", scene);
      mat.bumpTexture = new BABYLON.Texture("assets/textures/backDream1.png", scene);
      mat.specularPower = 64;
    } else {
      mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    }
    portrait.material = mat;

    // data pour tp (récup positions)
    portrait.metadata = { isPortrait: true, teleportTo: dreamPositions[i] };

    // Action manager pour tp
    portrait.actionManager = new BABYLON.ActionManager(scene);
    portrait.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        () => {
          const tp = portrait.metadata.teleportTo;
          scene.activeCamera.position = tp.clone();
        }
      )
    );

    // socle painture; actuellement sous le sol du musée, à changer quand on rajoute le jump
    const base = BABYLON.MeshBuilder.CreateCylinder(`socle_${i}`, { diameter: 2.5, height: 0.4 }, scene);
    base.position = new BABYLON.Vector3(baseX, 0.2, z);
    const baseMat = new BABYLON.StandardMaterial(`socleMat_${i}`, scene);
    base.material = baseMat;
    base.checkCollisions = true;
  }

  // création map rêve 1
  createDream1(scene);

  // différentes map, map = rêve (hors lobby & hors map 1)
  // plateforme pour prévisualiser les tps et les distances + map 
  for (let i = 1; i < 3; i++) {
    const platform = BABYLON.MeshBuilder.CreateBox(`dream_platform_${i}`, { width: 300, height: 2, depth: 300 }, scene);
    platform.position = dreamPositions[i];
    platform.material = groundMat;
    platform.checkCollisions = true;
  }

  // structures pour faire de la déco
  const addLollipop = (name, position) => {
    const stick = BABYLON.MeshBuilder.CreateCylinder(`${name}_stick`, { height: 4, diameter: 0.2 }, scene);
    stick.position = position.clone();
    stick.position.y -= 2;
    const stickMat = new BABYLON.StandardMaterial(`${name}_stickMat`, scene);
    stickMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    stick.material = stickMat;

    const candy = BABYLON.MeshBuilder.CreateSphere(`${name}_head`, { diameter: 1.5, segments: 16 }, scene);
    candy.position = position.clone();
    const candyMat = new BABYLON.StandardMaterial(`${name}_mat`, scene);
    candyMat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    candyMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    candyMat.alpha = 0.9;
    candy.material = candyMat;
  };

  addLollipop("lollipop1", new BABYLON.Vector3(-10, 2, 35));
  addLollipop("lollipop2", new BABYLON.Vector3(10, 2, 35));

  return scene;
}
