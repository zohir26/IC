import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

export default async function handler(req, res) {
  const {
    query: { categoryId },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { limit = 10, sortBy = 'popularity' } = req.query;
        
        const category = await Category.findOne(
          { id: parseInt(categoryId) },
          { popularParts: 1, name: 1 }
        ).lean();
        
        if (!category) {
          return res.status(404).json({ success: false, message: 'Category not found' });
        }

        let popularParts = category.popularParts || [];
        
        // Sort by popularity (descending) or other criteria
        if (sortBy === 'popularity') {
          popularParts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        } else if (sortBy === 'price') {
          popularParts.sort((a, b) => {
            const priceA = parseFloat(a.price.replace('$', ''));
            const priceB = parseFloat(b.price.replace('$', ''));
            return priceA - priceB;
          });
        }

        // Apply limit
        popularParts = popularParts.slice(0, parseInt(limit));

        res.status(200).json({ 
          success: true, 
          data: {
            categoryName: category.name,
            parts: popularParts,
            total: category.popularParts?.length || 0
          }
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' });
      break;
  }
}