
/**
 * 获取购物车结算商品 - 请求参数
 */
declare interface OrderApi_GetSettleCart {
    cart_id: string;  //  购物车列表ID
    address_id?: number;    // 地址ID (用于算出运费)
}

/**
 * 获取结算商品 - 请求参数
 */
declare interface OrderApi_GetSettleGoods {
    goods_id: number; // 商品ID 
    goods_number: number; // 商品数量
    address_id?: number;    // 地址ID (用于算出运费)
}



/**
 * 获取结算商品 - 响应数据
 */
declare interface OrderApi_GetSettleResponse {
    "goods_list": {
        "goods_id": 1, //商品ID
        "goods_name": "红钐 按键寿命试验机 HSL-TA4 四工位", //商品名称
        "goods_code": "HSL-TA4",
        "shop_price": "200.00",
        "goods_img": string, //商品图片
        "goods_weight": "0.00",
        "unit": "台",
        "peas_num": 0,
        "peas_amount": "0",
        "stock": 8,
        "warn_number": 1,
        "goods_number": "2", //商品数量
        "id": 0, //记录ID
        "price": 192 //商品价格
    }[],
    "number": 2, //数量
    "total_price": 3624.96, //订单总金额
    "total_peas": 36, //该订单可用工游豆
    "user_peas": 2330, //当前用户工游豆
    "freight_price": 0, //运费
    matrixing_scale: number,     // 工游豆抵扣金额比例
    "coupon_list": {
        "id": 1, //记录ID
        "coupon_id": 11,
        "user_id": 1, //用户ID
        "is_status": 1,
        "add_time": 1680052037, //添加时间
        "start_time": "2023-03-29",
        "end_time": "2023-03-30",
        "is_use": 0,
        "coupon_draw_id": 1, //优惠券id（无传0）
        "coupon_name": "双十一优惠",
        "type": 2, //类型 1退货 2换货
        "par_value": "200.00",
        "is_threshold": 0,
        "lowest": 0,
        "goods_cat_id": 3,
        "cat_name": "按键寿命试验机"
    }[] //优惠券
}



/**
 * 提交订单 - 请求参数
 */
declare interface OrderApi_ConfirmSettle {
    is_peas: number;     // 是否使用工游豆 1是 0否      示例值:0
    goods_peas: number;     // 工游豆数量      示例值:0
    pay_type: 1 | 2;   // 支付类型1线上支付 2对公

    address_id: number;     // 地址ID      示例值:5
    coupon_draw_id: number;     // 优惠券id（无传0）      示例值:0
    remarks: string;     // 备注      示例值:测试平摊金额
    bill_status: number;     // 是否开票 0否 1是  以下字段=1是填      示例值:0
    type: string | 1 | 2 | 3;     // 发票类型 1：增值税专用发票，2：普通发票      示例值:
    header: string;     // 抬头      示例值:
    tax_no: string;     // 税号      示例值:
    enterprise_name: string;     // Text企业名称 
    enterprise_email: string;    // 是 Text企业邮箱

    logon_addr: string;  // 是 Text注册地址type=1填 
    logon_tel: string;  // 是 Text注册电话type=1填 
    bank: string; // 是 Text开户银行type=1填 
    bank_account: string; // 是 Text开户账号type=1填
    bill_address_id: number | ''; // 发票收货地址
}



/**
 * 提交订单 - 响应数据
 */
declare interface OrderApi_ConfirmSettleResponse {
    "main_order_no": "M20230419141058256483", //主订单号
    "meet_price": 0, //应付金额
    "status": 0 //是否需要支付 1是 0否
}


/**
 * 获取订单信息 - 响应数据
 */
