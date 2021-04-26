<template>
  <div>
    <el-form ref="form" :model="detail" label-width="80px" v-loading="isLoading">
      <el-form-item label="歌单名称">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="detail.copywriter"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDetail, updateDetail } from '@/api/playlist'

export default {
  data() {
    return {
      isLoading: false,
      detail: {}
    }
  },
  created() {
    this.isLoading = true
    getDetail({
      id: this.$route.params.id
    }).then(res => {
      this.detail = res.data
      this.isLoading = false
    }).catch(() => {
      this.$alert('获取歌单详情失败', '错误提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.go(-1)
        }
      });
      this.isLoading = false
    })
  },
  methods: {
    onSubmit() {
      this.isLoading = true
      updateDetail(this.detail).then(res => {
        this.isLoading = false
        
        const { modified, matched } = res.data
        if (modified > 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          });
          this.$router.go(-1)
        } else if (modified === 0 && matched > 0) {
          this.$message('无新内容更新');
        } else {
          this.$message({
            message: '更新失败',
            type: 'warning'
          });
        }
      }).catch(err => {
        this.$message.error('更新失败');
        this.$router.go(-1)
      })
    }
  },
}
</script>

<style>

</style>