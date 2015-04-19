/*
  Creates a 3D scene and sets the right renderer and controls dependent on the device.
*/

'use strict';

import createDebugAxes from './debug_axes_3d';
import createControls from './create_controls';
import createArrow from './create_arrow';


const turnSpeed = 0.01;
const moveSpeed = 1;

let divContainer, body;
let camera, scene, element;
let renderer, controls, keyControls;
let arrow, container;


function init() {
  body = document.body;
  divContainer = document.getElementById('canvas3d');

  renderer = new THREE.WebGLRenderer({autoClear:true});
  renderer.setClearColor(0xffffff, 1);
  element = renderer.domElement;
  divContainer.appendChild(element);

  scene = new THREE.Scene();
  scene.rotation.z += Math.PI/2;
  scene.rotation.x -= Math.PI/2;

  camera = new THREE.PerspectiveCamera(90, 1, 1, 3000); // correct aspect of camera is set in resize method, see below
  camera.position.z = 300;
  camera.position.x = 50;
  camera.position.y = 120;

  // create floor
  let material = new THREE.MeshBasicMaterial({wireframe:true, color: 0x000000});
  let geometry = new THREE.PlaneGeometry(300, 300, 20, 20);
  let floor = new THREE.Mesh(geometry, material);

  arrow = createArrow(70);
  arrow.position.z = 1;
  floor.add(arrow);

  container = new THREE.Object3D();
  container.add(floor);
  scene.add(container);


  let light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  window.addEventListener('resize', resize, false);
  scene.add(createDebugAxes(1000));

  keyControls = createControls();
  keyControls.onChange(onKeyControllerChange);

  controls = new THREE.OrbitControls(camera);
  controls.keys = {};
  controls.addEventListener('change', function(){
    render();
  });

  resize();
}


// called when arrow keys are used to navigate through the scene
function onKeyControllerChange(data){
  if(data.rotation !== 0){
    arrow.rotation.z += data.rotation * turnSpeed;
  }
  if(data.translation !== 0){
    arrow.position.x += data.translation * moveSpeed * Math.cos(arrow.rotation.z);
    arrow.position.y += data.translation * moveSpeed * Math.sin(arrow.rotation.z);
  }
  render();
}


function resize() {
  let width = divContainer.offsetWidth;
  let height = divContainer.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  render();
}


function render(){
  renderer.render(scene, camera);
}

export default {
  init:init
};