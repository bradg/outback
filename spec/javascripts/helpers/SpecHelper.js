beforeEach(function() {

  this.clearLocalStore = function(){
    localStorage.clear();
  };
  
  this.validResponse = function(responseText) {
    return [
      200,
      {"Content-Type": "application/json"},
      JSON.stringify(responseText)
    ];
  };  

});
