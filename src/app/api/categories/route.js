import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { search, limit, page = 1 } = req.query;
        let query = {};
        
        // Add search functionality
        if (search) {
          query = {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { 'subcategories.name': { $regex: search, $options: 'i' } },
              { 'details.description': { $regex: search, $options: 'i' } }
            ]
          };
        }

        let categoriesQuery = Category.find(query).sort({ id: 1 });
        
        // Add pagination if limit is provided
        if (limit) {
          const limitNum = parseInt(limit);
          const skip = (parseInt(page) - 1) * limitNum;
          categoriesQuery = categoriesQuery.skip(skip).limit(limitNum);
        }

        const categories = await categoriesQuery.lean();
        
        // Get total count for pagination
        const totalCount = await Category.countDocuments(query);
        
        res.status(200).json({
          success: true,
          data: categories,
          pagination: limit ? {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            pages: Math.ceil(totalCount / parseInt(limit))
          } : null
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' });
      break;
  }
}