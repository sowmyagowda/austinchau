//
// +---------------------------------------------------------------------------+
// | Facebook Platform JavaScript client                                       |
// +---------------------------------------------------------------------------+
// | Copyright (c) 2008 Facebook, Inc.                                         |
// | All rights reserved.                                                      |
// |                                                                           |
// | Portions of this file include Script#, Copyright © 2007, Nikhil Kothari.  |
// | All Rights Reserved.                                                      |
// | The latest version of Script# is available at http://projects.nikhilk.net |                                                         
// |                                                                           |
// | Redistribution and use in source and binary forms, with or without        |
// | modification, are permitted provided that the following conditions        |
// | are met:                                                                  |
// |                                                                           |
// | 1. Redistributions of source code must retain the above copyright         |
// |    notice, this list of conditions and the following disclaimer.          |
// | 2. Redistributions in binary form must reproduce the above copyright      |
// |    notice, this list of conditions and the following disclaimer in the    |
// |    documentation and/or other materials provided with the distribution.   |
// |                                                                           |
// | THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR      |
// | IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES |
// | OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.   |
// | IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,          |
// | INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT  |
// | NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, |
// | DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY     |
// | THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT       |
// | (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF  |
// | THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.         |
// +---------------------------------------------------------------------------+
// | For help with this library, contact developers-help@facebook.com          |
// +---------------------------------------------------------------------------+
//

if(!window._scriptsharp) {
if(window.navigator.userAgent.toLowerCase().indexOf('msie') < 0 ) {


//! Script# Mozilla Compat Layer
//! Copyright (c) 2007, Nikhil Kothari. All Rights Reserved.
//! http://projects.nikhilk.net
//!

function __loadCompat(w) {
    w.Debug = function() {
    };
    w.Debug._fail = function(message) {
        throw new Error(message);
    };
    

    w.__getNonTextNode = function(node) {
        try {
            while (node && (node.nodeType != 1)) {
                node = node.parentNode;
            }
        }
        catch (ex) {
            node = null;
        }
        return node;
    };
    
    w.__getLocation = function(e) {
        var loc = {x : 0, y : 0};
        while (e) {
            loc.x += e.offsetLeft;
            loc.y += e.offsetTop;
            e = e.offsetParent;
        }
        return loc;
    }
    
    w.navigate = function(url) {
        window.setTimeout('window.location = "' + url + '";', 0);
    };
}

function _loadMozillaCompat(w) {
    w.Debug.writeln = function(text) {
        if (window.console) {
            window.console.debug(text);
        }
    };
    
    

    var attachEventProxy = function(eventName, eventHandler) {
        eventHandler._mozillaEventHandler = function(e) {
            window.event = e;
            eventHandler();
            return e.returnValue;
        };
        this.addEventListener(eventName.slice(2), eventHandler._mozillaEventHandler, false);
    };

    var detachEventProxy = function (eventName, eventHandler) {
        if (eventHandler._mozillaEventHandler) {
            var mozillaEventHandler = eventHandler._mozillaEventHandler;
            delete eventHandler._mozillaEventHandler;
            
            this.removeEventListener(eventName.slice(2), mozillaEventHandler, false);
        }
    };

    w.attachEvent = attachEventProxy;
    w.detachEvent = detachEventProxy;
    w.HTMLDocument.prototype.attachEvent = attachEventProxy;
    w.HTMLDocument.prototype.detachEvent = detachEventProxy;
    w.HTMLElement.prototype.attachEvent = attachEventProxy;
    w.HTMLElement.prototype.detachEvent = detachEventProxy;

    w.Event.prototype.__defineGetter__('srcElement', function() {
        // __getNonTextNode(this.target) is the expected implementation.
        // However script.load has target set to the Document object... so we
        // need to throw in currentTarget as well.
        return __getNonTextNode(this.target) || this.currentTarget;
    });
    w.Event.prototype.__defineGetter__('cancelBubble', function() {
        return this._bubblingCanceled || false;
    });
    w.Event.prototype.__defineSetter__('cancelBubble', function(v) {
        if (v) {
            this._bubblingCanceled = true;
            this.stopPropagation();
        }
    });
    w.Event.prototype.__defineGetter__('returnValue', function() {
        return !this._cancelDefault;
    });
    w.Event.prototype.__defineSetter__('returnValue', function(v) {
        if (!v) {
            this._cancelDefault = true;
            this.preventDefault();
        }
    });
    w.Event.prototype.__defineGetter__('fromElement', function () {
        var n;
        if (this.type == 'mouseover') {
            n = this.relatedTarget;
        }
        else if (this.type == 'mouseout') {
            n = this.target;
        }
        return __getNonTextNode(n);
    });
    w.Event.prototype.__defineGetter__('toElement', function () {
        var n;
        if (this.type == 'mouseout') {
            n = this.relatedTarget;
        }
        else if (this.type == 'mouseover') {
            n = this.target;
        }
        return __getNonTextNode(n);
    });
    w.Event.prototype.__defineGetter__('button', function() {
        return (this.which == 1) ? 1 : (this.which == 3) ? 2 : 0
    });
    w.Event.prototype.__defineGetter__('offsetX', function() {
        return window.pageXOffset + this.clientX - __getLocation(this.srcElement).x;
    });
    w.Event.prototype.__defineGetter__('offsetY', function() {
        return window.pageYOffset + this.clientY - __getLocation(this.srcElement).y;
    });

    w.HTMLElement.prototype.__defineGetter__('parentElement', function() {
        return this.parentNode;
    });
    w.HTMLElement.prototype.__defineGetter__('children', function() {
        var children = [];
        var childCount = this.childNodes.length;
        for (var i = 0; i < childCount; i++) {
            var childNode = this.childNodes[i];
            if (childNode.nodeType == 1) {
                children.push(childNode);
            }
        }
        return children;
    });
    w.HTMLElement.prototype.__defineGetter__('innerText', function() {    
        try {
            return this.textContent
        } 
        catch (ex) {
            var text = '';
            for (var i=0; i < this.childNodes.length; i++) {
                if (this.childNodes[i].nodeType == 3) {
                    text += this.childNodes[i].textContent;
                }
            }
            return str;
        }
    });
    w.HTMLElement.prototype.__defineSetter__('innerText', function(v) {
        var textNode = document.createTextNode(v);
        this.innerHTML = '';
        this.appendChild(textNode);
    });
    w.HTMLElement.prototype.__defineGetter__('currentStyle', function() {
        return window.getComputedStyle(this, null);
    });
    w.HTMLElement.prototype.__defineGetter__('runtimeStyle', function() {
        return window.getOverrideStyle(this, null);
    });
    w.HTMLElement.prototype.removeNode = function(b) {
        return this.parentNode.removeChild(this)
    };
    w.HTMLElement.prototype.contains = function(el) {
        while (el != null && el != this) {
            el = el.parentNode;
        }
        return (el!=null)
    };

    w.HTMLStyleElement.prototype.__defineGetter__('styleSheet', function() {
        return this.sheet;
    });
    w.CSSStyleSheet.prototype.__defineGetter__('rules', function() {
        return this.cssRules;
    });
    w.CSSStyleSheet.prototype.addRule = function(selector, style, index) {
        this.insertRule(selector + '{' + style + '}', index);
    };
    w.CSSStyleSheet.prototype.removeRule = function(index) {
        this.deleteRule(index);
    };
    w.CSSStyleDeclaration.prototype.__defineGetter__('styleFloat', function() {
        return this.cssFloat;
    });
    w.CSSStyleDeclaration.prototype.__defineSetter__('styleFloat', function(v) {
        this.cssFloat = v;
    });
    DocumentFragment.prototype.getElementById = function(id) {
        var nodeQueue = [];
        var childNodes = this.childNodes;
        var node;
        var c;
        
        for (c = 0; c < childNodes.length; c++) {
            node = childNodes[c];
            if (node.nodeType == 1) {
                nodeQueue.push(node);
            }
        }

        while (nodeQueue.length) {
            node = nodeQueue.dequeue();
            if (node.id == id) {
                return node;
            }
            childNodes = node.childNodes;
            if (childNodes.length != 0) {
                for (c = 0; c < childNodes.length; c++) {
                    node = childNodes[c];
                    if (node.nodeType == 1) {
                        nodeQueue.push(node);
                    }
                }
            }
        }

        return null;
    };

    DocumentFragment.prototype.getElementsByTagName = function(tagName) {
        var elements = [];
        var nodeQueue = [];
        var childNodes = this.childNodes;
        var node;
        var c;

        for (c = 0; c < childNodes.length; c++) {
            node = childNodes[c];
            if (node.nodeType == 1) {
                nodeQueue.push(node);
            }
        }

        while (nodeQueue.length) {
            node = nodeQueue.dequeue();
            if (node.tagName == tagName) {
                elements.add(node);
            }
            childNodes = node.childNodes;
            if (childNodes.length != 0) {
                for (c = 0; c < childNodes.length; c++) {
                    node = childNodes[c];
                    if (node.nodeType == 1) {
                        nodeQueue.push(node);
                    }
                }
            }
        }

        return elements;
    };

    DocumentFragment.prototype.createElement = function(tagName) {
        return document.createElement(tagName);
    };

    var selectNodes = function(doc, path, contextNode) {
        contextNode = contextNode ? contextNode : doc;
        var xpath = new XPathEvaluator();
        var result = xpath.evaluate(path, contextNode,
                                    doc.createNSResolver(doc.documentElement),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        var nodeList = new Array(result.snapshotLength);
        for(var i = 0; i < result.snapshotLength; i++) {
            nodeList[i] = result.snapshotItem(i);
        }

        return nodeList;
    };

    var selectSingleNode = function(doc, path, contextNode) {
        path += '[1]';
        var nodes = selectNodes(doc, path, contextNode);
        if (nodes.length != 0) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i]) {
                    return nodes[i];
                }
            }
        }
        return null;
    };

    w.XMLDocument.prototype.selectNodes = function(path, contextNode) {
        return selectNodes(this, path, contextNode);
    };

    w.XMLDocument.prototype.selectSingleNode = function(path, contextNode) {
        return selectSingleNode(this, path, contextNode);
    };

    w.XMLDocument.prototype.transformNode = function(xsl) {
        var xslProcessor = new XSLTProcessor();
        xslProcessor.importStylesheet(xsl);

        var ownerDocument = document.implementation.createDocument("", "", null);
        var transformedDoc = xslProcessor.transformToDocument(this);
        
        return transformedDoc.xml;
    };

    Node.prototype.selectNodes = function(path) {
        var doc = this.ownerDocument;
        return doc.selectNodes(path, this);
    };

    Node.prototype.selectSingleNode = function(path) {
        var doc = this.ownerDocument;
        return doc.selectSingleNode(path, this);
    };

    Node.prototype.__defineGetter__('baseName', function() {
        return this.localName;
    });

    Node.prototype.__defineGetter__('text', function() {
        return this.textContent;
    });
    Node.prototype.__defineSetter__('text', function(value) {
        this.textContent = value;
    });

    Node.prototype.__defineGetter__('xml', function() {
        return (new XMLSerializer()).serializeToString(this);
    });
}

function _loadSafariCompat(w) {
    w.Debug.writeln = function(text) {
        if (window.console) {
            window.console.log(text);
        }
    };

}

__loadCompat(window);
if (window.navigator.userAgent.indexOf('Safari') >= 0) {
    _loadSafariCompat(window);
}
else {
    _loadMozillaCompat(window);
}
} 
//! Script# Core Runtime
//! Copyright (c) 2007, Nikhil Kothari. All Rights Reserved.
//! http://projects.nikhilk.net
//!


///////////////////////////////////////////////////////////////////////////////
// Globals

function isUndefined(o) {
    return (o === undefined);
}

function isNull(o) {
    return (o === null);
}

function isNullOrUndefined(o) {
    return (o === null) || (o === undefined);
}

function $(id) {
    return document.getElementById(id);
}

document.getElementsBySelector = function getElementsBySelector(cssSelector, root) {
    var all = root ? root.getElementsByTagName('*') : document.getElementsByTagName('*');
    var matches = [];

    // Create a stylesheet we'll use to insert a CSS rule into to do the matching.
    // This is created just once.
    var styleSheet = document.getElementsBySelector.styleSheet;
    if (!styleSheet) {
        var styleSheetNode = document.createElement('style');
        styleSheetNode.type = 'text/css';

        document.getElementsByTagName('head')[0].appendChild(styleSheetNode);
        styleSheet = styleSheetNode.styleSheet || styleSheetNode.sheet;
        
        document.getElementsBySelector.styleSheet = styleSheet;
    }

    if (window.navigator.userAgent.indexOf('MSIE') >= 0) {
        // Add the rule that will be used to match elements
        styleSheet.addRule(cssSelector, 'ssCssMatch:true', 0);

        for (var i = all.length - 1; i >= 0; i--) {
            var element = all[i];

            // Find elements that contain the special css attribute, i.e.
            // the elements that match the specified selector.
            if (element.currentStyle.ssCssMatch) {
                matches[matches.length] = element;
            }
        }

        styleSheet.removeRule(0);
    }
    else {
        var matchValue = document.getElementsBySelector.matchValue;
        if (!matchValue) {
            matchValue = (window.navigator.userAgent.indexOf('Opera') >= 0) ? '"ssCssMatch"' : 'ssCssMatch 1';
            document.getElementsBySelector.matchValue = matchValue;
        }

        // Add the rule that will be used to match elements
        styleSheet.insertRule(cssSelector + ' { counter-increment: ssCssMatch }', 0);

        var docView = document.defaultView;
        for (var i = all.length - 1; i >= 0; i--) {
            var element = all[i];

            // Find elements that contain the special css attribute, i.e.
            // the elements that match the specified selector.
            if (docView.getComputedStyle(element, null).counterIncrement === matchValue) {
                matches[matches.length] = element;
            }
        }

        styleSheet.deleteRule(0);
    }

    if (matches.length > 1) {
        matches.reverse();
    }
    return matches;
}

///////////////////////////////////////////////////////////////////////////////
// Object Extensions

Object.__typeName = 'Object';
Object.__baseType = null;

Object.parse = function Object$parse(s) {
    return eval(s);
}

Object.getKeyCount = function Object$getKeyCount(d) {
    var count = 0;
    for (var n in d) {
        count++;
    }
    return count;
}

Object.clearKeys = function Object$clearKeys(d) {
    for (var n in d) {
        delete d[n];
    }
}

Object.keyExists = function Object$keyExists(d, key) {
    return d[key] !== undefined;
}

///////////////////////////////////////////////////////////////////////////////
// Function Extensions

Function.parse = function Function$parse(s) {
    if (!Function._parseCache) {
        Function._parseCache = { };
    }

    var fn = Function._parseCache[s];
    if (!fn) {
        try {
            eval('fn = ' + s);
            if (typeof(fn) != 'function') {
                fn = null;
            }
            else {
                Function._parseCache[s] = fn;
            }
        }
        catch (ex) {
        }
    }
    return fn;
}

///////////////////////////////////////////////////////////////////////////////
// Boolean Extensions

Boolean.__typeName = 'Boolean';

