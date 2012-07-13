var last_date = "";
var m_names = new Array("Jan", "Feb", "March", 
"April", "May", "June", "July", "Aug", "Sept", 
"Oct", "Nov", "Dec");

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
  
  function parseDate(input, format) {
    format = format || 'yyyy-mm-dd'; // default format
    var parts = input.match(/(\d+)/g), 
        i = 0, fmt = {};
    // extract date-part indexes from the format
    format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

    return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
  }
  
  $('.poot_date').each(function() {
    var d = parseDate($(this).attr('data-date').split(' ')[0]);
    var d_string = d.getDate() + " " + m_names[d.getMonth()] + ", " + d.getFullYear();
    $(this).text($(this).text() + d_string);
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
  
  var opts = {
    lines: 13, // The number of lines to draw
    length: 0, // The length of each line
    width: 3, // The line thickness
    radius: 21, // The radius of the inner circle
    rotate: 0, // The rotation offset
    color: '#999', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };
  
  $('.poot_placeholder').each(function() {
    $(this).spin(opts);
  });

});

$(window).load(function() {
  grab_poots();
});

$(window).scroll(function(){  
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    grab_poots();
  }
});

function grab_poots() {
  $('.poot_placeholder').each(function(i) {
    if(i<25) {
      var poot_key_name = $(this).attr('data-key-name');
      
      console.log("Fetching Poot with key: " + poot_key_name);
      
      $.get("/poot/" + poot_key_name + ".json", function(d) {
        if("poot_image_url" in d) {
          var dispooted_string = "";
          if (d["poot_dispooted"] == true) {
            dispooted_string = '<img class="dispooted" src="/images/dispooted.png">';
          }

          var name = d["player_name"];
          if (name.length > 20) {
            name = name.split(' ')[0];
          }

          var date = d["poot_date_taken"].split(" ")[0];
          var output = "";

          if (date != last_date) {
            output += '<div class="date-divider">';
            output += '  <div class="inner">';
            output += '    <div class="day">' + date.split("-")[2] + '</div>';
            output += '    <div class="month">' + m_names[parseInt(date.split("-")[1])-1] + '</div>';
            output += '  </div>';
            output += '</div>';
          }

          last_date = date;

          output += '<a href="/poot/' + d["poot_key"] + '">\
            <div class="poot_image_wrapper thumb" id="poot_' + d["poot_key"] + '">\
              <div class="poot_image thumb">\
                <img src="' + d["poot_image_url"] + '=s150-c" />\
              </div>\
              <strong>' + d["poot_species_common_name"] + dispooted_string + 
                '<span class="light"> ' + d["poot_species_points"] + 'pts</span>\
              </strong><br>\
              <span class="player_name">by ' + name + '</span><span class="light"> ' + d["player_points"] + 'pts</span>\
            </div>\
          </a>';

          $('#poot_placeholder_' + d["poot_key"]).replaceWith(output);
          $('#poot_' + d["poot_key"]).fadeIn();
        } else {
          $('#poot_placeholder_' + d["poot_key"]).fadeOut();
        }
      });
    }
  });
}

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

$.fn.spin = function(opts) {
  this.each(function() {
    var $this = $(this),
        data = $this.data();

    if (data.spinner) {
      data.spinner.stop();
      delete data.spinner;
    }
    if (opts !== false) {
      data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
    }
  });
  return this;
};