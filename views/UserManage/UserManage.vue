<template>
  <div class="manage">
    <el-dialog :visible.sync="isShow" :title="operateType === 'add' ? '新增用户' : '更新用户'">
      <common-form :formLabel="operateFormLabel" :form="operateForm"></common-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <div class="manage-header">
      <el-button type="primary">+ 新增</el-button>
      <common-form inline :formLabel="formLabel" :form="searchForm">
        <el-button type="primary">搜索</el-button>
      </common-form>
    </div>
    <common-table
      :tableLabel="tableLabel"
      :pageTableData="pageTableData"
      :config="config"
      @changePage="getTableData"
      @edit="editUser"
      @del="delUser"
    ></common-table>
  </div>
</template>

<script>
import commonForm from '../../components/commonForm'
import commonTable from '../../components/commonTable'
export default {
  components: {
    commonForm,
    commonTable
  },
  data() {
    return {
      operateType: 'add',
      isShow: false,
      operateForm: {
        //要更新的字段名字
        sno: '',
        name: '',
        gender: '',
        birthday: '',
        mobile: '',
        email: '',
        address: '',
        image: ''
      },
      operateFormLabel: [
        {
          model: 'sno', //绑定的名字
          label: '学号'
        },
        {
          model: 'name',
          label: '姓名'
        },
        {
          model: 'gender',
          label: '性别',
          type: 'select',
          options: [
            {
              label: '男',
              value: '男'
            },
            {
              label: '女',
              value: '女'
            }
          ]
        },
        {
          model: 'birthday',
          label: '生日',
          type: 'date'
        },
        {
          model: 'mobile',
          label: '手机号'
        },
        {
          model: 'email',
          label: '邮箱'
        },
        {
          model: 'address',
          label: '住址'
        },
        {
          model: 'image',
          label: '头像'
        }
      ],
      searchForm: {
        keyword: ''
      },
      formLabel: [
        {
          model: 'keyword',
          label: ''
        }
      ],
      tableData: [],
      pageTableData: [],
      tableLabel: [
        { prop: 'sno', label: '学号' },
        { prop: 'name', label: '姓名' },
        { prop: 'gender', label: '性别' },
        { prop: 'birthday', label: '生日', width: 120 },
        { prop: 'mobile', label: '手机号', width: 120 },
        { prop: 'email', label: '邮箱', width: 160 },
        { prop: 'address', label: '住址', width: 210 },
        { prop: 'image', label: '头像' }
      ],
      config: {
        page: 1,
        pagesize: 10,
        total: 300,
        loading: false
      }
    }
  },
  methods: {
    getTableData() {
      this.config.loading = true
      this.$http
        .get('/students/', {
          params: {
            page: this.config.page
          }
        })
        .then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.data
            this.config.total = this.tableData.length
            // console.log('-->this.config.total', this.config.total)
            // console.log('-->tableData111', this.tableData)
            // this.$elMessage('数据加载成功', 'success')
            this.getPageTableData()
            this.config.loading = false
          } else {
            this.$elMessage(res.data.msg, 'warning')
          }
        })
        .catch(err => {
          console.log('此处应有err')
        })
    },
    getPageTableData() {
      this.pageTableData = []
      for (let i = (this.config.page - 1) * this.config.pagesize; i < this.config.total; i++) {
        this.pageTableData.push(this.tableData[i])
        if (this.pageTableData.length === this.config.pagesize) break
      }
      // console.log('-->pageTableData', this.pageTableData)
    },
    editUser(row) {
      this.operateType = 'edit'
      this.isShow = true
      this.operateForm = row //点击更新的时候,operateForm设置成row里面的参数
      console.log('-->row', row)
    },
    delUser(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.operateForm = row
          this.$http.post('/students/delete/', { sno: row.sno }).then(res => {
            if (res.data.code === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTableData()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    confirm() {
      if (this.operateType === 'edit') {
        this.$http.post('/students/update/', this.operateForm).then(res => {
          console.log(res.data)
          this.isShow = false
          this.getTableData()
        })
      }
    },
    changePage(val) {
      console.log('-->val', val)
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
