// Import des nodeJs dependencies
import { describe, it } from "node:test";
import assert from "node:assert";

// Import des constantes et fonctions à tester
// "*" permet de tout importer
// "as" permet d'encapsuler l'ensemble.
import * as npmTest from "../index.js";


describe("compareVersions function", () => {
  it("Major should be available", () => {
    const result = npmTest.compareVersions("9.8.7", "1.2.3");
    assert.equal(result, "Major 9.8.7 available");
  });
  it("Minor should be available", () => {
    const result = npmTest.compareVersions("9.8.7", "9.6.5");
    assert.equal(result, "Minor 9.8.7 available");
  });
  it("No update available for patch version", () => {
    const result = npmTest.compareVersions("9.8.7", "9.8.6");
    assert.equal(result, "No update available");
  });
  it("No update available for equal version", () => {
    const result = npmTest.compareVersions("9.8.7", "9.8.7");
    assert.equal(result, "No update available");
  });
  it("Should throw an error", () => {
    assert.throws(() => {
      npmTest.compareVersions("abc", "9.8.7");
    }, {
      name: "Error",
      message: "Function compareVersions Process error"
    });
  });
});
