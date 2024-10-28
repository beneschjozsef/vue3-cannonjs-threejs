import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default function textAnimation(renderer: THREE.WebGLRenderer, onComplete: () => void) {
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FFFFFF');

  const particles = new THREE.BufferGeometry();
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: '#EDAFAF',
    size: 0.1,
  });
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  const ambientLight = new THREE.AmbientLight('#FBE5E5', 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight('#F96867', 1.2);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const fontLoader = new FontLoader();
  fontLoader.load(
    '/roboto_regular.json',
    (font) => {
      const textGeometry = new TextGeometry('SORSOLÁS', {
        font: font,
        size: 2,
        height: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 5,
      });

      const textMaterial = new THREE.MeshPhysicalMaterial({
        color: '#5BC6C7',
        reflectivity: 1,
        clearcoat: 0.6,
      });

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textGeometry.center();
      scene.add(textMesh);

      let zoomProgress = 0;
      const zoomDuration = 2.5;

      function renderScene() {
        requestAnimationFrame(renderScene);
        if (zoomProgress < zoomDuration) {
          camera.position.z = THREE.MathUtils.lerp(40, 15, zoomProgress / zoomDuration);
          zoomProgress += 0.03;
        }
        particleSystem.rotation.y += 0.001;
        renderer.render(scene, camera);
      }
      renderScene();

      setTimeout(() => {
        fadeOut(renderer.domElement, onComplete);
      }, zoomDuration * 1000);
    },
    undefined,
    (error) => console.error('Font loading error:', error)
  );

  function fadeOut(element: HTMLElement, onComplete: () => void) {
    let opacity = 1;
    const fadeEffect = setInterval(() => {
      if (opacity > 0) {
        opacity -= 0.02;
        element.style.opacity = opacity.toString();
      } else {
        clearInterval(fadeEffect);
        onComplete();
      }
    }, 30);
  }
}
