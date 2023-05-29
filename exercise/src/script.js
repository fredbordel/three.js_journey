import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import * as lil_gui from "lil-gui";
import * as CANNON from "cannon-es";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light1 = new THREE.SpotLight();
light1.position.set(2.5, 5, 5);
light1.angle = Math.PI / 4;
light1.penumbra = 0.5;
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 20;
scene.add(light1);

const light2 = new THREE.SpotLight();
light2.position.set(-2.5, 5, 5);
light2.angle = Math.PI / 4;
light2.penumbra = 0.5;
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 20;
scene.add(light2);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 4);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.y = 0.5;

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const normalMaterial = new THREE.MeshNormalMaterial();
const phongMaterial = new THREE.MeshPhongMaterial();

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial);
cubeMesh.position.x = 0;
cubeMesh.position.y = 3;
cubeMesh.castShadow = true;
scene.add(cubeMesh);
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const cubeBody = new CANNON.Body({ mass: 1 });
cubeBody.addShape(cubeShape);
cubeBody.position.x = cubeMesh.position.x;
cubeBody.position.y = cubeMesh.position.y;
cubeBody.position.z = cubeMesh.position.z;
world.addBody(cubeBody);

const planeGeometry = new THREE.PlaneGeometry(25, 25);
const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 });
planeBody.addShape(planeShape);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new lil_gui.GUI();
const physicsFolder = gui.addFolder("Physics");
physicsFolder.add(world.gravity, "x", -10.0, 10.0, 0.1);
physicsFolder.add(world.gravity, "y", -10.0, 10.0, 0.1);
physicsFolder.add(world.gravity, "z", -10.0, 10.0, 0.1);
physicsFolder.open();

const clock = new THREE.Clock();
let delta;

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  delta = Math.min(clock.getDelta(), 0.1);
  world.step(delta);

  // Copy coordinates from Cannon to Three.js
  cubeMesh.position.set(
    cubeBody.position.x,
    cubeBody.position.y,
    cubeBody.position.z
  );
  cubeMesh.quaternion.set(
    cubeBody.quaternion.x,
    cubeBody.quaternion.y,
    cubeBody.quaternion.z,
    cubeBody.quaternion.w
  );

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
