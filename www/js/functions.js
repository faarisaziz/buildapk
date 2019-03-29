var urlLocation = "http://mobeng.dcsys.id/";
var mediaLocation = "http://mobeng.dcsys.id/media/";

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
            html += '<a href="#cabang-detail" onclick="get_detail_cabang('+element.pk+')"><img src="'+mediaLocation+element.fields.img_path+'"width="100%" height="150px" class="cabang-img"></a>';
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
        html += 'src="https://www.google.com/maps/embed/v1/place?q='+data[0].lat+','+data[0].lang+'&amp;key=AIzaSyACMR6xDxS1kbYtcgN8IMGH_oRu1VF-6Po"></iframe>';
        html += '<div role="main" class="ui-content" id="map-canvas"><div class="text-cabang-normal">'+data[0].address+'</div>';
        html += '<div class="text-cabang-bold">Email    : '+data[0].email+'</div>';
        html += '<div class="text-cabang-bold">Call     : '+data[0].Call+'</div>';
        html += '<div class="text-cabang-bold">Phone    : '+data[0].Phone+'</div></div>';

        $('#detail-cabang').html(html);
    });
}

function get_all_promotion() {
    $.get(urlLocation + "api/cabangs", function( data ) {
        var html = "";

        data.forEach(element => {
            html += '<option value="'+element.pk+'">'+element.fields.name+'</option>';

        });

        $('#promo-list').html(html);
    });
}

function get_detail_promotion(id) {
    $.get(urlLocation + "api/get/promote/"+id.value, function( data ) {
        var html = "";

        html += '<h2>Promosi - Nama cabang disini</h2>';
 
        data.forEach(element => {
            html += '<img class="promosi" src="'+mediaLocation+element.Image+'" alt="promosi">';
        });

        console.log(mediaLocation+data[0].Image);

        $('#detail-promosi').html(html);
        window.location.href = "#promosi-detail";
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

function get_all_blog() {
    $.get(urlLocation + "api/articles", function( data ) {
        var html = "";

        data.forEach(element => {
            html += '<div class="card-blog">';
            html += '<table><td><img src="'+mediaLocation+element.fields.img_path+'" width="80px"></td>';
            html += '<td><span class="item-text-date">'+element.fields.created_dt+'</span><br>';
            html += '<span class="item-text-judul">'+element.fields.title+'</span><br>';
            html += '<span class="item-text">test</span><br>';
            html += '<span class="item-text"><a href="#blog-detail" onclick="get_detail_blog('+element.pk+')">Baca Selengkapnya ...</a></span>';
            html += '</td></table></div>';
        });

        $('#all-blog').html(html);
    });
}

function get_detail_blog(id) {
    $.get(urlLocation + "api/get/article/"+id, function( data ) {
        var html = "";

        html += '<img src="'+mediaLocation+data[0].Images+'" alt="blog" width="100%" height="200px">';
        html += '<div role="main" class="ui-content">'+data[0].created_dt+'<br>'+data[0].Conten+'</div>';

        $('#detail-blog').html(html);
    });
}

function post_hubungi_kami() {
    $.ajax({
        type: "POST",
        url: urlLocation+"api/add/contact",
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