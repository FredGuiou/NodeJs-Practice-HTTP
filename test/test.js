"use Strict";

// Import des nodeJs dependencies
import { describe, it } from "node:test";
import assert from "node:assert";

// Import des third party dependencies
import { MockAgent, setGlobalDispatcher } from "undici";

// Import des constantes et fonctions à tester
import * as npmTest from "../index.js";

// Import des constantes
const kNpmApiUrl = "https://registry.npmjs.org";

// Paramétrage du MockAgent
const mockAgent = new MockAgent();
mockAgent.disableNetConnect();
const mockPool = mockAgent.get(kNpmApiUrl);
const mockResult = { result: "ok" };
mockPool.intercept({ path: "/pg" }).reply(200, mockResult, {
  headers: { "Content-Type": "application/json" }
}).persist();
mockPool.intercept({ path: "/toto" }).reply(500, {}, {
  headers: { "Content-Type": "application/json" }
}).persist();
setGlobalDispatcher(mockAgent);


describe("fetchData function", () => {
  it("Should return a status Code 200 for \"OK\"", async() => {
    const result = await npmTest.fetchData(`${kNpmApiUrl}/pg`);
    assert.equal(result.statusCode, 200);
  });
  it("Should return a body", async() => {
    const result = await npmTest.fetchData(`${kNpmApiUrl}/pg`);
    assert.deepEqual(result.body, mockResult);
  });
  it("Should throw an error if request failed", async() => {
    await assert.rejects(async() => {
      await npmTest.fetchData(`${kNpmApiUrl}/toto`);
    }, {
      name: "Error",
      message: "HTTP request failed : status code 500"
    });
  });
});

// describe("getLatestVersion function", () => {
//   it("", () => {

//   });

// });

// describe("compareVersions function", () => {
//   it("", () => {

//   });

// });
// describe("readPackageJson function", () => {
//   it("", () => {

//   });

// });
// describe("getPackages function", () => {
//   it("", () => {

//   });

// });
// describe("displayGetPackages function", () => {
//   it("", () => {

//   });

// });
