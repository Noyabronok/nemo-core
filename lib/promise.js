module.exports = function () {
  let fulfill, reject;

  const promise = new Promise(function (good, bad) {
    fulfill = good;
    reject = bad;
  });
  return { promise, fulfill, reject };
};
