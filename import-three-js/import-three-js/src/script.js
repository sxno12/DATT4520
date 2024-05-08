// import the Three.js module:
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Stats from 'three/addons/libs/stats.module.js';
import { Water } from 'three/addons/objects/Water.js';

let water;

// create a renderer with better than default quality:
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
// make it fill the page
renderer.setSize(window.innerWidth, window.innerHeight);
// create and add the <canvas>
document.body.appendChild(renderer.domElement);

// create a perspective camera
const camera = new THREE.PerspectiveCamera(
  75, // this camera has a 75 degree field of view in the vertical axis
  window.innerWidth / window.innerHeight, // the aspect ratio matches the size of the window
  0.05, // anything less than 5cm from the eye will not be drawn
  100 // anything more than 100m from the eye will not be drawn
);
// position the camera
// the X axis points to the right
// the Y axis points up from the ground
// the Z axis point out of the screen toward you
camera.position.y = 1.5; // average human eye height is about 1.5m above ground
camera.position.z = 2; // let's stand 2 meters back

const controls = new OrbitControls( camera, renderer.domElement );

// update camera & renderer when page resizes:
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // bugfix: don't resize renderer if in VR
  if (!renderer.xr.isPresenting)
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const scene = new THREE.Scene();

const box = new THREE.BoxGeometry();
const box_material = new THREE.MeshStandardMaterial({ color: 0x008ff0 });
const box_mesh = new THREE.Mesh(box, box_material);
box_mesh.position.y = 1.5;
scene.add(box_mesh);

const ambientlight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientlight );

// Water

				const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

				water = new Water(
					waterGeometry,
					{
						textureWidth: 512,
						textureHeight: 512,
						waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

						} ),
						sunDirection: new THREE.Vector3(),
						sunColor: 0xffffff,
						waterColor: 0x001e0f,
						distortionScale: 3.7,
						fog: scene.fog !== undefined
					}
				);

				water.rotation.x = - Math.PI / 2;

				scene.add( water );

function animate() {
  
  const time = performance.now() * 0.001;
  
  box_mesh.rotation.x += 0.01;
  box_mesh.rotation.y += 0.01;

  controls.update();

  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
  
  // now draw the scene:
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
