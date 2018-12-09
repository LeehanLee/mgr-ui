<template>
  <div class="tree-select-area" :key="itemKey">
    <el-tag
      :disable-transitions="true"
      type="success"
      v-if="selectedIds && selectedIds.length === arrayData.length"
    >已全选</el-tag>
    <el-button type="text" @click="dialogVisible = true">{{selectedLabels}}</el-button>
    <el-button
      type="text"
      @click="$emit('onYesClick', [])"
      v-if="selectedIds && selectedIds.length>0"
    >清空</el-button>
    <el-dialog
      :center="true"
      width="30%"
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-row>
        <el-button type="primary" size="mini" @click="handleYesClick">确认</el-button>
        <el-button type="primary" size="mini" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" size="mini" @click="toggleSelectAll(true)">全选</el-button>
        <el-button type="primary" size="mini" @click="toggleSelectAll(false)">全不选</el-button>
      </el-row>
      <el-tree
        :data="treeData"
        node-key="value"
        :check-strictly="true"
        :show-checkbox="true"
        ref="treeRef"
        :default-checked-keys="selectedIds"
        default-expand-all
        :expand-on-click-node="false"
      ></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import { buildTree } from "../../common/Utils";
export default {
  props: {
    itemKey: String,
    title: String,
    arrayData: Array,
    selectedIds: Array,
    actions: Array
  },
  data: function() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    handleYesClick: function() {
      this.dialogVisible = false;
      const selectedIds = this.$refs.treeRef
        .getCheckedNodes()
        .map(n => n.value);
      this.$emit("onYesClick", selectedIds);
    },
    toggleSelectAll(isSelect) {
      const selectedIds = isSelect ? this.arrayData.map(d => d.id) : [];
      this.$refs.treeRef.setCheckedKeys(selectedIds);
    }
  },
  computed: {
    treeData: function() {
      return buildTree(this.arrayData);
    },
    selectedLabels: function() {
      const self = this;
      if (this._.isEmpty(this.selectedIds)) {
        return "请选择";
      }
      let selectedIds = this.selectedIds;
      if (this.selectedIds.length > 6) {
        selectedIds = selectedIds.slice(0, 6);
      }
      const selectedLabels = selectedIds.map(element => {
        return self._.find(self.arrayData, d => d.id === element).name;
      });
      if (this.selectedIds.length > 6) {
        selectedLabels.push("...");
      }
      return selectedLabels.join(", ");
    }
  }
};
</script>
<style lang="less">
.el-tree {
  max-height: 460px;
  min-height: 300px;
  overflow: auto;
}
.el-dialog__body {
  padding-top: 13px !important;
  .el-row {
    padding-bottom: 13px;
  }
}
</style>
