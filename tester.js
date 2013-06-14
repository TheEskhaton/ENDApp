
(function(window){
var expect = function(obj){
    return {
        to: {
                exist: function(){
                            if(typeof obj === 'undefined'){
                                throw new Error();
                            }
                       },
                be: function(obj2){
                        if(obj !== obj2){
                            throw new Error("Expected: "+obj2+", actual:"+ obj);
                        }
                    }
        }
    };
};
window.expect = expect;
})(window);
