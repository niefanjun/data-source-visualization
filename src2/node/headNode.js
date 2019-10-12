
import config from '../config';

/**
 * 表头节点
 */
let {dbIcon,closeIcon,openIcon}  = config.img;

G6.registerNode('headNode', {
    shapeType: 'rect',
    afterUpdate(cfg, group) {
        // console.log('headerNode');
        // let imgage = cfg.select ? selectIcon : unSelectIcon;
        // group.get('group').findByClassName('nikeIcon').attr({
        //     img: imgage
        // });
        // graph.refresh();
    },
    afterDraw(cfg, group) {
        let iconH = 16;
        let iconW = 16;
        const size = this.getSize(cfg);
        const image = group.addShape('image', {
            attrs: {
                img: dbIcon,
                x: -size[0] / 2,
                y: -iconH ,
                fill: 'transparent',
                width: iconH,
                height: iconW
            },
            className: 'headerIcon'
        });
        
        let fontSize = 16;
        const text = group.addShape('text', {
            attrs: {
                x: -size[0] / 2 + iconW * 2,
                y: 0,
                fontSize: fontSize,
                fill: "white",
                textBaseline: 'bottom', // 文本在图形的上面
                text: cfg.name,
            }
        });
        
        const nike = group.addShape('image', {
            className: 'groupHandleIcon',
            attrs: {
                x: size[0] / 2 - iconW,
                y: -iconH ,
                height: iconH,
                width: iconW,
                img: closeIcon,
            }
        });

        // nike.set('capture', false);
    },
    getCustomConfig: function () {
        return {
            size: [235, 16],
            style: {
                lineWidth: 0,
                fill: 'white',
                opacity:0,
            },stateStyles: {
                hover: {
                    fill: 'transparent',
                    opacity:0,
                }
            }
        }
    }
}, 'rect');