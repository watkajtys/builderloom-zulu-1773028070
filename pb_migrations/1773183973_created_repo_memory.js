/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "cq5gahmu7r3ioyh",
    "created": "2026-03-10 23:06:13.777Z",
    "updated": "2026-03-10 23:06:13.777Z",
    "name": "repo_memory",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "o5x2hliv",
        "name": "type",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "gvy0ytam",
        "name": "content",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "k8e35pat",
        "name": "is_compressed",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cq5gahmu7r3ioyh");

  return dao.deleteCollection(collection);
})
