"use Strict";

// Import des nodeJs dependencies
import { describe, it } from "node:test";
import assert from "node:assert";

// Import des constantes et fonctions à tester
import npmTest from "../index.js";


describe("fetchData function", () => {
  it("Should return a status Code 200 for \"OK\"", async() => {
    const testUrl = "https://registry.npmjs.org/";
    const result = await npmTest.fetchData(testUrl);
    assert.strictEqual(result.statusCode, 200);
  });
  it("Should return a body", async() => {
    const testUrl = "https://registry.npmjs.org/";
    const result = await npmTest.fetchData(testUrl);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(result, "body"), true);
  });
  it("Should throw an error if request failed", async() => {
    const wrongTestUrl = "https://wrong.registry.npmjs.org/";
    await assert.rejects(async() => {
      await npmTest.fetchData(wrongTestUrl);
    }, {
      name: "Error"
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
