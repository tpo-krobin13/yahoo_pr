const  chai = require('chai');
chai.use(require('chai-string'));
chai.use(require('chai-fs'));
const expect = chai.expect;


const path = require("path");
const cfg = require('../config/');

const fsPromise = require("fs").promises;
const axios = require("axios").default;

const Procmonrest = require("procmonrest");



describe("an end-to-end test", function () {
  const serverProcess = new Procmonrest({
    command: "npm start",
    waitFor: /listening on port \d{2|3|4|5}/i,
  });

  before(() => {
    return serverProcess.start();
  });

  after(() => {
    if (serverProcess.isRunning) {
      return serverProcess.stop();
    }
  });
  describe("server config", function() {
    
    it("should have a valid host url", async function () {
      //Given-When
      const actual = cfg.domain;
      // Then
      expect(actual).to.not.equal('');
    });


  });

  describe("Yahoo app loads", function () {
    const serverUrl = `http://${cfg.domain}:${cfg.port}` ;
    it("default url responds", async function () {
      //given 
      const actual = (await axios.get(serverUrl)).status;

      //when 
      const expected = 200;
      //then
      expect(actual).to.equal(expected);
    });
  });
  describe("home page", async function () {
    const serverUrl = `http://${cfg.domain}:${cfg.port}` ;
    xit("should list log in options", async function () {
      //given 
      const actual = (await axios.get(serverUrl)).status;

      //when 
      const expected = 200;
      //then
      expect(actual).to.equal(expected);
    });
  });
});
