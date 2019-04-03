var urlLocation = "http://192.168.1.10:8000/";
var mediaLocation = "http://192.168.1.10:8000/media/";
var urlOdoo = "http://192.168.1.10:4000/";

// http://192.168.10.66:4000/
// http://mobeng.dcsys.id/

var verify = false;
var phonenumber = '';
var username = '';
var email = '';
var password = '';

get_banner_mobile();

$('#signup-check').click(function(e){
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/telp",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : $('#signup-phone').val()
        }),
        success: function( data ) {
            if(data.status){
                $('#signup-username').val(data.name);
                username = data.name;
                $('#signup-email').val(data.email);
                email = data.email;
                $('#signup-password').val(data.password);
                phonenumber = data.mobile;
                verify = true;
                $.mobile.toast({
                    message: 'Nomor tersedia'
                });
            } else {
                $('#signup-username').val('');
                $('#signup-email').val('');
                $('#signup-password').val('');
                verify = false;
                $.mobile.toast({
                    message: 'Nomor tidak tersedia'
                });
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})

$('#signup-verify').click(function(e){
    if(verify){
        $.ajax({
            type: 'post',
            url: urlLocation + "api/authentication",
            contentType: 'aplication/json',
            dataType: 'json',
            data: JSON.stringify({
                "telp" : phonenumber
            }),
            success: function() {
                $.mobile.changePage("#verify");
                $.mobile.toast({
                    message: 'kode OTP telah dikirim'
                });
            },
            complete: function(data) {
                add_user(data.fullname, data.email, data.apps_password, data.mobile);
                console.log(data);
            },
            error: function( errorThrown ){
                console.log('jajajangjajajajjang')
                console.log(errorThrown.error);
            }
        });
    } else {
        $.mobile.toast({
            message: 'Lengkapi data terlebih dahulu'
        });
    }
    e.preventDefault();
})

function add_user() {
    $.ajax({
        type: 'post',
        url: urlLocation + "api/add_user",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "txt_fullname" : username,
            "email" : email,
            "password" : password,
            "telp" : phonenumber
        }),
        success: function(data) {
            console.log(data);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

// $('#verify-next').click(function(e){
//     if(verify){
//         $.ajax({
//             type: 'post',
//             url: urlLocation + "api/add_user",
//             contentType: 'aplication/json',
//             dataType: 'json',
//             data: JSON.stringify({
//                 "telp" : phonenumber

//             }),
//             success: function() {
//                 $.mobile.changePage("#profile");   
//             },
//             error: function( errorThrown ){
//                 console.log(errorThrown);
//             }
//         });
//     } else {
//         $.mobile.toast({
//             message: 'Lengkapi data terlebih dahulu'
//         });
//     }
//     e.preventDefault();
// })

function get_banner_mobile() {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/banner/mobile",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<div class="banner-item-list"><img src="'+mediaLocation+element.fields.img_path+'"></div>';
            });
    
            $('#all-banner').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_cabang() {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/cabangs",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<div class="container-cabang">';
                html += '<a href="#cabang-detail" onclick="get_detail_cabang('+element.pk+')"><img src="'+mediaLocation+element.fields.img_path+'"width="100%" height="150px" class="cabang-img"></a>';
                html += '<div class="text-cabang">'+element.fields.name+'</div>';
                html += '</div>';
            });

            $('#all-cabang').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_cabang(id) {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/get/cabang/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<iframe width="100%" height="200" frameborder="0" style="border:0" ';
            html += 'src="https://www.google.com/maps/embed/v1/place?q='+data[0].lat+','+data[0].lang+'&amp;key=AIzaSyACMR6xDxS1kbYtcgN8IMGH_oRu1VF-6Po"></iframe>';
            html += '<div role="main" class="ui-content" id="map-canvas"><div class="text-cabang-normal">'+data[0].address+'</div>';
            html += '<div class="text-cabang-bold">Email    : '+data[0].email+'</div>';
            html += '<div class="text-cabang-bold">Call     : '+data[0].Call+'</div>';
            html += '<div class="text-cabang-bold">Phone    : '+data[0].Phone+'</div></div>';

            $('#detail-cabang').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_promotion() {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/cabangs",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<option value="'+element.pk+'">'+element.fields.name+'</option>';
            });
    
            $('#promo-list').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_promotion(id) {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/get/promote/"+id.value,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<span class="text-promosi">Promo '+data[0].name[3]+'</span>';
            html += '<hr box-align="center" size="1px" width="90%" color="black" />';
            
            data.forEach(element => {
                html += '<img class="promosi" src="'+mediaLocation+element.name[2]+'" alt="promosi">';
            });

            $('#detail-promosi').html(html);
            window.location.href = "#promosi-detail";
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

// $('#profile-type').click(function(e){
//     $.ajax({
//         type: 'post',
//         url: urlOdoo + "api/estimated/vehicle",
//         contentType: 'aplication/json',
//         dataType: 'json',
//         data: JSON.stringify({
//             "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
//             "txt_vehicle" : $('#profile-type').val()
//         }),
//         success: function( data ) {
//             console.log(data);
//             var html = "";
            
//         },
//         error: function( errorThrown ){
//             console.log(errorThrown);
//         }
//     });
//     e.preventDefault();
// })

var vehicle = {  
    url: function(key_token, txt_vehicle) {
        return urlOdoo + "api/estimated/vehicle";
    },

    getValue: function(element) {
        console.log(model);
        return model;
    },

    ajaxSettings: {
        dataType: "json",
        method: "POST",
        data: {
            dataType: "json"
        }
    },

    preparePostData: function(data) {
        data.key_token = "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
        data.txt_vehicle = $("#profile-type").val();
        return data;
    },

    requestDelay: 400  
};

$('#profile-type').easyAutocomplete(vehicle);



function get_all_blog() {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/articles",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<div class="card-blog">';
                html += '<table><td><img src="'+mediaLocation+element.fields.img_path+'" width="80px"></td>';
                html += '<td><span class="item-text-date">'+element.fields.created_dt+'</span><br>';
                html += '<span class="item-text-judul">'+element.fields.title+'</span><br>';
                html += '<span class="item-text" style="display:block;text-overflow: ellipsis;width: 200px;overflow: hidden; white-space: nowrap;">'+element.fields.content+'</span><br>';
                html += '<span class="item-text"><a href="#blog-detail" onclick="get_detail_blog('+element.pk+')">Baca Selengkapnya ...</a></span>';
                html += '</td></table></div>';
            });
    
            $('#all-blog').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_blog(id) {
    $.ajax({
        type: 'get',
        url: urlLocation + "api/get/article/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<img src="'+mediaLocation+data[0].Images+'" alt="blog" width="100%" height="200px">';
            html += '<div role="main" class="ui-content">'+data[0].created_dt+'<br>'+data[0].Conten+'</div>';

            $('#detail-blog').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

$('#hubungi-send').click(function(e){
    $.ajax({
        type: 'post',
        url: urlLocation + "api/add/contact",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "fullname" : $('#hubungi-fullname').val(),
            "email" : $('#hubungi-email').val(),
            "subject" : $('#hubungi-subject').val(),
            "txt_message" : $('#hubungi-message').val()
        }),
        success: function( data ) {
            $.mobile.toast({
                message: 'Data berhasil dikirim'
            });
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})