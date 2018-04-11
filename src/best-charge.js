function get_items_info(selectedItems) {
  let bought_item_ids = selectedItems.map(item => item.split(' x ')[0]);
  let bought_item_counts = selectedItems.map(item => parseInt(item.split(' x ')[1]));

  function item_is_bought(item) {
    for (let id of bought_item_ids) {
      if (item['id'] === id) {
        return true;
      }
    }
    return false;
  }

  let bought_items_info = loadAllItems().filter(item => item_is_bought(item));
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
  return undefined;
}

function normal_ticket() {

}

function discount_ticket(result_for_30_reduce_6) {


}

function bestCharge(selectedItems) {
  let bought_items_info = get_items_info(selectedItems);

  let result_for_30_reduce_6 = get_cost_for_30_reduce_6(bought_items_info);

  let result_for_half = get_cost_for_half(bought_items_info);

  if (result_for_30_reduce_6['cannot_use'] && result_for_half['cannot_use']) {
    return normal_ticket();
  } else if (result_for_30_reduce_6['reduce'] >= result_for_half['reduce']) {
    return discount_ticket(result_for_30_reduce_6);
  } else {
    return discount_ticket(result_for_half);
  }
}