Boolean.parse = function Boolean$parse(s) {
    return (s.toLowerCase() == 'true');
}

///////////////////////////////////////////////////////////////////////////////
// Number Extensions

Number.__typeName = 'Number';

Number.parse = function Number$parse(s) {
    if (!s || !s.length) {
        return 0;
    }
    if ((s.indexOf('.') >= 0) || (s.indexOf('e') >= 0) ||
        s.endsWith('f') || s.endsWith('F')) {
        return parseFloat(s);
    }
    return parseInt(s);
}

Number.prototype.format = function Number$format(format, useLocale) {
    if (isNullOrUndefined(format) ||
        (format.length == 0) || (format == 'i')) {
        if (useLocale) {
            return this.toLocaleString();
        }
        else {
            return this.toString();
        }
    }

    return this._netFormat(format, useLocale);
}

Number._commaFormat = function Number$_commaFormat(number, groups, decimal, comma) {
    var decimalPart = null;
    var decimalIndex = number.indexOf(decimal);
    if (decimalIndex > 0) {
        decimalPart = number.substr(decimalIndex);
        number = number.substr(0, decimalIndex);
    }

    var negative = number.startsWith('-');
    if (negative) {
        number = number.substr(1);
    }

    var groupIndex = 0;
    var groupSize = groups[groupIndex];
    if (number.length < groupSize) {
        return decimalPart ? number + decimalPart : number;
    }

    var index = number.length;
    var s = '';
    var done = false;
    while (!done) {
        var length = groupSize;
        var startIndex = index - length;
        if (startIndex < 0) {
            groupSize += startIndex;
            length += startIndex;
            startIndex = 0;
            done = true;
        }
        if (!length) {
            break;
        }
        
        var part = number.substr(startIndex, length);
        if (s.length) {
            s = part + comma + s;
        }
        else {
            s = part;
        }
        index -= length;

        if (groupIndex < groups.length - 1) {
            groupIndex++;
            groupSize = groups[groupIndex];
        }
    }

    if (negative) {
        s = '-' + s;
    }    
    return decimalPart ? s + decimalPart : s;
}

Number.prototype._netFormat = function Number$_netFormat(format, useLocale) {
    var nf = useLocale ? CultureInfo.Current.numberFormat : CultureInfo.Neutral.numberFormat;

    var s = '';    
    var precision = -1;
    
    if (format.length > 1) {
        precision = parseInt(format.substr(1));
    }

    var fs = format.charAt(0);
    switch (fs) {
        case 'd': case 'D':
            s = parseInt(Math.abs(this)).toString();
            if (precision != -1) {
                s = s.padLeft(precision, '0');
            }
            if (this < 0) {
                s = '-' + s;
            }
            break;
        case 'x': case 'X':
            s = parseInt(Math.abs(this)).toString(16);
            if (fs == 'X') {
                s = s.toUpperCase();
            }
            if (precision != -1) {
                s = s.padLeft(precision, '0');
            }
            break;
        case 'e': case 'E':
            if (precision == -1) {
                s = this.toExponential();
            }
            else {
                s = this.toExponential(precision);
            }
            if (fs == 'E') {
                s = s.toUpperCase();
            }
            break;
        case 'f': case 'F':
        case 'n': case 'N':
            if (precision == -1) {
                precision = nf.numberDecimalDigits;
            }
            s = this.toFixed(precision).toString();
            if (precision && (nf.numberDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.numberDecimalSeparator + s.substr(index + 1);
            }
            if ((fs == 'n') || (fs == 'N')) {
                s = Number._commaFormat(s, nf.numberGroupSizes, nf.numberDecimalSeparator, nf.numberGroupSeparator);
            }
            break;
        case 'c': case 'C':
            if (precision == -1) {
                precision = nf.currencyDecimalDigits;
            }
            s = Math.abs(this).toFixed(precision).toString();
            if (precision && (nf.currencyDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.currencyDecimalSeparator + s.substr(index + 1);
            }
            s = Number._commaFormat(s, nf.currencyGroupSizes, nf.currencyDecimalSeparator, nf.currencyGroupSeparator);
            if (this < 0) {
                s = String.format(nf.currencyNegativePattern, s);
            }
            else {
                s = String.format(nf.currencyPositivePattern, s);
            }
            break;
        case 'p': case 'P':
            if (precision == -1) {
                precision = nf.percentDecimalDigits;
            }
            s = (Math.abs(this) * 100.0).toFixed(precision).toString();
            if (precision && (nf.percentDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.percentDecimalSeparator + s.substr(index + 1);
            }
            s = Number._commaFormat(s, nf.percentGroupSizes, nf.percentDecimalSeparator, nf.percentGroupSeparator);
            if (this < 0) {
                s = String.format(nf.percentNegativePattern, s);
            }
            else {
                s = String.format(nf.percentPositivePattern, s);
            }
            break;
    }

    return s;
}

///////////////////////////////////////////////////////////////////////////////
// Math Extensions

Math.truncate = function Math$truncate(n) {
    return (n >= 0) ? Math.floor(n) : Math.ceil(n);
}

///////////////////////////////////////////////////////////////////////////////
// String Extensions

String.__typeName = 'String';
String.Empty = '';

String.compare = function String$compare(s1, s2, ignoreCase) {
    if (ignoreCase) {
        if (s1) {
            s1 = s1.toUpperCase();
        }
        if (s2) {
            s2 = s2.toUpperCase();
        }
    }
    s1 = s1 || '';
    s2 = s2 || '';

    if (s1 == s2) {
        return 0;
    }
    if (s1 < s2) {
        return -1;
    }
    return 1;
}

String.prototype.compareTo = function String$compareTo(s, ignoreCase) {
    return String.compare(this, s, ignoreCase);
}

String.prototype.endsWith = function String$endsWith(suffix) {
    if (!suffix.length) {
        return true;
    }
    if (suffix.length > this.length) {
        return false;
    }
    return (this.substr(this.length - suffix.length) == suffix);
}

String.equals = function String$equals1(s1, s2, ignoreCase) {
    return String.compare(s1, s2, ignoreCase) == 0;
}

String._format = function String$_format(format, values, useLocale) {
    if (!String._formatRE) {
        String._formatRE = /(\{[^\}^\{]+\})/g;
    }

    return format.replace(String._formatRE,
                          function(str, m) {
                              var index = parseInt(m.substr(1));
                              var value = values[index + 1];
                              if (isNullOrUndefined(value)) {
                                  return '';
                              }
                              if (value.format) {
                                  var formatSpec = null;
                                  var formatIndex = m.indexOf(':');
                                  if (formatIndex > 0) {
                                      formatSpec = m.substring(formatIndex + 1, m.length - 1);
                                  }
                                  return value.format.call(value, formatSpec, useLocale);
                              }
                              else {
                                  if (useLocale) {
                                      return value.toLocaleString();
                                  }
                                  return value.toString();
                              }
                          });
}

String.format = function String$format(format) {
    return String._format(format, arguments, /* useLocale */ false);
}

String.fromChar = function String$fromChar(ch, count) {
    var s = ch;
    for (var i = 1; i < count; i++) {
        s += ch;
    }
    return s;
}

String.prototype.htmlDecode = function String$htmlDecode() {
    if (!String._htmlDecRE) {
        String._htmlDecMap = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"' };
        String._htmlDecRE = /(&amp;|&lt;|&gt;|&quot;)/gi;
    }

    var s = this;
    s = s.replace(String._htmlDecRE,
                  function(str, m) {
                      return String._htmlDecMap[m];
                  });
    return s;
}

String.prototype.htmlEncode = function String$htmlEncode() {
    if (!String._htmlEncRE) {
        String._htmlEncMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
        String._htmlEncRE = /([&<>"])/g;
    }

    var s = this;
    if (String._htmlEncRE.test(s)) {
        s = s.replace(String._htmlEncRE,
                      function (str, m) {
                          return String._htmlEncMap[m];
                      });
    }
    return s;
}

String.prototype.indexOfAny = function String$indexOfAny(chars, startIndex, count) {
    var length = this.length;
    if (!length) {
        return -1;
    }

    startIndex = startIndex || 0;
    count = count || length;

    var endIndex = startIndex + count - 1;
    if (endIndex >= length) {
        endIndex = length - 1;
    }

    for (var i = startIndex; i <= endIndex; i++) {
        if (chars.indexOf(this.charAt(i)) >= 0) {
            return i;
        }
    }
    return -1;
}

String.prototype.insert = function String$insert(index, value) {
    if (!value) {
        return this;
    }
    if (!index) {
        return value + this;
    }
    var s1 = this.substr(0, index);
    var s2 = this.substr(index);
    return s1 + value + s2;
}

String.isNullOrEmpty = function String$isNullOrEmpty(s) {
    return !s || !s.length;
}

String.prototype.lastIndexOfAny = function String$lastIndexOfAny(chars, startIndex, count) {
    var length = this.length;
    if (!length) {
        return -1;
    }

    startIndex = startIndex || length - 1;
    count = count || length;

    var endIndex = startIndex - count + 1;
    if (endIndex < 0) {
        endIndex = 0;
    }

    for (var i = startIndex; i >= endIndex; i--) {
        if (chars.indexOf(this.charAt(i)) >= 0) {
            return i;
        }
    }
    return -1;
}

String.localeFormat = function String$localeFormat(format) {
    return String._format(format, arguments, /* useLocale */ true);
}

String.prototype.padLeft = function String$padLeft(totalWidth, ch) {
    if (this.length < totalWidth) {
        ch = ch || ' ';
        return String.fromChar(ch, totalWidth - this.length) + this;
    }
    return this;
}

String.prototype.padRight = function String$padRight(totalWidth, ch) {
    if (this.length < totalWidth) {
        ch = ch || ' ';
        return this + String.fromChar(ch, totalWidth - this.length);
    }
    return this;
}

String.prototype.quote = function String$quote() {
    return fb_quote_string(this);
}

function fb_quote_string(value) {
    var m = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        
        var a,          // The array holding the partial texts.
                i,          // The loop counter.
                k,          // The member key.
                l,          // Length.
                r = /["\\\x00-\x1f\x7f-\x9f]/g,
                v;          // The member value.

        
        return r.test(value) ?
                    '"' + value.replace(r, function (a) {
                        var c = m[a];
                        if (c) {
                            return c;
                        }
                        c = a.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(16) +
                                                   (c % 16).toString(16);
                    }) + '"' :
                    '"' + value + '"';


}

String.prototype.remove = function String$remove(index, count) {
    if (!count || ((index + count) > this.length)) {
        return this.substr(0, index);
    }
    return this.substr(0, index) + this.substr(index + count);
}

String.prototype._replace = String.prototype.replace;
String.prototype.replace = function String$replace(oldValue, newValue) {
    if (oldValue.constructor == String) {
        newValue = newValue || '';
        return this.split(oldValue).join(newValue);
    }
    return String.prototype._replace.call(this, oldValue, newValue);
}

String.prototype.startsWith = function String$startsWith(prefix) {
    if (!prefix.length) {
        return true;
    }
    if (prefix.length > this.length) {
        return false;
    }
    return (this.substr(0, prefix.length) == prefix);
}

String.prototype.trim = function String$trim() {
    return this.trimEnd().trimStart();
}

String.prototype.trimEnd = function String$trimEnd() {
    return this.replace(/\s*$/, '');
}

String.prototype.trimStart = function String$trimStart() {
    return this.replace(/^\s*/, '');
}

String.prototype.unquote = function String$unquote() {
    return eval('(' + this + ')');
}

///////////////////////////////////////////////////////////////////////////////
// Array Extensions

Array.__typeName = 'Array';

Array.prototype.add = function Array$add(item) {
    this[this.length] = item;
}

Array.prototype.addRange = function Array$addRange(items) {
    if (!items) {
        return;
    }
    var length = items.length;
    for (var index = 0; index < length; index++) {
        this[this.length] = items[index];
    }
}

Array.prototype.aggregate = function Array$aggregate(seed, callback) {
    var length = this.length;
    for (var index = 0; index < length; index++) {
        seed = callback(seed, this[index], index, this);
    }
    return seed;
}

Array.prototype.clear = function Array$clear() {
    if (this.length > 0) {
        this.splice(0, this.length);
    }
}

Array.prototype.clone = function Array$clone() {
    var length = this.length;
    var array = new Array(length);
    for (var index = 0; index < length; index++) {
        array[index] = this[index];
    }
    return array;
}

Array.prototype.contains = function Array$contains(item) {
    var index = this.indexOf(item);
    return (index >= 0);
}

Array.prototype.dequeue = function Array$dequeue() {
    return this.shift();
}

Array.prototype.enqueue = function Array$enqueue(item) {
    this.push(item);
}

if (!Array.prototype.every) {
    Array.prototype.every = function Array$every(callback) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (!callback(this[i], i, this)) {
                return false;
            }
        }
        return true;
    }
}

Array.prototype.extract = function Array$extract(index, count) {
    if (!count) {
        return this.slice(index);
    }
    return this.slice(index, index + count);
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function Array$filter(callback) {
        var filtered = [];
        for (var i = 0; i < this.length; i++) {
            if (callback(this[i], i, this)) {
                filtered.add(this[i]);
            }
        }
        return filtered;
    }
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function Array$forEach(callback) {
        for (var i = 0; i < this.length; i++) {
            callback(this[i], i, this);
        }
    }
}

Array.prototype.groupBy = function Array$groupBy(callback) {
    var length = this.length;
    var groups = [];
    var keys = { };
    for (var index = 0; index < length; index++) {
        var key = callback(this[index], index);
        if (String.isNullOrEmpty(key)) {
            continue;
        }
        var items = keys[key];
        if (!items) {
            items = [];
            items.key = key;

            keys[key] = items;
            groups.add(items);
        }
        items.add(this[index]);
    }
    return groups;
}

Array.prototype.index = function Array$index(callback) {
    var length = this.length;
    var items = { };
    for (var index = 0; index < length; index++) {
        var key = callback(this[index], index);
        if (String.isNullOrEmpty(key)) {
            continue;
        }
        items[key] = this[index];
    }
    return items;
}

Array.prototype.indexOf = function Array$indexOf(item) {
    var length = this.length;
    if (length) {
        for (var index = 0; index < length; index++) {
            if (this[index] === item) {
                return index;
            }
        }
    }
    return -1;
}

Array.prototype.insert = function Array$insert(index, item) {
    this.splice(index, 0, item);
}

Array.prototype.insertRange = function Array$insertRange(index, items) {
    this.splice(index, 0, items);
}

if (!Array.prototype.map) {
    Array.prototype.map = function Array$map(callback) {
        var mapped = new Array(this.length);
        for (var i = this.length - 1; i >= 0; i--) {
            mapped[i] = callback(this[i], i, this);
        }
        return mapped;
    }
}

Array.parse = function Array$parse(s) {
    return eval('(' + s + ')');
}

Array.prototype.remove = function Array$remove(item) {
    var index = this.indexOf(item);
    if (index >= 0) {
        this.splice(index, 1);
        return true;
    }
    return false;
}

Array.prototype.removeAt = function Array$removeAt(index) {
    return this.splice(index, 1)[0];
}

Array.prototype.removeRange = function Array$removeRange(index, count) {
    return this.splice(index, count);
}

if (!Array.prototype.some) {
    Array.prototype.some = function Array$some(callback) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (callback(this[i], i, this)) {
                return true;
            }
        }
        return false;
    }
}

///////////////////////////////////////////////////////////////////////////////
// RegExp Extensions

RegExp.__typeName = 'RegExp';

RegExp.parse = function RegExp$parse(s) {
    if (s.startsWith('/')) {
        var endSlashIndex = s.lastIndexOf('/');
        if (endSlashIndex > 1) {
            var expression = s.substring(1, endSlashIndex);
            var flags = s.substr(endSlashIndex + 1);
            return new RegExp(expression, flags);
        }
    }

    return null;    
}

///////////////////////////////////////////////////////////////////////////////
// Date Extensions

Date.__typeName = 'Date';

Date.get_now = function Date$get_now() {
    return new Date();
}

Date.get_today = function Date$get_today() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

Date.prototype.format = function Date$format(format, useLocale) {
    if (isNullOrUndefined(format) ||
        (format.length == 0) || (format == 'i')) {
        if (useLocale) {
            return this.toLocaleString();
        }
        else {
            return this.toString();
        }
    }
    if (format == 'id') {
        if (useLocale) {
            return this.toLocaleDateString();
        }
        else {
            return this.toDateString();
        }
    }
    if (format == 'it') {
        if (useLocale) {
            return this.toLocaleTimeString();
        }
        else {
            return this.toTimeString();
        }
    }

    return this._netFormat(format, useLocale);
}

Date.prototype._netFormat = function Date$_netFormat(format, useLocale) {
    var dtf = useLocale ? CultureInfo.Current.dateFormat : CultureInfo.Neutral.dateFormat;
    var useUTC = false;

    if (format.length == 1) {
        switch (format) {
            case 'f': format = dtf.longDatePattern + ' ' + dtf.shortTimePattern;
            case 'F': format = dtf.dateTimePattern; break;

            case 'd': format = dtf.shortDatePattern; break;
            case 'D': format = dtf.longDatePattern; break;

            case 't': format = dtf.shortTimePattern; break;
            case 'T': format = dtf.longTimePattern; break;

            case 'g': format = dtf.shortDatePattern + ' ' + dtf.shortTimePattern; break;
            case 'G': format = dtf.shortDatePattern + ' ' + dtf.longTimePattern; break;

            case 'R': case 'r': format = dtf.gmtDateTimePattern; useUTC = true; break;
            case 'u': format = dtf.universalDateTimePattern; useUTC = true; break;
            case 'U': format = dtf.dateTimePattern; useUTC = true; break;

            case 's': format = dtf.sortableDateTimePattern; break;
        }
    }

    if (format.charAt(0) == '%') {
        format = format.substr(1);
    }

    if (!Date._formatRE) {
        Date._formatRE = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z/g;
    }

    var re = Date._formatRE;    
    var sb = new StringBuilder();
    var dt = this;
    if (useUTC) {
        dt = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(),
                               dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds()));
    }

    re.lastIndex = 0;
    while (true) {
        var index = re.lastIndex;
        var match = re.exec(format);

        sb.append(format.slice(index, match ? match.index : format.length));
        if (!match) {
            break;
        }

        var fs = match[0];
        var part = fs;
        switch (fs) {
            case 'dddd':
                part = dtf.dayNames[dt.getDay()];
                break;
            case 'ddd':
                part = dtf.shortDayNames[dt.getDay()];
                break;
            case 'dd':
                part = dt.getDay().toString().padLeft(2, '0');
                break;
            case 'd':
                part = dt.getDay();
                break;
            case 'MMMM':
                part = dtf.monthNames[dt.getMonth()];
                break;
            case 'MMM':
                part = dtf.shortMonthNames[dt.getMonth()];
                break;
            case 'MM':
                part = (dt.getMonth() + 1).toString().padLeft(2, '0');
                break;
            case 'M':
                part = (dt.getMonth() + 1);
                break;
            case 'yyyy':
                part = dt.getFullYear();
                break;
            case 'yy':
                part = (dt.getFullYear() % 100).toString().padLeft(2, '0');
                break;
            case 'y':
                part = (dt.getFullYear() % 100);
                break;
            case 'h': case 'hh':
                part = dt.getHours() % 12;
                if (!part) {
                    part = '12';
                }
                else if (fs == 'hh') {
                    part = part.toString().padLeft(2, '0');
                }
                break;
            case 'HH':
                part = dt.getHours().toString().padLeft(2, '0');
                break;
            case 'H':
                part = dt.getHours();
                break;
            case 'mm':
                part = dt.getMinutes().toString().padLeft(2, '0');
                break;
            case 'm':
                part = dt.getMinutes();
                break;
            case 'ss':
                part = dt.getSeconds().toString().padLeft(2, '0');
                break;
            case 's':
                part = dt.getSeconds();
                break;
            case 't': case 'tt':
                part = (dt.getHours() < 12) ? dtf.amDesignator : dtf.pmDesignator;
                if (fs == 't') {
                    part = part.charAt(0);
                }
                break;
            case 'fff':
                part = dt.getMilliseconds().toString().padLeft(3, '0');
                break;
            case 'ff':
                part = dt.getMilliseconds().toString().padLeft(3).substr(0, 2);
                break;
            case 'f':
                part = dt.getMilliseconds().toString().padLeft(3).charAt(0);
                break;
            case 'z':
                part = dt.getTimezoneOffset() / 60;
                part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part));
                break;
            case 'zz': case 'zzz':
                part = dt.getTimezoneOffset() / 60;
                part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part)).toString().padLeft(2, '0');
                if (fs == 'zzz') {
                    part += dtf.timeSeparator + Math.abs(dt.getTimezoneOffset() % 60).toString().padLeft(2, '0');
                }
                break;
        }
        sb.append(part);
    }

    return sb.toString();
}

