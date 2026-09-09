import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoriesView: React.FC = () => {
  const { categories, products, setSelectedCategorySlug, setCurrentView } = useStore();

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Departments
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1 tracking-tight">
            Explore All Categories
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Discover our complete product catalog spanning fashion, technology, accessories, kitchen, and fragrances, with cash on delivery across Pakistan.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className="group cursor-pointer rounded-3xl bg-white border border-stone-200/90 hover:border-emerald-700/60 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                    <span className="bg-white/90 backdrop-blur-xs text-stone-900 font-bold text-xs px-3 py-1 rounded-full shadow-xs">
                      {count} Products Available
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
                    <span>Shop {cat.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
