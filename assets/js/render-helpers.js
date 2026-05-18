(function(global){
  function stockTransitionHtml(partName,stockField,oldStock,newStock){
    var delta=newStock-oldStock;
    return '<strong>'+escapeHTML(partName)+'</strong><br/>'+escapeHTML(getStockLabelForField(stockField))+': <strong>'+oldStock+'</strong> → <strong>'+newStock+'</strong> ('+(delta>0?'+':'')+delta+')';
  }

  global.stockTransitionHtml=stockTransitionHtml;
})(window);
