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
	this.kAmbi = [];//[0.2, 0.2, 0.2];
	this.kDiff = [];//[0.7, 0.7, 0.7];
	this.kSpec = [];//[0.7, 0.7, 0.7];
	this.nPhong = [];//100;

	// Texture
	this.textureCoords = [];
	this.vertexIndices = [];
	this.textureIdx = null;
}

function cubeModel(subdivisionDepth = 2) {
	var cube = new emptyModelFeatures();
	cube.vertices = vertices = [
		// Front face
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,

		// Back face
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,

		// Top face
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,

		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,

		// Right face
		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,

		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0
	];
	cube.textureCoords = [
		// Front face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		// Back face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		// Top face
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,

		// Bottom face
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,

		// Right face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		// Left face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	];
	cube.vertexIndices = cubeVertexIndices = [
		0, 1, 2, 0, 2, 3,    // Front face
		4, 5, 6, 4, 6, 7,    // Back face
		8, 9, 10, 8, 10, 11,  // Top face
		12, 13, 14, 12, 14, 15, // Bottom face
		16, 17, 18, 16, 18, 19, // Right face
		20, 21, 22, 20, 22, 23  // Left face
	];

	var vertices = cube.vertices.slice();
	midPointRefinement(vertices, subdivisionDepth);
	computeVertexNormals(vertices, cube.normals);
	return cube;
}


function sphereModel(lat_bands = 32, long_bands = 32) {
	const radius = 1;
	const lat_step = Math.PI / lat_bands;
	const long_step = 2 * Math.PI / long_bands;
	const num_positions = long_bands * lat_bands * 4;
	const num_indices = long_bands * lat_bands * 6;
	var lat_angle, long_angle;

	var sphere = new emptyModelFeatures();

	sphere.vertices = new Float32Array(num_positions * 3);
	sphere.normals = new Float32Array(num_positions * 3);
	sphere.textureCoords = new Float32Array(num_positions * 2);
	sphere.vertexIndices = new Uint16Array(num_indices);

	var x1, x2, x3, x4,
		y1, y2,
		z1, z2, z3, z4,
		u1, u2,
		v1, v2;
	var i, j;
	var k = 0, l = 0;
	var vi, ti;

	for (i = 0; i < lat_bands; i++) {
		lat_angle = i * lat_step;
		y1 = Math.cos(lat_angle);
		y2 = Math.cos(lat_angle + lat_step);
		for (j = 0; j < long_bands; j++) {
			long_angle = j * long_step;
			x1 = Math.sin(lat_angle) * Math.cos(long_angle);
			x2 = Math.sin(lat_angle) * Math.cos(long_angle + long_step);
			x3 = Math.sin(lat_angle + lat_step) * Math.cos(long_angle);
			x4 = Math.sin(lat_angle + lat_step) * Math.cos(long_angle + long_step);
			z1 = Math.sin(lat_angle) * Math.sin(long_angle);
			z2 = Math.sin(lat_angle) * Math.sin(long_angle + long_step);
			z3 = Math.sin(lat_angle + lat_step) * Math.sin(long_angle);
			z4 = Math.sin(lat_angle + lat_step) * Math.sin(long_angle + long_step);
			u1 = 1 - j / long_bands;
			u2 = 1 - (j + 1) / long_bands;
			v1 = 1 - i / lat_bands;
			v2 = 1 - (i + 1) / lat_bands;
			vi = k * 3;
			ti = k * 2;

			sphere.vertices[vi] = x1 * radius;
			sphere.vertices[vi + 1] = y1 * radius;
			sphere.vertices[vi + 2] = z1 * radius; //v0

			sphere.vertices[vi + 3] = x2 * radius;
			sphere.vertices[vi + 4] = y1 * radius;
			sphere.vertices[vi + 5] = z2 * radius; //v1

			sphere.vertices[vi + 6] = x3 * radius;
			sphere.vertices[vi + 7] = y2 * radius;
			sphere.vertices[vi + 8] = z3 * radius; // v2


			sphere.vertices[vi + 9] = x4 * radius;
			sphere.vertices[vi + 10] = y2 * radius;
			sphere.vertices[vi + 11] = z4 * radius; // v3

			sphere.normals[vi] = x1;
			sphere.normals[vi + 1] = y1;
			sphere.normals[vi + 2] = z1;

			sphere.normals[vi + 3] = x2;
			sphere.normals[vi + 4] = y1;
			sphere.normals[vi + 5] = z2;

			sphere.normals[vi + 6] = x3;
			sphere.normals[vi + 7] = y2;
			sphere.normals[vi + 8] = z3;

			sphere.normals[vi + 9] = x4;
			sphere.normals[vi + 10] = y2;
			sphere.normals[vi + 11] = z4;

			sphere.textureCoords[ti] = u1;
			sphere.textureCoords[ti + 1] = v1;

			sphere.textureCoords[ti + 2] = u2;
			sphere.textureCoords[ti + 3] = v1;

			sphere.textureCoords[ti + 4] = u1;
			sphere.textureCoords[ti + 5] = v2;

			sphere.textureCoords[ti + 6] = u2;
			sphere.textureCoords[ti + 7] = v2;

			sphere.vertexIndices[l] = k;
			sphere.vertexIndices[l + 1] = k + 1;
			sphere.vertexIndices[l + 2] = k + 2;
			sphere.vertexIndices[l + 3] = k + 2;
			sphere.vertexIndices[l + 4] = k + 1;
			sphere.vertexIndices[l + 5] = k + 3;

			k += 4;
			l += 6;
		}
	}

	return sphere;
}

//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];
// KD-Tree, a special tree-like structure that is good at finding the closest point
// it will be used to improve the performance of the colision detection...
var tree = null;

// Indices of player and exit
var idx_player = null, idx_exit = null;

function create_floor(lab) {
	var rows = lab.length, cols = lab[0].length;
	sceneModels.push(cubeModel());
	sceneModels[sceneModels.length - 1].sx = block_scale * cols;
	sceneModels[sceneModels.length - 1].sy = block_scale * rows;
	sceneModels[sceneModels.length - 1].sz = floor_z_scale;
	sceneModels[sceneModels.length - 1].textureIdx = 0;

	sceneModels[sceneModels.length - 1].kAmbi = [[.1, .1, .1], [.1, .1, .1], [.3, 0, 0]];//[0.2, 0.2, 0.2];
	sceneModels[sceneModels.length - 1].kDiff = [[.5, .5, .5], [.5, .5, .5], [.6, 0, 0]];//[0.7, 0.7, 0.7];
	sceneModels[sceneModels.length - 1].kSpec = [[.7, .7, .7], [.7, .7, .7], [.8, .6, .6]];//[0.7, 0.7, 0.7];
	sceneModels[sceneModels.length - 1].nPhong = [1.0, 1.0, 32];//100;
}

function create_exit(lab) {
	var rows = lab.length, cols = lab[0].length;
	abort = false;
	for (var i = 0; i < lab.length && !abort; i++) {
		for (var j = 0; j < lab[i].length && !abort; j++) {
			if (lab[i][j] == '#') {
				sceneModels.push(cubeModel());
				var px = (-block_scale * (cols - 1)) + j * 2 * block_scale,
					py = (-block_scale * (rows - 1)) + i * 2 * block_scale;
				sceneModels[sceneModels.length - 1].tx = px;
				sceneModels[sceneModels.length - 1].ty = py;
				sceneModels[sceneModels.length - 1].tz = exit_scale_z + floor_z_scale;
				sceneModels[sceneModels.length - 1].sx = exit_scale_x;
				sceneModels[sceneModels.length - 1].sy = exit_scale_y;
				sceneModels[sceneModels.length - 1].sz = exit_scale_z;
				sceneModels[sceneModels.length - 1].textureIdx = 3;

				sceneModels[sceneModels.length - 1].kAmbi = [[.0, .0, .5], [.0, .0, .5], [.0, .0, .5]];//[0.2, 0.2, 0.2];
				sceneModels[sceneModels.length - 1].kDiff = [[.0, .0, 1], [.0, .0, 1], [.0, .0, 1]];//[0.7, 0.7, 0.7];
				sceneModels[sceneModels.length - 1].kSpec = [[1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]];//[0.7, 0.7, 0.7];
				sceneModels[sceneModels.length - 1].nPhong = [125, 125, 125];//100;

				// the loop can break
				// only one exit allowed...
				abort = true;
				idx_exit = sceneModels.length - 1;
			}
		}
	}
}

function create_player(lab) {
	var rows = lab.length, cols = lab[0].length;
	abort = false;
	for (var i = 0; i < lab.length && !abort; i++) {
		for (var j = 0; j < lab[i].length && !abort; j++) {
			if (lab[i][j] == '*') {
				sceneModels.push(sphereModel());

				var px = (-block_scale * (cols - 1)) + j * 2 * block_scale,
					py = (-block_scale * (rows - 1)) + i * 2 * block_scale;
				sceneModels[sceneModels.length - 1].tx = px;
				sceneModels[sceneModels.length - 1].ty = py;
				sceneModels[sceneModels.length - 1].tz = player_scale + floor_z_scale;
				sceneModels[sceneModels.length - 1].sx = player_scale;
				sceneModels[sceneModels.length - 1].sy = player_scale;
				sceneModels[sceneModels.length - 1].sz = player_scale;
				sceneModels[sceneModels.length - 1].textureIdx = 2;

				sceneModels[sceneModels.length - 1].kAmbi = [[0.21, 0.13, 0.05], [0.19, 0.07, 0.02], [0.1, 0.1, 0.1]];//[0.2, 0.2, 0.2];
				sceneModels[sceneModels.length - 1].kDiff = [[0.71, 0.43, 0.18], [0.70, 0.27, 0.08], [0.5, 0.5, 0.5]];//[0.7, 0.7, 0.7];
				sceneModels[sceneModels.length - 1].kSpec = [[0.39, 0.27, 0.17], [0.26, 0.14, 0.08], [0.7, 0.7, 0.7]];//[0.7, 0.7, 0.7];
				sceneModels[sceneModels.length - 1].nPhong = [25.6, 12.8, 1.0];//100;

				// the loop can break
				// only one player allowed...
				abort = true;
				idx_player = sceneModels.length - 1;
			}
		}
	}
}


function create_walls(lab) {
	var rows = lab.length, cols = lab[0].length;
	points = []
	for (var i = 0; i < lab.length; i++) {
		for (var j = 0; j < lab[i].length; j++) {
			if (lab[i][j] == 1) {
				// Create a Cube Model
				sceneModels.push(cubeModel());

				// Compute the position and scale of each cube
				var px = (-block_scale * (cols - 1)) + j * 2 * block_scale,
					py = (-block_scale * (rows - 1)) + i * 2 * block_scale;
				sceneModels[sceneModels.length - 1].tx = px;
				sceneModels[sceneModels.length - 1].ty = py;
				sceneModels[sceneModels.length - 1].tz = block_scale + floor_z_scale;

				sceneModels[sceneModels.length - 1].sx = block_scale;
				sceneModels[sceneModels.length - 1].sy = block_scale;
				sceneModels[sceneModels.length - 1].sz = block_scale;
				sceneModels[sceneModels.length - 1].textureIdx = 1;

				sceneModels[sceneModels.length - 1].kAmbi = [[0.30, 0.20, 0.00], [0.00, 0.30, 0.00], [0.1, 0.1, 0.1]];//[0.2, 0.2, 0.2];
				sceneModels[sceneModels.length - 1].kDiff = [[0.60, 0.30, 0.00], [0.00, 0.60, 0.00], [0.5, 0.5, 0.5]];//[0.7, 0.7, 0.7];
				sceneModels[sceneModels.length - 1].kSpec = [[0.80, 0.60, 0.60], [0.60, 0.80, 0.60], [0.7, 0.7, 0.7]];//[0.7, 0.7, 0.7];
				sceneModels[sceneModels.length - 1].nPhong = [32.0, 32.0, 1.0];//100;

				// Load and create the texture
				//sceneModels[sceneModels.length - 1].webGLTexture = load_texture('resources/bricks.jpg');

				// Add point to kD-Tree
				points.push({ x: px, y: py })
			}
		}
	}

	tree = new kdTree(points, function (a, b) { return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2); }, ["x", "y"]);
}