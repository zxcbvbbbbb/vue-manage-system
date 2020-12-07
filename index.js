
const app = new Vue({
    el: '#app',
    data() {
        const rulesSno = (rule, value, callback) => {
            if (this.isEdit) {
                callback()
            }
            axios.post(
                this.baseURL + 'sno/check/',
                {
                    'sno': value
                }
            ).then((res) => {
                if (res.data.code == 1) {
                    if (res.data.exists) {
                        callback(new Error('学号已存在'))
                    }
                    else {
                        callback()
                    }
                }
            })
                .catch((err) => {
                    callback(new Error('学号校验后端异常'))
                })
        }
        return {
            msg: 'hello,xdr',
            students: [],
            pageStudents: [],
            total: 0,
            currentpage: 1,
            pagesize: 10,
            baseURL: "http://192.168.43.154:8000/",
            inputStr: '',
            dialogVisible: false,
            imageUrl: '',
            isEdit: false,
            isView: false,

            studentForm: {
                sno: '',
                name: '',
                gender: '',
                birthday: '',
                mobile: '',
                email: '',
                address: '',
                image: '',
                imageUrl: ''
            },
            rules: {
                sno: [
                    { required: true, message: "学号不能为空", trigger: "blur" },
                    { pattern: /^[9][5]\d{3}$/, message: "学号必须是95开头的五位数", trigger: 'blur' },
                    { validator: rulesSno, trigger: "blur" }
                ],
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '姓名必须是2-5个汉字', trigger: 'blur' },
                ],
                gender: [
                    { required: true, message: '性别不能为空', trigger: 'change' },
                ],
                birthday: [
                    { required: true, message: '出生日期不能为空', trigger: 'change' },
                ],
                mobile: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' },
                    { pattern: /^[1][35789]\d{9}$/, message: '手机号码必须要符合规范', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
                    { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱地址必须要符合规范', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '家庭住址不能为空', trigger: 'blur' },
                ]
            },
            dialogTitle: "",
        }
    },

    mounted() {
        this.getStudents();
    },
    methods: {
        getStudents: function () {
            let that = this
            axios
                .get(this.baseURL + "students/")
                .then(function (res) {
                    if (res.data.code == 1) {
                        that.students = res.data.data
                        that.total = res.data.data.length;
                        that.getPageStudents(),
                            that.$message({
                                showClose: true,
                                message: '数据加载成功',
                                type: 'success'
                            });
                    } else {
                        that.$message.error(res.data.msg)
                    }

                })
                .catch(function (err) {

                    console.log(err)
                })
        },
        getPageStudents() {
            //清空pageStudents中的数据
            this.pageStudents = [];
            //获得当前页的数据
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                //遍历数据添加到pageStudent中
                this.pageStudents.push(this.students[i]);
                //判断是否达到一页的要求
                if (this.pageStudents.length === this.pagesize) break;
            }
        },
        queryStudents() {
            let that = this
            axios.post(
                that.baseURL + 'students/query/',
                {
                    inputstr: that.inputStr,
                })
                .then(function (res) {
                    console.log(res)
                    if (res.data.code == 1) {
                        that.students = res.data.data,
                            that.total = res.data.data.length,
                            that.getPageStudents(),
                            that.$message({
                                showClose: true,
                                message: '数据加载成功',
                                type: 'success'
                            });
                    } else {

                        that.$message.error(res.data.msg)
                    }

                })
                .catch(function (err) {

                    console.log('-->1', err)
                    that.$message.error("获取后端查询结果出现异常！");
                })
        },
        addStudent() {
            this.dialogVisible = true
        },
        addStudent(row) {
            this.dialogTitle = "添加学生明细"
            this.dialogVisible = true
        },
        getImangeBySno(sno) {
            for (student of this.students) {
                console.log('-->student sno',student.sno)
                if (student.sno == sno) {
                    console.log('-->image',student.image)
                    return student.image
                }
            }
        },
        viewStudent(row) {
            this.dialogTitle = "查看学生明细"
            this.dialogVisible = true,
                this.isView = true
            this.studentForm = JSON.parse(JSON.stringify(row))
            this.studentForm.image = this.getImangeBySno(row.sno)
            this.studentForm.imageUrl = this.baseURL + 'media/' + this.studentForm.image
        },
        updateStudent(row) {
            this.dialogTitle = "修改学生明细"
            this.dialogVisible = true,
                this.isEdit = true,
                this.studentForm = JSON.parse(JSON.stringify(row))
                this.studentForm.image = this.getImangeBySno(row.sno)
                this.studentForm.imageUrl = this.baseURL + 'media/' + this.studentForm.image
        },
        closeDialogForm(formName) {
            this.$refs[formName].resetFields();
            this.studentForm.sno = "";
            this.studentForm.name = "";
            this.studentForm.gender = "";
            this.studentForm.birthday = "";
            this.studentForm.mobile = "";
            this.studentForm.email = "";
            this.studentForm.address = "";
            this.studentForm.image = "";
            this.studentForm.imageUrl = "";
            this.dialogVisible = false;
            this.isEdit = false;
            this.isView = false;
        },
        uploadPicturePost(file) {
            let that = this
            let fileReq = new FormData()
            fileReq.append('avatar', file.file)
            axios({
                method: 'post',
                url: that.baseURL + 'upload/',
                data: fileReq
            }).then(res => {
                if (res.data.code == 1) {
                    that.studentForm.image = res.data.name
                    console.log('-->image', that.studentForm.image)
                    that.studentForm.imageUrl = that.baseURL + 'media/' + res.data.name
                    console.log('-->imageUrl', that.studentForm.imageUrl)
                } else {
                    that.$message.error(res.data.msg)
                }

            }).catch(err => {
                console.log(err)
                that.$message.error('上传头像出现异常!')
            })
        },
        uploadExcelPost(file) {
            let that = this
            //实例化一个formdata
            //定义一个FormData类
            let fileReq = new FormData();
            //把照片穿进去
            fileReq.append('excel', file.file);
            //使用Axios发起Ajax请求
            axios(
                {
                    method: 'post',
                    url: that.baseURL + 'excel/import/',
                    data: fileReq
                }
            ).then(res => {
                // 根据code判断是否成功
                if (res.data.code === 1) {
                    //把照片给image 
                    that.students = res.data.data;
                    //计算总共多少条
                    that.total = res.data.data.length;
                    //分页
                    that.getPageStudents();
                    //弹出框体显示结果 
                    this.$alert('本次导入完成! 成功：' + res.data.success +'失败：'+ res.data.error 
                    , '导入结果展示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.$message({
                                type: 'info',
                                message: "本次导入失败数量为：" + res.data.error + ",具体的学号："+res.data.errors,
                            });
                        }
                    });
                    //把失败明细打印
                    console.log("本次导入失败数量为：" + res.data.error + ",具体的学号：");
                    console.log(res.data.errors);
                } else {
                    //失败的提示！
                    that.$message.error(res.data.msg);
                }

            }).catch(err => {
                console.log(err);
                that.$message.error("上传Excel出现异常！");
            })

        },
        submitStudentForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.isEdit) {
                        this.submitUpdateStudent();
                    } else {
                        this.submitAddStudent();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitAddStudent() {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'students/add/', that.studentForm)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        //获取所有学生的信息
                        that.students = res.data.data;
                        //获取记录条数
                        that.total = res.data.data.length;
                        //获取分页信息
                        that.getPageStudents();
                        //提示：
                        that.$message({
                            message: '数据添加成功！',
                            type: 'success'
                        });
                        //关闭窗体
                        this.closeDialogForm('studentForm');
                    } else {
                        //失败的提示！
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err);
                    that.$message.error("获取后端查询结果出现异常！");
                })
        },
        submitUpdateStudent() {
            //定义that
            let that = this;
            //执行Axios请求
            axios
                .post(that.baseURL + 'students/update/', that.studentForm)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        //获取所有学生的信息
                        that.students = res.data.data;
                        //获取记录条数
                        that.total = res.data.data.length;
                        //获取分页信息
                        that.getPageStudents();
                        //提示：
                        that.$message({
                            message: '数据修改成功！',
                            type: 'success'
                        });
                        //关闭窗体
                        this.closeDialogForm('studentForm');
                    } else {
                        //失败的提示！
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err);
                    that.$message.error("修改时获取后端查询结果出现异常！");
                })

        },
        //删除一条学生记录 
        deleteStudent(row) {
            //等待确认
            this.$confirm('是否确认删除学生信息【学号：' + row.sno + '\t姓名：' + row.name + '】信息？',
                '提示', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认删除响应事件
                let that = this
                //调用后端接口
                axios.post(that.baseURL + 'students/delete/', { sno: row.sno })
                    .then(res => {
                        if (res.data.code === 1) {
                            //获取所有学生信息
                            that.students = res.data.data;
                            //获取记录数
                            that.total = res.data.data.length;
                            //分页 
                            that.getPageStudents();
                            //提示
                            that.$message({
                                message: '数据删除成功！',
                                type: 'success'
                            });
                        } else {
                            that.$message.error(res.data.msg);
                        }
                    })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //分页时修改每页的行数
        handleSizeChange(size) {
            //修改当前每页数据行数
            this.pagesize = size;
            //数据重新分页
            this.getPageStudents();
        },
        //调整当前的页码
        handleCurrentChange(pageNumber) {
            //修改当前的页码
            this.currentpage = pageNumber;
            //数据重新分页
            this.getPageStudents();
        },
    },


})
