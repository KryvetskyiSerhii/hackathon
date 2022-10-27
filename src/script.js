import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/texture/NormalMap.png");
const crossFire = textureLoader.load("/texture/crossfire.png");
const blast = textureLoader.load("/texture/blast.png");
const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(0.2, 0.2, 1, 10);

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.7,
  metalness: 0.2,
});
material.normalMap = crossFire;

const sphere = new THREE.Mesh(geometry, material);
sphere.position.x = 1;
scene.add(sphere);

let enemiesNumber = 0;
let message = "";

const interval = setInterval(() => {
  const enemyGeometry = new THREE.SphereGeometry(0.15, 15, 32, 16);
  const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
  if (Math.random() > 0.5) {
    enemy.position.x = Math.random() * -1;
    enemy.position.y = Math.random();
  } else {
    enemy.position.x = Math.random();
    enemy.position.y = Math.random() * -1;
  }
  enemy.name = Math.random();
  enemiesNumber += 1;
  scene.add(enemy);
}, 3000);

const checkInterval = setInterval(() => {
  if (enemiesNumber > 3) {
    message = "Loser";
    console.log("loser");
    const showMessage = document.createElement("p");
    showMessage.innerText = "Loser";
    showMessage.classList.add("text");
    document.body.appendChild(showMessage);
    clearInterval(interval);
  }
}, 1000);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
  sphere.position.copy(intersectionPoint);
};

const handleDocumentClick = (e) => {
  const intersection = raycaster.intersectObjects(scene.children);
  if (intersection.length > 0) {
    const objName = intersection[0].object.name;
    console.log(objName);
    const obj = scene.getObjectByName(objName);
    scene.remove(obj);
    enemiesNumber -= 1;
  }
  const blastGeometry = new THREE.PlaneGeometry(0.5, 0.5, 1, 10);
  const blastMaterial = new THREE.MeshStandardMaterial();
  blastMaterial.normalMap = blast;
  const blastObj = new THREE.Mesh(blastGeometry, blastMaterial);
  blastObj.name = "blast";
  blastObj.position.copy(intersectionPoint);
  scene.add(blastObj);
  setTimeout(() => {
    const obj = scene.getObjectByName("blast");
    scene.remove(obj);
  }, 300);
};

window.addEventListener("click", handleDocumentClick);
window.addEventListener("mousemove", handleMouseMove);
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  renderer.render(scene, camera);
  if (message.length > 0) clearInterval(checkInterval);

  window.requestAnimationFrame(tick);
};

tick();
