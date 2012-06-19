/* Author: TEF
*/
$(document).ready(function() {
  
  $('#poot_map').each(function() {
    var lat = parseFloat($(this).attr('data-lat'));
    var lon = parseFloat($(this).attr('data-lon'));
    
    var myOptions = {
      center: new google.maps.LatLng(lat, lon),
      zoom: 8,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    var map = new google.maps.Map(document.getElementById("poot_map"), myOptions);
    
    var image = '/images/marker_bumblebee.png';
      var myLatLng = new google.maps.LatLng(lat, lon);
      var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: image
      });
  });
  
  $('.poot_date').each(function() {
    var d = $.datepicker.formatDate('dd MM, yy', new Date($(this).attr('data-date')));
    $(this).text($(this).text() + d);
  });
  
  $('.phone .movie').each(function() {
    setInterval(function() {
      $('.phone .movie').animate({
        backgroundPosition: '-=222px'
      }, 500);
    }, 5000);
  });
  
  $('.sponsor').hover(function() {
    var pos =  $(this).css('background-position').split(" ");
    $(this).stop().animate({ backgroundPosition: pos[0] + ' 165px', opacity: 1 }, 400, 'easeOutBack');
  }, function() {
    var pos =  $(this).css('background-position').split(" ");
    $(this).stop().animate({ backgroundPosition: pos[0] + ' 330px', opacity: 0.25 }, 800, 'easeOutBack', function() {
      var pos =  $(this).css('background-position').split(" ");
      $(this).animate({ backgroundPosition: pos[0] + ' 0px' }, 0);
    });
  });
  
  $('.timeago').timeago();
  
  $('#btn_logout').click(function() {
    FB.logout(function(response) {
      location.reload(true);
    });
  });
  
  $('.credits').click(function() {
    $('.feature_bar.hidden').hide().removeClass('hidden').slideDown();
  });

});

function select_top_nav(index) {
  el = $('header #nav div.button').eq(index);
  el.removeClass('dark_green');
  el.addClass('white');
  var pos =  el.find('.icon').css('background-position').split(" ");
  el.find('.icon').css('background-position', pos[0] + ' -28px');
}


(function($) {
if(!document.defaultView || !document.defaultView.getComputedStyle){
    var oldCurCSS = jQuery.curCSS;
    jQuery.curCSS = function(elem, name, force){
        if(name === 'background-position'){
            name = 'backgroundPosition';
        }
        if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
            return oldCurCSS.apply(this, arguments);
        }
        var style = elem.style;
        if ( !force && style && style[ name ] ){
            return style[ name ];
        }
        return oldCurCSS(elem, 'backgroundPositionX', force) +' '+ oldCurCSS(elem, 'backgroundPositionY', force);
    };
}

var oldAnim = $.fn.animate;
$.fn.animate = function(prop){
    if('background-position' in prop){
        prop.backgroundPosition = prop['background-position'];
        delete prop['background-position'];
    }
    if('backgroundPosition' in prop){
        prop.backgroundPosition = '('+ prop.backgroundPosition + ')';
    }
    return oldAnim.apply(this, arguments);
};

function toArray(strg){
    strg = strg.replace(/left|top/g,'0px');
    strg = strg.replace(/right|bottom/g,'100%');
    strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
    var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
    return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
}

$.fx.step.backgroundPosition = function(fx) {
    if (!fx.bgPosReady) {
        var start = $.curCSS(fx.elem,'backgroundPosition');

        if(!start){//FF2 no inline-style fallback
            start = '0px 0px';
        }

        start = toArray(start);

        fx.start = [start[0],start[2]];

        var end = toArray(fx.end);
        fx.end = [end[0],end[2]];

        fx.unit = [end[1],end[3]];
        fx.bgPosReady = true;
    }

    var nowPosX = [];
    nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
    nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
    fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];
};
})(jQuery);