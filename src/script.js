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
scene.add(sphere);

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

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1);
// scene.add(pointLightHelper);

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

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let mouseXClicked = 100;
let mouseYClicked = 100;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

const handleDocumentMouseMove = (e) => {
  mouseX = e.clientX - windowHalfX;
  mouseY = e.clientY - windowHalfY;
};

const handleDocumentClick = (e) => {
  mouseXClicked = e.pageX;
  mouseYClicked = e.pageY;
  console.log(e.pageX);
};

document.addEventListener("mousemove", handleDocumentMouseMove);
document.addEventListener("click", handleDocumentClick);

const clock = new THREE.Clock();

const tick = () => {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.6 * elapsedTime;
  sphere.rotation.y += 0.6 * (targetX - sphere.rotation.y);
  sphere.rotation.x += 0.6 * (targetY - sphere.rotation.x);

  sphere.position.x = mouseXClicked * 0.001;
  sphere.position.y = mouseYClicked * 0.001;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
