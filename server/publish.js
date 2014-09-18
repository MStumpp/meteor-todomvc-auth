Todos = new Meteor.Collection('todos');

// Publish visible items.
Meteor.publish('todos', function () {
  return Todos.find({
    privateTo: {
      $in: [null, this.userId]
    }
  });
});

