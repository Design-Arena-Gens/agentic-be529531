'use client';

import { useEffect, useState } from 'react';
import { store, Recipe, MenuItem, InventoryItem } from '@/lib/store';
import { Plus, Save, X } from 'lucide-react';

export default function RecipeManagement() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('');
  const [ingredientsList, setIngredientsList] = useState<{ inventoryItemId: string; quantity: number }[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setRecipes(store.getRecipes());
    setMenuItems(store.getMenuItems());
    setInventory(store.getInventory());
  }, []);

  const handleAddIngredient = () => {
    setIngredientsList([...ingredientsList, { inventoryItemId: '', quantity: 0 }]);
  };

  const handleUpdateIngredient = (index: number, field: 'inventoryItemId' | 'quantity', value: string | number) => {
    const updated = [...ingredientsList];
    if (field === 'inventoryItemId') {
      updated[index].inventoryItemId = value as string;
    } else {
      updated[index].quantity = parseFloat(value as string) || 0;
    }
    setIngredientsList(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientsList(ingredientsList.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = () => {
    if (!selectedMenuItem || ingredientsList.length === 0) return;

    const existingRecipe = recipes.find(r => r.menuItemId === selectedMenuItem);

    if (existingRecipe) {
      store.updateRecipe(existingRecipe.id, {
        ingredients: ingredientsList.filter(ing => ing.inventoryItemId && ing.quantity > 0),
      });
    } else {
      store.addRecipe({
        menuItemId: selectedMenuItem,
        ingredients: ingredientsList.filter(ing => ing.inventoryItemId && ing.quantity > 0),
      });
    }

    setRecipes(store.getRecipes());
    setSelectedMenuItem('');
    setIngredientsList([]);
    setIsEditing(false);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedMenuItem(recipe.menuItemId);
    setIngredientsList(recipe.ingredients);
    setIsEditing(true);
  };

  const getMenuItemName = (menuItemId: string) => {
    return menuItems.find(item => item.id === menuItemId)?.name || 'Unknown';
  };

  const getInventoryItemName = (inventoryItemId: string) => {
    return inventory.find(item => item.id === inventoryItemId)?.name || 'Unknown';
  };

  const getInventoryUnit = (inventoryItemId: string) => {
    return inventory.find(item => item.id === inventoryItemId)?.unit || '';
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
        <p className="text-gray-500 mt-1">Define ingredient requirements for menu items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isEditing ? 'Edit Recipe' : 'Create Recipe'}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Menu Item</label>
            <select
              value={selectedMenuItem}
              onChange={(e) => setSelectedMenuItem(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            >
              <option value="">Select a menu item</option>
              {menuItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Ingredients</label>
              <button
                onClick={handleAddIngredient}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                Add Ingredient
              </button>
            </div>

            <div className="space-y-3">
              {ingredientsList.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={ingredient.inventoryItemId}
                    onChange={(e) => handleUpdateIngredient(index, 'inventoryItemId', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
                  >
                    <option value="">Select ingredient</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.unit})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={ingredient.quantity}
                    onChange={(e) => handleUpdateIngredient(index, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}

              {ingredientsList.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No ingredients added yet
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {isEditing && (
              <button
                onClick={() => {
                  setSelectedMenuItem('');
                  setIngredientsList([]);
                  setIsEditing(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSaveRecipe}
              disabled={!selectedMenuItem || ingredientsList.length === 0}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Recipe
            </button>
          </div>
        </div>

        {/* Recipes List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Recipes</h2>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {recipes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No recipes created yet
              </p>
            ) : (
              recipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-600 transition-colors cursor-pointer"
                  onClick={() => handleEditRecipe(recipe)}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {getMenuItemName(recipe.menuItemId)}
                  </h3>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">Ingredients:</p>
                    {recipe.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-gray-700">
                        <span>{getInventoryItemName(ing.inventoryItemId)}</span>
                        <span className="font-medium">
                          {ing.quantity} {getInventoryUnit(ing.inventoryItemId)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipe Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Recipes</p>
            <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Menu Items</p>
            <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Inventory Items</p>
            <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
