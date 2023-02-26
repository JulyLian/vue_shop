<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮   已完成此功能 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <!-- //通过 :data属性为el-table绑定数据源 -->
        <el-table :data="rolelist" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template v-slot="scope">
                    <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'', 'vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环嵌套渲染二级权限 -->
                            <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item3) in item2.children" 
                                    :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- <pre>{{scope.row}}</pre> -->
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template v-slot="scope">
                    <!-- 编辑角色功能已完成 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
                    <!-- 删除角色功能已完成 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table> 

    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
    title="添加角色"
    :visible.sync="addRoleDialogVisible"
    width="50%"
    @close="addRoleDialogClosed"
    >
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="80px">
            <el-form-item label="用户名" prop="roleName">
                <el-input v-model="addRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="用户描述" prop="roleDesc">
                <el-input v-model="addRoleForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
    title="修改角色"
    :visible.sync="editRoleDialogVisible"
    width="50%"
    >
        <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="70px">
            <el-form-item label="角色名称" disabled>
                <el-input v-model="editRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="editRoleForm.roleDesc"></el-input>
            </el-form-item> 
        </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
    title="分配权限"
    :visible.sync="SetRightDialogVisible"
    width="50%"
    @close="SetRightDialogClosed"
    >
        <!-- 树形控件 -->
        <el-tree :data="rightslist" :props="treeProps" show-checkbox 
        node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="SetRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
    data() {
        return {
            //所有角色列表数据
            rolelist: [],
            //控制添加角色对话框的显示与隐藏
            addRoleDialogVisible: false,
            // 添加角色的表单数据
            addRoleForm: {
                roleName: '',
                roleDesc: ''
            },
            // 添加表单的验证规则对象
            addRoleFormRules: {
                roleName: [
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                    { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 5, max: 22, message: '长度在 5 到 22 个字符', trigger: 'blur' }
                ]
            },
            //控制修改角色对话框的显示与隐藏
            editRoleDialogVisible: false,
            editRoleForm: {},
            editRoleFormRules: {},
            //控制分配权限对话框的显示与隐藏
            SetRightDialogVisible: false,
            //所有权限的数据
            rightslist: [],
            //树形控件的属性绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            //默认选中的节点Id值数组
            defKeys: [],
            //当前即将分配权限的角色id
            roleId: ''
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList() {
            const {data: res}= await this.$http.get('roles')
            if(res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败！')
            }
            this.rolelist = res.data
            console.log(this.rolelist)
        },
        // 监听添加角色对话框的关闭事件
        addRoleDialogClosed() {
            this.$refs.addRoleFormRef.resetFields()
        },
        // 点击确定按钮，添加新角色
        addRole() {
            this.$refs.addRoleFormRef.validate(async valid => {
                // console.log(valid)
                if(!valid) return
                // 可以发起添加用户的网络请求
                const { data: res} = await this.$http.post('roles',this.addRoleForm)
                if(res.meta.status !== 201) {
                    this.$message.error('添加角色失败！')
                }
                this.$message.success('添加角色成功！')
                // 隐藏添加角色的对话框
                this.addRoleDialogVisible = false
                // 重新获取角色列表数据
                this.getRolesList()
            })
        },
        // 展示编辑角色的对话框
        async showEditRoleDialog(id) {
            // console.log(id) //可以获得id值
             const {data: res} = await this.$http.get('roles/'+ id)
             if(res.meta.status !== 200) {
                return this.$message.error('获取角色信息失败！')
             }
            //  this.$message.success('获取角色信息成功！')
            //  console.log({data: res})
            //const {data: res}
            this.editRoleForm = res.data
            this.editRoleDialogVisible = true
        },
        async editRoleInfo() {
            //console.log(this.editRoleForm)  //返回的数据有roleId【注意：roleId不能写成RoleId =_=】
            const {data: res} = await this.$http.put('roles/' + this.editRoleForm.roleId, {
                roleName: this.editRoleForm.roleName,
                roleDesc: this.editRoleForm.roleDesc
            })
            if(res.meta.status !== 200) {
                return this.$message.error('更新角色信息失败！')
            }
            this.editRoleDialogVisible = false
            this.getRolesList()
            this.$message.success('更新角色信息成功！')
        },
        
        //根据id删除角色信息
        async removeRoleById(id) {
            // console.log(id)
            //弹框询问是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            console.log(confirmResult)
            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消了删除，则返回值为字符串 cancel
            if (confirmResult !== 'confirm') {
            return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('roles/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败！')
            }
            this.$message.success('删除用户成功！')
            this.getRolesList()
        },
        //根据id删除对应的权限
        async removeRightById(role,rightId){
            //弹框提示用户是否要删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm') {
                return this.$message.info('取消了删除！')
            }
            // console.log('确认删除')
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200) {
                return this.$message.error('删除权限失败')
            }
            // this.getRolesList() //不建议
            role.children = res.data  //响应数据说明:返回的data, 是当前角色下最新的权限数据

        },
        //展示分配权限的对话框
        async showSetRightDialog(role) {
            this.roleId = role.id
            //获取所有权限的数据
            const {data: res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200) {
                return this.$message.error('获取权限数据失败！')
            }
            //把获取到的权限数据保存到data中
            this.rightslist = res.data
            console.log(this.rightslist)
            //递归获取三级节点的id
            this.getLeafKeys(role,this.defKeys)
            this.SetRightDialogVisible = true
        },
        //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
        getLeafKeys(node, arr) {
            //如果当前node节点不包含children属性，则是三级节点
            if(!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        //监听分配权限对话框的关闭事件
        SetRightDialogClosed() {
            this.defKeys = []
        },
        //点击为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),  //...是展开运算符
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys)
            const idStr = keys.join(',')
            const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{ rids: idStr })
            if(res.meta.status !== 200) {
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功！')
            this.getRolesList()
            this.SetRightDialogVisible = false
        }
        
    }

}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
// bdtop和bdbottom不能写在.el-tag{}里面
.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}

</style>