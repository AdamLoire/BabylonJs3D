export class Player {
  constructor(scene) {
    this.scene = scene;
    this.root = null;
    this.mesh = null;
    //vitesse du joueur, ne pas modifier
    this.speed = 0.28;
  }

  async load() {
    this.root = new BABYLON.Mesh("playerRoot", this.scene);
    this.root.checkCollisions = true;
    this.root.applyGravity = false;
    this.root.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
    this.root.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);

    const result = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/models/", "MC5.glb", this.scene);
    this.mesh = result.meshes[0];
    this.mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    this.mesh.parent = this.root;

    this.mesh.position = new BABYLON.Vector3(0, 0.2, 0);
    this.root.position = new BABYLON.Vector3(0, 0.1, 130);

    const debugBox = BABYLON.MeshBuilder.CreateBox("hitboxDebug", {
      width: this.root.ellipsoid.x * 2,
      height: this.root.ellipsoid.y * 2,
      depth: this.root.ellipsoid.z * 2
    }, this.scene);

    const debugMat = new BABYLON.StandardMaterial("debugMat", this.scene);
    debugMat.wireframe = true;
    debugMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
    debugBox.material = debugMat;
    debugBox.parent = this.root;
    debugBox.position = this.root.ellipsoidOffset.clone();
    debugBox.isPickable = false;
    debugBox.isVisible = true;
  }

  // collisions avec sol, ne pas transperser le sol -> meshs / pas un objet solide de base
  moveXZ(directionVec) {
    const moveVec = directionVec.clone().normalize().scale(this.speed);
    this.root.moveWithCollisions(moveVec);

    if (directionVec.length() > 0.001) {
      const angleY = Math.atan2(-directionVec.x, -directionVec.z);
      this.root.rotation = new BABYLON.Vector3(0, angleY, 0);
    }
  }

  get position() {
    return this.root.position;
  }
}
