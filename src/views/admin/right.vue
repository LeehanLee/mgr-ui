<template>
  <div class="main-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="other">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div :class="{'tree-container': true, 'msg-container': !!message}">
      <div v-if="message" class="msg">{{message}}</div>
      <div v-else class="tree-area">
        <el-tree
          :data="treeData"
          node-key="id"
          :check-strictly="true"
          ref="rightTree"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span
              :class="data.enabled ? 'item-enabled': 'item-disabled'"
            >{{ `${data.label}${!data.enabled ? '(已禁用)':''}` }}</span>
            <span>
              <!-- <el-button type="text" size="mini" @click="showAddingForm(data)">添加下级权限</el-button> -->
              <el-button type="text" size="mini" @click="handleEditClick(node, data)">编辑</el-button>
              <!-- <el-button
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
          label="上级权限"
          :label-width="formLabelWidth"
          prop="name"
        >
          <span>{{currentDto.parentname}}</span>
        </el-form-item>
        <el-form-item label="权限名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="currentDto.name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label :label-width="formLabelWidth" prop="enabled">
          <el-checkbox v-model="currentDto.enabled">启用</el-checkbox>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitClick">确定</el-button>
        <el-button @click="dtoFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { buildTree, findFromTree } from "../../common/Utils";
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
          { required: true, message: "请输入权限名", trigger: "change" },
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
            window.ActionService.post("/api/right/update", this.currentDto, {
              successMsg: "保存成功",
              errorMsg: "保存失败"
            }).then(r => {
              const target = findFromTree(self.treeData, self.currentDto.id);
              target.enabled = self.currentDto.enabled;
              target.label = self.currentDto.name;
              self.dtoFormVisible = false;
            });
          } else {
            window.ActionService.post("/api/right/insert", self.currentDto, {
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
      if (this._.isEmpty(result.rows)) {
        this.message = "暂无数据";
      }
      this.treeData = buildTree(
        result.rows.map(r => {
          r.enabled = true;
          return r;
        })
      );
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
    }
    // handleRemoveClick: function(node, data) {
    //   const url = `/api/right/delete?id=${data.value}`;
    //   window.HandleDeleteClick(this, url);
    // },
    // handleToggleEnableClick: function(enabled) {
    //   const selectedNodes = this.$refs.rightTree.getCheckedNodes().map(node => {
    //     return node.value;
    //   });
    //   if (this._.isEmpty(selectedNodes)) {
    //     this.$message({
    //       message: `请先勾选要${enabled ? "启" : "禁"}用的权限`,
    //       type: "error"
    //     });
    //     return false;
    //   }
    //   const ids = selectedNodes.join(",");
    //   const url = `/api/right/updateStatus?ids=${ids}&enabled=${enabled}`;
    //   window.ToggleEnableAndAlert(this, url, null, enabled);
    // }
  },
  computed: {
    listUrl: function() {
      return `/api/right/getMyRights?page=1&pageSize=999999`;
    },
    modelTitle: function() {
      return !this.currentDto.id ? "添加权限" : "编辑权限";
    }
  }
};
</script>
<style lang="less">
.main-content {
  margin: 10px 10px 10px 2.5%;

  .tree-container {
    background: #f2f7ff;
    box-shadow: 0px 0px 5px #852b99;
    position: fixed;
    width: 82%;
    bottom: 14px;
    overflow: auto;
    border: 1px solid #852b99;
    height: calc(100% - 182px);
    &.msg-container {
      justify-content: center;
      align-items: center;
      display: flex;
      .message {
        margin-top: -30px;
        font-size: 30px;
        text-align: center;
        background: #f4f8ff;
      }
    }
    .tree-area {
      max-width: 640px;
      margin: 20px;
      border: 1px solid lightgray;
      &.no-data {
        max-width: none;
      }
      .message {
        font-size: 30px;
        text-align: center;
      }
      .el-tree-node {
        // background: #b4e8ff;
        .el-tree-node__content {
          &:hover {
            background: #b4e8ff;
          }
        }
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        .item-enabled {
          color: black;
        }
        .item-disabled {
          color: #b6bfbf;
        }
        .el-button--mini {
          span {
            color: #0078f5;
          }
          &.delete-btn {
            span {
              color: #969696;
            }
          }
        }
      }
    }
  }

  .el-breadcrumb {
    margin-bottom: 14px !important;
    box-shadow: 0px 0px 5px #888;
    display: inline-block;
    border: 1px solid #888;
    padding: 10px 15px;
    border-radius: 3px;
    background: #fafdff;

    .other {
      .el-breadcrumb__inner {
        color: #0088cc;
      }
    }
  }
}
</style>
