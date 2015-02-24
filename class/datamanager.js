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
		console.log('saved rules');
	});
};

DataManager.prototype.restore_rules = function(action) {
	console.log('restored rules');
	chrome.storage.sync.get({"rules" : []}, action);
};

DataManager.prototype.clear_rules = function() {
	chrome.storage.sync.clear();
	console.log('cleared rules');
};