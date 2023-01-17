/* global module: true, require: true, console: true */

const assert = require("assert");
const Nemo = require("../index");
const chromeConfig = require("./driverconfig.chrome");

describe("@constructor@", function () {
  it("should return a promise with @noArguments@", function (done) {
    Nemo()
      .then(function () {
        done(new Error("should have failed with nemoBadDriverProps"));
      })
      .catch(function () {
        done();
      });
  });

  it("should return a promise with @noCallback@", async () => {
    const promise = Nemo({
      driver: chromeConfig,
    });

    assert(promise && promise.then && typeof promise.then === "function");

    const nemo = await promise;
    await nemo.driver.quit();
  });

  it("should throw an error with @noDriverProps@", function (done) {
    Nemo(function (err) {
      if (err.name === "nemoBadDriverProps") {
        done();
        return;
      }
      done(new Error("didnt get back the expected error"));
    });
  });

  it("should launch nemo with @noConfigPath@overrideArg@", async () => {
    delete process.env.nemoBaseDir;

    const nemo = await Nemo({
      driver: chromeConfig,
    });

    assert(nemo.driver);
    await nemo.driver.get("http://www.google.com");
    await nemo.driver.quit();
  });

  it("should launch nemo with @envConfigPath@noOverrideArg@", async () => {
    process.env.nemoBaseDir = __dirname;
    const nemo = await Nemo();

    assert(nemo.driver);
    assert(nemo.data.passThroughFromJson);
    await nemo.driver.get(nemo.data.baseUrl);
    await nemo.driver.quit();
  });

  it("should launch nemo with @argConfigPath@noOverrideArg@", async () => {
    var nemoBaseDir = __dirname;

    const nemo = await Nemo(nemoBaseDir);
    assert(nemo.driver);
    assert(nemo.data.passThroughFromJson);
    await nemo.driver.get(nemo.data.baseUrl);
    await nemo.driver.quit();
  });

  it("should launch nemo with @allArgs@", async () => {
    var nemoBaseDir = __dirname;
    const nemo = await Nemo(nemoBaseDir, {
      data: {
        argPassthrough: true,
      },
    });

    assert(nemo.driver);
    assert(nemo.data.passThroughFromJson);
    assert(nemo.data.argPassthrough);
    await nemo.driver.get(nemo.data.baseUrl);
    await nemo.driver.quit();
  });

  it("should return the resolved nemo object when the callback is called", function (done) {
    var nemoBaseDir = __dirname;
    var returnedNemo = Nemo(
      nemoBaseDir,
      {
        data: {
          argPassthrough: true,
        },
      },
      function (err, nemo) {
        assert.equal(nemo, returnedNemo);
        nemo.driver.quit().then(function () {
          done();
        });
      }
    );
  });

  it("should resolve when a Confit object is the only parameter", async () => {
    var nemoBaseDir = __dirname;
    const confit = await Nemo.Configure(nemoBaseDir, {
      data: {
        argPassthrough: true,
      },
    });
    const nemo = await Nemo(confit);
    assert(nemo && nemo.driver);
    await nemo.driver.quit();
  });
});
