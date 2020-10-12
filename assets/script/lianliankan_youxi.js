// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const ditu_shengchengqi = require("./ditu_shengchengqi");

cc.Class({
    extends: cc.Component,

    properties: {

        shuiguo: {
            type: cc.Prefab,
            default: null
        },
        focus: {
            type: cc.Prefab,
            default: null
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.di_tu_arr = this.di_tu();
        // this.di_tu_arr = this.di_tu_arr[0][0] = 0;
        // let k = this.di_tu_arr.length;
        this.shua_xing_ditu(this.di_tu_arr);


        //测试下函数好不好用
        let qidian = { hang: 3, lie: 0 };
        let zhongdian = { hang: 0, lie: 5 };

        // let flag = this.shui_ping_jiance(qidian, zhongdian, this.di_tu_arr);
        // let flag1 = this.shu_zhi_jiance(qidian, zhongdian, this.di_tu_arr);
        let flag2 = this.yige_guaidian_jiance(qidian, zhongdian, this.di_tu_arr);
    }
    ,
    di_tu() {
        //这个地图就代表 了水果的分布对不对?
        //要让这里生成  成双的水果
        //也就是需要一个能生成 成双水果的方法 怎么写?不知道 先生成一半, 另一半复制先前的一半就先了
        //比如 先生成 0,1,2,3  0,1,2,3
        //那把一半生成两遍 就是成双了
        //那我的需求就是 传进地图的大小 你能生成一个能消除干净的二维数组
        //比如 我传 3,2 你要生成
        //0,1
        //0,1 ????位置什么的
        //0,0
        let di_tu_arr = ditu_shengchengqi.gen_rand2_arr(9, 4, 3);
        // let di_tu_arr = [
        //     [1, 0, 0, 0, 0, 1],
        //     [2, 0, 4, 8, 5, 0],
        //     [0, 4, 5, 6, 8, 0],
        //     [1, 0, 2, 3, 5, 2]];

        // let hang = 3;
        // let lie = 2;
        // let arr = this.gen_2dimension_arr(hang, lie);
        // // [hang][lie];
        // arr[0][0] = [0, 1, 0];
        // let h = arr[0][0];
        return di_tu_arr;
    },
    //产生一个二维数组给我
    gen_2dimension_arr(hang, lie) {
        let arr = [];
        for (var i = 0; i < hang; i++) {
            arr[i] = [];
            for (var j = 0; j < lie; j++) {
                arr[i][j] = null;
            }
        }
        return arr;
    },
    //刷新地图
    shua_xing_ditu(di_tu_arr) {
        let origin_y = -400;
        let origin_x = -270;
        //别人只知道用这个方法就能显示地图, 你不能把删除原结点的任务交给别人 
        //别人又不知道你是怎么做的 所以你要自己处理旧结点

        //这条规则适用所有情况
        //1. 先清除
        //2. 再创建 永远都成立
        if (this.xing_jie_dian) {
            this.xing_jie_dian.destroy();
            this.xing_jie_dian = null;

        }
        //所有水果块都是放在这个新结点上的 
        //所以如果需要放一个焦点 在 水果块上面 就需要把这个焦点放在这个结点上
        this.xing_jie_dian = new cc.Node();
        this.xing_jie_dian.parent = this.node;
        //let di_tu_arr = this.di_tu();
        //this.di_tu_arr = di_tu_arr;
        this.shuiguo_arr = [];
        let a = di_tu_arr.length;
        for (let i = 0; i < di_tu_arr.length; i++) {
            this.shuiguo_arr[i] = [];
            for (let j = 0; j < di_tu_arr[i].length; j++) {
                let shuiguo = cc.instantiate(this.shuiguo);
                //每生成一个块的时候把连连看游戏的脚本传进去 this 就是指连连看游戏的脚本
                shuiguo.getComponent('shuiguo').ba_lianlian_kan_youxi_jiaoben_chuanjinlai(this, i, j);
                this.shuiguo_arr[i][j] = shuiguo;
                if (di_tu_arr[i][j] != 0) {
                    shuiguo.getComponent('shuiguo').setType(di_tu_arr[i][j]);
                    this.xing_jie_dian.addChild(shuiguo);
                    shuiguo.y = origin_y + i * 120;
                    shuiguo.x = origin_x + j * 110;
                } else {
                    shuiguo.y = origin_y + i * 120;
                    shuiguo.x = origin_x + j * 110;
                }
            }
        }

        //因为xin_jiedian 每次都是重新创建的 所以 这个焦点的位置要记录一下
        //添加焦点

        let focus_node = cc.instantiate(this.focus);
        focus_node.zIndex = 1000;
        this.xing_jie_dian.addChild(focus_node);
        this.m_move_focus = focus_node;
        if (this.m_move_focus_pos) {
            this.m_move_focus.x = this.m_move_focus_pos.x;
            this.m_move_focus.y = this.m_move_focus_pos.y;
        } else {
            this.m_move_focus_pos = cc.v2(this.m_move_focus.x, this.m_move_focus.y);
        }
        //设置它停在第一个水果块上
        //this.set_move_focus_with_fruit(this.shuiguo_arr[0][1]);
    },

    //设置那个移动焦点在哪个水果块上
    set_move_focus_with_fruit(fruit_node, use_act) {
        //因为水果块和 移动焦点的 父结点都是一样的(this.xing_jie_dian) 即它们在同个坐标系下, 所以不需要做坐标转换
        //换句话说, 设置移动焦点到 水果的位置 就会是 焦点到水果
        //焦点原来的位置
        // let prev_x = this.m_move_focus.x;
        // let prev_y = this.m_move_focus.y;
        this.m_move_focus_pos = cc.v2(fruit_node.x, fruit_node.y);
        //如果使用动作慢慢移动
        if (use_act) {
            //移动 动作
            //动作加上 ease(缓冲的意思)
            let act = cc.moveTo(0.5, cc.v2(fruit_node.x, fruit_node.y));
            act.easing(cc.easeOut(2.0));//创建 easeOut 缓动对象，由快到慢。
            //act.easing(cc.easeIn(2.0));//创建 easeIn 缓动对象，由慢到快。
            //让焦点 运行动作
            this.m_move_focus.runAction(act);
        }
        else {//立即设置到指定点
            this.m_move_focus.x = fruit_node.x;
            this.m_move_focus.y = fruit_node.y;
        }



    },
    //被点击的行列
    bei_dian_ji_de_hang_lie(hang, lie) {
        if (this.shuiguo_arr[hang][lie].getComponent('shuiguo').wo_bei_dian_zhong_le) {
            if (this.shuiguo1 == null) {
                this.shuiguo1 = this.shuiguo_arr[hang][lie];
                this.hang = hang;
                this.lie = lie;
                return;
            } else if (this.shuiguo_arr[hang][lie] !== this.shuiguo1) {
                if (this.shuiguo1.getComponent('shuiguo').lei_xing === this.shuiguo_arr[hang][lie].getComponent('shuiguo').lei_xing) {
                    // for (let i = 0; i < this.di_tu_arr.length; i++) {
                    //     for (let j = 0; j < this.di_tu_arr[i].length; j++) {
                    //         if ((i == hang || i == this.hang) && (j == lie || j == this.lie)) {
                    //             this.di_tu_arr[i][j] = 0;
                    //         }
                    //     }
                    // }
                    this.di_tu_arr[this.hang][this.lie] = 0;
                    this.di_tu_arr[hang][lie] = 0;
                    this.shan_chu_jie_dian();
                    this.shua_xing_ditu(this.di_tu_arr);
                }
                this.shuiguo_arr[this.hang][this.lie].getComponent('shuiguo').wo_bei_dian_zhong_le = false;
                this.shuiguo_arr[hang][lie].getComponent('shuiguo').wo_bei_dian_zhong_le = false;
                this.shuiguo1 = null;
            }
        }
    },
    //删除节点
    shan_chu_jie_dian() {
        this.xing_jie_dian.removeFromParent(false);
    },
    //写个方法 用于处理有水果块被点中了
    you_shuiguo_bei_dianzhongle() {
        //遍历水果数组 看里面哪个块的 wo_bei_dian_zhong_le 变量为true

        /**
         * 
         */

        //所以 只需要处理两个水果块的情况
        let shuiguo1 = this.shuiguo1;

        //不用找了
        let buyong_zhaole = false;
        for (let i = 0; i < this.shuiguo_arr.length; i++) {
            for (let j = 0; j < this.shuiguo_arr[i].length; j++) {
                let k = this.shuiguo_arr[i][j].getComponent('shuiguo').wo_bei_dian_zhong_le;
                if (k) {
                    /**
                     * 这个块被点中了,,   要处理是不是有两一样的块
                     */

                    //1.如果之前没有点击水果块, 那这次点击的水果块就记为 点击的水果块1
                    //如果是这种情况 拉下来就不用再循环了
                    if (this.shuiguo1 == null) {
                        this.shuiguo1 = this.shuiguo_arr[i][j];
                        buyong_zhaole = true;
                        this.m_move_focus.active = true;
                        this.set_move_focus_with_fruit(this.shuiguo1, false);
                        // this.shuiguo_focus.getComponent('shuiguo').focus(false);
                        // this.shuiguo_focus = null;
                        break;
                    }
                    //2.如果之前有点击水果块那么 在？
                    //这里有个问题 就是水果1 可能和 shuiguo_arr[i][j] 是同一个水果块
                    //所以在这里我们只判断跟水果1 不同的块 所以这里进来消除的 必然是第二个块引起的
                    else if (this.shuiguo_arr[i][j] !== this.shuiguo1) {
                        this.shuiguo_focus = this.shuiguo_arr[i][j];
                        if (this.shuiguo1.getComponent('shuiguo').lei_xing === this.shuiguo_arr[i][j].getComponent('shuiguo').lei_xing) {
                            //先改数据 再通过数据刷新界面 不是直接操作水果块 水果块的显隐完全由地图数据控制
                            let i1 = this.shuiguo1.getComponent('shuiguo').hang;
                            let j1 = this.shuiguo1.getComponent('shuiguo').lie;
                            //要检测能否消除后再消除
                            if (this.jiance({ hang: i, lie: j }, { hang: i1, lie: j1 }, this.di_tu_arr)) {
                                this.di_tu_arr[i][j] = 0;
                                //第一个的行列

                                this.di_tu_arr[i1][j1] = 0;
                                //这只改了一个
                                this.shua_xing_ditu(this.di_tu_arr);
                                this.m_move_focus.active = false;
                                this.shuiguo1 = null;
                            } else {
                                //检测完不能消除 要把它们的状态置回来
                                this.shuiguo1.getComponent('shuiguo').wo_bei_dian_zhong_le = false;
                                this.shuiguo_arr[i][j].getComponent('shuiguo').wo_bei_dian_zhong_le = false;
                                //this.set_move_focus_with_fruit(this.shuiguo_arr[i][j], true);
                                this.set_move_focus_with_fruit(this.shuiguo_focus, true);
                                this.shuiguo1.getComponent('shuiguo').Stop_action();
                                this.shuiguo1 = this.shuiguo_focus;

                                //this.shuiguo_arr[i][j].getComponent('shuiguo').focus(false);
                            }

                            //this.shuiguo1.getComponent('shuiguo').ying_chang();
                            //this.shuiguo_arr[i][j].getComponent('shuiguo').ying_chang();
                            //如果消除了 那存的 shuiguo1 要清除掉
                            //如果消除了 就不用找了
                        } else {
                            this.shuiguo1.getComponent('shuiguo').wo_bei_dian_zhong_le = false;
                            this.shuiguo_arr[i][j].getComponent('shuiguo').wo_bei_dian_zhong_le = false;
                            //this.shuiguo1.getComponent('shuiguo').focus(false);
                            this.set_move_focus_with_fruit(this.shuiguo_arr[i][j], true);
                            this.shuiguo1.getComponent('shuiguo').Stop_action();
                            this.shuiguo1 = this.shuiguo_focus;
                            // 如果两不同 那存的 shuiguo1 要清除掉
                            //如果两都消除了 不用找了
                        }

                        //所以 反正都要清除掉 shuiguo1 

                        //this.shuiguo1 = null;
                        //2.1 如果两个水果块相同 消除掉

                        //2.2 如果两个水果块不同  那么取消两个水果块的点击状态

                        //所以 反正都是不要找了
                        buyong_zhaole = true;
                        break;
                    }
                    //不存在 else 3
                    //3. 点了两个水果块, 要么都消除了, 要么都取消了 , 不存在三个水果块被点中的情况
                }
            }
            if (buyong_zhaole) {
                break;
            }
        }
    },

    //接下来处理 能删除的规则 是连线的转角最多两个 这样是不能删除的


    //第一种情况


    //水平检测
    //需要,传入 起点, 终点,  还有地图
    //水平 就是行相同, 列不相同
    //返回为true 表示 可以消除,成立
    //再加个边界检测
    shui_ping_jiance(qidian, zhongdiang, di_tu_arr) {
        //如果行不相同就不用看了 直接返回false
        if (qidian.hang !== zhongdiang.hang) {
            return false;
        }

        let liangge_doubushi_guaidian = !qidian.shi_guai_dian && !zhongdiang.shi_guai_dian;
        //如果是不同的水果块 也不用看了
        if ((di_tu_arr[qidian.hang][qidian.lie] !==
            di_tu_arr[zhongdiang.hang][zhongdiang.lie]) && liangge_doubushi_guaidian) {
            return false;
        }

        //行相同 水果也相同  还要看它们中间有没有别的水果块
        //从小的列 到大的列看
        //两者中比较小的列
        let liang_zhe_zhong_bijiao_xiao_de_lie = Math.min(qidian.lie, zhongdiang.lie);
        //两者中比较大的列
        let liang_zhe_zhong_bijiao_da_de_lie = Math.max(qidian.lie, zhongdiang.lie);
        //如果两个块都不是拐点 且处理边界上 那中间的块不算
        if (liangge_doubushi_guaidian) {
            //是边界
            if (qidian.hang === 0 || qidian.hang === di_tu_arr.length - 1) {
                return true;
            }
        }

        for (let i = liang_zhe_zhong_bijiao_xiao_de_lie + 1; i < liang_zhe_zhong_bijiao_da_de_lie; i++) {
            //只要有一个水果块就返回false
            if (di_tu_arr[qidian.hang][i] !== 0) {
                return false;
            }
        }




        //所有其它情况都没有返回false  说明这个水平规则是成立的
        return true;

    },

    shu_zhi_jiance(qidian, zhongdiang, di_tu_arr) {
        //如果列不相同就不用看了 直接返回false
        if (qidian.lie !== zhongdiang.lie) {
            return false;
        }

        //如果是不同的水果块(且两个点中没有一个是拐点) 也不用看了
        //

        let liangge_doubushi_guaidian = !qidian.shi_guai_dian && !zhongdiang.shi_guai_dian;
        if ((di_tu_arr[qidian.hang][qidian.lie] !==
            di_tu_arr[zhongdiang.hang][zhongdiang.lie]) && liangge_doubushi_guaidian) {
            return false;
        }

        //行相同 水果也相同  还要看它们中间有没有别的水果块
        //从小的列 到大的列看
        //两者中比较小的列
        let liang_zhe_zhong_bijiao_xiao_de_hang = Math.min(qidian.hang, zhongdiang.hang);
        //两者中比较大的列
        let liang_zhe_zhong_bijiao_da_de_hang = Math.max(qidian.hang, zhongdiang.hang);

        //如果两个块都不是拐点 且是理边界上 那中间的块不算
        if (liangge_doubushi_guaidian) {
            //是边界
            if (qidian.lie === 0 || qidian.lie === di_tu_arr[0].length - 1) {
                return true;
            }
        }

        for (let i = liang_zhe_zhong_bijiao_xiao_de_hang + 1; i < liang_zhe_zhong_bijiao_da_de_hang; i++) {
            //只要有一个水果块就返回false 行在前 还是列在前? 行是变数 列是固定
            if (di_tu_arr[i][qidian.lie] !== 0) {
                return false;
            }
        }


        //所有其它情况都没有返回false  说明这个水平规则是成立的
        return true;
    },

    //一个拐点的检测

    yige_guaidian_jiance(A, B, di_tu_arr) {
        //注意这里的水果检测和竖直检测里面已经包括了有没有其它水果块的检测
        //所以不用再判断它们中间有没有别的水果果块

        //假设先看 A->C-B 这条线
        //找到C点 C点就是 B.hang  A.lie 组成的新点
        //如果满足 A->C 的竖直检测 且 满足C->B的水平检测 则通过

        //找到C点 有问题吗?mei 有问题吗?mei
        let C = { lie: A.lie, hang: B.hang };
        //只有是空格的时候才能是拐点
        C.shi_guai_dian = di_tu_arr[C.hang][C.lie] === 0;
        if (this.shu_zhi_jiance(A, C, di_tu_arr) && this.shui_ping_jiance(C, B, di_tu_arr)) {
            return true;
        }

        //如果上面的没返回true 出去
        //说明上面那条A->C-B 不通

        //这时候按同样的方法检测 A->D->B 你自己试试
        //如果C 点没通过 就要看D点
        //找到D 点 D就是 A.hang  B.lie 组成的新点
        //如果满足A->D 的检测 且满足 D->B 的竖直检测 则通过
        let D = { hang: A.hang, lie: B.lie };
        D.shi_guai_dian = di_tu_arr[D.hang][D.lie] === 0;
        if (this.shu_zhi_jiance(B, D, di_tu_arr) && this.shui_ping_jiance(A, D, di_tu_arr)) {
            return true;
        }

        //如果 C,D 都不通过 那么 这个拐点不通过
        return false;
    },

    //两个拐点的检测
    liangge_guaidian_jiance(A, B, di_tu_arr) {
        //四条线上的所有点
        let suo_youdian = [];

        let hangshu = di_tu_arr.length;
        let lieshu = di_tu_arr[0].length;
        //1. A 所在行的 所有点
        for (let i = 0; i < lieshu; i++) {
            //非A 的空点才加入
            if (i != A.lie && di_tu_arr[A.hang][i] === 0) {
                suo_youdian.push({ hang: A.hang, lie: i, shi_guai_dian: true });
            }
        }
        //2. A 所在列的 所有点
        for (let i = 0; i < hangshu; i++) {
            //非A 的空点才加入
            if (i != A.hang && di_tu_arr[i][A.lie] === 0) {
                suo_youdian.push({ hang: i, lie: A.lie, shi_guai_dian: true });
            }
        }
        //3. B 所在行的 所有点
        for (let i = 0; i < lieshu; i++) {
            //非A 的空点才加入
            if (i != B.lie && di_tu_arr[B.hang][i] === 0) {
                suo_youdian.push({ hang: B.hang, lie: i, shi_guai_dian: true });
            }
        }

        //4. B 所在列的 所有点
        for (let i = 0; i < hangshu; i++) {
            //非A 的空点才加入
            if (i != B.hang && di_tu_arr[i][B.lie] === 0) {
                suo_youdian.push({ hang: i, lie: B.lie, shi_guai_dian: true });
            }
        }

        for (let j = 0; j < suo_youdian.length; j++) {
            let C = suo_youdian[j];

            // A 点至 C 点通过水平或垂直检测，C 点至 B 点可通过一个拐角连接
            let A_C_shuiping = this.shui_ping_jiance(A, C, di_tu_arr);
            let A_C_shuzhi = this.shu_zhi_jiance(A, C, di_tu_arr);
            if (A_C_shuiping || A_C_shuzhi) {
                let C_B_guaidian = this.yige_guaidian_jiance(C, B, di_tu_arr)
                if (C_B_guaidian) {
                    return true;
                }
            }

            // A 点至 C 点可通过一个拐角连接，C 点至 B 点通过水平或垂直连接
            let C_B_shuiping = this.shui_ping_jiance(C, B, di_tu_arr);
            let C_B_shuzhi = this.shu_zhi_jiance(C, B, di_tu_arr);
            if (C_B_shuiping || C_B_shuzhi) {
                let A_C_guaidian = this.yige_guaidian_jiance(A, C, di_tu_arr);
                if (A_C_guaidian) {
                    return true;
                }
            }
        }

        return false;
    },


    //完整的检测算法
    jiance(A, B, di_tu_arr) {
        //水平检测成功返回
        if (this.shui_ping_jiance(A, B, di_tu_arr)) {
            return true;
        }

        //竖直检测成功返回
        if (this.shu_zhi_jiance(A, B, di_tu_arr)) {
            return true;
        }

        //有一个拐点
        if (this.yige_guaidian_jiance(A, B, di_tu_arr)) {
            return true;
        }


        //有两个拐点
        if (this.liangge_guaidian_jiance(A, B, di_tu_arr)) {
            return true;
        }

        return false;
    }
    // update (dt) {},
});
