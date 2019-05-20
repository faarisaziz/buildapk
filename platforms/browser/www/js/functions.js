var urlMobeng = "http://mobeng.dcsys.id/";
var mediaLocation = "http://mobeng.dcsys.id/media/";
var urlOdoo = "http://mobeng-api.dcsys.id/";

var verify = false;
var phonenumber = '';
var username = '';
var email = '';
var pwd = '';
var userid = '';
var vehicle = '';
var serviceType = '';
var productType = '';
var productName = '';

get_banner_mobile();
get_count_badge();
get_count_reminder();

function checkSession() {
    if(window.localStorage.getItem("loggedIn") == 1) {
        $.mobile.changePage("#dashboard", {transition: "fade"});
        $('#profil-user').text(window.localStorage.getItem('name'));
    } else {
        $.mobile.changePage("#login", {transition: "fade"});
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function checkNull(x) {
    if(x === null) {
        return '-';
    } else if (x== null) {   
        return '-';
    } else {
        return x;
    }
}

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
                pwd = data.password;
                phonenumber = data.mobile;
                userid = data.user_id;
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
    if((verify) && ($('input[type=checkbox]').prop('checked'))){
        $.ajax({
            type: 'post',
            url: urlMobeng + "api/authentication",
            contentType: 'aplication/json',
            dataType: 'json',
            data: JSON.stringify({
                "telp" : phonenumber
            }),
            success: function(data) {
                $.mobile.changePage("#verify", {transition: "slide"});
                $.mobile.toast({
                    message: 'kode OTP telah dikirim'
                });
            },
            complete: function(data) {
                add_user();
                $('#profile-username').val(username);
                $('#profile-phone').val(phonenumber);
                $('#profile-email').val(email);
            },
            error: function( errorThrown ){
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

function resend_auth(){
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/authentication",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : phonenumber
        }),
        success: function(data) {
            // $.mobile.changePage("#verify");
            $.mobile.toast({
                message: 'kode OTP telah dikirim ulang'
            });
        },
        complete: function(data) {
            add_user(data.fullname, data.email, data.apps_password, data.mobile);
        },
        error: function( errorThrown ){
            console.log(errorThrown.error);
        }
    });
}

function add_user() {
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/add_user",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "txt_fullname" : username,
            "email" : $('#signup-email').val(),
            "txt_password" : $('#signup-password').val(),
            "telp" : phonenumber,
            "user_id": userid
        }),
        success: function() {
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

$('#verify-next').click(function(e){
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/verify",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : phonenumber,
            "otp" : $('#1').val()+$('#a').val()+$('#b').val()+$('#c').val()+$('#d').val()+$('#e').val()
        }),
        success: function(data) {
            if(data.status == 'true'){
                $.mobile.changePage("#profile", {transition: "slide"});
            } else {
                $.mobile.toast({
                    message: 'kode OTP tidak sesuai'
                });
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})

$('#forgot-btn').click(function(e){
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/check_user",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : $('#forgot-username').val()
        }),
        success: function( data ) {
            if(data.status == 'true'){
                verify = true;
                phonenumber = data.phone_number;
                $.mobile.toast({
                    message: 'Kode OTP telah dikirim'
                });
                $.mobile.changePage("#forgot-verify", {transition: "slide"});
            } else {
                $('#forgot-username').val('');
                verify = false;
                $.mobile.toast({
                    message: 'Nomor tidak tersedia'
                });
            }
        },
        error: function(){
            $.mobile.toast({
                message: 'Nomor tidak tersedia'
            });
        }
    });
    e.preventDefault();
})

function forgot_auth(){
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/authentication",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : $('#forgot-username').val()
        }),
        success: function(data) {
        },
        error: function( errorThrown ){
            console.log(errorThrown.error);
        }
    });
}

function forgot_resend(){
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/check_user",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : $('#forgot-username').val()
        }),
        success: function(data) {
            $.mobile.toast({
                message: 'kode OTP telah dikirim ulang'
            });
        },
        error: function( errorThrown ){
            console.log(errorThrown.error);
        }
    });
}

$('#forgot-verify-next').click(function(e){
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/forget/otp",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : phonenumber,
            "otp" : $('#f-1').val()+$('#f-a').val()+$('#f-b').val()+$('#f-c').val()+$('#f-d').val()+$('#f-e').val()
        }),
        success: function(data) {
            if(data.status == 'true'){
                $.mobile.changePage("#update-password");
            } else {
                $.mobile.toast({
                    message: 'kode OTP tidak sesuai'
                });
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})

