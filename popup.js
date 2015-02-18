/**
 * popup.js : Do some stuff on popup.html.
 * 
 * By Peshou, votre cher et tendre
 *
 * @author https://github.com/Peshmelba
 */

var DOM_addRule;
var DOM_newrule;
var DOM_rules;

var DOM_addfield;
var DOM_match;
var DOM_substitute;
var DOM_url;

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

	DOM_addRule.addEventListener('click', add);

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

	writerule()
}

function writerule()
{
	// compose a rule with the content of inputs
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

function add()
{
	// Parser la newrule pour checker sa conformité
	

	// Ajouter la rule à la liste des rules
	
	DOM_rules.value +=  DOM_newrule.value;
	DOM_rules.value += "\n";
}

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

		writerule()
	}
}

function rmfield()
{
	this.parentNode.removeChild(this.previousElementSibling);
	this.parentNode.removeChild(this.previousElementSibling);
	// this.parentNode.removeChild(this.nextElementSibling);
	this.parentNode.removeChild(this);	

	DOM_match = document.getElementsByClassName('match');
	DOM_url = document.getElementsByClassName('url');

	writerule()
}

// function validate(key)
// { // valide key looks like that :
//   // match: ("1", "2", "3") 
// }

function newRemove()
{
	var remove = document.createElement('button');
	remove.innerHTML = '-';
	remove.addEventListener('click', rmfield);

	return remove;
}

function clean(string)
{
	return string.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
}