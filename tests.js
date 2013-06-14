describe('App', function(){
    var testArray = [];
    var testVar;
    it('should exist', function(){
        expect(window.App).to.exist(); 

        window.App.addInitializer(function($){
            testArray.push(2);
        });

        window.App.addInitializer(function($){
            testArray.push(1);
        },true);
        
        window.App.addEvent('click', '.test-div', function(){
            testVar = true;
        });
        
        window.App.addView('testView', '.test-div');
        window.App.addPage('testPage', '/tests');
        window.App.addPage('falsePage', 'not-here');
        window.App.set('test', true);
        window.App.setValidationMessage('valtest', true);
        window.App.start();
        $('.test-div').trigger('click');
    });

    it('should have a working get method', function(){
        expect(window.App.get('test')).to.be(true);
    });
    
    it('should have a working getValidationMessage', function(){
        expect(window.App.getValidationMessage('valtest')).to.be(true);
    });
    
    it('should have a current page property', function(){
        expect(window.App.currentPage).to.exist();        
    });

    describe('initializers', function(){

        it('should fill test array', function(){
            expect(testArray.length).to.be(2);    
        });

        it('should delay the second initializer', function(){
            expect(testArray[1]).to.be(1);            
        });

    });

    describe('events', function(){

        it('should set appropriate event on selector', function(){
            expect(testVar).to.be(true);
        });

    });

    describe('views', function(){
        
        it('should have one view', function(){
            expect(window.App.views.testView).to.exist();
        });

        it('should have an element', function(){
            expect(window.App.views.testView.$el()).to.exist(); 
        });
        
        it('should have a "visible" method', function(){
            expect(window.App.views.testView.visible).to.exist();
        });
        
        it('should hide when "hide" is called', function(){
            window.App.views.testView.hide();
            expect(window.App.views.testView.visible()).to.be(false);
        });

        it('should show when "show" is called', function(){
            window.App.views.testView.show();
            expect(window.App.views.testView.visible()).to.be(true); 
        });
    
        it('should allow adding nested views', function(){
            window.App.views.testView.addView('bodyView', 'body');
            expect(window.App.views.testView.views.bodyView).to.exist();
        });
        

    });

    describe('pages', function(){
        it('should have a testpage', function(){
            expect(window.App.pages.testPage).to.exist();
        });
        it('should return true if the current page is current', function(){
            expect(window.App.pages.testPage.isCurrent()).to.be(true);
        });
        it('should return false if the current page is not current', function(){
            expect(window.App.pages.falsePage.isCurrent()).to.be(false);
        });

    });
});
