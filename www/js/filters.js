angular.module('roomscreening.filters', [])
  .filter('categoriesFilter', function(){
    return function(categories, roomId){
      if(categories == null || roomId == null){
        return [];
      }
      return categories.filter(function(category){
        return category.room_id == roomId;
      })
    }
  })
  .filter('itemFilter', function(){
    return function(items, roomId, categoryId){
      if(items == null || roomId == null || categoryId == null){
        return [];
      }
      return items.filter(function(item){
        return item.room_id == roomId && item.category_id == categoryId;
      })
    }
  })
  .filter('subitemFilter', function(){
    return function(items, roomId, categoryId, itemId){
      if(items == null || roomId == null || categoryId == null || itemId == null){
        return [];
      }
      return items.filter(function(item){
        return item.room_id == roomId && item.category_id == categoryId && item.item_id == itemId;
      })
    }
  })
;