declare interface OrderApi_GetInfoResponse {
    "order_id": 6, //订单ID
    "main_order_no": "M20230412102104894540", //主订单号
    "status": 0, //订单状态
    "user_id": 1, //用户id
    "total_price": "107.52", //总金额
    "total_number": 10, //总数量
    "pay_type": 0 | 1 | 2 | 3, //类型 1微信 2支付宝 3线下
    "pay_sn": "XS20230412103144876929", //支付流水号
    "pay_status": 0 | 1 | 2 | 3, //支付状态 0未支付 1已支付 2已取消 3已退款
    "pay_time": "2023-04-12 10:31:44", //支付时间
    "coupon_price": "0.00", //优惠金额
    "coupon_draw_id": 0, //优惠券id
    "cerate_time": "2023-04-12 10:21:04", //下单时间
    "deduct_peas": 0, //抵扣工游豆数量
    "give_peas": 0,
    "use_peas": 2,
    "freight_price": "0.00", //运费
    "user_discount": "0.96", //会员折扣率
    "pay_price": "0.00",
    "meet_price": "105.52", //实付金额
    "consignee_name": "小明", //发货
    "consignee_phone": "13177778888", //收件人手机号
    "province": "", //省份
    "city": "", //城市
    "area": "", //地区
    "address": "广东深圳光明云智科技园", //地址明细
    "salesman_id": 0, //经手人ID
    "remarks": "", //备注
    "bill_status": 0, //开票状态
    "logistics_id": 0, //配送方式 id
    "out_time": "", //发货时间
    "out_status": 0, //发货状态 0未发货 1已发货
    "logistics_no": "", //快递单号
    "env_type": "", //同步环境类型
    "is_delete": 0, //是否删除 0否 1是
    "is_refund": 0,
    "goods_list": {
        "main_order_no": "M20230412102104894540", //主订单号
        "order_no": "C20230412102104404443", //订单号
        "goods_id": 1, //商品id
        "price": "9.60", //价格
        "goods_number": 2, //数量
        "meet_price": "0.00", //实付金额
        "goods_name": "红钐 按键寿命试验机 HSL-TA4 四工位", //商品名称
        "goods_img": ""
    }[],
    order_status: number,    //订单状态 : 0:无， 1特支付，2待发货 ，3已发货 ，4配货中，5部分发货 ，6已确认 ，7已取消，8已退货 
    status_info: {
        "text": "提交订单",
        "time": "2023-05-26 15:14:43",
        "selected": 1
    }[],
    end_time?: number,  // 订单支付截止时间戳（秒级）只有对公转账时才有
    order_logistics: {
        "logistics_no": "110000",
        "create_time": "2023-06-27 09:34:11",
        "goods_name": "红钐 按键寿命试验机 HSL-TA4 四工位",
        "logistics_name": "顺丰物流"
    }[]
    peas_price: string, // 工游豆抵扣金额


    amount: '109.00',
    end_time: 1687657081,
    bank_info: {
        name: '深圳工游记集团有限公司12465646123',
        company_name: '深圳工游记集团有限公司12465646123',
        bank_account: '4564641454785385761234',
        bank_name: '深圳农商银行',
        bank_cnaps: '4564641454785385761234',
        notes: '55555',
        duty: '4564641454785385761234',
        phone: '15766875587',
        address: '广东省深圳市光明去一片光明',
        item_notes: string, // 注意事项
    },
    day_num: '15',
}


/**
 * 订单支付（选择微信支付返回数据） - 响应数据
 */
declare interface OrderApi_PayOrderWeChatResponse {
    "pay_type": 1,
    "code_url": "weixin://wxpay/bizpayurl?pr=p4lpSuKzz"
}


/**
 * 获取线下转账信息 - 响应数据
 */
declare interface OrderApi_PayOrderResponse {
    main_order_no: 'S20230610093801317546',
    amount: '109.00',
    end_time: 1687657081,
    bank_info: {
        name: '深圳工游记集团有限公司12465646123',
        company_name: '深圳工游记集团有限公司12465646123',
        bank_account: '4564641454785385761234',
        bank_name: '深圳农商银行',
        bank_cnaps: '4564641454785385761234',
        notes: '55555',
        duty: '4564641454785385761234',
        phone: '15766875587',
        address: '广东省深圳市光明去一片光明',
        item_notes: string, // 注意事项
    },
    day_num: '15',
}



declare interface OrderApi_GetPayTypeResponse {
    "id": 2, //记录ID
    "name": "支付宝", //支付名称
    "type": 1 | 2, //类型 1微信 2支付宝
    "ico_url": "i-ri-alipay-fill" //图片路径
}


