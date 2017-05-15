/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c0bd40b3d66c9d8321c4"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/component/src/component.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (immutable) */ __webpack_exports__[\"a\"] = createComponent;\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(\"./node_modules/component/src/util.js\");\n\n\nconst { isString, isObject } = __WEBPACK_IMPORTED_MODULE_0__util__[\"a\" /* default */];\n\n/**\n * Resolves el for component.\n * If passed string, it looking for element throw querySelector.\n * If passed Element, it just returns it.\n * If passed null, it creates new element div.\n *\n * @function resolveEl\n * @param {String|Element|Null} el - the element container for component.\n * @returns {Element} - element container\n */\nfunction resolveEl(el) {\n  if (isString(el)) {\n    return document.querySelector(el);\n  } else if (isObject(el)) {\n    return el;\n  }\n\n  return document.createElement('div');\n}\n\n/**\n * Parses event binding map like this:\n * {\n *   'click button': 'onClick'\n * }\n * into:\n * [{\n *   'event': 'click',\n *   'selector': 'button',\n *   'method': 'onClick',\n * }]\n *\n * @function parseEventBindingMap\n * @param {Object} eventBindingMap\n */\nfunction parseEventBindingMap(eventBindingMap) {\n  return Object.keys(eventBindingMap).map((k) => {\n    const method = eventBindingMap[k];\n    const [event, selector] = k.split(' ');\n    return { event, selector, method };\n  });\n}\n\n/**\n * Attaches event handler to el and litens for event of given type.\n * On each event, if event target satisfies to given selector, calls cb.\n *\n * @function attachEvent\n * @param {Element} el\n * @param {String} eventType\n * @param {String} selector\n * @param {Function} cb\n */\nfunction attachEvent(el, eventType, selector, cb) {\n  el.addEventListener(eventType, (event) => {\n    if (event.target === el.querySelector(selector)) {\n      cb(event);\n    }\n  });\n}\n\n/**\n * Binds event handlers to el.\n * Uses array that returned from parseEventBindingMap.\n *\n * @function bindEventHandlers\n * @param {Element} el\n * @param {Object} eventBindingMap\n * @param {Object} methods\n * @param {Object} context\n */\nfunction bindEventHandlers(el, eventBindingMap, methods, context) {\n  if (!el || !eventBindingMap || !methods) {\n    throw new Error('el and eventBindingMap are required');\n  }\n\n  const events = parseEventBindingMap(eventBindingMap);\n  events.forEach(({ event, selector, method }) => {\n    attachEvent(el, event, selector, methods[method].bind(context));\n  });\n}\n\n/**\n * Creates component constructor.\n * Takes care of event binding of the following format:\n * {\n *   'clicl button': 'onClick',\n * }\n * Component has one lifecycle method initialize. It is called during component creation.\n *\n * @function createComponent\n * @param {Object} config\n * @returns {Function} component constructor\n */\nfunction createComponent(config) {\n  if (!config) {\n    throw new Error('config must be provided');\n  }\n\n  function ComponentConstructor(options = {}) {\n    const { el } = options;\n    this.el = resolveEl(el);\n\n    if (config.events) {\n      bindEventHandlers(this.el, config.events, config, this);\n    }\n\n    if (config.initialize) {\n      config.initialize.apply(this, [Object.assign({}, options)]);\n    }\n  }\n  ComponentConstructor.prototype = config;\n\n  return ComponentConstructor;\n}\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/component/src/component.js\n// module id = ./node_modules/component/src/component.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./~/component/src/component.js?");

/***/ }),

/***/ "./node_modules/component/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__component__ = __webpack_require__(\"./node_modules/component/src/component.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__WEBPACK_IMPORTED_MODULE_0__component__[\"a\" /* default */]);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/component/src/index.js\n// module id = ./node_modules/component/src/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./~/component/src/index.js?");

/***/ }),

