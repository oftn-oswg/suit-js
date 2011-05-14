var Path = require("path");
var File = require("fs");

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
			self.calculate_deps(json);
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
		process.stderr.write("\033[31;1m"+arguments[i]+"\033[0m\n");
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
	
	var self = this;
	this.build_order = L.map(function(n) {
		return Path.join(self.build_directory, n+".js");
	});
	
	this.preprocess_files();
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
	
	this.log_error.apply(this, errors);
};

Maker.prototype.preprocess_files = function() {
	this.combine_files();
};

Maker.prototype.combine_files = function() {
	var build = File.openSync(Path.join(__dirname, "suit-uncompressed.js"), "w");
	for (var i = 0, len = this.build_order.length; i < len; i++) {
		this.log_info("Writing "+this.build_order[i]+" to build file...");
		var buffer = File.readFileSync(this.build_order[i])
		File.writeSync(build, buffer, 0, buffer.length);
	}
	File.closeSync(build);
	this.log_info("Done!");
};

(new Maker()).init();