$('#update-btn').click(function(e){
    var pass1 = $('#forgot-password-1').val();
    var pass2 = $('#forgot-password-2').val();
    
    if(pass1.length > 0){
        if(pass1 == pass2){
            $.ajax({
                type: 'post',
                url: urlMobeng + "api/recovery",
                contentType: 'aplication/json',
                dataType: 'json',
                data: JSON.stringify({
                    "telp" : phonenumber,
                    "password" : $('#forgot-password-1').val()
                }),
                success: function(data) {
                    $.mobile.toast({
                        message: 'Password Telah Diubah'
                    });
                    $.mobile.changePage("#login", {transition: "slide"});
                    $('#login-phone').val('');
                    $('#login-password').val('');
                },
                error: function( errorThrown ){
                    console.log(errorThrown);
                }
            });
        } else {
            $.mobile.toast({
                message: 'Password Tidak Sama'
            });
        }
    } else {
        $.mobile.toast({
            message: 'Password Tidak Boleh Kosong'
        });
    }
    e.preventDefault();
})

$('#profile-next').click(function(){
    var lahir = $('#profile-birth').val();
    if(lahir != '') {
        $.ajax({
            type: 'post',
            url: urlMobeng + "api/profile",
            contentType: 'aplication/json',
            dataType: 'json',
            data: JSON.stringify({
                "user_id" : userid,
                "telp" : $('#profile-phone').val(),
                "fullname" : $('#profile-username').val(),
                "email" : $('#profile-email').val(),
                "dt_birth" : $('#profile-birth').val(),
                "gender" : $("input[name='gender']:checked").val(),
                "txt_vehicle" : $('#profile-vehicle').val()
            }),
            success: function(data) {
                window.localStorage.setItem('name', username);
                window.localStorage.setItem('userid', userid);
                window.localStorage.setItem('loggedIn', 1);
                $('#profil-user').text(window.localStorage.getItem('name'));
                get_count_badge();
                get_count_reminder();
                $.mobile.changePage("#dashboard", {transition: "slide"});
            },
            error: function( errorThrown ){
                console.log(errorThrown);
            }
        });
    } else {
        $.mobile.toast({
            message: 'Lengkapi Data'
        });
    }
})

$('#profile-edit-btn').click(function(e){
    var noHp = window.localStorage.getItem('phonenumber');
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/get/telp",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "telp" : noHp
        }),
        success: function( data ) {
            console.log(data);
            $('#edit-username').val(data.name);
            $('#edit-phone').val(data.name);
            $('#edit-email').val(data.email);
            $('#edit-password-1').val(data.password);
            $('#edit-password-2').val(data.password);
            $("input[name='edit-gender']:checked").val();
            $('#edit-vehicle').val(data.email);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
    e.preventDefault();
})

$('#login-btn').click(function(e){
    var un = $('#login-phone').val();
    var pw = $('#login-password').val();
    if((un != '') && (pw != '')) {
        $.ajax({
            type: 'post',
            url: urlMobeng + "api/login",
            contentType: 'aplication/json',
            dataType: 'json',
            data: JSON.stringify({
                "username" : $('#login-phone').val(),
                "password" : $('#login-password').val()
            }),
            success: function(data) {
                userid = data.id;
                username = data.user_name;

                if(data.status == 'true'){
                    window.localStorage.setItem('name', username);
                    window.localStorage.setItem('userid', userid);
                    window.localStorage.setItem('phonenumber', $('#login-phone').val());
                    window.localStorage.setItem('pass', $('#login-password').val());
                    window.localStorage.setItem('loggedIn', 1);
                    $('#profil-user').text(window.localStorage.getItem('name'));
                    $.mobile.changePage("#dashboard", {transition: "pop"});
                    get_count_badge();
                    get_count_reminder();
                } else {
                    $.mobile.toast({
                        message: 'Username atau password salah'
                    });
                }
            },
            error: function( errorThrown ){
                console.log(errorThrown);
            }
        });
    } else {
        $.mobile.toast({
            message: 'Masukan No Telp dan Password'
        });
    }
    e.preventDefault();
})

