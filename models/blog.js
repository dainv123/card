import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    trend: String,
    introduction: String,
    content: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

blogSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    let baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    let slug = baseSlug;
    let counter = 1;
    while (
      await mongoose.model('Blog').findOne({
        slug,
        _id: { $ne: this._id }
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  this.updatedAt = Date.now();

  next();
});
const Blog = model('Blog', blogSchema);

export default Blog;
