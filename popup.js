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
var DOM_autoupdate;
var DOM_debugmode;

/**
 * Manager to save and restore datas from the app to the chrome storage.
 * @type {DataManager}
 */
var manager = new DataManager();

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
	DOM_autoupdate = document.getElementById('autoupdate');
	DOM_debugmode = document.getElementById('debugmode');

	DOM_addRule.addEventListener('click', add);

	DOM_autoupdate.addEventListener('click', setAutoUpdate);

	DOM_debugmode.addEventListener('click', setDebugMode);


	DOM_rules.addEventListener('input', function(){
		var res = persist(this.value);
		DOM_error.innerText = res.errors;
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

		var res = persist(DOM_rules.value);
		DOM_error.innerText = res.errors;
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
 * Restore rules from the Chrome storage and write a text of all the rules as string.
 */
function setback()
{ 
	manager.restore_debugmode( function(data)
	{
		var debugmode = data.debugmode;
		
		DOM_debugmode.checked = debugmode;
		setDebugMode();
	});

	manager.restore_autoupdate( function(data)
	{
		var autoupdate = data.autoupdate;
		DOM_autoupdate.checked = autoupdate;
	});

	manager.restore_rules( function(data) {
		var storedrules = data.rules;
		var rule;
	    if (storedrules.length <= 0)
	     	debug('No rules were stored.');
	    for (var i = 0 ; i < storedrules.length ; i++)
	    {
	      	rule = storedrules[i];
	    	DOM_rules.value += (new Rule(rule.match, rule.substitute, rule.url)).toString();
			DOM_rules.value += "\n";
	    }
	});
}

function setAutoUpdate()
{
	var val = DOM_autoupdate.checked;
	if (val)
	{
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		    chrome.tabs.sendMessage(tabs[0].id, {type: "start autoupdate"});
		});
		debug('send start auto update');
	}
	else
	{
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		    chrome.tabs.sendMessage(tabs[0].id, {type: "stop autoupdate"});
		});
		debug('send stop auto update');
	}
	manager.save_autoupdate(val);
}

function setDebugMode()
{
	var val = DOM_debugmode.checked;
	if (val)
	{
		common.env = "dev";
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		    chrome.tabs.sendMessage(tabs[0].id, {type: "start debugmode"});
		});
		debug('send debugmode true');
	}
	else
	{
		common.env = "prod";
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		    chrome.tabs.sendMessage(tabs[0].id, {type: "stop debugmode"});
		});
		debug('send debugmode false');
	}

	manager.save_debugmode(val);
}