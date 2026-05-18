(function(global){
  var OPEN_PO_STATUSES={pending:true,ordered:true};

  function isPOSelectableStatus(status){
    return !!OPEN_PO_STATUSES[(status||"pending").toLowerCase()];
  }

  function isPOSelectable(po){
    return !!po&&isPOSelectableStatus(po.status);
  }

  global.isPOSelectableStatus=isPOSelectableStatus;
  global.isPOSelectable=isPOSelectable;
})(window);
