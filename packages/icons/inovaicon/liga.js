/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'sort-alpha-asc': '&#xe9b5;',
            'sort': '&#xe9b5;',
            'sun': '&#xe647;',
            'brightness2': '&#xe647;',
            'presentation': '&#xe6f6;',
            'board': '&#xe6f6;',
            'briefcase': '&#xe83a;',
            'suitcase': '&#xe83a;',
            'clock3': '&#xe8e8;',
            'time3': '&#xe8e8;',
            'play-circle': '&#xe96a;',
            'play2': '&#xe96a;',
            'border-all': '&#xe9df;',
            'border2': '&#xe9df;',
            'archery': '&#xe870;',
            'sports13': '&#xe870;',
            'happy': '&#xe889;',
            'emoticon': '&#xe889;',
            'sad': '&#xe88d;',
            'emoticon5': '&#xe88d;',
            'apartment': '&#xe60c;',
            'building8': '&#xe60c;',
            'enter-right2': '&#xe915;',
            'right4': '&#xe915;',
            'plus': '&#xe936;',
            'add': '&#xe936;',
            'expand': '&#xe94a;',
            'maximize': '&#xe94a;',
            'contract': '&#xe94b;',
            'minimize': '&#xe94b;',
            'tree': '&#xe768;',
            'hierarchy': '&#xe768;',
            'expand2': '&#xe94c;',
            'maximize2': '&#xe94c;',
            'expand3': '&#xe951;',
            'maximize3': '&#xe951;',
            'frame-expand': '&#xe971;',
            'maximize5': '&#xe971;',
            'resize-handle': '&#xe87f;',
            'refresh': '&#xe8d3;',
            'spinner4': '&#xe8d3;',
            'sigma': '&#xe9bd;',
            'symbols': '&#xe9bd;',
            'users': '&#xe722;',
            'group': '&#xe722;',
            'group-work': '&#xe726;',
            'group5': '&#xe726;',
            'flash-quicktext': '&#xe7bb;',
            'lightning3': '&#xe7bb;',
            'puzzle': '&#xe876;',
            'piece': '&#xe876;',
            'check2': '&#xe914;',
            'double-check': '&#xe914;',
            'binoculars2': '&#xe6aa;',
            'lookup2': '&#xe6aa;',
            'magnifier': '&#xe922;',
            'search': '&#xe922;',
            'check-square': '&#xe999;',
            'checkmark3': '&#xe999;',
            'minus': '&#xe937;',
            'subtract': '&#xe937;',
            'arrow-left': '&#xe943;',
            'left9': '&#xe943;',
            'arrow-right': '&#xe944;',
            'right7': '&#xe944;',
            'minus-square': '&#xe98f;',
            'subtract3': '&#xe98f;',
            'picture': '&#xe70e;',
            'photo5': '&#xe70e;',
            'shield': '&#xe667;',
            'security': '&#xe667;',
            'shield-check': '&#xe668;',
            'shield2': '&#xe668;',
            'unlock': '&#xe66d;',
            'lock2': '&#xe66d;',
            'star': '&#xe68d;',
            'rating': '&#xe68d;',
            'eye': '&#xe6a5;',
            'vision': '&#xe6a5;',
            'eye-crossed': '&#xe6a6;',
            'eye2': '&#xe6a6;',
            'network': '&#xe886;',
            'globe2': '&#xe886;',
            'thumbs-up2': '&#xe91b;',
            'like2': '&#xe91b;',
            'thumbs-down2': '&#xe91c;',
            'dislike2': '&#xe91c;',
            'question': '&#xe933;',
            'help2': '&#xe933;',
            'check': '&#xe934;',
            'checkmark': '&#xe934;',
            'funnel': '&#xe97c;',
            'filter': '&#xe97c;',
            'file-pdf': '&#xe900;',
            'file': '&#xe900;',
            'home': '&#xe901;',
            'building': '&#xe901;',
            'lock': '&#xe902;',
            'privacy': '&#xe902;',
            'printer': '&#xe903;',
            'print': '&#xe903;',
            'chevron-up': '&#xe904;',
            'up': '&#xe904;',
            'chevron-down': '&#xe905;',
            'down': '&#xe905;',
            'chevron-left': '&#xe906;',
            'left': '&#xe906;',
            'chevron-right': '&#xe907;',
            'right': '&#xe907;',
            'notification-circle': '&#xe908;',
            'alert': '&#xe908;',
            'question-circle': '&#xe909;',
            'help': '&#xe909;',
            'checkmark-circle': '&#xe912;',
            'checkmark': '&#xe912;',
            'chevron-up-circle': '&#xe90b;',
            'up2': '&#xe90b;',
            'chevron-down-circle': '&#xe90c;',
            'down2': '&#xe90c;',
            'chevron-left-circle': '&#xe90d;',
            'left2': '&#xe90d;',
            'chevron-right-circle': '&#xe90e;',
            'right2': '&#xe90e;',
            'spinner': '&#xe90f;',
            'loading': '&#xe90f;',
            'stats-bars': '&#xe910;',
            'stats': '&#xe910;',
            'cog': '&#xe672;',
            'gear': '&#xe672;',
            'enter': '&#xe6d2;',
            'door': '&#xe6d2;',
            'exit-down': '&#xe8fc;',
            'down4': '&#xe8fc;',
            'exit-right': '&#xe8fe;',
            'right3': '&#xe8fe;',
            'exit-up2': '&#xe90a;',
            'up6': '&#xe90a;',
            'exit-left2': '&#xe911;',
            'left7': '&#xe911;',
            'menu': '&#xe92b;',
            'options': '&#xe92b;',
            'list': '&#xe92c;',
            'options2': '&#xe92c;',
            'indent-increase': '&#xe9ad;',
            'typography14': '&#xe9ad;',
            'indent-decrease': '&#xe9ae;',
            'typography15': '&#xe9ae;',
            'database': '&#xe65d;',
            'storage': '&#xe65d;',
            'trash2': '&#xe681;',
            'bin2': '&#xe681;',
            'pie-chart': '&#xe7f8;',
            'chart': '&#xe7f8;',
            'chart-bars': '&#xe7fc;',
            'chart5': '&#xe7fc;',
            'cross': '&#xe92a;',
            'cancel': '&#xe92a;',
            'menu': '&#xe92d;',
            'options': '&#xe92d;',
            'menu-circle': '&#xe958;',
            'menu4': '&#xe958;',
            'cross-circle': '&#xe95a;',
            'cross3': '&#xe95a;',
            'pencil-line': '&#xe9be;',
            'border-color': '&#xe9be;',
            'square': '&#xe98d;',
            'geometry2': '&#xe98d;',
            'plus-square': '&#xe98e;',
            'add2': '&#xe98e;',
            'menu-square': '&#xe99b;',
            'menu5': '&#xe99b;',
            'exit-left': '&#xe8fd;',
            'left5': '&#xe8fd;',
            'exit-right2': '&#xe913;',
            'right5': '&#xe913;',
            'clipboard-pencil': '&#xe6ca;',
            'clipboard3': '&#xe6ca;',
            'calendar-check': '&#xe786;',
            'calendar2': '&#xe786;',
            'calendar-full': '&#xe789;',
            'calendar5': '&#xe789;',
            'calendar-text': '&#xe78b;',
            'calendar7': '&#xe78b;',
            'bubble': '&#xe7d6;',
            'chat': '&#xe7d6;',
            'bubble-text': '&#xe7db;',
            'chat6': '&#xe7db;',
            'sync2': '&#xe8dd;',
            'spinner7': '&#xe8dd;',
            'sync-crossed2': '&#xe8df;',
            'alarm2': '&#xe8aa;',
            'bell': '&#xe8aa;',
            'notification': '&#xe954;',
            'alert2': '&#xe954;',
            'warning': '&#xe955;',
            'alert3': '&#xe955;',
            'floppy-disk': '&#xe6ae;',
            'storage4': '&#xe6ae;',
            'return': '&#xe8e0;',
            'backward': '&#xe8e0;',
            'plus-circle': '&#xe95b;',
            'plus2': '&#xe95b;',
            'eraser': '&#xe611;',
            'rubber': '&#xe611;',
            'pencil5': '&#xe613;',
            'write6': '&#xe613;',
            'file-add': '&#xe6b4;',
            'file2': '&#xe6b4;',
            'paste': '&#xe6c8;',
            'clipboard': '&#xe6c8;',
            'register': '&#xe6d1;',
            'signature': '&#xe6d1;',
            'footprint': '&#xe833;',
            'steps': '&#xe833;',
            'user': '&#xe71e;',
            'persona': '&#xe71e;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/i-icon/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
