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
// KD-Tree, a special tree-like structure that is good at finding the closest point
// it will be used to improve the performance of the colision detection...
var tree = null

function create_floor(lab) {
	var rows = lab.length, cols = lab[0].length;
	sceneModels.push(cubeModel());
	sceneModels[sceneModels.length - 1].sx = block_scale * cols;
	sceneModels[sceneModels.length - 1].sy = block_scale * rows;
	sceneModels[sceneModels.length - 1].sz = floor_z_scale;
}

function create_player(lab) {
	var rows = lab.length, cols = lab[0].length;
	abort = false;
	for (var i = 0; i < lab.length && !abort; i++) {
		for (var j = 0; j < lab[i].length && !abort; j++) {
			if (lab[i][j] == '*') {
				sceneModels.push(sphereModel(3));
				//sceneModels.push(cubeModel());
				var px = (-block_scale * (cols - 1)) + j * 2 * block_scale,
					py = (-block_scale * (rows - 1)) + i * 2 * block_scale;
				sceneModels[sceneModels.length - 1].tx = px;
				sceneModels[sceneModels.length - 1].ty = py;
				sceneModels[sceneModels.length - 1].tz = player_scale + floor_z_scale;

				sceneModels[sceneModels.length - 1].sx = player_scale;
				sceneModels[sceneModels.length - 1].sy = player_scale;
				sceneModels[sceneModels.length - 1].sz = player_scale;

				// the loop can break
				// only one player allowed...
				abort = true;
			}
		}
	}
}

var distance = function (a, b) {
	return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
}

function create_walls(lab) {
	var rows = lab.length, cols = lab[0].length;
	points = []
	for (var i = 0; i < lab.length; i++) {
		for (var j = 0; j < lab[i].length; j++) {
			if (lab[i][j] == 1) {
				sceneModels.push(cubeModel());
				var px = (-block_scale * (cols - 1)) + j * 2 * block_scale,
					py = (-block_scale * (rows - 1)) + i * 2 * block_scale;
				sceneModels[sceneModels.length - 1].tx = px;
				sceneModels[sceneModels.length - 1].ty = py;
				sceneModels[sceneModels.length - 1].tz = block_scale + floor_z_scale;

				sceneModels[sceneModels.length - 1].sx = block_scale;
				sceneModels[sceneModels.length - 1].sy = block_scale;
				sceneModels[sceneModels.length - 1].sz = block_scale;

				points.push({ x: px, y: py })
			}
		}
	}

	tree = new kdTree(points, distance, ["x", "y"]);
}