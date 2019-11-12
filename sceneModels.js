// For instantiating the scene models.

function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	// Transformation parameters

	// Displacement vector
	
	this.tx = 0.0;
	
	this.ty = 0.0;
	
	this.tz = 0.0;	
	
	// Rotation angles	
	
	this.rotAngleXX = 0.0;
	
	this.rotAngleYY = 0.0;
	
	this.rotAngleZZ = 0.0;	

	// Scaling factors
	
	this.sx = 1.0;
	
	this.sy = 1.0;
	
	this.sz = 1.0;		
	
	// Animation controls
	
	this.rotXXOn = true;
	
	this.rotYYOn = true;
	
	this.rotZZOn = true;
	
	this.rotXXSpeed = 1.0;
	
	this.rotYYSpeed = 1.0;
	
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	
	this.rotYYDir = 1;
	
	this.rotZZDir = 1;
	
	
}

unction simpleCubeModel() {
	
	var cube = new emptyModelFeatures();
    
    //vai ao ficheiro utils para obter as coordenadas dos vertices do cubo
	cube.vertices = model_cube();

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


function cubeModel( subdivisionDepth = 0 ) {
	
	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, subdivisionDepth );
	
	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}

function sphereModel( subdivisionDepth = 2 ) {
	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices )
	
	computeVertexNormals( sphere.vertices, sphere.normals );
	
	return sphere;
}


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

//global variable
var sceneModels = [];

function create_cube(tx, ty, sx, sy, sz){
    sceneModels.push(new simpleCubeModel());

    sceneModels[0].tx = tx; 
    sceneModels[0].ty = ty;

    sceneModels[0].sx = sx;
    sceneModels[0].sy = sy;
    sceneModels[0].sz = sz;
}


function create_sphere(){
    sceneModels.push(new sphereModel(3));

    sceneModels[1].sx = sx;
    sceneModels[1].sy = sy;
    sceneModels[1].sz = sz;
}



