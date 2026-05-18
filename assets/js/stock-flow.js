(function(global){
  function statusOf(p){
    var s=+p.stock||0,m=+p.min||1;
    if(s<=0)return "out";
    if(s<m)return "low";
    if(s<m*2)return "warn";
    return "ok";
  }

  function statusOfSpare(p){
    var s=+p.spareStock||0,m=+p.min||1;
    if(s<=0)return "out";
    if(s<m)return "low";
    if(s<m*2)return "warn";
    return "ok";
  }

  function getStockLabelForField(stockField){
    return stockField==="spareStock"?"Spare Stock":"Production Stock";
  }

  function getStockHeaderLabel(viewMode){
    return viewMode==="spare"?"Spare Stock":(viewMode==="all"?"Production / Spare Stock":"Production Stock");
  }

  function getActiveStockField(p,viewMode){
    if(viewMode==="spare")return "spareStock";
    if(viewMode==="production")return "stock";
    return(p.mode==="spare")?"spareStock":"stock";
  }

  function getActiveStockValue(p,viewMode){
    var field=getActiveStockField(p,viewMode);
    return field==="spareStock"?(+p.spareStock||0):(+p.stock||0);
  }

  function getActiveStockLabel(p,viewMode){
    return getStockLabelForField(getActiveStockField(p,viewMode));
  }

  function getStatusForMode(p,viewMode){
    return getActiveStockField(p,viewMode)==="spareStock"?statusOfSpare(p):statusOf(p);
  }

  function getLineValueForMode(p,viewMode){
    return getActiveStockValue(p,viewMode)*(+p.unitPrice||0);
  }

  global.statusOf=statusOf;
  global.statusOfSpare=statusOfSpare;
  global.getStockLabelForField=getStockLabelForField;
  global.getStockHeaderLabel=getStockHeaderLabel;
  global.getActiveStockField=getActiveStockField;
  global.getActiveStockValue=getActiveStockValue;
  global.getActiveStockLabel=getActiveStockLabel;
  global.getStatusForMode=getStatusForMode;
  global.getLineValueForMode=getLineValueForMode;
})(window);