/***/ "./node_modules/component/src/util.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("function isString(x) {\n  return typeof x === 'string' || x instanceof String;\n}\n\nfunction isObject(x) {\n  return x !== null && typeof x === 'object';\n}\n\n/* harmony default export */ __webpack_exports__[\"a\"] = ({\n  isString,\n  isObject,\n});\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/component/src/util.js\n// module id = ./node_modules/component/src/util.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./~/component/src/util.js?");

/***/ }),

/***/ "./src/actions/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_npm_mock__ = __webpack_require__(\"./src/api/npm-mock.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core__ = __webpack_require__(\"./src/core.js\");\n\n\n\nfunction showLoadAction() {\n  __WEBPACK_IMPORTED_MODULE_1__core__[\"a\" /* default */].store.changeState(function (state) {\n    return Object.assign({}, state, {\n      loading: true\n    });\n  });\n}\n\nfunction hideLoadAction() {\n  __WEBPACK_IMPORTED_MODULE_1__core__[\"a\" /* default */].store.changeState(function (state) {\n    return Object.assign({}, state, {\n      loading: false\n    });\n  });\n}\n\nfunction clearPackageName() {\n  __WEBPACK_IMPORTED_MODULE_1__core__[\"a\" /* default */].store.changeState(function (state) {\n    return Object.assign({}, state, {\n      packageName: ''\n    });\n  });\n}\n\nfunction searchAction(query) {\n  showLoadAction();\n  clearPackageName();\n  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__api_npm_mock__[\"a\" /* default */])(query).then(function (isAvailable) {\n    hideLoadAction();\n    __WEBPACK_IMPORTED_MODULE_1__core__[\"a\" /* default */].store.changeState(function (state) {\n      return Object.assign({}, state, {\n        packageName: query,\n        isAvailable: isAvailable\n      });\n    });\n  }).catch(function () {\n    hideLoadAction();\n  });\n}\n\n/* harmony default export */ __webpack_exports__[\"a\"] = ({\n  searchAction: searchAction,\n  showLoadAction: showLoadAction,\n  hideLoadAction: hideLoadAction\n});\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/actions/index.js\n// module id = ./src/actions/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/actions/index.js?");

/***/ }),

/***/ "./src/api/npm-mock.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (immutable) */ __webpack_exports__[\"a\"] = checkName;\nfunction checkName() {\n  return new Promise(function (resolve) {\n    setTimeout(function () {\n      resolve(true);\n    }, 1000);\n  });\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/api/npm-mock.js\n// module id = ./src/api/npm-mock.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/api/npm-mock.js?");

/***/ }),

/***/ "./src/components/App/App.css":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\nmodule.exports = {\"app\":\"src-components-App-App__app--2oExz\",\"app__header\":\"src-components-App-App__app__header--20tsH\",\"app__content\":\"src-components-App-App__app__content--2wMKS\",\"app__footer\":\"src-components-App-App__app__footer--v-tCB\"};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/App/App.css\n// module id = ./src/components/App/App.css\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/App/App.css?");

/***/ }),

/***/ "./src/components/App/App.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component__ = __webpack_require__(\"./node_modules/component/src/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Header__ = __webpack_require__(\"./src/components/Header/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Content__ = __webpack_require__(\"./src/components/Content/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Footer__ = __webpack_require__(\"./src/components/Footer/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__App_css__ = __webpack_require__(\"./src/components/App/App.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__App_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__App_css__);\n\n\n\n\n\n\nvar App = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_component__[\"a\" /* default */])({\n  initialize: function initialize() {\n    this.render();\n    this.afterRender();\n  },\n  render: function render() {\n    this.el.innerHTML = '\\n      <div class=\"' + __WEBPACK_IMPORTED_MODULE_4__App_css___default.a.app + '\">\\n        <header class=\"' + __WEBPACK_IMPORTED_MODULE_4__App_css___default.a.app__header + '\">\\n        </header>\\n\\n        <section class=\"' + __WEBPACK_IMPORTED_MODULE_4__App_css___default.a.app__content + '\">\\n        </section>\\n\\n        <footer class=\"' + __WEBPACK_IMPORTED_MODULE_4__App_css___default.a.app__footer + '\">\\n        </footer>\\n      </div>\\n    ';\n  },\n  afterRender: function afterRender() {\n    this.header = new __WEBPACK_IMPORTED_MODULE_1__Header__[\"a\" /* default */]({\n      el: '.' + __WEBPACK_IMPORTED_MODULE_4__App_css___default.a.app__header\n    });\n\n    this.content = new __WEBPACK_IMPORTED_MODULE_2__Content__[\"a\" /* default */]({\n      el: '.' + __WEBPACK_IMPORTED_MODULE_4__App_css___default.a.app__content\n    });\n\n    this.footer = new __WEBPACK_IMPORTED_MODULE_3__Footer__[\"a\" /* default */]({\n      el: '.' + __WEBPACK_IMPORTED_MODULE_4__App_css___default.a.app__footer\n    });\n  }\n});\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (App);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/App/App.js\n// module id = ./src/components/App/App.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/App/App.js?");

