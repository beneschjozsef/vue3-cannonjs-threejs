import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default function mainAnimation(renderer: THREE.WebGLRenderer) {
  interface Ball {
    group: THREE.Group;
    body: CANNON.Body | null;
    isSelected: boolean;
    targetX: number | null;
  }

  renderer.domElement.style.opacity = '1';
  console.info('main start');
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.set(0, -2, 15);
  const cameraRadius = 15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xf6d5d5, 0.7);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xae2031, 1.2);
  directionalLight.position.set(2, 0, 5);
  scene.add(directionalLight);

  // Cannon.js világ és gravitáció beállítása
  const world = new CANNON.World();
  world.gravity.set(0, -9.81, 0);

  const boxSize = 3;
  const wallThickness = 0.1;

  // Falszimuláció Cannon.js-ben
  const walls = [
    { x: boxSize, y: 0, z: 0, w: wallThickness, h: boxSize, d: boxSize },
    { x: -boxSize, y: 0, z: 0, w: wallThickness, h: boxSize, d: boxSize },
    { x: 0, y: boxSize, z: 0, w: boxSize, h: wallThickness, d: boxSize },
    { x: 0, y: -boxSize, z: 0, w: boxSize, h: wallThickness, d: boxSize },
    { x: 0, y: 0, z: boxSize, w: boxSize, h: boxSize, d: wallThickness },
    { x: 0, y: 0, z: -boxSize, w: boxSize, h: boxSize, d: wallThickness },
  ];

  walls.forEach((wall) => {
    const wallShape = new CANNON.Box(new CANNON.Vec3(wall.w, wall.h, wall.d));
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(wallShape);
    wallBody.position.set(wall.x, wall.y, wall.z);
    world.addBody(wallBody);
  });

  const balls: Ball[] = [];
  const selectedNumbers = [12, 25, 37, 48, 89];

  for (let i = 1; i <= 90; i++) {
    const radius = 0.45;
    const color = new THREE.Color(`hsl(${(i * 4) % 360}, 80%, 50%)`);
    const material = new THREE.MeshPhongMaterial({ color, shininess: 100 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;
    if (context) {
      context.fillStyle = 'white';
      context.font = 'bold 400px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(`${i}`, canvas.width / 2, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.center.set(0.5, 0.5);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const ball = new THREE.Mesh(geometry, material);
    const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 1.5, radius * 1.5), textMaterial);
    textMesh.position.set(0, 0, radius + 0.01);

    const ballGroup = new THREE.Group();
    ballGroup.add(ball);
    ballGroup.add(textMesh);

    const position = {
      x: (Math.random() - 0.5) * boxSize * 1.8,
      y: (Math.random() - 0.5) * boxSize * 1.8,
      z: (Math.random() - 0.5) * boxSize * 1.8,
    };
    ballGroup.position.set(position.x, position.y, position.z);
    scene.add(ballGroup);

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: new CANNON.Sphere(radius),
    });
    world.addBody(body);

    balls.push({
      group: ballGroup,
      body: body,
      isSelected: selectedNumbers.includes(i),
      targetX: selectedNumbers.includes(i) ? selectedNumbers.indexOf(i) - 2 : null,
    });
  }

  let isMixing = true;

  function animate() {
    requestAnimationFrame(animate);

    if (isMixing) {
      balls.forEach((ball) => {
        if (ball.body) {
          ball.body.applyImpulse(
            new CANNON.Vec3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
            new CANNON.Vec3(0, 0, 0)
          );
        }
      });
    }

    world.step(1 / 60);

    balls.forEach((ball) => {
      if (ball.body) {
        const pos = ball.body.position;
        ball.group.position.set(pos.x, pos.y, pos.z);
        ball.group.quaternion.copy(ball.body.quaternion);
      }
    });

    renderer.render(scene, camera);
  }

  selectedNumbers.forEach((_, index) => {
    setTimeout(
      () => {
        const selectedBall = balls.find((ball) => ball.isSelected && ball.targetX === index - 2);

        if (selectedBall) {
          const targetY = -4.5;
          const targetX = (selectedBall.targetX ?? 0) * 1.5;
          let animationProgress = 0;
          const initialY = selectedBall.group.position.y;
          const liftHeight = initialY + 2;
          const animationSpeed = 0.005;

          function animateSelection() {
            if (selectedBall) {
              if (animationProgress < 1) {
                animationProgress += animationSpeed;

                if (animationProgress < 0.5) {
                  selectedBall.group.position.y = THREE.MathUtils.lerp(initialY, liftHeight, animationProgress * 2);
                } else {
                  selectedBall.group.position.y = THREE.MathUtils.lerp(
                    liftHeight,
                    targetY,
                    (animationProgress - 0.5) * 2
                  );
                }

                selectedBall.group.position.x = THREE.MathUtils.lerp(
                  selectedBall.group.position.x,
                  targetX,
                  animationProgress
                );
                const scaleFactor = THREE.MathUtils.lerp(1, 1.2, Math.sin(animationProgress * Math.PI));
                selectedBall.group.scale.set(scaleFactor, scaleFactor, scaleFactor);

                requestAnimationFrame(animateSelection);
              } else {
                selectedBall.group.position.set(targetX, targetY, 0);
                selectedBall.group.lookAt(camera.position);
                selectedBall.group.scale.set(1, 1, 1);

                if (selectedBall.body) {
                  world.removeBody(selectedBall.body);
                  selectedBall.body = null;
                }
              }
            }
          }
          animateSelection();
        }
      },
      2000 + index * 800
    );
  });

  function cameraSpin() {
    const spinSpeed = 0.008;
    const totalSpin = Math.PI * 4;
    let spinProgress = 0;

    function spinAnimation() {
      if (spinProgress < totalSpin) {
        spinProgress += spinSpeed;
        camera.position.x = cameraRadius * Math.cos(spinProgress);
        camera.position.z = cameraRadius * Math.sin(spinProgress);
        camera.lookAt(0, -2, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(spinAnimation);
      } else {
        camera.position.set(0, -2, 15);
        camera.lookAt(0, -2, 0);
        console.log('set back');
      }
    }
    spinAnimation();
  }

  setTimeout(() => {
    isMixing = false;
    world.gravity.set(0, -9.81, 0);
    cameraSpin();
  }, 8000);

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
