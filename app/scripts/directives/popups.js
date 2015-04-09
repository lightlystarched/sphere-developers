'use strict';
angular.module('developersApp')
.directive('spPopup', function () {
  return {
    restrict: 'A',
    scope: {
      spPopup: '='
    },
    link: function (scope, attrs, element) {
      element.on('click', function (e) {
        e.preventDefault();
        scope.spPopup = true;
      });
    }
  };
})
.directive('loginOpener', function (UserService, PopupService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if(scope.isInline) {
        return;
      }

      element.on('click', function(e) {
        e.preventDefault();
        PopupService.openPopup(scope, {
          templateUrl: 'views/popups/login.html',
          customClass: 'login_popup',
          closeButton: false,
          //_topPosition: 100,
          _width: 340
        });
      });
    }
  };
})
.directive('login', function ($location, UserService, PopupService, AnalyticsService, $compile, LocalStorageService) {
  // Captcha data
  var timestamp = new Date().getTime(),
    location = $location.host(),
    randomVal = timestamp + '' + location,
    captchaImage = 'https://omakase.outbrain.com/Omakase/api/captcha?key='+randomVal+'.jpgx',
    showCaptcha = false;

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      
      var newCaptcha = function (firstTime) {
        timestamp = new Date().getTime();
        randomVal = timestamp + '' + location;
        captchaImage = 'https://omakase.outbrain.com/Omakase/api/captcha?key='+randomVal+'.jpgx';

        scope.showCaptcha = showCaptcha = true;
        scope.captchaImage = captchaImage;
        scope.captcha = null;

        if(!scope.$$phase) {
          scope.$apply();
        }
      };

      scope.showCaptcha = showCaptcha;
      if (scope.showCaptcha) {
        newCaptcha();
      }

      element.on('submit', 'form', function(e) {
        e.preventDefault();
        var elm = angular.element(this);
        var username = elm.find('input[name=username]').val();
        var password = elm.find('input[name=password]').val();
        var captcha = null;
        var captchaValue = elm.find('input[name=captcha]') ? elm.find('input[name=captcha]').val() : null;
        if (captchaValue) {
          captcha = {
            captchaValue: captchaValue,
            captchaImage: captchaImage
          };
        }
        elm.parent().addClass('submitted');
        elm.parents('.popup_wrapper').addClass('isLoading');
        elm.parent().find('.loading_wrapper').show();
        elm.find('input, textarea').blur();

        UserService.login(username, password, null, captcha).then(function(result) {
          if(!result.data.success) {
            angular.forEach(element.find('ul'), function (list) {
              if (angular.element(list).hasClass('sp_validation_msgs')) {
                angular.element(list).addClass('errors').html('<li>'+result.data.message+'</span>');
              }
            });
            //if (LocalStorageService.get('enableCaptcha')) {
              if (result.data.data.captchaStatus === 'Captcha-blocked' && element.find('.captcha_row').length === 0) {
                newCaptcha(true);
              } else if(result.data.data.captchaStatus === 'Captcha-validation-failure' || (result.data.data.captchaStatus === 'Captcha-blocked' && element.find('.captcha_row').length !== 0)) {
                newCaptcha(false);
              }
            //}
            elm.parent().removeClass('submitted');
            elm.parents('.popup_wrapper').removeClass('isLoading');
            elm.parent().find('.loading_wrapper').hide();
          }
          else {
            AnalyticsService.track_event('Engagement Action', 'Sign_In');
            if(!scope.isInline) {
              PopupService.closePopup();
            }
          }
        }, function(response) {
          element.find('.form_row:last').find('.error').remove();
          element.find('.form_row:last').append('<span class="error">Unable to sign in. Please try again</span>');
          elm.parent().removeClass('submitted');
          elm.parents('.popup_wrapper').removeClass('isLoading');
          elm.parent().find('.loading_wrapper').hide();
        });
      });
    }
  };
})
.directive('registerOpener', function (UserService, PopupService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if(scope.isInline) {
        return;
      }

      element.on('click', function(e) {
        e.preventDefault();
        PopupService.openPopup(scope, {
          templateUrl: 'views/popups/register.html',
          customClass: 'register_popup',
          closeButton: false,
          //_topPosition: 100,
          _width: 340
        });
      });
    }
  };
})
.directive('register', function ($location, UserService, PopupService, AnalyticsService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('submit', 'form', function(e) {
        e.preventDefault();
        var elm = angular.element(this);
        var name = elm.find('input[name=name]').val();
        var password = elm.find('input[name=password]').val();
        var email = elm.find('input[name=email]').val();

        if(name && password && email && elm.find('.error').length <= 0) {
          elm.parent().addClass('submitted');
          elm.parents('.popup_wrapper').addClass('isLoading');
          elm.parent().find('.loading_wrapper').show();
          elm.find('input, textarea').blur();

          var params = {
            email: email,
            name: name,
            password: password
          };

          UserService.register(params).then(function(result) {
            if(!result.data.success) {
              angular.forEach(element.find('ul'), function (list) {
                if (angular.element(list).hasClass('sp_validation_msgs')) {
                  angular.element(list).addClass('errors').html('<li>'+result.data.message+'</span>');
                }
              });
              elm.parent().removeClass('submitted');
              elm.parents('.popup_wrapper').removeClass('isLoading');
              elm.parent().find('.loading_wrapper').hide();
            }
            else {
              AnalyticsService.track_event('Conversion Action', 'Register');

              if(scope.isInline) {
                $location.path('/account/invite_friends');
              }
              else {
                // Open invite friends popup
                PopupService.openPopup(scope, {
                  templateUrl: 'views/popups/invite_friends.html',
                  customClass: 'invite_friends_popup',
                  closeButton: false,
                  //_topPosition: 100,
                  _width: 470,
                  inviter: params.name || ''
                });
              }
            }
          }, function(response) {
            element.find('.form_row:last').find('.error').remove();
            element.find('.form_row:last').append('<span class="error">Unable to register. Please try again</span>');
            elm.parent().removeClass('submitted');
            elm.parents('.popup_wrapper').removeClass('isLoading');
            elm.parent().find('.loading_wrapper').hide();
          });
        }
      });
    }
  };
})
.directive('registerEmail', function(UserService) {
    return {
      restrict: 'A',
      scope: {},
      controller: function($scope) {
        $scope.registerEmail = '';
        $scope.isInformed = true;
        $scope.emailRegistered = false;
      },
      templateUrl: 'views/register_email.html',
      link: function (scope, element) {
        scope.submit = function() {
          var email = scope.registerEmail;
          if(email && scope.isInformed && element.find('.error').length <= 0) {
            UserService.registerEmail(email).then(function(result) {
//            if(!result.data.success) {
              scope.emailRegistered = true;
//            }
            });
          }
        };
      }
    };
  })
