
import utils from './utils/index';

import './node';
import './edge';
import './behavior';

/*if( Math.random()*10 > 5){
    utils.backGroundDraw();
}*/

const graph = new G6.Graph({
    container: 'root',
    width: document.body.clientWidth,
    fitViewPadding: 1000,
    height: document.body.clientHeight - 10,
    groupType: 'rect',
    animate: true,
    groupStyle: {
        default: {
            fill: '#f3f5f6',
            // fill:'red',
            stroke: "#cfd4d9",
            fillOpacity: 0.4,
            strokeOpacity:0.8,
            opacity: 0.8
        },
    },
    defaultNode: {
        // shape: 'circle',
        // style: {
        //     // fill: 'white',
        //     // stroke: 'blue'
        // }
    },
    defaultEdge: {
        color: '#72CC4A',
        shape: "line",
        style: {
            lineDash: [3, 5],
            lineWidth: 1
        }
    },
    // 节点不同状态下的样式
    nodeStateStyles: {
        // hover: {
        //     fill: 'yellow',
        // },
        // // 鼠标点击节点，即 click 状态为 true 时的样式
        // click: {
        //     stroke: 'red',
        //     lineWidth: 3
        // }
    },
    // 边不同状态下的样式
    edgeStateStyles: {
        // 鼠标点击边，即 click 状态为 true 时的样式
        // hover: {
        //     stroke: 'red'
        // }
    },
    modes: {
        default: [
            'nike-node-click', 'node-hover', 'edge-hover','anchor-drag', 'drag-canvas',
            'drag-group',
            // 'drag-node-with-group'
        ]
    }
});

let db1 = [{
    name: "name(姓名)左对齐",
}, {
    name: "name(姓名)左对齐",
}, {
    name: "name(姓名)左对齐",
}, {
    name: "name(姓名)左对齐",
}, {
    name: "name(姓名)左对齐",
}, {
    name: "name(姓名)左对齐",
}, {
    name: "name(姓名)左对齐",
}];

let db2 = [{
    name: "db2",
}, {
    name: "db2",
}, {
    name: "db2",
}, {
    name: "db2",
}];

let db3 = [{
    name: "足球篮球排球",
}, {
    name: "足球篮球排球",
}, {
    name: "足球篮球排球",
}, {
    name: "足球篮球排球",
}];

/*let node1 = utils.createGraphData(db1, 'db1', 200);
let node2 = utils.createGraphDataByDrag({
    data: db2,
    tableName: 'db2',
    xAxis: 300,
    yAxis: 300
})
let node3 = utils.createGraphData(db3, 'db3', 550);

let nodes = node1.concat(node3).concat(node2);
window.onload = function () {
    graph.data({
        nodes: nodes,
    });
    graph.render();
}*/


window.onload = function () {
    let item = null;
    let nodes = [];
    let itemcont = 0;
    let lis = document.getElementsByTagName('li');
    let canvas = document.getElementById('canvas_1');
    lis[0].addEventListener('mousedown',function(){
        console.log('mousedown');
        item = db1;
    })
    lis[1].addEventListener('mousedown',function(){
        console.log('mousedown');
        item = db3;
    })
    canvas.addEventListener('mouseup',function(){
        console.log('mouseup');
        if (item) {
            console.log(nodes.length,'length');
            let node = utils.createGraphData(item,'db'+nodes.length,(itemcont+1)*100);
            itemcont++;
            item = null;
            console.log(node,'node');
            nodes = nodes.concat(node);
            graph.data({
                nodes: nodes,
            });
            graph.render();
        }
    })

}