var packBytes = function(value, precision){
  if (value/1000000000000000 > 1) {
    return (value/1000000000000000).toFixed(precision) + "P";
  }
  else if (value/1000000000000 > 1) {
    return (value/1000000000000).toFixed(precision) + "T";
  }
  else if (value/1000000000 > 1) {
    return (value/1000000000).toFixed(precision) + "G";
  }
  else if (value/1000000 > 1) {
    return (value/1000000).toFixed(precision) + "M";
  }
  else if (value/1000 > 1) {
    return (value/1000).toFixed(precision) + "K";
  }
  else{
    return (value*1).toFixed(precision);
  }
};
