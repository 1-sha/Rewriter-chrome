/**
 * popup.js : Do some stuff on popup.html.
 * 
 * By Peshou, votre cher et tendre
 *
 * @author https://github.com/Peshmelba
 */

var DOM_add;
var DOM_newrule;
var DOM_rules;

window.onload = main;

function main()
{
	DOM_add = document.getElementById('add');
	DOM_newrule = document.getElementById('newrule');
	DOM_rules = document.getElementById('rules');

	DOM_add.addEventListener('click', add);
}

function add()
{
	// Parser la newrule pour checker sa conformité
	

	// Ajouter la rule à la liste des rules
	
	DOM_rules.value +=  DOM_newrule.value;
	DOM_rules.value += "\n";
}

function validate(key)
{ // valide key looks like that :
  // match: ("1", "2", "3") 
;
}