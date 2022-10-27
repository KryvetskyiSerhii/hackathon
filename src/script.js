import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/texture/NormalMap.png");

const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(0.2, 15, 32, 16);

const material = new THREE.MeshStandardMaterial({
  color: 0x292929,
  roughness: 0.7,
  metalness: 0.2,
});
material.normalMap = normalTexture;

const sphere = new THREE.Mesh(geometry, material);
sphere.position.x = 1;
scene.add(sphere);

// setInterval(() => {
//   const enemyGeometry = new THREE.SphereGeometry(0.15, 15, 32, 16);
//   const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//   const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
//   if (Math.random() > 0.5) {
//     enemy.position.x = Math.random() * -1;
//     enemy.position.y = Math.random();
//   } else {
//     enemy.position.x = Math.random();
//     enemy.position.y = Math.random() * -1;
//   }

//   scene.add(enemy);
// }, 3000);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff0000, 2);
pointLight2.position.set(4, 3, 4);
scene.add(pointLight2);

const light2Gui = gui.addFolder("Light");

light2Gui.add(pointLight2.position, "y").min(-10).max(10).step(0.1);
light2Gui.add(pointLight2.position, "x").min(-10).max(10).step(0.1);
light2Gui.add(pointLight2.position, "z").min(-10).max(10).step(0.1);

const lightColor = {
  color: 0xff0000,
};

light2Gui.addColor(lightColor, "color").onChange(() => {
  pointLight2.color.set(lightColor.color);
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

const handleMouseMove = (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
};

const handleDocumentClick = () => {
  sphere.position.copy(intersectionPoint);
};

window.addEventListener("click", handleDocumentClick);
window.addEventListener("mousemove", handleMouseMove);
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.6 * elapsedTime;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
