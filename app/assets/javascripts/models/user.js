(function() {
  var User, UserCollection;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  User = (function() {

    __extends(User, Backbone.Model);

    function User() {
      User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.authenticated = false;

    User.prototype.syncing = false;

    User.prototype.lastSync = null;

    User.prototype.lastSyncStatus = null;

    User.prototype.startSync = function() {
      this.syncing = true;
      return Clients.bridgeSync();
    };

    return User;

  })();

  UserCollection = (function() {

    __extends(UserCollection, Backbone.Collection);

    function UserCollection() {
      UserCollection.__super__.constructor.apply(this, arguments);
    }

    UserCollection.prototype.model = User;

    UserCollection.prototype.currentUser = false;

    UserCollection.prototype.secured = function() {
      return Clients.localStorage.key;
    };

    UserCollection.prototype.secure = function(passphrase) {
      console.log('calling secuire with ' + passphrase);
      return Clients.localStorage = new Store('clients', passphrase);
    };

    UserCollection.prototype.authenticate = function(login, password) {
      var _this = this;
      return $.ajax('/api/v1/users/auth.json', {
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: {
          login: login,
          password: password
        },
        success: function(data) {
          _this.currentUser = new User(data);
          _this.currentUser.authenticated = true;
          _this.currentUser.startSync();
          return _this.trigger('auth:authenticated', _this.currentUser);
        },
        error: function(jqXHR, textStatus) {
          switch (jqXHR.status) {
            case 401:
              return _this.trigger('auth:unauthorised');
            case 408:
              return _this.trigger('auth:timeout');
            case 500:
              return _this.trigger('auth:error:bridge');
            default:
              return _this.trigger('auth:error');
          }
        }
      });
    };

    return UserCollection;

  })();

  this.Users = new UserCollection;

}).call(this);
