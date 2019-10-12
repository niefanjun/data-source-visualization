import config from '../config';

let {themeColors} = config;

G6.registerEdge('thinkLine', {

    itemType: 'thinkLine',

    options:{
        stateStyles: {
            hover: {
              lineWidth: 1.1,
              stroke:themeColors[6]
              // stroke:'red'
            }
        }
    },

    // getCustomConfig: function () {
    //     return {
    //         style:{
    //             endArrow: {
    //                 path: 'M 5,0 L -5,-5 L -2.5,0 L -5,5 Z',
    //                 d: 5
    //             }
    //         }
    //     }
    // },

    getControlPoints(cfg){
        // console.log('edge control');
        let {startPoint,endPoint} = cfg;
        return [{
            x:endPoint.x / 3 + 2 / 3 * startPoint.x,
            y:startPoint.y
        },{
            x:endPoint.x / 3 + 2 / 3 * startPoint.x,
            y:endPoint.y
        }]
    },

    drawShape(cfg,group) {
        console.log('drawLine###');
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const shape = group.addShape('path', {
            attrs: {
                lineAppendWidth:10,
                stroke: themeColors[3],
                path: [
                    ['M', startPoint.x, startPoint.y],
                    ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, startPoint.y],
                    ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, endPoint.y],
                    ['L', endPoint.x, endPoint.y]
                ],
                endArrow: {
                    path: 'M 5,0 L -5,-5 L -2.5,0 L -5,5 Z',
                    d: 5
                },
            }
        });
        return shape;
    },
    // setState(name, value, item) {
    //     const shape = item.get('keyShape');
    //     if (!shape) {
    //       return;
    //     }
    //     const itemStateStyle = item.getStateStyle(name);
    //     // const stateStyle = this.getStateStyle(name, value, item);
    //     const styles = merge({}, itemStateStyle);
    //     if (value) { // 如果设置状态,在原本状态上叠加绘图属性
    //       shape.attr(styles);
    //     } else { // 取消状态时重置所有状态，依次叠加仍有的状态
    //       const style = item.getCurrentStatesStyle();
    //       // 如果默认状态下没有设置attr，在某状态下设置了，需要重置到没有设置的状态
    //       Util.each(styles, (val, attr) => {
    //         if (!style[attr]) {
    //           style[attr] = null;
    //         }
    //       });
    //       shape.attr(style);
    //     }
    // },

// },'polyline');    
},'single-line');    
// });