/**
 * Created by lenovo on 2016/3/21.
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city = document.getElementById("aqi-city-input").value;
    var air = document.getElementById("aqi-value-input").value;
    aqiData[city] = air;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    document.getElementById("aqi-table").children[0].innerHTML = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
    for (x in aqiData){
        var tr = document.createElement("tr");
        var tdC = document.createElement("td");
        var tdK = document.createElement("td");
        var td = document.createElement("td");
        var input = document.createElement("button");
        var nodeC = document.createTextNode(x);
        var nodeK = document.createTextNode(aqiData[x]);
        tdC.appendChild(nodeC);
        tdK.appendChild(nodeK);
        tr.appendChild(tdC);
        tr.appendChild(tdK);
        input.innerHTML = "删除";
        td.appendChild(input);
        tr.appendChild(td);
        document.getElementById("aqi-table").children[0].appendChild(tr);
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
    // do sth.
    console.log(1);
    renderAqiList();
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    document.getElementById("add-btn").onclick = function(){
        addBtnHandle();
    };
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    // var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    // var target = document.querySelector('button');
    // var domlistener = new MutationObserver(function(mutation){
    //     mutation.forEach(function(mutation){
    //         console.log(mutation);
    //     });
    // });
    // var config = {attribute:false,childList:true,characterData:false};
    //
    // domlistener.observe(document.getElementById("aqi-table").children[0],config);
    document.addEventListener('DOMNodeInserted',function(){});
}

init();