jQuery(function($){
    let isLogin = false;
    let zumataRedirectBaseUrl = 'https://travel.dreamholidays.io/search/';//'https://staging-lv.globaltripper.com/search/';
    let bookvar = {searchid:'',location:'',regionid:'',adult:'2',child:[],room:'1'};
    let childvar = [];
    let desplholder = '';
    $(document).ready(function($){
        $('#destination').focusin(function(){
            desplholder = $(this).attr('placeholder');
            $(this).attr('placeholder','');
        });
        $('#destination').focusout(function(){
            $(this).attr('placeholder',desplholder);
        });
        $('#destination').autocomplete({      
            minLength: 1,
            delay: 0,
            source: function( request, response ) {
                let zumataUrl = 'https://wlapi.hotelbookingservices.co/web/autosuggest?locale='+sbcvar.locale;//'https://lv2.globaltripper.com/web/autosuggest';
                let authToken = 'app_SBCTeb0e53e32d3f76deba91';//'app_TESTeec3307e143e768c1983';
                $.ajax({
                    url: zumataUrl,
                    headers : {
                        'lv-app-access-key' : authToken
                    },
                    method : 'GET',
                    data: {
                        q: request.term
                    },
                    success: function( results ) {
                        if(results.outlets!=undefined){
                            if(results.meta.reqId!=undefined){
                                bookvar.searchid = results.meta.reqId;
                            }
                            if(results.outlets.results!=undefined){
                                response( results.outlets.results );
                            }
                        }
                    }
                });
            },
            select: function( event, ui ) {
                $(this).val( ui.item.term );
                bookvar.location = ui.item.term;
                bookvar.regionid = ui.item.data.region_id;
                $('.destination-error').html('');
                $('.destination-error').hide();
                return false;
            }
        }).autocomplete( "instance" )._renderItem = function( ul, item ) {
            return $( "<li>" )
              .append( '<div><i class="fa fa-map-marker" aria-hidden="true"></i> ' + item.term + '</div>' )
              .appendTo( ul );
        };
        $('.t-datepicker').tDatePicker({
	        iconDate: '<i class="fa fa-calendar" aria-hidden="true"></i>',
            titleCheckIn: sbcvar.checkin,
            titleCheckOut: sbcvar.checkout,
            titleToday: sbcvar.today,
            titleDateRange: sbcvar.night,
            titleDateRanges: sbcvar.nights,
            titleDays:[
                sbcvar.mo,
                sbcvar.tu,
                sbcvar.we,
                sbcvar.th,
                sbcvar.fr,
                sbcvar.sa,
                sbcvar.su
            ],
            titleMonths:[
                sbcvar.january,
                sbcvar.february,
                sbcvar.march,
                sbcvar.april,
                sbcvar.may,
                sbcvar.june,
                sbcvar.july,
                sbcvar.august,
                sbcvar.septemper,
                sbcvar.october,
                sbcvar.november,
                sbcvar.december
            ],
            formatDate: 'yyyy-mm-dd'
        }).bind('click',function(){
            $('.datepicker-error').html('');
            $('.datepicker-error').hide();
        });
        $('#option-guest').popover({
            html : true,
            placement: 'bottom',
            content : `<ul>
                            <li class="bootstrap row no-adults">
                                <div class="bootstrap col-md-7">
                                    <span class="total">1</span> ${sbcvar.adults}
                                </div>
                                <div class="bootstrap col-md-5 text-right">
                                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                </div>
                            </li>
                            <li class="bootstrap row no-children">
                                <div class="bootstrap col-md-7">
                                    <span class="total">0</span> ${sbcvar.children}
                                </div>
                                <div class="bootstrap col-md-5 text-right">
                                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                </div>
                            </li>
                            <li class="bootstrap row no-rooms">
                                <div class="bootstrap col-md-7">
                                    <span class="total">1</span> ${sbcvar.room}
                                </div>
                                <div class="bootstrap col-md-5 text-right">
                                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                </div>
                            </li>
                        </ul>
                        <div class="text-right">
                            <input type="button" class="booking-apply" value="${sbcvar.apply}"/>
                        </div>`,
            trigger: 'manual'
        }).on('shown.bs.popover', function () {
            $('.no-adults .total').text(bookvar.adult);
            if(bookvar.adult==1)
                $('.no-adults i.fa-minus-circle').addClass('btn-min');
            if(bookvar.child.length==0)
                $('.no-children i.fa-minus-circle').addClass('btn-min');
            if(bookvar.room==1)
                $('.no-rooms i.fa-minus-circle').addClass('btn-min');
            childvar = bookvar.child;
            var opt = '';
            for(j=0;j<17;j++)
                opt += '<option>'+(j+1)+'</option>';
            var $popup = $(this);
            $('.no-children .total').text(childvar.length);
            if(childvar.length>0){
                $.each(childvar,function(key, item){
                    $('.no-children').parent('ul').append(`<li class="row child-opt child-`+(key+1)+`">
                    <div class="col-md-7">
                        ${sbcvar.age_of_child} `+(key+1)+`
                    </div>
                    <div class="col-md-5 text-right">
                        <select class="form-control child-age">
                        `+opt+`
                        </select>    
                    </li>`);
                    $('li.child-'+(key+1)).find('select.child-age').val(item);
                    $('select.child-age').change(function(){
                        var mcls = $(this).parents('li.row').attr('class').match(/child-(\d+)/);
                        if(mcls[1]!=undefined){
                            childvar[parseInt(mcls[1])-1] = $(this).val();
                        }
                    });
                });
            }
            $('.no-rooms .total').text(bookvar.room);
            $('.fa-plus-circle').click(function(){
                if($(this).prev().hasClass('btn-min'))
                    $(this).prev().removeClass('btn-min');
                var parent = $(this).parents('li.row');
                var total = parseInt(parent.find('.total').text());
                total += 1;
                if(parent.hasClass('no-children')){
                    for(i=0;i<total;i++){
                        if(parent.parent('ul').find('li.child-'+(i+1)).length==0)
                            parent.parent('ul').append(`<li class="row child-opt child-`+(i+1)+`">
                            <div class="col-md-7">
                                ${sbcvar.age_of_child} `+(i+1)+`
                            </div>
                            <div class="col-md-5 text-right">
                                <select class="form-control child-age">
                                `+opt+`
                                </select>    
                            </li>`);
                    }
                    $('select.child-age').change(function(){
                        var mcls = $(this).parents('li.row').attr('class').match(/child-(\d+)/);
                        if(mcls[1]!=undefined){
                            childvar[parseInt(mcls[1])-1] = $(this).val();
                        }
                    });
                    childvar = [];
                    $.each(parent.parent('ul').find('li.child-opt'),function(){
                        childvar.push($(this).find('select.child-age option:selected').val());
                    });
                }
                parent.find('.total').text(total)
            });
            $('.fa-minus-circle').click(function(){
                var parent = $(this).parents('li.row');
                var total = parseInt(parent.find('.total').text());
                if(parent.hasClass('no-adults')||parent.hasClass('no-rooms')){
                    if(total-1>1){
                        if($(this).hasClass('btn-min'))
                            $(this).removeClass('btn-min');
                        total -= 1;
                    }
                    else{
                        if(!$(this).hasClass('btn-min'))
                            $(this).addClass('btn-min');
                        total = 1;
                    }
                }
                else{
                    if(total-1>0){
                        if($(this).hasClass('btn-min'))
                            $(this).removeClass('btn-min');
                        parent.parent('ul').find('li.child-'+total).remove();
                        total -= 1;
                        childvar = [];
                        $.each(parent.parent('ul').find('li.child-opt'),function(){
                            childvar.push($(this).find('select.child-age option:selected').val());
                        });
                    }
                    else{
                        if(!$(this).hasClass('btn-min'))
                            $(this).addClass('btn-min');
                        total = 0;
                        parent.parent('ul').find('li.child-opt').remove();
                        childvar = [];
                    }
                }
                parent.find('.total').text(total);
            });
            $('input.booking-apply').click(function (e) {
                bookvar.adult=$('.no-adults .total').text();
                bookvar.child=childvar;
                bookvar.room=$('.no-rooms .total').text();
                $('#option-guest').val(bookvar.adult+' Adults · '+bookvar.child.length+' Children · '+bookvar.room+' Room'+(bookvar.room>1?'s':''));
                $popup.popover('hide');
            });
        });
        $('#option-guest').click(function(){
            $(this).popover('show');
        });
        $('body').on('click', function (e) {
            if ($(e.target).data('toggle') !== 'popover'
                && $(e.target).parents('.popover').length === 0) { 
                $('[data-toggle="popover"]').popover('hide');
            }
        });
        $('#travelDetailsForm').submit(function(e) {
            var haserror = false;
            if(bookvar.location.length<=0 || bookvar.location!=$('#destination').val()){
                $('.destination-error').html(sbcvar.error_location);
                $('.destination-error').show();
                haserror = true;
            }
            if($('[name="t-start"]').val()=="null"||$('[name="t-start"]').val().length<=0){
                $('.datepicker-error').html(sbcvar.error_checkin);
                $('.datepicker-error').show();
                haserror = true;
            }
            else if($('[name="t-end"]').val()=="null"||$('[name="t-end"]').val().length<=0){
                $('.datepicker-error').html(sbcvar.error_checkout);
                $('.datepicker-error').show();
                haserror = true;
            }

            if(!haserror){
                let params = {
                    locationQuery : bookvar.location,
                    regionId : bookvar.regionid,
                    checkInDate : $('[name="t-start"]').val() ,
                    checkOutDate : $('[name="t-end"]').val(),
                    roomCount : bookvar.room,
                    adultCount : bookvar.adult,
                    currency : 'USD',
                    searchId : bookvar.searchid,
                };
                if(bookvar.child.length>0)
                    params.children = bookvar.child.join(',');
                console.log("Params: %o", params);
                let zumataFullUrl = zumataRedirectBaseUrl+encodeURIComponent(jQuery('#destination').val())+'?'+jQuery.param(params);
                console.log("Full Submit Url: %s", zumataFullUrl);
                // window.location.assign(zumataFullUrl);
                window.open(zumataFullUrl, '_blank');
                e.preventDefault();
            }
            else{
                return false;
            }
        });

        function childOptChange(obj){
            console.log('change',obj);
        }

        // $.ajax({
        //     url:'http://appserver.uat.ipo-servers.net:5500/api/email',
        //     xhrFields: {
        //        withCredentials: true
        //     },
        //     async: true,
        //     // dataType: 'jsonp',
        //     crossDomain: true,
        //     done: function(result){
        //         console.log('result',result);
        //     }
        // });
        if(sbcvar.is_login==false){
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.status == 200) {
                    result = JSON.parse(xhr.response);
                    console.log('result',xhr.response);
                    if(result.status=="ok"){
                        isLogin = true;
                        $('#sbc-login-form').css('display','none');
                        $('#travelDetailsForm').css('display','block');
                        if(confirm(`${sbcvar.stay_login}`))
                            staylogin(result.payment_login);
                    }
                    else{
                    }
                }
                else{
                    console.log('error',xhr.response);
                }
            }
            xhr.open('GET', 'http://auth.easilytravel.io/api/email', true);
            xhr.withCredentials = true;
            xhr.send('');
        }
        else{
            isLogin = true;
            $('#sbc-login-form').css('display','none');
            $('#travelDetailsForm').css('display','block');
        }
    });

    function staylogin(email){
        console.log('adding email into cookie',email);
        var date = new Date();
        date.setDate(date.getDate() + 365);
        var dateString = date.toGMTString();
        var cookieString = 'payment_login='+email+';path=/;' + dateString;
        document.cookie = cookieString;
    }
});