/***/ }),

/***/ "./src/components/App/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App__ = __webpack_require__(\"./src/components/App/App.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__WEBPACK_IMPORTED_MODULE_0__App__[\"a\" /* default */]);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/App/index.js\n// module id = ./src/components/App/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/App/index.js?");

/***/ }),

/***/ "./src/components/Content/Content.css":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\nmodule.exports = {\"container\":\"src-components-Content-Content__container--2L5AD\",\"content\":\"src-components-Content-Content__content--RXvNG\",\"title\":\"src-components-Content-Content__title--3H_4U\",\"title__slogan\":\"src-components-Content-Content__title__slogan--1S3yq\",\"title__domain\":\"src-components-Content-Content__title__domain--2Ay6n\"};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Content/Content.css\n// module id = ./src/components/Content/Content.css\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Content/Content.css?");

/***/ }),

/***/ "./src/components/Content/Content.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component__ = __webpack_require__(\"./node_modules/component/src/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Search__ = __webpack_require__(\"./src/components/Search/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Result__ = __webpack_require__(\"./src/components/Result/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Content_css__ = __webpack_require__(\"./src/components/Content/Content.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Content_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Content_css__);\n\n\n\n\n\nvar Content = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_component__[\"a\" /* default */])({\n  initialize: function initialize() {\n    this.render();\n    this.afterRender();\n  },\n  render: function render() {\n    this.el.innerHTML = '\\n      <div class=\"' + __WEBPACK_IMPORTED_MODULE_3__Content_css___default.a.content + ' ' + __WEBPACK_IMPORTED_MODULE_3__Content_css___default.a.container + '\">\\n        <div class=\"' + __WEBPACK_IMPORTED_MODULE_3__Content_css___default.a.title + '\">\\n          <h1 class=\"' + __WEBPACK_IMPORTED_MODULE_3__Content_css___default.a.title__slogan + '\">\\n            <span class=\"' + __WEBPACK_IMPORTED_MODULE_3__Content_css___default.a.title__domain + '\">\\n              NPM-CHECK-NAME \\n            </span>\\n            check if npm name available in npm-registry.\\n          </h1>\\n        </div>\\n        <div class=\"content__search\"></div> \\n        <div class=\"content__result\"></div>\\n      </div>\\n    ';\n  },\n  afterRender: function afterRender() {\n    this.search = new __WEBPACK_IMPORTED_MODULE_1__Search__[\"a\" /* default */]({\n      el: '.content__search'\n    });\n\n    this.result = new __WEBPACK_IMPORTED_MODULE_2__Result__[\"a\" /* default */]({\n      el: '.content__result'\n    });\n  }\n});\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Content);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Content/Content.js\n// module id = ./src/components/Content/Content.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Content/Content.js?");

/***/ }),

/***/ "./src/components/Content/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Content__ = __webpack_require__(\"./src/components/Content/Content.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__WEBPACK_IMPORTED_MODULE_0__Content__[\"a\" /* default */]);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Content/index.js\n// module id = ./src/components/Content/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Content/index.js?");

