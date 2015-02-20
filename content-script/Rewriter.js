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


// console.log((new RegExp()));
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

  var rule = new Rule(["a"],"b",["c"]);

  manager.clear_rules();
  manager.save_rules([rule]);
  manager.restore_rules(function (data)
  {
    var storedrules = data.rules;
    for (var i = 0 ; i < storedrules.length ; i++)
    {
      rule = storedrules[i];
      rules.push(new Rule(rule.match, rule.substitute, rule.url));
      console.log(rules);
    }
  });




  // manager.restore_rules(function (data) {

  //   rules = data.rules;

  //   console.log(rules);
  //   if (rules.length <= 0)
  //       debug('No rules were stored.');
  //     else
  //     {
  //       debug(rules.length.toString() + ' rules loaded :');
  //       for (var i = 0; i < rules.length ; i++)
  //       {
  //       // do test (page url == rule.url)
  //       // rewrite stuffs for each match
  //         rule = rules[i];
  //         console.log(rule);
  //         debug(rule.toString());
  //       }
  //     }
  // });
}