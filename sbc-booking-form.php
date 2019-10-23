<?php
/**
 * Plugin Name: SBC booking form
 * Plugin URI: https://www.dreamholidays.io/
 * Description: Custom search form for dreamholidays, use <code>[sbcbookingform]</code>.
 * Version: 1.0
 * Author: Adel Waehayi
 * Author URI: http://www.teslastudio.com
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function sbcbookingform_code(){
    $cconnect_api_key = '341FF761-D4D8-4D7E-86A7-A51C9CFA1EEA';
    $login_cconnect = 'https://auth.easilytravel.io/auth/login';
    $locale = apply_filters( 'wpml_current_language', NULL );
    if($locale=="zh-hans")
        $locale = "zh-cn";
    elseif($locale=="en")
        $locale = "en-us";
    return '<div id="sbc-login-form">
        <button type="button" class="btn btn-primary bootstrap" onclick="location.href=\''."{$login_cconnect}/{$cconnect_api_key}?language=$locale".'\'">'.__('Login to Search', 'sbcbooking').'<i class="fa fa-angle-right"></i></button>
        <button type="button" class="btn btn-primary bootstrap">'.__('Register', 'sbcbooking').'<i class="fa fa-angle-right"></i></button>
    </div>
    <form id="travelDetailsForm" method="get" style="display:none">
        <div class="bootstrap row">
            <div class="form-group bootstrap col-xl-3 col-lg-12">
                <div class="input-group bootstrap">
                <i class="booking-icon fa fa-map-marker"></i> <input id="destination" type="text" class="form-control basicAutocomplete" autocomplete="off" placeholder="'.__('Destination', 'sbcbooking').'">
                </div>
                <div class="destination-error has-error" style="display:none"></div>
            </div>
            <div class="form-group bootstrap col-xl-4 col-lg-12">
                <div class="input-group bootstrap">
                    <div id="dates" class="t-datepicker">
                        <div class="t-check-in"></div>
                        <div class="t-check-out"></div>
                    </div>
                </div>
                <div class="datepicker-error has-error" style="display:none"></div>
            </div>
            <div class="form-group bootstrap last col-xl-3 col-lg-12">
                <div class="input-group bootstrap">
                <i class="booking-icon fa fa-users"></i> <input type="button" id="option-guest" data-toggle="popover" value="2 '.__('Adults', 'sbcbooking').' · 0 '.__('Children', 'sbcbooking').' · 1 '.__('Room', 'sbcbooking').'"/>
                </div>
            </div>
            <div class="form-group bootstrap  last col-xl-2 col-lg-12">
                <div class="input-group bootstrap lastbtn">
                    <button type="submit" class="btn btn-primary bootstrap">'.__('Search', 'sbcbooking').'<i class="fa fa-angle-right"></i></button>
                </div>
            </div>
        </div>
    </form>
    <div>
        <input type="hidden" id="zumataRegionId">
        <input type="hidden" id="zumataSearchId">
    </div>';
}

add_shortcode( 'sbcbookingform', 'sbcbookingform_code' );

function sbcbookingform_scripts()
{
    $build = '1.10b';
    wp_enqueue_style( 'multidatespicker', plugins_url( '/', __FILE__ ) . 'assets/jquery-ui.multidatespicker.css' );
    wp_enqueue_style( 'jquery-ui', plugins_url( '/', __FILE__ ) . 'assets/jquery-ui.min.css' );
    // wp_enqueue_style( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' );
    wp_enqueue_style( 'bootstrap-custom', plugins_url( '/', __FILE__ ) . 'assets/bootstrap.custom.css?b='.$build );
    wp_enqueue_style( 't-datepicker', plugins_url( '/', __FILE__ ) . 'assets/t-datepicker.min.css' );
    // wp_enqueue_style( 't-datepicker-lime', plugins_url( '/', __FILE__ ) . 'assets/t-datepicker-lime.css' );
    wp_enqueue_style( 't-datepicker-red', plugins_url( '/', __FILE__ ) . 'assets/t-datepicker-red.css' );
    wp_enqueue_style( 'sbcbooking', plugins_url( '/', __FILE__ ) . 'assets/custom.css?b='.$build );
    if(file_exists(plugin_dir_path( __FILE__ ) . 'assets/custom-overide.css')){
        wp_enqueue_style( 'sbcbooking-overide', plugins_url( '/', __FILE__ ) . 'assets/custom-overide.css?b='.$build );
    }

    wp_enqueue_script( 'jquery-ui', plugins_url( '/', __FILE__ ) . 'assets/jquery-ui.min.js', array('jquery'));
    wp_enqueue_script( 'popper', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', array('jquery'));
    wp_enqueue_script( 'bootstrap-js', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js', array('jquery'));
    wp_enqueue_script( 't-datepicker', plugins_url( '/', __FILE__ ) . 'assets/t-datepicker.min.js', array('jquery'));
    wp_register_script( 'sbcbooking', plugins_url( '/', __FILE__ ) . 'assets/custom.js?b='.$build, array('jquery'));
    $locale = apply_filters( 'wpml_current_language', NULL );
    if($locale=="zh-hans")
        $locale = "zh-cn";
    elseif($locale=="en")
        $locale = "en-us";
    wp_localize_script( 'sbcbooking', 'sbcvar', array(
        'adults' => __( 'Adults', 'sbcbooking' ),
        'children' => __( 'Children', 'sbcbooking' ),
        'room' => __( 'Room', 'sbcbooking' ),
        'apply' => __( 'Apply', 'sbcbooking' ),
        'age_of_child' => __( 'Age of child', 'sbcbooking' ),
        'checkin' => __( 'Check In', 'sbcbooking' ),
        'checkout' => __( 'Check Out', 'sbcbooking' ),
        'today' => __( 'Today', 'sbcbooking' ),
        'night' => __( 'Night', 'sbcbooking' ),
        'nights' => __( 'Nights', 'sbcbooking' ),
        'mo' => __( 'Mo', 'sbcbooking' ),
        'tu' => __( 'Tu', 'sbcbooking' ),
        'we' => __( 'We', 'sbcbooking' ),
        'th' => __( 'Th', 'sbcbooking' ),
        'fr' => __( 'Fr', 'sbcbooking' ),
        'sa' => __( 'Sa', 'sbcbooking' ),
        'su' => __( 'Su', 'sbcbooking' ),
        'january' => __( 'January', 'sbcbooking' ),
        'february' => __( 'February', 'sbcbooking' ),
        'march' => __( 'March', 'sbcbooking' ),
        'april' => __( 'April', 'sbcbooking' ),
        'may' => __( 'May', 'sbcbooking' ),
        'june' => __( 'June', 'sbcbooking' ),
        'july' => __( 'July', 'sbcbooking' ),
        'august' => __( 'August', 'sbcbooking' ),
        'septemper' => __( 'Septemper', 'sbcbooking' ),
        'october' => __( 'October', 'sbcbooking' ),
        'november' => __( 'November', 'sbcbooking' ),
        'december' => __( 'December', 'sbcbooking' ),
        'locale' => $locale,
        'error_location' => __( 'Please select destination from list', 'sbcbooking' ),
        'error_checkin' => __( 'Check In date is required', 'sbcbooking' ),
        'error_checkout' => __( 'Check Out date is required', 'sbcbooking' ),
        'stay_login' => __('Do you want to stay login next time?','sbcbooking'),
        'is_login' => isset($_COOKIE['payment_login'])&&!empty($_COOKIE['payment_login'])?true:false,
        'search' => __('Search','sbcbooking'),
        'login' => __('Login','sbcbooking'),
    ));
    wp_enqueue_script( 'sbcbooking' );
    
}
add_action( 'wp_enqueue_scripts', 'sbcbookingform_scripts' );

function sbcbookingform_init(){
    // header('Access-Control-Allow-Credentials: true');
    // header('Access-Control-Allow-Origin: http://appserver.uat.ipo-servers.net');

    // $args = json_decode(file_get_contents('php://input'),true);
    // if(isset($args['email'])) {
    //     // setcookie('email', $args['email'], time()+365*24*60*60, '/', '/');
    //     $_SESSION['email'] = $args['email'];
    //     if(isset($_SESSION['email']))
    //         die('OK '.$_SESSION['email']);
    //     else
    //         die('NOK '.$args['email']);
    //     //echo '<script> if(confirm("'.__('Do you want to stay login next time?').'")) {   }</script>';
    // }
    // elseif(isset($args['show_cookie'])){
    //     if(isset($_SESSION['email']))
    //         die('OK '.$_SESSION['email']);
    //     else
    //         die('NOK');
    // }
    // if(isset($_GET['email'])){
    //     if(setcookie('email',urldecode($_GET['email']),time()+365*24*60*60)){
    //         if (!session_id()) {
    //             session_start();
    //         }
    //         // $_SESSION['prompt_set'] = true;
    //         setcookie('prompt_set',true,time()+24*60*60);
    //         header('Location: '.site_url());
    //         // echo '<html>
    //         // <body>
    //         // </body>
    //         // <script>
    //         //     var xmlHttp = new XMLHttpRequest();
    //         //     xmlHttp.open("POST", "http://easilytravel.txrouter.noi.dev.ipo-servers.net/app_dev.php/set_cconnect_login", true);
    //         //     xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //         //     xmlHttp.onreadystatechange = function() { // Call a function when the state changes.
    //         //         if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    //         //             window.location.replace("'.site_url().'");
    //         //         }
    //         //     }
    //         //     xmlHttp.send(null);
    //         // </script>
    //         // </html>';
    //         exit;
    //     }
    // }
    // if(isset($_GET['SameSiteCookie'])){
    //     $ch = curl_init();
    //     curl_setopt($ch, CURLOPT_URL, "http://appserver.uat.ipo-servers.net:5500/api/email");
    //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //     $output = curl_exec($ch);
    //     curl_close($ch);      
    //     print_r($output);
    //     exit;
    // }
}
add_action( 'init', 'sbcbookingform_init' );
