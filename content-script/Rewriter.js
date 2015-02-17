/**
 * REWRITER : Rewrite the content of a webpage
 * using user-defined rules.
 * 
 * By Peshou, votre cher et tendre
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

/**
 * object Rule
 * Define a rewrite rule.
 * 
 * @constructor
 * @param {array} match        Array of string/regex which defines the words to rewrite.
 * @param {string} substitute  The text that will remplace all the matched strings.
 * @param {array} url          Array of urls where the rule is effective.
 *
 * @method add      Add a new match key to the rule.
 * @method toString Convert the object to a string.
 */
function Rule(match, substitute, url)
{
  this.match = match;
  this.substitute = substitute;
  this.url = url;

  this.add = function(key)
  {
    this.match.push(key);
  }

  this.addUrl = function(url)
  {
    this.url.push(url);
  }

  this.toString = function()
  {
    var obj;

    obj = 'match: ';
    for (var key in this.match)
    {
      obj += '"' + this.match[key] +'", ';
    }
    obj = obj.slice(0, -2);

    obj += ' substitute: ';
    obj += '"' + this.substitute + '"';

    obj = 'url: ';
    for (var key in this.url)
    {
      obj += '"' + this.url[key] +'", ';
    }
    obj = obj.slice(0, -2);

    return obj;
  }
}