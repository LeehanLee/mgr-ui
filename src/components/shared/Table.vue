<template>
  <div :class="getContainerClass()" :style="costmerStyle" :key="JSON.stringify(rows)">
    <div v-if="msg" class="no-data">{{msg}}</div>
    <div v-else-if="!rows || rows.length<=0" class="no-data">Sorry, no data yet.</div>
    <table v-else class="basic-table">
      <thead>
        <tr class="title">
          <th class="selected-column">
            <el-checkbox class="select" @change="allSelectedChange"/>
          </th>
          <th v-for="(column, cindex) in columns" :key="cindex">{{column.text}}</th>
          <th v-if="actions && actions.length > 0" :style="actionsColumnWidth">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row" v-for="(row, rindex) in rows" :key="rindex">
          <td class="selected-column">
            <el-checkbox class="select" v-model="selectedByIndex[rindex]"/>
          </td>
          <td
            v-for="(column, cindex) in columns"
            :key="cindex"
            :style="column.style?column.style(row.enabled): ''"
          >{{column.render?column.render(row[column.dataIndex]) : row[column.dataIndex]}}</td>
          <td v-if="actions && actions.length > 0">
            <el-button
              size="small"
              type="primary"
              v-for="(action, aindex) in actions"
              :key="aindex"
              @click="action.handleClick(row)"
            >{{action.text}}</el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
    columns: Array,
    rows: Array,
    actions: Array,
    costmerStyle: Object
  },
  data: function() {
    return {
      selectedByIndex: []
    };
  },
  methods: {
    getContainerClass: function() {
      let c = "table-container";
      if (this.msg || !this.rows || this.rows.length <= 0) {
        c = `${c} no-data-container`;
      }
      return c;
    },
    allSelectedChange: function(selected) {
      this.selectedByIndex = this.rows.map(r => selected);
    },
    getSelectedIds: function() {
      const r = [];
      this.selectedByIndex.forEach((selected, index) => {
        if (selected) {
          r.push(this.rows[index].id);
        }
      });
      return r;
    }
  },
  computed: {
    actionsColumnWidth: function() {
      const width = this.actions.reduce((prevTotalWidth, item) => {
        return (item.width ? item.width : 70) + prevTotalWidth;
      }, 0);
      return { width: width + "px" };
    }
  }
};
</script>
<style lang="less">
.table-container {
  &.no-data-container {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  background: #f2f7ff;
  box-shadow: 0px 0px 5px #852b99;
  position: fixed;
  width: 82%;
  bottom: 46px;
  overflow: auto;
  height: calc(100% - 216px);
  border: 1px solid #852b99;
  .no-data {
    margin-top: -30px;
    font-size: 30px;
    text-align: center;
    background: #f4f8ff;
  }
  .basic-table {
    background: white;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    th {
      background: #852b99;
      color: white;
    }

    .el-checkbox__inner {
      width: 18px;
      height: 18px;
      &::after {
        height: 11px;
        left: 5px;
        top: 0px;
        width: 6px;
      }
    }

    .selected-column {
      width: 30px;
      text-align: center;

      .select {
        width: 20px;
      }
    }

    .title {
      height: 36px;
    }
    .row {
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      height: 50px;
      transition: background-color 0.3s ease;
      &:hover {
        background: #cfe4f7;
      }

      td {
        padding: 0 10px;
        border-left: 1px solid #ddd;
        &:first-child {
          border: none;
        }
        &:last-child {
          text-align: center;
        }
      }

      &:first-child {
        border-top: none;
      }
    }
  }
}
</style>