function logout() {
    window.localStorage.setItem('name', '');
    window.localStorage.setItem('userid', '');
    window.localStorage.setItem('loggedIn', 0);
    $.mobile.changePage("#login", {transition: "pop", reverse: true});
    $('#login-phone').val('');
    $('#login-password').val('');
    $('#1').val('');
    $('#a').val('');
    $('#b').val('');
    $('#c').val('');
    $('#d').val('');
    $('#e').val('');
    $('#f-1').val('');
    $('#f-a').val('');
    $('#f-b').val('');
    $('#f-c').val('');
    $('#f-d').val('');
    $('#f-e').val('');
    $('#profile-username').val('');
    $('#profile-phone').val('');
    $('#profile-email').val('');
    $('#signup-username').val('');
    $('#signup-email').val('');
    $('#signup-phone').val('');
    $('#signup-password').val('');
}

function get_banner_mobile() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/banner/mobile",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                // html += '<div class="banner-item-list"><img src="'+mediaLocation+element.fields.img_path+'"></div>';
                html += '<div class="swiper-slide"><img src="'+mediaLocation+element.fields.img_path+'" alt="banner" style="display: block; margin-left: auto; margin-right: auto; height: 160px; border-radius: 25px; width: 90%;" /></div>';
            });
    
            $('#all-banner').html(html);
            userid = window.localStorage.getItem('userid');
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_banner_partner() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/banner-op",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";
            data.forEach(element => {
                html += '<div class="swiper-slide"><img src="'+mediaLocation+element.fields.img_path+'" alt="partner" style="height: 25px;" /></div>';
            });
    
            $('#banner-partner').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_cabang() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/cabangs",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<div class="container-cabang">';
                html += '<a href="#cabang-detail" data-transition="slide" onclick="get_detail_cabang('+element.pk+')"><img src="'+mediaLocation+element.fields.img_path+'"width="100%" height="200px" class="cabang-img"></a>';
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

function initMap(latitude, longitude) {
    var myLatLng = {lat: latitude, lng: longitude};

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: myLatLng,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false

    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Hello World!'
    });
}

