/**
 * REWRITER : Rewrite the content of a webpage
 * using user-defined rules.
 * 
 * By Peshou, votre cher et tendre.
 *
 * @author https://github.com/Peshmelba
 */

var env = 'dev';
function debug(msg){ if(env=='dev')console.log(msg); }


window.onload = main;

/**
 * Array of rules.
 * @type {Array}
 */
var rules = [];
/**
 * A rule.
 * @type {Rule}
 */
var rule = new Rule();



function main()
{
	debug('Rewriter is running');

  document.addEventListener('RW-merged', function() {
    if (rules.length <= 0)
        debug('No rules were stored.');
      else
      {
        debug(rules.length.toString() + ' rules loaded :');
        for (var i in rules)
        {
        // do test (page url == rule.url)
        // rewrite stuffs for each match
          rule = rules[i];
          debug(rule.toString());
        }
      }
  });
  
  restore_rules();
}

function save_rules() {
  chrome.storage.sync.set({ rules : rules }, function() {
    debug('saved rules');
  });
}

function restore_rules() {
  chrome.storage.sync.get({ rules : [] }, function(items) {
    debug('restored rules');
    rules = items.rules;
    document.dispatchEvent(new Event('RW-merged'));
  });
}

function clear_rules() {
  chrome.storage.sync.clear();
  debug('cleared rules');
}