///////////////////////////////////////////////////////////////////////////////
// Error Extensions

Error.__typeName = 'Error';

Error.create = function Error$create(message, userData, innerException) {
    var e = new Error(message);
    if (userData) {
        e.userData = userData;
    }
    if (innerException) {
        e.innerException = innerException;
    }
    return e;
}

///////////////////////////////////////////////////////////////////////////////
// Debug Extensions

if (!Debug._fail) {
    Debug._fail = function Debug$_fail(message) {
        Debug.writeln(message);
        eval('debugger;');
    }
}

Debug.assert = function Debug$assert(condition, message) {
    if (!condition) {
        message = 'Assert failed: ' + message;
        if (confirm(message + '\r\n\r\nBreak into debugger?')) {
            Debug._fail(message);
        }
    }
}

Debug._dumpCore = function Debug$_dumpCore(sb, object, name, indentation, dumpedObjects) {
    if (object === null) {
        sb.appendLine(indentation + name + ': null');
        return;
    }
    switch (typeof(object)) {
        case 'undefined':
            sb.appendLine(indentation + name + ': undefined');
            break;
        case 'number':
        case 'string':
        case 'boolean':
            sb.appendLine(indentation + name + ': ' + object);
            break;
        default:
            if (Date.isInstance(object) || RegExp.isInstance(object)) {
                sb.appendLine(indentation + name + ': ' + object);
                break;
            }

            if (dumpedObjects.contains(object)) {
                sb.appendLine(indentation + name + ': ...');
                break;
            }
            dumpedObjects.add(object);

            var type = Type.getInstanceType(object);
            var typeName = type.get_fullName();
            var recursiveIndentation = indentation + '  ';

            if (IArray.isInstance(object)) {
                sb.appendLine(indentation + name + ': {' + typeName + '}');
                var length = object.getLength();
                for (var i = 0; i < length; i++) {
                    Debug._dumpCore(sb, object.getItem(i), '[' + i + ']', recursiveIndentation, dumpedObjects);
                }
            }
            else {
                var td = TypeDescriptor._getObjectDescriptor(object);
                if (!td) {
                    if (object.tagName) {
                        sb.appendLine(indentation + name + ': <' + object.tagName + '>');
                        var attributes = object.attributes;
                        for (var i = 0; i < attributes.length; i++) {
                            var attrValue = attributes[i].nodeValue;
                            if (attrValue) {
                                Debug._dumpCore(sb, attrValue, attributes[i].nodeName, recursiveIndentation, dumpedObjects);
                            }
                        }
                    }
                    else {
                        sb.appendLine(indentation + name + ': {' + typeName + '}');
                        for (var field in object) {
                            var v = object[field];
                            if (!Function.isInstance(v)) {
                                Debug._dumpCore(sb, v, field, recursiveIndentation, dumpedObjects);
                            }
                        }
                    }
                }
                else {
                    sb.appendLine(indentation + name + ': {' + typeName + '}');
                    var properties = td._properties;
                    if (properties) {
                        for (var prop in properties) {
                            var propValue = TypeDescriptor.getProperty(object, prop);
                            Debug._dumpCore(sb, propValue, prop, recursiveIndentation, dumpedObjects);
                        }
                    }
                }
            }

            dumpedObjects.remove(object);
            break;
    }
}

Debug.dump = function Debug$dump(object, name) {
    if ((!name || !name.length) && (object !== null)) {
        name = Type.getInstanceType(object).get_fullName();
    }
    if (!name || !name.length) {
        return;
    }
    var sb = new StringBuilder();
    Debug._dumpCore(sb, object, name, '', []);
    Debug.writeLine(sb.toString());
}

Debug.fail = function Debug$fail(message) {
    Debug._fail(message);
}

Debug.inspect = function Debug$inspect(object, name) {
    var dumped = false;
    if (window.debugService) {
        dumped = window.debugService.inspect(name, object);
    }
    if (!dumped) {
        Debug.dump(object, name);
    }
}

Debug.writeLine = function Debug$writeLine(message) {
    if (window.debugService) {
        window.debugService.trace(message);
        return;
    }
    Debug.writeln(message);

    var traceTextBox = $('_traceTextBox');
    if (traceTextBox) {
        traceTextBox.value = traceTextBox.value + '\r\n' + message;
    }
}

Debug.__typeName = 'Debug';

///////////////////////////////////////////////////////////////////////////////
// Type System Implementation

var Type = Function;
Type.__typeName = 'Type';

var __Namespace = function(name) {
    this.__typeName = name;
}
__Namespace.prototype = {
    __namespace: true,
    getName: function() {
        return this.__typeName;
    }
}

Type.createNamespace = function Type$createNamespace(name) {
    if (!window.__namespaces) {
        window.__namespaces = {};
    }
    if (!window.__rootNamespaces) {
        window.__rootNamespaces = [];
    }

    if (window.__namespaces[name]) {
        return;
    }

    var ns = window;
    var nameParts = name.split('.');

    for (var i = 0; i < nameParts.length; i++) {
        var part = nameParts[i];
        var nso = ns[part];
        if (!nso) {
            ns[part] = nso = new __Namespace(nameParts.slice(0, i + 1).join('.'));
            if (i == 0) {
                window.__rootNamespaces.add(nso);
            }
        }
        ns = nso;
    }

    window.__namespaces[name] = ns;
}

Type.prototype.createClass = function Type$createClass(name, baseType, interfaceType) {
    this.prototype.constructor = this;
    this.__typeName = name;
    this.__class = true;
    this.__baseType = baseType || Object;
    if (baseType) {
        this.__basePrototypePending = true;
    }

    if (interfaceType) {
        this.__interfaces = [];
        for (var i = 2; i < arguments.length; i++) {
            interfaceType = arguments[i];
            this.__interfaces.add(interfaceType);
        }
    }
}

Type.prototype.createInterface = function Type$createInterface(name) {
    this.__typeName = name;
    this.__interface = true;
}

Type.prototype.createEnum = function Type$createEnum(name, flags) {
    for (var field in this.prototype) {
         this[field] = this.prototype[field];
    }

    this.__typeName = name;
    this.__enum = true;
    if (flags) {
        this.__flags = true;
    }
}

Type.prototype.setupBase = function Type$setupBase() {
    if (this.__basePrototypePending) {
        var baseType = this.__baseType;
        if (baseType.__basePrototypePending) {
            baseType.setupBase();
        }

        for (var memberName in baseType.prototype) {
            var memberValue = baseType.prototype[memberName];
            if (!this.prototype[memberName]) {
                this.prototype[memberName] = memberValue;
            }
        }

        delete this.__basePrototypePending;
    }
}

Type.prototype.constructBase = function Type$constructBase(instance, args) {
    if (this.__basePrototypePending) {
        this.setupBase();
    }

    if (!args) {
        this.__baseType.apply(instance);
    }
    else {
        this.__baseType.apply(instance, args);
    }
}

Type.prototype.callBase = function Type$callBase(instance, name, args) {
    var baseMethod = this.__baseType.prototype[name];
    if (!args) {
        return baseMethod.apply(instance);
    }
    else {
        return baseMethod.apply(instance, args);
    }
}

Type.prototype.get_baseType = function Type$get_baseType() {
    return this.__baseType || null;
}

Type.prototype.get_fullName = function Type$get_fullName() {
    return this.__typeName;
}

Type.prototype.get_name = function Type$get_name() {
    var fullName = this.__typeName;
    var nsIndex = fullName.lastIndexOf('.');
    if (nsIndex > 0) {
        return fullName.substr(nsIndex + 1);
    }
    return fullName;
}

Type.prototype.isInstance = function Type$isInstance(instance) {
    if (isNullOrUndefined(instance)) {
        return false;
    }
    if ((this == Object) || (instance instanceof this)) {
        return true;
    }

    var type = Type.getInstanceType(instance);
    return this.isAssignableFrom(type);
}

