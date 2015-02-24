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

function rewriter()
{
	// check if website is in url
		// build regex with url, don't check http/https 
	// for all matches, search in page and replace
		// build regex with

	var urlcheck = false;

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
			console.log('url found');
			for (var j = 0 ; j < rule.match.length ; j++)
			{
				document.documentElement.innerHTML = 
					document.documentElement.innerHTML.replace
					(regexmatch(rule.match[j]), rule.substitute);
				console.log('replaced');
			}
		}
	}
}

function regexurl(url)
{
	url = url.replace(/^(http|https):\/\//, '').replace(/\/$/, '').replace(/\*/g, '.*');
	var rgx = new RegExp(url);
	return rgx;
}

function regexmatch(match)
{
	var mod = 'ig';
	var rgx = new RegExp(match, mod);
	return rgx;
}