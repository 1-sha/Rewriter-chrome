/**
 * popup.js : Do some stuff on popup.html.
 * 
 * By Peshou, votre cher et tendre
 *
 * @author https://github.com/Peshmelba
 */

/**
 * DOM elements for rules managing.
 */
var DOM_addRule;
var DOM_newrule;
var DOM_rules;

/**
 * DOM elements for rule building.
 */
var DOM_addfield;
var DOM_match;
var DOM_substitute;
var DOM_url;

/**
 * DOM elements for miscellaneous purposes.
 */
var DOM_error;
var DOM_clear;

/**
 * Manager to save and restore datas from the app to the chrome storage.
 * @type {DataManager}
 */
var manager = new DataManager();

/**
 * Errors wrote when creating a bad formated rule.
 * @type {String}
 */
var errors = "";

window.onload = main;

function main()
{
	DOM_addRule = document.getElementById('addRule');
	DOM_newrule = document.getElementById('newrule');
	DOM_rules = document.getElementById('rules');
	DOM_addfield = document.getElementsByClassName('addfield');
	DOM_match = document.getElementsByClassName('match');
	DOM_substitute = document.getElementsByClassName('substitute')[0];
	DOM_url = document.getElementsByClassName('url');
	DOM_error = document.getElementById('error');
	DOM_clear = document.getElementById('clear');

	DOM_addRule.addEventListener('click', add);

	DOM_rules.addEventListener('input', function(){
		persist(this.value);
	});

	DOM_clear.addEventListener('click', manager.clear_rules);

	for (var i = 0; i < DOM_addfield.length; i++)
	{
		DOM_addfield[i].addEventListener('click', addfield);
	}

	for (var i = 0; i < DOM_match.length; i++)
	{
		DOM_match[i].addEventListener('input', writerule);
	}

	DOM_substitute.addEventListener('input', writerule);

	for (var i = 0; i < DOM_url.length; i++)
	{
		DOM_url[i].addEventListener('input', writerule);
	}

	writerule();
	setback();
}

/**
 * Compose a rule using value of the inputs.
 */
function writerule()
{
	var match = [];

	for (var i = 0; i < DOM_match.length; i++)
	{
		match.push(clean(DOM_match[i].value));
	}

	var substitute = clean(DOM_substitute.value);

	var url = [];

	for (var i = 0; i < DOM_url.length; i++)
	{
		if (DOM_url[i].value != '')
			url.push(clean(DOM_url[i].value));
		else
			url.push("*");
	}
	
	var rule = new Rule(match, substitute, url);

	DOM_newrule.value = rule.toString();
}

/**
 * Check if the new rule is valid, then add it to rules.
 */
function add()
{
	var rule = DOM_newrule.value;

	if (parse(rule) != null)
	{
		DOM_rules.value +=  rule;
		DOM_rules.value += "\n";

		persist(DOM_rules.value);
	}
	else
	{
		DOM_error.innerText = "Invalid rule format.";
	}
}

/**
 * Add a new input to the rule builder.
 */
function addfield()
{
	var input;

	if (this.previousElementSibling.tagName == "INPUT")
		input = this.previousElementSibling;
	else 
		input = this.previousElementSibling.previousElementSibling;

	if (input.value.trim().length > 0)
	{
		input = input.cloneNode();
		input.value = '';
		input.addEventListener('input', writerule);

		this.parentNode.insertBefore(document.createElement('br'), this);
		this.parentNode.insertBefore(input, this);
		this.parentNode.insertBefore(newRemove(), this);

		DOM_match = document.getElementsByClassName('match');
		DOM_url = document.getElementsByClassName('url');

		writerule();
	}
}

/**
 * Remove the current input from the rule builder.
 */
function rmfield()
{
	this.parentNode.removeChild(this.previousElementSibling);	// remove input
	this.parentNode.removeChild(this.previousElementSibling);	// remove br
	this.parentNode.removeChild(this);							// remove button

	DOM_match = document.getElementsByClassName('match');
	DOM_url = document.getElementsByClassName('url');

	writerule();
}

/**
 * Parse the given string as JSON and create a Rule object.
 * @param  {string} key 	A rule as string.
 * @return {Rule}     		the rule created, return null if invalid format.
 */
function parse(key)
{
	var rulejson;
	var rule = null;

	try {
		rulejson = JSON.parse('{' + (key.slice(0, -1)) + '}');

		rule = new Rule(rulejson.match, rulejson.substitute, rulejson.url);
	} catch(e)
	{
		console.log(e);
	}
	
	return rule;
}

/**
 * Parse a string containing rules as strings, and return all rules found.
 * @param  {string} content Text that might contain some rules.
 * @return {array}         	Array of Rule created.
 */
function findAllRules(content)
{
	var keys = content.split('\n');
	var rules = [];

	var pattern = '^"match": \\[".*"\\], "substitute": ".*", "url": \\[".*"\\];$';
	var mod = "";
	var rgx_valid = new RegExp(pattern, mod);
	pattern = '^# .*$';
	mod = "";
	var rgx_comment = new RegExp(pattern, mod);
	pattern = '^$';
	mod = "";
	var rgx_empty = new RegExp(pattern, mod);


	for (var i = 0 ; i < keys.length ; i++)
	{
		if (rgx_valid.test(keys[i]))
		{
			rules.push(keys[i]);
		}
		else if (!rgx_comment.test(keys[i]) && !rgx_empty.test(keys[i]))
		{
			errors += "Line " + (i+1) + " is unvalid. ";
		}
	}

	return rules;
}

/**
 * Create a button element, add en event listener, and return it.
 * @return {HTMLButtonElement} Button that removes the input when clicked.
 */
function newRemove()
{
	var remove = document.createElement('button');
	remove.innerHTML = '-';
	remove.addEventListener('click', rmfield);

	return remove;
}

/**
 * Escape user's input.
 * @param  {string} string 	User's input.
 * @return {string}        	Cleaned input, proper for creating a Regexp.
 */
function clean(string)
{
	return string.replace(/\\n/g,'\n');
}

/**
 * Save in the Chrome storage all the valid rules found in the text given.
 * @param  {string} content 	Text that might contain some rules.
 */
function persist(content)
{
	errors = "";

	var keys = findAllRules(content);
	var rules = [];
	var rule;

	if (keys != null)
	{
		for (var i = 0 ; i < keys.length ; i++)
		{
			rule = parse(keys[i]);

			if (rule != null)
			{
				rules.push(rule);
			}
			else
			{
				errors += "Can't save rule n°" + (i+1) + ". ";
			}
		}

		manager.save_rules(rules);
		DOM_error.innerText = errors;
 	}
	else
	{
		DOM_error.innerText = "No valid rule found.";
	}
}

/**
 * Restore rules from the Chrome storage and write a text of all the rules as string.
 */
function setback()
{ 
	manager.restore_rules( function(data) {
		var storedrules = data.rules;
		var rule;
	    if (storedrules.length <= 0)
	      console.log('No rules were stored.');
	    for (var i = 0 ; i < storedrules.length ; i++)
	    {
	      	rule = storedrules[i];
	    	DOM_rules.value += (new Rule(rule.match, rule.substitute, rule.url)).toString();
			DOM_rules.value += "\n";
	    }
	});
}