/***/ }),

/***/ "./src/components/Footer/Footer.css":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\nmodule.exports = {\"footer\":\"src-components-Footer-Footer__footer--2dyxG\",\"footer__inner\":\"src-components-Footer-Footer__footer__inner--3a30u\",\"footer__text\":\"src-components-Footer-Footer__footer__text--3_5Am\"};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Footer/Footer.css\n// module id = ./src/components/Footer/Footer.css\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Footer/Footer.css?");

/***/ }),

/***/ "./src/components/Footer/Footer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component__ = __webpack_require__(\"./node_modules/component/src/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Footer_css__ = __webpack_require__(\"./src/components/Footer/Footer.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Footer_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Footer_css__);\n\n\n\nvar Footer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_component__[\"a\" /* default */])({\n  initialize: function initialize() {\n    this.render();\n  },\n  render: function render() {\n    this.el.innerHTML = '\\n      <footer class=\"' + __WEBPACK_IMPORTED_MODULE_1__Footer_css___default.a.footer + '\">\\n        <div class=\"' + __WEBPACK_IMPORTED_MODULE_1__Footer_css___default.a.footer__inner + ' ' + __WEBPACK_IMPORTED_MODULE_1__Footer_css___default.a.container + '\">\\n          <p class=\"' + __WEBPACK_IMPORTED_MODULE_1__Footer_css___default.a.footer__text + '\">\\n            <span>coded with &#9829; by </span>\\n            <a href=\"#\">@Atsman</a> & <a href=\"#\">@ok2ju</a>\\n          </p>\\n        </div>\\n      </footer>\\n    ';\n  }\n});\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Footer);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Footer/Footer.js\n// module id = ./src/components/Footer/Footer.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Footer/Footer.js?");

/***/ }),

/***/ "./src/components/Footer/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Footer__ = __webpack_require__(\"./src/components/Footer/Footer.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__WEBPACK_IMPORTED_MODULE_0__Footer__[\"a\" /* default */]);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Footer/index.js\n// module id = ./src/components/Footer/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Footer/index.js?");

/***/ }),

/***/ "./src/components/Header/Header.css":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\nmodule.exports = {\"container\":\"src-components-Header-Header__container--qQ2mF\",\"header\":\"src-components-Header-Header__header--1qRCL\",\"header__inner\":\"src-components-Header-Header__header__inner--2NCJD\",\"header__logo\":\"src-components-Header-Header__header__logo--1l0Df\",\"header__logo-img\":\"src-components-Header-Header__header__logo-img--l10oz\",\"header__logo-text\":\"src-components-Header-Header__header__logo-text--33HKn\",\"header__links\":\"src-components-Header-Header__header__links--2EhV3\",\"header__link\":\"src-components-Header-Header__header__link--xp8Tl\"};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Header/Header.css\n// module id = ./src/components/Header/Header.css\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Header/Header.css?");

/***/ }),

/***/ "./src/components/Header/Header.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component__ = __webpack_require__(\"./node_modules/component/src/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Header_css__ = __webpack_require__(\"./src/components/Header/Header.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Header_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Header_css__);\n\n\n\nvar Header = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_component__[\"a\" /* default */])({\n  initialize: function initialize() {\n    this.render();\n  },\n  render: function render() {\n    this.el.innerHTML = '\\n      <header class=\"' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a.header + '\">\\n        <div class=\"' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a.header__inner + ' ' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a.container + '\">\\n          <div class=\"' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a.header__logo + '\">\\n            <div class=\"' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a['header__logo-img'] + '\">\\n              <img src=\"https://avatars0.githubusercontent.com/u/11519224?v=3&s=200\" alt\"logo\"/>\\n            </div>\\n            <h3 class=\"' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a['header__logo-text'] + '\">\\n              npm check name\\n            </h3>\\n          </div>\\n          <div class=\"' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a.header__links + '\">\\n            <a class=\"' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a.header__link + '\" href=\"#\">Github</a>\\n            <a class=\"' + __WEBPACK_IMPORTED_MODULE_1__Header_css___default.a.header__link + '\" href=\"#\">Twitter</a>\\n          </div>\\n        </div>\\n      </header>\\n    ';\n  }\n});\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Header);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Header/Header.js\n// module id = ./src/components/Header/Header.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Header/Header.js?");

