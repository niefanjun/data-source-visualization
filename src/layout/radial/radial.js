/**
 * @fileOverview random layout
 * @author shiwu.wyy@antfin.com
 */

const Layout = require('../layout');
const Util = require('../../util');
const RadialNonoverlapForce = require('./radialNonoverlapForce');
const MDS = require('./mds');

function getWeightMatrix(M) {
  const rows = M.length;
  const cols = M[0].length;
  const result = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      if (M[i][j] !== 0) row.push(1 / Math.pow(M[i][j], 2));
      else row.push(0);
    }
    result.push(row);
  }
  return result;
}

function getIndexById(array, id) {
  let index = -1;
  array.forEach((a, i) => {
    if (a.id === id) {
      index = i;
      return;
    }
  });
  return index;
}

/**
 * 随机布局
 */
Layout.registerLayout('radial', {
  getDefaultCfg() {
    return {
      center: [ 0, 0 ],           // 布局中心
      maxIteration: 1000,         // 停止迭代的最大迭代数
      focusNode: null,            // 中心点，默认为数据中第一个点
      unitRadius: null,           // 每一圈半径
      linkDistance: 50,           // 默认边长度
      preventOverlap: false,          // 是否防止重叠
      nodeSize: 10                // 节点直径
    };
  },
  /**
   * 执行布局
   */
  execute() {
    const self = this;
    const nodes = self.nodes;
    const edges = self.edges;
    const center = self.center;
    if (nodes.length === 0) {
      return;
    } else if (nodes.length === 1) {
      nodes[0].x = center[0];
      nodes[0].y = center[1];
      return;
    }
    const linkDistance = self.linkDistance;
    // layout
    let focusNode = self.focusNode;
    if (Util.isString(focusNode)) {
      let found = false;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === focusNode) {
          focusNode = nodes[i];
          self.focusNode = focusNode;
          found = true;
          i = nodes.length;
        }
      }
      if (!found) focusNode = null;
    }
    // default focus node
    if (!focusNode) {
      focusNode = nodes[0];
      if (!focusNode) return;
      self.focusNode = focusNode;
    }
    // the index of the focusNode in data
    const focusIndex = getIndexById(nodes, focusNode.id);
    self.focusIndex = focusIndex;

    // the graph-theoretic distance (shortest path distance) matrix
    const adjMatrix = Util.getAdjMatrix({ nodes, edges }, false);
    const D = Util.floydWarshall(adjMatrix);
    const maxDistance = self.maxToFocus(D, focusIndex);
    // replace first node in unconnected component to the circle at (maxDistance + 1)
    self.handleInfinity(D, focusIndex, (maxDistance + 1));
    self.distances = D;

    // the shortest path distance from each node to focusNode
    const focusNodeD = D[focusIndex];
    const width = self.width;
    const height = self.height;
    const semiWidth = width - center[0] > center[0] ? center[0] : width - center[0];
    const semiHeight = height - center[1] > center[1] ? center[1] : height - center[1];
    // the maxRadius of the graph
    const maxRadius = semiHeight > semiWidth ? semiWidth : semiHeight;
    const maxD = Math.max(...focusNodeD);
    // the radius for each nodes away from focusNode
    const radii = [];
    focusNodeD.forEach((value, i) => {
      if (!self.unitRadius) {
        self.unitRadius = maxRadius / maxD;
      }
      radii[i] = value * self.unitRadius;
    });
    self.radii = radii;


    const eIdealD = self.eIdealDisMatrix(D, linkDistance, radii);
    // const eIdealD = scaleMatrix(D, linkDistance);
    self.eIdealDistances = eIdealD;
    // the weight matrix, Wij = 1 / dij^(-2)
    const W = getWeightMatrix(eIdealD);
    self.weights = W;

    // the initial positions from mds
    const mds = new MDS({ distances: eIdealD, linkDistance, dimension: 2 });
    let positions = mds.layout();
    positions.forEach(p => {
      if (isNaN(p[0])) p[0] = Math.random() * linkDistance;
      if (isNaN(p[1])) p[1] = Math.random() * linkDistance;
    });
    self.positions = positions;
    positions.forEach((p, i) => {
      nodes[i].x = p[0] + center[0];
      nodes[i].y = p[1] + center[1];
    });
    // move the graph to origin, centered at focusNode
    positions.forEach(p => {
      p[0] -= positions[focusIndex][0];
      p[1] -= positions[focusIndex][1];
    });
    self.run();
    const preventOverlap = self.preventOverlap;
    const nodeSize = self.nodeSize;
    // stagger the overlapped nodes
    if (preventOverlap) {
      const nonoverlapForce = new RadialNonoverlapForce({
        nodeSize, adjMatrix, positions, radii, height, width,
        focusID: focusIndex,
        iterations: 200,
        k: positions.length / 4.5
      });
      positions = nonoverlapForce.layout();
    }
    // move the graph to center
    positions.forEach((p, i) => {
      nodes[i].x = p[0] + center[0];
      nodes[i].y = p[1] + center[1];
    });
  },
  run() {
    const self = this;
    const maxIteration = self.maxIteration;
    const positions = self.positions;
    const W = self.weights;
    const eIdealDis = self.eIdealDistances;
    const radii = self.radii;
    for (let i = 0; i <= maxIteration; i++) {
      const param = i / maxIteration;
      self.oneIteration(param, positions, radii, eIdealDis, W);
    }
  },
  oneIteration(param, positions, radii, D, W) {
    const self = this;
    const vparam = 1 - param;
    const focusIndex = self.focusIndex;
    positions.forEach((v, i) => { // v
      const originDis = Util.getEDistance(v, [ 0, 0 ]);
      const reciODis = originDis === 0 ? 0 : 1 / originDis;
      if (i === focusIndex) return;
      let xMolecule = 0;
      let yMolecule = 0;
      let denominator = 0;
      positions.forEach((u, j) => { // u
        if (i === j) return;
        // the euclidean distance between v and u
        const edis = Util.getEDistance(v, u);
        const reciEdis = edis === 0 ? 0 : 1 / edis;
        const idealDis = D[j][i];
        // same for x and y
        denominator += W[i][j];
        // x
        xMolecule += W[i][j] * (u[0] + idealDis * (v[0] - u[0]) * reciEdis);
        // y
        yMolecule += W[i][j] * (u[1] + idealDis * (v[1] - u[1]) * reciEdis);
      });
      const reciR = radii[i] === 0 ? 0 : 1 / radii[i];
      denominator *= vparam;
      denominator += param * Math.pow(reciR, 2);
      // x
      xMolecule *= vparam;
      xMolecule += param * reciR * v[0] * reciODis;
      v[0] = xMolecule / denominator;
      // y
      yMolecule *= vparam;
      yMolecule += param * reciR * v[1] * reciODis;
      v[1] = yMolecule / denominator;
    });
  },
  eIdealDisMatrix() {
    const self = this;
    const D = self.distances;
    const linkDis = self.linkDistance;
    const radii = self.radii;
    const unitRadius = self.unitRadius;
    const result = [];
    D.forEach((row, i) => {
      const newRow = [];
      row.forEach((v, j) => {
        if (i === j) newRow.push(0);
        else if (radii[i] === radii[j]) { // i and j are on the same circle
          newRow.push(v * linkDis / (radii[i] / unitRadius));
        } else { // i and j are on different circle
          const link = (linkDis + unitRadius) / 2;
          newRow.push(v * link);
        }
      });
      result.push(newRow);
    });
    return result;
  },
  handleAbnormalMatrix(adMatrix, focusIndex) {
    const rows = adMatrix.length;
    // 空行即代表该行是离散点，将单个离散点看作 focus 的邻居
    for (let i = 0; i < rows; i++) {
      if (adMatrix[i].length === 0) {
        adMatrix[i][focusIndex] = 1;
        adMatrix[focusIndex][i] = 1;
      }
    }
    // 如果第一行中有
    // let hasDis = true;
    // for (let j = 0; j < matrix[focusIndex].length; j++) {
    //   if (!matrix[focusIndex][j]) hasDis = false;
    // }
    // if (hasDis) {
    //   matrix[j][focusIndex] = 1;
    //   matrix[focusIndex][j] = 1;
    // }
    // if (emptyMatrix) {
    //   let value = 0;
    //   for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < rows; j++) {
    //       if (i === focusIndex || j === focusIndex) value = 1;
    //       matrix[i][j] = value;
    //       value = 0;
    //     }
    //     value = 0;
    //   }
    // }
  },
  handleInfinity(matrix, focusIndex, step) {
    const length = matrix.length;
    // 遍历 matrix 中遍历 focus 对应行
    for (let i = 0; i < length; i++) {
      // matrix 关注点对应行的 Inf 项
      if (matrix[focusIndex][i] === Infinity) {
        matrix[focusIndex][i] = step;
        matrix[i][focusIndex] = step;
        // 遍历 matrix 中的 i 行，i 行中非 Inf 项若在 focus 行为 Inf，则替换 focus 行的那个 Inf
        for (let j = 0; j < length; j++) {
          if (matrix[i][j] !== Infinity && matrix[focusIndex][j] === Infinity) {
            matrix[focusIndex][j] = step + matrix[i][j];
            matrix[j][focusIndex] = step + matrix[i][j];
          }
        }
      }
    }
    // 处理其他行的 Inf。根据该行对应点与 focus 距离以及 Inf 项点 与 focus 距离，决定替换值
    for (let i = 0; i < length; i++) {
      if (i === focusIndex) {
        continue;
      }
      for (let j = 0; j < length; j++) {
        if (matrix[i][j] === Infinity) {
          let minus = Math.abs(matrix[focusIndex][i] - matrix[focusIndex][j]);
          minus = minus === 0 ? 1 : minus;
          matrix[i][j] = minus;
        }
      }
    }
  },
  maxToFocus(matrix, focusIndex) {
    let max = 0;
    for (let i = 0; i < matrix[focusIndex].length; i++) {
      if (matrix[focusIndex][i] === Infinity) continue;
      max = matrix[focusIndex][i] > max ? matrix[focusIndex][i] : max;
    }
    return max;
  }
});
