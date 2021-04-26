<template>
  <div :style="{padding: '20px'}">
    <el-upload
      class="upload"
      action="http://localhost:3000/banner/upload"
      :show-file-list="false"
      :on-success="handleSuccess">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
   <el-table
      :data="bannerList"
      style="width: 100%"
      v-loading="isLoading">
      <el-table-column
        type="index"
        lable="#"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="download_url"
        label="图片"
        width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" width="300"/>
        </template>
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
import { fetchBannerList, deleteBanner } from '@/api/banner'

export default {
  data() {
    return {
      isLoading: false,
      bannerList: []
    }
  },

  created() {
    this._getBannerList()
  },

  methods: {
    _getBannerList() {
      this.isLoading = true
      fetchBannerList().then(res => {
        this.isLoading = false
        this.bannerList = res.data
      }).catch(err => {
        this.isLoading = false
      })
    },
    handleSuccess(res) {
      if (res.data.id_list && res.data.id_list.length > 0) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this._getBannerList()
      }
    },
    handleDelete(_idx, banner) {
      this.isLoading = true
      console.log(banner)
      deleteBanner(banner).then(res => {
        const { dbResult, storageResult } = res.data
        this.isLoading = false

        if (dbResult.deleted > 0 && storageResult.delete_list[0].status === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
        this._getBannerList()
        console.log(res)
      }).catch(err => {
        this.isLoading = false
        this.$message.error('删除失败')
      })
    }
  },
}
</script>