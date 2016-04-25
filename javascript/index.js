/**
 * Created by w on 2016/1/7.
 */
pageInit();
window.onresize = function(){
    console.log(1);
    canvasInit();
};
function pageInit(){
    canvasInit();
}

var cav;
function canvasInit(){
    cav = document.getElementById("main");
    cav.height = document.documentElement.clientHeight;
    cav.width = document.documentElement.clientWidth;
}
