$(document).ready(function() {
  
  $("h1").each(function(i){
    $("#docs_left_col ul").append("<li class='docs_menu_header'>" + $(this).html() + "</li>");
    $(this).nextUntil("h1").not("p").each(function(){
      $(this).attr("id", treatUrl($(this).html()));
      $("#docs_left_col ul").append("<li><a href='#" + treatUrl($(this).html()) + "'>" + $(this).html() + "</a></li>");
    });
  });
  
  $('#docs_left_col li:odd').addClass('even');
  
  function treatUrl(url){
    return url.replace(new RegExp(/\*/g),'');
  }
});