/**
 * 获取订单列表 - 请求参数
 */
declare interface OrderApi_GetOrderList extends ListPage {
    status: number,  // 订单状态 0全部 1待支付 2待发货 3待确认 4已取消
    main_order_no: string // 订单号  M20230424090858907460
    pay_type: number | '';  // 支付类型 1微信 2支付宝 3线下
    consignee_name: string;  // 收件人名
    start_time: string;  // 下单开始时间  2023-04-01
    end_time: string // 下单结束时间  2023-04-14
}

/**
 * 获取订单列表 - 响应数据
 */
declare interface OrderApi_GetOrderListResponse extends ListTotal {
    "lists": OrderApi_GetOrderListItem[]


}

declare interface OrderApi_GetOrderListItem {
    "order_id": 17, //订单ID
    "main_order_no": "M20230424090858907460", //主订单号
    // "status": 0, //订单状态
    "user_id": 1, //用户id
    "total_price": "4199.04", //总金额
    "total_number": 6, //总数量
    "pay_type": 0, //类型 1微信 2支付宝 3线下
    "pay_sn": "", //支付流水号
    "pay_status": 0, //支付状态 0未支付 1已支付 2已取消 3已退款
    "pay_time": 0, //支付时间
    "coupon_price": "0.00", //优惠金额
    "coupon_draw_id": 0, //优惠券id
    "cerate_time": "2023-04-24 09:08:59", //下单时间
    "deduct_peas": 420, //抵扣工游豆数量
    "give_peas": 0,
    "use_peas": 3,
    "freight_price": "0.00", //运费
    "user_discount": "0.96", //会员折扣率
    "pay_price": "4196.04",
    "meet_price": "4196.04", //实付金额
    "consignee_name": "张三", //收件人
    "consignee_phone": "1388888888", //收件人手机号
    "province": "广东省", //省份
    "city": "深圳市", //城市
    "area": "光明区", //地区
    "address": "楼村75号", //地址明细
    "salesman_id": 0, //经手人ID
    "remarks": "测试平摊金额", //备注
    "bill_status": 0, //开票状态
    "logistics_id": 0, //配送方式 id
    "out_time": 0, //发货时间
    "out_status": 0, //发货状态 0未发货 1已发货
    "logistics_no": "", //快递单号
    "env_type": "", //同步环境类型
    "is_delete": 0, //是否删除 0否 1是
    "is_refund": 0,
    "goods_info": {
        "main_order_no": "M20230424090858907460", //主订单号
        "order_no": "C20230424090858560610", //订单号
        "goods_id": 1, //商品id
        "price": "192.00", //商品价格
        "goods_number": 2, //数量
        "meet_price": "191.86", //实付金额
        "goods_name": "红钐 按键寿命试验机 HSL-TA4 四工位", //商品名称
        "goods_img": string
    }[]
    "order_status": number //订单状态 ：待支付 1，待发货 2，已发货 3，配货中 4，部分发货 5，已确认 6，已取消 7
    end_time?: number,  // 订单支付截止时间戳（秒级）只有对公转账时才有
}


/**
 * 获取可退货商品列表 - 响应数据
 */
declare interface OrderReturnApi_GetListResponse {
    "id": number,       // 33
    "goods_id": number, // 1
    "goods_number": number,
    "meet_price": string,
    "goods_name": string,       // "红钐 按键寿命试验机 HSL-TA4 四工位"
    "goods_img": string,
    "goods_sn": string,     // "AA00001"
    main_order_no: string,   // 主订单号
    order_no: string;    // 商品订单号

    return_number?: number,  // 退换商品数量



}


/**
 * 退换货管理 -- 退货列表 - 响应数据
 */