Type.prototype.isAssignableFrom = function Type$isAssignableFrom(type) {
    if ((this == Object) || (this == type)) {
        return true;
    }
    if (this.__class) {
        var baseType = type.__baseType;
        while (baseType) {
            if (this == baseType) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    }
    else if (this.__interface) {
        var interfaces = type.__interfaces;
        if (interfaces && interfaces.contains(this)) {
            return true;
        }

        var baseType = type.__baseType;
        while (baseType) {
            interfaces = baseType.__interfaces;
            if (interfaces && interfaces.contains(this)) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    }
    return false;
}

Type.isClass = function Type$isClass(type) {
    return (type.__class == true);
}

Type.isEnum = function Type$isEnum(type) {
    return (type.__enum == true);
}

Type.isFlagsEnum = function Type$isFlagsEnum(type) {
    return ((type.__enum == true) && (type.__flags == true));
}

Type.isInterface = function Type$isInterface(type) {
    return (type.__interface == true);
}

Type.canCast = function Type$canCast(instance, type) {
    return type.isInstance(instance);
}

Type.safeCast = function Type$safeCast(instance, type) {
    if (type.isInstance(instance)) {
        return instance;
    }
    return null;
}

Type.getInstanceType = function Type$getInstanceType(instance) {
    var ctor = null;

    // NOTE: We have to catch exceptions because the constructor
    //       cannot be looked up on native COM objects
    try {
        ctor = instance.constructor;
    }
    catch (ex) {
    }
    if (!ctor || !ctor.__typeName) {
        ctor = Object;
    }
    return ctor;
}

Type.getType = function Type$getType(typeName) {
    if (!typeName) {
        return null;
    }

    if (!Type.__typeCache) {
        Type.__typeCache = {};
    }

    var type = Type.__typeCache[typeName];
    if (!type) {
        type = eval(typeName);
        Type.__typeCache[typeName] = type;
    }
    return type;
}

Type.parse = function Type$parse(typeName) {
    return Type.getType(typeName);
}

///////////////////////////////////////////////////////////////////////////////
// Enum

var Enum = function() {
}
Enum.createClass('Enum');

Enum.parse = function Enum$parse(enumType, s) {
    var values = enumType.prototype;
    if (!enumType.__flags) {
        for (var f in values) {
            if (f === s) {
                return values[f];
            }
        }
    }
    else {
        var parts = s.split('|');
        var value = 0;
        var parsed = true;

        for (var i = parts.length - 1; i >= 0; i--) {
            var part = parts[i].trim();
            var found = false;

            for (var f in values) {
                if (f === part) {
                    value |= values[f];
                    found = true;
                    break;
                }
            }
            if (!found) {
                parsed = false;
                break;
            }
        }

        if (parsed) {
            return value;
        }
    }
    throw 'Invalid Enumeration Value';
}

Enum.toString = function Enum$toString(enumType, value) {
    var values = enumType.prototype;
    if (!enumType.__flags || (value === 0)) {
        for (var i in values) {
            if (values[i] === value) {
                return i;
            }
        }
        throw 'Invalid Enumeration Value';
    }
    else {
        var parts = [];
        for (var i in values) {
            if (values[i] & value) {
                if (parts.length) {
                    parts.add(' | ');
                }
                parts.add(i);
            }
        }
        if (!parts.length) {
            throw 'Invalid Enumeration Value';
        }
        return parts.join('');
    }
}

///////////////////////////////////////////////////////////////////////////////
// Delegate

Function.prototype.invoke = function() {
    this.apply(this, arguments);
}

var Delegate = function() {
}
Delegate.createClass('Delegate');

Delegate.Null = function() { }

Delegate._create = function Delegate$_create(targets) {
    var delegate = function() {
        if (targets.length == 2) {
            return targets[1].apply(targets[0], arguments);
        }
        else {
            for (var i = 0; i < targets.length; i += 2) {
                targets[i + 1].apply(targets[i], arguments);
            }
            return null;
        }
    };
    delegate.invoke = delegate;
    delegate._targets = targets;

    return delegate;
}

Delegate.create = function Delegate$create(object, method) {
    if (!object) {
        method.invoke = method;
        return method;
    }
    return Delegate._create([object, method]);
}

Delegate.combine = function Delegate$combine(delegate1, delegate2) {
    if (!delegate1) {
        if (!delegate2._targets) {
            return Delegate.create(null, delegate2);
        }
        return delegate2;
    }
    if (!delegate2) {
        if (!delegate1._targets) {
            return Delegate.create(null, delegate1);
        }
        return delegate1;
    }

    var targets1 = delegate1._targets ? delegate1._targets : [null, delegate1];
    var targets2 = delegate2._targets ? delegate2._targets : [null, delegate2];

    return Delegate._create(targets1.concat(targets2));
}

Delegate.remove = function Delegate$remove(delegate1, delegate2) {
    if (!delegate1 || (delegate1 === delegate2)) {
        return null;
    }
    if (!delegate2) {
        return delegate1;
    }

    var targets = delegate1._targets;
    var object = null;
    var method;
    if (delegate2._targets) {
        object = delegate2._targets[0];
        method = delegate2._targets[1];
    }
    else {
        method = delegate2;
    }

    for (var i = 0; i < targets.length; i += 2) {
        if ((targets[i] === object) && (targets[i + 1] === method)) {
            if (targets.length == 2) {
                return null;
            }
            targets.splice(i, 2);
            return Delegate._create(targets);
        }
    }

    return delegate1;
}


Delegate.createExport = function Delegate$createExport(delegate, multiUse) {
    var name = '__' + (new Date()).valueOf();
    Delegate[name] = function() {
        if (!multiUse) {
            Delegate.deleteExport(name);
        }
        delegate.apply(null, arguments);
    };

    return name;
}

Delegate.deleteExport = function Delegate$deleteExport(name) {
    if (Delegate[name]) {
        delete Delegate[name];
    }
}

Delegate.clearExport = function Delegate$clearExport(name) {
    if (Delegate[name]) {
        Delegate[name] = Delegate.Null;
    }
}

///////////////////////////////////////////////////////////////////////////////
// CultureInfo

var CultureInfo = function(name, numberFormat, dateFormat) {
    this.name = name;
    this.numberFormat = numberFormat;
    this.dateFormat = dateFormat;
}
CultureInfo.createClass('CultureInfo');

CultureInfo.Neutral = new CultureInfo('en-US',
    {
        naNSymbol: 'NaN',
        negativeSign: '-',
        positiveSign: '+',
        negativeInfinityText: '-Infinity',
        positiveInfinityText: 'Infinity',
        
        percentSymbol: '%',
        percentGroupSizes: [3],
        percentDecimalDigits: 2,
        percentDecimalSeparator: '.',
        percentGroupSeparator: ',',
        percentPositivePattern: '{0} %',
        percentNegativePattern: '-{0} %',

        currencySymbol:'$',
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: '.',
        currencyGroupSeparator: ',',
        currencyNegativePattern: '(${0})',
        currencyPositivePattern: '${0}',

        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: '.',
        numberGroupSeparator: ','
    },
    {
        amDesignator: 'AM',
        pmDesignator: 'PM',

        dateSeparator: '/',
        timeSeparator: ':',

        gmtDateTimePattern: 'ddd, dd MMM yyyy HH:mm:ss \'GMT\'',
        universalDateTimePattern: 'yyyy-MM-dd HH:mm:ssZ',
        sortableDateTimePattern: 'yyyy-MM-ddTHH:mm:ss',
        dateTimePattern: 'dddd, MMMM dd, yyyy h:mm:ss tt',

        longDatePattern: 'dddd, MMMM dd, yyyy',
        shortDatePattern: 'M/d/yyyy',

        longTimePattern: 'h:mm:ss tt',
        shortTimePattern: 'h:mm tt',

        firstDayOfWeek: 0,
        dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        shortDayNames: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        minimizedDayNames: ['Su','Mo','Tu','We','Th','Fr','Sa'],

        monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December',''],
        shortMonthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','']
    });
CultureInfo.Current = CultureInfo.Neutral;

///////////////////////////////////////////////////////////////////////////////
// IArray

var IArray = function() { };
IArray.prototype = {
    getLength: null,
    getItem: null
}
IArray.createInterface('IArray');

///////////////////////////////////////////////////////////////////////////////
// IEnumerator

var IEnumerator = function() { };
IEnumerator.prototype = {
    get_current: null,
    moveNext: null,
    reset: null
}
IEnumerator.createInterface('IEnumerator');

///////////////////////////////////////////////////////////////////////////////
// IEnumerable

var IEnumerable = function() { };
IEnumerable.prototype = {
    getEnumerator: null
}
IEnumerable.createInterface('IEnumerable');

///////////////////////////////////////////////////////////////////////////////
// ArrayEnumerator

var ArrayEnumerator = function ArrayEnumerator$(array) {
    this._array = array;
    this._index = -1;
}
ArrayEnumerator.prototype = {
    get_current: function () {
        return this._array[this._index];
    },
    moveNext: function () {
        this._index++;
        return (this._index < this._array.length);
    },
    reset: function () {
        this._index = -1;
    }
}

ArrayEnumerator.createClass('ArrayEnumerator', null, IEnumerator);

///////////////////////////////////////////////////////////////////////////////
// Array Extensions

Array.__interfaces = [ IArray, IEnumerable ];

Array.prototype.getLength = function Array$getLength() {
    return this.length;
}
Array.prototype.getItem = function Array$getItem(index) {
    return this[index];
}

Array.prototype.getEnumerator = function Array$getEnumerator() {
    return new ArrayEnumerator(this);
}

///////////////////////////////////////////////////////////////////////////////
// IDisposable

var IDisposable = function() { };
IDisposable.prototype = {
    dispose: null
}
IDisposable.createInterface('IDisposable');

///////////////////////////////////////////////////////////////////////////////
// IServiceProvider

var IServiceProvider = function() { };
IServiceProvider.prototype = {
    getService: null
}
IServiceProvider.createInterface('IServiceProvider');

///////////////////////////////////////////////////////////////////////////////
// IServiceContainer

var IServiceContainer = function() { };
IServiceContainer.prototype = {
    registerService: null,
    unregisterService: null
}
IServiceContainer.createInterface('IServiceContainer');

///////////////////////////////////////////////////////////////////////////////
// StringBuilder

var StringBuilder = function StringBuilder$(s) {

    if ((s !== undefined) && (s !== null)) {
        this._parts = [ s ];
    }
    else {
        this._parts = [];
    }
}
StringBuilder.prototype = {
    get_isEmpty: function () {
        return (this._parts.length == 0);
    },

    append: function (s) {
        if ((s !== undefined) && (s !== null)) {
            this._parts.add(s);
        }
    },

    appendLine: function (s) {
        this.append(s);
        this.append('\r\n');
    },

    clear: function () {
        this._parts.clear();
    },

    toString: function () {
        return this._parts.join('');
    }
};

StringBuilder.createClass('StringBuilder');

///////////////////////////////////////////////////////////////////////////////
// EventArgs

var EventArgs = function EventArgs$() {
}
EventArgs.createClass('EventArgs');

EventArgs.Empty = new EventArgs();

///////////////////////////////////////////////////////////////////////////////
// IEventAccessor

var IEventAccessor = function() { };
IEventAccessor.prototype = {
    addHandler: null,
    removeHandler: null
}
IEventAccessor.createInterface('IEventAccessor');

///////////////////////////////////////////////////////////////////////////////
// IPropertyAccessor

var IPropertyAccessor = function() { };
IPropertyAccessor.prototype = {
    getProperty: null,
    setProperty: null
}
IPropertyAccessor.createInterface('IPropertyAccessor');

///////////////////////////////////////////////////////////////////////////////
// IMethodAccessor

var IMethodAccessor = function() { };
IMethodAccessor.prototype = {
    invokeMethod: null
}
IMethodAccessor.createInterface('IMethodAccessor');

///////////////////////////////////////////////////////////////////////////////
// TypeDescriptor

var TypeDescriptor = function TypeDescriptor$(attributes, properties, methods, events, options) {
    if (attributes) {
        this._attributes = attributes;
    }
    if (properties) {
        this._properties = properties;
    }
    if (methods) {
        this._methods = methods;
    }
    if (events) {
        this._events = events;
    }
    if (options) {
        this._options = options;
    }
}
TypeDescriptor.prototype = {
    _attributes: null,
    _properties: null,
    _methods: null,
    _events: null,
    _options: null
};
TypeDescriptor.createClass('TypeDescriptor');

TypeDescriptor.createMetadata = function TypeDescriptor$createMetadata(memberName, memberType, params, attrs) {
    var memberInfo = { name: memberName, type: memberType, parameters: params };
    if (attrs) {
        memberInfo.attributes = attrs;
    }
    return memberInfo;
}

TypeDescriptor._getDescriptor = function TypeDescriptor$_getDescriptor(type) {
    if (!type.getMetadata) {
        // Plain script object
        return null;
    }

    var td = type._td;
    if (td) {
        return td;
    }
    
    var attributes;
    var properties;
    var methods;
    var events;
    var options;

    var baseType = type.get_baseType();
    if (baseType) {
        var baseTD = TypeDescriptor._getDescriptor(baseType);
        attributes = Object._clone(baseTD._attributes);
        properties = Object._clone(baseTD._properties);
        methods = Object._clone(baseTD._methods);
        events = Object._clone(baseTD._events);
        options = Object._clone(baseTD._options);
    }

    var metadata = type.getMetadata();
    if (metadata) {
        if (metadata.attributes) {
            if (!attributes) {
                attributes = { };
            }
            var attrsEnum = metadata.attributes.getEnumerator();
            while (attrsEnum.moveNext()) {
                var attr = attrsEnum.get_current();
                attributes[attr.name] = attr;
            }
        }

        if (metadata.properties) {
            if (!properties) {
                properties = { };
            }
            var propEnum = metadata.properties.getEnumerator();
            while (propEnum.moveNext()) {
                var propInfo = propEnum.get_current();
                properties[propInfo.name] = propInfo;
            }
        }

        if (metadata.methods) {
            if (!methods) {
                methods = { };
            }
            var methodEnum = metadata.methods.getEnumerator();
            while (methodEnum.moveNext()) {
                var methodInfo = methodEnum.get_current();
                methods[methodInfo.name] = methodInfo;
            }
        }

        if (metadata.events) {
            if (!events) {
                events = { };
            }
            var eventEnum = metadata.events.getEnumerator();
            while (eventEnum.moveNext()) {
                var eventInfo = eventEnum.get_current();
                events[eventInfo.name] = eventInfo;
            }
        }

        if (metadata.options) {
            if (!options) {
                options = { };
            }
            var optionsEnum = metadata.events.getEnumerator();
            while (optionsEnum.moveNext()) {
                var optionInfo = optionsEnum.get_current();
                options[optionInfo.name] = optionInfo;
            }
        }
    }

    td = new TypeDescriptor(attributes, properties, methods, events);
    type._td = td;
    return td;
}

TypeDescriptor._getObjectDescriptor = function TypeDescriptor$_getObjectDescriptor(instance) {
    var type = Type.getInstanceType(instance);
    return TypeDescriptor._getDescriptor(type);
}

TypeDescriptor.getProperty = function TypeDescriptor$getProperty(instance, propName, propKey) {
    var propValue = null;
    if (IPropertyAccessor.isInstance(instance)) {
        propValue = instance.getProperty(propName);
    }
    else {
        var td = TypeDescriptor._getObjectDescriptor(instance);
        if (!td) {
            // Plain script object - perform field access
            propValue = instance[propName];
        }
        else if (td._properties) {
            var propInfo = td._properties[propName];
            if (propInfo) {
                var getter = instance['get_' + propName];
                propValue = getter.call(instance);
            }
        }
    }

    if (propValue && propKey) {
        propValue = propValue[propKey];
    }
    return propValue;
}

TypeDescriptor.setProperty = function TypeDescriptor$setProperty(instance, propName, propKey, value) {
    if (propKey) {
        var prop = TypeDescriptor.getProperty(instance, propName);
        prop[propKey] = value;
        return;
    }

    if (IPropertyAccessor.isInstance(instance)) {
        instance.setProperty(propName, value);
    }
    else {
        var td = TypeDescriptor._getObjectDescriptor(instance);
        if (!td) {
            // Plain script object - perform field access
            instance[propName] = value;
        }
        else if (td._properties) {
            var propInfo = td._properties[propName];
            if (propInfo && !propInfo.readOnly) {
                if ((propInfo.type != String) && (typeof(value) == 'string') && propInfo.type.parse) {
                    value = propInfo.type.parse(value);
                }

                var setter = instance['set_' + propName];
                propValue = setter.call(instance, value);
            }
        }
    }
}

TypeDescriptor.addHandler = function TypeDescriptor$addHandler(instance, eventName, handler) {
    if (IEventAccessor.isInstance(instance)) {
        instance.addHandler(eventName, handler);
        return;
    }

    var td = Sys.TypeDescriptor._getObjectDescriptor(instance);
    if (td && td._events) {
        var eventInfo = td._events[eventName];
        if (eventInfo) {
            var addMethod = instance['add_' + eventName];
            addMethod.call(instance, handler);
        }
    }
}

TypeDescriptor.removeHandler = function TypeDescriptor$removeHandler(instance, eventName, handler) {
    if (IEventAccessor.isInstance(instance)) {
        instance.removeHandler(eventName, handler);
        return;
    }

    var td = Sys.TypeDescriptor._getObjectDescriptor(instance);
    if (td && td._events) {
        var eventInfo = td._events[eventName];
        if (eventInfo) {
            var removeMethod = instance['remove_' + eventName];
            removeMethod.call(instance, handler);
        }
    }
}

TypeDescriptor.invokeMethod = function TypeDescriptor$invokeMethod(instance, methodName, args) {
    if (IMethodAccessor.isInstance(instance)) {
        return instance.invokeMethod(methodName, args);
    }

    var td = Sys.TypeDescriptor._getObjectDescriptor(instance);
    if (!td) {
        // Plain script object
        return instance[methodName].call(instance);
    }

    if (td._methods) {
        var methodInfo = td._methods[methodName];
        var method = instance[methodInfo.name];
        if (!methodInfo.parameters) {
            return method.call(instance);
        }
        else {
            var arguments = [];
            for (var i = 0; i < methodInfo.parameters.length; i++) {
                var paramInfo = methodInfo.parameters[i];
                var value = args[parameterInfo.name];
                
                if (value && (paramInfo.type != String) && (typeof(value) == 'string') && paramInfo.type.parse) {
                    value = paramInfo.type.parse(value);
                }

                arguments[i] = value;
            }
            
            return method.apply(instance, arguments);
        }
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
// XMLHttpRequest

if (!window.XMLHttpRequest) {
    window.XMLHttpRequest = function() {
        var progIDs = [ 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP' ];

        for (var i = 0; i < progIDs.length; i++) {
            try {
                var xmlHttp = new ActiveXObject(progIDs[i]);
                return xmlHttp;
            }
            catch (ex) {
            }
        }

        return null;
    }
}

///////////////////////////////////////////////////////////////////////////////
// XMLDocumentParser

var XMLDocumentParser = function() {
}
XMLDocumentParser.createClass('XMLDocumentParser');

XMLDocumentParser.parse = function XMLDocumentParser$parse(markup) {
    if (!window.DOMParser) {
        var progIDs = [ 'Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument' ];
        
        for (var i = 0; i < progIDs.length; i++) {
            try {
                var xmlDOM = new ActiveXObject(progIDs[i]);
                xmlDOM.async = false;
                xmlDOM.loadXML(markup);
                xmlDOM.setProperty('SelectionLanguage', 'XPath');
                
                return xmlDOM;
            }
            catch (ex) {
            }
        }
    }
    else {
        try {
            var domParser = new DOMParser();
            return domParser.parseFromString(markup, 'text/xml');
        }
        catch (ex) {
        }
    }

    return null;
}


} 
// XdComm.js
//


Type.createNamespace('FB');

////////////////////////////////////////////////////////////////////////////////
// FB.XdHttpRequestResult

FB.$create_XdHttpRequestResult = function FB_XdHttpRequestResult(id, status, statusText, responseText) {
    var $o = { };
    $o.status = status;
    $o.statusText = statusText;
    $o.responseText = responseText;
    $o.id = id;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// FB.FBDebug

FB.FBDebug = function FB_FBDebug() {
}
FB.FBDebug.assert = function FB_FBDebug$assert(condition, message) {
    if (FB.FBDebug.isEnabled) {
        Debug.assert(condition, message);
    }
}
FB.FBDebug.writeLine = function FB_FBDebug$writeLine(message) {
    if (FB.FBDebug.isEnabled) {
        Debug.writeLine(message);
    }
}


////////////////////////////////////////////////////////////////////////////////
// FB.Uri

FB.Uri = function FB_Uri(urlString) {
    this._urlString = urlString;
}
FB.Uri.prototype = {
    
    get_absoluteUrl: function () {
        return this._urlString;
    },
    
    get_pathAndQuery: function () {
        var i = this._urlString.indexOf('://');
        if (i >= 0) {
            i = this._urlString.indexOf('/', i + 3);
            if (i >= 0) {
                return this._urlString.substr(i);
            }
        }
        return this._urlString;
    },
    
    get_schemeAndDomain: function () {
        var i = this._urlString.indexOf('://');
        if (i >= 0) {
            i = this._urlString.indexOf('/', i + 3);
            if (i >= 0) {
                return this._urlString.substr(0, i);
            }
        }
        throw new Error('not an absolute url');
    },
    
    get_queryParameters: function () {
        if (!this._queryParameters) {
            this._queryParameters = {};
            var queryString;
            var i = this._urlString.indexOf('?');
            if (i > 0) {
                queryString = this._urlString.substr(i + 1);
                i = queryString.indexOf('#');
                if (i > 0) {
                    queryString = queryString.substring(0, i - 1);
                }
                var segments = queryString.split('&');
                var $enum1 = segments.getEnumerator();
                while ($enum1.moveNext()) {
                    var segment = $enum1.get_current();
                    i = segment.indexOf('=');
                    if (i > 0) {
                        var key = segment.substr(0, i);
                        var value = segment.substr(i + 1);
                        this._queryParameters[key] = decodeURIComponent(value);
                    }
                }
            }
        }
        return this._queryParameters;
    },
    
    _queryParameters: null,
    _urlString: null
}


Type.createNamespace('FBIntern');

////////////////////////////////////////////////////////////////////////////////
// FBIntern.HostName

FBIntern.HostName = function() { };
FBIntern.HostName.prototype = {
    IE: 0, 
    MOZILLA: 1, 
    SAFARI: 2, 
    OPERA: 3, 
    OTHER: 4
}
FBIntern.HostName.createEnum('FBIntern.HostName', false);


////////////////////////////////////////////////////////////////////////////////
// FBIntern.HostInfo

FBIntern.HostInfo = function FBIntern_HostInfo() {
    var userAgent = window.navigator.userAgent;
    var index;
    if ((index = userAgent.indexOf('msie')) >= 0) {
        this._hostName = FBIntern.HostName.IE;
    }
    else if ((index = userAgent.indexOf('firefox')) >= 0) {
        this._hostName = FBIntern.HostName.MOZILLA;
    }
    else if ((index = userAgent.indexOf('gecko')) >= 0) {
        this._hostName = FBIntern.HostName.MOZILLA;
    }
    else if ((index = userAgent.indexOf('safari')) >= 0) {
        this._hostName = FBIntern.HostName.SAFARI;
    }
    else {
        this._hostName = FBIntern.HostName.OTHER;
    }
}
FBIntern.HostInfo.prototype = {
    
    get_hostName: function () {
        return this._hostName;
    },
    
    _hostName: 0
}


////////////////////////////////////////////////////////////////////////////////
// FBIntern.AppInfo

FBIntern.AppInfo = function FBIntern_AppInfo() {
    this._hostInfo = new FBIntern.HostInfo();
}
FBIntern.AppInfo.get_current = function FBIntern_AppInfo$get_current() {
    if (!FBIntern.AppInfo._current) {
        FBIntern.AppInfo._current = new FBIntern.AppInfo();
    }
    return FBIntern.AppInfo._current;
}
FBIntern.AppInfo.prototype = {
    
    get_hostInfo: function () {
        return this._hostInfo;
    },
    
    _hostInfo: null
}


Type.createNamespace('FB.XdComm');

////////////////////////////////////////////////////////////////////////////////
// FB.XdComm._packet

FB.XdComm.$create__packet = function FB_XdComm__packet() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// FB.XdComm._packeT_TYPE

FB.XdComm._packeT_TYPE = function() { };
FB.XdComm._packeT_TYPE.prototype = {
    DATA: 0, 
    datA_FRAGMENT: 1, 
    datA_FRAGMENT_END: 2, 
    INITIATE: 3, 
    ACK: 4, 
    ACKACK: 5
}
FB.XdComm._packeT_TYPE.createEnum('FB.XdComm._packeT_TYPE', false);


////////////////////////////////////////////////////////////////////////////////
// FB.XdComm._connectioN_STATUS

FB.XdComm._connectioN_STATUS = function() { };
FB.XdComm._connectioN_STATUS.prototype = {
    noT_READY: 0, 
    READY: 1, 
    waiT_FOR_ACK: 2
}
FB.XdComm._connectioN_STATUS.createEnum('FB.XdComm._connectioN_STATUS', false);


////////////////////////////////////////////////////////////////////////////////
// FB.XdComm._dataWithHandler

FB.XdComm.$create__dataWithHandler = function FB_XdComm__dataWithHandler(handler, data) {
    var $o = { };
    $o.handler = handler;
    $o.data = data;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// FB.XdComm._handShakeData

FB.XdComm._handShakeData = function FB_XdComm__handShakeData() {
}
FB.XdComm._handShakeData.prototype = {
    initiatorReceiverUrl: null,
    initiatorIframeName: null
}


////////////////////////////////////////////////////////////////////////////////
// FB.XdComm._dataInfo

FB.XdComm._dataInfo = function FB_XdComm__dataInfo(data, callback) {
    this.data = data;
    this.dataLength = data.length;
    this.callback = callback;
}
FB.XdComm._dataInfo.prototype = {
    data: null,
    dataLength: 0,
    offset: 0,
    callback: null
}


////////////////////////////////////////////////////////////////////////////////
// FB.XdComm._connection

FB.XdComm._connection = function FB_XdComm__connection(handler) {
    this.status = FB.XdComm._connectioN_STATUS.noT_READY;
    this._sendQueue = [];
    this._dataReady = handler;
    switch (FBIntern.AppInfo.get_current().get_hostInfo().get_hostName()) {
        case FBIntern.HostName.IE:
            this._maxPacketDataLength = 1024;
            break;
        case FBIntern.HostName.MOZILLA:
            this._maxPacketDataLength = 100000;
            break;
        case FBIntern.HostName.SAFARI:
            this._maxPacketDataLength = 1024;
            break;
        case FBIntern.HostName.OPERA:
            this._maxPacketDataLength = 190000;
            break;
        default:
            this._maxPacketDataLength = 1024;
            break;
    }
}
FB.XdComm._connection.prototype = {
    
    sendData: function (data, callback) {
        var dataInfo = new FB.XdComm._dataInfo(data, callback);
        this._sendQueue.add(dataInfo);
        if (this.get__status() === FB.XdComm._connectioN_STATUS.READY) {
            this.sendNextData();
        }
    },
    
    _maxPacketDataLength: 1000,
    
    sendNextData: function () {
        FB.FBDebug.assert(this.get__status() === FB.XdComm._connectioN_STATUS.READY, 'Status == READY');
        if (this._sendQueue.length > 0) {
            var dataInfo = this._sendQueue[0];
            var type = FB.XdComm._packeT_TYPE.DATA;
            var packetData;
            if (!dataInfo.offset && dataInfo.dataLength <= this._maxPacketDataLength) {
                packetData = dataInfo.data;
            }
            else {
                var packetLength = dataInfo.dataLength - dataInfo.offset;
                if (packetLength > this._maxPacketDataLength) {
                    packetLength = this._maxPacketDataLength;
                    type = FB.XdComm._packeT_TYPE.datA_FRAGMENT;
                }
                else {
                    type = FB.XdComm._packeT_TYPE.datA_FRAGMENT_END;
                }
                packetData = dataInfo.data.substr(dataInfo.offset, packetLength);
                dataInfo.offset += packetLength;
            }
            this._transimitPacket(this._creatPacket(packetData, type));
            this.set__status(FB.XdComm._connectioN_STATUS.waiT_FOR_ACK);
            if (type !== FB.XdComm._packeT_TYPE.datA_FRAGMENT) {
                this._sendQueue.removeAt(0);
                if (dataInfo.callback) {
                    dataInfo.callback.invoke();
                }
            }
        }
    },
    
    _dataReady: null,
    
    get__status: function () {
        return this.status;
    },
    set__status: function (value) {
        if (this.status !== value) {
            this.status = value;
            this._onStatusChanged();
        }
        return value;
    },
    
    _onStatusChanged: function () {
        if (this.get__status() === FB.XdComm._connectioN_STATUS.READY) {
            this.sendNextData();
        }
    },
    
    _requestConnection: function (initiatorReceiverUrl, initatorFrameName, targetReceiverUrl, target_frame_name) {
        if (this.status !== FB.XdComm._connectioN_STATUS.noT_READY) {
            throw new Error('connection initialization started already');
        }
        this._connectionId = Math.round(Math.random() * 100000).toString();
        this._receiverUrl = targetReceiverUrl;
        this._targetFrameName = target_frame_name;
        FB.XdComm.Server.singleton._registerConnection(this);
        var handshakeData = new FB.XdComm._handShakeData();
        handshakeData.initiatorReceiverUrl = initiatorReceiverUrl;
        handshakeData.initiatorIframeName = initatorFrameName;
        var packet = this._creatPacket(FB.JSON.serialize(handshakeData), FB.XdComm._packeT_TYPE.INITIATE);
        this.set__status(FB.XdComm._connectioN_STATUS.waiT_FOR_ACK);
        this._createReceiverDom(packet);
    },
    
    _acceptConnection: function (receivedPacket) {
        var handeshakeData = FB.JSON.deserialize(receivedPacket.d);
        if (handeshakeData.initiatorReceiverUrl) {
            this._receiverUrl = handeshakeData.initiatorReceiverUrl;
            this._connectionId = receivedPacket.cid;
            this._targetFrameName = handeshakeData.initiatorIframeName;
            var packet = this._creatPacket(receivedPacket.id.toString(), FB.XdComm._packeT_TYPE.ACK);
            this._createReceiverDom(packet);
            return true;
        }
        else {
            return false;
        }
    },
    
    _onReceivedPacket: function (packet) {
        switch (packet.t) {
            case FB.XdComm._packeT_TYPE.ACK:
                this._transimitPacket(this._creatPacket(null, FB.XdComm._packeT_TYPE.ACKACK));
                this.set__status(FB.XdComm._connectioN_STATUS.READY);
                break;
            case FB.XdComm._packeT_TYPE.ACKACK:
                this.set__status(FB.XdComm._connectioN_STATUS.READY);
                break;
            default:
                this._transimitPacket(this._creatPacket(null, FB.XdComm._packeT_TYPE.ACK));
                this.set__status(FB.XdComm._connectioN_STATUS.waiT_FOR_ACK);
                this._onDataPacketReceived(packet);
                break;
        }
    },
    
    _onDataPacketReceived: function (packet) {
        if (packet.t === FB.XdComm._packeT_TYPE.datA_FRAGMENT) {
            if (!this._partialReceivedData) {
                this._partialReceivedData = new StringBuilder();
            }
            this._partialReceivedData.append(packet.d);
        }
        else {
            var fullData;
            if (packet.t === FB.XdComm._packeT_TYPE.datA_FRAGMENT_END) {
                this._partialReceivedData.append(packet.d);
                fullData = this._partialReceivedData.toString();
                this._partialReceivedData = null;
            }
            else {
                fullData = packet.d;
            }
            if (this._dataReady) {
                this._dataReady.invoke(this, fullData);
            }
        }
    },
    
    _creatPacket: function (data, type) {
        var packet = FB.XdComm.$create__packet();
        packet.cid = this._connectionId;
        packet.d = data;
        this._packetIdCount++;
        packet.id = this._packetIdCount;
        packet.t = type;
        return packet;
    },
    
    _createReceiverDom: function (packet) {
        var receiverDom = document.createElement('iframe');
        receiverDom.style.visibility = 'hidden';
        var serializedPacket = encodeURIComponent(FB.JSON.serialize(packet));
        if (this._targetFrameName) {
            receiverDom.src = this._receiverUrl + '#fname=' + this._targetFrameName + '&' + serializedPacket;
        }
        else {
            receiverDom.src = this._receiverUrl + '#' + serializedPacket;
        }
        this._receiverDom = document.body.appendChild(receiverDom);
    },
    
    _transimitPacket: function (packet) {
        if (this._receiverDom) {
            document.body.removeChild(this._receiverDom);
            this._receiverDom = null;
        }
        this._createReceiverDom(packet);
    },
    
    _connectionId: null,
    _receiverDom: null,
    _receiverUrl: null,
    _targetFrameName: null,
    _partialReceivedData: null,
    _packetIdCount: 0
}


////////////////////////////////////////////////////////////////////////////////
// FB.XdComm.Server

FB.XdComm.Server = function FB_XdComm_Server() {
    this._connections = {};
    this._handlers = {};
    this._dataReceivedHandler = Delegate.create(this, this._onDataReceived);
}
FB.XdComm.Server.prototype = {
    
    get_receiverUrl: function () {
        return this._receiverUrl;
    },
    set_receiverUrl: function (value) {
        if (value.indexOf('://') < 0) {
            var currentUri = new FB.Uri(window.location.href);
            this._receiverUrl = currentUri.get_schemeAndDomain() + value;
        }
        else {
            this._receiverUrl = value;
        }
        return value;
    },
    
    send: function (targetReceiverUrl, targetIframeName, handlerName, data, callback) {
        var connection = this._findConnection(targetReceiverUrl);
        if (!connection) {
            connection = new FB.XdComm._connection(this._dataReceivedHandler);
            var initiatorIframeName = (!targetIframeName) ? window.self.name : null;
            connection._requestConnection(this.get_receiverUrl(), initiatorIframeName, targetReceiverUrl, targetIframeName);
        }
        connection.sendData(FB.JSON.serialize(FB.XdComm.$create__dataWithHandler(handlerName, data)), callback);
    },
    
    registerDataHandler: function (handlerName, handler) {
        if (Object.keyExists(this._handlers, handlerName)) {
            throw new Error('Handler already exists');
        }
        this._handlers[handlerName] = handler;
    },
    
    _registerConnection: function (connection) {
        this._connections[connection._connectionId.toString()] = connection;
    },
    
    onReceiverLoaded: function (hash) {
        if (hash) {
            var packet = FB.JSON.deserialize(decodeURIComponent(hash));
            switch (packet.t) {
                case FB.XdComm._packeT_TYPE.INITIATE:
                    var new_connection = new FB.XdComm._connection(this._dataReceivedHandler);
                    if (new_connection._acceptConnection(packet)) {
                        FB.XdComm.Server.singleton._registerConnection(new_connection);
                    }
                    break;
                default:
                    var key = packet.cid.toString();
                    if (Object.keyExists(this._connections, key)) {
                        var connection = this._connections[key];
                        connection._onReceivedPacket(packet);
                    }
                    else {
                        FB.FBDebug.assert(false, 'unknown connection id');
                    }
                    break;
            }
        }
    },
    
    _findConnection: function (target_receiver_url) {
        var $dict1 = this._connections;
        for (var $key2 in $dict1) {
            var entry = { key: $key2, value: $dict1[$key2] };
            var connection = entry.value;
            if (connection._receiverUrl === target_receiver_url) {
                return connection;
            }
        }
        return null;
    },
    
    _onDataReceived: function (connection, data) {
        var dataWithHandler = FB.JSON.deserialize(data);
        if (Object.keyExists(this._handlers, dataWithHandler.handler)) {
            var handler = this._handlers[dataWithHandler.handler];
            if (FBIntern.AppInfo.get_current().get_hostInfo().get_hostName() === FBIntern.HostName.IE) {
                handler.invoke(connection._receiverUrl, connection._targetFrameName, dataWithHandler.data);
            }
            else {
                window.setTimeout(Delegate.create(this, function() {
                    handler.invoke(connection._receiverUrl, connection._targetFrameName, dataWithHandler.data);
                }), 0);
            }
        }
        else {
            FB.FBDebug.assert(false, 'handler not found');
        }
    },
    
    _dataReceivedHandler: null,
    _receiverUrl: null
}


FB.FBDebug.createClass('FB.FBDebug');
FB.Uri.createClass('FB.Uri');
FBIntern.HostInfo.createClass('FBIntern.HostInfo');
FBIntern.AppInfo.createClass('FBIntern.AppInfo');
FB.XdComm._handShakeData.createClass('FB.XdComm._handShakeData');
FB.XdComm._dataInfo.createClass('FB.XdComm._dataInfo');
FB.XdComm._connection.createClass('FB.XdComm._connection');
FB.XdComm.Server.createClass('FB.XdComm.Server');
FB.FBDebug.isEnabled = false;
FBIntern.AppInfo._current = null;
FB.XdComm.Server.singleton = new FB.XdComm.Server();

// ---- Do not remove this footer ----
// Generated using Script# v0.4.5.0 (http://projects.nikhilk.net)
// -----------------------------------

FB.JSON = function FB_JSON() {
}
FB.JSON.deserialize = function FB_JSON$deserialize(s) {
    if (String.isNullOrEmpty(s)) {
        return null;
    }
        
    if (!FB.JSON._dateRegex) {
        FB.JSON._dateRegex = new RegExp('(\'|\")\\\\@(-?[0-9]+)@(\'|\")', 'gm');
    }
    
    s = s.replace(FB.JSON._dateRegex, 'new Date($2)');
    
    return eval('(' + s + ')');
}
FB.JSON.serialize = function FB_JSON$serialize(o) {
    if (isNullOrUndefined(o)) {
        return String.Empty;
    }
    var sb = new StringBuilder();
    FB.JSON._serializeCore(sb, o);
    return sb.toString();
}

FB.JSON._serializeCore = function FB_JSON$_serializeCore(sb, o) {
    
    
    if (isNullOrUndefined(o)) {
        sb.append('null');
        return;
    }
    var scriptType = typeof(o);
    
    switch (scriptType) {
        case 'boolean':
            sb.append(o.toString());
            return;
        case 'number':
            sb.append((isFinite(o)) ? o.toString() : 'null');
            return;
        case 'string':
            sb.append((o).quote());
            return;
        case 'object':            
            if (Array.isInstance(o)) {
                sb.append('[');
                var a = o;
                var length = a.length;
                var first = true;
                for (var i = 0; i < length; i++) {
                    if(typeof(a[i]) == 'function') {
                        continue;
                    }
                    
                    if (first) {
                        first = false;
                    }
                    else {
                        sb.append(',');
                    }
                    FB.JSON._serializeCore(sb, a[i]);
                }
                sb.append(']');
            }
            else if (Date.isInstance(o)) {
                var d = o;
                var utcValue = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
                sb.append('\"\\@');
                sb.append(utcValue.toString());
                sb.append('@\"');
            }
            else if (RegExp.isInstance(o)) {
                sb.append(o.toString());
            }
            else {
                sb.append('{');
                var first = true;
                var $dict1 = o;
                for (var $key2 in $dict1) {
                    var entry = { key: $key2, value: $dict1[$key2] };
                    if ((entry.key).startsWith('$')) {
                        continue;
                    }
                    
                    if(typeof(entry.value) == 'function') {
                        continue;
                    }
                    if (first) {
                        first = false;
                    }
                    else {
                        sb.append(',');
                    }
     
                    sb.append('"' + entry.key + '"');
                    sb.append(':');
                    FB.JSON._serializeCore(sb, entry.value);
                }
                sb.append('}');
            }
            return;
        default:
            sb.append('null'); 
            return;
    }
}

/**
*
* MD5 (Message-Digest Algorithm)
* http://www.webtoolkit.info/
*
**/

FBIntern.Md5 = function FBIntern_Md5() {
}
FBIntern.Md5.computeHashToString = function FBIntern_Md5$computeHashToString(string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }

    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

    return temp.toLowerCase();
}// XdHttpRequestServer.js
//


Type.createNamespace('FB');

////////////////////////////////////////////////////////////////////////////////
// FB.XdHttpRequestServer

FB.XdHttpRequestServer = function FB_XdHttpRequestServer() {
}
FB.XdHttpRequestServer.main = function FB_XdHttpRequestServer$main(args) {
    var receiverUrl = args['receiver'];
    if (Object.keyExists(args, 'allowed_url_filter')) {
        FB.XdHttpRequestServer._allowedUrlFilter = new RegExp(args['allowed_url_filter']);
    }
    if (Object.keyExists(args, 'allowed_urls')) {
        FB.XdHttpRequestServer._allowedUrls = args['allowed_urls'];
    }
    var rootUri = new FB.Uri(window.location.href);
    FB.XdHttpRequestServer._rootUrl = rootUri.get_schemeAndDomain();
    FB.XdComm.Server.singleton.set_receiverUrl(receiverUrl);
    FB.XdComm.Server.singleton.registerDataHandler('http_server', Delegate.create(null, FB.XdHttpRequestServer._onDataReceived));
}
FB.XdHttpRequestServer._isUrlAllowed = function FB_XdHttpRequestServer$_isUrlAllowed(url) {
    if (FB.XdHttpRequestServer._allowedUrlFilter && FB.XdHttpRequestServer._allowedUrlFilter.test(url)) {
        return true;
    }
    if (FB.XdHttpRequestServer._allowedUrls) {
        var $enum1 = FB.XdHttpRequestServer._allowedUrls.getEnumerator();
        while ($enum1.moveNext()) {
            var allowed_url = $enum1.get_current();
            if (allowed_url === url) {
                return true;
            }
        }
    }
    return false;
}
FB.XdHttpRequestServer._onDataReceived = function FB_XdHttpRequestServer$_onDataReceived(senderReceiverUrl, senderIframeName, data) {
    var request_data = data;
    var request = new XMLHttpRequest();
    var url = request_data[2];
    if (!FB.XdHttpRequestServer._isUrlAllowed(url)) {
        FB.FBDebug.assert(false, 'Url ' + url + ' is not allowed');
        return;
    }
    url = FB.XdHttpRequestServer._rootUrl + url;
    request.onreadystatechange = Delegate.create(null, function() {
        if (request.readyState === 4) {
            var result = FB.$create_XdHttpRequestResult(request_data[0], request.status, request.statusText, request.responseText);
            FB.XdComm.Server.singleton.send(senderReceiverUrl, senderIframeName, 'http_client', result, null);
        }
    });
    request.open(request_data[1], request_data[2], true);
    var extraHeaders = request_data[4];
    if (extraHeaders) {
        var $dict1 = extraHeaders;
        for (var $key2 in $dict1) {
            var headerItem = { key: $key2, value: $dict1[$key2] };
            request.setRequestHeader(headerItem.key, headerItem.value.toString());
        }
    }
    request.send(request_data[3]);
}


FB.XdHttpRequestServer.createClass('FB.XdHttpRequestServer');
FB.XdHttpRequestServer._rootUrl = null;
FB.XdHttpRequestServer._allowedUrlFilter = null;
FB.XdHttpRequestServer._allowedUrls = null;

// ---- Do not remove this footer ----
// Generated using Script# v0.4.5.0 (http://projects.nikhilk.net)
// -----------------------------------
// Facebook.js
// Copyright by Facebook Inc.


Type.createNamespace('FB');

////////////////////////////////////////////////////////////////////////////////
// FB.ApiErrorResult

FB.$create_ApiErrorResult = function FB_ApiErrorResult() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// FB.ApiErrorRequestArg

FB.$create_ApiErrorRequestArg = function FB_ApiErrorRequestArg() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// FB.ApiErrorCode

FB.ApiErrorCode = function() { };
FB.ApiErrorCode.prototype = {
    unknown: 1, 
    service_not_available: 2, 
    max_requests_reached: 4, 
    remote_address_not_allowed: 5, 
    invalid_parameter: 100, 
    invalid_api_key: 101, 
    invalid_session_key: 102, 
    invalid_call_id: 103, 
    invalid_signature: 104, 
    permission_denied: 200, 
    internal_error: 800, 
    invalid_operation: 801, 
    quota_exceeded: 802, 
    object_already_exists: 804, 
    temporary_Database_failure: 805
}
FB.ApiErrorCode.createEnum('FB.ApiErrorCode', false);


////////////////////////////////////////////////////////////////////////////////
// FB._stepInfo

FB.$create__stepInfo = function FB__stepInfo(jsonRequest, pendingResult) {
    var $o = { };
    $o.jsonRequest = jsonRequest;
    $o.result = pendingResult;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// FB.DataAssociation

FB.$create_DataAssociation = function FB_DataAssociation(name, id1, id2) {
    var $o = { };
    $o.name = name;
    $o.id1 = id1;
    $o.id2 = id2;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// FB.DataAssociationInfo

FB.$create_DataAssociationInfo = function FB_DataAssociationInfo(alias, object_type, unique) {
    var $o = { };
    $o.alias = alias;
    if ($o.object_type) {
        $o.object_type = object_type;
    }
    $o.unique = unique;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// FB.DataAssociationType

FB.DataAssociationType = function() { };
FB.DataAssociationType.prototype = {
    oneWay: 1, 
    twoWaySymmetric: 2, 
    twoWayAsymmetric: 3
}
FB.DataAssociationType.createEnum('FB.DataAssociationType', false);


////////////////////////////////////////////////////////////////////////////////
// FB.DataPropertyType

FB.DataPropertyType = function() { };
FB.DataPropertyType.prototype = {
    integer: 1, 
    string: 2, 
    textBlob: 2
}
FB.DataPropertyType.createEnum('FB.DataPropertyType', false);


////////////////////////////////////////////////////////////////////////////////
// FB.ApiClientBase

FB.ApiClientBase = function FB_ApiClientBase(apiKey, xd_receiver_url, serverAddress) {
    FB.XdComm.Server.singleton.set_receiverUrl(xd_receiver_url);
    this.apiKey = apiKey;
    var server_root = FBIntern._utility.getFacebookUrl('api');
    if (!String.isNullOrEmpty(serverAddress)) {
        this.serverAddress = serverAddress;
    }
    else {
        this.serverAddress = server_root + '/restserver.php';
    }
    var xdClientServerUrl = server_root + '/static/client_restserver.htm';
    var xdClientServerReceiverUrl = server_root + '/static/xd_receiver.htm';
    this.xdHttpClient = new FB.XdHttpRequestClient(xdClientServerUrl, xdClientServerReceiverUrl, 'fb_api_server');
}
FB.ApiClientBase.prototype = {
    
    get_apiKey: function () {
        return this.apiKey;
    },
    
    get_session: function () {
        return this.session;
    },
    
    _convertDictkeysToList: function (dictionary) {
        var keyList = [];
        var $dict1 = dictionary;
        for (var $key2 in $dict1) {
            var entry = { key: $key2, value: $dict1[$key2] };
            keyList.add(entry.key);
        }
        return keyList;
    },
    
    generateSignature: function (parameters) {
        var signatureBuilder = new StringBuilder();
        var keyList = this._convertDictkeysToList(parameters);
        keyList.sort();
        var $enum1 = keyList.getEnumerator();
        while ($enum1.moveNext()) {
            var key = $enum1.get_current();
            signatureBuilder.append(key + '=' + parameters[key]);
        }
        signatureBuilder.append(this.secret);
        var hashString = FBIntern.Md5.computeHashToString(signatureBuilder.toString().trim());
        return hashString;
    },
    
    apiKey: null,
    secret: null,
    session: null,
    serverAddress: null,
    lastCallId: 0,
    xdHttpClient: null
}


////////////////////////////////////////////////////////////////////////////////
// FB.ApiClient

FB.ApiClient = function FB_ApiClient(apiKey, xd_receiver_url, serverAddress) {
    FB.ApiClient.constructBase(this, [ apiKey, xd_receiver_url, serverAddress ]);
}
FB.ApiClient.prototype = {
    
    requireLogin: function (callback) {
        if (!this._verifyLogin$1(callback, document.URL)) {
            window.navigate(this._createLoginUrl$1());
        }
    },
    
    _createLoginUrl$1: function () {
        return FBIntern._utility.getFacebookUrl('www') + '/login.php?return_session=1&api_key=' + this.apiKey + '&v=' + FB.ApiClientBase.version;
    },
    
    _verifyLogin$1: function (callback, url) {
        var sessionTokenString = 'session';
        var documentUri = new FB.Uri(url);
        if (Object.keyExists(documentUri.get_queryParameters(), sessionTokenString)) {
            var sessionToken = documentUri.get_queryParameters()[sessionTokenString];
            this.session = FB.JSON.deserialize(sessionToken);
            this.secret = this.session.secret;
            if (callback) {
                callback.invoke(null);
            }
            return true;
        }
        else {
            return false;
        }
    },
    
    events_get: function (uid, eids, startTime, endTime, rsvpStatus, sequencer) {
        var parameters = {};
        if (uid) {
            parameters['uid'] = uid;
        }
        if (eids) {
            parameters['eids'] = eids;
        }
        parameters['start_time'] = startTime;
        parameters['end_time'] = endTime;
        if (rsvpStatus) {
            parameters['rsvp_status'] = rsvpStatus;
        }
        return this._callMethod$1('events.get', parameters, sequencer);
    },
    
    events_getMembers: function (eid, sequencer) {
        var parameters = {};
        parameters['eid'] = eid;
        return this._callMethod$1('events.getMembers', parameters, sequencer);
    },
    
    fbml_refreshImgSrc: function (url, sequencer) {
        var parameters = {};
        parameters['url'] = url;
        return this._callMethod$1('fbml.refreshImgSrc', parameters, sequencer);
    },
    
    fbml_refreshRefUrl: function (url, sequencer) {
        var parameters = {};
        parameters['url'] = url;
        return this._callMethod$1('fbml.refreshRefUrl', parameters, sequencer);
    },
    
    fbml_setRefHandle: function (handle, fbml, sequencer) {
        var parameters = {};
        parameters['handle'] = handle;
        parameters['fbml'] = fbml;
        return this._callMethod$1('fbml.setRefHandle', parameters, sequencer);
    },
    
    feed_publishStoryToUser: function (title, body, image_1, image_1_link, image_2, image_2_link, image_3, image_3_link, image_4, image_4_link, priority, sequencer) {
        var parameters = {};
        if (body) {
            parameters['body'] = body;
        }
        if (image_1) {
            parameters['image_1'] = image_1;
        }
        if (image_1_link) {
            parameters['image_1_link'] = image_1_link;
        }
        if (image_2) {
            parameters['image_2'] = image_2;
        }
        if (image_2_link) {
            parameters['image_2_link'] = image_2_link;
        }
        if (image_3) {
            parameters['image_3'] = image_3;
        }
        if (image_3_link) {
            parameters['image_3_link'] = image_3_link;
        }
        if (image_4) {
            parameters['image_4'] = image_4;
        }
        if (image_4_link) {
            parameters['image_4_link'] = image_4_link;
        }
        if (priority) {
            parameters['priority'] = priority;
        }
        return this._callMethod$1('feed.publishStoryToUser', parameters, sequencer);
    },
    
    feed_publishActionOfUser: function (title, body, image_1, image_1_link, image_2, image_2_link, image_3, image_3_link, image_4, image_4_link, sequencer) {
        var parameters = {};
        if (body) {
            parameters['body'] = body;
        }
        if (image_1) {
            parameters['image_1'] = image_1;
        }
        if (image_1_link) {
            parameters['image_1_link'] = image_1_link;
        }
        if (image_2) {
            parameters['image_2'] = image_2;
        }
        if (image_2_link) {
            parameters['image_2_link'] = image_2_link;
        }
        if (image_3) {
            parameters['image_3'] = image_3;
        }
        if (image_3_link) {
            parameters['image_3_link'] = image_3_link;
        }
        if (image_4) {
            parameters['image_4'] = image_4;
        }
        if (image_4_link) {
            parameters['image_4_link'] = image_4_link;
        }
        return this._callMethod$1('feed.publishActionOfUser', parameters, sequencer);
    },
    
    feed_publishTemplatizedAction: function (title_template, title_data, body_template, body_data, body_general, page_actor_id, image_1, image_1_link, image_2, image_2_link, image_3, image_3_link, image_4, image_4_link, target_ids, sequencer) {
        var parameters = {};
        parameters['title_template'] = title_template;
        if (page_actor_id) {
            parameters['page_actor_id'] = page_actor_id;
        }
        if (title_data) {
            parameters['title_data'] = title_data;
        }
        if (body_template) {
            parameters['body_template'] = body_template;
        }
        if (body_data) {
            parameters['body_data'] = body_data;
        }
        if (body_general) {
            parameters['body_general'] = body_general;
        }
        if (image_1) {
            parameters['image_1'] = image_1;
        }
        if (image_1_link) {
            parameters['image_1_link'] = image_1_link;
        }
        if (image_2) {
            parameters['image_2'] = image_2;
        }
        if (image_2_link) {
            parameters['image_2_link'] = image_2_link;
        }
        if (image_3) {
            parameters['image_3'] = image_3;
        }
        if (image_3_link) {
            parameters['image_3_link'] = image_3_link;
        }
        if (image_4) {
            parameters['image_4'] = image_4;
        }
        if (image_4_link) {
            parameters['image_4_link'] = image_4_link;
        }
        if (target_ids) {
            parameters['target_ids'] = target_ids;
        }
        return this._callMethod$1('feed.publishTemplatizedAction', parameters, sequencer);
    },
    
    friends_get: function (sequencer) {
        return this._callMethod$1('friends.get', null, sequencer);
    },
    
    friends_areFriends: function (uids1, uids2, sequencer) {
        var parameters = {};
        parameters['uids1'] = uids1.toString();
        parameters['uids2'] = uids2.toString();
        return this._callMethod$1('friends.areFriends', parameters, sequencer);
    },
    
    friends_getAppUsers: function (sequencer) {
        return this._callMethod$1('friends.getAppUsers', null, sequencer);
    },
    
    friends_getLists: function (sequencer) {
        return this._callMethod$1('friends.getLists', null, sequencer);
    },
    
    groups_get: function (uid, gids, sequencer) {
        var parameters = {};
        parameters['uid'] = uid;
        parameters['gids'] = gids.toString();
        return this._callMethod$1('groups.get', parameters, sequencer);
    },
    
    groups_getMembers: function (gid, sequencer) {
        var parameters = {};
        parameters['gid'] = gid;
        return this._callMethod$1('groups.getMembers', parameters, sequencer);
    },
    
    marketplace_createListing: function (listing_id, show_on_profile, listing_attrs, sequencer) {
        var parameters = {};
        parameters['listing_id'] = listing_id;
        parameters['show_on_profile'] = show_on_profile;
        parameters['listing_attrs'] = listing_attrs;
        return this._callMethod$1('marketplace.createListing', parameters, sequencer);
    },
    
    marketplace_getCategories: function (sequencer) {
        var parameters = {};
        return this._callMethod$1('marketplace.getCategories', parameters, sequencer);
    },
    
    marketplace_getListings: function (listing_ids, uids, sequencer) {
        var parameters = {};
        parameters['listing_ids'] = listing_ids.toString();
        parameters['uids'] = uids.toString();
        return this._callMethod$1('marketplace.getListings', parameters, sequencer);
    },
    
    marketplace_getSubCategories: function (category, sequencer) {
        var parameters = {};
        parameters['category'] = category;
        return this._callMethod$1('marketplace.getSubCategories', parameters, sequencer);
    },
    
    marketplace_RemoveListing: function (listing_id, status, sequencer) {
        var parameters = {};
        parameters['listing_id'] = listing_id;
        parameters['status'] = status;
        return this._callMethod$1('marketplace.removeListing', parameters, sequencer);
    },
    
    marketplace_Search: function (category, subcategory, query, sequencer) {
        var parameters = {};
        parameters['category'] = category;
        parameters['subcategory'] = subcategory;
        parameters['query'] = query;
        return this._callMethod$1('marketplace.search', parameters, sequencer);
    },
    
    notifications_get: function (sequencer) {
        var parameters = {};
        return this._callMethod$1('notifications.get', parameters, sequencer);
    },
    
    notifications_send: function (to_ids, notification, sequencer) {
        var parameters = {};
        parameters['to_ids'] = to_ids.toString();
        parameters['notification'] = notification;
        return this._callMethod$1('notifications.send', parameters, sequencer);
    },
    
    notifications_sendEmail: function (recipients, subject, text, fbml, sequencer) {
        var parameters = {};
        parameters['recipients '] = recipients.toString();
        parameters['subject'] = subject;
        if (text) {
            parameters['text'] = text;
        }
        if (fbml) {
            parameters['fbml'] = fbml;
        }
        return this._callMethod$1('notifications.sendEmail', parameters, sequencer);
    },
    
    pages_getInfo: function (fields, page_ids, uid, sequencer) {
        var parameters = {};
        parameters['fields'] = fields.toString();
        parameters['page_ids'] = page_ids.toString();
        parameters['uid'] = uid;
        return this._callMethod$1('pages.getInfo', parameters, sequencer);
    },
    
    pages_isAdmin: function (page_id, sequencer) {
        var parameters = {};
        parameters['page_id'] = page_id;
        return this._callMethod$1('pages.isAdmin', parameters, sequencer);
    },
    
    pages_isAppAdded: function (page_id, sequencer) {
        var parameters = {};
        parameters['page_id'] = page_id;
        return this._callMethod$1('pages.isAppAdded', parameters, sequencer);
    },
    
    pages_isFan: function (page_id, uid, sequencer) {
        var parameters = {};
        parameters['page_id'] = page_id;
        parameters['uid'] = uid;
        return this._callMethod$1('pages.isFan', parameters, sequencer);
    },
    
    photos_addTag: function (pid, tag_uid, tag_text, x, y, tags, sequencer) {
        var parameters = {};
        parameters['pid'] = pid;
        parameters['tag_uid'] = tag_uid;
        parameters['tag_text'] = tag_text;
        parameters['x'] = x;
        parameters['y'] = y;
        parameters['tags'] = tags;
        return this._callMethod$1('photos.addTag', parameters, sequencer);
    },
    
    photos_createAlbum: function (name, location, description, sequencer) {
        var parameters = {};
        parameters['name'] = name;
        parameters['location'] = location;
        parameters['description'] = description;
        return this._callMethod$1('photos.createAlbum', parameters, sequencer);
    },
    
    photos_get: function (subj_id, aid, pids, sequencer) {
        var parameters = {};
        if (subj_id) {
            parameters['subj_id'] = subj_id;
        }
        if (aid) {
            parameters['aid'] = aid;
        }
        if (pids) {
            parameters['pids'] = pids.toString();
        }
        return this._callMethod$1('photos.get', parameters, sequencer);
    },
    
    photos_getAlbums: function (uid, aids, sequencer) {
        var parameters = {};
        if (uid) {
            parameters['uid'] = uid;
        }
        if (aids) {
            parameters['aids'] = aids.toString();
        }
        return this._callMethod$1('photos.getAlbums ', parameters, sequencer);
    },
    
    photos_getTags: function (pids, sequencer) {
        var parameters = {};
        parameters['pids'] = pids.toString();
        return this._callMethod$1('photos.getTags ', parameters, sequencer);
    },
    
    users_getInfo: function (uids, fields, sequencer) {
        var parameters = {};
        parameters['uids'] = uids.toString();
        parameters['fields'] = fields.toString();
        return this._callMethod$1('users.getInfo', parameters, sequencer);
    },
    
    users_getLoggedInUser: function (sequencer) {
        var parameters = {};
        return this._callMethod$1('users.getLoggedInUser', parameters, sequencer);
    },
    
    users_hasAppPermission: function (ext_perm, sequencer) {
        var parameters = {};
        parameters['ext_perm'] = ext_perm;
        return this._callMethod$1('users.hasAppPermission', parameters, sequencer);
    },
    
    users_isAppAdded: function (sequencer) {
        var parameters = {};
        return this._callMethod$1('users.isAppAdded', parameters, sequencer);
    },
    
    users_setStatus: function (status, clear, status_includes_verb, sequencer) {
        var parameters = {};
        parameters['status'] = status;
        parameters['clear'] = clear;
        parameters['status_includes_verb'] = status_includes_verb;
        return this._callMethod$1('users.setStatus', parameters, sequencer);
    },
    
    fql_query: function (query, sequencer) {
        var parameters = {};
        parameters['query'] = query;
        return this._callMethod$1('fql.query', parameters, sequencer);
    },
    
    profile_setFBML: function (uid, profile, profile_action, mobile_profile, sequencer) {
        var parameters = {};
        if (uid) {
            parameters['uid'] = uid;
        }
        parameters['profile'] = profile;
        parameters['profile_action'] = profile_action;
        parameters['mobile_profile'] = mobile_profile;
        return this._callMethod$1('profile.setFBML', parameters, sequencer);
    },
    
    profile_getFBML: function (uid, sequencer) {
        var parameters = {};
        parameters['uid'] = uid;
        return this._callMethod$1('profile.getFBML', parameters, sequencer);
    },
    
    data_createObjectType: function (name, sequencer) {
        var parameters = {};
        parameters['name'] = name;
        return this._callMethod$1('data.createObjectType', parameters, sequencer);
    },
    
    data_dropObjectType: function (obj_type, sequencer) {
        var parameters = {};
        parameters['obj_type'] = obj_type;
        return this._callMethod$1('data.dropObjectType', parameters, sequencer);
    },
    
    data_defineObjectProperty: function (obj_type, prop_name, prop_type, sequencer) {
        var parameters = {};
        parameters['obj_type'] = obj_type;
        parameters['prop_name'] = prop_name;
        parameters['prop_type'] = prop_type;
        return this._callMethod$1('data.defineObjectProperty', parameters, sequencer);
    },
    
    data_getObjectTypes: function (sequencer) {
        return this._callMethod$1('data.getObjectTypes', null, sequencer);
    },
    
    data_createObject: function (obj_type, properties, sequencer) {
        var parameters = {};
        parameters['obj_type'] = obj_type;
        parameters['properties'] = properties;
        return this._callMethod$1('data.createObject', parameters, sequencer);
    },
    
    data_getObject: function (obj_id, properties, sequencer) {
        var parameters = {};
        parameters['obj_id'] = obj_id;
        parameters['properties'] = properties;
        return this._callMethod$1('data.getObject', parameters, sequencer);
    },
    
    data_getObjects: function (obj_ids, prop_names, sequencer) {
        var parameters = {};
        parameters['obj_ids'] = obj_ids;
        if (prop_names) {
            parameters['prop_names'] = prop_names;
        }
        return this._callMethod$1('data.getObjects', parameters, sequencer);
    },
    
    data_defineAssociation: function (name, assoc_type, assoc_info1, assoc_info2, inverse, sequencer) {
        var parameters = {};
        parameters['name'] = name;
        parameters['assoc_type'] = assoc_type;
        parameters['assoc_info1'] = assoc_info1;
        parameters['assoc_info2'] = assoc_info2;
        if (inverse) {
            parameters['inverse'] = inverse;
        }
        return this._callMethod$1('data.defineAssociation', parameters, sequencer);
    },
    
    data_getAssociationDefinitions: function (sequencer) {
        return this._callMethod$1('data.getAssociationDefinitions', null, sequencer);
    },
    
    data_undefineAssociation: function (name, sequencer) {
        var parameters = {};
        parameters['name'] = name;
        return this._callMethod$1('data.undefineAssociation', parameters, sequencer);
    },
    
    data_setAssociation: function (name, obj_id1, obj_id2, data, assoc_time, sequencer) {
        var parameters = {};
        parameters['name'] = name;
        parameters['obj_id1'] = obj_id1;
        parameters['obj_id2'] = obj_id2;
        if (data) {
            parameters['data'] = data;
        }
        parameters['assoc_time'] = assoc_time;
        return this._callMethod$1('data.setAssociation', parameters, sequencer);
    },
    
    data_getAssociatedObjects: function (name, obj_id, no_data, sequencer) {
        var parameters = {};
        parameters['name'] = name;
        parameters['obj_id'] = obj_id;
        parameters['no_data'] = no_data;
        return this._callMethod$1('data.getAssociatedObjects', parameters, sequencer);
    },
    
    _callMethod$1: function (method, parameters, executeUnit) {
        var jsonRequest = this._generateJsonRequest(method, parameters);
        if (typeof(executeUnit) !== 'function') {
            var pendingResult = new FB.PendingResult();
            executeUnit._api = this;
            executeUnit._addStep(jsonRequest, pendingResult);
            return pendingResult;
        }
        else {
            var callback = (executeUnit);
            jsonRequest.callback = Delegate.create(this, function(result, exception) {
                var apiError = result;
                if (!exception && !isUndefined(apiError.error_code)) {
                    FB.FBDebug.assert(false, 'API error');
                    exception = Error.create(apiError.error_msg, apiError);
                    result = null;
                }
                callback.invoke(result, exception);
            });
            jsonRequest.sendRequest();
            return null;
        }
    },
    
    _generateJsonRequest: function (method, parameters) {
        if (!parameters) {
            parameters = {};
        }
        var $dict1 = parameters;
        for (var $key2 in $dict1) {
            var entry = { key: $key2, value: $dict1[$key2] };
            var scriptType = typeof(entry.value);
            if (scriptType === 'boolean') {
                parameters[entry.key] = (parameters[entry.key]) ? 1 : 0;
            }
            else if (scriptType === 'object') {
                parameters[entry.key] = FB.JSON.serialize(entry.value);
            }
        }
        parameters['method'] = method;
        if (this.session) {
            parameters['session_key'] = this.session.session_key;
        }
        parameters['api_key'] = this.apiKey;
        parameters['format'] = 'JSON';
        var callId = Date.get_now().getMilliseconds();
        if (callId === this.lastCallId) {
            callId = this.lastCallId + 1;
        }
        this.lastCallId = callId;
        parameters['call_id'] = callId;
        if (!parameters['v']) {
            parameters['v'] = FB.ApiClientBase.version;
        }
        parameters['ss'] = 1;
        parameters['sig'] = this.generateSignature(parameters);
        var queryBuilder = new StringBuilder();
        var $dict3 = parameters;
        for (var $key4 in $dict3) {
            var entry = { key: $key4, value: $dict3[$key4] };
            if (!queryBuilder.get_isEmpty()) {
                queryBuilder.append('&');
            }
            queryBuilder.append(entry.key + '=' + escape(entry.value.toString()));
        }
        var requestUrl = this.serverAddress;
        requestUrl += ('?method=' + parameters['method']);
        var requestBody = queryBuilder.toString();
        var headers = {};
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        var jsonRequest = new FB.XdJsonRequest(this.xdHttpClient, 'POST', requestUrl, requestBody, headers);
        return jsonRequest;
    }
}


////////////////////////////////////////////////////////////////////////////////
// FB.XdHttpRequestClient

FB.XdHttpRequestClient = function FB_XdHttpRequestClient(requestServerUrl, receiverUrl, server_iframe_name) {
    var divDom = document.createElement('div');
    divDom.style.visibility = 'hidden';
    divDom = document.body.appendChild(divDom);
    var iframe_markup = '<iframe name=\"' + server_iframe_name + '\" src=\"' + requestServerUrl + '\" style=\"color:Yellow; width:500px;height:300px;\"></iframe>';
    divDom.innerHTML = iframe_markup;
    this._receiverUrl = receiverUrl;
    this._serverIframeName = server_iframe_name;
}
FB.XdHttpRequestClient._ensure_listener_started = function FB_XdHttpRequestClient$_ensure_listener_started() {
    if (!FB.XdHttpRequestClient._handlerRegistered) {
        FB.XdComm.Server.singleton.registerDataHandler('http_client', Delegate.create(null, FB.XdHttpRequestClient._on_data_received));
        FB.XdHttpRequestClient._handlerRegistered = true;
    }
}
FB.XdHttpRequestClient._on_data_received = function FB_XdHttpRequestClient$_on_data_received(sender_receiver_url, sender_iframe_name, data) {
    var result = data;
    var callback = FB.XdHttpRequestClient._requestQueue[result.id];
    callback.invoke(result);
}
FB.XdHttpRequestClient.prototype = {
    
    send: function (method, url, requestBody, extraHeaders, callback) {
        var uri = new FB.Uri(url);
        var rootedUrl = uri.get_pathAndQuery();
        FB.XdHttpRequestClient._ensure_listener_started();
        var request_id = FB.XdHttpRequestClient._idCount++;
        var request_data = [ request_id, method, rootedUrl, requestBody, extraHeaders ];
        FB.XdHttpRequestClient._requestQueue[request_id.toString()] = callback;
        FB.XdComm.Server.singleton.send(this._receiverUrl, this._serverIframeName, 'http_server', request_data, null);
    },
    
    _receiverUrl: null,
    _serverIframeName: null
}


////////////////////////////////////////////////////////////////////////////////
// FB.PendingResult

FB.PendingResult = function FB_PendingResult() {
}
FB.PendingResult.prototype = {
    result: null,
    exception: null
}


////////////////////////////////////////////////////////////////////////////////
// FB.SequencerBase

FB.SequencerBase = function FB_SequencerBase() {
}
FB.SequencerBase.prototype = {
    completedCallback: null,
    maxTries: 3,
    isParallel: true,
    _api: null
}


////////////////////////////////////////////////////////////////////////////////
// FB.BatchSequencer

FB.BatchSequencer = function FB_BatchSequencer() {
    this.stepsList = [];
    FB.BatchSequencer.constructBase(this);
}
FB.BatchSequencer.prototype = {
    
    execute: function (completedCallback) {
        this.completedCallback = completedCallback;
        var stepsCount = this.stepsList.length;
        if (stepsCount > 1) {
            var parameters = {};
            var methodFeed = [];
            var $enum1 = this.stepsList.getEnumerator();
            while ($enum1.moveNext()) {
                var stepInfo = $enum1.get_current();
                methodFeed.add(stepInfo.jsonRequest._requestBody);
            }
            parameters['method_feed'] = methodFeed;
            parameters['serial_only'] = !this.isParallel;
            var batchRequest = this._api._generateJsonRequest('batch.run', parameters);
            batchRequest.callback = Delegate.create(this, function(result, exception) {
                var apiError = result;
                if (!exception && !isUndefined(apiError.error_code)) {
                    exception = Error.create(apiError.error_msg, apiError);
                    FB.FBDebug.assert(false, 'API error');
                    result = null;
                }
                this._setStepResults$1(result, exception);
                this.onAllCompleted();
            });
            batchRequest.sendRequest();
        }
        else if (stepsCount === 1) {
            var stepInfo = this.stepsList[0];
            stepInfo.jsonRequest.callback = Delegate.create(this, function(result, exception) {
                this._setPendingResult$1(stepInfo.result, result, exception);
                this.onAllCompleted();
            });
            stepInfo.jsonRequest.sendRequest();
        }
        else {
            this.onAllCompleted();
        }
    },
    
    _setPendingResult$1: function (pendingResult, result, exception) {
        var apiError = result;
        if (!exception && !isUndefined(apiError.error_code)) {
            exception = Error.create(apiError.error_msg, apiError);
            FB.FBDebug.assert(false, 'API error');
            result = null;
        }
        pendingResult.result = result;
        pendingResult.exception = exception;
    },
    
    _setStepResults$1: function (batchResult, exception) {
        var batchResultList = batchResult;
        FB.FBDebug.assert(!batchResultList || batchResultList.length === this.stepsList.length, '');
        var stepsCount = this.stepsList.length;
        for (var i = 0; i < stepsCount; i++) {
            var pendingResult = (this.stepsList[i]).result;
            if (exception) {
                pendingResult.exception = exception;
                pendingResult.result = null;
            }
            else if (batchResultList) {
                var individualResultString = batchResultList[i];
                var individualResult = FB.JSON.deserialize(individualResultString);
                this._setPendingResult$1(pendingResult, individualResult, null);
            }
        }
    },
    
    onAllCompleted: function () {
        this.stepsList.clear();
        if (this.completedCallback) {
            var callback = this.completedCallback;
            this.completedCallback = null;
            callback.invoke();
        }
    },
    
    _addStep: function (jsonRequest, pendingResult) {
        var stepInfo = FB.$create__stepInfo(jsonRequest, pendingResult);
        this.stepsList.add(stepInfo);
    }
}


////////////////////////////////////////////////////////////////////////////////
// FB.ImmediateSequencer

FB.ImmediateSequencer = function FB_ImmediateSequencer(callback) {
    FB.ImmediateSequencer.constructBase(this);
    this.isParallel = false;
    this._callback$2 = callback;
}
FB.ImmediateSequencer.prototype = {
    
    _addStep: function (jsonRequest, pendingResult) {
        this.pendingResult = pendingResult;
        FB.ImmediateSequencer.callBase(this, '_addStep', [ jsonRequest, pendingResult ]);
        this.execute(null);
    },
    
    onAllCompleted: function () {
        this.stepsList.clear();
        if (this._callback$2) {
            this._callback$2.invoke(this.pendingResult.result, this.pendingResult.exception);
        }
    },
    
    pendingResult: null,
    _callback$2: null
}


////////////////////////////////////////////////////////////////////////////////
// FB.XdJsonRequest

FB.XdJsonRequest = function FB_XdJsonRequest(xdHttpClient, method, url, requestBody, extraHeaders) {
    this._method = method;
    this._url = url;
    this._requestBody = requestBody;
    this._extraHeaders = extraHeaders;
    this._xdHttpClient = xdHttpClient;
}
FB.XdJsonRequest.prototype = {
    
    sendRequest: function () {
        this._xdHttpClient.send(this._method, this._url, this._requestBody, this._extraHeaders, Delegate.create(this, function(xd_result) {
            if (xd_result.status < 400) {
                var responseText = xd_result.responseText;
                var result;
                try {
                    result = FB.JSON.deserialize(responseText);
                }
                catch (exception) {
                    var jsonException = Error.create('Json exception', responseText, exception);
                    this.callback.invoke(null, exception);
                    return;
                }
                this.callback.invoke(result, null);
            }
            else {
                var exception = new Error(String.format('HTTP request failure status code=\'{0}\', text=\'{1}\'', xd_result.status, xd_result.statusText));
                this.callback.invoke(null, exception);
            }
        }));
    },
    
    callback: null,
    _method: null,
    _url: null,
    _requestBody: null,
    _extraHeaders: null,
    _xdHttpClient: null
}


Type.createNamespace('FBIntern');

////////////////////////////////////////////////////////////////////////////////
// FBIntern._utility

FBIntern._utility = function FBIntern__utility() {
}
FBIntern._utility.getFacebookUrl = function FBIntern__utility$getFacebookUrl(subDomain) {
    var url;
    if (subDomain === 'api') {
        url = 'http://api.facebook.com';
    }
    else {
        var host = document.domain;
        var regularExpression = new RegExp('/([\\d\\w\\-]+)\\\\.facebook\\\\.com(:[0-9]+)?$/i');
        var results = regularExpression.exec(host);
        if (results) {
            var correct_map = results[0];
            var host_extra = results[1];
            url = 'http://' + subDomain + '.' + correct_map + '.facebook.com' + host_extra;
        }
        else {
            url = 'http://' + subDomain + '.facebook.com';
        }
    }
    return url;
}


FB.ApiClientBase.createClass('FB.ApiClientBase');
FB.ApiClient.createClass('FB.ApiClient', FB.ApiClientBase);
FB.XdHttpRequestClient.createClass('FB.XdHttpRequestClient');
FB.PendingResult.createClass('FB.PendingResult');
FB.SequencerBase.createClass('FB.SequencerBase');
FB.BatchSequencer.createClass('FB.BatchSequencer', FB.SequencerBase);
FB.ImmediateSequencer.createClass('FB.ImmediateSequencer', FB.BatchSequencer);
FB.XdJsonRequest.createClass('FB.XdJsonRequest');
FBIntern._utility.createClass('FBIntern._utility');
FB.ApiClientBase.version = '1.0';
FB.XdHttpRequestClient._requestQueue = {};
FB.XdHttpRequestClient._handlerRegistered = false;
FB.XdHttpRequestClient._idCount = 0;

// ---- Do not remove this footer ----
// Generated using Script# v0.4.5.0 (http://projects.nikhilk.net)
// -----------------------------------

// @option preserve-whitespace
