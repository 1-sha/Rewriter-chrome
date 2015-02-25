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
	console.log('restoring rules');
	debug({"rules" : []}, action);
};

DataManager.prototype.clear_rules = function() {
	chrome.storage.sync.clear();
	debug('clearing rules');
};