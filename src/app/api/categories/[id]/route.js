import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";


export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const category = await Category.findOne({ id: parseInt(id) }).lean();
        
        if (!category) {
          return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const category = await Category.findOneAndUpdate(
          { id: parseInt(id) }, 
          req.body, 
          {
            new: true,
            runValidators: true,
          }
        );

        if (!category) {
          return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedCategory = await Category.deleteOne({ id: parseInt(id) });

        if (!deletedCategory.deletedCount) {
          return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' });
      break;
  }
}