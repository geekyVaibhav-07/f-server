asyncCatch = (fn) => {
  return (req, res, next) => fn(req, res, next).catch((err) => next(err));
  //or catch(next)
};
module.exports = asyncCatch;
