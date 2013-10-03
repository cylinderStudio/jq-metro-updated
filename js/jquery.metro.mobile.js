;(function($){
    $.mobile.metro = {};

    $.mobile.metro.themes = {
        dark: {foreground: "#fff", background: "#000"},
        light: {foreground: "#000", background: "#fff"}
    }
    $.mobile.metro.accents = {
        magenta: { color: "#EB1691"},
        purple : { color: "#7D50A0"},
        teal   : { color: "#16ABA9"},
        lime   : { color: "#8BC140"},
        brown  : { color: "#986829"},
        pink   : { color: "#DD72AC"},
        mango  : { color: "#F09720"},
        blue   : { color: "#24A0DA"},
        red    : { color: "#E61E26"},
        green  : { color: "#309B46"}    
    };

    // defaults
    $.mobile.metro.defaultEasing = "easeOutQuint";
    $.mobile.metro.defaultAccent = "red";
    $.mobile.metro.defaultTheme = "light";

    // accents
    $.mobile.metro.accent_css_template = ".ui-accent-#NAME# .ui-bg-accent {background:#COLOR#;} .ui-accent-#NAME# .ui-fg-accent {color:#COLOR#;} .ui-accent-#NAME# .ui-bo-accent {border-color:#COLOR#;}";
    $.mobile.metro.init_accents = function(){
        var accentStyle = $("head style#accents");
        if(accentStyle.length) return;

        accentStyle = $("<style id='accents' />").appendTo($("head"));

        for (var accent in $.mobile.metro.accents) {
            accentStyle.append($.mobile.metro.accent_css_template
                .replace(/#NAME#/g, accent)
                .replace(/#COLOR#/g, $.mobile.metro.accents[accent].color));
        }

        // set default
        $.mobile.metro.changeAccent($.mobile.metro.getCurrentAccent());
    };
    $.mobile.metro.getCurrentAccent = function(){ return $.cookie("ui-accent") || $.mobile.metro.defaultAccent; };
    $.mobile.metro.changeAccent = function(changeTo){
        for (var accent in $.mobile.metro.accents) {
            $(document.body).removeClass("ui-accent-" + accent);
        }
        $(document.body).addClass("ui-accent-" + changeTo);
        $.cookie("ui-accent", changeTo);
    };

    // themes
    $.mobile.metro.theme_css_template = ".ui-theme-#NAME# .ui-bg, .ui-theme-#NAME#.ui-bg {background:#BG#;} .ui-theme-#NAME# .ui-bg-ph-fg {background:#FG#;} .ui-theme-#NAME# .ui-fg, .ui-theme-#NAME# a, .ui-theme-#NAME#.ui-fg {color:#FG#;} .ui-theme-#NAME#.ui-fg-ph-bg, .ui-theme-#NAME# .ui-fg-ph-bg {color:#BG#;} .ui-theme-#NAME# .ui-border, .ui-theme-#NAME#.ui-border {border-color:#FG#;} .ui-theme-#NAME# .ui-bo-ph-bg {border-color:#BG#;}";
    $.mobile.metro.init_themes = function(){
        var themeStyle = $("head style#themes");
        if(themeStyle.length) return;

        themeStyle = $("<style id='theme' />").appendTo($("head"));

        for (var theme in $.mobile.metro.themes) {
            themeStyle.append($.mobile.metro.theme_css_template
                .replace(/#NAME#/g, theme)
                .replace(/#FG#/g, $.mobile.metro.themes[theme].foreground)
                .replace(/#BG#/g, $.mobile.metro.themes[theme].background)
                );
        }

        // set default
        $.mobile.metro.changeTheme($.mobile.metro.getCurrentTheme());
    };
    $.mobile.metro.getCurrentTheme = function(){ return $.cookie("ui-theme") || $.mobile.metro.defaultTheme; };
    $.mobile.metro.changeTheme = function(changeTo){
        for (var theme in $.mobile.metro.themes) {
            $(document.body).removeClass("ui-theme-" + theme);
        }
        $(document.body).addClass("ui-theme-" + changeTo);
        $.cookie("ui-theme", changeTo);
    };


    $.mobile.metro.init = function ($page) {
        // initialize page
        $page.addClass("ui-bg ui-fg")
        
        // appBar: must be first
        var appbarElement = $page.find(".ui-app-bar").first();
        if(appbarElement.length){
            $.mobile.metro._init_applicationBar($page, appbarElement);
        }

        // list picker
        $page.find(".ui-list-picker-select").metroListPicker();

        // panorama        
        $page.find(".ui-panorama").metroPanorama();

        // pivot
        $page.find(".ui-pivot").metroPivot();

        // toggle switch
        $page.find(".ui-toggleswitch").metroToggleSwitch();

        // progress bar
        $page.find(".ui-progressbar").metroProgressBar();

        // context menu
        $page.find(".ui-context-menu").metroContextMenu();

        // last thing: setup scrollviewer
        $.mobile.metro._init_scrollviewer($page);
    };

    $.mobile.metro._init_scrollviewer = function($page){
        $page.find(":jqmData(scroll):not(.ui-scrollview-clip)").each(function () {
            var $this = $(this);
            
            // XXX: Remove this check for ui-scrolllistview once we've
            //      integrated list divider support into the main scrollview class.
            if ($this.hasClass("ui-scrolllistview")) {
                $this.scrolllistview();
            }
            else {
                var st = $this.jqmData("scroll") + "";
                var paging = st && st.search(/^[xy]p$/) != -1;
                var dir = st && st.search(/^[xy]/) != -1 ? st.charAt(0) : null;

                var opts = {};
                if (dir)
                    opts.direction = dir;
                if (paging)
                    opts.pagingEnabled = true;

                var method = $this.jqmData("scroll-method");
                if (method)
                    opts.scrollMethod = method;
                else
                    opts.scrollMethod = "position";

                opts.propagateEvent = true;

                $this.scrollview(opts).bind("scrollstop", function(){console.log(new Date());});
            }
        });
    };

    $.mobile.metro._init_applicationBar = function($page, appbarElement){
        var opacity = parseFloat(appbarElement.attr("data-opacity") || "1");
        var isSolid = opacity >= 1;

        var content = $page.find(".ui-content");

        var buttons = appbarElement.find(".ui-app-bar-buttons");
        var insideWrapper = $("<div class='ui-app-bar-inside' />").appendTo(appbarElement);
        var titles = $("<div class='ui-app-bar-titles' />").appendTo(insideWrapper);
        var menu = appbarElement.find(".ui-app-bar-menu").attr("data-scroll", "y").detach().appendTo(insideWrapper);

        appbarElement.open = function(){ 
            insideWrapper.stop(true, true).slideDown(400, $.mobile.metro.defaultEasing)
                .find(".ui-app-bar-menu li").each(function(index, el){ $(el).css({paddingTop: index * 60}); }).animate({paddingTop:0}, "linear"); 
        };
        appbarElement.close = function(){ insideWrapper.stop(true, true).slideUp(400, $.mobile.metro.defaultEasing); };

        content.click(function(){ appbarElement.close(); });

        // add titles
        buttons.find("a img").each(function(index, el){
            titles.append($("<span />").html($(el).attr("alt") || ("button " + index)));
        });

        // prevent buttons to propagate click
        buttons.find("a").click(function(ev){ ev.stopPropagation(); });


        appbarElement.click(function(){
            if(insideWrapper.is(":visible")) appbarElement.close();
            else appbarElement.open();
        });

        if(isSolid){
            content.height(content.height() - buttons.outerHeight());
        }
        else{
            var myColor = appbarElement.css("background-color");
            if(myColor && myColor.indexOf("rgb(") >= 0){
                myColor = myColor.replace(")", ", " + opacity + ")").replace("rgb", "rgba");
                appbarElement.css("background-color", myColor);
            }
        }
    }
})(jQuery);

$(function(){
    $.mobile.metro.init_accents();
    $.mobile.metro.init_themes();
});

// == EXTEND JQUERY MOBILE
// $("[data-role=page]").live("pagebeforeshow", function () {       // $.live is deprecated for $.on

$("[data-role=page]").on("pagebeforeshow", function () {
    // TODO: initialize metro-ui-mobile elements
    var $page = $(this);
    
    // $page.find(".ui-content").height($page.height());    
    // GM: $page.height() reporting as zero - apparently more reliable to get window height
    $page.find(".ui-content").height($(window).height());

    $.mobile.metro.init($page);
});


// $("[data-role=page]").live("pagebeforecreate", function () {
$("[data-role=page]").on("pagebeforecreate", function () {          // $.live is deprecated for $.on
    var $page = $(this);

    // disable jquery mobile initialization
    $page.find("a, select, :checkbox, :radio").not("[data-role]").attr("data-role", "none");
});

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function (a, b, c) { if (arguments.length > 1 && String(b) !== "[object Object]") { c = jQuery.extend({}, c); if (b === null || b === undefined) { c.expires = -1 } if (typeof c.expires === "number") { var d = c.expires, e = c.expires = new Date; e.setDate(e.getDate() + d) } b = String(b); return document.cookie = [encodeURIComponent(a), "=", c.raw ? b : encodeURIComponent(b), c.expires ? "; expires=" + c.expires.toUTCString() : "", c.path ? "; path=" + c.path : "", c.domain ? "; domain=" + c.domain : "", c.secure ? "; secure" : ""].join("") } c = b || {}; var f, g = c.raw ? function (a) { return a } : decodeURIComponent; return (f = (new RegExp("(?:^|; )" + encodeURIComponent(a) + "=([^;]*)")).exec(document.cookie)) ? g(f[1]) : null }