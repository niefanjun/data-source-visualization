import config from '../config';

G6.registerBehavior('edge-hover', {
    getEvents() {
        return {
            'edge:mouseenter': 'edgeMouseEnter',
            'edge:mouseleave': 'edgeMouseLeave',
        };
    }, edgeMouseEnter(e) {
        e.item.toFront();
        let {fromId,target} = e.item.getModel();
        this.setState(graph.findById(fromId),true);
        this.setState(graph.findById(target),true);
        graph.setItemState(e.item, 'hover', true);
    }, edgeMouseLeave(e) {
        let {fromId,target} = e.item.getModel();
        this.setState(graph.findById(fromId),false);
        this.setState(graph.findById(target),false);
        graph.setItemState(e.item, 'hover', false);
    }, setState(node,state,behavior='hover'){
        if(node){
            graph.setItemState(node,behavior,state);
        } 
    }
});