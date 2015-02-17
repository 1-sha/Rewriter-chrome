/**
 * REWRITER : Rewrite the content of a webpage
 * using user-defined rules.
 * 
 * By Peshou, votre cher et tendre
 *
 * @author https://github.com/Peshmelba
 */

window.onload = main;


function main()
{
	console.log('Rewriter is running');

  var rules = restore_rules();
  var rule;
  if (rules.lenght < 0)
    console.log('No rules were stored.');
  else
  {
    for (var i in rules)
    {
    // do test (page url == rule.url)
    // rewrite stuffs for each match
      rule = rules[i];
      console.log(rule.toString());
    }
  }
}

function save_rules() {
  chrome.storage.sync.set({ rules : rules }, function() {
    console.log('saved rules');
  });
}

function restore_rules() {
  chrome.storage.sync.get({ rules : [] }, function(items) {
    console.log('restored rules');
    return items.rules;
  });
}

function clear_rules() {
  chrome.storage.sync.clear();
  console.log('cleared rules');
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