/***/ }),

/***/ "./src/components/Header/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Header__ = __webpack_require__(\"./src/components/Header/Header.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__WEBPACK_IMPORTED_MODULE_0__Header__[\"a\" /* default */]);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Header/index.js\n// module id = ./src/components/Header/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Header/index.js?");

/***/ }),

/***/ "./src/components/Loader/Loader.css":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\nmodule.exports = {\"loader\":\"src-components-Loader-Loader__loader--1nM1b\",\"loader__circle\":\"src-components-Loader-Loader__loader__circle--3NpgJ\",\"appereance\":\"src-components-Loader-Loader__appereance--1Ao8w\"};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Loader/Loader.css\n// module id = ./src/components/Loader/Loader.css\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Loader/Loader.css?");

/***/ }),

/***/ "./src/components/Loader/Loader.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component__ = __webpack_require__(\"./node_modules/component/src/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core__ = __webpack_require__(\"./src/core.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Loader_css__ = __webpack_require__(\"./src/components/Loader/Loader.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Loader_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Loader_css__);\n\n\n\n\nvar Loader = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_component__[\"a\" /* default */])({\n  initialize: function initialize() {\n    var _this = this;\n\n    this.state = {\n      loading: false\n    };\n\n    __WEBPACK_IMPORTED_MODULE_1__core__[\"a\" /* default */].store.subscribe(function () {\n      var state = __WEBPACK_IMPORTED_MODULE_1__core__[\"a\" /* default */].store.getState();\n      if (_this.shouldComponentUpdate(state)) {\n        _this.state.loading = state.loading;\n        _this.render();\n      }\n    });\n  },\n  shouldComponentUpdate: function shouldComponentUpdate(newState) {\n    return this.state.loading !== newState.loading;\n  },\n  render: function render() {\n    this.el.innerHTML = this.state.loading ? '\\n      <div class=\"' + __WEBPACK_IMPORTED_MODULE_2__Loader_css___default.a.loader + '\">\\n        <span class=\"' + __WEBPACK_IMPORTED_MODULE_2__Loader_css___default.a.loader__circle + '\"></span>\\n        <span class=\"' + __WEBPACK_IMPORTED_MODULE_2__Loader_css___default.a.loader__circle + '\"></span>\\n        <span class=\"' + __WEBPACK_IMPORTED_MODULE_2__Loader_css___default.a.loader__circle + '\"></span>\\n      </div>' : '';\n  }\n});\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Loader);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Loader/Loader.js\n// module id = ./src/components/Loader/Loader.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Loader/Loader.js?");

/***/ }),

/***/ "./src/components/Loader/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Loader__ = __webpack_require__(\"./src/components/Loader/Loader.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__WEBPACK_IMPORTED_MODULE_0__Loader__[\"a\" /* default */]);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Loader/index.js\n// module id = ./src/components/Loader/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Loader/index.js?");

/***/ }),

/***/ "./src/components/Result/Result.css":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\nmodule.exports = {\"result\":\"src-components-Result-Result__result--1x4ZU\",\"result__congrats\":\"src-components-Result-Result__result__congrats--4Qy2l\",\"result__congrats-name\":\"src-components-Result-Result__result__congrats-name--23ktn\",\"result__reserved\":\"src-components-Result-Result__result__reserved--2WdeJ\",\"result__description\":\"src-components-Result-Result__result__description--3zw0y\"};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Result/Result.css\n// module id = ./src/components/Result/Result.css\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Result/Result.css?");

/***/ }),

