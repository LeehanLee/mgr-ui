<template>
  <div class="main-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="other">组织管理</el-breadcrumb-item>
      <el-breadcrumb-item>组织列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-button
        v-for="(right, index) in pageRights"
        :key="index"
        type="primary"
        size="small"
        @click="getPageButtonFunc(right.id)"
      >{{right.name}}</el-button>
    </el-row>
    <div
      :class="{'tree-container': true, 'org-tree': true, 'msg-container': !!message}"
      :style="containerHeight"
    >
      <div v-if="message" class="msg">{{message}}</div>
      <div v-else class="tree-area">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="id"
          :check-strictly="false"
          ref="orgTree"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span
              :class="data.enabled ? 'item-enabled': 'item-disabled'"
            >{{ `${data.label}${!data.enabled ? '(已禁用)':''}` }}</span>
            <span>
              <el-button
                v-for="(right) in itemRights"
                :key="right.id"
                type="text"
                size="mini"
                :class="{'delete-btn': right.id.indexOf('delete') >= 0}"
                v-if="showItemBtn(right, data)"
                @click="right.handleClick(data)"
              >{{right.text}}</el-button>
              <!-- <el-button type="text" size="mini" @click="showAddingForm(data)">添加下级组织</el-button>
              <el-button type="text" size="mini" @click="handleEditClick(node, data)">编辑</el-button>
              <el-button
                class="delete-btn"
                v-if="!data.children || data.children.length <= 0"
                type="text"
                size="mini"
                @click="handleRemoveClick(node, data)"
              >删除</el-button>-->
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog :modal="false" :title="modelTitle" :visible.sync="dtoFormVisible">
      <el-form :model="currentDto" :rules="rules" ref="ruleForm">
        <el-form-item
          v-if="currentDto.parentid"
          label="上级组织"
          :label-width="formLabelWidth"
          prop="name"
        >
          <span>{{currentDto.parentname}}</span>
        </el-form-item>
        <el-form-item label="组织名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="currentDto.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label :label-width="formLabelWidth" prop="enabled">
          <el-checkbox v-model="currentDto.enabled">启用</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitClick">确定</el-button>
        <el-button @click="dtoFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  buildTree,
  findFromTree,
  getPageRights,
  getItemRights
} from "../../common/Utils";
export default {
  created() {
    window.ListService.get(this.listUrl, { vm: this }).then(
      this.handleListDataReceived
    );
  },
  data: function() {
    return {
      formLabelWidth: "200px",
      dtoFormVisible: false,
      currentDto: { enabled: false },
      rules: {
        dtoname: [
          { required: true, message: "请输入组织名", trigger: "change" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "change"
          }
        ]
      },
      currentIndex: -1,
      message: "",
      treeData: []
    };
  },
  methods: {
    handleSubmitClick: function(e, e2) {
      const self = this;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (self.currentDto.id) {
            window.ActionService.post("/api/org/update", this.currentDto, {
              successMsg: "保存成功",
              errorMsg: "保存失败"
            }).then(r => {
              const target = findFromTree(self.treeData, self.currentDto.id);
              target.enabled = self.currentDto.enabled;
              target.label = self.currentDto.name;
              self.dtoFormVisible = false;
            });
          } else {
            window.ActionService.post("/api/org/insert", self.currentDto, {
              successMsg: "添加成功",
              errorMsg: "添加失败"
            }).then(r => {
              self.dtoFormVisible = false;
              window.ListService.get(self.listUrl, { vm: this }).then(
                self.handleListDataReceived
              );
            });
          }
        } else {
          this.$message({ message: "请处理完错误后再保存", type: "error" });
          return false;
        }
      });
    },
    handleListDataReceived: function(result) {
      this.treeData = buildTree(result.rows);
      if (this._.isEmpty(result.rows)) {
        this.message = "No data yet.";
      }
    },
    showAddingForm: function(parent) {
      this.dtoFormVisible = true;
      this.currentDto = {
        parentid: parent ? parent.value : null,
        parentname: parent ? parent.label : "无"
      };
    },
    handleEditClick: function(node, data) {
      this.dtoFormVisible = true;
      this.currentDto = {
        parentid: node.parent ? node.parent.data.value : null,
        parentname: node.parent ? node.parent.data.label : "无",
        name: data.label,
        id: data.value,
        enabled: data.enabled
      };
    },
    handleRemoveClick: function(node, data) {
      const url = `/api/org/delete?id=${data.value}`;
      window.HandleDeleteClick(this, url);
    },
    handleToggleEnableClick: function(enabled) {
      const idArrs = this.$refs.orgTree.getCheckedNodes().map(node => {
        return node.value;
      });
      if (this._.isEmpty(idArrs)) {
        this.$message({
          message: `请先勾选要${enabled ? "启" : "禁"}用的组织`,
          type: "error"
        });
        return false;
      }
      const ids = idArrs.map(id => `"${id}"`).join(",");
      const s = enabled ? "enable" : "disable";
      const url = `/api/org/${s}`;
      window.ToggleEnableAndAlert(this, url, ids, null, enabled);
    },
    getPageButtonFunc: function(id) {
      switch (id) {
        case "org/insert":
          return this.showAddingForm();
        case "org/enable":
          return this.handleToggleEnableClick(true);
        case "org/disable":
          return this.handleToggleEnableClick(false);
      }
    },
    getItemButtonFunc: function(id) {
      const self = this;
      switch (id) {
        case "org/update":
          return function(val) {
            self.currentDto = self._.assign({}, val);
            self.dtoFormVisible = true;
            self.currentIndex = self._.findIndex(self.listData, r =>
              self._.isEqual(r, val)
            );
          };
        case "org/enable":
          return this.getToggleEnableAndAlertFunc(self, true);
        case "org/disable":
          return this.getToggleEnableAndAlertFunc(self, false);
        case "org/delete":
          return function(val) {
            const url = `/api/org/delete?id=${val.value}`;
            window.HandleDeleteClick(self, url);
          };
      }
    },
    getToggleEnableAndAlertFunc: function(self, enable) {
      return function(val) {
        const s = enable ? "enable" : "disable";
        const url = `/api/org/${s}`;
        window.ToggleEnableAndAlert(self, url, val.value, null, enable);
      };
    },
    showItemBtn: function(right, data) {
      if (right.id.indexOf("delete") >= 0) {
        return !data.children || data.children.length <= 0;
      }
      return true;
    }
  },
  computed: {
    listUrl: function() {
      return `/api/org/getList?page=1&pageSize=999999`;
    },
    modelTitle: function() {
      return !this.currentDto.id ? "添加组织" : "编辑组织";
    },
    pageRights: function() {
      return getPageRights(this.$store, "org");
    },
    itemRights: function() {
      const rs = getItemRights(this.$store, "org").map(r => {
        return {
          text: r.name,
          id: r.id,
          handleClick: this.getItemButtonFunc(r.id)
        };
      });
      return rs;
    },
    containerHeight: function() {
      const height = this._.isEmpty(this.pageRights)
        ? "calc(100% - 180px)"
        : "calc(100% - 236px)";
      return { height };
    }
  }
};
</script>
<style lang="less">
</style>
