//////////////////////////////////////////////////////////////////////////////
//	Catarina Silva
// 	c.alexandracorreia@ua.pt
//////////////////////////////////////////////////////////////////////////////


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

	// Material features

	this.kAmbi = [0.2, 0.2, 0.2];

	this.kDiff = [0.7, 0.7, 0.7];

	this.kSpec = [0.7, 0.7, 0.7];

	this.nPhong = 100;
}

function singleTriangleModel() {

	var triangle = new emptyModelFeatures();

	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE

		-0.5, -0.5, 0.5,

		0.5, -0.5, 0.5,

		0.5, 0.5, 0.5,
	];

	triangle.normals = [

		// FRONTAL TRIANGLE

		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
	];

	return triangle;
}


function simpleCubeModel() {

	var cube = new emptyModelFeatures();

	cube.vertices = [

		-1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		-1.000000, 1.000000, 1.000000,
		-1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,
		1.000000, -1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		1.000000, 1.000000, 1.000000,
		-1.000000, -1.000000, -1.000000,
		-1.000000, 1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,
		-1.000000, -1.000000, -1.000000,
		1.000000, 1.000000, -1.000000,
		1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		-1.000000, 1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		-1.000000, 1.000000, 1.000000,
		-1.000000, 1.000000, -1.000000,
		-1.000000, 1.000000, -1.000000,
		-1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		-1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, 1.000000,
		1.000000, 1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		-1.000000, -1.000000, -1.000000,
		1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000, 1.000000,
		1.000000, -1.000000, -1.000000,
		1.000000, -1.000000, 1.000000,
	];

	computeVertexNormals(cube.vertices, cube.normals);

	return cube;
}


function cubeModel(subdivisionDepth = 0) {
	var cube = new simpleCubeModel();
	midPointRefinement(cube.vertices, subdivisionDepth);
	computeVertexNormals(cube.vertices, cube.normals);
	return cube;
}


function simpleTetrahedronModel() {
	var tetra = new emptyModelFeatures();
	tetra.vertices = [
		-1.000000, 0.000000, -0.707000,
		0.000000, 1.000000, 0.707000,
		1.000000, 0.000000, -0.707000,
		1.000000, 0.000000, -0.707000,
		0.000000, 1.000000, 0.707000,
		0.000000, -1.000000, 0.707000,
		-1.000000, 0.000000, -0.707000,
		0.000000, -1.000000, 0.707000,
		0.000000, 1.000000, 0.707000,
		-1.000000, 0.000000, -0.707000,
		1.000000, 0.000000, -0.707000,
		0.000000, -1.000000, 0.707000,
	];
	computeVertexNormals(tetra.vertices, tetra.normals);

	return tetra;
}


function tetrahedronModel(subdivisionDepth = 0) {

	var tetra = new simpleTetrahedronModel();

	midPointRefinement(tetra.vertices, subdivisionDepth);

	computeVertexNormals(tetra.vertices, tetra.normals);

	return tetra;
}


function sphereModel(subdivisionDepth = 2) {
	var sphere = new simpleCubeModel();
	midPointRefinement(sphere.vertices, subdivisionDepth);
	moveToSphericalSurface(sphere.vertices)
	computeVertexNormals(sphere.vertices, sphere.normals);
	return sphere;
}


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

function create_floor(lab) {
	var rows = lab.length, cols = lab[0].length;
	sceneModels.push(cubeModel());
	sceneModels[sceneModels.length - 1].sx = 0.1 * cols;
	sceneModels[sceneModels.length - 1].sy = 0.1 * rows;
	sceneModels[sceneModels.length - 1].sz = floor_z_scale;
}

function create_player(lab) {
	var rows = lab.length, cols = lab[0].length;
	for (var i = 0; i < lab.length; i++) {
		for (var j = 0; j < lab[i].length; j++) {
			if (lab[i][j] == '*') {
				sceneModels.push(sphereModel(3));
				sceneModels[sceneModels.length - 1].tx = (-player_scale * (cols -1)) + j * 2*player_scale;
				sceneModels[sceneModels.length - 1].ty = (-player_scale * (rows - 1)) + i * 2*player_scale;
				sceneModels[sceneModels.length - 1].tz = floor_z_scale;

				sceneModels[sceneModels.length - 1].sx = player_scale;
				sceneModels[sceneModels.length - 1].sy = player_scale;
				sceneModels[sceneModels.length - 1].sz = player_scale;
			}
		}
	}

}

function create_walls(lab) {
	var rows = lab.length, cols = lab[0].length;
	for (var i = 0; i < lab.length; i++) {
		for (var j = 0; j < lab[i].length; j++) {
			if (lab[i][j] == 1) {
				sceneModels.push(cubeModel());
				sceneModels[sceneModels.length - 1].tx = (-0.1 * (cols -1)) + j * .2;
				sceneModels[sceneModels.length - 1].ty = (-0.1 * (rows - 1)) + i * .2;
				sceneModels[sceneModels.length - 1].tz = 0.1;

				sceneModels[sceneModels.length - 1].sx = 0.1;
				sceneModels[sceneModels.length - 1].sy = 0.1;
				sceneModels[sceneModels.length - 1].sz = 0.1;
			}
		}
	}

}