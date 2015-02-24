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
var rule;

var manager = new DataManager();

function main()
{
	debug('Rewriter is running');

	manager.restore_rules(function (data)
	{
		var storedrules = data.rules;
		if (storedrules.length <= 0)
			debug('No rules were stored.');
		for (var i = 0 ; i < storedrules.length ; i++)
		{
			rule = storedrules[i];
			rules.push(new Rule(rule.match, rule.substitute, rule.url));
		}

		rewriter();
	});
}

/**
 * Replace stuff in the current page using rules.
 */
function rewriter()
{
	var urlcheck = false;
	var match = '';
	var occurence = 0;

	for (var i = 0 ; i < rules.length ; i++)
	{
		rule = rules[i];

		for (var j = 0 ; j < rule.url.length ; j++)
		{	
			if (regexurl(rule.url[j]).test(window.location.href))
			{
				urlcheck = true;
			}
		}

		if (urlcheck)
		{
			debug('url found');
			for (var j = 0 ; j < rule.match.length ; j++)
			{
				match = regexmatch(rule.match[j]);
				occurence = document.documentElement.innerHTML.match(match)

				if (occurence != null)
				{
					document.documentElement.innerHTML = 
						document.documentElement.innerHTML.replace
						(match, rule.substitute);
					debug(occurence.length + "occurences replaced.");
				} 
				else
				{
					debug('No occurences found.');
				}
			}
		}
		else
		{
			debug('No rules match this url.');
		}
	}
}

/**
 * Convert rule's url key to a RegExp.
 * @param  {string} url 	Url key to convert.
 * @return {RegExp}     	RegExp to match or not page's url.
 */
function regexurl(url)
{
	url = url.replace(/^(http|https):\/\//, '').replace(/\/$/, '').replace(/\*/g, '.*');
	var rgx = new RegExp(url);
	return rgx;
}

/**
 * Convert rule's match key to a RegExp.
 * @param  {string} match	Match key to convert.
 * @return {RegExp}     	RegExp to match or not page's content.       	
 */
function regexmatch(match)
{
	var mod = 'ig';
	var rgx = new RegExp(match, mod);
	return rgx;
}