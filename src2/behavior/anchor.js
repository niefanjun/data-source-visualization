import config from '../config';

let {themeColors} = config;

/**
 * 
 */
G6.registerBehavior('anchor-drag', {
    getEvents() {
        return {
            'mousedown': 'linkMouseDown',
            'mousemove': 'linkMove',
            'mouseup': 'linkMouseUp',
        }
    },
    linkMouseDown(e) {
        let clazName = e.target.get('className');
        if ('rect-mark-left' === clazName || 'rect-mark-right' === clazName) {
            // 让其他可选点高亮 todo
            const point = { x: e.x, y: e.y };
            let node = e.item.getModel();
            this.edge = graph.addItem('edge', {
                source: node.id,
                fromId: node.id,
                target: point,
                shape: 'line'
            });
        }
    }, linkMove(e) {
        if (this.edge) {
            console.log('move');
            const point = { x: e.x, y: e.y };
            graph.updateItem(this.edge, {
                target: point
            });
            let fromNodeId = this.edge.getModel().fromId;
            this.highlightLinkPoints(fromNodeId,graph.getNodes());
        }
    }, linkMouseUp(e) {
        if (this.edge) {
            console.log('up');
            let targetNode = e.item && e.item.getModel();
            let fromNode = this.edge.get('source');

            if (targetNode && targetNode.id && targetNode.id != fromNode.get('id')) {
                let edgeModel = this.edge.getModel();
                graph.updateItem(this.edge, {
                    target: targetNode.id,
                    shape: 'thinkLine',
                    // controlPoints:this.getControlPoints(edgeModel), // todo 自定义边
                    style: {
                        endArrow: {
                            path: 'M 5,0 L -5,-5 L -2.5,0 L -5,5 Z',
                            d: 5
                        },
                        stroke: themeColors[3],
                        lineDash: []
                    }
                });
                this.edge = null;
            } else { // 没拖动到点位上
                if (this.edge) {
                    graph.remove(this.edge);
                    this.edge = null;
                }
            }
            this.unHightLinkPoints(fromNode.get('id'),graph.getNodes());
        }
    },
    getControlPoints({ endPoint, startPoint }) {
        let diffX = Math.abs(endPoint.x - startPoint.x);
        let diffY = Math.abs(endPoint.y - startPoint.y);
        if (diffX >= diffY) {
            return [{
                x: startPoint.x + diffX / 2 * 0.25,
                y: startPoint.y + diffY / 2 * 0.75
            }];
        } else {
            return [{
                x: startPoint.x + diffX / 2 * 0.75,
                y: startPoint.y + diffY / 2 * 0.25
            }];
        }
    },
    /**
     * 拖动中高亮连接点规则
     * @param {*} target 
     * @param {*} nodes 
     */
    highlightLinkPoints(id,nodes){
        let node = graph.findById(id);
        let nodeModel = node.getModel();
        let groupId = nodeModel.groupId;

        for(let item of nodes){
            let itemId = item.get('id');
            let model = item.getModel();
            if(model.groupId !=groupId){
                model.linkPoints = {
                    lineWidth:6,
                    size: 6,
                    strokeOpacity:0.6
                };
                graph.findById(itemId).update(model);
            }else{
                if(itemId == id){
                    if(!item.hasState('hover')){
                        model.linkPoints = {
                            size: 4
                        }
                        item.update(model);
                        graph.setItemState(item, 'hover', true);
                    }
                }
            }
        }
    },

    unHightLinkPoints(id,nodes){
        let node = graph.findById(id);
        let nodeModel = node.getModel();
        let groupId = nodeModel.groupId;
        nodeModel.linkPoints = {
            size:0
        }
        node.update(nodeModel);
        graph.setItemState(node, 'hover', false);   

        for(let item of nodes){
            let id = item.get('id');
            let model = item.getModel();
            if(model.groupId !=groupId){ // 还原
                model.linkPoints = {
                    lineWidth:1,
                    size: 0,
                    // strokeOpacity:0.6
                };
                graph.findById(id).update(model);    
            }
        }
    }


});