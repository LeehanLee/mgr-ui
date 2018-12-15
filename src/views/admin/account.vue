<template>
  <div class="main-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="other">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
        :columns="userColumns"
        :actions="itemRights"
        :costmerStyle="containerHeight"
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
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="currentDto.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="currentDto.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="currentDto.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织" :label-width="formLabelWidth" prop="orgid">
          <el-cascader
            v-model="selectedOrgIdPath"
            placeholder="输入即可搜索"
            :show-all-levels="false"
            :change-on-select="true"
            expand-trigger="hover"
            :options="orgTree"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="roleid" label="角色" :label-width="formLabelWidth">
          <el-select v-model="currentDto.roleid" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
import moment from "moment";
import {
  buildTree,
  buildIdPath,
  getPageRights,
  getItemRights
} from "../../common/Utils";

export default {
  components: {
    Table
  },
  created() {
    window.ListService.get(this.listUrl, { vm: this }).then(
      this.handleListDataReceived
    );
  },
  watch: {
    dtoFormVisible: function(newVisible, oldVisible) {
      const self = this;
      if (newVisible) {
        if (this._.isEmpty(this.roleList)) {
          window.BaseHttpService.get(`/api/role/getList`).then(roleList => {
            self.roleList = roleList.rows.filter(r => r.enabled);
          });
        }
        if (this._.isEmpty(this.orgList)) {
          window.BaseHttpService.get(
            `/api/org/getList?page=1&pageSize=10000`
          ).then(orgList => {
            self.orgList = orgList.rows;
            self.selectedOrgIdPath = buildIdPath(
              self.orgList,
              self.currentDto.orgid
            );
            self.orgTree = buildTree(orgList.rows.filter(r => r.enabled));
          });
        } else {
          self.selectedOrgIdPath = buildIdPath(
            self.orgList,
            self.currentDto.orgid
          );
        }
      }
    },
    selectedOrgIdPath: function(newv, oldv) {
      this.currentDto.orgid = newv[newv.length - 1];
    }
  },
  data: function() {
    return {
      selectedOrgIdPath: [],
      orgTree: [],
      orgList: [],
      roleList: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      formLabelWidth: "200px",
      dtoFormVisible: false,
      count: 0,
      currentDto: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "change"
          }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "change" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change"
          }
        ],
        orgid: [{ required: true, message: "请选择组织", trigger: "change" }],
        roleid: [{ required: true, message: "请选择角色", trigger: "change" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }]
      },
      currentIndex: -1,
      userColumns: [
        {
          text: "用户名",
          dataIndex: "username"
        },
        {
          text: "密码",
          dataIndex: "password"
        },
        {
          text: "电话",
          dataIndex: "mobile"
        },
        {
          text: "组织",
          dataIndex: "orgName"
        },
        {
          text: "角色",
          dataIndex: "roleName"
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
        if (!valid) {
          this.$message({ message: "请处理完错误后再保存", type: "error" });
          return false;
        }
        if (self.currentDto.id) {
          window.ActionService.post("/api/account/update", this.currentDto, {
            successMsg: "保存成功",
            errorMsg: "保存失败"
          }).then(r => {
            self.currentDto.orgName = self.orgList.find(
              o => o.id === self.currentDto.orgid
            ).name;
            self.listData.splice(self.currentIndex, 1, self.currentDto);
            self.dtoFormVisible = false;
          });
        } else {
          window.ActionService.post("/api/account/insert", self.currentDto, {
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
      });
    },
    handlePageSizeChange: function(pageSize) {
      this.currentPage = 1;
      this.pageSize = pageSize;
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
          message: `请先勾选要${enabled ? "启" : "禁"}用的用户`,
          type: "error"
        });
        return false;
      }
      const idStr = idArrs.join(",");
      const s = enabled ? "enable" : "disable";
      const url = `/api/account/${s}`;
      window.ToggleEnableAndAlert(this, url, idStr, null, enabled);
    },
    getPageButtonFunc: function(id) {
      switch (id) {
        case "account/insert":
          return this.showAddingForm();
        case "account/enable":
          return this.handleToggleEnableClick(true);
        case "account/disable":
          return this.handleToggleEnableClick(false);
      }
    },
    getItemButtonFunc: function(id) {
      const self = this;
      switch (id) {
        case "account/update":
          return function(val) {
            self.currentDto = self._.assign({}, val);
            self.dtoFormVisible = true;
            self.currentIndex = self._.findIndex(self.listData, r =>
              self._.isEqual(r, val)
            );
          };
        case "account/enable":
          return this.getToggleEnableAndAlertFunc(self, true);
        case "account/disable":
          return this.getToggleEnableAndAlertFunc(self, false);
        case "account/delete":
          return function(val) {
            const url = `/api/account/delete?id=${val.id}`;
            window.HandleDeleteClick(self, url);
          };
      }
    },
    getToggleEnableAndAlertFunc: function(self, enable) {
      return function(val) {
        const s = enable ? "enable" : "disable";
        const url = `/api/account/${s}`;
        window.ToggleEnableAndAlert(self, url, val.id, val, enable);
      };
    }
  },
  computed: {
    listUrl: function() {
      return `/api/account/getList?page=${this.currentPage}&pageSize=${
        this.pageSize
      }`;
    },
    modalTitle: function() {
      return this._.isEmpty(this.currentDto) ? "添加用户" : "编辑用户";
    },
    pageRights: function() {
      return getPageRights(this.$store, "account");
    },
    itemRights: function() {
      const rs = getItemRights(this.$store, "account").map(r => {
        return {
          text: r.name,
          handleClick: this.getItemButtonFunc(r.id)
        };
      });
      return rs;
    },
    containerHeight: function() {
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
