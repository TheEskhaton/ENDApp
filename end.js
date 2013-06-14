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
        this.find = function(selector){
            return this.$el().find(selector);
        };
        this.on = function(evt,cb){
            this.$el().on(evt, cb);
        };
        this.trigger = function(evt){
            this.$el().trigger(evt);    
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
        this.each = function(fn){
            this.$el().each(fn);
        }
        this.addView = function(name, selector){
            this.views[name] = new ENDView(this.$el().find(selector).selector);
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
        this.page = window.location.href.match(pathRegex)[0];
        this.domain = window.location.origin;
        this.absoluteUrl = window.location.href.replace(new RegExp(this.domain, 'ig'), '');
    };

    var ENDGlobalEvent = function(name){
        this.name = name;
        this.events = [];
    };

    var App = function(){
        var _initializers = [];
        var _delayedInitializers = [];
        var _events = [];

        var _globalEvents = [];
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
        this.on = function(evtName, fn){
            var hasEvents = false;
            $.each(_globalEvents, function(ind, val){
                if(val.name === evtName){
                    val.events.push(fn);
                    hasEvents = true;
                }
            });
            if(!hasEvents){
                var newGlobal = new ENDGlobalEvent(evtName);
                newGlobal.events.push(fn);
                _globalEvents.push(newGlobal);
            }
        };
        this.unbind = function(evtName){
            $.each(_globalEvents, function(ind, evt){
                if(evt.name == evtName){
                    evt.events = [];
                }
            });
        }
        this.trigger = function(evtName){
            $.each(_globalEvents, function(ind, val){
                if(val.name === evtName){
                    $.each(val.events, function(ind, cb){
                        cb();
                    });
                }
            });
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
