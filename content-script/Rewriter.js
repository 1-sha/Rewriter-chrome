/*
 * REWRITER : Rewrite the content of a webpage
 * using user-defined rules.
 * 
 * By Peshou, votre cher et tendre
 */

window.onload = main;


function main()
{
	console.log('Rewriter is running');
	// save_options();
	restore_options();
}

function save_options() {
  var color = "red";
  chrome.storage.sync.set({
    color: color
  }, function() {
    console.log('cbonlol');
  });
}

function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    color : 'osef'
  }, function(items) {
    console.log(items.color);
  });
}