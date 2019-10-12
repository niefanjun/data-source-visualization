
import utils from './utils/index';

import './node';
import './edge';
import './behavior';

if( Math.random()*10 > 5){
    utils.backGroundDraw();    
}

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

let node1 = utils.createGraphData(db1, 'db1', 200);
let node3 = utils.createGraphData(db3, 'db3', 550);

let nodes = node1.concat(node3);

window.onload = function () {
    graph.data({
        nodes: nodes,
        // edges:[{
        //     target:"db10",
        //     source:"db30",
        //     style:{
        //         lineDash:[]
        //     }
        // }]
    });
    graph.render();
}
