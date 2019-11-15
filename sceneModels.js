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

function simpleCubeModel() {
	
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

function create_floor(tx, ty, tz, sx, sy, sz, rx, ry, rz){
    sceneModels.push(new simpleCubeModel());

    sceneModels[sceneModels.length - 1].tx = tx; 
    sceneModels[sceneModels.length - 1].ty = ty;

    sceneModels[sceneModels.length - 1].sx = sx;
    sceneModels[sceneModels.length - 1].sy = sy;
	sceneModels[sceneModels.length - 1].sz = sz;

}

// criar varios cubos e chama los: assim aplicam-se sempre as mesmas transformações 
function create_walls(tx, ty, tz, sx, sy, sz, rx, ry, rz){
    sceneModels.push(new simpleCubeModel());

    sceneModels[1].tx = tx; 
    sceneModels[1].ty = ty;

    sceneModels[1].sx = sx;
    sceneModels[1].sy = sy;
	sceneModels[1].sz = sz;
}


function create_sphere(){
    sceneModels.push(new sphereModel(3));

    sceneModels[2].sx = sx;
    sceneModels[2].sy = sy;
    sceneModels[2].sz = sz;
}

// as rotaçoes tem que ser globais para todos
// model é uma cena generica: depois o for no drawmodel percorre o array generico e desenha

