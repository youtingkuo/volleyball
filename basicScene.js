var BasicScene = function (scene){
    var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 13, 8, 10 );
		spotLight.castShadow = true;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		spotLight.shadow.camera.near = 500;
		spotLight.shadow.camera.far = 4000;
		spotLight.shadow.camera.fov = 30;
		scene.add( spotLight );
    
    var spotLight2 = spotLight.clone();
		spotLight2.position.set( 13, 8, -10 );
		scene.add( spotLight2 );
    
    var spotLight3 = spotLight.clone();
		spotLight3.position.set( -13, 8, -10 );
		scene.add( spotLight3 );
    
    var spotLight4 = spotLight.clone();
		spotLight4.position.set( -13, 8, 10 );
		scene.add( spotLight4 );
    
    THREE.ImageUtils.crossOrigin = '';
    var geometry = new THREE.CylinderGeometry( 50, 50, 50, 32, 32 );
		var material = new THREE.MeshBasicMaterial ({map: THREE.ImageUtils.loadTexture('https://i.imgur.com/fJxaqVc.jpg'),  side:THREE.DoubleSide});
		var cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.y = 12.5;
		scene.add( cylinder );
	
  	var texture = THREE.ImageUtils.loadTexture('https://i.imgur.com/uLAXfWL.jpg');
  
	this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(32,16,32), new THREE.MeshBasicMaterial({map: texture, 
                         transparent: true, 
                         side:THREE.DoubleSide}));
	this.floor.rotation.x=-Math.PI/2;
	scene.add(this.floor);
  
	texture = THREE.ImageUtils.loadTexture('https://i.imgur.com/r7rjUNg.jpg');
	this.ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(100,100,32), new THREE.MeshBasicMaterial({map: texture, 
                         transparent: true, 
                         side:THREE.DoubleSide}));
	this.ground.position.y -= 0.02;
	this.ground.rotation.x=-Math.PI/2;
	scene.add(this.ground);

	this.line1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(16,0.125,32), new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xffffff}));
	this.line1.rotation.x=-Math.PI/2;
	this.line1.position.set(0, 0.05, 4.0625);
	scene.add(this.line1);
	this.line2 = this.line1.clone();
	this.line2.position.set(0, 0.05, -4.0625);
	scene.add(this.line2);
	this.line3 = new THREE.Mesh(new THREE.PlaneBufferGeometry(8.25,0.125,32), new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xffffff}));
	this.line3.rotation.x=-Math.PI/2;
	this.line3.rotation.z=-Math.PI/2;
	this.line3.position.set(-8.0625, 0.05, 0);
	scene.add(this.line3);
	this.line4 = this.line3.clone();
	this.line4.position.set(8.0625, 0.05, 0);
	scene.add(this.line4);
	
	var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,2.55,32),new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: 0xffffff}));
  	var cylinder2 = cylinder.clone();
  	cylinder.position.set(0,2.55/2,4.1);
  	cylinder2.position.set(0,2.55/2,-4.1);
  	scene.add(cylinder);
  	scene.add(cylinder2);
  
  	texture = THREE.ImageUtils.loadTexture('https://i.imgur.com/xqMo1dt.png');
  	var net = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.8,8,32),new THREE.MeshBasicMaterial({map: texture, 
                         transparent: true, 
                         opacity :0.15,
                         side:THREE.DoubleSide})); 
  	net.position.set(0,1.93,0);
  	net.rotation.z=Math.PI/2;
  	net.rotation.y=Math.PI/2;
  	scene.add(net);
    var netTop = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.08,8,32), new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: 0xffffff}));
    netTop.position.set(0,2.37,0);
  	netTop.rotation.z=Math.PI/2;
  	netTop.rotation.y=Math.PI/2;
  	scene.add(netTop);
    var netBottom = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.08,8,32), new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: 0xffffff}));
    netBottom.position.set(0,1.49,0);
  	netBottom.rotation.z=Math.PI/2;
  	netBottom.rotation.y=Math.PI/2;
  	scene.add(netBottom);
};