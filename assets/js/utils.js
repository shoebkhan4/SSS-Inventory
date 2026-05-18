(function(global){
  function $(id){return document.getElementById(id);}

  function fmtMoney(n){
    if(!isFinite(n))return "$0.00";
    return "$"+n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }

  function fmtDate(ts){
    if(!ts)return "--";
    var d=ts.toDate?ts.toDate():new Date(ts);
    return d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})+" "+d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});
  }

  function statusLabel(s){
    return{out:"Out",low:"Low",warn:"Reorder",ok:"OK"}[s]||s;
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g,function(c){
      return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]);
    });
  }

  global.$=$;
  global.fmtMoney=fmtMoney;
  global.fmtDate=fmtDate;
  global.statusLabel=statusLabel;
  global.escapeHTML=escapeHTML;
})(window);
