function showToastFromTop(text){
  var x=document.getElementById("toast-top");
  x.classList.add("show");
  x.innerHTML=text;
  setTimeout(function(){
    x.classList.remove("show");
  },1800);
}

function showToastFromBottom(text){
  var x=document.getElementById("toast-bottom");
  x.classList.add("show");
  x.innerHTML=text;
  setTimeout(function(){
    x.classList.remove("show");
  },1800);
}