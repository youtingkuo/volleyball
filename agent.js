var MAXSPEED = 5;
var ARRIVAL_R = 0.5;

var Agent = function (pos, vel) {
	this.pos = pos.clone();
	this.vel = vel.clone();
	this.force = new THREE.Vector3();
	this.target = new THREE.Vector3();
	this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4, 0.2, 32),new THREE.MeshLambertMaterial({
		side: THREE.DoubleSide,
    transparent: true,
		opacity :0.0,
		color: 0x00ffff
	}));
};

Agent.prototype.step = function (dt) 
{
	this.accumForce();
	
	// vel += force*dt
	var tmp = this.force.clone();
	tmp.multiplyScalar (dt);
	this.vel.add (tmp);  

	// velocity modulation by arriving
	var diff = new THREE.Vector3();
  var tmp1 = this.target;
  tmp1.y = 0;
  var tmp2 = this.pos;
  tmp2.y = 0;
	diff.subVectors (tmp1, tmp2);
	var dst = diff.length();
	if (dst < ARRIVAL_R) {
		this.vel.setLength (dst);	
	}
	
	// pos += vel*dt
	tmp.copy (this.vel);
	tmp.multiplyScalar (dt*1.5);
	this.pos.add (tmp); 
};

Agent.prototype.accumForce = function ()
{
	// clear force accumulator
	this.force.set (0,0,0);
	
	var sum = new THREE.Vector3(0,0,0);
	
	// seek
	var tmp = new THREE.Vector3();
	tmp.subVectors (this.target, this.pos);
	tmp.normalize();
	tmp.multiplyScalar (MAXSPEED);
	sum.subVectors (tmp, this.vel);
	
	this.force.copy (sum);
}