.directive('contactOpener', function (UserService, PopupService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if(scope.isInline) {
        return;
      }

      element.on('click', function(e) {
        e.preventDefault();
        PopupService.openPopup(scope, {
          templateUrl: 'views/popups/contact.html',
          customClass: 'contact_popup',
          closeButton: false,
          fromBtn: true,
          //_topPosition: 100,
          _width: 340,
          email: scope.userInfo && scope.userInfo.email || ''
        });
      });
    }
  };
})
.directive('contact', function (UserService, PopupService, AnalyticsService, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('submit', 'form', function(e) {
        e.preventDefault();
        var elm = angular.element(this);
        var fromEmail = elm.find('input[name=fromEmail]').val();
        var subject = elm.find('select[name=subject]').val();
        var content = elm.find('textarea[name=content]').val();

        if(fromEmail && content && elm.find('.error').length <= 0) {
          elm.parent().addClass('submitted');
          elm.parents('.popup_wrapper').addClass('isLoading');
          elm.parent().find('.loading_wrapper').show();
          elm.find('input, textarea').blur();

          var params = {
            fromEmail: fromEmail,
            subject: subject,
            content: content
          };

          UserService.contact(params).then(function(result) {
            if(!result.data.success) {
              angular.forEach(element.find('ul'), function (list) {
                if (angular.element(list).hasClass('sp_validation_msgs')) {
                  angular.element(list).addClass('errors').html('<li>'+result.data.message+'</span>');
                }
              });
              elm.parent().removeClass('submitted');
              elm.parents('.popup_wrapper').removeClass('isLoading');
              elm.parent().find('.loading_wrapper').hide();
            }
            else {
              AnalyticsService.track_event('Engagement Action', 'Contact');
              angular.element('<p class="thankyou">Thank you for contacting us! <br />We\'ll be in touch with you soon.</p>').insertAfter(elm);
              elm.remove();

              $timeout(function() {
                PopupService.closePopup();
              }, 3000);
            }
          }, function(response) {
            element.find('.form_row:last').find('.error').remove();
            element.find('.form_row:last').append('<span class="error">Unable to send contact form. Please try again</span>');
            elm.parent().removeClass('submitted');
            elm.parents('.popup_wrapper').removeClass('isLoading');
            elm.parent().find('.loading_wrapper').hide();
          });
        }
      });
    }
  };
})
.directive('inviteOpener', function (UserService, PopupService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if(scope.isInline) {
        return;
      }

      element.on('click', function(e) {
        e.preventDefault();
        PopupService.openPopup(scope, {
          templateUrl: 'views/popups/invite_friends.html',
          customClass: 'invite_friends_popup',
          closeButton: false,
          fromBtn: true,
          //_topPosition: 100,
          _width: 470,
          inviter: scope.userInfo && scope.userInfo.name || ''
        });
      });
    }
  };
})
.directive('invite', function (UserService, PopupService, AnalyticsService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('submit', 'form', function(e) {
        e.preventDefault();
        var elm = angular.element(this);
        var inviter = elm.find('input[name=inviter]').val();
        var invites = elm.find('input[name=invites]').val() ? elm.find('input[name=invites]').val().split(/[ ,;\n]/) : [];
        var invitesArr = [];

        var emailRegex = /^[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*$/;
        for(var i = 0; i < invites.length; i++) {
          invites[i] = angular.element.trim(invites[i]);
          if(invites[i] !== '' && invites[i].search(emailRegex) >= 0) {
            invitesArr.push(invites[i]);
          }
        }

        if(inviter && invitesArr.length > 0 && elm.find('.error').length <= 0) {
          elm.parent().addClass('submitted');
          elm.parents('.popup_wrapper').addClass('isLoading');
          elm.parent().find('.loading_wrapper').show();
          elm.find('input, textarea').blur();

          var params = {
            inviter: inviter,
            invites: invitesArr
          };

          UserService.inviteFriends(params).then(function(result) {
            if(!result.data.success) {
              angular.forEach(element.find('ul'), function (list) {
                if (angular.element(list).hasClass('sp_validation_msgs')) {
                  angular.element(list).addClass('errors').html('<li>'+result.data.message+'</span>');
                }
              });
              elm.parent().removeClass('submitted');
              elm.parents('.popup_wrapper').removeClass('isLoading');
              elm.parent().find('.loading_wrapper').hide();
            }
            else {
              AnalyticsService.track_event('Engagement Action', 'Invite_Friends');
              angular.element('<p class="thankyou">Thank you for<br /> inviting your friends!</p>').insertAfter(elm);
              elm.remove();
            }
          }, function(response) {
            element.find('.form_row:last').find('.error').remove();
            element.find('.form_row:last').append('<span class="error">Unable to send invites. Please try again</span>');
            elm.parent().removeClass('submitted');
            elm.parents('.popup_wrapper').removeClass('isLoading');
            elm.parent().find('.loading_wrapper').hide();
          });
        }
      });
    }
  };
})
.directive('shareBtn', function($http, $q, $timeout, UserService) {
  return {
    restrict: 'A',
    link: function($scope, element, attr) {
      element.on('click', function(e) {
        e.preventDefault();
        var type = element.data('action').replace(/\'/g, '');
        var shortUrl = element.data('shorturl');
        var url = null;
        var left = 20;
        var top = 20;
        var width = 500;
        var height = 400;
        var content = $scope.doc && $scope.doc.content ? $scope.doc.content : element.data('content');
        var source = $scope.doc && $scope.doc.source ? $scope.doc.source : '';
        var thumbnail = $scope.doc && $scope.doc.thumb ? $scope.doc.thumb : '';
        var docUrl = $scope.doc && $scope.doc.url ? $scope.doc.url : element.data('url');
        var origDocUrl = $scope.doc && $scope.doc.origURL ? $scope.doc.origURL : element.data('url');

        var openPopup = function() {
          var popup = window.open(url, '', 'scrollbars=no,height=' + height + ',width=' + width +',left=' + left + ',top=' + top);
          if (typeof popop !== 'undefined' && window.focus) {
            popup.focus();
          }
        };

        switch(type) {
          case 'fb':
            url = 'https://www.facebook.com/sharer/sharer.php?u=';
            break;
          case 'twitter':
            url = 'https://twitter.com/share?text=' + content + ' ' + source + '&via=Sphere&url=';
            break;
          case 'email':
            height = 600;
            url = 'https://www.sphere.com/s/share/email.html?docImageUrl=' + thumbnail + '&docTitle=' + content + '&sourceName=' + source;
            if(UserService.getIsAuthenticated()) {
              url += '&fromEmail=' + UserService.getUserInfo().email;
            }
            url += '&docUrl=';
            break;
        }

        if(shortUrl) {
          // Request for shorten URL (with bit.ly)
          var request = $http.get('https://omakase.outbrain.com/Omakase/api/surl?url=' + encodeURIComponent(origDocUrl));

          request.then(function(result) {
            if(result.data.success && result.data.data) {
              url += result.data.data;
            }
            else {
              url += encodeURIComponent($scope.doc.url);
            }
            // Open share action in popup
            openPopup(url);
          });
        }
        else {
          url += encodeURIComponent(origDocUrl);
          openPopup(url);
        }

      });
    }
  };
});