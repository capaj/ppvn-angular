//ppvn-angular version 0.1.0 
angular.module('PPVN', []);
angular.module('PPVN').directive('perspectiveViewNavigation', function () {
    var effect;
    return {
        controller: function() {
            this.effect = effect;
            this.effectClass = 'effect-' + effect;
            this.menuShown = false;
        },
        compile: function (el, attrs) {

            effect = attrs.perspectiveViewNavigation;

            if (!effect) {
                throw 'you must specify an effect';
            }
        }
    };
}).directive('perspectiveViewMenu', function () {
	var rv = 'right vertical';
	var th = 'top horizontal';

	var menuClasses = {
		airbnb: 'left vertical',
		moveleft: rv,
		rotateleft: rv,
		movedown: th,
		laydown: th,
		rotatetop: 'bottom horizontal'
	};

	return {
        restrict: 'EA',
        require: '^perspectiveViewNavigation',
        link: function (scope, el, attrs, ppvnController) {
            el.addClass(ppvnController.effectClass);
            el.find('nav').addClass(menuClasses[ppvnController.effect]);

			ppvnController.addClassToMenu = function (cl) {
                return el.addClass(cl);
            };
            ppvnController.removeClassOnMenu = function (cl) {
                return el.removeClass(cl);
            };
        }
    };
}).directive('perspectiveView', ["$window", "$timeout", "ModernizrSupport", function ($window, $timeout, ModernizrSupport) {
    var doc = $window.document;
    var docElem = document.documentElement;

    function scrollY() {
        return $window.pageYOffset || docElem.scrollTop;
    }

    // from http://stackoverflow.com/a/11381730/989439
    function mobilecheck() {
        var check = false;
        (function (a) {
            if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
        })(navigator.userAgent || navigator.vendor || $window.opera);
        return check;
    }

    // support transitions
    var support = ModernizrSupport.csstransitions;
    // transition end event name
    var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[ ModernizrSupport.prefixed('transition') ],
        docscroll = 0,
    // click event (if mobile use touchstart)
        clickevent = mobilecheck() ? 'touchstart' : 'click';

    var getFirstChild = function (el) {
        return el.children()[0];
    };

    return {
        restrict: 'EA',
        transclude: true,
        require: '^perspectiveViewNavigation',
        template: '<div class="container"><div class="wrapper" ng-transclude></div>',
        link: function (scope, el, attrs, ppvnController) {
            el.addClass('perspective');
            el.addClass(ppvnController.effectClass);

            var perspectiveWrapper = el[0];
            var container = getFirstChild(el);
            var contentWrapper = getFirstChild(el.children());

            container.addEventListener(clickevent, function (ev) {
                if (ppvnController.menuShown) {
                    var onEndTransFn = function (ev) {
                        if (support && ( ev.target.className !== 'container' || ev.propertyName.indexOf('transform') == -1 )) return;
                        this.removeEventListener(transEndEventName, onEndTransFn);

                        el.removeClass('modalview');
                        ppvnController.removeClassOnMenu('modalview');
                        ppvnController.menuShown = false;

                        // mac chrome issue:
                        doc.body.scrollTop = docElem.scrollTop = docscroll;
                        // change top of contentWrapper
                        contentWrapper.style.top = '0px';
                    };
                    if (support) {
                        perspectiveWrapper.addEventListener(transEndEventName, onEndTransFn);
                    }
                    else {
                        onEndTransFn.call();
                    }
                    el.removeClass('animate');

                    ppvnController.removeClassOnMenu('animate');


                }
            });

            scope.showMenu = function () {
                docscroll = scrollY();
                // change top of contentWrapper
                contentWrapper.style.top = docscroll * -1 + 'px';
                // mac chrome issue:
                doc.body.scrollTop = docElem.scrollTop = 0;
                // add modalview class
                el.addClass('modalview');

                ppvnController.addClassToMenu('modalview');
                // animate..
                $timeout(function () {
                    el.addClass('animate');

                    ppvnController.addClassToMenu('animate');
                    ppvnController.menuShown = true;
                }, 25);
            };

        }
    };
}]);
angular.module('PPVN').factory('ModernizrSupport', ["$window", function ($window) {
    /* Modernizr 2.8.2 (Custom Build) | MIT & BSD
     * Build: http://modernizr.com/download/#-csstransforms3d-csstransitions-shiv-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load
     */

    var Modernizr = (function( window, document, undefined ) {

        var version = '2.8.2',

            Modernizr = {},

            enableClasses = true,

            docElement = document.documentElement,

            mod = 'modernizr',
            modElem = document.createElement(mod),
            mStyle = modElem.style,

            inputElem  ,


            toString = {}.toString,

            prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



            omPrefixes = 'Webkit Moz O ms',

            cssomPrefixes = omPrefixes.split(' '),

            domPrefixes = omPrefixes.toLowerCase().split(' '),


            tests = {},
            inputs = {},
            attrs = {},

            classes = [],

            slice = classes.slice,

            featureName,


            injectElementWithStyles = function( rule, callback, nodes, testnames ) {

                var style, ret, node, docOverflow,
                    div = document.createElement('div'),
                    body = document.body,
                    fakeBody = body || document.createElement('body');

                if ( parseInt(nodes, 10) ) {
                    while ( nodes-- ) {
                        node = document.createElement('div');
                        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                        div.appendChild(node);
                    }
                }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
                div.id = mod;
                (body ? div : fakeBody).innerHTML += style;
                fakeBody.appendChild(div);
                if ( !body ) {
                    fakeBody.style.background = '';
                    fakeBody.style.overflow = 'hidden';
                    docOverflow = docElement.style.overflow;
                    docElement.style.overflow = 'hidden';
                    docElement.appendChild(fakeBody);
                }

                ret = callback(div, rule);
                if ( !body ) {
                    fakeBody.parentNode.removeChild(fakeBody);
                    docElement.style.overflow = docOverflow;
                } else {
                    div.parentNode.removeChild(div);
                }

                return !!ret;

            },
            _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

        if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
            hasOwnProp = function (object, property) {
                return _hasOwnProperty.call(object, property);
            };
        }
        else {
            hasOwnProp = function (object, property) {
                return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
            };
        }


        if (!Function.prototype.bind) {
            Function.prototype.bind = function bind(that) {

                var target = this;

                if (typeof target != "function") {
                    throw new TypeError();
                }

                var args = slice.call(arguments, 1),
                    bound = function () {

                        if (this instanceof bound) {

                            var F = function(){};
                            F.prototype = target.prototype;
                            var self = new F();

                            var result = target.apply(
                                self,
                                args.concat(slice.call(arguments))
                            );
                            if (Object(result) === result) {
                                return result;
                            }
                            return self;

                        } else {

                            return target.apply(
                                that,
                                args.concat(slice.call(arguments))
                            );

                        }

                    };

                return bound;
            };
        }

        function setCss( str ) {
            mStyle.cssText = str;
        }

        function setCssAll( str1, str2 ) {
            return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
        }

        function is( obj, type ) {
            return typeof obj === type;
        }

        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        function testProps( props, prefixed ) {
            for ( var i in props ) {
                var prop = props[i];
                if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                    return prefixed == 'pfx' ? prop : true;
                }
            }
            return false;
        }

        function testDOMProps( props, obj, elem ) {
            for ( var i in props ) {
                var item = obj[props[i]];
                if ( item !== undefined) {

                    if (elem === false) return props[i];

                    if (is(item, 'function')){
                        return item.bind(elem || obj);
                    }

                    return item;
                }
            }
            return false;
        }

        function testPropsAll( prop, prefixed, elem ) {

            var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
                props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if(is(prefixed, "string") || is(prefixed, "undefined")) {
                return testProps(props, prefixed);

            } else {
                props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
                return testDOMProps(props, prefixed, elem);
            }
        }    tests['csstransforms3d'] = function() {

            var ret = !!testPropsAll('perspective');

            if ( ret && 'webkitPerspective' in docElement.style ) {

                injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
                    ret = node.offsetLeft === 9 && node.offsetHeight === 3;
                });
            }
            return ret;
        };


        tests['csstransitions'] = function() {
            return testPropsAll('transition');
        };



        for ( var feature in tests ) {
            if ( hasOwnProp(tests, feature) ) {
                featureName  = feature.toLowerCase();
                Modernizr[featureName] = tests[feature]();

                classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
            }
        }



        Modernizr.addTest = function ( feature, test ) {
            if ( typeof feature == 'object' ) {
                for ( var key in feature ) {
                    if ( hasOwnProp( feature, key ) ) {
                        Modernizr.addTest( key, feature[ key ] );
                    }
                }
            } else {

                feature = feature.toLowerCase();

                if ( Modernizr[feature] !== undefined ) {
                    return Modernizr;
                }

                test = typeof test == 'function' ? test() : test;

                if (typeof enableClasses !== "undefined" && enableClasses) {
                    docElement.className += ' ' + (test ? '' : 'no-') + feature;
                }
                Modernizr[feature] = test;

            }

            return Modernizr;
        };


        setCss('');
        modElem = inputElem = null;

        ;(function(window, document) {
            var version = '3.7.0';

            var options = window.html5 || {};

            var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

            var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

            var supportsHtml5Styles;

            var expando = '_html5shiv';

            var expanID = 0;

            var expandoData = {};

            var supportsUnknownElements;

            (function() {
                try {
                    var a = document.createElement('a');
                    a.innerHTML = '<xyz></xyz>';
                    supportsHtml5Styles = ('hidden' in a);

                    supportsUnknownElements = a.childNodes.length == 1 || (function() {
                        (document.createElement)('a');
                        var frag = document.createDocumentFragment();
                        return (
                            typeof frag.cloneNode == 'undefined' ||
                            typeof frag.createDocumentFragment == 'undefined' ||
                            typeof frag.createElement == 'undefined'
                            );
                    }());
                } catch(e) {
                    supportsHtml5Styles = true;
                    supportsUnknownElements = true;
                }

            }());

            function addStyleSheet(ownerDocument, cssText) {
                var p = ownerDocument.createElement('p'),
                    parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

                p.innerHTML = 'x<style>' + cssText + '</style>';
                return parent.insertBefore(p.lastChild, parent.firstChild);
            }

            function getElements() {
                var elements = html5.elements;
                return typeof elements == 'string' ? elements.split(' ') : elements;
            }

            function getExpandoData(ownerDocument) {
                var data = expandoData[ownerDocument[expando]];
                if (!data) {
                    data = {};
                    expanID++;
                    ownerDocument[expando] = expanID;
                    expandoData[expanID] = data;
                }
                return data;
            }

            function createElement(nodeName, ownerDocument, data){
                if (!ownerDocument) {
                    ownerDocument = document;
                }
                if(supportsUnknownElements){
                    return ownerDocument.createElement(nodeName);
                }
                if (!data) {
                    data = getExpandoData(ownerDocument);
                }
                var node;

                if (data.cache[nodeName]) {
                    node = data.cache[nodeName].cloneNode();
                } else if (saveClones.test(nodeName)) {
                    node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
                } else {
                    node = data.createElem(nodeName);
                }

                return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
            }

            function createDocumentFragment(ownerDocument, data){
                if (!ownerDocument) {
                    ownerDocument = document;
                }
                if(supportsUnknownElements){
                    return ownerDocument.createDocumentFragment();
                }
                data = data || getExpandoData(ownerDocument);
                var clone = data.frag.cloneNode(),
                    i = 0,
                    elems = getElements(),
                    l = elems.length;
                for(;i<l;i++){
                    clone.createElement(elems[i]);
                }
                return clone;
            }

            function shivMethods(ownerDocument, data) {
                if (!data.cache) {
                    data.cache = {};
                    data.createElem = ownerDocument.createElement;
                    data.createFrag = ownerDocument.createDocumentFragment;
                    data.frag = data.createFrag();
                }


                ownerDocument.createElement = function(nodeName) {
                    if (!html5.shivMethods) {
                        return data.createElem(nodeName);
                    }
                    return createElement(nodeName, ownerDocument, data);
                };

                ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                        'var n=f.cloneNode(),c=n.createElement;' +
                        'h.shivMethods&&(' +
                        getElements().join().replace(/[\w\-]+/g, function(nodeName) {
                            data.createElem(nodeName);
                            data.frag.createElement(nodeName);
                            return 'c("' + nodeName + '")';
                        }) +
                        ');return n}'
                )(html5, data.frag);
            }

            function shivDocument(ownerDocument) {
                if (!ownerDocument) {
                    ownerDocument = document;
                }
                var data = getExpandoData(ownerDocument);

                if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                    data.hasCSS = !!addStyleSheet(ownerDocument,
                            'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                            'mark{background:#FF0;color:#000}' +
                            'template{display:none}'
                    );
                }
                if (!supportsUnknownElements) {
                    shivMethods(ownerDocument, data);
                }
                return ownerDocument;
            }

            var html5 = {

                'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

                'version': version,

                'shivCSS': (options.shivCSS !== false),

                'supportsUnknownElements': supportsUnknownElements,

                'shivMethods': (options.shivMethods !== false),

                'type': 'default',

                'shivDocument': shivDocument,

                createElement: createElement,

                createDocumentFragment: createDocumentFragment
            };

            window.html5 = html5;

            shivDocument(document);

        }(this, document));

        Modernizr._version      = version;

        Modernizr._prefixes     = prefixes;
        Modernizr._domPrefixes  = domPrefixes;
        Modernizr._cssomPrefixes  = cssomPrefixes;



        Modernizr.testProp      = function(prop){
            return testProps([prop]);
        };

        Modernizr.testAllProps  = testPropsAll;


        Modernizr.testStyles    = injectElementWithStyles;
        Modernizr.prefixed      = function(prop, obj, elem){
            if(!obj) {
                return testPropsAll(prop, 'pfx');
            } else {
                return testPropsAll(prop, obj, elem);
            }
        };


        docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

            (enableClasses ? ' js ' + classes.join(' ') : '');

        return Modernizr;

    })($window, $window.document);
    return Modernizr;
}]);