declare interface OrderReturnApi_ReturnList extends ListTotal {
    "lists": {
        "id": 4, //记录ID
        "refund_no": "XS20230508142742302981", //退换单号
        "main_order_no": "M20230505143130386350", //订单号
        "describe": "退货", //问题描述
        "type": 1, //类型 1退货 2换货
        "status": 0, //订单状态 0全部 1待支付 2待发货 3待确认 4已取消
        "logistics_cusmoer": "", //物流公司
        "logistics_no": "", //快递单号
        "reply": "", //回复内容
        "user_id": 57, //用户ID
        "total_price": "455.00", //退货订单总金额
        "total_number": 2, //退货订单商品总数量
        "is_all": 1, //是否全退 1全部 2部分
        "add_time": "2023-05-08 14:27:42", //添加时间
        "meet_price": "455.00", //退款金额
        "meet_money": "455.00", //最终退款金额
        "admin_id": 0, //操作人id
        "refund_status": 0, //退款状态 0申请中 1已完成 2已取消
        "auto_id": 0, //退款操作人ID
        "auto_time": 0, //退款审核时间
        "success_time": 0, //退款成功时间
        "is_sycn": 0,
        "goods_list": {
            "id": 4, //记录ID
            "refund_no": "XS20230508142742302981", //退换单号
            "main_order_no": "",
            "goods_id": 1, //商品ID
            goods_sn: string,    // 商品编号
            "goods_number": 2, //商品数量
            "meet_price": "227.50", //商品实付金额
            "goods_name": "红钐 按键寿命试验机 HSL-TA4 四工位", //商品名称
            "goods_img": "" //商品图片
        }[]



    }[]

}

/**
 * 退换货管理 -- 添加退货 - 响应数据
 */
declare interface OrderReturnApi_Add {
    goods_info: string;//     商品信息 [{"goods_id":3,"price":"11.52","goods_number":4,"meet_price":"0.00"}]
    type: 1 | 2,// 类型 1退货 2换货
    describe: string, // 问题描述
    main_order_no: string,// 订单号    M20230412102104894540
    img_url: string,// 上传图片
    reason_id: number,//退换理由ID
}

/**
 * 退换货管理 -- 退货详情 - 响应数据
 */
declare interface OrderReturnApi_InfoResponse {
    "refund_info": {
        "id": 4, //记录ID
        "refund_no": "XS20230508142742302981", //退换单号
        "main_order_no": "M20230505143130386350", //订单号
        "describe": "退货", //问题描述
        "type": 1, //类型 1退货 2换货
        "status": 0 | 1 | 2 | 3 | 4 | 5 | 6, //状态 0售后正在审核 1审核通过待处理 2审核未通过 3要求售后寄回 4快递已寄回 5快递已寄出 6售后完成
        "logistics_cusmoer": "", //物流公司
        "logistics_no": "", //快递单号
        "reply": "", //回复内容
        "user_id": 57, //用户ID
        "total_price": "455.00", //订单总金额
        "total_number": 2, //退货订单商品总数量
        "is_all": 1, //是否全退 1全部 2部分
        "add_time": "2023-05-08 14:27:42", //添加时间
        "meet_price": "455.00", //实付单价
        "meet_money": "455.00", //最终退款金额
        "admin_id": 0, //操作人id
        "refund_status": 0 | 1 | 2, //退货状态 //退款状态 0申请中 1已完成 2已取消
        "auto_id": 0, //退款操作人ID
        "auto_time": 0, //退款审核时间
        "success_time": 0 //退款成功时间
        "reason_id": number, //退换理由ID
        "reason_name": string //退换理由
    },
    "goods_list": {
        "id": 4, //记录ID
        "refund_no": "XS20230508142742302981", //退换单号
        "goods_id": 1, //商品ID
        "goods_number": 2, //商品数量
        "meet_price": "227.50", //实付金额
        "goods_name": "红钐 按键寿命试验机 HSL-TA4 四工位", //商品名称
        "goods_img": "" //商品图片
        goods_sn: string
    }[],
    "refund_log": {
        "content": "操作备注：会员发起了退货/退款:退货", //信息
        "img_url": "", //上传图片
        "create_time": "2023-05-08 14:27:42", //操作时间
        "user_id": 57, //用户ID
        "author": "会员" //操作者
    }[],
    flow_path: { // 退换步骤
        "title": "提交申请",
        "item": "2023-05-08 14:27:42",
        "selected": 1
    }[],
}


