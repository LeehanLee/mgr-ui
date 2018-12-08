<template>
  <el-menu ref="menu" :default-active="defaultActive" class="menu-container" :router="true">
    <div v-for="(menu, index) in rights" :key="index" :index="`${index}`">
      <el-menu-item v-if="!menu.children" :index="menu.url">{{menu.text}}</el-menu-item>
      <el-submenu v-else :index="`${index}`">
        <template slot="title">
          <span>{{menu.text}}</span>
        </template>
        <el-menu-item
          v-for="(child, index2) in menu.children"
          :key="`${index}-${index2}`"
          :index="child.url"
        >{{child.text}}</el-menu-item>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
import pageMaps from "./pageMaps";
export default {
  components: {},
  data: () => {
    return {
      menuData: [
        {
          text: "用户管理",
          children: [
            {
              text: "用户列表",
              url: "/user/list"
            },
            {
              text: "用户日志",
              url: "/user/logs"
            }
          ]
        },
        {
          text: "组织管理",
          children: [
            {
              text: "组织列表",
              url: "/org/list"
            }
          ]
        },
        {
          text: "角色管理",
          children: [
            {
              text: "角色列表",
              url: "/role/list"
            }
          ]
        }
      ]
    };
  },
  methods: {
    buildNavTree: function(rights) {
      if (this._.isEmpty(rights)) {
        return [];
      }
      const mainNavs = this._.filter(rights, r => r.datatype === 0);
      if (this._.isEmpty(mainNavs)) {
        return [];
      }

      return mainNavs.map(element => {
        const children = this._.filter(
          rights,
          r => r.parentid === element.id
        );
        if (!this._.isEmpty(children)) {
          element.children = children.map(c => {
            return {
              text: c.name,
              url: `/${element.id}/${c.id}`
            };
          });
        }
        return {
          text: element.name,
          children: element.children
        };
      });
    },
    buildRouteTree: function(rights) {
      if (this._.isEmpty(rights)) {
        return [];
      }
      const routeSource = this._.filter(rights, r => r.datatype === 1);
      if (this._.isEmpty(routeSource)) {
        return [];
      }

      const result = routeSource.map(element => {
        const parent = this._.find(rights, r => r.id === element.parentid);
        const path = `/${parent.id}/${element.id}`;
        // const p = pageMaps[element.id];
        // const p = `./views${path}.vue`;
        return {
          path: path,
          name: `${element.id}`,
          component: pageMaps[element.id]
          // component: () => {
          //   import(/* webpackChunkName: "about" */ p);
          // }
        };
      });
      return result;
    }
  },
  computed: {
    rights() {
      this.$router.addRoutes(
        this.buildRouteTree(this.$store.state.openInfo.rights)
      );
      return this.buildNavTree(this.$store.state.openInfo.rights);
    },
    defaultActive: function() {
      return this.$router.history.pending
        ? this.$router.history.pending.path
        : this.$router.history.current.path;
    }
  }
};
</script>

<style lang="less">
.menu-container {
  border: none !important;
  background: transparent !important;

  .el-menu-item {
    min-width: inherit !important;
    color: white;
    display: block;
    text-decoration: none;
    &:hover {
      color: #852b99;
    }

    &:hover,
    &.is-active {
      box-shadow: 0 0 8px 0;
      background: white;
      color: #852b99;
    }
  }
  .el-submenu__title {
    color: white;
    font-weight: 600;
    &:hover {
      color: #852b99;
    }
  }
  &:hover {
    color: #852b99;
  }

  .el-menu {
    background: #3b6090 !important;
    color: white !important;
  }
}
</style>
