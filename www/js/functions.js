var urlLocation = "http://192.168.10.66:8000/";
var mediaLocation = "http://192.168.10.66:8000/media/";

// http://192.168.10.66:4000/
// http://mobeng.dcsys.id/
// get_detail_cabang();
// get_all_promotion();
// post_vehicle_type();
get_banner_mobile();

function get_banner_mobile() {
    $.get(urlLocation + "api/banner/mobile", function( data ) {
        var html ="";
        data.forEach(element => {
            html += '<div class="banner-item-list"><img src="'+mediaLocation+element.fields.img_path+'"></div>';
        });

        $('#all-banner').html(html);
    });
}

function get_all_cabang() {
    $.get(urlLocation + "api/cabangs", function( data ) {
        var html = "";

        data.forEach(element => {
            html += '<div class="container-cabang">';
            html += '<a href="#cabang-detail" onclick="get_detail_cabang('+element.pk+')"><img src="'+mediaLocation+element.fields.img_path+'"width="100%" class="cabang-img"></a>';
            html += '<div class="text-cabang">'+element.fields.name+'</div>';
            html += '</div>';
        });

        $('#all-cabang').html(html);
    });
}

function get_detail_cabang(id) {
    $.get(urlLocation + "api/get/cabang/"+id, function( data ) {
        var html = "";

        html += '<iframe width="100%" height="200" frameborder="0" style="border:0" ';
        html += 'src="https://www.google.com/maps/embed/v1/place?q='+data[0].lat+','+data[0].lang+'&amp; key="AIzaSyACMR6xDxS1kbYtcgN8IMGH_oRu1VF-6Po"></iframe>';
        html += '<div role="main" class="ui-content" id="map-canvas"><div class="text-cabang-normal">'+data[0].address+'</div>';
        html += '<div class="text-cabang-bold">Email    : '+data[0].email+'</div>';
        html += '<div class="text-cabang-bold">Call     : '+data[0].Call+'</div>';
        html += '<div class="text-cabang-bold">Phone    : '+data[0].Phone+'</div></div>';

        $('#detail-cabang').html(html);
    });
}

function get_all_promotion() {
    $.get(urlLocation + "api/promotes", function( data ) {
        var select = document.getElementById('promo-list');

        for (var i in data) {
            $(select).append('<option value='+data[i]+'>'+data[i]+'</select>');
            console.log(data);
        }
    });
}

function get_detail_promotion(id) {
    $.get(urlLocation + "api/get/promote/"+id, function( data ) {
        var html = "";

        data.forEach(element => {
            html += '';
            html += '';
        });

        $('#detail-promosi').html(html);
    });
}

// function post_vehicle_type() {
//     $( document ).on( "pagecreate", "#estimasi", function() {
//             $( ".autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
//                 var $ul = $( this ),
//                     $input = $( data.input ),
//                     value = $input.val(),
//                     html = "";
//                 $ul.html( "" );
//                 if ( value && value.length > 2 ) {
//                     $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
//                     $ul.listview( "refresh" );
//                     $.ajax({
//                         url: urlLocation+"api/vehicle/type",
//                         dataType: "jsonp",
//                         crossDomain: true,
//                         data: {
//                             q: $input.val()
//                         }
//                     })
//                     .then( function ( response ) {
//                         $.each( response, function ( i, val ) {
//                             html += "<li>" + val + "</li>";
//                         });
//                         $ul.html( html );
//                         $ul.listview( "refresh" );
//                         $ul.trigger( "updatelayout");
//                     });
//                 }
//                 console.log('ok');
//             });
//     });
// }

function post_hubungi_kami() {
    $.ajax({
        type: "POST",
        url: "http://192.168.10.66:8000/api/add/contact",
        contentType: 'application/json',
        dataType: 'json',
        data: {
            fullname : $('#hubungi-fullname').val(),
            email : $('#hubungi-email').val(),
            subject : $('#hubungi-subject').val(),
            text_message : $('#hubungi-message').val()
        },
        success: function(data) {
            console.log('werwrwerwetaweeargeaw');
            console.log(data);
        }
    });
}