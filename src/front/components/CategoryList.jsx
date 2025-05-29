import React from 'react';
import CategoryItem from './CategoryItem';

const CategoryList = ({
    categories,
    expandedCategories,
    processesData,
    onToggleExpansion,
    onDeleteCategory,
}) => {
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <div className="list-group">
            {categories.map((category) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    isExpanded={expandedCategories.has(category.id)}
                    processesDataForCategory={processesData[category.id]}
                    onToggleExpansion={onToggleExpansion}
                    onDeleteCategory={onDeleteCategory}
                />
            ))}
        </div>
    );
};

export default CategoryList;