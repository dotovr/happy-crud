'use strict';
const BaseController = require('../api/base-controller');
const Sqlite3Model = require('../api/sqlite3-model');
const CrudApi = require('../api');
const BaseTest = require('./base-test');
const should = require('should');
const Sqlite3 = require('sqlite3');

class ControllerA extends BaseController {
} // class ModelA

class TestA extends BaseTest {

setupDb() {
  const db = new Sqlite3.Database(':memory:');
  db.serialize(function() {
    db.run("CREATE TABLE testa (id INTEGER PRIMARY KEY AUTOINCREMENT, a TEXT, b TEXT, c INTEGER)");
  });
  return db;
}

constructor(server) {
  super(server);
  const schema = {
    id: {
      type: Number,
      autoIncrement: true
    },
    a: String,
    b: String,
    c: Number,
  }

  const options = {
    word: 'user',
    path: '/api',
    mount: '/',
  }

  const db = this.setupDb();
  const table = 'testa';
  const model = new Sqlite3Model(db, table, schema);
  const ctrl = new ControllerA(model);
  const api = new CrudApi(server, ctrl, options);

}

doTest() {
  const self = this;
  describe('Basic', ()=> {
    it('should be able to create a record', (done)=> {
      const request = self.createPostRequest({
        url: 'http://localhost:3030/api/users',
        payload: {
          a:'a', b: 'b', c: 1
        }
      });
      self.server.inject(request, (response) => {
        response.statusCode.should.equal(200);
        const r = JSON.parse(response.payload);
        r.lastId.should.equal(1);
        done();
      });
    });

    it('should be able to create another record with correct lastId', (done)=> {
      const request = self.createPostRequest({
        url: 'http://localhost:3030/api/users',
        payload: {
          a:'a', b: 'b', c: 1
        }
      });
      self.server.inject(request, (response) => {
        response.statusCode.should.equal(200);
        const r = JSON.parse(response.payload);
        r.lastId.should.equal(2);
        done();
      });
    });

  });
}

} // class TestA

module.exports = TestA;
