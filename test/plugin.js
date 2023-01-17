/* global module: true, require: true, console: true */
const assert = require("assert");
const path = require("path");
const Nemo = require("../index");
const chromeConfig = require("./driverconfig.chrome");

describe("@plugin@", function () {
  it("should @priorityRegister@", function (done) {
    process.env.nemoBaseDir = path.resolve(__dirname);

    Nemo(function (err, nemo) {
      assert.equal(nemo.preDriver.isDriverSetup, false);
      assert.equal(nemo.postDriver.isDriverSetup, true);
      nemo.driver.quit();
      done();
    });
  });

  it("should handle @nonexistPlugin@", function (done) {
    delete process.env.nemoBaseDir;
    Nemo(
      __dirname,
      {
        driver: chromeConfig,
        plugins: {
          noexist: {
            module: "ModuleThatDoesNotExist",
          },
        },
      },
      function (err) {
        if (err) {
          done();
          return;
        }
        done(new Error("didnt get the correct exception"));
      }
    );
  });

  //FIXME: the driver is launching the browser, but it's not clear how to quit it
  //       since nemo instance is not returned in the callback.
  //       With chromedriver 3 the driver wasn't launching the browser, so nothing to quit
  it.skip("should handle @failedPluginRegistration@", function (done) {
    delete process.env.nemoBaseDir;

    Nemo(
      __dirname,
      {
        driver: chromeConfig,
        plugins: {
          crappy: {
            module: "path:plugin/sample",
            arguments: ["crap plugin"],
          },
        },
      },
      async (err, nemo) => {
        await nemo.driver.quit();

        if (err && err.name && err.name === "nemoPluginSetupError") {
          return done();
        } else if (err) {
          done(err);
        }
      }
    );
  });
});
