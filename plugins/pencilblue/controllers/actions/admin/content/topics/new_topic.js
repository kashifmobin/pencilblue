/*
    Copyright (C) 2014  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Creates a new topic
 */

function NewTopic(){}

//inheritance
util.inherits(NewTopic, pb.BaseController);

NewTopic.prototype.render = function(cb) {
	var self = this;

	this.getJSONPostParams(function(err, post) {
		var message = self.hasRequiredParams(post, ['name']);
		if(message) {
			cb({
				code: 400,
				content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, message)
			});
	        return;
	    }

	    var dao = new pb.DAO();
	    dao.count('topic', {name: post.name}, function(err, count) {
	        if(count > 0) {
				cb({
					code: 400,
					content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('EXISTING_TOPIC'))
				});
	            return;
	        }

	        var topicDocument = pb.DocumentCreator.create('topic', post);
	        dao.update(topicDocument).then(function(result) {
	            if(util.isError(result)) {
	                cb({
						code: 500,
						content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'))
					});
	                return;
	            }

				cb({content: pb.BaseController.apiResponse(pb.BaseController.API_SUCCESS, topicDocument.name + ' ' + self.ls.get('CREATED'))});
	        });
	    });
	});
};

//exports
module.exports = NewTopic;