function get_detail_cabang(id) {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/get/cabang/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<h2>Cabang - '+data[0].name+' - Detail</h2>';
            html += '<div id="map" style="margin-top:10px;width:100%;height:250px;display: block;"></div>';
            html += '<div role="main" class="ui-content" id="map-canvas"><div class="text-cabang-normal">'+data[0].address+'</div>';
            html += '<div class="text-cabang-bold">Email    : '+data[0].email+'</div>';
            html += '<div class="text-cabang-bold">Call     : '+data[0].Call+'</div>';
            html += '<div class="text-cabang-bold">Phone    : '+data[0].Phone+'</div></div><br><br>';
            html += '<div class="card">';
            html += '<a href="geo:'+data[0].lat+','+data[0].lang+'" class="ui-btn btn-blue">Petunjuk dengan Google Maps</a></div>';

            $('#detail-cabang').html(html);
            initMap(parseInt(data[0].lat), parseInt(data[0].lang));
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_produk() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/product-type",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "type" : "t",
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845"
        }),
        beforeSend: function() {
            $(".pageLoader").show();
        },
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<li class="text-produk ui-listview ui-li-static"><a style="text-decoration:none; color: black;" href="#produk-detail" data-transition="slide" onclick="get_detail_produk(\''+element.name+'\')">';
                if (element.name == 'Tire') {
                    element.name = 'Ban'
                } else if (element.name == 'Oil') {
                    element.name = 'Oli'
                }
                html += element.name;
                html += '</a></li>';
            });
             html += '<li class="text-produk ui-listview ui-li-static"><a style="text-decoration:none; color: black;" href="#produk" data-transition="slide" onclick="get_other_produk()">Lain-lain</a></li>';
            $('#all-produk').html(html);
        },
        complete: function() {
            $(".pageLoader").hide();
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_other_produk() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/product-type",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "type" : "f",
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845"
        }),
        beforeSend: function() {
            $(".pageLoader").show();
        },
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<li class="text-produk ui-listview ui-li-static"><a style="text-decoration:none; color: black;" href="#produk-detail" data-transition="slide" onclick="get_detail_produk(\''+element.name+'\')">';
                html += element.name;
                html += '</a></li>';
            });
             
            $('#all-produk').html(html);
        },
        complete: function() {
            $(".pageLoader").hide();
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_produk(name) {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/brand-id",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
            "type" : name
        }),
        beforeSend: function() {
            $(".pageLoader").show();
        },
        success: function( data ) {
            var header = "";
            var html = "";
            productName = name;
            if (name == 'Tire') {
                name = 'Ban'
            } else if (name == 'Oil') {
                name = 'Oli'
            }

            header += '<h2>Produk - '+name+'</h2>';

            for(var i=0; i<data.length; i++) {
                html += '<li class="text-produk ui-listview ui-li-static"><a style="text-decoration:none; color: black;" href="#produk-detail-brand" data-transition="slide" onclick="get_detail_brand(\''+data[i].brand+'\')">';
                html += data[i].brand;
                html += '</a></li>';
            }

            $('#produk-header').html(header);
            $('#detail-produk').html(html);
        },
        complete: function() {
            $(".pageLoader").hide();
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_brand(brand) {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/product-by-brand-type",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
            "type" : productName,
            "brand" : brand
        }),
        beforeSend: function() {
            $(".pageLoader").show();
        },
        success: function( data ) {
            var header = "";
            var html = "";
            if (productName == 'Tire') {
                productName = 'Ban'
            } else if (productName == 'Oil') {
                productName = 'Oli'
            }

            header += '<h2>Produk - '+productName+' - '+brand+'</h2>';

            for(var i=0; i<data.length; i++) {
                html += '<li class="text-produk ui-listview ui-li-static">'+data[i].name+'<br> Harga : '+data[i].price+'</li>';
            }

            $('#produk-header-brand').html(header);
            $('#detail-produk-brand').html(html);
        },
        complete: function() {
            $(".pageLoader").hide();
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_promotion() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/cabangs",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            
            var html = "";

            data.forEach(element => {
                html += '<li class="text-produk ui-listview ui-li-static"><a style="text-decoration:none; color: black;" href="#promosi-detail" data-transition="slide" onclick="get_detail_promotion('+element.pk+')">';
                html += element.fields.name;
                html += '</a></li>';
            });
    
            $('#all-promo').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_promotion(id) {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/get/promote/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            if (data.length == 0) {
                html += '<span class="text-promosi">Promo Tidak Ditemukan</span>';
                html += '<hr box-align="center" size="1px" width="100%" color="black" />';
                
                data.forEach(element => {
                    html += '<img class="promosi" src="" alt="promosi">';
                });
                $('#detail-promosi').html(html);
                $.mobile.toast({
                    message: 'Promo tidak ditemukan'
                });
            } else if (data.length != 0) {
                html += '<span class="text-promosi">Promo '+data[0].name[3]+'</span>';
                html += '<hr box-align="center" size="1px" width="100%" color="black" />';
                
                data.forEach(element => {
                    html += '<img class="promosi" src="'+mediaLocation+element.name[2]+'" alt="promosi">';
                });
                $('#detail-promosi').html(html);
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_promo_nasional() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/promotes",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";
            for(var i=0; i<data.length; i++) {
                if (data[i].fields.promot_type == 'International') {      
                    html += '<img class="promosi" src="'+mediaLocation+data[i].fields.img_path+'" alt="promosi-nasional">';
                } else if(data[i].fields.promot_type == 'Local') {
                    $.mobile.toast({
                        message: 'Promo tidak ditemukan'
                    });
                }
            }
            $('#nasional-promosi').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function getOilPrice(type, term){
    $.ajax({
        type : 'POST',
        url  : urlOdoo + 'api/estimated/getoilprice',
        data : JSON.stringify({
            'key_token': 'a53c6d8a114ebf02d0fb05782534c738bb8f1c8845',
            'txt_vehicle': term,
            'oil_type': type
        }),
        success : function(response) {
            var harga = response[0].price;
            harga = numberWithCommas(harga);
            $('#price').text(harga)
            var result = response[0].capacity;
            if(response[0].price!="0"){
                $('#detail').html("Kapasitas oli "+response[0].vehicle+" = "+result+" Liter");
            }else{
                $('#detail').html("Detail Produk");
            }
        }
    });
}
function getTirePrice(size, term){
    $.ajax({
        type : 'POST',
        url  : urlOdoo + 'api/estimated/getTirePrice',
        data : JSON.stringify({
            'key_token': 'a53c6d8a114ebf02d0fb05782534c738bb8f1c8845',
            'txt_vehicle': term,
            'ring_size': size
        }),
        success : function(response) {
            var harga = response[0].price;
            harga = numberWithCommas(harga);
            $('#price').text(harga)
            var result = response[0].vehicle+'<br/>';
            if(response[0].price!="0"){
                $('#detail').html("Harga tertera adalah harga per 1 pcs.");
            }else{
                $('#detail').html("Detail Produk");
            }
        }
    });
}
function getAccuPrice(term){
    $.ajax({
        type : 'POST',
        url  : urlOdoo + 'api/estimated/getAccuPrice',
        data : JSON.stringify({
            'key_token': 'a53c6d8a114ebf02d0fb05782534c738bb8f1c8845',
            'txt_vehicle': term
        }),
        success : function(response) {
            var harga = response[0].price;
            harga = numberWithCommas(harga);
            $('#price').text(harga)
            var result = response[0].vehicle+'<br/>';
            if(response[0].price!="0"){
                $('#detail').html("-");
            }else{
                $('#detail').html("Detail Produk");
            }
        }
    });
}
$(document).ready(function(){
    $('#serviceType').prop('disabled', true);
    $('#productType').prop('disabled', true);
    $('#vehicle').select2({
        dropdownParent: $("#popupEstimasiServis"),
        placeholder: "Pilih Kendaraan",
        minimumInputLength: 4,
        ajax: {
            url: urlOdoo + 'api/estimated/vehicle',
            data: function (params) {
                return {
                    term: $.trim(params.term)
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        }
    }).on('select2:select', function (evt) {
        $('#serviceType').prop('disabled', false);
        $('#productType').prop('disabled', true);
        var data = $("#vehicle").val();
        vehicle = data;
        $("#serviceType option").remove();
        $("#serviceType").append("<option value='oil' selected>Oli</option>");
        $("#serviceType").append("<option value='tire' selected>Ban</option>");
        $("#serviceType").append("<option value='accu' selected>Accu</option>");
        $('#serviceType').trigger('change');
        $('#serviceType').val(null).trigger('change');
        $('#productType').val(null).trigger('change');
        $('#price').text('0');
        $('#detail').text('Detail Produk');
    });
    $('#serviceType').select2({placeholder: "Jenis Service"}).on('select2:select', function (evt) {
        $('#productType').prop('disabled', false);
        var data = $("#serviceType").val();
        serviceType = data;
        if(serviceType==="oil"){
            $("#productType option").remove();
            $("#productType").append("<option value='ss' selected>Semi Sintetis</option>");
            $("#productType").append("<option value='fs' selected>Full Sintetis</option>");
            $('#productType').trigger('change');
            $('#price').text('0');
            $('#detail').text('Detail Produk');
        }else if(serviceType==='tire'){
            $("#productType option").remove();
            $("#productType").append("<option value='13' selected>Ring 13</option>");
            $("#productType").append("<option value='14' selected>Ring 14</option>");
            $("#productType").append("<option value='15' selected>Ring 15</option>");
            $("#productType").append("<option value='16' selected>Ring 16</option>");
            $("#productType").append("<option value='17' selected>Ring 17</option>");
            $("#productType").append("<option value='18' selected>Ring 18</option>");
            $("#productType").append("<option value='19' selected>Ring 19</option>");
            $("#productType").append("<option value='20' selected>Ring 20</option>");
            $('#productType').trigger('change');
            $('#price').text('0');
            $('#detail').text('Detail Produk');
        }else{
            $("#productType option").remove();
            $('#productType').prop('disabled', true);
            getAccuPrice(vehicle);
        }
        $('#productType').val(null).trigger('change');
    });
    $('#productType').select2({placeholder: "Tipe Produk Service"}).on('select2:select', function (evt) {
        var data = $("#productType").val();
        productType = data;
        if(serviceType==="oil"){
            getOilPrice(productType, vehicle);
        }else if(serviceType==='tire'){
            getTirePrice(productType, vehicle);
        }
    });
});
function clearEstimate(){
    $('#price').text('0');
    $('#detail').text('Detail Produk');
    $('#serviceType').prop('disabled', true);
    $('#productType').prop('disabled', true);
    $('#vehicle').val(null).trigger('change');
    $('#serviceType').val(null).trigger('change');
    $('#productType').val(null).trigger('change');
}

function get_count_reminder() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/count/reminder",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
            "user_id" : userid
        }),
        success: function( data ) {
            var html = "";
            if(data.count > 0) {
                html = data.count;
                $('#badge-reminder').html(html).show();
            } else  {
                $('.badge-reminder').hide();
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_reminder() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/product-reminder",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
            "user_id" : userid
        }),
        success: function( data ) {
            var html = "";
            
            data.forEach(element => {
                var kilometer = element.km;
                kilometer = numberWithCommas(kilometer);
                html += '<div class="card-riwayat">';
                html += '<div class="item">Servis : '+checkNull(element.name)+'</div>';
                html += '<div class="item">Tanggal : '+checkNull(element.trx_date)+'</div>';
                html += '<div class="item">Kendaraan : '+checkNull(element.nopol)+'</div>';
                html += '<div class="item">KM : '+checkNull(kilometer)+'</div>';
                html += '<div class="item">Oli : '+checkNull(element.product)+'</div>';
                html += '<div class="item">Waktu : '+checkNull(element.interval)+'</div>';
                html += '<div class="item">Notes : '+checkNull(element.note)+'</div>';
                html += '<a href="#reminder-detail" data-transition="pop" onclick="get_detail_reminder(\''+element.acc_invoice+'\')" class="ui-btn btn-riwayat ui-btn-inline ui-corner-all">Detail</a>';
                html += '</div>';
            });

            $('#reminder-list').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_reminder(invoice) {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/detail/reminder",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845",
            "user_id" : userid,
            "invoice" : invoice
        }),
        success: function( data ) {
            var html = "";

            var jenisOli = data[0].oil_type;
            if (jenisOli == 'fs') {
                jenisOli = "Full Sintetis"
            } else if (jenisOli == 'ss') {
                jenisOli = "Semi Sintetis"
            } else {
                jenisOli = '-'
            }
            var kilometersaatini = data[0].km_saat_ini;
            kilometersaatini = numberWithCommas(kilometersaatini);
            var kilometer = data[0].next_km;
            kilometer = numberWithCommas(kilometer);
            html += '<div class="text-reminder-title">POS Order</div>';
            html += '<div class="text-reminder">'+checkNull(data[0].nama_toko)+'</div>';
            html += '<div class="text-reminder">Customer : '+checkNull(data[0].pelanggan)+'</div>';
            html += '<div class="text-reminder">Lisence Number : '+checkNull(data[0].nopol)+'</div>';
            html += '<div class="text-reminder">Type Kendaraan : '+checkNull(data[0].vehicle_model)+'</div>';
            html += '<div class="text-reminder">Kilometer Saat Ini : '+checkNull(kilometersaatini)+'</div>';
            html += '<div class="text-reminder">Jenis Oli Mesin : '+jenisOli+'</div>';
            html += '<div class="text-reminder">Tanggal : '+checkNull(data[0].date_order)+'</div>';
            html += '<div class="text-reminder">Store : '+checkNull(data[0].nama_toko)+'</div>';
            html += '<div class="text-reminder-title">Kembali Pada Tanggal</div>';
            html += '<div class="text-reminder">Jenis Oli : '+jenisOli+'</div>';
            html += '<div class="text-reminder">Tanggal Ganti Oli Berikutnya : '+checkNull(data[0].next_date)+'</div>';
            html += '<div class="text-reminder-title">Kondisi Yang Paling Sering Dijalani/Direncanakan</div>';
            html += '<div class="text-reminder">Pemakaian Kendaraan : '+checkNull(data[0].pemakaian_kendaraan)+'</div>';
            html += '<div class="text-reminder">Perkiraan Jarak : '+checkNull(data[0].perkiraan_jarak)+'</div>';
            html += '<div class="text-reminder">Jumlah Muatan : '+checkNull(data[0].muatan)+'</div>';
            html += '<div class="text-reminder">Trek Jalan : '+checkNull(data[0].trek)+'</div>';
            html += '<div class="text-reminder">Kondisi lalu lintas : '+checkNull(data[0].lalulintas)+'</div>';
            html += '<div class="text-reminder">Bahan Bakar : '+checkNull(data[0].bahan_bakar)+'</div>';
            html += '<div class="text-reminder-title">Disarankan Untuk Kembali Lagi</div>';
            html += '<div class="text-reminder">KM : '+checkNull(kilometer)+'</div>';
            html += '<div class="text-reminder">Tanggal Ganti Oli Berikutnya : '+checkNull(data[0].back_date)+'</div>'; 
            html += '<div class="text-reminder-title">Created By : '+checkNull(data[0].created_by)+'</div>';     

            $('#detail-reminder').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_riwayat() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/transaction",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "user_id" : userid
        }),
        success: function( data ) {
            var html = "";
            for(var i = 0; i < data.length; i++) {
                var harga = data[i].harga;
                harga = numberWithCommas(harga);
                html += '<div class="card-riwayat">';
                html += '<div class="item">No Invoice : '+checkNull(data[i].invoice)+'</div>';
                html += '<div class="item">Tanggal : '+checkNull(data[i].date)+'</div>';
                html += '<div class="item">Customer : '+checkNull(data[i].customer)+'</div>';
                html += '<div class="item">No. Polis : '+checkNull(data[i].nopol)+'</div>';
                html += '<div class="item">KM : '+checkNull(data[i].km)+'</div>';
                html += '<div class="item">Type : '+checkNull(data[i].vehicle_model)+'</div>';
                html += '<a href="#riwayat-detail" data-transition="pop" onclick="get_detail_riwayat(\''+data[i].invoice+'\')" class="ui-btn btn-riwayat ui-btn-inline ui-corner-all">Detail</a>';
                html += '<div class="item float-right">Total Transaksi : <span class="price">Rp. '+checkNull(harga)+'</span></div>';
                html += '</div>';

                $('#riwayat-list').html(html);
            }
            
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_riwayat(invoice) {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/detail/transaction",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "invoice_no" : invoice
        }),
        success: function( data ) {
            var html = "";

            html += '<div class="text-riwayat">No Invoice : '+checkNull(data[0].invoice_no)+'</div>';
            html += '<div class="text-riwayat">Tanggal : '+checkNull(data[0].date)+'</div>';
            html += '<div class="text-riwayat">Customer : '+checkNull(data[0].customer)+'</div>';
            html += '<div class="text-riwayat">No. Polis : '+checkNull(data[0].nopol)+'</div>';
            html += '<div class="text-riwayat">Km : '+checkNull(data[0].km)+'</div>';
            html += '<div class="text-riwayat">Type : '+checkNull(data[0].vehicle_model)+'</div>';
            html += '<hr box-align="center" size="2px" width="90%" color="black" />';
            html += '<table><thead><tr>';
            html += '<th data-priority="1" style="width:200px">Item</th>';
            html += '<th data-priority="2" style="width:20px">QTY</th>';
            html += '<th data-priority="2" style="width:65px">Harga</th>';
            html += '<th data-priority="3" style="width:65px">Disc</th>';
            html += '<th data-priority="4" style="width:65px">Subtotal</th>';
            html += '</tr></thead><tbody>';
            
            for(var i = 0; i<data[0].detail_transaction.length; i++){
                var harga = data[0].detail_transaction[i].harga;
                var subtotal = data[0].detail_transaction[i].subtotal;
                harga = numberWithCommas(harga);
                subtotal = numberWithCommas(subtotal);
                html += '<tr><td>'+checkNull(data[0].detail_transaction[i].item)+'</td>';
                html += '<td>'+checkNull(data[0].detail_transaction[i].qty)+'</td>';
                html += '<td>'+checkNull(harga)+'</td>';
                html += '<td>'+checkNull(data[0].detail_transaction[i].disc)+'</td>';
                html += '<td>'+checkNull(subtotal)+'</td></tr>';

            }
            var totalharga = data[0].total_harga;
            totalharga = numberWithCommas(totalharga);
            html += '</tbody></table>';
            html += '<span class="text-total">Total Transaksi : <span class="text-total-rp">Rp. '+checkNull(totalharga)+'</span></span><br>';
            html += '<span class="text-ppn">*Harga sudah termasuk PPN</span>';

            $('#detail-riwayat').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}


function get_all_blog() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/articles",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                var str = element.fields.content;
                var sub = str.substring(0, 200);

                html += '<div class="card-blog"><a href="#blog-detail" onclick="get_detail_blog('+element.pk+')" style="text-decoration: none;">';
                html += '<table><td><img src="'+mediaLocation+element.fields.img_path+'" width="90px" height="90px" style="padding-right: 7px;"></td>';
                html += '<td><div class="item-text-date">'+element.fields.created_dt+'</div>';
                html += '<div class="item-text-judul">'+element.fields.title+'</div>';
                html += '<div class="item-text">'+sub+'</div>';
                html += '<div class="item-text" style="color: blue;">Baca Selengkapnya ...</div>';
                html += '</td></table></a></div>';
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
        url: urlMobeng + "api/get/article/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";
            var header = '';

            header += '<h2>'+data[0].title+'</h2>';

            html += '<img src="'+mediaLocation+data[0].Images+'" alt="blog" width="100%" height="200px">';
            html += '<div role="main" class="ui-content font-gotham">'+data[0].created_dt+'<br>'+data[0].Conten+'</div>';

            $('#blog-header').html(header);
            $('#detail-blog').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

$('#hubungi-send').click(function(e){
    var fname = $('#hubungi-fullname').val();
    var eml = $('#hubungi-email').val();
    var sbk = $('#hubungi-subject').val();
    var tm = $('#hubungi-message').val();
    var cc = '';

    if ($('#check-copy').is(":checked"))
    {
        cc = '1';
    } else {
        cc = '0';
    }
    
    if((fname != '') && (eml != '') && (sbk != '') && (tm != '')) {
        $.ajax({
            type: 'post',
            url: urlMobeng + "api/add/contact",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                "fullname" : $('#hubungi-fullname').val(),
                "email" : $('#hubungi-email').val(),
                "subject" : $('#hubungi-subject').val(),
                "txt_message" : $('#hubungi-message').val(),
                "send_copy" : cc
            }),
            success: function() {
                $.mobile.toast({
                    message: 'Data berhasil dikirim'
                });
                $('#hubungi-fullname').val('');
                $('#hubungi-email').val('');
                $('#hubungi-subject').val('');
                $('#hubungi-message').val('');
            },
            error: function( errorThrown ){
                console.log(errorThrown);
            }
        });
    } else {
        $.mobile.toast({
            message: 'Lengkapi data terlebih dahulu'
        });
    }
    
    e.preventDefault();
})

