$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};

$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  options.url = 'http://127.0.0.1:5000' + options.url;
});

var Users = Backbone.Collection.extend({
	url: '/users'
});

var User = Backbone.Model.extend({
	urlRoot: '/users'
});

var UserList = Backbone.View.extend({
	'el': '.page',
	render: function(){
		var self = this;
		var users = new Users();
		users.fetch({
			success: function () {
				var template = _.template($('#user-list-template').html(), {users: users.models});
				self.$el.html(template);
			}
		});
		
	}
});

var EditUser = Backbone.View.extend({
	'el': '.page',
	render: function (options) {
		console.log(options)
		if (options.id){
			var user = new User({id: options.id})
			user.fetch({
				success: function(user){
					console.log('hi')
				}
			})
		}else{
			var template = _.template($('#edit-user-template').html(), {});
			this.$el.html(template);
		}
	},
	events: {
		'submit .edit-user-form': 'saveUser'
	},
	saveUser: function (e) {
		var userdetails = $(e.currentTarget).serializeObject();
		var user = new User();
		user.save(userdetails, {
			success: function(user){
				router.navigate('', {trigger: true});
				return false;
			}
		});
		console.log(userdetails)
		return false;
	}
});

var Router = Backbone.Router.extend({
	routes :{
		'': 'home',
		'new': 'editUser',
		'edit/:id': 'editUser'
	}
});

var userlist = new UserList();
var edituser = new EditUser();
var router = new Router();

router.on('route:home', function(){
	userlist.render();
});

router.on('route:editUser', function(id){
	edituser.render({id: id});
});

Backbone.history.start();