/***/ "./src/components/Result/Result.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component__ = __webpack_require__(\"./node_modules/component/src/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core__ = __webpack_require__(\"./src/core.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Result_css__ = __webpack_require__(\"./src/components/Result/Result.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Result_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Result_css__);\n\n\n\n\nvar Result = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_component__[\"a\" /* default */])({\n  initialize: function initialize() {\n    var _this = this;\n\n    this.state = {\n      isAvailable: false,\n      packageName: ''\n    };\n\n    __WEBPACK_IMPORTED_MODULE_1__core__[\"a\" /* default */].store.subscribe(function () {\n      var state = __WEBPACK_IMPORTED_MODULE_1__core__[\"a\" /* default */].store.getState();\n      var newState = {\n        isAvailable: state.isAvailable,\n        packageName: state.packageName\n      };\n      if (_this.shouldComponentUpdate(newState)) {\n        _this.state = newState;\n        _this.render();\n      }\n    });\n\n    this.render();\n  },\n  shouldComponentUpdate: function shouldComponentUpdate(newState) {\n    return this.state.packageName !== newState.packageName || this.state.isAvailable !== newState.isAvailable;\n  },\n  render: function render() {\n    this.el.innerHTML = '\\n      ' + (this.state.packageName ? '\\n        <div class=\"' + __WEBPACK_IMPORTED_MODULE_2__Result_css___default.a.result + '\">\\n          ' + (this.state.isAvailable ? '<h2 class=\"' + __WEBPACK_IMPORTED_MODULE_2__Result_css___default.a.result__congrats + '\">\\n              Yay! <span class=\"' + __WEBPACK_IMPORTED_MODULE_2__Result_css___default.a['result__congrats-name'] + '\">' + this.state.packageName + '</span> name is free\\n             </h2>\\n             <p class=\"' + __WEBPACK_IMPORTED_MODULE_2__Result_css___default.a.result__description + '\">Check <a href=\"https://docs.npmjs.com/\">npm docs</a> to getting started</p>\\n            ' : '<h2 class=\"' + __WEBPACK_IMPORTED_MODULE_2__Result_css___default.a.result__reserved + '\">Ops, this name is reserved.</h2> ') + '\\n        </div>' : '') + '\\n    ';\n  }\n});\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Result);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Result/Result.js\n// module id = ./src/components/Result/Result.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Result/Result.js?");

/***/ }),

/***/ "./src/components/Result/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Result__ = __webpack_require__(\"./src/components/Result/Result.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__WEBPACK_IMPORTED_MODULE_0__Result__[\"a\" /* default */]);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Result/index.js\n// module id = ./src/components/Result/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Result/index.js?");

/***/ }),

/***/ "./src/components/Search/Search.css":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\nmodule.exports = {\"search\":\"src-components-Search-Search__search--HZgNE\",\"search__form\":\"src-components-Search-Search__search__form--UGtFD\",\"search__field\":\"src-components-Search-Search__search__field--1wan4\",\"search__input\":\"src-components-Search-Search__search__input--1Kwm5\",\"search__btn\":\"src-components-Search-Search__search__btn--xL5G3\"};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Search/Search.css\n// module id = ./src/components/Search/Search.css\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Search/Search.css?");

/***/ }),

