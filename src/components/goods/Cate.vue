<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
      class="tree-table"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border>
        <!-- 定义名为 isok 的插槽 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <!-- 定义名为 order 的插槽 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 定义名为 opt 的插槽 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 分页区域 -->
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="addCateDialogClosed">
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px" :rules="addCateFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="parentCateProp"
            @change="parentCateChange"
            clearable
            change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空数组
      catelist: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用的模板名称
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      addCatedialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 验证规则
      addCateFormRules: {
        cat_name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      },
      // 父级分类列表
      parentCateList: [],
      // 选中的父级分类 id 数组
      selectedKeys: [],
      parentCateProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }

      // console.log(res.data)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    handleClose() {},
    showAddCateDialog() {
      // 先获取父级分类
      this.getParentCateList()
      this.addCatedialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data
    },
    parentCateChange() {
      // console.log(this.selectedKeys)
      // 如果 selectedKeys 的长度大于零，则选中了父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      // console.log(this.addCateForm)
      // 获取 form 表单验证的结果
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return null
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 200) {
          return this.$message.error('添加分类失败')
        }

        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCatedialogVisible = false
      })
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
