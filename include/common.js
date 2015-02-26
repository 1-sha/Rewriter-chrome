/**
 * common.js : common fuctions in the app.
 * Custom logger, rule saver, text parser etc ...
 * 
 * By Peshou, votre cher et tendre.
 *
 * @author https://github.com/Peshmelba
 */


var common = {
	"env" : 'prod'
};



common.env = 'dev';



/**
 * Print a message if the environment is Development.
 * @param  {string} msg 	Message to print
 */
function debug(msg)
{ 
	if(common.env=='dev')
		console.log(msg);
}

/**
 * Save in the Chrome storage all the valid rules found in the text given.
 * @param  {string} content Text that might contain some rules.
 * @return {object}         Object with "errors" as errors encoutered and
 *                           and "rules" as an array of Rules found.
 */
function persist(content)
{
	var errors = "";
	var rules = [];
	var rule;
	var keys;

	var res = findAllRules(content);
	errors = res.errors;
	keys = res.keys;

	if (keys.length != 0)
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
 	}
	else
	{
		errors = "No valid rule found.";
	}

	return { "errors" : errors, "rules" : rules};
}

/**
 * Parse a string containing rules as strings, and return all rules found.
 * @param  {string} content Text that might contain some rules.
 * @return {object}         Object with "errors" as errors encoutered and
 *                           and "keys" as an array of string corresponding
 *                           to rules found.
 */
function findAllRules(content)
{
	var keys = content.split('\n');
	var rules = [];
	var errors = '';

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

	return { "errors" : errors, "keys" : rules};
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
		debug(e);
	}
	
	return rule;
}