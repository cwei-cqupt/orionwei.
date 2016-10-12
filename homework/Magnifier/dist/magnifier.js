/*
 * author:@Abelw
 * date:2016-10-02 18:52
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
    var Abel = function() {};
    var init = function(obj) {
            wrapInit(obj);
            boxInit(obj);
        },
        boxInit = function(obj) {
            var divBig = document.createElement("div"),
                divSmall = document.createElement("div"),
                divSelect = document.createElement("div"),
                height = obj.obj.offsetHeight;
            divBig.style.cssText = "width:100%;height:"+(height - 70)+"px;border:1px solid black";
            divSmall.style.cssText = "width:100%;height:70px;border:1px solid #ccc";
            divSelect.style.cssText = "pointer-events:none;display:none;position:absolute;width:170px;height:170px;border:1px solid #ccc";
            divBig.appendChild(divSelect);
            obj.obj.appendChild(divBig);
            obj.obj.appendChild(divSmall);
            fillBox(divBig, obj.array, obj.wrap, divSelect, obj, divSmall);
        },
        wrapInit = function(obj) {
            var xy = absoluteXY(obj.obj),
                height = obj.obj.offsetHeight,
                width = obj.obj.offsetWidth;
            obj.wrap = document.createElement("div");
            obj.wrap.className = "abel_wrap";
            obj.wrap.style.cssText = "overflow:hidden;display:none;position:absolute;top:"+xy.top+"px;left:"+(xy.left+10+obj.obj.offsetWidth)+"px;width:"+width+"px;height:"+(height-70)+"px;border:1px solid black;";
            obj.obj.appendChild(obj.wrap);
        },
        fillBox =function(el, array, wrap, select, obj, small) {
            var div = document.createElement("div"),
                divS,
                imgS = [],
                i = 0,
                len = array.length;
            fillImg(array[obj.flag], el, wrap, select, obj, imgOnload);
            for(;i < len;i++){
                imgS[i] = new Image();
                imgS[i].src = array[i];
                imgS[i].onload = function() {
                    divS = document.createElement("div");
                    divS.style.cssText= "border:1px solid #ccc;margin-right:10px;display:inline-block;vertical-align:top;height:70px;width:70px";
                    var w = this.width,
                        h = this.height,
                        than = w/ h,
                        height = parseInt(divS.style.height),
                        width = parseInt(divS.style.width);
                    if(h >= w){
                        this.height = height-2;
                        this.style.marginLeft = (width-2 - this.height*than)/2+"px";
                    }
                    else{
                        this.width= width-2;
                        this.style.marginTop = (height - this.width/than)/2+"px";
                        console.log(w)
                    }
                    this.style.pointerEvents = "none";
                    divS.className = "div_small";
                    divS.appendChild(this);
                    small.appendChild(divS);
                };
            }
            small.addListener("click", function(e){
                var event = e? e : window.event;
                if(event.target.className === "div_small"){
                    el.children[1].remove();
                    fillImg(event.target.children[0].src, el, wrap, select, obj, imgOnload);
                }

            });
        },
        fillWrap = function(el, obj, route) {
            var img = new Image(),
                elHeight = parseInt(el.style.height),
                elWidth = parseInt(el.style.width);
            img.src = route;
            img.onload = function(){
                img.width = elWidth*obj.thanW;
                img.height = elHeight*obj.thanH;
                el.innerHTML = "";
                img.style.pointerEvents = "none";
                el.appendChild(img);
            };


        },
        fillImg = function(route, el, wrap, select, obj, onLoadFn) {
            var width = el.offsetWidth, height = el.offsetHeight;
            var img = new Image();
            img.src = route;
            img.onload = function(){
                onLoadFn(this, width, height, el, wrap, select, obj);
                fillWrap(obj.wrap, obj, route);
            }
        },
        imgOnload = function(that, width, height, el, wrap, select, obj) {
            var w = that.width,
                h = that.height,
                than = w/h;
            if(h >= w){
                that.height = height-2;
                that.style.marginLeft = (width-2 - that.height*than)/2+"px";
            }
            else{
                that.width= width-2;
                that.style.marginTop = (height - width/than)/2+"px";
            }
            el.appendChild(that);
            obj.thanH = that.height/170;
            obj.thanW = that.width/170;
            that.addListener("mouseover",function() {
                wrap.style.display = "block";
                select.style.display = "block";
            }).addListener("mouseout", function() {
                wrap.style.display = "none";
                select.style.display = "none";
            }).addListener("mousemove", function(e) {
                var event = e?e:window.event,
                    width = event.clientX,
                    height = event.clientY,
                    scrollX = window.scrollX || document.documentElement.scrollLeft,
                    scrollY = window.scrollY || document.documentElement.scrollTop,
                    left = width-parseInt(select.style.width)/2+parseInt(scrollX),
                    top = height-parseInt(select.style.height)/2+parseInt(scrollY),
                    xy = absoluteXY(that);
                if(left >= xy.left+that.width-170){
                    left = xy.left+that.width-170;
                }
                else if(left <= xy.left){
                    left = xy.left;
                }
                if(top >= xy.top+that.height-170){
                    top = xy.top+that.height-170;
                }
                else if(top <= xy.top){
                    top = xy.top;
                }
                var wrapTop = obj.thanH*(xy.top-top),
                    wrapLeft = obj.thanW*(xy.left - left);
                select.style.top = top+"px";
                select.style.left = left+"px";
                obj.wrap.children[0].style.marginTop = wrapTop+"px";
                obj.wrap.children[0].style.marginLeft = wrapLeft+"px";
            });
        },
        absoluteXY = function(obj) {
            for (var t = obj.offsetTop, l = obj.offsetLeft; obj = obj.offsetParent;) {
                t += obj.offsetTop;
                l += obj.offsetLeft;
            }
            return {
                left:l,
                top:t
            }
        }
        ;
    function O(obj, array) {
        var o = new Abel();
        o.obj = obj;
        o.array = array;
        o.flag = 0;
        init(o);
        return o;
    }
    that.magnifier = O;
});