/** @license MIT License (c) copyright 2010-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author: Brian Cavalier
 * @author: John Hann
 */

(function(define) { 'use strict';
define(function(require) {

	var when = require('when');
	var path = require('../lib/path');
	var Rest = require('./Rest');

	function JsonPatch(client, options) {
		Rest.apply(this, arguments);
	}

	JsonPatch.prototype = Object.create(Rest.prototype);

	JsonPatch.prototype.patch = function(patch) {
		var metadata = this.metadata;
		var self = this;
		this._shadow = when(this._shadow, function(data) {
			self._client({
				method: 'PATCH',
				entity: patch.map(normalizePath)
			}).then(function(remotePatch) {
				return metadata.patch(metadata.patch(data, patch), remotePatch);
			})
		});

		return this._shadow.yield();
	};

	function normalizePath(change) {
		change.path = path.rooted(change.path);
		return change;
	}

	return JsonPatch;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
