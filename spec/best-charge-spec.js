describe('Take out food', function () {

  it('should show id, name, price， count and total price for selected items（获取购买商品的信息）', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let item_info = get_items_info(inputs);
    let expected = [{
      id: 'ITEM0001',
      name: '黄焖鸡',
      price: 18.00,
      count: 1,
      total: 18.00
    }, {
      id: 'ITEM0013',
      name: '肉夹馍',
      price: 6.00,
      count: 2,
      total: 12.00
    }, {
      id: 'ITEM0022',
      name: '凉皮',
      price: 8.00,
      count: 1,
      total: 8.00
    }];
    expect(item_info).toEqual(expected)
  });

  it('should get discount info after 满30减6', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 3", "ITEM0022 x 1"];
    let item_info = get_items_info(inputs);
    let discount = get_cost_for_30_reduce_6(item_info);
    let expected = {
      cannot_use: false,
      discount_info: '满30减6元',
      origin: 44.00,
      reduce: 6.00,
      total: 38.00
    };
    expect(discount).toEqual(expected)
  });

  it('should get discount info after 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 3", "ITEM0022 x 1"];
    let item_info = get_items_info(inputs);
    let discount = get_cost_for_half(item_info);
    let expected = {
      cannot_use: false,
      discount_info: '指定菜品半价(黄焖鸡，凉皮)',
      origin: 44.00,
      reduce: 13.00,
      total: 31.00
    };
    expect(discount).toEqual(expected)
  });
  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim();
    expect(summary).toEqual(expected)
  });

});
