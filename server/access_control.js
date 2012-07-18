Meteor.startup(function() {
  var canModify = function(userId, todos) {
    return _.all(todos, function(todo) {
      return !todo.privateTo || todo.privateTo === userId;
    });
  };

  Todos.allow({
    insert: function () { return true; },
    update: canModify,
    remove: canModify,
    fetch: ['privateTo']
  });
});
