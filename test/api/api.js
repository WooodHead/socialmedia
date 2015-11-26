var request = require('supertest');
var _ = require('underscore');
var app = require('../../app');

var chai = require('chai');
var should = chai.should();

request = request(app);

var defaultItems = [
    {
        "id":"8a1330c93e31b8af013e360d6a2106ea",
        "content":{
            "message":"Her er den perfekte gave",
            "id":"8a1330c93e31b8af013e360d6a2106ea",
            "network":"facebook",
            "postType":"photo",
            "media":{
                "fileName":"konfirmationsgave til hende.jpg",
                "url":"http://s3.amazonaws.com/mingler.falcon.scheduled_post_pictures/25c69cba-8881-4147-9fc9-d61a9c2de676"
            }
        },
        "tags":[
            "converstaion",
            "sales",
            "qwer"
        ],
        "status":"draft",
        "channels":[
            {
                "name":"Konfirmanden",
                "id":433104606739910
            }
        ],
        "scheduled":"2013-08-08T08:00:00.000Z",
        "geo":{
            "countries":[
                {
                    "value":"Afghanistan",
                    "key":"134"
                }
            ],
            "languages":[
                {
                    "value":"Afrikaans",
                    "key":"31"
                }
            ],
            "cities":[

            ],
            "regions":[

            ]
        }
    },
    {
        "id":"apsidf",
        "content":{
            "media":{
                "fileName":"http://www.quickmeme.com/img/1a/1a5db932bf1d0834fb118120de873d133e3c6c82d01f674cd7f8f18fa824b3dc.jpg",
                "fileUrl":"http://www.quickmeme.com/img/1a/1a5db932bf1d0834fb118120de873d133e3c6c82d01f674cd7f8f18fa824b3dc.jpg",
                "url":"http://www.quickmeme.com/img/1a/1a5db932bf1d0834fb118120de873d133e3c6c82d01f674cd7f8f18fa824b3dc.jpg"
            },
            "message":"asiodnf",
            "network":"asiodnf",
            "postType":"qipdfiaspdf"
        },
        "tags":[
            "aosjdnf",
            " oaisndf",
            " aousdf",
            " aosidf"
        ],
        "status":"aosdjnfasodjf",
        "scheduled":"tomorrow"
    },
    {
        "id":"testingtesting",
        "content":{
            "media":{
                "fileName":"nope",
                "fileUrl":"https://cdn.scratch.mit.edu/static/site/users/avatars/393/0818.png",
                "url":"https://s3.amazonaws.com/prod_sussleimg/Johnny-Derp-94d9bea1c0577a008f4237e006942e72.png"
            },
            "message":"testtest",
            "network":"test",
            "postType":"bleh"
        },
        "tags":[
            "test",
            " test",
            " test2"
        ],
        "status":"draft"
    },
    {
        "id":"wine",
        "content":{
            "media":{
                "fileName":"wine",
                "url":"http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Apps-wine-icon.png"
            },
            "message":"wine",
            "network":"wine",
            "postType":"wine"
        },
        "tags":[
            "wine",
            "wine",
            "wine"
        ],
        "status":"wine"
    },
    {
        "id":"coffee",
        "content":{
            "media":{
                "fileName":"coffee",
                "url":"http://www.lighterliving.com/uploads/images/CoffeeGrounds.jpg"
            },
            "message":"coffee",
            "network":"coffee",
            "postType":"coffee"
        },
        "tags":[
            "coffee"
        ],
        "status":"coffee"
    },
    {
        "id":"snow",
        "content":{
            "media":{
                "fileName":"snow",
                "url":"http://pix.iemoji.com/images/emoji/apple/8.3/256/cloud-with-snow.png"
            },
            "message":"snow",
            "network":"snow",
            "postType":"snow"
        },
        "tags":[
            "snow",
            "snow"
        ],
        "status":"snow"
    }
];

describe('Check default items', function() {
  it(defaultItems.map(item => item.id), function(done) {
    request
      .get('/api/items/')
      .expect(200)
      .end(function(err, res) {
        _.difference(res.body, defaultItems.map(item => item.id)).should.be.empty;
        done();
      });
  });
});

describe('Create new items', function() {
  var items = [
    { content: { message: 'hello'} },
    { tags: [ 'bad' ] },
    { status: 'cheese' }
  ];

  items.forEach(function(item) {
    it(JSON.stringify(item), function(done) {
      request
        .post('/api/items/')
        .send(item)
        .expect(200, done);
    });
  });
});

// TODO: Check that the returned object is the one we expect
describe('Retrieve items', function() {
  defaultItems.forEach(function(item) {
    it(item.id, function(done) {
      request
        .get('/api/items/' + item.id)
        .expect(200, done)
    });
  });
});

describe('Retrieve items that do not exist', function() {
  ['cat', 'dog', 'mouse'].forEach(function(id) {
    it(id, function(done) {
      request
        .get('/api/items/' + id)
        .expect(404, done);
    });
  });
});

describe('Edit items', function() {
  defaultItems.forEach(function(item) {
    it(item.id, function(done) {
      request
        .put('/api/items/' + item.id)
        .send({ status: 'eating cheese' })
        .expect(200, done);
    });
  });
});

describe('Edit items that do not exist', function() {
  var items = [
    { id: 'x', hello: 'kitty' },
    { id: 'y', goodbye: 'alligator' }
  ];

  items.forEach(function(item) {
    it(JSON.stringify(item), function(done) {
      request
        .put('/api/items/' + item.id)
        .send(item)
        .expect(200, done);
    });
  });
});

describe('Delete items', function() {
  it(defaultItems[0].id, function(done) {
    request
      .del('/api/items/' + defaultItems[0].id)
      .expect(200, done);
  });
});

describe('Delete items that do not exist', function() {
  var ids = ['q', 'w', 'e', 'r', 't', 'y'];

  ids.forEach(function(id) {
    it(id, function(done) {
      request
        .del('/api/items/' + defaultItems[0].id)
        .expect(404, done);
    });
  });
});

describe('Replace items', function() {
  var items = [ { message: 'hello' }, { tag: 'world'} ];

  it(JSON.stringify(items), function(done) {
    request
      .put('/api/items/')
      .send(items)
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.length(items.length);
        done();
      });
  });

});

describe('Delete items', function(done) {
  it('All of them', function(done) {
    request
      .del('/api/items')
      .expect(200, done);
  });
});

describe('Delete items that do not exist', function() {
  ['moose', 'dragon', 'dragonfly'].forEach(function(id) {
    it(id, function(done) {
      request
        .put('/api/item/' + id)
        .send({ status: 'does not exist' })
        .expect(404, done);
    });
  });
});
