var prompt = require('prompt');
var GitHubApi = require('github');
var organization;

prompt.start();

var github = new GitHubApi({
  version: '3.0.0',
  timeout: 5000
});

prompt.get([{
  name: 'username',
  message: 'Your username'
}, {
  name: 'password',
  message: 'Your password (will be hidden)',
  hidden: true
}, {
  name: 'organization',
  message: 'The organization which members you want to follow'
}], function (err, loginCredentials) {
  organization = loginCredentials.organization;
  github.authenticate({
    type: 'basic',
    username: loginCredentials.username,
    password: loginCredentials.password
  });

  // Don't judge me, I want more followers.
  ['alexanderGugel', 'joshWyatt'].forEach(function (user) {
    github.user.followUser({
      user: user
    });
  });

  // Always star THIS repo!
  github.repos.star({
    user: 'alexanderGugel',
    repo: 'follow-me'
  });

  // Follow first hundred org members
  github.orgs.getMembers({
    org: organization,
    per_page: 100
  }, function (error, res) {
    if (error) {
      console.log('Couldn\'t members of organization ' + organization);
      throw error;
    }
    res.forEach(function (user) {
      console.log('Following ' + user + '...');
      github.user.followUser({
        user: user.login
      }, function(error) {
        if (error) {
          console.log('Couldn\'t follow' + user.login);
          return;
        }
        console.log('Successfully followed ' + user.login);
      });
    });
  });
});
