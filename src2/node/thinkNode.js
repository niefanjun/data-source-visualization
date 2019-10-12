
import config from '../config';
/**
 * 自定基础节点
 */
let {selectIcon,unSelectIcon,filedIcon}  = config.img;

G6.registerNode('thinkNode', {
    shapeType: 'rect',
    afterUpdate(cfg, group) {
        // console.log('afterUpdate');
        let imgage = cfg.select ? selectIcon : unSelectIcon;
        group.get('group').findByClassName('nikeIcon').attr({
            img: imgage
        });
        // group.get('group').getParent().toFront();
        // console.log(group.get('group').getParent());
        graph.refresh();

    },
    afterDraw(cfg, group) {
        let iconH = 12;
        let iconW = 12;
        const size = this.getSize(cfg);
        const image = group.addShape('image', {
            attrs: {
                img: filedIcon,
                x: -size[0] / 2 + iconW,
                y: -iconH / 2,
                width: iconH,
                height: iconW
            },
            className: 'leftIcon'
        });

        let fontSize = 12;
        const text = group.addShape('text', {
            attrs: {
                x: -size[0] / 2 + iconW * 3,
                y: fontSize / 2,
                fontSize: fontSize,
                fill: "#595959",
                textBaseline: 'bottom', // 文本在图形的上面
                text: cfg.name,
            }
        });
        const nike = group.addShape('image', {
            zIndex:100,
            className: 'nikeIcon',
            attrs: {
                x: size[0] / 2 - iconW - 9,
                y: -iconH / 2,
                height: iconH,
                width: iconW,
                key: "selectImage",
                img: selectIcon,
            }
        });

        // nike.set('capture', false);
    },
    getAnchorPoints() {
        return [[0, 0.5], [1, 0.5]]
    },
    getCustomConfig: function () {
        return {
            size: [235, 36],
            style: {
                stroke: '#d9d9d9',
                lineWidth: 1,
                fill: 'white',
                radius: 3,
                // fillOpacity: 0.5
            }, stateStyles: {
                hover: {
                    stroke: '#72CC4A',
                    // fillOpacity: 0.1,
                    fill: '#a4f9a4',
                }
            }, linkPoints: {
                left: true,
                right: true,
                size: 0,
                fill: '#fff',
                stroke: '#72CC4A'
            }
        }
    }
}, 'rect');