/**
 * @author Brian Hyder <brian@pencilblue.org>
 * @copyright PencilBlue, LLC 2014 All Rights Reserved
 */

//dependencies
var BaseController = pb.BaseController;

/**
 * FormController - Provides the basic functionality for implementing a
 * controller that needs access to a posted form.
 *
 * @class FormController
 * @constructor
 */
function FormController(){};

//inheritance
util.inherits(FormController, BaseController);

/**
 * Flag to indicate if the form should automatically sanitize the incoming
 * values.  In this case sanitize means it will attempt to strip away any
 * HTML tags to prevent HTML injection and XSS.
 * @protected
 * @property
 * @type {Boolean}
 */
FormController.prototype.autoSanitize = true;

FormController.prototype.render = function(cb) {
	var self = this;
	this.getPostParams(function(err, params) {
		if (util.isError(err)) {
			self.onPostParamsError(err, cb);
            return;
		}

        if (self.getAutoSanitize()) {
            self.sanitizeObject(params);
        }
        self.onPostParamsRetrieved(params, cb);
	});
};

FormController.prototype.getAutoSanitize = function() {
    return this.autoSanitize;
};

FormController.prototype.setAutoSanitize = function(val) {
    this.autoSanitize = val ? true : false;
};

/**
 * Called when an error occurs attempting to process the post parameters.  The
 * default implementation takes the error and sends it back to the requesting
 * entity with a 400 Bad Request status code.
 * @param err
 * @param cb
 */
FormController.prototype.onPostParamsError = function(err, cb) {
	pb.log.silly("FormController: Error processing form parameters"+err);
	cb({content: err, code: 400});
};

/**
 * Default implementation that will echo the parameters back to the requesting
 * entity.
 * @param params
 * @param cb
 */
FormController.prototype.onPostParamsRetrieved = function(params, cb) {
	cb({content: JSON.stringify(params), content_type:'application/json'});
};

//exports
module.exports.FormController = FormController;