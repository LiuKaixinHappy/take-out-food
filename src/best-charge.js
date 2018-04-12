function get_items_info(selected_items) {
  let bought_item_ids = selected_items.map(item => item.split(' x ')[0]);
  let bought_item_counts = selected_items.map(item => parseInt(item.split(' x ')[1]));

  let bought_items_info = loadAllItems()
    .filter(item => bought_item_ids.filter(x => x === item['id']).length !== 0);
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

function get_origin_total_prices(bought_items_info) {
  return bought_items_info
    .map(item => item['total']).reduce((total, current) => {
      return total + current;
    });
}

function get_discount_items_info(type, bought_items_info) {
  let promotions = loadPromotions();
  let discount_items;
  for (let promotion of promotions) {
    if (promotion['type'] === type) {
      discount_items = promotion['items'];
      break;
    }
  }
  return discount_items === undefined ? [] : bought_items_info
    .filter(item => discount_items.filter(x => x === item['id']).length !== 0);
}

function get_cost_for_30_reduce_6(bought_items_info) {
  let origin_total_prices = get_origin_total_prices(bought_items_info);
  let discount_info = '满30减6元';
  let reduce = Math.floor(origin_total_prices / 30) * 6;
  let total = origin_total_prices - reduce;
  return {
    'discount_info': discount_info,
    'origin': origin_total_prices,
    'reduce': reduce,
    'total': total
  };
}

function get_cost_for_half(bought_items_info) {
  let origin_total_prices = get_origin_total_prices(bought_items_info);
  let discount_items_info = get_discount_items_info('指定菜品半价', bought_items_info);
  let reduce = discount_items_info.length === 0 ? 0 : discount_items_info
    .map(item => item['total']).reduce((total, current) => {
      return total + current;
    }) / 2;

  let discount_info = discount_items_info.length === 0 ? '指定菜品半价' :
    '指定菜品半价(' + discount_items_info.map(item => item['name']).join('，') + ')';

  let total = origin_total_prices - reduce;
  return {
    'discount_info': discount_info,
    'origin': origin_total_prices,
    'reduce': reduce,
    'total': total
  };
}

function ticket(bought_items_info, discount) {
  let bought_info = [];
  for (let i = 0; i < bought_items_info.length; i++) {
    bought_info.push(bought_items_info[i]['name'] + ' x '
      + bought_items_info[i]['count'] + ' = '
      + bought_items_info[i]['total'] + '元\n');
  }
  let header =
    '============= 订餐明细 =============\n'
    + bought_info.join('')
    + '-----------------------------------\n';

  let discount_info = discount['reduce'] === 0 ?
    ''
    :
    '使用优惠:\n'
    + discount['discount_info']
    + '，省'
    + discount['reduce']
    + '元\n'
    + '-----------------------------------\n';

  let total = discount['reduce'] === 0 ?
    '总计：'
    + bought_items_info.map(item => item['total']).reduce((total, current) => {
      return total + current
    }) + '元\n' + '==================================='
    :
    '总计：'
    + discount['total']
    + '元\n'
    + '===================================';

  return header + discount_info + total;
}

function bestCharge(selected_items) {
  let bought_items_info = get_items_info(selected_items);

  let result_for_30_reduce_6 = get_cost_for_30_reduce_6(bought_items_info);
  let result_for_half = get_cost_for_half(bought_items_info);

  if (result_for_30_reduce_6['reduce'] >= result_for_half['reduce']) {
    return ticket(bought_items_info, result_for_30_reduce_6);
  } else {
    return ticket(bought_items_info, result_for_half);
  }
}
