import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const objectLoader = new GLTFLoader();
let chevreObj = null;
let isObjectRevealed = false;
let objectIsClicked = false;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Resize
 */
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();
raycaster.set(rayOrigin, rayDirection);

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

/**
 * Click
 */
let currentIntersect = null;

window.addEventListener("click", () => {
  if (currentIntersect) {
    if (currentIntersect.object.name === "CHEVRE") {
      objectIsClicked = true;
    } else {
      objectIsClicked = false;
    }
  }
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
scene.add(camera);

/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

/**
 * Controls
 */
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enableZoom = false;

/**
 * Geometry
 */
objectLoader.load(
  "static/objects/chevre.glb",
  function (chevre) {
    chevreObj = chevre.scene;
    chevreObj.scale.set(1.5, 1.5, 1.5);
    chevreObj.position.x = 0;
    chevreObj.position.y = -1.5;
    scene.add(chevreObj);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
ambientLight.position.set(0, 0, 3);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight("#D06541", 8, 10, Math.PI * 0.12, 0.2, 5);

const spotLight2 = new THREE.SpotLight(
  "#FFFFFF",
  8,
  10,
  Math.PI * 0.12,
  0.2,
  5
);

const spotLight3 = new THREE.SpotLight(
  "#960905",
  8,
  10,
  Math.PI * 0.12,
  0.2,
  5
);

spotLight.position.set(3, 0, 3);
spotLight2.position.set(0, 3, 3);
spotLight3.position.set(-3, 0, 3);

scene.add(spotLight);
scene.add(spotLight2);
scene.add(spotLight3);

/**
 * Reveal on scroll
 */

function animateScale(object, targetScale, duration) {
  let start = null;
  let initialScale = {
    x: object.scale.x,
    y: object.scale.y,
    z: object.scale.z,
  };

  function step(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    let factor = progress / duration;

    if (factor > 1) factor = 1; // Clamp the factor between 0 and 1

    object.scale.x = initialScale.x + (targetScale.x - initialScale.x) * factor;
    object.scale.y = initialScale.y + (targetScale.y - initialScale.y) * factor;
    object.scale.z = initialScale.z + (targetScale.z - initialScale.z) * factor;

    if (progress < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function revealAnimalHead() {
  const revealElement = document.querySelector(".reveal");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isObjectRevealed = true;

          spotLight.visible = true;
          spotLight2.visible = true;
          spotLight3.visible = true;

          ambientLight.intensity = 0.5;

          document.getElementById("site").style.pointerEvents = "none";

          if (chevreObj) animateScale(chevreObj, { x: 1, y: 1, z: 1 }, 200);
        } else {
          isObjectRevealed = false;

          spotLight.visible = false;
          spotLight2.visible = false;
          spotLight3.visible = false;

          if (chevreObj)
            animateScale(chevreObj, { x: 1.5, y: 1.5, z: 1.5 }, 200);
          ambientLight.intensity = 0.05;
          document.getElementById("site").style.pointerEvents = "auto";
        }
      });
    },
    { rootMargin: "0px", threshold: 0.8 }
  );

  observer.observe(revealElement);
}

revealAnimalHead();

/**
 * Animate
 */

const rotateOnScroll = () => {
  let scrollHeight = document.documentElement.scrollHeight;
  let scrollTop = document.documentElement.scrollTop;
  let clientHeight = document.documentElement.clientHeight;
  let scrolledPercentage = (scrollTop + clientHeight) / scrollHeight;

  if (chevreObj) {
    chevreObj.rotation.y = scrolledPercentage * 0.5;
  }
};

document.addEventListener("scroll", rotateOnScroll);

const clock = new THREE.Clock();
let previousTime = 0;
let direction = 1;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Cast a ray
  raycaster.setFromCamera(mouse, camera);

  if (chevreObj && isObjectRevealed) {
    const modelIntersects = raycaster.intersectObject(chevreObj);
    if (modelIntersects.length) {
      document.querySelector(".webgl").style.cursor = "pointer";
      objectIsClicked
        ? document.querySelector(".popup").classList.remove("--close")
        : null;
    } else {
      objectIsClicked = false;
      document.querySelector(".webgl").style.cursor = "auto";
      document.querySelector(".popup").classList.add("--close");
    }

    if (modelIntersects.length) {
      currentIntersect = modelIntersects[0];
    } else {
      currentIntersect = null;
    }
  }

  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
