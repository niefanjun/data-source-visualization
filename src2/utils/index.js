import config from '../config/index';

export default {

    createGraphData2:function(data,tableName,xAxis,topBottom = 45){
        let fieldNode = data.map((item,index)=>{
            return {
                id:tableName + index,
                x: xAxis,
                y: xAxis + index * topBottom,
                shape: "rect",
                label: item.name + index,
                groupId:tableName,
            }
        });
        return fieldNode
    },
    
    createGraphData:function(data,tableName,xAxis,topBottom = 45){

        // addHeaderNode
        let nodes = [{
            id:tableName + '-header',
            x: xAxis,
            y: xAxis - 30,
            shape: "headNode",
            name: tableName,
            groupId:tableName,
        }];

        let fieldNode = data.map((item,index)=>{
            return {
                id:tableName + index,
                x: xAxis,
                y: xAxis + index * topBottom,
                shape: "thinkNode",
                // shape:'rect',
                // label:item.name + index,
                name: item.name + index,
                select:1,
                groupId:tableName,
            }
        });

        return nodes.concat(fieldNode);
    },
    
    getImage:function(url){
        return new Promise((resolve,reject)=>{
            let img = new Image();
            img.onload = function(){
                resolve(img);
            }
            img.src = url;
        })
    },

    backGroundDraw:function(){
        let canvas = document.getElementById('canvas-bg');
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        let ctx = canvas.getContext('2d');
        let { width, height } = canvas;
        this.drawGridLine(width, height, 11, ctx);
    },

    /**
    * W 宽度
    * H 高度
    * S 间隔
    * ctx
    */
    drawGridLine:function(W, H, S, ctx){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = config.themeColors[0];
        ctx.strokeStyle = config.themeColors[1];
        ctx.lineWidth = 0.5;
        ctx.rect(0, 0, W, H);
        ctx.fill();
        for (let i = S; i < W; i += S) {
            ctx.moveTo(i + 0.5, 0);
            ctx.lineTo(i + 0.5, H);
        } for (let j = S; j < H; j += S) {
            ctx.moveTo(0, j + 0.5);
            ctx.lineTo(W, j + 0.5);
        }
        ctx.stroke();
        ctx.restore();
    }
}