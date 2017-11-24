function traverseArray(prev, cur, key) {
	let res = [];
	for (let i = prev.length; i < cur.length; i++) {
		res.push(cur[i]);
	}
	return res;
}

function deepClone(obj) {
	let res = {};
	Object.keys(obj).forEach((item) => {
		if (Array.isArray(obj[item])) {
			res[item] = [];
			obj[item].forEach((k) => res[item].push(k))
		} else {
			res[item] = Object.assign(obj[item])
		}
	})
	return res;
}

class WebpackRunOncePlugin {
	constructor(pluginList) {
		this.isRunned = false;
		this.pluginList = pluginList;
		this.additionalEnv = {};
	}

	apply(compiler) {
		compiler.plugin('environment', function environmentEvent(compilation, callback) {
			//this event only execute once
			if (!this.isRunned) {
				this.pluginList.forEach(item => {
					let {plugin, option} = item;
					item.additionalEnv = {};
					let before,
						after;
					//preserve compiler plugins status both before and after
					before = deepClone(compiler._plugins);
					compiler.apply.apply(compiler, [new plugin(option)]);
					after = deepClone(compiler._plugins);

					//record newly installed plugins
					Object.keys(after).forEach((key) => {
						if (!before.hasOwnProperty(key)) {
							item.additionalEnv[key] = traverseArray([], after[key]);
						} else {
							item.additionalEnv[key] = traverseArray(
								item.additionalEnv[key]
								? item.additionalEnv[key]
								: before[key],
							after[key],
							key);
						}
					})
				})
			}
		}.bind(this))
		compiler.plugin('after-emit', function afterCompileEvent(compilation, cb) {
			if (!this.isRunned) {
				this.isRunned = true;
				let compilerPlugins = compiler._plugins;
				//clear all the newly installed plugins after the first run
				this.pluginList.forEach(item => {
					let plugins = item.additionalEnv;
					Object.keys(plugins).forEach((key) => {
						if (plugins[key].length) {
							let comp = compilerPlugins[key];
							for (let fn of plugins[key]) {
								var pos = comp.indexOf(fn);
								if (pos != -1)
									comp.splice(pos, 1);
								}
							}
					})
				})
			}
			cb();

		}.bind(this))
	}
}

module.exports = WebpackRunOncePlugin;
