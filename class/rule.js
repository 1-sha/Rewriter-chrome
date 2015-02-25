/**
 * Class Rule
 * Define a rewrite rule.
 *
 * By Peshou, votre cher et tendre.
 *
 * @author https://github.com/Peshmelba
 *  
 * @constructor
 * @param {array} match        Array of string/regex which defines the words to rewrite.
 * @param {string} substitute  The text that will remplace all the matched strings.
 * @param {array} url          Array of urls where the rule is effective.
 *
 * @method addMatch   Add a new match key to the rule.
 * @method addUrl     Add a new url key to the rule.
 * @method toString   Convert the object to a string.
 */
var Rule = function (match, substitute, url)
{
  this.match = match;
  this.substitute = substitute;
  this.url = url;
};

Rule.prototype.addMatch = function(key)
{
  this.match.push(key);
};

Rule.prototype.addUrl = function(url)
{
  this.url.push(url);
};

Rule.prototype.toString = function()
{
  var obj;

  obj = '"match": [';
  for (var key in this.match)
  {
    obj += '"' + esc(this.match[key]) +'", ';
  }
  obj = obj.slice(0, -2);

  obj += '], "substitute": ';
  obj += '"' + esc(this.substitute) + '"';

  obj += ', "url": [';
  for (var key in this.url)
  {
    obj += '"' + esc(this.url[key]) +'", ';
  }
  obj = obj.slice(0, -2);
  obj += "];";
  return obj;
};

/**
 * Escape some character to make it parsable.
 * @param  {string} string  String to escape.
 * @return {string}         String escaped.
 */
function esc(string)
{
  return string.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"');
}