function get_count_badge() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/get/notif_count",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";
            if(data.notif_count > 0) {
                html = data.notif_count;

                $('.badge-notif').html(html).show();
            } else  {
                $('.badge-notif').hide();
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_all_notification() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/notifications",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";
            
            data.forEach(element => {
                var str = element.fields.txt_message;
                var sub = str.substring(0, 50);

                if(element.fields.isRead == true) {
                    html += '<div class="card-notif-read">';
                    html += '<div class="item"><strong>Pesan : </strong>'+sub+'</div><br>';
                    html += '<div class="item"><strong>Tanggal : </strong>'+element.fields.created_dt+'</div>';
                    html += '<a href="#notification-detail" onclick="get_detail_notification(\''+element.pk+'\')" class="ui-btn btn-riwayat ui-corner-all">Detail</a>';
                    html += '</div>';
                } else {
                    html += '<div class="card-notif">';
                    html += '<div class="item">Pesan : '+sub+'</div>';
                    html += '<div class="item">Tanggal : '+element.fields.created_dt+'</div>';
                    html += '<a href="#notification-detail" onclick="get_detail_notification(\''+element.pk+'\')" class="ui-btn btn-riwayat ui-corner-all">Detail</a>';
                    html += '</div>';
                }
            });

            $('#notification-list').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_detail_notification(id) {
    var idIsTrue = id;
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/get/notification/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            html += '<div class="text-riwayat"><strong>Pesan : </strong>'+data.txt_message+'</div>';
            html += '<div class="text-riwayat"><strong>Tanggal : </strong>'+data.created_date+'</div>';

            $('#detail-notification').html(html);
        },
        complete: function() {
            update_notification(idIsTrue);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function update_notification(id) {
    $.ajax({
        type: 'post',
        url: urlMobeng + "api/put/notif="+id,
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "id" : id
        }),
        success: function() {
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function showFooter() {
    $('#popupFooter').show();
}

function hideFooter() {
    $('#popupFooter').hide();
}

function get_faq() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/faq",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            for (var i = 0; i < data.length; i++) {
                html += '<button class="faq-collapsible">'+data[i].fields.txt_title+'</button>';
                html += '<div class="faq-content">';
                html += data[i].fields.txt_content;
                html += '</div>';
            }

            $('#faq-list').html(html);
        },
        complete: function() {
            var coll = document.getElementsByClassName("faq-collapsible");
            for (var i = 0; i < coll.length; i++) {
              coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                  content.style.display = "none";
                } else {
                  content.style.display = "block";
                }
              });
            }
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}

function get_about() {
    $.ajax({
        type: 'get',
        url: urlMobeng + "api/company/profile",
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";

            for (var i = 0; i < data.length; i++) {
                html += '<h2 class="font-gotham-bold" style="font-size: 24px;">'+data[i].fields.txt_title+'</h2>';
                html += '<div align="justify" class="font-gotham">'+data[i].fields.txt_content+'</div>';
            }

            $('#about-list').html(html);
        },
        error: function( errorThrown ){
            console.log(errorThrown);
        }
    });
}