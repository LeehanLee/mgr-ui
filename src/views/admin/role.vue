<template>
  <div class="main-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="other">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
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
    <div class="data-content">
      <Table
        ref="table"
        :msg="loadingMsg"
        :rows="listData"
        :columns="dtoColumns"
        :actions="itemRights"
        :costmerStyle="tableContainerHeight"
      />
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog :modal="false" :title="modalTitle" :visible.sync="dtoFormVisible">
      <el-form :model="currentDto" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="currentDto.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth" prop="rights">
          <TreeSelectArea
            :itemKey="currentDto.id"
            title="请选择权限"
            :arrayData="rights"
            :selectedIds="currentDto.rights"
            @onYesClick="handleRightsSelected"
          />
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
import Table from "../../components/shared/Table.vue";
import TreeSelectArea from "../../components/shared/TreeSelectArea.vue";
import moment from "moment";
import { getPageRights, getItemRights } from "../../common/Utils";

export default {
  components: {
    Table,
    TreeSelectArea
  },
  created() {
    window.ListService.get(this.listUrl, { vm: this }).then(
      this.handleListDataReceived
    );
  },
  data: function() {
    return {
      currentPage: 1,
      pageSize: 50,
      total: 650,
      formLabelWidth: "200px",
      dtoFormVisible: false,
      count: 0,
      currentDto: {},
      rules: {
        name: [
          { required: true, message: "请输入角色名", trigger: "change" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "change"
          }
        ],
        rights: [{ required: true, message: "请选择权限", trigger: "change" }]
      },
      currentIndex: -1,
      dtoColumns: [
        {
          text: "角色名",
          dataIndex: "name"
        },
        {
          text: "添加日期",
          dataIndex: "created",
          render: function(val) {
            return moment(val).format("YYYY-MM-DD");
          }
        },
        {
          text: "启用",
          dataIndex: "enabled",
          render: function(val) {
            return val ? "启用" : "禁用";
          },
          style: function(val) {
            return {
              color: val ? "blue" : "red"
            };
          }
        }
      ],
      loadingMsg: "",
      listData: []
    };
  },
  methods: {
    handleSubmitClick: function(e, e2) {
      const self = this;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (self.currentDto.id) {
            window.ActionService.post("/api/role/update", this.currentDto, {
              successMsg: "保存成功",
              errorMsg: "保存失败"
            }).then(r => {
              self.listData.splice(self.currentIndex, 1, self.currentDto);
              self.dtoFormVisible = false;
            });
          } else {
            window.ActionService.post("/api/role/insert", self.currentDto, {
              successMsg: "添加成功",
              errorMsg: "添加失败"
            }).then(r => {
              self.dtoFormVisible = false;
              self.currentPage = 1;
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
    handlePageSizeChange: function(pageSize) {
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.isLoading = true;

      window.ListService.get(this.listUrl, { vm: this }).then(
        this.handleListDataReceived
      );
    },
    handleListDataReceived: function(result) {
      this.listData = result.rows;
      this.currentPage = result.page;
      this.pageSize = result.pageSize;
      this.total = result.total;
    },
    handlePageChange: function(page) {
      this.currentPage = page;
      this.isLoading = true;

      window.ListService.get(this.listUrl, { vm: this }).then(
        this.handleListDataReceived
      );
    },
    showAddingForm: function() {
      this.dtoFormVisible = true;
      this.currentDto = {};
    },
    handleToggleEnableClick: function(enabled) {
      const idArrs = this.$refs.table.getSelectedIds();

      if (this._.isEmpty(idArrs)) {
        this.$message({
          message: `请先勾选要${enabled ? "启" : "禁"}用的角色`,
          type: "error"
        });
        return false;
      }
      const ids = idArrs.map(id => `"${id}"`).join(",");
      const s = enabled ? "enable" : "disable";
      const url = `/api/role/${s}`;
      window.ToggleEnableAndAlert(this, url, ids, null, enabled);
    },
    handleRightsSelected: function(selectedIds) {
      // this.currentDto.rights = selectedIds;
      this.$set(this.currentDto, "rights", selectedIds);
    },
    getPageButtonFunc: function(id) {
      switch (id) {
        case "role/insert":
          return this.showAddingForm();
        case "role/enable":
          return this.handleToggleEnableClick(true);
        case "role/disable":
          return this.handleToggleEnableClick(false);
      }
    },
    getItemButtonFunc: function(id) {
      const self = this;
      switch (id) {
        case "role/update":
          return function(val) {
            self.currentDto = self._.assign({}, val);
            self.dtoFormVisible = true;
            self.currentIndex = self._.findIndex(self.listData, r =>
              self._.isEqual(r, val)
            );
          };
        case "role/enable":
          return this.getToggleEnableAndAlertFunc(self, true);
        case "role/disable":
          return this.getToggleEnableAndAlertFunc(self, false);
        case "role/delete":
          return function(val) {
            const url = `/api/role/delete?id="${val.id}"`;
            window.HandleDeleteClick(self, url);
          };
      }
    },
    getToggleEnableAndAlertFunc: function(self, enable) {
      return function(val) {
        const s = enable ? "enable" : "disable";
        const url = `/api/role/${s}`;
        window.ToggleEnableAndAlert(self, url, `"${val.id}"`, val, enable);
      };
    }
  },
  computed: {
    listUrl: function() {
      return `/api/role/getList?page=${this.currentPage}&pageSize=${
        this.pageSize
      }`;
    },
    modalTitle: function() {
      return this._.isEmpty(this.currentDto) ? "添加角色" : "编辑角色";
    },
    rights() {
      return this.$store.state.openInfo.rights.map(r => {
        r.enabled = true;
        return r;
      });
    },
    pageRights: function() {
      return getPageRights(this.$store, "role");
    },
    itemRights: function() {
      const rs = getItemRights(this.$store, "role").map(r => {
        return {
          text: r.name,
          handleClick: this.getItemButtonFunc(r.id)
        };
      });
      return rs;
    },
    tableContainerHeight: function() {
      const height = this._.isEmpty(this.pageRights)
        ? "calc(100% - 212px)"
        : "calc(100% - 270px)";
      return { height };
    }
  }
};
</script>
<style lang="less">
.main-content {
  margin: 10px 10px 10px 2.5%;

  .el-pagination {
    position: fixed;
    padding: 10px 5px;
    bottom: 0px;
  }
  .data-content {
    .table-container {
      height: calc(100% - 270px);
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
