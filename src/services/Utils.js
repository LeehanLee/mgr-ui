
const HandleDeleteClick = (vm, url) => {
  vm.$confirm("此数据将永久删除, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    window.ActionService.get(url, {
      loadingMsg: "正在删除。。。",
      successMsg: "已删除",
      errorMsg: "删除失败"
    }).then(res => {
      if (res) {
        window.ListService.get(vm.listUrl).then(vm.handleListDataReceived);
      }
    });
  });
};

const ToggleEnableAndAlert = (vm, url, val, enabled) => {
  const text = enabled ? "启" : "禁";
  window.ActionService.get(url, {
    loadingMsg: `正在${text}用。。。`,
    successMsg: `${val ? val.username : ""} 已${text}用`,
    errorMsg: `${text}用失败`
  }).then(r => {
    if (r) {
      if (val) {
        const target = vm._.find(vm.listData, r => r.id === val.id);
        target.enabled = enabled;
      } else {
        window.ListService.get(vm.listUrl, { vm }).then(vm.handleListDataReceived);
      }
    }
  });
};
export { HandleDeleteClick, ToggleEnableAndAlert };
