Meteor.methods({
  enterGame: function(name) {
    check(name, String);
    name = name.toUpperCase().trim();
    if (!name.length) {
      throw new Meteor.Error(412, "Nome em branco");
    } else if (name.match(/[^0-9a-zA-Z\s]+/)) {
      throw new Meteor.Error(412, "Nome esta zuado! Tente um novo :)");
    } else if (Players.findOne({name: name})) {
      throw new Meteor.Error(412, "Este nome já existe, tente um novo nome");
    } else if (Games.isRunning()) {
      throw new Meteor.Error(412, "Aguarde o próximo jogo!");
    } else {
      if (!Games.exists()) {
        Games.start();
        SyncedCron.start();
      }
      return Players.create(name);
    }
  },
  replayGame: function(_id) {
    check(_id, String);
    Players.replay(_id);
    if (!Games.exists()) {
      Games.start();
      SyncedCron.start();
    }
  },
  cancelWaitGame: function(_id) {
    check(_id, String);
    Players.remove({_id: _id});
  },
  clearGame: function() {
    SyncedCron.pause();
    Players.clear();
    Games.stopGame();
  },
  clickClickClick: function(_id) {
    check(_id, String);
    Players.click(_id);
  }
});