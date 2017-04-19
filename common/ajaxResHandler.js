var resHandler = {};

resHandler.success = function(res, data) {
      res.status(200).json(data);
}

resHandler.fail = function(res, error) {
     res.status(500).send(error);
}

module.exports = resHandler;