/**
 * 退换货管理 -- 补充问题、快递信息 - 请求参数
 */
declare interface OrderReturnApi_Fill {
    refund_no: string;   // 退货编号
    refund_type: 1 | 2;    // 填写类型 1补充问题 2添加快递
    describe: string;    // 问题描述
    img_url: string; // 图片路径
    logistics_cusmoer?: string;   // 快递名称
    logistics_no?: string;    // 快递单号
}

/**
 * 退换货管理 -- 理由 响应数据
 */
declare interface OrderReturnApi_reasonResponse {
    "lists": {
        "id": number,
        "reason_name": string,
    }[],
    "total": number,
}








/**
 * 获取订单详情信息
 */

declare interface OrderDetailInfoData {
    info: OrderApi_GetInfoResponse,      // 订单信息
    // pay?: OrderApi_PayOrderResponse,          // 支付信息(线下支付)
    code?: number,
    msg?: string,
}



/**
 * 订单发票列表 - 请求参数
 */
declare interface OrderInvoiceApi_GetList extends ListPage {

}


/**
 * 订单发票列表 - 响应数据
 */
declare interface OrderInvoiceApi_GetListResponse extends ListTotal {
    lists: OrderInvoiceApi_GetListItem[]
}

declare interface OrderInvoiceApi_GetListItem {
    "bill_id": 1,
    "type": 1 | 2 | 3,
    "header": "工业品",
    "enterprise_name": "八戒公司123",
    "enterprise_email": "123456@qq.com",
    "tax_no": "",
    "logon_addr": "",
    "logon_tel": "",
    "bank": "",
    "bank_account": "",
    "verify_status": 0 | 1 | 2 | 3,
    "express_name": "顺丰",
    "express_no": "sf123456789",
    "failed_remark": "",
    "order_no": "",
    "add_time": 1685688353,
    "address_id": 21,
    "bill_address": {
        "address_id": 21,
        "contacts": "张三",
        "phone": "18080080080",
        "email": "1@123.com",
        "province": "广西壮族自治区",
        "city": "南宁市",
        "area": "兴宁区",
        "address": "云志科园",
        "is_default": 1,
        "is_bill_address": 1
    }
}


/**
 * 订单发票列表 - 发票申请 - 请求参数
 */
declare interface OrderInvoiceApi_Add {
    order_no: string;    // 申请发票的订单号    M20230505143130386350
    address_id: number;  // 收票地址id
    type: number;    // 类型 1：增值税专用发票，2：普通发票， 3：电子普通发票
    enterprise_name: string; // 企业名称
    enterprise_email: string;    // 企业邮箱 123456@qq.com
    tax_no: string;  // 纳税人识别号（普票可填，增票必填）
    logon_addr?: string; // 注册地址（增票必填）深圳市光明区云智科技园18楼
    logon_tel?: string;   // 注册电话（增票必填）    0755 - 1234567
    bank?: string;    // 开户银行（增票必填）    工商银行
    bank_account?: string;    // 开户账户（增票必填）    888877779999
}


/**
 * 订单发票列表 - 发票修改 - 请求参数
 */
declare interface OrderInvoiceApi_Edit extends OrderInvoiceApi_Add {
    bill_id: number; //  发票id
}


















// 我的订单 - table数据类型
declare interface OrderListTableData extends OrderApi_GetOrderListItem {
    index: number; // 序列号
    // order_info: OrderApi_GetOrderListResponse["lists"][0]; // 订单信息（下单时间排序）	
    // order_mount: number;//订单金额	
    // consignee_info: any; //收货人信息	
    // 物流/支付信息	
    // status: number; // 订单状态	
}

// 订单操作按钮props传值
declare interface OrderOperatePropsData {
    order_no: string; //订单号
    status: number; // 订单状态
    is_return: 0 | 1   // 是否已退货过
    bill_status: 0 | 1,    // 是否开票
}


// 订单退换货onOpenDialog传值
declare interface OrderReturnOpen {
    // row?: OrderReturnApi_ReturnList['lists'][0],  // 退货记录信息
    order_no: string, // 订单编号
}





