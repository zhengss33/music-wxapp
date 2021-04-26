<template>
  <div>
   <el-table
      :data="blogList"
      stripe
      style="width: 100%"
      v-loading="isLoading">
      <el-table-column
        type="index"
        lable="#"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        width="500">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="发布人"
        width="200">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getBlogList, deleteBlog } from '@/api/blog'
import scroll from '@/utils/scroll'

const LIMIT = 10
export default {
  data() {
    return {
      isLoading: false,
      blogList: []
    }
  },

  created() {
    this._getBlogList()
  },
  mounted() {
    scroll.start(this._getBlogList)
  },
  methods: {
    _getBlogList() {
      this.isLoading = true
      getBlogList({
        start: this.blogList.length,
        count: LIMIT
      }).then(res => {
        this.isLoading = false
        const list = res.data.map(item => (JSON.parse(item)))
        this.blogList = this.blogList.concat(list)
        if (list.length < LIMIT) {
          scroll.end()
        }
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    handleDelete(_idx, item) {
      this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true
        deleteBlog(item).then(res => {
          this.isLoading = false
          if (res.data.deleted > 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.blogList = []
            this._getBlogList()
          }
          console.log(res)
        }).catch(err => {
          this.isLoading = false
          this.$message.error('删除失败'); 
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      console.log(item)
    }
  },
}
</script>