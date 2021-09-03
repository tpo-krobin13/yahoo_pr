const  chai = require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;


const path = require("path");
const cfg = require('../config/');

const fsPromise = require("fs").promises;
const axios = require("axios").default;

const Procmonrest = require("procmonrest");

const serverUrl = cfg.hostUrl + ":" +cfg.port ;




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
    console.log('server redirect url: '+ cfg.yahooRedirectUrl);
    it("should have valid http port number", async function () {
      //Given/When
      const actual = parseInt(cfg.port, 10);
      // Then
      expect(actual).to.be.a('number');
    });
    it("should have valid https port number", async function () {
      //Given/When
      const actual = parseInt(cfg.sslPort, 10);
      // Then
      expect(actual).to.be.a('number');
    });
    
    it("should have a valid host url", async function () {
      //Given
      //When
      const actual = cfg.hostUrl;
  
      // Then
      //d1.should.startWith.d2
      expect(actual.startsWith('http://'));
    });
  });

  describe("Yahoo player search", function () {
    it("default url responds", async function () {
      //given 
      const actual = (await axios.get(serverUrl)).status;

      //when 
      const expected = 200;
      //then
      expect(actual).to.equal(expected);
    });
  });
});
