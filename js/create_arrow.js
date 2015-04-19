/*
  Creates mesh with an arrow texture
*/

'use strict';

function create(size = 25){

  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  let textureSize = 128;
  let halfTextureSize = textureSize/2;
  let margin = 0.1 * textureSize;
  let stemWidth = 0.4 * textureSize;
  let stemHeight = 0.4 * textureSize;
  let arrowHeadHeight = 0.4 * textureSize;

  canvas.width = textureSize;
  canvas.height = textureSize;
  context.rect(0, 0, textureSize, textureSize);
  context.fillStyle = 'rgb(255, 255, 0)';
  context.fill();
  context.fillStyle = 'rgb(0, 0, 0)';
  //context.strokeStyle = '#000000';
  context.beginPath();
  context.moveTo(halfTextureSize, margin); // tip of head of arrow
  context.lineTo(textureSize - margin, margin + arrowHeadHeight); // right side of arrow head
  context.lineTo(halfTextureSize + stemWidth/2, margin + arrowHeadHeight); // move back to the stem
  context.lineTo(halfTextureSize + stemWidth/2, textureSize - margin - stemHeight); // bottom of the stem
  context.lineTo(halfTextureSize + stemWidth/2, textureSize - margin);
  context.lineTo(halfTextureSize - stemWidth/2, textureSize - margin);
  context.lineTo(halfTextureSize - stemWidth/2, arrowHeadHeight + margin);
  context.lineTo(margin, arrowHeadHeight + margin);
  context.lineTo(halfTextureSize, margin);
  //context.stroke();
  context.fill();

  let texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  let material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
  let geometry = new THREE.PlaneBufferGeometry(size, size, 10, 10);
  let plane = new THREE.Mesh(geometry, material);
  plane.name = 'arrow';
///*
  let container = new THREE.Object3D();
  plane.rotation.z -= Math.PI/2;
  container.add(plane);
  return container;
//*/
  return plane;
}


export default create;
