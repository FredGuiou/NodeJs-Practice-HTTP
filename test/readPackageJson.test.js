// Import des nodeJs dependencies
import { describe, it } from "node:test";
import assert from "node:assert";

// Import des constantes et fonctions à tester
// "*" permet de tout importer
// "as" permet d'encapsuler l'ensemble.
import * as npmTest from "../index.js";

describe("readPackageJson function", () => {
  it("Should parse dependencies", () => {
    const result = npmTest.readPackageJson();

    const expectedResult = {
      "@fast-csv/parse": "^4.3.6",
      "@fastify/autoload": "^5.7.1",
      "@fastify/cookie": "^8.3.0",
      "@fastify/multipart": "^7.4.2",
      dayjs: "^1.11.7",
      dotenv: "^16.0.3",
      "fast-json-patch": "^3.1.1",
      fastify: "^4.12.0",
      "fastify-plugin": "^4.3.0",
      "form-auto-content": "^3.1.0",
      jschardet: "^3.0.0",
      json2csv: "^5.0.7",
      jsonwebtoken: "^9.0.0",
      klona: "^1.0.0",
      "legacy-encoding": "^3.0.0",
      "lodash.omit": "^4.2.0",
      "lodash.sumby": "^4.1.0",
      "make-promises-safe": "^5.1.0",
      yauzl: "^1.9.0",
      zup: "^0.0.1"
    };

    assert.deepEqual(result, expectedResult);
  });
});
