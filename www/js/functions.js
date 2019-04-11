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
                $.mobile.changePage("#verify");
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
            $.mobile.changePage("#verify");
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
                $.mobile.changePage("#profile");
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
                // forgot_auth(data.phone_number);
                $.mobile.changePage("#forgot-verify");
            } else {
                $('#forgot-username').val('');
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
                    $.mobile.changePage("#login");
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
                $.mobile.changePage("#dashboard");
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

                jQuery("body").html("running ");
                jQuery("body").append(data.status);
                // if(data.status == 'true'){
                //     window.localStorage.setItem('name', username);
                //     window.localStorage.setItem('userid', userid);
                //     window.localStorage.setItem('loggedIn', 1);
                //     $('#profil-user').text(window.localStorage.getItem('name'));
                //     $.mobile.changePage("#dashboard");
                //     get_count_badge();
                //     get_count_reminder();
                // } else {
                //     $.mobile.toast({
                //         message: 'Username atau password salah'
                //     });
                // }
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
    console.log(userid);
    $.mobile.changePage("#login");
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
                html += '<div class="banner-item-list"><img src="'+mediaLocation+element.fields.img_path+'"></div>';
            });
    
            $('#all-banner').html(html);
            userid = window.localStorage.getItem('userid');
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
        url: urlMobeng + "api/get/cabang/"+id,
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

