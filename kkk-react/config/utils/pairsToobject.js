function pairs_to_object(pairs) {
  var ret = {};
  pairs.forEach(function (p) {
    ret[p[0]] = p[1];
    return ret;
  });
}

module.exports = { pairs_to_object };
