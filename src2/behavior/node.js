import config from '../config';

G6.registerBehavior('nike-node-click', {
    getEvents() {
        return {
            'node:click': 'nickClick',
        };
    }, nickClick(e) {
        let clazName = e.target.get('className');
        if (clazName == 'nikeIcon') {
            let model = e.item.getModel();
            model.select = !model.select;
            e.item.update(model);
        }
    }
});

G6.registerBehavior('node-hover', {
    getEvents() {
        return {
            'node:mouseenter': 'hover',
            'node:mouseleave': 'normal',
            'node:mousemove': 'move'
        };
    }, move(e) {
        let clazName = e.target.get('className');
        if ('rect-mark-left' === clazName || 'rect-mark-right' === clazName) {
            e.item.set('lastHover', e.item.get('group').findByClassName(clazName));
            e.item.get('group').findByClassName(clazName).attr({
                fill: '#72CC4A'
            });
        } else {
            let lastNode = e.item.get('lastHover');
            lastNode && lastNode.attr && lastNode.attr({
                fill: "#fff"
            })
        }
        graph.paint();
    },
    hover(e) {
        let model = e.item.getModel();
        model.linkPoints = {
            size: 4
        }
        e.item.update(model);
        graph.setItemState(e.item, 'hover', true);
    }, normal(e) {
        let model = e.item.getModel();
        model.linkPoints = {
            size: 0
        }
        e.item.update(model);
        graph.setItemState(e.item, 'hover', false);
    }
});
