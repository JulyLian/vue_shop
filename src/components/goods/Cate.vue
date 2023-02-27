<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 添加分类 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>

        <!-- 表格区域 -->
        <el-table
        :data="catelist"
        row-key="cat_id"
        :tree-props="{children: 'children'}"
        border
        >
            <!-- <el-table-column type="index" label="#"></el-table-column> -->
            <el-table-column label="分类名称">
                <template v-slot="scope">{{scope.row.cat_name}}</template>
            </el-table-column>
            <el-table-column label="是否有效">
                <template v-slot="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: #67C23A;"></i>
                    <i class="el-icon-error" v-else style="color: #F56C6C;"></i>
                </template>
            </el-table-column> 
            <el-table-column label="排序">
                <template v-slot="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <!-- 编辑功能已完成 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
                    <!-- 删除功能已完成 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
                </template>
            </el-table-column>   
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>

    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
    title="添加分类"
    :visible.sync="addCateDialogVisible"
    width="50%"
    @close="addCateDialogClosed"
    >
    <!-- 添加分类名单 -->
    <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <!-- options用来指定数据源，props用来指定配置对象 -->
            <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover', ...cascaderProps, checkStrictly:true}"
            @change="parentCateChanged"
            clearable>
            </el-cascader>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 添加编辑对话框 -->
    <el-dialog
    title="修改分类"
    :visible.sync="editCateDialogVisible"
    width="50%"
    >
    <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="70px">
        <el-form-item label="分类名称" disabled>
            <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否有效">
            <el-input v-model="editCateForm.cat_level"></el-input>
        </el-form-item>
        <el-form-item label="排序">
            <el-input v-model="editCateForm.cat_level"></el-input>
        </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
    data() {
        return {
            //查询条件
            querInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            //商品分类的数据列表，默认为空
            catelist: [],
            //总数据条数
            total: 0,
            //控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            //添加分类的表单数据对象
            addCateForm: {
                //将要添加的分类名称
                cat_name: '',
                //父级分类的id
                cat_pid: 0,
                //分类的等级，默认添加的是1级分类
                cat_level: 0
            },
            //添加分类的表单的验证规则
            addCateFormRules: {
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            //父级分类的列表
            parentCateList: [],
            //选中的父级分类的Id数组
            selectedKeys: [],
            cascaderProps: {
                value: 'cat_id', 
                label: 'cat_name', 
                children: 'children'
            },
            //控制修改分类对话框的显示与隐藏
            editCateDialogVisible: false,
            //查询到的分类信息对象
            editCateForm: {},
            editCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            }
            
        }
    },
    created() {
        this.getCateList()     
    },
    methods: {
        //获取商品分类数据
        async getCateList() {
            const {data: res}= await this.$http.get('categories',{params: this.querInfo})
            if(res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            // console.log(res.data)
            //把数据列表赋值给catelist
            this.catelist = res.data.result
            this.total = res.data.total
        },
        //监听pagesize改变
        handleSizeChange(newSize) {
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        //监听pagenum改变
        handleCurrentChange(newPage) {
            this.querInfo.pagenum = newPage
            this.getCateList()
        },
        //点击确定按钮，展示添加分类的对话框
        showAddCateDialog() {
            //先获取父级分类的数据列表
            this.getParentCateList()
            //再展示出对话框
            this.addCateDialogVisible = true
        },
        //获取父级分类的数据列表
        async getParentCateList() {
            const {data: res} = await this.$http.get('categories', {params: { type: 2 }})
            if(res.meta.status !== 200) {
                return this.$message.error('获取父级分类的数据失败！')
            }
            // console.log(res.data)
            this.parentCateList = res.data
        },
        //选择项发生变化触发此函数
        parentCateChanged() {
            console.log(this.selectedKeys)
            //如果selectedKeys数组中的length大于0，证明选中了父级分类
            //反之，就说明没有选中任何父级分类
            if(this.selectedKeys.length > 0) {
                //父级分类的Id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                //为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else {
                this.addCateForm.cat_pid = 0
                //为当前分类的等级赋值
                this.addCateForm.cat_level = 0
            }
        },
        //点击确定按钮，添加新的分类
        addCate() {
            // console.log(this.addCateForm)
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const {data: res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201) {
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        //监听对话框的关闭事件，重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        //根据Id删除对应的用户信息
         async removeCateById(cat_id) {
            // console.log(cat_id)
            //弹框询问是否删除
            const confirmResult =  await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)
            //如果用户确认删除，则返回值为字符串 confirm
            //如果用户取消删除，则返回值为字符串 cancel
            if(confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            // console.log('确认了删除')
            const {data: res} = await this.$http.delete('categories/' + cat_id)
            if(res.meta.status !== 200) {
                return this.$message.error('删除商品分类失败！')
            }
            this.$message.success('删除商品分类成功！')
            this.getCateList()
        },
        //展示编辑商品分类的对话框
        async showEditCateDialog(cat_id) {
            const {data: res} = await this.$http.get('categories/' + cat_id)
            if(res.meta.status !== 200) {
                return this.$message.error('获取分类信息失败！')
             }
            this.editCateForm = res.data
            // console.log(this.editCate)
            this.editCateDialogVisible = true
        },
        //修改角色信息并提交
        async editCateInfo() {
            const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {cat_name: this.editCateForm.cat_name})
            if(res.meta.status !== 200) {
                return this.$message.error('更新分类信息失败！')
            }
            this.editCateDialogVisible = false
            this.getCateList()
            this.$message.success('更新分类信息成功！')
        }
            
    }

}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}

</style>