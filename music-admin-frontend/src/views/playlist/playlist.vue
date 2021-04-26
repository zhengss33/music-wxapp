<template>
  <div>
    <el-table
      :data="playList"
      border
      stripe
      v-loading="isLoading"
      style="width: 100%">
      <el-table-column
        type="index"
        lable="#"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        label="封面"
        align="center"
        width="100">
        <template slot-scope="scope">
          <img :src="scope.row.coverImgUrl" height="50"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="歌单名"
        width="350">
      </el-table-column>
      <el-table-column
        prop="copywriter"
        label="描述"
        width="280">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签"
        width="150">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
import { fetchList, deleteList } from '@/api/playlist'
import scroll from '@/utils/scroll'

export default {
  data() {
    return {
      playList: [],
      count: 15,
      isLoading: false,
    }
  },
  created() {
    this.fetchPlayList()
  },

  mounted() {
    scroll.start(this.fetchPlayList)
  },

  methods: {
    handleEdit(_idx, row) {
      this.$router.push(`/playlist/edit/${row._id}`)
    },
    handleDelete(_idx, row) {
      this.$confirm('此操作将永久删除该歌单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteList({
          _id: row._id
        }).then(res => {
          console.log(res)
          if (res.data.deleted > 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.playList = []
            this.fetchPlayList()
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    fetchPlayList() {
      this.isLoading = true
      fetchList({
        start: this.playList.length,
        count: this.count
      }).then(res => {
        this.playList = this.playList.concat(res.data)
        if (res.data.length < this.count) {
          scroll.end()
        }
        this.isLoading = false
      })
    }
  },
}
</script>

<style>

</style>