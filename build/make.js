#!/usr/bin/env node

var Path = require("path");
var File = require("fs");

function error(str) {
	return "\033[31;1m"+str+"\033[0m";
}

function filename(str) {
	return "\033[32;1m"+str+"\033[0m";
}

function dependency(str) {
	return "\033[33;1m"+str+"\033[0m";
}

try {
	var Uglify = require("uglify-js");
} catch (e) {
	process.stdout.write(error("UglifyJS not found. Not compressing.")+"\n");
}

var Maker = function() {
	this.build_directory = Path.join(__dirname, "../javascript/");
	this.dependency_file = Path.join(this.build_directory, "__dependencies__.json");
};

Maker.prototype.init = function() {
	this.log_info("Starting new build...");
	var self = this;
	File.readFile(this.dependency_file, function(err, data) {
		if (err) {
			self.log_error(err);
			return;
		}
		var json;
		try {
			json = JSON.parse(data);
			self.dependency_data = json;
			self.begin();
		} catch (e) {
			self.log_error("There was an error parsing the dependencies file: ", e);
		}
	});
};

Maker.prototype.log_info = function() {
	for (var i = 0, len = arguments.length; i < len; i++) {
		process.stdout.write(arguments[i]+"\n");
	}
};

Maker.prototype.log_error = function() {
	for (var i = 0, len = arguments.length; i < len; i++) {
		process.stderr.write(error(arguments[i])+"\n");
	}
};

Maker.prototype.begin = function() {
	try {
		this.calculate_deps(this.dependency_data);
		this.read_files();
		this.preprocess_files();
		this.compress_files();
		this.log_info("Done!");
	} catch(e) {
		if (Array.isArray(e)) {
			this.log_error.apply(this, e);
		} else {
			this.log_error(e);
		}
	}
};

Maker.prototype.calculate_deps = function(obj) {
	var L = [];
	var S = []; // elements with no dependencies
	var T = []; // elements with dependencies
	
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) {
			var v = obj[k];
			if (v === false) {
				S.push(k); // no dependencies
			} else {
				if (typeof v === "string")
					obj[k] = [v];
				T.push(k); // has dependencies
			}
		}
	}
	
	while (S.length) {
		var n = S.pop();
		L.push(n);
		for (var mi = 0; mi < T.length; mi++) {
			var m = T[mi];
			var i;
			if (~(i = obj[m].indexOf(n))) {
				obj[m].splice(i, 1);
			}
			if (!obj[m].length) {
				T.splice(mi, 1); mi--;
				S.push(m);
			}
		}
	}
	
	if (T.length) {
		this.log_error("There was an error sorting the dependencies.");
		this.scan_dependencies_error(obj);
		return;
	}
	
	for (var i = 1, len = L.length; i <= len; i++) {
		this.log_info((i<10?"  ":" ")+i+") "+dependency(L[i-1])+".js");
	}
	
	var dir = this.build_directory;
	this.build_order = L.map(function(n) {
		return Path.join(dir, n+".js");
	});
};

Maker.prototype.scan_dependencies_error = function(obj) {
	var errors = [];
	var unknown = [];
	var itemwodep = false;
	for (var file in obj) {
		if (obj.hasOwnProperty(file)) {
			var deps = obj[file];
			if (deps === false) { itemwodep = true; }
			else {
				for (var i = 0, len = deps.length; i < len; i++) {
					if (typeof obj[deps[i]] === "undefined") {
						unknown.push({item: deps[i], found: file});
					}
				}
			}
		}
	}
	
	if (!itemwodep) {
		errors.push(" * There must be at least one file without any dependencies.");
	}
	for (var i = 0, len = unknown.length; i < len; i++) {
		errors.push(" * Item '"+unknown[i].found+"' depends on unknown dependency '"+unknown[i].item+"'.");
	}
	
	throw errors;
};

Maker.prototype.read_files = function() {
	this.buffer = [];
	for (var i = 0, len = this.build_order.length; i < len; i++) {
		this.buffer.push(File.readFileSync(this.build_order[i], "utf-8"));
	}
};

Maker.prototype.preprocess_files = function() {};

Maker.prototype.compress_files = function() {

	this.log_info("Now writing package to disk...");
	
	var combined = this.buffer.join("\n");

	var output_file = Path.join(__dirname, "suit.js");
	this.log_info("Creating "+filename(output_file)+"...");
	File.writeFileSync(output_file, combined);
		
	if (typeof Uglify !== "undefined") {
		var jsp = Uglify.parser;
		var pro = Uglify.uglify;

		var orig_code = combined;
		var ast = jsp.parse(orig_code); // parse code and get the initial AST
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		var final_code = pro.gen_code(ast); // compressed code here
	
		var output_file = Path.join(__dirname, "suit-min.js");
		this.log_info("Creating "+filename(output_file)+"...");
		File.writeFileSync(output_file, final_code);
		
	}
};

(new Maker()).init();
