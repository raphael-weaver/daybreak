var gcalarm = angular.module('gcalarm', []);

//Model
var NotificationModel = (function(){
  function Cow(){
    this.ateGrass = 0;
  }
  NotificationModel.prototype.eatGrass = function(){
    var isAlive = false;
    if(this.ateGrass < 4){
      this.ateGrass += 1;
      isAlive = true;
    }
    return isAlive;
  }
  return NotificationModel;
})();

//Module(Service)
gcalarm.service('notification', function() {
  this.ateGrassTotal = 0;
  this.evalFarm = function(times,cows) {
    var grass = times - this.ateGrassTotal;
    var newCows = [];
    for(var i = 0;i < cows.length; i++){
      if(cows[i].eatGrass()){
        grass -= 1;
        this.ateGrassTotal += 1;
        newCows.push(cows[i]);
      }
    }
    return {grass:grass,cows:newCows}
  };
});
