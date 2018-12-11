import _ from "lodash";
const buildTreeNode = (node, rows) => {
  node.children = _.filter(rows, row => row.parentid === node.value).map(
    row => {
      return {
        label: row.name,
        value: row.id,
        enabled: row.enabled
        // disabled: !row.enabled
      };
    }
  );
  if (!_.isEmpty(node.children)) {
    node.children.forEach(childNode => {
      buildTreeNode(childNode, rows);
    });
  } else {
    delete node.children;
  }
};

const buildTree = rows => {
  if (!rows || rows.length <= 0) {
    return [];
  }
  const rootNodes = _.filter(rows, row => !row.parentid).map(row => {
    return {
      label: row.name,
      value: row.id,
      enabled: row.enabled
      // disabled: !row.enabled
    };
  });
  rootNodes.forEach(node => {
    buildTreeNode(node, rows);
  });
  return rootNodes;
};

// const findFromTree = (treeNodes, id) => {
//   let nodeStack = treeNodes;
//   while (!_.isEmpty(nodeStack)) {
//     const node = nodeStack.pop();
//     if (node.value === id) {
//       return node;
//     }
//     if (!_.isEmpty(node.children)) {
//       nodeStack = nodeStack.concat(node.children);
//     }
//   }

//   return null;
// };
const findFromTree = (treeNodes, id) => {
  for (let i = 0; i < treeNodes.length; i++) {
    const node = treeNodes[i];
    if (node.value === id) {
      return node;
    }
    if (!_.isEmpty(node.children)) {
      const result = findFromTree(node.children, id);
      if (result) {
        return result;
      } else {
        continue;
      }
    }
  }
  return null;
};

const buildIdPath = (list, id) => {
  if (_.isEmpty(list) || _.isNil(id)) {
    return [];
  }
  let result = [];
  let targetOfId = _.find(list, l => l.id === id);
  while (!_.isEmpty(targetOfId)) {
    result.unshift(targetOfId.id);
    targetOfId = _.find(list, l => l.id === targetOfId.parentid);
  }
  return result;
};

const getPageRights = (store, page) => {
  const rs = _.filter(
    store.state.openInfo.rights,
    r => r.parentid === page && (r.datatype === 3 || r.datatype === 5)
  );
  return rs;
};

const getItemRights = (store, page) => {
  const rs = _.filter(
    store.state.openInfo.rights,
    r => r.parentid === page && (r.datatype === 4 || r.datatype === 5)
  );
  return rs;
};

export { buildTree, findFromTree, buildIdPath, getPageRights, getItemRights };
