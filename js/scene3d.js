/*
  Creates a 3D scene and sets the right renderer and controls dependent on the device.
*/

'use strict';

import createDebugAxes from './debug_axes_3d';
import createDebugCube from './debug_cube';
import createControls from './create_controls';
import createWorld from './create_world';
import createArrow from './create_arrow';
import addExtraCameraControls from './add_extra_camera_controls';


const turnSpeed = 0.01;
const moveSpeed = 1;

let divContainer, divOutput, divOutput2, body;
let camera, scene, element;
let renderer, controls, keyControls;
let arrow, debugAxes, container;
let mRound = Math.round;
let mPow = Math.pow;
let radToDeg = THREE.Math.radToDeg;
let animate;


function init() {
  body = document.body;
  divOutput = document.getElementById('output');
  divOutput2 = document.getElementById('output2');
  divContainer = document.getElementById('canvas3d');

  renderer = new THREE.WebGLRenderer({autoClear:true});
  renderer.setClearColor(0xffffff, 1);
  element = renderer.domElement;
  divContainer.appendChild(element);

  scene = new THREE.Scene();
  scene.rotation.z += Math.PI/2;
  scene.rotation.x -= Math.PI/2;
  //scene.position.y = 125

  camera = new THREE.PerspectiveCamera(90, 1, 1, 3000); // correct aspect of camera is set in resize method, see below
  //scene.add(camera);
  camera.position.z = 300;
  camera.position.x = 50;
  camera.position.y = 120;

  container = new THREE.Object3D();
  //container.rotation.x -= Math.PI/2;
  //container.rotation.z += Math.PI/2;

  let material = new THREE.MeshBasicMaterial({wireframe:true, color: 0x000000});
  let geometry = new THREE.PlaneGeometry(300, 300, 20, 20);
  let floor = new THREE.Mesh(geometry, material);
  container.add(floor);

  arrow = createArrow(70);
  arrow.position.z = 1;
  //arrow.rotation.z -= Math.PI/2;
  floor.add(arrow);
  //arrow.rotation.x -= Math.PI/2;
  //arrow.position.y = -25;
  //arrow.position.z = 50;
  //arrow.rotation.z = Math.PI/4;

  scene.add(container);

  let light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  window.addEventListener('resize', resize, false);
  //scene.add(createDebugCube(3000));
  debugAxes = createDebugAxes(1000);
  scene.add(debugAxes);

  keyControls = createControls();
  keyControls.onChange(onKeyControllerChange);

  // connect html range elements to camera's x and z rotation
  addExtraCameraControls(camera, render, document.getElementById('tilt'), document.getElementById('rotation'));

  controls = {
    update:function(){
      if(scene.rotation.x > -Math.PI/2 && animate){
        scene.rotation.x -= 0.01;
      }else if(scene.rotation.z < Math.PI/2 && animate){
        scene.rotation.z += 0.01;
      // }else if(arrow === undefined){
      //   arrow = createArrow(50);
      //   arrow.rotation.z = Math.PI/2;
      //   scene.add(arrow);
      }else{
        animate = false;
      }
      divOutput.innerHTML = scene.rotation.x + ' : ' + scene.rotation.z;
    }
  };
  //controls = new THREE.OrbitControls(camera);

  let button =  document.getElementById('fullscreen');
  button.style.visibility = 'visible';
  button.onclick = function(){
    renderer.setFullScreen(true);
  };
  vrRenderLoop();

  resize();
}


// called when arrow keys are used to navigate through the scene
function onKeyControllerChange(data){
  if(data.rotation !== 0){
    //animate = true;
    //return
    arrow.rotation.z += data.rotation * turnSpeed;
    //debugAxes.rotation.z -= data.rotation * turnSpeed;
  }
  if(data.translation !== 0){
    // regular rotation to compensate for the fact that an angle of 0° in Threejs is an angle of 90° in the Cartsian system
    arrow.position.x += data.translation * moveSpeed * Math.cos(arrow.rotation.z);
    arrow.position.y += data.translation * moveSpeed * Math.sin(arrow.rotation.z);
    //debugAxes.position.x -= data.translation * moveSpeed * Math.cos(debugAxes.rotation.z);
    //debugAxes.position.y += data.translation * moveSpeed * Math.sin(debugAxes.rotation.z);
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


function vrRenderLoop(){
  controls.update();

  // divOutput.innerHTML  = `x: ${round(radToDeg(camera.quaternion.x))} `;
  // divOutput.innerHTML += `y: ${round(radToDeg(camera.quaternion.y))} `;
  // divOutput.innerHTML += `z: ${round(radToDeg(camera.quaternion.z))} `;
  // divOutput.innerHTML += `w: ${round(radToDeg(camera.quaternion.w))}`;

  render();
  requestAnimationFrame(vrRenderLoop);
}


function render(){
  renderer.render(scene, camera);
}


function round(value, precision){
  precision = precision || 1;
  precision = mPow(10, precision);
  return mRound(value * precision)/precision;
}


export default {
  init:init
};