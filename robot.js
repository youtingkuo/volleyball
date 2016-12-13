var robot = function (scene, npc, num){
	
	this.hitBallMachine = new THREE.Object3D();
	THREE.ImageUtils.crossOrigin = '';
	if(npc) {
  	if(num === 1) var bodyColor = THREE.ImageUtils.loadTexture('https://i.imgur.com/pPqkHmM.png');
    else var bodyColor = THREE.ImageUtils.loadTexture('https://i.imgur.com/XdCJXRz.png');
  }
  else {
  	if(num === 1) var bodyColor = THREE.ImageUtils.loadTexture('https://i.imgur.com/oxRKc6I.png');
    else var bodyColor = THREE.ImageUtils.loadTexture('https://i.imgur.com/fDrp2FJ.png');
  }
	var geometry = new THREE.CylinderGeometry(0.24, 0.24, 1.2, 32);
	var material = new THREE.MeshLambertMaterial({map: bodyColor});
	this.body = new THREE.Object3D();
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0.6, 0);
	this.body.add(mesh);
	this.hitBallMachine.add(this.body);
  
	geometry = new THREE.SphereGeometry(0.25, 32, 32);
  if(npc) material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('https://i.imgur.com/tajmEfb.png')});
  else material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('https://i.imgur.com/f9dNfsj.jpg')});
	var head = new THREE.Mesh(geometry, material);
	head.position.set(0, 1.4, 0);
	this.body.add(head);
  
  material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('https://i.imgur.com/yNp5hMw.jpg')});
	this.hitBallMachineHandLeft = new THREE.Object3D();
	this.body.add(this.hitBallMachineHandLeft);
	this.hitBallMachineHandLeft.rotation.z = 0.25;
	this.hitBallMachineHandLeft.position.y = 1.1;
	this.hitBallMachineHandLeft.rotation.x = Math.PI/2;
	var armLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 32), material);
	armLeft.position.set(-0.33, -0.5, 0);
	this.hitBallMachineHandLeft.add(armLeft);
	
	this.hitBallMachineHandRight = new THREE.Object3D();
	this.body.add(this.hitBallMachineHandRight);
	this.hitBallMachineHandRight.rotation.z = -0.25;
	this.hitBallMachineHandRight.position.y = 1.1;
	this.hitBallMachineHandRight.rotation.x = Math.PI/2;
	var armRight = armLeft.clone();
	armRight.position.set(0.33, -0.5, 0);
	this.hitBallMachineHandRight.add(armRight);
  
	this.handLeft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), material);
	this.handLeft.position.set(-0.33, -1, 0);
	this.hitBallMachineHandLeft.add(this.handLeft);
	this.handRight = this.handLeft.clone();
	this.handRight.position.set(0.33, -1, 0);
	this.hitBallMachineHandRight.add(this.handRight);
  	
	var foot = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), material);
	this.hitBallMachine.add(foot);
  
	this.body.rotation.x = -0.2;
	this.hitBallMachineHandLeft.rotation.x = 0.9;
	this.hitBallMachine.rotation.y = Math.PI/2;
	this.hitBallMachine.position.set(0, 0.4, 0);
	scene.add(this.hitBallMachine);
 
};