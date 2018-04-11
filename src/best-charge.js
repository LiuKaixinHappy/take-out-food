function get_items_info(selectedItems) {
  let bought_item_ids = selectedItems.map(item => item.split(' x ')[0]);
  let bought_item_counts = selectedItems.map(item => parseInt(item.split(' x ')[1]));

  let bought_items_info = loadAllItems().filter(item => bought_item_ids.filter(x => x === item['id']).length !== 0);
  return bought_items_info.map((item, index) => {
    let new_item = {};
    new_item['id'] = item['id'];
    new_item['name'] = item['name'];
    new_item['price'] = item['price'];
    new_item['count'] = bought_item_counts[index];
    new_item['total'] = new_item['price'] * new_item['count'];
    return new_item;
  });
}

function get_cost_for_30_reduce_6(bought_items_info) {
  let origin_total_prices = bought_items_info.map(item => item['total']).reduce((total, current) => {
    return total + current;
  });
  if (origin_total_prices < 30) {
    return {
      'cannot_use': true, 'discount_info': '满30减6元', 'origin': origin_total_prices, 'reduce': 0,
      'total': origin_total_prices
    };
  } else {
    let reduce = Math.floor(origin_total_prices / 30) * 6;
    let total = origin_total_prices - reduce;
    return {
      'cannot_use': false, 'discount_info': '满30减6元', 'origin': origin_total_prices, 'reduce': reduce,
      'total': total
    };
  }
}

function get_cost_for_half(bought_items_info) {
  let discount_items = loadPromotions()[1]['items'];

  let discount_items_info = bought_items_info.filter(item => discount_items.filter(x => x === item['id']).length !== 0);
  let origin_total_prices = bought_items_info.map(item => item['total']).reduce((total, current) => {
    return total + current;
  });
  if (discount_items_info.length === 0) {
    return {
      'cannot_use': true, 'discount_info': '指定菜品半价', 'origin': origin_total_prices, 'reduce': 0,
      'total': origin_total_prices
    };
  } else {
    let reduce = discount_items_info.map(item => item['total']).reduce((total, current) =>{
      return total + current;
    }) / 2;
    let total = origin_total_prices - reduce;
    let discount_item_name = discount_items_info.map(item => item['name']);
    let discount_info = '指定菜品半价(' + discount_item_name.join('，') + ')';
    return {
      'cannot_use': false, 'discount_info': discount_info, 'origin': origin_total_prices, 'reduce': reduce,
      'total': total
    };
  }
}

function normal_ticket(bought_items_info) {
  let bought_info = [];
  for (let i = 0; i < bought_items_info.length; i++) {
    bought_info.push(bought_items_info[i]['name'] + ' x '
      + bought_items_info[i]['count'] + ' = '
      + bought_items_info[i]['total'] + '元\n');
  }
  return '============= 订餐明细 =============\n'
    + bought_info.join('')
    + '-----------------------------------\n'
    + '总计：'
    + bought_items_info.map(item => item['total']).reduce((total, current) => {return total + current})
    + '元\n'
    + '===================================';
}

function discount_ticket(bought_items_info, discount) {
  let bought_info = [];
  for (let i = 0; i < bought_items_info.length; i++) {
    bought_info.push(bought_items_info[i]['name'] + ' x '
      + bought_items_info[i]['count'] + ' = '
      + bought_items_info[i]['total'] + '元\n');
  }
  return '============= 订餐明细 =============\n'
    + bought_info.join('')
    + '-----------------------------------\n'
    + '使用优惠:\n'
    + discount['discount_info']
    + '，省'
    + discount['reduce']
    + '元\n'
    + '-----------------------------------\n'
    + '总计：'
    + discount['total']
    + '元\n'
    + '===================================';
}

function bestCharge(selectedItems) {
  let bought_items_info = get_items_info(selectedItems);

  let result_for_30_reduce_6 = get_cost_for_30_reduce_6(bought_items_info);

  let result_for_half = get_cost_for_half(bought_items_info);

  if (result_for_30_reduce_6['cannot_use'] && result_for_half['cannot_use']) {
    return normal_ticket(bought_items_info);
  } else if (result_for_30_reduce_6['reduce'] >= result_for_half['reduce']) {
    return discount_ticket(bought_items_info, result_for_30_reduce_6);
  } else {
    return discount_ticket(bought_items_info, result_for_half);
  }
}
