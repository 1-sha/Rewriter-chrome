/**
 * Class DataManager
 * Sends, retrieves and clears user datas.
 *
 * By Peshou, votre cher et tendre.
 *
 * @author https://github.com/Peshmelba
 *
 * @method save_rules		Save rules.
 * @method restore_rules	Restore rules and run the callback when it's done.
 * @method clear_rules		Clear rules.
 */
var DataManager = function ()
{

};


DataManager.prototype.save_rules = function(rules) {
	chrome.storage.sync.set({ "rules" : rules }, function() {
		debug('saving rules');
	});
};

DataManager.prototype.restore_rules = function(action) {
	debug('restoring rules');
	chrome.storage.sync.get({"rules" : []}, action);
};

DataManager.prototype.clear_rules = function() {
	chrome.storage.sync.clear();
	debug('clearing rules');
};

DataManager.prototype.save_autoupdate = function(autoupdate) {
	chrome.storage.sync.set({ "autoupdate" : autoupdate }, function() {
		debug('saving auto-update to ' + autoupdate);
	});
};

DataManager.prototype.restore_autoupdate = function(action) {
	debug('restoring auto-update');
	chrome.storage.sync.get({"autoupdate" : false}, action);
};

DataManager.prototype.save_debugmode = function(debugmode) {
	chrome.storage.sync.set({ "debugmode" : debugmode }, function() {
		debug('saving debug mode to ' + debugmode);
	});
};

DataManager.prototype.restore_debugmode = function(action) {
	debug('restoring debug mode');
	chrome.storage.sync.get({"debugmode" : (common.env == "dev")}, action);
};