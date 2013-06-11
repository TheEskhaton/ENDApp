(function($, window, doc){   
    var ENDEvent = function(on, selector, cb){
        this.on = on;
        this.$el = function(){
            return $(selector);
        };
        this.cb = cb;
        this.unbind = function(on){
            this.$el().unbind(on);
        };
        this.trigger = function(){
            this.$el().trigger(this.on);
        }
    };
    var ENDView = function(selector){

        this.views = {};

        this.$el = function(){
            return $(selector);
        };
        this.on = function(evt,cb){
            this.$el().on(evt, cb);
        };
        this.click = function(cb){
            this.$el().click(cb);
        };
        this.hide = function(){
            this.$el().hide();
        };
        this.show = function(){
            this.$el().show();
        };
        this.visible = function(){
            return this.$el().is(':visible');
        };
        var self = this;
        this.addView = function(name, selector){
            this.views[name] = new ENDView(self.$el().find(selector).selector);
        }
    };
    var ENDPage = function(pageSelector){
        var pageRegex = new RegExp(pageSelector, 'i');
        this.isCurrent = function(){
            return window.location.href.match(pageRegex) ? true : false;
        };
    }
    var ENDCurrentPage = function(){
        var pathRegex = /[a-zA-Z\-]+.aspx/;
        this.path = window.location.href.match(pathRegex)[0];
        this.domain = window.location.origin;
        this.aliasPath = window.location.href.replace(new RegExp(this.domain, 'ig'), '');
    };

    var App = function(){
        var _initializers = [];
        var _delayedInitializers = [];
        var _events = [];

        var _globalData = {};
        var _validationMessages = {};

        this.views = {};
        this.pages = {};

        this.start = function(){
            $.each(_initializers, function(ind, cb){
                cb($);
            }); 
            $.each(_delayedInitializers, function(ind, cb){
                cb($);
            }); 
            $.each(_events, function(ind, evt){
                evt.$el().on(evt.on, evt.cb);
            });
        };
        this.currentPage = function(){
            return new ENDCurrentPage();
        }
        this.addInitializer = function(cb, delayed){
           delayed ? _delayedInitializers.push(cb) : _initializers.push(cb);
        };
        this.addEvent = function(on, el, cb){
            _events.push(new ENDEvent(on, el, cb));
        };
        this.addView = function(name, selector){
            this.views[name] = new ENDView(selector);
        };
        this.addPage = function(name, selector){
            this.pages[name] = new ENDPage(selector);
        };
        this.setValidationMessage = function(name, message){
            _validationMessages[name] = message;
        };
        this.getValidationMessage = function(name){
            return _validationMessages[name];
        };
        this.get = function(key){
            return _globalData[key];
        };
        this.set = function(key, value){
            _globalData[key] = value;
        };
    };
    window.ENDApp = {
        App: App,
        ENDEvent: ENDEvent,
        ENDView: ENDView,
        ENDPage: ENDPage
    }
    window.App = new App();
    $(function(){
        var scriptText = '(function(){ window.App.start(); })();';
        var script   = doc.createElement("script");
        script.type  = "text/javascript";
        script.text  = scriptText;
        doc.body.appendChild(script);
    });
})(jQuery, window, document);