/***/ "./src/components/Search/Search.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_component__ = __webpack_require__(\"./node_modules/component/src/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Loader__ = __webpack_require__(\"./src/components/Loader/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__(\"./src/actions/index.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Search_css__ = __webpack_require__(\"./src/components/Search/Search.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Search_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Search_css__);\nvar _events;\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\n\n\nvar Search = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_component__[\"a\" /* default */])({\n  events: (_events = {}, _defineProperty(_events, 'change .' + __WEBPACK_IMPORTED_MODULE_3__Search_css___default.a.search__input, 'onChange'), _defineProperty(_events, 'submit .' + __WEBPACK_IMPORTED_MODULE_3__Search_css___default.a.search__form, 'onSubmit'), _events),\n\n  initialize: function initialize() {\n    this.state = {\n      query: ''\n    };\n    this.render();\n    this.afterRender();\n  },\n  onChange: function onChange(e) {\n    this.state.query = e.target.value;\n  },\n  onSubmit: function onSubmit(e) {\n    e.preventDefault();\n    __WEBPACK_IMPORTED_MODULE_2__actions__[\"a\" /* default */].searchAction(this.state.query);\n  },\n  render: function render() {\n    this.el.innerHTML = '\\n      <div class=\"' + __WEBPACK_IMPORTED_MODULE_3__Search_css___default.a.search + '\">\\n        <form class=\"' + __WEBPACK_IMPORTED_MODULE_3__Search_css___default.a.search__form + '\">\\n          <div class=\"' + __WEBPACK_IMPORTED_MODULE_3__Search_css___default.a.search__field + '\">\\n            <input class=\"' + __WEBPACK_IMPORTED_MODULE_3__Search_css___default.a.search__input + '\" value=\"' + this.state.query + '\"/>\\n            <button class=\"' + __WEBPACK_IMPORTED_MODULE_3__Search_css___default.a.search__btn + '\">check</button>\\n          </div>\\n        </form>\\n        <div class=\"search__loader\"></div>\\n      </div>\\n    ';\n  },\n  afterRender: function afterRender() {\n    this.loader = new __WEBPACK_IMPORTED_MODULE_1__Loader__[\"a\" /* default */]({\n      el: '.search__loader'\n    });\n  }\n});\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Search);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Search/Search.js\n// module id = ./src/components/Search/Search.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Search/Search.js?");

/***/ }),

/***/ "./src/components/Search/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Search__ = __webpack_require__(\"./src/components/Search/Search.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (__WEBPACK_IMPORTED_MODULE_0__Search__[\"a\" /* default */]);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/components/Search/index.js\n// module id = ./src/components/Search/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/components/Search/index.js?");

/***/ }),

/***/ "./src/core.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(\"./src/store.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"a\"] = ({\n  store: new __WEBPACK_IMPORTED_MODULE_0__store__[\"a\" /* default */]({\n    packageName: '',\n    loading: false,\n    isAvailable: null\n  })\n});\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/core.js\n// module id = ./src/core.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/core.js?");

/***/ }),

/***/ "./src/index.css":
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/index.css\n// module id = ./src/index.css\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/index.css?");

/***/ }),

/***/ "./src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_css__ = __webpack_require__(\"./src/index.css\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__index_css__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_App__ = __webpack_require__(\"./src/components/App/index.js\");\n\n\n\n(function init() {\n  var app = new __WEBPACK_IMPORTED_MODULE_1__components_App__[\"a\" /* default */]({\n    el: document.body\n  });\n\n  console.log(app); // eslint-disable-line\n})();\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/index.js\n// module id = ./src/index.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/store.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Store = function () {\n  function Store() {\n    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    _classCallCheck(this, Store);\n\n    this.listeners = [];\n    this.state = initialState;\n  }\n\n  _createClass(Store, [{\n    key: 'subscribe',\n    value: function subscribe(cb) {\n      this.listeners.push(cb);\n      cb();\n    }\n  }, {\n    key: 'unsubscribe',\n    value: function unsubscribe(cb) {\n      this.listeners = this.listeners.filter(function (listener) {\n        return listener !== cb;\n      });\n    }\n  }, {\n    key: 'changeState',\n    value: function changeState(cb) {\n      this.state = cb(this.state);\n      console.log('state: ', this.state); // eslint-disable-line\n      this.emitChange();\n    }\n  }, {\n    key: 'getState',\n    value: function getState() {\n      return this.state;\n    }\n  }, {\n    key: 'emitChange',\n    value: function emitChange() {\n      var _this = this;\n\n      this.listeners.forEach(function (cb) {\n        return cb(_this.state);\n      });\n    }\n  }]);\n\n  return Store;\n}();\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (Store);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/store.js\n// module id = ./src/store.js\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/store.js?");

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(\"./src/index.js\");\n\n\n//////////////////\n// WEBPACK FOOTER\n// multi ./src/index.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///multi_./src/index.js?");

/***/ })

/******/ });