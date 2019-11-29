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

	// Texture
	this.textureCoords = [];
	this.vertexIndices = [];
	this.textureIdx = null;
}

function cubeModel(subdivisionDepth = 0) {
	var cube = new emptyModelFeatures();
	cube.vertices = [
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
	midPointRefinement(cube.vertices, subdivisionDepth);
	computeVertexNormals(cube.vertices, cube.normals);
	return cube;
}

function sphereModel(latBands = 24, longSegs = 45) {
	var sphere = new emptyModelFeatures();
	//var vertices = [], normals = [], texCoords = [], indices = [];

	for (var lat = 0; lat <= latBands; ++lat) {
		const v = lat / latBands; // also used as the vertical texture coordinate
		const theta = v * Math.PI;    // 0 <= theta <= pi

		const y = Math.cos(theta);   // y = cos(theta) - constant per latitude "slice"
		const st = Math.sin(theta);   // this will det. the radius of the latitude line

		for (var lng = 0; lng <= longSegs; ++lng) {
			const u = lng / longSegs; // also used as the horizontal texture coordinate
			const phi = (lng / longSegs) * 2.0 * Math.PI; // 0 <= phi <= 2 * pi

			const x = st * Math.cos(phi); // x = sin(theta) * cos(phi)
			const z = st * Math.sin(phi); // z = sin(theta) * sin(phi)

			sphere.vertices.push(x, y, z);
			sphere.textureCoords.push(u, v);
			var n = normalize(vec3(x, y, z));
			sphere.normals.push(n[0], n[1], n[2]);
		}
	}

	// for each "patch" of the sphere surface
	var crtLine = 0, nextLine = longSegs + 1;
	for (var lat = 0; lat < latBands; ++lat) {
		for (var lng = 0; lng < longSegs; ++lng) {
			const first = crtLine + lng, second = nextLine + lng;

			// watch out for degenerate triangles
			if (lat > 0) {
				// vertex indices for the first triangle of the patch
				sphere.vertexIndices.push(first);
				sphere.vertexIndices.push(second);
				sphere.vertexIndices.push(first + 1);
			}

			// watch out for degenerate triangles
			if (lat + 1 < latBands) {
				// same for the second triangle
				sphere.vertexIndices.push(second);
				sphere.vertexIndices.push(second + 1);
				sphere.vertexIndices.push(first + 1);
			}
		}
		crtLine = nextLine; nextLine += longSegs + 1;
	}
	//computeVertexNormals(sphere.vertices, sphere.normals);
	//console.log('Normals = '+sphere.normals);
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

// Indices of player and exit
var idx_player = null, idx_exit = null;

function create_floor(lab) {
	var rows = lab.length, cols = lab[0].length;
	sceneModels.push(cubeModel());
	sceneModels[sceneModels.length - 1].sx = block_scale * cols;
	sceneModels[sceneModels.length - 1].sy = block_scale * rows;
	sceneModels[sceneModels.length - 1].sz = floor_z_scale;
	sceneModels[sceneModels.length - 1].textureIdx = 0;
}

function create_exit(lab) {
	var rows = lab.length, cols = lab[0].length;
	abort = false;
	for (var i = 0; i < lab.length && !abort; i++) {
		for (var j = 0; j < lab[i].length && !abort; j++) {
			if (lab[i][j] == '#') {
				sceneModels.push(cubeModel());
				//sceneModels.push(cubeModel());
				var px = (-block_scale * (cols - 1)) + j * 2 * block_scale,
					py = (-block_scale * (rows - 1)) + i * 2 * block_scale;
				sceneModels[sceneModels.length - 1].tx = px;
				sceneModels[sceneModels.length - 1].ty = py;
				sceneModels[sceneModels.length - 1].tz = exit_scale_z + floor_z_scale;
				sceneModels[sceneModels.length - 1].sx = exit_scale_x;
				sceneModels[sceneModels.length - 1].sy = exit_scale_y;
				sceneModels[sceneModels.length - 1].sz = exit_scale_z;
				sceneModels[sceneModels.length - 1].textureIdx = 3;

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
				//sceneModels.push(cubeModel());
				var px = (-block_scale * (cols - 1)) + j * 2 * block_scale,
					py = (-block_scale * (rows - 1)) + i * 2 * block_scale;
				sceneModels[sceneModels.length - 1].tx = px;
				sceneModels[sceneModels.length - 1].ty = py;
				sceneModels[sceneModels.length - 1].tz = player_scale + floor_z_scale;
				sceneModels[sceneModels.length - 1].sx = player_scale;
				sceneModels[sceneModels.length - 1].sy = player_scale;
				sceneModels[sceneModels.length - 1].sz = player_scale;
				sceneModels[sceneModels.length - 1].textureIdx = 2;

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

				// Load and create the texture
				//sceneModels[sceneModels.length - 1].webGLTexture = load_texture('resources/bricks.jpg');

				// Add point to kD-Tree
				points.push({ x: px, y: py })
			}
		}
	}

	tree = new kdTree(points, function (a, b) { return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2); }, ["x", "y"]);
}