function get_all_produk() {
    $.ajax({
        type: 'post',
        url: urlOdoo + "api/get/product-type",
        contentType: 'aplication/json',
        dataType: 'json',
        data: JSON.stringify({
            "key_token" : "a53c6d8a114ebf02d0fb05782534c738bb8f1c8845"
        }),
        success: function( data ) {
            var html = "";

            data.forEach(element => {
                html += '<li class="text-produk ui-listview ui-li-static"><a style="text-decoration:none; color: black;" href="#produk-detail" onclick="get_detail_produk(\''+element.name+'\')">';
                html += element.name;
                html += '</a></li>';
            });

            $('#all-produk').html(html);
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
        success: function( data ) {
            var header = "";
            var html = "";
            productName = name;

            header += '<h2>Produk - '+name+'</h2>';

            for(var i=0; i<data.length; i++) {
                html += '<li class="text-produk ui-listview ui-li-static"><a style="text-decoration:none; color: black;" href="#produk-detail-brand" onclick="get_detail_brand(\''+data[i].brand+'\')">';
                html += data[i].brand;
                html += '</a></li>';
            }

            $('#produk-header').html(header);
            $('#detail-produk').html(html);
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
        success: function( data ) {
            var header = "";
            var html = "";
            

            header += '<h2>Produk - '+productName+' - '+brand+'</h2>';

            for(var i=0; i<data.length; i++) {
                html += '<li class="text-produk ui-listview ui-li-static">'+data[i].name+'<br> Harga : '+data[i].price+'</li>';
            }

            $('#produk-header-brand').html(header);
            $('#detail-produk-brand').html(html);
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
        url: urlMobeng + "api/get/promote/"+id.value,
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
            $('#price').text(response[0].price)
            var result = response[0].vehicle+'<br/>';
            if(response[0].price!="0"){
                $('#detail').html(result);
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
            $('#price').text(response[0].price);
            var result = response[0].vehicle+'<br/>';
            if(response[0].price!="0"){
                $('#detail').html(result);
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
            console.log();
            $('#price').text(response[0].price);
            var result = response[0].vehicle+'<br/>';
            if(response[0].price!="0"){
                $('#detail').html(result);
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
                html += '<div class="card-riwayat">';
                html += '<div class="item">Servis : '+element.name+'</div>';
                html += '<div class="item">Tanggal : '+element.trx_date+'</div>';
                html += '<div class="item">Kendaraan : '+element.nopol+'</div>';
                html += '<div class="item">KM : '+element.km+'</div>';
                html += '<div class="item">Oli : '+element.product+'</div>';
                html += '<div class="item">Waktu : '+element.interval+'</div>';
                html += '<div class="item">Notes : '+element.note+'</div>';
                html += '<a href="#reminder-detail" onclick="get_detail_reminder(\''+element.acc_invoice+'\')" class="ui-btn btn-riwayat ui-btn-inline ui-corner-all">Detail</a>';
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

            html += '<div class="text-reminder-title">POS Order</div>';
            html += '<div class="text-reminder">'+data[0].shop_cd+'</div>';
            html += '<div class="text-reminder">Customer : '+data[0].customer+'</div>';
            html += '<div class="text-reminder">Lisence Number : '+data[0].nopol+'</div>';
            html += '<div class="text-reminder">Type Kendaraan : '+data[0].vehicle+'</div>';
            html += '<div class="text-reminder">Kilometer Saat Ini : '+data[0].km+'</div>';
            html += '<div class="text-reminder">Jenis '+data[0].product+' : '+data[0].product_nm+'</div>';
            html += '<div class="text-reminder">Tanggal : '+data[0].date_order+'</div>';
            html += '<div class="text-reminder">Store : '+data[0].shop_nm+'</div>';
            html += '<div class="text-reminder-title">Kondisi Yang Paling Sering Dijalani/Direncanakan</div>';
            // html += '<div class="text-reminder">Pemakaian Kendaraan : </div>';
            // html += '<div class="text-reminder">Perkiraan Jarak : </div>';
            // html += '<div class="text-reminder">Jumlah Muatan : </div>';
            // html += '<div class="text-reminder">Trek Jalan : </div>';
            // html += '<div class="text-reminder">Kondisi lalu lintas : </div>';
            // html += '<div class="text-reminder">Bahan Bakar : </div>';
            html += '<div class="text-reminder-title">Hasil</div>';
            // html += '<div class="text-reminder">Kondisi berkendara anda : </div>';
            html += '<div class="text-reminder">Jenis : '+data[0].jenis+'</div>';
            // html += '<div class="text-reminder">KM  Penggantian Berikutnya : </div>';
            html += '<div class="text-reminder">Tanggal Ganti Oli Berikutnya : '+data[0].date_target+'</div>';
            // html += '<div class="text-reminder">Var KM : </div>';
            // html += '<div class="text-reminder">Var Hari : </div>';            

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
                html += '<div class="card-riwayat">';
                html += '<div class="item">No Invoice : '+data[i].invoice+'</div>';
                html += '<div class="item">Tanggal : '+data[i].date+'</div>';
                html += '<div class="item">Customer : '+data[i].customer+'</div>';
                html += '<div class="item">No. Polis : '+data[i].nopol+'</div>';
                // html += '<div class="item">KM : '+data[i].km+'</div>';
                // html += '<div class="item">Type : '+data[i].type+'</div>';
                html += '<a href="#riwayat-detail" onclick="get_detail_riwayat(\''+data[i].invoice+'\')" class="ui-btn btn-riwayat ui-btn-inline ui-corner-all">Detail</a>';
                html += '<div class="item float-right">Total Transaksi : <span class="price">Rp. '+data[i].harga+'</span></div>';
                html += '</div>';
            }

            $('#riwayat-list').html(html);
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

            html += '<div class="text-riwayat">No Invoice : '+data[0].invoice_no+'</div>';
            html += '<div class="text-riwayat">Tanggal : '+data[0].date+'</div>';
            html += '<div class="text-riwayat">Customer : '+data[0].customer+'</div>';
            html += '<div class="text-riwayat">No. Polis : '+data[0].nopol+'</div>';
            html += '<div class="text-riwayat">Km : '+data[0].km+'</div>';
            // html += '<div class="text-riwayat">Type : '+data.type+'</div>';
            html += '<hr box-align="center" size="2px" width="90%" color="black" />';
            html += '<table><thead><tr>';
            html += '<th data-priority="1" style="width:200px">Item</th>';
            html += '<th data-priority="2" style="width:20px">QTY</th>';
            html += '<th data-priority="2" style="width:65px">Harga</th>';
            html += '<th data-priority="3" style="width:65px">Disc</th>';
            html += '<th data-priority="4" style="width:65px">Subtotal</th>';
            html += '</tr></thead><tbody>';
            
            for(var i = 0; i<data[0].detail_transaction.length; i++){
                html += '<tr><td>'+data[0].detail_transaction[i].item+'</td>';
                html += '<td>'+data[0].detail_transaction[i].qty+'</td>';
                html += '<td>'+data[0].detail_transaction[i].harga+'</td>';
                html += '<td>'+data[0].detail_transaction[i].disc+'</td>';
                html += '<td>'+data[0].detail_transaction[i].subtotal+'</td></tr>';

            }

            html += '</tbody></table>';
            html += '<span class="text-total">Total Transaksi : <span class="text-total-rp">Rp. '+data[0].total_harga+'</span></span><br>';
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
        url: urlMobeng + "api/get/article/"+id,
        contentType: 'aplication/json',
        dataType: 'json',
        success: function( data ) {
            var html = "";
            var header = '';

            header += '<h2>Blog - '+data[0].title+'</h2>';

            html += '<img src="'+mediaLocation+data[0].Images+'" alt="blog" width="100%" height="200px">';
            html += '<div role="main" class="ui-content">'+data[0].created_dt+'<br>'+data[0].Conten+'</div>';

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
                "txt_message" : $('#hubungi-message').val()
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
                if(element.fields.isRead == true) {
                    html += '<div class="card-riwayat-read">';
                    html += '<div class="item" style="display:block;text-overflow: ellipsis;width: 200px;overflow: hidden; white-space: nowrap;">Pesan : '+element.fields.txt_message+'</div>';
                    html += '<div class="item">Tanggal : '+element.fields.created_dt+'</div>';
                    html += '<a href="#notification-detail" onclick="get_detail_notification(\''+element.pk+'\')" class="ui-btn btn-riwayat ui-btn-inline ui-corner-all">Detail</a>';
                    html += '</div>';
                } else {
                    html += '<div class="card-riwayat">';
                    html += '<div class="item" style="display:block;text-overflow: ellipsis;width: 200px;overflow: hidden; white-space: nowrap;">Pesan : '+element.fields.txt_message+'</div>';
                    html += '<div class="item">Tanggal : '+element.fields.created_dt+'</div>';
                    html += '<a href="#notification-detail" onclick="get_detail_notification(\''+element.pk+'\')" class="ui-btn btn-riwayat ui-btn-inline ui-corner-all">Detail</a>';
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

            html += '<div class="text-riwayat">Pesan : '+data.txt_message+'</div>';
            html += '<div class="text-riwayat">Tanggal : '+data.created_date+'</div>';

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