var exec = require('child_process').exec;

var getFact = function(factName, cb, options) {
  var options = options || {};

  // Sanitize the input to prevent command injection
  if (!/^[a-zA-Z0-9_]+$/.test(factName) && factName !== 'all') {
    return cb(new Error('Invalid fact name'));
  }

  if (factName == 'all') {
    factName = '';
  }

  exec('facter -j ' + factName, function (err, stdout, stderr) {
    if (err) {
        cb(err);
        return;
    }

    var ret = JSON.parse(stdout);

    // if we need to only return names, parse the output
    if (options['namesOnly']) {
      ret = Object.keys(ret);
    };

    cb (null, ret);
  });
}

exports.getFacts = function(namesOnly, callback) {
  options = { 'namesOnly': namesOnly };

  getFact('all', callback, options);
}

exports.getFact = getFact;