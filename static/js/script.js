/* Author: TEF
*/
$(document).ready(function() {
  
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
  
  $('.filter:not(:last)').each(function(i){
    $(this).delay(500+i*200).fadeTo(400,0.3);
    if($(this).parent().is('a')) {
      $(this).hover(function() {
        $(this).fadeTo(100, 0.75);
      }, function() {
        $(this).fadeTo(200, 0.3);
      });
    }
  });
  
  $('.table .row:odd').addClass('odd');
  
  $('#btn_login').click(function() {
    var destination = $(this).attr('href')
    FB.login(function(response) {
      alert(destination);
      window.location = destination;
    });
    return false;
  });
  
  $('#btn_logout').click(function() {
    FB.logout(function(response) {
      location.reload(true);
    });
  });
  
  var map;
  
  resize_map();
  $(window).resize(resize_map);
  
  $('#map_canvas').each(function() {
    var latlng = new google.maps.LatLng(52, -2);
    var myOptions = {
      zoom: 7,
      center: latlng,
      panControl: true,
      scrollwheel: false,
      panControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  });
  
  $('.credits').click(function() {
    $('.feature_bar.hidden').hide().removeClass('hidden').slideDown();
  });
  
  var last_key = "";
  var POLLING_INTERVAL = 7000;
  
  $('#map_canvas').each(function() {
    console.log('Setup');
    fetch_poots();
    setInterval(function() {
      fetch_poots();
    }, POLLING_INTERVAL);
  });
  
  function fetch_poots() {
    var results;
    console.log('About to fetch poots');
    
    $.post('/ajax/live_poots', { "last_key": last_key }, function(response, txt){
      console.log(txt);
      results = response.poots.reverse();
      var num_results = results.length;
      // var time_between_markers = POLLING_INTERVAL/num_results;
      var delay = 2000;

      for(var i=0; i<num_results; i++){
        lay_marker(map, results[i], delay);
        lay_content(results[i], delay);
        delay = delay + Math.random() * 5000;
      }

      if(num_results > 0) {
        last_key = results[num_results-1]["key"];
      }

    }, 'json');
  }
  
  function lay_content(poot, delay) {
    console.log("Laying content");
    var poot_image_key = poot["poot_image_key_str"];
    var poot_img = "";
    if(poot_image_key != "") {
      poot_img = '<img src="/poot/image/' + poot_image_key + '" class="icon" />';
    }
    var content = '<a href="/poot/' + poot["key"] + '"><div class="map_poot" id="' + poot["key"] + '">' + 
        '<div class="icon_holder">' + poot_img + '</div>' +
        '<div class="text"><em>' +
        poot["species_scientific_name"] + '</em><br><strong>' +
        poot["species_common_name"] + '</strong>' +
        '<br>' +
        $.timeago(poot["date_caught"]) +
      '</div></div></a>';
    setTimeout(function() {
      console.log("Prepending content");
      $('#poot_holder_inner').prepend(content);
      if($('.map_poot').length % 2 === 1) {
        $('#poot_holder_inner .map_poot').eq(0).addClass('odd');
      }
      $('#poot_holder_inner .map_poot').eq(0).slideDown(300);
    }, delay);
  }

  function lay_marker(map, poot, delay) {
    console.log("Laying marker")
    setTimeout(function() {
      var contentString = poot["species_common_name"] + 
        "<br />" + poot["player_name"] +
        "<br />Just now";

      var infowindow = new google.maps.InfoWindow({
          content: contentString
      });
      
      var boxText = document.createElement("div");
      boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
      boxText.innerHTML = "City Hall, Sechelt<br>British Columbia<br>Canada";
      
      var myOptions = {
         content: boxText
        ,disableAutoPan: false
        ,maxWidth: 0
        ,pixelOffset: new google.maps.Size(-140, 0)
        ,zIndex: null
        ,boxStyle: { 
          background: "url('tipbox.gif') no-repeat"
          ,opacity: 0.75
          ,width: "280px"
         }
        ,closeBoxMargin: "10px 2px 2px 2px"
        ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
        ,infoBoxClearance: new google.maps.Size(1, 1)
        ,isHidden: false
        ,pane: "floatPane"
        ,enableEventPropagation: false
      };

      var ib = new InfoBox(myOptions);
              
      var pos = new google.maps.LatLng(poot["lat"],poot["lon"]);

      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP,
        title: poot["species_common_name"],
        icon: '/images/marker_bumblebee.png'
      });

      map.panTo(pos);

      google.maps.event.addListener(marker, 'mouseover', function() {
        var el = $('#' + poot["key"]);
        el.addClass('highlight')
        
        var scroll_top = el.parent().parent().scrollTop();
        var el_bottom = el.position().top + el.height();
        var parent_height = el.parent().parent().height();
        
        if(el_bottom > parent_height) {
          el.parent().parent().animate({ scrollTop: el.position().top }, 500, "easeInOutSine");
        }
        
        if(el.position().top < 0) {
          el.parent().parent().animate({ scrollTop: scroll_top+el.position().top }, 500, "easeInOutSine");
        };
      });
      
      google.maps.event.addListener(marker, 'mouseout', function() {
        $('.map_poot.highlight').removeClass('highlight');
      });
      
      google.maps.event.addListener(marker, 'click', function() {
        window.location = $('#' + poot["key"]).parent().attr('href');
      });
      
    }, delay);
  }
  
  function resize_map() {
    $('#map_canvas').css('height', $(window).height()-153 + 'px');
    $('#poot_holder_inner').css('height', $(window).height()-153 + 'px');
  }
  
  $('.location_lookup').each(function() {
    var el = $(this);
    var latlng = $(this).text();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( {'address': latlng },
    function(data, status) { 
      el.html(data[0].address_components[2].long_name);
      el.fadeIn('slow');
    });
  });
});

function alerter(msg) {
  $('.alert').html(msg).hide().removeClass('hidden').slideDown(function() {
    setTimeout(function() {
      $('.alert').slideUp();
    }, 4000);
  });
}

function select_top_nav(index) {
  el = $('header #nav div.button').eq(index);
  el.removeClass('dark_green');
  el.addClass('white');
  var pos =  el.find('.icon').css('background-position').split(" ");
  el.find('.icon').css('background-position', pos[0] + ' -28px');
}

function select_filter(index) {
  el = $('nav#sub .filter').eq(index);
  $('nav#sub .selected').removeClass('selected');
  el.addClass('selected');
  $('nav#sub .white').each(function(){
    $(this).removeClass('white')
    if($(this).hasClass('red') == false) {
      $(this).addClass('dark_green');
    }  
  });
  el.removeClass('dark_green').addClass('white');
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