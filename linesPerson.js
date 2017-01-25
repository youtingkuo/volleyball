var linesPerson = function() {
  this.inOrOut = 0; //1:in  2:out
	this.isOn = false;

	this.hitBallMachine = new THREE.Object3D();
	THREE.ImageUtils.crossOrigin = '';
	var geometry = new THREE.CylinderGeometry(0.24, 0.24, 1.2, 32);
	var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
	this.body = new THREE.Object3D();
	this.mesh = new THREE.Mesh(geometry, material);
	this.mesh.position.set(0, 0.6, 0);
	this.body.add(this.mesh);
	this.hitBallMachine.add(this.body);
  
	geometry = new THREE.SphereGeometry(0.25, 32, 32);
  material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('https://i.imgur.com/f9dNfsj.jpg')});
	this.head = new THREE.Mesh(geometry, material);
	this.head.position.set(0, 1.4, 0);
	this.body.add(this.head);
  
  material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('https://i.imgur.com/yNp5hMw.jpg')});
	this.hitBallMachineHandLeft = new THREE.Object3D();
	this.body.add(this.hitBallMachineHandLeft);
	this.hitBallMachineHandLeft.rotation.z = 3;
  this.hitBallMachineHandLeft.position.x = -0.3;
	this.hitBallMachineHandLeft.position.y = 1.1;
	this.armLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 32), material);
	this.armLeft.position.set(0, 0.5, 0);
	this.hitBallMachineHandLeft.add(this.armLeft);
	
	this.hitBallMachineHandRight = new THREE.Object3D();
	this.body.add(this.hitBallMachineHandRight);
	this.hitBallMachineHandRight.rotation.z = Math.PI - 3;
  //hitBallMachineHandRight.rotation.x = 1.5;
  this.hitBallMachineHandRight.position.x = 0.3;
	this.hitBallMachineHandRight.position.y = 1.1;
	this.armRight = this.armLeft.clone();
	this.armRight.position.set(0, -0.5, 0);
	this.hitBallMachineHandRight.add(this.armRight);
  
  this.cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 0.04, 0.04, 1.2, 32 ), new THREE.MeshBasicMaterial( {color: 0x804000}) );
  //this.cylinder.rotation.z = -1.5;
  this.cylinder.rotation.y = Math.PI/2;
  this.cylinder.position.set(0, -1, 0);
	this.hitBallMachineHandRight.add( this.cylinder );

	this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 0.4, 0.4, 32 ), new THREE.MeshBasicMaterial( {color: 0xff0000, side: 	THREE.DoubleSide} ) );
	this.plane.rotation.z = -1.5 + Math.PI/2;
  this.plane.rotation.y = Math.PI/2;
  this.plane.position.set(0, -1.4, 0.2);
	this.hitBallMachineHandRight.add( this.plane );
  
	this.handLeft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), material);
	this.handLeft.position.set(0, 1, 0);
	this.hitBallMachineHandLeft.add(this.handLeft);
	this.handRight = this.handLeft.clone();
	this.handRight.position.set(0, -1, 0);
	this.hitBallMachineHandRight.add(this.handRight);
  	
	this.foot = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), material);
	this.hitBallMachine.add(this.foot);
  
	this.hitBallMachine.rotation.y = Math.PI;
	this.hitBallMachine.position.set(-7.5, 0.4, -5.5);
	scene.add(this.hitBallMachine);
}

linesPerson.prototype.update = function() {
	if(this.isOn) {
  	if(this.inOrOut === 1) {
    	if(this.hitBallMachineHandRight.rotation.x < 1.2) {
      	this.hitBallMachineHandRight.rotation.x += 0.08;
      }
    }
    else if(this.inOrOut === 2) {
    	if(this.hitBallMachineHandRight.rotation.x < 3) {
      	this.hitBallMachineHandRight.rotation.x += 0.08;
      }
    }
  }
}