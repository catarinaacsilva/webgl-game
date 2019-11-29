//////////////////////////////////////////////////////////////////////////////
//	Catarina Silva
// 	c.alexandracorreia@ua.pt
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructor
//

function LightSource() {
	// And is directional
	this.position = [0.0, 0.0, 0.0, 1.0];

	// White light
	this.intensity = [1.0, 1.0, 1.0];

	// Ambient component
	this.ambientIntensity = [0.2, 0.2, 0.2];

	// Rotation angles	
	this.rotAngleXX = 0.0;
	this.rotAngleYY = 0.0;
	this.rotAngleZZ = 0.0;
}

//----------------------------------------------------------------------------
//
//  Methods
//

LightSource.prototype.isDirectional = function () {
	return this.position[3] == 0.0;
}

LightSource.prototype.getPosition = function () {
	return this.position;
}

LightSource.prototype.setPosition = function (x, y, z, w) {
	this.position[0] = x;
	this.position[1] = y;
	this.position[2] = z;
	this.position[3] = w;
}

LightSource.prototype.getIntensity = function () {

	return this.intensity;
}

LightSource.prototype.setIntensity = function (r, g, b) {
	this.intensity[0] = r;
	this.intensity[1] = g;
	this.intensity[2] = b;
}

LightSource.prototype.getAmbIntensity = function () {
	return this.ambientIntensity;
}

LightSource.prototype.setAmbIntensity = function (r, g, b) {
	this.ambientIntensity[0] = r;
	this.ambientIntensity[1] = g;
	this.ambientIntensity[2] = b;
}


LightSource.prototype.getRotAngleYY = function () {
	return this.rotAngleYY;
}

LightSource.prototype.setRotAngleYY = function (angle) {
	this.rotAngleYY = angle;
}


//----------------------------------------------------------------------------
//
//  Instantiating light sources
//
var lightSources = [];

// Light source 0
lightSources.push(new LightSource());
lightSources[lightSources.length - 1].setPosition(0.0, 5.0, 0.0, 1.0); // para onde esta a apontar as luzes? é preciso mexer nos angulos? 
lightSources[lightSources.length - 1].setIntensity(1.0, 1.0, 1.0); // luz branca
lightSources[lightSources.length - 1].setAmbIntensity(0.2, 0.2, 0.2); // luz branca

// Light source 1
lightSources.push(new LightSource());
lightSources[lightSources.length - 1].setPosition(10.0, 10.0, 10.0, 1.0);
lightSources[lightSources.length - 1].setIntensity(1.0, 1.0, 1.0);
lightSources[lightSources.length - 1].setAmbIntensity(0.2, 0.2, 0.2);
