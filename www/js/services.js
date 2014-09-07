angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('Searchlist', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var searchlist = [
    { id: 0, nationality: 'American', gender:'male' },
    { id: 1, nationality: 'American',gender:'female' },
    { id: 2, nationality: 'Vietnamese',gender:'male' },
    { id: 3, nationality: 'Vietnamese',gender:'female' },
    { id: 4, nationality: 'Brazil', gender:'male' },
    { id: 5, nationality: 'Brazil',gender:'female' },
    { id: 6, nationality: 'Nepal',gender:'male' },
    { id: 7, nationality: 'Nepal',gender:'female' }
  ];

  return {
    all: function() {
      return searchlist;
    },
    get: function(id) {
      // Simple index lookup
      return searchlist[id];
    }
  }
});

