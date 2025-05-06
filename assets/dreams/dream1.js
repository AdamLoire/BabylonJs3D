export function createDream1(scene) {
  const terrain = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "dream1Terrain",
    "./assets/dreams/pente.png", // map, mettre heightmap png
    {
      width: 300,
      height: 300,
      subdivisions: 100,
      minHeight: 0,
      maxHeight: 20
    },
    scene
  );

  const terrainMat = new BABYLON.StandardMaterial("dream1Mat", scene);
  //texture sol map
  terrainMat.diffuseTexture = new BABYLON.Texture("assets/textures/snow.jpg", scene);
  terrain.material = terrainMat;

  //position map
  terrain.position = new BABYLON.Vector3(1000, 0, 0); 
  terrain.checkCollisions = true;

  return terrain;
}
