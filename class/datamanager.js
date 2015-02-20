/**
 * Class DataManager
 * Sends, retrieves and clears user datas.
 *
 * By Peshou, votre cher et tendre.
 *
 * @author https://github.com/Peshmelba
 *
 * @method save_rules		Save rules.
 * @method restore_rules	Restore rules.
 * @method clear_rules		Clear rules.
 */
function DataManager()
{
	this.save_rules = function(rules) {
		chrome.storage.sync.set({ "rules" : rules }, function() {
			console.log('saved rules');
		});
	};

	this.restore_rules = function(action) {
		console.log('restored rules');
		chrome.storage.sync.get("rules", action);
	};

	this.clear_rules = function() {
		chrome.storage.sync.clear();
		console.log('cleared rules');
	};
}