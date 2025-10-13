const UserRouteAdmin = require("./Admin/UserRouteAdmin");

const routes = (app) => {
  app.use("/api/user", UserRouteAdmin);
};

module.exports = routes;
