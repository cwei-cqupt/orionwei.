/*
 * author:@Abelw
 * date:2016-10-06 14:53
 * qq:673162780
 * email:vicenwe@163.com
 */
'use strict';
(function(that, fn) {
    if(that){
        fn(that);
    }
    else{
        fn(this);
    }
})(window?window:this, function(that) {
    Object.prototype.addListener = function(str, fn, boolean){
        if(isNaN(parseInt(this.length))) {
            if(this.addEventListener){
                this.addEventListener(str, fn, boolean||false);
            }else{
                this.attachEvent("on"+str,fn);
            }
        }else if(this.length > 0){
            this.forEach(function(that){
                if(this.addEventListener){
                    that.addEventListener(str, fn, boolean||false);
                }else{
                    that.attachEvent("on"+str, fn);
                }
            })
        }
        return this;
    };
    var Abel = function() {},
        flag = 0,
        isScroll = true,
        timer,
        loop = false;
    var init = function(obj) {
            boxInit(obj);
            bodyInit(obj);
        },
        bodyInit = function() {
            document.getElementsByTagName("body")[0].style.cssText = "overflow:hidden";
        },
        boxInit = function(obj) {
            if(typeof obj.obj === "string"){
                var o= selector(obj.obj);
                obj.obj = o.el;
                obj.objArr = o.arr;
            }
            else if(typeof obj.obj === "object"){
                var temp = [];
                for(var index in obj.obj){
                    temp = temp.concat(selector(index));
                }
                obj.objArr = temp;
            }
            setHeight(obj);
            document.addListener("mousewheel", function(e) {
                var event = e?e:window.event;
                if(event.deltaY === -100){
                    setFlag(obj,"reduce");
                }
                else if(event.deltaY === 100){
                    setFlag(obj,"add");
                }
            })
        },
        typeInit = function(obj) {
            switch(obj.type){
                case "loop":
                    loop = true;
                    init(obj);
                    break;
                case "fixedM":
                    init(obj);
                    fixedMenu(obj);
                    break;
                case "rightL":
                    init(obj);
                    rightLink(obj);
                    break;
                default:
                    init(obj);
                    break;
            }
            window.onresize = function(){
                window.location.href = window.location.href;
            };
        },
        fixedMenu = function(obj) {
            var ul = document.createElement("ul"),
                li,
                i = 0,
                len = obj.objArr.length;
            for(;i<len;i++){
                li = document.createElement("li");
                li.innerHTML = "第"+(i+1)+"屏";
                li.style.cssText = "cursor:pointer;list-style:none;display:inline-block;margin-right:10px;background:white;padding:5px;border:1px solid black;";
                ul.appendChild(li);
            }
            ul.style.cssText = "position:fixed;top:10px;left:10px";
            obj.obj.appendChild(ul);
            ul.addListener("click", function(e) {
                setFlag(obj,Array.prototype.indexOf.call(e.target.parentNode.childNodes, e.target));
            })
        },
        rightLink = function(obj) {
            var div = document.createElement("ul"),
                divs,
                i = 0,
                len = obj.objArr.length;
            for(;i<len;i++){
                divs = document.createElement("div");
                divs.style.cssText = "cursor:pointer;margin-bottom:10px;border-radius:50%;padding:5px;border:1px solid black;";
                div.appendChild(divs);
            }
            div.style.cssText = "position:fixed;top:50%;left:"+(document.body.clientWidth-20)+"px;padding-left:0;";
            div.children[0].className = 'active';
            obj.obj.appendChild(div);
            div.addListener("click", function(e) {
                var event = e?e:window.event;
                setFlag(obj,Array.prototype.indexOf.call(event.target.parentNode.childNodes, event.target), event, function(event, from) {
                    event.target.className = 'active';
                    event.target.parentNode.childNodes[from].className = "";
                });
            })
        },
        setHeight = function(obj) {
            var i = 0,
                len = obj.objArr.length;
            obj.obj.style.cssText += "position:absolute;height:"+len * document.body.clientHeight+"px;width:"+document.body.clientWidth+"px";
            for(;i < len;i++){
                obj.objArr[i].style.height = 1/len*100 + "%";
            }
        },
        selector = function(str){
            var first = str.slice(0,1),
                el = [];
            switch(first){
                case ".":
                    el = document.getElementsByClassName(str.slice(1,str.length))[0];
                    break;
                case "#":
                    el = document.getElementById(str.slice(1,str.length));
                    break;
                default:
                    el = document.getElementsByTagName(str)[0];
                    break;
            }
            return {
                el:el,
                arr:Array.prototype.slice.call(el.children, 0)
            }
        },
        setFlag = function(obj, to, event, fn) {
            var from = flag;
            if(isScroll){
                if(to === "add"){
                    if(flag < obj.objArr.length-1){
                        flag++;
                    }
                    else if(loop){
                        flag = 0;
                    }
                }
                else if(to === "reduce" && flag > 0){
                    flag--;
                }
                else if(typeof to === "number"){
                    flag = to;
                }
                if(!!fn){
                    fn(event, from);
                }
                if(flag != from){
                    isScroll = false;
                    scroll(obj, flag, from);
                }
            }
        },
        scroll = function(obj, flag, from) {
            animate({
                from:-from*document.body.clientHeight,
                to:-flag*document.body.clientHeight,
                target:"top",
                speed:obj.speed,
                obj:obj.obj,
                callback:obj.callback
            },obj);
        },
        animate = function(obj, abel) {
            clearTimeout(timer);
            function v(n) {
                obj.obj.style[obj.target] = n+"px";
                if(n === obj.to && obj.from!=obj.to){
                    clearTimeout(timer);
                    isScroll = true;
                    obj.callback.call(abel.objArr[flag]);
                }
                if(n > obj.to){
                    n -=Math.ceil((n-obj.to)/25);
                    timer = abelSetTimeout(function() {
                        v(n);
                    }, obj.speed);
                }
                else if(n < obj.to){
                    n -= Math.floor((n-obj.to)/25);
                    timer = abelSetTimeout(function() {
                        v(n);
                    }, obj.speed);
                }
            }
            v(obj.from);
        },
        abelSetTimeout = function(fn, speed) {
            var s;
            switch(speed){
                case "fast":
                    s = 5;
                    break;
                case "mid":
                    s = 10;
                    break;
                case "slow":
                    s = 20;
                    break;
            }
            return setTimeout(fn, s);
        },
        getCurrentStyle = function(obj, prop) {
            if (obj.currentStyle) {
                return obj.currentStyle[prop];
            }
            else if (window.getComputedStyle) {
                return document.defaultView.getComputedStyle (obj,null)[prop.replace (/([A-Z])/g, "-$1").toLowerCase ()];
            }
        },
        absoluteXY = function(obj) {
            for (var t = obj.offsetTop, l = obj.offsetLeft; obj = obj.offsetParent;) {
                t += Math.abs(obj.offsetTop);
                l += Math.abs(obj.offsetLeft);
            }
            return {
                left:l,
                top:t
            }
        };
    function O(obj) {
        var o = new Abel();
        o.obj = obj.obj;
        o.type = obj.type||"normal";
        o.callback = obj.callback||function() {};
        o.speed = obj.speed||"mid";
        typeInit(o);
        return o;
    }
    that.fullpage = O;
});