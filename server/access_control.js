Meteor.startup(function() {
  var canModify = function(userId, selected, todos) {
    // console.log(arguments);
    return _.all(todos, function(todo) {
      var isAllowed = (!todo.privateTo || todo.privateTo === Meteor.userId);
      return !todo.privateTo || todo.privateTo === Meteor.userId;
    });
  };

  enableMogger();

  Todos.allow({
    insert: function () { return true; },
    update: canModify,
    remove: canModify,
    fetch: ['privateTo']
  });
});
